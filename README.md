# NuvoUI

A utility-first CSS framework built with modern SCSS, providing atomic classes and mixins for rapid UI development.

[![GitHub stars](https://img.shields.io/github/stars/NuvoUI/core?style=flat-square&color=FFB000)](https://github.com/NuvoUI/core)
[![GitHub forks](https://img.shields.io/github/forks/NuvoUI/core?style=flat-square&color=FFB000)](https://github.com/NuvoUI/core)
[![npm version](https://img.shields.io/npm/v/@nuvoui/core?style=flat-square&color=FF6F00)](https://www.npmjs.com/package/@nuvoui/core)
[![Discord](https://img.shields.io/discord/1307989034638905345?style=flat-square&label=Discord&color=5865F2)](https://discord.gg/dhxxKTK5Zx)
[![Twitter](https://img.shields.io/badge/Twitter-@NuvoUI-1DA1F2?style=flat-square)](https://x.com/NuvoUI)

## What is NuvoUI?

NuvoUI is a comprehensive CSS framework that combines the flexibility of utility classes with the power of SCSS mixins. It offers a complete design system with responsive breakpoints, semantic theming, and advanced layout capabilities designed for developers who want to build responsive, beautiful websites without unnecessary complexity.

## Key Features

### Utility-First Architecture
- **Atomic Classes**: Single-purpose classes like `bg-primary`, `p-4`, `flex`
- **SCSS Mixins**: Use utilities in SCSS via `@include apply(bg(primary), p(4), flex)`
- **Responsive Modifiers**: Breakpoint-specific classes with `@breakpoint` syntax
- **State Modifiers**: Interactive states with `hover:`, `focus:`, `active:` prefixes

### Advanced Theming System
- **CSS Custom Properties**: Dynamic theming with CSS variables
- **Semantic Tokens**: Brand colors (primary, secondary) and contextual colors (success, danger, warning, info)
- **Automatic Color Scales**: Generate complete color palettes from base colors
- **Contrast Calculation**: Automatic text color based on background contrast ratios
- **Dark Mode Support**: Built-in theme switching capabilities

### Comprehensive Layout System
- **CSS Grid Utilities**: Complete grid system with areas, spans, and responsive variants
- **Flexbox System**: Full flexbox implementation with alignment and distribution controls
- **Container Queries**: Modern responsive design with element-based breakpoints
- **Modern Layout Tools**: CSS Subgrid, aspect ratios, and intrinsic sizing

### Typography & Content
- **Fluid Typography**: Responsive font sizes with configurable scales
- **Advanced Text Handling**: Truncation (single and multi-line), overflow control, text transforms
- **Letter Spacing**: Granular tracking controls
- **Line Height**: Semantic leading classes for optimal readability

### Visual Enhancement
- **Elevation System**: Consistent shadow scales with z-index management
- **Border System**: Comprehensive border utilities with radius, styles, and colors
- **Transform System**: CSS transforms using CSS variables for better performance
- **Transition System**: Smooth animations with configurable timing and easing

### Interactive Components
- **Tooltip System**: Lightweight tooltips with positioning and sizing options
- **State Management**: Comprehensive hover, focus, and active state handling
- **Backdrop Utilities**: Modern backdrop filters and effects

### Developer Experience
- **Build System**: Automated utility generation from configuration
- **Configuration**: Extensive customization through SCSS variables
- **Documentation**: Interactive examples with live previews
- **Atomic Structure**: BEM-compatible component architecture

## ✨ Why Choose NuvoUI?

- **💬 Human-Readable** - Intuitive, readable class names and mixins
- **📱 Responsive First** - Use `@lg` or `@sm` directly in class names - being natural like `font-bold@lg`
- **🧩 Component-Focused** - Container queries for truly modular design
- **🌙 Dark Mode Built In** - Theme switching with zero effort
- **🚀 Performance Focused** - Smaller CSS footprint than most frameworks
- **⚙️ Fully Customizable** - Configure everything via SCSS variables
- **📦 Zero Runtime** - Pure CSS, no JavaScript dependencies

## Quick Installation

```bash
# Using npm
npm install @nuvoui/core

# Using pnpm
pnpm add @nuvoui/core

# Using yarn
yarn add @nuvoui/core
```

## Usage

### SCSS Import (Recommended)

```scss
// Basic import with defaults
@use '@nuvoui/core' as NuvoUI;

// Or customize with your preferences
@use '@nuvoui/core' as NuvoUI with (
  $primary: #ff6f00,
  $secondary: #03DAC6,
  $column-count: 12,
  $enable-dark-mode: true,
  // Add more customizations as needed
);
```
### Direct CSS Import (coming soon to CDN)

```html
<link rel="stylesheet" href="node_modules/@nuvoui/core/dist/nuvoui.min.css">
```

## Architecture

### Configuration-Driven
All utilities are generated from SCSS configuration maps:
```scss
$spacing: (0, 0.25rem, 0.5rem, 1rem, 1.5rem, 2rem, 3rem, 4rem, 6rem, 8rem);
$colors: (primary: #3b82f6, secondary: #6b7280, success: #10b981);
$breakpoints: (sm: 576px, md: 768px, lg: 992px, xl: 1200px);
```

### Modern CSS Features
- CSS Custom Properties for dynamic theming
- CSS Grid and Flexbox for layout
- Container Queries for responsive design
- CSS Transforms and Filters
- Modern color functions (oklch, color-mix)

### Framework Agnostic
Works with any frontend framework or vanilla HTML/CSS. No JavaScript dependencies.

## Core Features Examples

### 🎨 Beautiful Color System

NuvoUI includes a comprehensive color system with semantic color variables and automatic dark mode support.

```html
<div class="bg-primary text-white">Primary color with contrast text</div>
<div class="bg-success-200 text-success-900">Success colors with different shades</div>
```

### 📐 Flexible Layout System

Build complex layouts with ease using our grid and flexbox utilities.

```html
<!-- Responsive grid with auto placement -->
<div class="grid cols-12 gap-4">
  <div class="col-span-12 col-span-6@md col-span-4@lg">Responsive column</div>
  <div class="col-span-12 col-span-6@md col-span-8@lg">Another column</div>
</div>

<!-- Flexbox with alignment -->
<div class="flex between y-center wrap">
  <div>Left content</div>
  <div>Right content</div>
</div>
```

### 🌓 Simple Dark Mode

```html
<html data-theme="dark">
  <!-- Your content will use dark theme colors -->
</html>
```

Toggle with a simple script:

```html
<button onclick="document.documentElement.setAttribute('data-theme', 
  document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')">
  Toggle Theme
</button>
```

### Elegant SCSS Mixins

```scss
.hero-image {
  @include apply(mx(auto), my(40), rounded(8), shadow(lg));
  
  // Responsive behavior
  @include media-up(lg) {
    @include apply(max-w(80%));
  }
}
```

## Browser Support

Modern browsers supporting CSS Grid, Custom Properties, and modern CSS features. IE11+ with appropriate polyfills for legacy support.


## Documentation

For complete documentation, examples, and guides:

[Visit the NuvoUI Documentation Site →](https://nuvoui.io/).


### Community & Support

- [Discord Community](https://discord.gg/nWGsbQKE) - Chat with the team & other users
- [X @NuvoUI](https://x.com/NuvoUi) - Latest updates and announcements
- [GitHub Issues](https://github.com/NuvoUI/core/issues) - Bug reports & feature requests


## License

NuvoUI is open-source and licensed under the [MIT License](https://github.com/NuvoUI/core/blob/main/LICENSE).

Feel free to use NuvoUI in your projects—commercial or personal. Just don't forget to give us a shoutout when possible!

![Working with CSS](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjV3ZDhyeWp0bno2aTBjMzd5bTltazg0Y29mM2czeDl1aHNxam8xbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yYSSBtDgbbRzq/giphy.webp)
