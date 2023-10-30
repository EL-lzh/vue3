import { isObject, isArray, isIntegerKey, hasOwn, hasChanged } from "@vue/shared"
import { track, trigger } from "./effect"
import { TrackOpTypes, TriggerOpTypes } from "./operations"
import { reactive, readonly } from "./reactive"

const get = createGetter() // 不是只读，深层遍历
const shallowGet =  createGetter(false, true) // 不是只读，浅层
const readonlyGet = createGetter(true) //只读，深层遍历
const shallowReadonlyGet =  createGetter(true, true) //只读，浅层

const set = createSetter()
const shallowSet = createSetter(true)

export const reactiveHandlers = {
  get,
  set
}
export const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet
}
export const readonlyHandlers = {
  get: readonlyGet,
  set(target: object, key: any) {
    console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`,
    target)
  }
}
export const shallowReadonlyHandlers = {
  get: shallowReadonlyGet,
  set(target: object, key: any) {
    console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`,
    target)
  }
}

function createGetter(isReadonly = false, shallow = false) {
  return function get(target: object, key: string, receiver: object) {
    // 返回的是key对应的属性值
    const res = Reflect.get(target, key, receiver)

    if (!isReadonly) {
      // 收集依赖
      track(target, TrackOpTypes.GET, key)
    }

    // 浅层的情况直接返回第一层代理后的结果
    if (shallow) {
      return res
    }
    // 如果是对象，继续递归
    // 相比于vue2优化： vue2是直接对一个对象跑递归
    // vue3 懒代理 只有使用到了对象中的对象，才会开始代理
    // 例子： {name: '张三', sex: '男', address: { country: '中国', province: '河南'}}
    // 只有读address时才会递归代理address属性
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    return res
  }
}

function createSetter(shallow = false) {
    return function set(
        target: object, 
        key: string | symbol, 
        value: unknown, 
        receiver: object) {

            // 获取老值
            const oldValue = (target as any)[key]

            const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key)

            const result = Reflect.set(target, key, value, receiver)
            if (!hadKey) {
              //新增
              trigger(target, TriggerOpTypes.ADD, key, value)
            } else if (hasChanged(value, oldValue)) {
              // 修改，且值有变动
              trigger(target, TriggerOpTypes.SET, key, value, oldValue)
            }
            
            return result
    }
}