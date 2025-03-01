# NuvoUI

[![GitHub stars](https://img.shields.io/github/stars/NuvoUI/core?style=social)](https://github.com/NuvoUI/core)
[![GitHub forks](https://img.shields.io/github/forks/NuvoUI/core?style=social)](https://github.com/NuvoUI/core)
[![npm version](https://img.shields.io/npm/v/@nuvoui/core)](https://www.npmjs.com/package/@nuvoui/core)
[![Discord](https://dcbadge.limes.pink/api/server/nWGsbQKE?style=flat&theme=default-inverted)](https://discord.gg/nWGsbQKE)

## Welcome to NuvoUI 🎉

NuvoUI is a modern, human-friendly SCSS framework designed for developers who value simplicity, flexibility, and performance. Whether you're a seasoned CSS wizard or just getting started, NuvoUI makes building responsive, performant, and visually stunning web designs a breeze.

## Why Choose NuvoUI?

✨ **Natural Language-Like Syntax**  
Write CSS that feels intuitive and effortless. Use classes like `px-20` for padding or `px-20@lg` for responsive styles—all without breaking a sweat.

🔥 **Fully Mixin-Based**  
Seamlessly integrate NuvoUI into your SCSS pipeline. Write reusable, modular, and clean SCSS code with our powerful mixins.

🚀 **Optimized Animations**  
Define animations on the fly. NuvoUI caches animations intelligently, ensuring your code stays DRY (Don't Repeat Yourself).

🌓 **Built-in Dark Mode**  
Implement dark mode effortlessly with our built-in theme switching support. Just add `data-theme="dark"` to your HTML element.

📱 **Container and Element Queries**  
Build truly component-based designs with container queries alongside traditional media queries.

## Key Features

- **Dynamic Responsive Design**: Use `@lg`, `@sm`, etc., to generate responsive styles with ease
- **Flexible Animations**: Create complex animations with simple mixins like `@include NuvoUI.animate-bounce((horizontal: 3%, duration: 25s))`
- **Smart Utilities**: Comprehensive set of utilities for spacing, typography, colors, and more
- **Developer-First Approach**: Built by developers for developers, offering the flexibility to build custom solutions effortlessly
- **Zero Dependencies**: Lightweight with no external dependencies
- **Simple Installation**: Get started with a single command via npm

---

## Installation

To start using NuvoUI, install it via npm or pnpm:

```css
npm install @nuvoui/core 
# or
pnpm install @nuvoui/core
```

## Quick Start

### Option 1: Import in SCSS (Recommended)

```scss
// Import with default configuration
@use '@nuvoui/core' as NuvoUI;

// Or customize with your own variables
@use '@nuvoui/core' as NuvoUI with (
  $primary: #ff6f00,
  $column-count: 12,
  $enable-dark-mode: true,
  // Add more customizations as needed
);
```
### Option 2: Use Pre-compiled CSS

<link rel="stylesheet" href="node_modules/@nuvoui/core/dist/nuvoui.min.css">

## Usage Examples

### Example 1: Intuitive HTML Classes

```html
<div class="flex col gap-4 px-20 px-10@sm px-40@lg rounded-lg bg-primary text-white">
  <h2 class="font-bold text-xl">Responsive Layout Example</h2>
  <p>This container adapts to different screen sizes automatically.</p>
  <button class="btn">Click Me</button>
</div>
```

### Example 2: Elegant SCSS Mixins

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

### Example 3: Dark Mode Support

```html
<html data-theme="light">
  <head><!-- ... --></head>
  <body>
    <button onclick="document.documentElement.setAttribute('data-theme', 
      document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')">
      Toggle Dark Mode
    </button>
    
    <div class="card bg-surface text-on-surface">
      <!-- Content automatically adapts to light/dark mode -->
    </div>
  </body>
</html>
```

## Documentation

For complete documentation and examples, visit [NuvoUI.io](https://nuvoui.io/).

## Join the NuvoUI Community 🌟

We welcome developers of all levels to contribute, suggest features, or just give us a star ⭐️ on GitHub. Let's build something amazing together!

- **GitHub**: [NuvoUI Core](https://github.com/NuvoUI/core)
- **NPM**: [NuvoUI Core Package](https://www.npmjs.com/package/@nuvoui/core)
- **Discord**: [NuvoUI Community](https://discord.gg/nWGsbQKE)
- **Twitter**: [@NuvoUI](https://twitter.com/nuvoui)

## License

NuvoUI is open-source and licensed under the [MIT License](https://github.com/NuvoUI/core/blob/main/LICENSE).

Feel free to use NuvoUI in your projects—commercial or personal. Just don't forget to give us a shoutout when possible!

![Developer working with NuvoUI](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjV3ZDhyeWp0bno2aTBjMzd5bTltazg0Y29mM2czeDl1aHNxam8xbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yYSSBtDgbbRzq/giphy.webp)
![working](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjV3ZDhyeWp0bno2aTBjMzd5bTltazg0Y29mM2czeDl1aHNxam8xbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yYSSBtDgbbRzq/giphy.webp)
