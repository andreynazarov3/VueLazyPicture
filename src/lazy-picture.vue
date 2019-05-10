<template>
	<div
		ref="container"
		:class="[containerClass]"
		:style="{ position: 'relative', maxWidth }"
	>
		<img
			ref="placeholder"
			:src="placeholder"
			@load="onPlaceholderLoad"
			:style="placeholderStyle"
      crossOrigin="anonymous"
		/>
		<canvas ref="canvas" :style="canvasStyle" />
		<img
			ref="picture"
			:alt="title"
			:src="getFullSizeSrc"
			@load="loaded = true"
			:style="getFullSizeImageStyle"
		/>
	</div>
</template>
<script>
import * as StackBlur from "./stackblur-canvas.js";
export default {
	props: {
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
			default: 2000
		},
		easing: {
			type: String,
			default: "ease"
		}
	},
	data() {
		return {
			loaded: false,
			observer: null,
			intersected: false,
			intersectionOptions: {
				root: null,
				rootMargin: "0px 0px 0px 0px",
				threshold: 0
			},
			canvasStyle: {
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%"
			},
			fullsizeImageStyleDefaults: {
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%"
			},
			placeholderStyle: {
				display: "block",
				width: "100%",
				opacity: 0
			}
		};
	},
	computed: {
		getFullSizeImageStyle() {
			return {
				...this.fullsizeImageStyleDefaults,
				opacity: this.loaded ? 1 : 0,
				transitionDuration: `${this.transitionDuration}ms`,
				transitionTimingFunction: `${this.easing}`
			};
		},
		getFullSizeSrc() {
			if (!this.lazy) {
				return this.src;
			}
			if (this.lazy && this.intersected) {
				return this.src;
			}
			return null;
		}
	},
	methods: {
		onPlaceholderLoad() {
			if (this.lazy) {
				this.createIntersectionObserver();
				this.createBlurredImage();
			}
		},
		createBlurredImage() {
			return StackBlur.image(
				this.$refs.placeholder,
				this.$refs.canvas,
				this.blurRadius,
				false
			);
		},
		createIntersectionObserver() {
			this.observer = new IntersectionObserver(entries => {
				const image = entries[0];
				if (image.isIntersecting) {
					this.intersected = true;
					this.observer.disconnect();
				}
			}, this.intersectionOptions);
			this.observer.observe(this.$el);
		}
	},
	beforeDestroy() {
		this.observer.disconnect();
	}
};
</script>