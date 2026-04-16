// ============================================================
// rogobot Cloudflare Worker
// 기존: /s (이미지 저장), /g (이미지 조회), /e (OG 래퍼)
// 추가: /bot (카카오톡 자동응답 처리)
// KV 바인딩: KVKV
// 시크릿:    BOT_SECRET, KAKAO_EMAIL, KAKAO_PASSWORD, LOSTARK_API_KEY
// ============================================================

// ─────────────────────────────────────────────────────────────
// 1. CryptoJS (AES + MD5) — 카카오 로그인 비밀번호 암호화용
// ─────────────────────────────────────────────────────────────
const CryptoJS = (() => {
  var CryptoJS=CryptoJS||function(u,p){var d={},l=d.lib={},s=function(){},t=l.Base={extend:function(a){s.prototype=this;var c=new s;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},r=l.WordArray=t.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=p?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,e=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var k=0;k<a;k++)c[j+k>>>2]|=(e[k>>>2]>>>24-8*(k%4)&255)<<24-8*((j+k)%4);else if(65535<e.length)for(k=0;k<a;k+=4)c[j+k>>>2]=e[k>>>2];else c.push.apply(c,e);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=t.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],e=0;e<a;e+=4)c.push(4294967296*u.random()|0);return new r.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++){var k=c[j>>>2]>>>24-8*(j%4)&255;e.push((k>>>4).toString(16));e.push((k&15).toString(16))}return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j+=2)e[j>>>3]|=parseInt(a.substr(j,2),16)<<24-4*(j%8);return new r.init(e,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++)e.push(String.fromCharCode(c[j>>>2]>>>24-8*(j%4)&255));return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j++)e[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new r.init(e,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},q=l.BufferedBlockAlgorithm=t.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,e=c.words,j=c.sigBytes,k=this.blockSize,b=j/(4*k),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*k;j=u.min(4*a,j);if(a){for(var q=0;q<a;q+=k)this._doProcessBlock(e,q);q=e.splice(0,a);c.sigBytes-=j}return new r.init(q,j)},clone:function(){var a=t.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=q.extend({cfg:t.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){q.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,e){return(new a.init(e)).finalize(b)}},_createHmacHelper:function(a){return function(b,e){return(new n.HMAC.init(a,e)).finalize(b)}}});var n=d.algo={};return d}(Math);
  (function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
  (function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
  (function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,l)}})();
  CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();
  (function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();
  return CryptoJS;
})();

// ─────────────────────────────────────────────────────────────
// 2. 카카오 세션 관리 (KV 캐싱)
// ─────────────────────────────────────────────────────────────
const SESSION_KV_KEY = 'session:kakao';

async function getSession(kv) {
  const raw = await kv.get(SESSION_KV_KEY);
  if (!raw) return null;
  return JSON.parse(raw); // { cookieName: cookieValue, ... }
}

async function saveSession(kv, cookies) {
  // 30일 TTL
  await kv.put(SESSION_KV_KEY, JSON.stringify(cookies), { expirationTtl: 60 * 60 * 24 * 30 });
}

function buildCookieHeader(cookies) {
  return Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');
}

function parseCookies(setCookieHeaders, jar = {}) {
  for (const header of setCookieHeaders) {
    const [pair] = header.split(';');
    const eqIdx = pair.indexOf('=');
    if (eqIdx === -1) continue;
    const key = pair.slice(0, eqIdx).trim();
    const val = pair.slice(eqIdx + 1).trim();
    jar[key] = val;
  }
  return jar;
}

// ─────────────────────────────────────────────────────────────
// 3. 카카오 로그인 (fetch 기반)
// ─────────────────────────────────────────────────────────────
const KAKAO_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0';

