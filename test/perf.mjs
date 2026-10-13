// apply() compile time guard, measured against v1 live.
//
// Usage: node test/perf.mjs (npm run test:perf, also run before publish by test:all)
//
// v1-relative checks. The v1 sources (1.5.7, commit V1_COMMIT) are extracted from git into a temporary directory at
// run time and removed at the end. Each fixture is compiled against v1 and v2 in this process, interleaved: after
// WARMUP rounds, PAIRS pairs, each compiling both sides' empty entries and fixtures (v1 first in even pairs, v2 first
// in odd pairs). The empty entry is the fixture's `@use` line with no rules; each side's median empty entry time
// (package load) is subtracted from that side's fixture times.
// The pair ratio is v2 cost per call over v1 cost per call; the guard uses the median pair ratio. Above FAIL_RATIO
// the fixture is measured again, up to ATTEMPTS times in all, and fails only if every attempt is above FAIL_RATIO.
// Above WARN_RATIO it prints a warning and passes. Without git or the v1 commit (a tarball install) the v1-relative
// checks are skipped with a notice.
//
// v1 cannot compile v2-only names, so every v1-relative fixture uses names both versions share; the large-app
// fixture is translated to v1 names through V1_NAMES.
//
//   as * identical, as * varied, as * modifiers   `@use "mixins-map" as *` with apply(): items are real mixin calls.
//                One item list in every rule; spacing keys, palette colours and shades cycled; the same items with
//                state and breakpoint modifiers.
//   namespaced keys    the varied items through `NuvoUI.apply()`, where items arrive as text and are parsed.
//   repeated as *, repeated namespaced    raw values drawn from small pools (lengths, percentages, hex colours, hex
//                colours at a shade), so every value repeats across rules, as in a real stylesheet.
//   large-app    the first LARGE_APP_RULES rules of test/fixtures/large-app.scss (namespaced, 10 items per call).
//
// Self-relative checks (no v1 needed):
//   get-color    GET_COLOR_RULES get-color() calls on 24 repeated hex colours at a shade must cost at most
//                GET_COLOR_LIMIT times the same calls on palette names (uncached raw colours cost about 4 times as much).
//   unique       namespaced rules whose items hold values no other rule repeats; the cost per call at UNIQUE_RULES may
//                not exceed MAX_GROWTH times the cost at a quarter of the rules (a cache that grows with every unique
//                value makes the cost per call grow with the rule count). The growth is the median of GROWTH_PAIRS
//                interleaved pairs (each pair compiles both sizes, alternating the order), so one slow compile does
//                not decide it. Measured 2026-10-13: about 1.0 normally, 1.7 to 3.5 with the raw cache cap removed.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import * as sass from 'sass';
import { BUILD_FILE, CORE_DIR, STYLES_DIR, TEST_DIR, pad } from './helpers.mjs';

const V1_COMMIT = 'c82f4d3';
const V1_VERSION = '1.5.7';

const WARMUP = 3;
const PAIRS = 7;
const ATTEMPTS = 3;
const FAIL_RATIO = 1.25;
const WARN_RATIO = 1.1;

const RUNS = 3;
const GET_COLOR_RULES = 3000;
const GET_COLOR_LIMIT = 2;
const UNIQUE_RULES = 4000;
const MAX_GROWTH = 1.4;
const GROWTH_PAIRS = 5;

const RULES = 1000;
const COLORS = ['red', 'blue', 'green', 'gray', 'yellow', 'purple'];
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const KEYS = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12];
const VARIED = (i) =>
    `p(${KEYS[i % 10]}), m(${KEYS[(i * 3) % 10]}), bg(${COLORS[i % 6]}, ${SHADES[(i >> 1) % 10]}), text-color(${COLORS[(i + 2) % 6]}, ${SHADES[(i * 7) % 10]}), border-color(${COLORS[(i + 4) % 6]}), flex, x-center, rounded(md)`;
const REPEATED_HEX = Array.from(
    { length: 24 },
    (_, k) => `#${(0x203040 + k * 0x050709).toString(16)}`
);
const REPEATED = (i) =>
    `p(${(i % 24) + 1}px), mt(${(i % 16) / 4 + 0.25}rem), max-width(${(i % 20) * 10 + 200}px), width(${(i % 12) * 5 + 40}%), bg(${REPEATED_HEX[i % 24]}), text-color(${REPEATED_HEX[(i * 5) % 24]}, ${[600, 700][i % 2]}), border-color(${REPEATED_HEX[(i * 7) % 24]})`;

