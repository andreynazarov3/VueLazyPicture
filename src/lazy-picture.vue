<template>
	<div ref="container" :class="[containerClass]" :style="getContainerStyle">
		<img
			ref="placeholder"
			:src="placeholder"
			@load="onPlaceholderLoad"
			:style="placeholderStyleDefaults"
			crossOrigin="anonymous"
		/>
		<canvas ref="canvas" :style="getCanvasStyle" />
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
		}
	},
	data() {
		return {
			blurReady: false,
			loaded: false,
			observer: null,
			intersected: false,
			intersectionOptions: {
				root: null,
				rootMargin: "0px 0px 0px 0px",
				threshold: 0
			},
			canvasStyleDefaults: {
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
			placeholderStyleDefaults: {
				display: "block",
				width: "100%",
				opacity: 0
			}
		};
	},
	computed: {
		getCanvasStyle() {
			return {
				...this.canvasStyleDefaults,
				transitionDuration: `${this.transitionDuration}ms`,
				transitionTimingFunction: `${this.easing}`,
				opacity: this.blurReady ? 1 : 0
			};
		},
		getContainerStyle() {
			return {
				position: "relative",
				maxWidth: this.maxWidth,
				backgroundColor: this.containerBgColor
			};
		},
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
			StackBlur.image(
				this.$refs.placeholder,
				this.$refs.canvas,
				this.blurRadius,
				false
			);
			this.blurReady = true;
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