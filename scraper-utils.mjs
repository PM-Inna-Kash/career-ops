#!/usr/bin/env node
/**
 * scraper-utils.mjs — HTML sanitizer for job descriptions
 *
 * Strips scripts, styles, nav, footer, and excess whitespace from raw HTML
 * before it reaches the LLM for evaluation.
 *
 * As a module: import { sanitizeJobHTML } from './scraper-utils.mjs'
 * As a CLI:    node scraper-utils.mjs <url>  → sanitized text to stdout, exit 1 on error
 */

import { fileURLToPath } from 'url';
import { recordStats } from './utils/token-stats.mjs';

export function sanitizeJobHTML(rawHTML) {
  return rawHTML
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 6000);
}

// CLI mode: node scraper-utils.mjs <url>
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const url = process.argv[2];
  if (!url) {
    process.stderr.write('Usage: node scraper-utils.mjs <url>\n');
    process.exit(1);
  }
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; career-ops/1.0)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const sanitized = sanitizeJobHTML(html);

    const report = await recordStats(html.length, sanitized.length);
    process.stderr.write(
      `Operational Efficiency: ${report.run.reductionPercent}% tokens saved ` +
      `(${report.run.originalTokens.toLocaleString()} → ${report.run.sanitizedTokens.toLocaleString()} tokens)\n`
    );

    process.stdout.write(sanitized + '\n');
  } catch (err) {
    process.stderr.write(`scraper-utils: ${err.message}\n`);
    process.exit(1);
  }
}
