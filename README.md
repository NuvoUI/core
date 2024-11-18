# NuvoUI

[![](https://dcbadge.limes.pink/api/server/nWGsbQKE?style=flat&theme=default-inverted)](https://discord.gg/nWGsbQKE)


NuvoUI isn’t your next shiny, over-engineered UI library. It’s raw, lightweight, and built for one thing: delivering responsive, clean designs fast. If you’re tired of bloated frameworks slowing you down, welcome to NuvoUI.

---

## Why NuvoUI?

> Simple to start, grows with you.

We do not like prefixes. Why make a button like this

```html
<button class="btn btn-lg btn-primary btn-round py-40" >...
```

when you can have, this

```html
<button class="btn lg primary pill outline py-40" >...
```

But wait, there is more... lets make it fully responsive
```html
<button class="btn lg primary pill outline 
    py-40
    py-20@sm
    py-80@lg
    outline" >...
```
This will be

1. Use `padding-left: 40px;` and `padding-right: 40px;` as base
2. Use `padding-left: 20px;` and `padding-right: 20px;` @ small screen
3. Use `padding-left: 80px;` and `padding-right: 80px;` @ large screen

see this feels easy to us to remember ...



---

## How to Use It

1. **Install via npm**  
   ```bash
   npm install @nuvoui/core
   - or
   pnpm install @nuvoui/core
   ```

2. **Import SASS**

    ```scss
    @use '@nuvoui/core/src/styles/index.scss' as NuvoUI with (
        $column-count: 25,
        $color-dark: #1A1A1A,
        $color-warning: #F8AF08,
        $color-success: #34C759,
        ...
    );
    ```


Another example

```scss
img:nth-child(1) {
    @include NuvoUI.mx-auto;
    @include NuvoUI.my(40);
    @include NuvoUI.animate-move((
        horizontal: 3%,
        duration: 25s,
    ));
}
```

will result in (*psst: dont worry, we are using caching...*)
```css
img:nth-child(1) {
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px !important;
  margin-bottom: 40px !important;
  animation: anim-bounce-0per-3per 25s ease-in-out infinite;
}
@keyframes anim-bounce-0per-3per {
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



## There are so many things to do, and we do need to make a documentation. Stay tuned...

![working](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjV3ZDhyeWp0bno2aTBjMzd5bTltazg0Y29mM2czeDl1aHNxam8xbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yYSSBtDgbbRzq/giphy.webp)