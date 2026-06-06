import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Browser, BrowserContext } from 'playwright-core';
import { error, log } from './logger';
import { getChromiumArgs, getChromiumExecutablePath } from './playwright-chromium';

declare global {
  // eslint-disable-next-line no-var
  var __storyBrowserPool: BrowserPool | undefined;
}

const MAX_CONTEXTS = Math.max(1, Number(process.env.STORY_BROWSER_POOL_SIZE || '2'));
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

let playwrightCore: any = null;
let chromiumPkg: any = null;
let playwrightBrowsersJsonEnsured = false;

async function ensurePlaywrightBrowsersJson() {
  if (playwrightBrowsersJsonEnsured) {
    return;
  }

  try {
    const require = createRequire(import.meta.url);
    const playwrightPackageJson = require.resolve('playwright-core/package.json');
    const browsersJsonPath = path.join(path.dirname(playwrightPackageJson), 'browsers.json');
    await readFile(browsersJsonPath, 'utf8');
  } catch {
    // ignore missing browsers.json; Playwright will throw if it cannot start.
  }

  playwrightBrowsersJsonEnsured = true;
}

class BrowserPool {
  private browser: Browser | null = null;
  private activeContexts = 0;
  private pending: Array<() => void> = [];

  private waitForSlot(): Promise<void> {
    if (this.activeContexts < MAX_CONTEXTS) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.pending.push(resolve);
    });
  }

  private processPending(): void {
    if (this.activeContexts >= MAX_CONTEXTS) {
      return;
    }

    const nextResolve = this.pending.shift();
    if (nextResolve) {
      nextResolve();
    }
  }

  private async ensureBrowser(): Promise<Browser> {
    if (this.browser && this.browser.isConnected?.()) {
      return this.browser;
    }

    await this.restartBrowser();

    if (!this.browser) {
      throw new Error('[PLAYWRIGHT] Unable to initialize browser pool.');
    }

    return this.browser;
  }

  private async restartBrowser(): Promise<void> {
    if (this.browser) {
      try {
        await this.browser.close();
      } catch (err) {
        error('PLAYWRIGHT', 'Error closing browser during restart', err);
      }
    }

    try {
      await ensurePlaywrightBrowsersJson();
      if (!playwrightCore) {
        playwrightCore = await import('playwright-core');
      }

      this.browser = await playwrightCore.chromium.launch({
        args: await getChromiumArgs(),
        executablePath: await getChromiumExecutablePath(),
        headless: true,
      });
      log('PLAYWRIGHT', 'Playwright browser started for story extraction', {
        maxContexts: MAX_CONTEXTS,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      error('PLAYWRIGHT', 'Failed to launch Playwright browser', message);
      this.browser = null;
      throw new Error(`[PLAYWRIGHT_UNAVAILABLE] ${message}`);
    }
  }

  async acquireContext(): Promise<BrowserContext> {
    await this.waitForSlot();
    const browser = await this.ensureBrowser();

    try {
      const context = await browser.newContext({
        userAgent: USER_AGENT,
        locale: 'en-US',
        viewport: { width: 1280, height: 720 },
      });

      this.activeContexts += 1;
      log('PLAYWRIGHT', 'Acquired browser context', {
        activeContexts: this.activeContexts,
      });

      return context;
    } catch (err) {
      error('PLAYWRIGHT', 'Failed to create browser context, restarting browser', err);
      await this.restartBrowser();
      return this.acquireContext();
    }
  }

  async releaseContext(context: BrowserContext): Promise<void> {
    try {
      await context.close();
    } catch (err) {
      error('PLAYWRIGHT', 'Failed to close browser context cleanly', err);
    } finally {
      this.activeContexts = Math.max(0, this.activeContexts - 1);
      this.processPending();
    }
  }
}

export const browserPool = globalThis.__storyBrowserPool ?? new BrowserPool();
if (!globalThis.__storyBrowserPool) {
  globalThis.__storyBrowserPool = browserPool;
}
