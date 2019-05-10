//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var StackBlur = require("./stackblur-canvas.js");
if (process.browser) {
	require("intersection-observer");
}
var script = {
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
	data: function data() {
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
		getFullSizeImageStyle: function getFullSizeImageStyle() {
			return Object.assign({}, this.fullsizeImageStyleDefaults,
				{opacity: this.loaded ? 1 : 0,
				transitionDuration: ((this.transitionDuration) + "ms"),
				transitionTimingFunction: ("" + (this.easing))});
		},
		getFullSizeSrc: function getFullSizeSrc() {
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
		onPlaceholderLoad: function onPlaceholderLoad() {
			if (this.lazy) {
				this.createIntersectionObserver();
				this.createBlurredImage();
			}
		},
		createBlurredImage: function createBlurredImage() {
			return StackBlur.image(
				this.$refs.placeholder,
				this.$refs.canvas,
				this.blurRadius,
				false
			);
		},
		createIntersectionObserver: function createIntersectionObserver() {
			var this$1 = this;

			this.observer = new IntersectionObserver(function (entries) {
				var image = entries[0];
				if (image.isIntersecting) {
					this$1.intersected = true;
					this$1.observer.disconnect();
				}
			}, this.intersectionOptions);
			this.observer.observe(this.$el);
		}
	},
	beforeDestroy: function beforeDestroy() {
		this.observer.disconnect();
	}
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"container",class:[_vm.containerClass],style:({ position: 'relative', maxWidth: _vm.maxWidth })},[_c('img',{ref:"placeholder",style:(_vm.placeholderStyle),attrs:{"src":_vm.placeholder},on:{"load":_vm.onPlaceholderLoad}}),_vm._v(" "),_c('canvas',{ref:"canvas",style:(_vm.canvasStyle)}),_vm._v(" "),_c('img',{ref:"picture",style:(_vm.getFullSizeImageStyle),attrs:{"alt":_vm.title,"src":_vm.getFullSizeSrc},on:{"load":function($event){_vm.loaded = true;}}})])};
var __vue_staticRenderFns__ = [];

  /* style */
  var __vue_inject_styles__ = undefined;
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var component = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

// Import vue component

// install function executed by Vue.use()
function install(Vue) {
  if (install.installed) { return; }
  install.installed = true;
  Vue.component('LazyPicture', component);
}

// Create module definition for Vue.use()
var plugin = {
  install: install,
};

// To auto-install when vue is found
/* global window global */
var GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

// Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()
component.install = install;

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default component;
