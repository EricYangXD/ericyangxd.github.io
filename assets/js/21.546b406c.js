(window.webpackJsonp=window.webpackJsonp||[]).push([[21,32],{506:function(e,t,o){"use strict";o.d(t,"b",(function(){return b})),o.d(t,"a",(function(){return y}));var n=o(508),r=o.n(n),a=o(25),c=o(26),i=o(168),s=o(167),u=o(40),l=(o(277),o(6),o(166),o(76),o(20),o(48),o(49),o(125),o(169),o(507),o(0)),d=o(9),f=function(e,t,o,n){var r,a=arguments.length,c=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"===("undefined"==typeof Reflect?"undefined":Object(u.a)(Reflect))&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,o,n);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(c=(a<3?r(c):a>3?r(t,o,c):r(t,o))||c);return a>3&&c&&Object.defineProperty(t,o,c),c},h=/^(\w+)\-/,p=function(e){Object(i.a)(o,e);var t=Object(s.a)(o);function o(){return Object(a.a)(this,o),t.apply(this,arguments)}return Object(c.a)(o,[{key:"getClass",value:function(e){return h.test(e)?e.replace(h,(function(){return"reco"===(arguments.length<=1?void 0:arguments[1])?"iconfont ".concat(arguments.length<=0?void 0:arguments[0]):"".concat(arguments.length<=1?void 0:arguments[1]," ").concat(arguments.length<=0?void 0:arguments[0])})):e}},{key:"go",value:function(e){""!==e&&window.open(e)}},{key:"render",value:function(){var e=arguments[0];return e("i",r()([{},{class:this.getClass(this.icon),on:{click:this.go.bind(this,this.link)}}]),[this.$slots.default])}}]),o}(l.default.extend({props:{icon:{type:String,default:""},link:{type:String,default:""}}})),b=p=f([d.b],p),v=o(16),g=function(e,t,o,n){var r,a=arguments.length,c=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"===("undefined"==typeof Reflect?"undefined":Object(u.a)(Reflect))&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,o,n);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(c=(a<3?r(c):a>3?r(t,o,c):r(t,o))||c);return a>3&&c&&Object.defineProperty(t,o,c),c},m=function(e){Object(i.a)(o,e);var t=Object(s.a)(o);function o(){return Object(a.a)(this,o),t.apply(this,arguments)}return Object(c.a)(o,[{key:"setStyle",value:function(e){e.style.transition="transform ".concat(this.duration,"s ease-in-out ").concat(this.delay,"s, opacity ").concat(this.duration,"s ease-in-out ").concat(this.delay,"s"),e.style.transform=this.transform[0],e.style.opacity=0}},{key:"unsetStyle",value:function(e){e.style.transform=this.transform[1],e.style.opacity=1}},{key:"render",value:function(){var e=arguments[0];return e("transition",{attrs:Object(v.a)({},{name:"module"}),on:Object(v.a)({},{enter:this.setStyle,appear:this.setStyle,"before-leave":this.setStyle,"after-appear":this.unsetStyle,"after-enter":this.unsetStyle})},[this.$slots.default])}}]),o}(l.default.extend({props:{delay:{type:String,default:"0"},duration:{type:String,default:".25"},transform:{type:Array,default:function(){return["translateY(-20px)","translateY(0)"]}}}})),y=m=g([d.b],m)},507:function(e,t,o){"use strict";var n=o(1),r=o(509);n({target:"String",proto:!0,forced:o(510)("link")},{link:function(e){return r(this,"a","href",e)}})},508:function(e,t,o){"use strict";function n(){return(n=Object.assign||function(e){for(var t,o=1;o<arguments.length;o++)for(var n in t=arguments[o])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e}).apply(this,arguments)}var r=["attrs","props","domProps"],a=["class","style","directives"],c=["on","nativeOn"],i=function(e,t){return function(){e&&e.apply(this,arguments),t&&t.apply(this,arguments)}};e.exports=function(e){return e.reduce((function(e,t){for(var o in t)if(e[o])if(-1!==r.indexOf(o))e[o]=n({},e[o],t[o]);else if(-1!==a.indexOf(o)){var s=e[o]instanceof Array?e[o]:[e[o]],u=t[o]instanceof Array?t[o]:[t[o]];e[o]=s.concat(u)}else if(-1!==c.indexOf(o))for(var l in t[o])if(e[o][l]){var d=e[o][l]instanceof Array?e[o][l]:[e[o][l]],f=t[o][l]instanceof Array?t[o][l]:[t[o][l]];e[o][l]=d.concat(f)}else e[o][l]=t[o][l];else if("hook"==o)for(var h in t[o])e[o][h]=e[o][h]?i(e[o][h],t[o][h]):t[o][h];else e[o]=t[o];else e[o]=t[o];return e}),{})}},509:function(e,t,o){var n=o(2),r=o(23),a=o(13),c=/"/g,i=n("".replace);e.exports=function(e,t,o,n){var s=a(r(e)),u="<"+t;return""!==o&&(u+=" "+o+'="'+i(a(n),c,"&quot;")+'"'),u+">"+s+"</"+t+">"}},510:function(e,t,o){var n=o(3);e.exports=function(e){return n((function(){var t=""[e]('"');return t!==t.toLowerCase()||t.split('"').length>3}))}},528:function(e,t,o){},543:function(e,t,o){"use strict";o.d(t,"a",(function(){return a}));o(77);var n={light:{"--default-color-10":"rgba(255, 255, 255, 1)","--default-color-9":"rgba(255, 255, 255, .9)","--default-color-8":"rgba(255, 255, 255, .8)","--default-color-7":"rgba(255, 255, 255, .7)","--default-color-6":"rgba(255, 255, 255, .6)","--default-color-5":"rgba(255, 255, 255, .5)","--default-color-4":"rgba(255, 255, 255, .4)","--default-color-3":"rgba(255, 255, 255, .3)","--default-color-2":"rgba(255, 255, 255, .2)","--default-color-1":"rgba(255, 255, 255, .1)","--background-color":"#fff","--box-shadow":"0 1px 8px 0 rgba(0, 0, 0, 0.1)","--box-shadow-hover":"0 2px 16px 0 rgba(0, 0, 0, 0.2)","--text-color":"#242424","--text-color-sub":"#7F7F7F","--border-color":"#eaecef","--code-color":"rgba(27, 31, 35, 0.05)","--mask-color":"#888"},dark:{"--default-color-10":"rgba(0, 0, 0, 1)","--default-color-9":"rgba(0, 0, 0, .9)","--default-color-8":"rgba(0, 0, 0, .8)","--default-color-7":"rgba(0, 0, 0, .7)","--default-color-6":"rgba(0, 0, 0, .6)","--default-color-5":"rgba(0, 0, 0, .5)","--default-color-4":"rgba(0, 0, 0, .4)","--default-color-3":"rgba(0, 0, 0, .3)","--default-color-2":"rgba(0, 0, 0, .2)","--default-color-1":"rgba(0, 0, 0, .1)","--background-color":"#181818","--box-shadow":"0 1px 8px 0 rgba(0, 0, 0, .6)","--box-shadow-hover":"0 2px 16px 0 rgba(0, 0, 0, .7)","--text-color":"rgba(255, 255, 255, .8)","--text-color-sub":"#8B8B8B","--border-color":"rgba(0, 0, 0, .3)","--code-color":"rgba(0, 0, 0, .3)","--mask-color":"#000"}};function r(e){var t=document.querySelector(":root"),o=n[e],r="dark"===e?"light":"dark";for(var a in o)t.style.setProperty(a,o[a]);t.classList.remove(r),t.classList.add(e)}function a(e){if("auto"===e){var t=window.matchMedia("(prefers-color-scheme: dark)").matches,o=window.matchMedia("(prefers-color-scheme: light)").matches;if(t&&r("dark"),o&&r("light"),!t&&!o){console.log("You specified no preference for a color scheme or your browser does not support it. I schedule dark mode during night time.");var n=(new Date).getHours();r(n<6||n>=18?"dark":"light")}}else r(e)}},549:function(e,t,o){"use strict";o(528)},550:function(e,t,o){},567:function(e,t,o){"use strict";o.r(t);var n=o(543),r={name:"ModeOptions",data:function(){return{modeOptions:[{mode:"dark",title:"dark"},{mode:"auto",title:"auto"},{mode:"light",title:"light"}],currentMode:"auto"}},mounted:function(){this.currentMode=localStorage.getItem("mode")||this.$themeConfig.mode||"auto";var e=this;window.matchMedia("(prefers-color-scheme: dark)").addListener((function(){"auto"===e.$data.currentMode&&Object(n.a)(e.$data.currentMode)})),window.matchMedia("(prefers-color-scheme: light)").addListener((function(){"auto"===e.$data.currentMode&&Object(n.a)(e.$data.currentMode)})),Object(n.a)(this.currentMode)},methods:{selectMode:function(e){e!==this.currentMode&&(this.currentMode=e,Object(n.a)(e),localStorage.setItem("mode",e))},getClass:function(e){return e!==this.currentMode?e:"".concat(e," active")}}},a=(o(549),o(7)),c=Object(a.a)(r,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"mode-options"},[o("h4",{staticClass:"title"},[e._v("Choose mode")]),e._v(" "),o("ul",{staticClass:"color-mode-options"},e._l(e.modeOptions,(function(t,n){return o("li",{key:n,class:e.getClass(t.mode),on:{click:function(o){return e.selectMode(t.mode)}}},[e._v(e._s(t.title))])})),0)])}),[],!1,null,null,null);t.default=c.exports},574:function(e,t){function o(e){return"function"==typeof e.value||(console.warn("[Vue-click-outside:] provided expression",e.expression,"is not a function."),!1)}function n(e){return void 0!==e.componentInstance&&e.componentInstance.$isServer}e.exports={bind:function(e,t,r){if(!o(t))return;function a(t){if(r.context){var o=t.path||t.composedPath&&t.composedPath();o&&o.length>0&&o.unshift(t.target),e.contains(t.target)||function(e,t){if(!e||!t)return!1;for(var o=0,n=t.length;o<n;o++)try{if(e.contains(t[o]))return!0;if(t[o].contains(e))return!1}catch(e){return!1}return!1}(r.context.popupItem,o)||e.__vueClickOutside__.callback(t)}}e.__vueClickOutside__={handler:a,callback:t.value};const c="ontouchstart"in document.documentElement?"touchstart":"click";!n(r)&&document.addEventListener(c,a)},update:function(e,t){o(t)&&(e.__vueClickOutside__.callback=t.value)},unbind:function(e,t,o){const r="ontouchstart"in document.documentElement?"touchstart":"click";!n(o)&&e.__vueClickOutside__&&document.removeEventListener(r,e.__vueClickOutside__.handler),delete e.__vueClickOutside__}}},575:function(e,t,o){"use strict";o(550)},601:function(e,t,o){"use strict";o.r(t);var n=o(506),r=o(574),a=o.n(r),c=o(567),i=o(543),s={name:"UserSettings",directives:{"click-outside":a.a},components:{ModePicker:c.default,RecoIcon:n.b,ModuleTransition:n.a},data:function(){return{showMenu:!1}},mounted:function(){var e=this.$themeConfig.mode||"auto";!1===this.$themeConfig.modePicker&&("auto"===e&&(window.matchMedia("(prefers-color-scheme: dark)").addListener((function(){Object(i.a)(e)})),window.matchMedia("(prefers-color-scheme: light)").addListener((function(){Object(i.a)(e)}))),Object(i.a)(e))},methods:{hideMenu:function(){this.showMenu=!1}}},u=(o(575),o(7)),l=Object(u.a)(s,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return!1!==e.$themeConfig.modePicker?o("div",{directives:[{name:"click-outside",rawName:"v-click-outside",value:e.hideMenu,expression:"hideMenu"}],staticClass:"color-picker"},[o("a",{staticClass:"color-button",on:{click:function(t){t.preventDefault(),e.showMenu=!e.showMenu}}},[o("reco-icon",{attrs:{icon:"reco-color"}})],1),e._v(" "),o("ModuleTransition",{attrs:{transform:["translate(-50%, 0)","translate(-50%, -10px)"]}},[o("div",{directives:[{name:"show",rawName:"v-show",value:e.showMenu,expression:"showMenu"}],staticClass:"color-picker-menu"},[o("ModePicker")],1)])],1):e._e()}),[],!1,null,null,null);t.default=l.exports}}]);