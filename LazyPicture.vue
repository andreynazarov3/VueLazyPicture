<template>
  <div class="picture-container">
    <picture class="placeholder">
      <source 
        :key="source.sys.id"
        v-if="source.fields.media" 
        v-for="source in sources"
        :media="source.fields.media" 
        :srcset="source.fields.placeholder"
      >  
      <img 
        ref="placeholder"
        v-if="baseImage"
        :src="baseImage.fields.placeholder" 
        :alt="title"
      >
    </picture>
    <picture class="fullsize" v-if="intersected" :class="{show: loaded}">
      <source 
        :key="source.sys.id"
        v-if="source.fields.media" 
        v-for="source in sources"
        :media="source.fields.media" 
        :srcset="source.fields.srcset"
      >  
      <img 
        @load="onImageLoad"
        ref="image"
        v-if="baseImage"
        :src="baseImage.fields.src" 
        :alt="title"
      >
    </picture>
    <canvas ref="canvas"  :class="{hide: loaded}"></canvas>
  </div>
</template>
<script>
const StackBlur = require("stackblur-canvas");
if (process.browser) {
  require('intersection-observer');
}
export default {
  props: {
    title: String,
    sources: Array,
  },
  data() {
    return {
      observer: null,
      loaded: false,
      intersected: false,
      blurRadius: 30,
    };
  },
  computed: {
    baseImage: function() {
      return this.sources.find(source => source.fields.src);
    },
  },
  methods: {
    onImageLoad() {
      this.loaded = true;
      console.log("loaded", this.$refs.image);
    },
  },
  mounted() {
    StackBlur.image(this.$refs.placeholder, this.$refs.canvas, this.blurRadius, false);
    this.observer = new IntersectionObserver(entries => {
      const image = entries[0];
      if (image.isIntersecting) {
        this.intersected = true;
        this.observer.disconnect();
        console.log("intersect", image.target);
      }
    }, this.intersectionOptions);

    this.observer.observe(this.$el);
  },
  destroyed() {
    this.observer.disconnect();
  },
};
</script>
<style scoped lang="scss">
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
  transition: opacity 1000ms ease;
}
canvas {
  &.hide {
    opacity: 0;
  }
}
picture {
  display: block;
  &.placeholder {
    opacity: 0;
  }
  &.fullsize {
    opacity: 0;
    &.show {
      opacity: 1;
    }
  }
}
img {
  display: block;
}
</style>
