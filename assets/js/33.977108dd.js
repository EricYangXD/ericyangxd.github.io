(window.webpackJsonp=window.webpackJsonp||[]).push([[33],{516:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));n(42),n(41);var r=n(97);function c(){var e=Object(r.d)();if(!e)throw new Error("must be called in setup");return e||{}}},544:function(e,t,n){},569:function(e,t,n){"use strict";n(544)},580:function(e,t,n){"use strict";n.r(t);var r=n(93),c=n(78),i=(n(50),n(57),n(125),n(168)),s=n(56),a=n(516),u=Object(i.b)({setup:function(e,t){var n=Object(a.a)();return{headers:Object(i.a)((function(){return n.$showSubSideBar?n.$page.headers:[]})),isLinkActive:function(e){var t=Object(s.e)(n.$route,n.$page.path+"#"+e.slug);return t&&setTimeout((function(){document.querySelector(".reco-side-".concat(e.slug)).scrollIntoView()}),300),t}}},render:function(e){var t=this;return e("ul",{class:{"sub-sidebar-wrapper":!0},style:{width:this.headers.length>0?"12rem":"0"}},Object(c.a)(this.headers.map((function(n){return e("li",{class:Object(r.a)({active:t.isLinkActive(n)},"level-".concat(n.level),!0),attr:{key:n.title}},[e("router-link",{class:Object(r.a)({"sidebar-link":!0},"reco-side-".concat(n.slug),!0),props:{to:"".concat(t.$page.path,"#").concat(n.slug)}},n.title)])}))))}}),o=(n(569),n(7)),l=Object(o.a)(u,void 0,void 0,!1,null,"cb1513f6",null);t.default=l.exports}}]);