async function kakaoLogin(email, password) {
  let jar = {};

  // STEP 1: 로그인 페이지 → CSRF + 암호화 키
  const loginUrl = 'https://accounts.kakao.com/login?app_type=web&continue=' +
    encodeURIComponent('https://accounts.kakao.com/weblogin/account/info');
  const loginRes = await fetch(loginUrl, {
    headers: { 'User-Agent': KAKAO_UA, 'Referer': 'https://accounts.kakao.com/' },
    redirect: 'follow',
  });
  parseCookies(loginRes.headers.getSetCookie(), jar);

  const html = await loginRes.text();
  const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!nextDataMatch) throw new Error('Kakao login page structure changed');

  const nextData = JSON.parse(nextDataMatch[1]);
  const ctx = nextData?.props?.pageProps?.pageContext?.commonContext;
  if (!ctx) throw new Error('Kakao commonContext not found');

  const cryptoKey = ctx.p;
  const csrfToken = String(ctx._csrf);
  const referer = loginRes.url;

  // STEP 2: 티아라 트래킹
  await fetch('https://stat.tiara.kakao.com/track?d=' + encodeURIComponent(JSON.stringify({
    sdk: { type: 'WEB', version: '1.1.17' },
    env: { screen: '1920x1080', tz: '+9', cke: 'Y' },
    common: { svcdomain: 'accounts.kakao.com', deployment: 'production', url: 'https://accounts.kakao.com/login' },
    action: { type: 'Pageview' },
  })), {
    headers: { 'User-Agent': KAKAO_UA, 'Referer': 'https://accounts.kakao.com/', 'Cookie': buildCookieHeader(jar) },
  });

  // STEP 3: 로그인 인증
  const encPw = CryptoJS.AES.encrypt(password, cryptoKey).toString();
  const authRes = await fetch('https://accounts.kakao.com/api/v2/login/authenticate.json', {
    method: 'POST',
    headers: {
      'User-Agent': KAKAO_UA,
      'Content-Type': 'application/json',
      'Referer': referer,
      'Cookie': buildCookieHeader(jar),
    },
    body: JSON.stringify({ _csrf: csrfToken, activeSso: true, loginKey: email, loginUrl: referer, password: encPw, staySignedIn: true }),
    redirect: 'follow',
  });
  parseCookies(authRes.headers.getSetCookie(), jar);

  const authData = await authRes.json();
  if (authData.status !== 0) throw new Error(`Kakao login failed: ${authData.status}`);

  return jar;
}

// ─────────────────────────────────────────────────────────────
// 4. 카카오링크 전송 (fetch 기반)
// ─────────────────────────────────────────────────────────────
const KAKAO_API_KEY = 'c0d2d5a6da78d03cc4667cec3b4756a9';
const KAKAO_ORIGIN_URL = 'https://open.kakao.com/o/ssdOPG0e';
const KAKAO_KA = 'sdk/2.0.1 os/javascript sdk_type/javascript lang/en-US device/Win32 origin/' + encodeURIComponent(KAKAO_ORIGIN_URL);
const SHARER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0';

function b64Encode(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach(b => bin += String.fromCharCode(b));
  return btoa(bin);
}

async function sendKakaoLink(room, templateId, templateArgs, cookies) {
  const cookieHeader = buildCookieHeader(cookies);
  const data = { templateId, templateArgs, link_ver: '4.0' };

  // STEP 1: picker/link
  const linkRes = await fetch('https://sharer.kakao.com/picker/link', {
    method: 'POST',
    headers: {
      'User-Agent': SHARER_UA,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookieHeader,
    },
    body: new URLSearchParams({
      app_key: KAKAO_API_KEY,
      validation_action: 'custom',
      validation_params: JSON.stringify(data),
      ka: KAKAO_KA,
    }).toString(),
    redirect: 'follow',
  });

  if (linkRes.status !== 200) {
    const errBody = await linkRes.text();
    throw new Error(`picker/link: ${linkRes.status} | ${errBody.slice(0, 300)}`);
  }

  const linkBody = await linkRes.text();
  const sdMatch = linkBody.match(/serverData\s*=\s*"([^"]+)"/);
  if (!sdMatch) throw new Error('serverData not found in picker/link response');

  const serverData = JSON.parse(atob(sdMatch[1]));
  const { shortKey, csrfToken, checksum } = serverData.data;
  const chats = serverData.data.chats || [];

  const channelData = chats.find(c => c.title === room);
  if (!channelData) throw new Error(`Room "${room}" not found in chat list`);

  const receiver = b64Encode(JSON.stringify(channelData));

  // STEP 2: picker/send
  const sendRes = await fetch('https://sharer.kakao.com/picker/send', {
    method: 'POST',
    headers: {
      'User-Agent': SHARER_UA,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': linkRes.url,
      'Cookie': cookieHeader,
    },
    body: new URLSearchParams({
      app_key: KAKAO_API_KEY,
      short_key: shortKey,
      _csrf: csrfToken,
      checksum,
      receiver,
    }).toString(),
    redirect: 'follow',
  });

  if (sendRes.status !== 200) throw new Error(`picker/send: ${sendRes.status}`);
}

