# Vue Lazy Picture

Responsive Vue component for Medium-style lazy loading pictures.
Uses `intersection-observer` and `stackblur-canvas` internally.

## Demo

https://codesandbox.io/s/4jp678mw09

**Warning!**
You need to install `intersection-observer polyfill` separately to support IE and mobile browsers.

Creates sandwich of images in container:

```
<div class="lazy-picture">
  <img>    // placeholder
  <canvas> // blurred placeholder
  <img>    // full-size image
</div>
```

## Usage

Install by npm:
```
npm i vue-lazy-picture
```

Then in your vue app:

```
// App.vue

<template>
  <div id="app">
    <lazy-picture
      :src="image.src"
      :placeholder="image.ph"
      lazy
     />
  </div>
</template>
<script>
import LazyPicture from 'vue-lazy-picture';

export default {
  name: "app",
  components: {
    LazyPicture
  },
  data() {
    return {
      image: {
        ph: "./images/New_york_times_square-terabass_480@0x.jpg",
        src: "./images/New_york_times_square-terabass_480@1x.jpg",
      },
};
</script>
```
## Props

```
    containerBgColor: {
			type: String,
			default: "rgb(222, 222, 222)"
		},
		maxWidth: {
			type: String,
			default: "100%"
		},
		containerClass: {
			type: String,
			default: "lazy-picture"
		},
		title: {
			type: String,
			default: "Image"
		},
		placeholder: {
			type: String,
			required: true
		},
		src: {
			type: String,
			required: true
		},
		lazy: {
			type: Boolean,
			default: false
		},
		blurRadius: {
			type: Number,
			default: 5
		},
		transitionDuration: {
			type: Number,
			default: 500
		},
		easing: {
			type: String,
			default: "ease"
		},
		threshold: {
			type: Number,
			default: 0.5
		}
```