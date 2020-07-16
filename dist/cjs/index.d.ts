declare type DefaultObject = object | (() => object);
declare type ComputeFn = (source: {
    [key: string]: any;
}) => any;
declare class Builder {
    private targetObj;
    private source;
    constructor(defaultObject?: DefaultObject);
    from(source: object): this;
    pick(fieldList: any[]): this;
    map(fieldObject: {
        [key: string]: string;
    }): this;
    compute(field: string | {
        [key: string]: any;
    }, fn?: ComputeFn): this;
    computeOne(field: string, fn: ComputeFn): this;
    assign(obj: {
        [key: string]: any;
    }): this;
    custom(fn: (targetObj: object, source: object) => void): this;
    pickIf(): Builder;
    mapIf(): Builder;
    computeIf(): Builder;
    assignIf(): Builder;
    customIf(): Builder;
    val(): {
        [key: string]: any;
    };
    private isTrueVal;
    private isArray;
    private callIf;
}
export default function build(defaultObject?: DefaultObject): Builder;
export {};
