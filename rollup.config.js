// import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import uglify from '@lopatnov/rollup-plugin-uglify';

export default {
  input: 'lib/index.ts', // 打包入口
  output: [
      {
          file: 'dist/index.js',
          format: 'cjs',
      },
      {
          file: 'dist/index.esm.js',
          format: 'es',
      }
  ],
  external: ['axios', 'buffer', 'dateformat'],
  plugins: [ // 打包插件
    // resolve(), // 查找和打包node_modules中的第三方模块
    commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
    typescript({
        exclude: '**/node_modules/**', // 防止打包node_modules下的文件
    }), // 解析TypeScript
    uglify()
  ]
}; 