type DefaultObject = object | (() => object)
type ComputeFn = (source: { [key: string]: any }) => any

class Builder {
  private targetObj: {
    [key: string]: any
  }
  private source: {
    [key: string]: any
  }
  public constructor (defaultObject?: DefaultObject) {
    if (typeof defaultObject === 'function') {
      defaultObject = defaultObject()
    }
    this.targetObj = defaultObject || {}
  }
  public from (source: object) {
    this.source = source
    return this
  }
  public pick (fieldList: any[]) {
    const isArray = this.isArray
    if (!isArray(fieldList)) {
      throw new Error(fieldList + ' is not an array')
    }
    const { targetObj, source } = this
    fieldList.forEach(field => {
      let key: string
      let defaultValue: any
      if (isArray(field)) {
        key = field[0]
        defaultValue = field[1]
      } else {
        key = field
      }
      const val = source[key]
      targetObj[key] = val === undefined ? defaultValue : val
    })
    return this
  }
  public map (fieldObject: {[key: string]: string}) {
    const isArray = this.isArray
    if (typeof fieldObject !== 'object') {
      throw new Error(fieldObject + ' is not an object')
    }
    const { targetObj, source } = this
    Object.keys(fieldObject).forEach(field => {
      let key: string
      let defaultValue: any
      const originField = fieldObject[field]
      if (isArray(originField)) {
        key = originField[0]
        defaultValue = originField[1]
      } else {
        key = originField
      }
      const val = source[key]
      targetObj[field] = val === undefined ? defaultValue : val
    })
    return this
  }
  public compute(field: string | {[key: string]: any}, fn?: ComputeFn) {
    if (typeof field === 'object') {
      Object.keys(field).forEach(key => {
        this.compute(key, field[key])
      })
    } else {
      if (typeof fn === 'function') {
        this.computeOne(field, fn)
      } 
    }
    return this
  }
  public computeOne(field: string, fn: ComputeFn) {
    const { targetObj, source } = this
    targetObj[field] = fn(source)
    return this
  }
  public assign (obj: {[key: string]: any}) {
    Object.assign(this.targetObj, obj)
    return this
  }
  public custom (fn: (targetObj: object, source: object) => void) {
    fn(this.targetObj, this.source)
    return this
  }
  public pickIf () {
    return this.callIf('pick', arguments)
  }
  public mapIf () {
    return this.callIf('map', arguments)
  }
  public computeIf () {
    return this.callIf('compute', arguments)
  }
  public assignIf () {
    return this.callIf('assign', arguments)
  }
  public customIf () {
    return this.callIf('custom', arguments)
  }
  public val() {
    return this.targetObj
  }
  private isTrueVal (val: any): boolean {
    if (typeof val === 'function') {
      return val(this.source)
    }
    return val
  }
  private isArray (val: any): val is any[] {
    return Array.isArray(val)
  }
  private callIf (method: keyof Builder, args: ArrayLike<any>): Builder {
    if (this.isTrueVal(args[0])) {
      args = [].slice.call(args, 1)
      return this[method].apply(this, args)
    }
    return this
  }
}

export default function build(defaultObject?: DefaultObject) {
  return new Builder(defaultObject)
}