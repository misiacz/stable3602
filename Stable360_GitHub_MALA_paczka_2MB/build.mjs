import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Restore the complete static site from a compact upload with no dependencies.
const root = dirname(fileURLToPath(import.meta.url));
const parts = ["site.bundle.001", "site.bundle.002", "site.bundle.003", "site.bundle.004", "site.bundle.005", "site.bundle.006", "site.bundle.007", "site.bundle.008", "site.bundle.009", "site.bundle.010", "site.bundle.011", "site.bundle.012", "site.bundle.013", "site.bundle.014"];
const archive = Buffer.concat(parts.map(name => readFileSync(resolve(root, name))));
const digest = data => createHash('sha256').update(data).digest('hex');
if (digest(archive) !== 'ae598ed1f5085f8a7492a64233de689278cbab68807f8b247eb2b617544fa2c6') throw new Error('Site archive integrity check failed.');
const manifest = JSON.parse(gunzipSync(archive).toString('utf8'));
if (manifest.format !== 'stable360-static-v1' || !Array.isArray(manifest.files) || manifest.fileCount !== manifest.files.length) {
  throw new Error('Unsupported or incomplete site archive.');
}
const output = resolve(root, 'public');
const seen = new Set();
// Validate the complete manifest before replacing generated build output.
for (const file of manifest.files) {
  if (typeof file.path !== 'string' || file.path.startsWith('/') || file.path.includes('\\') || file.path.includes('\0')) throw new Error('Invalid site path.');
  const target = resolve(output, file.path);
  if (!target.startsWith(output + sep) || file.path.split('/').some(part => !part || part === '.' || part === '..') || seen.has(file.path)) throw new Error('Unsafe or duplicate site path.');
  seen.add(file.path);
  if (typeof file.data !== 'string' || !Number.isSafeInteger(file.size) || typeof file.sha256 !== 'string') throw new Error('Invalid site entry.');
}
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
for (const file of manifest.files) {
  const content = Buffer.from(file.data, 'base64');
  if (content.length !== file.size || digest(content) !== file.sha256) throw new Error('Invalid file: ' + file.path);
  const target = resolve(output, file.path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}
console.log('Stable360 ready: ' + manifest.fileCount + ' static files restored to public/.');
