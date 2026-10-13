// Output size guard for the full build and the index entry.
//
// Usage: node test/size.mjs
//
// Compiles src/styles/build.scss (every utility class) and src/styles/index.scss (what each stylesheet that loads the
// package emits: tokens, reset, base, tooltips, @property) expanded and compressed, reports expanded, compressed and
// gzip bytes and compares them with the recorded v2 baselines. Fails when any number is more than THRESHOLD above or
// below its baseline (a large drop means output went missing). After an intended size change, update the baseline
// with the numbers this script prints.
import zlib from 'node:zlib';
import { BUILD_FILE, INDEX_FILE, compileFile, pad } from './helpers.mjs';

const THRESHOLD = 0.05;

// v2.0.0 measured 2026-10-13 (sass 1.103.1): build after the tooltip colour variables joined the theme blocks, index
// after the base layer select and inline code rules.
// v1 (git HEAD before v2, 1.5.7) for reference only, measured 2026-10-13 by compiling the HEAD src/styles files with
// sass 1.103.1. The CLI build reported 1,038,132 expanded bytes (trailing newline).
const ENTRIES = [
    {
        name: 'build.scss',
        file: BUILD_FILE,
        baseline: { expanded: 1180611, compressed: 1002323, gzip: 92202 },
        v1: { expanded: 1038131, compressed: 876362, gzip: 85729 },
    },
    {
        name: 'index.scss',
        file: INDEX_FILE,
        baseline: { expanded: 48795, compressed: 43130, gzip: 5766 },
        v1: { expanded: 5421, compressed: 4088, gzip: 1431 },
    },
];

const bytes = (text) => Buffer.byteLength(text, 'utf8');
const gzip = (text) => zlib.gzipSync(text, { level: 9 }).length;
const num = (count) => count.toLocaleString('en-US');
const pct = (now, base) =>
    `${now >= base ? '+' : ''}${(((now - base) / base) * 100).toFixed(1)}%`;

function run() {
    const failures = [];
    console.log(
        `${pad('measure', 34)}${pad('current', 12)}${pad('v2 baseline', 14)}${pad('change', 9)}${pad('v1', 12)}vs v1`
    );
    for (const entry of ENTRIES) {
        const compressed = compileFile(entry.file, 'compressed').css;
        const current = {
            expanded: bytes(compileFile(entry.file, 'expanded').css),
            compressed: bytes(compressed),
            gzip: gzip(compressed),
        };
        for (const key of ['expanded', 'compressed', 'gzip']) {
            const label = `${entry.name} ${key === 'gzip' ? 'compressed + gzip -9' : key}`;
            const base = entry.baseline[key];
            console.log(
                `${pad(label, 34)}${pad(num(current[key]), 12)}${pad(num(base), 14)}${pad(pct(current[key], base), 9)}${pad(num(entry.v1[key]), 12)}${pct(current[key], entry.v1[key])}`
            );
            if (current[key] > base * (1 + THRESHOLD)) {
                failures.push(
                    `${label} is ${num(current[key])} bytes, more than ${THRESHOLD * 100}% above the v2 baseline ${num(base)}`
                );
            } else if (current[key] < base * (1 - THRESHOLD)) {
                failures.push(
                    `${label} is ${num(current[key])} bytes, more than ${THRESHOLD * 100}% below the v2 baseline ${num(base)}; output may be missing`
                );
            }
        }
    }

    if (failures.length > 0) {
        console.log(`\n${failures.length} size failure(s):`);
        failures.forEach((failure) => console.log(`  ${failure}`));
        process.exit(1);
    }
    console.log(`\nsize: within ${THRESHOLD * 100}% of the v2 baselines`);
}

run();