// 세션 사용 전송 (모바일에서 /session으로 업로드한 쿠키 사용)
// 카카오 로그인은 Cloudflare IP 차단(-481)으로 불가 → 모바일이 uploadSession()으로 업로드
async function sendKakaoLinkWithAuth(room, templateId, templateArgs, env) {
  const cookies = await getSession(env.KVKV);
  if (!cookies) {
    throw new Error('카카오 세션 없음. 모바일에서 !세션 입력하여 갱신해주세요.');
  }
  try {
    await sendKakaoLink(room, templateId, templateArgs, cookies);
  } catch (e) {
    // 세션 만료 시 안내 (재로그인 불가)
    throw new Error('카카오링크 전송 실패. 세션이 만료된 경우 !세션 으로 갱신해주세요. (' + e.message + ')');
  }
}

// ─────────────────────────────────────────────────────────────
// 5. 로스트아크 API (fetch 기반)
// ─────────────────────────────────────────────────────────────
const LOSTARK_BASE = 'https://developer-lostark.game.onstove.com';

async function lostarkGet(path, apiKey) {
  const res = await fetch(LOSTARK_BASE + path, {
    headers: { 'accept': 'application/json', 'authorization': 'bearer ' + apiKey },
  });
  if (!res.ok) return null;
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}

async function getCharacterImage(name) {
  try {
    const res = await fetch(`https://lostark.game.onstove.com/Profile/Character/${encodeURIComponent(name)}`, {
      headers: { 'User-Agent': KAKAO_UA },
    });
    const html = await res.text();
    const m = html.match(/profile-equipment__character[\s\S]*?<img[^>]+src="([^"]+)"/);
    return m ? m[1] : '';
  } catch { return ''; }
}

// ─────────────────────────────────────────────────────────────
// 6. 로스트아크 데이터 가공 (로아API카링.js 포팅)
// ─────────────────────────────────────────────────────────────
function tooltipToJSON(s) {
  try {
    const obj = JSON.parse(s);
    return Object.keys(obj).sort()
      .filter(k => k.startsWith('Element_'))
      .map(k => obj[k])
      .filter(Boolean);
  } catch { return []; }
}

function changeStrForAcce(data) {
  return data
    .replace(/추가 피해 \+/gi, ' 추피').replace(/적에게 주는 피해 \+/gi, ' 적주피')
    .replace(/무기 공격력 \+/gi, ' 무공').replace(/세레나데, 신앙, 조화 게이지 획득량 \+/gi, ' 아획량')
    .replace(/최대 생명력 \+/gi, ' 최생').replace(/최대 마나 \+/gi, ' 최마')
    .replace(/상태이상 공격 지속시간 \+/gi, ' 상공지').replace(/전투 중 생명력 회복량 \+/gi, ' 생회')
    .replace(/파티원 회복 효과 \+/gi, ' 파회').replace(/파티원 보호막 효과 \+/gi, ' 파보')
    .replace(/치명타 적중률 \+/gi, ' 치적').replace(/치명타 피해 \+/gi, ' 치피')
    .replace(/아군 공격력 강화 효과 \+/gi, ' 아공').replace(/아군 피해량 강화 효과 \+/gi, ' 아피')
    .replace(/공격력 \+/gi, ' 공격력').replace(/낙인력 \+/gi, ' 낙인력').replace(/%/gi, '');
}