const AS_STAR = '@use "mixins-map" as *;';
const NAMESPACED = '@use "mixins-map" as NuvoUI;';

// [name, use line, apply name, items of rule i]
const GENERATED = [
    [
        'as * identical',
        AS_STAR,
        'apply',
        () =>
            'p(4), m(2), flex, x-center, bg(red), text-color(white), rounded, shadow(md)',
    ],
    ['as * varied', AS_STAR, 'apply', VARIED],
    [
        'as * modifiers',
        AS_STAR,
        'apply',
        (i) =>
            `p(${KEYS[i % 10]}) md, m(${KEYS[(i * 3) % 10]}) lg, bg(${COLORS[i % 6]}, ${SHADES[(i >> 1) % 10]}) hover, text-color(${COLORS[(i + 2) % 6]}) focus, border-color(${COLORS[(i + 4) % 6]}) hover md, flex md, rounded(md) hover, shadow(md) hover lg`,
    ],
    ['namespaced keys', NAMESPACED, 'NuvoUI.apply', VARIED],
    ['repeated as *', AS_STAR, 'apply', REPEATED],
    ['repeated namespaced', NAMESPACED, 'NuvoUI.apply', REPEATED],
];

const LARGE_APP = path.join(TEST_DIR, 'fixtures', 'large-app.scss');
const LARGE_APP_RULES = 1500;
// v2 item text to v1 item text, longest first so an item is not rewritten by a shorter one it contains
const V1_NAMES = [
    ['bg(brand, 600) hover', 'bg(primary, 600) hover'],
    ['border-color(brand) focus', 'border-color(primary) focus'],
    ['border-color(gray, 200)', 'border-color(gray)'],
    ['border-color(regular)', 'border-color(gray)'],
    ['text-color(regular)', 'text-color(gray, 900)'],
    ['text-color(muted)', 'text-color(gray, 500)'],
    ['text-color(brand)', 'text-color(primary)'],
    ['bg(hover) hover', 'bg(gray, 100) hover'],
    ['bg(alternate)', 'bg(gray, 50)'],
    ['bg(surface)', 'bg(white)'],
    ['bg(brand)', 'bg(primary)'],
];

function time(fn) {
    const start = process.hrtime.bigint();
    fn();
    return Number(process.hrtime.bigint() - start) / 1e6;
}

function median(values) {
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
}

function compiler(stylesDir) {
    return (source) =>
        sass.compileString(source, {
            loadPaths: [stylesDir],
            logger: sass.Logger.silent,
        });
}

const compileV2 = compiler(STYLES_DIR);

// Median compile time in ms after one warm-up compile
function measure(compile) {
    compile();
    const times = [];
    for (let i = 0; i < RUNS; i++) {
        times.push(time(compile));
    }
    return median(times);
}

function git(args, options = {}) {
    const result = spawnSync('git', ['-C', CORE_DIR, ...args], {
        maxBuffer: 256 * 1024 * 1024,
        ...options,
    });
    return result.error || result.status !== 0 ? null : result.stdout;
}

// Extracts the v1 sources into a new temporary directory; returns it, or null with the reason
function extractV1() {
    const pkg = git(['show', `${V1_COMMIT}:package.json`], {
        encoding: 'utf8',
    });
    if (pkg === null) {
        return [null, `git or commit ${V1_COMMIT} is not available`];
    }
    const version = JSON.parse(pkg).version;
    if (version !== V1_VERSION) {
        return [
            null,
            `commit ${V1_COMMIT} is version ${version}, not ${V1_VERSION}`,
        ];
    }
    const archive = git(['archive', '--format=tar', V1_COMMIT, 'src']);
    if (archive === null) {
        return [null, `git archive ${V1_COMMIT} failed`];
    }
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nuvoui-perf-v1-'));
    const tar = spawnSync('tar', ['-x', '-C', dir], { input: archive });
    if (tar.error || tar.status !== 0) {
        fs.rmSync(dir, { recursive: true, force: true });
        return [null, 'extracting the v1 sources failed'];
    }
    return [dir, null];
}

function generated([name, use, applyName, items]) {
    const lines = [use];
    for (let i = 1; i <= RULES; i++) {
        lines.push(`.r-${i} { @include ${applyName}(${items(i)}); }`);
    }
    const source = lines.join('\n');
    return { name, calls: RULES, v1: [use, source], v2: [use, source] };
}

