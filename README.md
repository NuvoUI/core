# NuvoUI

_Human-readable SCSS for modern devs. Discover NuvoUI_

[![GitHub stars](https://img.shields.io/github/stars/NuvoUI/core?style=flat-square&color=FFB000)](https://github.com/NuvoUI/core)
[![GitHub forks](https://img.shields.io/github/forks/NuvoUI/core?style=flat-square&color=FFB000)](https://github.com/NuvoUI/core)
[![npm version](https://img.shields.io/npm/v/@nuvoui/core?style=flat-square&color=FF6F00)](https://www.npmjs.com/package/@nuvoui/core)
[![Discord](https://img.shields.io/discord/912696886734364743?style=flat-square&label=Discord&color=5865F2)](https://discord.gg/nWGsbQKE)
[![Twitter](https://img.shields.io/badge/Twitter-@NuvoUI-1DA1F2?style=flat-square)](https://x.com/NuvoUI)

## The Human-First SCSS Framework

NuvoUI is designed for developers who want a better way to build responsive, beautiful websites without unnecessary complexity. Write CSS as naturally as you would speak it.

## ✨ Why Choose NuvoUI?

- **💬 Human-Readable** - Intuitive, readable class names and mixins
- **📱 Responsive First** - Use `@lg` or `@sm` directly in class names - being natual like `font-bold@lg`
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

## Core Features

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

### 
```scss
.floating-element {
  @include NuvoUI.animate-float((
    distance: 10px,
    duration: 3s,
    direction: vertical
  ));
}
```

### 🌓 Simple Dark Mode


### Example 2: Elegant SCSS Mixins

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

## Step 3: Implementing Responsive Design

```scss
.hero-image {
  @include NuvoUI.mx-auto;
  @include NuvoUI.my(40);
  @include NuvoUI.rounded(8);
  @include NuvoUI.shadow-lg;
  
  // Add custom animation
  @include NuvoUI.animate-bounce((
    horizontal: 3%,
    duration: 25s,
  ));
  
  // Responsive behavior
  @include NuvoUI.media-up(lg) {
    @include NuvoUI.max-width(80%);
  }
}

// Generated CSS:
.hero-image {
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px !important;
  margin-bottom: 40px !important;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  animation: anim-bounce-0p-3per 25s ease-in-out infinite;
}

@media (min-width: 1024px) {
  .hero-image {
    max-width: 80%;
  }
}

@keyframes anim-bounce-0p-3per {
  0% {
    transform: translateX(-0%) translateY(-3%);
  }
  50% {
    transform: translateX(0%) translateY(3%);
  }
  100% {
    transform: translateX(-0%) translateY(-3%);
  }
}
```


## Documentation

For complete documentation, examples, and guides:

[Visit the NuvoUI Documentation Site →](https://nuvoui.io/).


### Community & Support

- [GitHub Discussions](https://github.com/NuvoUI/core/discussions) - Ask questions & share ideas
- [Discord Community](https://discord.gg/nWGsbQKE) - Chat with the team & other users
- [X @NuvoUI](https://x.com/NuvoUi) - Latest updates and announcements
- [GitHub Issues](https://github.com/NuvoUI/core/issues) - Bug reports & feature requests



## License

NuvoUI is open-source and licensed under the [MIT License](https://github.com/NuvoUI/core/blob/main/LICENSE).

Feel free to use NuvoUI in your projects—commercial or personal. Just don't forget to give us a shoutout when possible!

![Working with CSS](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjV3ZDhyeWp0bno2aTBjMzd5bTltazg0Y29mM2czeDl1aHNxam8xbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yYSSBtDgbbRzq/giphy.webp)
