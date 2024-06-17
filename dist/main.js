/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/pyodide lazy recursive":
/*!************************************************************!*\
  !*** ./node_modules/pyodide/ lazy strict namespace object ***!
  \************************************************************/
/***/ ((module) => {

eval("function webpackEmptyAsyncContext(req) {\n\t// Here Promise.resolve().then() is used instead of new Promise() to prevent\n\t// uncaught exception popping up in devtools\n\treturn Promise.resolve().then(() => {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t});\n}\nwebpackEmptyAsyncContext.keys = () => ([]);\nwebpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;\nwebpackEmptyAsyncContext.id = \"./node_modules/pyodide lazy recursive\";\nmodule.exports = webpackEmptyAsyncContext;\n\n//# sourceURL=webpack://your-package-name/./node_modules/pyodide/_lazy_strict_namespace_object?");

/***/ }),

/***/ "./pyodide2.js":
/*!*********************!*\
  !*** ./pyodide2.js ***!
  \*********************/
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var pyodide__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pyodide */ \"./node_modules/pyodide/pyodide.mjs\");\nconsole.log(\"pyodide2.js\");\n\n// const pyodide = await loadPyodide();\nvar pyodide = await (0,pyodide__WEBPACK_IMPORTED_MODULE_0__.loadPyodide)({\n  indexURL: \"https://cdn.jsdelivr.net/pyodide/v0.18.1/full/\"\n});\n;\nvar codePath = './test.py';\nvar traceCodePath = './settrace3.py';\nvar response1 = await fetch(codePath);\nvar code = await response1.text();\nvar response2 = await fetch(traceCodePath);\nvar traceCode = \"code = \\\"\\\"\\\"\".concat(code, \"\\\"\\\"\\\"\\n\").concat(await response2.text());\nconsole.log('code:\\n', traceCode, '\\noutput:');\npyodide.runPythonAsync(traceCode);\n\n// console.log(\"pyodide2.js\");\n// import { loadPyodide } from 'pyodide';\n// import fs from 'fs';\n// const pyodide = await loadPyodide();\n// const codePath = './test.py';\n// const traceCodePath = './settrace3.py';\n\n// const code = fs.readFileSync(codePath, 'utf-8');\n// const traceCode = `code = \"\"\"${code}\"\"\"\\n${fs.readFileSync(traceCodePath, 'utf-8')}`;\n// console.log('code:\\n\", traceCode, \"\\noutput:');\n// pyodide.runPythonAsync(traceCode)\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } }, 1);\n\n//# sourceURL=webpack://your-package-name/./pyodide2.js?");

/***/ }),