// 카카오링크 templateArgs 빌드 (전송은 모바일에서 담당)
async function buildCharacterInfo(data) {
  const profile = data['ArmoryProfile'];
  const equipment = data['ArmoryEquipment'] || [];
  const engraving = data['ArmoryEngraving'];
  const gem = data['ArmoryGem'];
  const card = data['ArmoryCard'];
  const arkPassive = data['ArkPassive'];

  const name = profile['CharacterName'];
  const itemLevel = profile['ItemAvgLevel'];
  const expLevel = profile['ExpeditionLevel'];
  const charLevel = profile['CharacterLevel'];
  const className = profile['CharacterClassName'];
  const server = profile['ServerName'];
  const guildName = profile['GuildName'];
  const combatPower = profile['CombatPower'];
  const isArkPassive = arkPassive['IsArkPassive'];
  const templateId = isArkPassive ? 110730 : 110687;

  // 무기 강화
  let weapon = '';
  for (const eq of equipment) {
    if (eq['Type'] === '무기') {
      weapon += eq['Name'].slice(1, 3);
      const tips = tooltipToJSON(eq['Tooltip']);
      for (const t of tips) {
        if (t['type']?.includes('SingleTextBox') && t['value']?.includes('상급 재련')) {
          const v = t['value'].replace(/[^\d]*(\d+)[^\d]*/g, '$1').slice(0, 2);
          weapon += `(${v})`;
        }
      }
      break;
    }
  }

  // 평균 품질
  let totalQ = 0, countQ = 0;
  for (const eq of equipment) {
    for (const t of tooltipToJSON(eq['Tooltip'])) {
      if (t['type']?.includes('ItemTitle') && t['value']?.qualityValue >= 0) {
        totalQ += t['value']['qualityValue']; countQ++;
      }
    }
  }
  const avgQuality = countQ ? Math.round(totalQ / countQ * 10) / 10 : 0;

  // 초월
  let transTotal = 0;
  for (const eq of equipment) {
    for (const t of tooltipToJSON(eq['Tooltip'])) {
      if (t['type']?.includes('IndentStringGroup') && t['value']) {
        const top = t['value']['Element_000']?.topStr;
        if (top?.includes('초월')) transTotal += parseInt(top.replace(/.*?(\d+)\D*$/, '$1')) || 0;
      }
    }
  }

  // 엘릭서
  let elixir = '';
  for (const eq of equipment) {
    if (eq['Type'] === '투구') {
      for (const t of tooltipToJSON(eq['Tooltip'])) {
        if (t['type']?.includes('IndentStringGroup') && t['value']) {
          const top = t['value']['Element_000']?.topStr;
          if (top?.includes('연성')) {
            elixir += top.replace(/연성 추가 효과\s*/g, '').replace(/\((\d+)단계\)/g, 'Lv.$1');
          }
        }
      }
    }
  }

  // 각인
  let engravings = '';
  if (isArkPassive) {
    const effects = engraving?.['ArkPassiveEffects'];
    if (!effects) {
      engravings = '미설정';
    } else {
      let stone = '/ ';
      for (const e of effects) {
        const n = e['Name'].slice(0, 1);
        const lv = e['Level'];
        let gr = e['Grade'] === '전설' ? '전' : e['Grade'] === '영웅' ? '영' : '';
        engravings += `${n}${gr}${lv} `;
        if (e['AbilityStoneLevel'] != null) stone += `${n}${e['AbilityStoneLevel']} `;
      }
      engravings += stone;
    }
  } else {
    for (const e of (engraving?.['Effects'] || [])) {
      engravings += e['Name'].slice(0, 1) + e['Name'].slice(-1) + ' ';
    }
  }

  // 스톤 공증
  let stoneAtk = '+';
  for (const eq of equipment) {
    if (eq['Type'] === '어빌리티 스톤') {
      for (const t of tooltipToJSON(eq['Tooltip'])) {
        if (t['type']?.includes('IndentStringGroup') && typeof t['value'] === 'object' && t['value']?.['Element_001']) {
          const c = t['value']['Element_001']['contentStr'];
          if (c?.['Element_003']) stoneAtk += c['Element_003']['contentStr'].slice(-6);
          else stoneAtk = '%';
        }
      }
    }
  }

  // 보석
  let gems4 = '', gemsDesc = '공증:';
  const gemList = gem?.['Gems'];
  if (!gemList) {
    gems4 = '쌀';
    gemsDesc = stoneAtk.length > 2 ? `공증:${stoneAtk.slice(1)}` : '';
  } else {
    const gDesc = gem?.['Effects']?.['Description'] || '';
    gemsDesc += gDesc.slice(-6, -2) + stoneAtk;
    const dmg = [], cool = [];
    for (const g of gemList) {
      const n = g['Name'], lv = g['Level'];
      if (n.includes('광휘') || n.includes('겁화')) dmg.push(lv);
      else if (n.includes('멸화')) dmg.push(lv - 2);
      else if (n.includes('작열')) cool.push(lv);
      else if (n.includes('홍염')) cool.push(lv - 2);
    }
    dmg.sort((a, b) => b - a); cool.sort((a, b) => b - a);
    gems4 = `${dmg.join(', ')} / ${cool.join(', ')}`;
  }

  // 스탯
  let maxHp = '', atk = '', charStat = '';
  for (const s of (profile['Stats'] || [])) {
    if (s['Type'] === '최대 생명력') maxHp = s['Value'];
    else if (s['Type'] === '공격력') atk = s['Value'];
    else if (parseInt(s['Value']) >= 100) charStat += `${s['Type']} ${s['Value']} `;
  }
  const evName = arkPassive['Points'][0]['Name'].slice(0, 1);
  const evVal = arkPassive['Points'][0]['Value'];
  const rlName = arkPassive['Points'][1]['Name'].slice(0, 1);
  const rlVal = arkPassive['Points'][1]['Value'];
  const stats = `공: ${atk} 최생: ${maxHp}\n${evName}: ${evVal} ${rlName}: ${rlVal} `;

  // 카드
  const cardItems = card?.['Effects']?.[0]?.['Items'] || [];
  const cardEffect = cardItems.length ? cardItems[cardItems.length - 1]['Name'] : '';

  const title = `${itemLevel} / ${weapon}\n${expLevel} / ${charLevel} / ${avgQuality}`;
  const description = `${className} / ${server} / ${elixir} / 초월(${transTotal})`;
  const imageUrl = await getCharacterImage(name);
  const imageString = imageUrl.replace('https://img.lostark.co.kr/armory/', '');

  return {
    __kakaolink: {
      templateId,
      templateArgs: {
        header: name,
        title,
        engravings,
        gems4,
        combatPower,
        stat: stats + gemsDesc,
        character: charStat,
        description,
        card: cardEffect,
        illoa: name,
        image: imageUrl,
        imageurl: imageString,
      },
    },
  };
}

