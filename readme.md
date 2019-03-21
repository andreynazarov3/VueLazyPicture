# About

Responsive Vue component for Medium-style lazy loading pictures.

Uses `<picture>` tag and `<canvas>` for blurred image.
Uses instersection observer API. (requires polyfill);
Uses `stackblur-canvas` to render blurred image.

Demo: https://andreynazarov3.github.io/lazy-picture/dist/index.html

# Usage

- Install component with npm: `npm i vue-lazy-picture -D`
- For older browers and iOS install intersection observer polyfill globally in your app.

Example with all possible props:

```
<lazy-picture
  :picture-sources="sources.picture"
  :img-sources="sources.img
  :title="Example Picture"
  :easing="'ease-out'"           // default 'ease'
  :transition-duration="1000"    // default '2000'
  :blur-radius="20"              // default '30'
  lazy                           // default 'false'
/>
```

If you don't care about responsivenes, you use only `img-sources` prop.
It is an object with full resolution src and small image to use for blurred image.
Example:

```
{
  src: "./images/New_york_times_square-terabass.jpg",
  placeholder: "./images/rsz_new_york_times_square-terabass-small.jpg"
}
```

But this component is designed to use full power of `<picture>` tag. So I encourage you to use `picture-sources`. It is an array of data to use in `<source>` tag.
So you see it that every source should have media query, srcset and placeholder (placeholder is needed as every source can have different aspect ratio);
Example:
```
[
  {
    media: "(max-width: 480px)",
    srcset:
      "./images/New_york_times_square-terabass_480@1x.jpg, ./images/New_york_times_square-terabass_480@2x.jpg 2x",
    placeholder: "./images/New_york_times_square-terabass_480@0x.jpg"
  },
  {
    media: "(min-width: 481px)",
    srcset: "./images/New_york_times_square-terabass.jpg",
    placeholder:
      "./images/rsz_new_york_times_square-terabass-small.jpg"
  }
]
```
