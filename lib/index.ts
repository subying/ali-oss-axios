import axios from 'axios';
import dateformat from 'dateformat';
import { Buffer } from 'buffer';
import crypto from './crypto/crypto';

type BufferEncoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex';

interface AxiosOssOption {
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
    stsToken: string;
    endpoint: string;
    bucket: string;
    refreshSTSTokenInterval: number;
    refreshSTSToken: () => Promise<{
        accessKeyId: string;
        accessKeySecret: string;
        stsToken: string;
    }>
}

export default class AxiosOss {
    constructor(option: AxiosOssOption) {
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

    region: string = '';

    accessKeyId: string = '';

    accessKeySecret: string = '';

    stsToken: string = '';

    endpoint: string = '';

    bucket: string = '';

    headerEncoding: BufferEncoding = 'utf-8';

    refreshSTSTokenInterval: number = 60 * 1000; // 默认一分钟

    refreshSTSToken: () => Promise<{
        accessKeyId: string;
        accessKeySecret: string;
        stsToken: string;
    }>;

    refreshTime = 0;

    async put(path: string, file: File) {
        if (Date.now() - this.refreshTime >= this.refreshSTSTokenInterval) {
            const res = await this.refreshSTSToken();
            this.accessKeyId = res.accessKeyId;
            this.accessKeySecret = res.accessKeySecret;
            this.stsToken = res.stsToken;
            this.refreshTime = Date.now();
        }
        const url = `https://${this.bucket}.${this.endpoint}/${path}`;
        const signature = crypto.createHmac('sha1', this.accessKeySecret);
        const date = new Date();
        const expires = dateformat(date, 'UTC:ddd, dd mmm yyyy HH:MM:ss \'GMT\'');
        const signatureContent = [
            'put'.toUpperCase(),
            '',
            file.type,
            expires,
            `x-oss-date:${expires}`,
            `x-oss-security-token:${this.stsToken}`,
            `/${this.bucket}/${path}`,
        ];
        const sign = signature.update(Buffer.from(signatureContent.join('\n'), this.headerEncoding)).digest('base64');
        console.log(url);
        console.log(sign, file.type);
        console.log(`/${this.bucket}/${path}`);
        return new Promise((resolve, reject) => {
            axios.put(url, file, {
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

    // signatureUrl(url: string, opt: any) {
    //     //
    // }
}
