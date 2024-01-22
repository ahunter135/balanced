"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[5962],{3233:(pt,k,O)=>{O.r(k),O.d(k,{scopeCss:()=>at});const g="-shadowcsshost",y="-shadowcssslotted",B="-shadowcsscontext",S=")(?:\\(((?:\\([^)(]*\\)|[^)(]*)+?)\\))?([^,{]*)",x=new RegExp("("+g+S,"gim"),j=new RegExp("("+B+S,"gim"),v=new RegExp("("+y+S,"gim"),h=g+"-no-combinator",N=/-shadowcsshost-no-combinator([^\s]*)/,M=[/::shadow/g,/::content/g],m=/-shadowcsshost/gim,I=/:host/gim,K=/::slotted/gim,U=/:host-context/gim,Y=/\/\*\s*[\s\S]*?\*\//g,z=/\/\*\s*#\s*source(Mapping)?URL=[\s\S]+?\*\//g,G=/(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g,J=/([{}])/g,_="%BLOCK%",H=(t,e)=>{const n=X(t);let o=0;return n.escapedString.replace(G,(...c)=>{const s=c[2];let i="",r=c[4],a="";r&&r.startsWith("{"+_)&&(i=n.blocks[o++],r=r.substring(8),a="{");const u=e({selector:s,content:i});return`${c[1]}${u.selector}${c[3]}${a}${u.content}${r}`})},X=t=>{const e=t.split(J),n=[],o=[];let c=0,s=[];for(let r=0;r<e.length;r++){const a=e[r];"}"===a&&c--,c>0?s.push(a):(s.length>0&&(o.push(s.join("")),n.push(_),s=[]),n.push(a)),"{"===a&&c++}return s.length>0&&(o.push(s.join("")),n.push(_)),{escapedString:n.join(""),blocks:o}},E=(t,e,n)=>t.replace(e,(...o)=>{if(o[2]){const c=o[2].split(","),s=[];for(let i=0;i<c.length;i++){const r=c[i].trim();if(!r)break;s.push(n(h,r,o[3]))}return s.join(",")}return h+o[3]}),W=(t,e,n)=>t+e.replace(g,"")+n,T=(t,e,n)=>e.indexOf(g)>-1?W(t,e,n):t+e+n+", "+e+" "+t+n,b=(t,e,n,o,c)=>H(t,s=>{let i=s.selector,r=s.content;return"@"!==s.selector[0]?i=((t,e,n,o)=>t.split(",").map(c=>o&&c.indexOf("."+o)>-1?c.trim():((t,e)=>!(t=>(t=t.replace(/\[/g,"\\[").replace(/\]/g,"\\]"),new RegExp("^("+t+")([>\\s~+[.,{:][\\s\\S]*)?$","m")))(e).test(t))(c,e)?((t,e,n)=>{const c="."+(e=e.replace(/\[is=([^\]]*)\]/g,(d,...p)=>p[0])),s=d=>{let p=d.trim();if(!p)return"";if(d.indexOf(h)>-1)p=((t,e,n)=>{if(m.lastIndex=0,m.test(t)){const o=`.${n}`;return t.replace(N,(c,s)=>s.replace(/([^:]*)(:*)(.*)/,(i,r,a,l)=>r+o+a+l)).replace(m,o+" ")}return e+" "+t})(d,e,n);else{const C=d.replace(m,"");if(C.length>0){const R=C.match(/([^:]*)(:*)(.*)/);R&&(p=R[1]+c+R[2]+R[3])}}return p},i=(t=>{const e=[];let o,n=0;return o=(t=t.replace(/(\[[^\]]*\])/g,(s,i)=>{const r=`__ph-${n}__`;return e.push(i),n++,r})).replace(/(:nth-[-\w]+)(\([^)]+\))/g,(s,i,r)=>{const a=`__ph-${n}__`;return e.push(r),n++,i+a}),{content:o,placeholders:e}})(t);let l,r="",a=0;const u=/( |>|\+|~(?!=))\s*/g;let f=!((t=i.content).indexOf(h)>-1);for(;null!==(l=u.exec(t));){const d=l[1],p=t.slice(a,l.index).trim();f=f||p.indexOf(h)>-1,r+=`${f?s(p):p} ${d} `,a=u.lastIndex}const $=t.substring(a);return f=f||$.indexOf(h)>-1,r+=f?s($):$,((t,e)=>e.replace(/__ph-(\d+)__/g,(n,o)=>t[+o]))(i.placeholders,r)})(c,e,n).trim():c.trim()).join(", "))(s.selector,e,n,o):(s.selector.startsWith("@media")||s.selector.startsWith("@supports")||s.selector.startsWith("@page")||s.selector.startsWith("@document"))&&(r=b(s.content,e,n,o)),{selector:i.replace(/\s{2,}/g," ").trim(),content:r}}),it=(t,e,n,o,c)=>(t=((t,e)=>t.replace(v,(...o)=>{if(o[2]){const c=o[2].trim();return"."+e+" > "+c+o[3]}return h+o[3]}))(t=(t=>E(t,j,T))(t=(t=>E(t,x,W))(t=(t=>t.replace(U,B).replace(I,g).replace(K,y))(t))),o),t=(t=>M.reduce((e,n)=>e.replace(n," "),t))(t),e&&(t=b(t,e,n,o)),(t=(t=t.replace(/-shadowcsshost-no-combinator/g,`.${n}`)).replace(/>\s*\*\s+([^{, ]+)/gm," $1 ")).trim()),at=(t,e,n)=>{const o=e+"-h",c=e+"-s",s=(t=>t.match(z)||[])(t);t=(t=>t.replace(Y,""))(t);const i=[];if(n){const a=l=>{const u=`/*!@___${i.length}___*/`;return i.push({placeholder:u,comment:`/*!@${l.selector}*/`}),l.selector=u+l.selector,l};t=H(t,l=>"@"!==l.selector[0]?a(l):((l.selector.startsWith("@media")||l.selector.startsWith("@supports")||l.selector.startsWith("@page")||l.selector.startsWith("@document"))&&(l.content=H(l.content,a)),l))}return t=[it(t,e,o,c),...s].join("\n"),n&&i.forEach(({placeholder:a,comment:l})=>{t=t.replace(a,l)}),t}}}]);