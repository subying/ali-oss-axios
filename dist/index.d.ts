declare type BufferEncoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex';
declare type RereshTokenFn = () => Promise<{
    accessKeyId: string;
    accessKeySecret: string;
    stsToken: string;
}>;
interface AxiosOssOption {
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
    stsToken: string;
    endpoint: string;
    bucket: string;
    refreshSTSTokenInterval: number;
    refreshSTSToken: RereshTokenFn;
}
export declare class AliOssAxios {
    constructor(option: AxiosOssOption);
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
    stsToken: string;
    endpoint: string;
    bucket: string;
    headerEncoding: BufferEncoding;
    refreshSTSTokenInterval: number;
    refreshSTSToken: RereshTokenFn;
    refreshTime: number;
    /**
     * 刷新token
     */
    private refresh;
    /**
     * 生成签名
     * @param path 上传路径
     * @param file 上传文件
     * @param expires 日期 GMT格式
     * @returns 签名
     */
    private createSign;
    put(path: string, file: File): Promise<{
        url: string;
    }>;
}
export {};
