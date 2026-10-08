import fs from 'fs';
import path from 'path';

const root = process.cwd();
const required = [
  'src/App.jsx',
  'src/main.jsx',
  'src/routes/AppRoutes.jsx',
  'src/context/AuthContext.jsx',
  'src/context/LanguageContext.jsx',
  'src/components/common/NotificationCenter.jsx',
  'server/src/server.js',
  'server/src/models.js',
  'server/src/email.js',
  'server/package.json',
  '.env.example',
  'server/.env.example'
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const jsx = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', 'dist', '.git'].includes(entry.name)) walk(full);
    if (entry.isFile() && full.endsWith('.jsx')) jsx.push(full);
  }
}
walk(path.join(root, 'src'));
const badImports = jsx.filter((file) => {
  const content = fs.readFileSync(file, 'utf8');
  return !content.startsWith('import React from "react";');
});

const secretFiles = [];
const placeholderFiles = [];
for (const file of ['.env', 'server/.env']) {
  const full = path.join(root, file);
  if (fs.existsSync(full)) {
    const content = fs.readFileSync(full, 'utf8');
    const hasRealSecret = /(?:sk_live_|rk_live_|re_[A-Za-z0-9_-]{20,}|whsec_[A-Za-z0-9_-]{20,})/.test(content);
    if (hasRealSecret) secretFiles.push(file);
    else placeholderFiles.push(file);
  }
}

console.log(`Required files: ${required.length - missing.length}/${required.length}`);
console.log(`JSX files: ${jsx.length}`);
console.log(`JSX import check: ${jsx.length - badImports.length}/${jsx.length}`);
console.log(`Environment files: ${placeholderFiles.length}/2 placeholder-safe`);
console.log(`Real secret files found: ${secretFiles.length}`);

if (missing.length || badImports.length || secretFiles.length) {
  if (missing.length) console.error('Missing:', missing);
  if (badImports.length) console.error('Bad JSX imports:', badImports);
  if (secretFiles.length) console.error('Real secrets detected:', secretFiles);
  process.exit(1);
}

console.log('PROJECT_VERIFY_OK');
