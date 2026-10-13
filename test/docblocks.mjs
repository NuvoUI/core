// Doc block checker: every public mixin and function has a valid doc block, and every @example compiles.
//
// Usage: node test/docblocks.mjs [file ...] [--no-compile]
//   file          paths relative to src/styles, such as utilities/_spacing.scss (default: every file)
//   --no-compile  check the format only
//
// Format: docs/DOC-BLOCKS.md. Public items are the mixins and functions that index.scss exports (read with
// sass:meta), except the apply() registry functions of mixins-map.scss, which stand for the mixins of the same
// name. Examples are compiled after `@use "index" as *;` and must not warn; examples of deprecated items may
// raise their deprecation warning. Exits with code 1 on any problem.
import fs from 'node:fs';
import path from 'node:path';
import * as sass from 'sass';
import { STYLES_DIR, compileSource } from './helpers.mjs';

const args = process.argv.slice(2);
const noCompile = args.includes('--no-compile');
const only = args.filter((arg) => !arg.startsWith('--'));

const SKIP_FILES = ['build.scss', 'index.scss'];
const TAGS = [
    'mixin',
    'function',
    'description',
    'param',
    'content',
    'return',
    'output',
    'example',
    'note',
    'deprecated',
    'see',
];
const RANK = {
    mixin: 0,
    function: 0,
    description: 1,
    param: 2,
    content: 3,
    return: 4,
    output: 5,
    example: 6,
    note: 7,
    deprecated: 8,
    see: 9,
};
// Tags that end an example; other lines inside an example are code, even when they start with @
const EXAMPLE_END =
    /^@(mixin|function|description|param|return|example|deprecated|see|note|output)(?: (.*))?$/;
const STALE = /todo: doc|SKIP Documentation|todo: add to doc|Removal in v2/i;
const BANNED = /[\u2014\u2192\u{1F680}]/u;

const problems = [];
const stats = { public: 0, documented: 0, examples: 0, failed: 0 };

// Public mixin and function names exported by index.scss
function publicNames() {
    const found = {};
    sass.compileString(
        '@use "sass:map";\n@use "sass:meta";\n@use "index" as nu;\n' +
            '@debug "MIXINS " + meta.inspect(map.keys(meta.module-mixins("nu")));\n' +
            '@debug "FUNCTIONS " + meta.inspect(map.keys(meta.module-functions("nu")));\n',
        {
            loadPaths: [STYLES_DIR],
            logger: {
                debug(message) {
                    const [kind, ...rest] = message.split(' ');
                    found[kind] = rest
                        .join(' ')
                        .split(', ')
                        .map((name) => name.trim().replace(/^"|"$/g, ''));
                },
                warn() {},
            },
        }
    );
    const registry = fs.readFileSync(
        path.join(STYLES_DIR, 'mixins-map.scss'),
        'utf8'
    );
    const wrappers = new Set(
        [...registry.matchAll(/@function ([\w-]+)\(\$a\.\.\.\)/g)].map(
            (match) => match[1]
        )
    );
    return {
        mixin: new Set(found.MIXINS),
        function: new Set(
            found.FUNCTIONS.filter((name) => !wrappers.has(name))
        ),
    };
}

function scssFiles(dir) {
    const files = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...scssFiles(full));
        } else if (
            entry.name.endsWith('.scss') &&
            !SKIP_FILES.includes(entry.name)
        ) {
            files.push(full);
        }
    }
    return files.sort();
}

// Top-level parameter names of a signature that may span several lines
function signatureParams(text) {
    const open = text.indexOf('(');
    const brace = text.indexOf('{');
    if (open < 0 || (brace >= 0 && brace < open)) {
        return [];
    }
    const params = [];
    let depth = 0;
    let current = '';
    for (let i = open + 1; i < text.length; i++) {
        const char = text[i];
        if (char === '(') {
            depth++;
        } else if (char === ')') {
            if (depth === 0) {
                params.push(current);
                break;
            }
            depth--;
        } else if (char === ',' && depth === 0) {
            params.push(current);
            current = '';
            continue;
        }
        current += char;
    }
    return params
        .map((param) => (param.trim().match(/^(\$[\w-]+)/) || [])[1])
        .filter(Boolean);
}

