# NuvoUI

[![GitHub stars](https://img.shields.io/github/stars/NuvoUI/core?style=social)](https://github.com/NuvoUI/core)
[![GitHub forks](https://img.shields.io/github/forks/NuvoUI/core?style=social)](https://github.com/NuvoUI/core)
[![npm version](https://img.shields.io/npm/v/@nuvoui/core)](https://www.npmjs.com/package/@nuvoui/core)
[![](https://dcbadge.limes.pink/api/server/nWGsbQKE?style=flat&theme=default-inverted)](https://discord.gg/nWGsbQKE)

## Welcome to NuvoUI 🎉

NuvoUI is a modern, human-friendly SCSS framework designed for developers who value simplicity, flexibility, and performance. Whether you're a seasoned CSS wizard or just getting started, NuvoUI makes building responsive, performant, and visually stunning web designs a breeze.


## Why Choose NuvoUI?

✨ **Natural Language-Like Syntax**  
Write CSS that feels intuitive and effortless. Use classes like `px-20` for padding or `px-20@lg` for responsive styles—all without breaking a sweat.

🔥 **Fully Mixin-Based**  
Seamlessly integrate NuvoUI into your SCSS pipeline. Write reusable, modular, and clean SCSS code with our powerful mixins.

🚀 **Optimized Animations**  
Define animations on the fly. NuvoUI caches animations intelligently, ensuring your code stays DRY (Don't Repeat Yourself).



## Key Features

- **Dynamic Responsive Design**: Use `@lg`, `@sm`, etc., to generate responsive styles with ease.
- **Flexible Animations**: Create complex animations with simple mixins like `@include NuvoUI.animate-bounce((horizontal: 3%, duration: 25s))`.
- **Developer-First Approach**: NuvoUI is built by developers for developers, offering the flexibility to build custom solutions effortlessly.
- **Simple Installation**: Get started with a single command via npm.

---

## Installation

To start using NuvoUI, install it via npm or pnpm:

```bash
npm instal @nuvoui/core 
 // or
pnpm install @nuvoui/core
```



## Usage Examples

### Example 1: Intuitive HTML Classes

```html
<div class=" 
    px-40
    px-20@sm
    px-80@lg
">
  Responsive Padding Example
</div>
```

### Example 2: Elegant SCSS Mixins

```scss
img:nth-child(1) {
    @include NuvoUI.mx-auto;
    @include NuvoUI.my(40);
    @include NuvoUI.animate-bounce((
        horizontal: 3%,
        duration: 25s,
    ));
}
```

Generated CSS:

```css
img:nth-child(1) {
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px !important;
  margin-bottom: 40px !important;
  animation: anim-bounce-0p-3per 25s ease-in-out infinite;
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



## Join the NuvoUI Community 🌟

We welcome developers of all levels to contribute, suggest features, or just give us a star ⭐️ on GitHub. Let’s build something amazing together!

- GitHub: [NuvoUI Core](https://github.com/NuvoUI/core)
- NPM: [NuvoUI Core Package](https://www.npmjs.com/package/@nuvoui/core)
- DISOCRD: [NuvoUI Discord](https://discord.gg/nWGsbQKE)


## License


NuvoUI is open-source and licensed under the [MIT License](https://github.com/NuvoUI/core/blob/main/LICENSE).

Feel free to use NuvoUI in your projects—commercial or personal. Just don't forget to give us a shoutout when possible!

![working](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjV3ZDhyeWp0bno2aTBjMzd5bTltazg0Y29mM2czeDl1aHNxam8xbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yYSSBtDgbbRzq/giphy.webp)
