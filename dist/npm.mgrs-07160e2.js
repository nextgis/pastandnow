(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{35:function(e,r,t){"use strict";t.d(r,"b",function(){return u}),t.d(r,"c",function(){return M});var a=6,n="AJSAJS",o="AFAFAF",i=65,s=73,h=79,c=86,f=90;function u(e,r){return r=r||5,function(e,r){var t="00000"+e.easting,a="00000"+e.northing;return e.zoneNumber+e.zoneLetter+(z=e.easting,C=e.northing,S=e.zoneNumber,p=g(S),N=Math.floor(z/1e5),P=Math.floor(C/1e5)%20,u=N,M=P,b=p,l=b-1,v=n.charCodeAt(l),d=o.charCodeAt(l),k=v+u-1,w=d+M,A=!1,k>f&&(k=k-f+i-1,A=!0),(k===s||v<s&&k>s||(k>s||v<s)&&A)&&k++,(k===h||v<h&&k>h||(k>h||v<h)&&A)&&++k===s&&k++,k>f&&(k=k-f+i-1),w>c?(w=w-c+i-1,A=!0):A=!1,(w===s||d<s&&w>s||(w>s||d<s)&&A)&&w++,(w===h||d<h&&w>h||(w>h||d<h)&&A)&&++w===s&&w++,w>c&&(w=w-c+i-1),String.fromCharCode(k)+String.fromCharCode(w))+t.substr(t.length-5,r)+a.substr(a.length-5,r);var u,M,b,l,v,d,k,w,A;var z,C,S,p,N,P}(function(e){var r,t,a,n,o,i,s,h=e.lat,c=e.lon,f=6378137,u=b(h),M=b(c);s=Math.floor((c+180)/6)+1,180===c&&(s=60);h>=56&&h<64&&c>=3&&c<12&&(s=32);h>=72&&h<84&&(c>=0&&c<9?s=31:c>=9&&c<21?s=33:c>=21&&c<33?s=35:c>=33&&c<42&&(s=37));i=b(6*(s-1)-180+3),.006739496752268451,r=f/Math.sqrt(1-.00669438*Math.sin(u)*Math.sin(u)),t=Math.tan(u)*Math.tan(u),a=.006739496752268451*Math.cos(u)*Math.cos(u),n=Math.cos(u)*(M-i),o=f*(.9983242984503243*u-.002514607064228144*Math.sin(2*u)+2639046602129982e-21*Math.sin(4*u)-3.418046101696858e-9*Math.sin(6*u));var l=.9996*r*(n+(1-t+a)*n*n*n/6+(5-18*t+t*t+72*a-.39089081163157013)*n*n*n*n*n/120)+5e5,v=.9996*(o+r*Math.tan(u)*(n*n/2+(5-t+9*a+4*a*a)*n*n*n*n/24+(61-58*t+t*t+600*a-2.2240339282485886)*n*n*n*n*n*n/720));h<0&&(v+=1e7);return{northing:Math.round(v),easting:Math.round(l),zoneNumber:s,zoneLetter:d(h)}}({lat:e[1],lon:e[0]}),r)}function M(e){var r=v(k(e.toUpperCase()));return r.lat&&r.lon?[r.lon,r.lat]:[(r.left+r.right)/2,(r.top+r.bottom)/2]}function b(e){return e*(Math.PI/180)}function l(e){return e/Math.PI*180}function v(e){var r=e.northing,t=e.easting,a=e.zoneLetter,n=e.zoneNumber;if(n<0||n>60)return null;var o,i,s,h,c,f,u,M,b=6378137,d=(1-Math.sqrt(.99330562))/(1+Math.sqrt(.99330562)),g=t-5e5,k=r;a<"N"&&(k-=1e7),f=6*(n-1)-180+3,M=(u=k/.9996/6367449.145945056)+(3*d/2-27*d*d*d/32)*Math.sin(2*u)+(21*d*d/16-55*d*d*d*d/32)*Math.sin(4*u)+151*d*d*d/96*Math.sin(6*u),o=b/Math.sqrt(1-.00669438*Math.sin(M)*Math.sin(M)),i=Math.tan(M)*Math.tan(M),s=.006739496752268451*Math.cos(M)*Math.cos(M),h=.99330562*b/Math.pow(1-.00669438*Math.sin(M)*Math.sin(M),1.5),c=g/(.9996*o);var w=M-o*Math.tan(M)/h*(c*c/2-(5+3*i+10*s-4*s*s-.06065547077041606)*c*c*c*c/24+(61+90*i+298*s+45*i*i-1.6983531815716497-3*s*s)*c*c*c*c*c*c/720);w=l(w);var A,z=(c-(1+2*i+s)*c*c*c/6+(5-2*s+28*i-3*s*s+.05391597401814761+24*i*i)*c*c*c*c*c/120)/Math.cos(M);if(z=f+l(z),e.accuracy){var C=v({northing:e.northing+e.accuracy,easting:e.easting+e.accuracy,zoneLetter:e.zoneLetter,zoneNumber:e.zoneNumber});A={top:C.lat,right:C.lon,bottom:w,left:z}}else A={lat:w,lon:z};return A}function d(e){var r="Z";return 84>=e&&e>=72?r="X":72>e&&e>=64?r="W":64>e&&e>=56?r="V":56>e&&e>=48?r="U":48>e&&e>=40?r="T":40>e&&e>=32?r="S":32>e&&e>=24?r="R":24>e&&e>=16?r="Q":16>e&&e>=8?r="P":8>e&&e>=0?r="N":0>e&&e>=-8?r="M":-8>e&&e>=-16?r="L":-16>e&&e>=-24?r="K":-24>e&&e>=-32?r="J":-32>e&&e>=-40?r="H":-40>e&&e>=-48?r="G":-48>e&&e>=-56?r="F":-56>e&&e>=-64?r="E":-64>e&&e>=-72?r="D":-72>e&&e>=-80&&(r="C"),r}function g(e){var r=e%a;return 0===r&&(r=a),r}function k(e){if(e&&0===e.length)throw"MGRSPoint coverting from nothing";for(var r,t=e.length,a=null,u="",M=0;!/[A-Z]/.test(r=e.charAt(M));){if(M>=2)throw"MGRSPoint bad conversion from: "+e;u+=r,M++}var b=parseInt(u,10);if(0===M||M+3>t)throw"MGRSPoint bad conversion from: "+e;var l=e.charAt(M++);if(l<="A"||"B"===l||"Y"===l||l>="Z"||"I"===l||"O"===l)throw"MGRSPoint zone letter "+l+" not handled: "+e;a=e.substring(M,M+=2);for(var v=g(b),d=function(e,r){var t=n.charCodeAt(r-1),a=1e5,o=!1;for(;t!==e.charCodeAt(0);){if(++t===s&&t++,t===h&&t++,t>f){if(o)throw"Bad character: "+e;t=i,o=!0}a+=1e5}return a}(a.charAt(0),v),k=function(e,r){if(e>"V")throw"MGRSPoint given invalid Northing "+e;var t=o.charCodeAt(r-1),a=0,n=!1;for(;t!==e.charCodeAt(0);){if(++t===s&&t++,t===h&&t++,t>c){if(n)throw"Bad character: "+e;t=i,n=!0}a+=1e5}return a}(a.charAt(1),v);k<w(l);)k+=2e6;var A=t-M;if(A%2!=0)throw"MGRSPoint has to have an even number \nof digits after the zone letter and two 100km letters - front \nhalf for easting meters, second half for \nnorthing meters"+e;var z,C,S,p=A/2,N=0,P=0;return p>0&&(z=1e5/Math.pow(10,p),C=e.substring(M,M+p),N=parseFloat(C)*z,S=e.substring(M+p),P=parseFloat(S)*z),{easting:N+d,northing:P+k,zoneLetter:l,zoneNumber:b,accuracy:z}}function w(e){var r;switch(e){case"C":r=11e5;break;case"D":r=2e6;break;case"E":r=28e5;break;case"F":r=37e5;break;case"G":r=46e5;break;case"H":r=55e5;break;case"J":r=64e5;break;case"K":r=73e5;break;case"L":r=82e5;break;case"M":r=91e5;break;case"N":r=0;break;case"P":r=8e5;break;case"Q":r=17e5;break;case"R":r=26e5;break;case"S":r=35e5;break;case"T":r=44e5;break;case"U":r=53e5;break;case"V":r=62e5;break;case"W":r=7e6;break;case"X":r=79e5;break;default:r=-1}if(r>=0)return r;throw"Invalid zone letter: "+e}r.a={forward:u,inverse:function(e){var r=v(k(e.toUpperCase()));if(r.lat&&r.lon)return[r.lon,r.lat,r.lon,r.lat];return[r.left,r.bottom,r.right,r.top]},toPoint:M}}}]);
//# sourceMappingURL=npm.mgrs-07160e2.js.map