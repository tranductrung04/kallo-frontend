const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const clampProgress = (value) => Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
assert.equal(clampProgress(-1), 0);
assert.equal(clampProgress(0.5), 0.5);
assert.equal(clampProgress(2), 1);
assert.equal(clampProgress(Number.NaN), 0);

const root = path.resolve(__dirname, '..');
const assetRegistry = fs.readFileSync(path.join(root, 'src', 'assets', 'images', 'index.ts'), 'utf8');
for (const asset of assetRegistry.matchAll(/require\('\.\.\/\.\.\/\.\.\/res\/([^']+)'\)/g)) {
  assert.ok(fs.existsSync(path.join(root, 'res', asset[1])), `Missing asset: ${asset[1]}`);
}
console.log('Phase 1 self-check passed');
