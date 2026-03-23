#!/usr/bin/env node
/**
 * new-post.js — scaffold a new blog post
 *
 * Usage:
 *   npm run new-post -- <slug> [category] [title]
 *
 * Examples:
 *   npm run new-post -- sympatheia-part-2
 *   npm run new-post -- sympatheia-part-2 audio
 *   npm run new-post -- sympatheia-part-2 audio "Sympatheia, Part 2: The Layers"
 *
 * Creates:
 *   src/blog/posts/YYYY/slug/slug.md
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const POSTS_ROOT = 'src/blog/posts';
const VALID_CATEGORIES = ['navigation', 'philosophy', 'audio', 'field-notes', 'discourse'];

function die(msg) {
  console.error(`\n  error: ${msg}\n`);
  process.exit(1);
}

function isoNow() {
  const now = new Date();
  // Get local timezone offset as ±HH:MM
  const offsetMin = -now.getTimezoneOffset();
  const sign = offsetMin >= 0 ? '+' : '-';
  const hh = String(Math.floor(Math.abs(offsetMin) / 60)).padStart(2, '0');
  const mm = String(Math.abs(offsetMin) % 60).padStart(2, '0');
  const offset = `${sign}${hh}:${mm}`;

  const pad = n => String(n).padStart(2, '0');
  const datePart = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const timePart = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  return { iso: `${datePart}T${timePart}${offset}`, date: datePart };
}

const [,, slug, category = '', rawTitle = ''] = process.argv;

if (!slug) {
  console.error('\nUsage: npm run new-post -- <slug> [category] [title]\n');
  console.error('  Categories: ' + VALID_CATEGORIES.join(', ') + '\n');
  process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(slug)) {
  die(`slug must be lowercase letters, numbers, and hyphens only: "${slug}"`);
}

if (category && !VALID_CATEGORIES.includes(category)) {
  die(`invalid category "${category}". Valid: ${VALID_CATEGORIES.join(', ')}`);
}

const { iso, date } = isoNow();
const year = date.slice(0, 4);
const title = rawTitle || slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
const postDir = path.join(POSTS_ROOT, year, slug);
const mdFile = path.join(postDir, `${slug}.md`);

if (fs.existsSync(postDir)) {
  die(`post already exists: ${postDir}`);
}

fs.mkdirSync(postDir, { recursive: true });

const frontmatter = `---
layout: layouts/post.njk
title: "${title}"
date: ${date}
iso_str: ${iso}
summary: ""
category: ${category || 'navigation'}
tags: []
draft: true
---

`;

fs.writeFileSync(mdFile, frontmatter, 'utf8');

console.log(`\n  Created: ${mdFile}`);
console.log(`  Title:   ${title}`);
console.log(`  Date:    ${date}`);
console.log(`  iso_str: ${iso}\n`);

// Open the new file in the editor
try {
  execSync(`open "${mdFile}"`);
} catch {}