/***/ "./node_modules/pyodide/pyodide.mjs":
/*!******************************************!*\
  !*** ./node_modules/pyodide/pyodide.mjs ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   loadPyodide: () => (/* binding */ Be),\n/* harmony export */   version: () => (/* binding */ A)\n/* harmony export */ });\nvar re=Object.create;var R=Object.defineProperty;var ie=Object.getOwnPropertyDescriptor;var oe=Object.getOwnPropertyNames;var ae=Object.getPrototypeOf,se=Object.prototype.hasOwnProperty;var f=(t,e)=>R(t,\"name\",{value:e,configurable:!0}),w=(t=>typeof require<\"u\"?require:typeof Proxy<\"u\"?new Proxy(t,{get:(e,o)=>(typeof require<\"u\"?require:e)[o]}):t)(function(t){if(typeof require<\"u\")return require.apply(this,arguments);throw new Error('Dynamic require of \"'+t+'\" is not supported')});var D=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var ce=(t,e,o,a)=>{if(e&&typeof e==\"object\"||typeof e==\"function\")for(let l of oe(e))!se.call(t,l)&&l!==o&&R(t,l,{get:()=>e[l],enumerable:!(a=ie(e,l))||a.enumerable});return t};var le=(t,e,o)=>(o=t!=null?re(ae(t)):{},ce(e||!t||!t.__esModule?R(o,\"default\",{value:t,enumerable:!0}):o,t));var T=D((O,U)=>{(function(t,e){\"use strict\";typeof define==\"function\"&&define.amd?define(\"stackframe\",[],e):typeof O==\"object\"?U.exports=e():t.StackFrame=e()})(O,function(){\"use strict\";function t(d){return!isNaN(parseFloat(d))&&isFinite(d)}f(t,\"_isNumber\");function e(d){return d.charAt(0).toUpperCase()+d.substring(1)}f(e,\"_capitalize\");function o(d){return function(){return this[d]}}f(o,\"_getter\");var a=[\"isConstructor\",\"isEval\",\"isNative\",\"isToplevel\"],l=[\"columnNumber\",\"lineNumber\"],n=[\"fileName\",\"functionName\",\"source\"],r=[\"args\"],u=[\"evalOrigin\"],i=a.concat(l,n,r,u);function c(d){if(d)for(var y=0;y<i.length;y++)d[i[y]]!==void 0&&this[\"set\"+e(i[y])](d[i[y]])}f(c,\"StackFrame\"),c.prototype={getArgs:function(){return this.args},setArgs:function(d){if(Object.prototype.toString.call(d)!==\"[object Array]\")throw new TypeError(\"Args must be an Array\");this.args=d},getEvalOrigin:function(){return this.evalOrigin},setEvalOrigin:function(d){if(d instanceof c)this.evalOrigin=d;else if(d instanceof Object)this.evalOrigin=new c(d);else throw new TypeError(\"Eval Origin must be an Object or StackFrame\")},toString:function(){var d=this.getFileName()||\"\",y=this.getLineNumber()||\"\",h=this.getColumnNumber()||\"\",v=this.getFunctionName()||\"\";return this.getIsEval()?d?\"[eval] (\"+d+\":\"+y+\":\"+h+\")\":\"[eval]:\"+y+\":\"+h:v?v+\" (\"+d+\":\"+y+\":\"+h+\")\":d+\":\"+y+\":\"+h}},c.fromString=f(function(y){var h=y.indexOf(\"(\"),v=y.lastIndexOf(\")\"),Q=y.substring(0,h),Z=y.substring(h+1,v).split(\",\"),L=y.substring(v+1);if(L.indexOf(\"@\")===0)var _=/@(.+?)(?::(\\d+))?(?::(\\d+))?$/.exec(L,\"\"),ee=_[1],te=_[2],ne=_[3];return new c({functionName:Q,args:Z||void 0,fileName:ee,lineNumber:te||void 0,columnNumber:ne||void 0})},\"StackFrame$$fromString\");for(var s=0;s<a.length;s++)c.prototype[\"get\"+e(a[s])]=o(a[s]),c.prototype[\"set\"+e(a[s])]=function(d){return function(y){this[d]=!!y}}(a[s]);for(var m=0;m<l.length;m++)c.prototype[\"get\"+e(l[m])]=o(l[m]),c.prototype[\"set\"+e(l[m])]=function(d){return function(y){if(!t(y))throw new TypeError(d+\" must be a Number\");this[d]=Number(y)}}(l[m]);for(var p=0;p<n.length;p++)c.prototype[\"get\"+e(n[p])]=o(n[p]),c.prototype[\"set\"+e(n[p])]=function(d){return function(y){this[d]=String(y)}}(n[p]);return c})});var $=D((N,M)=>{(function(t,e){\"use strict\";typeof define==\"function\"&&define.amd?define(\"error-stack-parser\",[\"stackframe\"],e):typeof N==\"object\"?M.exports=e(T()):t.ErrorStackParser=e(t.StackFrame)})(N,f(function(e){\"use strict\";var o=/(^|@)\\S+:\\d+/,a=/^\\s*at .*(\\S+:\\d+|\\(native\\))/m,l=/^(eval@)?(\\[native code])?$/;return{parse:f(function(r){if(typeof r.stacktrace<\"u\"||typeof r[\"opera#sourceloc\"]<\"u\")return this.parseOpera(r);if(r.stack&&r.stack.match(a))return this.parseV8OrIE(r);if(r.stack)return this.parseFFOrSafari(r);throw new Error(\"Cannot parse given Error object\")},\"ErrorStackParser$$parse\"),extractLocation:f(function(r){if(r.indexOf(\":\")===-1)return[r];var u=/(.+?)(?::(\\d+))?(?::(\\d+))?$/,i=u.exec(r.replace(/[()]/g,\"\"));return[i[1],i[2]||void 0,i[3]||void 0]},\"ErrorStackParser$$extractLocation\"),parseV8OrIE:f(function(r){var u=r.stack.split(`\n`).filter(function(i){return!!i.match(a)},this);return u.map(function(i){i.indexOf(\"(eval \")>-1&&(i=i.replace(/eval code/g,\"eval\").replace(/(\\(eval at [^()]*)|(,.*$)/g,\"\"));var c=i.replace(/^\\s+/,\"\").replace(/\\(eval code/g,\"(\").replace(/^.*?\\s+/,\"\"),s=c.match(/ (\\(.+\\)$)/);c=s?c.replace(s[0],\"\"):c;var m=this.extractLocation(s?s[1]:c),p=s&&c||void 0,d=[\"eval\",\"<anonymous>\"].indexOf(m[0])>-1?void 0:m[0];return new e({functionName:p,fileName:d,lineNumber:m[1],columnNumber:m[2],source:i})},this)},\"ErrorStackParser$$parseV8OrIE\"),parseFFOrSafari:f(function(r){var u=r.stack.split(`\n`).filter(function(i){return!i.match(l)},this);return u.map(function(i){if(i.indexOf(\" > eval\")>-1&&(i=i.replace(/ line (\\d+)(?: > eval line \\d+)* > eval:\\d+:\\d+/g,\":$1\")),i.indexOf(\"@\")===-1&&i.indexOf(\":\")===-1)return new e({functionName:i});var c=/((.*\".+\"[^@]*)?[^@]*)(?:@)/,s=i.match(c),m=s&&s[1]?s[1]:void 0,p=this.extractLocation(i.replace(c,\"\"));return new e({functionName:m,fileName:p[0],lineNumber:p[1],columnNumber:p[2],source:i})},this)},\"ErrorStackParser$$parseFFOrSafari\"),parseOpera:f(function(r){return!r.stacktrace||r.message.indexOf(`\n`)>-1&&r.message.split(`\n`).length>r.stacktrace.split(`\n`).length?this.parseOpera9(r):r.stack?this.parseOpera11(r):this.parseOpera10(r)},\"ErrorStackParser$$parseOpera\"),parseOpera9:f(function(r){for(var u=/Line (\\d+).*script (?:in )?(\\S+)/i,i=r.message.split(`\n`),c=[],s=2,m=i.length;s<m;s+=2){var p=u.exec(i[s]);p&&c.push(new e({fileName:p[2],lineNumber:p[1],source:i[s]}))}return c},\"ErrorStackParser$$parseOpera9\"),parseOpera10:f(function(r){for(var u=/Line (\\d+).*script (?:in )?(\\S+)(?:: In function (\\S+))?$/i,i=r.stacktrace.split(`\n`),c=[],s=0,m=i.length;s<m;s+=2){var p=u.exec(i[s]);p&&c.push(new e({functionName:p[3]||void 0,fileName:p[2],lineNumber:p[1],source:i[s]}))}return c},\"ErrorStackParser$$parseOpera10\"),parseOpera11:f(function(r){var u=r.stack.split(`\n`).filter(function(i){return!!i.match(o)&&!i.match(/^Error created at/)},this);return u.map(function(i){var c=i.split(\"@\"),s=this.extractLocation(c.pop()),m=c.shift()||\"\",p=m.replace(/<anonymous function(: (\\w+))?>/,\"$2\").replace(/\\([^)]*\\)/g,\"\")||void 0,d;m.match(/\\(([^)]*)\\)/)&&(d=m.replace(/^[^(]+\\(([^)]*)\\)$/,\"$1\"));var y=d===void 0||d===\"[arguments not available]\"?void 0:d.split(\",\");return new e({functionName:p,args:y,fileName:s[0],lineNumber:s[1],columnNumber:s[2],source:i})},this)},\"ErrorStackParser$$parseOpera11\")}},\"ErrorStackParser\"))});var z=le($());var g=typeof process==\"object\"&&typeof process.versions==\"object\"&&typeof process.versions.node==\"string\"&&typeof process.browser>\"u\",F=g&&typeof module<\"u\"&&typeof module.exports<\"u\"&&typeof w<\"u\"&&typeof __dirname<\"u\",C=g&&!F,de=typeof Deno<\"u\",W=!g&&!de,j=W&&typeof window==\"object\"&&typeof document==\"object\"&&typeof document.createElement==\"function\"&&typeof sessionStorage==\"object\"&&typeof importScripts!=\"function\",B=W&&typeof importScripts==\"function\"&&typeof self==\"object\",Ne=typeof navigator==\"object\"&&typeof navigator.userAgent==\"string\"&&navigator.userAgent.indexOf(\"Chrome\")==-1&&navigator.userAgent.indexOf(\"Safari\")>-1;var q,P,V,H,x;async function I(){if(!g||(q=(await __webpack_require__.e(/*! import() */ \"node_url\").then(__webpack_require__.t.bind(__webpack_require__, /*! node:url */ \"node:url\", 19))).default,H=await __webpack_require__.e(/*! import() */ \"node_fs\").then(__webpack_require__.t.bind(__webpack_require__, /*! node:fs */ \"node:fs\", 19)),x=await __webpack_require__.e(/*! import() */ \"node_fs_promises\").then(__webpack_require__.t.bind(__webpack_require__, /*! node:fs/promises */ \"node:fs/promises\", 19)),V=(await __webpack_require__.e(/*! import() */ \"node_vm\").then(__webpack_require__.t.bind(__webpack_require__, /*! node:vm */ \"node:vm\", 19))).default,P=await __webpack_require__.e(/*! import() */ \"node_path\").then(__webpack_require__.t.bind(__webpack_require__, /*! node:path */ \"node:path\", 19)),k=P.sep,typeof w<\"u\"))return;let t=H,e=await __webpack_require__.e(/*! import() */ \"node_crypto\").then(__webpack_require__.t.bind(__webpack_require__, /*! node:crypto */ \"node:crypto\", 19)),o=await __webpack_require__.e(/*! import() */ \"_296d\").then(__webpack_require__.t.bind(__webpack_require__, /*! ws */ \"?296d\", 19)),a=await __webpack_require__.e(/*! import() */ \"node_child_process\").then(__webpack_require__.t.bind(__webpack_require__, /*! node:child_process */ \"node:child_process\", 19)),l={fs:t,crypto:e,ws:o,child_process:a};globalThis.require=function(n){return l[n]}}f(I,\"initNodeModules\");function fe(t,e){return P.resolve(e||\".\",t)}f(fe,\"node_resolvePath\");function ue(t,e){return e===void 0&&(e=location),new URL(t,e).toString()}f(ue,\"browser_resolvePath\");var S;g?S=fe:S=ue;var k;g||(k=\"/\");function pe(t,e){return t.startsWith(\"file://\")&&(t=t.slice(7)),t.includes(\"://\")?{response:fetch(t)}:{binary:x.readFile(t).then(o=>new Uint8Array(o.buffer,o.byteOffset,o.byteLength))}}f(pe,\"node_getBinaryResponse\");function me(t,e){let o=new URL(t,location);return{response:fetch(o,e?{integrity:e}:{})}}f(me,\"browser_getBinaryResponse\");var b;g?b=pe:b=me;async function K(t,e){let{response:o,binary:a}=b(t,e);if(a)return a;let l=await o;if(!l.ok)throw new Error(`Failed to load '${t}': request failed.`);return new Uint8Array(await l.arrayBuffer())}f(K,\"loadBinaryFile\");var E;if(j)E=f(async t=>await __webpack_require__(\"./node_modules/pyodide lazy recursive\")(t),\"loadScript\");else if(B)E=f(async t=>{try{globalThis.importScripts(t)}catch(e){if(e instanceof TypeError)await __webpack_require__(\"./node_modules/pyodide lazy recursive\")(t);else throw e}},\"loadScript\");else if(g)E=ye;else throw new Error(\"Cannot determine runtime environment\");async function ye(t){t.startsWith(\"file://\")&&(t=t.slice(7)),t.includes(\"://\")?V.runInThisContext(await(await fetch(t)).text()):await __webpack_require__(\"./node_modules/pyodide lazy recursive\")(q.pathToFileURL(t).href)}f(ye,\"nodeLoadScript\");async function J(t){if(g){await I();let e=await x.readFile(t,{encoding:\"utf8\"});return JSON.parse(e)}else return await(await fetch(t)).json()}f(J,\"loadLockFile\");async function X(){if(F)return __dirname;let t;try{throw new Error}catch(a){t=a}let e=z.default.parse(t)[0].fileName;if(C){let a=await __webpack_require__.e(/*! import() */ \"node_path\").then(__webpack_require__.t.bind(__webpack_require__, /*! node:path */ \"node:path\", 19));return(await __webpack_require__.e(/*! import() */ \"node_url\").then(__webpack_require__.t.bind(__webpack_require__, /*! node:url */ \"node:url\", 19))).fileURLToPath(a.dirname(e))}let o=e.lastIndexOf(k);if(o===-1)throw new Error(\"Could not extract indexURL path from pyodide module location\");return e.slice(0,o)}f(X,\"calculateDirname\");function G(t){let e=t.FS,o=t.FS.filesystems.MEMFS,a=t.PATH,l={DIR_MODE:16895,FILE_MODE:33279,mount:function(n){if(!n.opts.fileSystemHandle)throw new Error(\"opts.fileSystemHandle is required\");return o.mount.apply(null,arguments)},syncfs:async(n,r,u)=>{try{let i=l.getLocalSet(n),c=await l.getRemoteSet(n),s=r?c:i,m=r?i:c;await l.reconcile(n,s,m),u(null)}catch(i){u(i)}},getLocalSet:n=>{let r=Object.create(null);function u(s){return s!==\".\"&&s!==\"..\"}f(u,\"isRealDir\");function i(s){return m=>a.join2(s,m)}f(i,\"toAbsolute\");let c=e.readdir(n.mountpoint).filter(u).map(i(n.mountpoint));for(;c.length;){let s=c.pop(),m=e.stat(s);e.isDir(m.mode)&&c.push.apply(c,e.readdir(s).filter(u).map(i(s))),r[s]={timestamp:m.mtime,mode:m.mode}}return{type:\"local\",entries:r}},getRemoteSet:async n=>{let r=Object.create(null),u=await ge(n.opts.fileSystemHandle);for(let[i,c]of u)i!==\".\"&&(r[a.join2(n.mountpoint,i)]={timestamp:c.kind===\"file\"?(await c.getFile()).lastModifiedDate:new Date,mode:c.kind===\"file\"?l.FILE_MODE:l.DIR_MODE});return{type:\"remote\",entries:r,handles:u}},loadLocalEntry:n=>{let u=e.lookupPath(n).node,i=e.stat(n);if(e.isDir(i.mode))return{timestamp:i.mtime,mode:i.mode};if(e.isFile(i.mode))return u.contents=o.getFileDataAsTypedArray(u),{timestamp:i.mtime,mode:i.mode,contents:u.contents};throw new Error(\"node type not supported\")},storeLocalEntry:(n,r)=>{if(e.isDir(r.mode))e.mkdirTree(n,r.mode);else if(e.isFile(r.mode))e.writeFile(n,r.contents,{canOwn:!0});else throw new Error(\"node type not supported\");e.chmod(n,r.mode),e.utime(n,r.timestamp,r.timestamp)},removeLocalEntry:n=>{var r=e.stat(n);e.isDir(r.mode)?e.rmdir(n):e.isFile(r.mode)&&e.unlink(n)},loadRemoteEntry:async n=>{if(n.kind===\"file\"){let r=await n.getFile();return{contents:new Uint8Array(await r.arrayBuffer()),mode:l.FILE_MODE,timestamp:r.lastModifiedDate}}else{if(n.kind===\"directory\")return{mode:l.DIR_MODE,timestamp:new Date};throw new Error(\"unknown kind: \"+n.kind)}},storeRemoteEntry:async(n,r,u)=>{let i=n.get(a.dirname(r)),c=e.isFile(u.mode)?await i.getFileHandle(a.basename(r),{create:!0}):await i.getDirectoryHandle(a.basename(r),{create:!0});if(c.kind===\"file\"){let s=await c.createWritable();await s.write(u.contents),await s.close()}n.set(r,c)},removeRemoteEntry:async(n,r)=>{await n.get(a.dirname(r)).removeEntry(a.basename(r)),n.delete(r)},reconcile:async(n,r,u)=>{let i=0,c=[];Object.keys(r.entries).forEach(function(p){let d=r.entries[p],y=u.entries[p];(!y||e.isFile(d.mode)&&d.timestamp.getTime()>y.timestamp.getTime())&&(c.push(p),i++)}),c.sort();let s=[];if(Object.keys(u.entries).forEach(function(p){r.entries[p]||(s.push(p),i++)}),s.sort().reverse(),!i)return;let m=r.type===\"remote\"?r.handles:u.handles;for(let p of c){let d=a.normalize(p.replace(n.mountpoint,\"/\")).substring(1);if(u.type===\"local\"){let y=m.get(d),h=await l.loadRemoteEntry(y);l.storeLocalEntry(p,h)}else{let y=l.loadLocalEntry(p);await l.storeRemoteEntry(m,d,y)}}for(let p of s)if(u.type===\"local\")l.removeLocalEntry(p);else{let d=a.normalize(p.replace(n.mountpoint,\"/\")).substring(1);await l.removeRemoteEntry(m,d)}}};t.FS.filesystems.NATIVEFS_ASYNC=l}f(G,\"initializeNativeFS\");var ge=f(async t=>{let e=[];async function o(l){for await(let n of l.values())e.push(n),n.kind===\"directory\"&&await o(n)}f(o,\"collect\"),await o(t);let a=new Map;a.set(\".\",t);for(let l of e){let n=(await t.resolve(l)).join(\"/\");a.set(n,l)}return a},\"getFsHandles\");function Y(t){let e={noImageDecoding:!0,noAudioDecoding:!0,noWasmDecoding:!1,preRun:we(t),quit(o,a){throw e.exited={status:o,toThrow:a},a},print:t.stdout,printErr:t.stderr,arguments:t.args,API:{config:t},locateFile:o=>t.indexURL+o,instantiateWasm:Se(t.indexURL)};return e}f(Y,\"createSettings\");function he(t){return function(e){let o=\"/\";try{e.FS.mkdirTree(t)}catch(a){console.error(`Error occurred while making a home directory '${t}':`),console.error(a),console.error(`Using '${o}' for a home directory instead`),t=o}e.FS.chdir(t)}}f(he,\"createHomeDirectory\");function ve(t){return function(e){Object.assign(e.ENV,t)}}f(ve,\"setEnvironment\");function Ee(t){return e=>{for(let o of t)e.FS.mkdirTree(o),e.FS.mount(e.FS.filesystems.NODEFS,{root:o},o)}}f(Ee,\"mountLocalDirectories\");function be(t){let e=K(t);return o=>{let a=o._py_version_major(),l=o._py_version_minor();o.FS.mkdirTree(\"/lib\"),o.FS.mkdirTree(`/lib/python${a}.${l}/site-packages`),o.addRunDependency(\"install-stdlib\"),e.then(n=>{o.FS.writeFile(`/lib/python${a}${l}.zip`,n)}).catch(n=>{console.error(\"Error occurred while installing the standard library:\"),console.error(n)}).finally(()=>{o.removeRunDependency(\"install-stdlib\")})}}f(be,\"installStdlib\");function we(t){let e;return t.stdLibURL!=null?e=t.stdLibURL:e=t.indexURL+\"python_stdlib.zip\",[be(e),he(t.env.HOME),ve(t.env),Ee(t._node_mounts),G]}f(we,\"getFileSystemInitializationFuncs\");function Se(t){let{binary:e,response:o}=b(t+\"pyodide.asm.wasm\");return function(a,l){return async function(){try{let n;o?n=await WebAssembly.instantiateStreaming(o,a):n=await WebAssembly.instantiate(await e,a);let{instance:r,module:u}=n;typeof WasmOffsetConverter<\"u\"&&(wasmOffsetConverter=new WasmOffsetConverter(wasmBinary,u)),l(r,u)}catch(n){console.warn(\"wasm instantiation failed!\"),console.warn(n)}}(),{}}}f(Se,\"getInstantiateWasmFunc\");var A=\"0.26.1\";async function Be(t={}){await I();let e=t.indexURL||await X();e=S(e),e.endsWith(\"/\")||(e+=\"/\"),t.indexURL=e;let o={fullStdLib:!1,jsglobals:globalThis,stdin:globalThis.prompt?globalThis.prompt:void 0,lockFileURL:e+\"pyodide-lock.json\",args:[],_node_mounts:[],env:{},packageCacheDir:e,packages:[],enableRunUntilComplete:!1},a=Object.assign(o,t);a.env.HOME||(a.env.HOME=\"/home/pyodide\");let l=Y(a),n=l.API;if(n.lockFilePromise=J(a.lockFileURL),typeof _createPyodideModule!=\"function\"){let s=`${a.indexURL}pyodide.asm.js`;await E(s)}let r;if(t._loadSnapshot){let s=await t._loadSnapshot;ArrayBuffer.isView(s)?r=s:r=new Uint8Array(s),l.noInitialRun=!0,l.INITIAL_MEMORY=r.length}let u=await _createPyodideModule(l);if(l.exited)throw l.exited.toThrow;if(t.pyproxyToStringRepr&&n.setPyProxyToStringMethod(!0),n.version!==A)throw new Error(`Pyodide version does not match: '${A}' <==> '${n.version}'. If you updated the Pyodide version, make sure you also updated the 'indexURL' parameter passed to loadPyodide.`);u.locateFile=s=>{throw new Error(\"Didn't expect to load any more file_packager files!\")};let i;r&&(i=n.restoreSnapshot(r));let c=n.finalizeBootstrap(i);return n.sys.path.insert(0,n.config.env.HOME),c.version.includes(\"dev\")||n.setCdnUrl(`https://cdn.jsdelivr.net/pyodide/v${c.version}/full/`),n._pyodide.set_excepthook(),await n.packageIndexReady,n.initializeStreams(a.stdin,a.stdout,a.stderr),c}f(Be,\"loadPyodide\");\n//# sourceMappingURL=pyodide.mjs.map\n\n\n//# sourceURL=webpack://your-package-name/./node_modules/pyodide/pyodide.mjs?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".main.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "your-package-name:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkyour_package_name"] = self["webpackChunkyour_package_name"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./pyodide2.js");
/******/ 	
/******/ })()
;