// ─────────────────────────────────────────────────────────────
// 7. 봇 명령어 (테스트.js 포팅)
// ─────────────────────────────────────────────────────────────
const SYNERGY_INFO = {
  '전사 (슈샤이어)': [
    { class: '워로드', synergy: '방감12, 피증4, 백헤드5' },
    { class: '디트', synergy: '방감12' },
    { class: '버서커/슬레', synergy: '피증6' },
  ],
  '무도가 (애니츠)': [
    { class: '창술', synergy: '치명타 시 피증8' },
    { class: '배마', synergy: '치적10, 공속8, 이속16' },
    { class: '스커', synergy: '치적10, 공속8' },
    { class: '인파/브레', synergy: '피증6' },
    { class: '기공', synergy: '공증6' },
  ],
  '헌터 (아르데타인)': [
    { class: '데헌/건슬', synergy: '치적 10' },
    { class: '호크', synergy: '피증6, 이속4(두동)' },
    { class: '블래', synergy: '방감12' },
    { class: '스카', synergy: '공증6' },
  ],
  '마법사 (실린)': [
    { class: '서머너', synergy: '방감12, 마회40 (트포 선택)' },
    { class: '알카', synergy: '치적10' },
    { class: '소서', synergy: '피증6' },
  ],
  '암살자 (데런)': [
    { class: '리퍼', synergy: '방감12' },
    { class: '데모닉', synergy: '피증6' },
    { class: '소울', synergy: '피증6' },
    { class: '블레', synergy: '피증4, 백헤드5, 공속25, 이속20' },
  ],
  '스페셜리스트 (요즈)': [
    { class: '기상', synergy: '치적10, 공속12(질풍), 이속12(질풍), 공감10(이슬비)' },
    { class: '환수', synergy: '방감12' },
  ],
};

