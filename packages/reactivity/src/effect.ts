import { TrackOpTypes, TriggerOpTypes } from "./operations"

// 定义effect 收集依赖
export function effect<T = any>(fn: () => T, options: any = {}) {
    // 创建effect
    const effect = createReactEffect(fn, options)
    if (!options.lazy) {
        // 开始收集
        effect()
    }
    return effect
}

let uid = 0
let activeEffect : Function | undefined //当前的effect
const effectStack: any = []  // 创建栈结构

function createReactEffect(fn: Function, options: any = {}) {
    const effect = function reactiveEffect() {
        // 多次调用统一属性时，只需加一次，保持唯一性
        if (!effectStack.includes(effect)) {
            // 解决嵌套调用，确保收集到正确的effect
            try {
                effectStack.push(effect)
                activeEffect = effect
                fn() // 执行用户的方法
            } finally {
                effectStack.pop()
                const n = effectStack.length
                activeEffect = n > 0 ? effectStack[n - 1] : undefined
            }
        }
    }
    effect.id = uid++ // 区分effect
    effect._isEffect = true // 区分effect 是不是响应式
    effect.raw = fn  // 保存用户的方法
    effect.options = options // 保存用户的属性

    return effect
}

// 收集effect
const targetMap = new WeakMap()
export function track(target: object, type: TrackOpTypes, key: unknown) {
    if (activeEffect === undefined) {
        return 
    }

    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }

    let dep = depsMap.get(key)

    if (!dep) {
        depsMap.set(key, (dep = new Set()))
    }

    if (!dep.has(activeEffect)) {
        dep.add(activeEffect)
    }
}

export function trigger(target: object, type: TriggerOpTypes, key?:unknown, newValue?: unknown, oldValue?: unknown) {
    const depsMap = targetMap.get(target)
    if (!depsMap) {
        return
    }
    let deps = []

}