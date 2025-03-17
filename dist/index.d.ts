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
export declare class AliOssAxios {
    constructor(option: AliOssAxiosOption);
    region: string;
    private accessKeyId;
    private accessKeySecret;
    private stsToken;
    private endpoint;
    private bucket;
    private headerEncoding;
    private refreshSTSTokenInterval;
    private refreshSTSToken;
    private refreshTime;
    private ossPrefix;
    /**
     * 刷新token
     */
    private refresh;
    /**
     * 获取resourcePath
     * @param path 上传路径
     */
    private getResourcePath;
    private createCanonicalizedResource;
    /**
     * 生成签名
     * @param resourcePath 上资源路径
     * @param resourcePathParams 拼接在resourcePath后面的参数
     * @param headers headers
     * @param expires expores 有效日期（string(单位：秒) / GMT格式）
     * @returns 签名
     */
    private createSign;
    /**
     * 上传
     * @param path 资源路径
     * @param file 文件
     * @param extraHeaders 拓展 headers
     * @returns
     */
    put(path: string, file: File, extraHeaders?: Record<string, string>): Promise<{
        url: string;
    }>;
    /**
     * 生成用于预览或下载的文件URL
     * @param name
     * @param options
     * @returns Promise.resolve(url)
     */
    signatureUrl(name: string, options: {
        response?: any;
        expires?: number;
    }): Promise<string>;
}
export {};