// 모든 명령어를 처리하고 텍스트 응답 반환 (null이면 카카오링크로 처리됨)
async function processMessage(room, msg, sender, isGroupChat, env) {

  // ── 로스트아크 API 명령어 (카카오링크) ──
  if (msg.startsWith('!정보 ')) {
    const name = msg.slice(4).trim();
    if (name) {
      const data = await lostarkGet(`/armories/characters/${encodeURIComponent(name)}`, env.LOSTARK_API_KEY);
      if (!data) return '캐릭터를 찾을 수 없습니다.';
      if (!data['ArmoryProfile']) return `${name} 캐릭터를 찾을 수 없습니다.`;
      // 카카오링크 데이터 빌드 후 모바일로 반환 (모바일에서 sendLink 호출)
      return await buildCharacterInfo(data);
    }
  }

  // ── 즐로아 검색 ──
  const zloaCmds = ['!즐', '!ㅈ', '!ㅈㄹㅇ', '!즐로아', '!즐로'];
  for (const cmd of zloaCmds) {
    if (msg.startsWith(cmd + ' ')) {
      const nick = msg.slice(cmd.length + 1).trim();
      if (nick) return `https://zloa.net/char/${encodeURIComponent(nick)}`;
    }
    if (msg === cmd) return 'https://zloa.net/';
  }

  // ── 로펙 검색 ──
  const lopecCmds = ['!ㄿ', '!로펙', '!ㄹㅍ'];
  for (const cmd of lopecCmds) {
    if (msg.startsWith(cmd + ' ')) {
      const nick = msg.slice(cmd.length + 1).trim();
      if (nick) return `https://legacy.lopec.kr/search/search.html?headerCharacterName=${encodeURIComponent(nick)}`;
    }
    if (msg === cmd) return 'https://lopec.kr/';
  }

  // ── 각인도감 ──
  if (msg === '!각인도감' || msg === '!ㄱㅇㄷㄱ')
    return 'https://docs.google.com/spreadsheets/d/1tCtHi5GZh1p_1zCjJbNOam0-eVIqVHhSyV_W1_EOAGE/edit?usp=sharing';

  // ── 데미지 ──
  if (msg.startsWith('!데미지 ')) return `https://lostbuilds.com/info/${msg.split(' ')[1]}`;

  // ── 명령어 목록 ──
  if (msg === '!명령어' || msg === '!?')
    return '!정보 캐릭터이름\n!배럭(ㅂㄹ) 캐릭터이름\n!스킬 캐릭터이름\n!보석 캐릭터이름\n!장비 캐릭터이름\n!악세 캐릭터이름\n!앜패(ㅇㅍ) 캐릭터이름\n!아크(ㅇㅋ) 캐릭터이름\n!낙원(ㄴㅇ,ㄴㅇㄹ,낙원력) 캐릭터이름\n!각인 캐릭터이름\n!내실 캐릭터이름\n!아바타 캐릭터이름\n!섬(ㅅ,ㅆ)\n!유각(ㅇㄱ,ㅅㅍㅇㄱ)\n!젬가격(ㅈㄱㄱ)\n!클골(ㅋㄱ)\n!시간표(ㅅㄱㅍ)\n!폿엘릭서(ㅍㅇㄽ)\n!ㅇㄱㄹ\n!ㅂㅂㄱ 금액\n!시너지(ㅅㄵ,ㅅㄴㅈㅈ)\n!공홈(ㄱㅎ)\n!즐(ㅈ) 캐릭터이름\n!로펙(ㄹㅍ) 캐릭터이름\n!깨달음,진화(ㄲㄷㅇ,ㅈㅎ)\n!등급직업분류정렬가격 검색어\n!가격설명서\n==========\n!로또\n!주사위\n!점메추\n!저메추\n어쩌구저쩌구확 률\n어절씨구v s저절씨구';

  // ── 가격 설명서 ──
  if (msg === '!가격설명서')
    return '등급\n일반,고급,희귀,영웅,전설,유물,고대,에스더\n\n직업\n버서커,디트,인파,기공,창술,스커,블레,데모닉,리퍼,호크,데헌,블래,워로드,스카,건슬,도화가,기상,홀나,슬레,알카,서머너,바드,소서,배마\n\n분류\n아바타,각인,재료,배템,요리,생활,모험,항해,펫,탈것,기타\n\n정렬순\n높은순,낮은순';

  // ── 공홈 ──
  if (msg === '!공홈' || msg === '!ㄱㅎ') return 'https://lostark.game.onstove.com/Main';

  // ── 시너지 ──
  if (msg === '!시너지' || msg === '!ㅅㄵ' || msg === '!ㅅㄴㅈ') {
    let out = '';
    for (const cat in SYNERGY_INFO) {
      out += ` ✤ ${cat}\n`;
      SYNERGY_INFO[cat].forEach(e => { out += `${e.class} : ${e.synergy}\n`; });
    }
    return out.trimEnd();
  }

  // ── 카멘/하브 주차 ──
  if (['!카멘','!하브','!하멘','!아브','!ㅋㅁ','!ㅎㅂ','!ㅎㅁ','!ㅇㅂ'].includes(msg)) {
    const base = new Date(2023, 8, 13);
    const now = new Date();
    const baseDay = (base.getDay() + 4) % 7;
    const curDay = (now.getDay() + 4) % 7;
    const diffDays = Math.floor((now - base) / 86400000);
    const diffWeeks = Math.floor((diffDays - (curDay - baseDay)) / 7);
    return `오늘은 ${diffWeeks % 2 === 0 ? '4관' : '3관'}주!!`;
  }

  // ── 깨달음 / 진화 ──
  if (['!깨달음','!ㄲㄷㅇ'].some(c => msg.startsWith(c)))
    return '깨달음포인트\n(1)전투레벨\n전투레벨50부터 1당 1p,최대20p\n(2)내실\n에포나3p,모험의서3p,해도3p,필보5p\n(3)악세\n유물:목걸이10p,나머지9p\n고대:목걸이13p,나머지12p';
  if (['!진화','!ㅈㅎ'].some(c => msg.startsWith(c)))
    return '진화 포인트\n전투레벨 50부터 1당 +1, 최대 +20\n유물장비 부위당 +8\n고대장비 부위당 +20';

  // ── 시간표 ──
  if (msg === '!시간표' || msg === '!ㅅㄱㅍ')
    return '로아 시간표\n 월 - 카게\n 화 - 필보, 태초\n 수 - 숙제나해\n 목 - 카게, 태초\n 금 - 필보\n 토 - 카게, 태초\n 일 - 카게, 필보';

  // ── 검사 보스 ──
  if (['!검사','!㳅','!ㄱㅅ'].includes(msg)) {
    const days = ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];
    const d = new Date().getDay();
    const schedules = [
      '0200 : 금예니왕\n1100 : 산군\n1600 : 금예니왕\n2000 : 불가살 우투리\n2345 : 금예니왕 산군',
      '0200 : 불가살\n1100 : 우투리\n1600 : 금예니왕\n2000 : 산군 불가살\n2345 : 우투리 금예니왕',
      '0200 : 산군\n1100 : 금예니왕\n1600 : 불가살\n2000 : 금예니왕 우투리\n2345 : 산군 불가살',
      '0200 : 금예니왕\n1600 : 불가살\n2000 : 우투리 산군\n2345 : 산군 불가살',
      '0200 : 우투리\n1100 : 산군\n1600 : 우투리\n2000 : 산군 금예니왕\n2345 : 불가살 우투리',
      '0200 : 산군\n1100 : 불가살\n1600 : 우투리\n2000 : 금예니왕 불가살\n2345 : 우투리 산군',
      '0200 : 불가살\n1100 : 금예니왕\n1600 : 산군\n2345 : 불가살 우투리',
    ];
    return `< ${days[d]} 검사 보스 >\n${schedules[d]}`;
  }

  // ── 분배금 ──
  if (msg.startsWith('!ㅂㅂㄱ ')) {
    const gold = parseInt(msg.slice(5));
    if (!isNaN(gold)) {
      const four = gold * 0.95 * 0.75;
      const eight = gold * 0.95 * 0.875;
      const sixteen = gold * 0.95 * 0.9375;
      return `< 사이 좃은 분배금 >\n4인 엔빵비 - ${parseInt(four)}\n4인 개이득 - ${parseInt(four/1.1)}\n8인 엔빵비 - ${parseInt(eight)}\n8인 개이득 - ${parseInt(eight/1.1)}\n16인 엔빵비 - ${parseInt(sixteen)}\n16인 개이득 - ${parseInt(sixteen/1.1)}`;
    }
  }

  // ── 로또 ──
  if (msg === '!로또') {
    const nums = [];
    while (nums.length < 7) {
      const n = Math.floor(Math.random() * 45) + 1;
      if (!nums.includes(n)) nums.push(n);
    }
    return `로또 결과 : ${nums.slice(0, 6).join(' ')} + ${nums[6]}`;
  }

  // ── 주사위 ──
  if (msg === '!주사위') return `주사위 결과 : ${Math.floor(Math.random() * 6) + 1}`;

  // ── 간단 응답 ──
  const simpleMap = {
    '아멘': '할렐루야', '할렐루야': '아멘',
    '!고로': '쉿!!',
    '!뱁새': '다싶고하스섹\n싶            스\n고            하\n하            고\n스            싶\n섹스하고싶다',
    '!앙윽': '껄껄스껄', '!cex': '뱁새!', '!모자': '뱁새야 서버', '!헨콘': '노콘노섹',
    '!덜디': '덜..보검!!', '!예니': '예으응... 동결건조파인애플..',
    '!해찬': '째깍째깍 퇴근퇴근', '!유진': '유르카나 하싈?',
    '!출근': 'ㅋㅋ 누가 출근', '!야근': 'ㅋㅋ 누가 야근', '!퇴근': 'ㅋㅋ 야근해야지',
  };
  if (simpleMap[msg]) return simpleMap[msg];

  // ── 메뉴 추천 ──
  const allMenu = ['돈가스','쌀국수','피자','햄버거','보쌈','삼겹살','갈비','족발','치킨','국밥','라면','타코야키','김밥','근라탕','근볶이','짜장면','짬뽕','탕수육','소고기','닭갈비','닭볶음탕','우육면','서브웨이','장어','탕탕이','볶음밥','회','초밥','김치찌개','된장찌개','부대찌개','순대','튀김','김치찜','해물찜','아구찜','밥국김치','엄마밥','할미밥','막곱대창','파스타','팔보채','마파두부','분짜','간계밥','샐러드','도시락','밥버거','솔의눈','콩밥','마라샹궈','빵','커피','도넛','엿','말고기'];
  if (msg === '!점메추' || msg === '!저메추')
    return `${allMenu[Math.floor(Math.random() * allMenu.length)]} 잡숴\n한중일양간/식`;
  if (msg === '!한식') { const m = ['김밥','비빔밥','김치찌개','된장찌개','부대찌개','삼겹살','갈비','닭갈비','냉면','국밥']; return `한식으로 ${m[Math.floor(Math.random()*m.length)]} 추천!!`; }
  if (msg === '!중식') { const m = ['짜장면','짬뽕','탕수육','마라샹궈','마파두부','깐풍기','유린기','우육면']; return `中餐 ${m[Math.floor(Math.random()*m.length)]} 举荐!!`; }
  if (msg === '!일식') { const m = ['초밥','라멘','우동','소바','돈가스','타코야키','덴푸라','오코노미야키']; return `和食 ${m[Math.floor(Math.random()*m.length)]} を お勧めします!!`; }
  if (msg === '!양식') { const m = ['파스타','피자','스테이크','리조또','피시앤칩스','케밥']; return `I recommend ${m[Math.floor(Math.random()*m.length)]}!!`; }
  if (msg === '!간식') { const m = ['도넛','케이크','아이스크림','탕후루','마카롱','에이드']; return `${m[Math.floor(Math.random()*m.length)]}!!`; }

  // ── vs 투표 ──
  if (msg.includes('vs') && !msg.includes('http')) {
    const parts = msg.split('vs');
    return `${parts[Math.floor(Math.random() * parts.length)]}!!`;
  }

  // ── 확률 ──
  if (msg.includes('확률')) {
    const parts = msg.split('확률');
    return `${parts[0]}확률 ${Math.floor(Math.random() * 100)}% !!`;
  }

  return null; // 해당 명령어 없음
}

