"use strict";var e=require("node:path"),t=require("node:fs"),n=require("jsdom"),o=require("node:http"),s=require("https"),r=require("node:url"),a=require("chalk");function i(e,t=0){let n=Math.floor(Math.random()*e);return n<t&&(n=i(e,t)),n}const c=console.log,u=a.hex("#a57fff"),l=a.green,h=a.red;function d(e){return void 0===e}function f(e){return"number"==typeof e}function m(e){return Array.isArray(e)}function g(e,t){let n=e?`${e}`:"?";if(t)for(const e in t){n+=`&${e}=${t[e]}`}else n=e;return n}function p(e){const{protocol:t,hostname:n,port:a,pathname:i,search:c}=new r.URL(e.url),u={protocol:t,hostname:n,port:a,path:i,search:g(c,e.params),method:e.method?.toLocaleUpperCase()??"GET",headers:{},timeout:e.timeout};return u.headers=function(e,t){const n={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",...e.headers??{}};return"POST"===t.method&&e.data&&(n["Content-Type"]="application/json",n["Content-Length"]=Buffer.byteLength(e.data)),n}(e,u),u.agent="http:"===t?new o.Agent:new s.Agent,u}async function y(e,t,n,o){if(e&&o>1){const e=t?n:i(n.max,n.min);c(`Request ${u(o)} needs to sleep for ${u(e+"ms")} milliseconds before sending`),await function(e){return new Promise((t=>setTimeout(t,e)))}(e)}else c(`Request ${u(o)} does not need to sleep, send immediately`)}function w(e){return new Promise(((t,n)=>{const s=d(e.data);e.data=s?e.data:JSON.stringify(e.data);const r=p(e),a=o.request(r,(e=>{const{statusCode:n,headers:o}=e,s=[];e.on("data",(e=>s.push(e))),e.on("end",(()=>{const e=Buffer.concat(s);t({statusCode:n,headers:o,data:e})}))}));a.on("timeout",(()=>{n(new Error(`Timeout ${e.timeout}ms`))})),a.on("error",(e=>{n(e)})),"POST"!==r.method||s||a.write(e.data),a.end()}))}function q(e,t){const{baseUrl:n,timeout:o,intervalTime:s}=e,{requestConifg:r,intervalTime:a}=t,i=m(r)?r:[r];for(const e of i){const{url:t,timeout:s}=e;d(n)||(e.url=n+t),d(s)&&!d(o)&&(e.timeout=o)}return d(a)&&!d(s)&&(t.intervalTime=s),t}const $=new class{baseConfig;constructor(e={}){this.baseConfig=e}async useBatchRequestByMode(e,t){const n=m(e)?e:[e];let o=[];return o="sync"!==this.baseConfig.mode?await async function(e,t){const n=!d(t),o=f(t);c(`Begin execution, mode: async, total: ${u(e.length)} `);const s=[];let r=0;for(const a of e){const e=++r;await y(n,o,t,e);const i=w(a).catch((t=>`Request ${e} is an error: ${t.message}`)).then((t=>"string"==typeof t?t:{id:e,...t}));s.push(i)}c(l("All requests have been sent!"));const a=await Promise.all(s),i=[],m=[];return a.forEach((e=>{if("string"==typeof e)return m.push(e);i.push(e)})),m.forEach((e=>c(h(e)))),c(`requestsTotal: ${u(e.length)}, success: ${l(i.length)}, error: ${h(m.length)}`),i}(n,t):await async function(e,t){const n=!d(t),o=f(t);c(`Begin execution, mode: sync, total: ${u(e.length)} `);let s=0,r=0,a=0;const i=[];for(const d of e){s++,await y(n,o,t,s);try{const e=await w(d);i.push({id:s,...e}),c(l(`Request ${u(s)} is an success`)),r++}catch(e){c(h(`Request ${s} is an error: ${e.message}`)),a++}}return c(l("All requests are over!")),c(`requestsTotal: ${u(e.length)}, success: ${l(r)}, error: ${h(a)}`),i}(n,t),o}async fetchHTML(e){const t="string"==typeof e?{url:e}:e;const{requestConifg:o}=q(this.baseConfig,{requestConifg:t}),s=await w(o),r=s.data.toString();return{...s,data:{raw:r,jsdom:new n.JSDOM(r)}}}async fetchData(e){const{requestConifg:t,intervalTime:n}=q(this.baseConfig,e),o=await this.useBatchRequestByMode(t,n),s=[];return o.forEach((e=>{const t=e.headers["content-type"]??"",n=e.data,o=t.includes("text")?n.toString():JSON.parse(n.toString());s.push({...e,data:o})})),s}async fetchFile(n){const{requestConifg:o,intervalTime:s,fileConfig:r}=q(this.baseConfig,n),a=await this.useBatchRequestByMode(o,s),i=[];a.forEach((n=>{const{id:o,headers:s,data:a}=n,u=s["content-type"]??"",l=u.split("/").pop(),d=(new Date).getTime().toString(),f=e.resolve(r.storeDir,`${d}.${l}`);try{t.writeFileSync(f,a),i.push({...n,data:{fileName:d,mimeType:u,size:a.length,filePath:f}})}catch(e){c(h(`File save error at id ${o}: ${e.message}`))}}));const d=a.length,f=i.length,m=a.length-i.length;return c(`saveTotal: ${u(d)}, success: ${l(f)}, error: ${h(m)}`),i}}({timeout:1e4,intervalTime:{max:1e3,min:500},mode:"async"});$.fetchHTML({url:"https://www.bilibili.com/"}).then((t=>{const{jsdom:n}=t.data,o=n.window.document.querySelectorAll(".bili-video-card__cover"),s=[];o.forEach(((e,t)=>{const n=e.lastChild;t%2?s.push("https:"+n.src):s.push(n.src)})),console.log(s);const r=s.map((e=>({url:e})));$.fetchFile({requestConifg:r,fileConfig:{storeDir:e.resolve(__dirname,"./upload")}}).then((e=>{}))}));
