export const isObject = (val : unknown) => val !== null && typeof val === 'object'

export const extend = Object.assign

export const isArray = Array.isArray

export const isFunction = (val : unknown) => typeof val === 'function'

export const isString = (val : unknown) => typeof val === 'string'

// 判断对象中是否有这个属性
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (val: object, key: string) => hasOwnProperty.call(val, key)

// 判断key是不是整数
export const isIntegerKey = (key: unknown) => 
  isString(key) && key !== 'NaN' && key[0] !== '-' && '' + parseInt(key, 10) === key


