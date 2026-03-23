#!/usr/bin/env node
/**
 * crosspost.js — prepare a blog post for Substack
 *
 * Usage:
 *   npm run crosspost -- <slug>
 *   npm run crosspost -- sympatheia-part-1
 *
 * Also accepts a full path if you prefer:
 *   npm run crosspost -- src/blog/posts/2026/my-post/my-post.md
 *
 * What it does:
 *   1. Rewrites relative ./images/ paths to absolute URLs
 *   2. Prepends a standard header (caveat + canonical link)
 *   3. Appends a standard footer (attribution)
 *   4. Converts markdown → HTML via pandoc and copies to clipboard (pbcopy)
 *   5. Opens the post's images/ folder in Finder if it exists
 */

import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const SITE_BASE = 'https://templeofexla.com';
const POSTS_ROOT = 'src/blog/posts';

// ── helpers ──────────────────────────────────────────────────────────────────

function die(msg) {
  console.error(`\n  error: ${msg}\n`);
  process.exit(1);
}

function checkDependency(cmd) {
  const result = spawnSync('which', [cmd], { encoding: 'utf8' });
  if (result.status !== 0) {
    die(`${cmd} is not installed. Install it with: brew install ${cmd}`);
  }
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return { body: content, meta: {} };

  const meta = {};
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      meta[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '');
    }
  }
  return { body: content.slice(match[0].length), meta };
}

// Walk POSTS_ROOT looking for a directory whose name matches the slug,
// then return the markdown file inside it.
function findPostBySlug(slug) {
  const years = fs.readdirSync(POSTS_ROOT).filter(
    y => fs.statSync(path.join(POSTS_ROOT, y)).isDirectory()
  );
  for (const year of years) {
    const postDir = path.join(POSTS_ROOT, year, slug);
    if (fs.existsSync(postDir) && fs.statSync(postDir).isDirectory()) {
      // Prefer slug.md, fall back to index.md, then any .md file
      const candidates = [`${slug}.md`, 'index.md'].map(f => path.join(postDir, f));
      for (const c of candidates) {
        if (fs.existsSync(c)) return c;
      }
      const any = fs.readdirSync(postDir).find(f => f.endsWith('.md'));
      if (any) return path.join(postDir, any);
    }
  }
  return null;
}

// ── main ─────────────────────────────────────────────────────────────────────

const [,, arg] = process.argv;

if (!arg) {
  console.error('\nUsage: npm run crosspost -- <slug>\n');
  console.error('  Example: npm run crosspost -- sympatheia-part-1\n');
  process.exit(1);
}

// Accept either a slug or an explicit file path
let mdFile;
if (arg.endsWith('.md') && fs.existsSync(arg)) {
  mdFile = arg;
} else {
  mdFile = findPostBySlug(arg);
  if (!mdFile) die(`no post found matching slug: "${arg}"`);
}

checkDependency('pandoc');
checkDependency('pbcopy');

// Derive canonical URL from file path
// src/blog/posts/2026/my-post/my-post.md → /blog/posts/2026/my-post/
const postDir = path.dirname(mdFile).replace(/^src/, '');
const canonicalUrl = `${SITE_BASE}${postDir}/`;
const imagesDir = path.join(path.dirname(mdFile), 'images');

// Read and parse
const raw = fs.readFileSync(mdFile, 'utf8');
const { body, meta } = parseFrontmatter(raw);
const title = meta.title || path.basename(path.dirname(mdFile));

// 1. Rewrite relative image paths → absolute URLs
let rewritten = body.replace(
  /!\[([^\]]*)\]\(\.\/images\//g,
  `![$1](${SITE_BASE}${postDir}/images/`
);

// 1b. Rewrite root-relative internal links → absolute URLs
// e.g. [text](/instruments/sympatheia.html) → [text](https://templeofexla.com/instruments/sympatheia.html)
rewritten = rewritten.replace(
  /\[([^\]]*)\]\((\/[^)]*)\)/g,
  `[$1](${SITE_BASE}$2)`
);

// 2. Standard header
const header = [
  `> This post is cross-published from [templeofexla.com](${canonicalUrl}). ` +
  `Images in this version link to the original site — ` +
  `for the full reading experience including any interactive elements, [visit the original post](${canonicalUrl}).`,
  '',
  '---',
  '',
].join('\n');

// 3. Standard footer
const footer = [
  '',
  '---',
  '',
  `*Originally published at [templeofexla.com](${canonicalUrl})*`,
].join('\n');

const final = header + rewritten + footer;

// Write to temp file (avoids shell escaping issues with large content)
const tmpFile = '/tmp/crosspost_input.md';
fs.writeFileSync(tmpFile, final, 'utf8');

// 4. Convert and copy to clipboard
try {
  execSync(`pandoc --from=markdown+yaml_metadata_block --to=html "${tmpFile}" | pbcopy`);
} catch (e) {
  die(`pandoc failed: ${e.message}`);
}

// 5. Open images folder in Finder if it exists
if (fs.existsSync(imagesDir)) {
  execSync(`open "${imagesDir}"`);
  console.log(`\n  Opened images folder: ${imagesDir}`);
} else {
  console.log(`\n  No images folder found at ${imagesDir}`);
}

console.log(`\n  Post:      ${title}`);
console.log(`  Canonical: ${canonicalUrl}`);
console.log(`\n  HTML copied to clipboard — paste into the Substack editor.`);
console.log(`  Publish your own site first; wait 24h before sending on Substack.\n`);
