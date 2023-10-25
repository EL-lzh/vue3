// 通过rollup进行打包

// 进入相关依赖
import { createRequire } from 'module'
import ts from 'rollup-plugin-typescript2' // 解析ts
import json from '@rollup/plugin-json'  // 解析json
import resolvePlugin from '@rollup/plugin-node-resolve' // 解析第三方插件
import path from 'path' // 处理路径
import { fileURLToPath } from 'node:url'
const require = createRequire(import.meta.url)
// 获取文件路径
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const packagesDir = path.resolve(__dirname, 'packages')

// 获取配置的环境变量
const packageDir = path.resolve(packagesDir, process.env.TARGET)
const resolve = p => path.resolve(packageDir, p)
// 获取每个子模块的package.json配置文件
const pkg = require(resolve(`package.json`))
// 获取打包配置项
const packageOptions = pkg.buildOptions || {}

const name = path.basename(packageDir)
console.log(packageOptions)

// 创建映射
const outputConfigs = {
    "esm-bundler": {
        file: resolve(`dist/${name}.esm-bundler.js`), // 打包输出的路径
        format: 'es'
    },
    "cjs": {
        file: resolve(`dist/${name}.cjs.js`),
        format: 'cjs'
    },
    "global": {
        file: resolve(`dist/${name}.global.js`),
        format: 'iife'
    }
}

const packageFormats = packageOptions.formats

const packageConfigs = packageFormats.map(format => createConfig(format, outputConfigs[format]))
// rollup需要导出一个配置
export default packageConfigs

function createConfig(format, output) {
    // 进行打包
    output.name = packageOptions.name
    output.sourcemap = true
    // 生成rollup的配置
    return {
        input: resolve('src/index.ts'), // 导入
        output,
        plugins: [
            json(),
            ts({ //解析 ts
                tsconfig: path.resolve(__dirname, 'tsconfig.json')
            }),
            resolvePlugin()
        ]
    }
}