"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dateformat_1 = __importDefault(require("dateformat"));
const buffer_1 = require("buffer");
const crypto_1 = __importDefault(require("./crypto/crypto"));
class AxiosOss {
    constructor(option) {
        this.region = '';
        this.accessKeyId = '';
        this.accessKeySecret = '';
        this.stsToken = '';
        this.endpoint = '';
        this.bucket = '';
        this.headerEncoding = 'utf-8';
        this.refreshSTSTokenInterval = 60 * 1000; // 默认一分钟
        this.refreshTime = 0;
        this.region = option.region;
        this.accessKeyId = option.accessKeyId;
        this.accessKeySecret = option.accessKeySecret;
        this.stsToken = option.stsToken;
        this.endpoint = option.endpoint;
        this.bucket = option.bucket;
        this.refreshSTSTokenInterval = option.refreshSTSTokenInterval;
        this.refreshSTSToken = option.refreshSTSToken;
        this.refreshTime = Date.now();
    }
    async put(path, file) {
        if (Date.now() - this.refreshTime >= this.refreshSTSTokenInterval) {
            const res = await this.refreshSTSToken();
            this.accessKeyId = res.accessKeyId;
            this.accessKeySecret = res.accessKeySecret;
            this.stsToken = res.stsToken;
            this.refreshTime = Date.now();
        }
        const url = `https://${this.bucket}.${this.endpoint}/${path}`;
        const signature = crypto_1.default.createHmac('sha1', this.accessKeySecret);
        const date = new Date();
        const expires = (0, dateformat_1.default)(date, 'UTC:ddd, dd mmm yyyy HH:MM:ss \'GMT\'');
        const signatureContent = [
            'put'.toUpperCase(),
            '',
            file.type,
            expires,
            `x-oss-date:${expires}`,
            `x-oss-security-token:${this.stsToken}`,
            `/${this.bucket}/${path}`,
        ];
        const sign = signature.update(buffer_1.Buffer.from(signatureContent.join('\n'), this.headerEncoding)).digest('base64');
        console.log(url);
        console.log(sign, file.type);
        console.log(`/${this.bucket}/${path}`);
        return new Promise((resolve, reject) => {
            axios_1.default.put(url, file, {
                headers: {
                    'Content-Type': file.type,
                    authorization: `OSS ${this.accessKeyId}:${sign}`,
                    'x-oss-date': expires,
                    'x-oss-security-token': this.stsToken,
                },
            })
                .then(() => {
                resolve({ url });
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
}
exports.default = AxiosOss;
