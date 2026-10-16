# NuvoUI Core

The foundation layer of the NuvoUI design system: design tokens, utility classes and SCSS mixins, written in Sass.

[![GitHub stars](https://img.shields.io/github/stars/NuvoUI/core?style=flat-square&color=FFB000)](https://github.com/NuvoUI/core)
[![GitHub forks](https://img.shields.io/github/forks/NuvoUI/core?style=flat-square&color=FFB000)](https://github.com/NuvoUI/core)
[![npm version](https://img.shields.io/npm/v/@nuvoui/core?style=flat-square&color=FF6F00)](https://www.npmjs.com/package/@nuvoui/core)
[![Discord](https://img.shields.io/discord/1307989034638905345?style=flat-square&label=Discord&color=5865F2)](https://discord.gg/dhxxKTK5Zx)
[![Twitter](https://img.shields.io/badge/Twitter-@NuvoUI-1DA1F2?style=flat-square)](https://x.com/NuvoUI)

## Overview

`@nuvoui/core` provides:

- **Design tokens** emitted as CSS custom properties with the `--nu-` prefix, with light and dark themes built from one token model.
- **Utility classes** with human-readable names (`between`, `x-center`), responsive suffixes (`p-4@md`) and state prefixes (`hover:`, `focus:`, `active:`, `group-hover:`).
- **SCSS mixins** through `@include apply(...)`, which output the same tokens as the classes, so styles written in SCSS follow the active theme.
- **Base styles** for plain HTML elements, including buttons and form controls built on tokens.

Core is SCSS and CSS only. It has no JavaScript runtime.

Version 2.0 is a breaking release. Projects upgrading from 1.x should read the [migration guide](docs/MIGRATION-v2.md).

## Requirements

- Dart Sass `>=1.79.0 <2` (peer dependency). The colour space API in Sass 1.79 is required for OKLCH shade generation.

## Installation

```bash
npm install @nuvoui/core sass
# or
pnpm add @nuvoui/core sass
# or
yarn add @nuvoui/core sass
```

## Usage

### SCSS

```scss
@use "@nuvoui/core" as * with (
    $brand: #4361ee,
    $light-theme: (
        "brand": brand 800,
        "bg-base": #fff,
    ),
    $dark-theme: (
        "bg-base": #121212,
    ),
    $generate-utility-classes: true
);
```

- `$brand` sets the main colour role. `$success`, `$danger`, `$warning` and `$info` set the status roles.
- `$light-theme`, `$dark-theme`, `$high-contrast-light` and `$high-contrast-dark` hold overrides only. Keys are token names without `--nu-`. A value is a CSS value or a scale reference written as a name and a stop (`brand 800`), emitted as `var(--nu-brand-800)`. Unknown keys and malformed references raise compile errors.
- Tokens and base styles are emitted by default. Utility classes are emitted only with `$generate-utility-classes: true`; mixin-only projects can leave it off.
- Every compiled entry that `@use`s the package emits the tokens, reset, base layer, tooltips and `@property` registrations (about 42 KB with `--style=compressed`, under 6 KB gzipped), so compile one entry that imports your partials rather than one stylesheet per component.

`@use "@nuvoui/core"` resolves through the package `sass` export in bundlers that support it, such as Vite and webpack `sass-loader`. With the Dart Sass command line or JavaScript API, use the Node package importer:

```scss
@use "pkg:@nuvoui/core" as *;
```

```bash
sass --pkg-importer=node src/app.scss dist/app.css
```

### Prebuilt CSS

`npm run build` compiles the default configuration with every utility class to `dist/nuvoui.css` and `dist/nuvoui.min.css`, the files the package `style` and `./css` exports point at:

```html
<link rel="stylesheet" href="node_modules/@nuvoui/core/dist/nuvoui.min.css">
```

## Design tokens

Every token is a CSS custom property named `--nu-{name}` with single hyphens (`--nu-text-muted`, `--nu-space-4`). Tokens fall into two groups:

| Tier                     | Examples                                                                                                                      | Behaviour                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Palette, basic and scale | `--nu-red-500`, `--nu-white`, `--nu-space-4`, `--nu-radius-md`, `--nu-font-size-lg`, `--nu-font-family`                    | Fixed. The same value in every theme. Emitted on `:root` only.                |
| Theme and role           | `--nu-bg-surface`, `--nu-text-muted`, `--nu-border-regular`, `--nu-brand`, `--nu-danger-subtle`, `--nu-text-on-brand`         | Flip per theme. The dark theme points roles at other stops of the same scale. |

Roles are `brand`, `success`, `danger`, `warning` and `info`. The bare name is the fill (`--nu-brand`), with `-hover`, `-active`, `-subtle` and `-border`, plus `--nu-text-{role}` and `--nu-text-on-{role}`. `--nu-error` and the other `--nu-error-*` tokens alias `--nu-danger-*`.

Fixed tokens are declared on `:root` only, and the light block (`:root, [data-theme="light"]`) holds the theme tokens, so a runtime override on `:root` (for example `:root { --nu-font-family: "Inter", sans-serif; }`) also applies inside `data-theme="light"` sections.

Themes are selected with the `data-theme` attribute:

- `data-theme="light"` or `data-theme="dark"` on any element themes that element and its subtree, so sections can be nested.
- Without a `data-theme` attribute on the root element, the page follows the operating system through `prefers-color-scheme`.
- `data-theme="inverse"` gives a section the opposite theme of the page: dark values on a light page, light values under a dark page (explicit or from the operating system).
- `data-contrast="high"` on the root, on an element that sets `data-theme`, or on an ancestor of either applies `$high-contrast-light` where the theme resolves to light and `$high-contrast-dark` where it resolves to dark, inverse and nested inverse sections included. Every theme selector has a high-contrast twin of higher specificity, and each twin carries the keys of both maps (a key its own map lacks keeps the base theme value), so a value from the other map never leaks. An element without `data-theme` inherits; it is not restyled by a `data-contrast` attribute of its own. Both maps are empty by default, so nothing is emitted until values are set.

```html
<html data-theme="dark">
  <body>
    <section data-theme="light">A light section inside a dark page</section>
    <section data-theme="inverse">The opposite of the page (light here)</section>
  </body>
</html>
```

The full token list with light and dark values is in the [token reference](docs/TOKENS.md).

## Utility classes

```html
<article class="bg-surface border border-regular rounded-md p-4 p-6@md">
  <h2 class="text-regular font-bold">Invoice 1042</h2>
  <p class="text-muted ms-4">Due in 3 days</p>
  <div class="bg-danger-subtle text-danger rounded-md p-2">Payment failed</div>
  <button class="bg-brand text-on-brand px-4 py-2">Pay now</button>
</article>

<div class="grid cols-12 gap-4">
  <div class="col-span-12 col-span-6@md col-span-4@lg">Sidebar</div>
  <div class="col-span-12 col-span-6@md col-span-8@lg">Content</div>
</div>

<div class="flex between x-center wrap">
  <span>Left</span>
  <span>Right</span>
</div>
```

- Colour classes use theme words (`bg-surface`, `text-muted`, `border-regular`), roles (`bg-brand`, `text-danger`, `text-on-brand`, `bg-danger-subtle`) and palette shades (`bg-blue-100`).
- Logical classes (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`) follow the text direction. Physical classes (`ml-*`, `pr-*`, `text-left`) remain for content that keeps its side in both directions.
- A breakpoint suffix applies from that width up: `p-6@md`, `col-span-4@lg`.

## Mixins with `apply()`

`apply()` takes mixin calls separated by commas. A state and a breakpoint follow the call, in that order.

```scss
@use "@nuvoui/core" as *;

.card {
    @include apply(bg(surface), text-color(regular), border(1), rounded(md), p(4), shadow(md));
    @include apply(p(6) md, bg(hover) hover, bg(selected) hover lg);
}

.badge {
    @include apply(bg(danger-subtle), text-color(danger), px(2), rounded(sm), ms(2));
}
```

- A unitless number is a configuration key: `p(4)` outputs `padding: var(--nu-space-4)`, the same value as the `.p-4` class. A number that is not a key raises an error. Values with units pass through: `p(1.5rem)`.
- Colour mixins take the class words and output tokens: `bg(brand)` gives `var(--nu-brand)`, `text-color(muted)` gives `var(--nu-text-muted)`.
- With a namespaced load (`@use "@nuvoui/core" as nu`), write `nu.apply(...)`. One item needs the namespace inside it: Sass reads a bare `opacity(inherit)` or `opacity("50")` as its built-in colour function, so write `nu.apply(nu.opacity(inherit))` (`opacity(50)` works as it is).

## Performance

`apply()` compile time, measured with Dart Sass 1.103.1 (the `sass` npm package) on Node 24, Apple M2 Pro, median of three runs, `@use "@nuvoui/core" as *`:

| Stylesheet | Time | Output |
| --- | --- | --- |
| `@use` line only (package load, tokens, base) | 191 ms | 1,390 lines |
| 5,000 rules, six repeated items each | 2,049 ms | 96,389 lines |
| 2,000 rules, two unique raw values each | 2,686 ms | 29,389 lines |
| 5,000 rules, two unique raw values each | 6,420 ms | 71,389 lines |

```scss
@for $i from 1 through 2000 {
    .card-#{$i} {
        @include apply(p(#{$i}px) md, m(#{$i * 0.01}rem) lg, bg(red, 500) hover);
    }
}
```

- A repeated item costs about 60 µs. A unique raw value costs about 0.6 ms, the same at 2,000 and 5,000 rules, so compile time grows linearly with the number of unique values.
- The package load is a fixed cost per compiled entry. Compile one entry that imports your partials.
- `pnpm test:perf` guards `apply()` against the last release, including the namespaced path, where parsed items go into size-capped caches.

Method and discussion: [We Tried to Break Our Own SCSS Compiler](https://dev.to/nuvoui/we-tried-to-break-our-own-scss-compiler-here-are-the-numbers-1boj). Run the loop in the [playground](https://nuvoui.io/playground/).

## `token()`

`token($name)` returns `var(--nu-{name})` and raises an error with close matches for an unknown name. Use it for tokens in hand-written CSS properties.

```scss
@use "@nuvoui/core" as nu;

.panel {
    background: nu.token(bg-raised);
    box-shadow: nu.token(shadow-md);
    outline: nu.token(border-focus-width) solid nu.token(border-focus);
    outline-offset: nu.token(border-focus-offset);
}
```

`get-color($name, $stop)` returns a real colour value for Sass maths, for example `color.mix(nu.get-color(brand, 600), #fff, 80%)`.

## Documentation

- [Migration guide from 1.x](docs/MIGRATION-v2.md)
- [Token reference](docs/TOKENS.md)
- [Changelog](CHANGELOG.md)
- [Documentation site](https://nuvoui.io/)

## Browser support

Current versions of evergreen browsers. The output relies on CSS custom properties, cascade layers, logical properties and `:focus-visible`; the `dark-mode` mixin emits `@scope` (Chrome 118, Safari 17.4, Firefox 146). Transform and flex gap variables are registered with `@property` so they do not inherit, and the declarations that read them have no `var()` fallback: browsers without `@property` support (before Chrome 85, Safari 16.4, Firefox 128) treat those declarations as invalid.

## Community and support

- [X @NuvoUI](https://x.com/NuvoUi)
- [GitHub Issues](https://github.com/NuvoUI/core/issues)

## License

NuvoUI is open source under the [MIT License](https://github.com/NuvoUI/core/blob/main/LICENSE).
