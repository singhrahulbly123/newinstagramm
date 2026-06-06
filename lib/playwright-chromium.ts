import { createRequire } from 'node:module';
import { access, copyFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

let chromiumPkg: any = null;
let chromiumExecutablePathCache: string | null = null;
let playwrightBrowsersJsonEnsured = false;

async function loadChromiumPackage() {
  if (chromiumPkg) {
    return chromiumPkg;
  }

  const module = await import('@sparticuz/chromium');
  chromiumPkg = module.default ?? module;
  return chromiumPkg;
}

async function ensurePlaywrightBrowsersJson() {
  if (playwrightBrowsersJsonEnsured) {
    return;
  }

  try {
    const require = createRequire(import.meta.url);
    const playwrightPackageJson = require.resolve('playwright-core/package.json');
    const browsersJsonPath = path.join(path.dirname(playwrightPackageJson), 'browsers.json');
    try {
      await access(browsersJsonPath);
    } catch {
      const minimal = JSON.stringify({ browsers: [] }, null, 2);
      await writeFile(browsersJsonPath, minimal, 'utf8');
    }
  } catch {
    // ignore; if this fails, the runtime may still be able to load a bundled browser helper.
  }

  playwrightBrowsersJsonEnsured = true;
}

async function validateWindowsExecutable(executablePath: string): Promise<string> {
  if (process.platform !== 'win32') {
    return executablePath;
  }

  const candidate = `${executablePath}.exe`;
  try {
    await access(candidate);
    return candidate;
  } catch {
    // ignore
  }

  if (chromiumExecutablePathCache) {
    return chromiumExecutablePathCache;
  }

  const target = path.join(os.tmpdir(), `${path.basename(executablePath)}.exe`);
  try {
    await access(target);
    chromiumExecutablePathCache = target;
    return target;
  } catch {
    // copy if permitted
  }

  await copyFile(executablePath, target);
  chromiumExecutablePathCache = target;
  return target;
}

export async function getChromiumArgs(): Promise<string[]> {
  const pkg = await loadChromiumPackage();
  return pkg.args ?? [];
}

export async function getChromiumExecutablePath(): Promise<string> {
  const pkg = await loadChromiumPackage();
  const exePath = await pkg.executablePath();
  return validateWindowsExecutable(exePath);
}

export async function ensurePlaywrightBrowsersJsonFile(): Promise<void> {
  await ensurePlaywrightBrowsersJson();
}