function parseTags(block, where) {
    const tags = [];
    let current = null;
    for (const raw of block) {
        const body = raw.replace(/^\/\/ ?/, '');
        const match =
            current && current.tag === 'example'
                ? body.match(EXAMPLE_END)
                : body.match(/^@([a-z-]+)\b ?(.*)$/);
        if (match) {
            current = { tag: match[1], text: match[2] ?? '', lines: [] };
            tags.push(current);
            if (!TAGS.includes(match[1])) {
                problems.push(`${where}: unknown tag @${match[1]}`);
            }
        } else if (current) {
            current.lines.push(body);
        } else {
            problems.push(`${where}: text before the first tag`);
        }
    }
    return tags;
}

function checkBlock(kind, name, block, signature, where) {
    if (block.some((line) => line.startsWith('///'))) {
        problems.push(`${where}: uses /// (the format is //)`);
    }
    const first = block[0].replace(/^\/\/ ?/, '');
    if (first !== `@${kind} ${name}`) {
        problems.push(
            `${where}: first line must be "// @${kind} ${name}" (got "${block[0]}")`
        );
    }
    const tags = parseTags(block, where);

    const descriptions = tags.filter((tag) => tag.tag === 'description');
    if (descriptions.length !== 1 || !descriptions[0].text.trim()) {
        problems.push(`${where}: needs exactly one non-empty @description`);
    }
    for (const tag of tags) {
        if (tag.tag !== 'example' && tag.lines.length) {
            problems.push(
                `${where}: continuation lines under @${tag.tag} (keep tags on one line)`
            );
        }
    }
    const order = tags.map((tag) => tag.tag);
    for (let i = 1; i < order.length; i++) {
        if (RANK[order[i]] < RANK[order[i - 1]]) {
            problems.push(`${where}: tag order (${order.join(', ')})`);
            break;
        }
    }

    const documented = tags
        .filter((tag) => tag.tag === 'param')
        .map((tag) => {
            const match = tag.text.match(
                /^\{([^}]+)\} (\$[\w-]+)(?:\.\.\.)?(?: \[([^\]]*)\])? - (.+)$/
            );
            if (!match) {
                problems.push(
                    `${where}: malformed @param "${tag.text}" (want {Type} $name [default] - Description)`
                );
                return null;
            }
            return match[2];
        })
        .filter(Boolean);
    const params = signatureParams(signature);
    if (params.join(',') !== documented.join(',')) {
        problems.push(
            `${where}: parameters [${params.join(', ')}] in the signature, [${documented.join(', ')}] in the block`
        );
    }

    const returns = tags.filter((tag) => tag.tag === 'return');
    if (kind === 'function' && !returns.length) {
        problems.push(`${where}: function without @return`);
    }
    for (const tag of returns) {
        if (!/^\{[^}]+\} - .+/.test(tag.text)) {
            problems.push(
                `${where}: malformed @return "${tag.text}" (want {Type} - Description)`
            );
        }
    }

    const examples = tags.filter((tag) => tag.tag === 'example');
    if (!examples.length) {
        problems.push(`${where}: no @example`);
    }
    for (const example of examples) {
        if (example.text.trim()) {
            problems.push(`${where}: text on the @example line`);
        }
    }
    return {
        examples: examples.map((example) => example.lines.join('\n')),
        deprecated: tags.some((tag) => tag.tag === 'deprecated'),
    };
}

// Compiles one example; returns null or the problem
function compileExample(code, deprecated) {
    try {
        const { warnings } = compileSource(`@use "index" as *;\n${code}\n`);
        const unexpected = warnings.filter(
            (warning) => !(deprecated && /deprecated/i.test(warning.message))
        );
        return unexpected.length
            ? `warning: ${unexpected[0].message.split('\n')[0]}`
            : null;
    } catch (error) {
        return (error.sassMessage ?? error.message).split('\n')[0];
    }
}

