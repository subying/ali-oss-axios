基于axios实现ali-oss上传

#### 引入
```typescript
import { AliOssAxios } from 'ali-oss-axios';
const getOSSInstance = (() => {
    let instance: AliOssAxios;
    return async () => {
        if (instance) { return instance; }
        const res = await getOssToken(); // getOssToken是获取token方法
        instance = new AliOssAxios({
            // Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
            region: 'xxxx',
            // 从STS服务获取的临时访问凭证。临时访问凭证包括临时访问密钥（AccessKeyId和AccessKeySecret）和安全令牌（SecurityToken）。
            accessKeyId: res.access_key_id,
            accessKeySecret: res.access_key_secret,
            stsToken: res.security_token,
            endpoint: 'oss-accelerate.aliyuncs.com',
            // 填写Bucket名称。
            bucket: 'xxx',
            // 刷新临时访问凭证
            refreshSTSTokenInterval: 60000 * 5, // 5分钟刷新
            refreshSTSToken: async () => {
                const refreshToken = await getOssToken();
                return {
                    accessKeyId: refreshToken.access_key_id,
                    accessKeySecret: refreshToken.access_key_secret,
                    stsToken: refreshToken.security_token,
                };
            },
        });
        return instance;
    };
})();
```

#### 上传功能
```typescript
export const uploadOSS = async ({ file }: { file: File }) => {
    const basePath = 'test/dir';
    const path = `${basePath}/${Date.now()}/${file.name}`;
    const aliyunOSS = await getOSSInstance();
    return aliyunOSS.put(path, file);
};
```