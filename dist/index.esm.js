import axios from 'axios';
import dateformat from 'dateformat';
import require$$0, { Buffer as Buffer$2 } from 'buffer';

var crypto = {};

const Buffer$1=require$$0.Buffer,zeroBuffer$1=Buffer$1.alloc(4);zeroBuffer$1.fill(0);function toArray(r,e){if(r.length%4!=0){const e=r.length+(4-r.length%4);r=Buffer$1.concat([r,zeroBuffer$1],e);}const f=[],o=e?r.readInt32BE:r.readInt32LE;for(let e=0;e<r.length;e+=4)f.push(o.call(r,e));return f}function toBuffer(r,e,f){const o=Buffer$1.alloc(e),t=f?o.writeInt32BE:o.writeInt32LE;for(let e=0;e<r.length;e+=1)t.call(o,r[e],4*e,!0);return o}function hash$1(r,e,f,o){Buffer$1.isBuffer(r)||(r=Buffer$1.from(r));return toBuffer(e(toArray(r,o),8*r.length),f,o)}var helpers$2={hash:hash$1};

const helpers$1=helpers$2;function sha1_ft(r,e,s,o){return r<20?e&s|~e&o:r<40?e^s^o:r<60?e&s|e&o|s&o:e^s^o}function sha1_kt(r){return r<20?1518500249:r<40?1859775393:r<60?-1894007588:-899497514}function safe_add$1(r,e){const s=(65535&r)+(65535&e);return (r>>16)+(e>>16)+(s>>16)<<16|65535&s}function rol(r,e){return r<<e|r>>>32-e}function core_sha1(r,e){r[e>>5]|=128<<24-e%32,r[15+(e+64>>9<<4)]=e;const s=Array(80);let o=1732584193,a=-271733879,t=-1732584194,n=271733878,f=-1009589776;for(let e=0;e<r.length;e+=16){const d=o,_=a,c=t,u=n,h=f;for(let d=0;d<80;d+=1){s[d]=d<16?r[e+d]:rol(s[d-3]^s[d-8]^s[d-14]^s[d-16],1);const _=safe_add$1(safe_add$1(rol(o,5),sha1_ft(d,a,t,n)),safe_add$1(safe_add$1(f,s[d]),sha1_kt(d)));f=n,n=t,t=rol(a,30),a=o,o=_;}o=safe_add$1(o,d),a=safe_add$1(a,_),t=safe_add$1(t,c),n=safe_add$1(n,u),f=safe_add$1(f,h);}return Array(o,a,t,n,f)}var sha$1=function(r){return helpers$1.hash(r,core_sha1,20,!0)};

