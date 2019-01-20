# About

Vue component for Medium-style lazy loading pictures.

Uses `<picture>` tag and `<canvas>` for blurred image.
Image detection by instersection observer API.

Created for using with contentful.com api initially, that why `fields` and `sys` are used as object property names.

Demo: https://andreynazarov3.github.io/lazy-picture/dist/index.html

```
<template>
	<div id="app">
		<lazy-picture :key="index" v-for="(index) of [1,2,3,4,5]" :sources="sources" :lazy="true"></lazy-picture>
	</div>
</template>

<script>
import lazyPicture from "./components/LazyPicture.vue";

export default {
	name: "app",
	components: {
		lazyPicture
	},
	data() {
		return {
			sources: [
				{
					fields: {
						src: "./images/New_york_times_square-terabass.jpg",
						placeholder: "./images/rsz_new_york_times_square-terabass-small.jpg"
					},
					sys: {
						id: "1"
					}
				}
			]
		};
	}
};
</script>
```

# Dependencies

- stackblur-canvas: draws blurred image to canvas
- intersection-observer: polyfill for iOS and others
- gsap: opacity animation

# Props

- `title (String)` - alt attribute for image
- `sources (Array)` - array of image source objects.
- `lazy (Boolean)` - should image loading be lazy or not

Image source object schema:

```lang=json
{
  fields: {
    media: String - ex. (max-width: 480px)
    src: String (for Base Image without media query)
    srcset: String - ex. image.jpg, image@2x.jpg
    placeholder: String (path for low-res image)
  },
  sys: {
    id: String
  }
}
```

# Note

_Base Image_ - is an image that will be placed in `<img>` tag inside `<picture>`. It will be used when no media queries are suitable and also as a fallback image for older browsers.

`src` property should be only in one source object. It is used to determine base image.

```lang="javascript"
baseImage: function() {
      return this.sources.find(source => source.fields.src);
    },
```
