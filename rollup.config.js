// 通过rollup进行打包

// 进入相关依赖
import ts from 'rollup-plugin-typescript2' // 解析ts
import json from '@rollup/plugin-json'  // 解析json
import resolvePlugin from '@rollup/plugin-node-resolve' // 解析第三方插件
import path from 'path' // 处理路径
import { fileURLToPath } from 'node:url'
// 获取文件路径
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const packagesDir = path.resolve(__dirname, 'packages')
console.log(packagesDir)

const packageDir = path.resolve(packagesDir, process.env.TARGET)
console.log(packageDir)