const helpers=helpers$2;function safe_add(d,m){const _=(65535&d)+(65535&m);return (d>>16)+(m>>16)+(_>>16)<<16|65535&_}function bit_rol(d,m){return d<<m|d>>>32-m}function md5_cmn(d,m,_,f,i,r){return safe_add(bit_rol(safe_add(safe_add(m,d),safe_add(f,r)),i),_)}function md5_ff(d,m,_,f,i,r,e){return md5_cmn(m&_|~m&f,d,m,i,r,e)}function md5_gg(d,m,_,f,i,r,e){return md5_cmn(m&f|_&~f,d,m,i,r,e)}function md5_hh(d,m,_,f,i,r,e){return md5_cmn(m^_^f,d,m,i,r,e)}function md5_ii(d,m,_,f,i,r,e){return md5_cmn(_^(m|~f),d,m,i,r,e)}function core_md5(d,m){d[m>>5]|=128<<m%32,d[14+(m+64>>>9<<4)]=m;let _=1732584193,f=-271733879,i=-1732584194,r=271733878;for(let m=0;m<d.length;m+=16){const e=_,h=f,n=i,g=r;_=md5_ff(_,f,i,r,d[m+0],7,-680876936),r=md5_ff(r,_,f,i,d[m+1],12,-389564586),i=md5_ff(i,r,_,f,d[m+2],17,606105819),f=md5_ff(f,i,r,_,d[m+3],22,-1044525330),_=md5_ff(_,f,i,r,d[m+4],7,-176418897),r=md5_ff(r,_,f,i,d[m+5],12,1200080426),i=md5_ff(i,r,_,f,d[m+6],17,-1473231341),f=md5_ff(f,i,r,_,d[m+7],22,-45705983),_=md5_ff(_,f,i,r,d[m+8],7,1770035416),r=md5_ff(r,_,f,i,d[m+9],12,-1958414417),i=md5_ff(i,r,_,f,d[m+10],17,-42063),f=md5_ff(f,i,r,_,d[m+11],22,-1990404162),_=md5_ff(_,f,i,r,d[m+12],7,1804603682),r=md5_ff(r,_,f,i,d[m+13],12,-40341101),i=md5_ff(i,r,_,f,d[m+14],17,-1502002290),f=md5_ff(f,i,r,_,d[m+15],22,1236535329),_=md5_gg(_,f,i,r,d[m+1],5,-165796510),r=md5_gg(r,_,f,i,d[m+6],9,-1069501632),i=md5_gg(i,r,_,f,d[m+11],14,643717713),f=md5_gg(f,i,r,_,d[m+0],20,-373897302),_=md5_gg(_,f,i,r,d[m+5],5,-701558691),r=md5_gg(r,_,f,i,d[m+10],9,38016083),i=md5_gg(i,r,_,f,d[m+15],14,-660478335),f=md5_gg(f,i,r,_,d[m+4],20,-405537848),_=md5_gg(_,f,i,r,d[m+9],5,568446438),r=md5_gg(r,_,f,i,d[m+14],9,-1019803690),i=md5_gg(i,r,_,f,d[m+3],14,-187363961),f=md5_gg(f,i,r,_,d[m+8],20,1163531501),_=md5_gg(_,f,i,r,d[m+13],5,-1444681467),r=md5_gg(r,_,f,i,d[m+2],9,-51403784),i=md5_gg(i,r,_,f,d[m+7],14,1735328473),f=md5_gg(f,i,r,_,d[m+12],20,-1926607734),_=md5_hh(_,f,i,r,d[m+5],4,-378558),r=md5_hh(r,_,f,i,d[m+8],11,-2022574463),i=md5_hh(i,r,_,f,d[m+11],16,1839030562),f=md5_hh(f,i,r,_,d[m+14],23,-35309556),_=md5_hh(_,f,i,r,d[m+1],4,-1530992060),r=md5_hh(r,_,f,i,d[m+4],11,1272893353),i=md5_hh(i,r,_,f,d[m+7],16,-155497632),f=md5_hh(f,i,r,_,d[m+10],23,-1094730640),_=md5_hh(_,f,i,r,d[m+13],4,681279174),r=md5_hh(r,_,f,i,d[m+0],11,-358537222),i=md5_hh(i,r,_,f,d[m+3],16,-722521979),f=md5_hh(f,i,r,_,d[m+6],23,76029189),_=md5_hh(_,f,i,r,d[m+9],4,-640364487),r=md5_hh(r,_,f,i,d[m+12],11,-421815835),i=md5_hh(i,r,_,f,d[m+15],16,530742520),f=md5_hh(f,i,r,_,d[m+2],23,-995338651),_=md5_ii(_,f,i,r,d[m+0],6,-198630844),r=md5_ii(r,_,f,i,d[m+7],10,1126891415),i=md5_ii(i,r,_,f,d[m+14],15,-1416354905),f=md5_ii(f,i,r,_,d[m+5],21,-57434055),_=md5_ii(_,f,i,r,d[m+12],6,1700485571),r=md5_ii(r,_,f,i,d[m+3],10,-1894986606),i=md5_ii(i,r,_,f,d[m+10],15,-1051523),f=md5_ii(f,i,r,_,d[m+1],21,-2054922799),_=md5_ii(_,f,i,r,d[m+8],6,1873313359),r=md5_ii(r,_,f,i,d[m+15],10,-30611744),i=md5_ii(i,r,_,f,d[m+6],15,-1560198380),f=md5_ii(f,i,r,_,d[m+13],21,1309151649),_=md5_ii(_,f,i,r,d[m+4],6,-145523070),r=md5_ii(r,_,f,i,d[m+11],10,-1120210379),i=md5_ii(i,r,_,f,d[m+2],15,718787259),f=md5_ii(f,i,r,_,d[m+9],21,-343485551),_=safe_add(_,e),f=safe_add(f,h),i=safe_add(i,n),r=safe_add(r,g);}return Array(_,f,i,r)}var md5$1=function(d){return helpers.hash(d,core_md5,16)};

