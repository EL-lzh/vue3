import { isObject } from '@vue/shared'
import {
    reactiveHandlers,
    shallowReactiveHandlers,
    readonlyHandlers,
    shallowReadonlyHandlers
} from './baseHandlers'


// WeakMap 
const reactiveMap = new WeakMap<object, any>()
const shallowReactiveMap = new WeakMap<object, any>()
const readonlyMap = new WeakMap<object, any>()
const shallowReadonlyMap = new WeakMap<object, any>()

export function reactive(target: object) {
    return createReactiveObject(target, false, reactiveHandlers, reactiveMap)

}
// 柯里化： 是把接受多个参数的函数变换成接受一个单一参数
export function shallowReactive(target: object) {
    return createReactiveObject(target, false, shallowReactiveHandlers, shallowReactiveMap)
}

export function readonly(target: object) {
    return createReactiveObject(target, true, readonlyHandlers, readonlyMap)
    
}

export function shallowReadonly(target: object) {
    return createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyMap)
}

function createReactiveObject(target: Object, isReadonly: boolean, baseHandlers: any, proxyMap: WeakMap<object, any>) {

    if (!isObject(target)) {
        return target
    }

    // 用map缓存proxy，优化
    const existingProxy = proxyMap.get(target)
    if (existingProxy) {
        return existingProxy
    }

    const proxy = new Proxy(target, baseHandlers)
    proxyMap.set(target, proxy)
    return proxy
}