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
//
//
//
//
//

var StackBlur = require("stackblur-canvas");
if (process.browser) {
  require("intersection-observer");
}
var script = {
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
  data: function data() {
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
    onImageLoad: function onImageLoad() {
      if (!this.loaded) {
        this.loaded = true;
      } else {
        this.loadedBeforePlaceholder = true;
      }
    },
    onPlaceholderLoad: function onPlaceholderLoad() {
      var this$1 = this;

      this.loaded = false;
      if (!this.observer) {
        this.observer = new IntersectionObserver(function (entries) {
          var image = entries[0];
          if (image.isIntersecting) {
            this$1.intersected = true;
            this$1.observer.disconnect();
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
  destroyed: function destroyed() {
    if (this.observer) {
      this.observer.disconnect();
    }
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

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) { style.element.setAttribute('media', css.media); }
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) { style.element.removeChild(nodes[index]); }
      if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
    }
  }
}

var browser = createInjector;

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"picture-container",staticClass:"picture-container"},[_c('picture',{staticClass:"placeholder"},[(_vm.pictureSources)?_vm._l((_vm.pictureSources),function(item,index){return _c('source',{key:index,attrs:{"media":item.media,"srcset":item.placeholder}})}):_vm._e(),_vm._v(" "),_c('img',{ref:"placeholder",attrs:{"src":_vm.imgSources ? _vm.imgSources.placeholder : null,"alt":_vm.title},on:{"load":_vm.onPlaceholderLoad}})],2),_vm._v(" "),(_vm.intersected || !_vm.lazy)?_c('picture',{ref:"picture",staticClass:"fullsize",class:{ loaded: _vm.loaded && !_vm.loadedBeforePlaceholder }},[(_vm.pictureSources)?_vm._l((_vm.pictureSources),function(item,index){return _c('source',{key:index,attrs:{"media":item.media,"srcset":item.srcset}})}):_vm._e(),_vm._v(" "),_c('img',{directives:[{name:"show",rawName:"v-show",value:(_vm.loaded && !_vm.loadedBeforePlaceholder),expression:"loaded && !loadedBeforePlaceholder"}],ref:"image",attrs:{"src":_vm.imgSources ? _vm.imgSources.src : null,"alt":_vm.title},on:{"load":_vm.onImageLoad}})],2):_vm._e(),_vm._v(" "),_c('canvas',{ref:"canvas",style:({
      transitionDuration: (_vm.transitionDuration + "ms"),
      transitionTimingFunction: ("" + _vm.easing)
    })})])};
var __vue_staticRenderFns__ = [];

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-af91fb1e_0", { source: ".picture-container[data-v-af91fb1e]{position:relative}canvas[data-v-af91fb1e],picture.fullsize[data-v-af91fb1e]{position:absolute;top:0;left:0;width:100%!important;height:100%!important}picture.fullsize.loaded+canvas[data-v-af91fb1e]{opacity:0}img[data-v-af91fb1e],picture[data-v-af91fb1e]{display:block;width:100%}picture.placeholder[data-v-af91fb1e]{opacity:0}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-af91fb1e";
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var component = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
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
