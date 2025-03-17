import axios from 'axios';
import dateformat from 'dateformat';
import { Buffer } from 'buffer';
import crypto from './crypto/crypto';

type BufferEncoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex';

type RereshTokenFn = () => Promise<{
    accessKeyId: string;
    accessKeySecret: string;
    stsToken: string;
}>;

interface AliOssAxiosOption {
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
    stsToken: string;
    endpoint: string;
    bucket: string;
    refreshSTSTokenInterval: number;
    refreshSTSToken: RereshTokenFn;
}

interface Headers {
    method?: 'get' | 'put' | 'post' | 'delete';
    'Content-MD5'?: string;
    'Content-Type'?: string;
    authorization?: string;
    'x-oss-date'?: string;
    'x-oss-security-token'?: string;
    'security-token'?: string;
}

export class AliOssAxios {
    constructor(option: AliOssAxiosOption) {
        this.region = option.region;
        this.accessKeyId = option.accessKeyId;
        this.accessKeySecret = option.accessKeySecret;
        this.stsToken = option.stsToken;
        this.endpoint = option.endpoint;
        this.bucket = option.bucket;
        this.refreshSTSTokenInterval = option.refreshSTSTokenInterval || this.refreshSTSTokenInterval;
        this.refreshSTSToken = option.refreshSTSToken;

        this.refreshTime = Date.now();
    }

    region: string = '';

    private accessKeyId: string = '';

    private accessKeySecret: string = '';

    private stsToken: string = '';

    private endpoint: string = '';

    private bucket: string = '';

    private headerEncoding: BufferEncoding = 'utf-8';

    private refreshSTSTokenInterval: number = 60 * 1000; // 默认一分钟

    private refreshSTSToken: RereshTokenFn;

    private refreshTime = 0;

    private ossPrefix = 'x-oss';

    /**
     * 刷新token
     */
    private async refresh () {
        if (Date.now() - this.refreshTime >= this.refreshSTSTokenInterval) {
            const res = await this.refreshSTSToken();
            if (res.accessKeyId && res.accessKeySecret && res.stsToken) {
                this.accessKeyId = res.accessKeyId;
                this.accessKeySecret = res.accessKeySecret;
                this.stsToken = res.stsToken;
                this.refreshTime = Date.now();
            }
        }
    }

    /**
     * 获取resourcePath
     * @param path 上传路径
     */
    private getResourcePath(path: string) {
        if (!this.bucket) {
            return `/${path}`;
        }
        return `/${this.bucket}/${path}`;
    }

    private createCanonicalizedResource(resourcePath: string, params: any) {
        let canonicalizedResource = `${resourcePath}`;
        let separatorString = '?';
      
        const compareFunc = (entry1, entry2) => {
            if (entry1[0] > entry2[0]) {
              return 1;
            } else if (entry1[0] < entry2[0]) {
              return -1;
            }
            return 0;
        };
        const processFunc = (key) => {
            canonicalizedResource += separatorString + key;
            if (params[key]) {
                canonicalizedResource += `=${params[key]}`;
            }
            separatorString = '&';
        };
        Object.keys(params).sort(compareFunc).forEach(processFunc);
      
        return canonicalizedResource;
    }

    /**
     * 生成签名
     * @param resourcePath 上资源路径
     * @param resourcePathParams 拼接在resourcePath后面的参数
     * @param headers headers
     * @param expires expores 有效日期（string(单位：秒) / GMT格式）
     * @returns 签名
     */
    private createSign(resourcePath: string, resourcePathParams: any, headers: Headers, expires: string) {
        const signature = crypto.createHmac('sha1', this.accessKeySecret);
        const signatureContent = [
            headers.method?.toUpperCase() || 'GET',
            headers['Content-MD5'] || '',
            headers['Content-Type'],
            expires || headers['x-oss-date'],
        ];
        Object.keys(headers).forEach((k) => {
            if (k.indexOf(this.ossPrefix) === 0) {
                signatureContent.push(`${k}:${headers[k]}`);
            }
        });

        signatureContent.push(this.createCanonicalizedResource(resourcePath, resourcePathParams));
        // console.log(signatureContent);
        const sign = signature.update(Buffer.from(signatureContent.join('\n'), this.headerEncoding)).digest('base64');

        return sign;
    }

    /**
     * 上传
     * @param path 资源路径
     * @param file 文件
     * @param extraHeaders 拓展 headers
     * @returns 
     */
    async put(path: string, file: File, extraHeaders: Record<string, string> = {}): Promise<{ url: string }> {
        await this.refresh();
        const url = `https://${this.bucket}.${this.endpoint}/${path}`;
        const date = new Date();
        const expires = dateformat(date, 'UTC:ddd, dd mmm yyyy HH:MM:ss \'GMT\'');
        const headers: Headers = {
            method: 'put',
            'Content-Type': file.type,
            authorization: '',
            'x-oss-date': expires,
            'x-oss-security-token': this.stsToken,
            ...extraHeaders,
        };
        const sign = this.createSign(this.getResourcePath(path), {}, headers, expires);
        headers.authorization = `OSS ${this.accessKeyId}:${sign}`;
        return new Promise((resolve, reject) => {
            axios.put(url, file, {
                headers,
            })
                .then(() => {
                    resolve({ url });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * 生成用于预览或下载的文件URL
     * @param name
     * @param options
     * @returns Promise.resolve(url)
     */
    async signatureUrl(name: string, options: { response?: any; expires?: number }): Promise<string> {
        await this.refresh();
        const headers: Headers = {
            method: 'get',
        };
        const date = Math.round(Date.now() / 1000) + (options.expires || 1800);
        const expires = date.toString();
        const resourcePath = this.getResourcePath(name);
        const resourcePathParams = {};

        if (options.response) {
            Object.keys(options.response).forEach((k) => {
                const key = `response-${k.toLowerCase()}`;
                resourcePathParams[key] = options.response[k];
            });
        }

        if (this.stsToken) {
            resourcePathParams['security-token'] = this.stsToken;
        }

        const sign = this.createSign(resourcePath, resourcePathParams, headers, expires);
        const query = {
            OSSAccessKeyId: this.accessKeyId,
            Expires: expires,
            Signature: sign,
        };

        let urlParams = '';

        Object.keys(query).forEach((k) => {
            urlParams += `&${k}=${encodeURIComponent(query[k])}`;
        });
        Object.keys(resourcePathParams).forEach((k) => {
            urlParams += `&${k}=${encodeURIComponent(resourcePathParams[k])}`;
        });

        const url = `https://${this.bucket}.${this.endpoint}/${name}?${urlParams}`;
        return Promise.resolve(url);
    }
}
