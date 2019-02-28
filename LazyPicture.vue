<template>
  <div ref="picture-container" class="picture-container">
    <picture class="placeholder">
      <template v-if="pictureSources">
        <source
          :key="index"
          v-for="(item, index) of pictureSources"
          :media="item.media"
          :srcset="item.placeholder"
        />
      </template>
      <img
        @load="onPlaceholderLoad"
        ref="placeholder"
        :src="imgSources ? imgSources.placeholder : null"
        :alt="title"
      />
    </picture>
    <picture
      ref="picture"
      class="fullsize"
      :class="{ loaded: loaded && !loadedBeforePlaceholder }"
      v-if="intersected || !lazy"
    >
      <template v-if="pictureSources">
        <source
          :key="index"
          v-for="(item, index) of pictureSources"
          :media="item.media"
          :srcset="item.srcset"
        />
      </template>
      <img
        @load="onImageLoad"
        ref="image"
        v-show="loaded && !loadedBeforePlaceholder"
        :src="imgSources ? imgSources.src : null"
        :alt="title"
      />
    </picture>
    <canvas
      ref="canvas"
      :style="{
        transitionDuration: `${transitionDuration}ms`,
        transitionTimingFunction: `${easing}`
      }"
    ></canvas>
  </div>
</template>
<script>
const StackBlur = require("stackblur-canvas");
if (process.browser) {
  require("intersection-observer");
}
export default {
  props: {
    title: String,
    pictureSources: Array,
    imgSources: Object,
    lazy: {
      type: Boolean,
      default: false
    },
    blurRadius: {
      type: Number,
      default: 30
    },
    transitionDuration: {
      type: Number,
      default: 2000
    },
    easing: {
      type: String,
      default: "ease"
    }
  },
  data() {
    return {
      picture: null,
      observer: null,
      loaded: false,
      placeholderLoaded: false,
      loadedBeforePlaceholder: false,
      intersected: false,
      intersectionOptions: {
        root: null,
        rootMargin: "0px 0px 0px 0px",
        threshold: 0
      }
    };
  },
  methods: {
    onImageLoad() {
      if (!this.loaded) {
        this.loaded = true;
      } else {
        this.loadedBeforePlaceholder = true;
      }
    },
    onPlaceholderLoad() {
      this.loaded = false;
      if (!this.observer) {
        this.observer = new IntersectionObserver(entries => {
          const image = entries[0];
          if (image.isIntersecting) {
            this.intersected = true;
            this.observer.disconnect();
          }
        }, this.intersectionOptions);
        this.observer.observe(this.$el);
      }
      if (this.$refs.placeholder && !this.loaded) {
        StackBlur.image(
          this.$refs.placeholder,
          this.$refs.canvas,
          this.blurRadius,
          false
        );
      }
      if (this.loadedBeforePlaceholder) {
        this.loaded = true;
        this.loadedBeforePlaceholder = false;
      }
    }
  },
  destroyed() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
};
</script>
<style scoped>
.picture-container {
  position: relative;
}
canvas,
picture.fullsize {
  position: absolute;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
}
picture.fullsize.loaded + canvas {
  opacity: 0;
}
picture,
img {
  display: block;
  width: 100%;
}
picture.placeholder {
  opacity: 0;
}
</style>