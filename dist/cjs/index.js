"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Builder = (function () {
    function Builder(defaultObject) {
        if (typeof defaultObject === 'function') {
            defaultObject = defaultObject();
        }
        this.targetObj = defaultObject || {};
    }
    Builder.prototype.from = function (source) {
        this.source = source;
        return this;
    };
    Builder.prototype.pick = function (fieldList) {
        var isArray = this.isArray;
        if (!isArray(fieldList)) {
            throw new Error(fieldList + ' is not an array');
        }
        var _a = this, targetObj = _a.targetObj, source = _a.source;
        fieldList.forEach(function (field) {
            var key;
            var defaultValue;
            if (isArray(field)) {
                key = field[0];
                defaultValue = field[1];
            }
            else {
                key = field;
            }
            var val = source[key];
            targetObj[key] = val === undefined ? defaultValue : val;
        });
        return this;
    };
    Builder.prototype.map = function (fieldObject) {
        var isArray = this.isArray;
        if (typeof fieldObject !== 'object') {
            throw new Error(fieldObject + ' is not an object');
        }
        var _a = this, targetObj = _a.targetObj, source = _a.source;
        Object.keys(fieldObject).forEach(function (field) {
            var key;
            var defaultValue;
            var originField = fieldObject[field];
            if (isArray(originField)) {
                key = originField[0];
                defaultValue = originField[1];
            }
            else {
                key = originField;
            }
            var val = source[key];
            targetObj[field] = val === undefined ? defaultValue : val;
        });
        return this;
    };
    Builder.prototype.compute = function (field, fn) {
        var _this = this;
        if (typeof field === 'object') {
            Object.keys(field).forEach(function (key) {
                _this.compute(key, field[key]);
            });
        }
        else {
            if (typeof fn === 'function') {
                this.computeOne(field, fn);
            }
        }
        return this;
    };
    Builder.prototype.computeOne = function (field, fn) {
        var _a = this, targetObj = _a.targetObj, source = _a.source;
        targetObj[field] = fn(source);
        return this;
    };
    Builder.prototype.assign = function (obj) {
        Object.assign(this.targetObj, obj);
        return this;
    };
    Builder.prototype.custom = function (fn) {
        fn(this.targetObj, this.source);
        return this;
    };
    Builder.prototype.pickIf = function () {
        return this.callIf('pick', arguments);
    };
    Builder.prototype.mapIf = function () {
        return this.callIf('map', arguments);
    };
    Builder.prototype.computeIf = function () {
        return this.callIf('compute', arguments);
    };
    Builder.prototype.assignIf = function () {
        return this.callIf('assign', arguments);
    };
    Builder.prototype.customIf = function () {
        return this.callIf('custom', arguments);
    };
    Builder.prototype.val = function () {
        return this.targetObj;
    };
    Builder.prototype.isTrueVal = function (val) {
        if (typeof val === 'function') {
            return val(this.source);
        }
        return val;
    };
    Builder.prototype.isArray = function (val) {
        return Array.isArray(val);
    };
    Builder.prototype.callIf = function (method, args) {
        if (this.isTrueVal(args[0])) {
            args = [].slice.call(args, 1);
            return this[method].apply(this, args);
        }
        return this;
    };
    return Builder;
}());
function build(defaultObject) {
    return new Builder(defaultObject);
}
exports.default = build;
//# sourceMappingURL=index.js.map