function largeApp() {
    const lines = fs
        .readFileSync(LARGE_APP, 'utf8')
        .split('\n')
        .filter((line) => line.startsWith('.c-'))
        .slice(0, LARGE_APP_RULES);
    const v2 = [NAMESPACED, ...lines].join('\n');
    let v1 = v2;
    for (const [from, to] of V1_NAMES) {
        v1 = v1.split(from).join(to);
    }
    return {
        name: 'large-app',
        calls: lines.length,
        v1: [NAMESPACED, v1],
        v2: [NAMESPACED, v2],
    };
}

// One interleaved measurement: median pair ratio, its spread, and each side's median µs per call. Each pair compiles
// both sides' empty entries and fixtures, v1 first in even pairs and v2 first in odd pairs so drift in machine speed
// hits both sides alike; each side's empty entry time is the median over the pairs
function attempt(fixture, compileV1) {
    const sides = [
        [compileV1, ...fixture.v1],
        [compileV2, ...fixture.v2],
    ];
    const timeSide = ([compile, empty, source]) => [
        time(() => compile(empty)),
        time(() => compile(source)),
    ];
    for (let i = 0; i < WARMUP; i++) {
        sides.forEach(timeSide);
    }
    const runs = [[], []];
    for (let i = 0; i < PAIRS; i++) {
        const order = i % 2 ? [1, 0] : [0, 1];
        for (const side of order) {
            runs[side].push(timeSide(sides[side]));
        }
    }
    const [v1, v2] = runs.map((pairs) => {
        const emptyMs = median(pairs.map(([empty]) => empty));
        return pairs.map(
            ([, full]) => ((full - emptyMs) / fixture.calls) * 1000
        );
    });
    const ratios = v2.map((cost, i) => cost / v1[i]);
    return {
        v1: median(v1),
        v2: median(v2),
        ratio: median(ratios),
        spread: `${Math.min(...ratios).toFixed(2)}-${Math.max(...ratios).toFixed(2)}`,
    };
}

function checkAgainstV1(compileV1, problems) {
    const fixtures = [...GENERATED.map(generated), largeApp()];
    console.log(
        `v1 ${V1_VERSION} (${V1_COMMIT}) measured live: ${PAIRS} interleaved pairs per fixture after ${WARMUP} warm-up rounds; fail above ${FAIL_RATIO}x v1 on all of ${ATTEMPTS} attempts, warn above ${WARN_RATIO}x\n`
    );
    const widths = [22, 12, 12, 8, 11, 0];
    const row = (cells) =>
        cells.map((cell, k) => pad(cell, widths[k])).join('');
    console.log(
        row([
            'fixture',
            'v1 µs/call',
            'v2 µs/call',
            'ratio',
            'spread',
            'result',
        ])
    );
    for (const fixture of fixtures) {
        let result;
        let attempts = 0;
        do {
            result = attempt(fixture, compileV1);
            attempts++;
        } while (result.ratio > FAIL_RATIO && attempts < ATTEMPTS);
        let status = 'pass';
        if (result.ratio > FAIL_RATIO) {
            status = 'FAIL';
            problems.push(
                `${fixture.name}: ${result.ratio.toFixed(2)}x the v1 cost per apply() on all ${attempts} attempts (limit ${FAIL_RATIO})`
            );
        } else if (result.ratio > WARN_RATIO) {
            status = `warn (above ${WARN_RATIO})`;
        }
        if (attempts > 1) {
            status += `, attempt ${attempts}`;
        }
        console.log(
            row([
                fixture.name,
                result.v1.toFixed(1),
                result.v2.toFixed(1),
                result.ratio.toFixed(2),
                result.spread,
                status,
            ])
        );
    }
    console.log('');
}

// GET_COLOR_RULES rules of one get-color() call each, on the repeated hex colours or on palette names
function getColorSource(raw, rules = GET_COLOR_RULES) {
    const lines = ['@use "index" as *;'];
    for (let i = 1; i <= rules; i++) {
        const color = raw ? REPEATED_HEX[i % 24] : COLORS[i % 6];
        lines.push(
            `.g-${i} { color: get-color(${color}, ${[600, 700][i % 2]}); }`
        );
    }
    return lines.join('\n');
}

// A hex colour no other rule uses (never pure black or white, which cannot be shaded)
function uniqueHex(i, salt) {
    const value = ((i * 2654435761 + salt) >>> 0) % 0xfffffe;
    return `#${(value + 1).toString(16).padStart(6, '0')}`;
}

