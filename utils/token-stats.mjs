#!/usr/bin/env node
/**
 * token-stats.mjs — Token efficiency logger for the scraper-utils sanitization step.
 *
 * Usage:
 *   node utils/token-stats.mjs <originalLength> <sanitizedLength>
 *
 * As a module:
 *   import { recordStats } from './utils/token-stats.mjs'
 *   await recordStats(originalLength, sanitizedLength)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const LOG_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../data/efficiency-log.json'
);

const CHARS_PER_TOKEN = 4;

function estimateTokens(chars) {
  return Math.round(chars / CHARS_PER_TOKEN);
}

function loadLog() {
  try {
    const raw = fs.readFileSync(LOG_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLog(entries) {
  fs.writeFileSync(LOG_PATH, JSON.stringify(entries, null, 2), 'utf8');
}

export async function recordStats(originalLength, sanitizedLength) {
  const originalTokens  = estimateTokens(originalLength);
  const sanitizedTokens = estimateTokens(sanitizedLength);
  const tokensSaved     = originalTokens - sanitizedTokens;
  const reductionPct    = originalTokens > 0
    ? Math.round((tokensSaved / originalTokens) * 100)
    : 0;

  const entry = {
    timestamp:        new Date().toISOString(),
    originalChars:    originalLength,
    sanitizedChars:   sanitizedLength,
    originalTokens,
    sanitizedTokens,
    tokensSaved,
    reductionPercent: reductionPct,
  };

  const log = loadLog();
  log.push(entry);
  saveLog(log);

  // Cumulative savings across all logged runs
  const cumulative = log.reduce(
    (acc, e) => ({
      runs:               acc.runs + 1,
      totalOriginalTokens: acc.totalOriginalTokens + e.originalTokens,
      totalSavedTokens:   acc.totalSavedTokens + e.tokensSaved,
    }),
    { runs: 0, totalOriginalTokens: 0, totalSavedTokens: 0 }
  );

  const cumulativeReductionPct = cumulative.totalOriginalTokens > 0
    ? Math.round((cumulative.totalSavedTokens / cumulative.totalOriginalTokens) * 100)
    : 0;

  const report = {
    run: {
      timestamp:       entry.timestamp,
      originalTokens,
      sanitizedTokens,
      tokensSaved,
      reductionPercent: reductionPct,
    },
    cumulative: {
      totalRuns:            cumulative.runs,
      totalOriginalTokens:  cumulative.totalOriginalTokens,
      totalTokensSaved:     cumulative.totalSavedTokens,
      reductionPercent:     cumulativeReductionPct,
    },
  };

  return report;
}

// CLI mode
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const originalLength  = parseInt(process.argv[2], 10);
  const sanitizedLength = parseInt(process.argv[3], 10);

  if (isNaN(originalLength) || isNaN(sanitizedLength)) {
    process.stderr.write('Usage: node utils/token-stats.mjs <originalLength> <sanitizedLength>\n');
    process.exit(1);
  }

  const report = await recordStats(originalLength, sanitizedLength);

  console.log('\n── This run ──────────────────────────────');
  console.log(`  Original  : ${report.run.originalTokens.toLocaleString()} tokens`);
  console.log(`  Sanitized : ${report.run.sanitizedTokens.toLocaleString()} tokens`);
  console.log(`  Saved     : ${report.run.tokensSaved.toLocaleString()} tokens (${report.run.reductionPercent}% reduction)`);

  console.log('\n── Cumulative (all runs) ──────────────────');
  console.log(`  Runs      : ${report.cumulative.totalRuns}`);
  console.log(`  Total in  : ${report.cumulative.totalOriginalTokens.toLocaleString()} tokens`);
  console.log(`  Total saved: ${report.cumulative.totalTokensSaved.toLocaleString()} tokens (${report.cumulative.reductionPercent}% avg reduction)`);
  console.log(`  Log       : ${LOG_PATH}\n`);
}
