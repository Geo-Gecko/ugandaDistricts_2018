/*! simg 2016-12-12 */
!function(a){var b=a.Simg,c=a.Simg=function(a){this.svg=a};c.noConflict=function(){return a.Simg=b,this},c.getBase64Image=function(a){var b=document.createElement("canvas");b.width=a.width,b.height=a.height;var c=b.getContext("2d");c.drawImage(a,0,0);var d=b.toDataURL("image/png");return d.replace(/^data:image\/(png|jpg);base64,/,"")},c.prototype={toString:function(a){if(!a)throw new Error(".toString: No SVG found.");return[["version",1.1],["xmlns","http://www.w3.org/2000/svg"]].forEach(function(b){a.setAttribute(b[0],b[1])}),a.outerHTML},toCanvas:function(a){this.toSvgImage(function(b){var c=document.createElement("canvas"),d=c.getContext("2d");c.width=b.width,c.height=b.height,d.drawImage(b,0,0),a(c)})},toSvgImage:function(a){var b=this.toString(this.svg),c=document.createElement("img");a&&(c.onload=function(){a(c)}),c.setAttribute("src","data:image/svg+xml;base64,"+btoa(unescape(encodeURIComponent(b))))},toImg:function(a){this.toCanvas(function(b){var c=b.toDataURL("image/png"),d=document.createElement("img");d.onload=function(){a(d)},d.setAttribute("src",c)})},replace:function(a){var b=this;this.toImg(function(c){var d=b.svg.parentNode;d.replaceChild(c,b.svg),a&&a()})},toBinaryBlob:function(a){this.toCanvas(function(b){for(var c=b.toDataURL().replace(/^data:image\/(png|jpg);base64,/,""),d=atob(escape(c)),e=new ArrayBuffer(d.length),f=new Uint8Array(e),g=0;g<d.length;g++)f[g]=d.charCodeAt(g);var h=new DataView(e),i=new Blob([h],{type:"image/png"});a(i)})},download:function(a){a||(a="chart"),this.toImg(function(b){var c=document.createElement("a");c.download=a+".png",c.href=b.getAttribute("src"),c.style.display="none",document.body.appendChild(c),c.click(),document.body.removeChild(c)})}}}(this);