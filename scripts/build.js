// import path from 'node:path'
import { createRequire } from 'node:module';
import { execa } from 'execa'
const require = createRequire(import.meta.url)
const fs = require('fs')

const dirs = fs.readdirSync('packages').filter(p=>{
  if(!fs.statSync(`packages/${p}`).isDirectory()) {
    return false
  }
  return true
})
async function build(target) {
  console.log('--' + target)
  // execa包--开启子进程
  // -c 表示执行rollup配置(自定义的)，
  // 环境变量
  await execa('rollup',
    ['-c', '--environment', `TARGET:${target}`],
    {stdio:'inherit'} // 子进程的输出到父包输出
   )
}
/**
 * 打包  并行打包
 * @param {*} source packages目录子模块
 * @param {*} itemfn 打包的方法
 * @returns 
 */
async function runParallel(source, itemfn) {

  const result = []
  for (const item of source) {
    result.push(itemfn(item))
  }

  return Promise.all(result)

}

runParallel(dirs, build).then(()=>{
  console.log('成功')
})
// const pkgDir = path.resolve(`packages`)
console.log(dirs)
console.log('---------')
// console.log(pkgDir)
console.log('---------')
