"use strict";var e=require("node:path"),t=require("node:fs"),n=require("jsdom"),o=require("node:https"),r=require("node:url"),i=require("https");function s(e,t){let n=e?`${e}`:"?";if(t)for(const e in t){n+=`&${e}=${t[e]}`}else n=e;return n}function a(e){const{hostname:t,port:n,pathname:o,search:a}=new r.URL(e.url),c={agent:new i.Agent({}),hostname:t,port:n,path:o,search:s(a,e.params),method:e.method?.toLocaleUpperCase()??"GET",headers:{},timeout:e.timeout};return c.headers=function(e,t){const n={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",...t};return"POST"===t.method&&e.data&&(n["Content-Type"]="application/json",n["Content-Length"]=Buffer.byteLength(e.data)),n}(e,c),c}function c(e,t){const{baseUrl:n,timeout:o,intervalTime:r}=e,{requestConifg:i,intervalTime:s}=t,a=m(i)?i:[i];for(const e of a){const{url:t,timeout:r}=e;e.url=n+t,f(r)&&(e.timeout=o)}return f(s)&&(t.intervalTime=r),t}function u(e){return new Promise((t=>setTimeout(t,e)))}function l(e,t=0){let n=Math.floor(Math.random()*e);return n<t&&(n=l(e,t)),n}function f(e){return void 0===e}function m(e){return Array.isArray(e)}function h(e){return new Promise(((t,n)=>{const r=e.data=e.data?JSON.stringify(e.data??""):e.data,i=a(e),s=o.request(i,(e=>{const{headers:n}=e,o=[];e.on("data",(e=>o.push(e))),e.on("end",(()=>{const e=Buffer.concat(o);t({headers:n,data:e})}))}));s.on("timeout",(()=>{console.log("Timeout Error"),n(new Error("Timeout"))})),s.on("error",(e=>{console.log("Error: ",e.message),n(e)})),"POST"===i.method&&s.write(r),s.end()}))}async function d(e,t,n){const o=e.length;let r=0;console.log(`Begin execution, total: ${o} `);for(const i of e){r++;if(n(await h(i),r),f(t)||r===o)console.log(`The ${r} request is success, all requests completed!`);else{const e="number"==typeof t?t:l(t.max,t.min);console.log(`The ${r} request is success, sleep for ${e}ms`),await u(e)}}}class g{baseConfig;constructor(e={}){this.baseConfig=e}async fetch(e){const{requestConifg:t,intervalTime:n}=c(this.baseConfig,e),o=m(t),r=o?t:[t],i=[];await d(r,n,(e=>{i.push(JSON.parse(e.data.toString()))}));return o?i:i[0]}async fetchFile(n){return new Promise(((o,r)=>{const{requestConifg:i,intervalTime:s,fileConfig:a}=c(this.baseConfig,n);let u=0;const l=[];const f=m(i)?i:[i];d(f,s,(function(n,r){const{headers:i,data:s}=n,c=i["content-type"]??"",m=c.split("/").pop(),h=(new Date).getTime().toString(),d=e.resolve(a.storeDir,`${h}.${m}`);t.createWriteStream(d,"binary").write(s,(e=>{if(e)return console.log(`File save error requested for the ${r}: ${e.message}`);l.push({fileName:h,mimeType:c,size:s.length,filePath:d}),++u===f.length&&(console.log("All files downloaded successfully!"),o(l))}))}))}))}async fetchHTML(e){const{requestConifg:t}=c(this.baseConfig,{requestConifg:{url:e}}),o=(await h(t)).data.toString();return new n.JSDOM(o)}}new g({timeout:1e4,intervalTime:{max:3e3,min:1e3}});const p=new g({timeout:1e4,intervalTime:{max:1500,min:1e3}});!async function(){const t=(await p.fetch({requestConifg:{url:"https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd",method:"GET",params:{y_num:5,fresh_type:3,feed_version:"V8",fresh_idx_1h:1,fetch_row:1,fresh_idx:1,brush:0,homepage_ver:1,ps:10,outside_trigger:"",w_rid:"2e4be8e9830ecd780c5b0ff2bef805c9",wts:1674556002}}})).data.item.map((e=>({url:e.pic,method:"GET"}))),n=await p.fetchFile({requestConifg:t,intervalTime:{max:3e3,min:2e3},fileConfig:{storeDir:e.resolve(__dirname,"./upload")}});console.log(n)}();