function uniqueSource(rules) {
    const lines = [NAMESPACED];
    for (let i = 1; i <= rules; i++) {
        lines.push(
            `.u-${i} { @include NuvoUI.apply(p(${i}px), mt(${(i / 100).toFixed(2)}rem), max-width(${i + 7}px), ml(calc(${i}px + 1rem)), bg(${uniqueHex(i, 17)}), text-color(${uniqueHex(i, 91)}, 600), border-color(${uniqueHex(i, 53)}, 300)); }`
        );
    }
    return lines.join('\n');
}

// Unique fixture growth: median ms per apply() call at UNIQUE_RULES and at a quarter of them, and the median of the
// per-pair ratios, over GROWTH_PAIRS interleaved pairs after one warm-up compile of each size
function uniqueGrowth() {
    const fullRules = UNIQUE_RULES;
    const quarterRules = UNIQUE_RULES / 4;
    const full = uniqueSource(fullRules);
    const quarter = uniqueSource(quarterRules);
    compileV2(full);
    compileV2(quarter);
    const fulls = [];
    const quarters = [];
    const ratios = [];
    for (let i = 0; i < GROWTH_PAIRS; i++) {
        let fullMs;
        let quarterMs;
        if (i % 2 === 0) {
            fullMs = time(() => compileV2(full)) / fullRules;
            quarterMs = time(() => compileV2(quarter)) / quarterRules;
        } else {
            quarterMs = time(() => compileV2(quarter)) / quarterRules;
            fullMs = time(() => compileV2(full)) / fullRules;
        }
        fulls.push(fullMs);
        quarters.push(quarterMs);
        ratios.push(fullMs / quarterMs);
    }
    return {
        unique: median(fulls),
        uniqueQuarter: median(quarters),
        growth: median(ratios),
    };
}

function checkSelfRelative(problems) {
    const getColorEmpty = measure(() => compileV2(getColorSource(true, 0)));
    const rawColors =
        measure(() => compileV2(getColorSource(true))) - getColorEmpty;
    const namedColors =
        measure(() => compileV2(getColorSource(false))) - getColorEmpty;
    const getColorRatio = rawColors / namedColors;
    console.log(
        `${pad('repeated get-color', 22)}${((rawColors / GET_COLOR_RULES) * 1000).toFixed(1)} µs per call on hex colours, ${((namedColors / GET_COLOR_RULES) * 1000).toFixed(1)} on palette names (ratio ${getColorRatio.toFixed(2)}, limit ${GET_COLOR_LIMIT})`
    );
    if (getColorRatio > GET_COLOR_LIMIT) {
        problems.push(
            `repeated get-color: hex colours cost ${getColorRatio.toFixed(2)}x palette names (limit ${GET_COLOR_LIMIT}); is the raw colour cache working?`
        );
    }

    const { unique, uniqueQuarter, growth } = uniqueGrowth();
    console.log(
        `${pad('unique raw values', 22)}${unique.toFixed(3)} ms per apply() at ${UNIQUE_RULES} rules, ${uniqueQuarter.toFixed(3)} at ${UNIQUE_RULES / 4} (median growth of ${GROWTH_PAIRS} pairs ${growth.toFixed(2)}x, limit ${MAX_GROWTH})`
    );
    if (growth > MAX_GROWTH) {
        problems.push(
            `unique raw values: cost per apply() grew ${growth.toFixed(2)}x with 4x the rules (limit ${MAX_GROWTH})`
        );
    }

    const buildMs = time(() =>
        sass.compile(BUILD_FILE, { logger: sass.Logger.silent })
    );
    console.log(`${pad('build.scss', 22)}${Math.round(buildMs)} ms`);
}

function run() {
    const problems = [];
    const [v1Dir, reason] = extractV1();
    try {
        if (v1Dir) {
            checkAgainstV1(
                compiler(path.join(v1Dir, 'src', 'styles')),
                problems
            );
        } else {
            console.log(
                `perf: ${reason}; skipping the v1-relative checks (run from a git checkout of @nuvoui/core to include them)\n`
            );
        }
        checkSelfRelative(problems);
    } finally {
        if (v1Dir) {
            fs.rmSync(v1Dir, { recursive: true, force: true });
        }
    }

    if (problems.length) {
        console.log(`\nperf: ${problems.join('; ')}`);
        process.exitCode = 1;
        return;
    }
    console.log(
        `\nperf: ${v1Dir ? `apply() within ${FAIL_RATIO}x v1 on every fixture, ` : ''}get-color cache and unique value growth within limits`
    );
}

run();
