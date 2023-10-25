
import { execa } from 'execa'

async function build(target) {
  // execa包--开启子进程
  // -c 表示执行rollup配置(自定义的)，
  // w表示自动检测
  // 环境变量
  await execa('rollup',
    ['-cw', '--environment', `TARGET:${target}`],
    {stdio:'inherit'} // 子进程的输出到父包输出
   )
}

build('reactivity')