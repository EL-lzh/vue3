export const isObject = (val : unknown) => val !== null && typeof val === 'object'

export const extend = Object.assign

export const isArray = Array.isArray

export const isFunction = (val : unknown) => typeof val === 'function'

export const isString = (val: unknown): val is string => typeof val === 'string'
// 判断对象中是否有这个属性
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (val: object, key: string | symbol) => hasOwnProperty.call(val, key)

// 判断是不是数字型的字符串key值
export const isIntegerKey = (key: unknown) => 
  isString(key) && 
  key !== 'NaN' && 
  key[0] !== '-' && 
  '' + parseInt(key, 10) === key

export const hasChanged = (value: any, oldValue: any): boolean => !Object.is(value, oldValue)
