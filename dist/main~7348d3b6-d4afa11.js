(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{134:function(t,r,n){"use strict";var e=n(21),o={tms:"TILE"};function i(t){return new Promise((function(r,n){var o=new XMLHttpRequest;o.onreadystatechange=function(){if(4===o.readyState&&200===o.status&&o.responseText)try{r(JSON.parse(o.responseText))}catch(t){n(t)}},o.open("GET",Object(e.c)(t),!0),o.send()}))}var u=function(){return(u=Object.assign||function(t){for(var r,n=1,e=arguments.length;n<e;n++)for(var o in r=arguments[n])Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o]);return t}).apply(this,arguments)},a=function(t,r,n,e){return new(n||(n=Promise))((function(o,i){function u(t){try{c(e.next(t))}catch(t){i(t)}}function a(t){try{c(e.throw(t))}catch(t){i(t)}}function c(t){var r;t.done?o(t.value):(r=t.value,r instanceof n?r:new n((function(t){t(r)}))).then(u,a)}c((e=e.apply(t,r||[])).next())}))},c=function(t,r){var n,e,o,i,u={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(i){return function(a){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;u;)try{if(n=1,e&&(o=2&i[0]?e.return:i[0]?e.throw||((o=e.return)&&o.call(e),0):e.next)&&!(o=o.call(e,i[1])).done)return o;switch(e=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return u.label++,{value:i[1],done:!1};case 5:u.label++,e=i[1],i=[0];continue;case 7:i=u.ops.pop(),u.trys.pop();continue;default:if(!(o=u.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){u=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){u.label=i[1];break}if(6===i[0]&&u.label<o[1]){u.label=o[1],o=i;break}if(o&&u.label<o[2]){u.label=o[2],u.ops.push(i);break}o[2]&&u.ops.pop(),u.trys.pop();continue}i=r.call(t,u)}catch(t){i=[6,t],e=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,a])}}};function s(t,r){return void 0===r&&(r="https://qms.nextgis.com"),function(){function n(t,r){this.map=t,this.options=r,this.options.baseLayer=!0}return n.prototype.addLayer=function(s){return a(this,void 0,void 0,(function(){var a,f,p,l,y;return c(this,(function(c){switch(c.label){case 0:if(this.qms||!s.qmsId)return[3,4];c.label=1;case 1:return c.trys.push([1,3,,4]),a=this,[4,i(r+"/api/v1/geoservices/"+s.qmsId)];case 2:return a.qms=c.sent(),[3,4];case 3:return f=c.sent(),console.error(f),[3,4];case 4:return(p=this.qms)&&(l=o[p.type||"tms"],(y=t.mapAdapter.layerAdapters[l])&&(Object(e.d)(n,y,["showLayer","hideLayer"]),"TILE"===l))?(s=u(u({maxZoom:t.options.maxZoom,minZoom:t.options.minZoom},this.options),function(t){var r=("https:"===location.protocol?"https":"http")+"://";return{url:t.url.replace(/^(https?|ftp):\/\//,r),name:t.name,attribution:t.copyright_text,maxZoom:t.z_max,minZoom:t.z_min}}(p)),this.options=s,[2,new y(this.map,s).addLayer(s)]):[2]}}))}))},n}()}var f=function(){return(f=Object.assign||function(t){for(var r,n=1,e=arguments.length;n<e;n++)for(var o in r=arguments[n])Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o]);return t}).apply(this,arguments)},p=function(){function t(t){this.options={url:"https://qms.nextgis.com"},this.options=f(f({},this.options),t),this.url=this.options.url}return t.prototype.getLayerAdapters=function(){var t=this;return Promise.resolve([{name:"QMS",createAdapter:function(r){return Promise.resolve(t._createAdapter(r))}}])},t.prototype._createAdapter=function(t){return s(t,this.url)},t.utils={createQmsAdapter:s},t}();r.a=p},32:function(t,r,n){"use strict";n.d(r,"a",(function(){return a})),n.d(r,"b",(function(){return c})),n.d(r,"c",(function(){return s}));var e=n(21),o=function(){return(o=Object.assign||function(t){for(var r,n=1,e=arguments.length;n<e;n++)for(var o in r=arguments[n])Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o]);return t}).apply(this,arguments)};function i(t,r,n){if((r=String(r))===(t=String(t)))return!0;if(n&&r.toUpperCase()===t.toUpperCase())return!0;var o=("^"+Object(e.e)(r)+"$").replace(/%/g,".*").replace("_",".");return null!==new RegExp(o,n?"i":"").exec(t)}var u={gt:function(t,r){return t>r},lt:function(t,r){return t<r},ge:function(t,r){return t>=r},le:function(t,r){return t<=r},eq:function(t,r){return t===r},ne:function(t,r){return t!==r},in:function(t,r){return-1!==r.indexOf(t)},notin:function(t,r){return-1===r.indexOf(t)},like:function(t,r){return i(t,r)},ilike:function(t,r){return i(t,r,!0)}};function a(t){var r=t;return 3===r.length&&"string"==typeof r[0]&&"string"==typeof r[1]}function c(t,r){var n=o({},t.properties);return!!n&&(n.$id=t.id,s(n,r))}function s(t,r){var n="string"==typeof r[0]?r[0]:"all",e=function(r){if(a(r)){var n=r[0],e=r[1],o=r[2],i=u[e];if(i){if("like"===e||"ilike"===e){var c="",f=n.replace(/^%?(\w+)%?$/,(function(r,e){return c=t[e],n.replace(e,o)}));return i(c,f)}return i(t[n],o)}return!1}return s(t,r)},o=r.filter((function(t){return Array.isArray(t)}));return"any"===n?o.some(e):o.every(e)}},67:function(t,r,n){"use strict";function e(t){return"[object Object]"===Object.prototype.toString.call(t)}function o(t){return"function"==typeof t}function i(t){return"icon"===t.type||"html"in t}n.d(r,"b",(function(){return e})),n.d(r,"a",(function(){return i})),n.d(r,"c",(function(){return y}));var u=function(){return(u=Object.assign||function(t){for(var r,n=1,e=arguments.length;n<e;n++)for(var o in r=arguments[n])Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o]);return t}).apply(this,arguments)};var a={get:function(t,r){var n=r[0];return t.properties&&t.properties[n]},match:function(t,r){var n=r[0],e=r.slice(1),o=n;Array.isArray(n)&&(o=c(t,n));for(var i=e.splice(-1,e.length%2)[0],u=0;u<e.length-1;u+=2){if(e[u]===o)return e[u+1]}return i}};function c(t,r){var n=r[0],e=r.slice(1),o=a[n];if(o)return o(t,e)}function s(t){return function(r){return c(r,t)}}var f=["iconSize","iconAnchor"];var p=n(32),l=function(){return(l=Object.assign||function(t){for(var r,n=1,e=arguments.length;n<e;n++)for(var o in r=arguments[n])Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o]);return t}).apply(this,arguments)};function y(t,r,n){var i;if(o(t))return function(e){return y(t(e),r,n)};if(function(t){return!!Array.isArray(t)}(t))return function(e){return y((o={},i=[],t.forEach((function(t){t&&(Array.isArray(t)?i.push(t):o=t)})),function(t){var r=i.find((function(r){return Object(p.b)(t,r[0])}));return r?l(l({},o),r[1]):o})(e),r,n);var o,i};if("get-paint"===t.type){var a=function(t,r){if("function"==typeof t.from)return t.from(t.options);if("string"==typeof t.from&&r){var n=r[t.from];if(n)return n(t.options)}}(t,n);a&&(i=y(a,r,n))}else{if("icon"===t.type)return t;var c=function(t){var r,n=!1,e={};for(var o in t)if(-1===f.indexOf(o)){var i=o,a=t[i];r=a,Array.isArray(r)&&(n=!0,e[i]=s(a))}if(n)return function(r){var n={};for(var o in e)n[o]=e[o](r);return u(u({},t),n)}}(t);if(c)return function(t){return y(c(t),r,n)};(i=l({},t)).fill=void 0===i.fill||i.fill,i.stroke=void 0!==i.stroke?i.stroke:!i.fill||!(!i.strokeColor&&!i.strokeOpacity)}if(i){if(o(i))return i;e(i)&&(i=l(l({},r),i))}else i=l({},r);return"color"in i&&(i.strokeColor||(i.strokeColor=i.color),i.fillColor||(i.fillColor=i.color)),"opacity"in i&&(void 0===i.strokeOpacity&&(i.strokeOpacity=i.opacity),void 0===i.fillOpacity&&(i.fillOpacity=i.opacity)),i}}}]);
//# sourceMappingURL=main~7348d3b6-d4afa11.js.map