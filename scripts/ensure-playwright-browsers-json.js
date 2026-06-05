const fs = require('fs');
const path = require('path');

try {
  const pkg = require.resolve('playwright-core/package.json');
  const dir = path.dirname(pkg);
  const browsersJsonPath = path.join(dir, 'browsers.json');

  if (!fs.existsSync(browsersJsonPath)) {
    const minimal = {
      browsers: []
    };
    fs.writeFileSync(browsersJsonPath, JSON.stringify(minimal, null, 2), 'utf8');
    console.log('[postinstall] Wrote minimal playwright-core/browsers.json');
  } else {
    console.log('[postinstall] playwright-core/browsers.json already exists');
  }
} catch (err) {
  console.warn('[postinstall] ensure-playwright-browsers-json failed:', err && err.message);
}