// ─────────────────────────────────────────────────────────────
// 8. 메인 Worker
// ─────────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {

    // ── 공통 헬퍼 ──
    const rawPlain = (t) => new Response(t, { headers: { 'content-type': 'text/plain;charset=UTF-8' } });
    const rawHtml = (h) => new Response(h, { headers: { 'content-type': 'text/html;charset=UTF-8' } });
    const rawImage = (i) => new Response(i, { headers: { 'content-type': 'image/jpeg' } });
    const rawJson = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json' } });

    function getKey() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let r = '';
      for (let i = 0; i < 6; i++) r += chars.charAt(Math.floor(Math.random() * chars.length));
      return r;
    }

    const { pathname } = new URL(request.url);

    try {
      // ── 기존: 이미지 저장 ──
      if (pathname === '/s') {
        const body = await request.json();
        let key = getKey();
        while (null != await env.KVKV.get(key)) key = getKey();
        await env.KVKV.put(key, body.image, { expirationTtl: 3600 });
        return rawPlain(key);
      }

      // ── 기존: 이미지 조회 ──
      if (pathname.startsWith('/g')) {
        const query = pathname.split('/')[2];
        let image = await env.KVKV.get(query);
        if (!image) return new Response('Server Error', { status: 500 });
        image = Uint8Array.from(atob(image), c => c.charCodeAt(0));
        return rawImage(image);
      }

      // ── 기존: OG 래퍼 ──
      if (pathname.startsWith('/e')) {
        const query = pathname.split('/')[2];
        const url = `https://worker-green-meadow-d8c1.rmsepskek02.workers.dev/g/${query}`;
        return rawHtml(`<html><head><meta property="og:image" content="${url}"><title>사진</title></head><body><img src="${url}" alt="img"/></body></html>`);
      }

      // ── 신규: 카카오 세션 업로드 (모바일 로고봇에서 호출) ──
      if (pathname === '/session' && request.method === 'POST') {
        if (request.headers.get('X-Bot-Secret') !== env.BOT_SECRET) {
          return rawJson({ error: 'Unauthorized' }, 401);
        }
        const { cookies } = await request.json();
        if (!cookies || typeof cookies !== 'object') {
          return rawJson({ error: 'cookies 필드가 필요합니다' }, 400);
        }
        await saveSession(env.KVKV, cookies);
        return rawJson({ ok: true });
      }

      // ── 신규: 봇 처리 ──
      if (pathname === '/bot' && request.method === 'POST') {
        // 시크릿 검증
        if (request.headers.get('X-Bot-Secret') !== env.BOT_SECRET) {
          return rawJson({ error: 'Unauthorized' }, 401);
        }

        const { room, msg, sender, isGroupChat } = await request.json();
        const result = await processMessage(room, msg, sender, isGroupChat, env);
        // 카카오링크 응답: { __kakaolink: { templateId, templateArgs } }
        if (result && typeof result === 'object' && result.__kakaolink) {
          return rawJson({ reply: null, kakaolink: result.__kakaolink });
        }
        return rawJson({ reply: result });
      }

    } catch (e) {
      console.error(e);
      // /bot 은 항상 JSON 반환 (모바일 봇이 JSON.parse 하기 때문)
      if (pathname === '/bot') {
        return rawJson({ reply: '삐빅! 서버 에러: ' + String(e) }, 500);
      }
      return new Response(String(e), { status: 500 });
    }

    return new Response('Not Found', { status: 404 });
  },
};
