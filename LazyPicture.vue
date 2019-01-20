<template>
  <div ref="picture-container" class="picture-container">
    <picture class="placeholder">
				<source
        :key="source.sys.id"        
        v-for="source in sources"
        :media="source.fields.media" 
        :srcset="source.fields.placeholder"
      >  
      <img         
        @load="onPlaceholderLoad"
        ref="placeholder"
        v-if="baseImage"
        :src="baseImage.fields.placeholder" 
        :alt="title"
      >
    </picture>
    <picture ref="picture" class="fullsize" v-if="intersected || !lazy">
      <source 
        :key="source.sys.id"
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
    <canvas ref="canvas"></canvas>
  </div>
</template>
<script>
const StackBlur = require("stackblur-canvas");
let TweenMax;
let TimelineMax;
if (process.browser) {
	require("intersection-observer");
	TweenMax = window.TweenMax;
	TimelineMax = window.TimelineMax;
}
export default {
	props: {
		title: String,
		sources: Array,
		lazy: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			picture: null,
			observer: null,
			loaded: false,
			intersected: false,
			faded: false,
			blurRadius: 30,
			intersectionOptions: {
				root: null,
				rootMargin: "0px 0px 0px 0px",
				threshold: 0
			}
		};
	},
	computed: {
		baseImage: function() {
			return this.sources.find(source => source.fields.src);
		}
	},
	watch: {
		intersected: function(val) {
			if (val === true) {
				this.onIntersect();
			}
		}
	},
	methods: {
		fadeOutCanvas() {
			new TimelineMax().delay(0.5).to(this.$refs.canvas, 1, {
				autoAlpha: 0
			});
		},
		onIntersect() {
			if (this.loaded && !this.faded) {
				this.fadeOutCanvas();
				this.faded = true;
			}
		},
		onImageLoad() {
			if (this.$refs.image && this.intersected && !this.faded) {
				this.fadeOutCanvas();
			}
			this.loaded = true;
		},
		onPlaceholderLoad() {
			this.observer = new IntersectionObserver(entries => {
				const image = entries[0];
				if (image.isIntersecting) {
					this.intersected = true;
					this.observer.disconnect();
				}
			}, this.intersectionOptions);
			this.observer.observe(this.$el);

			if (this.$refs.placeholder && !this.loaded) {
				StackBlur.image(
					this.$refs.placeholder,
					this.$refs.canvas,
					this.blurRadius,
					false
				);
				new TweenMax(this.$refs.canvas, 0, {
					autoAlpha: 1
				});
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
}
canvas {
	opacity: 0;
}
picture {
	display: block;
	width: 100%;
	&.placeholder {
		opacity: 0;
	}
}
img {
	display: block;
	width: 100%;
}
.banner img {
	height: 100%;
	width: 100%;
	object-fit: cover;
}
</style>