const Buffer=require$$0.Buffer,sha=sha$1,md5=md5$1,algorithms={sha1:sha,md5:md5},zeroBuffer=Buffer.alloc(64);function hmac(e,r,t){Buffer.isBuffer(r)||(r=Buffer.from(r)),Buffer.isBuffer(t)||(t=Buffer.from(t)),r.length>64?r=e(r):r.length<64&&(r=Buffer.concat([r,zeroBuffer],64));const o=Buffer.alloc(64),i=Buffer.alloc(64);for(let e=0;e<64;e+=1)o[e]=54^r[e],i[e]=92^r[e];const c=e(Buffer.concat([o,t]));return e(Buffer.concat([i,c]))}function error(){const e=[].slice.call(arguments).join(" ");throw new Error([e,"we accept pull requests","http://github.com/dominictarr/crypto-browserify"].join("\n"))}function hash(e,r){const t=algorithms[e=e||"sha1"];let o=[],i=0;return t||error("algorithm:",e,"is not yet supported"),{update(e){return Buffer.isBuffer(e)||(e=Buffer.from(e)),o.push(e),i+=e.length,this},digest(e){const i=Buffer.concat(o),c=r?hmac(t,r,i):t(i);return o=null,e?c.toString(e):c}}}zeroBuffer.fill(0);crypto.createHash=function(e){return hash(e)};crypto.createHmac=function(e,r){return hash(e,r)};crypto.createCredentials=()=>{error("sorry,createCredentials is not implemented yet");};crypto.createCipher=()=>{error("sorry,createCipher is not implemented yet");};crypto.createCipheriv=()=>{error("sorry,createCipheriv is not implemented yet");};crypto.createDecipher=()=>{error("sorry,createDecipher is not implemented yet");};crypto.createDecipheriv=()=>{error("sorry,createDecipheriv is not implemented yet");};crypto.createSign=()=>{error("sorry,createSign is not implemented yet");};crypto.createVerify=()=>{error("sorry,createVerify is not implemented yet");};crypto.createDiffieHellman=()=>{error("sorry,createDiffieHellman is not implemented yet");};crypto.pbkdf2=()=>{error("sorry,pbkdf2 is not implemented yet");};

class AliOssAxios{constructor(e){this.region="",this.accessKeyId="",this.accessKeySecret="",this.stsToken="",this.endpoint="",this.bucket="",this.headerEncoding="utf-8",this.refreshSTSTokenInterval=6e4,this.refreshTime=0,this.region=e.region,this.accessKeyId=e.accessKeyId,this.accessKeySecret=e.accessKeySecret,this.stsToken=e.stsToken,this.endpoint=e.endpoint,this.bucket=e.bucket,this.refreshSTSTokenInterval=e.refreshSTSTokenInterval,this.refreshSTSToken=e.refreshSTSToken,this.refreshTime=Date.now();}async refresh(){if(Date.now()-this.refreshTime>=this.refreshSTSTokenInterval){const e=await this.refreshSTSToken();this.accessKeyId=e.accessKeyId,this.accessKeySecret=e.accessKeySecret,this.stsToken=e.stsToken,this.refreshTime=Date.now();}}createSign(e,s,t){const r=crypto.createHmac("sha1",this.accessKeySecret),i=["put".toUpperCase(),"",s.type,t,`x-oss-date:${t}`,`x-oss-security-token:${this.stsToken}`,`/${this.bucket}/${e}`];return r.update(Buffer$2.from(i.join("\n"),this.headerEncoding)).digest("base64")}async put(e,s){this.refresh();const t=`https://${this.bucket}.${this.endpoint}/${e}`,r=new Date,i=dateformat(r,"UTC:ddd, dd mmm yyyy HH:MM:ss 'GMT'"),o=this.createSign(e,s,i);return new Promise(((e,r)=>{axios.put(t,s,{headers:{"Content-Type":s.type,authorization:`OSS ${this.accessKeyId}:${o}`,"x-oss-date":i,"x-oss-security-token":this.stsToken}}).then((()=>{e({url:t});})).catch((e=>{r(e);}));}))}}

export { AliOssAxios, AliOssAxios as default };
