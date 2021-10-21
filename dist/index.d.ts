declare type BufferEncoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex';
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
    }>;
}
export default class AxiosOss {
    constructor(option: AxiosOssOption);
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
    stsToken: string;
    endpoint: string;
    bucket: string;
    headerEncoding: BufferEncoding;
    refreshSTSTokenInterval: number;
    refreshSTSToken: () => Promise<{
        accessKeyId: string;
        accessKeySecret: string;
        stsToken: string;
    }>;
    refreshTime: number;
    put(path: string, file: File): Promise<unknown>;
}
export {};
