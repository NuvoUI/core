# Doc blocks

Every public mixin and function in `@nuvoui/core` carries a doc block directly above it. The blocks serve two purposes: inline documentation in the source, and the input for generated documentation, so the reference never drifts from the code. `npm test` runs `test/docblocks.mjs`, which validates every block and compiles every example.

Public means exported by `src/styles/index.scss` (what a consumer gets from `@use "@nuvoui/core" as *`), plus `apply()` from `mixins-map.scss`. The `apply()` registry functions in `mixins-map.scss` are not documented separately; each one stands for the mixin of the same name.

## Format

```scss
// @mixin name
// @description One sentence, plain English, accurate to the current behaviour.
// @param {Type} $name - Description
// @param {Type} $other [default] - Description
// @content Description of the @content block (only for mixins that use @content)
// @output One line describing the emitted CSS (optional)
// @example
// .card {
//   @include name(4);
// }
// @note Extra detail (optional)
// @deprecated Use `other-name` instead.
// @see other-name, another-name
@mixin name($name, $other: default) {
```

Functions use `// @function name` and need a `@return` line:

```scss
// @function token
// @description Returns the custom property reference for a token name.
// @param {String} $name - Token name without the --nu- prefix
// @return {String} - A var(--nu-*) reference
// @example
// .card {
//   color: token(text-muted);
// }
@function token($name) {
```

## Rules

- Comments use `//` followed by one space. Never `///` or `/* */`; block comments can reach the CSS output.
- The block sits directly above the item, with no blank line or other comment in between.
- The first line is exactly `// @mixin <name>` or `// @function <name>`.
- Tag order: `@mixin` or `@function`, `@description`, `@param`, `@content`, `@return`, `@output`, `@example`, `@note`, `@deprecated`, `@see`.
- Every tag except `@example` is a single line, with no continuation lines.
- One `@param` per parameter, in signature order, with the name exactly as in the signature. A rest parameter is written without the dots (`$args`).
- `@param` syntax: `{Type} $name - Description`, or `{Type} $name [default] - Description` with the default exactly as in the signature (`[null]`, `[()]`, `[md]`).
- Types are capitalised and separated by `|`: `Number`, `String`, `Length`, `Color`, `Map`, `List`, `Boolean`, `Null`, `Any`, `Duration`, `Percentage`, `Calculation`. Example: `{Number|Length}`.
- `@return` syntax: `{Type} - Description`.
- `@example` stands alone on its line. The code follows, one line per comment, with two-space indentation inside the code. Empty `//` lines are not allowed (stylelint rejects them). The example ends at the next tag or at the end of the block.
- Inside an example, a line is code unless it starts with one of the tags `@mixin`, `@function`, `@description`, `@param`, `@return`, `@example`, `@note`, `@output`, `@deprecated`, `@see` right after `// `. Code such as `@include`, `@if`, `@media` or `@keyframes` at the start of a line is fine. Indent `@return` and `@content` inside their body.
- Examples are SCSS and must compile without warnings when prefixed with `@use "index" as *;`. Wrap declarations in a selector. A trailing comment showing the output is welcome: `@include p(4); // padding: var(--nu-space-4)`.
- Examples may start with `@use "sass:map";` or `@use "sass:list";` and call `map.get()` or `list.nth()`. Global built-ins such as `map-get` emit deprecation warnings and fail the check.
- `@deprecated` text: ``Use `name` instead.``
- Private helpers (names starting with `-`) and internal helpers that `index.scss` does not export get one short `//` line directly above, not a full block.
- File header blocks (`// @component`, `@classes`, `@responsive`, `@customization`) describe the utility classes of a file. Their `@example` blocks are HTML and are not compiled.
- No em dash, arrow or rocket characters.

## Writing accurate blocks

- Describe what the code emits. When a mixin writes a logical property (`padding-inline`, `margin-block-start`), say inline or block, not left and right.
- Mixin numbers are keys: `p(4)` emits `padding: var(--nu-space-4)`. A unitless number that is not a configured key raises an error; values with units, `calc()` and `var()` pass through.
- Check the code for `@error` versus `@warn` before writing "raises an error" or "warns".
- Colour mixins and utility classes emit `var(--nu-...)` references; `get-color()` returns a real colour value for Sass maths.

## Checking

```bash
node test/docblocks.mjs                          # every file under src/styles
node test/docblocks.mjs utilities/_spacing.scss  # selected files, relative to src/styles
node test/docblocks.mjs --no-compile             # format only, examples are not compiled
```

The checker reports, per item: a missing block, a wrong first line, a missing or repeated `@description`, continuation lines, tag order, malformed `@param` or `@return` lines, parameters that do not match the signature, a function without `@return`, a missing `@example`, and every example that fails to compile or warns. It also flags stale markers (`todo: doc`, `SKIP Documentation`, `todo: add to doc`, `Removal in v2`) and banned characters. It exits with code 1 when anything is reported.

The `apply()` block lives in the template of the generator (`build.js` in the NuvoUI tools repository), which generates `src/styles/mixins-map.scss`. Edit the template and regenerate; never edit `mixins-map.scss` by hand.
