(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const t of n.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&a(t)}).observe(document,{childList:!0,subtree:!0});function r(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(e){if(e.ep)return;e.ep=!0;const n=r(e);fetch(e.href,n)}})();const b="modulepreload",C=function(o){return"/"+o},m={},L=function(s,r,a){let e=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const t=document.querySelector("meta[property=csp-nonce]"),i=(t==null?void 0:t.nonce)||(t==null?void 0:t.getAttribute("nonce"));e=Promise.allSettled(r.map(c=>{if(c=C(c),c in m)return;m[c]=!0;const u=c.endsWith(".css"),E=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${E}`))return;const l=document.createElement("link");if(l.rel=u?"stylesheet":b,u||(l.as="script"),l.crossOrigin="",l.href=c,i&&l.setAttribute("nonce",i),document.head.appendChild(l),u)return new Promise((v,w)=>{l.addEventListener("load",v),l.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${c}`)))})}))}function n(t){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=t,window.dispatchEvent(i),!i.defaultPrevented)throw t}return e.then(t=>{for(const i of t||[])i.status==="rejected"&&n(i.reason);return s().catch(n)})},f=CodeMirror(document.getElementById("output"),{mode:"css",theme:"monokai",lineNumbers:!0,readOnly:!0}),p=CodeMirror(document.getElementById("editor"),{mode:"sass",theme:"monokai",lineNumbers:!0,autoCloseBrackets:!0,extraKeys:{"Ctrl-Space":"autocomplete"},hintOptions:{completeSingle:!1,closeOnUnfocus:!0},value:`@use '@nuvoui/core/src/styles/index.scss' as NuvoUI with (
  $column-count: 12,
  $color-dark: #1A1A1A,
  $color-warning: #F8AF08,
  $color-success: #34C759,
);

.btn.primary {
  @include NuvoUI.btn;
  @include NuvoUI.btn-primary;
}`}),P=await L(()=>import("https://jspm.dev/sass"),[]);p.on("change",async()=>{try{const o=await P.compileString(p.getValue(),{style:"expanded",loadPaths:["src/styles"]});f.setValue(o.css);const s="sass-preview-style";let r=document.getElementById(s);r?r.textContent=o.css:(r=document.createElement("style"),r.id=s,r.textContent=o.css,document.head.appendChild(r))}catch(o){f.setValue(`Error: ${o.message}`)}});const h=document.querySelector(".panel-right"),S=document.getElementById("resize-handle");let d=!1,y,g;S.addEventListener("mousedown",o=>{d=!0,y=o.clientX,g=parseInt(getComputedStyle(h).width,10)});document.addEventListener("mousemove",o=>{if(!d)return;const s=o.clientX-y,r=Math.min(Math.max(g-s,300),600);h.style.width=`${r}px`});document.addEventListener("mouseup",()=>{d=!1});
