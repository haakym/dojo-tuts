/*!
 * 
 * [Dojo](https://dojo.io/)
 * Copyright [JS Foundation](https://js.foundation/) & contributors
 * [New BSD license](https://github.com/dojo/meta/blob/master/LICENSE)
 * All rights reserved
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("main", [], factory);
	else if(typeof exports === 'object')
		exports["main"] = factory();
	else
		root["main"] = factory();
})(this, function() {
return dojoWebpackJsonpbiz_e_corp(["main"],{

/***/ "./node_modules/@dojo/core/Destroyable.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var lang_1 = __webpack_require__("./node_modules/@dojo/core/lang.js");
var Promise_1 = __webpack_require__("./node_modules/@dojo/shim/Promise.js");
/**
 * No operation function to replace own once instance is destoryed
 */
function noop() {
    return Promise_1.default.resolve(false);
}
/**
 * No op function used to replace own, once instance has been destoryed
 */
function destroyed() {
    throw new Error('Call made to destroyed method');
}
var Destroyable = /** @class */ (function () {
    /**
     * @constructor
     */
    function Destroyable() {
        this.handles = [];
    }
    /**
     * Register handles for the instance that will be destroyed when `this.destroy` is called
     *
     * @param {Handle} handle The handle to add for the instance
     * @returns {Handle} a handle for the handle, removes the handle for the instance and calls destroy
     */
    Destroyable.prototype.own = function (handles) {
        var handle = Array.isArray(handles) ? lang_1.createCompositeHandle.apply(void 0, tslib_1.__spread(handles)) : handles;
        var _handles = this.handles;
        _handles.push(handle);
        return {
            destroy: function () {
                _handles.splice(_handles.indexOf(handle));
                handle.destroy();
            }
        };
    };
    /**
     * Destrpys all handers registered for the instance
     *
     * @returns {Promise<any} a promise that resolves once all handles have been destroyed
     */
    Destroyable.prototype.destroy = function () {
        var _this = this;
        return new Promise_1.default(function (resolve) {
            _this.handles.forEach(function (handle) {
                handle && handle.destroy && handle.destroy();
            });
            _this.destroy = noop;
            _this.own = destroyed;
            resolve(true);
        });
    };
    return Destroyable;
}());
exports.Destroyable = Destroyable;
exports.default = Destroyable;

/***/ }),

/***/ "./node_modules/@dojo/core/Evented.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var Map_1 = __webpack_require__("./node_modules/@dojo/shim/Map.js");
var Destroyable_1 = __webpack_require__("./node_modules/@dojo/core/Destroyable.js");
/**
 * Map of computed regular expressions, keyed by string
 */
var regexMap = new Map_1.default();
/**
 * Determines is the event type glob has been matched
 *
 * @returns boolean that indicates if the glob is matched
 */
function isGlobMatch(globString, targetString) {
    if (typeof targetString === 'string' && typeof globString === 'string' && globString.indexOf('*') !== -1) {
        var regex = void 0;
        if (regexMap.has(globString)) {
            regex = regexMap.get(globString);
        }
        else {
            regex = new RegExp("^" + globString.replace(/\*/g, '.*') + "$");
            regexMap.set(globString, regex);
        }
        return regex.test(targetString);
    }
    else {
        return globString === targetString;
    }
}
exports.isGlobMatch = isGlobMatch;
/**
 * Event Class
 */
var Evented = /** @class */ (function (_super) {
    tslib_1.__extends(Evented, _super);
    function Evented() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * map of listeners keyed by event type
         */
        _this.listenersMap = new Map_1.default();
        return _this;
    }
    Evented.prototype.emit = function (event) {
        var _this = this;
        this.listenersMap.forEach(function (methods, type) {
            if (isGlobMatch(type, event.type)) {
                methods.forEach(function (method) {
                    method.call(_this, event);
                });
            }
        });
    };
    Evented.prototype.on = function (type, listener) {
        var _this = this;
        if (Array.isArray(listener)) {
            var handles_1 = listener.map(function (listener) { return _this._addListener(type, listener); });
            return {
                destroy: function () {
                    handles_1.forEach(function (handle) { return handle.destroy(); });
                }
            };
        }
        return this._addListener(type, listener);
    };
    Evented.prototype._addListener = function (type, listener) {
        var _this = this;
        var listeners = this.listenersMap.get(type) || [];
        listeners.push(listener);
        this.listenersMap.set(type, listeners);
        return {
            destroy: function () {
                var listeners = _this.listenersMap.get(type) || [];
                listeners.splice(listeners.indexOf(listener), 1);
            }
        };
    };
    return Evented;
}(Destroyable_1.Destroyable));
exports.Evented = Evented;
exports.default = Evented;

/***/ }),

/***/ "./node_modules/@dojo/core/lang.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var object_1 = __webpack_require__("./node_modules/@dojo/shim/object.js");
var object_2 = __webpack_require__("./node_modules/@dojo/shim/object.js");
exports.assign = object_2.assign;
var slice = Array.prototype.slice;
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Type guard that ensures that the value can be coerced to Object
 * to weed out host objects that do not derive from Object.
 * This function is used to check if we want to deep copy an object or not.
 * Note: In ES6 it is possible to modify an object's Symbol.toStringTag property, which will
 * change the value returned by `toString`. This is a rare edge case that is difficult to handle,
 * so it is not handled here.
 * @param  value The value to check
 * @return       If the value is coercible into an Object
 */
function shouldDeepCopyObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}
function copyArray(array, inherited) {
    return array.map(function (item) {
        if (Array.isArray(item)) {
            return copyArray(item, inherited);
        }
        return !shouldDeepCopyObject(item)
            ? item
            : _mixin({
                deep: true,
                inherited: inherited,
                sources: [item],
                target: {}
            });
    });
}
function _mixin(kwArgs) {
    var deep = kwArgs.deep;
    var inherited = kwArgs.inherited;
    var target = kwArgs.target;
    var copied = kwArgs.copied || [];
    var copiedClone = tslib_1.__spread(copied);
    for (var i = 0; i < kwArgs.sources.length; i++) {
        var source = kwArgs.sources[i];
        if (source === null || source === undefined) {
            continue;
        }
        for (var key in source) {
            if (inherited || hasOwnProperty.call(source, key)) {
                var value = source[key];
                if (copiedClone.indexOf(value) !== -1) {
                    continue;
                }
                if (deep) {
                    if (Array.isArray(value)) {
                        value = copyArray(value, inherited);
                    }
                    else if (shouldDeepCopyObject(value)) {
                        var targetValue = target[key] || {};
                        copied.push(source);
                        value = _mixin({
                            deep: true,
                            inherited: inherited,
                            sources: [value],
                            target: targetValue,
                            copied: copied
                        });
                    }
                }
                target[key] = value;
            }
        }
    }
    return target;
}
function create(prototype) {
    var mixins = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        mixins[_i - 1] = arguments[_i];
    }
    if (!mixins.length) {
        throw new RangeError('lang.create requires at least one mixin object.');
    }
    var args = mixins.slice();
    args.unshift(Object.create(prototype));
    return object_1.assign.apply(null, args);
}
exports.create = create;
function deepAssign(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    return _mixin({
        deep: true,
        inherited: false,
        sources: sources,
        target: target
    });
}
exports.deepAssign = deepAssign;
function deepMixin(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    return _mixin({
        deep: true,
        inherited: true,
        sources: sources,
        target: target
    });
}
exports.deepMixin = deepMixin;
/**
 * Creates a new object using the provided source's prototype as the prototype for the new object, and then
 * deep copies the provided source's values into the new target.
 *
 * @param source The object to duplicate
 * @return The new object
 */
function duplicate(source) {
    var target = Object.create(Object.getPrototypeOf(source));
    return deepMixin(target, source);
}
exports.duplicate = duplicate;
/**
 * Determines whether two values are the same value.
 *
 * @param a First value to compare
 * @param b Second value to compare
 * @return true if the values are the same; false otherwise
 */
function isIdentical(a, b) {
    return (a === b ||
        /* both values are NaN */
        (a !== a && b !== b));
}
exports.isIdentical = isIdentical;
/**
 * Returns a function that binds a method to the specified object at runtime. This is similar to
 * `Function.prototype.bind`, but instead of a function it takes the name of a method on an object.
 * As a result, the function returned by `lateBind` will always call the function currently assigned to
 * the specified property on the object as of the moment the function it returns is called.
 *
 * @param instance The context object
 * @param method The name of the method on the context object to bind to itself
 * @param suppliedArgs An optional array of values to prepend to the `instance[method]` arguments list
 * @return The bound function
 */
function lateBind(instance, method) {
    var suppliedArgs = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        suppliedArgs[_i - 2] = arguments[_i];
    }
    return suppliedArgs.length
        ? function () {
            var args = arguments.length ? suppliedArgs.concat(slice.call(arguments)) : suppliedArgs;
            // TS7017
            return instance[method].apply(instance, args);
        }
        : function () {
            // TS7017
            return instance[method].apply(instance, arguments);
        };
}
exports.lateBind = lateBind;
function mixin(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    return _mixin({
        deep: false,
        inherited: true,
        sources: sources,
        target: target
    });
}
exports.mixin = mixin;
/**
 * Returns a function which invokes the given function with the given arguments prepended to its argument list.
 * Like `Function.prototype.bind`, but does not alter execution context.
 *
 * @param targetFunction The function that needs to be bound
 * @param suppliedArgs An optional array of arguments to prepend to the `targetFunction` arguments list
 * @return The bound function
 */
function partial(targetFunction) {
    var suppliedArgs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        suppliedArgs[_i - 1] = arguments[_i];
    }
    return function () {
        var args = arguments.length ? suppliedArgs.concat(slice.call(arguments)) : suppliedArgs;
        return targetFunction.apply(this, args);
    };
}
exports.partial = partial;
/**
 * Returns an object with a destroy method that, when called, calls the passed-in destructor.
 * This is intended to provide a unified interface for creating "remove" / "destroy" handlers for
 * event listeners, timers, etc.
 *
 * @param destructor A function that will be called when the handle's `destroy` method is invoked
 * @return The handle object
 */
function createHandle(destructor) {
    return {
        destroy: function () {
            this.destroy = function () { };
            destructor.call(this);
        }
    };
}
exports.createHandle = createHandle;
/**
 * Returns a single handle that can be used to destroy multiple handles simultaneously.
 *
 * @param handles An array of handles with `destroy` methods
 * @return The handle object
 */
function createCompositeHandle() {
    var handles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        handles[_i] = arguments[_i];
    }
    return createHandle(function () {
        for (var i = 0; i < handles.length; i++) {
            handles[i].destroy();
        }
    });
}
exports.createCompositeHandle = createCompositeHandle;

/***/ }),

/***/ "./node_modules/@dojo/core/uuid.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns a v4 compliant UUID.
 *
 * @returns {string}
 */
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
exports.default = uuid;

/***/ }),

/***/ "./node_modules/@dojo/has/has.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {
Object.defineProperty(exports, "__esModule", { value: true });
function isFeatureTestThenable(value) {
    return value && value.then;
}
/**
 * A cache of results of feature tests
 */
exports.testCache = {};
/**
 * A cache of the un-resolved feature tests
 */
exports.testFunctions = {};
/**
 * A cache of unresolved thenables (probably promises)
 * @type {{}}
 */
var testThenables = {};
/**
 * A reference to the global scope (`window` in a browser, `global` in NodeJS)
 */
var globalScope = (function () {
    /* istanbul ignore else */
    if (typeof window !== 'undefined') {
        // Browsers
        return window;
    }
    else if (typeof global !== 'undefined') {
        // Node
        return global;
    }
    else if (typeof self !== 'undefined') {
        // Web workers
        return self;
    }
    /* istanbul ignore next */
    return {};
})();
/* Grab the staticFeatures if there are available */
var staticFeatures = (globalScope.DojoHasEnvironment || {}).staticFeatures;
/* Cleaning up the DojoHasEnviornment */
if ('DojoHasEnvironment' in globalScope) {
    delete globalScope.DojoHasEnvironment;
}
/**
 * Custom type guard to narrow the `staticFeatures` to either a map or a function that
 * returns a map.
 *
 * @param value The value to guard for
 */
function isStaticFeatureFunction(value) {
    return typeof value === 'function';
}
/**
 * The cache of asserted features that were available in the global scope when the
 * module loaded
 */
var staticCache = staticFeatures
    ? isStaticFeatureFunction(staticFeatures) ? staticFeatures.apply(globalScope) : staticFeatures
    : {};/* Providing an empty cache, if none was in the environment

/**
* AMD plugin function.
*
* Conditional loads modules based on a has feature test value.
*
* @param resourceId Gives the resolved module id to load.
* @param require The loader require function with respect to the module that contained the plugin resource in its
*                dependency list.
* @param load Callback to loader that consumes result of plugin demand.
*/
function load(resourceId, require, load, config) {
    resourceId ? require([resourceId], load) : load();
}
exports.load = load;
/**
 * AMD plugin function.
 *
 * Resolves resourceId into a module id based on possibly-nested tenary expression that branches on has feature test
 * value(s).
 *
 * @param resourceId The id of the module
 * @param normalize Resolves a relative module id into an absolute module id
 */
function normalize(resourceId, normalize) {
    var tokens = resourceId.match(/[\?:]|[^:\?]*/g) || [];
    var i = 0;
    function get(skip) {
        var term = tokens[i++];
        if (term === ':') {
            // empty string module name, resolves to null
            return null;
        }
        else {
            // postfixed with a ? means it is a feature to branch on, the term is the name of the feature
            if (tokens[i++] === '?') {
                if (!skip && has(term)) {
                    // matched the feature, get the first value from the options
                    return get();
                }
                else {
                    // did not match, get the second value, passing over the first
                    get(true);
                    return get(skip);
                }
            }
            // a module
            return term;
        }
    }
    var id = get();
    return id && normalize(id);
}
exports.normalize = normalize;
/**
 * Check if a feature has already been registered
 *
 * @param feature the name of the feature
 */
function exists(feature) {
    var normalizedFeature = feature.toLowerCase();
    return Boolean(normalizedFeature in staticCache || normalizedFeature in exports.testCache || exports.testFunctions[normalizedFeature]);
}
exports.exists = exists;
/**
 * Register a new test for a named feature.
 *
 * @example
 * has.add('dom-addeventlistener', !!document.addEventListener);
 *
 * @example
 * has.add('touch-events', function () {
 *    return 'ontouchstart' in document
 * });
 *
 * @param feature the name of the feature
 * @param value the value reported of the feature, or a function that will be executed once on first test
 * @param overwrite if an existing value should be overwritten. Defaults to false.
 */
function add(feature, value, overwrite) {
    if (overwrite === void 0) { overwrite = false; }
    var normalizedFeature = feature.toLowerCase();
    if (exists(normalizedFeature) && !overwrite && !(normalizedFeature in staticCache)) {
        throw new TypeError("Feature \"" + feature + "\" exists and overwrite not true.");
    }
    if (typeof value === 'function') {
        exports.testFunctions[normalizedFeature] = value;
    }
    else if (isFeatureTestThenable(value)) {
        testThenables[feature] = value.then(function (resolvedValue) {
            exports.testCache[feature] = resolvedValue;
            delete testThenables[feature];
        }, function () {
            delete testThenables[feature];
        });
    }
    else {
        exports.testCache[normalizedFeature] = value;
        delete exports.testFunctions[normalizedFeature];
    }
}
exports.add = add;
/**
 * Return the current value of a named feature.
 *
 * @param feature The name (if a string) or identifier (if an integer) of the feature to test.
 */
function has(feature) {
    var result;
    var normalizedFeature = feature.toLowerCase();
    if (normalizedFeature in staticCache) {
        result = staticCache[normalizedFeature];
    }
    else if (exports.testFunctions[normalizedFeature]) {
        result = exports.testCache[normalizedFeature] = exports.testFunctions[normalizedFeature].call(null);
        delete exports.testFunctions[normalizedFeature];
    }
    else if (normalizedFeature in exports.testCache) {
        result = exports.testCache[normalizedFeature];
    }
    else if (feature in testThenables) {
        return false;
    }
    else {
        throw new TypeError("Attempt to detect unregistered has feature \"" + feature + "\"");
    }
    return result;
}
exports.default = has;
/*
 * Out of the box feature tests
 */
/* Environments */
/* Used as a value to provide a debug only code path */
add('debug', true);
/* Detects if the environment is "browser like" */
add('host-browser', typeof document !== 'undefined' && typeof location !== 'undefined');
/* Detects if the environment appears to be NodeJS */
add('host-node', function () {
    if (typeof process === 'object' && process.versions && process.versions.node) {
        return process.versions.node;
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js"), __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/@dojo/shim/Map.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var iterator_1 = __webpack_require__("./node_modules/@dojo/shim/iterator.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var object_1 = __webpack_require__("./node_modules/@dojo/shim/object.js");
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
__webpack_require__("./node_modules/@dojo/shim/Symbol.js");
exports.Map = global_1.default.Map;
if (!has_1.default('es6-map')) {
    exports.Map = (_a = /** @class */ (function () {
            function Map(iterable) {
                this._keys = [];
                this._values = [];
                this[Symbol.toStringTag] = 'Map';
                if (iterable) {
                    if (iterator_1.isArrayLike(iterable)) {
                        for (var i = 0; i < iterable.length; i++) {
                            var value = iterable[i];
                            this.set(value[0], value[1]);
                        }
                    }
                    else {
                        try {
                            for (var iterable_1 = tslib_1.__values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                                var value = iterable_1_1.value;
                                this.set(value[0], value[1]);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                }
                var e_1, _a;
            }
            /**
             * An alternative to Array.prototype.indexOf using Object.is
             * to check for equality. See http://mzl.la/1zuKO2V
             */
            Map.prototype._indexOfKey = function (keys, key) {
                for (var i = 0, length_1 = keys.length; i < length_1; i++) {
                    if (object_1.is(keys[i], key)) {
                        return i;
                    }
                }
                return -1;
            };
            Object.defineProperty(Map.prototype, "size", {
                get: function () {
                    return this._keys.length;
                },
                enumerable: true,
                configurable: true
            });
            Map.prototype.clear = function () {
                this._keys.length = this._values.length = 0;
            };
            Map.prototype.delete = function (key) {
                var index = this._indexOfKey(this._keys, key);
                if (index < 0) {
                    return false;
                }
                this._keys.splice(index, 1);
                this._values.splice(index, 1);
                return true;
            };
            Map.prototype.entries = function () {
                var _this = this;
                var values = this._keys.map(function (key, i) {
                    return [key, _this._values[i]];
                });
                return new iterator_1.ShimIterator(values);
            };
            Map.prototype.forEach = function (callback, context) {
                var keys = this._keys;
                var values = this._values;
                for (var i = 0, length_2 = keys.length; i < length_2; i++) {
                    callback.call(context, values[i], keys[i], this);
                }
            };
            Map.prototype.get = function (key) {
                var index = this._indexOfKey(this._keys, key);
                return index < 0 ? undefined : this._values[index];
            };
            Map.prototype.has = function (key) {
                return this._indexOfKey(this._keys, key) > -1;
            };
            Map.prototype.keys = function () {
                return new iterator_1.ShimIterator(this._keys);
            };
            Map.prototype.set = function (key, value) {
                var index = this._indexOfKey(this._keys, key);
                index = index < 0 ? this._keys.length : index;
                this._keys[index] = key;
                this._values[index] = value;
                return this;
            };
            Map.prototype.values = function () {
                return new iterator_1.ShimIterator(this._values);
            };
            Map.prototype[Symbol.iterator] = function () {
                return this.entries();
            };
            return Map;
        }()),
        _a[Symbol.species] = _a,
        _a);
}
exports.default = exports.Map;
var _a;

/***/ }),

/***/ "./node_modules/@dojo/shim/Promise.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var queue_1 = __webpack_require__("./node_modules/@dojo/shim/support/queue.js");
__webpack_require__("./node_modules/@dojo/shim/Symbol.js");
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
exports.ShimPromise = global_1.default.Promise;
exports.isThenable = function isThenable(value) {
    return value && typeof value.then === 'function';
};
if (!has_1.default('es6-promise')) {
    global_1.default.Promise = exports.ShimPromise = (_a = /** @class */ (function () {
            /**
             * Creates a new Promise.
             *
             * @constructor
             *
             * @param executor
             * The executor function is called immediately when the Promise is instantiated. It is responsible for
             * starting the asynchronous operation when it is invoked.
             *
             * The executor must call either the passed `resolve` function when the asynchronous operation has completed
             * successfully, or the `reject` function when the operation fails.
             */
            function Promise(executor) {
                var _this = this;
                /**
                 * The current state of this promise.
                 */
                this.state = 1 /* Pending */;
                this[Symbol.toStringTag] = 'Promise';
                /**
                 * If true, the resolution of this promise is chained ("locked in") to another promise.
                 */
                var isChained = false;
                /**
                 * Whether or not this promise is in a resolved state.
                 */
                var isResolved = function () {
                    return _this.state !== 1 /* Pending */ || isChained;
                };
                /**
                 * Callbacks that should be invoked once the asynchronous operation has completed.
                 */
                var callbacks = [];
                /**
                 * Initially pushes callbacks onto a queue for execution once this promise settles. After the promise settles,
                 * enqueues callbacks for execution on the next event loop turn.
                 */
                var whenFinished = function (callback) {
                    if (callbacks) {
                        callbacks.push(callback);
                    }
                };
                /**
                 * Settles this promise.
                 *
                 * @param newState The resolved state for this promise.
                 * @param {T|any} value The resolved value for this promise.
                 */
                var settle = function (newState, value) {
                    // A promise can only be settled once.
                    if (_this.state !== 1 /* Pending */) {
                        return;
                    }
                    _this.state = newState;
                    _this.resolvedValue = value;
                    whenFinished = queue_1.queueMicroTask;
                    // Only enqueue a callback runner if there are callbacks so that initially fulfilled Promises don't have to
                    // wait an extra turn.
                    if (callbacks && callbacks.length > 0) {
                        queue_1.queueMicroTask(function () {
                            if (callbacks) {
                                var count = callbacks.length;
                                for (var i = 0; i < count; ++i) {
                                    callbacks[i].call(null);
                                }
                                callbacks = null;
                            }
                        });
                    }
                };
                /**
                 * Resolves this promise.
                 *
                 * @param newState The resolved state for this promise.
                 * @param {T|any} value The resolved value for this promise.
                 */
                var resolve = function (newState, value) {
                    if (isResolved()) {
                        return;
                    }
                    if (exports.isThenable(value)) {
                        value.then(settle.bind(null, 0 /* Fulfilled */), settle.bind(null, 2 /* Rejected */));
                        isChained = true;
                    }
                    else {
                        settle(newState, value);
                    }
                };
                this.then = function (onFulfilled, onRejected) {
                    return new Promise(function (resolve, reject) {
                        // whenFinished initially queues up callbacks for execution after the promise has settled. Once the
                        // promise has settled, whenFinished will schedule callbacks for execution on the next turn through the
                        // event loop.
                        whenFinished(function () {
                            var callback = _this.state === 2 /* Rejected */ ? onRejected : onFulfilled;
                            if (typeof callback === 'function') {
                                try {
                                    resolve(callback(_this.resolvedValue));
                                }
                                catch (error) {
                                    reject(error);
                                }
                            }
                            else if (_this.state === 2 /* Rejected */) {
                                reject(_this.resolvedValue);
                            }
                            else {
                                resolve(_this.resolvedValue);
                            }
                        });
                    });
                };
                try {
                    executor(resolve.bind(null, 0 /* Fulfilled */), resolve.bind(null, 2 /* Rejected */));
                }
                catch (error) {
                    settle(2 /* Rejected */, error);
                }
            }
            Promise.all = function (iterable) {
                return new this(function (resolve, reject) {
                    var values = [];
                    var complete = 0;
                    var total = 0;
                    var populating = true;
                    function fulfill(index, value) {
                        values[index] = value;
                        ++complete;
                        finish();
                    }
                    function finish() {
                        if (populating || complete < total) {
                            return;
                        }
                        resolve(values);
                    }
                    function processItem(index, item) {
                        ++total;
                        if (exports.isThenable(item)) {
                            // If an item Promise rejects, this Promise is immediately rejected with the item
                            // Promise's rejection error.
                            item.then(fulfill.bind(null, index), reject);
                        }
                        else {
                            Promise.resolve(item).then(fulfill.bind(null, index));
                        }
                    }
                    var i = 0;
                    try {
                        for (var iterable_1 = tslib_1.__values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                            var value = iterable_1_1.value;
                            processItem(i, value);
                            i++;
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    populating = false;
                    finish();
                    var e_1, _a;
                });
            };
            Promise.race = function (iterable) {
                return new this(function (resolve, reject) {
                    try {
                        for (var iterable_2 = tslib_1.__values(iterable), iterable_2_1 = iterable_2.next(); !iterable_2_1.done; iterable_2_1 = iterable_2.next()) {
                            var item = iterable_2_1.value;
                            if (item instanceof Promise) {
                                // If a Promise item rejects, this Promise is immediately rejected with the item
                                // Promise's rejection error.
                                item.then(resolve, reject);
                            }
                            else {
                                Promise.resolve(item).then(resolve);
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (iterable_2_1 && !iterable_2_1.done && (_a = iterable_2.return)) _a.call(iterable_2);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    var e_2, _a;
                });
            };
            Promise.reject = function (reason) {
                return new this(function (resolve, reject) {
                    reject(reason);
                });
            };
            Promise.resolve = function (value) {
                return new this(function (resolve) {
                    resolve(value);
                });
            };
            Promise.prototype.catch = function (onRejected) {
                return this.then(undefined, onRejected);
            };
            return Promise;
        }()),
        _a[Symbol.species] = exports.ShimPromise,
        _a);
}
exports.default = exports.ShimPromise;
var _a;

/***/ }),

/***/ "./node_modules/@dojo/shim/Set.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var iterator_1 = __webpack_require__("./node_modules/@dojo/shim/iterator.js");
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
__webpack_require__("./node_modules/@dojo/shim/Symbol.js");
exports.Set = global_1.default.Set;
if (!has_1.default('es6-set')) {
    exports.Set = (_a = /** @class */ (function () {
            function Set(iterable) {
                this._setData = [];
                this[Symbol.toStringTag] = 'Set';
                if (iterable) {
                    if (iterator_1.isArrayLike(iterable)) {
                        for (var i = 0; i < iterable.length; i++) {
                            this.add(iterable[i]);
                        }
                    }
                    else {
                        try {
                            for (var iterable_1 = tslib_1.__values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                                var value = iterable_1_1.value;
                                this.add(value);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                }
                var e_1, _a;
            }
            Set.prototype.add = function (value) {
                if (this.has(value)) {
                    return this;
                }
                this._setData.push(value);
                return this;
            };
            Set.prototype.clear = function () {
                this._setData.length = 0;
            };
            Set.prototype.delete = function (value) {
                var idx = this._setData.indexOf(value);
                if (idx === -1) {
                    return false;
                }
                this._setData.splice(idx, 1);
                return true;
            };
            Set.prototype.entries = function () {
                return new iterator_1.ShimIterator(this._setData.map(function (value) { return [value, value]; }));
            };
            Set.prototype.forEach = function (callbackfn, thisArg) {
                var iterator = this.values();
                var result = iterator.next();
                while (!result.done) {
                    callbackfn.call(thisArg, result.value, result.value, this);
                    result = iterator.next();
                }
            };
            Set.prototype.has = function (value) {
                return this._setData.indexOf(value) > -1;
            };
            Set.prototype.keys = function () {
                return new iterator_1.ShimIterator(this._setData);
            };
            Object.defineProperty(Set.prototype, "size", {
                get: function () {
                    return this._setData.length;
                },
                enumerable: true,
                configurable: true
            });
            Set.prototype.values = function () {
                return new iterator_1.ShimIterator(this._setData);
            };
            Set.prototype[Symbol.iterator] = function () {
                return new iterator_1.ShimIterator(this._setData);
            };
            return Set;
        }()),
        _a[Symbol.species] = _a,
        _a);
}
exports.default = exports.Set;
var _a;

/***/ }),

/***/ "./node_modules/@dojo/shim/Symbol.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var util_1 = __webpack_require__("./node_modules/@dojo/shim/support/util.js");
exports.Symbol = global_1.default.Symbol;
if (!has_1.default('es6-symbol')) {
    /**
     * Throws if the value is not a symbol, used internally within the Shim
     * @param  {any}    value The value to check
     * @return {symbol}       Returns the symbol or throws
     */
    var validateSymbol_1 = function validateSymbol(value) {
        if (!isSymbol(value)) {
            throw new TypeError(value + ' is not a symbol');
        }
        return value;
    };
    var defineProperties_1 = Object.defineProperties;
    var defineProperty_1 = Object.defineProperty;
    var create_1 = Object.create;
    var objPrototype_1 = Object.prototype;
    var globalSymbols_1 = {};
    var getSymbolName_1 = (function () {
        var created = create_1(null);
        return function (desc) {
            var postfix = 0;
            var name;
            while (created[String(desc) + (postfix || '')]) {
                ++postfix;
            }
            desc += String(postfix || '');
            created[desc] = true;
            name = '@@' + desc;
            // FIXME: Temporary guard until the duplicate execution when testing can be
            // pinned down.
            if (!Object.getOwnPropertyDescriptor(objPrototype_1, name)) {
                defineProperty_1(objPrototype_1, name, {
                    set: function (value) {
                        defineProperty_1(this, name, util_1.getValueDescriptor(value));
                    }
                });
            }
            return name;
        };
    })();
    var InternalSymbol_1 = function Symbol(description) {
        if (this instanceof InternalSymbol_1) {
            throw new TypeError('TypeError: Symbol is not a constructor');
        }
        return Symbol(description);
    };
    exports.Symbol = global_1.default.Symbol = function Symbol(description) {
        if (this instanceof Symbol) {
            throw new TypeError('TypeError: Symbol is not a constructor');
        }
        var sym = Object.create(InternalSymbol_1.prototype);
        description = description === undefined ? '' : String(description);
        return defineProperties_1(sym, {
            __description__: util_1.getValueDescriptor(description),
            __name__: util_1.getValueDescriptor(getSymbolName_1(description))
        });
    };
    /* Decorate the Symbol function with the appropriate properties */
    defineProperty_1(exports.Symbol, 'for', util_1.getValueDescriptor(function (key) {
        if (globalSymbols_1[key]) {
            return globalSymbols_1[key];
        }
        return (globalSymbols_1[key] = exports.Symbol(String(key)));
    }));
    defineProperties_1(exports.Symbol, {
        keyFor: util_1.getValueDescriptor(function (sym) {
            var key;
            validateSymbol_1(sym);
            for (key in globalSymbols_1) {
                if (globalSymbols_1[key] === sym) {
                    return key;
                }
            }
        }),
        hasInstance: util_1.getValueDescriptor(exports.Symbol.for('hasInstance'), false, false),
        isConcatSpreadable: util_1.getValueDescriptor(exports.Symbol.for('isConcatSpreadable'), false, false),
        iterator: util_1.getValueDescriptor(exports.Symbol.for('iterator'), false, false),
        match: util_1.getValueDescriptor(exports.Symbol.for('match'), false, false),
        observable: util_1.getValueDescriptor(exports.Symbol.for('observable'), false, false),
        replace: util_1.getValueDescriptor(exports.Symbol.for('replace'), false, false),
        search: util_1.getValueDescriptor(exports.Symbol.for('search'), false, false),
        species: util_1.getValueDescriptor(exports.Symbol.for('species'), false, false),
        split: util_1.getValueDescriptor(exports.Symbol.for('split'), false, false),
        toPrimitive: util_1.getValueDescriptor(exports.Symbol.for('toPrimitive'), false, false),
        toStringTag: util_1.getValueDescriptor(exports.Symbol.for('toStringTag'), false, false),
        unscopables: util_1.getValueDescriptor(exports.Symbol.for('unscopables'), false, false)
    });
    /* Decorate the InternalSymbol object */
    defineProperties_1(InternalSymbol_1.prototype, {
        constructor: util_1.getValueDescriptor(exports.Symbol),
        toString: util_1.getValueDescriptor(function () {
            return this.__name__;
        }, false, false)
    });
    /* Decorate the Symbol.prototype */
    defineProperties_1(exports.Symbol.prototype, {
        toString: util_1.getValueDescriptor(function () {
            return 'Symbol (' + validateSymbol_1(this).__description__ + ')';
        }),
        valueOf: util_1.getValueDescriptor(function () {
            return validateSymbol_1(this);
        })
    });
    defineProperty_1(exports.Symbol.prototype, exports.Symbol.toPrimitive, util_1.getValueDescriptor(function () {
        return validateSymbol_1(this);
    }));
    defineProperty_1(exports.Symbol.prototype, exports.Symbol.toStringTag, util_1.getValueDescriptor('Symbol', false, false, true));
    defineProperty_1(InternalSymbol_1.prototype, exports.Symbol.toPrimitive, util_1.getValueDescriptor(exports.Symbol.prototype[exports.Symbol.toPrimitive], false, false, true));
    defineProperty_1(InternalSymbol_1.prototype, exports.Symbol.toStringTag, util_1.getValueDescriptor(exports.Symbol.prototype[exports.Symbol.toStringTag], false, false, true));
}
/**
 * A custom guard function that determines if an object is a symbol or not
 * @param  {any}       value The value to check to see if it is a symbol or not
 * @return {is symbol}       Returns true if a symbol or not (and narrows the type guard)
 */
function isSymbol(value) {
    return (value && (typeof value === 'symbol' || value['@@toStringTag'] === 'Symbol')) || false;
}
exports.isSymbol = isSymbol;
/**
 * Fill any missing well known symbols if the native Symbol is missing them
 */
[
    'hasInstance',
    'isConcatSpreadable',
    'iterator',
    'species',
    'replace',
    'search',
    'split',
    'match',
    'toPrimitive',
    'toStringTag',
    'unscopables',
    'observable'
].forEach(function (wellKnown) {
    if (!exports.Symbol[wellKnown]) {
        Object.defineProperty(exports.Symbol, wellKnown, util_1.getValueDescriptor(exports.Symbol.for(wellKnown), false, false));
    }
});
exports.default = exports.Symbol;

/***/ }),

/***/ "./node_modules/@dojo/shim/WeakMap.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var iterator_1 = __webpack_require__("./node_modules/@dojo/shim/iterator.js");
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
__webpack_require__("./node_modules/@dojo/shim/Symbol.js");
exports.WeakMap = global_1.default.WeakMap;
if (!has_1.default('es6-weakmap')) {
    var DELETED_1 = {};
    var getUID_1 = function getUID() {
        return Math.floor(Math.random() * 100000000);
    };
    var generateName_1 = (function () {
        var startId = Math.floor(Date.now() % 100000000);
        return function generateName() {
            return '__wm' + getUID_1() + (startId++ + '__');
        };
    })();
    exports.WeakMap = /** @class */ (function () {
        function WeakMap(iterable) {
            this[Symbol.toStringTag] = 'WeakMap';
            Object.defineProperty(this, '_name', {
                value: generateName_1()
            });
            this._frozenEntries = [];
            if (iterable) {
                if (iterator_1.isArrayLike(iterable)) {
                    for (var i = 0; i < iterable.length; i++) {
                        var item = iterable[i];
                        this.set(item[0], item[1]);
                    }
                }
                else {
                    try {
                        for (var iterable_1 = tslib_1.__values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                            var _a = tslib_1.__read(iterable_1_1.value, 2), key = _a[0], value = _a[1];
                            this.set(key, value);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (iterable_1_1 && !iterable_1_1.done && (_b = iterable_1.return)) _b.call(iterable_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
            }
            var e_1, _b;
        }
        WeakMap.prototype._getFrozenEntryIndex = function (key) {
            for (var i = 0; i < this._frozenEntries.length; i++) {
                if (this._frozenEntries[i].key === key) {
                    return i;
                }
            }
            return -1;
        };
        WeakMap.prototype.delete = function (key) {
            if (key === undefined || key === null) {
                return false;
            }
            var entry = key[this._name];
            if (entry && entry.key === key && entry.value !== DELETED_1) {
                entry.value = DELETED_1;
                return true;
            }
            var frozenIndex = this._getFrozenEntryIndex(key);
            if (frozenIndex >= 0) {
                this._frozenEntries.splice(frozenIndex, 1);
                return true;
            }
            return false;
        };
        WeakMap.prototype.get = function (key) {
            if (key === undefined || key === null) {
                return undefined;
            }
            var entry = key[this._name];
            if (entry && entry.key === key && entry.value !== DELETED_1) {
                return entry.value;
            }
            var frozenIndex = this._getFrozenEntryIndex(key);
            if (frozenIndex >= 0) {
                return this._frozenEntries[frozenIndex].value;
            }
        };
        WeakMap.prototype.has = function (key) {
            if (key === undefined || key === null) {
                return false;
            }
            var entry = key[this._name];
            if (Boolean(entry && entry.key === key && entry.value !== DELETED_1)) {
                return true;
            }
            var frozenIndex = this._getFrozenEntryIndex(key);
            if (frozenIndex >= 0) {
                return true;
            }
            return false;
        };
        WeakMap.prototype.set = function (key, value) {
            if (!key || (typeof key !== 'object' && typeof key !== 'function')) {
                throw new TypeError('Invalid value used as weak map key');
            }
            var entry = key[this._name];
            if (!entry || entry.key !== key) {
                entry = Object.create(null, {
                    key: { value: key }
                });
                if (Object.isFrozen(key)) {
                    this._frozenEntries.push(entry);
                }
                else {
                    Object.defineProperty(key, this._name, {
                        value: entry
                    });
                }
            }
            entry.value = value;
            return this;
        };
        return WeakMap;
    }());
}
exports.default = exports.WeakMap;

/***/ }),

/***/ "./node_modules/@dojo/shim/array.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var iterator_1 = __webpack_require__("./node_modules/@dojo/shim/iterator.js");
var number_1 = __webpack_require__("./node_modules/@dojo/shim/number.js");
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
var util_1 = __webpack_require__("./node_modules/@dojo/shim/support/util.js");
if (has_1.default('es6-array') && has_1.default('es6-array-fill')) {
    exports.from = global_1.default.Array.from;
    exports.of = global_1.default.Array.of;
    exports.copyWithin = util_1.wrapNative(global_1.default.Array.prototype.copyWithin);
    exports.fill = util_1.wrapNative(global_1.default.Array.prototype.fill);
    exports.find = util_1.wrapNative(global_1.default.Array.prototype.find);
    exports.findIndex = util_1.wrapNative(global_1.default.Array.prototype.findIndex);
}
else {
    // It is only older versions of Safari/iOS that have a bad fill implementation and so aren't in the wild
    // To make things easier, if there is a bad fill implementation, the whole set of functions will be filled
    /**
     * Ensures a non-negative, non-infinite, safe integer.
     *
     * @param length The number to validate
     * @return A proper length
     */
    var toLength_1 = function toLength(length) {
        if (isNaN(length)) {
            return 0;
        }
        length = Number(length);
        if (isFinite(length)) {
            length = Math.floor(length);
        }
        // Ensure a non-negative, real, safe integer
        return Math.min(Math.max(length, 0), number_1.MAX_SAFE_INTEGER);
    };
    /**
     * From ES6 7.1.4 ToInteger()
     *
     * @param value A value to convert
     * @return An integer
     */
    var toInteger_1 = function toInteger(value) {
        value = Number(value);
        if (isNaN(value)) {
            return 0;
        }
        if (value === 0 || !isFinite(value)) {
            return value;
        }
        return (value > 0 ? 1 : -1) * Math.floor(Math.abs(value));
    };
    /**
     * Normalizes an offset against a given length, wrapping it if negative.
     *
     * @param value The original offset
     * @param length The total length to normalize against
     * @return If negative, provide a distance from the end (length); otherwise provide a distance from 0
     */
    var normalizeOffset_1 = function normalizeOffset(value, length) {
        return value < 0 ? Math.max(length + value, 0) : Math.min(value, length);
    };
    exports.from = function from(arrayLike, mapFunction, thisArg) {
        if (arrayLike == null) {
            throw new TypeError('from: requires an array-like object');
        }
        if (mapFunction && thisArg) {
            mapFunction = mapFunction.bind(thisArg);
        }
        /* tslint:disable-next-line:variable-name */
        var Constructor = this;
        var length = toLength_1(arrayLike.length);
        // Support extension
        var array = typeof Constructor === 'function' ? Object(new Constructor(length)) : new Array(length);
        if (!iterator_1.isArrayLike(arrayLike) && !iterator_1.isIterable(arrayLike)) {
            return array;
        }
        // if this is an array and the normalized length is 0, just return an empty array. this prevents a problem
        // with the iteration on IE when using a NaN array length.
        if (iterator_1.isArrayLike(arrayLike)) {
            if (length === 0) {
                return [];
            }
            for (var i = 0; i < arrayLike.length; i++) {
                array[i] = mapFunction ? mapFunction(arrayLike[i], i) : arrayLike[i];
            }
        }
        else {
            var i = 0;
            try {
                for (var arrayLike_1 = tslib_1.__values(arrayLike), arrayLike_1_1 = arrayLike_1.next(); !arrayLike_1_1.done; arrayLike_1_1 = arrayLike_1.next()) {
                    var value = arrayLike_1_1.value;
                    array[i] = mapFunction ? mapFunction(value, i) : value;
                    i++;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (arrayLike_1_1 && !arrayLike_1_1.done && (_a = arrayLike_1.return)) _a.call(arrayLike_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        if (arrayLike.length !== undefined) {
            array.length = length;
        }
        return array;
        var e_1, _a;
    };
    exports.of = function of() {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return Array.prototype.slice.call(items);
    };
    exports.copyWithin = function copyWithin(target, offset, start, end) {
        if (target == null) {
            throw new TypeError('copyWithin: target must be an array-like object');
        }
        var length = toLength_1(target.length);
        offset = normalizeOffset_1(toInteger_1(offset), length);
        start = normalizeOffset_1(toInteger_1(start), length);
        end = normalizeOffset_1(end === undefined ? length : toInteger_1(end), length);
        var count = Math.min(end - start, length - offset);
        var direction = 1;
        if (offset > start && offset < start + count) {
            direction = -1;
            start += count - 1;
            offset += count - 1;
        }
        while (count > 0) {
            if (start in target) {
                target[offset] = target[start];
            }
            else {
                delete target[offset];
            }
            offset += direction;
            start += direction;
            count--;
        }
        return target;
    };
    exports.fill = function fill(target, value, start, end) {
        var length = toLength_1(target.length);
        var i = normalizeOffset_1(toInteger_1(start), length);
        end = normalizeOffset_1(end === undefined ? length : toInteger_1(end), length);
        while (i < end) {
            target[i++] = value;
        }
        return target;
    };
    exports.find = function find(target, callback, thisArg) {
        var index = exports.findIndex(target, callback, thisArg);
        return index !== -1 ? target[index] : undefined;
    };
    exports.findIndex = function findIndex(target, callback, thisArg) {
        var length = toLength_1(target.length);
        if (!callback) {
            throw new TypeError('find: second argument must be a function');
        }
        if (thisArg) {
            callback = callback.bind(thisArg);
        }
        for (var i = 0; i < length; i++) {
            if (callback(target[i], i, target)) {
                return i;
            }
        }
        return -1;
    };
}
if (has_1.default('es7-array')) {
    exports.includes = util_1.wrapNative(global_1.default.Array.prototype.includes);
}
else {
    /**
     * Ensures a non-negative, non-infinite, safe integer.
     *
     * @param length The number to validate
     * @return A proper length
     */
    var toLength_2 = function toLength(length) {
        length = Number(length);
        if (isNaN(length)) {
            return 0;
        }
        if (isFinite(length)) {
            length = Math.floor(length);
        }
        // Ensure a non-negative, real, safe integer
        return Math.min(Math.max(length, 0), number_1.MAX_SAFE_INTEGER);
    };
    exports.includes = function includes(target, searchElement, fromIndex) {
        if (fromIndex === void 0) { fromIndex = 0; }
        var len = toLength_2(target.length);
        for (var i = fromIndex; i < len; ++i) {
            var currentElement = target[i];
            if (searchElement === currentElement ||
                (searchElement !== searchElement && currentElement !== currentElement)) {
                return true;
            }
        }
        return false;
    };
}

/***/ }),

/***/ "./node_modules/@dojo/shim/global.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
var globalObject = (function () {
    if (typeof global !== 'undefined') {
        // global spec defines a reference to the global object called 'global'
        // https://github.com/tc39/proposal-global
        // `global` is also defined in NodeJS
        return global;
    }
    else if (typeof window !== 'undefined') {
        // window is defined in browsers
        return window;
    }
    else if (typeof self !== 'undefined') {
        // self is defined in WebWorkers
        return self;
    }
})();
exports.default = globalObject;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/@dojo/shim/iterator.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./node_modules/@dojo/shim/Symbol.js");
var string_1 = __webpack_require__("./node_modules/@dojo/shim/string.js");
var staticDone = { done: true, value: undefined };
/**
 * A class that _shims_ an iterator interface on array like objects.
 */
var ShimIterator = /** @class */ (function () {
    function ShimIterator(list) {
        this._nextIndex = -1;
        if (isIterable(list)) {
            this._nativeIterator = list[Symbol.iterator]();
        }
        else {
            this._list = list;
        }
    }
    /**
     * Return the next iteration result for the Iterator
     */
    ShimIterator.prototype.next = function () {
        if (this._nativeIterator) {
            return this._nativeIterator.next();
        }
        if (!this._list) {
            return staticDone;
        }
        if (++this._nextIndex < this._list.length) {
            return {
                done: false,
                value: this._list[this._nextIndex]
            };
        }
        return staticDone;
    };
    ShimIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    return ShimIterator;
}());
exports.ShimIterator = ShimIterator;
/**
 * A type guard for checking if something has an Iterable interface
 *
 * @param value The value to type guard against
 */
function isIterable(value) {
    return value && typeof value[Symbol.iterator] === 'function';
}
exports.isIterable = isIterable;
/**
 * A type guard for checking if something is ArrayLike
 *
 * @param value The value to type guard against
 */
function isArrayLike(value) {
    return value && typeof value.length === 'number';
}
exports.isArrayLike = isArrayLike;
/**
 * Returns the iterator for an object
 *
 * @param iterable The iterable object to return the iterator for
 */
function get(iterable) {
    if (isIterable(iterable)) {
        return iterable[Symbol.iterator]();
    }
    else if (isArrayLike(iterable)) {
        return new ShimIterator(iterable);
    }
}
exports.get = get;
/**
 * Shims the functionality of `for ... of` blocks
 *
 * @param iterable The object the provides an interator interface
 * @param callback The callback which will be called for each item of the iterable
 * @param thisArg Optional scope to pass the callback
 */
function forOf(iterable, callback, thisArg) {
    var broken = false;
    function doBreak() {
        broken = true;
    }
    /* We need to handle iteration of double byte strings properly */
    if (isArrayLike(iterable) && typeof iterable === 'string') {
        var l = iterable.length;
        for (var i = 0; i < l; ++i) {
            var char = iterable[i];
            if (i + 1 < l) {
                var code = char.charCodeAt(0);
                if (code >= string_1.HIGH_SURROGATE_MIN && code <= string_1.HIGH_SURROGATE_MAX) {
                    char += iterable[++i];
                }
            }
            callback.call(thisArg, char, iterable, doBreak);
            if (broken) {
                return;
            }
        }
    }
    else {
        var iterator = get(iterable);
        if (iterator) {
            var result = iterator.next();
            while (!result.done) {
                callback.call(thisArg, result.value, iterable, doBreak);
                if (broken) {
                    return;
                }
                result = iterator.next();
            }
        }
    }
}
exports.forOf = forOf;

/***/ }),

/***/ "./node_modules/@dojo/shim/number.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
/**
 * The smallest interval between two representable numbers.
 */
exports.EPSILON = 1;
/**
 * The maximum safe integer in JavaScript
 */
exports.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
/**
 * The minimum safe integer in JavaScript
 */
exports.MIN_SAFE_INTEGER = -exports.MAX_SAFE_INTEGER;
/**
 * Determines whether the passed value is NaN without coersion.
 *
 * @param value The value to test
 * @return true if the value is NaN, false if it is not
 */
function isNaN(value) {
    return typeof value === 'number' && global_1.default.isNaN(value);
}
exports.isNaN = isNaN;
/**
 * Determines whether the passed value is a finite number without coersion.
 *
 * @param value The value to test
 * @return true if the value is finite, false if it is not
 */
function isFinite(value) {
    return typeof value === 'number' && global_1.default.isFinite(value);
}
exports.isFinite = isFinite;
/**
 * Determines whether the passed value is an integer.
 *
 * @param value The value to test
 * @return true if the value is an integer, false if it is not
 */
function isInteger(value) {
    return isFinite(value) && Math.floor(value) === value;
}
exports.isInteger = isInteger;
/**
 * Determines whether the passed value is an integer that is 'safe,' meaning:
 *   1. it can be expressed as an IEEE-754 double precision number
 *   2. it has a one-to-one mapping to a mathematical integer, meaning its
 *      IEEE-754 representation cannot be the result of rounding any other
 *      integer to fit the IEEE-754 representation
 *
 * @param value The value to test
 * @return true if the value is an integer, false if it is not
 */
function isSafeInteger(value) {
    return isInteger(value) && Math.abs(value) <= exports.MAX_SAFE_INTEGER;
}
exports.isSafeInteger = isSafeInteger;

/***/ }),

/***/ "./node_modules/@dojo/shim/object.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
var Symbol_1 = __webpack_require__("./node_modules/@dojo/shim/Symbol.js");
if (has_1.default('es6-object')) {
    var globalObject = global_1.default.Object;
    exports.assign = globalObject.assign;
    exports.getOwnPropertyDescriptor = globalObject.getOwnPropertyDescriptor;
    exports.getOwnPropertyNames = globalObject.getOwnPropertyNames;
    exports.getOwnPropertySymbols = globalObject.getOwnPropertySymbols;
    exports.is = globalObject.is;
    exports.keys = globalObject.keys;
}
else {
    exports.keys = function symbolAwareKeys(o) {
        return Object.keys(o).filter(function (key) { return !Boolean(key.match(/^@@.+/)); });
    };
    exports.assign = function assign(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        if (target == null) {
            // TypeError if undefined or null
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        sources.forEach(function (nextSource) {
            if (nextSource) {
                // Skip over if undefined or null
                exports.keys(nextSource).forEach(function (nextKey) {
                    to[nextKey] = nextSource[nextKey];
                });
            }
        });
        return to;
    };
    exports.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(o, prop) {
        if (Symbol_1.isSymbol(prop)) {
            return Object.getOwnPropertyDescriptor(o, prop);
        }
        else {
            return Object.getOwnPropertyDescriptor(o, prop);
        }
    };
    exports.getOwnPropertyNames = function getOwnPropertyNames(o) {
        return Object.getOwnPropertyNames(o).filter(function (key) { return !Boolean(key.match(/^@@.+/)); });
    };
    exports.getOwnPropertySymbols = function getOwnPropertySymbols(o) {
        return Object.getOwnPropertyNames(o)
            .filter(function (key) { return Boolean(key.match(/^@@.+/)); })
            .map(function (key) { return Symbol.for(key.substring(2)); });
    };
    exports.is = function is(value1, value2) {
        if (value1 === value2) {
            return value1 !== 0 || 1 / value1 === 1 / value2; // -0
        }
        return value1 !== value1 && value2 !== value2; // NaN
    };
}
if (has_1.default('es2017-object')) {
    var globalObject = global_1.default.Object;
    exports.getOwnPropertyDescriptors = globalObject.getOwnPropertyDescriptors;
    exports.entries = globalObject.entries;
    exports.values = globalObject.values;
}
else {
    exports.getOwnPropertyDescriptors = function getOwnPropertyDescriptors(o) {
        return exports.getOwnPropertyNames(o).reduce(function (previous, key) {
            previous[key] = exports.getOwnPropertyDescriptor(o, key);
            return previous;
        }, {});
    };
    exports.entries = function entries(o) {
        return exports.keys(o).map(function (key) { return [key, o[key]]; });
    };
    exports.values = function values(o) {
        return exports.keys(o).map(function (key) { return o[key]; });
    };
}

/***/ }),

/***/ "./node_modules/@dojo/shim/string.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
var util_1 = __webpack_require__("./node_modules/@dojo/shim/support/util.js");
/**
 * The minimum location of high surrogates
 */
exports.HIGH_SURROGATE_MIN = 0xd800;
/**
 * The maximum location of high surrogates
 */
exports.HIGH_SURROGATE_MAX = 0xdbff;
/**
 * The minimum location of low surrogates
 */
exports.LOW_SURROGATE_MIN = 0xdc00;
/**
 * The maximum location of low surrogates
 */
exports.LOW_SURROGATE_MAX = 0xdfff;
if (has_1.default('es6-string') && has_1.default('es6-string-raw')) {
    exports.fromCodePoint = global_1.default.String.fromCodePoint;
    exports.raw = global_1.default.String.raw;
    exports.codePointAt = util_1.wrapNative(global_1.default.String.prototype.codePointAt);
    exports.endsWith = util_1.wrapNative(global_1.default.String.prototype.endsWith);
    exports.includes = util_1.wrapNative(global_1.default.String.prototype.includes);
    exports.normalize = util_1.wrapNative(global_1.default.String.prototype.normalize);
    exports.repeat = util_1.wrapNative(global_1.default.String.prototype.repeat);
    exports.startsWith = util_1.wrapNative(global_1.default.String.prototype.startsWith);
}
else {
    /**
     * Validates that text is defined, and normalizes position (based on the given default if the input is NaN).
     * Used by startsWith, includes, and endsWith.
     *
     * @return Normalized position.
     */
    var normalizeSubstringArgs_1 = function (name, text, search, position, isEnd) {
        if (isEnd === void 0) { isEnd = false; }
        if (text == null) {
            throw new TypeError('string.' + name + ' requires a valid string to search against.');
        }
        var length = text.length;
        position = position !== position ? (isEnd ? length : 0) : position;
        return [text, String(search), Math.min(Math.max(position, 0), length)];
    };
    exports.fromCodePoint = function fromCodePoint() {
        var codePoints = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            codePoints[_i] = arguments[_i];
        }
        // Adapted from https://github.com/mathiasbynens/String.fromCodePoint
        var length = arguments.length;
        if (!length) {
            return '';
        }
        var fromCharCode = String.fromCharCode;
        var MAX_SIZE = 0x4000;
        var codeUnits = [];
        var index = -1;
        var result = '';
        while (++index < length) {
            var codePoint = Number(arguments[index]);
            // Code points must be finite integers within the valid range
            var isValid = isFinite(codePoint) && Math.floor(codePoint) === codePoint && codePoint >= 0 && codePoint <= 0x10ffff;
            if (!isValid) {
                throw RangeError('string.fromCodePoint: Invalid code point ' + codePoint);
            }
            if (codePoint <= 0xffff) {
                // BMP code point
                codeUnits.push(codePoint);
            }
            else {
                // Astral code point; split in surrogate halves
                // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                codePoint -= 0x10000;
                var highSurrogate = (codePoint >> 10) + exports.HIGH_SURROGATE_MIN;
                var lowSurrogate = codePoint % 0x400 + exports.LOW_SURROGATE_MIN;
                codeUnits.push(highSurrogate, lowSurrogate);
            }
            if (index + 1 === length || codeUnits.length > MAX_SIZE) {
                result += fromCharCode.apply(null, codeUnits);
                codeUnits.length = 0;
            }
        }
        return result;
    };
    exports.raw = function raw(callSite) {
        var substitutions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            substitutions[_i - 1] = arguments[_i];
        }
        var rawStrings = callSite.raw;
        var result = '';
        var numSubstitutions = substitutions.length;
        if (callSite == null || callSite.raw == null) {
            throw new TypeError('string.raw requires a valid callSite object with a raw value');
        }
        for (var i = 0, length_1 = rawStrings.length; i < length_1; i++) {
            result += rawStrings[i] + (i < numSubstitutions && i < length_1 - 1 ? substitutions[i] : '');
        }
        return result;
    };
    exports.codePointAt = function codePointAt(text, position) {
        if (position === void 0) { position = 0; }
        // Adapted from https://github.com/mathiasbynens/String.prototype.codePointAt
        if (text == null) {
            throw new TypeError('string.codePointAt requries a valid string.');
        }
        var length = text.length;
        if (position !== position) {
            position = 0;
        }
        if (position < 0 || position >= length) {
            return undefined;
        }
        // Get the first code unit
        var first = text.charCodeAt(position);
        if (first >= exports.HIGH_SURROGATE_MIN && first <= exports.HIGH_SURROGATE_MAX && length > position + 1) {
            // Start of a surrogate pair (high surrogate and there is a next code unit); check for low surrogate
            // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            var second = text.charCodeAt(position + 1);
            if (second >= exports.LOW_SURROGATE_MIN && second <= exports.LOW_SURROGATE_MAX) {
                return (first - exports.HIGH_SURROGATE_MIN) * 0x400 + second - exports.LOW_SURROGATE_MIN + 0x10000;
            }
        }
        return first;
    };
    exports.endsWith = function endsWith(text, search, endPosition) {
        if (endPosition == null) {
            endPosition = text.length;
        }
        _a = tslib_1.__read(normalizeSubstringArgs_1('endsWith', text, search, endPosition, true), 3), text = _a[0], search = _a[1], endPosition = _a[2];
        var start = endPosition - search.length;
        if (start < 0) {
            return false;
        }
        return text.slice(start, endPosition) === search;
        var _a;
    };
    exports.includes = function includes(text, search, position) {
        if (position === void 0) { position = 0; }
        _a = tslib_1.__read(normalizeSubstringArgs_1('includes', text, search, position), 3), text = _a[0], search = _a[1], position = _a[2];
        return text.indexOf(search, position) !== -1;
        var _a;
    };
    exports.repeat = function repeat(text, count) {
        if (count === void 0) { count = 0; }
        // Adapted from https://github.com/mathiasbynens/String.prototype.repeat
        if (text == null) {
            throw new TypeError('string.repeat requires a valid string.');
        }
        if (count !== count) {
            count = 0;
        }
        if (count < 0 || count === Infinity) {
            throw new RangeError('string.repeat requires a non-negative finite count.');
        }
        var result = '';
        while (count) {
            if (count % 2) {
                result += text;
            }
            if (count > 1) {
                text += text;
            }
            count >>= 1;
        }
        return result;
    };
    exports.startsWith = function startsWith(text, search, position) {
        if (position === void 0) { position = 0; }
        search = String(search);
        _a = tslib_1.__read(normalizeSubstringArgs_1('startsWith', text, search, position), 3), text = _a[0], search = _a[1], position = _a[2];
        var end = position + search.length;
        if (end > text.length) {
            return false;
        }
        return text.slice(position, end) === search;
        var _a;
    };
}
if (has_1.default('es2017-string')) {
    exports.padEnd = util_1.wrapNative(global_1.default.String.prototype.padEnd);
    exports.padStart = util_1.wrapNative(global_1.default.String.prototype.padStart);
}
else {
    exports.padEnd = function padEnd(text, maxLength, fillString) {
        if (fillString === void 0) { fillString = ' '; }
        if (text === null || text === undefined) {
            throw new TypeError('string.repeat requires a valid string.');
        }
        if (maxLength === Infinity) {
            throw new RangeError('string.padEnd requires a non-negative finite count.');
        }
        if (maxLength === null || maxLength === undefined || maxLength < 0) {
            maxLength = 0;
        }
        var strText = String(text);
        var padding = maxLength - strText.length;
        if (padding > 0) {
            strText +=
                exports.repeat(fillString, Math.floor(padding / fillString.length)) +
                    fillString.slice(0, padding % fillString.length);
        }
        return strText;
    };
    exports.padStart = function padStart(text, maxLength, fillString) {
        if (fillString === void 0) { fillString = ' '; }
        if (text === null || text === undefined) {
            throw new TypeError('string.repeat requires a valid string.');
        }
        if (maxLength === Infinity) {
            throw new RangeError('string.padStart requires a non-negative finite count.');
        }
        if (maxLength === null || maxLength === undefined || maxLength < 0) {
            maxLength = 0;
        }
        var strText = String(text);
        var padding = maxLength - strText.length;
        if (padding > 0) {
            strText =
                exports.repeat(fillString, Math.floor(padding / fillString.length)) +
                    fillString.slice(0, padding % fillString.length) +
                    strText;
        }
        return strText;
    };
}

/***/ }),

/***/ "./node_modules/@dojo/shim/support/has.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var has_1 = __webpack_require__("./node_modules/@dojo/has/has.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
exports.default = has_1.default;
tslib_1.__exportStar(__webpack_require__("./node_modules/@dojo/has/has.js"), exports);
/* ECMAScript 6 and 7 Features */
/* Array */
has_1.add('es6-array', function () {
    return (['from', 'of'].every(function (key) { return key in global_1.default.Array; }) &&
        ['findIndex', 'find', 'copyWithin'].every(function (key) { return key in global_1.default.Array.prototype; }));
}, true);
has_1.add('es6-array-fill', function () {
    if ('fill' in global_1.default.Array.prototype) {
        /* Some versions of Safari do not properly implement this */
        return [1].fill(9, Number.POSITIVE_INFINITY)[0] === 1;
    }
    return false;
}, true);
has_1.add('es7-array', function () { return 'includes' in global_1.default.Array.prototype; }, true);
/* Map */
has_1.add('es6-map', function () {
    if (typeof global_1.default.Map === 'function') {
        /*
    IE11 and older versions of Safari are missing critical ES6 Map functionality
    We wrap this in a try/catch because sometimes the Map constructor exists, but does not
    take arguments (iOS 8.4)
     */
        try {
            var map = new global_1.default.Map([[0, 1]]);
            return (map.has(0) &&
                typeof map.keys === 'function' &&
                has_1.default('es6-symbol') &&
                typeof map.values === 'function' &&
                typeof map.entries === 'function');
        }
        catch (e) {
            /* istanbul ignore next: not testing on iOS at the moment */
            return false;
        }
    }
    return false;
}, true);
/* Math */
has_1.add('es6-math', function () {
    return [
        'clz32',
        'sign',
        'log10',
        'log2',
        'log1p',
        'expm1',
        'cosh',
        'sinh',
        'tanh',
        'acosh',
        'asinh',
        'atanh',
        'trunc',
        'fround',
        'cbrt',
        'hypot'
    ].every(function (name) { return typeof global_1.default.Math[name] === 'function'; });
}, true);
has_1.add('es6-math-imul', function () {
    if ('imul' in global_1.default.Math) {
        /* Some versions of Safari on ios do not properly implement this */
        return Math.imul(0xffffffff, 5) === -5;
    }
    return false;
}, true);
/* Object */
has_1.add('es6-object', function () {
    return (has_1.default('es6-symbol') &&
        ['assign', 'is', 'getOwnPropertySymbols', 'setPrototypeOf'].every(function (name) { return typeof global_1.default.Object[name] === 'function'; }));
}, true);
has_1.add('es2017-object', function () {
    return ['values', 'entries', 'getOwnPropertyDescriptors'].every(function (name) { return typeof global_1.default.Object[name] === 'function'; });
}, true);
/* Observable */
has_1.add('es-observable', function () { return typeof global_1.default.Observable !== 'undefined'; }, true);
/* Promise */
has_1.add('es6-promise', function () { return typeof global_1.default.Promise !== 'undefined' && has_1.default('es6-symbol'); }, true);
/* Set */
has_1.add('es6-set', function () {
    if (typeof global_1.default.Set === 'function') {
        /* IE11 and older versions of Safari are missing critical ES6 Set functionality */
        var set = new global_1.default.Set([1]);
        return set.has(1) && 'keys' in set && typeof set.keys === 'function' && has_1.default('es6-symbol');
    }
    return false;
}, true);
/* String */
has_1.add('es6-string', function () {
    return ([
        /* static methods */
        'fromCodePoint'
    ].every(function (key) { return typeof global_1.default.String[key] === 'function'; }) &&
        [
            /* instance methods */
            'codePointAt',
            'normalize',
            'repeat',
            'startsWith',
            'endsWith',
            'includes'
        ].every(function (key) { return typeof global_1.default.String.prototype[key] === 'function'; }));
}, true);
has_1.add('es6-string-raw', function () {
    function getCallSite(callSite) {
        var substitutions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            substitutions[_i - 1] = arguments[_i];
        }
        var result = tslib_1.__spread(callSite);
        result.raw = callSite.raw;
        return result;
    }
    if ('raw' in global_1.default.String) {
        var b = 1;
        var callSite = getCallSite(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["a\n", ""], ["a\\n", ""])), b);
        callSite.raw = ['a\\n'];
        var supportsTrunc = global_1.default.String.raw(callSite, 42) === 'a:\\n';
        return supportsTrunc;
    }
    return false;
}, true);
has_1.add('es2017-string', function () {
    return ['padStart', 'padEnd'].every(function (key) { return typeof global_1.default.String.prototype[key] === 'function'; });
}, true);
/* Symbol */
has_1.add('es6-symbol', function () { return typeof global_1.default.Symbol !== 'undefined' && typeof Symbol() === 'symbol'; }, true);
/* WeakMap */
has_1.add('es6-weakmap', function () {
    if (typeof global_1.default.WeakMap !== 'undefined') {
        /* IE11 and older versions of Safari are missing critical ES6 Map functionality */
        var key1 = {};
        var key2 = {};
        var map = new global_1.default.WeakMap([[key1, 1]]);
        Object.freeze(key1);
        return map.get(key1) === 1 && map.set(key2, 2) === map && has_1.default('es6-symbol');
    }
    return false;
}, true);
/* Miscellaneous features */
has_1.add('microtasks', function () { return has_1.default('es6-promise') || has_1.default('host-node') || has_1.default('dom-mutationobserver'); }, true);
has_1.add('postmessage', function () {
    // If window is undefined, and we have postMessage, it probably means we're in a web worker. Web workers have
    // post message but it doesn't work how we expect it to, so it's best just to pretend it doesn't exist.
    return typeof global_1.default.window !== 'undefined' && typeof global_1.default.postMessage === 'function';
}, true);
has_1.add('raf', function () { return typeof global_1.default.requestAnimationFrame === 'function'; }, true);
has_1.add('setimmediate', function () { return typeof global_1.default.setImmediate !== 'undefined'; }, true);
/* DOM Features */
has_1.add('dom-mutationobserver', function () {
    if (has_1.default('host-browser') && Boolean(global_1.default.MutationObserver || global_1.default.WebKitMutationObserver)) {
        // IE11 has an unreliable MutationObserver implementation where setProperty() does not
        // generate a mutation event, observers can crash, and the queue does not drain
        // reliably. The following feature test was adapted from
        // https://gist.github.com/t10ko/4aceb8c71681fdb275e33efe5e576b14
        var example = document.createElement('div');
        /* tslint:disable-next-line:variable-name */
        var HostMutationObserver = global_1.default.MutationObserver || global_1.default.WebKitMutationObserver;
        var observer = new HostMutationObserver(function () { });
        observer.observe(example, { attributes: true });
        example.style.setProperty('display', 'block');
        return Boolean(observer.takeRecords().length);
    }
    return false;
}, true);
has_1.add('dom-webanimation', function () { return has_1.default('host-browser') && global_1.default.Animation !== undefined && global_1.default.KeyframeEffect !== undefined; }, true);
var templateObject_1;

/***/ }),

/***/ "./node_modules/@dojo/shim/support/queue.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate) {
Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var has_1 = __webpack_require__("./node_modules/@dojo/shim/support/has.js");
function executeTask(item) {
    if (item && item.isActive && item.callback) {
        item.callback();
    }
}
function getQueueHandle(item, destructor) {
    return {
        destroy: function () {
            this.destroy = function () { };
            item.isActive = false;
            item.callback = null;
            if (destructor) {
                destructor();
            }
        }
    };
}
var checkMicroTaskQueue;
var microTasks;
/**
 * Schedules a callback to the macrotask queue.
 *
 * @param callback the function to be queued and later executed.
 * @returns An object with a `destroy` method that, when called, prevents the registered callback from executing.
 */
exports.queueTask = (function () {
    var destructor;
    var enqueue;
    // Since the IE implementation of `setImmediate` is not flawless, we will test for `postMessage` first.
    if (has_1.default('postmessage')) {
        var queue_1 = [];
        global_1.default.addEventListener('message', function (event) {
            // Confirm that the event was triggered by the current window and by this particular implementation.
            if (event.source === global_1.default && event.data === 'dojo-queue-message') {
                event.stopPropagation();
                if (queue_1.length) {
                    executeTask(queue_1.shift());
                }
            }
        });
        enqueue = function (item) {
            queue_1.push(item);
            global_1.default.postMessage('dojo-queue-message', '*');
        };
    }
    else if (has_1.default('setimmediate')) {
        destructor = global_1.default.clearImmediate;
        enqueue = function (item) {
            return setImmediate(executeTask.bind(null, item));
        };
    }
    else {
        destructor = global_1.default.clearTimeout;
        enqueue = function (item) {
            return setTimeout(executeTask.bind(null, item), 0);
        };
    }
    function queueTask(callback) {
        var item = {
            isActive: true,
            callback: callback
        };
        var id = enqueue(item);
        return getQueueHandle(item, destructor &&
            function () {
                destructor(id);
            });
    }
    // TODO: Use aspect.before when it is available.
    return has_1.default('microtasks')
        ? queueTask
        : function (callback) {
            checkMicroTaskQueue();
            return queueTask(callback);
        };
})();
// When no mechanism for registering microtasks is exposed by the environment, microtasks will
// be queued and then executed in a single macrotask before the other macrotasks are executed.
if (!has_1.default('microtasks')) {
    var isMicroTaskQueued_1 = false;
    microTasks = [];
    checkMicroTaskQueue = function () {
        if (!isMicroTaskQueued_1) {
            isMicroTaskQueued_1 = true;
            exports.queueTask(function () {
                isMicroTaskQueued_1 = false;
                if (microTasks.length) {
                    var item = void 0;
                    while ((item = microTasks.shift())) {
                        executeTask(item);
                    }
                }
            });
        }
    };
}
/**
 * Schedules an animation task with `window.requestAnimationFrame` if it exists, or with `queueTask` otherwise.
 *
 * Since requestAnimationFrame's behavior does not match that expected from `queueTask`, it is not used there.
 * However, at times it makes more sense to delegate to requestAnimationFrame; hence the following method.
 *
 * @param callback the function to be queued and later executed.
 * @returns An object with a `destroy` method that, when called, prevents the registered callback from executing.
 */
exports.queueAnimationTask = (function () {
    if (!has_1.default('raf')) {
        return exports.queueTask;
    }
    function queueAnimationTask(callback) {
        var item = {
            isActive: true,
            callback: callback
        };
        var rafId = requestAnimationFrame(executeTask.bind(null, item));
        return getQueueHandle(item, function () {
            cancelAnimationFrame(rafId);
        });
    }
    // TODO: Use aspect.before when it is available.
    return has_1.default('microtasks')
        ? queueAnimationTask
        : function (callback) {
            checkMicroTaskQueue();
            return queueAnimationTask(callback);
        };
})();
/**
 * Schedules a callback to the microtask queue.
 *
 * Any callbacks registered with `queueMicroTask` will be executed before the next macrotask. If no native
 * mechanism for scheduling macrotasks is exposed, then any callbacks will be fired before any macrotask
 * registered with `queueTask` or `queueAnimationTask`.
 *
 * @param callback the function to be queued and later executed.
 * @returns An object with a `destroy` method that, when called, prevents the registered callback from executing.
 */
exports.queueMicroTask = (function () {
    var enqueue;
    if (has_1.default('host-node')) {
        enqueue = function (item) {
            global_1.default.process.nextTick(executeTask.bind(null, item));
        };
    }
    else if (has_1.default('es6-promise')) {
        enqueue = function (item) {
            global_1.default.Promise.resolve(item).then(executeTask);
        };
    }
    else if (has_1.default('dom-mutationobserver')) {
        /* tslint:disable-next-line:variable-name */
        var HostMutationObserver = global_1.default.MutationObserver || global_1.default.WebKitMutationObserver;
        var node_1 = document.createElement('div');
        var queue_2 = [];
        var observer = new HostMutationObserver(function () {
            while (queue_2.length > 0) {
                var item = queue_2.shift();
                if (item && item.isActive && item.callback) {
                    item.callback();
                }
            }
        });
        observer.observe(node_1, { attributes: true });
        enqueue = function (item) {
            queue_2.push(item);
            node_1.setAttribute('queueStatus', '1');
        };
    }
    else {
        enqueue = function (item) {
            checkMicroTaskQueue();
            microTasks.push(item);
        };
    }
    return function (callback) {
        var item = {
            isActive: true,
            callback: callback
        };
        enqueue(item);
        return getQueueHandle(item);
    };
})();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/timers-browserify/main.js").setImmediate))

/***/ }),

/***/ "./node_modules/@dojo/shim/support/util.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper function to generate a value property descriptor
 *
 * @param value        The value the property descriptor should be set to
 * @param enumerable   If the property should be enumberable, defaults to false
 * @param writable     If the property should be writable, defaults to true
 * @param configurable If the property should be configurable, defaults to true
 * @return             The property descriptor object
 */
function getValueDescriptor(value, enumerable, writable, configurable) {
    if (enumerable === void 0) { enumerable = false; }
    if (writable === void 0) { writable = true; }
    if (configurable === void 0) { configurable = true; }
    return {
        value: value,
        enumerable: enumerable,
        writable: writable,
        configurable: configurable
    };
}
exports.getValueDescriptor = getValueDescriptor;
function wrapNative(nativeFunction) {
    return function (target) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return nativeFunction.apply(target, args);
    };
}
exports.wrapNative = wrapNative;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/Container.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var WidgetBase_1 = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.js");
var inject_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/inject.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var alwaysRender_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/alwaysRender.js");
function Container(component, name, _a) {
    var getProperties = _a.getProperties;
    var WidgetContainer = /** @class */ (function (_super) {
        tslib_1.__extends(WidgetContainer, _super);
        function WidgetContainer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WidgetContainer.prototype.render = function () {
            return d_1.w(component, this.properties, this.children);
        };
        WidgetContainer = tslib_1.__decorate([
            alwaysRender_1.alwaysRender(),
            inject_1.inject({ name: name, getProperties: getProperties })
        ], WidgetContainer);
        return WidgetContainer;
    }(WidgetBase_1.WidgetBase));
    return WidgetContainer;
}
exports.Container = Container;
exports.default = Container;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/Injector.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var Evented_1 = __webpack_require__("./node_modules/@dojo/core/Evented.js");
var Injector = /** @class */ (function (_super) {
    tslib_1.__extends(Injector, _super);
    function Injector(payload) {
        var _this = _super.call(this) || this;
        _this._payload = payload;
        return _this;
    }
    Injector.prototype.get = function () {
        return this._payload;
    };
    Injector.prototype.set = function (payload) {
        this._payload = payload;
        this.emit({ type: 'invalidate' });
    };
    return Injector;
}(Evented_1.Evented));
exports.Injector = Injector;
exports.default = Injector;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/NodeHandler.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var Evented_1 = __webpack_require__("./node_modules/@dojo/core/Evented.js");
var Map_1 = __webpack_require__("./node_modules/@dojo/shim/Map.js");
/**
 * Enum to identify the type of event.
 * Listening to 'Projector' will notify when projector is created or updated
 * Listening to 'Widget' will notify when widget root is created or updated
 */
var NodeEventType;
(function (NodeEventType) {
    NodeEventType["Projector"] = "Projector";
    NodeEventType["Widget"] = "Widget";
})(NodeEventType = exports.NodeEventType || (exports.NodeEventType = {}));
var NodeHandler = /** @class */ (function (_super) {
    tslib_1.__extends(NodeHandler, _super);
    function NodeHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._nodeMap = new Map_1.default();
        return _this;
    }
    NodeHandler.prototype.get = function (key) {
        return this._nodeMap.get(key);
    };
    NodeHandler.prototype.has = function (key) {
        return this._nodeMap.has(key);
    };
    NodeHandler.prototype.add = function (element, key) {
        this._nodeMap.set(key, element);
        this.emit({ type: key });
    };
    NodeHandler.prototype.addRoot = function () {
        this.emit({ type: NodeEventType.Widget });
    };
    NodeHandler.prototype.addProjector = function () {
        this.emit({ type: NodeEventType.Projector });
    };
    NodeHandler.prototype.clear = function () {
        this._nodeMap.clear();
    };
    return NodeHandler;
}(Evented_1.Evented));
exports.NodeHandler = NodeHandler;
exports.default = NodeHandler;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/Registry.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var Promise_1 = __webpack_require__("./node_modules/@dojo/shim/Promise.js");
var Map_1 = __webpack_require__("./node_modules/@dojo/shim/Map.js");
var Symbol_1 = __webpack_require__("./node_modules/@dojo/shim/Symbol.js");
var Evented_1 = __webpack_require__("./node_modules/@dojo/core/Evented.js");
/**
 * Widget base symbol type
 */
exports.WIDGET_BASE_TYPE = Symbol_1.default('Widget Base');
/**
 * Checks is the item is a subclass of WidgetBase (or a WidgetBase)
 *
 * @param item the item to check
 * @returns true/false indicating if the item is a WidgetBaseConstructor
 */
function isWidgetBaseConstructor(item) {
    return Boolean(item && item._type === exports.WIDGET_BASE_TYPE);
}
exports.isWidgetBaseConstructor = isWidgetBaseConstructor;
function isWidgetConstructorDefaultExport(item) {
    return Boolean(item &&
        item.hasOwnProperty('__esModule') &&
        item.hasOwnProperty('default') &&
        isWidgetBaseConstructor(item.default));
}
exports.isWidgetConstructorDefaultExport = isWidgetConstructorDefaultExport;
/**
 * The Registry implementation
 */
var Registry = /** @class */ (function (_super) {
    tslib_1.__extends(Registry, _super);
    function Registry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Emit loaded event for registry label
     */
    Registry.prototype.emitLoadedEvent = function (widgetLabel, item) {
        this.emit({
            type: widgetLabel,
            action: 'loaded',
            item: item
        });
    };
    Registry.prototype.define = function (label, item) {
        var _this = this;
        if (this._widgetRegistry === undefined) {
            this._widgetRegistry = new Map_1.default();
        }
        if (this._widgetRegistry.has(label)) {
            throw new Error("widget has already been registered for '" + label.toString() + "'");
        }
        this._widgetRegistry.set(label, item);
        if (item instanceof Promise_1.default) {
            item.then(function (widgetCtor) {
                _this._widgetRegistry.set(label, widgetCtor);
                _this.emitLoadedEvent(label, widgetCtor);
                return widgetCtor;
            }, function (error) {
                throw error;
            });
        }
        else if (isWidgetBaseConstructor(item)) {
            this.emitLoadedEvent(label, item);
        }
    };
    Registry.prototype.defineInjector = function (label, item) {
        if (this._injectorRegistry === undefined) {
            this._injectorRegistry = new Map_1.default();
        }
        if (this._injectorRegistry.has(label)) {
            throw new Error("injector has already been registered for '" + label.toString() + "'");
        }
        this._injectorRegistry.set(label, item);
        this.emitLoadedEvent(label, item);
    };
    Registry.prototype.get = function (label) {
        var _this = this;
        if (!this.has(label)) {
            return null;
        }
        var item = this._widgetRegistry.get(label);
        if (isWidgetBaseConstructor(item)) {
            return item;
        }
        if (item instanceof Promise_1.default) {
            return null;
        }
        var promise = item();
        this._widgetRegistry.set(label, promise);
        promise.then(function (widgetCtor) {
            if (isWidgetConstructorDefaultExport(widgetCtor)) {
                widgetCtor = widgetCtor.default;
            }
            _this._widgetRegistry.set(label, widgetCtor);
            _this.emitLoadedEvent(label, widgetCtor);
            return widgetCtor;
        }, function (error) {
            throw error;
        });
        return null;
    };
    Registry.prototype.getInjector = function (label) {
        if (!this.hasInjector(label)) {
            return null;
        }
        return this._injectorRegistry.get(label);
    };
    Registry.prototype.has = function (label) {
        return Boolean(this._widgetRegistry && this._widgetRegistry.has(label));
    };
    Registry.prototype.hasInjector = function (label) {
        return Boolean(this._injectorRegistry && this._injectorRegistry.has(label));
    };
    return Registry;
}(Evented_1.Evented));
exports.Registry = Registry;
exports.default = Registry;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/RegistryHandler.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var Map_1 = __webpack_require__("./node_modules/@dojo/shim/Map.js");
var Evented_1 = __webpack_require__("./node_modules/@dojo/core/Evented.js");
var Registry_1 = __webpack_require__("./node_modules/@dojo/widget-core/Registry.js");
var RegistryHandler = /** @class */ (function (_super) {
    tslib_1.__extends(RegistryHandler, _super);
    function RegistryHandler() {
        var _this = _super.call(this) || this;
        _this._registry = new Registry_1.Registry();
        _this._registryWidgetLabelMap = new Map_1.Map();
        _this._registryInjectorLabelMap = new Map_1.Map();
        _this.own(_this._registry);
        var destroy = function () {
            if (_this.baseRegistry) {
                _this._registryWidgetLabelMap.delete(_this.baseRegistry);
                _this._registryInjectorLabelMap.delete(_this.baseRegistry);
                _this.baseRegistry = undefined;
            }
        };
        _this.own({ destroy: destroy });
        return _this;
    }
    Object.defineProperty(RegistryHandler.prototype, "base", {
        set: function (baseRegistry) {
            if (this.baseRegistry) {
                this._registryWidgetLabelMap.delete(this.baseRegistry);
                this._registryInjectorLabelMap.delete(this.baseRegistry);
            }
            this.baseRegistry = baseRegistry;
        },
        enumerable: true,
        configurable: true
    });
    RegistryHandler.prototype.define = function (label, widget) {
        this._registry.define(label, widget);
    };
    RegistryHandler.prototype.defineInjector = function (label, injector) {
        this._registry.defineInjector(label, injector);
    };
    RegistryHandler.prototype.has = function (label) {
        return this._registry.has(label) || Boolean(this.baseRegistry && this.baseRegistry.has(label));
    };
    RegistryHandler.prototype.hasInjector = function (label) {
        return this._registry.hasInjector(label) || Boolean(this.baseRegistry && this.baseRegistry.hasInjector(label));
    };
    RegistryHandler.prototype.get = function (label, globalPrecedence) {
        if (globalPrecedence === void 0) { globalPrecedence = false; }
        return this._get(label, globalPrecedence, 'get', this._registryWidgetLabelMap);
    };
    RegistryHandler.prototype.getInjector = function (label, globalPrecedence) {
        if (globalPrecedence === void 0) { globalPrecedence = false; }
        return this._get(label, globalPrecedence, 'getInjector', this._registryInjectorLabelMap);
    };
    RegistryHandler.prototype._get = function (label, globalPrecedence, getFunctionName, labelMap) {
        var _this = this;
        var registries = globalPrecedence ? [this.baseRegistry, this._registry] : [this._registry, this.baseRegistry];
        for (var i = 0; i < registries.length; i++) {
            var registry = registries[i];
            if (!registry) {
                continue;
            }
            var item = registry[getFunctionName](label);
            var registeredLabels = labelMap.get(registry) || [];
            if (item) {
                return item;
            }
            else if (registeredLabels.indexOf(label) === -1) {
                var handle = registry.on(label, function (event) {
                    if (event.action === 'loaded' &&
                        _this[getFunctionName](label, globalPrecedence) === event.item) {
                        _this.emit({ type: 'invalidate' });
                    }
                });
                this.own(handle);
                labelMap.set(registry, tslib_1.__spread(registeredLabels, [label]));
            }
        }
        return null;
    };
    return RegistryHandler;
}(Evented_1.Evented));
exports.RegistryHandler = RegistryHandler;
exports.default = RegistryHandler;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/WidgetBase.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var Map_1 = __webpack_require__("./node_modules/@dojo/shim/Map.js");
var WeakMap_1 = __webpack_require__("./node_modules/@dojo/shim/WeakMap.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var diff_1 = __webpack_require__("./node_modules/@dojo/widget-core/diff.js");
var RegistryHandler_1 = __webpack_require__("./node_modules/@dojo/widget-core/RegistryHandler.js");
var NodeHandler_1 = __webpack_require__("./node_modules/@dojo/widget-core/NodeHandler.js");
var vdom_1 = __webpack_require__("./node_modules/@dojo/widget-core/vdom.js");
var Registry_1 = __webpack_require__("./node_modules/@dojo/widget-core/Registry.js");
var decoratorMap = new Map_1.default();
var boundAuto = diff_1.auto.bind(null);
/**
 * Main widget base for all widgets to extend
 */
var WidgetBase = /** @class */ (function () {
    /**
     * @constructor
     */
    function WidgetBase() {
        var _this = this;
        /**
         * Indicates if it is the initial set properties cycle
         */
        this._initialProperties = true;
        /**
         * Array of property keys considered changed from the previous set properties
         */
        this._changedPropertyKeys = [];
        this._nodeHandler = new NodeHandler_1.default();
        this._handles = [];
        this._children = [];
        this._decoratorCache = new Map_1.default();
        this._properties = {};
        this._boundRenderFunc = this.render.bind(this);
        this._boundInvalidate = this.invalidate.bind(this);
        vdom_1.widgetInstanceMap.set(this, {
            dirty: true,
            onAttach: function () {
                _this.onAttach();
            },
            onDetach: function () {
                _this.onDetach();
                _this.destroy();
            },
            nodeHandler: this._nodeHandler,
            registry: function () {
                return _this.registry;
            },
            coreProperties: {},
            rendering: false,
            inputProperties: {}
        });
        this._runAfterConstructors();
    }
    WidgetBase.prototype.meta = function (MetaType) {
        if (this._metaMap === undefined) {
            this._metaMap = new Map_1.default();
        }
        var cached = this._metaMap.get(MetaType);
        if (!cached) {
            cached = new MetaType({
                invalidate: this._boundInvalidate,
                nodeHandler: this._nodeHandler,
                bind: this
            });
            this.own(cached);
            this._metaMap.set(MetaType, cached);
        }
        return cached;
    };
    WidgetBase.prototype.onAttach = function () {
        // Do nothing by default.
    };
    WidgetBase.prototype.onDetach = function () {
        // Do nothing by default.
    };
    Object.defineProperty(WidgetBase.prototype, "properties", {
        get: function () {
            return this._properties;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WidgetBase.prototype, "changedPropertyKeys", {
        get: function () {
            return tslib_1.__spread(this._changedPropertyKeys);
        },
        enumerable: true,
        configurable: true
    });
    WidgetBase.prototype.__setCoreProperties__ = function (coreProperties) {
        var baseRegistry = coreProperties.baseRegistry;
        var instanceData = vdom_1.widgetInstanceMap.get(this);
        if (instanceData.coreProperties.baseRegistry !== baseRegistry) {
            if (this._registry === undefined) {
                this._registry = new RegistryHandler_1.default();
                this.own(this._registry);
                this.own(this._registry.on('invalidate', this._boundInvalidate));
            }
            this._registry.base = baseRegistry;
            this.invalidate();
        }
        instanceData.coreProperties = coreProperties;
    };
    WidgetBase.prototype.__setProperties__ = function (originalProperties) {
        var _this = this;
        var instanceData = vdom_1.widgetInstanceMap.get(this);
        instanceData.inputProperties = originalProperties;
        var properties = this._runBeforeProperties(originalProperties);
        var registeredDiffPropertyNames = this.getDecorator('registeredDiffProperty');
        var changedPropertyKeys = [];
        var propertyNames = Object.keys(properties);
        if (this._initialProperties === false || registeredDiffPropertyNames.length !== 0) {
            var allProperties = tslib_1.__spread(propertyNames, Object.keys(this._properties));
            var checkedProperties = [];
            var diffPropertyResults = {};
            var runReactions = false;
            for (var i = 0; i < allProperties.length; i++) {
                var propertyName = allProperties[i];
                if (checkedProperties.indexOf(propertyName) !== -1) {
                    continue;
                }
                checkedProperties.push(propertyName);
                var previousProperty = this._properties[propertyName];
                var newProperty = this._bindFunctionProperty(properties[propertyName], instanceData.coreProperties.bind);
                if (registeredDiffPropertyNames.indexOf(propertyName) !== -1) {
                    runReactions = true;
                    var diffFunctions = this.getDecorator("diffProperty:" + propertyName);
                    for (var i_1 = 0; i_1 < diffFunctions.length; i_1++) {
                        var result = diffFunctions[i_1](previousProperty, newProperty);
                        if (result.changed && changedPropertyKeys.indexOf(propertyName) === -1) {
                            changedPropertyKeys.push(propertyName);
                        }
                        if (propertyName in properties) {
                            diffPropertyResults[propertyName] = result.value;
                        }
                    }
                }
                else {
                    var result = boundAuto(previousProperty, newProperty);
                    if (result.changed && changedPropertyKeys.indexOf(propertyName) === -1) {
                        changedPropertyKeys.push(propertyName);
                    }
                    if (propertyName in properties) {
                        diffPropertyResults[propertyName] = result.value;
                    }
                }
            }
            if (runReactions) {
                this._mapDiffPropertyReactions(properties, changedPropertyKeys).forEach(function (args, reaction) {
                    if (args.changed) {
                        reaction.call(_this, args.previousProperties, args.newProperties);
                    }
                });
            }
            this._properties = diffPropertyResults;
            this._changedPropertyKeys = changedPropertyKeys;
        }
        else {
            this._initialProperties = false;
            for (var i = 0; i < propertyNames.length; i++) {
                var propertyName = propertyNames[i];
                if (typeof properties[propertyName] === 'function') {
                    properties[propertyName] = this._bindFunctionProperty(properties[propertyName], instanceData.coreProperties.bind);
                }
                else {
                    changedPropertyKeys.push(propertyName);
                }
            }
            this._changedPropertyKeys = changedPropertyKeys;
            this._properties = tslib_1.__assign({}, properties);
        }
        if (this._changedPropertyKeys.length > 0) {
            this.invalidate();
        }
    };
    Object.defineProperty(WidgetBase.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    WidgetBase.prototype.__setChildren__ = function (children) {
        if (this._children.length > 0 || children.length > 0) {
            this._children = children;
            this.invalidate();
        }
    };
    WidgetBase.prototype.__render__ = function () {
        var instanceData = vdom_1.widgetInstanceMap.get(this);
        instanceData.dirty = false;
        var render = this._runBeforeRenders();
        var dNode = render();
        dNode = this.runAfterRenders(dNode);
        this._nodeHandler.clear();
        return dNode;
    };
    WidgetBase.prototype.invalidate = function () {
        var instanceData = vdom_1.widgetInstanceMap.get(this);
        if (instanceData.invalidate) {
            instanceData.invalidate();
        }
    };
    WidgetBase.prototype.render = function () {
        return d_1.v('div', {}, this.children);
    };
    /**
     * Function to add decorators to WidgetBase
     *
     * @param decoratorKey The key of the decorator
     * @param value The value of the decorator
     */
    WidgetBase.prototype.addDecorator = function (decoratorKey, value) {
        value = Array.isArray(value) ? value : [value];
        if (this.hasOwnProperty('constructor')) {
            var decoratorList = decoratorMap.get(this.constructor);
            if (!decoratorList) {
                decoratorList = new Map_1.default();
                decoratorMap.set(this.constructor, decoratorList);
            }
            var specificDecoratorList = decoratorList.get(decoratorKey);
            if (!specificDecoratorList) {
                specificDecoratorList = [];
                decoratorList.set(decoratorKey, specificDecoratorList);
            }
            specificDecoratorList.push.apply(specificDecoratorList, tslib_1.__spread(value));
        }
        else {
            var decorators = this.getDecorator(decoratorKey);
            this._decoratorCache.set(decoratorKey, tslib_1.__spread(decorators, value));
        }
    };
    /**
     * Function to build the list of decorators from the global decorator map.
     *
     * @param decoratorKey  The key of the decorator
     * @return An array of decorator values
     * @private
     */
    WidgetBase.prototype._buildDecoratorList = function (decoratorKey) {
        var allDecorators = [];
        var constructor = this.constructor;
        while (constructor) {
            var instanceMap = decoratorMap.get(constructor);
            if (instanceMap) {
                var decorators = instanceMap.get(decoratorKey);
                if (decorators) {
                    allDecorators.unshift.apply(allDecorators, tslib_1.__spread(decorators));
                }
            }
            constructor = Object.getPrototypeOf(constructor);
        }
        return allDecorators;
    };
    /**
     * Function to retrieve decorator values
     *
     * @param decoratorKey The key of the decorator
     * @returns An array of decorator values
     */
    WidgetBase.prototype.getDecorator = function (decoratorKey) {
        var allDecorators = this._decoratorCache.get(decoratorKey);
        if (allDecorators !== undefined) {
            return allDecorators;
        }
        allDecorators = this._buildDecoratorList(decoratorKey);
        this._decoratorCache.set(decoratorKey, allDecorators);
        return allDecorators;
    };
    WidgetBase.prototype._mapDiffPropertyReactions = function (newProperties, changedPropertyKeys) {
        var _this = this;
        var reactionFunctions = this.getDecorator('diffReaction');
        return reactionFunctions.reduce(function (reactionPropertyMap, _a) {
            var reaction = _a.reaction, propertyName = _a.propertyName;
            var reactionArguments = reactionPropertyMap.get(reaction);
            if (reactionArguments === undefined) {
                reactionArguments = {
                    previousProperties: {},
                    newProperties: {},
                    changed: false
                };
            }
            reactionArguments.previousProperties[propertyName] = _this._properties[propertyName];
            reactionArguments.newProperties[propertyName] = newProperties[propertyName];
            if (changedPropertyKeys.indexOf(propertyName) !== -1) {
                reactionArguments.changed = true;
            }
            reactionPropertyMap.set(reaction, reactionArguments);
            return reactionPropertyMap;
        }, new Map_1.default());
    };
    /**
     * Binds unbound property functions to the specified `bind` property
     *
     * @param properties properties to check for functions
     */
    WidgetBase.prototype._bindFunctionProperty = function (property, bind) {
        if (typeof property === 'function' && Registry_1.isWidgetBaseConstructor(property) === false) {
            if (this._bindFunctionPropertyMap === undefined) {
                this._bindFunctionPropertyMap = new WeakMap_1.default();
            }
            var bindInfo = this._bindFunctionPropertyMap.get(property) || {};
            var boundFunc = bindInfo.boundFunc, scope = bindInfo.scope;
            if (boundFunc === undefined || scope !== bind) {
                boundFunc = property.bind(bind);
                this._bindFunctionPropertyMap.set(property, { boundFunc: boundFunc, scope: bind });
            }
            return boundFunc;
        }
        return property;
    };
    Object.defineProperty(WidgetBase.prototype, "registry", {
        get: function () {
            if (this._registry === undefined) {
                this._registry = new RegistryHandler_1.default();
                this.own(this._registry);
                this.own(this._registry.on('invalidate', this._boundInvalidate));
            }
            return this._registry;
        },
        enumerable: true,
        configurable: true
    });
    WidgetBase.prototype._runBeforeProperties = function (properties) {
        var _this = this;
        var beforeProperties = this.getDecorator('beforeProperties');
        if (beforeProperties.length > 0) {
            return beforeProperties.reduce(function (properties, beforePropertiesFunction) {
                return tslib_1.__assign({}, properties, beforePropertiesFunction.call(_this, properties));
            }, tslib_1.__assign({}, properties));
        }
        return properties;
    };
    /**
     * Run all registered before renders and return the updated render method
     */
    WidgetBase.prototype._runBeforeRenders = function () {
        var _this = this;
        var beforeRenders = this.getDecorator('beforeRender');
        if (beforeRenders.length > 0) {
            return beforeRenders.reduce(function (render, beforeRenderFunction) {
                var updatedRender = beforeRenderFunction.call(_this, render, _this._properties, _this._children);
                if (!updatedRender) {
                    console.warn('Render function not returned from beforeRender, using previous render');
                    return render;
                }
                return updatedRender;
            }, this._boundRenderFunc);
        }
        return this._boundRenderFunc;
    };
    /**
     * Run all registered after renders and return the decorated DNodes
     *
     * @param dNode The DNodes to run through the after renders
     */
    WidgetBase.prototype.runAfterRenders = function (dNode) {
        var _this = this;
        var afterRenders = this.getDecorator('afterRender');
        if (afterRenders.length > 0) {
            return afterRenders.reduce(function (dNode, afterRenderFunction) {
                return afterRenderFunction.call(_this, dNode);
            }, dNode);
        }
        if (this._metaMap !== undefined) {
            this._metaMap.forEach(function (meta) {
                meta.afterRender();
            });
        }
        return dNode;
    };
    WidgetBase.prototype._runAfterConstructors = function () {
        var _this = this;
        var afterConstructors = this.getDecorator('afterConstructor');
        if (afterConstructors.length > 0) {
            afterConstructors.forEach(function (afterConstructor) { return afterConstructor.call(_this); });
        }
    };
    WidgetBase.prototype.own = function (handle) {
        this._handles.push(handle);
    };
    WidgetBase.prototype.destroy = function () {
        while (this._handles.length > 0) {
            var handle = this._handles.pop();
            if (handle) {
                handle.destroy();
            }
        }
    };
    /**
     * static identifier
     */
    WidgetBase._type = Registry_1.WIDGET_BASE_TYPE;
    return WidgetBase;
}());
exports.WidgetBase = WidgetBase;
exports.default = WidgetBase;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/animations/cssTransitions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var browserSpecificTransitionEndEventName = '';
var browserSpecificAnimationEndEventName = '';
function determineBrowserStyleNames(element) {
    if ('WebkitTransition' in element.style) {
        browserSpecificTransitionEndEventName = 'webkitTransitionEnd';
        browserSpecificAnimationEndEventName = 'webkitAnimationEnd';
    }
    else if ('transition' in element.style || 'MozTransition' in element.style) {
        browserSpecificTransitionEndEventName = 'transitionend';
        browserSpecificAnimationEndEventName = 'animationend';
    }
    else {
        throw new Error('Your browser is not supported');
    }
}
function initialize(element) {
    if (browserSpecificAnimationEndEventName === '') {
        determineBrowserStyleNames(element);
    }
}
function runAndCleanUp(element, startAnimation, finishAnimation) {
    initialize(element);
    var finished = false;
    var transitionEnd = function () {
        if (!finished) {
            finished = true;
            element.removeEventListener(browserSpecificTransitionEndEventName, transitionEnd);
            element.removeEventListener(browserSpecificAnimationEndEventName, transitionEnd);
            finishAnimation();
        }
    };
    startAnimation();
    element.addEventListener(browserSpecificAnimationEndEventName, transitionEnd);
    element.addEventListener(browserSpecificTransitionEndEventName, transitionEnd);
}
function exit(node, properties, exitAnimation, removeNode) {
    var activeClass = properties.exitAnimationActive || exitAnimation + "-active";
    runAndCleanUp(node, function () {
        node.classList.add(exitAnimation);
        requestAnimationFrame(function () {
            node.classList.add(activeClass);
        });
    }, function () {
        removeNode();
    });
}
function enter(node, properties, enterAnimation) {
    var activeClass = properties.enterAnimationActive || enterAnimation + "-active";
    runAndCleanUp(node, function () {
        node.classList.add(enterAnimation);
        requestAnimationFrame(function () {
            node.classList.add(activeClass);
        });
    }, function () {
        node.classList.remove(enterAnimation);
        node.classList.remove(activeClass);
    });
}
exports.default = {
    enter: enter,
    exit: exit
};

/***/ }),

/***/ "./node_modules/@dojo/widget-core/d.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var Symbol_1 = __webpack_require__("./node_modules/@dojo/shim/Symbol.js");
/**
 * The symbol identifier for a WNode type
 */
exports.WNODE = Symbol_1.default('Identifier for a WNode.');
/**
 * The symbol identifier for a VNode type
 */
exports.VNODE = Symbol_1.default('Identifier for a VNode.');
/**
 * Helper function that returns true if the `DNode` is a `WNode` using the `type` property
 */
function isWNode(child) {
    return Boolean(child && typeof child !== 'string' && child.type === exports.WNODE);
}
exports.isWNode = isWNode;
/**
 * Helper function that returns true if the `DNode` is a `VNode` using the `type` property
 */
function isVNode(child) {
    return Boolean(child && typeof child !== 'string' && child.type === exports.VNODE);
}
exports.isVNode = isVNode;
function isElementNode(value) {
    return !!value.tagName;
}
exports.isElementNode = isElementNode;
function decorate(dNodes, optionsOrModifier, predicate) {
    var shallow = false;
    var modifier;
    if (typeof optionsOrModifier === 'function') {
        modifier = optionsOrModifier;
    }
    else {
        modifier = optionsOrModifier.modifier;
        predicate = optionsOrModifier.predicate;
        shallow = optionsOrModifier.shallow || false;
    }
    var nodes = Array.isArray(dNodes) ? tslib_1.__spread(dNodes) : [dNodes];
    function breaker() {
        nodes = [];
    }
    while (nodes.length) {
        var node = nodes.shift();
        if (node) {
            if (!shallow && (isWNode(node) || isVNode(node)) && node.children) {
                nodes = tslib_1.__spread(nodes, node.children);
            }
            if (!predicate || predicate(node)) {
                modifier(node, breaker);
            }
        }
    }
    return dNodes;
}
exports.decorate = decorate;
/**
 * Wrapper function for calls to create a widget.
 */
function w(widgetConstructor, properties, children) {
    if (children === void 0) { children = []; }
    return {
        children: children,
        widgetConstructor: widgetConstructor,
        properties: properties,
        type: exports.WNODE
    };
}
exports.w = w;
function v(tag, propertiesOrChildren, children) {
    if (propertiesOrChildren === void 0) { propertiesOrChildren = {}; }
    if (children === void 0) { children = undefined; }
    var properties = propertiesOrChildren;
    var deferredPropertiesCallback;
    if (Array.isArray(propertiesOrChildren)) {
        children = propertiesOrChildren;
        properties = {};
    }
    if (typeof properties === 'function') {
        deferredPropertiesCallback = properties;
        properties = {};
    }
    return {
        tag: tag,
        deferredPropertiesCallback: deferredPropertiesCallback,
        children: children,
        properties: properties,
        type: exports.VNODE
    };
}
exports.v = v;
/**
 * Create a VNode for an existing DOM Node.
 */
function dom(_a, children) {
    var node = _a.node, _b = _a.attrs, attrs = _b === void 0 ? {} : _b, _c = _a.props, props = _c === void 0 ? {} : _c, _d = _a.on, on = _d === void 0 ? {} : _d, _e = _a.diffType, diffType = _e === void 0 ? 'none' : _e;
    return {
        tag: isElementNode(node) ? node.tagName.toLowerCase() : '',
        properties: props,
        attributes: attrs,
        events: on,
        children: children,
        type: exports.VNODE,
        domNode: node,
        text: isElementNode(node) ? undefined : node.data,
        diffType: diffType
    };
}
exports.dom = dom;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/afterRender.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var handleDecorator_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/handleDecorator.js");
function afterRender(method) {
    return handleDecorator_1.handleDecorator(function (target, propertyKey) {
        target.addDecorator('afterRender', propertyKey ? target[propertyKey] : method);
    });
}
exports.afterRender = afterRender;
exports.default = afterRender;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/alwaysRender.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var handleDecorator_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/handleDecorator.js");
var beforeProperties_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/beforeProperties.js");
function alwaysRender() {
    return handleDecorator_1.handleDecorator(function (target, propertyKey) {
        beforeProperties_1.beforeProperties(function () {
            this.invalidate();
        })(target);
    });
}
exports.alwaysRender = alwaysRender;
exports.default = alwaysRender;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/beforeProperties.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var handleDecorator_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/handleDecorator.js");
function beforeProperties(method) {
    return handleDecorator_1.handleDecorator(function (target, propertyKey) {
        target.addDecorator('beforeProperties', propertyKey ? target[propertyKey] : method);
    });
}
exports.beforeProperties = beforeProperties;
exports.default = beforeProperties;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/customElement.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var registerCustomElement_1 = __webpack_require__("./node_modules/@dojo/widget-core/registerCustomElement.js");
/**
 * This Decorator is provided properties that define the behavior of a custom element, and
 * registers that custom element.
 */
function customElement(_a) {
    var tag = _a.tag, _b = _a.properties, properties = _b === void 0 ? [] : _b, _c = _a.attributes, attributes = _c === void 0 ? [] : _c, _d = _a.events, events = _d === void 0 ? [] : _d, _e = _a.childType, childType = _e === void 0 ? registerCustomElement_1.CustomElementChildType.DOJO : _e;
    return function (target) {
        target.prototype.__customElementDescriptor = {
            tagName: tag,
            attributes: attributes,
            properties: properties,
            events: events,
            childType: childType
        };
    };
}
exports.customElement = customElement;
exports.default = customElement;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/diffProperty.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var handleDecorator_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/handleDecorator.js");
/**
 * Decorator that can be used to register a function as a specific property diff
 *
 * @param propertyName  The name of the property of which the diff function is applied
 * @param diffType      The diff type, default is DiffType.AUTO.
 * @param diffFunction  A diff function to run if diffType if DiffType.CUSTOM
 */
function diffProperty(propertyName, diffFunction, reactionFunction) {
    return handleDecorator_1.handleDecorator(function (target, propertyKey) {
        target.addDecorator("diffProperty:" + propertyName, diffFunction.bind(null));
        target.addDecorator('registeredDiffProperty', propertyName);
        if (reactionFunction || propertyKey) {
            target.addDecorator('diffReaction', {
                propertyName: propertyName,
                reaction: propertyKey ? target[propertyKey] : reactionFunction
            });
        }
    });
}
exports.diffProperty = diffProperty;
exports.default = diffProperty;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/handleDecorator.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Generic decorator handler to take care of whether or not the decorator was called at the class level
 * or the method level.
 *
 * @param handler
 */
function handleDecorator(handler) {
    return function (target, propertyKey, descriptor) {
        if (typeof target === 'function') {
            handler(target.prototype, undefined);
        }
        else {
            handler(target, propertyKey);
        }
    };
}
exports.handleDecorator = handleDecorator;
exports.default = handleDecorator;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/decorators/inject.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var WeakMap_1 = __webpack_require__("./node_modules/@dojo/shim/WeakMap.js");
var handleDecorator_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/handleDecorator.js");
var beforeProperties_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/beforeProperties.js");
/**
 * Map of instances against registered injectors.
 */
var registeredInjectorsMap = new WeakMap_1.default();
/**
 * Decorator retrieves an injector from an available registry using the name and
 * calls the `getProperties` function with the payload from the injector
 * and current properties with the the injected properties returned.
 *
 * @param InjectConfig the inject configuration
 */
function inject(_a) {
    var name = _a.name, getProperties = _a.getProperties;
    return handleDecorator_1.handleDecorator(function (target, propertyKey) {
        beforeProperties_1.beforeProperties(function (properties) {
            var _this = this;
            var injector = this.registry.getInjector(name);
            if (injector) {
                var registeredInjectors = registeredInjectorsMap.get(this) || [];
                if (registeredInjectors.length === 0) {
                    registeredInjectorsMap.set(this, registeredInjectors);
                }
                if (registeredInjectors.indexOf(injector) === -1) {
                    this.own(injector.on('invalidate', function () {
                        _this.invalidate();
                    }));
                    registeredInjectors.push(injector);
                }
                return getProperties(injector.get(), properties);
            }
        })(target);
    });
}
exports.inject = inject;
exports.default = inject;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/diff.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Registry_1 = __webpack_require__("./node_modules/@dojo/widget-core/Registry.js");
function isObjectOrArray(value) {
    return Object.prototype.toString.call(value) === '[object Object]' || Array.isArray(value);
}
function always(previousProperty, newProperty) {
    return {
        changed: true,
        value: newProperty
    };
}
exports.always = always;
function ignore(previousProperty, newProperty) {
    return {
        changed: false,
        value: newProperty
    };
}
exports.ignore = ignore;
function reference(previousProperty, newProperty) {
    return {
        changed: previousProperty !== newProperty,
        value: newProperty
    };
}
exports.reference = reference;
function shallow(previousProperty, newProperty) {
    var changed = false;
    var validOldProperty = previousProperty && isObjectOrArray(previousProperty);
    var validNewProperty = newProperty && isObjectOrArray(newProperty);
    if (!validOldProperty || !validNewProperty) {
        return {
            changed: true,
            value: newProperty
        };
    }
    var previousKeys = Object.keys(previousProperty);
    var newKeys = Object.keys(newProperty);
    if (previousKeys.length !== newKeys.length) {
        changed = true;
    }
    else {
        changed = newKeys.some(function (key) {
            return newProperty[key] !== previousProperty[key];
        });
    }
    return {
        changed: changed,
        value: newProperty
    };
}
exports.shallow = shallow;
function auto(previousProperty, newProperty) {
    var result;
    if (typeof newProperty === 'function') {
        if (newProperty._type === Registry_1.WIDGET_BASE_TYPE) {
            result = reference(previousProperty, newProperty);
        }
        else {
            result = ignore(previousProperty, newProperty);
        }
    }
    else if (isObjectOrArray(newProperty)) {
        result = shallow(previousProperty, newProperty);
    }
    else {
        result = reference(previousProperty, newProperty);
    }
    return result;
}
exports.auto = auto;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/meta/Base.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var Destroyable_1 = __webpack_require__("./node_modules/@dojo/core/Destroyable.js");
var Set_1 = __webpack_require__("./node_modules/@dojo/shim/Set.js");
var Base = /** @class */ (function (_super) {
    tslib_1.__extends(Base, _super);
    function Base(properties) {
        var _this = _super.call(this) || this;
        _this._requestedNodeKeys = new Set_1.default();
        _this._invalidate = properties.invalidate;
        _this.nodeHandler = properties.nodeHandler;
        if (properties.bind) {
            _this._bind = properties.bind;
        }
        return _this;
    }
    Base.prototype.has = function (key) {
        return this.nodeHandler.has(key);
    };
    Base.prototype.getNode = function (key) {
        var _this = this;
        var stringKey = "" + key;
        var node = this.nodeHandler.get(stringKey);
        if (!node && !this._requestedNodeKeys.has(stringKey)) {
            var handle_1 = this.nodeHandler.on(stringKey, function () {
                handle_1.destroy();
                _this._requestedNodeKeys.delete(stringKey);
                _this.invalidate();
            });
            this.own(handle_1);
            this._requestedNodeKeys.add(stringKey);
        }
        return node;
    };
    Base.prototype.invalidate = function () {
        this._invalidate();
    };
    Base.prototype.afterRender = function () {
        // Do nothing by default.
    };
    return Base;
}(Destroyable_1.Destroyable));
exports.Base = Base;
exports.default = Base;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/meta/Focus.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var Base_1 = __webpack_require__("./node_modules/@dojo/widget-core/meta/Base.js");
var lang_1 = __webpack_require__("./node_modules/@dojo/core/lang.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var defaultResults = {
    active: false,
    containsFocus: false
};
var Focus = /** @class */ (function (_super) {
    tslib_1.__extends(Focus, _super);
    function Focus() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._onFocusChange = function () {
            _this._activeElement = global_1.default.document.activeElement;
            _this.invalidate();
        };
        return _this;
    }
    Focus.prototype.get = function (key) {
        var node = this.getNode(key);
        if (!node) {
            return tslib_1.__assign({}, defaultResults);
        }
        if (!this._activeElement) {
            this._activeElement = global_1.default.document.activeElement;
            this._createListener();
        }
        return {
            active: node === this._activeElement,
            containsFocus: node.contains(this._activeElement)
        };
    };
    Focus.prototype.set = function (key) {
        var node = this.getNode(key);
        node && node.focus();
    };
    Focus.prototype._createListener = function () {
        global_1.default.document.addEventListener('focusin', this._onFocusChange);
        global_1.default.document.addEventListener('focusout', this._onFocusChange);
        this.own(lang_1.createHandle(this._removeListener.bind(this)));
    };
    Focus.prototype._removeListener = function () {
        global_1.default.document.removeEventListener('focusin', this._onFocusChange);
        global_1.default.document.removeEventListener('focusout', this._onFocusChange);
    };
    return Focus;
}(Base_1.Base));
exports.Focus = Focus;
exports.default = Focus;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/mixins/Projector.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var lang_1 = __webpack_require__("./node_modules/@dojo/core/lang.js");
var cssTransitions_1 = __webpack_require__("./node_modules/@dojo/widget-core/animations/cssTransitions.js");
var afterRender_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/afterRender.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var vdom_1 = __webpack_require__("./node_modules/@dojo/widget-core/vdom.js");
/**
 * Represents the attach state of the projector
 */
var ProjectorAttachState;
(function (ProjectorAttachState) {
    ProjectorAttachState[ProjectorAttachState["Attached"] = 1] = "Attached";
    ProjectorAttachState[ProjectorAttachState["Detached"] = 2] = "Detached";
})(ProjectorAttachState = exports.ProjectorAttachState || (exports.ProjectorAttachState = {}));
/**
 * Attach type for the projector
 */
var AttachType;
(function (AttachType) {
    AttachType[AttachType["Append"] = 1] = "Append";
    AttachType[AttachType["Merge"] = 2] = "Merge";
})(AttachType = exports.AttachType || (exports.AttachType = {}));
function ProjectorMixin(Base) {
    var Projector = /** @class */ (function (_super) {
        tslib_1.__extends(Projector, _super);
        function Projector() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, tslib_1.__spread(args)) || this;
            _this._async = true;
            _this._projectorProperties = {};
            _this._projectionOptions = {
                transitions: cssTransitions_1.default
            };
            _this.root = document.body;
            _this.projectorState = ProjectorAttachState.Detached;
            return _this;
        }
        Projector.prototype.append = function (root) {
            var options = {
                type: AttachType.Append,
                root: root
            };
            return this._attach(options);
        };
        Projector.prototype.merge = function (root) {
            var options = {
                type: AttachType.Merge,
                root: root
            };
            return this._attach(options);
        };
        Object.defineProperty(Projector.prototype, "root", {
            get: function () {
                return this._root;
            },
            set: function (root) {
                if (this.projectorState === ProjectorAttachState.Attached) {
                    throw new Error('Projector already attached, cannot change root element');
                }
                this._root = root;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Projector.prototype, "async", {
            get: function () {
                return this._async;
            },
            set: function (async) {
                if (this.projectorState === ProjectorAttachState.Attached) {
                    throw new Error('Projector already attached, cannot change async mode');
                }
                this._async = async;
            },
            enumerable: true,
            configurable: true
        });
        Projector.prototype.sandbox = function (doc) {
            var _this = this;
            if (doc === void 0) { doc = document; }
            if (this.projectorState === ProjectorAttachState.Attached) {
                throw new Error('Projector already attached, cannot create sandbox');
            }
            this._async = false;
            var previousRoot = this.root;
            /* free up the document fragment for GC */
            this.own({
                destroy: function () {
                    _this._root = previousRoot;
                }
            });
            this._attach({
                /* DocumentFragment is not assignable to Element, but provides everything needed to work */
                root: doc.createDocumentFragment(),
                type: AttachType.Append
            });
        };
        Projector.prototype.setChildren = function (children) {
            this.__setChildren__(children);
        };
        Projector.prototype.setProperties = function (properties) {
            this.__setProperties__(properties);
        };
        Projector.prototype.__setProperties__ = function (properties) {
            if (this._projectorProperties && this._projectorProperties.registry !== properties.registry) {
                if (this._projectorProperties.registry) {
                    this._projectorProperties.registry.destroy();
                }
            }
            this._projectorProperties = lang_1.assign({}, properties);
            _super.prototype.__setCoreProperties__.call(this, { bind: this, baseRegistry: properties.registry });
            _super.prototype.__setProperties__.call(this, properties);
        };
        Projector.prototype.toHtml = function () {
            if (this.projectorState !== ProjectorAttachState.Attached || !this._projection) {
                throw new Error('Projector is not attached, cannot return an HTML string of projection.');
            }
            return this._projection.domNode.childNodes[0].outerHTML;
        };
        Projector.prototype.afterRender = function (result) {
            var node = result;
            if (typeof result === 'string' || result === null || result === undefined) {
                node = d_1.v('span', {}, [result]);
            }
            return node;
        };
        Projector.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        Projector.prototype._attach = function (_a) {
            var _this = this;
            var type = _a.type, root = _a.root;
            if (root) {
                this.root = root;
            }
            if (this.projectorState === ProjectorAttachState.Attached) {
                return this._attachHandle;
            }
            this.projectorState = ProjectorAttachState.Attached;
            var handle = {
                destroy: function () {
                    if (_this.projectorState === ProjectorAttachState.Attached) {
                        _this._projection = undefined;
                        _this.projectorState = ProjectorAttachState.Detached;
                    }
                }
            };
            this.own(handle);
            this._attachHandle = handle;
            this._projectionOptions = tslib_1.__assign({}, this._projectionOptions, { sync: !this._async });
            switch (type) {
                case AttachType.Append:
                    this._projection = vdom_1.dom.append(this.root, this, this._projectionOptions);
                    break;
                case AttachType.Merge:
                    this._projection = vdom_1.dom.merge(this.root, this, this._projectionOptions);
                    break;
            }
            return this._attachHandle;
        };
        tslib_1.__decorate([
            afterRender_1.afterRender(),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], Projector.prototype, "afterRender", null);
        return Projector;
    }(Base));
    return Projector;
}
exports.ProjectorMixin = ProjectorMixin;
exports.default = ProjectorMixin;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/mixins/Themed.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var Injector_1 = __webpack_require__("./node_modules/@dojo/widget-core/Injector.js");
var inject_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/inject.js");
var handleDecorator_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/handleDecorator.js");
var diffProperty_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/diffProperty.js");
var diff_1 = __webpack_require__("./node_modules/@dojo/widget-core/diff.js");
var THEME_KEY = ' _key';
exports.INJECTED_THEME_KEY = Symbol('theme');
/**
 * Decorator for base css classes
 */
function theme(theme) {
    return handleDecorator_1.handleDecorator(function (target) {
        target.addDecorator('baseThemeClasses', theme);
    });
}
exports.theme = theme;
/**
 * Creates a reverse lookup for the classes passed in via the `theme` function.
 *
 * @param classes The baseClasses object
 * @requires
 */
function createThemeClassesLookup(classes) {
    return classes.reduce(function (currentClassNames, baseClass) {
        Object.keys(baseClass).forEach(function (key) {
            currentClassNames[baseClass[key]] = key;
        });
        return currentClassNames;
    }, {});
}
/**
 * Convenience function that is given a theme and an optional registry, the theme
 * injector is defined against the registry, returning the theme.
 *
 * @param theme the theme to set
 * @param themeRegistry registry to define the theme injector against. Defaults
 * to the global registry
 *
 * @returns the theme injector used to set the theme
 */
function registerThemeInjector(theme, themeRegistry) {
    var themeInjector = new Injector_1.Injector(theme);
    themeRegistry.defineInjector(exports.INJECTED_THEME_KEY, themeInjector);
    return themeInjector;
}
exports.registerThemeInjector = registerThemeInjector;
/**
 * Function that returns a class decorated with with Themed functionality
 */
function ThemedMixin(Base) {
    var Themed = /** @class */ (function (_super) {
        tslib_1.__extends(Themed, _super);
        function Themed() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * Registered base theme keys
             */
            _this._registeredBaseThemeKeys = [];
            /**
             * Indicates if classes meta data need to be calculated.
             */
            _this._recalculateClasses = true;
            /**
             * Loaded theme
             */
            _this._theme = {};
            return _this;
        }
        Themed.prototype.theme = function (classes) {
            var _this = this;
            if (this._recalculateClasses) {
                this._recalculateThemeClasses();
            }
            if (Array.isArray(classes)) {
                return classes.map(function (className) { return _this._getThemeClass(className); });
            }
            return this._getThemeClass(classes);
        };
        /**
         * Function fired when `theme` or `extraClasses` are changed.
         */
        Themed.prototype.onPropertiesChanged = function () {
            this._recalculateClasses = true;
        };
        Themed.prototype._getThemeClass = function (className) {
            if (className === undefined || className === null) {
                return className;
            }
            var extraClasses = this.properties.extraClasses || {};
            var themeClassName = this._baseThemeClassesReverseLookup[className];
            var resultClassNames = [];
            if (!themeClassName) {
                console.warn("Class name: '" + className + "' not found in theme");
                return null;
            }
            if (extraClasses[themeClassName]) {
                resultClassNames.push(extraClasses[themeClassName]);
            }
            if (this._theme[themeClassName]) {
                resultClassNames.push(this._theme[themeClassName]);
            }
            else {
                resultClassNames.push(this._registeredBaseTheme[themeClassName]);
            }
            return resultClassNames.join(' ');
        };
        Themed.prototype._recalculateThemeClasses = function () {
            var _this = this;
            var _a = this.properties.theme, theme = _a === void 0 ? {} : _a;
            var baseThemes = this.getDecorator('baseThemeClasses');
            if (!this._registeredBaseTheme) {
                this._registeredBaseTheme = baseThemes.reduce(function (finalBaseTheme, baseTheme) {
                    var _a = THEME_KEY, key = baseTheme[_a], classes = tslib_1.__rest(baseTheme, [typeof _a === "symbol" ? _a : _a + ""]);
                    _this._registeredBaseThemeKeys.push(key);
                    return tslib_1.__assign({}, finalBaseTheme, classes);
                }, {});
                this._baseThemeClassesReverseLookup = createThemeClassesLookup(baseThemes);
            }
            this._theme = this._registeredBaseThemeKeys.reduce(function (baseTheme, themeKey) {
                return tslib_1.__assign({}, baseTheme, theme[themeKey]);
            }, {});
            this._recalculateClasses = false;
        };
        tslib_1.__decorate([
            diffProperty_1.diffProperty('theme', diff_1.shallow),
            diffProperty_1.diffProperty('extraClasses', diff_1.shallow),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], Themed.prototype, "onPropertiesChanged", null);
        Themed = tslib_1.__decorate([
            inject_1.inject({
                name: exports.INJECTED_THEME_KEY,
                getProperties: function (theme, properties) {
                    if (!properties.theme) {
                        return { theme: theme };
                    }
                    return {};
                }
            })
        ], Themed);
        return Themed;
    }(Base));
    return Themed;
}
exports.ThemedMixin = ThemedMixin;
exports.default = ThemedMixin;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/registerCustomElement.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var WidgetBase_1 = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.js");
var Projector_1 = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Projector.js");
var array_1 = __webpack_require__("./node_modules/@dojo/shim/array.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var Registry_1 = __webpack_require__("./node_modules/@dojo/widget-core/Registry.js");
var Themed_1 = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Themed.js");
var alwaysRender_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/alwaysRender.js");
var CustomElementChildType;
(function (CustomElementChildType) {
    CustomElementChildType["DOJO"] = "DOJO";
    CustomElementChildType["NODE"] = "NODE";
    CustomElementChildType["TEXT"] = "TEXT";
})(CustomElementChildType = exports.CustomElementChildType || (exports.CustomElementChildType = {}));
function DomToWidgetWrapper(domNode) {
    var DomToWidgetWrapper = /** @class */ (function (_super) {
        tslib_1.__extends(DomToWidgetWrapper, _super);
        function DomToWidgetWrapper() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DomToWidgetWrapper.prototype.render = function () {
            var _this = this;
            var properties = Object.keys(this.properties).reduce(function (props, key) {
                var value = _this.properties[key];
                if (key.indexOf('on') === 0) {
                    key = "__" + key;
                }
                props[key] = value;
                return props;
            }, {});
            return d_1.dom({ node: domNode, props: properties, diffType: 'dom' });
        };
        Object.defineProperty(DomToWidgetWrapper, "domNode", {
            get: function () {
                return domNode;
            },
            enumerable: true,
            configurable: true
        });
        DomToWidgetWrapper = tslib_1.__decorate([
            alwaysRender_1.alwaysRender()
        ], DomToWidgetWrapper);
        return DomToWidgetWrapper;
    }(WidgetBase_1.WidgetBase));
    return DomToWidgetWrapper;
}
exports.DomToWidgetWrapper = DomToWidgetWrapper;
function create(descriptor, WidgetConstructor) {
    var attributes = descriptor.attributes, childType = descriptor.childType;
    var attributeMap = {};
    attributes.forEach(function (propertyName) {
        var attributeName = propertyName.toLowerCase();
        attributeMap[attributeName] = propertyName;
    });
    return /** @class */ (function (_super) {
        tslib_1.__extends(class_1, _super);
        function class_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._properties = {};
            _this._children = [];
            _this._eventProperties = {};
            _this._initialised = false;
            return _this;
        }
        class_1.prototype.connectedCallback = function () {
            var _this = this;
            if (this._initialised) {
                return;
            }
            var domProperties = {};
            var attributes = descriptor.attributes, properties = descriptor.properties, events = descriptor.events;
            this._properties = tslib_1.__assign({}, this._properties, this._attributesToProperties(attributes));
            tslib_1.__spread(attributes, properties).forEach(function (propertyName) {
                var value = _this[propertyName];
                var filteredPropertyName = propertyName.replace(/^on/, '__');
                if (value !== undefined) {
                    _this._properties[propertyName] = value;
                }
                domProperties[filteredPropertyName] = {
                    get: function () { return _this._getProperty(propertyName); },
                    set: function (value) { return _this._setProperty(propertyName, value); }
                };
            });
            events.forEach(function (propertyName) {
                var eventName = propertyName.replace(/^on/, '').toLowerCase();
                var filteredPropertyName = propertyName.replace(/^on/, '__on');
                domProperties[filteredPropertyName] = {
                    get: function () { return _this._getEventProperty(propertyName); },
                    set: function (value) { return _this._setEventProperty(propertyName, value); }
                };
                _this._eventProperties[propertyName] = undefined;
                _this._properties[propertyName] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var eventCallback = _this._getEventProperty(propertyName);
                    if (typeof eventCallback === 'function') {
                        eventCallback.apply(void 0, tslib_1.__spread(args));
                    }
                    _this.dispatchEvent(new CustomEvent(eventName, {
                        bubbles: false,
                        detail: args
                    }));
                };
            });
            Object.defineProperties(this, domProperties);
            var children = childType === CustomElementChildType.TEXT ? this.childNodes : this.children;
            array_1.from(children).forEach(function (childNode) {
                if (childType === CustomElementChildType.DOJO) {
                    childNode.addEventListener('dojo-ce-render', function () { return _this._render(); });
                    childNode.addEventListener('dojo-ce-connected', function () { return _this._render(); });
                    _this._children.push(DomToWidgetWrapper(childNode));
                }
                else {
                    _this._children.push(d_1.dom({ node: childNode, diffType: 'dom' }));
                }
            });
            this.addEventListener('dojo-ce-connected', function (e) { return _this._childConnected(e); });
            var widgetProperties = this._properties;
            var renderChildren = function () { return _this.__children__(); };
            var Wrapper = /** @class */ (function (_super) {
                tslib_1.__extends(class_2, _super);
                function class_2() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_2.prototype.render = function () {
                    return d_1.w(WidgetConstructor, widgetProperties, renderChildren());
                };
                return class_2;
            }(WidgetBase_1.WidgetBase));
            var registry = new Registry_1.default();
            var themeContext = Themed_1.registerThemeInjector(this._getTheme(), registry);
            global_1.default.addEventListener('dojo-theme-set', function () { return themeContext.set(_this._getTheme()); });
            var Projector = Projector_1.ProjectorMixin(Wrapper);
            this._projector = new Projector();
            this._projector.setProperties({ registry: registry });
            this._projector.append(this);
            this._initialised = true;
            this.dispatchEvent(new CustomEvent('dojo-ce-connected', {
                bubbles: true,
                detail: this
            }));
        };
        class_1.prototype._getTheme = function () {
            if (global_1.default && global_1.default.dojoce && global_1.default.dojoce.theme) {
                return global_1.default.dojoce.themes[global_1.default.dojoce.theme];
            }
        };
        class_1.prototype._childConnected = function (e) {
            var _this = this;
            var node = e.detail;
            if (node.parentNode === this) {
                var exists = this._children.some(function (child) { return child.domNode === node; });
                if (!exists) {
                    node.addEventListener('dojo-ce-render', function () { return _this._render(); });
                    this._children.push(DomToWidgetWrapper(node));
                    this._render();
                }
            }
        };
        class_1.prototype._render = function () {
            if (this._projector) {
                this._projector.invalidate();
                this.dispatchEvent(new CustomEvent('dojo-ce-render', {
                    bubbles: false,
                    detail: this
                }));
            }
        };
        class_1.prototype.__properties__ = function () {
            return tslib_1.__assign({}, this._properties, this._eventProperties);
        };
        class_1.prototype.__children__ = function () {
            if (childType === CustomElementChildType.DOJO) {
                return this._children.filter(function (Child) { return Child.domNode.isWidget; }).map(function (Child) {
                    var domNode = Child.domNode;
                    return d_1.w(Child, tslib_1.__assign({}, domNode.__properties__()), tslib_1.__spread(domNode.__children__()));
                });
            }
            else {
                return this._children;
            }
        };
        class_1.prototype.attributeChangedCallback = function (name, oldValue, value) {
            var propertyName = attributeMap[name];
            this._setProperty(propertyName, value);
        };
        class_1.prototype._setEventProperty = function (propertyName, value) {
            this._eventProperties[propertyName] = value;
        };
        class_1.prototype._getEventProperty = function (propertyName) {
            return this._eventProperties[propertyName];
        };
        class_1.prototype._setProperty = function (propertyName, value) {
            this._properties[propertyName] = value;
            this._render();
        };
        class_1.prototype._getProperty = function (propertyName) {
            return this._properties[propertyName];
        };
        class_1.prototype._attributesToProperties = function (attributes) {
            var _this = this;
            return attributes.reduce(function (properties, propertyName) {
                var attributeName = propertyName.toLowerCase();
                var value = _this.getAttribute(attributeName);
                if (value !== null) {
                    properties[propertyName] = value;
                }
                return properties;
            }, {});
        };
        Object.defineProperty(class_1, "observedAttributes", {
            get: function () {
                return Object.keys(attributeMap);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(class_1.prototype, "isWidget", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        return class_1;
    }(HTMLElement));
}
exports.create = create;
function register(WidgetConstructor) {
    var descriptor = WidgetConstructor.prototype && WidgetConstructor.prototype.__customElementDescriptor;
    if (!descriptor) {
        throw new Error('Cannot get descriptor for Custom Element, have you added the @customElement decorator to your Widget?');
    }
    global_1.default.customElements.define(descriptor.tagName, create(descriptor, WidgetConstructor));
}
exports.register = register;
exports.default = register;

/***/ }),

/***/ "./node_modules/@dojo/widget-core/vdom.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var global_1 = __webpack_require__("./node_modules/@dojo/shim/global.js");
var array_1 = __webpack_require__("./node_modules/@dojo/shim/array.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var Registry_1 = __webpack_require__("./node_modules/@dojo/widget-core/Registry.js");
var WeakMap_1 = __webpack_require__("./node_modules/@dojo/shim/WeakMap.js");
var NAMESPACE_W3 = 'http://www.w3.org/';
var NAMESPACE_SVG = NAMESPACE_W3 + '2000/svg';
var NAMESPACE_XLINK = NAMESPACE_W3 + '1999/xlink';
var emptyArray = [];
exports.widgetInstanceMap = new WeakMap_1.default();
var instanceMap = new WeakMap_1.default();
var projectorStateMap = new WeakMap_1.default();
function same(dnode1, dnode2) {
    if (d_1.isVNode(dnode1) && d_1.isVNode(dnode2)) {
        if (dnode1.tag !== dnode2.tag) {
            return false;
        }
        if (dnode1.properties.key !== dnode2.properties.key) {
            return false;
        }
        return true;
    }
    else if (d_1.isWNode(dnode1) && d_1.isWNode(dnode2)) {
        if (dnode1.instance === undefined && typeof dnode2.widgetConstructor === 'string') {
            return false;
        }
        if (dnode1.widgetConstructor !== dnode2.widgetConstructor) {
            return false;
        }
        if (dnode1.properties.key !== dnode2.properties.key) {
            return false;
        }
        return true;
    }
    return false;
}
var missingTransition = function () {
    throw new Error('Provide a transitions object to the projectionOptions to do animations');
};
function getProjectionOptions(projectorOptions, projectorInstance) {
    var defaults = {
        namespace: undefined,
        styleApplyer: function (domNode, styleName, value) {
            domNode.style[styleName] = value;
        },
        transitions: {
            enter: missingTransition,
            exit: missingTransition
        },
        depth: 0,
        merge: false,
        sync: false,
        projectorInstance: projectorInstance
    };
    return tslib_1.__assign({}, defaults, projectorOptions);
}
function checkStyleValue(styleValue) {
    if (typeof styleValue !== 'string') {
        throw new Error('Style values must be strings');
    }
}
function updateEvent(domNode, eventName, currentValue, projectionOptions, bind, previousValue) {
    var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    var eventMap = projectorState.nodeMap.get(domNode) || new WeakMap_1.default();
    if (previousValue) {
        var previousEvent = eventMap.get(previousValue);
        domNode.removeEventListener(eventName, previousEvent);
    }
    var callback = currentValue.bind(bind);
    if (eventName === 'input') {
        callback = function (evt) {
            currentValue.call(this, evt);
            evt.target['oninput-value'] = evt.target.value;
        }.bind(bind);
    }
    domNode.addEventListener(eventName, callback);
    eventMap.set(currentValue, callback);
    projectorState.nodeMap.set(domNode, eventMap);
}
function addClasses(domNode, classes) {
    if (classes) {
        var classNames = classes.split(' ');
        for (var i = 0; i < classNames.length; i++) {
            domNode.classList.add(classNames[i]);
        }
    }
}
function removeClasses(domNode, classes) {
    if (classes) {
        var classNames = classes.split(' ');
        for (var i = 0; i < classNames.length; i++) {
            domNode.classList.remove(classNames[i]);
        }
    }
}
function buildPreviousProperties(domNode, previous, current) {
    var diffType = current.diffType, properties = current.properties, attributes = current.attributes;
    if (!diffType || diffType === 'vdom') {
        return { properties: previous.properties, attributes: previous.attributes, events: previous.events };
    }
    else if (diffType === 'none') {
        return { properties: {}, attributes: previous.attributes ? {} : undefined, events: previous.events };
    }
    var newProperties = {
        properties: {}
    };
    if (attributes) {
        newProperties.attributes = {};
        newProperties.events = previous.events;
        Object.keys(properties).forEach(function (propName) {
            newProperties.properties[propName] = domNode[propName];
        });
        Object.keys(attributes).forEach(function (attrName) {
            newProperties.attributes[attrName] = domNode.getAttribute(attrName);
        });
        return newProperties;
    }
    newProperties.properties = Object.keys(properties).reduce(function (props, property) {
        props[property] = domNode.getAttribute(property) || domNode[property];
        return props;
    }, {});
    return newProperties;
}
function focusNode(propValue, previousValue, domNode, projectionOptions) {
    var result;
    if (typeof propValue === 'function') {
        result = propValue();
    }
    else {
        result = propValue && !previousValue;
    }
    if (result === true) {
        var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
        projectorState.deferredRenderCallbacks.push(function () {
            domNode.focus();
        });
    }
}
function removeOrphanedEvents(domNode, previousProperties, properties, projectionOptions, onlyEvents) {
    if (onlyEvents === void 0) { onlyEvents = false; }
    var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    var eventMap = projectorState.nodeMap.get(domNode);
    if (eventMap) {
        Object.keys(previousProperties).forEach(function (propName) {
            var isEvent = propName.substr(0, 2) === 'on' || onlyEvents;
            var eventName = onlyEvents ? propName : propName.substr(2);
            if (isEvent && !properties[propName]) {
                var eventCallback = eventMap.get(previousProperties[propName]);
                if (eventCallback) {
                    domNode.removeEventListener(eventName, eventCallback);
                }
            }
        });
    }
}
function updateAttribute(domNode, attrName, attrValue, projectionOptions) {
    if (projectionOptions.namespace === NAMESPACE_SVG && attrName === 'href') {
        domNode.setAttributeNS(NAMESPACE_XLINK, attrName, attrValue);
    }
    else if ((attrName === 'role' && attrValue === '') || attrValue === undefined) {
        domNode.removeAttribute(attrName);
    }
    else {
        domNode.setAttribute(attrName, attrValue);
    }
}
function updateAttributes(domNode, previousAttributes, attributes, projectionOptions) {
    var attrNames = Object.keys(attributes);
    var attrCount = attrNames.length;
    for (var i = 0; i < attrCount; i++) {
        var attrName = attrNames[i];
        var attrValue = attributes[attrName];
        var previousAttrValue = previousAttributes[attrName];
        if (attrValue !== previousAttrValue) {
            updateAttribute(domNode, attrName, attrValue, projectionOptions);
        }
    }
}
function updateProperties(domNode, previousProperties, properties, projectionOptions, includesEventsAndAttributes) {
    if (includesEventsAndAttributes === void 0) { includesEventsAndAttributes = true; }
    var propertiesUpdated = false;
    var propNames = Object.keys(properties);
    var propCount = propNames.length;
    if (propNames.indexOf('classes') === -1 && previousProperties.classes) {
        if (Array.isArray(previousProperties.classes)) {
            for (var i = 0; i < previousProperties.classes.length; i++) {
                removeClasses(domNode, previousProperties.classes[i]);
            }
        }
        else {
            removeClasses(domNode, previousProperties.classes);
        }
    }
    includesEventsAndAttributes && removeOrphanedEvents(domNode, previousProperties, properties, projectionOptions);
    for (var i = 0; i < propCount; i++) {
        var propName = propNames[i];
        var propValue = properties[propName];
        var previousValue = previousProperties[propName];
        if (propName === 'classes') {
            var previousClasses = Array.isArray(previousValue) ? previousValue : [previousValue];
            var currentClasses = Array.isArray(propValue) ? propValue : [propValue];
            if (previousClasses && previousClasses.length > 0) {
                if (!propValue || propValue.length === 0) {
                    for (var i_1 = 0; i_1 < previousClasses.length; i_1++) {
                        removeClasses(domNode, previousClasses[i_1]);
                    }
                }
                else {
                    var newClasses = tslib_1.__spread(currentClasses);
                    for (var i_2 = 0; i_2 < previousClasses.length; i_2++) {
                        var previousClassName = previousClasses[i_2];
                        if (previousClassName) {
                            var classIndex = newClasses.indexOf(previousClassName);
                            if (classIndex === -1) {
                                removeClasses(domNode, previousClassName);
                            }
                            else {
                                newClasses.splice(classIndex, 1);
                            }
                        }
                    }
                    for (var i_3 = 0; i_3 < newClasses.length; i_3++) {
                        addClasses(domNode, newClasses[i_3]);
                    }
                }
            }
            else {
                for (var i_4 = 0; i_4 < currentClasses.length; i_4++) {
                    addClasses(domNode, currentClasses[i_4]);
                }
            }
        }
        else if (propName === 'focus') {
            focusNode(propValue, previousValue, domNode, projectionOptions);
        }
        else if (propName === 'styles') {
            var styleNames = Object.keys(propValue);
            var styleCount = styleNames.length;
            for (var j = 0; j < styleCount; j++) {
                var styleName = styleNames[j];
                var newStyleValue = propValue[styleName];
                var oldStyleValue = previousValue && previousValue[styleName];
                if (newStyleValue === oldStyleValue) {
                    continue;
                }
                propertiesUpdated = true;
                if (newStyleValue) {
                    checkStyleValue(newStyleValue);
                    projectionOptions.styleApplyer(domNode, styleName, newStyleValue);
                }
                else {
                    projectionOptions.styleApplyer(domNode, styleName, '');
                }
            }
        }
        else {
            if (!propValue && typeof previousValue === 'string') {
                propValue = '';
            }
            if (propName === 'value') {
                var domValue = domNode[propName];
                if (domValue !== propValue &&
                    (domNode['oninput-value']
                        ? domValue === domNode['oninput-value']
                        : propValue !== previousValue)) {
                    domNode[propName] = propValue;
                    domNode['oninput-value'] = undefined;
                }
                if (propValue !== previousValue) {
                    propertiesUpdated = true;
                }
            }
            else if (propName !== 'key' && propValue !== previousValue) {
                var type = typeof propValue;
                if (type === 'function' && propName.lastIndexOf('on', 0) === 0 && includesEventsAndAttributes) {
                    updateEvent(domNode, propName.substr(2), propValue, projectionOptions, properties.bind, previousValue);
                }
                else if (type === 'string' && propName !== 'innerHTML' && includesEventsAndAttributes) {
                    updateAttribute(domNode, propName, propValue, projectionOptions);
                }
                else if (propName === 'scrollLeft' || propName === 'scrollTop') {
                    if (domNode[propName] !== propValue) {
                        domNode[propName] = propValue;
                    }
                }
                else {
                    domNode[propName] = propValue;
                }
                propertiesUpdated = true;
            }
        }
    }
    return propertiesUpdated;
}
function findIndexOfChild(children, sameAs, start) {
    for (var i = start; i < children.length; i++) {
        if (same(children[i], sameAs)) {
            return i;
        }
    }
    return -1;
}
function toParentVNode(domNode) {
    return {
        tag: '',
        properties: {},
        children: undefined,
        domNode: domNode,
        type: d_1.VNODE
    };
}
exports.toParentVNode = toParentVNode;
function toTextVNode(data) {
    return {
        tag: '',
        properties: {},
        children: undefined,
        text: "" + data,
        domNode: undefined,
        type: d_1.VNODE
    };
}
exports.toTextVNode = toTextVNode;
function toInternalWNode(instance, instanceData) {
    return {
        instance: instance,
        rendered: [],
        coreProperties: instanceData.coreProperties,
        children: instance.children,
        widgetConstructor: instance.constructor,
        properties: instanceData.inputProperties,
        type: d_1.WNODE
    };
}
function filterAndDecorateChildren(children, instance) {
    if (children === undefined) {
        return emptyArray;
    }
    children = Array.isArray(children) ? children : [children];
    for (var i = 0; i < children.length;) {
        var child = children[i];
        if (child === undefined || child === null) {
            children.splice(i, 1);
            continue;
        }
        else if (typeof child === 'string') {
            children[i] = toTextVNode(child);
        }
        else {
            if (d_1.isVNode(child)) {
                if (child.properties.bind === undefined) {
                    child.properties.bind = instance;
                    if (child.children && child.children.length > 0) {
                        filterAndDecorateChildren(child.children, instance);
                    }
                }
            }
            else {
                if (!child.coreProperties) {
                    var instanceData = exports.widgetInstanceMap.get(instance);
                    child.coreProperties = {
                        bind: instance,
                        baseRegistry: instanceData.coreProperties.baseRegistry
                    };
                }
                if (child.children && child.children.length > 0) {
                    filterAndDecorateChildren(child.children, instance);
                }
            }
        }
        i++;
    }
    return children;
}
exports.filterAndDecorateChildren = filterAndDecorateChildren;
function nodeAdded(dnode, transitions) {
    if (d_1.isVNode(dnode) && dnode.properties) {
        var enterAnimation = dnode.properties.enterAnimation;
        if (enterAnimation) {
            if (typeof enterAnimation === 'function') {
                enterAnimation(dnode.domNode, dnode.properties);
            }
            else {
                transitions.enter(dnode.domNode, dnode.properties, enterAnimation);
            }
        }
    }
}
function callOnDetach(dNodes, parentInstance) {
    dNodes = Array.isArray(dNodes) ? dNodes : [dNodes];
    for (var i = 0; i < dNodes.length; i++) {
        var dNode = dNodes[i];
        if (d_1.isWNode(dNode)) {
            if (dNode.rendered) {
                callOnDetach(dNode.rendered, dNode.instance);
            }
            if (dNode.instance) {
                var instanceData = exports.widgetInstanceMap.get(dNode.instance);
                instanceData.onDetach();
            }
        }
        else {
            if (dNode.children) {
                callOnDetach(dNode.children, parentInstance);
            }
        }
    }
}
function nodeToRemove(dnode, transitions, projectionOptions) {
    if (d_1.isWNode(dnode)) {
        var rendered = dnode.rendered || emptyArray;
        for (var i = 0; i < rendered.length; i++) {
            var child = rendered[i];
            if (d_1.isVNode(child)) {
                child.domNode.parentNode.removeChild(child.domNode);
            }
            else {
                nodeToRemove(child, transitions, projectionOptions);
            }
        }
    }
    else {
        var domNode_1 = dnode.domNode;
        var properties = dnode.properties;
        var exitAnimation = properties.exitAnimation;
        if (properties && exitAnimation) {
            domNode_1.style.pointerEvents = 'none';
            var removeDomNode = function () {
                domNode_1 && domNode_1.parentNode && domNode_1.parentNode.removeChild(domNode_1);
            };
            if (typeof exitAnimation === 'function') {
                exitAnimation(domNode_1, removeDomNode, properties);
                return;
            }
            else {
                transitions.exit(dnode.domNode, properties, exitAnimation, removeDomNode);
                return;
            }
        }
        domNode_1 && domNode_1.parentNode && domNode_1.parentNode.removeChild(domNode_1);
    }
}
function checkDistinguishable(childNodes, indexToCheck, parentInstance) {
    var childNode = childNodes[indexToCheck];
    if (d_1.isVNode(childNode) && !childNode.tag) {
        return; // Text nodes need not be distinguishable
    }
    var key = childNode.properties.key;
    if (key === undefined || key === null) {
        for (var i = 0; i < childNodes.length; i++) {
            if (i !== indexToCheck) {
                var node = childNodes[i];
                if (same(node, childNode)) {
                    var nodeIdentifier = void 0;
                    var parentName = parentInstance.constructor.name || 'unknown';
                    if (d_1.isWNode(childNode)) {
                        nodeIdentifier = childNode.widgetConstructor.name || 'unknown';
                    }
                    else {
                        nodeIdentifier = childNode.tag;
                    }
                    console.warn("A widget (" + parentName + ") has had a child addded or removed, but they were not able to uniquely identified. It is recommended to provide a unique 'key' property when using the same widget or element (" + nodeIdentifier + ") multiple times as siblings");
                    break;
                }
            }
        }
    }
}
function updateChildren(parentVNode, oldChildren, newChildren, parentInstance, projectionOptions) {
    oldChildren = oldChildren || emptyArray;
    newChildren = newChildren;
    var oldChildrenLength = oldChildren.length;
    var newChildrenLength = newChildren.length;
    var transitions = projectionOptions.transitions;
    var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    projectionOptions = tslib_1.__assign({}, projectionOptions, { depth: projectionOptions.depth + 1 });
    var oldIndex = 0;
    var newIndex = 0;
    var i;
    var textUpdated = false;
    var _loop_1 = function () {
        var oldChild = oldIndex < oldChildrenLength ? oldChildren[oldIndex] : undefined;
        var newChild = newChildren[newIndex];
        if (d_1.isVNode(newChild) && typeof newChild.deferredPropertiesCallback === 'function') {
            newChild.inserted = d_1.isVNode(oldChild) && oldChild.inserted;
            addDeferredProperties(newChild, projectionOptions);
        }
        if (oldChild !== undefined && same(oldChild, newChild)) {
            textUpdated = updateDom(oldChild, newChild, projectionOptions, parentVNode, parentInstance) || textUpdated;
            oldIndex++;
            newIndex++;
            return "continue";
        }
        var findOldIndex = findIndexOfChild(oldChildren, newChild, oldIndex + 1);
        var addChild = function () {
            var insertBefore = undefined;
            var child = oldChildren[oldIndex];
            if (child) {
                var nextIndex = oldIndex + 1;
                while (insertBefore === undefined) {
                    if (d_1.isWNode(child)) {
                        if (child.rendered) {
                            child = child.rendered[0];
                        }
                        else if (oldChildren[nextIndex]) {
                            child = oldChildren[nextIndex];
                            nextIndex++;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        insertBefore = child.domNode;
                    }
                }
            }
            createDom(newChild, parentVNode, insertBefore, projectionOptions, parentInstance);
            nodeAdded(newChild, transitions);
            var indexToCheck = newIndex;
            projectorState.afterRenderCallbacks.push(function () {
                checkDistinguishable(newChildren, indexToCheck, parentInstance);
            });
        };
        if (!oldChild || findOldIndex === -1) {
            addChild();
            newIndex++;
            return "continue";
        }
        var removeChild = function () {
            var indexToCheck = oldIndex;
            projectorState.afterRenderCallbacks.push(function () {
                callOnDetach(oldChild, parentInstance);
                checkDistinguishable(oldChildren, indexToCheck, parentInstance);
            });
            nodeToRemove(oldChild, transitions, projectionOptions);
        };
        var findNewIndex = findIndexOfChild(newChildren, oldChild, newIndex + 1);
        if (findNewIndex === -1) {
            removeChild();
            oldIndex++;
            return "continue";
        }
        addChild();
        removeChild();
        oldIndex++;
        newIndex++;
    };
    while (newIndex < newChildrenLength) {
        _loop_1();
    }
    if (oldChildrenLength > oldIndex) {
        var _loop_2 = function () {
            var oldChild = oldChildren[i];
            var indexToCheck = i;
            projectorState.afterRenderCallbacks.push(function () {
                callOnDetach(oldChild, parentInstance);
                checkDistinguishable(oldChildren, indexToCheck, parentInstance);
            });
            nodeToRemove(oldChildren[i], transitions, projectionOptions);
        };
        // Remove child fragments
        for (i = oldIndex; i < oldChildrenLength; i++) {
            _loop_2();
        }
    }
    return textUpdated;
}
function addChildren(parentVNode, children, projectionOptions, parentInstance, insertBefore, childNodes) {
    if (insertBefore === void 0) { insertBefore = undefined; }
    if (children === undefined) {
        return;
    }
    var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    if (projectorState.merge && childNodes === undefined) {
        childNodes = array_1.from(parentVNode.domNode.childNodes);
    }
    projectionOptions = tslib_1.__assign({}, projectionOptions, { depth: projectionOptions.depth + 1 });
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (d_1.isVNode(child)) {
            if (projectorState.merge && childNodes) {
                var domElement = undefined;
                while (child.domNode === undefined && childNodes.length > 0) {
                    domElement = childNodes.shift();
                    if (domElement && domElement.tagName === (child.tag.toUpperCase() || undefined)) {
                        child.domNode = domElement;
                    }
                }
            }
            createDom(child, parentVNode, insertBefore, projectionOptions, parentInstance);
        }
        else {
            createDom(child, parentVNode, insertBefore, projectionOptions, parentInstance, childNodes);
        }
    }
}
function initPropertiesAndChildren(domNode, dnode, parentInstance, projectionOptions) {
    addChildren(dnode, dnode.children, projectionOptions, parentInstance, undefined);
    if (typeof dnode.deferredPropertiesCallback === 'function' && dnode.inserted === undefined) {
        addDeferredProperties(dnode, projectionOptions);
    }
    if (dnode.attributes && dnode.events) {
        updateAttributes(domNode, {}, dnode.attributes, projectionOptions);
        updateProperties(domNode, {}, dnode.properties, projectionOptions, false);
        removeOrphanedEvents(domNode, {}, dnode.events, projectionOptions, true);
        var events_1 = dnode.events;
        Object.keys(events_1).forEach(function (event) {
            updateEvent(domNode, event, events_1[event], projectionOptions, dnode.properties.bind);
        });
    }
    else {
        updateProperties(domNode, {}, dnode.properties, projectionOptions);
    }
    if (dnode.properties.key !== null && dnode.properties.key !== undefined) {
        var instanceData = exports.widgetInstanceMap.get(parentInstance);
        instanceData.nodeHandler.add(domNode, "" + dnode.properties.key);
    }
    dnode.inserted = true;
}
function createDom(dnode, parentVNode, insertBefore, projectionOptions, parentInstance, childNodes) {
    var domNode;
    var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    if (d_1.isWNode(dnode)) {
        var widgetConstructor = dnode.widgetConstructor;
        var parentInstanceData = exports.widgetInstanceMap.get(parentInstance);
        if (!Registry_1.isWidgetBaseConstructor(widgetConstructor)) {
            var item = parentInstanceData.registry().get(widgetConstructor);
            if (item === null) {
                return;
            }
            widgetConstructor = item;
        }
        var instance_1 = new widgetConstructor();
        dnode.instance = instance_1;
        var instanceData_1 = exports.widgetInstanceMap.get(instance_1);
        instanceData_1.invalidate = function () {
            instanceData_1.dirty = true;
            if (instanceData_1.rendering === false) {
                projectorState.renderQueue.push({ instance: instance_1, depth: projectionOptions.depth });
                scheduleRender(projectionOptions);
            }
        };
        instanceData_1.rendering = true;
        instance_1.__setCoreProperties__(dnode.coreProperties);
        instance_1.__setChildren__(dnode.children);
        instance_1.__setProperties__(dnode.properties);
        var rendered = instance_1.__render__();
        instanceData_1.rendering = false;
        if (rendered) {
            var filteredRendered = filterAndDecorateChildren(rendered, instance_1);
            dnode.rendered = filteredRendered;
            addChildren(parentVNode, filteredRendered, projectionOptions, instance_1, insertBefore, childNodes);
        }
        instanceMap.set(instance_1, { dnode: dnode, parentVNode: parentVNode });
        instanceData_1.nodeHandler.addRoot();
        projectorState.afterRenderCallbacks.push(function () {
            instanceData_1.onAttach();
        });
    }
    else {
        if (projectorState.merge && projectorState.mergeElement !== undefined) {
            domNode = dnode.domNode = projectionOptions.mergeElement;
            projectorState.mergeElement = undefined;
            initPropertiesAndChildren(domNode, dnode, parentInstance, projectionOptions);
            return;
        }
        var doc = parentVNode.domNode.ownerDocument;
        if (!dnode.tag && typeof dnode.text === 'string') {
            if (dnode.domNode !== undefined && parentVNode.domNode) {
                var newDomNode = dnode.domNode.ownerDocument.createTextNode(dnode.text);
                if (parentVNode.domNode === dnode.domNode.parentNode) {
                    parentVNode.domNode.replaceChild(newDomNode, dnode.domNode);
                }
                else {
                    parentVNode.domNode.appendChild(newDomNode);
                    dnode.domNode.parentNode && dnode.domNode.parentNode.removeChild(dnode.domNode);
                }
                dnode.domNode = newDomNode;
            }
            else {
                domNode = dnode.domNode = doc.createTextNode(dnode.text);
                if (insertBefore !== undefined) {
                    parentVNode.domNode.insertBefore(domNode, insertBefore);
                }
                else {
                    parentVNode.domNode.appendChild(domNode);
                }
            }
        }
        else {
            if (dnode.domNode === undefined) {
                if (dnode.tag === 'svg') {
                    projectionOptions = tslib_1.__assign({}, projectionOptions, { namespace: NAMESPACE_SVG });
                }
                if (projectionOptions.namespace !== undefined) {
                    domNode = dnode.domNode = doc.createElementNS(projectionOptions.namespace, dnode.tag);
                }
                else {
                    domNode = dnode.domNode = dnode.domNode || doc.createElement(dnode.tag);
                }
            }
            else {
                domNode = dnode.domNode;
            }
            initPropertiesAndChildren(domNode, dnode, parentInstance, projectionOptions);
            if (insertBefore !== undefined) {
                parentVNode.domNode.insertBefore(domNode, insertBefore);
            }
            else if (domNode.parentNode !== parentVNode.domNode) {
                parentVNode.domNode.appendChild(domNode);
            }
        }
    }
}
function updateDom(previous, dnode, projectionOptions, parentVNode, parentInstance) {
    if (d_1.isWNode(dnode)) {
        var instance = previous.instance;
        var _a = instanceMap.get(instance), parentVNode_1 = _a.parentVNode, node = _a.dnode;
        var previousRendered = node ? node.rendered : previous.rendered;
        var instanceData = exports.widgetInstanceMap.get(instance);
        instanceData.rendering = true;
        instance.__setCoreProperties__(dnode.coreProperties);
        instance.__setChildren__(dnode.children);
        instance.__setProperties__(dnode.properties);
        dnode.instance = instance;
        instanceMap.set(instance, { dnode: dnode, parentVNode: parentVNode_1 });
        if (instanceData.dirty === true) {
            var rendered = instance.__render__();
            instanceData.rendering = false;
            dnode.rendered = filterAndDecorateChildren(rendered, instance);
            updateChildren(parentVNode_1, previousRendered, dnode.rendered, instance, projectionOptions);
        }
        else {
            instanceData.rendering = false;
            dnode.rendered = previousRendered;
        }
        instanceData.nodeHandler.addRoot();
    }
    else {
        if (previous === dnode) {
            return false;
        }
        var domNode_2 = (dnode.domNode = previous.domNode);
        var textUpdated = false;
        var updated = false;
        if (!dnode.tag && typeof dnode.text === 'string') {
            if (dnode.text !== previous.text) {
                var newDomNode = domNode_2.ownerDocument.createTextNode(dnode.text);
                domNode_2.parentNode.replaceChild(newDomNode, domNode_2);
                dnode.domNode = newDomNode;
                textUpdated = true;
                return textUpdated;
            }
        }
        else {
            if (dnode.tag && dnode.tag.lastIndexOf('svg', 0) === 0) {
                projectionOptions = tslib_1.__assign({}, projectionOptions, { namespace: NAMESPACE_SVG });
            }
            if (previous.children !== dnode.children) {
                var children = filterAndDecorateChildren(dnode.children, parentInstance);
                dnode.children = children;
                updated =
                    updateChildren(dnode, previous.children, children, parentInstance, projectionOptions) || updated;
            }
            var previousProperties_1 = buildPreviousProperties(domNode_2, previous, dnode);
            if (dnode.attributes && dnode.events) {
                updateAttributes(domNode_2, previousProperties_1.attributes, dnode.attributes, projectionOptions);
                updated =
                    updateProperties(domNode_2, previousProperties_1.properties, dnode.properties, projectionOptions, false) || updated;
                removeOrphanedEvents(domNode_2, previousProperties_1.events, dnode.events, projectionOptions, true);
                var events_2 = dnode.events;
                Object.keys(events_2).forEach(function (event) {
                    updateEvent(domNode_2, event, events_2[event], projectionOptions, dnode.properties.bind, previousProperties_1.events[event]);
                });
            }
            else {
                updated =
                    updateProperties(domNode_2, previousProperties_1.properties, dnode.properties, projectionOptions) ||
                        updated;
            }
            if (dnode.properties.key !== null && dnode.properties.key !== undefined) {
                var instanceData = exports.widgetInstanceMap.get(parentInstance);
                instanceData.nodeHandler.add(domNode_2, "" + dnode.properties.key);
            }
        }
        if (updated && dnode.properties && dnode.properties.updateAnimation) {
            dnode.properties.updateAnimation(domNode_2, dnode.properties, previous.properties);
        }
    }
}
function addDeferredProperties(vnode, projectionOptions) {
    // transfer any properties that have been passed - as these must be decorated properties
    vnode.decoratedDeferredProperties = vnode.properties;
    var properties = vnode.deferredPropertiesCallback(!!vnode.inserted);
    var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    vnode.properties = tslib_1.__assign({}, properties, vnode.decoratedDeferredProperties);
    projectorState.deferredRenderCallbacks.push(function () {
        var properties = tslib_1.__assign({}, vnode.deferredPropertiesCallback(!!vnode.inserted), vnode.decoratedDeferredProperties);
        updateProperties(vnode.domNode, vnode.properties, properties, projectionOptions);
        vnode.properties = properties;
    });
}
function runDeferredRenderCallbacks(projectionOptions) {
    var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    if (projectorState.deferredRenderCallbacks.length) {
        if (projectionOptions.sync) {
            while (projectorState.deferredRenderCallbacks.length) {
                var callback = projectorState.deferredRenderCallbacks.shift();
                callback && callback();
            }
        }
        else {
            global_1.default.requestAnimationFrame(function () {
                while (projectorState.deferredRenderCallbacks.length) {
                    var callback = projectorState.deferredRenderCallbacks.shift();
                    callback && callback();
                }
            });
        }
    }
}
function runAfterRenderCallbacks(projectionOptions) {
    var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    if (projectionOptions.sync) {
        while (projectorState.afterRenderCallbacks.length) {
            var callback = projectorState.afterRenderCallbacks.shift();
            callback && callback();
        }
    }
    else {
        if (global_1.default.requestIdleCallback) {
            global_1.default.requestIdleCallback(function () {
                while (projectorState.afterRenderCallbacks.length) {
                    var callback = projectorState.afterRenderCallbacks.shift();
                    callback && callback();
                }
            });
        }
        else {
            setTimeout(function () {
                while (projectorState.afterRenderCallbacks.length) {
                    var callback = projectorState.afterRenderCallbacks.shift();
                    callback && callback();
                }
            });
        }
    }
}
function scheduleRender(projectionOptions) {
    var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    if (projectionOptions.sync) {
        render(projectionOptions);
    }
    else if (projectorState.renderScheduled === undefined) {
        projectorState.renderScheduled = global_1.default.requestAnimationFrame(function () {
            render(projectionOptions);
        });
    }
}
function render(projectionOptions) {
    var projectorState = projectorStateMap.get(projectionOptions.projectorInstance);
    projectorState.renderScheduled = undefined;
    var renderQueue = projectorState.renderQueue;
    var renders = tslib_1.__spread(renderQueue);
    projectorState.renderQueue = [];
    renders.sort(function (a, b) { return a.depth - b.depth; });
    while (renders.length) {
        var instance = renders.shift().instance;
        var _a = instanceMap.get(instance), parentVNode = _a.parentVNode, dnode = _a.dnode;
        var instanceData = exports.widgetInstanceMap.get(instance);
        updateDom(dnode, toInternalWNode(instance, instanceData), projectionOptions, parentVNode, instance);
    }
    runAfterRenderCallbacks(projectionOptions);
    runDeferredRenderCallbacks(projectionOptions);
}
exports.dom = {
    append: function (parentNode, instance, projectionOptions) {
        if (projectionOptions === void 0) { projectionOptions = {}; }
        var instanceData = exports.widgetInstanceMap.get(instance);
        var finalProjectorOptions = getProjectionOptions(projectionOptions, instance);
        var projectorState = {
            afterRenderCallbacks: [],
            deferredRenderCallbacks: [],
            nodeMap: new WeakMap_1.default(),
            renderScheduled: undefined,
            renderQueue: [],
            merge: projectionOptions.merge || false,
            mergeElement: projectionOptions.mergeElement
        };
        projectorStateMap.set(instance, projectorState);
        finalProjectorOptions.rootNode = parentNode;
        var parentVNode = toParentVNode(finalProjectorOptions.rootNode);
        var node = toInternalWNode(instance, instanceData);
        instanceMap.set(instance, { dnode: node, parentVNode: parentVNode });
        instanceData.invalidate = function () {
            instanceData.dirty = true;
            if (instanceData.rendering === false) {
                projectorState.renderQueue.push({ instance: instance, depth: finalProjectorOptions.depth });
                scheduleRender(finalProjectorOptions);
            }
        };
        updateDom(node, node, finalProjectorOptions, parentVNode, instance);
        projectorState.afterRenderCallbacks.push(function () {
            instanceData.onAttach();
        });
        runDeferredRenderCallbacks(finalProjectorOptions);
        runAfterRenderCallbacks(finalProjectorOptions);
        return {
            domNode: finalProjectorOptions.rootNode
        };
    },
    create: function (instance, projectionOptions) {
        return this.append(document.createElement('div'), instance, projectionOptions);
    },
    merge: function (element, instance, projectionOptions) {
        if (projectionOptions === void 0) { projectionOptions = {}; }
        projectionOptions.merge = true;
        projectionOptions.mergeElement = element;
        var projection = this.append(element.parentNode, instance, projectionOptions);
        var projectorState = projectorStateMap.get(instance);
        projectorState.merge = false;
        return projection;
    }
};

/***/ }),

/***/ "./node_modules/@dojo/widgets/button/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var WidgetBase_1 = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.js");
var Themed_1 = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Themed.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var css = __webpack_require__("./node_modules/@dojo/widgets/theme/button.m.css.js");
var util_1 = __webpack_require__("./node_modules/@dojo/widgets/common/util.js");
var customElement_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/customElement.js");
var index_1 = __webpack_require__("./node_modules/@dojo/widgets/icon/index.js");
var registerCustomElement_1 = __webpack_require__("./node_modules/@dojo/widget-core/registerCustomElement.js");
exports.ThemedBase = Themed_1.ThemedMixin(WidgetBase_1.WidgetBase);
var ButtonBase = /** @class */ (function (_super) {
    tslib_1.__extends(ButtonBase, _super);
    function ButtonBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ButtonBase.prototype._onBlur = function (event) {
        this.properties.onBlur && this.properties.onBlur();
    };
    ButtonBase.prototype._onClick = function (event) {
        event.stopPropagation();
        this.properties.onClick && this.properties.onClick();
    };
    ButtonBase.prototype._onFocus = function (event) {
        this.properties.onFocus && this.properties.onFocus();
    };
    ButtonBase.prototype._onKeyDown = function (event) {
        event.stopPropagation();
        this.properties.onKeyDown && this.properties.onKeyDown(event.which, function () { event.preventDefault(); });
    };
    ButtonBase.prototype._onKeyPress = function (event) {
        event.stopPropagation();
        this.properties.onKeyPress && this.properties.onKeyPress(event.which, function () { event.preventDefault(); });
    };
    ButtonBase.prototype._onKeyUp = function (event) {
        event.stopPropagation();
        this.properties.onKeyUp && this.properties.onKeyUp(event.which, function () { event.preventDefault(); });
    };
    ButtonBase.prototype._onMouseDown = function (event) {
        event.stopPropagation();
        this.properties.onMouseDown && this.properties.onMouseDown();
    };
    ButtonBase.prototype._onMouseUp = function (event) {
        event.stopPropagation();
        this.properties.onMouseUp && this.properties.onMouseUp();
    };
    ButtonBase.prototype._onTouchStart = function (event) {
        event.stopPropagation();
        this.properties.onTouchStart && this.properties.onTouchStart();
    };
    ButtonBase.prototype._onTouchEnd = function (event) {
        event.stopPropagation();
        this.properties.onTouchEnd && this.properties.onTouchEnd();
    };
    ButtonBase.prototype._onTouchCancel = function (event) {
        event.stopPropagation();
        this.properties.onTouchCancel && this.properties.onTouchCancel();
    };
    ButtonBase.prototype.getContent = function () {
        return this.children;
    };
    ButtonBase.prototype.getModifierClasses = function () {
        var _a = this.properties, disabled = _a.disabled, _b = _a.popup, popup = _b === void 0 ? false : _b, pressed = _a.pressed;
        return [
            disabled ? css.disabled : null,
            popup ? css.popup : null,
            pressed ? css.pressed : null
        ];
    };
    ButtonBase.prototype.render = function () {
        var _a = this.properties, _b = _a.aria, aria = _b === void 0 ? {} : _b, disabled = _a.disabled, id = _a.id, _c = _a.popup, popup = _c === void 0 ? false : _c, name = _a.name, pressed = _a.pressed, type = _a.type, value = _a.value;
        if (popup === true) {
            popup = { expanded: false, id: '' };
        }
        return d_1.v('button', tslib_1.__assign({ classes: this.theme(tslib_1.__spread([css.root], this.getModifierClasses())), disabled: disabled,
            id: id,
            name: name,
            type: type,
            value: value, onblur: this._onBlur, onclick: this._onClick, onfocus: this._onFocus, onkeydown: this._onKeyDown, onkeypress: this._onKeyPress, onkeyup: this._onKeyUp, onmousedown: this._onMouseDown, onmouseup: this._onMouseUp, ontouchstart: this._onTouchStart, ontouchend: this._onTouchEnd, ontouchcancel: this._onTouchCancel }, util_1.formatAriaProperties(aria), { 'aria-haspopup': popup ? 'true' : null, 'aria-controls': popup ? popup.id : null, 'aria-expanded': popup ? popup.expanded + '' : null, 'aria-pressed': typeof pressed === 'boolean' ? pressed.toString() : null }), tslib_1.__spread(this.getContent(), [
            popup ? d_1.v('span', { classes: this.theme(css.addon) }, [
                d_1.w(index_1.default, { type: 'downIcon' })
            ]) : null
        ]));
    };
    ButtonBase = tslib_1.__decorate([
        Themed_1.theme(css),
        customElement_1.customElement({
            tag: 'dojo-button',
            childType: registerCustomElement_1.CustomElementChildType.TEXT,
            properties: ['disabled', 'pressed', 'popup', 'theme', 'aria', 'extraClasses'],
            attributes: ['id', 'name', 'value'],
            events: [
                'onBlur',
                'onChange',
                'onClick',
                'onFocus',
                'onInput',
                'onKeyDown',
                'onKeyPress',
                'onKeyUp',
                'onMouseDown',
                'onMouseUp',
                'onTouchCancel',
                'onTouchEnd',
                'onTouchStart'
            ]
        })
    ], ButtonBase);
    return ButtonBase;
}(exports.ThemedBase));
exports.ButtonBase = ButtonBase;
var Button = /** @class */ (function (_super) {
    tslib_1.__extends(Button, _super);
    function Button() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Button;
}(ButtonBase));
exports.default = Button;

/***/ }),

/***/ "./node_modules/@dojo/widgets/common/styles/base.m.css":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/common/styles/base.m.css.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/@dojo/widgets/common/styles/base.m.css");
(function (root, factory) {
if (true) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () { return (factory()); }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else if (typeof module === 'object' && module.exports) {
	module.exports = factory();
}
}(this, function () {
	return {"visuallyHidden":"_1AeWeApr","focusable":"_1_qANqXi","hidden":"_3QddUiBU"," _key":"@dojo/widgets/base"};
}));;

/***/ }),

/***/ "./node_modules/@dojo/widgets/common/util.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function formatAriaProperties(aria) {
    var formattedAria = Object.keys(aria).reduce(function (a, key) {
        a["aria-" + key.toLowerCase()] = aria[key];
        return a;
    }, {});
    return formattedAria;
}
exports.formatAriaProperties = formatAriaProperties;

/***/ }),

/***/ "./node_modules/@dojo/widgets/icon/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var WidgetBase_1 = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.js");
var Themed_1 = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Themed.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var util_1 = __webpack_require__("./node_modules/@dojo/widgets/common/util.js");
var css = __webpack_require__("./node_modules/@dojo/widgets/theme/icon.m.css.js");
var baseCss = __webpack_require__("./node_modules/@dojo/widgets/common/styles/base.m.css.js");
var customElement_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/customElement.js");
exports.ThemedBase = Themed_1.ThemedMixin(WidgetBase_1.WidgetBase);
var IconBase = /** @class */ (function (_super) {
    tslib_1.__extends(IconBase, _super);
    function IconBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IconBase.prototype.renderAltText = function (altText) {
        return d_1.v('span', { classes: [baseCss.visuallyHidden] }, [altText]);
    };
    IconBase.prototype.render = function () {
        var _a = this.properties, _b = _a.aria, aria = _b === void 0 ? {
            hidden: 'true'
        } : _b, type = _a.type, altText = _a.altText;
        return d_1.v('span', { classes: this.theme(css.root) }, [
            d_1.v('i', tslib_1.__assign({}, util_1.formatAriaProperties(aria), { classes: this.theme([css.icon, css[type]]) })),
            altText ? this.renderAltText(altText) : null
        ]);
    };
    IconBase = tslib_1.__decorate([
        Themed_1.theme(css),
        customElement_1.customElement({
            tag: 'dojo-icon',
            properties: [
                'theme',
                'aria',
                'extraClasses'
            ],
            attributes: ['type', 'altText']
        })
    ], IconBase);
    return IconBase;
}(exports.ThemedBase));
exports.IconBase = IconBase;
var Icon = /** @class */ (function (_super) {
    tslib_1.__extends(Icon, _super);
    function Icon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Icon;
}(IconBase));
exports.default = Icon;

/***/ }),

/***/ "./node_modules/@dojo/widgets/label/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var WidgetBase_1 = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.js");
var Themed_1 = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Themed.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var util_1 = __webpack_require__("./node_modules/@dojo/widgets/common/util.js");
var css = __webpack_require__("./node_modules/@dojo/widgets/theme/label.m.css.js");
var baseCss = __webpack_require__("./node_modules/@dojo/widgets/common/styles/base.m.css.js");
var customElement_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/customElement.js");
exports.ThemedBase = Themed_1.ThemedMixin(WidgetBase_1.WidgetBase);
var LabelBase = /** @class */ (function (_super) {
    tslib_1.__extends(LabelBase, _super);
    function LabelBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LabelBase.prototype.getRootClasses = function () {
        var _a = this.properties, disabled = _a.disabled, focused = _a.focused, invalid = _a.invalid, readOnly = _a.readOnly, required = _a.required, secondary = _a.secondary;
        return [
            css.root,
            disabled ? css.disabled : null,
            focused ? css.focused : null,
            invalid === true ? css.invalid : null,
            invalid === false ? css.valid : null,
            readOnly ? css.readonly : null,
            required ? css.required : null,
            secondary ? css.secondary : null
        ];
    };
    LabelBase.prototype.render = function () {
        var _a = this.properties, _b = _a.aria, aria = _b === void 0 ? {} : _b, forId = _a.forId, hidden = _a.hidden;
        return d_1.v('label', tslib_1.__assign({}, util_1.formatAriaProperties(aria), { classes: tslib_1.__spread(this.theme(this.getRootClasses()), [
                hidden ? baseCss.visuallyHidden : null
            ]), for: forId }), this.children);
    };
    LabelBase = tslib_1.__decorate([
        Themed_1.theme(css),
        customElement_1.customElement({
            tag: 'dojo-label',
            properties: ['theme', 'aria', 'extraClasses', 'disabled', 'focused', 'readOnly', 'required', 'invalid', 'hidden', 'secondary'],
            attributes: [],
            events: []
        })
    ], LabelBase);
    return LabelBase;
}(exports.ThemedBase));
exports.LabelBase = LabelBase;
var Label = /** @class */ (function (_super) {
    tslib_1.__extends(Label, _super);
    function Label() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Label;
}(LabelBase));
exports.default = Label;

/***/ }),

/***/ "./node_modules/@dojo/widgets/text-input/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__("./node_modules/tslib/tslib.es6.js");
var WidgetBase_1 = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.js");
var Themed_1 = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Themed.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var Focus_1 = __webpack_require__("./node_modules/@dojo/widget-core/meta/Focus.js");
var index_1 = __webpack_require__("./node_modules/@dojo/widgets/label/index.js");
var util_1 = __webpack_require__("./node_modules/@dojo/widgets/common/util.js");
var uuid_1 = __webpack_require__("./node_modules/@dojo/core/uuid.js");
var css = __webpack_require__("./node_modules/@dojo/widgets/theme/text-input.m.css.js");
var customElement_1 = __webpack_require__("./node_modules/@dojo/widget-core/decorators/customElement.js");
exports.ThemedBase = Themed_1.ThemedMixin(WidgetBase_1.WidgetBase);
var TextInputBase = /** @class */ (function (_super) {
    tslib_1.__extends(TextInputBase, _super);
    function TextInputBase() {
        var _this = _super.call(this) || this;
        _this._uuid = uuid_1.default();
        return _this;
    }
    TextInputBase.prototype._onBlur = function (event) {
        this.properties.onBlur && this.properties.onBlur(event.target.value);
    };
    TextInputBase.prototype._onChange = function (event) {
        event.stopPropagation();
        this.properties.onChange && this.properties.onChange(event.target.value);
    };
    TextInputBase.prototype._onClick = function (event) {
        event.stopPropagation();
        this.properties.onClick && this.properties.onClick(event.target.value);
    };
    TextInputBase.prototype._onFocus = function (event) {
        this.properties.onFocus && this.properties.onFocus(event.target.value);
    };
    TextInputBase.prototype._onInput = function (event) {
        event.stopPropagation();
        this.properties.onInput && this.properties.onInput(event.target.value);
    };
    TextInputBase.prototype._onKeyDown = function (event) {
        event.stopPropagation();
        this.properties.onKeyDown && this.properties.onKeyDown(event.which, function () { event.preventDefault(); });
    };
    TextInputBase.prototype._onKeyPress = function (event) {
        event.stopPropagation();
        this.properties.onKeyPress && this.properties.onKeyPress(event.which, function () { event.preventDefault(); });
    };
    TextInputBase.prototype._onKeyUp = function (event) {
        event.stopPropagation();
        this.properties.onKeyUp && this.properties.onKeyUp(event.which, function () { event.preventDefault(); });
    };
    TextInputBase.prototype._onMouseDown = function (event) {
        event.stopPropagation();
        this.properties.onMouseDown && this.properties.onMouseDown();
    };
    TextInputBase.prototype._onMouseUp = function (event) {
        event.stopPropagation();
        this.properties.onMouseUp && this.properties.onMouseUp();
    };
    TextInputBase.prototype._onTouchStart = function (event) {
        event.stopPropagation();
        this.properties.onTouchStart && this.properties.onTouchStart();
    };
    TextInputBase.prototype._onTouchEnd = function (event) {
        event.stopPropagation();
        this.properties.onTouchEnd && this.properties.onTouchEnd();
    };
    TextInputBase.prototype._onTouchCancel = function (event) {
        event.stopPropagation();
        this.properties.onTouchCancel && this.properties.onTouchCancel();
    };
    TextInputBase.prototype.getRootClasses = function () {
        var _a = this.properties, disabled = _a.disabled, invalid = _a.invalid, readOnly = _a.readOnly, required = _a.required;
        var focus = this.meta(Focus_1.default).get('root');
        return [
            css.root,
            disabled ? css.disabled : null,
            focus.containsFocus ? css.focused : null,
            invalid === true ? css.invalid : null,
            invalid === false ? css.valid : null,
            readOnly ? css.readonly : null,
            required ? css.required : null
        ];
    };
    TextInputBase.prototype.renderInput = function () {
        var _a = this.properties, _b = _a.aria, aria = _b === void 0 ? {} : _b, disabled = _a.disabled, _c = _a.id, id = _c === void 0 ? this._uuid : _c, invalid = _a.invalid, maxLength = _a.maxLength, minLength = _a.minLength, name = _a.name, placeholder = _a.placeholder, readOnly = _a.readOnly, required = _a.required, _d = _a.type, type = _d === void 0 ? 'text' : _d, value = _a.value, shouldFocus = _a.shouldFocus;
        if (shouldFocus) {
            this.meta(Focus_1.default).set('input');
        }
        return d_1.v('input', tslib_1.__assign({}, util_1.formatAriaProperties(aria), { 'aria-invalid': invalid ? 'true' : null, classes: this.theme(css.input), disabled: disabled,
            id: id, key: 'input', maxlength: maxLength ? "" + maxLength : null, minlength: minLength ? "" + minLength : null, name: name,
            placeholder: placeholder,
            readOnly: readOnly, 'aria-readonly': readOnly ? 'true' : null, required: required,
            type: type,
            value: value, onblur: this._onBlur, onchange: this._onChange, onclick: this._onClick, onfocus: this._onFocus, oninput: this._onInput, onkeydown: this._onKeyDown, onkeypress: this._onKeyPress, onkeyup: this._onKeyUp, onmousedown: this._onMouseDown, onmouseup: this._onMouseUp, ontouchstart: this._onTouchStart, ontouchend: this._onTouchEnd, ontouchcancel: this._onTouchCancel }));
    };
    TextInputBase.prototype.renderInputWrapper = function () {
        return d_1.v('div', { classes: this.theme(css.inputWrapper) }, [
            this.renderInput()
        ]);
    };
    TextInputBase.prototype.render = function () {
        var _a = this.properties, disabled = _a.disabled, _b = _a.id, id = _b === void 0 ? this._uuid : _b, invalid = _a.invalid, label = _a.label, _c = _a.labelAfter, labelAfter = _c === void 0 ? false : _c, _d = _a.labelHidden, labelHidden = _d === void 0 ? false : _d, readOnly = _a.readOnly, required = _a.required, theme = _a.theme;
        var focus = this.meta(Focus_1.default).get('root');
        var children = [
            label ? d_1.w(index_1.default, {
                theme: theme,
                disabled: disabled,
                focused: focus.containsFocus,
                invalid: invalid,
                readOnly: readOnly,
                required: required,
                hidden: labelHidden,
                forId: id
            }, [label]) : null,
            this.renderInputWrapper()
        ];
        return d_1.v('div', {
            key: 'root',
            classes: this.theme(this.getRootClasses())
        }, labelAfter ? children.reverse() : children);
    };
    TextInputBase = tslib_1.__decorate([
        Themed_1.theme(css),
        customElement_1.customElement({
            tag: 'dojo-text-input',
            properties: [
                'theme',
                'aria',
                'extraClasses',
                'aria',
                'shouldFocus',
                'disabled',
                'invalid',
                'readOnly'
            ],
            attributes: ['label', 'placeholder', 'controls', 'type', 'minLength', 'maxLength', 'value', 'name'],
            events: [
                'onBlur',
                'onChange',
                'onClick',
                'onFocus',
                'onInput',
                'onKeyDown',
                'onKeyPress',
                'onKeyUp',
                'onMouseDown',
                'onMouseUp',
                'onTouchCancel',
                'onTouchEnd',
                'onTouchStart'
            ]
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], TextInputBase);
    return TextInputBase;
}(exports.ThemedBase));
exports.TextInputBase = TextInputBase;
var TextInput = /** @class */ (function (_super) {
    tslib_1.__extends(TextInput, _super);
    function TextInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TextInput;
}(TextInputBase));
exports.default = TextInput;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/button.m.css":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/button.m.css.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/@dojo/widgets/theme/button.m.css");
(function (root, factory) {
if (true) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () { return (factory()); }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else if (typeof module === 'object' && module.exports) {
	module.exports = factory();
}
}(this, function () {
	return {"root":"K8T1JJ0x","pressed":"_2LG7Cr_Y","popup":"_1e22tkFD","addon":"NGE1mgEd","disabled":"_3x8T4NsI"," _key":"@dojo/widgets/button"};
}));;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/icon.m.css":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/icon.m.css.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/@dojo/widgets/theme/icon.m.css");
(function (root, factory) {
if (true) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () { return (factory()); }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else if (typeof module === 'object' && module.exports) {
	module.exports = factory();
}
}(this, function () {
	return {"root":"_2L6Ls-Zy","icon":"_3tF1vZM-","downIcon":"_3GFyIk3G","leftIcon":"_1db8DKc8","rightIcon":"_2a143YET","closeIcon":"w1WZiet2","plusIcon":"_2V_909OC","minusIcon":"_27KOe4gH","checkIcon":"mKil4MCX","upIcon":"Rw4TXrdb","upAltIcon":"b2BPqdCO","downAltIcon":"_3QpkEw-I","searchIcon":"_3MWqsC_b","barsIcon":"_3uXWm-H6","settingsIcon":"_3V--OLwl","alertIcon":"_3YjJOXWh","helpIcon":"_3mL91Z0s","infoIcon":"dZLeo6Sf","phoneIcon":"_1vzkNuNB","editIcon":"_2y3IH3o2","dateIcon":"_1_x6RqtA","linkIcon":"HkV2v3yK","locationIcon":"_24-7y_Lz","secureIcon":"_2cTDxmou","mailIcon":"_12PMYHnq"," _key":"@dojo/widgets/icon"};
}));;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/label.m.css":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/label.m.css.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/@dojo/widgets/theme/label.m.css");
(function (root, factory) {
if (true) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () { return (factory()); }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else if (typeof module === 'object' && module.exports) {
	module.exports = factory();
}
}(this, function () {
	return {"root":"_1Xn7GZjl","readonly":"_79gMw0vX","invalid":"_1HXQXand","valid":"_3TeO85nD","required":"_2a_lwZi8","disabled":"_3gv9ptxH","focused":"_2Qy2nYta","secondary":"_29UpR7Gd"," _key":"@dojo/widgets/label"};
}));;

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/text-input.m.css":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./node_modules/@dojo/widgets/theme/text-input.m.css.js":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__("./node_modules/@dojo/widgets/theme/text-input.m.css");
(function (root, factory) {
if (true) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () { return (factory()); }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else if (typeof module === 'object' && module.exports) {
	module.exports = factory();
}
}(this, function () {
	return {"input":"_11VimoPG","root":"_1NgZUEE4","inputWrapper":"TxI_qeto","disabled":"xKv_GKpT","focused":"_1_cNY7E8","readonly":"_39faZFMX","required":"_1sSaabHo","invalid":"_3ty-BRNM","valid":"_3A71sBn4"," _key":"@dojo/widgets/text-input"};
}));;

/***/ }),

/***/ "./node_modules/process/browser.js":
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/setimmediate/setImmediate.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js"), __webpack_require__("./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/timers-browserify/main.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__("./node_modules/setimmediate/setImmediate.js");
// On some exotic environments, it's not clear which object `setimmeidate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/tslib/tslib.es6.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["__extends"] = __extends;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (immutable) */ __webpack_exports__["__rest"] = __rest;
/* harmony export (immutable) */ __webpack_exports__["__decorate"] = __decorate;
/* harmony export (immutable) */ __webpack_exports__["__param"] = __param;
/* harmony export (immutable) */ __webpack_exports__["__metadata"] = __metadata;
/* harmony export (immutable) */ __webpack_exports__["__awaiter"] = __awaiter;
/* harmony export (immutable) */ __webpack_exports__["__generator"] = __generator;
/* harmony export (immutable) */ __webpack_exports__["__exportStar"] = __exportStar;
/* harmony export (immutable) */ __webpack_exports__["__values"] = __values;
/* harmony export (immutable) */ __webpack_exports__["__read"] = __read;
/* harmony export (immutable) */ __webpack_exports__["__spread"] = __spread;
/* harmony export (immutable) */ __webpack_exports__["__await"] = __await;
/* harmony export (immutable) */ __webpack_exports__["__asyncGenerator"] = __asyncGenerator;
/* harmony export (immutable) */ __webpack_exports__["__asyncDelegator"] = __asyncDelegator;
/* harmony export (immutable) */ __webpack_exports__["__asyncValues"] = __asyncValues;
/* harmony export (immutable) */ __webpack_exports__["__makeTemplateObject"] = __makeTemplateObject;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/ApplicationContext.ts":
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lang_1 = __webpack_require__("./node_modules/@dojo/core/lang.js");
var Injector_1 = __webpack_require__("./node_modules/@dojo/widget-core/Injector.js");
var ApplicationContext = /** @class */ (function (_super) {
    __extends(ApplicationContext, _super);
    function ApplicationContext(workerData) {
        if (workerData === void 0) { workerData = []; }
        var _this = _super.call(this, {}) || this;
        _this._formData = {};
        _this._workerData = workerData;
        return _this;
    }
    Object.defineProperty(ApplicationContext.prototype, "workerData", {
        get: function () {
            return this._workerData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationContext.prototype, "formData", {
        get: function () {
            return this._formData;
        },
        enumerable: true,
        configurable: true
    });
    ApplicationContext.prototype.formInput = function (input) {
        this._formData = lang_1.deepAssign({}, this._formData, input);
        this.emit({ type: 'invalidate' });
    };
    ApplicationContext.prototype.submitForm = function () {
        this._workerData = this._workerData.concat([this._formData]);
        this._formData = {};
        this.emit({ type: 'invalidate' });
    };
    ApplicationContext.prototype.get = function () {
        return this;
    };
    return ApplicationContext;
}(Injector_1.Injector));
exports.default = ApplicationContext;


/***/ }),

/***/ "./src/containers/WorkerContainerContainer.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Container_1 = __webpack_require__("./node_modules/@dojo/widget-core/Container.js");
var WorkerContainer_1 = __webpack_require__("./src/widgets/WorkerContainer.ts");
function getProperties(inject, properties) {
    return { workerData: inject.workerData };
}
var WorkerContainerContainer = Container_1.Container(WorkerContainer_1.default, 'app-state', { getProperties: getProperties });
exports.default = WorkerContainerContainer;


/***/ }),

/***/ "./src/containers/WorkerFormContainer.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Container_1 = __webpack_require__("./node_modules/@dojo/widget-core/Container.js");
var WorkerForm_1 = __webpack_require__("./src/widgets/WorkerForm.ts");
function getProperties(inject, properties) {
    var formData = inject.formData, onFormInput = inject.formInput, onFormSave = inject.submitForm;
    return {
        formData: formData,
        onFormInput: onFormInput.bind(inject),
        onFormSave: onFormSave.bind(inject)
    };
}
var WorkerFormContainer = Container_1.Container(WorkerForm_1.default, 'app-state', { getProperties: getProperties });
exports.default = WorkerFormContainer;


/***/ }),

/***/ "./src/main.css":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./src/main.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Projector_1 = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Projector.js");
var Registry_1 = __webpack_require__("./node_modules/@dojo/widget-core/Registry.js");
var App_1 = __webpack_require__("./src/widgets/App.ts");
var ApplicationContext_1 = __webpack_require__("./src/ApplicationContext.ts");
var applicationContext = new ApplicationContext_1.default([
    {
        firstName: 'Tim',
        lastName: 'Jones',
        email: 'tim.jones@bizecorp.org',
        tasks: [
            '6267 - Untangle paperclips',
            '4384 - Shred documents',
            '9663 - Digitize 1985 archive'
        ]
    },
    {
        firstName: 'Alicia',
        lastName: 'Fitzgerald'
    },
    {
        firstName: 'Hans',
        lastName: 'Mueller'
    }
]);
var registry = new Registry_1.Registry();
registry.defineInjector('app-state', applicationContext);
var root = document.querySelector('my-app') || undefined;
var Projector = Projector_1.ProjectorMixin(App_1.default);
var projector = new Projector();
projector.setProperties({ registry: registry });
projector.append(root);


/***/ }),

/***/ "./src/styles/worker.m.css":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {" _key":"biz-e-corp/worker","generalInfo":"worker-m__generalInfo__35U0C","image":"worker-m__image__1U-R5","imageSmall":"worker-m__imageSmall__3b9QD","label":"worker-m__label__jzs40","task":"worker-m__task__Lp7zz","worker":"worker-m__worker__4_RCM","workerFront":"worker-m__workerFront__XMULW","workerBack":"worker-m__workerBack__3HVX3","reverse":"worker-m__reverse__2tBb7"};

/***/ }),

/***/ "./src/styles/workerContainer.m.css":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {" _key":"biz-e-corp/workerContainer","container":"workerContainer-m__container__1j37m"};

/***/ }),

/***/ "./src/styles/workerForm.m.css":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {" _key":"biz-e-corp/workerForm","workerForm":"workerForm-m__workerForm__3qG5m","nameField":"workerForm-m__nameField__2QOW6","nameLabel":"workerForm-m__nameLabel__3VCgX","workerButton":"workerForm-m__workerButton__3Ujn6"};

/***/ }),

/***/ "./src/widgets/App.ts":
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WidgetBase_1 = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var Banner_1 = __webpack_require__("./src/widgets/Banner.ts");
var WorkerContainerContainer_1 = __webpack_require__("./src/containers/WorkerContainerContainer.ts");
var WorkerFormContainer_1 = __webpack_require__("./src/containers/WorkerFormContainer.ts");
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.render = function () {
        return d_1.v('div', [
            d_1.w(Banner_1.default, {}),
            d_1.w(WorkerFormContainer_1.default, {}),
            d_1.w(WorkerContainerContainer_1.default, {})
        ]);
    };
    return App;
}(WidgetBase_1.WidgetBase));
exports.default = App;


/***/ }),

/***/ "./src/widgets/Banner.ts":
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WidgetBase_1 = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var Banner = /** @class */ (function (_super) {
    __extends(Banner, _super);
    function Banner() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Banner.prototype.render = function () {
        return d_1.v('h1', { title: 'I am a title!' }, ['Biz-E-Bodies']);
    };
    return Banner;
}(WidgetBase_1.WidgetBase));
exports.default = Banner;


/***/ }),

/***/ "./src/widgets/Worker.ts":
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WidgetBase_1 = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var Themed_1 = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Themed.js");
var css = __webpack_require__("./src/styles/worker.m.css");
var WorkerBase = Themed_1.ThemedMixin(WidgetBase_1.WidgetBase);
var Worker = /** @class */ (function (_super) {
    __extends(Worker, _super);
    function Worker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._isFlipped = false;
        return _this;
    }
    Worker.prototype.render = function () {
        return d_1.v('div', {
            classes: this.theme([css.worker, this._isFlipped ? css.reverse : null])
        }, [
            this._renderFront(),
            this._renderBack()
        ]);
    };
    Worker.prototype._renderFront = function () {
        var _a = this.properties, _b = _a.firstName, firstName = _b === void 0 ? 'firstName' : _b, _c = _a.lastName, lastName = _c === void 0 ? 'lastName' : _c;
        return d_1.v('div', {
            key: 'front',
            classes: this.theme(css.workerFront),
            onclick: this.flip
        }, [
            d_1.v('img', {
                classes: this.theme(css.image),
                src: 'https://dojo.io/tutorials/resources/worker.svg'
            }),
            d_1.v('div', [
                d_1.v('strong', [lastName + ", " + firstName])
            ])
        ]);
    };
    Worker.prototype._renderBack = function () {
        var _this = this;
        var _a = this.properties, _b = _a.firstName, firstName = _b === void 0 ? 'firstName' : _b, _c = _a.lastName, lastName = _c === void 0 ? 'lastName' : _c, _d = _a.email, email = _d === void 0 ? 'unavailable' : _d, _e = _a.timePerTask, timePerTask = _e === void 0 ? 0 : _e, _f = _a.tasks, tasks = _f === void 0 ? [] : _f;
        return d_1.v('div', {
            classes: this.theme(css.workerBack),
            onclick: this.flip
        }, [
            d_1.v('img', {
                classes: this.theme(css.imageSmall),
                src: 'https://dojo.io/tutorials/resources/worker.svg'
            }),
            d_1.v('div', {
                classes: this.theme(css.generalInfo)
            }, [
                d_1.v('div', {
                    classes: this.theme(css.label)
                }, ['Name']),
                d_1.v('div', [lastName + ", " + firstName]),
                d_1.v('div', {
                    classes: this.theme(css.label)
                }, ['Email']),
                d_1.v('div', ["" + email]),
                d_1.v('div', {
                    classes: this.theme(css.label)
                }, ['Avg. Time per Task']),
                d_1.v('div', ["" + timePerTask])
            ]),
            d_1.v('div', [
                d_1.v('strong', ['Current Tasks']),
                d_1.v('div', tasks.map(function (task) {
                    return d_1.v('div', { classes: _this.theme(css.task) }, [task]);
                }))
            ])
        ]);
    };
    Worker.prototype.flip = function () {
        this._isFlipped = !this._isFlipped;
        this.invalidate();
    };
    Worker = __decorate([
        Themed_1.theme(css)
    ], Worker);
    return Worker;
}(WorkerBase));
exports.default = Worker;


/***/ }),

/***/ "./src/widgets/WorkerContainer.ts":
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WidgetBase_1 = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var Worker_1 = __webpack_require__("./src/widgets/Worker.ts");
var Themed_1 = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Themed.js");
var css = __webpack_require__("./src/styles/workerContainer.m.css");
var WorkerContainerBase = Themed_1.ThemedMixin(WidgetBase_1.WidgetBase);
var WorkerContainer = /** @class */ (function (_super) {
    __extends(WorkerContainer, _super);
    function WorkerContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WorkerContainer.prototype.render = function () {
        var _a = this.properties.workerData, workerData = _a === void 0 ? [] : _a;
        var workers = workerData.map(function (worker, i) { return d_1.w(Worker_1.default, __assign({ key: "worker-" + i }, worker)); });
        return d_1.v('div', {
            classes: this.theme(css.container)
        }, workers);
    };
    WorkerContainer = __decorate([
        Themed_1.theme(css)
    ], WorkerContainer);
    return WorkerContainer;
}(WorkerContainerBase));
exports.default = WorkerContainer;


/***/ }),

/***/ "./src/widgets/WorkerForm.ts":
/***/ (function(module, exports, __webpack_require__) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WidgetBase_1 = __webpack_require__("./node_modules/@dojo/widget-core/WidgetBase.js");
var d_1 = __webpack_require__("./node_modules/@dojo/widget-core/d.js");
var Themed_1 = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Themed.js");
var button_1 = __webpack_require__("./node_modules/@dojo/widgets/button/index.js");
var text_input_1 = __webpack_require__("./node_modules/@dojo/widgets/text-input/index.js");
var css = __webpack_require__("./src/styles/workerForm.m.css");
exports.WorkerFormBase = Themed_1.ThemedMixin(WidgetBase_1.WidgetBase);
var WorkerForm = /** @class */ (function (_super) {
    __extends(WorkerForm, _super);
    function WorkerForm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WorkerForm.prototype._onSubmit = function (event) {
        event.preventDefault();
        this.properties.onFormSave();
    };
    WorkerForm.prototype.onFirstNameInput = function (firstName) {
        this.properties.onFormInput({ firstName: firstName });
    };
    WorkerForm.prototype.onLastNameInput = function (lastName) {
        this.properties.onFormInput({ lastName: lastName });
    };
    WorkerForm.prototype.onEmailInput = function (email) {
        this.properties.onFormInput({ email: email });
    };
    WorkerForm.prototype.render = function () {
        var _a = this.properties.formData, firstName = _a.firstName, lastName = _a.lastName, email = _a.email;
        return d_1.v('form', {
            classes: this.theme(css.workerForm),
            onsubmit: this._onSubmit
        }, [
            d_1.v('fieldset', { classes: this.theme(css.nameField) }, [
                d_1.v('legend', { classes: this.theme(css.nameLabel) }, ['Name']),
                d_1.w(text_input_1.default, {
                    key: 'firstNameInput',
                    label: 'First Name',
                    labelHidden: true,
                    placeholder: 'First name',
                    value: firstName,
                    required: true,
                    onInput: this.onFirstNameInput
                }),
                d_1.w(text_input_1.default, {
                    key: 'lastNameInput',
                    label: 'Last Name',
                    labelHidden: true,
                    placeholder: 'Last name',
                    value: lastName,
                    required: true,
                    onInput: this.onLastNameInput
                })
            ]),
            d_1.w(text_input_1.default, {
                label: 'Email address',
                type: 'email',
                value: email,
                required: true,
                onInput: this.onEmailInput
            }),
            d_1.w(button_1.default, {}, ['Save'])
        ]);
    };
    WorkerForm = __decorate([
        Themed_1.theme(css)
    ], WorkerForm);
    return WorkerForm;
}(exports.WorkerFormBase));
exports.default = WorkerForm;


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./src/main.css");
module.exports = __webpack_require__("./src/main.ts");


/***/ })

},[0]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL0Rlc3Ryb3lhYmxlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL0V2ZW50ZWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvbGFuZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vY29yZS91dWlkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9oYXMvaGFzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL01hcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9Qcm9taXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1NldC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9TeW1ib2wuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vV2Vha01hcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9hcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vaXRlcmF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vbnVtYmVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL29iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC9oYXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC9xdWV1ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L3V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL0NvbnRhaW5lci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvSW5qZWN0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL05vZGVIYW5kbGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvUmVnaXN0cnlIYW5kbGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9hbmltYXRpb25zL2Nzc1RyYW5zaXRpb25zLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2Fsd2F5c1JlbmRlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9iZWZvcmVQcm9wZXJ0aWVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvZGlmZlByb3BlcnR5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2hhbmRsZURlY29yYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9pbmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RpZmYuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21ldGEvQmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvbWV0YS9Gb2N1cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1Byb2plY3Rvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvcmVnaXN0ZXJDdXN0b21FbGVtZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS92ZG9tLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL2J1dHRvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy9jb21tb24vc3R5bGVzL2Jhc2UubS5jc3M/NTQzNiIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy9jb21tb24vc3R5bGVzL2Jhc2UubS5jc3MuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvY29tbW9uL3V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvaWNvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy9sYWJlbC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90ZXh0LWlucHV0L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL2J1dHRvbi5tLmNzcz82ZjQ2Iiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL2J1dHRvbi5tLmNzcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS9pY29uLm0uY3NzP2I4YmUiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGhlbWUvaWNvbi5tLmNzcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS9sYWJlbC5tLmNzcz9lMmZiIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL2xhYmVsLm0uY3NzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL3RleHQtaW5wdXQubS5jc3M/YmI2MCIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS90ZXh0LWlucHV0Lm0uY3NzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3NyYy9BcHBsaWNhdGlvbkNvbnRleHQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRhaW5lcnMvV29ya2VyQ29udGFpbmVyQ29udGFpbmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb250YWluZXJzL1dvcmtlckZvcm1Db250YWluZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4uY3NzPzg0MjEiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlcy93b3JrZXIubS5jc3M/NTMwMSIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL3dvcmtlckNvbnRhaW5lci5tLmNzcz85YWQ1Iiwid2VicGFjazovLy8uL3NyYy9zdHlsZXMvd29ya2VyRm9ybS5tLmNzcz9jZDQwIiwid2VicGFjazovLy8uL3NyYy93aWRnZXRzL0FwcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvd2lkZ2V0cy9CYW5uZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3dpZGdldHMvV29ya2VyLnRzIiwid2VicGFjazovLy8uL3NyYy93aWRnZXRzL1dvcmtlckNvbnRhaW5lci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvd2lkZ2V0cy9Xb3JrZXJGb3JtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87Ozs7OztBQ1ZBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFlBQVk7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EsOEI7Ozs7Ozs7O0FDNURBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOERBQThELDJDQUEyQyxFQUFFO0FBQzNHO0FBQ0E7QUFDQSx5REFBeUQseUJBQXlCLEVBQUU7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EsMEI7Ozs7Ozs7O0FDakZBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDJCQUEyQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHVCQUF1QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsdUJBQXVCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHVCQUF1QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHVCQUF1QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQix1QkFBdUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHVCQUF1QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQix1QkFBdUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG9CQUFvQjtBQUMzQztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0Esc0Q7Ozs7Ozs7O0FDek9BO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSx1Qjs7Ozs7Ozs7dURDYkE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLG1CQUFtQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLEU7Ozs7Ozs7OztBQzFNRDtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxxQkFBcUI7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0dBQStHLG9CQUFvQjtBQUNuSTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxRQUFRLGdCQUFnQjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQywwQkFBMEI7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsY0FBYztBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVELGNBQWM7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTzs7Ozs7Ozs7QUNsSEE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsTUFBTTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsV0FBVztBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsTUFBTTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QixxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJHQUEyRyxvQkFBb0I7QUFDL0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxRQUFRLGdCQUFnQjtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQywwQkFBMEI7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyR0FBMkcsb0JBQW9CO0FBQy9IO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsUUFBUSxnQkFBZ0I7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsMEJBQTBCO0FBQzNEO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE87Ozs7Ozs7O0FDaE9BO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMscUJBQXFCO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrR0FBK0csb0JBQW9CO0FBQ25JO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLFFBQVEsZ0JBQWdCO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLDBCQUEwQjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1RkFBdUYsdUJBQXVCLEVBQUU7QUFDaEg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPOzs7Ozs7OztBQzNGQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLElBQUk7QUFDcEIsZ0JBQWdCLE9BQU87QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksSUFBSTtBQUNoQixZQUFZLFVBQVU7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsaUM7Ozs7Ozs7O0FDbEpBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMscUJBQXFCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJHQUEyRyxvQkFBb0I7QUFDL0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsUUFBUSxnQkFBZ0I7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsMEJBQTBCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixnQ0FBZ0M7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGtDOzs7Ozs7OztBQzlIQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUVBQXFFO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHNCQUFzQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1R0FBdUcscUJBQXFCO0FBQzVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsUUFBUSxnQkFBZ0I7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsMEJBQTBCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxlQUFlO0FBQ2xEO0FBQ0EsK0JBQStCLFNBQVM7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7OzhDQy9NQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCwrQjs7Ozs7Ozs7O0FDbEJBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixPQUFPO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCOzs7Ozs7OztBQ3JIQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQzs7Ozs7Ozs7QUMxREE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYiw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQiwwQkFBMEI7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsNEJBQTRCO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMEJBQTBCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQsb0NBQW9DO0FBQ2pHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQyxhQUFhLHFCQUFxQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBbUUscUNBQXFDLEVBQUU7QUFDMUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EsNkI7Ozs7Ozs7O0FDL1lBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFOzs7Ozs7OztBQy9EQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLGVBQWU7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLDJCQUEyQjtBQUNyRSw4QkFBOEIsc0JBQXNCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBaUUsZ0RBQWdELDBDQUEwQztBQUMzSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQjs7Ozs7Ozs7QUMvR0E7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsOEI7Ozs7Ozs7O0FDVEE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQSwrQjs7Ozs7Ozs7QUNaQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxtQzs7Ozs7Ozs7QUNUQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDOzs7Ozs7OztBQ3BCQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSwrQjs7Ozs7Ozs7QUN2QkE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0M7Ozs7Ozs7O0FDbkJBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQSx5Qjs7Ozs7Ozs7QUN2Q0E7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9COzs7Ozs7OztBQ3ZFQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSx1Qjs7Ozs7Ozs7QUM1Q0E7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0Esd0I7Ozs7Ozs7O0FDbERBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLDJGQUEyRjtBQUM1RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsNkRBQTZEO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsdUJBQXVCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLGlDQUFpQyxnQkFBZ0I7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0Q7QUFDeEQsK0RBQStELGdEQUFnRDtBQUMvRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQsNEJBQTRCLHFCQUFxQjtBQUMxRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGlDOzs7Ozs7OztBQ2hMQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSyxJQUFJO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELHdDQUF3QyxFQUFFO0FBQ25HO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNFQUFzRTtBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDLGlCQUFpQixJQUFJO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQyxhQUFhLElBQUk7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSw4Qjs7Ozs7Ozs7QUNySkE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxpR0FBaUc7QUFDbEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxJQUFJO0FBQ2pCLDRCQUE0QixvREFBb0Q7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyx5Q0FBeUMsRUFBRTtBQUNqRiwyQ0FBMkMsZ0RBQWdEO0FBQzNGO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLDhDQUE4QyxFQUFFO0FBQ3RGLDJDQUEyQyxxREFBcUQ7QUFDaEc7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsdUJBQXVCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhFQUE4RSx3QkFBd0IsRUFBRTtBQUN4RyxpRkFBaUYsd0JBQXdCLEVBQUU7QUFDM0c7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELG1DQUFtQztBQUNyRjtBQUNBLGFBQWE7QUFDYixxRUFBcUUsaUNBQWlDLEVBQUU7QUFDeEc7QUFDQSw4Q0FBOEMsNkJBQTZCO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsNkVBQTZFLDRDQUE0QyxFQUFFO0FBQzNIO0FBQ0E7QUFDQSwyQ0FBMkMscUJBQXFCO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBbUUsK0JBQStCLEVBQUU7QUFDcEc7QUFDQSx5RUFBeUUsd0JBQXdCLEVBQUU7QUFDbkc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0EsK0RBQStELCtCQUErQixFQUFFO0FBQ2hHO0FBQ0EsMkRBQTJEO0FBQzNELGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsSUFBSTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkI7Ozs7Ozs7O0FDalBBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHVCQUF1QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix1QkFBdUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBLGdCQUFnQixlQUFlLHNDQUFzQztBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSyxJQUFJO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0Msb0JBQW9CO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixlQUFlO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxvQ0FBb0M7QUFDckY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQix1Q0FBdUM7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixlQUFlO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsOEJBQThCO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsOEJBQThCO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMseUJBQXlCO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsNkJBQTZCO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGdCQUFnQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHFCQUFxQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsbUJBQW1CO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIscUJBQXFCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsdUJBQXVCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLHNCQUFzQixxQ0FBcUM7QUFDdEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQix1QkFBdUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLDBCQUEwQjtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxzQkFBc0IscUNBQXFDO0FBQ3RHLG1CQUFtQixxQkFBcUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDLG9DQUFvQztBQUNwQyx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCx1REFBdUQ7QUFDeEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyx5Q0FBeUM7QUFDOUU7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELHNCQUFzQiwyQkFBMkI7QUFDNUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQywyQ0FBMkM7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVELHNCQUFzQiwyQkFBMkI7QUFDeEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FB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QTtBQUNBLENBQUM7QUFDRCxTQUFTO0FBQ1QsQ0FBQyxJOzs7Ozs7O0FDVEQseUM7Ozs7Ozs7Z0VDQUE7QUFDQTtBQUNBO0FBQ0EsbUZBQXlCLG9CQUFvQixFQUFFO0FBQUE7QUFDL0MsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsU0FBUztBQUNULENBQUMsSTs7Ozs7OztBQ1REO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFVBQVU7Ozs7Ozs7O0FDdkx0QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsaUJBQWlCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQ0FBMEMsc0JBQXNCLEVBQUU7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7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LFVBQVUsQ0EwRDlCO0lBQUQsaUJBQUM7Q0ExREQsQ0FBd0Msc0JBQWM7a0JBQWpDLFVBQVUiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwibWFpblwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJtYWluXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIm1haW5cIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBsYW5nXzEgPSByZXF1aXJlKFwiLi9sYW5nXCIpO1xyXG52YXIgUHJvbWlzZV8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vUHJvbWlzZVwiKTtcclxuLyoqXHJcbiAqIE5vIG9wZXJhdGlvbiBmdW5jdGlvbiB0byByZXBsYWNlIG93biBvbmNlIGluc3RhbmNlIGlzIGRlc3RvcnllZFxyXG4gKi9cclxuZnVuY3Rpb24gbm9vcCgpIHtcclxuICAgIHJldHVybiBQcm9taXNlXzEuZGVmYXVsdC5yZXNvbHZlKGZhbHNlKTtcclxufVxyXG4vKipcclxuICogTm8gb3AgZnVuY3Rpb24gdXNlZCB0byByZXBsYWNlIG93biwgb25jZSBpbnN0YW5jZSBoYXMgYmVlbiBkZXN0b3J5ZWRcclxuICovXHJcbmZ1bmN0aW9uIGRlc3Ryb3llZCgpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignQ2FsbCBtYWRlIHRvIGRlc3Ryb3llZCBtZXRob2QnKTtcclxufVxyXG52YXIgRGVzdHJveWFibGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBEZXN0cm95YWJsZSgpIHtcclxuICAgICAgICB0aGlzLmhhbmRsZXMgPSBbXTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXIgaGFuZGxlcyBmb3IgdGhlIGluc3RhbmNlIHRoYXQgd2lsbCBiZSBkZXN0cm95ZWQgd2hlbiBgdGhpcy5kZXN0cm95YCBpcyBjYWxsZWRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0hhbmRsZX0gaGFuZGxlIFRoZSBoYW5kbGUgdG8gYWRkIGZvciB0aGUgaW5zdGFuY2VcclxuICAgICAqIEByZXR1cm5zIHtIYW5kbGV9IGEgaGFuZGxlIGZvciB0aGUgaGFuZGxlLCByZW1vdmVzIHRoZSBoYW5kbGUgZm9yIHRoZSBpbnN0YW5jZSBhbmQgY2FsbHMgZGVzdHJveVxyXG4gICAgICovXHJcbiAgICBEZXN0cm95YWJsZS5wcm90b3R5cGUub3duID0gZnVuY3Rpb24gKGhhbmRsZXMpIHtcclxuICAgICAgICB2YXIgaGFuZGxlID0gQXJyYXkuaXNBcnJheShoYW5kbGVzKSA/IGxhbmdfMS5jcmVhdGVDb21wb3NpdGVIYW5kbGUuYXBwbHkodm9pZCAwLCB0c2xpYl8xLl9fc3ByZWFkKGhhbmRsZXMpKSA6IGhhbmRsZXM7XHJcbiAgICAgICAgdmFyIF9oYW5kbGVzID0gdGhpcy5oYW5kbGVzO1xyXG4gICAgICAgIF9oYW5kbGVzLnB1c2goaGFuZGxlKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBfaGFuZGxlcy5zcGxpY2UoX2hhbmRsZXMuaW5kZXhPZihoYW5kbGUpKTtcclxuICAgICAgICAgICAgICAgIGhhbmRsZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRGVzdHJweXMgYWxsIGhhbmRlcnMgcmVnaXN0ZXJlZCBmb3IgdGhlIGluc3RhbmNlXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55fSBhIHByb21pc2UgdGhhdCByZXNvbHZlcyBvbmNlIGFsbCBoYW5kbGVzIGhhdmUgYmVlbiBkZXN0cm95ZWRcclxuICAgICAqL1xyXG4gICAgRGVzdHJveWFibGUucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2VfMS5kZWZhdWx0KGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgICAgIF90aGlzLmhhbmRsZXMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlKSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGUgJiYgaGFuZGxlLmRlc3Ryb3kgJiYgaGFuZGxlLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIF90aGlzLmRlc3Ryb3kgPSBub29wO1xyXG4gICAgICAgICAgICBfdGhpcy5vd24gPSBkZXN0cm95ZWQ7XHJcbiAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIERlc3Ryb3lhYmxlO1xyXG59KCkpO1xyXG5leHBvcnRzLkRlc3Ryb3lhYmxlID0gRGVzdHJveWFibGU7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IERlc3Ryb3lhYmxlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRGVzdHJveWFibGUuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRGVzdHJveWFibGUuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBNYXBfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL01hcFwiKTtcclxudmFyIERlc3Ryb3lhYmxlXzEgPSByZXF1aXJlKFwiLi9EZXN0cm95YWJsZVwiKTtcclxuLyoqXHJcbiAqIE1hcCBvZiBjb21wdXRlZCByZWd1bGFyIGV4cHJlc3Npb25zLCBrZXllZCBieSBzdHJpbmdcclxuICovXHJcbnZhciByZWdleE1hcCA9IG5ldyBNYXBfMS5kZWZhdWx0KCk7XHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIGlzIHRoZSBldmVudCB0eXBlIGdsb2IgaGFzIGJlZW4gbWF0Y2hlZFxyXG4gKlxyXG4gKiBAcmV0dXJucyBib29sZWFuIHRoYXQgaW5kaWNhdGVzIGlmIHRoZSBnbG9iIGlzIG1hdGNoZWRcclxuICovXHJcbmZ1bmN0aW9uIGlzR2xvYk1hdGNoKGdsb2JTdHJpbmcsIHRhcmdldFN0cmluZykge1xyXG4gICAgaWYgKHR5cGVvZiB0YXJnZXRTdHJpbmcgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBnbG9iU3RyaW5nID09PSAnc3RyaW5nJyAmJiBnbG9iU3RyaW5nLmluZGV4T2YoJyonKSAhPT0gLTEpIHtcclxuICAgICAgICB2YXIgcmVnZXggPSB2b2lkIDA7XHJcbiAgICAgICAgaWYgKHJlZ2V4TWFwLmhhcyhnbG9iU3RyaW5nKSkge1xyXG4gICAgICAgICAgICByZWdleCA9IHJlZ2V4TWFwLmdldChnbG9iU3RyaW5nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIl5cIiArIGdsb2JTdHJpbmcucmVwbGFjZSgvXFwqL2csICcuKicpICsgXCIkXCIpO1xyXG4gICAgICAgICAgICByZWdleE1hcC5zZXQoZ2xvYlN0cmluZywgcmVnZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVnZXgudGVzdCh0YXJnZXRTdHJpbmcpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGdsb2JTdHJpbmcgPT09IHRhcmdldFN0cmluZztcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmlzR2xvYk1hdGNoID0gaXNHbG9iTWF0Y2g7XHJcbi8qKlxyXG4gKiBFdmVudCBDbGFzc1xyXG4gKi9cclxudmFyIEV2ZW50ZWQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhFdmVudGVkLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gRXZlbnRlZCgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBtYXAgb2YgbGlzdGVuZXJzIGtleWVkIGJ5IGV2ZW50IHR5cGVcclxuICAgICAgICAgKi9cclxuICAgICAgICBfdGhpcy5saXN0ZW5lcnNNYXAgPSBuZXcgTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIEV2ZW50ZWQucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzTWFwLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZHMsIHR5cGUpIHtcclxuICAgICAgICAgICAgaWYgKGlzR2xvYk1hdGNoKHR5cGUsIGV2ZW50LnR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2RzLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZC5jYWxsKF90aGlzLCBldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIEV2ZW50ZWQucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKHR5cGUsIGxpc3RlbmVyKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShsaXN0ZW5lcikpIHtcclxuICAgICAgICAgICAgdmFyIGhhbmRsZXNfMSA9IGxpc3RlbmVyLm1hcChmdW5jdGlvbiAobGlzdGVuZXIpIHsgcmV0dXJuIF90aGlzLl9hZGRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcik7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXNfMS5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGUpIHsgcmV0dXJuIGhhbmRsZS5kZXN0cm95KCk7IH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fYWRkTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpO1xyXG4gICAgfTtcclxuICAgIEV2ZW50ZWQucHJvdG90eXBlLl9hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uICh0eXBlLCBsaXN0ZW5lcikge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzTWFwLmdldCh0eXBlKSB8fCBbXTtcclxuICAgICAgICBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNNYXAuc2V0KHR5cGUsIGxpc3RlbmVycyk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVycyA9IF90aGlzLmxpc3RlbmVyc01hcC5nZXQodHlwZSkgfHwgW107XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMuc3BsaWNlKGxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKSwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBFdmVudGVkO1xyXG59KERlc3Ryb3lhYmxlXzEuRGVzdHJveWFibGUpKTtcclxuZXhwb3J0cy5FdmVudGVkID0gRXZlbnRlZDtcclxuZXhwb3J0cy5kZWZhdWx0ID0gRXZlbnRlZDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL0V2ZW50ZWQuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRXZlbnRlZC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIG9iamVjdF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vb2JqZWN0XCIpO1xyXG52YXIgb2JqZWN0XzIgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9vYmplY3RcIik7XHJcbmV4cG9ydHMuYXNzaWduID0gb2JqZWN0XzIuYXNzaWduO1xyXG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XHJcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XHJcbi8qKlxyXG4gKiBUeXBlIGd1YXJkIHRoYXQgZW5zdXJlcyB0aGF0IHRoZSB2YWx1ZSBjYW4gYmUgY29lcmNlZCB0byBPYmplY3RcclxuICogdG8gd2VlZCBvdXQgaG9zdCBvYmplY3RzIHRoYXQgZG8gbm90IGRlcml2ZSBmcm9tIE9iamVjdC5cclxuICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGNoZWNrIGlmIHdlIHdhbnQgdG8gZGVlcCBjb3B5IGFuIG9iamVjdCBvciBub3QuXHJcbiAqIE5vdGU6IEluIEVTNiBpdCBpcyBwb3NzaWJsZSB0byBtb2RpZnkgYW4gb2JqZWN0J3MgU3ltYm9sLnRvU3RyaW5nVGFnIHByb3BlcnR5LCB3aGljaCB3aWxsXHJcbiAqIGNoYW5nZSB0aGUgdmFsdWUgcmV0dXJuZWQgYnkgYHRvU3RyaW5nYC4gVGhpcyBpcyBhIHJhcmUgZWRnZSBjYXNlIHRoYXQgaXMgZGlmZmljdWx0IHRvIGhhbmRsZSxcclxuICogc28gaXQgaXMgbm90IGhhbmRsZWQgaGVyZS5cclxuICogQHBhcmFtICB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2tcclxuICogQHJldHVybiAgICAgICBJZiB0aGUgdmFsdWUgaXMgY29lcmNpYmxlIGludG8gYW4gT2JqZWN0XHJcbiAqL1xyXG5mdW5jdGlvbiBzaG91bGREZWVwQ29weU9iamVjdCh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xyXG59XHJcbmZ1bmN0aW9uIGNvcHlBcnJheShhcnJheSwgaW5oZXJpdGVkKSB7XHJcbiAgICByZXR1cm4gYXJyYXkubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvcHlBcnJheShpdGVtLCBpbmhlcml0ZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gIXNob3VsZERlZXBDb3B5T2JqZWN0KGl0ZW0pXHJcbiAgICAgICAgICAgID8gaXRlbVxyXG4gICAgICAgICAgICA6IF9taXhpbih7XHJcbiAgICAgICAgICAgICAgICBkZWVwOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgaW5oZXJpdGVkOiBpbmhlcml0ZWQsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2VzOiBbaXRlbV0sXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHt9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gX21peGluKGt3QXJncykge1xyXG4gICAgdmFyIGRlZXAgPSBrd0FyZ3MuZGVlcDtcclxuICAgIHZhciBpbmhlcml0ZWQgPSBrd0FyZ3MuaW5oZXJpdGVkO1xyXG4gICAgdmFyIHRhcmdldCA9IGt3QXJncy50YXJnZXQ7XHJcbiAgICB2YXIgY29waWVkID0ga3dBcmdzLmNvcGllZCB8fCBbXTtcclxuICAgIHZhciBjb3BpZWRDbG9uZSA9IHRzbGliXzEuX19zcHJlYWQoY29waWVkKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga3dBcmdzLnNvdXJjZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgc291cmNlID0ga3dBcmdzLnNvdXJjZXNbaV07XHJcbiAgICAgICAgaWYgKHNvdXJjZSA9PT0gbnVsbCB8fCBzb3VyY2UgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xyXG4gICAgICAgICAgICBpZiAoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBzb3VyY2Vba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmIChjb3BpZWRDbG9uZS5pbmRleE9mKHZhbHVlKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChkZWVwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY29weUFycmF5KHZhbHVlLCBpbmhlcml0ZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzaG91bGREZWVwQ29weU9iamVjdCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldFZhbHVlID0gdGFyZ2V0W2tleV0gfHwge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvcGllZC5wdXNoKHNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gX21peGluKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmhlcml0ZWQ6IGluaGVyaXRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZXM6IFt2YWx1ZV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRhcmdldFZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29waWVkOiBjb3BpZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0YXJnZXQ7XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlKHByb3RvdHlwZSkge1xyXG4gICAgdmFyIG1peGlucyA9IFtdO1xyXG4gICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICBtaXhpbnNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICB9XHJcbiAgICBpZiAoIW1peGlucy5sZW5ndGgpIHtcclxuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignbGFuZy5jcmVhdGUgcmVxdWlyZXMgYXQgbGVhc3Qgb25lIG1peGluIG9iamVjdC4nKTtcclxuICAgIH1cclxuICAgIHZhciBhcmdzID0gbWl4aW5zLnNsaWNlKCk7XHJcbiAgICBhcmdzLnVuc2hpZnQoT2JqZWN0LmNyZWF0ZShwcm90b3R5cGUpKTtcclxuICAgIHJldHVybiBvYmplY3RfMS5hc3NpZ24uYXBwbHkobnVsbCwgYXJncyk7XHJcbn1cclxuZXhwb3J0cy5jcmVhdGUgPSBjcmVhdGU7XHJcbmZ1bmN0aW9uIGRlZXBBc3NpZ24odGFyZ2V0KSB7XHJcbiAgICB2YXIgc291cmNlcyA9IFtdO1xyXG4gICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICBzb3VyY2VzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9taXhpbih7XHJcbiAgICAgICAgZGVlcDogdHJ1ZSxcclxuICAgICAgICBpbmhlcml0ZWQ6IGZhbHNlLFxyXG4gICAgICAgIHNvdXJjZXM6IHNvdXJjZXMsXHJcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXRcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuZGVlcEFzc2lnbiA9IGRlZXBBc3NpZ247XHJcbmZ1bmN0aW9uIGRlZXBNaXhpbih0YXJnZXQpIHtcclxuICAgIHZhciBzb3VyY2VzID0gW107XHJcbiAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIHNvdXJjZXNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX21peGluKHtcclxuICAgICAgICBkZWVwOiB0cnVlLFxyXG4gICAgICAgIGluaGVyaXRlZDogdHJ1ZSxcclxuICAgICAgICBzb3VyY2VzOiBzb3VyY2VzLFxyXG4gICAgICAgIHRhcmdldDogdGFyZ2V0XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmRlZXBNaXhpbiA9IGRlZXBNaXhpbjtcclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBuZXcgb2JqZWN0IHVzaW5nIHRoZSBwcm92aWRlZCBzb3VyY2UncyBwcm90b3R5cGUgYXMgdGhlIHByb3RvdHlwZSBmb3IgdGhlIG5ldyBvYmplY3QsIGFuZCB0aGVuXHJcbiAqIGRlZXAgY29waWVzIHRoZSBwcm92aWRlZCBzb3VyY2UncyB2YWx1ZXMgaW50byB0aGUgbmV3IHRhcmdldC5cclxuICpcclxuICogQHBhcmFtIHNvdXJjZSBUaGUgb2JqZWN0IHRvIGR1cGxpY2F0ZVxyXG4gKiBAcmV0dXJuIFRoZSBuZXcgb2JqZWN0XHJcbiAqL1xyXG5mdW5jdGlvbiBkdXBsaWNhdGUoc291cmNlKSB7XHJcbiAgICB2YXIgdGFyZ2V0ID0gT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2Yoc291cmNlKSk7XHJcbiAgICByZXR1cm4gZGVlcE1peGluKHRhcmdldCwgc291cmNlKTtcclxufVxyXG5leHBvcnRzLmR1cGxpY2F0ZSA9IGR1cGxpY2F0ZTtcclxuLyoqXHJcbiAqIERldGVybWluZXMgd2hldGhlciB0d28gdmFsdWVzIGFyZSB0aGUgc2FtZSB2YWx1ZS5cclxuICpcclxuICogQHBhcmFtIGEgRmlyc3QgdmFsdWUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0gYiBTZWNvbmQgdmFsdWUgdG8gY29tcGFyZVxyXG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlcyBhcmUgdGhlIHNhbWU7IGZhbHNlIG90aGVyd2lzZVxyXG4gKi9cclxuZnVuY3Rpb24gaXNJZGVudGljYWwoYSwgYikge1xyXG4gICAgcmV0dXJuIChhID09PSBiIHx8XHJcbiAgICAgICAgLyogYm90aCB2YWx1ZXMgYXJlIE5hTiAqL1xyXG4gICAgICAgIChhICE9PSBhICYmIGIgIT09IGIpKTtcclxufVxyXG5leHBvcnRzLmlzSWRlbnRpY2FsID0gaXNJZGVudGljYWw7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBiaW5kcyBhIG1ldGhvZCB0byB0aGUgc3BlY2lmaWVkIG9iamVjdCBhdCBydW50aW1lLiBUaGlzIGlzIHNpbWlsYXIgdG9cclxuICogYEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kYCwgYnV0IGluc3RlYWQgb2YgYSBmdW5jdGlvbiBpdCB0YWtlcyB0aGUgbmFtZSBvZiBhIG1ldGhvZCBvbiBhbiBvYmplY3QuXHJcbiAqIEFzIGEgcmVzdWx0LCB0aGUgZnVuY3Rpb24gcmV0dXJuZWQgYnkgYGxhdGVCaW5kYCB3aWxsIGFsd2F5cyBjYWxsIHRoZSBmdW5jdGlvbiBjdXJyZW50bHkgYXNzaWduZWQgdG9cclxuICogdGhlIHNwZWNpZmllZCBwcm9wZXJ0eSBvbiB0aGUgb2JqZWN0IGFzIG9mIHRoZSBtb21lbnQgdGhlIGZ1bmN0aW9uIGl0IHJldHVybnMgaXMgY2FsbGVkLlxyXG4gKlxyXG4gKiBAcGFyYW0gaW5zdGFuY2UgVGhlIGNvbnRleHQgb2JqZWN0XHJcbiAqIEBwYXJhbSBtZXRob2QgVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCBvbiB0aGUgY29udGV4dCBvYmplY3QgdG8gYmluZCB0byBpdHNlbGZcclxuICogQHBhcmFtIHN1cHBsaWVkQXJncyBBbiBvcHRpb25hbCBhcnJheSBvZiB2YWx1ZXMgdG8gcHJlcGVuZCB0byB0aGUgYGluc3RhbmNlW21ldGhvZF1gIGFyZ3VtZW50cyBsaXN0XHJcbiAqIEByZXR1cm4gVGhlIGJvdW5kIGZ1bmN0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBsYXRlQmluZChpbnN0YW5jZSwgbWV0aG9kKSB7XHJcbiAgICB2YXIgc3VwcGxpZWRBcmdzID0gW107XHJcbiAgICBmb3IgKHZhciBfaSA9IDI7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIHN1cHBsaWVkQXJnc1tfaSAtIDJdID0gYXJndW1lbnRzW19pXTtcclxuICAgIH1cclxuICAgIHJldHVybiBzdXBwbGllZEFyZ3MubGVuZ3RoXHJcbiAgICAgICAgPyBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA/IHN1cHBsaWVkQXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSA6IHN1cHBsaWVkQXJncztcclxuICAgICAgICAgICAgLy8gVFM3MDE3XHJcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZVttZXRob2RdLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vIFRTNzAxN1xyXG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2VbbWV0aG9kXS5hcHBseShpbnN0YW5jZSwgYXJndW1lbnRzKTtcclxuICAgICAgICB9O1xyXG59XHJcbmV4cG9ydHMubGF0ZUJpbmQgPSBsYXRlQmluZDtcclxuZnVuY3Rpb24gbWl4aW4odGFyZ2V0KSB7XHJcbiAgICB2YXIgc291cmNlcyA9IFtdO1xyXG4gICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICBzb3VyY2VzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9taXhpbih7XHJcbiAgICAgICAgZGVlcDogZmFsc2UsXHJcbiAgICAgICAgaW5oZXJpdGVkOiB0cnVlLFxyXG4gICAgICAgIHNvdXJjZXM6IHNvdXJjZXMsXHJcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXRcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMubWl4aW4gPSBtaXhpbjtcclxuLyoqXHJcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB3aGljaCBpbnZva2VzIHRoZSBnaXZlbiBmdW5jdGlvbiB3aXRoIHRoZSBnaXZlbiBhcmd1bWVudHMgcHJlcGVuZGVkIHRvIGl0cyBhcmd1bWVudCBsaXN0LlxyXG4gKiBMaWtlIGBGdW5jdGlvbi5wcm90b3R5cGUuYmluZGAsIGJ1dCBkb2VzIG5vdCBhbHRlciBleGVjdXRpb24gY29udGV4dC5cclxuICpcclxuICogQHBhcmFtIHRhcmdldEZ1bmN0aW9uIFRoZSBmdW5jdGlvbiB0aGF0IG5lZWRzIHRvIGJlIGJvdW5kXHJcbiAqIEBwYXJhbSBzdXBwbGllZEFyZ3MgQW4gb3B0aW9uYWwgYXJyYXkgb2YgYXJndW1lbnRzIHRvIHByZXBlbmQgdG8gdGhlIGB0YXJnZXRGdW5jdGlvbmAgYXJndW1lbnRzIGxpc3RcclxuICogQHJldHVybiBUaGUgYm91bmQgZnVuY3Rpb25cclxuICovXHJcbmZ1bmN0aW9uIHBhcnRpYWwodGFyZ2V0RnVuY3Rpb24pIHtcclxuICAgIHZhciBzdXBwbGllZEFyZ3MgPSBbXTtcclxuICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgc3VwcGxpZWRBcmdzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPyBzdXBwbGllZEFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkgOiBzdXBwbGllZEFyZ3M7XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldEZ1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLnBhcnRpYWwgPSBwYXJ0aWFsO1xyXG4vKipcclxuICogUmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhIGRlc3Ryb3kgbWV0aG9kIHRoYXQsIHdoZW4gY2FsbGVkLCBjYWxscyB0aGUgcGFzc2VkLWluIGRlc3RydWN0b3IuXHJcbiAqIFRoaXMgaXMgaW50ZW5kZWQgdG8gcHJvdmlkZSBhIHVuaWZpZWQgaW50ZXJmYWNlIGZvciBjcmVhdGluZyBcInJlbW92ZVwiIC8gXCJkZXN0cm95XCIgaGFuZGxlcnMgZm9yXHJcbiAqIGV2ZW50IGxpc3RlbmVycywgdGltZXJzLCBldGMuXHJcbiAqXHJcbiAqIEBwYXJhbSBkZXN0cnVjdG9yIEEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSBoYW5kbGUncyBgZGVzdHJveWAgbWV0aG9kIGlzIGludm9rZWRcclxuICogQHJldHVybiBUaGUgaGFuZGxlIG9iamVjdFxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlSGFuZGxlKGRlc3RydWN0b3IpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7IH07XHJcbiAgICAgICAgICAgIGRlc3RydWN0b3IuY2FsbCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMuY3JlYXRlSGFuZGxlID0gY3JlYXRlSGFuZGxlO1xyXG4vKipcclxuICogUmV0dXJucyBhIHNpbmdsZSBoYW5kbGUgdGhhdCBjYW4gYmUgdXNlZCB0byBkZXN0cm95IG11bHRpcGxlIGhhbmRsZXMgc2ltdWx0YW5lb3VzbHkuXHJcbiAqXHJcbiAqIEBwYXJhbSBoYW5kbGVzIEFuIGFycmF5IG9mIGhhbmRsZXMgd2l0aCBgZGVzdHJveWAgbWV0aG9kc1xyXG4gKiBAcmV0dXJuIFRoZSBoYW5kbGUgb2JqZWN0XHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVDb21wb3NpdGVIYW5kbGUoKSB7XHJcbiAgICB2YXIgaGFuZGxlcyA9IFtdO1xyXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICBoYW5kbGVzW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY3JlYXRlSGFuZGxlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhhbmRsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaGFuZGxlc1tpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5jcmVhdGVDb21wb3NpdGVIYW5kbGUgPSBjcmVhdGVDb21wb3NpdGVIYW5kbGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vY29yZS9sYW5nLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL2xhbmcuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLyoqXHJcbiAqIFJldHVybnMgYSB2NCBjb21wbGlhbnQgVVVJRC5cclxuICpcclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcbmZ1bmN0aW9uIHV1aWQoKSB7XHJcbiAgICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xyXG4gICAgICAgIHZhciByID0gKE1hdGgucmFuZG9tKCkgKiAxNikgfCAwLCB2ID0gYyA9PT0gJ3gnID8gciA6IChyICYgMHgzKSB8IDB4ODtcclxuICAgICAgICByZXR1cm4gdi50b1N0cmluZygxNik7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSB1dWlkO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvdXVpZC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vY29yZS91dWlkLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmZ1bmN0aW9uIGlzRmVhdHVyZVRlc3RUaGVuYWJsZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHZhbHVlICYmIHZhbHVlLnRoZW47XHJcbn1cclxuLyoqXHJcbiAqIEEgY2FjaGUgb2YgcmVzdWx0cyBvZiBmZWF0dXJlIHRlc3RzXHJcbiAqL1xyXG5leHBvcnRzLnRlc3RDYWNoZSA9IHt9O1xyXG4vKipcclxuICogQSBjYWNoZSBvZiB0aGUgdW4tcmVzb2x2ZWQgZmVhdHVyZSB0ZXN0c1xyXG4gKi9cclxuZXhwb3J0cy50ZXN0RnVuY3Rpb25zID0ge307XHJcbi8qKlxyXG4gKiBBIGNhY2hlIG9mIHVucmVzb2x2ZWQgdGhlbmFibGVzIChwcm9iYWJseSBwcm9taXNlcylcclxuICogQHR5cGUge3t9fVxyXG4gKi9cclxudmFyIHRlc3RUaGVuYWJsZXMgPSB7fTtcclxuLyoqXHJcbiAqIEEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgc2NvcGUgKGB3aW5kb3dgIGluIGEgYnJvd3NlciwgYGdsb2JhbGAgaW4gTm9kZUpTKVxyXG4gKi9cclxudmFyIGdsb2JhbFNjb3BlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvLyBCcm93c2Vyc1xyXG4gICAgICAgIHJldHVybiB3aW5kb3c7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIE5vZGVcclxuICAgICAgICByZXR1cm4gZ2xvYmFsO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgLy8gV2ViIHdvcmtlcnNcclxuICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgIH1cclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICByZXR1cm4ge307XHJcbn0pKCk7XHJcbi8qIEdyYWIgdGhlIHN0YXRpY0ZlYXR1cmVzIGlmIHRoZXJlIGFyZSBhdmFpbGFibGUgKi9cclxudmFyIHN0YXRpY0ZlYXR1cmVzID0gKGdsb2JhbFNjb3BlLkRvam9IYXNFbnZpcm9ubWVudCB8fCB7fSkuc3RhdGljRmVhdHVyZXM7XHJcbi8qIENsZWFuaW5nIHVwIHRoZSBEb2pvSGFzRW52aW9ybm1lbnQgKi9cclxuaWYgKCdEb2pvSGFzRW52aXJvbm1lbnQnIGluIGdsb2JhbFNjb3BlKSB7XHJcbiAgICBkZWxldGUgZ2xvYmFsU2NvcGUuRG9qb0hhc0Vudmlyb25tZW50O1xyXG59XHJcbi8qKlxyXG4gKiBDdXN0b20gdHlwZSBndWFyZCB0byBuYXJyb3cgdGhlIGBzdGF0aWNGZWF0dXJlc2AgdG8gZWl0aGVyIGEgbWFwIG9yIGEgZnVuY3Rpb24gdGhhdFxyXG4gKiByZXR1cm5zIGEgbWFwLlxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIGd1YXJkIGZvclxyXG4gKi9cclxuZnVuY3Rpb24gaXNTdGF0aWNGZWF0dXJlRnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XHJcbn1cclxuLyoqXHJcbiAqIFRoZSBjYWNoZSBvZiBhc3NlcnRlZCBmZWF0dXJlcyB0aGF0IHdlcmUgYXZhaWxhYmxlIGluIHRoZSBnbG9iYWwgc2NvcGUgd2hlbiB0aGVcclxuICogbW9kdWxlIGxvYWRlZFxyXG4gKi9cclxudmFyIHN0YXRpY0NhY2hlID0gc3RhdGljRmVhdHVyZXNcclxuICAgID8gaXNTdGF0aWNGZWF0dXJlRnVuY3Rpb24oc3RhdGljRmVhdHVyZXMpID8gc3RhdGljRmVhdHVyZXMuYXBwbHkoZ2xvYmFsU2NvcGUpIDogc3RhdGljRmVhdHVyZXNcclxuICAgIDoge307LyogUHJvdmlkaW5nIGFuIGVtcHR5IGNhY2hlLCBpZiBub25lIHdhcyBpbiB0aGUgZW52aXJvbm1lbnRcclxuXHJcbi8qKlxyXG4qIEFNRCBwbHVnaW4gZnVuY3Rpb24uXHJcbipcclxuKiBDb25kaXRpb25hbCBsb2FkcyBtb2R1bGVzIGJhc2VkIG9uIGEgaGFzIGZlYXR1cmUgdGVzdCB2YWx1ZS5cclxuKlxyXG4qIEBwYXJhbSByZXNvdXJjZUlkIEdpdmVzIHRoZSByZXNvbHZlZCBtb2R1bGUgaWQgdG8gbG9hZC5cclxuKiBAcGFyYW0gcmVxdWlyZSBUaGUgbG9hZGVyIHJlcXVpcmUgZnVuY3Rpb24gd2l0aCByZXNwZWN0IHRvIHRoZSBtb2R1bGUgdGhhdCBjb250YWluZWQgdGhlIHBsdWdpbiByZXNvdXJjZSBpbiBpdHNcclxuKiAgICAgICAgICAgICAgICBkZXBlbmRlbmN5IGxpc3QuXHJcbiogQHBhcmFtIGxvYWQgQ2FsbGJhY2sgdG8gbG9hZGVyIHRoYXQgY29uc3VtZXMgcmVzdWx0IG9mIHBsdWdpbiBkZW1hbmQuXHJcbiovXHJcbmZ1bmN0aW9uIGxvYWQocmVzb3VyY2VJZCwgcmVxdWlyZSwgbG9hZCwgY29uZmlnKSB7XHJcbiAgICByZXNvdXJjZUlkID8gcmVxdWlyZShbcmVzb3VyY2VJZF0sIGxvYWQpIDogbG9hZCgpO1xyXG59XHJcbmV4cG9ydHMubG9hZCA9IGxvYWQ7XHJcbi8qKlxyXG4gKiBBTUQgcGx1Z2luIGZ1bmN0aW9uLlxyXG4gKlxyXG4gKiBSZXNvbHZlcyByZXNvdXJjZUlkIGludG8gYSBtb2R1bGUgaWQgYmFzZWQgb24gcG9zc2libHktbmVzdGVkIHRlbmFyeSBleHByZXNzaW9uIHRoYXQgYnJhbmNoZXMgb24gaGFzIGZlYXR1cmUgdGVzdFxyXG4gKiB2YWx1ZShzKS5cclxuICpcclxuICogQHBhcmFtIHJlc291cmNlSWQgVGhlIGlkIG9mIHRoZSBtb2R1bGVcclxuICogQHBhcmFtIG5vcm1hbGl6ZSBSZXNvbHZlcyBhIHJlbGF0aXZlIG1vZHVsZSBpZCBpbnRvIGFuIGFic29sdXRlIG1vZHVsZSBpZFxyXG4gKi9cclxuZnVuY3Rpb24gbm9ybWFsaXplKHJlc291cmNlSWQsIG5vcm1hbGl6ZSkge1xyXG4gICAgdmFyIHRva2VucyA9IHJlc291cmNlSWQubWF0Y2goL1tcXD86XXxbXjpcXD9dKi9nKSB8fCBbXTtcclxuICAgIHZhciBpID0gMDtcclxuICAgIGZ1bmN0aW9uIGdldChza2lwKSB7XHJcbiAgICAgICAgdmFyIHRlcm0gPSB0b2tlbnNbaSsrXTtcclxuICAgICAgICBpZiAodGVybSA9PT0gJzonKSB7XHJcbiAgICAgICAgICAgIC8vIGVtcHR5IHN0cmluZyBtb2R1bGUgbmFtZSwgcmVzb2x2ZXMgdG8gbnVsbFxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHBvc3RmaXhlZCB3aXRoIGEgPyBtZWFucyBpdCBpcyBhIGZlYXR1cmUgdG8gYnJhbmNoIG9uLCB0aGUgdGVybSBpcyB0aGUgbmFtZSBvZiB0aGUgZmVhdHVyZVxyXG4gICAgICAgICAgICBpZiAodG9rZW5zW2krK10gPT09ICc/Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFza2lwICYmIGhhcyh0ZXJtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoZWQgdGhlIGZlYXR1cmUsIGdldCB0aGUgZmlyc3QgdmFsdWUgZnJvbSB0aGUgb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGRpZCBub3QgbWF0Y2gsIGdldCB0aGUgc2Vjb25kIHZhbHVlLCBwYXNzaW5nIG92ZXIgdGhlIGZpcnN0XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXQoc2tpcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gYSBtb2R1bGVcclxuICAgICAgICAgICAgcmV0dXJuIHRlcm07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIGlkID0gZ2V0KCk7XHJcbiAgICByZXR1cm4gaWQgJiYgbm9ybWFsaXplKGlkKTtcclxufVxyXG5leHBvcnRzLm5vcm1hbGl6ZSA9IG5vcm1hbGl6ZTtcclxuLyoqXHJcbiAqIENoZWNrIGlmIGEgZmVhdHVyZSBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWRcclxuICpcclxuICogQHBhcmFtIGZlYXR1cmUgdGhlIG5hbWUgb2YgdGhlIGZlYXR1cmVcclxuICovXHJcbmZ1bmN0aW9uIGV4aXN0cyhmZWF0dXJlKSB7XHJcbiAgICB2YXIgbm9ybWFsaXplZEZlYXR1cmUgPSBmZWF0dXJlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICByZXR1cm4gQm9vbGVhbihub3JtYWxpemVkRmVhdHVyZSBpbiBzdGF0aWNDYWNoZSB8fCBub3JtYWxpemVkRmVhdHVyZSBpbiBleHBvcnRzLnRlc3RDYWNoZSB8fCBleHBvcnRzLnRlc3RGdW5jdGlvbnNbbm9ybWFsaXplZEZlYXR1cmVdKTtcclxufVxyXG5leHBvcnRzLmV4aXN0cyA9IGV4aXN0cztcclxuLyoqXHJcbiAqIFJlZ2lzdGVyIGEgbmV3IHRlc3QgZm9yIGEgbmFtZWQgZmVhdHVyZS5cclxuICpcclxuICogQGV4YW1wbGVcclxuICogaGFzLmFkZCgnZG9tLWFkZGV2ZW50bGlzdGVuZXInLCAhIWRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpO1xyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBoYXMuYWRkKCd0b3VjaC1ldmVudHMnLCBmdW5jdGlvbiAoKSB7XHJcbiAqICAgIHJldHVybiAnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudFxyXG4gKiB9KTtcclxuICpcclxuICogQHBhcmFtIGZlYXR1cmUgdGhlIG5hbWUgb2YgdGhlIGZlYXR1cmVcclxuICogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSByZXBvcnRlZCBvZiB0aGUgZmVhdHVyZSwgb3IgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgb25jZSBvbiBmaXJzdCB0ZXN0XHJcbiAqIEBwYXJhbSBvdmVyd3JpdGUgaWYgYW4gZXhpc3RpbmcgdmFsdWUgc2hvdWxkIGJlIG92ZXJ3cml0dGVuLiBEZWZhdWx0cyB0byBmYWxzZS5cclxuICovXHJcbmZ1bmN0aW9uIGFkZChmZWF0dXJlLCB2YWx1ZSwgb3ZlcndyaXRlKSB7XHJcbiAgICBpZiAob3ZlcndyaXRlID09PSB2b2lkIDApIHsgb3ZlcndyaXRlID0gZmFsc2U7IH1cclxuICAgIHZhciBub3JtYWxpemVkRmVhdHVyZSA9IGZlYXR1cmUudG9Mb3dlckNhc2UoKTtcclxuICAgIGlmIChleGlzdHMobm9ybWFsaXplZEZlYXR1cmUpICYmICFvdmVyd3JpdGUgJiYgIShub3JtYWxpemVkRmVhdHVyZSBpbiBzdGF0aWNDYWNoZSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRmVhdHVyZSBcXFwiXCIgKyBmZWF0dXJlICsgXCJcXFwiIGV4aXN0cyBhbmQgb3ZlcndyaXRlIG5vdCB0cnVlLlwiKTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBleHBvcnRzLnRlc3RGdW5jdGlvbnNbbm9ybWFsaXplZEZlYXR1cmVdID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc0ZlYXR1cmVUZXN0VGhlbmFibGUodmFsdWUpKSB7XHJcbiAgICAgICAgdGVzdFRoZW5hYmxlc1tmZWF0dXJlXSA9IHZhbHVlLnRoZW4oZnVuY3Rpb24gKHJlc29sdmVkVmFsdWUpIHtcclxuICAgICAgICAgICAgZXhwb3J0cy50ZXN0Q2FjaGVbZmVhdHVyZV0gPSByZXNvbHZlZFZhbHVlO1xyXG4gICAgICAgICAgICBkZWxldGUgdGVzdFRoZW5hYmxlc1tmZWF0dXJlXTtcclxuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0ZXN0VGhlbmFibGVzW2ZlYXR1cmVdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZXhwb3J0cy50ZXN0Q2FjaGVbbm9ybWFsaXplZEZlYXR1cmVdID0gdmFsdWU7XHJcbiAgICAgICAgZGVsZXRlIGV4cG9ydHMudGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5hZGQgPSBhZGQ7XHJcbi8qKlxyXG4gKiBSZXR1cm4gdGhlIGN1cnJlbnQgdmFsdWUgb2YgYSBuYW1lZCBmZWF0dXJlLlxyXG4gKlxyXG4gKiBAcGFyYW0gZmVhdHVyZSBUaGUgbmFtZSAoaWYgYSBzdHJpbmcpIG9yIGlkZW50aWZpZXIgKGlmIGFuIGludGVnZXIpIG9mIHRoZSBmZWF0dXJlIHRvIHRlc3QuXHJcbiAqL1xyXG5mdW5jdGlvbiBoYXMoZmVhdHVyZSkge1xyXG4gICAgdmFyIHJlc3VsdDtcclxuICAgIHZhciBub3JtYWxpemVkRmVhdHVyZSA9IGZlYXR1cmUudG9Mb3dlckNhc2UoKTtcclxuICAgIGlmIChub3JtYWxpemVkRmVhdHVyZSBpbiBzdGF0aWNDYWNoZSkge1xyXG4gICAgICAgIHJlc3VsdCA9IHN0YXRpY0NhY2hlW25vcm1hbGl6ZWRGZWF0dXJlXTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGV4cG9ydHMudGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV0pIHtcclxuICAgICAgICByZXN1bHQgPSBleHBvcnRzLnRlc3RDYWNoZVtub3JtYWxpemVkRmVhdHVyZV0gPSBleHBvcnRzLnRlc3RGdW5jdGlvbnNbbm9ybWFsaXplZEZlYXR1cmVdLmNhbGwobnVsbCk7XHJcbiAgICAgICAgZGVsZXRlIGV4cG9ydHMudGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChub3JtYWxpemVkRmVhdHVyZSBpbiBleHBvcnRzLnRlc3RDYWNoZSkge1xyXG4gICAgICAgIHJlc3VsdCA9IGV4cG9ydHMudGVzdENhY2hlW25vcm1hbGl6ZWRGZWF0dXJlXTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGZlYXR1cmUgaW4gdGVzdFRoZW5hYmxlcykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJBdHRlbXB0IHRvIGRldGVjdCB1bnJlZ2lzdGVyZWQgaGFzIGZlYXR1cmUgXFxcIlwiICsgZmVhdHVyZSArIFwiXFxcIlwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gaGFzO1xyXG4vKlxyXG4gKiBPdXQgb2YgdGhlIGJveCBmZWF0dXJlIHRlc3RzXHJcbiAqL1xyXG4vKiBFbnZpcm9ubWVudHMgKi9cclxuLyogVXNlZCBhcyBhIHZhbHVlIHRvIHByb3ZpZGUgYSBkZWJ1ZyBvbmx5IGNvZGUgcGF0aCAqL1xyXG5hZGQoJ2RlYnVnJywgdHJ1ZSk7XHJcbi8qIERldGVjdHMgaWYgdGhlIGVudmlyb25tZW50IGlzIFwiYnJvd3NlciBsaWtlXCIgKi9cclxuYWRkKCdob3N0LWJyb3dzZXInLCB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBsb2NhdGlvbiAhPT0gJ3VuZGVmaW5lZCcpO1xyXG4vKiBEZXRlY3RzIGlmIHRoZSBlbnZpcm9ubWVudCBhcHBlYXJzIHRvIGJlIE5vZGVKUyAqL1xyXG5hZGQoJ2hvc3Qtbm9kZScsIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ29iamVjdCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGUpIHtcclxuICAgICAgICByZXR1cm4gcHJvY2Vzcy52ZXJzaW9ucy5ub2RlO1xyXG4gICAgfVxyXG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9oYXMvaGFzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9oYXMvaGFzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi9nbG9iYWxcIik7XHJcbnZhciBvYmplY3RfMSA9IHJlcXVpcmUoXCIuL29iamVjdFwiKTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9oYXNcIik7XHJcbnJlcXVpcmUoXCIuL1N5bWJvbFwiKTtcclxuZXhwb3J0cy5NYXAgPSBnbG9iYWxfMS5kZWZhdWx0Lk1hcDtcclxuaWYgKCFoYXNfMS5kZWZhdWx0KCdlczYtbWFwJykpIHtcclxuICAgIGV4cG9ydHMuTWFwID0gKF9hID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBNYXAoaXRlcmFibGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2tleXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpc1tTeW1ib2wudG9TdHJpbmdUYWddID0gJ01hcCc7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlcmFibGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlcmF0b3JfMS5pc0FycmF5TGlrZShpdGVyYWJsZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVyYWJsZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gaXRlcmFibGVbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCh2YWx1ZVswXSwgdmFsdWVbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaXRlcmFibGVfMSA9IHRzbGliXzEuX192YWx1ZXMoaXRlcmFibGUpLCBpdGVyYWJsZV8xXzEgPSBpdGVyYWJsZV8xLm5leHQoKTsgIWl0ZXJhYmxlXzFfMS5kb25lOyBpdGVyYWJsZV8xXzEgPSBpdGVyYWJsZV8xLm5leHQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGl0ZXJhYmxlXzFfMS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldCh2YWx1ZVswXSwgdmFsdWVbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlcmFibGVfMV8xICYmICFpdGVyYWJsZV8xXzEuZG9uZSAmJiAoX2EgPSBpdGVyYWJsZV8xLnJldHVybikpIF9hLmNhbGwoaXRlcmFibGVfMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgZV8xLCBfYTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQW4gYWx0ZXJuYXRpdmUgdG8gQXJyYXkucHJvdG90eXBlLmluZGV4T2YgdXNpbmcgT2JqZWN0LmlzXHJcbiAgICAgICAgICAgICAqIHRvIGNoZWNrIGZvciBlcXVhbGl0eS4gU2VlIGh0dHA6Ly9temwubGEvMXp1S08yVlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5faW5kZXhPZktleSA9IGZ1bmN0aW9uIChrZXlzLCBrZXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGhfMSA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoXzE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmplY3RfMS5pcyhrZXlzW2ldLCBrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hcC5wcm90b3R5cGUsIFwic2l6ZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fa2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2tleXMubGVuZ3RoID0gdGhpcy5fdmFsdWVzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2tleXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gdGhpcy5fa2V5cy5tYXAoZnVuY3Rpb24gKGtleSwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBba2V5LCBfdGhpcy5fdmFsdWVzW2ldXTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBpdGVyYXRvcl8xLlNoaW1JdGVyYXRvcih2YWx1ZXMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNYXAucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gdGhpcy5fa2V5cztcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZXMgPSB0aGlzLl92YWx1ZXM7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoXzIgPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aF8yOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHZhbHVlc1tpXSwga2V5c1tpXSwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IHRoaXMuX3ZhbHVlc1tpbmRleF07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2luZGV4T2ZLZXkodGhpcy5fa2V5cywga2V5KSA+IC0xO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNYXAucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGl0ZXJhdG9yXzEuU2hpbUl0ZXJhdG9yKHRoaXMuX2tleXMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9pbmRleE9mS2V5KHRoaXMuX2tleXMsIGtleSk7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IGluZGV4IDwgMCA/IHRoaXMuX2tleXMubGVuZ3RoIDogaW5kZXg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9rZXlzW2luZGV4XSA9IGtleTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlc1tpbmRleF0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNYXAucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgaXRlcmF0b3JfMS5TaGltSXRlcmF0b3IodGhpcy5fdmFsdWVzKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW50cmllcygpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gTWFwO1xyXG4gICAgICAgIH0oKSksXHJcbiAgICAgICAgX2FbU3ltYm9sLnNwZWNpZXNdID0gX2EsXHJcbiAgICAgICAgX2EpO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGV4cG9ydHMuTWFwO1xyXG52YXIgX2E7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9NYXAuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vTWFwLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi9nbG9iYWxcIik7XHJcbnZhciBxdWV1ZV8xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9xdWV1ZVwiKTtcclxucmVxdWlyZShcIi4vU3ltYm9sXCIpO1xyXG52YXIgaGFzXzEgPSByZXF1aXJlKFwiLi9zdXBwb3J0L2hhc1wiKTtcclxuZXhwb3J0cy5TaGltUHJvbWlzZSA9IGdsb2JhbF8xLmRlZmF1bHQuUHJvbWlzZTtcclxuZXhwb3J0cy5pc1RoZW5hYmxlID0gZnVuY3Rpb24gaXNUaGVuYWJsZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nO1xyXG59O1xyXG5pZiAoIWhhc18xLmRlZmF1bHQoJ2VzNi1wcm9taXNlJykpIHtcclxuICAgIGdsb2JhbF8xLmRlZmF1bHQuUHJvbWlzZSA9IGV4cG9ydHMuU2hpbVByb21pc2UgPSAoX2EgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBDcmVhdGVzIGEgbmV3IFByb21pc2UuXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAcGFyYW0gZXhlY3V0b3JcclxuICAgICAgICAgICAgICogVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBpbW1lZGlhdGVseSB3aGVuIHRoZSBQcm9taXNlIGlzIGluc3RhbnRpYXRlZC4gSXQgaXMgcmVzcG9uc2libGUgZm9yXHJcbiAgICAgICAgICAgICAqIHN0YXJ0aW5nIHRoZSBhc3luY2hyb25vdXMgb3BlcmF0aW9uIHdoZW4gaXQgaXMgaW52b2tlZC5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogVGhlIGV4ZWN1dG9yIG11c3QgY2FsbCBlaXRoZXIgdGhlIHBhc3NlZCBgcmVzb2x2ZWAgZnVuY3Rpb24gd2hlbiB0aGUgYXN5bmNocm9ub3VzIG9wZXJhdGlvbiBoYXMgY29tcGxldGVkXHJcbiAgICAgICAgICAgICAqIHN1Y2Nlc3NmdWxseSwgb3IgdGhlIGByZWplY3RgIGZ1bmN0aW9uIHdoZW4gdGhlIG9wZXJhdGlvbiBmYWlscy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3IpIHtcclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoaXMgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IDEgLyogUGVuZGluZyAqLztcclxuICAgICAgICAgICAgICAgIHRoaXNbU3ltYm9sLnRvU3RyaW5nVGFnXSA9ICdQcm9taXNlJztcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogSWYgdHJ1ZSwgdGhlIHJlc29sdXRpb24gb2YgdGhpcyBwcm9taXNlIGlzIGNoYWluZWQgKFwibG9ja2VkIGluXCIpIHRvIGFub3RoZXIgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzQ2hhaW5lZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBXaGV0aGVyIG9yIG5vdCB0aGlzIHByb21pc2UgaXMgaW4gYSByZXNvbHZlZCBzdGF0ZS5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzUmVzb2x2ZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLnN0YXRlICE9PSAxIC8qIFBlbmRpbmcgKi8gfHwgaXNDaGFpbmVkO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogQ2FsbGJhY2tzIHRoYXQgc2hvdWxkIGJlIGludm9rZWQgb25jZSB0aGUgYXN5bmNocm9ub3VzIG9wZXJhdGlvbiBoYXMgY29tcGxldGVkLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIEluaXRpYWxseSBwdXNoZXMgY2FsbGJhY2tzIG9udG8gYSBxdWV1ZSBmb3IgZXhlY3V0aW9uIG9uY2UgdGhpcyBwcm9taXNlIHNldHRsZXMuIEFmdGVyIHRoZSBwcm9taXNlIHNldHRsZXMsXHJcbiAgICAgICAgICAgICAgICAgKiBlbnF1ZXVlcyBjYWxsYmFja3MgZm9yIGV4ZWN1dGlvbiBvbiB0aGUgbmV4dCBldmVudCBsb29wIHR1cm4uXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciB3aGVuRmluaXNoZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBTZXR0bGVzIHRoaXMgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gbmV3U3RhdGUgVGhlIHJlc29sdmVkIHN0YXRlIGZvciB0aGlzIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1R8YW55fSB2YWx1ZSBUaGUgcmVzb2x2ZWQgdmFsdWUgZm9yIHRoaXMgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIHNldHRsZSA9IGZ1bmN0aW9uIChuZXdTdGF0ZSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBBIHByb21pc2UgY2FuIG9ubHkgYmUgc2V0dGxlZCBvbmNlLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy5zdGF0ZSAhPT0gMSAvKiBQZW5kaW5nICovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc3RhdGUgPSBuZXdTdGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5yZXNvbHZlZFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hlbkZpbmlzaGVkID0gcXVldWVfMS5xdWV1ZU1pY3JvVGFzaztcclxuICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IGVucXVldWUgYSBjYWxsYmFjayBydW5uZXIgaWYgdGhlcmUgYXJlIGNhbGxiYWNrcyBzbyB0aGF0IGluaXRpYWxseSBmdWxmaWxsZWQgUHJvbWlzZXMgZG9uJ3QgaGF2ZSB0b1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdhaXQgYW4gZXh0cmEgdHVybi5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tzICYmIGNhbGxiYWNrcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlXzEucXVldWVNaWNyb1Rhc2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb3VudCA9IGNhbGxiYWNrcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrc1tpXS5jYWxsKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3MgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBSZXNvbHZlcyB0aGlzIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIG5ld1N0YXRlIFRoZSByZXNvbHZlZCBzdGF0ZSBmb3IgdGhpcyBwcm9taXNlLlxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtUfGFueX0gdmFsdWUgVGhlIHJlc29sdmVkIHZhbHVlIGZvciB0aGlzIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciByZXNvbHZlID0gZnVuY3Rpb24gKG5ld1N0YXRlLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1Jlc29sdmVkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXhwb3J0cy5pc1RoZW5hYmxlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS50aGVuKHNldHRsZS5iaW5kKG51bGwsIDAgLyogRnVsZmlsbGVkICovKSwgc2V0dGxlLmJpbmQobnVsbCwgMiAvKiBSZWplY3RlZCAqLykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NoYWluZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGxlKG5ld1N0YXRlLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGhlbiA9IGZ1bmN0aW9uIChvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdoZW5GaW5pc2hlZCBpbml0aWFsbHkgcXVldWVzIHVwIGNhbGxiYWNrcyBmb3IgZXhlY3V0aW9uIGFmdGVyIHRoZSBwcm9taXNlIGhhcyBzZXR0bGVkLiBPbmNlIHRoZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwcm9taXNlIGhhcyBzZXR0bGVkLCB3aGVuRmluaXNoZWQgd2lsbCBzY2hlZHVsZSBjYWxsYmFja3MgZm9yIGV4ZWN1dGlvbiBvbiB0aGUgbmV4dCB0dXJuIHRocm91Z2ggdGhlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGV2ZW50IGxvb3AuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoZW5GaW5pc2hlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBfdGhpcy5zdGF0ZSA9PT0gMiAvKiBSZWplY3RlZCAqLyA/IG9uUmVqZWN0ZWQgOiBvbkZ1bGZpbGxlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNhbGxiYWNrKF90aGlzLnJlc29sdmVkVmFsdWUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoX3RoaXMuc3RhdGUgPT09IDIgLyogUmVqZWN0ZWQgKi8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoX3RoaXMucmVzb2x2ZWRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKF90aGlzLnJlc29sdmVkVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dG9yKHJlc29sdmUuYmluZChudWxsLCAwIC8qIEZ1bGZpbGxlZCAqLyksIHJlc29sdmUuYmluZChudWxsLCAyIC8qIFJlamVjdGVkICovKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXR0bGUoMiAvKiBSZWplY3RlZCAqLywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFByb21pc2UuYWxsID0gZnVuY3Rpb24gKGl0ZXJhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29tcGxldGUgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3RhbCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvcHVsYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGwoaW5kZXgsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlc1tpbmRleF0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKytjb21wbGV0ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmluaXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZpbmlzaCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvcHVsYXRpbmcgfHwgY29tcGxldGUgPCB0b3RhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodmFsdWVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc0l0ZW0oaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyt0b3RhbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4cG9ydHMuaXNUaGVuYWJsZShpdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgYW4gaXRlbSBQcm9taXNlIHJlamVjdHMsIHRoaXMgUHJvbWlzZSBpcyBpbW1lZGlhdGVseSByZWplY3RlZCB3aXRoIHRoZSBpdGVtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQcm9taXNlJ3MgcmVqZWN0aW9uIGVycm9yLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS50aGVuKGZ1bGZpbGwuYmluZChudWxsLCBpbmRleCksIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQcm9taXNlLnJlc29sdmUoaXRlbSkudGhlbihmdWxmaWxsLmJpbmQobnVsbCwgaW5kZXgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaXRlcmFibGVfMSA9IHRzbGliXzEuX192YWx1ZXMoaXRlcmFibGUpLCBpdGVyYWJsZV8xXzEgPSBpdGVyYWJsZV8xLm5leHQoKTsgIWl0ZXJhYmxlXzFfMS5kb25lOyBpdGVyYWJsZV8xXzEgPSBpdGVyYWJsZV8xLm5leHQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gaXRlcmFibGVfMV8xLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0l0ZW0oaSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XHJcbiAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlcmFibGVfMV8xICYmICFpdGVyYWJsZV8xXzEuZG9uZSAmJiAoX2EgPSBpdGVyYWJsZV8xLnJldHVybikpIF9hLmNhbGwoaXRlcmFibGVfMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwb3B1bGF0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZmluaXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVfMSwgX2E7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgUHJvbWlzZS5yYWNlID0gZnVuY3Rpb24gKGl0ZXJhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGl0ZXJhYmxlXzIgPSB0c2xpYl8xLl9fdmFsdWVzKGl0ZXJhYmxlKSwgaXRlcmFibGVfMl8xID0gaXRlcmFibGVfMi5uZXh0KCk7ICFpdGVyYWJsZV8yXzEuZG9uZTsgaXRlcmFibGVfMl8xID0gaXRlcmFibGVfMi5uZXh0KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gaXRlcmFibGVfMl8xLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBQcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgYSBQcm9taXNlIGl0ZW0gcmVqZWN0cywgdGhpcyBQcm9taXNlIGlzIGltbWVkaWF0ZWx5IHJlamVjdGVkIHdpdGggdGhlIGl0ZW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQcm9taXNlJ3MgcmVqZWN0aW9uIGVycm9yLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udGhlbihyZXNvbHZlLCByZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKGl0ZW0pLnRoZW4ocmVzb2x2ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVfMl8xKSB7IGVfMiA9IHsgZXJyb3I6IGVfMl8xIH07IH1cclxuICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVyYWJsZV8yXzEgJiYgIWl0ZXJhYmxlXzJfMS5kb25lICYmIChfYSA9IGl0ZXJhYmxlXzIucmV0dXJuKSkgX2EuY2FsbChpdGVyYWJsZV8yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMikgdGhyb3cgZV8yLmVycm9yOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlXzIsIF9hO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0ID0gZnVuY3Rpb24gKHJlYXNvbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBQcm9taXNlLnJlc29sdmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcyhmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFByb21pc2UucHJvdG90eXBlLmNhdGNoID0gZnVuY3Rpb24gKG9uUmVqZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2U7XHJcbiAgICAgICAgfSgpKSxcclxuICAgICAgICBfYVtTeW1ib2wuc3BlY2llc10gPSBleHBvcnRzLlNoaW1Qcm9taXNlLFxyXG4gICAgICAgIF9hKTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBleHBvcnRzLlNoaW1Qcm9taXNlO1xyXG52YXIgX2E7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9Qcm9taXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1Byb21pc2UuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuL2dsb2JhbFwiKTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9oYXNcIik7XHJcbnJlcXVpcmUoXCIuL1N5bWJvbFwiKTtcclxuZXhwb3J0cy5TZXQgPSBnbG9iYWxfMS5kZWZhdWx0LlNldDtcclxuaWYgKCFoYXNfMS5kZWZhdWx0KCdlczYtc2V0JykpIHtcclxuICAgIGV4cG9ydHMuU2V0ID0gKF9hID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBTZXQoaXRlcmFibGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NldERhdGEgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXNbU3ltYm9sLnRvU3RyaW5nVGFnXSA9ICdTZXQnO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZXJhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZXJhdG9yXzEuaXNBcnJheUxpa2UoaXRlcmFibGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlcmFibGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkKGl0ZXJhYmxlW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGl0ZXJhYmxlXzEgPSB0c2xpYl8xLl9fdmFsdWVzKGl0ZXJhYmxlKSwgaXRlcmFibGVfMV8xID0gaXRlcmFibGVfMS5uZXh0KCk7ICFpdGVyYWJsZV8xXzEuZG9uZTsgaXRlcmFibGVfMV8xID0gaXRlcmFibGVfMS5uZXh0KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBpdGVyYWJsZV8xXzEudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGQodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlcmFibGVfMV8xICYmICFpdGVyYWJsZV8xXzEuZG9uZSAmJiAoX2EgPSBpdGVyYWJsZV8xLnJldHVybikpIF9hLmNhbGwoaXRlcmFibGVfMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgZV8xLCBfYTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBTZXQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFzKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0RGF0YS5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTZXQucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0RGF0YS5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTZXQucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGlkeCA9IHRoaXMuX3NldERhdGEuaW5kZXhPZih2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaWR4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX3NldERhdGEuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgU2V0LnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBpdGVyYXRvcl8xLlNoaW1JdGVyYXRvcih0aGlzLl9zZXREYXRhLm1hcChmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIFt2YWx1ZSwgdmFsdWVdOyB9KSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFNldC5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFja2ZuLCB0aGlzQXJnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlcmF0b3IgPSB0aGlzLnZhbHVlcygpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIHdoaWxlICghcmVzdWx0LmRvbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja2ZuLmNhbGwodGhpc0FyZywgcmVzdWx0LnZhbHVlLCByZXN1bHQudmFsdWUsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgU2V0LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZXREYXRhLmluZGV4T2YodmFsdWUpID4gLTE7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFNldC5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgaXRlcmF0b3JfMS5TaGltSXRlcmF0b3IodGhpcy5fc2V0RGF0YSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTZXQucHJvdG90eXBlLCBcInNpemVcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NldERhdGEubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFNldC5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBpdGVyYXRvcl8xLlNoaW1JdGVyYXRvcih0aGlzLl9zZXREYXRhKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgU2V0LnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBpdGVyYXRvcl8xLlNoaW1JdGVyYXRvcih0aGlzLl9zZXREYXRhKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFNldDtcclxuICAgICAgICB9KCkpLFxyXG4gICAgICAgIF9hW1N5bWJvbC5zcGVjaWVzXSA9IF9hLFxyXG4gICAgICAgIF9hKTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBleHBvcnRzLlNldDtcclxudmFyIF9hO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vU2V0LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1NldC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgaGFzXzEgPSByZXF1aXJlKFwiLi9zdXBwb3J0L2hhc1wiKTtcclxudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIi4vZ2xvYmFsXCIpO1xyXG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vc3VwcG9ydC91dGlsXCIpO1xyXG5leHBvcnRzLlN5bWJvbCA9IGdsb2JhbF8xLmRlZmF1bHQuU3ltYm9sO1xyXG5pZiAoIWhhc18xLmRlZmF1bHQoJ2VzNi1zeW1ib2wnKSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaHJvd3MgaWYgdGhlIHZhbHVlIGlzIG5vdCBhIHN5bWJvbCwgdXNlZCBpbnRlcm5hbGx5IHdpdGhpbiB0aGUgU2hpbVxyXG4gICAgICogQHBhcmFtICB7YW55fSAgICB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2tcclxuICAgICAqIEByZXR1cm4ge3N5bWJvbH0gICAgICAgUmV0dXJucyB0aGUgc3ltYm9sIG9yIHRocm93c1xyXG4gICAgICovXHJcbiAgICB2YXIgdmFsaWRhdGVTeW1ib2xfMSA9IGZ1bmN0aW9uIHZhbGlkYXRlU3ltYm9sKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCFpc1N5bWJvbCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcih2YWx1ZSArICcgaXMgbm90IGEgc3ltYm9sJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH07XHJcbiAgICB2YXIgZGVmaW5lUHJvcGVydGllc18xID0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXM7XHJcbiAgICB2YXIgZGVmaW5lUHJvcGVydHlfMSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcclxuICAgIHZhciBjcmVhdGVfMSA9IE9iamVjdC5jcmVhdGU7XHJcbiAgICB2YXIgb2JqUHJvdG90eXBlXzEgPSBPYmplY3QucHJvdG90eXBlO1xyXG4gICAgdmFyIGdsb2JhbFN5bWJvbHNfMSA9IHt9O1xyXG4gICAgdmFyIGdldFN5bWJvbE5hbWVfMSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGNyZWF0ZWQgPSBjcmVhdGVfMShudWxsKTtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGRlc2MpIHtcclxuICAgICAgICAgICAgdmFyIHBvc3RmaXggPSAwO1xyXG4gICAgICAgICAgICB2YXIgbmFtZTtcclxuICAgICAgICAgICAgd2hpbGUgKGNyZWF0ZWRbU3RyaW5nKGRlc2MpICsgKHBvc3RmaXggfHwgJycpXSkge1xyXG4gICAgICAgICAgICAgICAgKytwb3N0Zml4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlc2MgKz0gU3RyaW5nKHBvc3RmaXggfHwgJycpO1xyXG4gICAgICAgICAgICBjcmVhdGVkW2Rlc2NdID0gdHJ1ZTtcclxuICAgICAgICAgICAgbmFtZSA9ICdAQCcgKyBkZXNjO1xyXG4gICAgICAgICAgICAvLyBGSVhNRTogVGVtcG9yYXJ5IGd1YXJkIHVudGlsIHRoZSBkdXBsaWNhdGUgZXhlY3V0aW9uIHdoZW4gdGVzdGluZyBjYW4gYmVcclxuICAgICAgICAgICAgLy8gcGlubmVkIGRvd24uXHJcbiAgICAgICAgICAgIGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmpQcm90b3R5cGVfMSwgbmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIGRlZmluZVByb3BlcnR5XzEob2JqUHJvdG90eXBlXzEsIG5hbWUsIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eV8xKHRoaXMsIG5hbWUsIHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IodmFsdWUpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmFtZTtcclxuICAgICAgICB9O1xyXG4gICAgfSkoKTtcclxuICAgIHZhciBJbnRlcm5hbFN5bWJvbF8xID0gZnVuY3Rpb24gU3ltYm9sKGRlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBJbnRlcm5hbFN5bWJvbF8xKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1R5cGVFcnJvcjogU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBTeW1ib2woZGVzY3JpcHRpb24pO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuU3ltYm9sID0gZ2xvYmFsXzEuZGVmYXVsdC5TeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woZGVzY3JpcHRpb24pIHtcclxuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFN5bWJvbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUeXBlRXJyb3I6IFN5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc3ltID0gT2JqZWN0LmNyZWF0ZShJbnRlcm5hbFN5bWJvbF8xLnByb3RvdHlwZSk7XHJcbiAgICAgICAgZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkID8gJycgOiBTdHJpbmcoZGVzY3JpcHRpb24pO1xyXG4gICAgICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0aWVzXzEoc3ltLCB7XHJcbiAgICAgICAgICAgIF9fZGVzY3JpcHRpb25fXzogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihkZXNjcmlwdGlvbiksXHJcbiAgICAgICAgICAgIF9fbmFtZV9fOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGdldFN5bWJvbE5hbWVfMShkZXNjcmlwdGlvbikpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyogRGVjb3JhdGUgdGhlIFN5bWJvbCBmdW5jdGlvbiB3aXRoIHRoZSBhcHByb3ByaWF0ZSBwcm9wZXJ0aWVzICovXHJcbiAgICBkZWZpbmVQcm9wZXJ0eV8xKGV4cG9ydHMuU3ltYm9sLCAnZm9yJywgdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgaWYgKGdsb2JhbFN5bWJvbHNfMVtrZXldKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxTeW1ib2xzXzFba2V5XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChnbG9iYWxTeW1ib2xzXzFba2V5XSA9IGV4cG9ydHMuU3ltYm9sKFN0cmluZyhrZXkpKSk7XHJcbiAgICB9KSk7XHJcbiAgICBkZWZpbmVQcm9wZXJ0aWVzXzEoZXhwb3J0cy5TeW1ib2wsIHtcclxuICAgICAgICBrZXlGb3I6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZnVuY3Rpb24gKHN5bSkge1xyXG4gICAgICAgICAgICB2YXIga2V5O1xyXG4gICAgICAgICAgICB2YWxpZGF0ZVN5bWJvbF8xKHN5bSk7XHJcbiAgICAgICAgICAgIGZvciAoa2V5IGluIGdsb2JhbFN5bWJvbHNfMSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGdsb2JhbFN5bWJvbHNfMVtrZXldID09PSBzeW0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgaGFzSW5zdGFuY2U6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCdoYXNJbnN0YW5jZScpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIGlzQ29uY2F0U3ByZWFkYWJsZTogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3IoJ2lzQ29uY2F0U3ByZWFkYWJsZScpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIGl0ZXJhdG9yOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcignaXRlcmF0b3InKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICBtYXRjaDogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3IoJ21hdGNoJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgb2JzZXJ2YWJsZTogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3IoJ29ic2VydmFibGUnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICByZXBsYWNlOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcigncmVwbGFjZScpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIHNlYXJjaDogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3IoJ3NlYXJjaCcpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIHNwZWNpZXM6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCdzcGVjaWVzJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgc3BsaXQ6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCdzcGxpdCcpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIHRvUHJpbWl0aXZlOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcigndG9QcmltaXRpdmUnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICB0b1N0cmluZ1RhZzogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3IoJ3RvU3RyaW5nVGFnJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgdW5zY29wYWJsZXM6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCd1bnNjb3BhYmxlcycpLCBmYWxzZSwgZmFsc2UpXHJcbiAgICB9KTtcclxuICAgIC8qIERlY29yYXRlIHRoZSBJbnRlcm5hbFN5bWJvbCBvYmplY3QgKi9cclxuICAgIGRlZmluZVByb3BlcnRpZXNfMShJbnRlcm5hbFN5bWJvbF8xLnByb3RvdHlwZSwge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sKSxcclxuICAgICAgICB0b1N0cmluZzogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9fbmFtZV9fO1xyXG4gICAgICAgIH0sIGZhbHNlLCBmYWxzZSlcclxuICAgIH0pO1xyXG4gICAgLyogRGVjb3JhdGUgdGhlIFN5bWJvbC5wcm90b3R5cGUgKi9cclxuICAgIGRlZmluZVByb3BlcnRpZXNfMShleHBvcnRzLlN5bWJvbC5wcm90b3R5cGUsIHtcclxuICAgICAgICB0b1N0cmluZzogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnU3ltYm9sICgnICsgdmFsaWRhdGVTeW1ib2xfMSh0aGlzKS5fX2Rlc2NyaXB0aW9uX18gKyAnKSc7XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgdmFsdWVPZjogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWxpZGF0ZVN5bWJvbF8xKHRoaXMpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9KTtcclxuICAgIGRlZmluZVByb3BlcnR5XzEoZXhwb3J0cy5TeW1ib2wucHJvdG90eXBlLCBleHBvcnRzLlN5bWJvbC50b1ByaW1pdGl2ZSwgdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlU3ltYm9sXzEodGhpcyk7XHJcbiAgICB9KSk7XHJcbiAgICBkZWZpbmVQcm9wZXJ0eV8xKGV4cG9ydHMuU3ltYm9sLnByb3RvdHlwZSwgZXhwb3J0cy5TeW1ib2wudG9TdHJpbmdUYWcsIHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoJ1N5bWJvbCcsIGZhbHNlLCBmYWxzZSwgdHJ1ZSkpO1xyXG4gICAgZGVmaW5lUHJvcGVydHlfMShJbnRlcm5hbFN5bWJvbF8xLnByb3RvdHlwZSwgZXhwb3J0cy5TeW1ib2wudG9QcmltaXRpdmUsIHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wucHJvdG90eXBlW2V4cG9ydHMuU3ltYm9sLnRvUHJpbWl0aXZlXSwgZmFsc2UsIGZhbHNlLCB0cnVlKSk7XHJcbiAgICBkZWZpbmVQcm9wZXJ0eV8xKEludGVybmFsU3ltYm9sXzEucHJvdG90eXBlLCBleHBvcnRzLlN5bWJvbC50b1N0cmluZ1RhZywgdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5wcm90b3R5cGVbZXhwb3J0cy5TeW1ib2wudG9TdHJpbmdUYWddLCBmYWxzZSwgZmFsc2UsIHRydWUpKTtcclxufVxyXG4vKipcclxuICogQSBjdXN0b20gZ3VhcmQgZnVuY3Rpb24gdGhhdCBkZXRlcm1pbmVzIGlmIGFuIG9iamVjdCBpcyBhIHN5bWJvbCBvciBub3RcclxuICogQHBhcmFtICB7YW55fSAgICAgICB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2sgdG8gc2VlIGlmIGl0IGlzIGEgc3ltYm9sIG9yIG5vdFxyXG4gKiBAcmV0dXJuIHtpcyBzeW1ib2x9ICAgICAgIFJldHVybnMgdHJ1ZSBpZiBhIHN5bWJvbCBvciBub3QgKGFuZCBuYXJyb3dzIHRoZSB0eXBlIGd1YXJkKVxyXG4gKi9cclxuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcclxuICAgIHJldHVybiAodmFsdWUgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcgfHwgdmFsdWVbJ0BAdG9TdHJpbmdUYWcnXSA9PT0gJ1N5bWJvbCcpKSB8fCBmYWxzZTtcclxufVxyXG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XHJcbi8qKlxyXG4gKiBGaWxsIGFueSBtaXNzaW5nIHdlbGwga25vd24gc3ltYm9scyBpZiB0aGUgbmF0aXZlIFN5bWJvbCBpcyBtaXNzaW5nIHRoZW1cclxuICovXHJcbltcclxuICAgICdoYXNJbnN0YW5jZScsXHJcbiAgICAnaXNDb25jYXRTcHJlYWRhYmxlJyxcclxuICAgICdpdGVyYXRvcicsXHJcbiAgICAnc3BlY2llcycsXHJcbiAgICAncmVwbGFjZScsXHJcbiAgICAnc2VhcmNoJyxcclxuICAgICdzcGxpdCcsXHJcbiAgICAnbWF0Y2gnLFxyXG4gICAgJ3RvUHJpbWl0aXZlJyxcclxuICAgICd0b1N0cmluZ1RhZycsXHJcbiAgICAndW5zY29wYWJsZXMnLFxyXG4gICAgJ29ic2VydmFibGUnXHJcbl0uZm9yRWFjaChmdW5jdGlvbiAod2VsbEtub3duKSB7XHJcbiAgICBpZiAoIWV4cG9ydHMuU3ltYm9sW3dlbGxLbm93bl0pIHtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cy5TeW1ib2wsIHdlbGxLbm93biwgdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3Iod2VsbEtub3duKSwgZmFsc2UsIGZhbHNlKSk7XHJcbiAgICB9XHJcbn0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBleHBvcnRzLlN5bWJvbDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1N5bWJvbC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9TeW1ib2wuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuL2dsb2JhbFwiKTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9oYXNcIik7XHJcbnJlcXVpcmUoXCIuL1N5bWJvbFwiKTtcclxuZXhwb3J0cy5XZWFrTWFwID0gZ2xvYmFsXzEuZGVmYXVsdC5XZWFrTWFwO1xyXG5pZiAoIWhhc18xLmRlZmF1bHQoJ2VzNi13ZWFrbWFwJykpIHtcclxuICAgIHZhciBERUxFVEVEXzEgPSB7fTtcclxuICAgIHZhciBnZXRVSURfMSA9IGZ1bmN0aW9uIGdldFVJRCgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMDAwKTtcclxuICAgIH07XHJcbiAgICB2YXIgZ2VuZXJhdGVOYW1lXzEgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzdGFydElkID0gTWF0aC5mbG9vcihEYXRlLm5vdygpICUgMTAwMDAwMDAwKTtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gZ2VuZXJhdGVOYW1lKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ19fd20nICsgZ2V0VUlEXzEoKSArIChzdGFydElkKysgKyAnX18nKTtcclxuICAgICAgICB9O1xyXG4gICAgfSkoKTtcclxuICAgIGV4cG9ydHMuV2Vha01hcCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBXZWFrTWFwKGl0ZXJhYmxlKSB7XHJcbiAgICAgICAgICAgIHRoaXNbU3ltYm9sLnRvU3RyaW5nVGFnXSA9ICdXZWFrTWFwJztcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdfbmFtZScsIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBnZW5lcmF0ZU5hbWVfMSgpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9mcm96ZW5FbnRyaWVzID0gW107XHJcbiAgICAgICAgICAgIGlmIChpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZXJhdG9yXzEuaXNBcnJheUxpa2UoaXRlcmFibGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVyYWJsZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZXJhYmxlW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldChpdGVtWzBdLCBpdGVtWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpdGVyYWJsZV8xID0gdHNsaWJfMS5fX3ZhbHVlcyhpdGVyYWJsZSksIGl0ZXJhYmxlXzFfMSA9IGl0ZXJhYmxlXzEubmV4dCgpOyAhaXRlcmFibGVfMV8xLmRvbmU7IGl0ZXJhYmxlXzFfMSA9IGl0ZXJhYmxlXzEubmV4dCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgX2EgPSB0c2xpYl8xLl9fcmVhZChpdGVyYWJsZV8xXzEudmFsdWUsIDIpLCBrZXkgPSBfYVswXSwgdmFsdWUgPSBfYVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KGtleSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XHJcbiAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlcmFibGVfMV8xICYmICFpdGVyYWJsZV8xXzEuZG9uZSAmJiAoX2IgPSBpdGVyYWJsZV8xLnJldHVybikpIF9iLmNhbGwoaXRlcmFibGVfMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZV8xLCBfYjtcclxuICAgICAgICB9XHJcbiAgICAgICAgV2Vha01hcC5wcm90b3R5cGUuX2dldEZyb3plbkVudHJ5SW5kZXggPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fZnJvemVuRW50cmllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Zyb3plbkVudHJpZXNbaV0ua2V5ID09PSBrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBXZWFrTWFwLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZW50cnkgPSBrZXlbdGhpcy5fbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChlbnRyeSAmJiBlbnRyeS5rZXkgPT09IGtleSAmJiBlbnRyeS52YWx1ZSAhPT0gREVMRVRFRF8xKSB7XHJcbiAgICAgICAgICAgICAgICBlbnRyeS52YWx1ZSA9IERFTEVURURfMTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBmcm96ZW5JbmRleCA9IHRoaXMuX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5KTtcclxuICAgICAgICAgICAgaWYgKGZyb3plbkluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Zyb3plbkVudHJpZXMuc3BsaWNlKGZyb3plbkluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFdlYWtNYXAucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkIHx8IGtleSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZW50cnkgPSBrZXlbdGhpcy5fbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChlbnRyeSAmJiBlbnRyeS5rZXkgPT09IGtleSAmJiBlbnRyeS52YWx1ZSAhPT0gREVMRVRFRF8xKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZW50cnkudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGZyb3plbkluZGV4ID0gdGhpcy5fZ2V0RnJvemVuRW50cnlJbmRleChrZXkpO1xyXG4gICAgICAgICAgICBpZiAoZnJvemVuSW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Zyb3plbkVudHJpZXNbZnJvemVuSW5kZXhdLnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBXZWFrTWFwLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZW50cnkgPSBrZXlbdGhpcy5fbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChCb29sZWFuKGVudHJ5ICYmIGVudHJ5LmtleSA9PT0ga2V5ICYmIGVudHJ5LnZhbHVlICE9PSBERUxFVEVEXzEpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZnJvemVuSW5kZXggPSB0aGlzLl9nZXRGcm96ZW5FbnRyeUluZGV4KGtleSk7XHJcbiAgICAgICAgICAgIGlmIChmcm96ZW5JbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBXZWFrTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoIWtleSB8fCAodHlwZW9mIGtleSAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIGtleSAhPT0gJ2Z1bmN0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgdmFsdWUgdXNlZCBhcyB3ZWFrIG1hcCBrZXknKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZW50cnkgPSBrZXlbdGhpcy5fbmFtZV07XHJcbiAgICAgICAgICAgIGlmICghZW50cnkgfHwgZW50cnkua2V5ICE9PSBrZXkpIHtcclxuICAgICAgICAgICAgICAgIGVudHJ5ID0gT2JqZWN0LmNyZWF0ZShudWxsLCB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiB7IHZhbHVlOiBrZXkgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmlzRnJvemVuKGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mcm96ZW5FbnRyaWVzLnB1c2goZW50cnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGtleSwgdGhpcy5fbmFtZSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZW50cnlcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbnRyeS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBXZWFrTWFwO1xyXG4gICAgfSgpKTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBleHBvcnRzLldlYWtNYXA7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9XZWFrTWFwLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1dlYWtNYXAuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuL2dsb2JhbFwiKTtcclxudmFyIGl0ZXJhdG9yXzEgPSByZXF1aXJlKFwiLi9pdGVyYXRvclwiKTtcclxudmFyIG51bWJlcl8xID0gcmVxdWlyZShcIi4vbnVtYmVyXCIpO1xyXG52YXIgaGFzXzEgPSByZXF1aXJlKFwiLi9zdXBwb3J0L2hhc1wiKTtcclxudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvdXRpbFwiKTtcclxuaWYgKGhhc18xLmRlZmF1bHQoJ2VzNi1hcnJheScpICYmIGhhc18xLmRlZmF1bHQoJ2VzNi1hcnJheS1maWxsJykpIHtcclxuICAgIGV4cG9ydHMuZnJvbSA9IGdsb2JhbF8xLmRlZmF1bHQuQXJyYXkuZnJvbTtcclxuICAgIGV4cG9ydHMub2YgPSBnbG9iYWxfMS5kZWZhdWx0LkFycmF5Lm9mO1xyXG4gICAgZXhwb3J0cy5jb3B5V2l0aGluID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5BcnJheS5wcm90b3R5cGUuY29weVdpdGhpbik7XHJcbiAgICBleHBvcnRzLmZpbGwgPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LkFycmF5LnByb3RvdHlwZS5maWxsKTtcclxuICAgIGV4cG9ydHMuZmluZCA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuQXJyYXkucHJvdG90eXBlLmZpbmQpO1xyXG4gICAgZXhwb3J0cy5maW5kSW5kZXggPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LkFycmF5LnByb3RvdHlwZS5maW5kSW5kZXgpO1xyXG59XHJcbmVsc2Uge1xyXG4gICAgLy8gSXQgaXMgb25seSBvbGRlciB2ZXJzaW9ucyBvZiBTYWZhcmkvaU9TIHRoYXQgaGF2ZSBhIGJhZCBmaWxsIGltcGxlbWVudGF0aW9uIGFuZCBzbyBhcmVuJ3QgaW4gdGhlIHdpbGRcclxuICAgIC8vIFRvIG1ha2UgdGhpbmdzIGVhc2llciwgaWYgdGhlcmUgaXMgYSBiYWQgZmlsbCBpbXBsZW1lbnRhdGlvbiwgdGhlIHdob2xlIHNldCBvZiBmdW5jdGlvbnMgd2lsbCBiZSBmaWxsZWRcclxuICAgIC8qKlxyXG4gICAgICogRW5zdXJlcyBhIG5vbi1uZWdhdGl2ZSwgbm9uLWluZmluaXRlLCBzYWZlIGludGVnZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGxlbmd0aCBUaGUgbnVtYmVyIHRvIHZhbGlkYXRlXHJcbiAgICAgKiBAcmV0dXJuIEEgcHJvcGVyIGxlbmd0aFxyXG4gICAgICovXHJcbiAgICB2YXIgdG9MZW5ndGhfMSA9IGZ1bmN0aW9uIHRvTGVuZ3RoKGxlbmd0aCkge1xyXG4gICAgICAgIGlmIChpc05hTihsZW5ndGgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKTtcclxuICAgICAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xyXG4gICAgICAgICAgICBsZW5ndGggPSBNYXRoLmZsb29yKGxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEVuc3VyZSBhIG5vbi1uZWdhdGl2ZSwgcmVhbCwgc2FmZSBpbnRlZ2VyXHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KGxlbmd0aCwgMCksIG51bWJlcl8xLk1BWF9TQUZFX0lOVEVHRVIpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRnJvbSBFUzYgNy4xLjQgVG9JbnRlZ2VyKClcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUgQSB2YWx1ZSB0byBjb252ZXJ0XHJcbiAgICAgKiBAcmV0dXJuIEFuIGludGVnZXJcclxuICAgICAqL1xyXG4gICAgdmFyIHRvSW50ZWdlcl8xID0gZnVuY3Rpb24gdG9JbnRlZ2VyKHZhbHVlKSB7XHJcbiAgICAgICAgdmFsdWUgPSBOdW1iZXIodmFsdWUpO1xyXG4gICAgICAgIGlmIChpc05hTih2YWx1ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gMCB8fCAhaXNGaW5pdGUodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICh2YWx1ZSA+IDAgPyAxIDogLTEpICogTWF0aC5mbG9vcihNYXRoLmFicyh2YWx1ZSkpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogTm9ybWFsaXplcyBhbiBvZmZzZXQgYWdhaW5zdCBhIGdpdmVuIGxlbmd0aCwgd3JhcHBpbmcgaXQgaWYgbmVnYXRpdmUuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHZhbHVlIFRoZSBvcmlnaW5hbCBvZmZzZXRcclxuICAgICAqIEBwYXJhbSBsZW5ndGggVGhlIHRvdGFsIGxlbmd0aCB0byBub3JtYWxpemUgYWdhaW5zdFxyXG4gICAgICogQHJldHVybiBJZiBuZWdhdGl2ZSwgcHJvdmlkZSBhIGRpc3RhbmNlIGZyb20gdGhlIGVuZCAobGVuZ3RoKTsgb3RoZXJ3aXNlIHByb3ZpZGUgYSBkaXN0YW5jZSBmcm9tIDBcclxuICAgICAqL1xyXG4gICAgdmFyIG5vcm1hbGl6ZU9mZnNldF8xID0gZnVuY3Rpb24gbm9ybWFsaXplT2Zmc2V0KHZhbHVlLCBsZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gdmFsdWUgPCAwID8gTWF0aC5tYXgobGVuZ3RoICsgdmFsdWUsIDApIDogTWF0aC5taW4odmFsdWUsIGxlbmd0aCk7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5mcm9tID0gZnVuY3Rpb24gZnJvbShhcnJheUxpa2UsIG1hcEZ1bmN0aW9uLCB0aGlzQXJnKSB7XHJcbiAgICAgICAgaWYgKGFycmF5TGlrZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2Zyb206IHJlcXVpcmVzIGFuIGFycmF5LWxpa2Ugb2JqZWN0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtYXBGdW5jdGlvbiAmJiB0aGlzQXJnKSB7XHJcbiAgICAgICAgICAgIG1hcEZ1bmN0aW9uID0gbWFwRnVuY3Rpb24uYmluZCh0aGlzQXJnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWUgKi9cclxuICAgICAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xyXG4gICAgICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aF8xKGFycmF5TGlrZS5sZW5ndGgpO1xyXG4gICAgICAgIC8vIFN1cHBvcnQgZXh0ZW5zaW9uXHJcbiAgICAgICAgdmFyIGFycmF5ID0gdHlwZW9mIENvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nID8gT2JqZWN0KG5ldyBDb25zdHJ1Y3RvcihsZW5ndGgpKSA6IG5ldyBBcnJheShsZW5ndGgpO1xyXG4gICAgICAgIGlmICghaXRlcmF0b3JfMS5pc0FycmF5TGlrZShhcnJheUxpa2UpICYmICFpdGVyYXRvcl8xLmlzSXRlcmFibGUoYXJyYXlMaWtlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmIHRoaXMgaXMgYW4gYXJyYXkgYW5kIHRoZSBub3JtYWxpemVkIGxlbmd0aCBpcyAwLCBqdXN0IHJldHVybiBhbiBlbXB0eSBhcnJheS4gdGhpcyBwcmV2ZW50cyBhIHByb2JsZW1cclxuICAgICAgICAvLyB3aXRoIHRoZSBpdGVyYXRpb24gb24gSUUgd2hlbiB1c2luZyBhIE5hTiBhcnJheSBsZW5ndGguXHJcbiAgICAgICAgaWYgKGl0ZXJhdG9yXzEuaXNBcnJheUxpa2UoYXJyYXlMaWtlKSkge1xyXG4gICAgICAgICAgICBpZiAobGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheUxpa2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gbWFwRnVuY3Rpb24gPyBtYXBGdW5jdGlvbihhcnJheUxpa2VbaV0sIGkpIDogYXJyYXlMaWtlW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBhcnJheUxpa2VfMSA9IHRzbGliXzEuX192YWx1ZXMoYXJyYXlMaWtlKSwgYXJyYXlMaWtlXzFfMSA9IGFycmF5TGlrZV8xLm5leHQoKTsgIWFycmF5TGlrZV8xXzEuZG9uZTsgYXJyYXlMaWtlXzFfMSA9IGFycmF5TGlrZV8xLm5leHQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFycmF5TGlrZV8xXzEudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyYXlbaV0gPSBtYXBGdW5jdGlvbiA/IG1hcEZ1bmN0aW9uKHZhbHVlLCBpKSA6IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxyXG4gICAgICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFycmF5TGlrZV8xXzEgJiYgIWFycmF5TGlrZV8xXzEuZG9uZSAmJiAoX2EgPSBhcnJheUxpa2VfMS5yZXR1cm4pKSBfYS5jYWxsKGFycmF5TGlrZV8xKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7IH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYXJyYXlMaWtlLmxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGFycmF5Lmxlbmd0aCA9IGxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgICAgIHZhciBlXzEsIF9hO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMub2YgPSBmdW5jdGlvbiBvZigpIHtcclxuICAgICAgICB2YXIgaXRlbXMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBpdGVtc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoaXRlbXMpO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuY29weVdpdGhpbiA9IGZ1bmN0aW9uIGNvcHlXaXRoaW4odGFyZ2V0LCBvZmZzZXQsIHN0YXJ0LCBlbmQpIHtcclxuICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY29weVdpdGhpbjogdGFyZ2V0IG11c3QgYmUgYW4gYXJyYXktbGlrZSBvYmplY3QnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoXzEodGFyZ2V0Lmxlbmd0aCk7XHJcbiAgICAgICAgb2Zmc2V0ID0gbm9ybWFsaXplT2Zmc2V0XzEodG9JbnRlZ2VyXzEob2Zmc2V0KSwgbGVuZ3RoKTtcclxuICAgICAgICBzdGFydCA9IG5vcm1hbGl6ZU9mZnNldF8xKHRvSW50ZWdlcl8xKHN0YXJ0KSwgbGVuZ3RoKTtcclxuICAgICAgICBlbmQgPSBub3JtYWxpemVPZmZzZXRfMShlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvSW50ZWdlcl8xKGVuZCksIGxlbmd0aCk7XHJcbiAgICAgICAgdmFyIGNvdW50ID0gTWF0aC5taW4oZW5kIC0gc3RhcnQsIGxlbmd0aCAtIG9mZnNldCk7XHJcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IDE7XHJcbiAgICAgICAgaWYgKG9mZnNldCA+IHN0YXJ0ICYmIG9mZnNldCA8IHN0YXJ0ICsgY291bnQpIHtcclxuICAgICAgICAgICAgZGlyZWN0aW9uID0gLTE7XHJcbiAgICAgICAgICAgIHN0YXJ0ICs9IGNvdW50IC0gMTtcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IGNvdW50IC0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2hpbGUgKGNvdW50ID4gMCkge1xyXG4gICAgICAgICAgICBpZiAoc3RhcnQgaW4gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRbb2Zmc2V0XSA9IHRhcmdldFtzdGFydF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGFyZ2V0W29mZnNldF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb2Zmc2V0ICs9IGRpcmVjdGlvbjtcclxuICAgICAgICAgICAgc3RhcnQgKz0gZGlyZWN0aW9uO1xyXG4gICAgICAgICAgICBjb3VudC0tO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuZmlsbCA9IGZ1bmN0aW9uIGZpbGwodGFyZ2V0LCB2YWx1ZSwgc3RhcnQsIGVuZCkge1xyXG4gICAgICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aF8xKHRhcmdldC5sZW5ndGgpO1xyXG4gICAgICAgIHZhciBpID0gbm9ybWFsaXplT2Zmc2V0XzEodG9JbnRlZ2VyXzEoc3RhcnQpLCBsZW5ndGgpO1xyXG4gICAgICAgIGVuZCA9IG5vcm1hbGl6ZU9mZnNldF8xKGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogdG9JbnRlZ2VyXzEoZW5kKSwgbGVuZ3RoKTtcclxuICAgICAgICB3aGlsZSAoaSA8IGVuZCkge1xyXG4gICAgICAgICAgICB0YXJnZXRbaSsrXSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuZmluZCA9IGZ1bmN0aW9uIGZpbmQodGFyZ2V0LCBjYWxsYmFjaywgdGhpc0FyZykge1xyXG4gICAgICAgIHZhciBpbmRleCA9IGV4cG9ydHMuZmluZEluZGV4KHRhcmdldCwgY2FsbGJhY2ssIHRoaXNBcmcpO1xyXG4gICAgICAgIHJldHVybiBpbmRleCAhPT0gLTEgPyB0YXJnZXRbaW5kZXhdIDogdW5kZWZpbmVkO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuZmluZEluZGV4ID0gZnVuY3Rpb24gZmluZEluZGV4KHRhcmdldCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGhfMSh0YXJnZXQubGVuZ3RoKTtcclxuICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ZpbmQ6IHNlY29uZCBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXNBcmcpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjay5iaW5kKHRoaXNBcmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayh0YXJnZXRbaV0sIGksIHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH07XHJcbn1cclxuaWYgKGhhc18xLmRlZmF1bHQoJ2VzNy1hcnJheScpKSB7XHJcbiAgICBleHBvcnRzLmluY2x1ZGVzID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5BcnJheS5wcm90b3R5cGUuaW5jbHVkZXMpO1xyXG59XHJcbmVsc2Uge1xyXG4gICAgLyoqXHJcbiAgICAgKiBFbnN1cmVzIGEgbm9uLW5lZ2F0aXZlLCBub24taW5maW5pdGUsIHNhZmUgaW50ZWdlci5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbGVuZ3RoIFRoZSBudW1iZXIgdG8gdmFsaWRhdGVcclxuICAgICAqIEByZXR1cm4gQSBwcm9wZXIgbGVuZ3RoXHJcbiAgICAgKi9cclxuICAgIHZhciB0b0xlbmd0aF8yID0gZnVuY3Rpb24gdG9MZW5ndGgobGVuZ3RoKSB7XHJcbiAgICAgICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aCk7XHJcbiAgICAgICAgaWYgKGlzTmFOKGxlbmd0aCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XHJcbiAgICAgICAgICAgIGxlbmd0aCA9IE1hdGguZmxvb3IobGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRW5zdXJlIGEgbm9uLW5lZ2F0aXZlLCByZWFsLCBzYWZlIGludGVnZXJcclxuICAgICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobGVuZ3RoLCAwKSwgbnVtYmVyXzEuTUFYX1NBRkVfSU5URUdFUik7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzKHRhcmdldCwgc2VhcmNoRWxlbWVudCwgZnJvbUluZGV4KSB7XHJcbiAgICAgICAgaWYgKGZyb21JbmRleCA9PT0gdm9pZCAwKSB7IGZyb21JbmRleCA9IDA7IH1cclxuICAgICAgICB2YXIgbGVuID0gdG9MZW5ndGhfMih0YXJnZXQubGVuZ3RoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gZnJvbUluZGV4OyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRFbGVtZW50ID0gdGFyZ2V0W2ldO1xyXG4gICAgICAgICAgICBpZiAoc2VhcmNoRWxlbWVudCA9PT0gY3VycmVudEVsZW1lbnQgfHxcclxuICAgICAgICAgICAgICAgIChzZWFyY2hFbGVtZW50ICE9PSBzZWFyY2hFbGVtZW50ICYmIGN1cnJlbnRFbGVtZW50ICE9PSBjdXJyZW50RWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2FycmF5LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2FycmF5LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBnbG9iYWxPYmplY3QgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgLy8gZ2xvYmFsIHNwZWMgZGVmaW5lcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCBjYWxsZWQgJ2dsb2JhbCdcclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1nbG9iYWxcclxuICAgICAgICAvLyBgZ2xvYmFsYCBpcyBhbHNvIGRlZmluZWQgaW4gTm9kZUpTXHJcbiAgICAgICAgcmV0dXJuIGdsb2JhbDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgLy8gd2luZG93IGlzIGRlZmluZWQgaW4gYnJvd3NlcnNcclxuICAgICAgICByZXR1cm4gd2luZG93O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgLy8gc2VsZiBpcyBkZWZpbmVkIGluIFdlYldvcmtlcnNcclxuICAgICAgICByZXR1cm4gc2VsZjtcclxuICAgIH1cclxufSkoKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gZ2xvYmFsT2JqZWN0O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5yZXF1aXJlKFwiLi9TeW1ib2xcIik7XHJcbnZhciBzdHJpbmdfMSA9IHJlcXVpcmUoXCIuL3N0cmluZ1wiKTtcclxudmFyIHN0YXRpY0RvbmUgPSB7IGRvbmU6IHRydWUsIHZhbHVlOiB1bmRlZmluZWQgfTtcclxuLyoqXHJcbiAqIEEgY2xhc3MgdGhhdCBfc2hpbXNfIGFuIGl0ZXJhdG9yIGludGVyZmFjZSBvbiBhcnJheSBsaWtlIG9iamVjdHMuXHJcbiAqL1xyXG52YXIgU2hpbUl0ZXJhdG9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gU2hpbUl0ZXJhdG9yKGxpc3QpIHtcclxuICAgICAgICB0aGlzLl9uZXh0SW5kZXggPSAtMTtcclxuICAgICAgICBpZiAoaXNJdGVyYWJsZShsaXN0KSkge1xyXG4gICAgICAgICAgICB0aGlzLl9uYXRpdmVJdGVyYXRvciA9IGxpc3RbU3ltYm9sLml0ZXJhdG9yXSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdCA9IGxpc3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gdGhlIG5leHQgaXRlcmF0aW9uIHJlc3VsdCBmb3IgdGhlIEl0ZXJhdG9yXHJcbiAgICAgKi9cclxuICAgIFNoaW1JdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fbmF0aXZlSXRlcmF0b3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25hdGl2ZUl0ZXJhdG9yLm5leHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLl9saXN0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0aWNEb25lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKyt0aGlzLl9uZXh0SW5kZXggPCB0aGlzLl9saXN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgZG9uZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5fbGlzdFt0aGlzLl9uZXh0SW5kZXhdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdGF0aWNEb25lO1xyXG4gICAgfTtcclxuICAgIFNoaW1JdGVyYXRvci5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICByZXR1cm4gU2hpbUl0ZXJhdG9yO1xyXG59KCkpO1xyXG5leHBvcnRzLlNoaW1JdGVyYXRvciA9IFNoaW1JdGVyYXRvcjtcclxuLyoqXHJcbiAqIEEgdHlwZSBndWFyZCBmb3IgY2hlY2tpbmcgaWYgc29tZXRoaW5nIGhhcyBhbiBJdGVyYWJsZSBpbnRlcmZhY2VcclxuICpcclxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0eXBlIGd1YXJkIGFnYWluc3RcclxuICovXHJcbmZ1bmN0aW9uIGlzSXRlcmFibGUodmFsdWUpIHtcclxuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWVbU3ltYm9sLml0ZXJhdG9yXSA9PT0gJ2Z1bmN0aW9uJztcclxufVxyXG5leHBvcnRzLmlzSXRlcmFibGUgPSBpc0l0ZXJhYmxlO1xyXG4vKipcclxuICogQSB0eXBlIGd1YXJkIGZvciBjaGVja2luZyBpZiBzb21ldGhpbmcgaXMgQXJyYXlMaWtlXHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdHlwZSBndWFyZCBhZ2FpbnN0XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInO1xyXG59XHJcbmV4cG9ydHMuaXNBcnJheUxpa2UgPSBpc0FycmF5TGlrZTtcclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGl0ZXJhdG9yIGZvciBhbiBvYmplY3RcclxuICpcclxuICogQHBhcmFtIGl0ZXJhYmxlIFRoZSBpdGVyYWJsZSBvYmplY3QgdG8gcmV0dXJuIHRoZSBpdGVyYXRvciBmb3JcclxuICovXHJcbmZ1bmN0aW9uIGdldChpdGVyYWJsZSkge1xyXG4gICAgaWYgKGlzSXRlcmFibGUoaXRlcmFibGUpKSB7XHJcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlW1N5bWJvbC5pdGVyYXRvcl0oKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzQXJyYXlMaWtlKGl0ZXJhYmxlKSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgU2hpbUl0ZXJhdG9yKGl0ZXJhYmxlKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmdldCA9IGdldDtcclxuLyoqXHJcbiAqIFNoaW1zIHRoZSBmdW5jdGlvbmFsaXR5IG9mIGBmb3IgLi4uIG9mYCBibG9ja3NcclxuICpcclxuICogQHBhcmFtIGl0ZXJhYmxlIFRoZSBvYmplY3QgdGhlIHByb3ZpZGVzIGFuIGludGVyYXRvciBpbnRlcmZhY2VcclxuICogQHBhcmFtIGNhbGxiYWNrIFRoZSBjYWxsYmFjayB3aGljaCB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaCBpdGVtIG9mIHRoZSBpdGVyYWJsZVxyXG4gKiBAcGFyYW0gdGhpc0FyZyBPcHRpb25hbCBzY29wZSB0byBwYXNzIHRoZSBjYWxsYmFja1xyXG4gKi9cclxuZnVuY3Rpb24gZm9yT2YoaXRlcmFibGUsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XHJcbiAgICB2YXIgYnJva2VuID0gZmFsc2U7XHJcbiAgICBmdW5jdGlvbiBkb0JyZWFrKCkge1xyXG4gICAgICAgIGJyb2tlbiA9IHRydWU7XHJcbiAgICB9XHJcbiAgICAvKiBXZSBuZWVkIHRvIGhhbmRsZSBpdGVyYXRpb24gb2YgZG91YmxlIGJ5dGUgc3RyaW5ncyBwcm9wZXJseSAqL1xyXG4gICAgaWYgKGlzQXJyYXlMaWtlKGl0ZXJhYmxlKSAmJiB0eXBlb2YgaXRlcmFibGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgdmFyIGwgPSBpdGVyYWJsZS5sZW5ndGg7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIGNoYXIgPSBpdGVyYWJsZVtpXTtcclxuICAgICAgICAgICAgaWYgKGkgKyAxIDwgbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvZGUgPSBjaGFyLmNoYXJDb2RlQXQoMCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29kZSA+PSBzdHJpbmdfMS5ISUdIX1NVUlJPR0FURV9NSU4gJiYgY29kZSA8PSBzdHJpbmdfMS5ISUdIX1NVUlJPR0FURV9NQVgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGFyICs9IGl0ZXJhYmxlWysraV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBjaGFyLCBpdGVyYWJsZSwgZG9CcmVhayk7XHJcbiAgICAgICAgICAgIGlmIChicm9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHZhciBpdGVyYXRvciA9IGdldChpdGVyYWJsZSk7XHJcbiAgICAgICAgaWYgKGl0ZXJhdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XHJcbiAgICAgICAgICAgIHdoaWxlICghcmVzdWx0LmRvbmUpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgcmVzdWx0LnZhbHVlLCBpdGVyYWJsZSwgZG9CcmVhayk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnJva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZm9yT2YgPSBmb3JPZjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2l0ZXJhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL2l0ZXJhdG9yLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuL2dsb2JhbFwiKTtcclxuLyoqXHJcbiAqIFRoZSBzbWFsbGVzdCBpbnRlcnZhbCBiZXR3ZWVuIHR3byByZXByZXNlbnRhYmxlIG51bWJlcnMuXHJcbiAqL1xyXG5leHBvcnRzLkVQU0lMT04gPSAxO1xyXG4vKipcclxuICogVGhlIG1heGltdW0gc2FmZSBpbnRlZ2VyIGluIEphdmFTY3JpcHRcclxuICovXHJcbmV4cG9ydHMuTUFYX1NBRkVfSU5URUdFUiA9IE1hdGgucG93KDIsIDUzKSAtIDE7XHJcbi8qKlxyXG4gKiBUaGUgbWluaW11bSBzYWZlIGludGVnZXIgaW4gSmF2YVNjcmlwdFxyXG4gKi9cclxuZXhwb3J0cy5NSU5fU0FGRV9JTlRFR0VSID0gLWV4cG9ydHMuTUFYX1NBRkVfSU5URUdFUjtcclxuLyoqXHJcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIE5hTiB3aXRob3V0IGNvZXJzaW9uLlxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3RcclxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBOYU4sIGZhbHNlIGlmIGl0IGlzIG5vdFxyXG4gKi9cclxuZnVuY3Rpb24gaXNOYU4odmFsdWUpIHtcclxuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGdsb2JhbF8xLmRlZmF1bHQuaXNOYU4odmFsdWUpO1xyXG59XHJcbmV4cG9ydHMuaXNOYU4gPSBpc05hTjtcclxuLyoqXHJcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlciB3aXRob3V0IGNvZXJzaW9uLlxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3RcclxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBmaW5pdGUsIGZhbHNlIGlmIGl0IGlzIG5vdFxyXG4gKi9cclxuZnVuY3Rpb24gaXNGaW5pdGUodmFsdWUpIHtcclxuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGdsb2JhbF8xLmRlZmF1bHQuaXNGaW5pdGUodmFsdWUpO1xyXG59XHJcbmV4cG9ydHMuaXNGaW5pdGUgPSBpc0Zpbml0ZTtcclxuLyoqXHJcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGFuIGludGVnZXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxyXG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIGFuIGludGVnZXIsIGZhbHNlIGlmIGl0IGlzIG5vdFxyXG4gKi9cclxuZnVuY3Rpb24gaXNJbnRlZ2VyKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gaXNGaW5pdGUodmFsdWUpICYmIE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZTtcclxufVxyXG5leHBvcnRzLmlzSW50ZWdlciA9IGlzSW50ZWdlcjtcclxuLyoqXHJcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGFuIGludGVnZXIgdGhhdCBpcyAnc2FmZSwnIG1lYW5pbmc6XHJcbiAqICAgMS4gaXQgY2FuIGJlIGV4cHJlc3NlZCBhcyBhbiBJRUVFLTc1NCBkb3VibGUgcHJlY2lzaW9uIG51bWJlclxyXG4gKiAgIDIuIGl0IGhhcyBhIG9uZS10by1vbmUgbWFwcGluZyB0byBhIG1hdGhlbWF0aWNhbCBpbnRlZ2VyLCBtZWFuaW5nIGl0c1xyXG4gKiAgICAgIElFRUUtNzU0IHJlcHJlc2VudGF0aW9uIGNhbm5vdCBiZSB0aGUgcmVzdWx0IG9mIHJvdW5kaW5nIGFueSBvdGhlclxyXG4gKiAgICAgIGludGVnZXIgdG8gZml0IHRoZSBJRUVFLTc1NCByZXByZXNlbnRhdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3RcclxuICogQHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBhbiBpbnRlZ2VyLCBmYWxzZSBpZiBpdCBpcyBub3RcclxuICovXHJcbmZ1bmN0aW9uIGlzU2FmZUludGVnZXIodmFsdWUpIHtcclxuICAgIHJldHVybiBpc0ludGVnZXIodmFsdWUpICYmIE1hdGguYWJzKHZhbHVlKSA8PSBleHBvcnRzLk1BWF9TQUZFX0lOVEVHRVI7XHJcbn1cclxuZXhwb3J0cy5pc1NhZmVJbnRlZ2VyID0gaXNTYWZlSW50ZWdlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL251bWJlci5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9udW1iZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIi4vZ2xvYmFsXCIpO1xyXG52YXIgaGFzXzEgPSByZXF1aXJlKFwiLi9zdXBwb3J0L2hhc1wiKTtcclxudmFyIFN5bWJvbF8xID0gcmVxdWlyZShcIi4vU3ltYm9sXCIpO1xyXG5pZiAoaGFzXzEuZGVmYXVsdCgnZXM2LW9iamVjdCcpKSB7XHJcbiAgICB2YXIgZ2xvYmFsT2JqZWN0ID0gZ2xvYmFsXzEuZGVmYXVsdC5PYmplY3Q7XHJcbiAgICBleHBvcnRzLmFzc2lnbiA9IGdsb2JhbE9iamVjdC5hc3NpZ247XHJcbiAgICBleHBvcnRzLmdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGdsb2JhbE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XHJcbiAgICBleHBvcnRzLmdldE93blByb3BlcnR5TmFtZXMgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcztcclxuICAgIGV4cG9ydHMuZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZ2xvYmFsT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcclxuICAgIGV4cG9ydHMuaXMgPSBnbG9iYWxPYmplY3QuaXM7XHJcbiAgICBleHBvcnRzLmtleXMgPSBnbG9iYWxPYmplY3Qua2V5cztcclxufVxyXG5lbHNlIHtcclxuICAgIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uIHN5bWJvbEF3YXJlS2V5cyhvKSB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG8pLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7IHJldHVybiAhQm9vbGVhbihrZXkubWF0Y2goL15AQC4rLykpOyB9KTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmFzc2lnbiA9IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQpIHtcclxuICAgICAgICB2YXIgc291cmNlcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIHNvdXJjZXNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAvLyBUeXBlRXJyb3IgaWYgdW5kZWZpbmVkIG9yIG51bGxcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB0byA9IE9iamVjdCh0YXJnZXQpO1xyXG4gICAgICAgIHNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAobmV4dFNvdXJjZSkge1xyXG4gICAgICAgICAgICBpZiAobmV4dFNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gU2tpcCBvdmVyIGlmIHVuZGVmaW5lZCBvciBudWxsXHJcbiAgICAgICAgICAgICAgICBleHBvcnRzLmtleXMobmV4dFNvdXJjZSkuZm9yRWFjaChmdW5jdGlvbiAobmV4dEtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRvO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIHByb3ApIHtcclxuICAgICAgICBpZiAoU3ltYm9sXzEuaXNTeW1ib2wocHJvcCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobywgcHJvcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvLCBwcm9wKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhvKSB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG8pLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7IHJldHVybiAhQm9vbGVhbihrZXkubWF0Y2goL15AQC4rLykpOyB9KTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhvKSB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG8pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gQm9vbGVhbihrZXkubWF0Y2goL15AQC4rLykpOyB9KVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIFN5bWJvbC5mb3Ioa2V5LnN1YnN0cmluZygyKSk7IH0pO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuaXMgPSBmdW5jdGlvbiBpcyh2YWx1ZTEsIHZhbHVlMikge1xyXG4gICAgICAgIGlmICh2YWx1ZTEgPT09IHZhbHVlMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUxICE9PSAwIHx8IDEgLyB2YWx1ZTEgPT09IDEgLyB2YWx1ZTI7IC8vIC0wXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTEgIT09IHZhbHVlMSAmJiB2YWx1ZTIgIT09IHZhbHVlMjsgLy8gTmFOXHJcbiAgICB9O1xyXG59XHJcbmlmIChoYXNfMS5kZWZhdWx0KCdlczIwMTctb2JqZWN0JykpIHtcclxuICAgIHZhciBnbG9iYWxPYmplY3QgPSBnbG9iYWxfMS5kZWZhdWx0Lk9iamVjdDtcclxuICAgIGV4cG9ydHMuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyA9IGdsb2JhbE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzO1xyXG4gICAgZXhwb3J0cy5lbnRyaWVzID0gZ2xvYmFsT2JqZWN0LmVudHJpZXM7XHJcbiAgICBleHBvcnRzLnZhbHVlcyA9IGdsb2JhbE9iamVjdC52YWx1ZXM7XHJcbn1cclxuZWxzZSB7XHJcbiAgICBleHBvcnRzLmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG8pIHtcclxuICAgICAgICByZXR1cm4gZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eU5hbWVzKG8pLnJlZHVjZShmdW5jdGlvbiAocHJldmlvdXMsIGtleSkge1xyXG4gICAgICAgICAgICBwcmV2aW91c1trZXldID0gZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iobywga2V5KTtcclxuICAgICAgICAgICAgcmV0dXJuIHByZXZpb3VzO1xyXG4gICAgICAgIH0sIHt9KTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmVudHJpZXMgPSBmdW5jdGlvbiBlbnRyaWVzKG8pIHtcclxuICAgICAgICByZXR1cm4gZXhwb3J0cy5rZXlzKG8pLm1hcChmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBba2V5LCBvW2tleV1dOyB9KTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLnZhbHVlcyA9IGZ1bmN0aW9uIHZhbHVlcyhvKSB7XHJcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMua2V5cyhvKS5tYXAoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gb1trZXldOyB9KTtcclxuICAgIH07XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL29iamVjdC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9vYmplY3QuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuL2dsb2JhbFwiKTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIi4vc3VwcG9ydC9oYXNcIik7XHJcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi9zdXBwb3J0L3V0aWxcIik7XHJcbi8qKlxyXG4gKiBUaGUgbWluaW11bSBsb2NhdGlvbiBvZiBoaWdoIHN1cnJvZ2F0ZXNcclxuICovXHJcbmV4cG9ydHMuSElHSF9TVVJST0dBVEVfTUlOID0gMHhkODAwO1xyXG4vKipcclxuICogVGhlIG1heGltdW0gbG9jYXRpb24gb2YgaGlnaCBzdXJyb2dhdGVzXHJcbiAqL1xyXG5leHBvcnRzLkhJR0hfU1VSUk9HQVRFX01BWCA9IDB4ZGJmZjtcclxuLyoqXHJcbiAqIFRoZSBtaW5pbXVtIGxvY2F0aW9uIG9mIGxvdyBzdXJyb2dhdGVzXHJcbiAqL1xyXG5leHBvcnRzLkxPV19TVVJST0dBVEVfTUlOID0gMHhkYzAwO1xyXG4vKipcclxuICogVGhlIG1heGltdW0gbG9jYXRpb24gb2YgbG93IHN1cnJvZ2F0ZXNcclxuICovXHJcbmV4cG9ydHMuTE9XX1NVUlJPR0FURV9NQVggPSAweGRmZmY7XHJcbmlmIChoYXNfMS5kZWZhdWx0KCdlczYtc3RyaW5nJykgJiYgaGFzXzEuZGVmYXVsdCgnZXM2LXN0cmluZy1yYXcnKSkge1xyXG4gICAgZXhwb3J0cy5mcm9tQ29kZVBvaW50ID0gZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcuZnJvbUNvZGVQb2ludDtcclxuICAgIGV4cG9ydHMucmF3ID0gZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucmF3O1xyXG4gICAgZXhwb3J0cy5jb2RlUG9pbnRBdCA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnByb3RvdHlwZS5jb2RlUG9pbnRBdCk7XHJcbiAgICBleHBvcnRzLmVuZHNXaXRoID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlLmVuZHNXaXRoKTtcclxuICAgIGV4cG9ydHMuaW5jbHVkZXMgPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5wcm90b3R5cGUuaW5jbHVkZXMpO1xyXG4gICAgZXhwb3J0cy5ub3JtYWxpemUgPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5wcm90b3R5cGUubm9ybWFsaXplKTtcclxuICAgIGV4cG9ydHMucmVwZWF0ID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlLnJlcGVhdCk7XHJcbiAgICBleHBvcnRzLnN0YXJ0c1dpdGggPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aCk7XHJcbn1cclxuZWxzZSB7XHJcbiAgICAvKipcclxuICAgICAqIFZhbGlkYXRlcyB0aGF0IHRleHQgaXMgZGVmaW5lZCwgYW5kIG5vcm1hbGl6ZXMgcG9zaXRpb24gKGJhc2VkIG9uIHRoZSBnaXZlbiBkZWZhdWx0IGlmIHRoZSBpbnB1dCBpcyBOYU4pLlxyXG4gICAgICogVXNlZCBieSBzdGFydHNXaXRoLCBpbmNsdWRlcywgYW5kIGVuZHNXaXRoLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gTm9ybWFsaXplZCBwb3NpdGlvbi5cclxuICAgICAqL1xyXG4gICAgdmFyIG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3NfMSA9IGZ1bmN0aW9uIChuYW1lLCB0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uLCBpc0VuZCkge1xyXG4gICAgICAgIGlmIChpc0VuZCA9PT0gdm9pZCAwKSB7IGlzRW5kID0gZmFsc2U7IH1cclxuICAgICAgICBpZiAodGV4dCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy4nICsgbmFtZSArICcgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcgdG8gc2VhcmNoIGFnYWluc3QuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsZW5ndGggPSB0ZXh0Lmxlbmd0aDtcclxuICAgICAgICBwb3NpdGlvbiA9IHBvc2l0aW9uICE9PSBwb3NpdGlvbiA/IChpc0VuZCA/IGxlbmd0aCA6IDApIDogcG9zaXRpb247XHJcbiAgICAgICAgcmV0dXJuIFt0ZXh0LCBTdHJpbmcoc2VhcmNoKSwgTWF0aC5taW4oTWF0aC5tYXgocG9zaXRpb24sIDApLCBsZW5ndGgpXTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmZyb21Db2RlUG9pbnQgPSBmdW5jdGlvbiBmcm9tQ29kZVBvaW50KCkge1xyXG4gICAgICAgIHZhciBjb2RlUG9pbnRzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgY29kZVBvaW50c1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvU3RyaW5nLmZyb21Db2RlUG9pbnRcclxuICAgICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcclxuICAgICAgICBpZiAoIWxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBmcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xyXG4gICAgICAgIHZhciBNQVhfU0laRSA9IDB4NDAwMDtcclxuICAgICAgICB2YXIgY29kZVVuaXRzID0gW107XHJcbiAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9ICcnO1xyXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2RlUG9pbnQgPSBOdW1iZXIoYXJndW1lbnRzW2luZGV4XSk7XHJcbiAgICAgICAgICAgIC8vIENvZGUgcG9pbnRzIG11c3QgYmUgZmluaXRlIGludGVnZXJzIHdpdGhpbiB0aGUgdmFsaWQgcmFuZ2VcclxuICAgICAgICAgICAgdmFyIGlzVmFsaWQgPSBpc0Zpbml0ZShjb2RlUG9pbnQpICYmIE1hdGguZmxvb3IoY29kZVBvaW50KSA9PT0gY29kZVBvaW50ICYmIGNvZGVQb2ludCA+PSAwICYmIGNvZGVQb2ludCA8PSAweDEwZmZmZjtcclxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yKCdzdHJpbmcuZnJvbUNvZGVQb2ludDogSW52YWxpZCBjb2RlIHBvaW50ICcgKyBjb2RlUG9pbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb2RlUG9pbnQgPD0gMHhmZmZmKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBCTVAgY29kZSBwb2ludFxyXG4gICAgICAgICAgICAgICAgY29kZVVuaXRzLnB1c2goY29kZVBvaW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIEFzdHJhbCBjb2RlIHBvaW50OyBzcGxpdCBpbiBzdXJyb2dhdGUgaGFsdmVzXHJcbiAgICAgICAgICAgICAgICAvLyBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZyNzdXJyb2dhdGUtZm9ybXVsYWVcclxuICAgICAgICAgICAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGhpZ2hTdXJyb2dhdGUgPSAoY29kZVBvaW50ID4+IDEwKSArIGV4cG9ydHMuSElHSF9TVVJST0dBVEVfTUlOO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxvd1N1cnJvZ2F0ZSA9IGNvZGVQb2ludCAlIDB4NDAwICsgZXhwb3J0cy5MT1dfU1VSUk9HQVRFX01JTjtcclxuICAgICAgICAgICAgICAgIGNvZGVVbml0cy5wdXNoKGhpZ2hTdXJyb2dhdGUsIGxvd1N1cnJvZ2F0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGluZGV4ICsgMSA9PT0gbGVuZ3RoIHx8IGNvZGVVbml0cy5sZW5ndGggPiBNQVhfU0laRSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IGZyb21DaGFyQ29kZS5hcHBseShudWxsLCBjb2RlVW5pdHMpO1xyXG4gICAgICAgICAgICAgICAgY29kZVVuaXRzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLnJhdyA9IGZ1bmN0aW9uIHJhdyhjYWxsU2l0ZSkge1xyXG4gICAgICAgIHZhciBzdWJzdGl0dXRpb25zID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgc3Vic3RpdHV0aW9uc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJhd1N0cmluZ3MgPSBjYWxsU2l0ZS5yYXc7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9ICcnO1xyXG4gICAgICAgIHZhciBudW1TdWJzdGl0dXRpb25zID0gc3Vic3RpdHV0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGNhbGxTaXRlID09IG51bGwgfHwgY2FsbFNpdGUucmF3ID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJhdyByZXF1aXJlcyBhIHZhbGlkIGNhbGxTaXRlIG9iamVjdCB3aXRoIGEgcmF3IHZhbHVlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGhfMSA9IHJhd1N0cmluZ3MubGVuZ3RoOyBpIDwgbGVuZ3RoXzE7IGkrKykge1xyXG4gICAgICAgICAgICByZXN1bHQgKz0gcmF3U3RyaW5nc1tpXSArIChpIDwgbnVtU3Vic3RpdHV0aW9ucyAmJiBpIDwgbGVuZ3RoXzEgLSAxID8gc3Vic3RpdHV0aW9uc1tpXSA6ICcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmNvZGVQb2ludEF0ID0gZnVuY3Rpb24gY29kZVBvaW50QXQodGV4dCwgcG9zaXRpb24pIHtcclxuICAgICAgICBpZiAocG9zaXRpb24gPT09IHZvaWQgMCkgeyBwb3NpdGlvbiA9IDA7IH1cclxuICAgICAgICAvLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvU3RyaW5nLnByb3RvdHlwZS5jb2RlUG9pbnRBdFxyXG4gICAgICAgIGlmICh0ZXh0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLmNvZGVQb2ludEF0IHJlcXVyaWVzIGEgdmFsaWQgc3RyaW5nLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbGVuZ3RoID0gdGV4dC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uICE9PSBwb3NpdGlvbikge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwb3NpdGlvbiA8IDAgfHwgcG9zaXRpb24gPj0gbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEdldCB0aGUgZmlyc3QgY29kZSB1bml0XHJcbiAgICAgICAgdmFyIGZpcnN0ID0gdGV4dC5jaGFyQ29kZUF0KHBvc2l0aW9uKTtcclxuICAgICAgICBpZiAoZmlyc3QgPj0gZXhwb3J0cy5ISUdIX1NVUlJPR0FURV9NSU4gJiYgZmlyc3QgPD0gZXhwb3J0cy5ISUdIX1NVUlJPR0FURV9NQVggJiYgbGVuZ3RoID4gcG9zaXRpb24gKyAxKSB7XHJcbiAgICAgICAgICAgIC8vIFN0YXJ0IG9mIGEgc3Vycm9nYXRlIHBhaXIgKGhpZ2ggc3Vycm9nYXRlIGFuZCB0aGVyZSBpcyBhIG5leHQgY29kZSB1bml0KTsgY2hlY2sgZm9yIGxvdyBzdXJyb2dhdGVcclxuICAgICAgICAgICAgLy8gaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtZW5jb2Rpbmcjc3Vycm9nYXRlLWZvcm11bGFlXHJcbiAgICAgICAgICAgIHZhciBzZWNvbmQgPSB0ZXh0LmNoYXJDb2RlQXQocG9zaXRpb24gKyAxKTtcclxuICAgICAgICAgICAgaWYgKHNlY29uZCA+PSBleHBvcnRzLkxPV19TVVJST0dBVEVfTUlOICYmIHNlY29uZCA8PSBleHBvcnRzLkxPV19TVVJST0dBVEVfTUFYKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGZpcnN0IC0gZXhwb3J0cy5ISUdIX1NVUlJPR0FURV9NSU4pICogMHg0MDAgKyBzZWNvbmQgLSBleHBvcnRzLkxPV19TVVJST0dBVEVfTUlOICsgMHgxMDAwMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmlyc3Q7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5lbmRzV2l0aCA9IGZ1bmN0aW9uIGVuZHNXaXRoKHRleHQsIHNlYXJjaCwgZW5kUG9zaXRpb24pIHtcclxuICAgICAgICBpZiAoZW5kUG9zaXRpb24gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBlbmRQb3NpdGlvbiA9IHRleHQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfYSA9IHRzbGliXzEuX19yZWFkKG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3NfMSgnZW5kc1dpdGgnLCB0ZXh0LCBzZWFyY2gsIGVuZFBvc2l0aW9uLCB0cnVlKSwgMyksIHRleHQgPSBfYVswXSwgc2VhcmNoID0gX2FbMV0sIGVuZFBvc2l0aW9uID0gX2FbMl07XHJcbiAgICAgICAgdmFyIHN0YXJ0ID0gZW5kUG9zaXRpb24gLSBzZWFyY2gubGVuZ3RoO1xyXG4gICAgICAgIGlmIChzdGFydCA8IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dC5zbGljZShzdGFydCwgZW5kUG9zaXRpb24pID09PSBzZWFyY2g7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyh0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uKSB7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSB2b2lkIDApIHsgcG9zaXRpb24gPSAwOyB9XHJcbiAgICAgICAgX2EgPSB0c2xpYl8xLl9fcmVhZChub3JtYWxpemVTdWJzdHJpbmdBcmdzXzEoJ2luY2x1ZGVzJywgdGV4dCwgc2VhcmNoLCBwb3NpdGlvbiksIDMpLCB0ZXh0ID0gX2FbMF0sIHNlYXJjaCA9IF9hWzFdLCBwb3NpdGlvbiA9IF9hWzJdO1xyXG4gICAgICAgIHJldHVybiB0ZXh0LmluZGV4T2Yoc2VhcmNoLCBwb3NpdGlvbikgIT09IC0xO1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLnJlcGVhdCA9IGZ1bmN0aW9uIHJlcGVhdCh0ZXh0LCBjb3VudCkge1xyXG4gICAgICAgIGlmIChjb3VudCA9PT0gdm9pZCAwKSB7IGNvdW50ID0gMDsgfVxyXG4gICAgICAgIC8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLnJlcGVhdFxyXG4gICAgICAgIGlmICh0ZXh0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIHZhbGlkIHN0cmluZy4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvdW50ICE9PSBjb3VudCkge1xyXG4gICAgICAgICAgICBjb3VudCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb3VudCA8IDAgfHwgY291bnQgPT09IEluZmluaXR5KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdzdHJpbmcucmVwZWF0IHJlcXVpcmVzIGEgbm9uLW5lZ2F0aXZlIGZpbml0ZSBjb3VudC4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9ICcnO1xyXG4gICAgICAgIHdoaWxlIChjb3VudCkge1xyXG4gICAgICAgICAgICBpZiAoY291bnQgJSAyKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gdGV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY291bnQgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0ICs9IHRleHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY291bnQgPj49IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5zdGFydHNXaXRoID0gZnVuY3Rpb24gc3RhcnRzV2l0aCh0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uKSB7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSB2b2lkIDApIHsgcG9zaXRpb24gPSAwOyB9XHJcbiAgICAgICAgc2VhcmNoID0gU3RyaW5nKHNlYXJjaCk7XHJcbiAgICAgICAgX2EgPSB0c2xpYl8xLl9fcmVhZChub3JtYWxpemVTdWJzdHJpbmdBcmdzXzEoJ3N0YXJ0c1dpdGgnLCB0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uKSwgMyksIHRleHQgPSBfYVswXSwgc2VhcmNoID0gX2FbMV0sIHBvc2l0aW9uID0gX2FbMl07XHJcbiAgICAgICAgdmFyIGVuZCA9IHBvc2l0aW9uICsgc2VhcmNoLmxlbmd0aDtcclxuICAgICAgICBpZiAoZW5kID4gdGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dC5zbGljZShwb3NpdGlvbiwgZW5kKSA9PT0gc2VhcmNoO1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgIH07XHJcbn1cclxuaWYgKGhhc18xLmRlZmF1bHQoJ2VzMjAxNy1zdHJpbmcnKSkge1xyXG4gICAgZXhwb3J0cy5wYWRFbmQgPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5wcm90b3R5cGUucGFkRW5kKTtcclxuICAgIGV4cG9ydHMucGFkU3RhcnQgPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5wcm90b3R5cGUucGFkU3RhcnQpO1xyXG59XHJcbmVsc2Uge1xyXG4gICAgZXhwb3J0cy5wYWRFbmQgPSBmdW5jdGlvbiBwYWRFbmQodGV4dCwgbWF4TGVuZ3RoLCBmaWxsU3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKGZpbGxTdHJpbmcgPT09IHZvaWQgMCkgeyBmaWxsU3RyaW5nID0gJyAnOyB9XHJcbiAgICAgICAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtYXhMZW5ndGggPT09IEluZmluaXR5KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdzdHJpbmcucGFkRW5kIHJlcXVpcmVzIGEgbm9uLW5lZ2F0aXZlIGZpbml0ZSBjb3VudC4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1heExlbmd0aCA9PT0gbnVsbCB8fCBtYXhMZW5ndGggPT09IHVuZGVmaW5lZCB8fCBtYXhMZW5ndGggPCAwKSB7XHJcbiAgICAgICAgICAgIG1heExlbmd0aCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzdHJUZXh0ID0gU3RyaW5nKHRleHQpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gbWF4TGVuZ3RoIC0gc3RyVGV4dC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHBhZGRpbmcgPiAwKSB7XHJcbiAgICAgICAgICAgIHN0clRleHQgKz1cclxuICAgICAgICAgICAgICAgIGV4cG9ydHMucmVwZWF0KGZpbGxTdHJpbmcsIE1hdGguZmxvb3IocGFkZGluZyAvIGZpbGxTdHJpbmcubGVuZ3RoKSkgK1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGxTdHJpbmcuc2xpY2UoMCwgcGFkZGluZyAlIGZpbGxTdHJpbmcubGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0clRleHQ7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5wYWRTdGFydCA9IGZ1bmN0aW9uIHBhZFN0YXJ0KHRleHQsIG1heExlbmd0aCwgZmlsbFN0cmluZykge1xyXG4gICAgICAgIGlmIChmaWxsU3RyaW5nID09PSB2b2lkIDApIHsgZmlsbFN0cmluZyA9ICcgJzsgfVxyXG4gICAgICAgIGlmICh0ZXh0ID09PSBudWxsIHx8IHRleHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcucmVwZWF0IHJlcXVpcmVzIGEgdmFsaWQgc3RyaW5nLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobWF4TGVuZ3RoID09PSBJbmZpbml0eSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc3RyaW5nLnBhZFN0YXJ0IHJlcXVpcmVzIGEgbm9uLW5lZ2F0aXZlIGZpbml0ZSBjb3VudC4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1heExlbmd0aCA9PT0gbnVsbCB8fCBtYXhMZW5ndGggPT09IHVuZGVmaW5lZCB8fCBtYXhMZW5ndGggPCAwKSB7XHJcbiAgICAgICAgICAgIG1heExlbmd0aCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzdHJUZXh0ID0gU3RyaW5nKHRleHQpO1xyXG4gICAgICAgIHZhciBwYWRkaW5nID0gbWF4TGVuZ3RoIC0gc3RyVGV4dC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHBhZGRpbmcgPiAwKSB7XHJcbiAgICAgICAgICAgIHN0clRleHQgPVxyXG4gICAgICAgICAgICAgICAgZXhwb3J0cy5yZXBlYXQoZmlsbFN0cmluZywgTWF0aC5mbG9vcihwYWRkaW5nIC8gZmlsbFN0cmluZy5sZW5ndGgpKSArXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbFN0cmluZy5zbGljZSgwLCBwYWRkaW5nICUgZmlsbFN0cmluZy5sZW5ndGgpICtcclxuICAgICAgICAgICAgICAgICAgICBzdHJUZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3RyVGV4dDtcclxuICAgIH07XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N0cmluZy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdHJpbmcuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBoYXNfMSA9IHJlcXVpcmUoXCJAZG9qby9oYXMvaGFzXCIpO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi4vZ2xvYmFsXCIpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBoYXNfMS5kZWZhdWx0O1xyXG50c2xpYl8xLl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiQGRvam8vaGFzL2hhc1wiKSwgZXhwb3J0cyk7XHJcbi8qIEVDTUFTY3JpcHQgNiBhbmQgNyBGZWF0dXJlcyAqL1xyXG4vKiBBcnJheSAqL1xyXG5oYXNfMS5hZGQoJ2VzNi1hcnJheScsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAoWydmcm9tJywgJ29mJ10uZXZlcnkoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4ga2V5IGluIGdsb2JhbF8xLmRlZmF1bHQuQXJyYXk7IH0pICYmXHJcbiAgICAgICAgWydmaW5kSW5kZXgnLCAnZmluZCcsICdjb3B5V2l0aGluJ10uZXZlcnkoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4ga2V5IGluIGdsb2JhbF8xLmRlZmF1bHQuQXJyYXkucHJvdG90eXBlOyB9KSk7XHJcbn0sIHRydWUpO1xyXG5oYXNfMS5hZGQoJ2VzNi1hcnJheS1maWxsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCdmaWxsJyBpbiBnbG9iYWxfMS5kZWZhdWx0LkFycmF5LnByb3RvdHlwZSkge1xyXG4gICAgICAgIC8qIFNvbWUgdmVyc2lvbnMgb2YgU2FmYXJpIGRvIG5vdCBwcm9wZXJseSBpbXBsZW1lbnQgdGhpcyAqL1xyXG4gICAgICAgIHJldHVybiBbMV0uZmlsbCg5LCBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpWzBdID09PSAxO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59LCB0cnVlKTtcclxuaGFzXzEuYWRkKCdlczctYXJyYXknLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnaW5jbHVkZXMnIGluIGdsb2JhbF8xLmRlZmF1bHQuQXJyYXkucHJvdG90eXBlOyB9LCB0cnVlKTtcclxuLyogTWFwICovXHJcbmhhc18xLmFkZCgnZXM2LW1hcCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5NYXAgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAvKlxyXG4gICAgSUUxMSBhbmQgb2xkZXIgdmVyc2lvbnMgb2YgU2FmYXJpIGFyZSBtaXNzaW5nIGNyaXRpY2FsIEVTNiBNYXAgZnVuY3Rpb25hbGl0eVxyXG4gICAgV2Ugd3JhcCB0aGlzIGluIGEgdHJ5L2NhdGNoIGJlY2F1c2Ugc29tZXRpbWVzIHRoZSBNYXAgY29uc3RydWN0b3IgZXhpc3RzLCBidXQgZG9lcyBub3RcclxuICAgIHRha2UgYXJndW1lbnRzIChpT1MgOC40KVxyXG4gICAgICovXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIG1hcCA9IG5ldyBnbG9iYWxfMS5kZWZhdWx0Lk1hcChbWzAsIDFdXSk7XHJcbiAgICAgICAgICAgIHJldHVybiAobWFwLmhhcygwKSAmJlxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIG1hcC5rZXlzID09PSAnZnVuY3Rpb24nICYmXHJcbiAgICAgICAgICAgICAgICBoYXNfMS5kZWZhdWx0KCdlczYtc3ltYm9sJykgJiZcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBtYXAudmFsdWVzID09PSAnZnVuY3Rpb24nICYmXHJcbiAgICAgICAgICAgICAgICB0eXBlb2YgbWFwLmVudHJpZXMgPT09ICdmdW5jdGlvbicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogbm90IHRlc3Rpbmcgb24gaU9TIGF0IHRoZSBtb21lbnQgKi9cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufSwgdHJ1ZSk7XHJcbi8qIE1hdGggKi9cclxuaGFzXzEuYWRkKCdlczYtbWF0aCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgJ2NsejMyJyxcclxuICAgICAgICAnc2lnbicsXHJcbiAgICAgICAgJ2xvZzEwJyxcclxuICAgICAgICAnbG9nMicsXHJcbiAgICAgICAgJ2xvZzFwJyxcclxuICAgICAgICAnZXhwbTEnLFxyXG4gICAgICAgICdjb3NoJyxcclxuICAgICAgICAnc2luaCcsXHJcbiAgICAgICAgJ3RhbmgnLFxyXG4gICAgICAgICdhY29zaCcsXHJcbiAgICAgICAgJ2FzaW5oJyxcclxuICAgICAgICAnYXRhbmgnLFxyXG4gICAgICAgICd0cnVuYycsXHJcbiAgICAgICAgJ2Zyb3VuZCcsXHJcbiAgICAgICAgJ2NicnQnLFxyXG4gICAgICAgICdoeXBvdCdcclxuICAgIF0uZXZlcnkoZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0Lk1hdGhbbmFtZV0gPT09ICdmdW5jdGlvbic7IH0pO1xyXG59LCB0cnVlKTtcclxuaGFzXzEuYWRkKCdlczYtbWF0aC1pbXVsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCdpbXVsJyBpbiBnbG9iYWxfMS5kZWZhdWx0Lk1hdGgpIHtcclxuICAgICAgICAvKiBTb21lIHZlcnNpb25zIG9mIFNhZmFyaSBvbiBpb3MgZG8gbm90IHByb3Blcmx5IGltcGxlbWVudCB0aGlzICovXHJcbiAgICAgICAgcmV0dXJuIE1hdGguaW11bCgweGZmZmZmZmZmLCA1KSA9PT0gLTU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0sIHRydWUpO1xyXG4vKiBPYmplY3QgKi9cclxuaGFzXzEuYWRkKCdlczYtb2JqZWN0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIChoYXNfMS5kZWZhdWx0KCdlczYtc3ltYm9sJykgJiZcclxuICAgICAgICBbJ2Fzc2lnbicsICdpcycsICdnZXRPd25Qcm9wZXJ0eVN5bWJvbHMnLCAnc2V0UHJvdG90eXBlT2YnXS5ldmVyeShmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuT2JqZWN0W25hbWVdID09PSAnZnVuY3Rpb24nOyB9KSk7XHJcbn0sIHRydWUpO1xyXG5oYXNfMS5hZGQoJ2VzMjAxNy1vYmplY3QnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gWyd2YWx1ZXMnLCAnZW50cmllcycsICdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzJ10uZXZlcnkoZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0Lk9iamVjdFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJzsgfSk7XHJcbn0sIHRydWUpO1xyXG4vKiBPYnNlcnZhYmxlICovXHJcbmhhc18xLmFkZCgnZXMtb2JzZXJ2YWJsZScsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0Lk9ic2VydmFibGUgIT09ICd1bmRlZmluZWQnOyB9LCB0cnVlKTtcclxuLyogUHJvbWlzZSAqL1xyXG5oYXNfMS5hZGQoJ2VzNi1wcm9taXNlJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuUHJvbWlzZSAhPT0gJ3VuZGVmaW5lZCcgJiYgaGFzXzEuZGVmYXVsdCgnZXM2LXN5bWJvbCcpOyB9LCB0cnVlKTtcclxuLyogU2V0ICovXHJcbmhhc18xLmFkZCgnZXM2LXNldCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5TZXQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAvKiBJRTExIGFuZCBvbGRlciB2ZXJzaW9ucyBvZiBTYWZhcmkgYXJlIG1pc3NpbmcgY3JpdGljYWwgRVM2IFNldCBmdW5jdGlvbmFsaXR5ICovXHJcbiAgICAgICAgdmFyIHNldCA9IG5ldyBnbG9iYWxfMS5kZWZhdWx0LlNldChbMV0pO1xyXG4gICAgICAgIHJldHVybiBzZXQuaGFzKDEpICYmICdrZXlzJyBpbiBzZXQgJiYgdHlwZW9mIHNldC5rZXlzID09PSAnZnVuY3Rpb24nICYmIGhhc18xLmRlZmF1bHQoJ2VzNi1zeW1ib2wnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufSwgdHJ1ZSk7XHJcbi8qIFN0cmluZyAqL1xyXG5oYXNfMS5hZGQoJ2VzNi1zdHJpbmcnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gKFtcclxuICAgICAgICAvKiBzdGF0aWMgbWV0aG9kcyAqL1xyXG4gICAgICAgICdmcm9tQ29kZVBvaW50J1xyXG4gICAgXS5ldmVyeShmdW5jdGlvbiAoa2V5KSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmdba2V5XSA9PT0gJ2Z1bmN0aW9uJzsgfSkgJiZcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIC8qIGluc3RhbmNlIG1ldGhvZHMgKi9cclxuICAgICAgICAgICAgJ2NvZGVQb2ludEF0JyxcclxuICAgICAgICAgICAgJ25vcm1hbGl6ZScsXHJcbiAgICAgICAgICAgICdyZXBlYXQnLFxyXG4gICAgICAgICAgICAnc3RhcnRzV2l0aCcsXHJcbiAgICAgICAgICAgICdlbmRzV2l0aCcsXHJcbiAgICAgICAgICAgICdpbmNsdWRlcydcclxuICAgICAgICBdLmV2ZXJ5KGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5wcm90b3R5cGVba2V5XSA9PT0gJ2Z1bmN0aW9uJzsgfSkpO1xyXG59LCB0cnVlKTtcclxuaGFzXzEuYWRkKCdlczYtc3RyaW5nLXJhdycsIGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIGdldENhbGxTaXRlKGNhbGxTaXRlKSB7XHJcbiAgICAgICAgdmFyIHN1YnN0aXR1dGlvbnMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBzdWJzdGl0dXRpb25zW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmVzdWx0ID0gdHNsaWJfMS5fX3NwcmVhZChjYWxsU2l0ZSk7XHJcbiAgICAgICAgcmVzdWx0LnJhdyA9IGNhbGxTaXRlLnJhdztcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgaWYgKCdyYXcnIGluIGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGIgPSAxO1xyXG4gICAgICAgIHZhciBjYWxsU2l0ZSA9IGdldENhbGxTaXRlKHRlbXBsYXRlT2JqZWN0XzEgfHwgKHRlbXBsYXRlT2JqZWN0XzEgPSB0c2xpYl8xLl9fbWFrZVRlbXBsYXRlT2JqZWN0KFtcImFcXG5cIiwgXCJcIl0sIFtcImFcXFxcblwiLCBcIlwiXSkpLCBiKTtcclxuICAgICAgICBjYWxsU2l0ZS5yYXcgPSBbJ2FcXFxcbiddO1xyXG4gICAgICAgIHZhciBzdXBwb3J0c1RydW5jID0gZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucmF3KGNhbGxTaXRlLCA0MikgPT09ICdhOlxcXFxuJztcclxuICAgICAgICByZXR1cm4gc3VwcG9ydHNUcnVuYztcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufSwgdHJ1ZSk7XHJcbmhhc18xLmFkZCgnZXMyMDE3LXN0cmluZycsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBbJ3BhZFN0YXJ0JywgJ3BhZEVuZCddLmV2ZXJ5KGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5wcm90b3R5cGVba2V5XSA9PT0gJ2Z1bmN0aW9uJzsgfSk7XHJcbn0sIHRydWUpO1xyXG4vKiBTeW1ib2wgKi9cclxuaGFzXzEuYWRkKCdlczYtc3ltYm9sJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgU3ltYm9sKCkgPT09ICdzeW1ib2wnOyB9LCB0cnVlKTtcclxuLyogV2Vha01hcCAqL1xyXG5oYXNfMS5hZGQoJ2VzNi13ZWFrbWFwJywgZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LldlYWtNYXAgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgLyogSUUxMSBhbmQgb2xkZXIgdmVyc2lvbnMgb2YgU2FmYXJpIGFyZSBtaXNzaW5nIGNyaXRpY2FsIEVTNiBNYXAgZnVuY3Rpb25hbGl0eSAqL1xyXG4gICAgICAgIHZhciBrZXkxID0ge307XHJcbiAgICAgICAgdmFyIGtleTIgPSB7fTtcclxuICAgICAgICB2YXIgbWFwID0gbmV3IGdsb2JhbF8xLmRlZmF1bHQuV2Vha01hcChbW2tleTEsIDFdXSk7XHJcbiAgICAgICAgT2JqZWN0LmZyZWV6ZShrZXkxKTtcclxuICAgICAgICByZXR1cm4gbWFwLmdldChrZXkxKSA9PT0gMSAmJiBtYXAuc2V0KGtleTIsIDIpID09PSBtYXAgJiYgaGFzXzEuZGVmYXVsdCgnZXM2LXN5bWJvbCcpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59LCB0cnVlKTtcclxuLyogTWlzY2VsbGFuZW91cyBmZWF0dXJlcyAqL1xyXG5oYXNfMS5hZGQoJ21pY3JvdGFza3MnLCBmdW5jdGlvbiAoKSB7IHJldHVybiBoYXNfMS5kZWZhdWx0KCdlczYtcHJvbWlzZScpIHx8IGhhc18xLmRlZmF1bHQoJ2hvc3Qtbm9kZScpIHx8IGhhc18xLmRlZmF1bHQoJ2RvbS1tdXRhdGlvbm9ic2VydmVyJyk7IH0sIHRydWUpO1xyXG5oYXNfMS5hZGQoJ3Bvc3RtZXNzYWdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gSWYgd2luZG93IGlzIHVuZGVmaW5lZCwgYW5kIHdlIGhhdmUgcG9zdE1lc3NhZ2UsIGl0IHByb2JhYmx5IG1lYW5zIHdlJ3JlIGluIGEgd2ViIHdvcmtlci4gV2ViIHdvcmtlcnMgaGF2ZVxyXG4gICAgLy8gcG9zdCBtZXNzYWdlIGJ1dCBpdCBkb2Vzbid0IHdvcmsgaG93IHdlIGV4cGVjdCBpdCB0bywgc28gaXQncyBiZXN0IGp1c3QgdG8gcHJldGVuZCBpdCBkb2Vzbid0IGV4aXN0LlxyXG4gICAgcmV0dXJuIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LndpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQucG9zdE1lc3NhZ2UgPT09ICdmdW5jdGlvbic7XHJcbn0sIHRydWUpO1xyXG5oYXNfMS5hZGQoJ3JhZicsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJzsgfSwgdHJ1ZSk7XHJcbmhhc18xLmFkZCgnc2V0aW1tZWRpYXRlJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuc2V0SW1tZWRpYXRlICE9PSAndW5kZWZpbmVkJzsgfSwgdHJ1ZSk7XHJcbi8qIERPTSBGZWF0dXJlcyAqL1xyXG5oYXNfMS5hZGQoJ2RvbS1tdXRhdGlvbm9ic2VydmVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKGhhc18xLmRlZmF1bHQoJ2hvc3QtYnJvd3NlcicpICYmIEJvb2xlYW4oZ2xvYmFsXzEuZGVmYXVsdC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbF8xLmRlZmF1bHQuV2ViS2l0TXV0YXRpb25PYnNlcnZlcikpIHtcclxuICAgICAgICAvLyBJRTExIGhhcyBhbiB1bnJlbGlhYmxlIE11dGF0aW9uT2JzZXJ2ZXIgaW1wbGVtZW50YXRpb24gd2hlcmUgc2V0UHJvcGVydHkoKSBkb2VzIG5vdFxyXG4gICAgICAgIC8vIGdlbmVyYXRlIGEgbXV0YXRpb24gZXZlbnQsIG9ic2VydmVycyBjYW4gY3Jhc2gsIGFuZCB0aGUgcXVldWUgZG9lcyBub3QgZHJhaW5cclxuICAgICAgICAvLyByZWxpYWJseS4gVGhlIGZvbGxvd2luZyBmZWF0dXJlIHRlc3Qgd2FzIGFkYXB0ZWQgZnJvbVxyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3QxMGtvLzRhY2ViOGM3MTY4MWZkYjI3NWUzM2VmZTVlNTc2YjE0XHJcbiAgICAgICAgdmFyIGV4YW1wbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZSAqL1xyXG4gICAgICAgIHZhciBIb3N0TXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbF8xLmRlZmF1bHQuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWxfMS5kZWZhdWx0LldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IEhvc3RNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uICgpIHsgfSk7XHJcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShleGFtcGxlLCB7IGF0dHJpYnV0ZXM6IHRydWUgfSk7XHJcbiAgICAgICAgZXhhbXBsZS5zdHlsZS5zZXRQcm9wZXJ0eSgnZGlzcGxheScsICdibG9jaycpO1xyXG4gICAgICAgIHJldHVybiBCb29sZWFuKG9ic2VydmVyLnRha2VSZWNvcmRzKCkubGVuZ3RoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufSwgdHJ1ZSk7XHJcbmhhc18xLmFkZCgnZG9tLXdlYmFuaW1hdGlvbicsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGhhc18xLmRlZmF1bHQoJ2hvc3QtYnJvd3NlcicpICYmIGdsb2JhbF8xLmRlZmF1bHQuQW5pbWF0aW9uICE9PSB1bmRlZmluZWQgJiYgZ2xvYmFsXzEuZGVmYXVsdC5LZXlmcmFtZUVmZmVjdCAhPT0gdW5kZWZpbmVkOyB9LCB0cnVlKTtcclxudmFyIHRlbXBsYXRlT2JqZWN0XzE7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L2hhcy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L2hhcy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi4vZ2xvYmFsXCIpO1xyXG52YXIgaGFzXzEgPSByZXF1aXJlKFwiLi9oYXNcIik7XHJcbmZ1bmN0aW9uIGV4ZWN1dGVUYXNrKGl0ZW0pIHtcclxuICAgIGlmIChpdGVtICYmIGl0ZW0uaXNBY3RpdmUgJiYgaXRlbS5jYWxsYmFjaykge1xyXG4gICAgICAgIGl0ZW0uY2FsbGJhY2soKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBnZXRRdWV1ZUhhbmRsZShpdGVtLCBkZXN0cnVjdG9yKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24gKCkgeyB9O1xyXG4gICAgICAgICAgICBpdGVtLmlzQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGl0ZW0uY2FsbGJhY2sgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoZGVzdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICAgICAgZGVzdHJ1Y3RvcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG52YXIgY2hlY2tNaWNyb1Rhc2tRdWV1ZTtcclxudmFyIG1pY3JvVGFza3M7XHJcbi8qKlxyXG4gKiBTY2hlZHVsZXMgYSBjYWxsYmFjayB0byB0aGUgbWFjcm90YXNrIHF1ZXVlLlxyXG4gKlxyXG4gKiBAcGFyYW0gY2FsbGJhY2sgdGhlIGZ1bmN0aW9uIHRvIGJlIHF1ZXVlZCBhbmQgbGF0ZXIgZXhlY3V0ZWQuXHJcbiAqIEByZXR1cm5zIEFuIG9iamVjdCB3aXRoIGEgYGRlc3Ryb3lgIG1ldGhvZCB0aGF0LCB3aGVuIGNhbGxlZCwgcHJldmVudHMgdGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnJvbSBleGVjdXRpbmcuXHJcbiAqL1xyXG5leHBvcnRzLnF1ZXVlVGFzayA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZGVzdHJ1Y3RvcjtcclxuICAgIHZhciBlbnF1ZXVlO1xyXG4gICAgLy8gU2luY2UgdGhlIElFIGltcGxlbWVudGF0aW9uIG9mIGBzZXRJbW1lZGlhdGVgIGlzIG5vdCBmbGF3bGVzcywgd2Ugd2lsbCB0ZXN0IGZvciBgcG9zdE1lc3NhZ2VgIGZpcnN0LlxyXG4gICAgaWYgKGhhc18xLmRlZmF1bHQoJ3Bvc3RtZXNzYWdlJykpIHtcclxuICAgICAgICB2YXIgcXVldWVfMSA9IFtdO1xyXG4gICAgICAgIGdsb2JhbF8xLmRlZmF1bHQuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAvLyBDb25maXJtIHRoYXQgdGhlIGV2ZW50IHdhcyB0cmlnZ2VyZWQgYnkgdGhlIGN1cnJlbnQgd2luZG93IGFuZCBieSB0aGlzIHBhcnRpY3VsYXIgaW1wbGVtZW50YXRpb24uXHJcbiAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IGdsb2JhbF8xLmRlZmF1bHQgJiYgZXZlbnQuZGF0YSA9PT0gJ2Rvam8tcXVldWUtbWVzc2FnZScpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlXzEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZVRhc2socXVldWVfMS5zaGlmdCgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBxdWV1ZV8xLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIGdsb2JhbF8xLmRlZmF1bHQucG9zdE1lc3NhZ2UoJ2Rvam8tcXVldWUtbWVzc2FnZScsICcqJyk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGhhc18xLmRlZmF1bHQoJ3NldGltbWVkaWF0ZScpKSB7XHJcbiAgICAgICAgZGVzdHJ1Y3RvciA9IGdsb2JhbF8xLmRlZmF1bHQuY2xlYXJJbW1lZGlhdGU7XHJcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZXRJbW1lZGlhdGUoZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGRlc3RydWN0b3IgPSBnbG9iYWxfMS5kZWZhdWx0LmNsZWFyVGltZW91dDtcclxuICAgICAgICBlbnF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSwgMCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHF1ZXVlVGFzayhjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBpdGVtID0ge1xyXG4gICAgICAgICAgICBpc0FjdGl2ZTogdHJ1ZSxcclxuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgaWQgPSBlbnF1ZXVlKGl0ZW0pO1xyXG4gICAgICAgIHJldHVybiBnZXRRdWV1ZUhhbmRsZShpdGVtLCBkZXN0cnVjdG9yICYmXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGRlc3RydWN0b3IoaWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vIFRPRE86IFVzZSBhc3BlY3QuYmVmb3JlIHdoZW4gaXQgaXMgYXZhaWxhYmxlLlxyXG4gICAgcmV0dXJuIGhhc18xLmRlZmF1bHQoJ21pY3JvdGFza3MnKVxyXG4gICAgICAgID8gcXVldWVUYXNrXHJcbiAgICAgICAgOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgY2hlY2tNaWNyb1Rhc2tRdWV1ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gcXVldWVUYXNrKGNhbGxiYWNrKTtcclxuICAgICAgICB9O1xyXG59KSgpO1xyXG4vLyBXaGVuIG5vIG1lY2hhbmlzbSBmb3IgcmVnaXN0ZXJpbmcgbWljcm90YXNrcyBpcyBleHBvc2VkIGJ5IHRoZSBlbnZpcm9ubWVudCwgbWljcm90YXNrcyB3aWxsXHJcbi8vIGJlIHF1ZXVlZCBhbmQgdGhlbiBleGVjdXRlZCBpbiBhIHNpbmdsZSBtYWNyb3Rhc2sgYmVmb3JlIHRoZSBvdGhlciBtYWNyb3Rhc2tzIGFyZSBleGVjdXRlZC5cclxuaWYgKCFoYXNfMS5kZWZhdWx0KCdtaWNyb3Rhc2tzJykpIHtcclxuICAgIHZhciBpc01pY3JvVGFza1F1ZXVlZF8xID0gZmFsc2U7XHJcbiAgICBtaWNyb1Rhc2tzID0gW107XHJcbiAgICBjaGVja01pY3JvVGFza1F1ZXVlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghaXNNaWNyb1Rhc2tRdWV1ZWRfMSkge1xyXG4gICAgICAgICAgICBpc01pY3JvVGFza1F1ZXVlZF8xID0gdHJ1ZTtcclxuICAgICAgICAgICAgZXhwb3J0cy5xdWV1ZVRhc2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaXNNaWNyb1Rhc2tRdWV1ZWRfMSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1pY3JvVGFza3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKChpdGVtID0gbWljcm9UYXNrcy5zaGlmdCgpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBleGVjdXRlVGFzayhpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuLyoqXHJcbiAqIFNjaGVkdWxlcyBhbiBhbmltYXRpb24gdGFzayB3aXRoIGB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBpZiBpdCBleGlzdHMsIG9yIHdpdGggYHF1ZXVlVGFza2Agb3RoZXJ3aXNlLlxyXG4gKlxyXG4gKiBTaW5jZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUncyBiZWhhdmlvciBkb2VzIG5vdCBtYXRjaCB0aGF0IGV4cGVjdGVkIGZyb20gYHF1ZXVlVGFza2AsIGl0IGlzIG5vdCB1c2VkIHRoZXJlLlxyXG4gKiBIb3dldmVyLCBhdCB0aW1lcyBpdCBtYWtlcyBtb3JlIHNlbnNlIHRvIGRlbGVnYXRlIHRvIHJlcXVlc3RBbmltYXRpb25GcmFtZTsgaGVuY2UgdGhlIGZvbGxvd2luZyBtZXRob2QuXHJcbiAqXHJcbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgZnVuY3Rpb24gdG8gYmUgcXVldWVkIGFuZCBsYXRlciBleGVjdXRlZC5cclxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggYSBgZGVzdHJveWAgbWV0aG9kIHRoYXQsIHdoZW4gY2FsbGVkLCBwcmV2ZW50cyB0aGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmcm9tIGV4ZWN1dGluZy5cclxuICovXHJcbmV4cG9ydHMucXVldWVBbmltYXRpb25UYXNrID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICghaGFzXzEuZGVmYXVsdCgncmFmJykpIHtcclxuICAgICAgICByZXR1cm4gZXhwb3J0cy5xdWV1ZVRhc2s7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBxdWV1ZUFuaW1hdGlvblRhc2soY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgaXRlbSA9IHtcclxuICAgICAgICAgICAgaXNBY3RpdmU6IHRydWUsXHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIHJhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGV4ZWN1dGVUYXNrLmJpbmQobnVsbCwgaXRlbSkpO1xyXG4gICAgICAgIHJldHVybiBnZXRRdWV1ZUhhbmRsZShpdGVtLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZklkKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vIFRPRE86IFVzZSBhc3BlY3QuYmVmb3JlIHdoZW4gaXQgaXMgYXZhaWxhYmxlLlxyXG4gICAgcmV0dXJuIGhhc18xLmRlZmF1bHQoJ21pY3JvdGFza3MnKVxyXG4gICAgICAgID8gcXVldWVBbmltYXRpb25UYXNrXHJcbiAgICAgICAgOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgY2hlY2tNaWNyb1Rhc2tRdWV1ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gcXVldWVBbmltYXRpb25UYXNrKGNhbGxiYWNrKTtcclxuICAgICAgICB9O1xyXG59KSgpO1xyXG4vKipcclxuICogU2NoZWR1bGVzIGEgY2FsbGJhY2sgdG8gdGhlIG1pY3JvdGFzayBxdWV1ZS5cclxuICpcclxuICogQW55IGNhbGxiYWNrcyByZWdpc3RlcmVkIHdpdGggYHF1ZXVlTWljcm9UYXNrYCB3aWxsIGJlIGV4ZWN1dGVkIGJlZm9yZSB0aGUgbmV4dCBtYWNyb3Rhc2suIElmIG5vIG5hdGl2ZVxyXG4gKiBtZWNoYW5pc20gZm9yIHNjaGVkdWxpbmcgbWFjcm90YXNrcyBpcyBleHBvc2VkLCB0aGVuIGFueSBjYWxsYmFja3Mgd2lsbCBiZSBmaXJlZCBiZWZvcmUgYW55IG1hY3JvdGFza1xyXG4gKiByZWdpc3RlcmVkIHdpdGggYHF1ZXVlVGFza2Agb3IgYHF1ZXVlQW5pbWF0aW9uVGFza2AuXHJcbiAqXHJcbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgZnVuY3Rpb24gdG8gYmUgcXVldWVkIGFuZCBsYXRlciBleGVjdXRlZC5cclxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggYSBgZGVzdHJveWAgbWV0aG9kIHRoYXQsIHdoZW4gY2FsbGVkLCBwcmV2ZW50cyB0aGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmcm9tIGV4ZWN1dGluZy5cclxuICovXHJcbmV4cG9ydHMucXVldWVNaWNyb1Rhc2sgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGVucXVldWU7XHJcbiAgICBpZiAoaGFzXzEuZGVmYXVsdCgnaG9zdC1ub2RlJykpIHtcclxuICAgICAgICBlbnF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgZ2xvYmFsXzEuZGVmYXVsdC5wcm9jZXNzLm5leHRUaWNrKGV4ZWN1dGVUYXNrLmJpbmQobnVsbCwgaXRlbSkpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChoYXNfMS5kZWZhdWx0KCdlczYtcHJvbWlzZScpKSB7XHJcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGdsb2JhbF8xLmRlZmF1bHQuUHJvbWlzZS5yZXNvbHZlKGl0ZW0pLnRoZW4oZXhlY3V0ZVRhc2spO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChoYXNfMS5kZWZhdWx0KCdkb20tbXV0YXRpb25vYnNlcnZlcicpKSB7XHJcbiAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWUgKi9cclxuICAgICAgICB2YXIgSG9zdE11dGF0aW9uT2JzZXJ2ZXIgPSBnbG9iYWxfMS5kZWZhdWx0Lk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsXzEuZGVmYXVsdC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xyXG4gICAgICAgIHZhciBub2RlXzEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB2YXIgcXVldWVfMiA9IFtdO1xyXG4gICAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBIb3N0TXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChxdWV1ZV8yLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gcXVldWVfMi5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gJiYgaXRlbS5pc0FjdGl2ZSAmJiBpdGVtLmNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlXzEsIHsgYXR0cmlidXRlczogdHJ1ZSB9KTtcclxuICAgICAgICBlbnF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgcXVldWVfMi5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICBub2RlXzEuc2V0QXR0cmlidXRlKCdxdWV1ZVN0YXR1cycsICcxJyk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBjaGVja01pY3JvVGFza1F1ZXVlKCk7XHJcbiAgICAgICAgICAgIG1pY3JvVGFza3MucHVzaChpdGVtKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBpdGVtID0ge1xyXG4gICAgICAgICAgICBpc0FjdGl2ZTogdHJ1ZSxcclxuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXHJcbiAgICAgICAgfTtcclxuICAgICAgICBlbnF1ZXVlKGl0ZW0pO1xyXG4gICAgICAgIHJldHVybiBnZXRRdWV1ZUhhbmRsZShpdGVtKTtcclxuICAgIH07XHJcbn0pKCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L3F1ZXVlLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvcXVldWUuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLyoqXHJcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBnZW5lcmF0ZSBhIHZhbHVlIHByb3BlcnR5IGRlc2NyaXB0b3JcclxuICpcclxuICogQHBhcmFtIHZhbHVlICAgICAgICBUaGUgdmFsdWUgdGhlIHByb3BlcnR5IGRlc2NyaXB0b3Igc2hvdWxkIGJlIHNldCB0b1xyXG4gKiBAcGFyYW0gZW51bWVyYWJsZSAgIElmIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgZW51bWJlcmFibGUsIGRlZmF1bHRzIHRvIGZhbHNlXHJcbiAqIEBwYXJhbSB3cml0YWJsZSAgICAgSWYgdGhlIHByb3BlcnR5IHNob3VsZCBiZSB3cml0YWJsZSwgZGVmYXVsdHMgdG8gdHJ1ZVxyXG4gKiBAcGFyYW0gY29uZmlndXJhYmxlIElmIHRoZSBwcm9wZXJ0eSBzaG91bGQgYmUgY29uZmlndXJhYmxlLCBkZWZhdWx0cyB0byB0cnVlXHJcbiAqIEByZXR1cm4gICAgICAgICAgICAgVGhlIHByb3BlcnR5IGRlc2NyaXB0b3Igb2JqZWN0XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRWYWx1ZURlc2NyaXB0b3IodmFsdWUsIGVudW1lcmFibGUsIHdyaXRhYmxlLCBjb25maWd1cmFibGUpIHtcclxuICAgIGlmIChlbnVtZXJhYmxlID09PSB2b2lkIDApIHsgZW51bWVyYWJsZSA9IGZhbHNlOyB9XHJcbiAgICBpZiAod3JpdGFibGUgPT09IHZvaWQgMCkgeyB3cml0YWJsZSA9IHRydWU7IH1cclxuICAgIGlmIChjb25maWd1cmFibGUgPT09IHZvaWQgMCkgeyBjb25maWd1cmFibGUgPSB0cnVlOyB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgICBlbnVtZXJhYmxlOiBlbnVtZXJhYmxlLFxyXG4gICAgICAgIHdyaXRhYmxlOiB3cml0YWJsZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IGNvbmZpZ3VyYWJsZVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLmdldFZhbHVlRGVzY3JpcHRvciA9IGdldFZhbHVlRGVzY3JpcHRvcjtcclxuZnVuY3Rpb24gd3JhcE5hdGl2ZShuYXRpdmVGdW5jdGlvbikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIGFyZ3NbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuYXRpdmVGdW5jdGlvbi5hcHBseSh0YXJnZXQsIGFyZ3MpO1xyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLndyYXBOYXRpdmUgPSB3cmFwTmF0aXZlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC91dGlsLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvdXRpbC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIFdpZGdldEJhc2VfMSA9IHJlcXVpcmUoXCIuL1dpZGdldEJhc2VcIik7XHJcbnZhciBpbmplY3RfMSA9IHJlcXVpcmUoXCIuL2RlY29yYXRvcnMvaW5qZWN0XCIpO1xyXG52YXIgZF8xID0gcmVxdWlyZShcIi4vZFwiKTtcclxudmFyIGFsd2F5c1JlbmRlcl8xID0gcmVxdWlyZShcIi4vZGVjb3JhdG9ycy9hbHdheXNSZW5kZXJcIik7XHJcbmZ1bmN0aW9uIENvbnRhaW5lcihjb21wb25lbnQsIG5hbWUsIF9hKSB7XHJcbiAgICB2YXIgZ2V0UHJvcGVydGllcyA9IF9hLmdldFByb3BlcnRpZXM7XHJcbiAgICB2YXIgV2lkZ2V0Q29udGFpbmVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIHRzbGliXzEuX19leHRlbmRzKFdpZGdldENvbnRhaW5lciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBXaWRnZXRDb250YWluZXIoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgV2lkZ2V0Q29udGFpbmVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkXzEudyhjb21wb25lbnQsIHRoaXMucHJvcGVydGllcywgdGhpcy5jaGlsZHJlbik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBXaWRnZXRDb250YWluZXIgPSB0c2xpYl8xLl9fZGVjb3JhdGUoW1xyXG4gICAgICAgICAgICBhbHdheXNSZW5kZXJfMS5hbHdheXNSZW5kZXIoKSxcclxuICAgICAgICAgICAgaW5qZWN0XzEuaW5qZWN0KHsgbmFtZTogbmFtZSwgZ2V0UHJvcGVydGllczogZ2V0UHJvcGVydGllcyB9KVxyXG4gICAgICAgIF0sIFdpZGdldENvbnRhaW5lcik7XHJcbiAgICAgICAgcmV0dXJuIFdpZGdldENvbnRhaW5lcjtcclxuICAgIH0oV2lkZ2V0QmFzZV8xLldpZGdldEJhc2UpKTtcclxuICAgIHJldHVybiBXaWRnZXRDb250YWluZXI7XHJcbn1cclxuZXhwb3J0cy5Db250YWluZXIgPSBDb250YWluZXI7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IENvbnRhaW5lcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9Db250YWluZXIuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL0NvbnRhaW5lci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIEV2ZW50ZWRfMSA9IHJlcXVpcmUoXCJAZG9qby9jb3JlL0V2ZW50ZWRcIik7XHJcbnZhciBJbmplY3RvciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKEluamVjdG9yLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gSW5qZWN0b3IocGF5bG9hZCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuX3BheWxvYWQgPSBwYXlsb2FkO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIEluamVjdG9yLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BheWxvYWQ7XHJcbiAgICB9O1xyXG4gICAgSW5qZWN0b3IucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChwYXlsb2FkKSB7XHJcbiAgICAgICAgdGhpcy5fcGF5bG9hZCA9IHBheWxvYWQ7XHJcbiAgICAgICAgdGhpcy5lbWl0KHsgdHlwZTogJ2ludmFsaWRhdGUnIH0pO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBJbmplY3RvcjtcclxufShFdmVudGVkXzEuRXZlbnRlZCkpO1xyXG5leHBvcnRzLkluamVjdG9yID0gSW5qZWN0b3I7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEluamVjdG9yO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL0luamVjdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9JbmplY3Rvci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIEV2ZW50ZWRfMSA9IHJlcXVpcmUoXCJAZG9qby9jb3JlL0V2ZW50ZWRcIik7XHJcbnZhciBNYXBfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL01hcFwiKTtcclxuLyoqXHJcbiAqIEVudW0gdG8gaWRlbnRpZnkgdGhlIHR5cGUgb2YgZXZlbnQuXHJcbiAqIExpc3RlbmluZyB0byAnUHJvamVjdG9yJyB3aWxsIG5vdGlmeSB3aGVuIHByb2plY3RvciBpcyBjcmVhdGVkIG9yIHVwZGF0ZWRcclxuICogTGlzdGVuaW5nIHRvICdXaWRnZXQnIHdpbGwgbm90aWZ5IHdoZW4gd2lkZ2V0IHJvb3QgaXMgY3JlYXRlZCBvciB1cGRhdGVkXHJcbiAqL1xyXG52YXIgTm9kZUV2ZW50VHlwZTtcclxuKGZ1bmN0aW9uIChOb2RlRXZlbnRUeXBlKSB7XHJcbiAgICBOb2RlRXZlbnRUeXBlW1wiUHJvamVjdG9yXCJdID0gXCJQcm9qZWN0b3JcIjtcclxuICAgIE5vZGVFdmVudFR5cGVbXCJXaWRnZXRcIl0gPSBcIldpZGdldFwiO1xyXG59KShOb2RlRXZlbnRUeXBlID0gZXhwb3J0cy5Ob2RlRXZlbnRUeXBlIHx8IChleHBvcnRzLk5vZGVFdmVudFR5cGUgPSB7fSkpO1xyXG52YXIgTm9kZUhhbmRsZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhOb2RlSGFuZGxlciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIE5vZGVIYW5kbGVyKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLl9ub2RlTWFwID0gbmV3IE1hcF8xLmRlZmF1bHQoKTtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBOb2RlSGFuZGxlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ub2RlTWFwLmdldChrZXkpO1xyXG4gICAgfTtcclxuICAgIE5vZGVIYW5kbGVyLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vZGVNYXAuaGFzKGtleSk7XHJcbiAgICB9O1xyXG4gICAgTm9kZUhhbmRsZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChlbGVtZW50LCBrZXkpIHtcclxuICAgICAgICB0aGlzLl9ub2RlTWFwLnNldChrZXksIGVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMuZW1pdCh7IHR5cGU6IGtleSB9KTtcclxuICAgIH07XHJcbiAgICBOb2RlSGFuZGxlci5wcm90b3R5cGUuYWRkUm9vdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmVtaXQoeyB0eXBlOiBOb2RlRXZlbnRUeXBlLldpZGdldCB9KTtcclxuICAgIH07XHJcbiAgICBOb2RlSGFuZGxlci5wcm90b3R5cGUuYWRkUHJvamVjdG9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZW1pdCh7IHR5cGU6IE5vZGVFdmVudFR5cGUuUHJvamVjdG9yIH0pO1xyXG4gICAgfTtcclxuICAgIE5vZGVIYW5kbGVyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLl9ub2RlTWFwLmNsZWFyKCk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE5vZGVIYW5kbGVyO1xyXG59KEV2ZW50ZWRfMS5FdmVudGVkKSk7XHJcbmV4cG9ydHMuTm9kZUhhbmRsZXIgPSBOb2RlSGFuZGxlcjtcclxuZXhwb3J0cy5kZWZhdWx0ID0gTm9kZUhhbmRsZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvTm9kZUhhbmRsZXIuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL05vZGVIYW5kbGVyLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgUHJvbWlzZV8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vUHJvbWlzZVwiKTtcclxudmFyIE1hcF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vTWFwXCIpO1xyXG52YXIgU3ltYm9sXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9TeW1ib2xcIik7XHJcbnZhciBFdmVudGVkXzEgPSByZXF1aXJlKFwiQGRvam8vY29yZS9FdmVudGVkXCIpO1xyXG4vKipcclxuICogV2lkZ2V0IGJhc2Ugc3ltYm9sIHR5cGVcclxuICovXHJcbmV4cG9ydHMuV0lER0VUX0JBU0VfVFlQRSA9IFN5bWJvbF8xLmRlZmF1bHQoJ1dpZGdldCBCYXNlJyk7XHJcbi8qKlxyXG4gKiBDaGVja3MgaXMgdGhlIGl0ZW0gaXMgYSBzdWJjbGFzcyBvZiBXaWRnZXRCYXNlIChvciBhIFdpZGdldEJhc2UpXHJcbiAqXHJcbiAqIEBwYXJhbSBpdGVtIHRoZSBpdGVtIHRvIGNoZWNrXHJcbiAqIEByZXR1cm5zIHRydWUvZmFsc2UgaW5kaWNhdGluZyBpZiB0aGUgaXRlbSBpcyBhIFdpZGdldEJhc2VDb25zdHJ1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IoaXRlbSkge1xyXG4gICAgcmV0dXJuIEJvb2xlYW4oaXRlbSAmJiBpdGVtLl90eXBlID09PSBleHBvcnRzLldJREdFVF9CQVNFX1RZUEUpO1xyXG59XHJcbmV4cG9ydHMuaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IgPSBpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcjtcclxuZnVuY3Rpb24gaXNXaWRnZXRDb25zdHJ1Y3RvckRlZmF1bHRFeHBvcnQoaXRlbSkge1xyXG4gICAgcmV0dXJuIEJvb2xlYW4oaXRlbSAmJlxyXG4gICAgICAgIGl0ZW0uaGFzT3duUHJvcGVydHkoJ19fZXNNb2R1bGUnKSAmJlxyXG4gICAgICAgIGl0ZW0uaGFzT3duUHJvcGVydHkoJ2RlZmF1bHQnKSAmJlxyXG4gICAgICAgIGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKGl0ZW0uZGVmYXVsdCkpO1xyXG59XHJcbmV4cG9ydHMuaXNXaWRnZXRDb25zdHJ1Y3RvckRlZmF1bHRFeHBvcnQgPSBpc1dpZGdldENvbnN0cnVjdG9yRGVmYXVsdEV4cG9ydDtcclxuLyoqXHJcbiAqIFRoZSBSZWdpc3RyeSBpbXBsZW1lbnRhdGlvblxyXG4gKi9cclxudmFyIFJlZ2lzdHJ5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoUmVnaXN0cnksIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBSZWdpc3RyeSgpIHtcclxuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEVtaXQgbG9hZGVkIGV2ZW50IGZvciByZWdpc3RyeSBsYWJlbFxyXG4gICAgICovXHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuZW1pdExvYWRlZEV2ZW50ID0gZnVuY3Rpb24gKHdpZGdldExhYmVsLCBpdGVtKSB7XHJcbiAgICAgICAgdGhpcy5lbWl0KHtcclxuICAgICAgICAgICAgdHlwZTogd2lkZ2V0TGFiZWwsXHJcbiAgICAgICAgICAgIGFjdGlvbjogJ2xvYWRlZCcsXHJcbiAgICAgICAgICAgIGl0ZW06IGl0ZW1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuZGVmaW5lID0gZnVuY3Rpb24gKGxhYmVsLCBpdGVtKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy5fd2lkZ2V0UmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl93aWRnZXRSZWdpc3RyeSA9IG5ldyBNYXBfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl93aWRnZXRSZWdpc3RyeS5oYXMobGFiZWwpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIndpZGdldCBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQgZm9yICdcIiArIGxhYmVsLnRvU3RyaW5nKCkgKyBcIidcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgaXRlbSk7XHJcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBQcm9taXNlXzEuZGVmYXVsdCkge1xyXG4gICAgICAgICAgICBpdGVtLnRoZW4oZnVuY3Rpb24gKHdpZGdldEN0b3IpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLl93aWRnZXRSZWdpc3RyeS5zZXQobGFiZWwsIHdpZGdldEN0b3IpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZW1pdExvYWRlZEV2ZW50KGxhYmVsLCB3aWRnZXRDdG9yKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB3aWRnZXRDdG9yO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IoaXRlbSkpIHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuZGVmaW5lSW5qZWN0b3IgPSBmdW5jdGlvbiAobGFiZWwsIGl0ZW0pIHtcclxuICAgICAgICBpZiAodGhpcy5faW5qZWN0b3JSZWdpc3RyeSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luamVjdG9yUmVnaXN0cnkgPSBuZXcgTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5faW5qZWN0b3JSZWdpc3RyeS5oYXMobGFiZWwpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImluamVjdG9yIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCBmb3IgJ1wiICsgbGFiZWwudG9TdHJpbmcoKSArIFwiJ1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5faW5qZWN0b3JSZWdpc3RyeS5zZXQobGFiZWwsIGl0ZW0pO1xyXG4gICAgICAgIHRoaXMuZW1pdExvYWRlZEV2ZW50KGxhYmVsLCBpdGVtKTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAoIXRoaXMuaGFzKGxhYmVsKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl93aWRnZXRSZWdpc3RyeS5nZXQobGFiZWwpO1xyXG4gICAgICAgIGlmIChpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcihpdGVtKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBQcm9taXNlXzEuZGVmYXVsdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHByb21pc2UgPSBpdGVtKCk7XHJcbiAgICAgICAgdGhpcy5fd2lkZ2V0UmVnaXN0cnkuc2V0KGxhYmVsLCBwcm9taXNlKTtcclxuICAgICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHdpZGdldEN0b3IpIHtcclxuICAgICAgICAgICAgaWYgKGlzV2lkZ2V0Q29uc3RydWN0b3JEZWZhdWx0RXhwb3J0KHdpZGdldEN0b3IpKSB7XHJcbiAgICAgICAgICAgICAgICB3aWRnZXRDdG9yID0gd2lkZ2V0Q3Rvci5kZWZhdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF90aGlzLl93aWRnZXRSZWdpc3RyeS5zZXQobGFiZWwsIHdpZGdldEN0b3IpO1xyXG4gICAgICAgICAgICBfdGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIHdpZGdldEN0b3IpO1xyXG4gICAgICAgICAgICByZXR1cm4gd2lkZ2V0Q3RvcjtcclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9O1xyXG4gICAgUmVnaXN0cnkucHJvdG90eXBlLmdldEluamVjdG9yID0gZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc0luamVjdG9yKGxhYmVsKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luamVjdG9yUmVnaXN0cnkuZ2V0KGxhYmVsKTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5fd2lkZ2V0UmVnaXN0cnkgJiYgdGhpcy5fd2lkZ2V0UmVnaXN0cnkuaGFzKGxhYmVsKSk7XHJcbiAgICB9O1xyXG4gICAgUmVnaXN0cnkucHJvdG90eXBlLmhhc0luamVjdG9yID0gZnVuY3Rpb24gKGxhYmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5faW5qZWN0b3JSZWdpc3RyeSAmJiB0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LmhhcyhsYWJlbCkpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBSZWdpc3RyeTtcclxufShFdmVudGVkXzEuRXZlbnRlZCkpO1xyXG5leHBvcnRzLlJlZ2lzdHJ5ID0gUmVnaXN0cnk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFJlZ2lzdHJ5O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL1JlZ2lzdHJ5LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIE1hcF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vTWFwXCIpO1xyXG52YXIgRXZlbnRlZF8xID0gcmVxdWlyZShcIkBkb2pvL2NvcmUvRXZlbnRlZFwiKTtcclxudmFyIFJlZ2lzdHJ5XzEgPSByZXF1aXJlKFwiLi9SZWdpc3RyeVwiKTtcclxudmFyIFJlZ2lzdHJ5SGFuZGxlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKFJlZ2lzdHJ5SGFuZGxlciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFJlZ2lzdHJ5SGFuZGxlcigpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLl9yZWdpc3RyeSA9IG5ldyBSZWdpc3RyeV8xLlJlZ2lzdHJ5KCk7XHJcbiAgICAgICAgX3RoaXMuX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXAgPSBuZXcgTWFwXzEuTWFwKCk7XHJcbiAgICAgICAgX3RoaXMuX3JlZ2lzdHJ5SW5qZWN0b3JMYWJlbE1hcCA9IG5ldyBNYXBfMS5NYXAoKTtcclxuICAgICAgICBfdGhpcy5vd24oX3RoaXMuX3JlZ2lzdHJ5KTtcclxuICAgICAgICB2YXIgZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKF90aGlzLmJhc2VSZWdpc3RyeSkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXAuZGVsZXRlKF90aGlzLmJhc2VSZWdpc3RyeSk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwLmRlbGV0ZShfdGhpcy5iYXNlUmVnaXN0cnkpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuYmFzZVJlZ2lzdHJ5ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBfdGhpcy5vd24oeyBkZXN0cm95OiBkZXN0cm95IH0pO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWdpc3RyeUhhbmRsZXIucHJvdG90eXBlLCBcImJhc2VcIiwge1xyXG4gICAgICAgIHNldDogZnVuY3Rpb24gKGJhc2VSZWdpc3RyeSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5iYXNlUmVnaXN0cnkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXAuZGVsZXRlKHRoaXMuYmFzZVJlZ2lzdHJ5KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5SW5qZWN0b3JMYWJlbE1hcC5kZWxldGUodGhpcy5iYXNlUmVnaXN0cnkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYmFzZVJlZ2lzdHJ5ID0gYmFzZVJlZ2lzdHJ5O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgUmVnaXN0cnlIYW5kbGVyLnByb3RvdHlwZS5kZWZpbmUgPSBmdW5jdGlvbiAobGFiZWwsIHdpZGdldCkge1xyXG4gICAgICAgIHRoaXMuX3JlZ2lzdHJ5LmRlZmluZShsYWJlbCwgd2lkZ2V0KTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeUhhbmRsZXIucHJvdG90eXBlLmRlZmluZUluamVjdG9yID0gZnVuY3Rpb24gKGxhYmVsLCBpbmplY3Rvcikge1xyXG4gICAgICAgIHRoaXMuX3JlZ2lzdHJ5LmRlZmluZUluamVjdG9yKGxhYmVsLCBpbmplY3Rvcik7XHJcbiAgICB9O1xyXG4gICAgUmVnaXN0cnlIYW5kbGVyLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAobGFiZWwpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVnaXN0cnkuaGFzKGxhYmVsKSB8fCBCb29sZWFuKHRoaXMuYmFzZVJlZ2lzdHJ5ICYmIHRoaXMuYmFzZVJlZ2lzdHJ5LmhhcyhsYWJlbCkpO1xyXG4gICAgfTtcclxuICAgIFJlZ2lzdHJ5SGFuZGxlci5wcm90b3R5cGUuaGFzSW5qZWN0b3IgPSBmdW5jdGlvbiAobGFiZWwpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVnaXN0cnkuaGFzSW5qZWN0b3IobGFiZWwpIHx8IEJvb2xlYW4odGhpcy5iYXNlUmVnaXN0cnkgJiYgdGhpcy5iYXNlUmVnaXN0cnkuaGFzSW5qZWN0b3IobGFiZWwpKTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeUhhbmRsZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSkge1xyXG4gICAgICAgIGlmIChnbG9iYWxQcmVjZWRlbmNlID09PSB2b2lkIDApIHsgZ2xvYmFsUHJlY2VkZW5jZSA9IGZhbHNlOyB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldChsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSwgJ2dldCcsIHRoaXMuX3JlZ2lzdHJ5V2lkZ2V0TGFiZWxNYXApO1xyXG4gICAgfTtcclxuICAgIFJlZ2lzdHJ5SGFuZGxlci5wcm90b3R5cGUuZ2V0SW5qZWN0b3IgPSBmdW5jdGlvbiAobGFiZWwsIGdsb2JhbFByZWNlZGVuY2UpIHtcclxuICAgICAgICBpZiAoZ2xvYmFsUHJlY2VkZW5jZSA9PT0gdm9pZCAwKSB7IGdsb2JhbFByZWNlZGVuY2UgPSBmYWxzZTsgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9nZXQobGFiZWwsIGdsb2JhbFByZWNlZGVuY2UsICdnZXRJbmplY3RvcicsIHRoaXMuX3JlZ2lzdHJ5SW5qZWN0b3JMYWJlbE1hcCk7XHJcbiAgICB9O1xyXG4gICAgUmVnaXN0cnlIYW5kbGVyLnByb3RvdHlwZS5fZ2V0ID0gZnVuY3Rpb24gKGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlLCBnZXRGdW5jdGlvbk5hbWUsIGxhYmVsTWFwKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgcmVnaXN0cmllcyA9IGdsb2JhbFByZWNlZGVuY2UgPyBbdGhpcy5iYXNlUmVnaXN0cnksIHRoaXMuX3JlZ2lzdHJ5XSA6IFt0aGlzLl9yZWdpc3RyeSwgdGhpcy5iYXNlUmVnaXN0cnldO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVnaXN0cmllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcmVnaXN0cnkgPSByZWdpc3RyaWVzW2ldO1xyXG4gICAgICAgICAgICBpZiAoIXJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHJlZ2lzdHJ5W2dldEZ1bmN0aW9uTmFtZV0obGFiZWwpO1xyXG4gICAgICAgICAgICB2YXIgcmVnaXN0ZXJlZExhYmVscyA9IGxhYmVsTWFwLmdldChyZWdpc3RyeSkgfHwgW107XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChyZWdpc3RlcmVkTGFiZWxzLmluZGV4T2YobGFiZWwpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZSA9IHJlZ2lzdHJ5Lm9uKGxhYmVsLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQuYWN0aW9uID09PSAnbG9hZGVkJyAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpc1tnZXRGdW5jdGlvbk5hbWVdKGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlKSA9PT0gZXZlbnQuaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5lbWl0KHsgdHlwZTogJ2ludmFsaWRhdGUnIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vd24oaGFuZGxlKTtcclxuICAgICAgICAgICAgICAgIGxhYmVsTWFwLnNldChyZWdpc3RyeSwgdHNsaWJfMS5fX3NwcmVhZChyZWdpc3RlcmVkTGFiZWxzLCBbbGFiZWxdKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFJlZ2lzdHJ5SGFuZGxlcjtcclxufShFdmVudGVkXzEuRXZlbnRlZCkpO1xyXG5leHBvcnRzLlJlZ2lzdHJ5SGFuZGxlciA9IFJlZ2lzdHJ5SGFuZGxlcjtcclxuZXhwb3J0cy5kZWZhdWx0ID0gUmVnaXN0cnlIYW5kbGVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL1JlZ2lzdHJ5SGFuZGxlci5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvUmVnaXN0cnlIYW5kbGVyLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgTWFwXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9NYXBcIik7XHJcbnZhciBXZWFrTWFwXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9XZWFrTWFwXCIpO1xyXG52YXIgZF8xID0gcmVxdWlyZShcIi4vZFwiKTtcclxudmFyIGRpZmZfMSA9IHJlcXVpcmUoXCIuL2RpZmZcIik7XHJcbnZhciBSZWdpc3RyeUhhbmRsZXJfMSA9IHJlcXVpcmUoXCIuL1JlZ2lzdHJ5SGFuZGxlclwiKTtcclxudmFyIE5vZGVIYW5kbGVyXzEgPSByZXF1aXJlKFwiLi9Ob2RlSGFuZGxlclwiKTtcclxudmFyIHZkb21fMSA9IHJlcXVpcmUoXCIuL3Zkb21cIik7XHJcbnZhciBSZWdpc3RyeV8xID0gcmVxdWlyZShcIi4vUmVnaXN0cnlcIik7XHJcbnZhciBkZWNvcmF0b3JNYXAgPSBuZXcgTWFwXzEuZGVmYXVsdCgpO1xyXG52YXIgYm91bmRBdXRvID0gZGlmZl8xLmF1dG8uYmluZChudWxsKTtcclxuLyoqXHJcbiAqIE1haW4gd2lkZ2V0IGJhc2UgZm9yIGFsbCB3aWRnZXRzIHRvIGV4dGVuZFxyXG4gKi9cclxudmFyIFdpZGdldEJhc2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBXaWRnZXRCYXNlKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW5kaWNhdGVzIGlmIGl0IGlzIHRoZSBpbml0aWFsIHNldCBwcm9wZXJ0aWVzIGN5Y2xlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5faW5pdGlhbFByb3BlcnRpZXMgPSB0cnVlO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFycmF5IG9mIHByb3BlcnR5IGtleXMgY29uc2lkZXJlZCBjaGFuZ2VkIGZyb20gdGhlIHByZXZpb3VzIHNldCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX25vZGVIYW5kbGVyID0gbmV3IE5vZGVIYW5kbGVyXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMuX2hhbmRsZXMgPSBbXTtcclxuICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIHRoaXMuX2RlY29yYXRvckNhY2hlID0gbmV3IE1hcF8xLmRlZmF1bHQoKTtcclxuICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0ge307XHJcbiAgICAgICAgdGhpcy5fYm91bmRSZW5kZXJGdW5jID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLl9ib3VuZEludmFsaWRhdGUgPSB0aGlzLmludmFsaWRhdGUuYmluZCh0aGlzKTtcclxuICAgICAgICB2ZG9tXzEud2lkZ2V0SW5zdGFuY2VNYXAuc2V0KHRoaXMsIHtcclxuICAgICAgICAgICAgZGlydHk6IHRydWUsXHJcbiAgICAgICAgICAgIG9uQXR0YWNoOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5vbkF0dGFjaCgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkRldGFjaDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMub25EZXRhY2goKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbm9kZUhhbmRsZXI6IHRoaXMuX25vZGVIYW5kbGVyLFxyXG4gICAgICAgICAgICByZWdpc3RyeTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLnJlZ2lzdHJ5O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb3JlUHJvcGVydGllczoge30sXHJcbiAgICAgICAgICAgIHJlbmRlcmluZzogZmFsc2UsXHJcbiAgICAgICAgICAgIGlucHV0UHJvcGVydGllczoge31cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9ydW5BZnRlckNvbnN0cnVjdG9ycygpO1xyXG4gICAgfVxyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUubWV0YSA9IGZ1bmN0aW9uIChNZXRhVHlwZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tZXRhTWFwID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWV0YU1hcCA9IG5ldyBNYXBfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjYWNoZWQgPSB0aGlzLl9tZXRhTWFwLmdldChNZXRhVHlwZSk7XHJcbiAgICAgICAgaWYgKCFjYWNoZWQpIHtcclxuICAgICAgICAgICAgY2FjaGVkID0gbmV3IE1ldGFUeXBlKHtcclxuICAgICAgICAgICAgICAgIGludmFsaWRhdGU6IHRoaXMuX2JvdW5kSW52YWxpZGF0ZSxcclxuICAgICAgICAgICAgICAgIG5vZGVIYW5kbGVyOiB0aGlzLl9ub2RlSGFuZGxlcixcclxuICAgICAgICAgICAgICAgIGJpbmQ6IHRoaXNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMub3duKGNhY2hlZCk7XHJcbiAgICAgICAgICAgIHRoaXMuX21ldGFNYXAuc2V0KE1ldGFUeXBlLCBjYWNoZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2FjaGVkO1xyXG4gICAgfTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLm9uQXR0YWNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIERvIG5vdGhpbmcgYnkgZGVmYXVsdC5cclxuICAgIH07XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5vbkRldGFjaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBEbyBub3RoaW5nIGJ5IGRlZmF1bHQuXHJcbiAgICB9O1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdpZGdldEJhc2UucHJvdG90eXBlLCBcInByb3BlcnRpZXNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJvcGVydGllcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXaWRnZXRCYXNlLnByb3RvdHlwZSwgXCJjaGFuZ2VkUHJvcGVydHlLZXlzXCIsIHtcclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRzbGliXzEuX19zcHJlYWQodGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5cyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5fX3NldENvcmVQcm9wZXJ0aWVzX18gPSBmdW5jdGlvbiAoY29yZVByb3BlcnRpZXMpIHtcclxuICAgICAgICB2YXIgYmFzZVJlZ2lzdHJ5ID0gY29yZVByb3BlcnRpZXMuYmFzZVJlZ2lzdHJ5O1xyXG4gICAgICAgIHZhciBpbnN0YW5jZURhdGEgPSB2ZG9tXzEud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpO1xyXG4gICAgICAgIGlmIChpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMuYmFzZVJlZ2lzdHJ5ICE9PSBiYXNlUmVnaXN0cnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5SGFuZGxlcl8xLmRlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub3duKHRoaXMuX3JlZ2lzdHJ5KTtcclxuICAgICAgICAgICAgICAgIHRoaXMub3duKHRoaXMuX3JlZ2lzdHJ5Lm9uKCdpbnZhbGlkYXRlJywgdGhpcy5fYm91bmRJbnZhbGlkYXRlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnkuYmFzZSA9IGJhc2VSZWdpc3RyeTtcclxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcyA9IGNvcmVQcm9wZXJ0aWVzO1xyXG4gICAgfTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9fc2V0UHJvcGVydGllc19fID0gZnVuY3Rpb24gKG9yaWdpbmFsUHJvcGVydGllcykge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IHZkb21fMS53aWRnZXRJbnN0YW5jZU1hcC5nZXQodGhpcyk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLmlucHV0UHJvcGVydGllcyA9IG9yaWdpbmFsUHJvcGVydGllcztcclxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRoaXMuX3J1bkJlZm9yZVByb3BlcnRpZXMob3JpZ2luYWxQcm9wZXJ0aWVzKTtcclxuICAgICAgICB2YXIgcmVnaXN0ZXJlZERpZmZQcm9wZXJ0eU5hbWVzID0gdGhpcy5nZXREZWNvcmF0b3IoJ3JlZ2lzdGVyZWREaWZmUHJvcGVydHknKTtcclxuICAgICAgICB2YXIgY2hhbmdlZFByb3BlcnR5S2V5cyA9IFtdO1xyXG4gICAgICAgIHZhciBwcm9wZXJ0eU5hbWVzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2luaXRpYWxQcm9wZXJ0aWVzID09PSBmYWxzZSB8fCByZWdpc3RlcmVkRGlmZlByb3BlcnR5TmFtZXMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHZhciBhbGxQcm9wZXJ0aWVzID0gdHNsaWJfMS5fX3NwcmVhZChwcm9wZXJ0eU5hbWVzLCBPYmplY3Qua2V5cyh0aGlzLl9wcm9wZXJ0aWVzKSk7XHJcbiAgICAgICAgICAgIHZhciBjaGVja2VkUHJvcGVydGllcyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgZGlmZlByb3BlcnR5UmVzdWx0cyA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgcnVuUmVhY3Rpb25zID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsUHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5TmFtZSA9IGFsbFByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tlZFByb3BlcnRpZXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2hlY2tlZFByb3BlcnRpZXMucHVzaChwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzUHJvcGVydHkgPSB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3UHJvcGVydHkgPSB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eShwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0sIGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iaW5kKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZWdpc3RlcmVkRGlmZlByb3BlcnR5TmFtZXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJ1blJlYWN0aW9ucyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpZmZGdW5jdGlvbnMgPSB0aGlzLmdldERlY29yYXRvcihcImRpZmZQcm9wZXJ0eTpcIiArIHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaV8xID0gMDsgaV8xIDwgZGlmZkZ1bmN0aW9ucy5sZW5ndGg7IGlfMSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBkaWZmRnVuY3Rpb25zW2lfMV0ocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmNoYW5nZWQgJiYgY2hhbmdlZFByb3BlcnR5S2V5cy5pbmRleE9mKHByb3BlcnR5TmFtZSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkUHJvcGVydHlLZXlzLnB1c2gocHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlOYW1lIGluIHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpZmZQcm9wZXJ0eVJlc3VsdHNbcHJvcGVydHlOYW1lXSA9IHJlc3VsdC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBib3VuZEF1dG8ocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuY2hhbmdlZCAmJiBjaGFuZ2VkUHJvcGVydHlLZXlzLmluZGV4T2YocHJvcGVydHlOYW1lKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZFByb3BlcnR5S2V5cy5wdXNoKHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgaW4gcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmUHJvcGVydHlSZXN1bHRzW3Byb3BlcnR5TmFtZV0gPSByZXN1bHQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChydW5SZWFjdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hcERpZmZQcm9wZXJ0eVJlYWN0aW9ucyhwcm9wZXJ0aWVzLCBjaGFuZ2VkUHJvcGVydHlLZXlzKS5mb3JFYWNoKGZ1bmN0aW9uIChhcmdzLCByZWFjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmdzLmNoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhY3Rpb24uY2FsbChfdGhpcywgYXJncy5wcmV2aW91c1Byb3BlcnRpZXMsIGFyZ3MubmV3UHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IGRpZmZQcm9wZXJ0eVJlc3VsdHM7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXMgPSBjaGFuZ2VkUHJvcGVydHlLZXlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5faW5pdGlhbFByb3BlcnRpZXMgPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0eU5hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gdGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHkocHJvcGVydGllc1twcm9wZXJ0eU5hbWVdLCBpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMuYmluZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkUHJvcGVydHlLZXlzLnB1c2gocHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzID0gY2hhbmdlZFByb3BlcnR5S2V5cztcclxuICAgICAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHByb3BlcnRpZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV2lkZ2V0QmFzZS5wcm90b3R5cGUsIFwiY2hpbGRyZW5cIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW47XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5fX3NldENoaWxkcmVuX18gPSBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcclxuICAgICAgICBpZiAodGhpcy5fY2hpbGRyZW4ubGVuZ3RoID4gMCB8fCBjaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuID0gY2hpbGRyZW47XHJcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5fX3JlbmRlcl9fID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZURhdGEgPSB2ZG9tXzEud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpO1xyXG4gICAgICAgIGluc3RhbmNlRGF0YS5kaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgIHZhciByZW5kZXIgPSB0aGlzLl9ydW5CZWZvcmVSZW5kZXJzKCk7XHJcbiAgICAgICAgdmFyIGROb2RlID0gcmVuZGVyKCk7XHJcbiAgICAgICAgZE5vZGUgPSB0aGlzLnJ1bkFmdGVyUmVuZGVycyhkTm9kZSk7XHJcbiAgICAgICAgdGhpcy5fbm9kZUhhbmRsZXIuY2xlYXIoKTtcclxuICAgICAgICByZXR1cm4gZE5vZGU7XHJcbiAgICB9O1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gdmRvbV8xLndpZGdldEluc3RhbmNlTWFwLmdldCh0aGlzKTtcclxuICAgICAgICBpZiAoaW5zdGFuY2VEYXRhLmludmFsaWRhdGUpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLmludmFsaWRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBkXzEudignZGl2Jywge30sIHRoaXMuY2hpbGRyZW4pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdG8gYWRkIGRlY29yYXRvcnMgdG8gV2lkZ2V0QmFzZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkZWNvcmF0b3JLZXkgVGhlIGtleSBvZiB0aGUgZGVjb3JhdG9yXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIG9mIHRoZSBkZWNvcmF0b3JcclxuICAgICAqL1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuYWRkRGVjb3JhdG9yID0gZnVuY3Rpb24gKGRlY29yYXRvcktleSwgdmFsdWUpIHtcclxuICAgICAgICB2YWx1ZSA9IEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiBbdmFsdWVdO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KCdjb25zdHJ1Y3RvcicpKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWNvcmF0b3JMaXN0ID0gZGVjb3JhdG9yTWFwLmdldCh0aGlzLmNvbnN0cnVjdG9yKTtcclxuICAgICAgICAgICAgaWYgKCFkZWNvcmF0b3JMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBkZWNvcmF0b3JMaXN0ID0gbmV3IE1hcF8xLmRlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGRlY29yYXRvck1hcC5zZXQodGhpcy5jb25zdHJ1Y3RvciwgZGVjb3JhdG9yTGlzdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHNwZWNpZmljRGVjb3JhdG9yTGlzdCA9IGRlY29yYXRvckxpc3QuZ2V0KGRlY29yYXRvcktleSk7XHJcbiAgICAgICAgICAgIGlmICghc3BlY2lmaWNEZWNvcmF0b3JMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBzcGVjaWZpY0RlY29yYXRvckxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICAgIGRlY29yYXRvckxpc3Quc2V0KGRlY29yYXRvcktleSwgc3BlY2lmaWNEZWNvcmF0b3JMaXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzcGVjaWZpY0RlY29yYXRvckxpc3QucHVzaC5hcHBseShzcGVjaWZpY0RlY29yYXRvckxpc3QsIHRzbGliXzEuX19zcHJlYWQodmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBkZWNvcmF0b3JzID0gdGhpcy5nZXREZWNvcmF0b3IoZGVjb3JhdG9yS2V5KTtcclxuICAgICAgICAgICAgdGhpcy5fZGVjb3JhdG9yQ2FjaGUuc2V0KGRlY29yYXRvcktleSwgdHNsaWJfMS5fX3NwcmVhZChkZWNvcmF0b3JzLCB2YWx1ZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHRvIGJ1aWxkIHRoZSBsaXN0IG9mIGRlY29yYXRvcnMgZnJvbSB0aGUgZ2xvYmFsIGRlY29yYXRvciBtYXAuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRlY29yYXRvcktleSAgVGhlIGtleSBvZiB0aGUgZGVjb3JhdG9yXHJcbiAgICAgKiBAcmV0dXJuIEFuIGFycmF5IG9mIGRlY29yYXRvciB2YWx1ZXNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9idWlsZERlY29yYXRvckxpc3QgPSBmdW5jdGlvbiAoZGVjb3JhdG9yS2V5KSB7XHJcbiAgICAgICAgdmFyIGFsbERlY29yYXRvcnMgPSBbXTtcclxuICAgICAgICB2YXIgY29uc3RydWN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yO1xyXG4gICAgICAgIHdoaWxlIChjb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICB2YXIgaW5zdGFuY2VNYXAgPSBkZWNvcmF0b3JNYXAuZ2V0KGNvbnN0cnVjdG9yKTtcclxuICAgICAgICAgICAgaWYgKGluc3RhbmNlTWFwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVjb3JhdG9ycyA9IGluc3RhbmNlTWFwLmdldChkZWNvcmF0b3JLZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRlY29yYXRvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGxEZWNvcmF0b3JzLnVuc2hpZnQuYXBwbHkoYWxsRGVjb3JhdG9ycywgdHNsaWJfMS5fX3NwcmVhZChkZWNvcmF0b3JzKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3RydWN0b3IgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29uc3RydWN0b3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYWxsRGVjb3JhdG9ycztcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHRvIHJldHJpZXZlIGRlY29yYXRvciB2YWx1ZXNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGVjb3JhdG9yS2V5IFRoZSBrZXkgb2YgdGhlIGRlY29yYXRvclxyXG4gICAgICogQHJldHVybnMgQW4gYXJyYXkgb2YgZGVjb3JhdG9yIHZhbHVlc1xyXG4gICAgICovXHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5nZXREZWNvcmF0b3IgPSBmdW5jdGlvbiAoZGVjb3JhdG9yS2V5KSB7XHJcbiAgICAgICAgdmFyIGFsbERlY29yYXRvcnMgPSB0aGlzLl9kZWNvcmF0b3JDYWNoZS5nZXQoZGVjb3JhdG9yS2V5KTtcclxuICAgICAgICBpZiAoYWxsRGVjb3JhdG9ycyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhbGxEZWNvcmF0b3JzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhbGxEZWNvcmF0b3JzID0gdGhpcy5fYnVpbGREZWNvcmF0b3JMaXN0KGRlY29yYXRvcktleSk7XHJcbiAgICAgICAgdGhpcy5fZGVjb3JhdG9yQ2FjaGUuc2V0KGRlY29yYXRvcktleSwgYWxsRGVjb3JhdG9ycyk7XHJcbiAgICAgICAgcmV0dXJuIGFsbERlY29yYXRvcnM7XHJcbiAgICB9O1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuX21hcERpZmZQcm9wZXJ0eVJlYWN0aW9ucyA9IGZ1bmN0aW9uIChuZXdQcm9wZXJ0aWVzLCBjaGFuZ2VkUHJvcGVydHlLZXlzKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgcmVhY3Rpb25GdW5jdGlvbnMgPSB0aGlzLmdldERlY29yYXRvcignZGlmZlJlYWN0aW9uJyk7XHJcbiAgICAgICAgcmV0dXJuIHJlYWN0aW9uRnVuY3Rpb25zLnJlZHVjZShmdW5jdGlvbiAocmVhY3Rpb25Qcm9wZXJ0eU1hcCwgX2EpIHtcclxuICAgICAgICAgICAgdmFyIHJlYWN0aW9uID0gX2EucmVhY3Rpb24sIHByb3BlcnR5TmFtZSA9IF9hLnByb3BlcnR5TmFtZTtcclxuICAgICAgICAgICAgdmFyIHJlYWN0aW9uQXJndW1lbnRzID0gcmVhY3Rpb25Qcm9wZXJ0eU1hcC5nZXQocmVhY3Rpb24pO1xyXG4gICAgICAgICAgICBpZiAocmVhY3Rpb25Bcmd1bWVudHMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmVhY3Rpb25Bcmd1bWVudHMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNQcm9wZXJ0aWVzOiB7fSxcclxuICAgICAgICAgICAgICAgICAgICBuZXdQcm9wZXJ0aWVzOiB7fSxcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZWFjdGlvbkFyZ3VtZW50cy5wcmV2aW91c1Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IF90aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XHJcbiAgICAgICAgICAgIHJlYWN0aW9uQXJndW1lbnRzLm5ld1Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IG5ld1Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcclxuICAgICAgICAgICAgaWYgKGNoYW5nZWRQcm9wZXJ0eUtleXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmVhY3Rpb25Bcmd1bWVudHMuY2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVhY3Rpb25Qcm9wZXJ0eU1hcC5zZXQocmVhY3Rpb24sIHJlYWN0aW9uQXJndW1lbnRzKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlYWN0aW9uUHJvcGVydHlNYXA7XHJcbiAgICAgICAgfSwgbmV3IE1hcF8xLmRlZmF1bHQoKSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBCaW5kcyB1bmJvdW5kIHByb3BlcnR5IGZ1bmN0aW9ucyB0byB0aGUgc3BlY2lmaWVkIGBiaW5kYCBwcm9wZXJ0eVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwcm9wZXJ0aWVzIHByb3BlcnRpZXMgdG8gY2hlY2sgZm9yIGZ1bmN0aW9uc1xyXG4gICAgICovXHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5fYmluZEZ1bmN0aW9uUHJvcGVydHkgPSBmdW5jdGlvbiAocHJvcGVydHksIGJpbmQpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHByb3BlcnR5ID09PSAnZnVuY3Rpb24nICYmIFJlZ2lzdHJ5XzEuaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IocHJvcGVydHkpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHlNYXAgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmluZEZ1bmN0aW9uUHJvcGVydHlNYXAgPSBuZXcgV2Vha01hcF8xLmRlZmF1bHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgYmluZEluZm8gPSB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcC5nZXQocHJvcGVydHkpIHx8IHt9O1xyXG4gICAgICAgICAgICB2YXIgYm91bmRGdW5jID0gYmluZEluZm8uYm91bmRGdW5jLCBzY29wZSA9IGJpbmRJbmZvLnNjb3BlO1xyXG4gICAgICAgICAgICBpZiAoYm91bmRGdW5jID09PSB1bmRlZmluZWQgfHwgc2NvcGUgIT09IGJpbmQpIHtcclxuICAgICAgICAgICAgICAgIGJvdW5kRnVuYyA9IHByb3BlcnR5LmJpbmQoYmluZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcC5zZXQocHJvcGVydHksIHsgYm91bmRGdW5jOiBib3VuZEZ1bmMsIHNjb3BlOiBiaW5kIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBib3VuZEZ1bmM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwcm9wZXJ0eTtcclxuICAgIH07XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV2lkZ2V0QmFzZS5wcm90b3R5cGUsIFwicmVnaXN0cnlcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnlIYW5kbGVyXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vd24odGhpcy5fcmVnaXN0cnkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vd24odGhpcy5fcmVnaXN0cnkub24oJ2ludmFsaWRhdGUnLCB0aGlzLl9ib3VuZEludmFsaWRhdGUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVnaXN0cnk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5fcnVuQmVmb3JlUHJvcGVydGllcyA9IGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgYmVmb3JlUHJvcGVydGllcyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdiZWZvcmVQcm9wZXJ0aWVzJyk7XHJcbiAgICAgICAgaWYgKGJlZm9yZVByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYmVmb3JlUHJvcGVydGllcy5yZWR1Y2UoZnVuY3Rpb24gKHByb3BlcnRpZXMsIGJlZm9yZVByb3BlcnRpZXNGdW5jdGlvbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRzbGliXzEuX19hc3NpZ24oe30sIHByb3BlcnRpZXMsIGJlZm9yZVByb3BlcnRpZXNGdW5jdGlvbi5jYWxsKF90aGlzLCBwcm9wZXJ0aWVzKSk7XHJcbiAgICAgICAgICAgIH0sIHRzbGliXzEuX19hc3NpZ24oe30sIHByb3BlcnRpZXMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSdW4gYWxsIHJlZ2lzdGVyZWQgYmVmb3JlIHJlbmRlcnMgYW5kIHJldHVybiB0aGUgdXBkYXRlZCByZW5kZXIgbWV0aG9kXHJcbiAgICAgKi9cclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9ydW5CZWZvcmVSZW5kZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGJlZm9yZVJlbmRlcnMgPSB0aGlzLmdldERlY29yYXRvcignYmVmb3JlUmVuZGVyJyk7XHJcbiAgICAgICAgaWYgKGJlZm9yZVJlbmRlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYmVmb3JlUmVuZGVycy5yZWR1Y2UoZnVuY3Rpb24gKHJlbmRlciwgYmVmb3JlUmVuZGVyRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHZhciB1cGRhdGVkUmVuZGVyID0gYmVmb3JlUmVuZGVyRnVuY3Rpb24uY2FsbChfdGhpcywgcmVuZGVyLCBfdGhpcy5fcHJvcGVydGllcywgX3RoaXMuX2NoaWxkcmVuKTtcclxuICAgICAgICAgICAgICAgIGlmICghdXBkYXRlZFJlbmRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignUmVuZGVyIGZ1bmN0aW9uIG5vdCByZXR1cm5lZCBmcm9tIGJlZm9yZVJlbmRlciwgdXNpbmcgcHJldmlvdXMgcmVuZGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlbmRlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGVkUmVuZGVyO1xyXG4gICAgICAgICAgICB9LCB0aGlzLl9ib3VuZFJlbmRlckZ1bmMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fYm91bmRSZW5kZXJGdW5jO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUnVuIGFsbCByZWdpc3RlcmVkIGFmdGVyIHJlbmRlcnMgYW5kIHJldHVybiB0aGUgZGVjb3JhdGVkIEROb2Rlc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkTm9kZSBUaGUgRE5vZGVzIHRvIHJ1biB0aHJvdWdoIHRoZSBhZnRlciByZW5kZXJzXHJcbiAgICAgKi9cclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLnJ1bkFmdGVyUmVuZGVycyA9IGZ1bmN0aW9uIChkTm9kZSkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGFmdGVyUmVuZGVycyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdhZnRlclJlbmRlcicpO1xyXG4gICAgICAgIGlmIChhZnRlclJlbmRlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYWZ0ZXJSZW5kZXJzLnJlZHVjZShmdW5jdGlvbiAoZE5vZGUsIGFmdGVyUmVuZGVyRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhZnRlclJlbmRlckZ1bmN0aW9uLmNhbGwoX3RoaXMsIGROb2RlKTtcclxuICAgICAgICAgICAgfSwgZE5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fbWV0YU1hcCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21ldGFNYXAuZm9yRWFjaChmdW5jdGlvbiAobWV0YSkge1xyXG4gICAgICAgICAgICAgICAgbWV0YS5hZnRlclJlbmRlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGROb2RlO1xyXG4gICAgfTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9ydW5BZnRlckNvbnN0cnVjdG9ycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBhZnRlckNvbnN0cnVjdG9ycyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdhZnRlckNvbnN0cnVjdG9yJyk7XHJcbiAgICAgICAgaWYgKGFmdGVyQ29uc3RydWN0b3JzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgYWZ0ZXJDb25zdHJ1Y3RvcnMuZm9yRWFjaChmdW5jdGlvbiAoYWZ0ZXJDb25zdHJ1Y3RvcikgeyByZXR1cm4gYWZ0ZXJDb25zdHJ1Y3Rvci5jYWxsKF90aGlzKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLm93biA9IGZ1bmN0aW9uIChoYW5kbGUpIHtcclxuICAgICAgICB0aGlzLl9oYW5kbGVzLnB1c2goaGFuZGxlKTtcclxuICAgIH07XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHdoaWxlICh0aGlzLl9oYW5kbGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdmFyIGhhbmRsZSA9IHRoaXMuX2hhbmRsZXMucG9wKCk7XHJcbiAgICAgICAgICAgIGlmIChoYW5kbGUpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBzdGF0aWMgaWRlbnRpZmllclxyXG4gICAgICovXHJcbiAgICBXaWRnZXRCYXNlLl90eXBlID0gUmVnaXN0cnlfMS5XSURHRVRfQkFTRV9UWVBFO1xyXG4gICAgcmV0dXJuIFdpZGdldEJhc2U7XHJcbn0oKSk7XHJcbmV4cG9ydHMuV2lkZ2V0QmFzZSA9IFdpZGdldEJhc2U7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFdpZGdldEJhc2U7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgYnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSA9ICcnO1xyXG52YXIgYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lID0gJyc7XHJcbmZ1bmN0aW9uIGRldGVybWluZUJyb3dzZXJTdHlsZU5hbWVzKGVsZW1lbnQpIHtcclxuICAgIGlmICgnV2Via2l0VHJhbnNpdGlvbicgaW4gZWxlbWVudC5zdHlsZSkge1xyXG4gICAgICAgIGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUgPSAnd2Via2l0VHJhbnNpdGlvbkVuZCc7XHJcbiAgICAgICAgYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lID0gJ3dlYmtpdEFuaW1hdGlvbkVuZCc7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICgndHJhbnNpdGlvbicgaW4gZWxlbWVudC5zdHlsZSB8fCAnTW96VHJhbnNpdGlvbicgaW4gZWxlbWVudC5zdHlsZSkge1xyXG4gICAgICAgIGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUgPSAndHJhbnNpdGlvbmVuZCc7XHJcbiAgICAgICAgYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lID0gJ2FuaW1hdGlvbmVuZCc7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdXIgYnJvd3NlciBpcyBub3Qgc3VwcG9ydGVkJyk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaW5pdGlhbGl6ZShlbGVtZW50KSB7XHJcbiAgICBpZiAoYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lID09PSAnJykge1xyXG4gICAgICAgIGRldGVybWluZUJyb3dzZXJTdHlsZU5hbWVzKGVsZW1lbnQpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHJ1bkFuZENsZWFuVXAoZWxlbWVudCwgc3RhcnRBbmltYXRpb24sIGZpbmlzaEFuaW1hdGlvbikge1xyXG4gICAgaW5pdGlhbGl6ZShlbGVtZW50KTtcclxuICAgIHZhciBmaW5pc2hlZCA9IGZhbHNlO1xyXG4gICAgdmFyIHRyYW5zaXRpb25FbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCFmaW5pc2hlZCkge1xyXG4gICAgICAgICAgICBmaW5pc2hlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kKTtcclxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZCk7XHJcbiAgICAgICAgICAgIGZpbmlzaEFuaW1hdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBzdGFydEFuaW1hdGlvbigpO1xyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGJyb3dzZXJTcGVjaWZpY0FuaW1hdGlvbkVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZCk7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoYnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSwgdHJhbnNpdGlvbkVuZCk7XHJcbn1cclxuZnVuY3Rpb24gZXhpdChub2RlLCBwcm9wZXJ0aWVzLCBleGl0QW5pbWF0aW9uLCByZW1vdmVOb2RlKSB7XHJcbiAgICB2YXIgYWN0aXZlQ2xhc3MgPSBwcm9wZXJ0aWVzLmV4aXRBbmltYXRpb25BY3RpdmUgfHwgZXhpdEFuaW1hdGlvbiArIFwiLWFjdGl2ZVwiO1xyXG4gICAgcnVuQW5kQ2xlYW5VcChub2RlLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKGV4aXRBbmltYXRpb24pO1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmVtb3ZlTm9kZSgpO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gZW50ZXIobm9kZSwgcHJvcGVydGllcywgZW50ZXJBbmltYXRpb24pIHtcclxuICAgIHZhciBhY3RpdmVDbGFzcyA9IHByb3BlcnRpZXMuZW50ZXJBbmltYXRpb25BY3RpdmUgfHwgZW50ZXJBbmltYXRpb24gKyBcIi1hY3RpdmVcIjtcclxuICAgIHJ1bkFuZENsZWFuVXAobm9kZSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChlbnRlckFuaW1hdGlvbik7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKGFjdGl2ZUNsYXNzKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBub2RlLmNsYXNzTGlzdC5yZW1vdmUoZW50ZXJBbmltYXRpb24pO1xyXG4gICAgICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShhY3RpdmVDbGFzcyk7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSB7XHJcbiAgICBlbnRlcjogZW50ZXIsXHJcbiAgICBleGl0OiBleGl0XHJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvYW5pbWF0aW9ucy9jc3NUcmFuc2l0aW9ucy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvYW5pbWF0aW9ucy9jc3NUcmFuc2l0aW9ucy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIFN5bWJvbF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vU3ltYm9sXCIpO1xyXG4vKipcclxuICogVGhlIHN5bWJvbCBpZGVudGlmaWVyIGZvciBhIFdOb2RlIHR5cGVcclxuICovXHJcbmV4cG9ydHMuV05PREUgPSBTeW1ib2xfMS5kZWZhdWx0KCdJZGVudGlmaWVyIGZvciBhIFdOb2RlLicpO1xyXG4vKipcclxuICogVGhlIHN5bWJvbCBpZGVudGlmaWVyIGZvciBhIFZOb2RlIHR5cGVcclxuICovXHJcbmV4cG9ydHMuVk5PREUgPSBTeW1ib2xfMS5kZWZhdWx0KCdJZGVudGlmaWVyIGZvciBhIFZOb2RlLicpO1xyXG4vKipcclxuICogSGVscGVyIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0cnVlIGlmIHRoZSBgRE5vZGVgIGlzIGEgYFdOb2RlYCB1c2luZyB0aGUgYHR5cGVgIHByb3BlcnR5XHJcbiAqL1xyXG5mdW5jdGlvbiBpc1dOb2RlKGNoaWxkKSB7XHJcbiAgICByZXR1cm4gQm9vbGVhbihjaGlsZCAmJiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnICYmIGNoaWxkLnR5cGUgPT09IGV4cG9ydHMuV05PREUpO1xyXG59XHJcbmV4cG9ydHMuaXNXTm9kZSA9IGlzV05vZGU7XHJcbi8qKlxyXG4gKiBIZWxwZXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRydWUgaWYgdGhlIGBETm9kZWAgaXMgYSBgVk5vZGVgIHVzaW5nIHRoZSBgdHlwZWAgcHJvcGVydHlcclxuICovXHJcbmZ1bmN0aW9uIGlzVk5vZGUoY2hpbGQpIHtcclxuICAgIHJldHVybiBCb29sZWFuKGNoaWxkICYmIHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycgJiYgY2hpbGQudHlwZSA9PT0gZXhwb3J0cy5WTk9ERSk7XHJcbn1cclxuZXhwb3J0cy5pc1ZOb2RlID0gaXNWTm9kZTtcclxuZnVuY3Rpb24gaXNFbGVtZW50Tm9kZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuICEhdmFsdWUudGFnTmFtZTtcclxufVxyXG5leHBvcnRzLmlzRWxlbWVudE5vZGUgPSBpc0VsZW1lbnROb2RlO1xyXG5mdW5jdGlvbiBkZWNvcmF0ZShkTm9kZXMsIG9wdGlvbnNPck1vZGlmaWVyLCBwcmVkaWNhdGUpIHtcclxuICAgIHZhciBzaGFsbG93ID0gZmFsc2U7XHJcbiAgICB2YXIgbW9kaWZpZXI7XHJcbiAgICBpZiAodHlwZW9mIG9wdGlvbnNPck1vZGlmaWVyID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgbW9kaWZpZXIgPSBvcHRpb25zT3JNb2RpZmllcjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIG1vZGlmaWVyID0gb3B0aW9uc09yTW9kaWZpZXIubW9kaWZpZXI7XHJcbiAgICAgICAgcHJlZGljYXRlID0gb3B0aW9uc09yTW9kaWZpZXIucHJlZGljYXRlO1xyXG4gICAgICAgIHNoYWxsb3cgPSBvcHRpb25zT3JNb2RpZmllci5zaGFsbG93IHx8IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgdmFyIG5vZGVzID0gQXJyYXkuaXNBcnJheShkTm9kZXMpID8gdHNsaWJfMS5fX3NwcmVhZChkTm9kZXMpIDogW2ROb2Rlc107XHJcbiAgICBmdW5jdGlvbiBicmVha2VyKCkge1xyXG4gICAgICAgIG5vZGVzID0gW107XHJcbiAgICB9XHJcbiAgICB3aGlsZSAobm9kZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlcy5zaGlmdCgpO1xyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIGlmICghc2hhbGxvdyAmJiAoaXNXTm9kZShub2RlKSB8fCBpc1ZOb2RlKG5vZGUpKSAmJiBub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlcyA9IHRzbGliXzEuX19zcHJlYWQobm9kZXMsIG5vZGUuY2hpbGRyZW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghcHJlZGljYXRlIHx8IHByZWRpY2F0ZShub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgbW9kaWZpZXIobm9kZSwgYnJlYWtlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZE5vZGVzO1xyXG59XHJcbmV4cG9ydHMuZGVjb3JhdGUgPSBkZWNvcmF0ZTtcclxuLyoqXHJcbiAqIFdyYXBwZXIgZnVuY3Rpb24gZm9yIGNhbGxzIHRvIGNyZWF0ZSBhIHdpZGdldC5cclxuICovXHJcbmZ1bmN0aW9uIHcod2lkZ2V0Q29uc3RydWN0b3IsIHByb3BlcnRpZXMsIGNoaWxkcmVuKSB7XHJcbiAgICBpZiAoY2hpbGRyZW4gPT09IHZvaWQgMCkgeyBjaGlsZHJlbiA9IFtdOyB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcclxuICAgICAgICB3aWRnZXRDb25zdHJ1Y3Rvcjogd2lkZ2V0Q29uc3RydWN0b3IsXHJcbiAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllcyxcclxuICAgICAgICB0eXBlOiBleHBvcnRzLldOT0RFXHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMudyA9IHc7XHJcbmZ1bmN0aW9uIHYodGFnLCBwcm9wZXJ0aWVzT3JDaGlsZHJlbiwgY2hpbGRyZW4pIHtcclxuICAgIGlmIChwcm9wZXJ0aWVzT3JDaGlsZHJlbiA9PT0gdm9pZCAwKSB7IHByb3BlcnRpZXNPckNoaWxkcmVuID0ge307IH1cclxuICAgIGlmIChjaGlsZHJlbiA9PT0gdm9pZCAwKSB7IGNoaWxkcmVuID0gdW5kZWZpbmVkOyB9XHJcbiAgICB2YXIgcHJvcGVydGllcyA9IHByb3BlcnRpZXNPckNoaWxkcmVuO1xyXG4gICAgdmFyIGRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrO1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcGVydGllc09yQ2hpbGRyZW4pKSB7XHJcbiAgICAgICAgY2hpbGRyZW4gPSBwcm9wZXJ0aWVzT3JDaGlsZHJlbjtcclxuICAgICAgICBwcm9wZXJ0aWVzID0ge307XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBkZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayA9IHByb3BlcnRpZXM7XHJcbiAgICAgICAgcHJvcGVydGllcyA9IHt9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0YWc6IHRhZyxcclxuICAgICAgICBkZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjazogZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2ssXHJcbiAgICAgICAgY2hpbGRyZW46IGNoaWxkcmVuLFxyXG4gICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXMsXHJcbiAgICAgICAgdHlwZTogZXhwb3J0cy5WTk9ERVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLnYgPSB2O1xyXG4vKipcclxuICogQ3JlYXRlIGEgVk5vZGUgZm9yIGFuIGV4aXN0aW5nIERPTSBOb2RlLlxyXG4gKi9cclxuZnVuY3Rpb24gZG9tKF9hLCBjaGlsZHJlbikge1xyXG4gICAgdmFyIG5vZGUgPSBfYS5ub2RlLCBfYiA9IF9hLmF0dHJzLCBhdHRycyA9IF9iID09PSB2b2lkIDAgPyB7fSA6IF9iLCBfYyA9IF9hLnByb3BzLCBwcm9wcyA9IF9jID09PSB2b2lkIDAgPyB7fSA6IF9jLCBfZCA9IF9hLm9uLCBvbiA9IF9kID09PSB2b2lkIDAgPyB7fSA6IF9kLCBfZSA9IF9hLmRpZmZUeXBlLCBkaWZmVHlwZSA9IF9lID09PSB2b2lkIDAgPyAnbm9uZScgOiBfZTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGFnOiBpc0VsZW1lbnROb2RlKG5vZGUpID8gbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgOiAnJyxcclxuICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wcyxcclxuICAgICAgICBhdHRyaWJ1dGVzOiBhdHRycyxcclxuICAgICAgICBldmVudHM6IG9uLFxyXG4gICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcclxuICAgICAgICB0eXBlOiBleHBvcnRzLlZOT0RFLFxyXG4gICAgICAgIGRvbU5vZGU6IG5vZGUsXHJcbiAgICAgICAgdGV4dDogaXNFbGVtZW50Tm9kZShub2RlKSA/IHVuZGVmaW5lZCA6IG5vZGUuZGF0YSxcclxuICAgICAgICBkaWZmVHlwZTogZGlmZlR5cGVcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5kb20gPSBkb207XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgaGFuZGxlRGVjb3JhdG9yXzEgPSByZXF1aXJlKFwiLi9oYW5kbGVEZWNvcmF0b3JcIik7XHJcbmZ1bmN0aW9uIGFmdGVyUmVuZGVyKG1ldGhvZCkge1xyXG4gICAgcmV0dXJuIGhhbmRsZURlY29yYXRvcl8xLmhhbmRsZURlY29yYXRvcihmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xyXG4gICAgICAgIHRhcmdldC5hZGREZWNvcmF0b3IoJ2FmdGVyUmVuZGVyJywgcHJvcGVydHlLZXkgPyB0YXJnZXRbcHJvcGVydHlLZXldIDogbWV0aG9kKTtcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuYWZ0ZXJSZW5kZXIgPSBhZnRlclJlbmRlcjtcclxuZXhwb3J0cy5kZWZhdWx0ID0gYWZ0ZXJSZW5kZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9hZnRlclJlbmRlci5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9hZnRlclJlbmRlci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgaGFuZGxlRGVjb3JhdG9yXzEgPSByZXF1aXJlKFwiLi9oYW5kbGVEZWNvcmF0b3JcIik7XHJcbnZhciBiZWZvcmVQcm9wZXJ0aWVzXzEgPSByZXF1aXJlKFwiLi9iZWZvcmVQcm9wZXJ0aWVzXCIpO1xyXG5mdW5jdGlvbiBhbHdheXNSZW5kZXIoKSB7XHJcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yXzEuaGFuZGxlRGVjb3JhdG9yKGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XHJcbiAgICAgICAgYmVmb3JlUHJvcGVydGllc18xLmJlZm9yZVByb3BlcnRpZXMoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcclxuICAgICAgICB9KSh0YXJnZXQpO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5hbHdheXNSZW5kZXIgPSBhbHdheXNSZW5kZXI7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGFsd2F5c1JlbmRlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2Fsd2F5c1JlbmRlci5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9hbHdheXNSZW5kZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGhhbmRsZURlY29yYXRvcl8xID0gcmVxdWlyZShcIi4vaGFuZGxlRGVjb3JhdG9yXCIpO1xyXG5mdW5jdGlvbiBiZWZvcmVQcm9wZXJ0aWVzKG1ldGhvZCkge1xyXG4gICAgcmV0dXJuIGhhbmRsZURlY29yYXRvcl8xLmhhbmRsZURlY29yYXRvcihmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xyXG4gICAgICAgIHRhcmdldC5hZGREZWNvcmF0b3IoJ2JlZm9yZVByb3BlcnRpZXMnLCBwcm9wZXJ0eUtleSA/IHRhcmdldFtwcm9wZXJ0eUtleV0gOiBtZXRob2QpO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5iZWZvcmVQcm9wZXJ0aWVzID0gYmVmb3JlUHJvcGVydGllcztcclxuZXhwb3J0cy5kZWZhdWx0ID0gYmVmb3JlUHJvcGVydGllcztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2JlZm9yZVByb3BlcnRpZXMuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvYmVmb3JlUHJvcGVydGllcy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgcmVnaXN0ZXJDdXN0b21FbGVtZW50XzEgPSByZXF1aXJlKFwiLi4vcmVnaXN0ZXJDdXN0b21FbGVtZW50XCIpO1xyXG4vKipcclxuICogVGhpcyBEZWNvcmF0b3IgaXMgcHJvdmlkZWQgcHJvcGVydGllcyB0aGF0IGRlZmluZSB0aGUgYmVoYXZpb3Igb2YgYSBjdXN0b20gZWxlbWVudCwgYW5kXHJcbiAqIHJlZ2lzdGVycyB0aGF0IGN1c3RvbSBlbGVtZW50LlxyXG4gKi9cclxuZnVuY3Rpb24gY3VzdG9tRWxlbWVudChfYSkge1xyXG4gICAgdmFyIHRhZyA9IF9hLnRhZywgX2IgPSBfYS5wcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzID0gX2IgPT09IHZvaWQgMCA/IFtdIDogX2IsIF9jID0gX2EuYXR0cmlidXRlcywgYXR0cmlidXRlcyA9IF9jID09PSB2b2lkIDAgPyBbXSA6IF9jLCBfZCA9IF9hLmV2ZW50cywgZXZlbnRzID0gX2QgPT09IHZvaWQgMCA/IFtdIDogX2QsIF9lID0gX2EuY2hpbGRUeXBlLCBjaGlsZFR5cGUgPSBfZSA9PT0gdm9pZCAwID8gcmVnaXN0ZXJDdXN0b21FbGVtZW50XzEuQ3VzdG9tRWxlbWVudENoaWxkVHlwZS5ET0pPIDogX2U7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgICAgIHRhcmdldC5wcm90b3R5cGUuX19jdXN0b21FbGVtZW50RGVzY3JpcHRvciA9IHtcclxuICAgICAgICAgICAgdGFnTmFtZTogdGFnLFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzLFxyXG4gICAgICAgICAgICBldmVudHM6IGV2ZW50cyxcclxuICAgICAgICAgICAgY2hpbGRUeXBlOiBjaGlsZFR5cGVcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLmN1c3RvbUVsZW1lbnQgPSBjdXN0b21FbGVtZW50O1xyXG5leHBvcnRzLmRlZmF1bHQgPSBjdXN0b21FbGVtZW50O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvY3VzdG9tRWxlbWVudC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9jdXN0b21FbGVtZW50LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBoYW5kbGVEZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2hhbmRsZURlY29yYXRvclwiKTtcclxuLyoqXHJcbiAqIERlY29yYXRvciB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZ2lzdGVyIGEgZnVuY3Rpb24gYXMgYSBzcGVjaWZpYyBwcm9wZXJ0eSBkaWZmXHJcbiAqXHJcbiAqIEBwYXJhbSBwcm9wZXJ0eU5hbWUgIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBvZiB3aGljaCB0aGUgZGlmZiBmdW5jdGlvbiBpcyBhcHBsaWVkXHJcbiAqIEBwYXJhbSBkaWZmVHlwZSAgICAgIFRoZSBkaWZmIHR5cGUsIGRlZmF1bHQgaXMgRGlmZlR5cGUuQVVUTy5cclxuICogQHBhcmFtIGRpZmZGdW5jdGlvbiAgQSBkaWZmIGZ1bmN0aW9uIHRvIHJ1biBpZiBkaWZmVHlwZSBpZiBEaWZmVHlwZS5DVVNUT01cclxuICovXHJcbmZ1bmN0aW9uIGRpZmZQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIGRpZmZGdW5jdGlvbiwgcmVhY3Rpb25GdW5jdGlvbikge1xyXG4gICAgcmV0dXJuIGhhbmRsZURlY29yYXRvcl8xLmhhbmRsZURlY29yYXRvcihmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xyXG4gICAgICAgIHRhcmdldC5hZGREZWNvcmF0b3IoXCJkaWZmUHJvcGVydHk6XCIgKyBwcm9wZXJ0eU5hbWUsIGRpZmZGdW5jdGlvbi5iaW5kKG51bGwpKTtcclxuICAgICAgICB0YXJnZXQuYWRkRGVjb3JhdG9yKCdyZWdpc3RlcmVkRGlmZlByb3BlcnR5JywgcHJvcGVydHlOYW1lKTtcclxuICAgICAgICBpZiAocmVhY3Rpb25GdW5jdGlvbiB8fCBwcm9wZXJ0eUtleSkge1xyXG4gICAgICAgICAgICB0YXJnZXQuYWRkRGVjb3JhdG9yKCdkaWZmUmVhY3Rpb24nLCB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWU6IHByb3BlcnR5TmFtZSxcclxuICAgICAgICAgICAgICAgIHJlYWN0aW9uOiBwcm9wZXJ0eUtleSA/IHRhcmdldFtwcm9wZXJ0eUtleV0gOiByZWFjdGlvbkZ1bmN0aW9uXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuZGlmZlByb3BlcnR5ID0gZGlmZlByb3BlcnR5O1xyXG5leHBvcnRzLmRlZmF1bHQgPSBkaWZmUHJvcGVydHk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9kaWZmUHJvcGVydHkuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvZGlmZlByb3BlcnR5LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qKlxyXG4gKiBHZW5lcmljIGRlY29yYXRvciBoYW5kbGVyIHRvIHRha2UgY2FyZSBvZiB3aGV0aGVyIG9yIG5vdCB0aGUgZGVjb3JhdG9yIHdhcyBjYWxsZWQgYXQgdGhlIGNsYXNzIGxldmVsXHJcbiAqIG9yIHRoZSBtZXRob2QgbGV2ZWwuXHJcbiAqXHJcbiAqIEBwYXJhbSBoYW5kbGVyXHJcbiAqL1xyXG5mdW5jdGlvbiBoYW5kbGVEZWNvcmF0b3IoaGFuZGxlcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5LCBkZXNjcmlwdG9yKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgaGFuZGxlcih0YXJnZXQucHJvdG90eXBlLCB1bmRlZmluZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaGFuZGxlcih0YXJnZXQsIHByb3BlcnR5S2V5KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMuaGFuZGxlRGVjb3JhdG9yID0gaGFuZGxlRGVjb3JhdG9yO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBoYW5kbGVEZWNvcmF0b3I7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9oYW5kbGVEZWNvcmF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaGFuZGxlRGVjb3JhdG9yLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBXZWFrTWFwXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9XZWFrTWFwXCIpO1xyXG52YXIgaGFuZGxlRGVjb3JhdG9yXzEgPSByZXF1aXJlKFwiLi9oYW5kbGVEZWNvcmF0b3JcIik7XHJcbnZhciBiZWZvcmVQcm9wZXJ0aWVzXzEgPSByZXF1aXJlKFwiLi9iZWZvcmVQcm9wZXJ0aWVzXCIpO1xyXG4vKipcclxuICogTWFwIG9mIGluc3RhbmNlcyBhZ2FpbnN0IHJlZ2lzdGVyZWQgaW5qZWN0b3JzLlxyXG4gKi9cclxudmFyIHJlZ2lzdGVyZWRJbmplY3RvcnNNYXAgPSBuZXcgV2Vha01hcF8xLmRlZmF1bHQoKTtcclxuLyoqXHJcbiAqIERlY29yYXRvciByZXRyaWV2ZXMgYW4gaW5qZWN0b3IgZnJvbSBhbiBhdmFpbGFibGUgcmVnaXN0cnkgdXNpbmcgdGhlIG5hbWUgYW5kXHJcbiAqIGNhbGxzIHRoZSBgZ2V0UHJvcGVydGllc2AgZnVuY3Rpb24gd2l0aCB0aGUgcGF5bG9hZCBmcm9tIHRoZSBpbmplY3RvclxyXG4gKiBhbmQgY3VycmVudCBwcm9wZXJ0aWVzIHdpdGggdGhlIHRoZSBpbmplY3RlZCBwcm9wZXJ0aWVzIHJldHVybmVkLlxyXG4gKlxyXG4gKiBAcGFyYW0gSW5qZWN0Q29uZmlnIHRoZSBpbmplY3QgY29uZmlndXJhdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gaW5qZWN0KF9hKSB7XHJcbiAgICB2YXIgbmFtZSA9IF9hLm5hbWUsIGdldFByb3BlcnRpZXMgPSBfYS5nZXRQcm9wZXJ0aWVzO1xyXG4gICAgcmV0dXJuIGhhbmRsZURlY29yYXRvcl8xLmhhbmRsZURlY29yYXRvcihmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xyXG4gICAgICAgIGJlZm9yZVByb3BlcnRpZXNfMS5iZWZvcmVQcm9wZXJ0aWVzKGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBpbmplY3RvciA9IHRoaXMucmVnaXN0cnkuZ2V0SW5qZWN0b3IobmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChpbmplY3Rvcikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlZ2lzdGVyZWRJbmplY3RvcnMgPSByZWdpc3RlcmVkSW5qZWN0b3JzTWFwLmdldCh0aGlzKSB8fCBbXTtcclxuICAgICAgICAgICAgICAgIGlmIChyZWdpc3RlcmVkSW5qZWN0b3JzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZ2lzdGVyZWRJbmplY3RvcnNNYXAuc2V0KHRoaXMsIHJlZ2lzdGVyZWRJbmplY3RvcnMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHJlZ2lzdGVyZWRJbmplY3RvcnMuaW5kZXhPZihpbmplY3RvcikgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vd24oaW5qZWN0b3Iub24oJ2ludmFsaWRhdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmludmFsaWRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJlZEluamVjdG9ycy5wdXNoKGluamVjdG9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRQcm9wZXJ0aWVzKGluamVjdG9yLmdldCgpLCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKHRhcmdldCk7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmluamVjdCA9IGluamVjdDtcclxuZXhwb3J0cy5kZWZhdWx0ID0gaW5qZWN0O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaW5qZWN0LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2luamVjdC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgUmVnaXN0cnlfMSA9IHJlcXVpcmUoXCIuL1JlZ2lzdHJ5XCIpO1xyXG5mdW5jdGlvbiBpc09iamVjdE9yQXJyYXkodmFsdWUpIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBPYmplY3RdJyB8fCBBcnJheS5pc0FycmF5KHZhbHVlKTtcclxufVxyXG5mdW5jdGlvbiBhbHdheXMocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2hhbmdlZDogdHJ1ZSxcclxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5hbHdheXMgPSBhbHdheXM7XHJcbmZ1bmN0aW9uIGlnbm9yZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjaGFuZ2VkOiBmYWxzZSxcclxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5pZ25vcmUgPSBpZ25vcmU7XHJcbmZ1bmN0aW9uIHJlZmVyZW5jZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjaGFuZ2VkOiBwcmV2aW91c1Byb3BlcnR5ICE9PSBuZXdQcm9wZXJ0eSxcclxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5yZWZlcmVuY2UgPSByZWZlcmVuY2U7XHJcbmZ1bmN0aW9uIHNoYWxsb3cocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpIHtcclxuICAgIHZhciBjaGFuZ2VkID0gZmFsc2U7XHJcbiAgICB2YXIgdmFsaWRPbGRQcm9wZXJ0eSA9IHByZXZpb3VzUHJvcGVydHkgJiYgaXNPYmplY3RPckFycmF5KHByZXZpb3VzUHJvcGVydHkpO1xyXG4gICAgdmFyIHZhbGlkTmV3UHJvcGVydHkgPSBuZXdQcm9wZXJ0eSAmJiBpc09iamVjdE9yQXJyYXkobmV3UHJvcGVydHkpO1xyXG4gICAgaWYgKCF2YWxpZE9sZFByb3BlcnR5IHx8ICF2YWxpZE5ld1Byb3BlcnR5KSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY2hhbmdlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdmFsdWU6IG5ld1Byb3BlcnR5XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHZhciBwcmV2aW91c0tleXMgPSBPYmplY3Qua2V5cyhwcmV2aW91c1Byb3BlcnR5KTtcclxuICAgIHZhciBuZXdLZXlzID0gT2JqZWN0LmtleXMobmV3UHJvcGVydHkpO1xyXG4gICAgaWYgKHByZXZpb3VzS2V5cy5sZW5ndGggIT09IG5ld0tleXMubGVuZ3RoKSB7XHJcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjaGFuZ2VkID0gbmV3S2V5cy5zb21lKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld1Byb3BlcnR5W2tleV0gIT09IHByZXZpb3VzUHJvcGVydHlba2V5XTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2hhbmdlZDogY2hhbmdlZCxcclxuICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5zaGFsbG93ID0gc2hhbGxvdztcclxuZnVuY3Rpb24gYXV0byhwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSkge1xyXG4gICAgdmFyIHJlc3VsdDtcclxuICAgIGlmICh0eXBlb2YgbmV3UHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBpZiAobmV3UHJvcGVydHkuX3R5cGUgPT09IFJlZ2lzdHJ5XzEuV0lER0VUX0JBU0VfVFlQRSkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSByZWZlcmVuY2UocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gaWdub3JlKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpc09iamVjdE9yQXJyYXkobmV3UHJvcGVydHkpKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gc2hhbGxvdyhwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2UocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5leHBvcnRzLmF1dG8gPSBhdXRvO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RpZmYuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RpZmYuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBEZXN0cm95YWJsZV8xID0gcmVxdWlyZShcIkBkb2pvL2NvcmUvRGVzdHJveWFibGVcIik7XHJcbnZhciBTZXRfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL1NldFwiKTtcclxudmFyIEJhc2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhCYXNlLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gQmFzZShwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5fcmVxdWVzdGVkTm9kZUtleXMgPSBuZXcgU2V0XzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIF90aGlzLl9pbnZhbGlkYXRlID0gcHJvcGVydGllcy5pbnZhbGlkYXRlO1xyXG4gICAgICAgIF90aGlzLm5vZGVIYW5kbGVyID0gcHJvcGVydGllcy5ub2RlSGFuZGxlcjtcclxuICAgICAgICBpZiAocHJvcGVydGllcy5iaW5kKSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9iaW5kID0gcHJvcGVydGllcy5iaW5kO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBCYXNlLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZUhhbmRsZXIuaGFzKGtleSk7XHJcbiAgICB9O1xyXG4gICAgQmFzZS5wcm90b3R5cGUuZ2V0Tm9kZSA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzdHJpbmdLZXkgPSBcIlwiICsga2V5O1xyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5ub2RlSGFuZGxlci5nZXQoc3RyaW5nS2V5KTtcclxuICAgICAgICBpZiAoIW5vZGUgJiYgIXRoaXMuX3JlcXVlc3RlZE5vZGVLZXlzLmhhcyhzdHJpbmdLZXkpKSB7XHJcbiAgICAgICAgICAgIHZhciBoYW5kbGVfMSA9IHRoaXMubm9kZUhhbmRsZXIub24oc3RyaW5nS2V5LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVfMS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fcmVxdWVzdGVkTm9kZUtleXMuZGVsZXRlKHN0cmluZ0tleSk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5pbnZhbGlkYXRlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLm93bihoYW5kbGVfMSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlcXVlc3RlZE5vZGVLZXlzLmFkZChzdHJpbmdLZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH07XHJcbiAgICBCYXNlLnByb3RvdHlwZS5pbnZhbGlkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuX2ludmFsaWRhdGUoKTtcclxuICAgIH07XHJcbiAgICBCYXNlLnByb3RvdHlwZS5hZnRlclJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBEbyBub3RoaW5nIGJ5IGRlZmF1bHQuXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEJhc2U7XHJcbn0oRGVzdHJveWFibGVfMS5EZXN0cm95YWJsZSkpO1xyXG5leHBvcnRzLkJhc2UgPSBCYXNlO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBCYXNlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21ldGEvQmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvbWV0YS9CYXNlLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgQmFzZV8xID0gcmVxdWlyZShcIi4vQmFzZVwiKTtcclxudmFyIGxhbmdfMSA9IHJlcXVpcmUoXCJAZG9qby9jb3JlL2xhbmdcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL2dsb2JhbFwiKTtcclxudmFyIGRlZmF1bHRSZXN1bHRzID0ge1xyXG4gICAgYWN0aXZlOiBmYWxzZSxcclxuICAgIGNvbnRhaW5zRm9jdXM6IGZhbHNlXHJcbn07XHJcbnZhciBGb2N1cyA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKEZvY3VzLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gRm9jdXMoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuX29uRm9jdXNDaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9hY3RpdmVFbGVtZW50ID0gZ2xvYmFsXzEuZGVmYXVsdC5kb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgICAgICAgICBfdGhpcy5pbnZhbGlkYXRlKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBGb2N1cy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5nZXROb2RlKGtleSk7XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0c2xpYl8xLl9fYXNzaWduKHt9LCBkZWZhdWx0UmVzdWx0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5fYWN0aXZlRWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLl9hY3RpdmVFbGVtZW50ID0gZ2xvYmFsXzEuZGVmYXVsdC5kb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgICAgICAgICB0aGlzLl9jcmVhdGVMaXN0ZW5lcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhY3RpdmU6IG5vZGUgPT09IHRoaXMuX2FjdGl2ZUVsZW1lbnQsXHJcbiAgICAgICAgICAgIGNvbnRhaW5zRm9jdXM6IG5vZGUuY29udGFpbnModGhpcy5fYWN0aXZlRWxlbWVudClcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIEZvY3VzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmdldE5vZGUoa2V5KTtcclxuICAgICAgICBub2RlICYmIG5vZGUuZm9jdXMoKTtcclxuICAgIH07XHJcbiAgICBGb2N1cy5wcm90b3R5cGUuX2NyZWF0ZUxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGdsb2JhbF8xLmRlZmF1bHQuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIHRoaXMuX29uRm9jdXNDaGFuZ2UpO1xyXG4gICAgICAgIGdsb2JhbF8xLmRlZmF1bHQuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCB0aGlzLl9vbkZvY3VzQ2hhbmdlKTtcclxuICAgICAgICB0aGlzLm93bihsYW5nXzEuY3JlYXRlSGFuZGxlKHRoaXMuX3JlbW92ZUxpc3RlbmVyLmJpbmQodGhpcykpKTtcclxuICAgIH07XHJcbiAgICBGb2N1cy5wcm90b3R5cGUuX3JlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGdsb2JhbF8xLmRlZmF1bHQuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXNpbicsIHRoaXMuX29uRm9jdXNDaGFuZ2UpO1xyXG4gICAgICAgIGdsb2JhbF8xLmRlZmF1bHQuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCB0aGlzLl9vbkZvY3VzQ2hhbmdlKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gRm9jdXM7XHJcbn0oQmFzZV8xLkJhc2UpKTtcclxuZXhwb3J0cy5Gb2N1cyA9IEZvY3VzO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBGb2N1cztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9tZXRhL0ZvY3VzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9tZXRhL0ZvY3VzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgbGFuZ18xID0gcmVxdWlyZShcIkBkb2pvL2NvcmUvbGFuZ1wiKTtcclxudmFyIGNzc1RyYW5zaXRpb25zXzEgPSByZXF1aXJlKFwiLi4vYW5pbWF0aW9ucy9jc3NUcmFuc2l0aW9uc1wiKTtcclxudmFyIGFmdGVyUmVuZGVyXzEgPSByZXF1aXJlKFwiLi8uLi9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyXCIpO1xyXG52YXIgZF8xID0gcmVxdWlyZShcIi4vLi4vZFwiKTtcclxudmFyIHZkb21fMSA9IHJlcXVpcmUoXCIuLy4uL3Zkb21cIik7XHJcbi8qKlxyXG4gKiBSZXByZXNlbnRzIHRoZSBhdHRhY2ggc3RhdGUgb2YgdGhlIHByb2plY3RvclxyXG4gKi9cclxudmFyIFByb2plY3RvckF0dGFjaFN0YXRlO1xyXG4oZnVuY3Rpb24gKFByb2plY3RvckF0dGFjaFN0YXRlKSB7XHJcbiAgICBQcm9qZWN0b3JBdHRhY2hTdGF0ZVtQcm9qZWN0b3JBdHRhY2hTdGF0ZVtcIkF0dGFjaGVkXCJdID0gMV0gPSBcIkF0dGFjaGVkXCI7XHJcbiAgICBQcm9qZWN0b3JBdHRhY2hTdGF0ZVtQcm9qZWN0b3JBdHRhY2hTdGF0ZVtcIkRldGFjaGVkXCJdID0gMl0gPSBcIkRldGFjaGVkXCI7XHJcbn0pKFByb2plY3RvckF0dGFjaFN0YXRlID0gZXhwb3J0cy5Qcm9qZWN0b3JBdHRhY2hTdGF0ZSB8fCAoZXhwb3J0cy5Qcm9qZWN0b3JBdHRhY2hTdGF0ZSA9IHt9KSk7XHJcbi8qKlxyXG4gKiBBdHRhY2ggdHlwZSBmb3IgdGhlIHByb2plY3RvclxyXG4gKi9cclxudmFyIEF0dGFjaFR5cGU7XHJcbihmdW5jdGlvbiAoQXR0YWNoVHlwZSkge1xyXG4gICAgQXR0YWNoVHlwZVtBdHRhY2hUeXBlW1wiQXBwZW5kXCJdID0gMV0gPSBcIkFwcGVuZFwiO1xyXG4gICAgQXR0YWNoVHlwZVtBdHRhY2hUeXBlW1wiTWVyZ2VcIl0gPSAyXSA9IFwiTWVyZ2VcIjtcclxufSkoQXR0YWNoVHlwZSA9IGV4cG9ydHMuQXR0YWNoVHlwZSB8fCAoZXhwb3J0cy5BdHRhY2hUeXBlID0ge30pKTtcclxuZnVuY3Rpb24gUHJvamVjdG9yTWl4aW4oQmFzZSkge1xyXG4gICAgdmFyIFByb2plY3RvciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICB0c2xpYl8xLl9fZXh0ZW5kcyhQcm9qZWN0b3IsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gUHJvamVjdG9yKCkge1xyXG4gICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5hcHBseSh0aGlzLCB0c2xpYl8xLl9fc3ByZWFkKGFyZ3MpKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5fYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvamVjdG9yUHJvcGVydGllcyA9IHt9O1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvamVjdGlvbk9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uczogY3NzVHJhbnNpdGlvbnNfMS5kZWZhdWx0XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIF90aGlzLnJvb3QgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9qZWN0b3JTdGF0ZSA9IFByb2plY3RvckF0dGFjaFN0YXRlLkRldGFjaGVkO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFByb2plY3Rvci5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKHJvb3QpIHtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBBdHRhY2hUeXBlLkFwcGVuZCxcclxuICAgICAgICAgICAgICAgIHJvb3Q6IHJvb3RcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaChvcHRpb25zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rvci5wcm90b3R5cGUubWVyZ2UgPSBmdW5jdGlvbiAocm9vdCkge1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IEF0dGFjaFR5cGUuTWVyZ2UsXHJcbiAgICAgICAgICAgICAgICByb290OiByb290XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hdHRhY2gob3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdG9yLnByb3RvdHlwZSwgXCJyb290XCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcm9vdDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocm9vdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0b3IgYWxyZWFkeSBhdHRhY2hlZCwgY2Fubm90IGNoYW5nZSByb290IGVsZW1lbnQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3QgPSByb290O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvamVjdG9yLnByb3RvdHlwZSwgXCJhc3luY1wiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FzeW5jO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChhc3luYykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0b3IgYWxyZWFkeSBhdHRhY2hlZCwgY2Fubm90IGNoYW5nZSBhc3luYyBtb2RlJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hc3luYyA9IGFzeW5jO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBQcm9qZWN0b3IucHJvdG90eXBlLnNhbmRib3ggPSBmdW5jdGlvbiAoZG9jKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmIChkb2MgPT09IHZvaWQgMCkgeyBkb2MgPSBkb2N1bWVudDsgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvamVjdG9yIGFscmVhZHkgYXR0YWNoZWQsIGNhbm5vdCBjcmVhdGUgc2FuZGJveCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2FzeW5jID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBwcmV2aW91c1Jvb3QgPSB0aGlzLnJvb3Q7XHJcbiAgICAgICAgICAgIC8qIGZyZWUgdXAgdGhlIGRvY3VtZW50IGZyYWdtZW50IGZvciBHQyAqL1xyXG4gICAgICAgICAgICB0aGlzLm93bih7XHJcbiAgICAgICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3Jvb3QgPSBwcmV2aW91c1Jvb3Q7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9hdHRhY2goe1xyXG4gICAgICAgICAgICAgICAgLyogRG9jdW1lbnRGcmFnbWVudCBpcyBub3QgYXNzaWduYWJsZSB0byBFbGVtZW50LCBidXQgcHJvdmlkZXMgZXZlcnl0aGluZyBuZWVkZWQgdG8gd29yayAqL1xyXG4gICAgICAgICAgICAgICAgcm9vdDogZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IEF0dGFjaFR5cGUuQXBwZW5kXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5zZXRDaGlsZHJlbiA9IGZ1bmN0aW9uIChjaGlsZHJlbikge1xyXG4gICAgICAgICAgICB0aGlzLl9fc2V0Q2hpbGRyZW5fXyhjaGlsZHJlbik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0b3IucHJvdG90eXBlLnNldFByb3BlcnRpZXMgPSBmdW5jdGlvbiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICB0aGlzLl9fc2V0UHJvcGVydGllc19fKHByb3BlcnRpZXMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5fX3NldFByb3BlcnRpZXNfXyA9IGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzICYmIHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMucmVnaXN0cnkgIT09IHByb3BlcnRpZXMucmVnaXN0cnkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzLnJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvamVjdG9yUHJvcGVydGllcy5yZWdpc3RyeS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fcHJvamVjdG9yUHJvcGVydGllcyA9IGxhbmdfMS5hc3NpZ24oe30sIHByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLl9fc2V0Q29yZVByb3BlcnRpZXNfXy5jYWxsKHRoaXMsIHsgYmluZDogdGhpcywgYmFzZVJlZ2lzdHJ5OiBwcm9wZXJ0aWVzLnJlZ2lzdHJ5IH0pO1xyXG4gICAgICAgICAgICBfc3VwZXIucHJvdG90eXBlLl9fc2V0UHJvcGVydGllc19fLmNhbGwodGhpcywgcHJvcGVydGllcyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0b3IucHJvdG90eXBlLnRvSHRtbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvamVjdG9yU3RhdGUgIT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkIHx8ICF0aGlzLl9wcm9qZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBpcyBub3QgYXR0YWNoZWQsIGNhbm5vdCByZXR1cm4gYW4gSFRNTCBzdHJpbmcgb2YgcHJvamVjdGlvbi4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJvamVjdGlvbi5kb21Ob2RlLmNoaWxkTm9kZXNbMF0ub3V0ZXJIVE1MO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5hZnRlclJlbmRlciA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnc3RyaW5nJyB8fCByZXN1bHQgPT09IG51bGwgfHwgcmVzdWx0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUgPSBkXzEudignc3BhbicsIHt9LCBbcmVzdWx0XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0b3IucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5fYXR0YWNoID0gZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciB0eXBlID0gX2EudHlwZSwgcm9vdCA9IF9hLnJvb3Q7XHJcbiAgICAgICAgICAgIGlmIChyb290KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QgPSByb290O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaEhhbmRsZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnByb2plY3RvclN0YXRlID0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQ7XHJcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKF90aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fcHJvamVjdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMucHJvamVjdG9yU3RhdGUgPSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5EZXRhY2hlZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMub3duKGhhbmRsZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2F0dGFjaEhhbmRsZSA9IGhhbmRsZTtcclxuICAgICAgICAgICAgdGhpcy5fcHJvamVjdGlvbk9wdGlvbnMgPSB0c2xpYl8xLl9fYXNzaWduKHt9LCB0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucywgeyBzeW5jOiAhdGhpcy5fYXN5bmMgfSk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBBdHRhY2hUeXBlLkFwcGVuZDpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9qZWN0aW9uID0gdmRvbV8xLmRvbS5hcHBlbmQodGhpcy5yb290LCB0aGlzLCB0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEF0dGFjaFR5cGUuTWVyZ2U6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJvamVjdGlvbiA9IHZkb21fMS5kb20ubWVyZ2UodGhpcy5yb290LCB0aGlzLCB0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaEhhbmRsZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRzbGliXzEuX19kZWNvcmF0ZShbXHJcbiAgICAgICAgICAgIGFmdGVyUmVuZGVyXzEuYWZ0ZXJSZW5kZXIoKSxcclxuICAgICAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbT2JqZWN0XSksXHJcbiAgICAgICAgICAgIHRzbGliXzEuX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuICAgICAgICBdLCBQcm9qZWN0b3IucHJvdG90eXBlLCBcImFmdGVyUmVuZGVyXCIsIG51bGwpO1xyXG4gICAgICAgIHJldHVybiBQcm9qZWN0b3I7XHJcbiAgICB9KEJhc2UpKTtcclxuICAgIHJldHVybiBQcm9qZWN0b3I7XHJcbn1cclxuZXhwb3J0cy5Qcm9qZWN0b3JNaXhpbiA9IFByb2plY3Rvck1peGluO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBQcm9qZWN0b3JNaXhpbjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9taXhpbnMvUHJvamVjdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9taXhpbnMvUHJvamVjdG9yLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgSW5qZWN0b3JfMSA9IHJlcXVpcmUoXCIuLy4uL0luamVjdG9yXCIpO1xyXG52YXIgaW5qZWN0XzEgPSByZXF1aXJlKFwiLi8uLi9kZWNvcmF0b3JzL2luamVjdFwiKTtcclxudmFyIGhhbmRsZURlY29yYXRvcl8xID0gcmVxdWlyZShcIi4vLi4vZGVjb3JhdG9ycy9oYW5kbGVEZWNvcmF0b3JcIik7XHJcbnZhciBkaWZmUHJvcGVydHlfMSA9IHJlcXVpcmUoXCIuLy4uL2RlY29yYXRvcnMvZGlmZlByb3BlcnR5XCIpO1xyXG52YXIgZGlmZl8xID0gcmVxdWlyZShcIi4vLi4vZGlmZlwiKTtcclxudmFyIFRIRU1FX0tFWSA9ICcgX2tleSc7XHJcbmV4cG9ydHMuSU5KRUNURURfVEhFTUVfS0VZID0gU3ltYm9sKCd0aGVtZScpO1xyXG4vKipcclxuICogRGVjb3JhdG9yIGZvciBiYXNlIGNzcyBjbGFzc2VzXHJcbiAqL1xyXG5mdW5jdGlvbiB0aGVtZSh0aGVtZSkge1xyXG4gICAgcmV0dXJuIGhhbmRsZURlY29yYXRvcl8xLmhhbmRsZURlY29yYXRvcihmdW5jdGlvbiAodGFyZ2V0KSB7XHJcbiAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcignYmFzZVRoZW1lQ2xhc3NlcycsIHRoZW1lKTtcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMudGhlbWUgPSB0aGVtZTtcclxuLyoqXHJcbiAqIENyZWF0ZXMgYSByZXZlcnNlIGxvb2t1cCBmb3IgdGhlIGNsYXNzZXMgcGFzc2VkIGluIHZpYSB0aGUgYHRoZW1lYCBmdW5jdGlvbi5cclxuICpcclxuICogQHBhcmFtIGNsYXNzZXMgVGhlIGJhc2VDbGFzc2VzIG9iamVjdFxyXG4gKiBAcmVxdWlyZXNcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVRoZW1lQ2xhc3Nlc0xvb2t1cChjbGFzc2VzKSB7XHJcbiAgICByZXR1cm4gY2xhc3Nlcy5yZWR1Y2UoZnVuY3Rpb24gKGN1cnJlbnRDbGFzc05hbWVzLCBiYXNlQ2xhc3MpIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhiYXNlQ2xhc3MpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICBjdXJyZW50Q2xhc3NOYW1lc1tiYXNlQ2xhc3Nba2V5XV0gPSBrZXk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRDbGFzc05hbWVzO1xyXG4gICAgfSwge30pO1xyXG59XHJcbi8qKlxyXG4gKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGlzIGdpdmVuIGEgdGhlbWUgYW5kIGFuIG9wdGlvbmFsIHJlZ2lzdHJ5LCB0aGUgdGhlbWVcclxuICogaW5qZWN0b3IgaXMgZGVmaW5lZCBhZ2FpbnN0IHRoZSByZWdpc3RyeSwgcmV0dXJuaW5nIHRoZSB0aGVtZS5cclxuICpcclxuICogQHBhcmFtIHRoZW1lIHRoZSB0aGVtZSB0byBzZXRcclxuICogQHBhcmFtIHRoZW1lUmVnaXN0cnkgcmVnaXN0cnkgdG8gZGVmaW5lIHRoZSB0aGVtZSBpbmplY3RvciBhZ2FpbnN0LiBEZWZhdWx0c1xyXG4gKiB0byB0aGUgZ2xvYmFsIHJlZ2lzdHJ5XHJcbiAqXHJcbiAqIEByZXR1cm5zIHRoZSB0aGVtZSBpbmplY3RvciB1c2VkIHRvIHNldCB0aGUgdGhlbWVcclxuICovXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyVGhlbWVJbmplY3Rvcih0aGVtZSwgdGhlbWVSZWdpc3RyeSkge1xyXG4gICAgdmFyIHRoZW1lSW5qZWN0b3IgPSBuZXcgSW5qZWN0b3JfMS5JbmplY3Rvcih0aGVtZSk7XHJcbiAgICB0aGVtZVJlZ2lzdHJ5LmRlZmluZUluamVjdG9yKGV4cG9ydHMuSU5KRUNURURfVEhFTUVfS0VZLCB0aGVtZUluamVjdG9yKTtcclxuICAgIHJldHVybiB0aGVtZUluamVjdG9yO1xyXG59XHJcbmV4cG9ydHMucmVnaXN0ZXJUaGVtZUluamVjdG9yID0gcmVnaXN0ZXJUaGVtZUluamVjdG9yO1xyXG4vKipcclxuICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgY2xhc3MgZGVjb3JhdGVkIHdpdGggd2l0aCBUaGVtZWQgZnVuY3Rpb25hbGl0eVxyXG4gKi9cclxuZnVuY3Rpb24gVGhlbWVkTWl4aW4oQmFzZSkge1xyXG4gICAgdmFyIFRoZW1lZCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICB0c2xpYl8xLl9fZXh0ZW5kcyhUaGVtZWQsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gVGhlbWVkKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFJlZ2lzdGVyZWQgYmFzZSB0aGVtZSBrZXlzXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBfdGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZUtleXMgPSBbXTtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEluZGljYXRlcyBpZiBjbGFzc2VzIG1ldGEgZGF0YSBuZWVkIHRvIGJlIGNhbGN1bGF0ZWQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBfdGhpcy5fcmVjYWxjdWxhdGVDbGFzc2VzID0gdHJ1ZTtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIExvYWRlZCB0aGVtZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgX3RoaXMuX3RoZW1lID0ge307XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgVGhlbWVkLnByb3RvdHlwZS50aGVtZSA9IGZ1bmN0aW9uIChjbGFzc2VzKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZWNhbGN1bGF0ZUNsYXNzZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlY2FsY3VsYXRlVGhlbWVDbGFzc2VzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2xhc3NlcykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc2VzLm1hcChmdW5jdGlvbiAoY2xhc3NOYW1lKSB7IHJldHVybiBfdGhpcy5fZ2V0VGhlbWVDbGFzcyhjbGFzc05hbWUpOyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0VGhlbWVDbGFzcyhjbGFzc2VzKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEZ1bmN0aW9uIGZpcmVkIHdoZW4gYHRoZW1lYCBvciBgZXh0cmFDbGFzc2VzYCBhcmUgY2hhbmdlZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBUaGVtZWQucHJvdG90eXBlLm9uUHJvcGVydGllc0NoYW5nZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlY2FsY3VsYXRlQ2xhc3NlcyA9IHRydWU7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBUaGVtZWQucHJvdG90eXBlLl9nZXRUaGVtZUNsYXNzID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoY2xhc3NOYW1lID09PSB1bmRlZmluZWQgfHwgY2xhc3NOYW1lID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3NOYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBleHRyYUNsYXNzZXMgPSB0aGlzLnByb3BlcnRpZXMuZXh0cmFDbGFzc2VzIHx8IHt9O1xyXG4gICAgICAgICAgICB2YXIgdGhlbWVDbGFzc05hbWUgPSB0aGlzLl9iYXNlVGhlbWVDbGFzc2VzUmV2ZXJzZUxvb2t1cFtjbGFzc05hbWVdO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0Q2xhc3NOYW1lcyA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoIXRoZW1lQ2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJDbGFzcyBuYW1lOiAnXCIgKyBjbGFzc05hbWUgKyBcIicgbm90IGZvdW5kIGluIHRoZW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGV4dHJhQ2xhc3Nlc1t0aGVtZUNsYXNzTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdENsYXNzTmFtZXMucHVzaChleHRyYUNsYXNzZXNbdGhlbWVDbGFzc05hbWVdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fdGhlbWVbdGhlbWVDbGFzc05hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDbGFzc05hbWVzLnB1c2godGhpcy5fdGhlbWVbdGhlbWVDbGFzc05hbWVdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdENsYXNzTmFtZXMucHVzaCh0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lW3RoZW1lQ2xhc3NOYW1lXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdENsYXNzTmFtZXMuam9pbignICcpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgVGhlbWVkLnByb3RvdHlwZS5fcmVjYWxjdWxhdGVUaGVtZUNsYXNzZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBfYSA9IHRoaXMucHJvcGVydGllcy50aGVtZSwgdGhlbWUgPSBfYSA9PT0gdm9pZCAwID8ge30gOiBfYTtcclxuICAgICAgICAgICAgdmFyIGJhc2VUaGVtZXMgPSB0aGlzLmdldERlY29yYXRvcignYmFzZVRoZW1lQ2xhc3NlcycpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWUgPSBiYXNlVGhlbWVzLnJlZHVjZShmdW5jdGlvbiAoZmluYWxCYXNlVGhlbWUsIGJhc2VUaGVtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBfYSA9IFRIRU1FX0tFWSwga2V5ID0gYmFzZVRoZW1lW19hXSwgY2xhc3NlcyA9IHRzbGliXzEuX19yZXN0KGJhc2VUaGVtZSwgW3R5cGVvZiBfYSA9PT0gXCJzeW1ib2xcIiA/IF9hIDogX2EgKyBcIlwiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWVLZXlzLnB1c2goa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHNsaWJfMS5fX2Fzc2lnbih7fSwgZmluYWxCYXNlVGhlbWUsIGNsYXNzZXMpO1xyXG4gICAgICAgICAgICAgICAgfSwge30pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFzZVRoZW1lQ2xhc3Nlc1JldmVyc2VMb29rdXAgPSBjcmVhdGVUaGVtZUNsYXNzZXNMb29rdXAoYmFzZVRoZW1lcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fdGhlbWUgPSB0aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lS2V5cy5yZWR1Y2UoZnVuY3Rpb24gKGJhc2VUaGVtZSwgdGhlbWVLZXkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0c2xpYl8xLl9fYXNzaWduKHt9LCBiYXNlVGhlbWUsIHRoZW1lW3RoZW1lS2V5XSk7XHJcbiAgICAgICAgICAgIH0sIHt9KTtcclxuICAgICAgICAgICAgdGhpcy5fcmVjYWxjdWxhdGVDbGFzc2VzID0gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0c2xpYl8xLl9fZGVjb3JhdGUoW1xyXG4gICAgICAgICAgICBkaWZmUHJvcGVydHlfMS5kaWZmUHJvcGVydHkoJ3RoZW1lJywgZGlmZl8xLnNoYWxsb3cpLFxyXG4gICAgICAgICAgICBkaWZmUHJvcGVydHlfMS5kaWZmUHJvcGVydHkoJ2V4dHJhQ2xhc3NlcycsIGRpZmZfMS5zaGFsbG93KSxcclxuICAgICAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbXSksXHJcbiAgICAgICAgICAgIHRzbGliXzEuX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuICAgICAgICBdLCBUaGVtZWQucHJvdG90eXBlLCBcIm9uUHJvcGVydGllc0NoYW5nZWRcIiwgbnVsbCk7XHJcbiAgICAgICAgVGhlbWVkID0gdHNsaWJfMS5fX2RlY29yYXRlKFtcclxuICAgICAgICAgICAgaW5qZWN0XzEuaW5qZWN0KHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IGV4cG9ydHMuSU5KRUNURURfVEhFTUVfS0VZLFxyXG4gICAgICAgICAgICAgICAgZ2V0UHJvcGVydGllczogZnVuY3Rpb24gKHRoZW1lLCBwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwcm9wZXJ0aWVzLnRoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHRoZW1lOiB0aGVtZSB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge307XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgXSwgVGhlbWVkKTtcclxuICAgICAgICByZXR1cm4gVGhlbWVkO1xyXG4gICAgfShCYXNlKSk7XHJcbiAgICByZXR1cm4gVGhlbWVkO1xyXG59XHJcbmV4cG9ydHMuVGhlbWVkTWl4aW4gPSBUaGVtZWRNaXhpbjtcclxuZXhwb3J0cy5kZWZhdWx0ID0gVGhlbWVkTWl4aW47XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIFdpZGdldEJhc2VfMSA9IHJlcXVpcmUoXCIuL1dpZGdldEJhc2VcIik7XHJcbnZhciBQcm9qZWN0b3JfMSA9IHJlcXVpcmUoXCIuL21peGlucy9Qcm9qZWN0b3JcIik7XHJcbnZhciBhcnJheV8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vYXJyYXlcIik7XHJcbnZhciBkXzEgPSByZXF1aXJlKFwiLi9kXCIpO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9nbG9iYWxcIik7XHJcbnZhciBSZWdpc3RyeV8xID0gcmVxdWlyZShcIi4vUmVnaXN0cnlcIik7XHJcbnZhciBUaGVtZWRfMSA9IHJlcXVpcmUoXCIuL21peGlucy9UaGVtZWRcIik7XHJcbnZhciBhbHdheXNSZW5kZXJfMSA9IHJlcXVpcmUoXCIuL2RlY29yYXRvcnMvYWx3YXlzUmVuZGVyXCIpO1xyXG52YXIgQ3VzdG9tRWxlbWVudENoaWxkVHlwZTtcclxuKGZ1bmN0aW9uIChDdXN0b21FbGVtZW50Q2hpbGRUeXBlKSB7XHJcbiAgICBDdXN0b21FbGVtZW50Q2hpbGRUeXBlW1wiRE9KT1wiXSA9IFwiRE9KT1wiO1xyXG4gICAgQ3VzdG9tRWxlbWVudENoaWxkVHlwZVtcIk5PREVcIl0gPSBcIk5PREVcIjtcclxuICAgIEN1c3RvbUVsZW1lbnRDaGlsZFR5cGVbXCJURVhUXCJdID0gXCJURVhUXCI7XHJcbn0pKEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUgPSBleHBvcnRzLkN1c3RvbUVsZW1lbnRDaGlsZFR5cGUgfHwgKGV4cG9ydHMuQ3VzdG9tRWxlbWVudENoaWxkVHlwZSA9IHt9KSk7XHJcbmZ1bmN0aW9uIERvbVRvV2lkZ2V0V3JhcHBlcihkb21Ob2RlKSB7XHJcbiAgICB2YXIgRG9tVG9XaWRnZXRXcmFwcGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIHRzbGliXzEuX19leHRlbmRzKERvbVRvV2lkZ2V0V3JhcHBlciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBEb21Ub1dpZGdldFdyYXBwZXIoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgRG9tVG9XaWRnZXRXcmFwcGVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gT2JqZWN0LmtleXModGhpcy5wcm9wZXJ0aWVzKS5yZWR1Y2UoZnVuY3Rpb24gKHByb3BzLCBrZXkpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IF90aGlzLnByb3BlcnRpZXNba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmIChrZXkuaW5kZXhPZignb24nKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IFwiX19cIiArIGtleTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHByb3BzW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wcztcclxuICAgICAgICAgICAgfSwge30pO1xyXG4gICAgICAgICAgICByZXR1cm4gZF8xLmRvbSh7IG5vZGU6IGRvbU5vZGUsIHByb3BzOiBwcm9wZXJ0aWVzLCBkaWZmVHlwZTogJ2RvbScgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRG9tVG9XaWRnZXRXcmFwcGVyLCBcImRvbU5vZGVcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkb21Ob2RlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBEb21Ub1dpZGdldFdyYXBwZXIgPSB0c2xpYl8xLl9fZGVjb3JhdGUoW1xyXG4gICAgICAgICAgICBhbHdheXNSZW5kZXJfMS5hbHdheXNSZW5kZXIoKVxyXG4gICAgICAgIF0sIERvbVRvV2lkZ2V0V3JhcHBlcik7XHJcbiAgICAgICAgcmV0dXJuIERvbVRvV2lkZ2V0V3JhcHBlcjtcclxuICAgIH0oV2lkZ2V0QmFzZV8xLldpZGdldEJhc2UpKTtcclxuICAgIHJldHVybiBEb21Ub1dpZGdldFdyYXBwZXI7XHJcbn1cclxuZXhwb3J0cy5Eb21Ub1dpZGdldFdyYXBwZXIgPSBEb21Ub1dpZGdldFdyYXBwZXI7XHJcbmZ1bmN0aW9uIGNyZWF0ZShkZXNjcmlwdG9yLCBXaWRnZXRDb25zdHJ1Y3Rvcikge1xyXG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBkZXNjcmlwdG9yLmF0dHJpYnV0ZXMsIGNoaWxkVHlwZSA9IGRlc2NyaXB0b3IuY2hpbGRUeXBlO1xyXG4gICAgdmFyIGF0dHJpYnV0ZU1hcCA9IHt9O1xyXG4gICAgYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICB2YXIgYXR0cmlidXRlTmFtZSA9IHByb3BlcnR5TmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGF0dHJpYnV0ZU1hcFthdHRyaWJ1dGVOYW1lXSA9IHByb3BlcnR5TmFtZTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICB0c2xpYl8xLl9fZXh0ZW5kcyhjbGFzc18xLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIGNsYXNzXzEoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydGllcyA9IHt9O1xyXG4gICAgICAgICAgICBfdGhpcy5fY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICAgICAgX3RoaXMuX2V2ZW50UHJvcGVydGllcyA9IHt9O1xyXG4gICAgICAgICAgICBfdGhpcy5faW5pdGlhbGlzZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbGFzc18xLnByb3RvdHlwZS5jb25uZWN0ZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2luaXRpYWxpc2VkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGRvbVByb3BlcnRpZXMgPSB7fTtcclxuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBkZXNjcmlwdG9yLmF0dHJpYnV0ZXMsIHByb3BlcnRpZXMgPSBkZXNjcmlwdG9yLnByb3BlcnRpZXMsIGV2ZW50cyA9IGRlc2NyaXB0b3IuZXZlbnRzO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0gdHNsaWJfMS5fX2Fzc2lnbih7fSwgdGhpcy5fcHJvcGVydGllcywgdGhpcy5fYXR0cmlidXRlc1RvUHJvcGVydGllcyhhdHRyaWJ1dGVzKSk7XHJcbiAgICAgICAgICAgIHRzbGliXzEuX19zcHJlYWQoYXR0cmlidXRlcywgcHJvcGVydGllcykuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBfdGhpc1twcm9wZXJ0eU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZpbHRlcmVkUHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoL15vbi8sICdfXycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkb21Qcm9wZXJ0aWVzW2ZpbHRlcmVkUHJvcGVydHlOYW1lXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLl9nZXRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpOyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBfdGhpcy5fc2V0UHJvcGVydHkocHJvcGVydHlOYW1lLCB2YWx1ZSk7IH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBldmVudHMuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoL15vbi8sICcnKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZpbHRlcmVkUHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lLnJlcGxhY2UoL15vbi8sICdfX29uJyk7XHJcbiAgICAgICAgICAgICAgICBkb21Qcm9wZXJ0aWVzW2ZpbHRlcmVkUHJvcGVydHlOYW1lXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLl9nZXRFdmVudFByb3BlcnR5KHByb3BlcnR5TmFtZSk7IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIF90aGlzLl9zZXRFdmVudFByb3BlcnR5KHByb3BlcnR5TmFtZSwgdmFsdWUpOyB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX2V2ZW50UHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2sgPSBfdGhpcy5fZ2V0RXZlbnRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZXZlbnRDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudENhbGxiYWNrLmFwcGx5KHZvaWQgMCwgdHNsaWJfMS5fX3NwcmVhZChhcmdzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWJibGVzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiBhcmdzXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIGRvbVByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSBjaGlsZFR5cGUgPT09IEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUuVEVYVCA/IHRoaXMuY2hpbGROb2RlcyA6IHRoaXMuY2hpbGRyZW47XHJcbiAgICAgICAgICAgIGFycmF5XzEuZnJvbShjaGlsZHJlbikuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRUeXBlID09PSBDdXN0b21FbGVtZW50Q2hpbGRUeXBlLkRPSk8pIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignZG9qby1jZS1yZW5kZXInLCBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5fcmVuZGVyKCk7IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTm9kZS5hZGRFdmVudExpc3RlbmVyKCdkb2pvLWNlLWNvbm5lY3RlZCcsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLl9yZW5kZXIoKTsgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2NoaWxkcmVuLnB1c2goRG9tVG9XaWRnZXRXcmFwcGVyKGNoaWxkTm9kZSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2NoaWxkcmVuLnB1c2goZF8xLmRvbSh7IG5vZGU6IGNoaWxkTm9kZSwgZGlmZlR5cGU6ICdkb20nIH0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignZG9qby1jZS1jb25uZWN0ZWQnLCBmdW5jdGlvbiAoZSkgeyByZXR1cm4gX3RoaXMuX2NoaWxkQ29ubmVjdGVkKGUpOyB9KTtcclxuICAgICAgICAgICAgdmFyIHdpZGdldFByb3BlcnRpZXMgPSB0aGlzLl9wcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICB2YXIgcmVuZGVyQ2hpbGRyZW4gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5fX2NoaWxkcmVuX18oKTsgfTtcclxuICAgICAgICAgICAgdmFyIFdyYXBwZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0c2xpYl8xLl9fZXh0ZW5kcyhjbGFzc18yLCBfc3VwZXIpO1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY2xhc3NfMigpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjbGFzc18yLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRfMS53KFdpZGdldENvbnN0cnVjdG9yLCB3aWRnZXRQcm9wZXJ0aWVzLCByZW5kZXJDaGlsZHJlbigpKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3NfMjtcclxuICAgICAgICAgICAgfShXaWRnZXRCYXNlXzEuV2lkZ2V0QmFzZSkpO1xyXG4gICAgICAgICAgICB2YXIgcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnlfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciB0aGVtZUNvbnRleHQgPSBUaGVtZWRfMS5yZWdpc3RlclRoZW1lSW5qZWN0b3IodGhpcy5fZ2V0VGhlbWUoKSwgcmVnaXN0cnkpO1xyXG4gICAgICAgICAgICBnbG9iYWxfMS5kZWZhdWx0LmFkZEV2ZW50TGlzdGVuZXIoJ2Rvam8tdGhlbWUtc2V0JywgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhlbWVDb250ZXh0LnNldChfdGhpcy5fZ2V0VGhlbWUoKSk7IH0pO1xyXG4gICAgICAgICAgICB2YXIgUHJvamVjdG9yID0gUHJvamVjdG9yXzEuUHJvamVjdG9yTWl4aW4oV3JhcHBlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3RvciA9IG5ldyBQcm9qZWN0b3IoKTtcclxuICAgICAgICAgICAgdGhpcy5fcHJvamVjdG9yLnNldFByb3BlcnRpZXMoeyByZWdpc3RyeTogcmVnaXN0cnkgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2plY3Rvci5hcHBlbmQodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpc2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZG9qby1jZS1jb25uZWN0ZWQnLCB7XHJcbiAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZGV0YWlsOiB0aGlzXHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNsYXNzXzEucHJvdG90eXBlLl9nZXRUaGVtZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKGdsb2JhbF8xLmRlZmF1bHQgJiYgZ2xvYmFsXzEuZGVmYXVsdC5kb2pvY2UgJiYgZ2xvYmFsXzEuZGVmYXVsdC5kb2pvY2UudGhlbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBnbG9iYWxfMS5kZWZhdWx0LmRvam9jZS50aGVtZXNbZ2xvYmFsXzEuZGVmYXVsdC5kb2pvY2UudGhlbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjbGFzc18xLnByb3RvdHlwZS5fY2hpbGRDb25uZWN0ZWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IGUuZGV0YWlsO1xyXG4gICAgICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlID09PSB0aGlzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXhpc3RzID0gdGhpcy5fY2hpbGRyZW4uc29tZShmdW5jdGlvbiAoY2hpbGQpIHsgcmV0dXJuIGNoaWxkLmRvbU5vZGUgPT09IG5vZGU7IH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFleGlzdHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2Rvam8tY2UtcmVuZGVyJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuX3JlbmRlcigpOyB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKERvbVRvV2lkZ2V0V3JhcHBlcihub2RlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGNsYXNzXzEucHJvdG90eXBlLl9yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9wcm9qZWN0b3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Byb2plY3Rvci5pbnZhbGlkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdkb2pvLWNlLXJlbmRlcicsIHtcclxuICAgICAgICAgICAgICAgICAgICBidWJibGVzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHRoaXNcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NfMS5wcm90b3R5cGUuX19wcm9wZXJ0aWVzX18gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0c2xpYl8xLl9fYXNzaWduKHt9LCB0aGlzLl9wcm9wZXJ0aWVzLCB0aGlzLl9ldmVudFByb3BlcnRpZXMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NfMS5wcm90b3R5cGUuX19jaGlsZHJlbl9fID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoY2hpbGRUeXBlID09PSBDdXN0b21FbGVtZW50Q2hpbGRUeXBlLkRPSk8pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbi5maWx0ZXIoZnVuY3Rpb24gKENoaWxkKSB7IHJldHVybiBDaGlsZC5kb21Ob2RlLmlzV2lkZ2V0OyB9KS5tYXAoZnVuY3Rpb24gKENoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRvbU5vZGUgPSBDaGlsZC5kb21Ob2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkXzEudyhDaGlsZCwgdHNsaWJfMS5fX2Fzc2lnbih7fSwgZG9tTm9kZS5fX3Byb3BlcnRpZXNfXygpKSwgdHNsaWJfMS5fX3NwcmVhZChkb21Ob2RlLl9fY2hpbGRyZW5fXygpKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NfMS5wcm90b3R5cGUuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKG5hbWUsIG9sZFZhbHVlLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gYXR0cmlidXRlTWFwW25hbWVdO1xyXG4gICAgICAgICAgICB0aGlzLl9zZXRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIHZhbHVlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNsYXNzXzEucHJvdG90eXBlLl9zZXRFdmVudFByb3BlcnR5ID0gZnVuY3Rpb24gKHByb3BlcnR5TmFtZSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNsYXNzXzEucHJvdG90eXBlLl9nZXRFdmVudFByb3BlcnR5ID0gZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnRQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjbGFzc18xLnByb3RvdHlwZS5fc2V0UHJvcGVydHkgPSBmdW5jdGlvbiAocHJvcGVydHlOYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjbGFzc18xLnByb3RvdHlwZS5fZ2V0UHJvcGVydHkgPSBmdW5jdGlvbiAocHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjbGFzc18xLnByb3RvdHlwZS5fYXR0cmlidXRlc1RvUHJvcGVydGllcyA9IGZ1bmN0aW9uIChhdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGVzLnJlZHVjZShmdW5jdGlvbiAocHJvcGVydGllcywgcHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlTmFtZSA9IHByb3BlcnR5TmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gX3RoaXMuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydGllcztcclxuICAgICAgICAgICAgfSwge30pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNsYXNzXzEsIFwib2JzZXJ2ZWRBdHRyaWJ1dGVzXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoYXR0cmlidXRlTWFwKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNsYXNzXzEucHJvdG90eXBlLCBcImlzV2lkZ2V0XCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGNsYXNzXzE7XHJcbiAgICB9KEhUTUxFbGVtZW50KSk7XHJcbn1cclxuZXhwb3J0cy5jcmVhdGUgPSBjcmVhdGU7XHJcbmZ1bmN0aW9uIHJlZ2lzdGVyKFdpZGdldENvbnN0cnVjdG9yKSB7XHJcbiAgICB2YXIgZGVzY3JpcHRvciA9IFdpZGdldENvbnN0cnVjdG9yLnByb3RvdHlwZSAmJiBXaWRnZXRDb25zdHJ1Y3Rvci5wcm90b3R5cGUuX19jdXN0b21FbGVtZW50RGVzY3JpcHRvcjtcclxuICAgIGlmICghZGVzY3JpcHRvcikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGdldCBkZXNjcmlwdG9yIGZvciBDdXN0b20gRWxlbWVudCwgaGF2ZSB5b3UgYWRkZWQgdGhlIEBjdXN0b21FbGVtZW50IGRlY29yYXRvciB0byB5b3VyIFdpZGdldD8nKTtcclxuICAgIH1cclxuICAgIGdsb2JhbF8xLmRlZmF1bHQuY3VzdG9tRWxlbWVudHMuZGVmaW5lKGRlc2NyaXB0b3IudGFnTmFtZSwgY3JlYXRlKGRlc2NyaXB0b3IsIFdpZGdldENvbnN0cnVjdG9yKSk7XHJcbn1cclxuZXhwb3J0cy5yZWdpc3RlciA9IHJlZ2lzdGVyO1xyXG5leHBvcnRzLmRlZmF1bHQgPSByZWdpc3RlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9yZWdpc3RlckN1c3RvbUVsZW1lbnQuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL3JlZ2lzdGVyQ3VzdG9tRWxlbWVudC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vZ2xvYmFsXCIpO1xyXG52YXIgYXJyYXlfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL2FycmF5XCIpO1xyXG52YXIgZF8xID0gcmVxdWlyZShcIi4vZFwiKTtcclxudmFyIFJlZ2lzdHJ5XzEgPSByZXF1aXJlKFwiLi9SZWdpc3RyeVwiKTtcclxudmFyIFdlYWtNYXBfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL1dlYWtNYXBcIik7XHJcbnZhciBOQU1FU1BBQ0VfVzMgPSAnaHR0cDovL3d3dy53My5vcmcvJztcclxudmFyIE5BTUVTUEFDRV9TVkcgPSBOQU1FU1BBQ0VfVzMgKyAnMjAwMC9zdmcnO1xyXG52YXIgTkFNRVNQQUNFX1hMSU5LID0gTkFNRVNQQUNFX1czICsgJzE5OTkveGxpbmsnO1xyXG52YXIgZW1wdHlBcnJheSA9IFtdO1xyXG5leHBvcnRzLndpZGdldEluc3RhbmNlTWFwID0gbmV3IFdlYWtNYXBfMS5kZWZhdWx0KCk7XHJcbnZhciBpbnN0YW5jZU1hcCA9IG5ldyBXZWFrTWFwXzEuZGVmYXVsdCgpO1xyXG52YXIgcHJvamVjdG9yU3RhdGVNYXAgPSBuZXcgV2Vha01hcF8xLmRlZmF1bHQoKTtcclxuZnVuY3Rpb24gc2FtZShkbm9kZTEsIGRub2RlMikge1xyXG4gICAgaWYgKGRfMS5pc1ZOb2RlKGRub2RlMSkgJiYgZF8xLmlzVk5vZGUoZG5vZGUyKSkge1xyXG4gICAgICAgIGlmIChkbm9kZTEudGFnICE9PSBkbm9kZTIudGFnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRub2RlMS5wcm9wZXJ0aWVzLmtleSAhPT0gZG5vZGUyLnByb3BlcnRpZXMua2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChkXzEuaXNXTm9kZShkbm9kZTEpICYmIGRfMS5pc1dOb2RlKGRub2RlMikpIHtcclxuICAgICAgICBpZiAoZG5vZGUxLmluc3RhbmNlID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIGRub2RlMi53aWRnZXRDb25zdHJ1Y3RvciA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZG5vZGUxLndpZGdldENvbnN0cnVjdG9yICE9PSBkbm9kZTIud2lkZ2V0Q29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZG5vZGUxLnByb3BlcnRpZXMua2V5ICE9PSBkbm9kZTIucHJvcGVydGllcy5rZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG52YXIgbWlzc2luZ1RyYW5zaXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb3ZpZGUgYSB0cmFuc2l0aW9ucyBvYmplY3QgdG8gdGhlIHByb2plY3Rpb25PcHRpb25zIHRvIGRvIGFuaW1hdGlvbnMnKTtcclxufTtcclxuZnVuY3Rpb24gZ2V0UHJvamVjdGlvbk9wdGlvbnMocHJvamVjdG9yT3B0aW9ucywgcHJvamVjdG9ySW5zdGFuY2UpIHtcclxuICAgIHZhciBkZWZhdWx0cyA9IHtcclxuICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcclxuICAgICAgICBzdHlsZUFwcGx5ZXI6IGZ1bmN0aW9uIChkb21Ob2RlLCBzdHlsZU5hbWUsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGRvbU5vZGUuc3R5bGVbc3R5bGVOYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdHJhbnNpdGlvbnM6IHtcclxuICAgICAgICAgICAgZW50ZXI6IG1pc3NpbmdUcmFuc2l0aW9uLFxyXG4gICAgICAgICAgICBleGl0OiBtaXNzaW5nVHJhbnNpdGlvblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVwdGg6IDAsXHJcbiAgICAgICAgbWVyZ2U6IGZhbHNlLFxyXG4gICAgICAgIHN5bmM6IGZhbHNlLFxyXG4gICAgICAgIHByb2plY3Rvckluc3RhbmNlOiBwcm9qZWN0b3JJbnN0YW5jZVxyXG4gICAgfTtcclxuICAgIHJldHVybiB0c2xpYl8xLl9fYXNzaWduKHt9LCBkZWZhdWx0cywgcHJvamVjdG9yT3B0aW9ucyk7XHJcbn1cclxuZnVuY3Rpb24gY2hlY2tTdHlsZVZhbHVlKHN0eWxlVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2Ygc3R5bGVWYWx1ZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0eWxlIHZhbHVlcyBtdXN0IGJlIHN0cmluZ3MnKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB1cGRhdGVFdmVudChkb21Ob2RlLCBldmVudE5hbWUsIGN1cnJlbnRWYWx1ZSwgcHJvamVjdGlvbk9wdGlvbnMsIGJpbmQsIHByZXZpb3VzVmFsdWUpIHtcclxuICAgIHZhciBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICB2YXIgZXZlbnRNYXAgPSBwcm9qZWN0b3JTdGF0ZS5ub2RlTWFwLmdldChkb21Ob2RlKSB8fCBuZXcgV2Vha01hcF8xLmRlZmF1bHQoKTtcclxuICAgIGlmIChwcmV2aW91c1ZhbHVlKSB7XHJcbiAgICAgICAgdmFyIHByZXZpb3VzRXZlbnQgPSBldmVudE1hcC5nZXQocHJldmlvdXNWYWx1ZSk7XHJcbiAgICAgICAgZG9tTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcHJldmlvdXNFdmVudCk7XHJcbiAgICB9XHJcbiAgICB2YXIgY2FsbGJhY2sgPSBjdXJyZW50VmFsdWUuYmluZChiaW5kKTtcclxuICAgIGlmIChldmVudE5hbWUgPT09ICdpbnB1dCcpIHtcclxuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAgICAgY3VycmVudFZhbHVlLmNhbGwodGhpcywgZXZ0KTtcclxuICAgICAgICAgICAgZXZ0LnRhcmdldFsnb25pbnB1dC12YWx1ZSddID0gZXZ0LnRhcmdldC52YWx1ZTtcclxuICAgICAgICB9LmJpbmQoYmluZCk7XHJcbiAgICB9XHJcbiAgICBkb21Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjayk7XHJcbiAgICBldmVudE1hcC5zZXQoY3VycmVudFZhbHVlLCBjYWxsYmFjayk7XHJcbiAgICBwcm9qZWN0b3JTdGF0ZS5ub2RlTWFwLnNldChkb21Ob2RlLCBldmVudE1hcCk7XHJcbn1cclxuZnVuY3Rpb24gYWRkQ2xhc3Nlcyhkb21Ob2RlLCBjbGFzc2VzKSB7XHJcbiAgICBpZiAoY2xhc3Nlcykge1xyXG4gICAgICAgIHZhciBjbGFzc05hbWVzID0gY2xhc3Nlcy5zcGxpdCgnICcpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3NOYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBkb21Ob2RlLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgY2xhc3Nlcykge1xyXG4gICAgaWYgKGNsYXNzZXMpIHtcclxuICAgICAgICB2YXIgY2xhc3NOYW1lcyA9IGNsYXNzZXMuc3BsaXQoJyAnKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzTmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZG9tTm9kZS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBidWlsZFByZXZpb3VzUHJvcGVydGllcyhkb21Ob2RlLCBwcmV2aW91cywgY3VycmVudCkge1xyXG4gICAgdmFyIGRpZmZUeXBlID0gY3VycmVudC5kaWZmVHlwZSwgcHJvcGVydGllcyA9IGN1cnJlbnQucHJvcGVydGllcywgYXR0cmlidXRlcyA9IGN1cnJlbnQuYXR0cmlidXRlcztcclxuICAgIGlmICghZGlmZlR5cGUgfHwgZGlmZlR5cGUgPT09ICd2ZG9tJykge1xyXG4gICAgICAgIHJldHVybiB7IHByb3BlcnRpZXM6IHByZXZpb3VzLnByb3BlcnRpZXMsIGF0dHJpYnV0ZXM6IHByZXZpb3VzLmF0dHJpYnV0ZXMsIGV2ZW50czogcHJldmlvdXMuZXZlbnRzIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChkaWZmVHlwZSA9PT0gJ25vbmUnKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgcHJvcGVydGllczoge30sIGF0dHJpYnV0ZXM6IHByZXZpb3VzLmF0dHJpYnV0ZXMgPyB7fSA6IHVuZGVmaW5lZCwgZXZlbnRzOiBwcmV2aW91cy5ldmVudHMgfTtcclxuICAgIH1cclxuICAgIHZhciBuZXdQcm9wZXJ0aWVzID0ge1xyXG4gICAgICAgIHByb3BlcnRpZXM6IHt9XHJcbiAgICB9O1xyXG4gICAgaWYgKGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICBuZXdQcm9wZXJ0aWVzLmF0dHJpYnV0ZXMgPSB7fTtcclxuICAgICAgICBuZXdQcm9wZXJ0aWVzLmV2ZW50cyA9IHByZXZpb3VzLmV2ZW50cztcclxuICAgICAgICBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wTmFtZSkge1xyXG4gICAgICAgICAgICBuZXdQcm9wZXJ0aWVzLnByb3BlcnRpZXNbcHJvcE5hbWVdID0gZG9tTm9kZVtwcm9wTmFtZV07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAoYXR0ck5hbWUpIHtcclxuICAgICAgICAgICAgbmV3UHJvcGVydGllcy5hdHRyaWJ1dGVzW2F0dHJOYW1lXSA9IGRvbU5vZGUuZ2V0QXR0cmlidXRlKGF0dHJOYW1lKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbmV3UHJvcGVydGllcztcclxuICAgIH1cclxuICAgIG5ld1Byb3BlcnRpZXMucHJvcGVydGllcyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpLnJlZHVjZShmdW5jdGlvbiAocHJvcHMsIHByb3BlcnR5KSB7XHJcbiAgICAgICAgcHJvcHNbcHJvcGVydHldID0gZG9tTm9kZS5nZXRBdHRyaWJ1dGUocHJvcGVydHkpIHx8IGRvbU5vZGVbcHJvcGVydHldO1xyXG4gICAgICAgIHJldHVybiBwcm9wcztcclxuICAgIH0sIHt9KTtcclxuICAgIHJldHVybiBuZXdQcm9wZXJ0aWVzO1xyXG59XHJcbmZ1bmN0aW9uIGZvY3VzTm9kZShwcm9wVmFsdWUsIHByZXZpb3VzVmFsdWUsIGRvbU5vZGUsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICB2YXIgcmVzdWx0O1xyXG4gICAgaWYgKHR5cGVvZiBwcm9wVmFsdWUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICByZXN1bHQgPSBwcm9wVmFsdWUoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdCA9IHByb3BWYWx1ZSAmJiAhcHJldmlvdXNWYWx1ZTtcclxuICAgIH1cclxuICAgIGlmIChyZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICB2YXIgcHJvamVjdG9yU3RhdGUgPSBwcm9qZWN0b3JTdGF0ZU1hcC5nZXQocHJvamVjdGlvbk9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpO1xyXG4gICAgICAgIHByb2plY3RvclN0YXRlLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkb21Ob2RlLmZvY3VzKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcmVtb3ZlT3JwaGFuZWRFdmVudHMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucywgb25seUV2ZW50cykge1xyXG4gICAgaWYgKG9ubHlFdmVudHMgPT09IHZvaWQgMCkgeyBvbmx5RXZlbnRzID0gZmFsc2U7IH1cclxuICAgIHZhciBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICB2YXIgZXZlbnRNYXAgPSBwcm9qZWN0b3JTdGF0ZS5ub2RlTWFwLmdldChkb21Ob2RlKTtcclxuICAgIGlmIChldmVudE1hcCkge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHByZXZpb3VzUHJvcGVydGllcykuZm9yRWFjaChmdW5jdGlvbiAocHJvcE5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIGlzRXZlbnQgPSBwcm9wTmFtZS5zdWJzdHIoMCwgMikgPT09ICdvbicgfHwgb25seUV2ZW50cztcclxuICAgICAgICAgICAgdmFyIGV2ZW50TmFtZSA9IG9ubHlFdmVudHMgPyBwcm9wTmFtZSA6IHByb3BOYW1lLnN1YnN0cigyKTtcclxuICAgICAgICAgICAgaWYgKGlzRXZlbnQgJiYgIXByb3BlcnRpZXNbcHJvcE5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGV2ZW50TWFwLmdldChwcmV2aW91c1Byb3BlcnRpZXNbcHJvcE5hbWVdKTtcclxuICAgICAgICAgICAgICAgIGlmIChldmVudENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB1cGRhdGVBdHRyaWJ1dGUoZG9tTm9kZSwgYXR0ck5hbWUsIGF0dHJWYWx1ZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UgPT09IE5BTUVTUEFDRV9TVkcgJiYgYXR0ck5hbWUgPT09ICdocmVmJykge1xyXG4gICAgICAgIGRvbU5vZGUuc2V0QXR0cmlidXRlTlMoTkFNRVNQQUNFX1hMSU5LLCBhdHRyTmFtZSwgYXR0clZhbHVlKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKChhdHRyTmFtZSA9PT0gJ3JvbGUnICYmIGF0dHJWYWx1ZSA9PT0gJycpIHx8IGF0dHJWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgZG9tTm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0ck5hbWUpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZG9tTm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlQXR0cmlidXRlcyhkb21Ob2RlLCBwcmV2aW91c0F0dHJpYnV0ZXMsIGF0dHJpYnV0ZXMsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICB2YXIgYXR0ck5hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcyk7XHJcbiAgICB2YXIgYXR0ckNvdW50ID0gYXR0ck5hbWVzLmxlbmd0aDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXR0ckNvdW50OyBpKyspIHtcclxuICAgICAgICB2YXIgYXR0ck5hbWUgPSBhdHRyTmFtZXNbaV07XHJcbiAgICAgICAgdmFyIGF0dHJWYWx1ZSA9IGF0dHJpYnV0ZXNbYXR0ck5hbWVdO1xyXG4gICAgICAgIHZhciBwcmV2aW91c0F0dHJWYWx1ZSA9IHByZXZpb3VzQXR0cmlidXRlc1thdHRyTmFtZV07XHJcbiAgICAgICAgaWYgKGF0dHJWYWx1ZSAhPT0gcHJldmlvdXNBdHRyVmFsdWUpIHtcclxuICAgICAgICAgICAgdXBkYXRlQXR0cmlidXRlKGRvbU5vZGUsIGF0dHJOYW1lLCBhdHRyVmFsdWUsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlUHJvcGVydGllcyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zLCBpbmNsdWRlc0V2ZW50c0FuZEF0dHJpYnV0ZXMpIHtcclxuICAgIGlmIChpbmNsdWRlc0V2ZW50c0FuZEF0dHJpYnV0ZXMgPT09IHZvaWQgMCkgeyBpbmNsdWRlc0V2ZW50c0FuZEF0dHJpYnV0ZXMgPSB0cnVlOyB9XHJcbiAgICB2YXIgcHJvcGVydGllc1VwZGF0ZWQgPSBmYWxzZTtcclxuICAgIHZhciBwcm9wTmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcclxuICAgIHZhciBwcm9wQ291bnQgPSBwcm9wTmFtZXMubGVuZ3RoO1xyXG4gICAgaWYgKHByb3BOYW1lcy5pbmRleE9mKCdjbGFzc2VzJykgPT09IC0xICYmIHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcy5jbGFzc2VzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpbmNsdWRlc0V2ZW50c0FuZEF0dHJpYnV0ZXMgJiYgcmVtb3ZlT3JwaGFuZWRFdmVudHMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHByb3BOYW1lID0gcHJvcE5hbWVzW2ldO1xyXG4gICAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXTtcclxuICAgICAgICB2YXIgcHJldmlvdXNWYWx1ZSA9IHByZXZpb3VzUHJvcGVydGllc1twcm9wTmFtZV07XHJcbiAgICAgICAgaWYgKHByb3BOYW1lID09PSAnY2xhc3NlcycpIHtcclxuICAgICAgICAgICAgdmFyIHByZXZpb3VzQ2xhc3NlcyA9IEFycmF5LmlzQXJyYXkocHJldmlvdXNWYWx1ZSkgPyBwcmV2aW91c1ZhbHVlIDogW3ByZXZpb3VzVmFsdWVdO1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudENsYXNzZXMgPSBBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkgPyBwcm9wVmFsdWUgOiBbcHJvcFZhbHVlXTtcclxuICAgICAgICAgICAgaWYgKHByZXZpb3VzQ2xhc3NlcyAmJiBwcmV2aW91c0NsYXNzZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwcm9wVmFsdWUgfHwgcHJvcFZhbHVlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlfMSA9IDA7IGlfMSA8IHByZXZpb3VzQ2xhc3Nlcy5sZW5ndGg7IGlfMSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNDbGFzc2VzW2lfMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdDbGFzc2VzID0gdHNsaWJfMS5fX3NwcmVhZChjdXJyZW50Q2xhc3Nlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaV8yID0gMDsgaV8yIDwgcHJldmlvdXNDbGFzc2VzLmxlbmd0aDsgaV8yKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzQ2xhc3NOYW1lID0gcHJldmlvdXNDbGFzc2VzW2lfMl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c0NsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNsYXNzSW5kZXggPSBuZXdDbGFzc2VzLmluZGV4T2YocHJldmlvdXNDbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNsYXNzSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBwcmV2aW91c0NsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDbGFzc2VzLnNwbGljZShjbGFzc0luZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpXzMgPSAwOyBpXzMgPCBuZXdDbGFzc2VzLmxlbmd0aDsgaV8zKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkQ2xhc3Nlcyhkb21Ob2RlLCBuZXdDbGFzc2VzW2lfM10pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGlfNCA9IDA7IGlfNCA8IGN1cnJlbnRDbGFzc2VzLmxlbmd0aDsgaV80KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBhZGRDbGFzc2VzKGRvbU5vZGUsIGN1cnJlbnRDbGFzc2VzW2lfNF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHByb3BOYW1lID09PSAnZm9jdXMnKSB7XHJcbiAgICAgICAgICAgIGZvY3VzTm9kZShwcm9wVmFsdWUsIHByZXZpb3VzVmFsdWUsIGRvbU5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocHJvcE5hbWUgPT09ICdzdHlsZXMnKSB7XHJcbiAgICAgICAgICAgIHZhciBzdHlsZU5hbWVzID0gT2JqZWN0LmtleXMocHJvcFZhbHVlKTtcclxuICAgICAgICAgICAgdmFyIHN0eWxlQ291bnQgPSBzdHlsZU5hbWVzLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzdHlsZUNvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdHlsZU5hbWUgPSBzdHlsZU5hbWVzW2pdO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1N0eWxlVmFsdWUgPSBwcm9wVmFsdWVbc3R5bGVOYW1lXTtcclxuICAgICAgICAgICAgICAgIHZhciBvbGRTdHlsZVZhbHVlID0gcHJldmlvdXNWYWx1ZSAmJiBwcmV2aW91c1ZhbHVlW3N0eWxlTmFtZV07XHJcbiAgICAgICAgICAgICAgICBpZiAobmV3U3R5bGVWYWx1ZSA9PT0gb2xkU3R5bGVWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllc1VwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1N0eWxlVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja1N0eWxlVmFsdWUobmV3U3R5bGVWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMuc3R5bGVBcHBseWVyKGRvbU5vZGUsIHN0eWxlTmFtZSwgbmV3U3R5bGVWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5zdHlsZUFwcGx5ZXIoZG9tTm9kZSwgc3R5bGVOYW1lLCAnJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghcHJvcFZhbHVlICYmIHR5cGVvZiBwcmV2aW91c1ZhbHVlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgcHJvcFZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BOYW1lID09PSAndmFsdWUnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZG9tVmFsdWUgPSBkb21Ob2RlW3Byb3BOYW1lXTtcclxuICAgICAgICAgICAgICAgIGlmIChkb21WYWx1ZSAhPT0gcHJvcFZhbHVlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKGRvbU5vZGVbJ29uaW5wdXQtdmFsdWUnXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGRvbVZhbHVlID09PSBkb21Ob2RlWydvbmlucHV0LXZhbHVlJ11cclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBwcm9wVmFsdWUgIT09IHByZXZpb3VzVmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZVsnb25pbnB1dC12YWx1ZSddID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BWYWx1ZSAhPT0gcHJldmlvdXNWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNVcGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSAhPT0gJ2tleScgJiYgcHJvcFZhbHVlICE9PSBwcmV2aW91c1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wTmFtZS5sYXN0SW5kZXhPZignb24nLCAwKSA9PT0gMCAmJiBpbmNsdWRlc0V2ZW50c0FuZEF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVFdmVudChkb21Ob2RlLCBwcm9wTmFtZS5zdWJzdHIoMiksIHByb3BWYWx1ZSwgcHJvamVjdGlvbk9wdGlvbnMsIHByb3BlcnRpZXMuYmluZCwgcHJldmlvdXNWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJyAmJiBwcm9wTmFtZSAhPT0gJ2lubmVySFRNTCcgJiYgaW5jbHVkZXNFdmVudHNBbmRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQXR0cmlidXRlKGRvbU5vZGUsIHByb3BOYW1lLCBwcm9wVmFsdWUsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHByb3BOYW1lID09PSAnc2Nyb2xsTGVmdCcgfHwgcHJvcE5hbWUgPT09ICdzY3JvbGxUb3AnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbU5vZGVbcHJvcE5hbWVdICE9PSBwcm9wVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzVXBkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJvcGVydGllc1VwZGF0ZWQ7XHJcbn1cclxuZnVuY3Rpb24gZmluZEluZGV4T2ZDaGlsZChjaGlsZHJlbiwgc2FtZUFzLCBzdGFydCkge1xyXG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoc2FtZShjaGlsZHJlbltpXSwgc2FtZUFzKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLTE7XHJcbn1cclxuZnVuY3Rpb24gdG9QYXJlbnRWTm9kZShkb21Ob2RlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRhZzogJycsXHJcbiAgICAgICAgcHJvcGVydGllczoge30sXHJcbiAgICAgICAgY2hpbGRyZW46IHVuZGVmaW5lZCxcclxuICAgICAgICBkb21Ob2RlOiBkb21Ob2RlLFxyXG4gICAgICAgIHR5cGU6IGRfMS5WTk9ERVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLnRvUGFyZW50Vk5vZGUgPSB0b1BhcmVudFZOb2RlO1xyXG5mdW5jdGlvbiB0b1RleHRWTm9kZShkYXRhKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRhZzogJycsXHJcbiAgICAgICAgcHJvcGVydGllczoge30sXHJcbiAgICAgICAgY2hpbGRyZW46IHVuZGVmaW5lZCxcclxuICAgICAgICB0ZXh0OiBcIlwiICsgZGF0YSxcclxuICAgICAgICBkb21Ob2RlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgdHlwZTogZF8xLlZOT0RFXHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMudG9UZXh0Vk5vZGUgPSB0b1RleHRWTm9kZTtcclxuZnVuY3Rpb24gdG9JbnRlcm5hbFdOb2RlKGluc3RhbmNlLCBpbnN0YW5jZURhdGEpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlLFxyXG4gICAgICAgIHJlbmRlcmVkOiBbXSxcclxuICAgICAgICBjb3JlUHJvcGVydGllczogaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLFxyXG4gICAgICAgIGNoaWxkcmVuOiBpbnN0YW5jZS5jaGlsZHJlbixcclxuICAgICAgICB3aWRnZXRDb25zdHJ1Y3RvcjogaW5zdGFuY2UuY29uc3RydWN0b3IsXHJcbiAgICAgICAgcHJvcGVydGllczogaW5zdGFuY2VEYXRhLmlucHV0UHJvcGVydGllcyxcclxuICAgICAgICB0eXBlOiBkXzEuV05PREVcclxuICAgIH07XHJcbn1cclxuZnVuY3Rpb24gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihjaGlsZHJlbiwgaW5zdGFuY2UpIHtcclxuICAgIGlmIChjaGlsZHJlbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuIGVtcHR5QXJyYXk7XHJcbiAgICB9XHJcbiAgICBjaGlsZHJlbiA9IEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pID8gY2hpbGRyZW4gOiBbY2hpbGRyZW5dO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7KSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XHJcbiAgICAgICAgaWYgKGNoaWxkID09PSB1bmRlZmluZWQgfHwgY2hpbGQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgY2hpbGRyZW4uc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGNoaWxkID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBjaGlsZHJlbltpXSA9IHRvVGV4dFZOb2RlKGNoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChkXzEuaXNWTm9kZShjaGlsZCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5wcm9wZXJ0aWVzLmJpbmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLnByb3BlcnRpZXMuYmluZCA9IGluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5jaGlsZHJlbiAmJiBjaGlsZC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4sIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNoaWxkLmNvcmVQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5jb3JlUHJvcGVydGllcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmluZDogaW5zdGFuY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VSZWdpc3RyeTogaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLmJhc2VSZWdpc3RyeVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQuY2hpbGRyZW4gJiYgY2hpbGQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4sIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpKys7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbn1cclxuZXhwb3J0cy5maWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuID0gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbjtcclxuZnVuY3Rpb24gbm9kZUFkZGVkKGRub2RlLCB0cmFuc2l0aW9ucykge1xyXG4gICAgaWYgKGRfMS5pc1ZOb2RlKGRub2RlKSAmJiBkbm9kZS5wcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgdmFyIGVudGVyQW5pbWF0aW9uID0gZG5vZGUucHJvcGVydGllcy5lbnRlckFuaW1hdGlvbjtcclxuICAgICAgICBpZiAoZW50ZXJBbmltYXRpb24pIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbnRlckFuaW1hdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgZW50ZXJBbmltYXRpb24oZG5vZGUuZG9tTm9kZSwgZG5vZGUucHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9ucy5lbnRlcihkbm9kZS5kb21Ob2RlLCBkbm9kZS5wcm9wZXJ0aWVzLCBlbnRlckFuaW1hdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gY2FsbE9uRGV0YWNoKGROb2RlcywgcGFyZW50SW5zdGFuY2UpIHtcclxuICAgIGROb2RlcyA9IEFycmF5LmlzQXJyYXkoZE5vZGVzKSA/IGROb2RlcyA6IFtkTm9kZXNdO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgZE5vZGUgPSBkTm9kZXNbaV07XHJcbiAgICAgICAgaWYgKGRfMS5pc1dOb2RlKGROb2RlKSkge1xyXG4gICAgICAgICAgICBpZiAoZE5vZGUucmVuZGVyZWQpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxPbkRldGFjaChkTm9kZS5yZW5kZXJlZCwgZE5vZGUuaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkTm9kZS5pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGROb2RlLmluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlRGF0YS5vbkRldGFjaCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZE5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIGNhbGxPbkRldGFjaChkTm9kZS5jaGlsZHJlbiwgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIG5vZGVUb1JlbW92ZShkbm9kZSwgdHJhbnNpdGlvbnMsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICBpZiAoZF8xLmlzV05vZGUoZG5vZGUpKSB7XHJcbiAgICAgICAgdmFyIHJlbmRlcmVkID0gZG5vZGUucmVuZGVyZWQgfHwgZW1wdHlBcnJheTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlbmRlcmVkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IHJlbmRlcmVkW2ldO1xyXG4gICAgICAgICAgICBpZiAoZF8xLmlzVk5vZGUoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5kb21Ob2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoY2hpbGQuZG9tTm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBub2RlVG9SZW1vdmUoY2hpbGQsIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB2YXIgZG9tTm9kZV8xID0gZG5vZGUuZG9tTm9kZTtcclxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IGRub2RlLnByb3BlcnRpZXM7XHJcbiAgICAgICAgdmFyIGV4aXRBbmltYXRpb24gPSBwcm9wZXJ0aWVzLmV4aXRBbmltYXRpb247XHJcbiAgICAgICAgaWYgKHByb3BlcnRpZXMgJiYgZXhpdEFuaW1hdGlvbikge1xyXG4gICAgICAgICAgICBkb21Ob2RlXzEuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcclxuICAgICAgICAgICAgdmFyIHJlbW92ZURvbU5vZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBkb21Ob2RlXzEgJiYgZG9tTm9kZV8xLnBhcmVudE5vZGUgJiYgZG9tTm9kZV8xLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG9tTm9kZV8xKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBleGl0QW5pbWF0aW9uID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBleGl0QW5pbWF0aW9uKGRvbU5vZGVfMSwgcmVtb3ZlRG9tTm9kZSwgcHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9ucy5leGl0KGRub2RlLmRvbU5vZGUsIHByb3BlcnRpZXMsIGV4aXRBbmltYXRpb24sIHJlbW92ZURvbU5vZGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvbU5vZGVfMSAmJiBkb21Ob2RlXzEucGFyZW50Tm9kZSAmJiBkb21Ob2RlXzEucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb21Ob2RlXzEpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGNoZWNrRGlzdGluZ3Vpc2hhYmxlKGNoaWxkTm9kZXMsIGluZGV4VG9DaGVjaywgcGFyZW50SW5zdGFuY2UpIHtcclxuICAgIHZhciBjaGlsZE5vZGUgPSBjaGlsZE5vZGVzW2luZGV4VG9DaGVja107XHJcbiAgICBpZiAoZF8xLmlzVk5vZGUoY2hpbGROb2RlKSAmJiAhY2hpbGROb2RlLnRhZykge1xyXG4gICAgICAgIHJldHVybjsgLy8gVGV4dCBub2RlcyBuZWVkIG5vdCBiZSBkaXN0aW5ndWlzaGFibGVcclxuICAgIH1cclxuICAgIHZhciBrZXkgPSBjaGlsZE5vZGUucHJvcGVydGllcy5rZXk7XHJcbiAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpICE9PSBpbmRleFRvQ2hlY2spIHtcclxuICAgICAgICAgICAgICAgIHZhciBub2RlID0gY2hpbGROb2Rlc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChzYW1lKG5vZGUsIGNoaWxkTm9kZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZUlkZW50aWZpZXIgPSB2b2lkIDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmVudE5hbWUgPSBwYXJlbnRJbnN0YW5jZS5jb25zdHJ1Y3Rvci5uYW1lIHx8ICd1bmtub3duJztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZF8xLmlzV05vZGUoY2hpbGROb2RlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlSWRlbnRpZmllciA9IGNoaWxkTm9kZS53aWRnZXRDb25zdHJ1Y3Rvci5uYW1lIHx8ICd1bmtub3duJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVJZGVudGlmaWVyID0gY2hpbGROb2RlLnRhZztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQSB3aWRnZXQgKFwiICsgcGFyZW50TmFtZSArIFwiKSBoYXMgaGFkIGEgY2hpbGQgYWRkZGVkIG9yIHJlbW92ZWQsIGJ1dCB0aGV5IHdlcmUgbm90IGFibGUgdG8gdW5pcXVlbHkgaWRlbnRpZmllZC4gSXQgaXMgcmVjb21tZW5kZWQgdG8gcHJvdmlkZSBhIHVuaXF1ZSAna2V5JyBwcm9wZXJ0eSB3aGVuIHVzaW5nIHRoZSBzYW1lIHdpZGdldCBvciBlbGVtZW50IChcIiArIG5vZGVJZGVudGlmaWVyICsgXCIpIG11bHRpcGxlIHRpbWVzIGFzIHNpYmxpbmdzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZUNoaWxkcmVuKHBhcmVudFZOb2RlLCBvbGRDaGlsZHJlbiwgbmV3Q2hpbGRyZW4sIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgb2xkQ2hpbGRyZW4gPSBvbGRDaGlsZHJlbiB8fCBlbXB0eUFycmF5O1xyXG4gICAgbmV3Q2hpbGRyZW4gPSBuZXdDaGlsZHJlbjtcclxuICAgIHZhciBvbGRDaGlsZHJlbkxlbmd0aCA9IG9sZENoaWxkcmVuLmxlbmd0aDtcclxuICAgIHZhciBuZXdDaGlsZHJlbkxlbmd0aCA9IG5ld0NoaWxkcmVuLmxlbmd0aDtcclxuICAgIHZhciB0cmFuc2l0aW9ucyA9IHByb2plY3Rpb25PcHRpb25zLnRyYW5zaXRpb25zO1xyXG4gICAgdmFyIHByb2plY3RvclN0YXRlID0gcHJvamVjdG9yU3RhdGVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgIHByb2plY3Rpb25PcHRpb25zID0gdHNsaWJfMS5fX2Fzc2lnbih7fSwgcHJvamVjdGlvbk9wdGlvbnMsIHsgZGVwdGg6IHByb2plY3Rpb25PcHRpb25zLmRlcHRoICsgMSB9KTtcclxuICAgIHZhciBvbGRJbmRleCA9IDA7XHJcbiAgICB2YXIgbmV3SW5kZXggPSAwO1xyXG4gICAgdmFyIGk7XHJcbiAgICB2YXIgdGV4dFVwZGF0ZWQgPSBmYWxzZTtcclxuICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBvbGRDaGlsZCA9IG9sZEluZGV4IDwgb2xkQ2hpbGRyZW5MZW5ndGggPyBvbGRDaGlsZHJlbltvbGRJbmRleF0gOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIG5ld0NoaWxkID0gbmV3Q2hpbGRyZW5bbmV3SW5kZXhdO1xyXG4gICAgICAgIGlmIChkXzEuaXNWTm9kZShuZXdDaGlsZCkgJiYgdHlwZW9mIG5ld0NoaWxkLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIG5ld0NoaWxkLmluc2VydGVkID0gZF8xLmlzVk5vZGUob2xkQ2hpbGQpICYmIG9sZENoaWxkLmluc2VydGVkO1xyXG4gICAgICAgICAgICBhZGREZWZlcnJlZFByb3BlcnRpZXMobmV3Q2hpbGQsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9sZENoaWxkICE9PSB1bmRlZmluZWQgJiYgc2FtZShvbGRDaGlsZCwgbmV3Q2hpbGQpKSB7XHJcbiAgICAgICAgICAgIHRleHRVcGRhdGVkID0gdXBkYXRlRG9tKG9sZENoaWxkLCBuZXdDaGlsZCwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudFZOb2RlLCBwYXJlbnRJbnN0YW5jZSkgfHwgdGV4dFVwZGF0ZWQ7XHJcbiAgICAgICAgICAgIG9sZEluZGV4Kys7XHJcbiAgICAgICAgICAgIG5ld0luZGV4Kys7XHJcbiAgICAgICAgICAgIHJldHVybiBcImNvbnRpbnVlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBmaW5kT2xkSW5kZXggPSBmaW5kSW5kZXhPZkNoaWxkKG9sZENoaWxkcmVuLCBuZXdDaGlsZCwgb2xkSW5kZXggKyAxKTtcclxuICAgICAgICB2YXIgYWRkQ2hpbGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBpbnNlcnRCZWZvcmUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IG9sZENoaWxkcmVuW29sZEluZGV4XTtcclxuICAgICAgICAgICAgaWYgKGNoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dEluZGV4ID0gb2xkSW5kZXggKyAxO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGluc2VydEJlZm9yZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRfMS5pc1dOb2RlKGNoaWxkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQucmVuZGVyZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0gY2hpbGQucmVuZGVyZWRbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAob2xkQ2hpbGRyZW5bbmV4dEluZGV4XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBvbGRDaGlsZHJlbltuZXh0SW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlID0gY2hpbGQuZG9tTm9kZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3JlYXRlRG9tKG5ld0NoaWxkLCBwYXJlbnRWTm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICBub2RlQWRkZWQobmV3Q2hpbGQsIHRyYW5zaXRpb25zKTtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG9DaGVjayA9IG5ld0luZGV4O1xyXG4gICAgICAgICAgICBwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG5ld0NoaWxkcmVuLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoIW9sZENoaWxkIHx8IGZpbmRPbGRJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgYWRkQ2hpbGQoKTtcclxuICAgICAgICAgICAgbmV3SW5kZXgrKztcclxuICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlbW92ZUNoaWxkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb0NoZWNrID0gb2xkSW5kZXg7XHJcbiAgICAgICAgICAgIHByb2plY3RvclN0YXRlLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY2FsbE9uRGV0YWNoKG9sZENoaWxkLCBwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICBjaGVja0Rpc3Rpbmd1aXNoYWJsZShvbGRDaGlsZHJlbiwgaW5kZXhUb0NoZWNrLCBwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBub2RlVG9SZW1vdmUob2xkQ2hpbGQsIHRyYW5zaXRpb25zLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgZmluZE5ld0luZGV4ID0gZmluZEluZGV4T2ZDaGlsZChuZXdDaGlsZHJlbiwgb2xkQ2hpbGQsIG5ld0luZGV4ICsgMSk7XHJcbiAgICAgICAgaWYgKGZpbmROZXdJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgcmVtb3ZlQ2hpbGQoKTtcclxuICAgICAgICAgICAgb2xkSW5kZXgrKztcclxuICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWRkQ2hpbGQoKTtcclxuICAgICAgICByZW1vdmVDaGlsZCgpO1xyXG4gICAgICAgIG9sZEluZGV4Kys7XHJcbiAgICAgICAgbmV3SW5kZXgrKztcclxuICAgIH07XHJcbiAgICB3aGlsZSAobmV3SW5kZXggPCBuZXdDaGlsZHJlbkxlbmd0aCkge1xyXG4gICAgICAgIF9sb29wXzEoKTtcclxuICAgIH1cclxuICAgIGlmIChvbGRDaGlsZHJlbkxlbmd0aCA+IG9sZEluZGV4KSB7XHJcbiAgICAgICAgdmFyIF9sb29wXzIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBvbGRDaGlsZCA9IG9sZENoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb0NoZWNrID0gaTtcclxuICAgICAgICAgICAgcHJvamVjdG9yU3RhdGUuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsT25EZXRhY2gob2xkQ2hpbGQsIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG9sZENoaWxkcmVuLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG5vZGVUb1JlbW92ZShvbGRDaGlsZHJlbltpXSwgdHJhbnNpdGlvbnMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIFJlbW92ZSBjaGlsZCBmcmFnbWVudHNcclxuICAgICAgICBmb3IgKGkgPSBvbGRJbmRleDsgaSA8IG9sZENoaWxkcmVuTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgX2xvb3BfMigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0ZXh0VXBkYXRlZDtcclxufVxyXG5mdW5jdGlvbiBhZGRDaGlsZHJlbihwYXJlbnRWTm9kZSwgY2hpbGRyZW4sIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSwgaW5zZXJ0QmVmb3JlLCBjaGlsZE5vZGVzKSB7XHJcbiAgICBpZiAoaW5zZXJ0QmVmb3JlID09PSB2b2lkIDApIHsgaW5zZXJ0QmVmb3JlID0gdW5kZWZpbmVkOyB9XHJcbiAgICBpZiAoY2hpbGRyZW4gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHZhciBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICBpZiAocHJvamVjdG9yU3RhdGUubWVyZ2UgJiYgY2hpbGROb2RlcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY2hpbGROb2RlcyA9IGFycmF5XzEuZnJvbShwYXJlbnRWTm9kZS5kb21Ob2RlLmNoaWxkTm9kZXMpO1xyXG4gICAgfVxyXG4gICAgcHJvamVjdGlvbk9wdGlvbnMgPSB0c2xpYl8xLl9fYXNzaWduKHt9LCBwcm9qZWN0aW9uT3B0aW9ucywgeyBkZXB0aDogcHJvamVjdGlvbk9wdGlvbnMuZGVwdGggKyAxIH0pO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICAgIGlmIChkXzEuaXNWTm9kZShjaGlsZCkpIHtcclxuICAgICAgICAgICAgaWYgKHByb2plY3RvclN0YXRlLm1lcmdlICYmIGNoaWxkTm9kZXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkb21FbGVtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNoaWxkLmRvbU5vZGUgPT09IHVuZGVmaW5lZCAmJiBjaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21FbGVtZW50ID0gY2hpbGROb2Rlcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb21FbGVtZW50ICYmIGRvbUVsZW1lbnQudGFnTmFtZSA9PT0gKGNoaWxkLnRhZy50b1VwcGVyQ2FzZSgpIHx8IHVuZGVmaW5lZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuZG9tTm9kZSA9IGRvbUVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNyZWF0ZURvbShjaGlsZCwgcGFyZW50Vk5vZGUsIGluc2VydEJlZm9yZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZURvbShjaGlsZCwgcGFyZW50Vk5vZGUsIGluc2VydEJlZm9yZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlLCBjaGlsZE5vZGVzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaW5pdFByb3BlcnRpZXNBbmRDaGlsZHJlbihkb21Ob2RlLCBkbm9kZSwgcGFyZW50SW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICBhZGRDaGlsZHJlbihkbm9kZSwgZG5vZGUuY2hpbGRyZW4sIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSwgdW5kZWZpbmVkKTtcclxuICAgIGlmICh0eXBlb2YgZG5vZGUuZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicgJiYgZG5vZGUuaW5zZXJ0ZWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGFkZERlZmVycmVkUHJvcGVydGllcyhkbm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgaWYgKGRub2RlLmF0dHJpYnV0ZXMgJiYgZG5vZGUuZXZlbnRzKSB7XHJcbiAgICAgICAgdXBkYXRlQXR0cmlidXRlcyhkb21Ob2RlLCB7fSwgZG5vZGUuYXR0cmlidXRlcywgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIHVwZGF0ZVByb3BlcnRpZXMoZG9tTm9kZSwge30sIGRub2RlLnByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zLCBmYWxzZSk7XHJcbiAgICAgICAgcmVtb3ZlT3JwaGFuZWRFdmVudHMoZG9tTm9kZSwge30sIGRub2RlLmV2ZW50cywgcHJvamVjdGlvbk9wdGlvbnMsIHRydWUpO1xyXG4gICAgICAgIHZhciBldmVudHNfMSA9IGRub2RlLmV2ZW50cztcclxuICAgICAgICBPYmplY3Qua2V5cyhldmVudHNfMSkuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgdXBkYXRlRXZlbnQoZG9tTm9kZSwgZXZlbnQsIGV2ZW50c18xW2V2ZW50XSwgcHJvamVjdGlvbk9wdGlvbnMsIGRub2RlLnByb3BlcnRpZXMuYmluZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB1cGRhdGVQcm9wZXJ0aWVzKGRvbU5vZGUsIHt9LCBkbm9kZS5wcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBpZiAoZG5vZGUucHJvcGVydGllcy5rZXkgIT09IG51bGwgJiYgZG5vZGUucHJvcGVydGllcy5rZXkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZURhdGEgPSBleHBvcnRzLndpZGdldEluc3RhbmNlTWFwLmdldChwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZChkb21Ob2RlLCBcIlwiICsgZG5vZGUucHJvcGVydGllcy5rZXkpO1xyXG4gICAgfVxyXG4gICAgZG5vZGUuaW5zZXJ0ZWQgPSB0cnVlO1xyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZURvbShkbm9kZSwgcGFyZW50Vk5vZGUsIGluc2VydEJlZm9yZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlLCBjaGlsZE5vZGVzKSB7XHJcbiAgICB2YXIgZG9tTm9kZTtcclxuICAgIHZhciBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICBpZiAoZF8xLmlzV05vZGUoZG5vZGUpKSB7XHJcbiAgICAgICAgdmFyIHdpZGdldENvbnN0cnVjdG9yID0gZG5vZGUud2lkZ2V0Q29uc3RydWN0b3I7XHJcbiAgICAgICAgdmFyIHBhcmVudEluc3RhbmNlRGF0YSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICBpZiAoIVJlZ2lzdHJ5XzEuaXNXaWRnZXRCYXNlQ29uc3RydWN0b3Iod2lkZ2V0Q29uc3RydWN0b3IpKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gcGFyZW50SW5zdGFuY2VEYXRhLnJlZ2lzdHJ5KCkuZ2V0KHdpZGdldENvbnN0cnVjdG9yKTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aWRnZXRDb25zdHJ1Y3RvciA9IGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBpbnN0YW5jZV8xID0gbmV3IHdpZGdldENvbnN0cnVjdG9yKCk7XHJcbiAgICAgICAgZG5vZGUuaW5zdGFuY2UgPSBpbnN0YW5jZV8xO1xyXG4gICAgICAgIHZhciBpbnN0YW5jZURhdGFfMSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlXzEpO1xyXG4gICAgICAgIGluc3RhbmNlRGF0YV8xLmludmFsaWRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YV8xLmRpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKGluc3RhbmNlRGF0YV8xLnJlbmRlcmluZyA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHByb2plY3RvclN0YXRlLnJlbmRlclF1ZXVlLnB1c2goeyBpbnN0YW5jZTogaW5zdGFuY2VfMSwgZGVwdGg6IHByb2plY3Rpb25PcHRpb25zLmRlcHRoIH0pO1xyXG4gICAgICAgICAgICAgICAgc2NoZWR1bGVSZW5kZXIocHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbnN0YW5jZURhdGFfMS5yZW5kZXJpbmcgPSB0cnVlO1xyXG4gICAgICAgIGluc3RhbmNlXzEuX19zZXRDb3JlUHJvcGVydGllc19fKGRub2RlLmNvcmVQcm9wZXJ0aWVzKTtcclxuICAgICAgICBpbnN0YW5jZV8xLl9fc2V0Q2hpbGRyZW5fXyhkbm9kZS5jaGlsZHJlbik7XHJcbiAgICAgICAgaW5zdGFuY2VfMS5fX3NldFByb3BlcnRpZXNfXyhkbm9kZS5wcm9wZXJ0aWVzKTtcclxuICAgICAgICB2YXIgcmVuZGVyZWQgPSBpbnN0YW5jZV8xLl9fcmVuZGVyX18oKTtcclxuICAgICAgICBpbnN0YW5jZURhdGFfMS5yZW5kZXJpbmcgPSBmYWxzZTtcclxuICAgICAgICBpZiAocmVuZGVyZWQpIHtcclxuICAgICAgICAgICAgdmFyIGZpbHRlcmVkUmVuZGVyZWQgPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKHJlbmRlcmVkLCBpbnN0YW5jZV8xKTtcclxuICAgICAgICAgICAgZG5vZGUucmVuZGVyZWQgPSBmaWx0ZXJlZFJlbmRlcmVkO1xyXG4gICAgICAgICAgICBhZGRDaGlsZHJlbihwYXJlbnRWTm9kZSwgZmlsdGVyZWRSZW5kZXJlZCwgcHJvamVjdGlvbk9wdGlvbnMsIGluc3RhbmNlXzEsIGluc2VydEJlZm9yZSwgY2hpbGROb2Rlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGluc3RhbmNlTWFwLnNldChpbnN0YW5jZV8xLCB7IGRub2RlOiBkbm9kZSwgcGFyZW50Vk5vZGU6IHBhcmVudFZOb2RlIH0pO1xyXG4gICAgICAgIGluc3RhbmNlRGF0YV8xLm5vZGVIYW5kbGVyLmFkZFJvb3QoKTtcclxuICAgICAgICBwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhXzEub25BdHRhY2goKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChwcm9qZWN0b3JTdGF0ZS5tZXJnZSAmJiBwcm9qZWN0b3JTdGF0ZS5tZXJnZUVsZW1lbnQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IHByb2plY3Rpb25PcHRpb25zLm1lcmdlRWxlbWVudDtcclxuICAgICAgICAgICAgcHJvamVjdG9yU3RhdGUubWVyZ2VFbGVtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpbml0UHJvcGVydGllc0FuZENoaWxkcmVuKGRvbU5vZGUsIGRub2RlLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkb2MgPSBwYXJlbnRWTm9kZS5kb21Ob2RlLm93bmVyRG9jdW1lbnQ7XHJcbiAgICAgICAgaWYgKCFkbm9kZS50YWcgJiYgdHlwZW9mIGRub2RlLnRleHQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGlmIChkbm9kZS5kb21Ob2RlICE9PSB1bmRlZmluZWQgJiYgcGFyZW50Vk5vZGUuZG9tTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld0RvbU5vZGUgPSBkbm9kZS5kb21Ob2RlLm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZG5vZGUudGV4dCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50Vk5vZGUuZG9tTm9kZSA9PT0gZG5vZGUuZG9tTm9kZS5wYXJlbnROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Vk5vZGUuZG9tTm9kZS5yZXBsYWNlQ2hpbGQobmV3RG9tTm9kZSwgZG5vZGUuZG9tTm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRWTm9kZS5kb21Ob2RlLmFwcGVuZENoaWxkKG5ld0RvbU5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRub2RlLmRvbU5vZGUucGFyZW50Tm9kZSAmJiBkbm9kZS5kb21Ob2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG5vZGUuZG9tTm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkbm9kZS5kb21Ob2RlID0gbmV3RG9tTm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gZG9jLmNyZWF0ZVRleHROb2RlKGRub2RlLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluc2VydEJlZm9yZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Vk5vZGUuZG9tTm9kZS5pbnNlcnRCZWZvcmUoZG9tTm9kZSwgaW5zZXJ0QmVmb3JlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudFZOb2RlLmRvbU5vZGUuYXBwZW5kQ2hpbGQoZG9tTm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChkbm9kZS5kb21Ob2RlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkbm9kZS50YWcgPT09ICdzdmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMgPSB0c2xpYl8xLl9fYXNzaWduKHt9LCBwcm9qZWN0aW9uT3B0aW9ucywgeyBuYW1lc3BhY2U6IE5BTUVTUEFDRV9TVkcgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IGRvYy5jcmVhdGVFbGVtZW50TlMocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlLCBkbm9kZS50YWcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlIHx8IGRvYy5jcmVhdGVFbGVtZW50KGRub2RlLnRhZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkb21Ob2RlID0gZG5vZGUuZG9tTm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbml0UHJvcGVydGllc0FuZENoaWxkcmVuKGRvbU5vZGUsIGRub2RlLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICBpZiAoaW5zZXJ0QmVmb3JlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudFZOb2RlLmRvbU5vZGUuaW5zZXJ0QmVmb3JlKGRvbU5vZGUsIGluc2VydEJlZm9yZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZG9tTm9kZS5wYXJlbnROb2RlICE9PSBwYXJlbnRWTm9kZS5kb21Ob2RlKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRWTm9kZS5kb21Ob2RlLmFwcGVuZENoaWxkKGRvbU5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZURvbShwcmV2aW91cywgZG5vZGUsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRWTm9kZSwgcGFyZW50SW5zdGFuY2UpIHtcclxuICAgIGlmIChkXzEuaXNXTm9kZShkbm9kZSkpIHtcclxuICAgICAgICB2YXIgaW5zdGFuY2UgPSBwcmV2aW91cy5pbnN0YW5jZTtcclxuICAgICAgICB2YXIgX2EgPSBpbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpLCBwYXJlbnRWTm9kZV8xID0gX2EucGFyZW50Vk5vZGUsIG5vZGUgPSBfYS5kbm9kZTtcclxuICAgICAgICB2YXIgcHJldmlvdXNSZW5kZXJlZCA9IG5vZGUgPyBub2RlLnJlbmRlcmVkIDogcHJldmlvdXMucmVuZGVyZWQ7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKTtcclxuICAgICAgICBpbnN0YW5jZURhdGEucmVuZGVyaW5nID0gdHJ1ZTtcclxuICAgICAgICBpbnN0YW5jZS5fX3NldENvcmVQcm9wZXJ0aWVzX18oZG5vZGUuY29yZVByb3BlcnRpZXMpO1xyXG4gICAgICAgIGluc3RhbmNlLl9fc2V0Q2hpbGRyZW5fXyhkbm9kZS5jaGlsZHJlbik7XHJcbiAgICAgICAgaW5zdGFuY2UuX19zZXRQcm9wZXJ0aWVzX18oZG5vZGUucHJvcGVydGllcyk7XHJcbiAgICAgICAgZG5vZGUuaW5zdGFuY2UgPSBpbnN0YW5jZTtcclxuICAgICAgICBpbnN0YW5jZU1hcC5zZXQoaW5zdGFuY2UsIHsgZG5vZGU6IGRub2RlLCBwYXJlbnRWTm9kZTogcGFyZW50Vk5vZGVfMSB9KTtcclxuICAgICAgICBpZiAoaW5zdGFuY2VEYXRhLmRpcnR5ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHZhciByZW5kZXJlZCA9IGluc3RhbmNlLl9fcmVuZGVyX18oKTtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLnJlbmRlcmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBkbm9kZS5yZW5kZXJlZCA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4ocmVuZGVyZWQsIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgdXBkYXRlQ2hpbGRyZW4ocGFyZW50Vk5vZGVfMSwgcHJldmlvdXNSZW5kZXJlZCwgZG5vZGUucmVuZGVyZWQsIGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpbnN0YW5jZURhdGEucmVuZGVyaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGRub2RlLnJlbmRlcmVkID0gcHJldmlvdXNSZW5kZXJlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLm5vZGVIYW5kbGVyLmFkZFJvb3QoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChwcmV2aW91cyA9PT0gZG5vZGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZG9tTm9kZV8yID0gKGRub2RlLmRvbU5vZGUgPSBwcmV2aW91cy5kb21Ob2RlKTtcclxuICAgICAgICB2YXIgdGV4dFVwZGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICB2YXIgdXBkYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICghZG5vZGUudGFnICYmIHR5cGVvZiBkbm9kZS50ZXh0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBpZiAoZG5vZGUudGV4dCAhPT0gcHJldmlvdXMudGV4dCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld0RvbU5vZGUgPSBkb21Ob2RlXzIub3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkbm9kZS50ZXh0KTtcclxuICAgICAgICAgICAgICAgIGRvbU5vZGVfMi5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdEb21Ob2RlLCBkb21Ob2RlXzIpO1xyXG4gICAgICAgICAgICAgICAgZG5vZGUuZG9tTm9kZSA9IG5ld0RvbU5vZGU7XHJcbiAgICAgICAgICAgICAgICB0ZXh0VXBkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dFVwZGF0ZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChkbm9kZS50YWcgJiYgZG5vZGUudGFnLmxhc3RJbmRleE9mKCdzdmcnLCAwKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMgPSB0c2xpYl8xLl9fYXNzaWduKHt9LCBwcm9qZWN0aW9uT3B0aW9ucywgeyBuYW1lc3BhY2U6IE5BTUVTUEFDRV9TVkcgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByZXZpb3VzLmNoaWxkcmVuICE9PSBkbm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihkbm9kZS5jaGlsZHJlbiwgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgZG5vZGUuY2hpbGRyZW4gPSBjaGlsZHJlbjtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZWQgPVxyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUNoaWxkcmVuKGRub2RlLCBwcmV2aW91cy5jaGlsZHJlbiwgY2hpbGRyZW4sIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucykgfHwgdXBkYXRlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcHJldmlvdXNQcm9wZXJ0aWVzXzEgPSBidWlsZFByZXZpb3VzUHJvcGVydGllcyhkb21Ob2RlXzIsIHByZXZpb3VzLCBkbm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChkbm9kZS5hdHRyaWJ1dGVzICYmIGRub2RlLmV2ZW50cykge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlQXR0cmlidXRlcyhkb21Ob2RlXzIsIHByZXZpb3VzUHJvcGVydGllc18xLmF0dHJpYnV0ZXMsIGRub2RlLmF0dHJpYnV0ZXMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZWQgPVxyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVByb3BlcnRpZXMoZG9tTm9kZV8yLCBwcmV2aW91c1Byb3BlcnRpZXNfMS5wcm9wZXJ0aWVzLCBkbm9kZS5wcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucywgZmFsc2UpIHx8IHVwZGF0ZWQ7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVPcnBoYW5lZEV2ZW50cyhkb21Ob2RlXzIsIHByZXZpb3VzUHJvcGVydGllc18xLmV2ZW50cywgZG5vZGUuZXZlbnRzLCBwcm9qZWN0aW9uT3B0aW9ucywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXZlbnRzXzIgPSBkbm9kZS5ldmVudHM7XHJcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhldmVudHNfMikuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVFdmVudChkb21Ob2RlXzIsIGV2ZW50LCBldmVudHNfMltldmVudF0sIHByb2plY3Rpb25PcHRpb25zLCBkbm9kZS5wcm9wZXJ0aWVzLmJpbmQsIHByZXZpb3VzUHJvcGVydGllc18xLmV2ZW50c1tldmVudF0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVkID1cclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVQcm9wZXJ0aWVzKGRvbU5vZGVfMiwgcHJldmlvdXNQcm9wZXJ0aWVzXzEucHJvcGVydGllcywgZG5vZGUucHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGRub2RlLnByb3BlcnRpZXMua2V5ICE9PSBudWxsICYmIGRub2RlLnByb3BlcnRpZXMua2V5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbnN0YW5jZURhdGEgPSBleHBvcnRzLndpZGdldEluc3RhbmNlTWFwLmdldChwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZURhdGEubm9kZUhhbmRsZXIuYWRkKGRvbU5vZGVfMiwgXCJcIiArIGRub2RlLnByb3BlcnRpZXMua2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodXBkYXRlZCAmJiBkbm9kZS5wcm9wZXJ0aWVzICYmIGRub2RlLnByb3BlcnRpZXMudXBkYXRlQW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICAgIGRub2RlLnByb3BlcnRpZXMudXBkYXRlQW5pbWF0aW9uKGRvbU5vZGVfMiwgZG5vZGUucHJvcGVydGllcywgcHJldmlvdXMucHJvcGVydGllcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGFkZERlZmVycmVkUHJvcGVydGllcyh2bm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIC8vIHRyYW5zZmVyIGFueSBwcm9wZXJ0aWVzIHRoYXQgaGF2ZSBiZWVuIHBhc3NlZCAtIGFzIHRoZXNlIG11c3QgYmUgZGVjb3JhdGVkIHByb3BlcnRpZXNcclxuICAgIHZub2RlLmRlY29yYXRlZERlZmVycmVkUHJvcGVydGllcyA9IHZub2RlLnByb3BlcnRpZXM7XHJcbiAgICB2YXIgcHJvcGVydGllcyA9IHZub2RlLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrKCEhdm5vZGUuaW5zZXJ0ZWQpO1xyXG4gICAgdmFyIHByb2plY3RvclN0YXRlID0gcHJvamVjdG9yU3RhdGVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgIHZub2RlLnByb3BlcnRpZXMgPSB0c2xpYl8xLl9fYXNzaWduKHt9LCBwcm9wZXJ0aWVzLCB2bm9kZS5kZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXMpO1xyXG4gICAgcHJvamVjdG9yU3RhdGUuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0c2xpYl8xLl9fYXNzaWduKHt9LCB2bm9kZS5kZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayghIXZub2RlLmluc2VydGVkKSwgdm5vZGUuZGVjb3JhdGVkRGVmZXJyZWRQcm9wZXJ0aWVzKTtcclxuICAgICAgICB1cGRhdGVQcm9wZXJ0aWVzKHZub2RlLmRvbU5vZGUsIHZub2RlLnByb3BlcnRpZXMsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB2bm9kZS5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIHJ1bkRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICB2YXIgcHJvamVjdG9yU3RhdGUgPSBwcm9qZWN0b3JTdGF0ZU1hcC5nZXQocHJvamVjdGlvbk9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpO1xyXG4gICAgaWYgKHByb2plY3RvclN0YXRlLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xyXG4gICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5zeW5jKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChwcm9qZWN0b3JTdGF0ZS5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IHByb2plY3RvclN0YXRlLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBnbG9iYWxfMS5kZWZhdWx0LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAocHJvamVjdG9yU3RhdGUuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gcHJvamVjdG9yU3RhdGUuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcnVuQWZ0ZXJSZW5kZXJDYWxsYmFja3MocHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIHZhciBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMuc3luYykge1xyXG4gICAgICAgIHdoaWxlIChwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gcHJvamVjdG9yU3RhdGUuYWZ0ZXJSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcclxuICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAoZ2xvYmFsXzEuZGVmYXVsdC5yZXF1ZXN0SWRsZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGdsb2JhbF8xLmRlZmF1bHQucmVxdWVzdElkbGVDYWxsYmFjayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAocHJvamVjdG9yU3RhdGUuYWZ0ZXJSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gcHJvamVjdG9yU3RhdGUuYWZ0ZXJSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHByb2plY3RvclN0YXRlLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IHByb2plY3RvclN0YXRlLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHNjaGVkdWxlUmVuZGVyKHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICB2YXIgcHJvamVjdG9yU3RhdGUgPSBwcm9qZWN0b3JTdGF0ZU1hcC5nZXQocHJvamVjdGlvbk9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpO1xyXG4gICAgaWYgKHByb2plY3Rpb25PcHRpb25zLnN5bmMpIHtcclxuICAgICAgICByZW5kZXIocHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocHJvamVjdG9yU3RhdGUucmVuZGVyU2NoZWR1bGVkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBwcm9qZWN0b3JTdGF0ZS5yZW5kZXJTY2hlZHVsZWQgPSBnbG9iYWxfMS5kZWZhdWx0LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJlbmRlcihwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcmVuZGVyKHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICB2YXIgcHJvamVjdG9yU3RhdGUgPSBwcm9qZWN0b3JTdGF0ZU1hcC5nZXQocHJvamVjdGlvbk9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpO1xyXG4gICAgcHJvamVjdG9yU3RhdGUucmVuZGVyU2NoZWR1bGVkID0gdW5kZWZpbmVkO1xyXG4gICAgdmFyIHJlbmRlclF1ZXVlID0gcHJvamVjdG9yU3RhdGUucmVuZGVyUXVldWU7XHJcbiAgICB2YXIgcmVuZGVycyA9IHRzbGliXzEuX19zcHJlYWQocmVuZGVyUXVldWUpO1xyXG4gICAgcHJvamVjdG9yU3RhdGUucmVuZGVyUXVldWUgPSBbXTtcclxuICAgIHJlbmRlcnMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYS5kZXB0aCAtIGIuZGVwdGg7IH0pO1xyXG4gICAgd2hpbGUgKHJlbmRlcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlID0gcmVuZGVycy5zaGlmdCgpLmluc3RhbmNlO1xyXG4gICAgICAgIHZhciBfYSA9IGluc3RhbmNlTWFwLmdldChpbnN0YW5jZSksIHBhcmVudFZOb2RlID0gX2EucGFyZW50Vk5vZGUsIGRub2RlID0gX2EuZG5vZGU7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKTtcclxuICAgICAgICB1cGRhdGVEb20oZG5vZGUsIHRvSW50ZXJuYWxXTm9kZShpbnN0YW5jZSwgaW5zdGFuY2VEYXRhKSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudFZOb2RlLCBpbnN0YW5jZSk7XHJcbiAgICB9XHJcbiAgICBydW5BZnRlclJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICBydW5EZWZlcnJlZFJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbn1cclxuZXhwb3J0cy5kb20gPSB7XHJcbiAgICBhcHBlbmQ6IGZ1bmN0aW9uIChwYXJlbnROb2RlLCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgICAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMgPT09IHZvaWQgMCkgeyBwcm9qZWN0aW9uT3B0aW9ucyA9IHt9OyB9XHJcbiAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKTtcclxuICAgICAgICB2YXIgZmluYWxQcm9qZWN0b3JPcHRpb25zID0gZ2V0UHJvamVjdGlvbk9wdGlvbnMocHJvamVjdGlvbk9wdGlvbnMsIGluc3RhbmNlKTtcclxuICAgICAgICB2YXIgcHJvamVjdG9yU3RhdGUgPSB7XHJcbiAgICAgICAgICAgIGFmdGVyUmVuZGVyQ2FsbGJhY2tzOiBbXSxcclxuICAgICAgICAgICAgZGVmZXJyZWRSZW5kZXJDYWxsYmFja3M6IFtdLFxyXG4gICAgICAgICAgICBub2RlTWFwOiBuZXcgV2Vha01hcF8xLmRlZmF1bHQoKSxcclxuICAgICAgICAgICAgcmVuZGVyU2NoZWR1bGVkOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIHJlbmRlclF1ZXVlOiBbXSxcclxuICAgICAgICAgICAgbWVyZ2U6IHByb2plY3Rpb25PcHRpb25zLm1lcmdlIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICBtZXJnZUVsZW1lbnQ6IHByb2plY3Rpb25PcHRpb25zLm1lcmdlRWxlbWVudFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcHJvamVjdG9yU3RhdGVNYXAuc2V0KGluc3RhbmNlLCBwcm9qZWN0b3JTdGF0ZSk7XHJcbiAgICAgICAgZmluYWxQcm9qZWN0b3JPcHRpb25zLnJvb3ROb2RlID0gcGFyZW50Tm9kZTtcclxuICAgICAgICB2YXIgcGFyZW50Vk5vZGUgPSB0b1BhcmVudFZOb2RlKGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZSk7XHJcbiAgICAgICAgdmFyIG5vZGUgPSB0b0ludGVybmFsV05vZGUoaW5zdGFuY2UsIGluc3RhbmNlRGF0YSk7XHJcbiAgICAgICAgaW5zdGFuY2VNYXAuc2V0KGluc3RhbmNlLCB7IGRub2RlOiBub2RlLCBwYXJlbnRWTm9kZTogcGFyZW50Vk5vZGUgfSk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLmludmFsaWRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YS5kaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZURhdGEucmVuZGVyaW5nID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdG9yU3RhdGUucmVuZGVyUXVldWUucHVzaCh7IGluc3RhbmNlOiBpbnN0YW5jZSwgZGVwdGg6IGZpbmFsUHJvamVjdG9yT3B0aW9ucy5kZXB0aCB9KTtcclxuICAgICAgICAgICAgICAgIHNjaGVkdWxlUmVuZGVyKGZpbmFsUHJvamVjdG9yT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHVwZGF0ZURvbShub2RlLCBub2RlLCBmaW5hbFByb2plY3Rvck9wdGlvbnMsIHBhcmVudFZOb2RlLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgcHJvamVjdG9yU3RhdGUuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YS5vbkF0dGFjaCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJ1bkRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzKGZpbmFsUHJvamVjdG9yT3B0aW9ucyk7XHJcbiAgICAgICAgcnVuQWZ0ZXJSZW5kZXJDYWxsYmFja3MoZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBkb21Ob2RlOiBmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGVcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24gKGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFwcGVuZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgIH0sXHJcbiAgICBtZXJnZTogZnVuY3Rpb24gKGVsZW1lbnQsIGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucyA9PT0gdm9pZCAwKSB7IHByb2plY3Rpb25PcHRpb25zID0ge307IH1cclxuICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZSA9IHRydWU7XHJcbiAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMubWVyZ2VFbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICB2YXIgcHJvamVjdGlvbiA9IHRoaXMuYXBwZW5kKGVsZW1lbnQucGFyZW50Tm9kZSwgaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB2YXIgcHJvamVjdG9yU3RhdGUgPSBwcm9qZWN0b3JTdGF0ZU1hcC5nZXQoaW5zdGFuY2UpO1xyXG4gICAgICAgIHByb2plY3RvclN0YXRlLm1lcmdlID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHByb2plY3Rpb247XHJcbiAgICB9XHJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvdmRvbS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvdmRvbS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIFdpZGdldEJhc2VfMSA9IHJlcXVpcmUoXCJAZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlXCIpO1xyXG52YXIgVGhlbWVkXzEgPSByZXF1aXJlKFwiQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZFwiKTtcclxudmFyIGRfMSA9IHJlcXVpcmUoXCJAZG9qby93aWRnZXQtY29yZS9kXCIpO1xyXG52YXIgY3NzID0gcmVxdWlyZShcIi4uL3RoZW1lL2J1dHRvbi5tLmNzc1wiKTtcclxudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuLi9jb21tb24vdXRpbFwiKTtcclxudmFyIGN1c3RvbUVsZW1lbnRfMSA9IHJlcXVpcmUoXCJAZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnRcIik7XHJcbnZhciBpbmRleF8xID0gcmVxdWlyZShcIi4uL2ljb24vaW5kZXhcIik7XHJcbnZhciByZWdpc3RlckN1c3RvbUVsZW1lbnRfMSA9IHJlcXVpcmUoXCJAZG9qby93aWRnZXQtY29yZS9yZWdpc3RlckN1c3RvbUVsZW1lbnRcIik7XHJcbmV4cG9ydHMuVGhlbWVkQmFzZSA9IFRoZW1lZF8xLlRoZW1lZE1peGluKFdpZGdldEJhc2VfMS5XaWRnZXRCYXNlKTtcclxudmFyIEJ1dHRvbkJhc2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhCdXR0b25CYXNlLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gQnV0dG9uQmFzZSgpIHtcclxuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICB9XHJcbiAgICBCdXR0b25CYXNlLnByb3RvdHlwZS5fb25CbHVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLm9uQmx1ciAmJiB0aGlzLnByb3BlcnRpZXMub25CbHVyKCk7XHJcbiAgICB9O1xyXG4gICAgQnV0dG9uQmFzZS5wcm90b3R5cGUuX29uQ2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMub25DbGljayAmJiB0aGlzLnByb3BlcnRpZXMub25DbGljaygpO1xyXG4gICAgfTtcclxuICAgIEJ1dHRvbkJhc2UucHJvdG90eXBlLl9vbkZvY3VzID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLm9uRm9jdXMgJiYgdGhpcy5wcm9wZXJ0aWVzLm9uRm9jdXMoKTtcclxuICAgIH07XHJcbiAgICBCdXR0b25CYXNlLnByb3RvdHlwZS5fb25LZXlEb3duID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLm9uS2V5RG93biAmJiB0aGlzLnByb3BlcnRpZXMub25LZXlEb3duKGV2ZW50LndoaWNoLCBmdW5jdGlvbiAoKSB7IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IH0pO1xyXG4gICAgfTtcclxuICAgIEJ1dHRvbkJhc2UucHJvdG90eXBlLl9vbktleVByZXNzID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLm9uS2V5UHJlc3MgJiYgdGhpcy5wcm9wZXJ0aWVzLm9uS2V5UHJlc3MoZXZlbnQud2hpY2gsIGZ1bmN0aW9uICgpIHsgZXZlbnQucHJldmVudERlZmF1bHQoKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgQnV0dG9uQmFzZS5wcm90b3R5cGUuX29uS2V5VXAgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMub25LZXlVcCAmJiB0aGlzLnByb3BlcnRpZXMub25LZXlVcChldmVudC53aGljaCwgZnVuY3Rpb24gKCkgeyBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyB9KTtcclxuICAgIH07XHJcbiAgICBCdXR0b25CYXNlLnByb3RvdHlwZS5fb25Nb3VzZURvd24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMub25Nb3VzZURvd24gJiYgdGhpcy5wcm9wZXJ0aWVzLm9uTW91c2VEb3duKCk7XHJcbiAgICB9O1xyXG4gICAgQnV0dG9uQmFzZS5wcm90b3R5cGUuX29uTW91c2VVcCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcy5vbk1vdXNlVXAgJiYgdGhpcy5wcm9wZXJ0aWVzLm9uTW91c2VVcCgpO1xyXG4gICAgfTtcclxuICAgIEJ1dHRvbkJhc2UucHJvdG90eXBlLl9vblRvdWNoU3RhcnQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMub25Ub3VjaFN0YXJ0ICYmIHRoaXMucHJvcGVydGllcy5vblRvdWNoU3RhcnQoKTtcclxuICAgIH07XHJcbiAgICBCdXR0b25CYXNlLnByb3RvdHlwZS5fb25Ub3VjaEVuZCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcy5vblRvdWNoRW5kICYmIHRoaXMucHJvcGVydGllcy5vblRvdWNoRW5kKCk7XHJcbiAgICB9O1xyXG4gICAgQnV0dG9uQmFzZS5wcm90b3R5cGUuX29uVG91Y2hDYW5jZWwgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMub25Ub3VjaENhbmNlbCAmJiB0aGlzLnByb3BlcnRpZXMub25Ub3VjaENhbmNlbCgpO1xyXG4gICAgfTtcclxuICAgIEJ1dHRvbkJhc2UucHJvdG90eXBlLmdldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW47XHJcbiAgICB9O1xyXG4gICAgQnV0dG9uQmFzZS5wcm90b3R5cGUuZ2V0TW9kaWZpZXJDbGFzc2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfYSA9IHRoaXMucHJvcGVydGllcywgZGlzYWJsZWQgPSBfYS5kaXNhYmxlZCwgX2IgPSBfYS5wb3B1cCwgcG9wdXAgPSBfYiA9PT0gdm9pZCAwID8gZmFsc2UgOiBfYiwgcHJlc3NlZCA9IF9hLnByZXNzZWQ7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgZGlzYWJsZWQgPyBjc3MuZGlzYWJsZWQgOiBudWxsLFxyXG4gICAgICAgICAgICBwb3B1cCA/IGNzcy5wb3B1cCA6IG51bGwsXHJcbiAgICAgICAgICAgIHByZXNzZWQgPyBjc3MucHJlc3NlZCA6IG51bGxcclxuICAgICAgICBdO1xyXG4gICAgfTtcclxuICAgIEJ1dHRvbkJhc2UucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX2EgPSB0aGlzLnByb3BlcnRpZXMsIF9iID0gX2EuYXJpYSwgYXJpYSA9IF9iID09PSB2b2lkIDAgPyB7fSA6IF9iLCBkaXNhYmxlZCA9IF9hLmRpc2FibGVkLCBpZCA9IF9hLmlkLCBfYyA9IF9hLnBvcHVwLCBwb3B1cCA9IF9jID09PSB2b2lkIDAgPyBmYWxzZSA6IF9jLCBuYW1lID0gX2EubmFtZSwgcHJlc3NlZCA9IF9hLnByZXNzZWQsIHR5cGUgPSBfYS50eXBlLCB2YWx1ZSA9IF9hLnZhbHVlO1xyXG4gICAgICAgIGlmIChwb3B1cCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBwb3B1cCA9IHsgZXhwYW5kZWQ6IGZhbHNlLCBpZDogJycgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRfMS52KCdidXR0b24nLCB0c2xpYl8xLl9fYXNzaWduKHsgY2xhc3NlczogdGhpcy50aGVtZSh0c2xpYl8xLl9fc3ByZWFkKFtjc3Mucm9vdF0sIHRoaXMuZ2V0TW9kaWZpZXJDbGFzc2VzKCkpKSwgZGlzYWJsZWQ6IGRpc2FibGVkLFxyXG4gICAgICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSwgb25ibHVyOiB0aGlzLl9vbkJsdXIsIG9uY2xpY2s6IHRoaXMuX29uQ2xpY2ssIG9uZm9jdXM6IHRoaXMuX29uRm9jdXMsIG9ua2V5ZG93bjogdGhpcy5fb25LZXlEb3duLCBvbmtleXByZXNzOiB0aGlzLl9vbktleVByZXNzLCBvbmtleXVwOiB0aGlzLl9vbktleVVwLCBvbm1vdXNlZG93bjogdGhpcy5fb25Nb3VzZURvd24sIG9ubW91c2V1cDogdGhpcy5fb25Nb3VzZVVwLCBvbnRvdWNoc3RhcnQ6IHRoaXMuX29uVG91Y2hTdGFydCwgb250b3VjaGVuZDogdGhpcy5fb25Ub3VjaEVuZCwgb250b3VjaGNhbmNlbDogdGhpcy5fb25Ub3VjaENhbmNlbCB9LCB1dGlsXzEuZm9ybWF0QXJpYVByb3BlcnRpZXMoYXJpYSksIHsgJ2FyaWEtaGFzcG9wdXAnOiBwb3B1cCA/ICd0cnVlJyA6IG51bGwsICdhcmlhLWNvbnRyb2xzJzogcG9wdXAgPyBwb3B1cC5pZCA6IG51bGwsICdhcmlhLWV4cGFuZGVkJzogcG9wdXAgPyBwb3B1cC5leHBhbmRlZCArICcnIDogbnVsbCwgJ2FyaWEtcHJlc3NlZCc6IHR5cGVvZiBwcmVzc2VkID09PSAnYm9vbGVhbicgPyBwcmVzc2VkLnRvU3RyaW5nKCkgOiBudWxsIH0pLCB0c2xpYl8xLl9fc3ByZWFkKHRoaXMuZ2V0Q29udGVudCgpLCBbXHJcbiAgICAgICAgICAgIHBvcHVwID8gZF8xLnYoJ3NwYW4nLCB7IGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLmFkZG9uKSB9LCBbXHJcbiAgICAgICAgICAgICAgICBkXzEudyhpbmRleF8xLmRlZmF1bHQsIHsgdHlwZTogJ2Rvd25JY29uJyB9KVxyXG4gICAgICAgICAgICBdKSA6IG51bGxcclxuICAgICAgICBdKSk7XHJcbiAgICB9O1xyXG4gICAgQnV0dG9uQmFzZSA9IHRzbGliXzEuX19kZWNvcmF0ZShbXHJcbiAgICAgICAgVGhlbWVkXzEudGhlbWUoY3NzKSxcclxuICAgICAgICBjdXN0b21FbGVtZW50XzEuY3VzdG9tRWxlbWVudCh7XHJcbiAgICAgICAgICAgIHRhZzogJ2Rvam8tYnV0dG9uJyxcclxuICAgICAgICAgICAgY2hpbGRUeXBlOiByZWdpc3RlckN1c3RvbUVsZW1lbnRfMS5DdXN0b21FbGVtZW50Q2hpbGRUeXBlLlRFWFQsXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IFsnZGlzYWJsZWQnLCAncHJlc3NlZCcsICdwb3B1cCcsICd0aGVtZScsICdhcmlhJywgJ2V4dHJhQ2xhc3NlcyddLFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBbJ2lkJywgJ25hbWUnLCAndmFsdWUnXSxcclxuICAgICAgICAgICAgZXZlbnRzOiBbXHJcbiAgICAgICAgICAgICAgICAnb25CbHVyJyxcclxuICAgICAgICAgICAgICAgICdvbkNoYW5nZScsXHJcbiAgICAgICAgICAgICAgICAnb25DbGljaycsXHJcbiAgICAgICAgICAgICAgICAnb25Gb2N1cycsXHJcbiAgICAgICAgICAgICAgICAnb25JbnB1dCcsXHJcbiAgICAgICAgICAgICAgICAnb25LZXlEb3duJyxcclxuICAgICAgICAgICAgICAgICdvbktleVByZXNzJyxcclxuICAgICAgICAgICAgICAgICdvbktleVVwJyxcclxuICAgICAgICAgICAgICAgICdvbk1vdXNlRG93bicsXHJcbiAgICAgICAgICAgICAgICAnb25Nb3VzZVVwJyxcclxuICAgICAgICAgICAgICAgICdvblRvdWNoQ2FuY2VsJyxcclxuICAgICAgICAgICAgICAgICdvblRvdWNoRW5kJyxcclxuICAgICAgICAgICAgICAgICdvblRvdWNoU3RhcnQnXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KVxyXG4gICAgXSwgQnV0dG9uQmFzZSk7XHJcbiAgICByZXR1cm4gQnV0dG9uQmFzZTtcclxufShleHBvcnRzLlRoZW1lZEJhc2UpKTtcclxuZXhwb3J0cy5CdXR0b25CYXNlID0gQnV0dG9uQmFzZTtcclxudmFyIEJ1dHRvbiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKEJ1dHRvbiwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEJ1dHRvbigpIHtcclxuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gQnV0dG9uO1xyXG59KEJ1dHRvbkJhc2UpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gQnV0dG9uO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvYnV0dG9uL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL2J1dHRvbi9pbmRleC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvY29tbW9uL3N0eWxlcy9iYXNlLm0uY3NzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL2NvbW1vbi9zdHlsZXMvYmFzZS5tLmNzc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJyZXF1aXJlKCdjOi9Vc2Vycy9kam9uZXMuU0FDQlVLL0RvY3VtZW50cy9kZXYvZG9qby10dXRzLzEwMTBfY29udGFpbmVyc19hbmRfaW5qZWN0aW5nX3N0YXRlL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL2NvbW1vbi9zdHlsZXMvYmFzZS5tLmNzcycpO1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdGRlZmluZShbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gKGZhY3RvcnkoKSk7IH0pO1xufSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbn1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4ge1widmlzdWFsbHlIaWRkZW5cIjpcIl8xQWVXZUFwclwiLFwiZm9jdXNhYmxlXCI6XCJfMV9xQU5xWGlcIixcImhpZGRlblwiOlwiXzNRZGRVaUJVXCIsXCIgX2tleVwiOlwiQGRvam8vd2lkZ2V0cy9iYXNlXCJ9O1xufSkpOztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL2NvbW1vbi9zdHlsZXMvYmFzZS5tLmNzcy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy9jb21tb24vc3R5bGVzL2Jhc2UubS5jc3MuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZnVuY3Rpb24gZm9ybWF0QXJpYVByb3BlcnRpZXMoYXJpYSkge1xyXG4gICAgdmFyIGZvcm1hdHRlZEFyaWEgPSBPYmplY3Qua2V5cyhhcmlhKS5yZWR1Y2UoZnVuY3Rpb24gKGEsIGtleSkge1xyXG4gICAgICAgIGFbXCJhcmlhLVwiICsga2V5LnRvTG93ZXJDYXNlKCldID0gYXJpYVtrZXldO1xyXG4gICAgICAgIHJldHVybiBhO1xyXG4gICAgfSwge30pO1xyXG4gICAgcmV0dXJuIGZvcm1hdHRlZEFyaWE7XHJcbn1cclxuZXhwb3J0cy5mb3JtYXRBcmlhUHJvcGVydGllcyA9IGZvcm1hdEFyaWFQcm9wZXJ0aWVzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvY29tbW9uL3V0aWwuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvY29tbW9uL3V0aWwuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBXaWRnZXRCYXNlXzEgPSByZXF1aXJlKFwiQGRvam8vd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZVwiKTtcclxudmFyIFRoZW1lZF8xID0gcmVxdWlyZShcIkBkb2pvL3dpZGdldC1jb3JlL21peGlucy9UaGVtZWRcIik7XHJcbnZhciBkXzEgPSByZXF1aXJlKFwiQGRvam8vd2lkZ2V0LWNvcmUvZFwiKTtcclxudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuLi9jb21tb24vdXRpbFwiKTtcclxudmFyIGNzcyA9IHJlcXVpcmUoXCIuLi90aGVtZS9pY29uLm0uY3NzXCIpO1xyXG52YXIgYmFzZUNzcyA9IHJlcXVpcmUoXCIuLi9jb21tb24vc3R5bGVzL2Jhc2UubS5jc3NcIik7XHJcbnZhciBjdXN0b21FbGVtZW50XzEgPSByZXF1aXJlKFwiQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9jdXN0b21FbGVtZW50XCIpO1xyXG5leHBvcnRzLlRoZW1lZEJhc2UgPSBUaGVtZWRfMS5UaGVtZWRNaXhpbihXaWRnZXRCYXNlXzEuV2lkZ2V0QmFzZSk7XHJcbnZhciBJY29uQmFzZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKEljb25CYXNlLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gSWNvbkJhc2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgfVxyXG4gICAgSWNvbkJhc2UucHJvdG90eXBlLnJlbmRlckFsdFRleHQgPSBmdW5jdGlvbiAoYWx0VGV4dCkge1xyXG4gICAgICAgIHJldHVybiBkXzEudignc3BhbicsIHsgY2xhc3NlczogW2Jhc2VDc3MudmlzdWFsbHlIaWRkZW5dIH0sIFthbHRUZXh0XSk7XHJcbiAgICB9O1xyXG4gICAgSWNvbkJhc2UucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX2EgPSB0aGlzLnByb3BlcnRpZXMsIF9iID0gX2EuYXJpYSwgYXJpYSA9IF9iID09PSB2b2lkIDAgPyB7XHJcbiAgICAgICAgICAgIGhpZGRlbjogJ3RydWUnXHJcbiAgICAgICAgfSA6IF9iLCB0eXBlID0gX2EudHlwZSwgYWx0VGV4dCA9IF9hLmFsdFRleHQ7XHJcbiAgICAgICAgcmV0dXJuIGRfMS52KCdzcGFuJywgeyBjbGFzc2VzOiB0aGlzLnRoZW1lKGNzcy5yb290KSB9LCBbXHJcbiAgICAgICAgICAgIGRfMS52KCdpJywgdHNsaWJfMS5fX2Fzc2lnbih7fSwgdXRpbF8xLmZvcm1hdEFyaWFQcm9wZXJ0aWVzKGFyaWEpLCB7IGNsYXNzZXM6IHRoaXMudGhlbWUoW2Nzcy5pY29uLCBjc3NbdHlwZV1dKSB9KSksXHJcbiAgICAgICAgICAgIGFsdFRleHQgPyB0aGlzLnJlbmRlckFsdFRleHQoYWx0VGV4dCkgOiBudWxsXHJcbiAgICAgICAgXSk7XHJcbiAgICB9O1xyXG4gICAgSWNvbkJhc2UgPSB0c2xpYl8xLl9fZGVjb3JhdGUoW1xyXG4gICAgICAgIFRoZW1lZF8xLnRoZW1lKGNzcyksXHJcbiAgICAgICAgY3VzdG9tRWxlbWVudF8xLmN1c3RvbUVsZW1lbnQoe1xyXG4gICAgICAgICAgICB0YWc6ICdkb2pvLWljb24nLFxyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiBbXHJcbiAgICAgICAgICAgICAgICAndGhlbWUnLFxyXG4gICAgICAgICAgICAgICAgJ2FyaWEnLFxyXG4gICAgICAgICAgICAgICAgJ2V4dHJhQ2xhc3NlcydcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgYXR0cmlidXRlczogWyd0eXBlJywgJ2FsdFRleHQnXVxyXG4gICAgICAgIH0pXHJcbiAgICBdLCBJY29uQmFzZSk7XHJcbiAgICByZXR1cm4gSWNvbkJhc2U7XHJcbn0oZXhwb3J0cy5UaGVtZWRCYXNlKSk7XHJcbmV4cG9ydHMuSWNvbkJhc2UgPSBJY29uQmFzZTtcclxudmFyIEljb24gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhJY29uLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gSWNvbigpIHtcclxuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gSWNvbjtcclxufShJY29uQmFzZSkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBJY29uO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvaWNvbi9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy9pY29uL2luZGV4LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgV2lkZ2V0QmFzZV8xID0gcmVxdWlyZShcIkBkb2pvL3dpZGdldC1jb3JlL1dpZGdldEJhc2VcIik7XHJcbnZhciBUaGVtZWRfMSA9IHJlcXVpcmUoXCJAZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkXCIpO1xyXG52YXIgZF8xID0gcmVxdWlyZShcIkBkb2pvL3dpZGdldC1jb3JlL2RcIik7XHJcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi4vY29tbW9uL3V0aWxcIik7XHJcbnZhciBjc3MgPSByZXF1aXJlKFwiLi4vdGhlbWUvbGFiZWwubS5jc3NcIik7XHJcbnZhciBiYXNlQ3NzID0gcmVxdWlyZShcIi4uL2NvbW1vbi9zdHlsZXMvYmFzZS5tLmNzc1wiKTtcclxudmFyIGN1c3RvbUVsZW1lbnRfMSA9IHJlcXVpcmUoXCJAZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnRcIik7XHJcbmV4cG9ydHMuVGhlbWVkQmFzZSA9IFRoZW1lZF8xLlRoZW1lZE1peGluKFdpZGdldEJhc2VfMS5XaWRnZXRCYXNlKTtcclxudmFyIExhYmVsQmFzZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKExhYmVsQmFzZSwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIExhYmVsQmFzZSgpIHtcclxuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICB9XHJcbiAgICBMYWJlbEJhc2UucHJvdG90eXBlLmdldFJvb3RDbGFzc2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfYSA9IHRoaXMucHJvcGVydGllcywgZGlzYWJsZWQgPSBfYS5kaXNhYmxlZCwgZm9jdXNlZCA9IF9hLmZvY3VzZWQsIGludmFsaWQgPSBfYS5pbnZhbGlkLCByZWFkT25seSA9IF9hLnJlYWRPbmx5LCByZXF1aXJlZCA9IF9hLnJlcXVpcmVkLCBzZWNvbmRhcnkgPSBfYS5zZWNvbmRhcnk7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgY3NzLnJvb3QsXHJcbiAgICAgICAgICAgIGRpc2FibGVkID8gY3NzLmRpc2FibGVkIDogbnVsbCxcclxuICAgICAgICAgICAgZm9jdXNlZCA/IGNzcy5mb2N1c2VkIDogbnVsbCxcclxuICAgICAgICAgICAgaW52YWxpZCA9PT0gdHJ1ZSA/IGNzcy5pbnZhbGlkIDogbnVsbCxcclxuICAgICAgICAgICAgaW52YWxpZCA9PT0gZmFsc2UgPyBjc3MudmFsaWQgOiBudWxsLFxyXG4gICAgICAgICAgICByZWFkT25seSA/IGNzcy5yZWFkb25seSA6IG51bGwsXHJcbiAgICAgICAgICAgIHJlcXVpcmVkID8gY3NzLnJlcXVpcmVkIDogbnVsbCxcclxuICAgICAgICAgICAgc2Vjb25kYXJ5ID8gY3NzLnNlY29uZGFyeSA6IG51bGxcclxuICAgICAgICBdO1xyXG4gICAgfTtcclxuICAgIExhYmVsQmFzZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfYSA9IHRoaXMucHJvcGVydGllcywgX2IgPSBfYS5hcmlhLCBhcmlhID0gX2IgPT09IHZvaWQgMCA/IHt9IDogX2IsIGZvcklkID0gX2EuZm9ySWQsIGhpZGRlbiA9IF9hLmhpZGRlbjtcclxuICAgICAgICByZXR1cm4gZF8xLnYoJ2xhYmVsJywgdHNsaWJfMS5fX2Fzc2lnbih7fSwgdXRpbF8xLmZvcm1hdEFyaWFQcm9wZXJ0aWVzKGFyaWEpLCB7IGNsYXNzZXM6IHRzbGliXzEuX19zcHJlYWQodGhpcy50aGVtZSh0aGlzLmdldFJvb3RDbGFzc2VzKCkpLCBbXHJcbiAgICAgICAgICAgICAgICBoaWRkZW4gPyBiYXNlQ3NzLnZpc3VhbGx5SGlkZGVuIDogbnVsbFxyXG4gICAgICAgICAgICBdKSwgZm9yOiBmb3JJZCB9KSwgdGhpcy5jaGlsZHJlbik7XHJcbiAgICB9O1xyXG4gICAgTGFiZWxCYXNlID0gdHNsaWJfMS5fX2RlY29yYXRlKFtcclxuICAgICAgICBUaGVtZWRfMS50aGVtZShjc3MpLFxyXG4gICAgICAgIGN1c3RvbUVsZW1lbnRfMS5jdXN0b21FbGVtZW50KHtcclxuICAgICAgICAgICAgdGFnOiAnZG9qby1sYWJlbCcsXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IFsndGhlbWUnLCAnYXJpYScsICdleHRyYUNsYXNzZXMnLCAnZGlzYWJsZWQnLCAnZm9jdXNlZCcsICdyZWFkT25seScsICdyZXF1aXJlZCcsICdpbnZhbGlkJywgJ2hpZGRlbicsICdzZWNvbmRhcnknXSxcclxuICAgICAgICAgICAgYXR0cmlidXRlczogW10sXHJcbiAgICAgICAgICAgIGV2ZW50czogW11cclxuICAgICAgICB9KVxyXG4gICAgXSwgTGFiZWxCYXNlKTtcclxuICAgIHJldHVybiBMYWJlbEJhc2U7XHJcbn0oZXhwb3J0cy5UaGVtZWRCYXNlKSk7XHJcbmV4cG9ydHMuTGFiZWxCYXNlID0gTGFiZWxCYXNlO1xyXG52YXIgTGFiZWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhMYWJlbCwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIExhYmVsKCkge1xyXG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgIH1cclxuICAgIHJldHVybiBMYWJlbDtcclxufShMYWJlbEJhc2UpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gTGFiZWw7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy9sYWJlbC9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy9sYWJlbC9pbmRleC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIFdpZGdldEJhc2VfMSA9IHJlcXVpcmUoXCJAZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlXCIpO1xyXG52YXIgVGhlbWVkXzEgPSByZXF1aXJlKFwiQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZFwiKTtcclxudmFyIGRfMSA9IHJlcXVpcmUoXCJAZG9qby93aWRnZXQtY29yZS9kXCIpO1xyXG52YXIgRm9jdXNfMSA9IHJlcXVpcmUoXCJAZG9qby93aWRnZXQtY29yZS9tZXRhL0ZvY3VzXCIpO1xyXG52YXIgaW5kZXhfMSA9IHJlcXVpcmUoXCIuLi9sYWJlbC9pbmRleFwiKTtcclxudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuLi9jb21tb24vdXRpbFwiKTtcclxudmFyIHV1aWRfMSA9IHJlcXVpcmUoXCJAZG9qby9jb3JlL3V1aWRcIik7XHJcbnZhciBjc3MgPSByZXF1aXJlKFwiLi4vdGhlbWUvdGV4dC1pbnB1dC5tLmNzc1wiKTtcclxudmFyIGN1c3RvbUVsZW1lbnRfMSA9IHJlcXVpcmUoXCJAZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnRcIik7XHJcbmV4cG9ydHMuVGhlbWVkQmFzZSA9IFRoZW1lZF8xLlRoZW1lZE1peGluKFdpZGdldEJhc2VfMS5XaWRnZXRCYXNlKTtcclxudmFyIFRleHRJbnB1dEJhc2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhUZXh0SW5wdXRCYXNlLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gVGV4dElucHV0QmFzZSgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLl91dWlkID0gdXVpZF8xLmRlZmF1bHQoKTtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBUZXh0SW5wdXRCYXNlLnByb3RvdHlwZS5fb25CbHVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLm9uQmx1ciAmJiB0aGlzLnByb3BlcnRpZXMub25CbHVyKGV2ZW50LnRhcmdldC52YWx1ZSk7XHJcbiAgICB9O1xyXG4gICAgVGV4dElucHV0QmFzZS5wcm90b3R5cGUuX29uQ2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLm9uQ2hhbmdlICYmIHRoaXMucHJvcGVydGllcy5vbkNoYW5nZShldmVudC50YXJnZXQudmFsdWUpO1xyXG4gICAgfTtcclxuICAgIFRleHRJbnB1dEJhc2UucHJvdG90eXBlLl9vbkNsaWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLm9uQ2xpY2sgJiYgdGhpcy5wcm9wZXJ0aWVzLm9uQ2xpY2soZXZlbnQudGFyZ2V0LnZhbHVlKTtcclxuICAgIH07XHJcbiAgICBUZXh0SW5wdXRCYXNlLnByb3RvdHlwZS5fb25Gb2N1cyA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcy5vbkZvY3VzICYmIHRoaXMucHJvcGVydGllcy5vbkZvY3VzKGV2ZW50LnRhcmdldC52YWx1ZSk7XHJcbiAgICB9O1xyXG4gICAgVGV4dElucHV0QmFzZS5wcm90b3R5cGUuX29uSW5wdXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMub25JbnB1dCAmJiB0aGlzLnByb3BlcnRpZXMub25JbnB1dChldmVudC50YXJnZXQudmFsdWUpO1xyXG4gICAgfTtcclxuICAgIFRleHRJbnB1dEJhc2UucHJvdG90eXBlLl9vbktleURvd24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMub25LZXlEb3duICYmIHRoaXMucHJvcGVydGllcy5vbktleURvd24oZXZlbnQud2hpY2gsIGZ1bmN0aW9uICgpIHsgZXZlbnQucHJldmVudERlZmF1bHQoKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgVGV4dElucHV0QmFzZS5wcm90b3R5cGUuX29uS2V5UHJlc3MgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMub25LZXlQcmVzcyAmJiB0aGlzLnByb3BlcnRpZXMub25LZXlQcmVzcyhldmVudC53aGljaCwgZnVuY3Rpb24gKCkgeyBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyB9KTtcclxuICAgIH07XHJcbiAgICBUZXh0SW5wdXRCYXNlLnByb3RvdHlwZS5fb25LZXlVcCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcy5vbktleVVwICYmIHRoaXMucHJvcGVydGllcy5vbktleVVwKGV2ZW50LndoaWNoLCBmdW5jdGlvbiAoKSB7IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IH0pO1xyXG4gICAgfTtcclxuICAgIFRleHRJbnB1dEJhc2UucHJvdG90eXBlLl9vbk1vdXNlRG93biA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcy5vbk1vdXNlRG93biAmJiB0aGlzLnByb3BlcnRpZXMub25Nb3VzZURvd24oKTtcclxuICAgIH07XHJcbiAgICBUZXh0SW5wdXRCYXNlLnByb3RvdHlwZS5fb25Nb3VzZVVwID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLm9uTW91c2VVcCAmJiB0aGlzLnByb3BlcnRpZXMub25Nb3VzZVVwKCk7XHJcbiAgICB9O1xyXG4gICAgVGV4dElucHV0QmFzZS5wcm90b3R5cGUuX29uVG91Y2hTdGFydCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcy5vblRvdWNoU3RhcnQgJiYgdGhpcy5wcm9wZXJ0aWVzLm9uVG91Y2hTdGFydCgpO1xyXG4gICAgfTtcclxuICAgIFRleHRJbnB1dEJhc2UucHJvdG90eXBlLl9vblRvdWNoRW5kID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLm9uVG91Y2hFbmQgJiYgdGhpcy5wcm9wZXJ0aWVzLm9uVG91Y2hFbmQoKTtcclxuICAgIH07XHJcbiAgICBUZXh0SW5wdXRCYXNlLnByb3RvdHlwZS5fb25Ub3VjaENhbmNlbCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcy5vblRvdWNoQ2FuY2VsICYmIHRoaXMucHJvcGVydGllcy5vblRvdWNoQ2FuY2VsKCk7XHJcbiAgICB9O1xyXG4gICAgVGV4dElucHV0QmFzZS5wcm90b3R5cGUuZ2V0Um9vdENsYXNzZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF9hID0gdGhpcy5wcm9wZXJ0aWVzLCBkaXNhYmxlZCA9IF9hLmRpc2FibGVkLCBpbnZhbGlkID0gX2EuaW52YWxpZCwgcmVhZE9ubHkgPSBfYS5yZWFkT25seSwgcmVxdWlyZWQgPSBfYS5yZXF1aXJlZDtcclxuICAgICAgICB2YXIgZm9jdXMgPSB0aGlzLm1ldGEoRm9jdXNfMS5kZWZhdWx0KS5nZXQoJ3Jvb3QnKTtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBjc3Mucm9vdCxcclxuICAgICAgICAgICAgZGlzYWJsZWQgPyBjc3MuZGlzYWJsZWQgOiBudWxsLFxyXG4gICAgICAgICAgICBmb2N1cy5jb250YWluc0ZvY3VzID8gY3NzLmZvY3VzZWQgOiBudWxsLFxyXG4gICAgICAgICAgICBpbnZhbGlkID09PSB0cnVlID8gY3NzLmludmFsaWQgOiBudWxsLFxyXG4gICAgICAgICAgICBpbnZhbGlkID09PSBmYWxzZSA/IGNzcy52YWxpZCA6IG51bGwsXHJcbiAgICAgICAgICAgIHJlYWRPbmx5ID8gY3NzLnJlYWRvbmx5IDogbnVsbCxcclxuICAgICAgICAgICAgcmVxdWlyZWQgPyBjc3MucmVxdWlyZWQgOiBudWxsXHJcbiAgICAgICAgXTtcclxuICAgIH07XHJcbiAgICBUZXh0SW5wdXRCYXNlLnByb3RvdHlwZS5yZW5kZXJJbnB1dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX2EgPSB0aGlzLnByb3BlcnRpZXMsIF9iID0gX2EuYXJpYSwgYXJpYSA9IF9iID09PSB2b2lkIDAgPyB7fSA6IF9iLCBkaXNhYmxlZCA9IF9hLmRpc2FibGVkLCBfYyA9IF9hLmlkLCBpZCA9IF9jID09PSB2b2lkIDAgPyB0aGlzLl91dWlkIDogX2MsIGludmFsaWQgPSBfYS5pbnZhbGlkLCBtYXhMZW5ndGggPSBfYS5tYXhMZW5ndGgsIG1pbkxlbmd0aCA9IF9hLm1pbkxlbmd0aCwgbmFtZSA9IF9hLm5hbWUsIHBsYWNlaG9sZGVyID0gX2EucGxhY2Vob2xkZXIsIHJlYWRPbmx5ID0gX2EucmVhZE9ubHksIHJlcXVpcmVkID0gX2EucmVxdWlyZWQsIF9kID0gX2EudHlwZSwgdHlwZSA9IF9kID09PSB2b2lkIDAgPyAndGV4dCcgOiBfZCwgdmFsdWUgPSBfYS52YWx1ZSwgc2hvdWxkRm9jdXMgPSBfYS5zaG91bGRGb2N1cztcclxuICAgICAgICBpZiAoc2hvdWxkRm9jdXMpIHtcclxuICAgICAgICAgICAgdGhpcy5tZXRhKEZvY3VzXzEuZGVmYXVsdCkuc2V0KCdpbnB1dCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZF8xLnYoJ2lucHV0JywgdHNsaWJfMS5fX2Fzc2lnbih7fSwgdXRpbF8xLmZvcm1hdEFyaWFQcm9wZXJ0aWVzKGFyaWEpLCB7ICdhcmlhLWludmFsaWQnOiBpbnZhbGlkID8gJ3RydWUnIDogbnVsbCwgY2xhc3NlczogdGhpcy50aGVtZShjc3MuaW5wdXQpLCBkaXNhYmxlZDogZGlzYWJsZWQsXHJcbiAgICAgICAgICAgIGlkOiBpZCwga2V5OiAnaW5wdXQnLCBtYXhsZW5ndGg6IG1heExlbmd0aCA/IFwiXCIgKyBtYXhMZW5ndGggOiBudWxsLCBtaW5sZW5ndGg6IG1pbkxlbmd0aCA/IFwiXCIgKyBtaW5MZW5ndGggOiBudWxsLCBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogcGxhY2Vob2xkZXIsXHJcbiAgICAgICAgICAgIHJlYWRPbmx5OiByZWFkT25seSwgJ2FyaWEtcmVhZG9ubHknOiByZWFkT25seSA/ICd0cnVlJyA6IG51bGwsIHJlcXVpcmVkOiByZXF1aXJlZCxcclxuICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLCBvbmJsdXI6IHRoaXMuX29uQmx1ciwgb25jaGFuZ2U6IHRoaXMuX29uQ2hhbmdlLCBvbmNsaWNrOiB0aGlzLl9vbkNsaWNrLCBvbmZvY3VzOiB0aGlzLl9vbkZvY3VzLCBvbmlucHV0OiB0aGlzLl9vbklucHV0LCBvbmtleWRvd246IHRoaXMuX29uS2V5RG93biwgb25rZXlwcmVzczogdGhpcy5fb25LZXlQcmVzcywgb25rZXl1cDogdGhpcy5fb25LZXlVcCwgb25tb3VzZWRvd246IHRoaXMuX29uTW91c2VEb3duLCBvbm1vdXNldXA6IHRoaXMuX29uTW91c2VVcCwgb250b3VjaHN0YXJ0OiB0aGlzLl9vblRvdWNoU3RhcnQsIG9udG91Y2hlbmQ6IHRoaXMuX29uVG91Y2hFbmQsIG9udG91Y2hjYW5jZWw6IHRoaXMuX29uVG91Y2hDYW5jZWwgfSkpO1xyXG4gICAgfTtcclxuICAgIFRleHRJbnB1dEJhc2UucHJvdG90eXBlLnJlbmRlcklucHV0V3JhcHBlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gZF8xLnYoJ2RpdicsIHsgY2xhc3NlczogdGhpcy50aGVtZShjc3MuaW5wdXRXcmFwcGVyKSB9LCBbXHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVySW5wdXQoKVxyXG4gICAgICAgIF0pO1xyXG4gICAgfTtcclxuICAgIFRleHRJbnB1dEJhc2UucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX2EgPSB0aGlzLnByb3BlcnRpZXMsIGRpc2FibGVkID0gX2EuZGlzYWJsZWQsIF9iID0gX2EuaWQsIGlkID0gX2IgPT09IHZvaWQgMCA/IHRoaXMuX3V1aWQgOiBfYiwgaW52YWxpZCA9IF9hLmludmFsaWQsIGxhYmVsID0gX2EubGFiZWwsIF9jID0gX2EubGFiZWxBZnRlciwgbGFiZWxBZnRlciA9IF9jID09PSB2b2lkIDAgPyBmYWxzZSA6IF9jLCBfZCA9IF9hLmxhYmVsSGlkZGVuLCBsYWJlbEhpZGRlbiA9IF9kID09PSB2b2lkIDAgPyBmYWxzZSA6IF9kLCByZWFkT25seSA9IF9hLnJlYWRPbmx5LCByZXF1aXJlZCA9IF9hLnJlcXVpcmVkLCB0aGVtZSA9IF9hLnRoZW1lO1xyXG4gICAgICAgIHZhciBmb2N1cyA9IHRoaXMubWV0YShGb2N1c18xLmRlZmF1bHQpLmdldCgncm9vdCcpO1xyXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IFtcclxuICAgICAgICAgICAgbGFiZWwgPyBkXzEudyhpbmRleF8xLmRlZmF1bHQsIHtcclxuICAgICAgICAgICAgICAgIHRoZW1lOiB0aGVtZSxcclxuICAgICAgICAgICAgICAgIGRpc2FibGVkOiBkaXNhYmxlZCxcclxuICAgICAgICAgICAgICAgIGZvY3VzZWQ6IGZvY3VzLmNvbnRhaW5zRm9jdXMsXHJcbiAgICAgICAgICAgICAgICBpbnZhbGlkOiBpbnZhbGlkLFxyXG4gICAgICAgICAgICAgICAgcmVhZE9ubHk6IHJlYWRPbmx5LFxyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHJlcXVpcmVkLFxyXG4gICAgICAgICAgICAgICAgaGlkZGVuOiBsYWJlbEhpZGRlbixcclxuICAgICAgICAgICAgICAgIGZvcklkOiBpZFxyXG4gICAgICAgICAgICB9LCBbbGFiZWxdKSA6IG51bGwsXHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVySW5wdXRXcmFwcGVyKClcclxuICAgICAgICBdO1xyXG4gICAgICAgIHJldHVybiBkXzEudignZGl2Jywge1xyXG4gICAgICAgICAgICBrZXk6ICdyb290JyxcclxuICAgICAgICAgICAgY2xhc3NlczogdGhpcy50aGVtZSh0aGlzLmdldFJvb3RDbGFzc2VzKCkpXHJcbiAgICAgICAgfSwgbGFiZWxBZnRlciA/IGNoaWxkcmVuLnJldmVyc2UoKSA6IGNoaWxkcmVuKTtcclxuICAgIH07XHJcbiAgICBUZXh0SW5wdXRCYXNlID0gdHNsaWJfMS5fX2RlY29yYXRlKFtcclxuICAgICAgICBUaGVtZWRfMS50aGVtZShjc3MpLFxyXG4gICAgICAgIGN1c3RvbUVsZW1lbnRfMS5jdXN0b21FbGVtZW50KHtcclxuICAgICAgICAgICAgdGFnOiAnZG9qby10ZXh0LWlucHV0JyxcclxuICAgICAgICAgICAgcHJvcGVydGllczogW1xyXG4gICAgICAgICAgICAgICAgJ3RoZW1lJyxcclxuICAgICAgICAgICAgICAgICdhcmlhJyxcclxuICAgICAgICAgICAgICAgICdleHRyYUNsYXNzZXMnLFxyXG4gICAgICAgICAgICAgICAgJ2FyaWEnLFxyXG4gICAgICAgICAgICAgICAgJ3Nob3VsZEZvY3VzJyxcclxuICAgICAgICAgICAgICAgICdkaXNhYmxlZCcsXHJcbiAgICAgICAgICAgICAgICAnaW52YWxpZCcsXHJcbiAgICAgICAgICAgICAgICAncmVhZE9ubHknXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IFsnbGFiZWwnLCAncGxhY2Vob2xkZXInLCAnY29udHJvbHMnLCAndHlwZScsICdtaW5MZW5ndGgnLCAnbWF4TGVuZ3RoJywgJ3ZhbHVlJywgJ25hbWUnXSxcclxuICAgICAgICAgICAgZXZlbnRzOiBbXHJcbiAgICAgICAgICAgICAgICAnb25CbHVyJyxcclxuICAgICAgICAgICAgICAgICdvbkNoYW5nZScsXHJcbiAgICAgICAgICAgICAgICAnb25DbGljaycsXHJcbiAgICAgICAgICAgICAgICAnb25Gb2N1cycsXHJcbiAgICAgICAgICAgICAgICAnb25JbnB1dCcsXHJcbiAgICAgICAgICAgICAgICAnb25LZXlEb3duJyxcclxuICAgICAgICAgICAgICAgICdvbktleVByZXNzJyxcclxuICAgICAgICAgICAgICAgICdvbktleVVwJyxcclxuICAgICAgICAgICAgICAgICdvbk1vdXNlRG93bicsXHJcbiAgICAgICAgICAgICAgICAnb25Nb3VzZVVwJyxcclxuICAgICAgICAgICAgICAgICdvblRvdWNoQ2FuY2VsJyxcclxuICAgICAgICAgICAgICAgICdvblRvdWNoRW5kJyxcclxuICAgICAgICAgICAgICAgICdvblRvdWNoU3RhcnQnXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KSxcclxuICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbXSlcclxuICAgIF0sIFRleHRJbnB1dEJhc2UpO1xyXG4gICAgcmV0dXJuIFRleHRJbnB1dEJhc2U7XHJcbn0oZXhwb3J0cy5UaGVtZWRCYXNlKSk7XHJcbmV4cG9ydHMuVGV4dElucHV0QmFzZSA9IFRleHRJbnB1dEJhc2U7XHJcbnZhciBUZXh0SW5wdXQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhUZXh0SW5wdXQsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBUZXh0SW5wdXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFRleHRJbnB1dDtcclxufShUZXh0SW5wdXRCYXNlKSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFRleHRJbnB1dDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RleHQtaW5wdXQvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGV4dC1pbnB1dC9pbmRleC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGhlbWUvYnV0dG9uLm0uY3NzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL2J1dHRvbi5tLmNzc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJyZXF1aXJlKCdjOi9Vc2Vycy9kam9uZXMuU0FDQlVLL0RvY3VtZW50cy9kZXYvZG9qby10dXRzLzEwMTBfY29udGFpbmVyc19hbmRfaW5qZWN0aW5nX3N0YXRlL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL2J1dHRvbi5tLmNzcycpO1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdGRlZmluZShbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gKGZhY3RvcnkoKSk7IH0pO1xufSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbn1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4ge1wicm9vdFwiOlwiSzhUMUpKMHhcIixcInByZXNzZWRcIjpcIl8yTEc3Q3JfWVwiLFwicG9wdXBcIjpcIl8xZTIydGtGRFwiLFwiYWRkb25cIjpcIk5HRTFtZ0VkXCIsXCJkaXNhYmxlZFwiOlwiXzN4OFQ0TnNJXCIsXCIgX2tleVwiOlwiQGRvam8vd2lkZ2V0cy9idXR0b25cIn07XG59KSk7O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGhlbWUvYnV0dG9uLm0uY3NzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL2J1dHRvbi5tLmNzcy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGhlbWUvaWNvbi5tLmNzc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS9pY29uLm0uY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsInJlcXVpcmUoJ2M6L1VzZXJzL2Rqb25lcy5TQUNCVUsvRG9jdW1lbnRzL2Rldi9kb2pvLXR1dHMvMTAxMF9jb250YWluZXJzX2FuZF9pbmplY3Rpbmdfc3RhdGUvbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGhlbWUvaWNvbi5tLmNzcycpO1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdGRlZmluZShbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gKGZhY3RvcnkoKSk7IH0pO1xufSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbn1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4ge1wicm9vdFwiOlwiXzJMNkxzLVp5XCIsXCJpY29uXCI6XCJfM3RGMXZaTS1cIixcImRvd25JY29uXCI6XCJfM0dGeUlrM0dcIixcImxlZnRJY29uXCI6XCJfMWRiOERLYzhcIixcInJpZ2h0SWNvblwiOlwiXzJhMTQzWUVUXCIsXCJjbG9zZUljb25cIjpcIncxV1ppZXQyXCIsXCJwbHVzSWNvblwiOlwiXzJWXzkwOU9DXCIsXCJtaW51c0ljb25cIjpcIl8yN0tPZTRnSFwiLFwiY2hlY2tJY29uXCI6XCJtS2lsNE1DWFwiLFwidXBJY29uXCI6XCJSdzRUWHJkYlwiLFwidXBBbHRJY29uXCI6XCJiMkJQcWRDT1wiLFwiZG93bkFsdEljb25cIjpcIl8zUXBrRXctSVwiLFwic2VhcmNoSWNvblwiOlwiXzNNV3FzQ19iXCIsXCJiYXJzSWNvblwiOlwiXzN1WFdtLUg2XCIsXCJzZXR0aW5nc0ljb25cIjpcIl8zVi0tT0x3bFwiLFwiYWxlcnRJY29uXCI6XCJfM1lqSk9YV2hcIixcImhlbHBJY29uXCI6XCJfM21MOTFaMHNcIixcImluZm9JY29uXCI6XCJkWkxlbzZTZlwiLFwicGhvbmVJY29uXCI6XCJfMXZ6a051TkJcIixcImVkaXRJY29uXCI6XCJfMnkzSUgzbzJcIixcImRhdGVJY29uXCI6XCJfMV94NlJxdEFcIixcImxpbmtJY29uXCI6XCJIa1YydjN5S1wiLFwibG9jYXRpb25JY29uXCI6XCJfMjQtN3lfTHpcIixcInNlY3VyZUljb25cIjpcIl8yY1REeG1vdVwiLFwibWFpbEljb25cIjpcIl8xMlBNWUhucVwiLFwiIF9rZXlcIjpcIkBkb2pvL3dpZGdldHMvaWNvblwifTtcbn0pKTs7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS9pY29uLm0uY3NzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL2ljb24ubS5jc3MuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL2xhYmVsLm0uY3NzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL2xhYmVsLm0uY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsInJlcXVpcmUoJ2M6L1VzZXJzL2Rqb25lcy5TQUNCVUsvRG9jdW1lbnRzL2Rldi9kb2pvLXR1dHMvMTAxMF9jb250YWluZXJzX2FuZF9pbmplY3Rpbmdfc3RhdGUvbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGhlbWUvbGFiZWwubS5jc3MnKTtcbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIChmYWN0b3J5KCkpOyB9KTtcbn0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG59XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHtcInJvb3RcIjpcIl8xWG43R1pqbFwiLFwicmVhZG9ubHlcIjpcIl83OWdNdzB2WFwiLFwiaW52YWxpZFwiOlwiXzFIWFFYYW5kXCIsXCJ2YWxpZFwiOlwiXzNUZU84NW5EXCIsXCJyZXF1aXJlZFwiOlwiXzJhX2x3Wmk4XCIsXCJkaXNhYmxlZFwiOlwiXzNndjlwdHhIXCIsXCJmb2N1c2VkXCI6XCJfMlF5Mm5ZdGFcIixcInNlY29uZGFyeVwiOlwiXzI5VXBSN0dkXCIsXCIgX2tleVwiOlwiQGRvam8vd2lkZ2V0cy9sYWJlbFwifTtcbn0pKTs7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS9sYWJlbC5tLmNzcy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS9sYWJlbC5tLmNzcy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGhlbWUvdGV4dC1pbnB1dC5tLmNzc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS90ZXh0LWlucHV0Lm0uY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsInJlcXVpcmUoJ2M6L1VzZXJzL2Rqb25lcy5TQUNCVUsvRG9jdW1lbnRzL2Rldi9kb2pvLXR1dHMvMTAxMF9jb250YWluZXJzX2FuZF9pbmplY3Rpbmdfc3RhdGUvbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGhlbWUvdGV4dC1pbnB1dC5tLmNzcycpO1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdGRlZmluZShbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gKGZhY3RvcnkoKSk7IH0pO1xufSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbn1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4ge1wiaW5wdXRcIjpcIl8xMVZpbW9QR1wiLFwicm9vdFwiOlwiXzFOZ1pVRUU0XCIsXCJpbnB1dFdyYXBwZXJcIjpcIlR4SV9xZXRvXCIsXCJkaXNhYmxlZFwiOlwieEt2X0dLcFRcIixcImZvY3VzZWRcIjpcIl8xX2NOWTdFOFwiLFwicmVhZG9ubHlcIjpcIl8zOWZhWkZNWFwiLFwicmVxdWlyZWRcIjpcIl8xc1NhYWJIb1wiLFwiaW52YWxpZFwiOlwiXzN0eS1CUk5NXCIsXCJ2YWxpZFwiOlwiXzNBNzFzQm40XCIsXCIgX2tleVwiOlwiQGRvam8vd2lkZ2V0cy90ZXh0LWlucHV0XCJ9O1xufSkpOztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL3RleHQtaW5wdXQubS5jc3MuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGhlbWUvdGV4dC1pbnB1dC5tLmNzcy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiKGZ1bmN0aW9uIChnbG9iYWwsIHVuZGVmaW5lZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKGdsb2JhbC5zZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBuZXh0SGFuZGxlID0gMTsgLy8gU3BlYyBzYXlzIGdyZWF0ZXIgdGhhbiB6ZXJvXG4gICAgdmFyIHRhc2tzQnlIYW5kbGUgPSB7fTtcbiAgICB2YXIgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgdmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbiAgICB2YXIgcmVnaXN0ZXJJbW1lZGlhdGU7XG5cbiAgICBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcbiAgICAgIC8vIENhbGxiYWNrIGNhbiBlaXRoZXIgYmUgYSBmdW5jdGlvbiBvciBhIHN0cmluZ1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbmV3IEZ1bmN0aW9uKFwiXCIgKyBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICAvLyBDb3B5IGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV07XG4gICAgICB9XG4gICAgICAvLyBTdG9yZSBhbmQgcmVnaXN0ZXIgdGhlIHRhc2tcbiAgICAgIHZhciB0YXNrID0geyBjYWxsYmFjazogY2FsbGJhY2ssIGFyZ3M6IGFyZ3MgfTtcbiAgICAgIHRhc2tzQnlIYW5kbGVbbmV4dEhhbmRsZV0gPSB0YXNrO1xuICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUobmV4dEhhbmRsZSk7XG4gICAgICByZXR1cm4gbmV4dEhhbmRsZSsrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGhhbmRsZSkge1xuICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bih0YXNrKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRhc2suY2FsbGJhY2s7XG4gICAgICAgIHZhciBhcmdzID0gdGFzay5hcmdzO1xuICAgICAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bklmUHJlc2VudChoYW5kbGUpIHtcbiAgICAgICAgLy8gRnJvbSB0aGUgc3BlYzogXCJXYWl0IHVudGlsIGFueSBpbnZvY2F0aW9ucyBvZiB0aGlzIGFsZ29yaXRobSBzdGFydGVkIGJlZm9yZSB0aGlzIG9uZSBoYXZlIGNvbXBsZXRlZC5cIlxuICAgICAgICAvLyBTbyBpZiB3ZSdyZSBjdXJyZW50bHkgcnVubmluZyBhIHRhc2ssIHdlJ2xsIG5lZWQgdG8gZGVsYXkgdGhpcyBpbnZvY2F0aW9uLlxuICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ0FUYXNrKSB7XG4gICAgICAgICAgICAvLyBEZWxheSBieSBkb2luZyBhIHNldFRpbWVvdXQuIHNldEltbWVkaWF0ZSB3YXMgdHJpZWQgaW5zdGVhZCwgYnV0IGluIEZpcmVmb3ggNyBpdCBnZW5lcmF0ZWQgYVxuICAgICAgICAgICAgLy8gXCJ0b28gbXVjaCByZWN1cnNpb25cIiBlcnJvci5cbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgICAgICAgICBpZiAodGFzaykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcnVuKHRhc2spO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW1tZWRpYXRlKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7IHJ1bklmUHJlc2VudChoYW5kbGUpOyB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5Vc2VQb3N0TWVzc2FnZSgpIHtcbiAgICAgICAgLy8gVGhlIHRlc3QgYWdhaW5zdCBgaW1wb3J0U2NyaXB0c2AgcHJldmVudHMgdGhpcyBpbXBsZW1lbnRhdGlvbiBmcm9tIGJlaW5nIGluc3RhbGxlZCBpbnNpZGUgYSB3ZWIgd29ya2VyLFxuICAgICAgICAvLyB3aGVyZSBgZ2xvYmFsLnBvc3RNZXNzYWdlYCBtZWFucyBzb21ldGhpbmcgY29tcGxldGVseSBkaWZmZXJlbnQgYW5kIGNhbid0IGJlIHVzZWQgZm9yIHRoaXMgcHVycG9zZS5cbiAgICAgICAgaWYgKGdsb2JhbC5wb3N0TWVzc2FnZSAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICAgICAgICAgIHZhciBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBvbGRPbk1lc3NhZ2UgPSBnbG9iYWwub25tZXNzYWdlO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoXCJcIiwgXCIqXCIpO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IG9sZE9uTWVzc2FnZTtcbiAgICAgICAgICAgIHJldHVybiBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIC8vIEluc3RhbGxzIGFuIGV2ZW50IGhhbmRsZXIgb24gYGdsb2JhbGAgZm9yIHRoZSBgbWVzc2FnZWAgZXZlbnQ6IHNlZVxuICAgICAgICAvLyAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0RPTS93aW5kb3cucG9zdE1lc3NhZ2VcbiAgICAgICAgLy8gKiBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS9jb21tcy5odG1sI2Nyb3NzRG9jdW1lbnRNZXNzYWdlc1xuXG4gICAgICAgIHZhciBtZXNzYWdlUHJlZml4ID0gXCJzZXRJbW1lZGlhdGUkXCIgKyBNYXRoLnJhbmRvbSgpICsgXCIkXCI7XG4gICAgICAgIHZhciBvbkdsb2JhbE1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4T2YobWVzc2FnZVByZWZpeCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoK2V2ZW50LmRhdGEuc2xpY2UobWVzc2FnZVByZWZpeC5sZW5ndGgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbC5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShtZXNzYWdlUHJlZml4ICsgaGFuZGxlLCBcIipcIik7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSA8c2NyaXB0PiBlbGVtZW50OyBpdHMgcmVhZHlzdGF0ZWNoYW5nZSBldmVudCB3aWxsIGJlIGZpcmVkIGFzeW5jaHJvbm91c2x5IG9uY2UgaXQgaXMgaW5zZXJ0ZWRcbiAgICAgICAgICAgIC8vIGludG8gdGhlIGRvY3VtZW50LiBEbyBzbywgdGh1cyBxdWV1aW5nIHVwIHRoZSB0YXNrLiBSZW1lbWJlciB0byBjbGVhbiB1cCBvbmNlIGl0J3MgYmVlbiBjYWxsZWQuXG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSWYgc3VwcG9ydGVkLCB3ZSBzaG91bGQgYXR0YWNoIHRvIHRoZSBwcm90b3R5cGUgb2YgZ2xvYmFsLCBzaW5jZSB0aGF0IGlzIHdoZXJlIHNldFRpbWVvdXQgZXQgYWwuIGxpdmUuXG4gICAgdmFyIGF0dGFjaFRvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwpO1xuICAgIGF0dGFjaFRvID0gYXR0YWNoVG8gJiYgYXR0YWNoVG8uc2V0VGltZW91dCA/IGF0dGFjaFRvIDogZ2xvYmFsO1xuXG4gICAgLy8gRG9uJ3QgZ2V0IGZvb2xlZCBieSBlLmcuIGJyb3dzZXJpZnkgZW52aXJvbm1lbnRzLlxuICAgIGlmICh7fS50b1N0cmluZy5jYWxsKGdsb2JhbC5wcm9jZXNzKSA9PT0gXCJbb2JqZWN0IHByb2Nlc3NdXCIpIHtcbiAgICAgICAgLy8gRm9yIE5vZGUuanMgYmVmb3JlIDAuOVxuICAgICAgICBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChjYW5Vc2VQb3N0TWVzc2FnZSgpKSB7XG4gICAgICAgIC8vIEZvciBub24tSUUxMCBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZ2xvYmFsLk1lc3NhZ2VDaGFubmVsKSB7XG4gICAgICAgIC8vIEZvciB3ZWIgd29ya2Vycywgd2hlcmUgc3VwcG9ydGVkXG4gICAgICAgIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGRvYyAmJiBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGluIGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpKSB7XG4gICAgICAgIC8vIEZvciBJRSA24oCTOFxuICAgICAgICBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGb3Igb2xkZXIgYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpO1xuICAgIH1cblxuICAgIGF0dGFjaFRvLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbiAgICBhdHRhY2hUby5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xufSh0eXBlb2Ygc2VsZiA9PT0gXCJ1bmRlZmluZWRcIiA/IHR5cGVvZiBnbG9iYWwgPT09IFwidW5kZWZpbmVkXCIgPyB0aGlzIDogZ2xvYmFsIDogc2VsZikpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJ2YXIgYXBwbHkgPSBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHk7XG5cbi8vIERPTSBBUElzLCBmb3IgY29tcGxldGVuZXNzXG5cbmV4cG9ydHMuc2V0VGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRUaW1lb3V0LCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFyVGltZW91dCk7XG59O1xuZXhwb3J0cy5zZXRJbnRlcnZhbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRJbnRlcnZhbCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhckludGVydmFsKTtcbn07XG5leHBvcnRzLmNsZWFyVGltZW91dCA9XG5leHBvcnRzLmNsZWFySW50ZXJ2YWwgPSBmdW5jdGlvbih0aW1lb3V0KSB7XG4gIGlmICh0aW1lb3V0KSB7XG4gICAgdGltZW91dC5jbG9zZSgpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBUaW1lb3V0KGlkLCBjbGVhckZuKSB7XG4gIHRoaXMuX2lkID0gaWQ7XG4gIHRoaXMuX2NsZWFyRm4gPSBjbGVhckZuO1xufVxuVGltZW91dC5wcm90b3R5cGUudW5yZWYgPSBUaW1lb3V0LnByb3RvdHlwZS5yZWYgPSBmdW5jdGlvbigpIHt9O1xuVGltZW91dC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fY2xlYXJGbi5jYWxsKHdpbmRvdywgdGhpcy5faWQpO1xufTtcblxuLy8gRG9lcyBub3Qgc3RhcnQgdGhlIHRpbWUsIGp1c3Qgc2V0cyB1cCB0aGUgbWVtYmVycyBuZWVkZWQuXG5leHBvcnRzLmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0sIG1zZWNzKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSBtc2Vjcztcbn07XG5cbmV4cG9ydHMudW5lbnJvbGwgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSAtMTtcbn07XG5cbmV4cG9ydHMuX3VucmVmQWN0aXZlID0gZXhwb3J0cy5hY3RpdmUgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcblxuICB2YXIgbXNlY3MgPSBpdGVtLl9pZGxlVGltZW91dDtcbiAgaWYgKG1zZWNzID49IDApIHtcbiAgICBpdGVtLl9pZGxlVGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiBvblRpbWVvdXQoKSB7XG4gICAgICBpZiAoaXRlbS5fb25UaW1lb3V0KVxuICAgICAgICBpdGVtLl9vblRpbWVvdXQoKTtcbiAgICB9LCBtc2Vjcyk7XG4gIH1cbn07XG5cbi8vIHNldGltbWVkaWF0ZSBhdHRhY2hlcyBpdHNlbGYgdG8gdGhlIGdsb2JhbCBvYmplY3RcbnJlcXVpcmUoXCJzZXRpbW1lZGlhdGVcIik7XG4vLyBPbiBzb21lIGV4b3RpYyBlbnZpcm9ubWVudHMsIGl0J3Mgbm90IGNsZWFyIHdoaWNoIG9iamVjdCBgc2V0aW1tZWlkYXRlYCB3YXNcbi8vIGFibGUgdG8gaW5zdGFsbCBvbnRvLiAgU2VhcmNoIGVhY2ggcG9zc2liaWxpdHkgaW4gdGhlIHNhbWUgb3JkZXIgYXMgdGhlXG4vLyBgc2V0aW1tZWRpYXRlYCBsaWJyYXJ5LlxuZXhwb3J0cy5zZXRJbW1lZGlhdGUgPSAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgJiYgc2VsZi5zZXRJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiICYmIGdsb2JhbC5zZXRJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICh0aGlzICYmIHRoaXMuc2V0SW1tZWRpYXRlKTtcbmV4cG9ydHMuY2xlYXJJbW1lZGlhdGUgPSAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgJiYgc2VsZi5jbGVhckltbWVkaWF0ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWwuY2xlYXJJbW1lZGlhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMgJiYgdGhpcy5jbGVhckltbWVkaWF0ZSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy90aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0geVtvcFswXSAmIDIgPyBcInJldHVyblwiIDogb3BbMF0gPyBcInRocm93XCIgOiBcIm5leHRcIl0pICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gWzAsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7ICB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpZiAob1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJ2YXIgZztcblxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcbmcgPSAoZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzO1xufSkoKTtcblxudHJ5IHtcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XG59IGNhdGNoKGUpIHtcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcblx0XHRnID0gd2luZG93O1xufVxuXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3dlYnBhY2svYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiaW1wb3J0IHsgZGVlcEFzc2lnbiB9IGZyb20gJ0Bkb2pvL2NvcmUvbGFuZyc7XHJcbmltcG9ydCB7IEluamVjdG9yIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvSW5qZWN0b3InO1xyXG5cclxuaW1wb3J0IHsgV29ya2VyUHJvcGVydGllcyB9IGZyb20gJy4vd2lkZ2V0cy9Xb3JrZXInO1xyXG5pbXBvcnQgeyBXb3JrZXJGb3JtRGF0YSB9IGZyb20gJy4vd2lkZ2V0cy9Xb3JrZXJGb3JtJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcGxpY2F0aW9uQ29udGV4dCBleHRlbmRzIEluamVjdG9yIHtcclxuXHJcblx0cHJpdmF0ZSBfd29ya2VyRGF0YTogV29ya2VyUHJvcGVydGllc1tdO1xyXG5cclxuXHRwcml2YXRlIF9mb3JtRGF0YTogUGFydGlhbDxXb3JrZXJGb3JtRGF0YT4gPSB7fTtcclxuXHJcblx0Y29uc3RydWN0b3Iod29ya2VyRGF0YTogV29ya2VyUHJvcGVydGllc1tdID0gW10pIHtcclxuXHRcdHN1cGVyKHt9KTtcclxuXHRcdHRoaXMuX3dvcmtlckRhdGEgPSB3b3JrZXJEYXRhO1xyXG5cdH1cclxuXHJcblx0Z2V0IHdvcmtlckRhdGEoKTogV29ya2VyUHJvcGVydGllc1tdIHtcclxuXHRcdHJldHVybiB0aGlzLl93b3JrZXJEYXRhO1xyXG5cdH1cclxuXHJcblx0Z2V0IGZvcm1EYXRhKCk6IFBhcnRpYWw8V29ya2VyRm9ybURhdGE+IHtcclxuXHRcdHJldHVybiB0aGlzLl9mb3JtRGF0YTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBmb3JtSW5wdXQoaW5wdXQ6IFBhcnRpYWw8V29ya2VyRm9ybURhdGE+KTogdm9pZCB7XHJcblx0XHR0aGlzLl9mb3JtRGF0YSA9IGRlZXBBc3NpZ24oe30sIHRoaXMuX2Zvcm1EYXRhLCBpbnB1dCk7XHJcblx0XHR0aGlzLmVtaXQoeyB0eXBlOiAnaW52YWxpZGF0ZScgfSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3VibWl0Rm9ybSgpOiB2b2lkIHtcclxuXHRcdHRoaXMuX3dvcmtlckRhdGEgPSBbIC4uLnRoaXMuX3dvcmtlckRhdGEsIHRoaXMuX2Zvcm1EYXRhIF07XHJcblx0XHR0aGlzLl9mb3JtRGF0YSA9IHt9O1xyXG5cdFx0dGhpcy5lbWl0KHsgdHlwZTogJ2ludmFsaWRhdGUnIH0pO1xyXG5cdH1cclxuXHJcblx0Z2V0KCk6IEFwcGxpY2F0aW9uQ29udGV4dCB7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGludC1sb2FkZXI/P3JlZi0tMCEuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyP3R5cGU9dHMmaW5zdGFuY2VOYW1lPTBfZG9qbyEuL3NyYy9BcHBsaWNhdGlvbkNvbnRleHQudHMiLCJpbXBvcnQgeyBDb250YWluZXIgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9Db250YWluZXInO1xyXG5cclxuaW1wb3J0IEFwcGxpY2F0aW9uQ29udGV4dCBmcm9tICcuLy4uL0FwcGxpY2F0aW9uQ29udGV4dCc7XHJcbmltcG9ydCBXb3JrZXJDb250YWluZXIsIHsgV29ya2VyQ29udGFpbmVyUHJvcGVydGllcyB9IGZyb20gJy4vLi4vd2lkZ2V0cy9Xb3JrZXJDb250YWluZXInO1xyXG5cclxuZnVuY3Rpb24gZ2V0UHJvcGVydGllcyhpbmplY3Q6IEFwcGxpY2F0aW9uQ29udGV4dCwgcHJvcGVydGllczogYW55KSB7XHJcblx0cmV0dXJuIHsgd29ya2VyRGF0YTogaW5qZWN0LndvcmtlckRhdGEgfTtcclxufVxyXG5cclxuY29uc3QgV29ya2VyQ29udGFpbmVyQ29udGFpbmVyID0gQ29udGFpbmVyKFdvcmtlckNvbnRhaW5lciwgJ2FwcC1zdGF0ZScsIHsgZ2V0UHJvcGVydGllcyB9KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFdvcmtlckNvbnRhaW5lckNvbnRhaW5lcjtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGludC1sb2FkZXI/P3JlZi0tMCEuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyP3R5cGU9dHMmaW5zdGFuY2VOYW1lPTBfZG9qbyEuL3NyYy9jb250YWluZXJzL1dvcmtlckNvbnRhaW5lckNvbnRhaW5lci50cyIsImltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL0NvbnRhaW5lcic7XHJcblxyXG5pbXBvcnQgQXBwbGljYXRpb25Db250ZXh0IGZyb20gJy4vLi4vQXBwbGljYXRpb25Db250ZXh0JztcclxuaW1wb3J0IFdvcmtlckZvcm0sIHsgV29ya2VyRm9ybVByb3BlcnRpZXMgfSBmcm9tICcuLy4uL3dpZGdldHMvV29ya2VyRm9ybSc7XHJcblxyXG5mdW5jdGlvbiBnZXRQcm9wZXJ0aWVzKGluamVjdDogQXBwbGljYXRpb25Db250ZXh0LCBwcm9wZXJ0aWVzOiBhbnkpIHtcclxuXHRjb25zdCB7XHJcblx0XHRmb3JtRGF0YSxcclxuXHRcdGZvcm1JbnB1dDogb25Gb3JtSW5wdXQsXHJcblx0XHRzdWJtaXRGb3JtOiBvbkZvcm1TYXZlXHJcblx0fSA9IGluamVjdDtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGZvcm1EYXRhLFxyXG5cdFx0b25Gb3JtSW5wdXQ6IG9uRm9ybUlucHV0LmJpbmQoaW5qZWN0KSxcclxuXHRcdG9uRm9ybVNhdmU6IG9uRm9ybVNhdmUuYmluZChpbmplY3QpXHJcblx0fTtcclxufVxyXG5cclxuY29uc3QgV29ya2VyRm9ybUNvbnRhaW5lciA9IENvbnRhaW5lcihXb3JrZXJGb3JtLCAnYXBwLXN0YXRlJywgeyBnZXRQcm9wZXJ0aWVzIH0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgV29ya2VyRm9ybUNvbnRhaW5lcjtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGludC1sb2FkZXI/P3JlZi0tMCEuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyP3R5cGU9dHMmaW5zdGFuY2VOYW1lPTBfZG9qbyEuL3NyYy9jb250YWluZXJzL1dvcmtlckZvcm1Db250YWluZXIudHMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21haW4uY3NzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9tYWluLmNzc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJpbXBvcnQgeyBQcm9qZWN0b3JNaXhpbiB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9Qcm9qZWN0b3InO1xuaW1wb3J0IHsgUmVnaXN0cnkgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeSc7XG5cbmltcG9ydCBBcHAgZnJvbSAnLi93aWRnZXRzL0FwcCc7XG5pbXBvcnQgQXBwbGljYXRpb25Db250ZXh0IGZyb20gJy4vQXBwbGljYXRpb25Db250ZXh0JztcblxuY29uc3QgYXBwbGljYXRpb25Db250ZXh0ID0gbmV3IEFwcGxpY2F0aW9uQ29udGV4dChbXG5cdHtcblx0XHRmaXJzdE5hbWU6ICdUaW0nLFxuXHRcdGxhc3ROYW1lOiAnSm9uZXMnLFxuXHRcdGVtYWlsOiAndGltLmpvbmVzQGJpemVjb3JwLm9yZycsXG5cdFx0dGFza3M6IFtcblx0XHRcdCc2MjY3IC0gVW50YW5nbGUgcGFwZXJjbGlwcycsXG5cdFx0XHQnNDM4NCAtIFNocmVkIGRvY3VtZW50cycsXG5cdFx0XHQnOTY2MyAtIERpZ2l0aXplIDE5ODUgYXJjaGl2ZSdcblx0XHRdXG5cdH0sXG5cdHtcblx0XHRmaXJzdE5hbWU6ICdBbGljaWEnLFxuXHRcdGxhc3ROYW1lOiAnRml0emdlcmFsZCdcblx0fSxcblx0e1xuXHRcdGZpcnN0TmFtZTogJ0hhbnMnLFxuXHRcdGxhc3ROYW1lOiAnTXVlbGxlcidcblx0fVxuXSk7XG5cbmNvbnN0IHJlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5KCk7XG5yZWdpc3RyeS5kZWZpbmVJbmplY3RvcignYXBwLXN0YXRlJywgYXBwbGljYXRpb25Db250ZXh0KTtcblxuY29uc3Qgcm9vdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ215LWFwcCcpIHx8IHVuZGVmaW5lZDtcblxuY29uc3QgUHJvamVjdG9yID0gUHJvamVjdG9yTWl4aW4oQXBwKTtcbmNvbnN0IHByb2plY3RvciA9IG5ldyBQcm9qZWN0b3IoKTtcblxucHJvamVjdG9yLnNldFByb3BlcnRpZXMoeyByZWdpc3RyeSB9KTtcblxucHJvamVjdG9yLmFwcGVuZChyb290KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpbnQtbG9hZGVyPz9yZWYtLTAhLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZHRzLWxvYWRlcj90eXBlPXRzJmluc3RhbmNlTmFtZT0wX2Rvam8hLi9zcmMvbWFpbi50cyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5tb2R1bGUuZXhwb3J0cyA9IHtcIiBfa2V5XCI6XCJiaXotZS1jb3JwL3dvcmtlclwiLFwiZ2VuZXJhbEluZm9cIjpcIndvcmtlci1tX19nZW5lcmFsSW5mb19fMzVVMENcIixcImltYWdlXCI6XCJ3b3JrZXItbV9faW1hZ2VfXzFVLVI1XCIsXCJpbWFnZVNtYWxsXCI6XCJ3b3JrZXItbV9faW1hZ2VTbWFsbF9fM2I5UURcIixcImxhYmVsXCI6XCJ3b3JrZXItbV9fbGFiZWxfX2p6czQwXCIsXCJ0YXNrXCI6XCJ3b3JrZXItbV9fdGFza19fTHA3enpcIixcIndvcmtlclwiOlwid29ya2VyLW1fX3dvcmtlcl9fNF9SQ01cIixcIndvcmtlckZyb250XCI6XCJ3b3JrZXItbV9fd29ya2VyRnJvbnRfX1hNVUxXXCIsXCJ3b3JrZXJCYWNrXCI6XCJ3b3JrZXItbV9fd29ya2VyQmFja19fM0hWWDNcIixcInJldmVyc2VcIjpcIndvcmtlci1tX19yZXZlcnNlX18ydEJiN1wifTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdHlsZXMvd29ya2VyLm0uY3NzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9zdHlsZXMvd29ya2VyLm0uY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5tb2R1bGUuZXhwb3J0cyA9IHtcIiBfa2V5XCI6XCJiaXotZS1jb3JwL3dvcmtlckNvbnRhaW5lclwiLFwiY29udGFpbmVyXCI6XCJ3b3JrZXJDb250YWluZXItbV9fY29udGFpbmVyX18xajM3bVwifTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdHlsZXMvd29ya2VyQ29udGFpbmVyLm0uY3NzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9zdHlsZXMvd29ya2VyQ29udGFpbmVyLm0uY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5tb2R1bGUuZXhwb3J0cyA9IHtcIiBfa2V5XCI6XCJiaXotZS1jb3JwL3dvcmtlckZvcm1cIixcIndvcmtlckZvcm1cIjpcIndvcmtlckZvcm0tbV9fd29ya2VyRm9ybV9fM3FHNW1cIixcIm5hbWVGaWVsZFwiOlwid29ya2VyRm9ybS1tX19uYW1lRmllbGRfXzJRT1c2XCIsXCJuYW1lTGFiZWxcIjpcIndvcmtlckZvcm0tbV9fbmFtZUxhYmVsX18zVkNnWFwiLFwid29ya2VyQnV0dG9uXCI6XCJ3b3JrZXJGb3JtLW1fX3dvcmtlckJ1dHRvbl9fM1VqbjZcIn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc3R5bGVzL3dvcmtlckZvcm0ubS5jc3Ncbi8vIG1vZHVsZSBpZCA9IC4vc3JjL3N0eWxlcy93b3JrZXJGb3JtLm0uY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsImltcG9ydCB7IFdpZGdldEJhc2UgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlJztcbmltcG9ydCB7IHYsIHcgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kJztcbmltcG9ydCBCYW5uZXIgZnJvbSAnLi9CYW5uZXInO1xuaW1wb3J0IFdvcmtlckNvbnRhaW5lckNvbnRhaW5lciBmcm9tICcuLy4uL2NvbnRhaW5lcnMvV29ya2VyQ29udGFpbmVyQ29udGFpbmVyJztcbmltcG9ydCBXb3JrZXJGb3JtQ29udGFpbmVyIGZyb20gJy4vLi4vY29udGFpbmVycy9Xb3JrZXJGb3JtQ29udGFpbmVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwIGV4dGVuZHMgV2lkZ2V0QmFzZSB7XG5cdHByb3RlY3RlZCByZW5kZXIoKSB7XG5cdFx0cmV0dXJuIHYoJ2RpdicsIFtcblx0XHRcdHcoQmFubmVyLCB7fSksXG5cdFx0XHR3KFdvcmtlckZvcm1Db250YWluZXIsIHt9KSxcblx0XHRcdHcoV29ya2VyQ29udGFpbmVyQ29udGFpbmVyLCB7fSlcblx0XHRdKTtcblx0fVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGludC1sb2FkZXI/P3JlZi0tMCEuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyP3R5cGU9dHMmaW5zdGFuY2VOYW1lPTBfZG9qbyEuL3NyYy93aWRnZXRzL0FwcC50cyIsImltcG9ydCB7IFdpZGdldEJhc2UgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlJztcbmltcG9ydCB7IHYgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFubmVyIGV4dGVuZHMgV2lkZ2V0QmFzZSB7XG5cdHByb3RlY3RlZCByZW5kZXIoKSB7XG5cdFx0cmV0dXJuIHYoJ2gxJywgeyB0aXRsZTogJ0kgYW0gYSB0aXRsZSEnIH0sIFsgJ0Jpei1FLUJvZGllcycgXSk7XG5cdH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpbnQtbG9hZGVyPz9yZWYtLTAhLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZHRzLWxvYWRlcj90eXBlPXRzJmluc3RhbmNlTmFtZT0wX2Rvam8hLi9zcmMvd2lkZ2V0cy9CYW5uZXIudHMiLCJpbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZSc7XG5pbXBvcnQgeyB2IH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvZCc7XG5pbXBvcnQgeyB0aGVtZSwgVGhlbWVkTWl4aW4gfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkJztcbmltcG9ydCAqIGFzIGNzcyBmcm9tICcuLi9zdHlsZXMvd29ya2VyLm0uY3NzJztcblxuZXhwb3J0IGludGVyZmFjZSBXb3JrZXJQcm9wZXJ0aWVzIHtcblx0Zmlyc3ROYW1lPzogc3RyaW5nO1xuXHRsYXN0TmFtZT86IHN0cmluZztcblx0ZW1haWw/OiBzdHJpbmc7XG5cdHRpbWVQZXJUYXNrPzogbnVtYmVyO1xuXHR0YXNrcz86IHN0cmluZ1tdO1xufVxuXG5jb25zdCBXb3JrZXJCYXNlID0gVGhlbWVkTWl4aW4oV2lkZ2V0QmFzZSk7XG5cbkB0aGVtZShjc3MpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXb3JrZXIgZXh0ZW5kcyBXb3JrZXJCYXNlPFdvcmtlclByb3BlcnRpZXM+IHtcblx0cHJpdmF0ZSBfaXNGbGlwcGVkID0gZmFsc2U7XG5cblx0cHJvdGVjdGVkIHJlbmRlcigpIHtcblx0XHRyZXR1cm4gdignZGl2Jywge1xuXHRcdFx0Y2xhc3NlczogdGhpcy50aGVtZShbIGNzcy53b3JrZXIsIHRoaXMuX2lzRmxpcHBlZCA/IGNzcy5yZXZlcnNlIDogbnVsbCBdKVxuXHRcdH0sIFtcblx0XHRcdHRoaXMuX3JlbmRlckZyb250KCksXG5cdFx0XHR0aGlzLl9yZW5kZXJCYWNrKClcblx0XHRdKTtcblx0fVxuXG5cdHByaXZhdGUgX3JlbmRlckZyb250KCkge1xuXHRcdGNvbnN0IHtcblx0XHRcdGZpcnN0TmFtZSA9ICdmaXJzdE5hbWUnLFxuXHRcdFx0bGFzdE5hbWUgPSAnbGFzdE5hbWUnXG5cdFx0fSA9IHRoaXMucHJvcGVydGllcztcblxuXHRcdHJldHVybiB2KCdkaXYnLCB7XG5cdFx0XHRcdGtleTogJ2Zyb250Jyxcblx0XHRcdFx0Y2xhc3NlczogdGhpcy50aGVtZShjc3Mud29ya2VyRnJvbnQpLFxuXHRcdFx0XHRvbmNsaWNrOiB0aGlzLmZsaXBcblx0XHRcdH0sIFtcblx0XHRcdFx0dignaW1nJywge1xuXHRcdFx0XHRcdGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLmltYWdlKSxcblx0XHRcdFx0XHRzcmM6ICdodHRwczovL2Rvam8uaW8vdHV0b3JpYWxzL3Jlc291cmNlcy93b3JrZXIuc3ZnJ1xuXHRcdFx0XHR9KSxcblx0XHRcdFx0dignZGl2JywgW1xuXHRcdFx0XHRcdHYoJ3N0cm9uZycsIFsgYCR7bGFzdE5hbWV9LCAke2ZpcnN0TmFtZX1gIF0pXG5cdFx0XHRcdF0pXG5cdFx0XHRdXG5cdFx0KTtcblx0fVxuXG5cdHByaXZhdGUgX3JlbmRlckJhY2soKSB7XG5cdFx0Y29uc3Qge1xuXHRcdFx0Zmlyc3ROYW1lID0gJ2ZpcnN0TmFtZScsXG5cdFx0XHRsYXN0TmFtZSA9ICdsYXN0TmFtZScsXG5cdFx0XHRlbWFpbCA9ICd1bmF2YWlsYWJsZScsXG5cdFx0XHR0aW1lUGVyVGFzayA9IDAsXG5cdFx0XHR0YXNrcyA9IFtdXG5cdFx0fSA9IHRoaXMucHJvcGVydGllcztcblxuXHRcdHJldHVybiB2KCdkaXYnLCB7XG5cdFx0XHRcdGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLndvcmtlckJhY2spLFxuXHRcdFx0XHRvbmNsaWNrOiB0aGlzLmZsaXBcblx0XHRcdH0sIFtcblx0XHRcdFx0dignaW1nJywge1xuXHRcdFx0XHRcdGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLmltYWdlU21hbGwpLFxuXHRcdFx0XHRcdHNyYzogJ2h0dHBzOi8vZG9qby5pby90dXRvcmlhbHMvcmVzb3VyY2VzL3dvcmtlci5zdmcnXG5cdFx0XHRcdH0pLFxuXHRcdFx0XHR2KCdkaXYnLCB7XG5cdFx0XHRcdFx0Y2xhc3NlczogdGhpcy50aGVtZShjc3MuZ2VuZXJhbEluZm8pXG5cdFx0XHRcdH0sIFtcblx0XHRcdFx0XHR2KCdkaXYnLCB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzIDogdGhpcy50aGVtZShjc3MubGFiZWwpXG5cdFx0XHRcdFx0fSwgWydOYW1lJ10pLFxuXHRcdFx0XHRcdHYoJ2RpdicsIFtgJHtsYXN0TmFtZX0sICR7Zmlyc3ROYW1lfWBdKSxcblx0XHRcdFx0XHR2KCdkaXYnLCB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzOiB0aGlzLnRoZW1lKGNzcy5sYWJlbClcblx0XHRcdFx0XHR9LCBbJ0VtYWlsJ10pLFxuXHRcdFx0XHRcdHYoJ2RpdicsIFtgJHtlbWFpbH1gXSksXG5cdFx0XHRcdFx0dignZGl2Jywge1xuXHRcdFx0XHRcdFx0Y2xhc3NlczogdGhpcy50aGVtZShjc3MubGFiZWwpXG5cdFx0XHRcdFx0fSwgWydBdmcuIFRpbWUgcGVyIFRhc2snXSksXG5cdFx0XHRcdFx0dignZGl2JywgW2Ake3RpbWVQZXJUYXNrfWBdKVxuXHRcdFx0XHRdKSxcblx0XHRcdFx0dignZGl2JywgW1xuXHRcdFx0XHRcdHYoJ3N0cm9uZycsIFsnQ3VycmVudCBUYXNrcyddKSxcblx0XHRcdFx0XHR2KCdkaXYnLCB0YXNrcy5tYXAodGFzayA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdignZGl2JywgeyBjbGFzc2VzOiB0aGlzLnRoZW1lKGNzcy50YXNrKSB9LCBbIHRhc2sgXSk7XG5cdFx0XHRcdFx0fSkpXG5cdFx0XHRcdF0pXG5cdFx0XHRdXG5cdFx0KTtcblx0fVxuXG5cdGZsaXAoKTogdm9pZCB7XG5cdFx0dGhpcy5faXNGbGlwcGVkID0gIXRoaXMuX2lzRmxpcHBlZDtcblx0XHR0aGlzLmludmFsaWRhdGUoKTtcblx0fVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGludC1sb2FkZXI/P3JlZi0tMCEuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyP3R5cGU9dHMmaW5zdGFuY2VOYW1lPTBfZG9qbyEuL3NyYy93aWRnZXRzL1dvcmtlci50cyIsImltcG9ydCB7IFdpZGdldEJhc2UgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlJztcbmltcG9ydCB7IHcsIHYgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kJztcbmltcG9ydCBXb3JrZXIsIHsgV29ya2VyUHJvcGVydGllcyB9IGZyb20gJy4vV29ya2VyJztcbmltcG9ydCB7IHRoZW1lLCBUaGVtZWRNaXhpbiB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9UaGVtZWQnO1xuaW1wb3J0ICogYXMgY3NzIGZyb20gJy4uL3N0eWxlcy93b3JrZXJDb250YWluZXIubS5jc3MnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFdvcmtlckNvbnRhaW5lclByb3BlcnRpZXMge1xuXHR3b3JrZXJEYXRhPzogV29ya2VyUHJvcGVydGllc1tdO1xufVxuXG5jb25zdCBXb3JrZXJDb250YWluZXJCYXNlID0gVGhlbWVkTWl4aW4oV2lkZ2V0QmFzZSk7XG5cbkB0aGVtZShjc3MpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXb3JrZXJDb250YWluZXIgZXh0ZW5kcyBXb3JrZXJDb250YWluZXJCYXNlPFdvcmtlckNvbnRhaW5lclByb3BlcnRpZXM+IHtcblxuXHRwcm90ZWN0ZWQgcmVuZGVyKCkge1xuXHRcdGNvbnN0IHtcblx0XHRcdHdvcmtlckRhdGEgPSBbXVxuXHRcdH0gPSB0aGlzLnByb3BlcnRpZXM7XG5cblx0XHRjb25zdCB3b3JrZXJzID0gd29ya2VyRGF0YS5tYXAoKHdvcmtlciwgaSkgPT4gdyhXb3JrZXIsIHtcblx0XHRcdGtleTogYHdvcmtlci0ke2l9YCxcblx0XHRcdC4uLndvcmtlclxuXHRcdH0pKTtcblxuXHRcdHJldHVybiB2KCdkaXYnLCB7XG5cdFx0XHRjbGFzc2VzOiB0aGlzLnRoZW1lKGNzcy5jb250YWluZXIpXG5cdFx0fSwgd29ya2Vycyk7XG5cdH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpbnQtbG9hZGVyPz9yZWYtLTAhLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZHRzLWxvYWRlcj90eXBlPXRzJmluc3RhbmNlTmFtZT0wX2Rvam8hLi9zcmMvd2lkZ2V0cy9Xb3JrZXJDb250YWluZXIudHMiLCJpbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZSc7XG5pbXBvcnQgeyB2LCB3IH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvZCc7XG5pbXBvcnQgeyBUaGVtZWRNaXhpbiwgdGhlbWUgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkJztcbmltcG9ydCBCdXR0b24gZnJvbSAnQGRvam8vd2lkZ2V0cy9idXR0b24nO1xuaW1wb3J0IFRleHRJbnB1dCBmcm9tICdAZG9qby93aWRnZXRzL3RleHQtaW5wdXQnO1xuaW1wb3J0ICogYXMgY3NzIGZyb20gJy4uL3N0eWxlcy93b3JrZXJGb3JtLm0uY3NzJztcblxuZXhwb3J0IGludGVyZmFjZSBXb3JrZXJGb3JtRGF0YSB7XG5cdGZpcnN0TmFtZTogc3RyaW5nO1xuXHRsYXN0TmFtZTogc3RyaW5nO1xuXHRlbWFpbDogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdvcmtlckZvcm1Qcm9wZXJ0aWVzIHtcblx0Zm9ybURhdGE6IFBhcnRpYWw8V29ya2VyRm9ybURhdGE+O1xuXHRvbkZvcm1JbnB1dDogKGRhdGE6IFBhcnRpYWw8V29ya2VyRm9ybURhdGE+KSA9PiB2b2lkO1xuXHRvbkZvcm1TYXZlOiAoKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgY29uc3QgV29ya2VyRm9ybUJhc2UgPSBUaGVtZWRNaXhpbihXaWRnZXRCYXNlKTtcblxuQHRoZW1lKGNzcylcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdvcmtlckZvcm0gZXh0ZW5kcyBXb3JrZXJGb3JtQmFzZTxXb3JrZXJGb3JtUHJvcGVydGllcz4ge1xuXG5cdHByaXZhdGUgX29uU3VibWl0KGV2ZW50OiBFdmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dGhpcy5wcm9wZXJ0aWVzLm9uRm9ybVNhdmUoKTtcblx0fVxuXG5cdHByb3RlY3RlZCBvbkZpcnN0TmFtZUlucHV0KGZpcnN0TmFtZTogc3RyaW5nKSB7XG5cdFx0dGhpcy5wcm9wZXJ0aWVzLm9uRm9ybUlucHV0KHsgZmlyc3ROYW1lIH0pO1xuXHR9XG5cblx0cHJvdGVjdGVkIG9uTGFzdE5hbWVJbnB1dChsYXN0TmFtZTogc3RyaW5nKSB7XG5cdFx0dGhpcy5wcm9wZXJ0aWVzLm9uRm9ybUlucHV0KHsgbGFzdE5hbWUgfSk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgb25FbWFpbElucHV0KGVtYWlsOiBzdHJpbmcpIHtcblx0XHR0aGlzLnByb3BlcnRpZXMub25Gb3JtSW5wdXQoeyBlbWFpbCB9KTtcblx0fVxuXHRwcm90ZWN0ZWQgcmVuZGVyKCkge1xuXHRcdGNvbnN0IHtcblx0XHRcdGZvcm1EYXRhOiB7IGZpcnN0TmFtZSwgbGFzdE5hbWUsIGVtYWlsIH1cblx0XHR9ID0gdGhpcy5wcm9wZXJ0aWVzO1xuXG5cdFx0cmV0dXJuIHYoJ2Zvcm0nLCB7XG5cdFx0XHRjbGFzc2VzOiB0aGlzLnRoZW1lKGNzcy53b3JrZXJGb3JtKSxcblx0XHRcdG9uc3VibWl0OiB0aGlzLl9vblN1Ym1pdFxuXHRcdH0sIFtcblx0XHRcdHYoJ2ZpZWxkc2V0JywgeyBjbGFzc2VzOiB0aGlzLnRoZW1lKGNzcy5uYW1lRmllbGQpIH0sIFtcblx0XHRcdFx0dignbGVnZW5kJywgeyBjbGFzc2VzOiB0aGlzLnRoZW1lKGNzcy5uYW1lTGFiZWwpIH0sIFsgJ05hbWUnIF0pLFxuXHRcdFx0XHR3KFRleHRJbnB1dCwge1xuXHRcdFx0XHRcdGtleTogJ2ZpcnN0TmFtZUlucHV0Jyxcblx0XHRcdFx0XHRsYWJlbDogJ0ZpcnN0IE5hbWUnLFxuXHRcdFx0XHRcdGxhYmVsSGlkZGVuOiB0cnVlLFxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyOiAnRmlyc3QgbmFtZScsXG5cdFx0XHRcdFx0dmFsdWU6IGZpcnN0TmFtZSxcblx0XHRcdFx0XHRyZXF1aXJlZDogdHJ1ZSxcblx0XHRcdFx0XHRvbklucHV0OiB0aGlzLm9uRmlyc3ROYW1lSW5wdXRcblx0XHRcdFx0fSksXG5cdFx0XHRcdHcoVGV4dElucHV0LCB7XG5cdFx0XHRcdFx0a2V5OiAnbGFzdE5hbWVJbnB1dCcsXG5cdFx0XHRcdFx0bGFiZWw6ICdMYXN0IE5hbWUnLFxuXHRcdFx0XHRcdGxhYmVsSGlkZGVuOiB0cnVlLFxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyOiAnTGFzdCBuYW1lJyxcblx0XHRcdFx0XHR2YWx1ZTogbGFzdE5hbWUsXG5cdFx0XHRcdFx0cmVxdWlyZWQ6IHRydWUsXG5cdFx0XHRcdFx0b25JbnB1dDogdGhpcy5vbkxhc3ROYW1lSW5wdXRcblx0XHRcdFx0fSlcblx0XHRcdF0pLFxuXHRcdFx0dyhUZXh0SW5wdXQsIHtcblx0XHRcdFx0bGFiZWw6ICdFbWFpbCBhZGRyZXNzJyxcblx0XHRcdFx0dHlwZTogJ2VtYWlsJyxcblx0XHRcdFx0dmFsdWU6IGVtYWlsLFxuXHRcdFx0XHRyZXF1aXJlZDogdHJ1ZSxcblx0XHRcdFx0b25JbnB1dDogdGhpcy5vbkVtYWlsSW5wdXRcblx0XHRcdH0pLFxuXHRcdFx0dyhCdXR0b24sIHsgfSwgWyAnU2F2ZScgXSlcblx0XHRdKTtcblx0fVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGludC1sb2FkZXI/P3JlZi0tMCEuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyP3R5cGU9dHMmaW5zdGFuY2VOYW1lPTBfZG9qbyEuL3NyYy93aWRnZXRzL1dvcmtlckZvcm0udHMiXSwic291cmNlUm9vdCI6IiJ9