// Compiles every example of non-deprecated items in one stylesheet (sass: modules hoisted). On any error or
// warning each example is compiled alone, so the failure is attributed
function compileExamples(entries) {
    const batch = entries.filter((entry) => !entry.deprecated);
    const uses = new Set();
    const bodies = batch.map((entry) =>
        entry.code
            .split('\n')
            .filter((line) => {
                if (/^@use "sass:\w+";$/.test(line.trim())) {
                    uses.add(line.trim());
                    return false;
                }
                return true;
            })
            .join('\n')
    );
    // The batch hoists every sass: module, so an example that calls list.nth() without its own @use "sass:list"
    // would pass there; each example must declare the built-in modules it calls
    for (const entry of entries) {
        const declared = new Set(
            [...entry.code.matchAll(/@use "sass:(\w+)"/g)].map((m) => m[1])
        );
        const called = new Set(
            [
                ...entry.code
                    .replace(/\/\/.*$/gm, '')
                    .matchAll(
                        /(?<![\w$.-])(color|list|map|math|meta|selector|string)\.[a-z]/g
                    ),
            ].map((m) => m[1])
        );
        const missing = [...called].filter((name) => !declared.has(name));
        if (missing.length) {
            stats.failed++;
            problems.push(
                `${entry.where}: example calls ${missing.map((name) => `${name}.*`).join(', ')} without @use "sass:${missing[0]}"\n${entry.code.replace(/^/gm, '      | ')}`
            );
        }
    }

    let batchClean = false;
    if (batch.length) {
        try {
            const { warnings } = compileSource(
                `${[...uses].join('\n')}\n@use "index" as *;\n${bodies.join('\n')}\n`
            );
            batchClean = warnings.length === 0;
        } catch {
            batchClean = false;
        }
    }
    for (const entry of entries) {
        if (entry.deprecated || !batchClean) {
            const problem = compileExample(entry.code, entry.deprecated);
            if (problem) {
                stats.failed++;
                problems.push(
                    `${entry.where}: example fails: ${problem}\n${entry.code.replace(/^/gm, '      | ')}`
                );
            }
        }
    }
}

function run() {
    const names = publicNames();
    const seen = { mixin: new Set(), function: new Set() };
    const examples = [];
    const files = scssFiles(STYLES_DIR).filter(
        (file) => !only.length || only.includes(path.relative(STYLES_DIR, file))
    );

    for (const file of files) {
        const rel = path.relative(STYLES_DIR, file);
        const lines = fs.readFileSync(file, 'utf8').split('\n');
        lines.forEach((line, index) => {
            if (/^\s*\/\//.test(line)) {
                if (STALE.test(line)) {
                    problems.push(
                        `${rel}:${index + 1}: stale marker: ${line.trim()}`
                    );
                }
                if (BANNED.test(line)) {
                    problems.push(`${rel}:${index + 1}: banned character`);
                }
            }
            const match = line.match(/^@(mixin|function)\s+([\w-]+)/);
            if (!match) {
                return;
            }
            const [, kind, name] = match;
            const where = `${rel}:${index + 1} ${kind} ${name}`;
            const block = [];
            for (let j = index - 1; j >= 0 && /^\s*\/\//.test(lines[j]); j--) {
                block.unshift(lines[j]);
            }
            if (!names[kind].has(name)) {
                if (name.startsWith('-') && !block.length) {
                    problems.push(
                        `${where}: private helper without a one-line comment`
                    );
                }
                return;
            }
            seen[kind].add(name);
            stats.public++;
            if (!block.length) {
                problems.push(`${where}: no doc block`);
                return;
            }
            const signature = [line, ...lines.slice(index + 1, index + 6)].join(
                ' '
            );
            const result = checkBlock(kind, name, block, signature, where);
            stats.documented++;
            for (const code of result.examples) {
                stats.examples++;
                examples.push({ where, code, deprecated: result.deprecated });
            }
        });
    }

    if (!only.length) {
        for (const kind of ['mixin', 'function']) {
            for (const name of names[kind]) {
                if (!seen[kind].has(name)) {
                    problems.push(
                        `${kind} ${name}: public but no top-level definition found`
                    );
                }
            }
        }
    }

    if (!noCompile) {
        compileExamples(examples);
    }

    problems.forEach((problem) => console.log(problem));
    console.log(
        `\ndocblocks: ${stats.public} public items, ${stats.documented} with a block, ${stats.examples} examples${noCompile ? ' (not compiled)' : `, ${stats.failed} failing`}`
    );
    if (problems.length) {
        console.log(`docblocks: ${problems.length} problem(s)`);
        process.exit(1);
    }
    console.log('docblocks: all checks pass');
}

run();
