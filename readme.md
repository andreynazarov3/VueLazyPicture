# About

*NB: This is raw component, i don't think it's good idea to use it as is. But I hope it will be inspiration for your own implementation.
Suggested usage is for you to copy component code to your app, install dependences into your main app. Tweak component for your needs.*

Vue component for Medium-style lazy loading pictures.

Uses `<picture>` tag and `<canvas>` for blurred image.
Image detection by instersection observer API.

Demo: https://andreynazarov3.github.io/lazy-picture/dist/index.html

# Dependencies

- stackblur-canvas: draws blurred image to canvas
- intersection-observer: polyfill for iOS and others
