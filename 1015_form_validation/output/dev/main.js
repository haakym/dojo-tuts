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
        _this._formErrors = {};
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
    Object.defineProperty(ApplicationContext.prototype, "formErrors", {
        get: function () {
            return this._formErrors;
        },
        enumerable: true,
        configurable: true
    });
    ApplicationContext.prototype.formValidate = function (input) {
        this._formErrors = lang_1.deepAssign({}, this._formErrors, this._validateInput(input));
        this.emit({ type: 'invalidate' });
    };
    ApplicationContext.prototype.formInput = function (input) {
        this._formData = lang_1.deepAssign({}, this._formData, input);
        this.emit({ type: 'invalidate' });
    };
    ApplicationContext.prototype.submitForm = function () {
        if (!this._validateOnSubmit()) {
            this.emit({ type: 'invalidate' });
            return;
        }
        this._workerData = this._workerData.concat([this._formData]);
        this._formData = {};
        this._formErrors = {};
        this.emit({ type: 'invalidate' });
    };
    ApplicationContext.prototype.get = function () {
        return this;
    };
    ApplicationContext.prototype._validateInput = function (input) {
        var errors = {};
        for (var key in input) {
            switch (key) {
                case 'firstName':
                    errors.firstName = !input.firstName;
                    break;
                case 'lastName':
                    errors.lastName = !input.lastName;
                    break;
                case 'email':
                    errors.email = !input.email || !input.email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
            }
        }
        return errors;
    };
    ApplicationContext.prototype._validateOnSubmit = function () {
        var errors = this._validateInput(this._formData);
        this._formErrors = lang_1.deepAssign({ firstName: true, lastName: true, email: true }, errors);
        if (this._formErrors.firstName || this._formErrors.lastName || this._formErrors.email) {
            console.error('Form contains errors');
            return false;
        }
        for (var _i = 0, _a = this._workerData; _i < _a.length; _i++) {
            var worker = _a[_i];
            if (worker.email === this._formData.email) {
                console.error('Email must be unique');
                return false;
            }
        }
        return true;
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
    var formData = inject.formData, formErrors = inject.formErrors, onFormInput = inject.formInput, onFormValidate = inject.formValidate, onFormSave = inject.submitForm;
    return {
        formData: formData,
        formErrors: formErrors,
        onFormInput: onFormInput.bind(inject),
        onFormValidate: onFormValidate.bind(inject),
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
var ApplicationContext_1 = __webpack_require__("./src/ApplicationContext.ts");
var App_1 = __webpack_require__("./src/widgets/App.ts");
var root = document.querySelector('my-app') || undefined;
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
var Projector = Projector_1.ProjectorMixin(App_1.default);
var projector = new Projector();
projector.setProperties({ registry: registry });
projector.append(root);


/***/ }),

/***/ "./src/styles/validatedTextInput.m.css":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {" _key":"biz-e-corp/validatedTextInput","inputWrapper":"validatedTextInput-m__inputWrapper__2BixX","error":"validatedTextInput-m__error__3zOA_"};

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

/***/ "./src/widgets/ValidatedTextInput.ts":
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
var uuid_1 = __webpack_require__("./node_modules/@dojo/core/uuid.js");
var Themed_1 = __webpack_require__("./node_modules/@dojo/widget-core/mixins/Themed.js");
var text_input_1 = __webpack_require__("./node_modules/@dojo/widgets/text-input/index.js");
var css = __webpack_require__("./src/styles/validatedTextInput.m.css");
exports.ValidatedTextInputBase = Themed_1.ThemedMixin(WidgetBase_1.WidgetBase);
var ValidatedTextInput = /** @class */ (function (_super) {
    __extends(ValidatedTextInput, _super);
    function ValidatedTextInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._errorId = uuid_1.default();
        return _this;
    }
    ValidatedTextInput.prototype._onInput = function (value) {
        var _a = this.properties, invalid = _a.invalid, onInput = _a.onInput, onValidate = _a.onValidate;
        onInput && onInput(value);
        if (typeof invalid !== 'undefined') {
            onValidate && onValidate(value);
        }
    };
    ValidatedTextInput.prototype._onBlur = function (value) {
        var _a = this.properties, onBlur = _a.onBlur, onValidate = _a.onValidate;
        onValidate && onValidate(value);
        onBlur && onBlur();
    };
    ValidatedTextInput.prototype.render = function () {
        var _a = this.properties, disabled = _a.disabled, label = _a.label, maxLength = _a.maxLength, minLength = _a.minLength, name = _a.name, placeholder = _a.placeholder, readOnly = _a.readOnly, required = _a.required, _b = _a.type, type = _b === void 0 ? 'text' : _b, value = _a.value, invalid = _a.invalid, errorMessage = _a.errorMessage, onBlur = _a.onBlur, onInput = _a.onInput;
        return d_1.v('div', { classes: this.theme(css.inputWrapper) }, [
            d_1.w(text_input_1.default, {
                aria: {
                    describedBy: this._errorId
                },
                disabled: disabled,
                invalid: invalid,
                label: label,
                maxLength: maxLength,
                minLength: minLength,
                name: name,
                placeholder: placeholder,
                readOnly: readOnly,
                required: required,
                type: type,
                value: value,
                onBlur: typeof invalid === 'undefined' ? this._onBlur : onBlur,
                onInput: this._onInput
            }),
            invalid === true ? d_1.v('span', {
                id: this._errorId,
                classes: this.theme(css.error),
                'aria-live': 'polite'
            }, [errorMessage]) : null
        ]);
    };
    ValidatedTextInput = __decorate([
        Themed_1.theme(css)
    ], ValidatedTextInput);
    return ValidatedTextInput;
}(exports.ValidatedTextInputBase));
exports.default = ValidatedTextInput;


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
            key: 'back',
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
                    return d_1.v('div', {
                        classes: _this.theme(css.task)
                    }, [task]);
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
var ValidatedTextInput_1 = __webpack_require__("./src/widgets/ValidatedTextInput.ts");
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
    WorkerForm.prototype.onFirstNameValidate = function (firstName) {
        this.properties.onFormValidate({ firstName: firstName });
    };
    WorkerForm.prototype.onLastNameValidate = function (lastName) {
        this.properties.onFormValidate({ lastName: lastName });
    };
    WorkerForm.prototype.onEmailValidate = function (email) {
        this.properties.onFormValidate({ email: email });
    };
    WorkerForm.prototype.render = function () {
        var _a = this.properties, _b = _a.formData, firstName = _b.firstName, lastName = _b.lastName, email = _b.email, formErrors = _a.formErrors;
        return d_1.v('form', {
            classes: this.theme(css.workerForm),
            novalidate: 'true',
            onsubmit: this._onSubmit
        }, [
            d_1.v('fieldset', { classes: this.theme(css.nameField) }, [
                d_1.v('legend', { classes: this.theme(css.nameLabel) }, ['Name']),
                d_1.w(ValidatedTextInput_1.default, {
                    key: 'firstNameInput',
                    label: 'First Name',
                    labelHidden: true,
                    placeholder: 'Given name',
                    value: firstName,
                    required: true,
                    onInput: this.onFirstNameInput,
                    onValidate: this.onFirstNameValidate,
                    invalid: formErrors.firstName,
                    errorMessage: 'First name is required'
                }),
                d_1.w(ValidatedTextInput_1.default, {
                    key: 'lastNameInput',
                    label: 'Last Name',
                    labelHidden: true,
                    placeholder: 'Surname name',
                    value: lastName,
                    required: true,
                    onInput: this.onLastNameInput,
                    onValidate: this.onLastNameValidate,
                    invalid: formErrors.lastName,
                    errorMessage: 'Last name is required'
                })
            ]),
            d_1.w(ValidatedTextInput_1.default, {
                label: 'Email address',
                type: 'email',
                value: email,
                required: true,
                onInput: this.onEmailInput,
                onValidate: this.onEmailValidate,
                invalid: formErrors.email,
                errorMessage: 'Please enter a valid email address'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL0Rlc3Ryb3lhYmxlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL0V2ZW50ZWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvbGFuZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vY29yZS91dWlkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9oYXMvaGFzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL01hcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9Qcm9taXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1NldC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9TeW1ib2wuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vV2Vha01hcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9hcnJheS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vaXRlcmF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vbnVtYmVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL29iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC9oYXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC9xdWV1ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L3V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL0NvbnRhaW5lci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvSW5qZWN0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL05vZGVIYW5kbGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvUmVnaXN0cnlIYW5kbGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9hbmltYXRpb25zL2Nzc1RyYW5zaXRpb25zLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2Fsd2F5c1JlbmRlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9iZWZvcmVQcm9wZXJ0aWVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvZGlmZlByb3BlcnR5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2hhbmRsZURlY29yYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9pbmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RpZmYuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21ldGEvQmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvbWV0YS9Gb2N1cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1Byb2plY3Rvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvcmVnaXN0ZXJDdXN0b21FbGVtZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS92ZG9tLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL2J1dHRvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy9jb21tb24vc3R5bGVzL2Jhc2UubS5jc3M/NTQzNiIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy9jb21tb24vc3R5bGVzL2Jhc2UubS5jc3MuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvY29tbW9uL3V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvaWNvbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy9sYWJlbC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90ZXh0LWlucHV0L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL2J1dHRvbi5tLmNzcz82ZjQ2Iiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL2J1dHRvbi5tLmNzcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS9pY29uLm0uY3NzP2I4YmUiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGhlbWUvaWNvbi5tLmNzcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS9sYWJlbC5tLmNzcz9lMmZiIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL2xhYmVsLm0uY3NzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL3RleHQtaW5wdXQubS5jc3M/YmI2MCIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS90ZXh0LWlucHV0Lm0uY3NzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3NldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3NyYy9BcHBsaWNhdGlvbkNvbnRleHQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRhaW5lcnMvV29ya2VyQ29udGFpbmVyQ29udGFpbmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jb250YWluZXJzL1dvcmtlckZvcm1Db250YWluZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4uY3NzPzg0MjEiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlcy92YWxpZGF0ZWRUZXh0SW5wdXQubS5jc3M/NDNjMSIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL3dvcmtlci5tLmNzcz81MzAxIiwid2VicGFjazovLy8uL3NyYy9zdHlsZXMvd29ya2VyQ29udGFpbmVyLm0uY3NzPzlhZDUiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlcy93b3JrZXJGb3JtLm0uY3NzP2NkNDAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3dpZGdldHMvQXBwLnRzIiwid2VicGFjazovLy8uL3NyYy93aWRnZXRzL0Jhbm5lci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvd2lkZ2V0cy9WYWxpZGF0ZWRUZXh0SW5wdXQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3dpZGdldHMvV29ya2VyLnRzIiwid2VicGFjazovLy8uL3NyYy93aWRnZXRzL1dvcmtlckNvbnRhaW5lci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvd2lkZ2V0cy9Xb3JrZXJGb3JtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87Ozs7OztBQ1ZBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixnQ0FBZ0M7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGtDOzs7Ozs7OztBQzlIQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUVBQXFFO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHNCQUFzQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1R0FBdUcscUJBQXFCO0FBQzVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsUUFBUSxnQkFBZ0I7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsMEJBQTBCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxlQUFlO0FBQ2xEO0FBQ0EsK0JBQStCLFNBQVM7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7OzhDQy9NQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCwrQjs7Ozs7Ozs7O0FDbEJBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixPQUFPO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCOzs7Ozs7OztBQ3JIQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMEJBQTBCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsbUJBQW1CO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIscUJBQXFCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsdUJBQXVCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLHNCQUFzQixxQ0FBcUM7QUFDdEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQix1QkFBdUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLDBCQUEwQjtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxzQkFBc0IscUNBQXFDO0FBQ3RHLG1CQUFtQixxQkFBcUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDLG9DQUFvQztBQUNwQyx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCx1REFBdUQ7QUFDeEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyx5Q0FBeUM7QUFDOUU7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELHNCQUFzQiwyQkFBMkI7QUFDNUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQywyQ0FBMkM7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVELHNCQUFzQiwyQkFBMkI7QUFDeEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQywwQkFBMEIsRUFBRTtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLHdCQUF3QjtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsd0NBQXdDO0FBQzNFO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCx5REFBeUQ7QUFDMUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLDJDQUEyQyx3QkFBd0I7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFOzs7Ozs7OztBQy81QkE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RkFBeUYsd0JBQXdCLEVBQUU7QUFDbkg7QUFDQTtBQUNBO0FBQ0EsMkZBQTJGLHdCQUF3QixFQUFFO0FBQ3JIO0FBQ0E7QUFDQTtBQUNBLHFGQUFxRix3QkFBd0IsRUFBRTtBQUMvRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RUFBeUU7QUFDekU7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0Esa1ZBQWtWLHNDQUFzQyxrTkFBa047QUFDMWtCLG1DQUFtQyxpQ0FBaUM7QUFDcEUsd0NBQXdDLG1CQUFtQjtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELHlCOzs7Ozs7O0FDdkhBLHlDOzs7Ozs7O2dFQ0FBO0FBQ0E7QUFDQTtBQUNBLG1GQUF5QixvQkFBb0IsRUFBRTtBQUFBO0FBQy9DLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQztBQUNELFNBQVM7QUFDVCxDQUFDLEk7Ozs7Ozs7O0FDVEQ7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUssSUFBSTtBQUNUO0FBQ0E7QUFDQSxvRDs7Ozs7Ozs7QUNUQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixvQ0FBb0M7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsOEJBQThCLGdDQUFnQztBQUM5RCwwQ0FBMEMsc0NBQXNDLDZDQUE2QztBQUM3SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELHVCOzs7Ozs7OztBQ2xEQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUVBQXlFO0FBQ3pFLGlEQUFpRCxzQ0FBc0M7QUFDdkY7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELHdCOzs7Ozs7OztBQ3REQTtBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RkFBeUYsd0JBQXdCLEVBQUU7QUFDbkg7QUFDQTtBQUNBO0FBQ0EsMkZBQTJGLHdCQUF3QixFQUFFO0FBQ3JIO0FBQ0E7QUFDQTtBQUNBLHFGQUFxRix3QkFBd0IsRUFBRTtBQUMvRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUVBQXlFO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxzQ0FBc0M7QUFDdkY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvWUFBb1k7QUFDcFk7QUFDQTtBQUNBLDZCQUE2Qix3Q0FBd0M7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsNEI7Ozs7Ozs7QUNwS0EseUM7Ozs7Ozs7Z0VDQUE7QUFDQTtBQUNBO0FBQ0EsbUZBQXlCLG9CQUFvQixFQUFFO0FBQUE7QUFDL0MsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsU0FBUztBQUNULENBQUMsSTs7Ozs7OztBQ1RELHlDOzs7Ozs7O2dFQ0FBO0FBQ0E7QUFDQTtBQUNBLG1GQUF5QixvQkFBb0IsRUFBRTtBQUFBO0FBQy9DLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQztBQUNELFNBQVM7QUFDVCxDQUFDLEk7Ozs7Ozs7QUNURCx5Qzs7Ozs7OztnRUNBQTtBQUNBO0FBQ0E7QUFDQSxtRkFBeUIsb0JBQW9CLEVBQUU7QUFBQTtBQUMvQyxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRCxTQUFTO0FBQ1QsQ0FBQyxJOzs7Ozs7O0FDVEQseUM7Ozs7Ozs7Z0VDQUE7QUFDQTtBQUNBO0FBQ0EsbUZBQXlCLG9CQUFvQixFQUFFO0FBQUE7QUFDL0MsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsU0FBUztBQUNULENBQUMsSTs7Ozs7OztBQ1REO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFVBQVU7Ozs7Ozs7O0FDdkx0QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsaUJBQWlCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQ0FBMEMsc0JBQXNCLEVBQUU7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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TSxDQUFFO1NBQ3hCLENBQUM7SUFDSCxDQUFDO0lBakZtQixXQUFVO1FBRDlCLGNBQUssQ0FBQyxHQUFHO09BQ1csVUFBVSxDQWtGOUI7SUFBRCxpQkFBQztDQWxGRCxDQUF3QyxzQkFBYztrQkFBakMsVUFBVSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJtYWluXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIm1haW5cIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wibWFpblwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIGxhbmdfMSA9IHJlcXVpcmUoXCIuL2xhbmdcIik7XHJcbnZhciBQcm9taXNlXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9Qcm9taXNlXCIpO1xyXG4vKipcclxuICogTm8gb3BlcmF0aW9uIGZ1bmN0aW9uIHRvIHJlcGxhY2Ugb3duIG9uY2UgaW5zdGFuY2UgaXMgZGVzdG9yeWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBub29wKCkge1xyXG4gICAgcmV0dXJuIFByb21pc2VfMS5kZWZhdWx0LnJlc29sdmUoZmFsc2UpO1xyXG59XHJcbi8qKlxyXG4gKiBObyBvcCBmdW5jdGlvbiB1c2VkIHRvIHJlcGxhY2Ugb3duLCBvbmNlIGluc3RhbmNlIGhhcyBiZWVuIGRlc3RvcnllZFxyXG4gKi9cclxuZnVuY3Rpb24gZGVzdHJveWVkKCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYWxsIG1hZGUgdG8gZGVzdHJveWVkIG1ldGhvZCcpO1xyXG59XHJcbnZhciBEZXN0cm95YWJsZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIERlc3Ryb3lhYmxlKCkge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcyA9IFtdO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWdpc3RlciBoYW5kbGVzIGZvciB0aGUgaW5zdGFuY2UgdGhhdCB3aWxsIGJlIGRlc3Ryb3llZCB3aGVuIGB0aGlzLmRlc3Ryb3lgIGlzIGNhbGxlZFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7SGFuZGxlfSBoYW5kbGUgVGhlIGhhbmRsZSB0byBhZGQgZm9yIHRoZSBpbnN0YW5jZVxyXG4gICAgICogQHJldHVybnMge0hhbmRsZX0gYSBoYW5kbGUgZm9yIHRoZSBoYW5kbGUsIHJlbW92ZXMgdGhlIGhhbmRsZSBmb3IgdGhlIGluc3RhbmNlIGFuZCBjYWxscyBkZXN0cm95XHJcbiAgICAgKi9cclxuICAgIERlc3Ryb3lhYmxlLnByb3RvdHlwZS5vd24gPSBmdW5jdGlvbiAoaGFuZGxlcykge1xyXG4gICAgICAgIHZhciBoYW5kbGUgPSBBcnJheS5pc0FycmF5KGhhbmRsZXMpID8gbGFuZ18xLmNyZWF0ZUNvbXBvc2l0ZUhhbmRsZS5hcHBseSh2b2lkIDAsIHRzbGliXzEuX19zcHJlYWQoaGFuZGxlcykpIDogaGFuZGxlcztcclxuICAgICAgICB2YXIgX2hhbmRsZXMgPSB0aGlzLmhhbmRsZXM7XHJcbiAgICAgICAgX2hhbmRsZXMucHVzaChoYW5kbGUpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF9oYW5kbGVzLnNwbGljZShfaGFuZGxlcy5pbmRleE9mKGhhbmRsZSkpO1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBEZXN0cnB5cyBhbGwgaGFuZGVycyByZWdpc3RlcmVkIGZvciB0aGUgaW5zdGFuY2VcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnl9IGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIG9uY2UgYWxsIGhhbmRsZXMgaGF2ZSBiZWVuIGRlc3Ryb3llZFxyXG4gICAgICovXHJcbiAgICBEZXN0cm95YWJsZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZV8xLmRlZmF1bHQoZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuICAgICAgICAgICAgX3RoaXMuaGFuZGxlcy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGUpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZSAmJiBoYW5kbGUuZGVzdHJveSAmJiBoYW5kbGUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgX3RoaXMuZGVzdHJveSA9IG5vb3A7XHJcbiAgICAgICAgICAgIF90aGlzLm93biA9IGRlc3Ryb3llZDtcclxuICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gRGVzdHJveWFibGU7XHJcbn0oKSk7XHJcbmV4cG9ydHMuRGVzdHJveWFibGUgPSBEZXN0cm95YWJsZTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gRGVzdHJveWFibGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vY29yZS9EZXN0cm95YWJsZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vY29yZS9EZXN0cm95YWJsZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIE1hcF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vTWFwXCIpO1xyXG52YXIgRGVzdHJveWFibGVfMSA9IHJlcXVpcmUoXCIuL0Rlc3Ryb3lhYmxlXCIpO1xyXG4vKipcclxuICogTWFwIG9mIGNvbXB1dGVkIHJlZ3VsYXIgZXhwcmVzc2lvbnMsIGtleWVkIGJ5IHN0cmluZ1xyXG4gKi9cclxudmFyIHJlZ2V4TWFwID0gbmV3IE1hcF8xLmRlZmF1bHQoKTtcclxuLyoqXHJcbiAqIERldGVybWluZXMgaXMgdGhlIGV2ZW50IHR5cGUgZ2xvYiBoYXMgYmVlbiBtYXRjaGVkXHJcbiAqXHJcbiAqIEByZXR1cm5zIGJvb2xlYW4gdGhhdCBpbmRpY2F0ZXMgaWYgdGhlIGdsb2IgaXMgbWF0Y2hlZFxyXG4gKi9cclxuZnVuY3Rpb24gaXNHbG9iTWF0Y2goZ2xvYlN0cmluZywgdGFyZ2V0U3RyaW5nKSB7XHJcbiAgICBpZiAodHlwZW9mIHRhcmdldFN0cmluZyA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIGdsb2JTdHJpbmcgPT09ICdzdHJpbmcnICYmIGdsb2JTdHJpbmcuaW5kZXhPZignKicpICE9PSAtMSkge1xyXG4gICAgICAgIHZhciByZWdleCA9IHZvaWQgMDtcclxuICAgICAgICBpZiAocmVnZXhNYXAuaGFzKGdsb2JTdHJpbmcpKSB7XHJcbiAgICAgICAgICAgIHJlZ2V4ID0gcmVnZXhNYXAuZ2V0KGdsb2JTdHJpbmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmVnZXggPSBuZXcgUmVnRXhwKFwiXlwiICsgZ2xvYlN0cmluZy5yZXBsYWNlKC9cXCovZywgJy4qJykgKyBcIiRcIik7XHJcbiAgICAgICAgICAgIHJlZ2V4TWFwLnNldChnbG9iU3RyaW5nLCByZWdleCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZWdleC50ZXN0KHRhcmdldFN0cmluZyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gZ2xvYlN0cmluZyA9PT0gdGFyZ2V0U3RyaW5nO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuaXNHbG9iTWF0Y2ggPSBpc0dsb2JNYXRjaDtcclxuLyoqXHJcbiAqIEV2ZW50IENsYXNzXHJcbiAqL1xyXG52YXIgRXZlbnRlZCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKEV2ZW50ZWQsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBFdmVudGVkKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIG1hcCBvZiBsaXN0ZW5lcnMga2V5ZWQgYnkgZXZlbnQgdHlwZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIF90aGlzLmxpc3RlbmVyc01hcCA9IG5ldyBNYXBfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgRXZlbnRlZC5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNNYXAuZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kcywgdHlwZSkge1xyXG4gICAgICAgICAgICBpZiAoaXNHbG9iTWF0Y2godHlwZSwgZXZlbnQudHlwZSkpIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kLmNhbGwoX3RoaXMsIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgRXZlbnRlZC5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAodHlwZSwgbGlzdGVuZXIpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGxpc3RlbmVyKSkge1xyXG4gICAgICAgICAgICB2YXIgaGFuZGxlc18xID0gbGlzdGVuZXIubWFwKGZ1bmN0aW9uIChsaXN0ZW5lcikgeyByZXR1cm4gX3RoaXMuX2FkZExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKTsgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlc18xLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZSkgeyByZXR1cm4gaGFuZGxlLmRlc3Ryb3koKTsgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcik7XHJcbiAgICB9O1xyXG4gICAgRXZlbnRlZC5wcm90b3R5cGUuX2FkZExpc3RlbmVyID0gZnVuY3Rpb24gKHR5cGUsIGxpc3RlbmVyKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnNNYXAuZ2V0KHR5cGUpIHx8IFtdO1xyXG4gICAgICAgIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcclxuICAgICAgICB0aGlzLmxpc3RlbmVyc01hcC5zZXQodHlwZSwgbGlzdGVuZXJzKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGlzdGVuZXJzID0gX3RoaXMubGlzdGVuZXJzTWFwLmdldCh0eXBlKSB8fCBbXTtcclxuICAgICAgICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UobGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEV2ZW50ZWQ7XHJcbn0oRGVzdHJveWFibGVfMS5EZXN0cm95YWJsZSkpO1xyXG5leHBvcnRzLkV2ZW50ZWQgPSBFdmVudGVkO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBFdmVudGVkO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvRXZlbnRlZC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vY29yZS9FdmVudGVkLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgb2JqZWN0XzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9vYmplY3RcIik7XHJcbnZhciBvYmplY3RfMiA9IHJlcXVpcmUoXCJAZG9qby9zaGltL29iamVjdFwiKTtcclxuZXhwb3J0cy5hc3NpZ24gPSBvYmplY3RfMi5hc3NpZ247XHJcbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcclxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcclxuLyoqXHJcbiAqIFR5cGUgZ3VhcmQgdGhhdCBlbnN1cmVzIHRoYXQgdGhlIHZhbHVlIGNhbiBiZSBjb2VyY2VkIHRvIE9iamVjdFxyXG4gKiB0byB3ZWVkIG91dCBob3N0IG9iamVjdHMgdGhhdCBkbyBub3QgZGVyaXZlIGZyb20gT2JqZWN0LlxyXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gY2hlY2sgaWYgd2Ugd2FudCB0byBkZWVwIGNvcHkgYW4gb2JqZWN0IG9yIG5vdC5cclxuICogTm90ZTogSW4gRVM2IGl0IGlzIHBvc3NpYmxlIHRvIG1vZGlmeSBhbiBvYmplY3QncyBTeW1ib2wudG9TdHJpbmdUYWcgcHJvcGVydHksIHdoaWNoIHdpbGxcclxuICogY2hhbmdlIHRoZSB2YWx1ZSByZXR1cm5lZCBieSBgdG9TdHJpbmdgLiBUaGlzIGlzIGEgcmFyZSBlZGdlIGNhc2UgdGhhdCBpcyBkaWZmaWN1bHQgdG8gaGFuZGxlLFxyXG4gKiBzbyBpdCBpcyBub3QgaGFuZGxlZCBoZXJlLlxyXG4gKiBAcGFyYW0gIHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVja1xyXG4gKiBAcmV0dXJuICAgICAgIElmIHRoZSB2YWx1ZSBpcyBjb2VyY2libGUgaW50byBhbiBPYmplY3RcclxuICovXHJcbmZ1bmN0aW9uIHNob3VsZERlZXBDb3B5T2JqZWN0KHZhbHVlKSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XHJcbn1cclxuZnVuY3Rpb24gY29weUFycmF5KGFycmF5LCBpbmhlcml0ZWQpIHtcclxuICAgIHJldHVybiBhcnJheS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gY29weUFycmF5KGl0ZW0sIGluaGVyaXRlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAhc2hvdWxkRGVlcENvcHlPYmplY3QoaXRlbSlcclxuICAgICAgICAgICAgPyBpdGVtXHJcbiAgICAgICAgICAgIDogX21peGluKHtcclxuICAgICAgICAgICAgICAgIGRlZXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBpbmhlcml0ZWQ6IGluaGVyaXRlZCxcclxuICAgICAgICAgICAgICAgIHNvdXJjZXM6IFtpdGVtXSxcclxuICAgICAgICAgICAgICAgIHRhcmdldDoge31cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBfbWl4aW4oa3dBcmdzKSB7XHJcbiAgICB2YXIgZGVlcCA9IGt3QXJncy5kZWVwO1xyXG4gICAgdmFyIGluaGVyaXRlZCA9IGt3QXJncy5pbmhlcml0ZWQ7XHJcbiAgICB2YXIgdGFyZ2V0ID0ga3dBcmdzLnRhcmdldDtcclxuICAgIHZhciBjb3BpZWQgPSBrd0FyZ3MuY29waWVkIHx8IFtdO1xyXG4gICAgdmFyIGNvcGllZENsb25lID0gdHNsaWJfMS5fX3NwcmVhZChjb3BpZWQpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrd0FyZ3Muc291cmNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBzb3VyY2UgPSBrd0FyZ3Muc291cmNlc1tpXTtcclxuICAgICAgICBpZiAoc291cmNlID09PSBudWxsIHx8IHNvdXJjZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XHJcbiAgICAgICAgICAgIGlmIChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvcGllZENsb25lLmluZGV4T2YodmFsdWUpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGRlZXApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjb3B5QXJyYXkodmFsdWUsIGluaGVyaXRlZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNob3VsZERlZXBDb3B5T2JqZWN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0VmFsdWUgPSB0YXJnZXRba2V5XSB8fCB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29waWVkLnB1c2goc291cmNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBfbWl4aW4oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVlcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaGVyaXRlZDogaW5oZXJpdGVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlczogW3ZhbHVlXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0VmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3BpZWQ6IGNvcGllZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRhcmdldDtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGUocHJvdG90eXBlKSB7XHJcbiAgICB2YXIgbWl4aW5zID0gW107XHJcbiAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIG1peGluc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgIH1cclxuICAgIGlmICghbWl4aW5zLmxlbmd0aCkge1xyXG4gICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdsYW5nLmNyZWF0ZSByZXF1aXJlcyBhdCBsZWFzdCBvbmUgbWl4aW4gb2JqZWN0LicpO1xyXG4gICAgfVxyXG4gICAgdmFyIGFyZ3MgPSBtaXhpbnMuc2xpY2UoKTtcclxuICAgIGFyZ3MudW5zaGlmdChPYmplY3QuY3JlYXRlKHByb3RvdHlwZSkpO1xyXG4gICAgcmV0dXJuIG9iamVjdF8xLmFzc2lnbi5hcHBseShudWxsLCBhcmdzKTtcclxufVxyXG5leHBvcnRzLmNyZWF0ZSA9IGNyZWF0ZTtcclxuZnVuY3Rpb24gZGVlcEFzc2lnbih0YXJnZXQpIHtcclxuICAgIHZhciBzb3VyY2VzID0gW107XHJcbiAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIHNvdXJjZXNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX21peGluKHtcclxuICAgICAgICBkZWVwOiB0cnVlLFxyXG4gICAgICAgIGluaGVyaXRlZDogZmFsc2UsXHJcbiAgICAgICAgc291cmNlczogc291cmNlcyxcclxuICAgICAgICB0YXJnZXQ6IHRhcmdldFxyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5kZWVwQXNzaWduID0gZGVlcEFzc2lnbjtcclxuZnVuY3Rpb24gZGVlcE1peGluKHRhcmdldCkge1xyXG4gICAgdmFyIHNvdXJjZXMgPSBbXTtcclxuICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgc291cmNlc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgIH1cclxuICAgIHJldHVybiBfbWl4aW4oe1xyXG4gICAgICAgIGRlZXA6IHRydWUsXHJcbiAgICAgICAgaW5oZXJpdGVkOiB0cnVlLFxyXG4gICAgICAgIHNvdXJjZXM6IHNvdXJjZXMsXHJcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXRcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuZGVlcE1peGluID0gZGVlcE1peGluO1xyXG4vKipcclxuICogQ3JlYXRlcyBhIG5ldyBvYmplY3QgdXNpbmcgdGhlIHByb3ZpZGVkIHNvdXJjZSdzIHByb3RvdHlwZSBhcyB0aGUgcHJvdG90eXBlIGZvciB0aGUgbmV3IG9iamVjdCwgYW5kIHRoZW5cclxuICogZGVlcCBjb3BpZXMgdGhlIHByb3ZpZGVkIHNvdXJjZSdzIHZhbHVlcyBpbnRvIHRoZSBuZXcgdGFyZ2V0LlxyXG4gKlxyXG4gKiBAcGFyYW0gc291cmNlIFRoZSBvYmplY3QgdG8gZHVwbGljYXRlXHJcbiAqIEByZXR1cm4gVGhlIG5ldyBvYmplY3RcclxuICovXHJcbmZ1bmN0aW9uIGR1cGxpY2F0ZShzb3VyY2UpIHtcclxuICAgIHZhciB0YXJnZXQgPSBPYmplY3QuY3JlYXRlKE9iamVjdC5nZXRQcm90b3R5cGVPZihzb3VyY2UpKTtcclxuICAgIHJldHVybiBkZWVwTWl4aW4odGFyZ2V0LCBzb3VyY2UpO1xyXG59XHJcbmV4cG9ydHMuZHVwbGljYXRlID0gZHVwbGljYXRlO1xyXG4vKipcclxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHR3byB2YWx1ZXMgYXJlIHRoZSBzYW1lIHZhbHVlLlxyXG4gKlxyXG4gKiBAcGFyYW0gYSBGaXJzdCB2YWx1ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSBiIFNlY29uZCB2YWx1ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWVzIGFyZSB0aGUgc2FtZTsgZmFsc2Ugb3RoZXJ3aXNlXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0lkZW50aWNhbChhLCBiKSB7XHJcbiAgICByZXR1cm4gKGEgPT09IGIgfHxcclxuICAgICAgICAvKiBib3RoIHZhbHVlcyBhcmUgTmFOICovXHJcbiAgICAgICAgKGEgIT09IGEgJiYgYiAhPT0gYikpO1xyXG59XHJcbmV4cG9ydHMuaXNJZGVudGljYWwgPSBpc0lkZW50aWNhbDtcclxuLyoqXHJcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGJpbmRzIGEgbWV0aG9kIHRvIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGF0IHJ1bnRpbWUuIFRoaXMgaXMgc2ltaWxhciB0b1xyXG4gKiBgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRgLCBidXQgaW5zdGVhZCBvZiBhIGZ1bmN0aW9uIGl0IHRha2VzIHRoZSBuYW1lIG9mIGEgbWV0aG9kIG9uIGFuIG9iamVjdC5cclxuICogQXMgYSByZXN1bHQsIHRoZSBmdW5jdGlvbiByZXR1cm5lZCBieSBgbGF0ZUJpbmRgIHdpbGwgYWx3YXlzIGNhbGwgdGhlIGZ1bmN0aW9uIGN1cnJlbnRseSBhc3NpZ25lZCB0b1xyXG4gKiB0aGUgc3BlY2lmaWVkIHByb3BlcnR5IG9uIHRoZSBvYmplY3QgYXMgb2YgdGhlIG1vbWVudCB0aGUgZnVuY3Rpb24gaXQgcmV0dXJucyBpcyBjYWxsZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSBpbnN0YW5jZSBUaGUgY29udGV4dCBvYmplY3RcclxuICogQHBhcmFtIG1ldGhvZCBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIG9uIHRoZSBjb250ZXh0IG9iamVjdCB0byBiaW5kIHRvIGl0c2VsZlxyXG4gKiBAcGFyYW0gc3VwcGxpZWRBcmdzIEFuIG9wdGlvbmFsIGFycmF5IG9mIHZhbHVlcyB0byBwcmVwZW5kIHRvIHRoZSBgaW5zdGFuY2VbbWV0aG9kXWAgYXJndW1lbnRzIGxpc3RcclxuICogQHJldHVybiBUaGUgYm91bmQgZnVuY3Rpb25cclxuICovXHJcbmZ1bmN0aW9uIGxhdGVCaW5kKGluc3RhbmNlLCBtZXRob2QpIHtcclxuICAgIHZhciBzdXBwbGllZEFyZ3MgPSBbXTtcclxuICAgIGZvciAodmFyIF9pID0gMjsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgc3VwcGxpZWRBcmdzW19pIC0gMl0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN1cHBsaWVkQXJncy5sZW5ndGhcclxuICAgICAgICA/IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID8gc3VwcGxpZWRBcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpIDogc3VwcGxpZWRBcmdzO1xyXG4gICAgICAgICAgICAvLyBUUzcwMTdcclxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlW21ldGhvZF0uYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gVFM3MDE3XHJcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZVttZXRob2RdLmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH07XHJcbn1cclxuZXhwb3J0cy5sYXRlQmluZCA9IGxhdGVCaW5kO1xyXG5mdW5jdGlvbiBtaXhpbih0YXJnZXQpIHtcclxuICAgIHZhciBzb3VyY2VzID0gW107XHJcbiAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIHNvdXJjZXNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX21peGluKHtcclxuICAgICAgICBkZWVwOiBmYWxzZSxcclxuICAgICAgICBpbmhlcml0ZWQ6IHRydWUsXHJcbiAgICAgICAgc291cmNlczogc291cmNlcyxcclxuICAgICAgICB0YXJnZXQ6IHRhcmdldFxyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5taXhpbiA9IG1peGluO1xyXG4vKipcclxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHdoaWNoIGludm9rZXMgdGhlIGdpdmVuIGZ1bmN0aW9uIHdpdGggdGhlIGdpdmVuIGFyZ3VtZW50cyBwcmVwZW5kZWQgdG8gaXRzIGFyZ3VtZW50IGxpc3QuXHJcbiAqIExpa2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kYCwgYnV0IGRvZXMgbm90IGFsdGVyIGV4ZWN1dGlvbiBjb250ZXh0LlxyXG4gKlxyXG4gKiBAcGFyYW0gdGFyZ2V0RnVuY3Rpb24gVGhlIGZ1bmN0aW9uIHRoYXQgbmVlZHMgdG8gYmUgYm91bmRcclxuICogQHBhcmFtIHN1cHBsaWVkQXJncyBBbiBvcHRpb25hbCBhcnJheSBvZiBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aGUgYHRhcmdldEZ1bmN0aW9uYCBhcmd1bWVudHMgbGlzdFxyXG4gKiBAcmV0dXJuIFRoZSBib3VuZCBmdW5jdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gcGFydGlhbCh0YXJnZXRGdW5jdGlvbikge1xyXG4gICAgdmFyIHN1cHBsaWVkQXJncyA9IFtdO1xyXG4gICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICBzdXBwbGllZEFyZ3NbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA/IHN1cHBsaWVkQXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSA6IHN1cHBsaWVkQXJncztcclxuICAgICAgICByZXR1cm4gdGFyZ2V0RnVuY3Rpb24uYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMucGFydGlhbCA9IHBhcnRpYWw7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIGEgZGVzdHJveSBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIGNhbGxzIHRoZSBwYXNzZWQtaW4gZGVzdHJ1Y3Rvci5cclxuICogVGhpcyBpcyBpbnRlbmRlZCB0byBwcm92aWRlIGEgdW5pZmllZCBpbnRlcmZhY2UgZm9yIGNyZWF0aW5nIFwicmVtb3ZlXCIgLyBcImRlc3Ryb3lcIiBoYW5kbGVycyBmb3JcclxuICogZXZlbnQgbGlzdGVuZXJzLCB0aW1lcnMsIGV0Yy5cclxuICpcclxuICogQHBhcmFtIGRlc3RydWN0b3IgQSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIGhhbmRsZSdzIGBkZXN0cm95YCBtZXRob2QgaXMgaW52b2tlZFxyXG4gKiBAcmV0dXJuIFRoZSBoYW5kbGUgb2JqZWN0XHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVIYW5kbGUoZGVzdHJ1Y3Rvcikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHsgfTtcclxuICAgICAgICAgICAgZGVzdHJ1Y3Rvci5jYWxsKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5jcmVhdGVIYW5kbGUgPSBjcmVhdGVIYW5kbGU7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgc2luZ2xlIGhhbmRsZSB0aGF0IGNhbiBiZSB1c2VkIHRvIGRlc3Ryb3kgbXVsdGlwbGUgaGFuZGxlcyBzaW11bHRhbmVvdXNseS5cclxuICpcclxuICogQHBhcmFtIGhhbmRsZXMgQW4gYXJyYXkgb2YgaGFuZGxlcyB3aXRoIGBkZXN0cm95YCBtZXRob2RzXHJcbiAqIEByZXR1cm4gVGhlIGhhbmRsZSBvYmplY3RcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZUNvbXBvc2l0ZUhhbmRsZSgpIHtcclxuICAgIHZhciBoYW5kbGVzID0gW107XHJcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIGhhbmRsZXNbX2ldID0gYXJndW1lbnRzW19pXTtcclxuICAgIH1cclxuICAgIHJldHVybiBjcmVhdGVIYW5kbGUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGFuZGxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBoYW5kbGVzW2ldLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmNyZWF0ZUNvbXBvc2l0ZUhhbmRsZSA9IGNyZWF0ZUNvbXBvc2l0ZUhhbmRsZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL2xhbmcuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2NvcmUvbGFuZy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vKipcclxuICogUmV0dXJucyBhIHY0IGNvbXBsaWFudCBVVUlELlxyXG4gKlxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24gdXVpZCgpIHtcclxuICAgIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XHJcbiAgICAgICAgdmFyIHIgPSAoTWF0aC5yYW5kb20oKSAqIDE2KSB8IDAsIHYgPSBjID09PSAneCcgPyByIDogKHIgJiAweDMpIHwgMHg4O1xyXG4gICAgICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IHV1aWQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vY29yZS91dWlkLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9jb3JlL3V1aWQuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZnVuY3Rpb24gaXNGZWF0dXJlVGVzdFRoZW5hYmxlKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdmFsdWUgJiYgdmFsdWUudGhlbjtcclxufVxyXG4vKipcclxuICogQSBjYWNoZSBvZiByZXN1bHRzIG9mIGZlYXR1cmUgdGVzdHNcclxuICovXHJcbmV4cG9ydHMudGVzdENhY2hlID0ge307XHJcbi8qKlxyXG4gKiBBIGNhY2hlIG9mIHRoZSB1bi1yZXNvbHZlZCBmZWF0dXJlIHRlc3RzXHJcbiAqL1xyXG5leHBvcnRzLnRlc3RGdW5jdGlvbnMgPSB7fTtcclxuLyoqXHJcbiAqIEEgY2FjaGUgb2YgdW5yZXNvbHZlZCB0aGVuYWJsZXMgKHByb2JhYmx5IHByb21pc2VzKVxyXG4gKiBAdHlwZSB7e319XHJcbiAqL1xyXG52YXIgdGVzdFRoZW5hYmxlcyA9IHt9O1xyXG4vKipcclxuICogQSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBzY29wZSAoYHdpbmRvd2AgaW4gYSBicm93c2VyLCBgZ2xvYmFsYCBpbiBOb2RlSlMpXHJcbiAqL1xyXG52YXIgZ2xvYmFsU2NvcGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIC8vIEJyb3dzZXJzXHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdztcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgLy8gTm9kZVxyXG4gICAgICAgIHJldHVybiBnbG9iYWw7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvLyBXZWIgd29ya2Vyc1xyXG4gICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgfVxyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgIHJldHVybiB7fTtcclxufSkoKTtcclxuLyogR3JhYiB0aGUgc3RhdGljRmVhdHVyZXMgaWYgdGhlcmUgYXJlIGF2YWlsYWJsZSAqL1xyXG52YXIgc3RhdGljRmVhdHVyZXMgPSAoZ2xvYmFsU2NvcGUuRG9qb0hhc0Vudmlyb25tZW50IHx8IHt9KS5zdGF0aWNGZWF0dXJlcztcclxuLyogQ2xlYW5pbmcgdXAgdGhlIERvam9IYXNFbnZpb3JubWVudCAqL1xyXG5pZiAoJ0Rvam9IYXNFbnZpcm9ubWVudCcgaW4gZ2xvYmFsU2NvcGUpIHtcclxuICAgIGRlbGV0ZSBnbG9iYWxTY29wZS5Eb2pvSGFzRW52aXJvbm1lbnQ7XHJcbn1cclxuLyoqXHJcbiAqIEN1c3RvbSB0eXBlIGd1YXJkIHRvIG5hcnJvdyB0aGUgYHN0YXRpY0ZlYXR1cmVzYCB0byBlaXRoZXIgYSBtYXAgb3IgYSBmdW5jdGlvbiB0aGF0XHJcbiAqIHJldHVybnMgYSBtYXAuXHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gZ3VhcmQgZm9yXHJcbiAqL1xyXG5mdW5jdGlvbiBpc1N0YXRpY0ZlYXR1cmVGdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcclxufVxyXG4vKipcclxuICogVGhlIGNhY2hlIG9mIGFzc2VydGVkIGZlYXR1cmVzIHRoYXQgd2VyZSBhdmFpbGFibGUgaW4gdGhlIGdsb2JhbCBzY29wZSB3aGVuIHRoZVxyXG4gKiBtb2R1bGUgbG9hZGVkXHJcbiAqL1xyXG52YXIgc3RhdGljQ2FjaGUgPSBzdGF0aWNGZWF0dXJlc1xyXG4gICAgPyBpc1N0YXRpY0ZlYXR1cmVGdW5jdGlvbihzdGF0aWNGZWF0dXJlcykgPyBzdGF0aWNGZWF0dXJlcy5hcHBseShnbG9iYWxTY29wZSkgOiBzdGF0aWNGZWF0dXJlc1xyXG4gICAgOiB7fTsvKiBQcm92aWRpbmcgYW4gZW1wdHkgY2FjaGUsIGlmIG5vbmUgd2FzIGluIHRoZSBlbnZpcm9ubWVudFxyXG5cclxuLyoqXHJcbiogQU1EIHBsdWdpbiBmdW5jdGlvbi5cclxuKlxyXG4qIENvbmRpdGlvbmFsIGxvYWRzIG1vZHVsZXMgYmFzZWQgb24gYSBoYXMgZmVhdHVyZSB0ZXN0IHZhbHVlLlxyXG4qXHJcbiogQHBhcmFtIHJlc291cmNlSWQgR2l2ZXMgdGhlIHJlc29sdmVkIG1vZHVsZSBpZCB0byBsb2FkLlxyXG4qIEBwYXJhbSByZXF1aXJlIFRoZSBsb2FkZXIgcmVxdWlyZSBmdW5jdGlvbiB3aXRoIHJlc3BlY3QgdG8gdGhlIG1vZHVsZSB0aGF0IGNvbnRhaW5lZCB0aGUgcGx1Z2luIHJlc291cmNlIGluIGl0c1xyXG4qICAgICAgICAgICAgICAgIGRlcGVuZGVuY3kgbGlzdC5cclxuKiBAcGFyYW0gbG9hZCBDYWxsYmFjayB0byBsb2FkZXIgdGhhdCBjb25zdW1lcyByZXN1bHQgb2YgcGx1Z2luIGRlbWFuZC5cclxuKi9cclxuZnVuY3Rpb24gbG9hZChyZXNvdXJjZUlkLCByZXF1aXJlLCBsb2FkLCBjb25maWcpIHtcclxuICAgIHJlc291cmNlSWQgPyByZXF1aXJlKFtyZXNvdXJjZUlkXSwgbG9hZCkgOiBsb2FkKCk7XHJcbn1cclxuZXhwb3J0cy5sb2FkID0gbG9hZDtcclxuLyoqXHJcbiAqIEFNRCBwbHVnaW4gZnVuY3Rpb24uXHJcbiAqXHJcbiAqIFJlc29sdmVzIHJlc291cmNlSWQgaW50byBhIG1vZHVsZSBpZCBiYXNlZCBvbiBwb3NzaWJseS1uZXN0ZWQgdGVuYXJ5IGV4cHJlc3Npb24gdGhhdCBicmFuY2hlcyBvbiBoYXMgZmVhdHVyZSB0ZXN0XHJcbiAqIHZhbHVlKHMpLlxyXG4gKlxyXG4gKiBAcGFyYW0gcmVzb3VyY2VJZCBUaGUgaWQgb2YgdGhlIG1vZHVsZVxyXG4gKiBAcGFyYW0gbm9ybWFsaXplIFJlc29sdmVzIGEgcmVsYXRpdmUgbW9kdWxlIGlkIGludG8gYW4gYWJzb2x1dGUgbW9kdWxlIGlkXHJcbiAqL1xyXG5mdW5jdGlvbiBub3JtYWxpemUocmVzb3VyY2VJZCwgbm9ybWFsaXplKSB7XHJcbiAgICB2YXIgdG9rZW5zID0gcmVzb3VyY2VJZC5tYXRjaCgvW1xcPzpdfFteOlxcP10qL2cpIHx8IFtdO1xyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgZnVuY3Rpb24gZ2V0KHNraXApIHtcclxuICAgICAgICB2YXIgdGVybSA9IHRva2Vuc1tpKytdO1xyXG4gICAgICAgIGlmICh0ZXJtID09PSAnOicpIHtcclxuICAgICAgICAgICAgLy8gZW1wdHkgc3RyaW5nIG1vZHVsZSBuYW1lLCByZXNvbHZlcyB0byBudWxsXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gcG9zdGZpeGVkIHdpdGggYSA/IG1lYW5zIGl0IGlzIGEgZmVhdHVyZSB0byBicmFuY2ggb24sIHRoZSB0ZXJtIGlzIHRoZSBuYW1lIG9mIHRoZSBmZWF0dXJlXHJcbiAgICAgICAgICAgIGlmICh0b2tlbnNbaSsrXSA9PT0gJz8nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNraXAgJiYgaGFzKHRlcm0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF0Y2hlZCB0aGUgZmVhdHVyZSwgZ2V0IHRoZSBmaXJzdCB2YWx1ZSBmcm9tIHRoZSBvcHRpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZGlkIG5vdCBtYXRjaCwgZ2V0IHRoZSBzZWNvbmQgdmFsdWUsIHBhc3Npbmcgb3ZlciB0aGUgZmlyc3RcclxuICAgICAgICAgICAgICAgICAgICBnZXQodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldChza2lwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBhIG1vZHVsZVxyXG4gICAgICAgICAgICByZXR1cm4gdGVybTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB2YXIgaWQgPSBnZXQoKTtcclxuICAgIHJldHVybiBpZCAmJiBub3JtYWxpemUoaWQpO1xyXG59XHJcbmV4cG9ydHMubm9ybWFsaXplID0gbm9ybWFsaXplO1xyXG4vKipcclxuICogQ2hlY2sgaWYgYSBmZWF0dXJlIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZFxyXG4gKlxyXG4gKiBAcGFyYW0gZmVhdHVyZSB0aGUgbmFtZSBvZiB0aGUgZmVhdHVyZVxyXG4gKi9cclxuZnVuY3Rpb24gZXhpc3RzKGZlYXR1cmUpIHtcclxuICAgIHZhciBub3JtYWxpemVkRmVhdHVyZSA9IGZlYXR1cmUudG9Mb3dlckNhc2UoKTtcclxuICAgIHJldHVybiBCb29sZWFuKG5vcm1hbGl6ZWRGZWF0dXJlIGluIHN0YXRpY0NhY2hlIHx8IG5vcm1hbGl6ZWRGZWF0dXJlIGluIGV4cG9ydHMudGVzdENhY2hlIHx8IGV4cG9ydHMudGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV0pO1xyXG59XHJcbmV4cG9ydHMuZXhpc3RzID0gZXhpc3RzO1xyXG4vKipcclxuICogUmVnaXN0ZXIgYSBuZXcgdGVzdCBmb3IgYSBuYW1lZCBmZWF0dXJlLlxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBoYXMuYWRkKCdkb20tYWRkZXZlbnRsaXN0ZW5lcicsICEhZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcik7XHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGhhcy5hZGQoJ3RvdWNoLWV2ZW50cycsIGZ1bmN0aW9uICgpIHtcclxuICogICAgcmV0dXJuICdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50XHJcbiAqIH0pO1xyXG4gKlxyXG4gKiBAcGFyYW0gZmVhdHVyZSB0aGUgbmFtZSBvZiB0aGUgZmVhdHVyZVxyXG4gKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIHJlcG9ydGVkIG9mIHRoZSBmZWF0dXJlLCBvciBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBvbmNlIG9uIGZpcnN0IHRlc3RcclxuICogQHBhcmFtIG92ZXJ3cml0ZSBpZiBhbiBleGlzdGluZyB2YWx1ZSBzaG91bGQgYmUgb3ZlcndyaXR0ZW4uIERlZmF1bHRzIHRvIGZhbHNlLlxyXG4gKi9cclxuZnVuY3Rpb24gYWRkKGZlYXR1cmUsIHZhbHVlLCBvdmVyd3JpdGUpIHtcclxuICAgIGlmIChvdmVyd3JpdGUgPT09IHZvaWQgMCkgeyBvdmVyd3JpdGUgPSBmYWxzZTsgfVxyXG4gICAgdmFyIG5vcm1hbGl6ZWRGZWF0dXJlID0gZmVhdHVyZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgaWYgKGV4aXN0cyhub3JtYWxpemVkRmVhdHVyZSkgJiYgIW92ZXJ3cml0ZSAmJiAhKG5vcm1hbGl6ZWRGZWF0dXJlIGluIHN0YXRpY0NhY2hlKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGZWF0dXJlIFxcXCJcIiArIGZlYXR1cmUgKyBcIlxcXCIgZXhpc3RzIGFuZCBvdmVyd3JpdGUgbm90IHRydWUuXCIpO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIGV4cG9ydHMudGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV0gPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzRmVhdHVyZVRlc3RUaGVuYWJsZSh2YWx1ZSkpIHtcclxuICAgICAgICB0ZXN0VGhlbmFibGVzW2ZlYXR1cmVdID0gdmFsdWUudGhlbihmdW5jdGlvbiAocmVzb2x2ZWRWYWx1ZSkge1xyXG4gICAgICAgICAgICBleHBvcnRzLnRlc3RDYWNoZVtmZWF0dXJlXSA9IHJlc29sdmVkVmFsdWU7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0ZXN0VGhlbmFibGVzW2ZlYXR1cmVdO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRlc3RUaGVuYWJsZXNbZmVhdHVyZV07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBleHBvcnRzLnRlc3RDYWNoZVtub3JtYWxpemVkRmVhdHVyZV0gPSB2YWx1ZTtcclxuICAgICAgICBkZWxldGUgZXhwb3J0cy50ZXN0RnVuY3Rpb25zW25vcm1hbGl6ZWRGZWF0dXJlXTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmFkZCA9IGFkZDtcclxuLyoqXHJcbiAqIFJldHVybiB0aGUgY3VycmVudCB2YWx1ZSBvZiBhIG5hbWVkIGZlYXR1cmUuXHJcbiAqXHJcbiAqIEBwYXJhbSBmZWF0dXJlIFRoZSBuYW1lIChpZiBhIHN0cmluZykgb3IgaWRlbnRpZmllciAoaWYgYW4gaW50ZWdlcikgb2YgdGhlIGZlYXR1cmUgdG8gdGVzdC5cclxuICovXHJcbmZ1bmN0aW9uIGhhcyhmZWF0dXJlKSB7XHJcbiAgICB2YXIgcmVzdWx0O1xyXG4gICAgdmFyIG5vcm1hbGl6ZWRGZWF0dXJlID0gZmVhdHVyZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgaWYgKG5vcm1hbGl6ZWRGZWF0dXJlIGluIHN0YXRpY0NhY2hlKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gc3RhdGljQ2FjaGVbbm9ybWFsaXplZEZlYXR1cmVdO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZXhwb3J0cy50ZXN0RnVuY3Rpb25zW25vcm1hbGl6ZWRGZWF0dXJlXSkge1xyXG4gICAgICAgIHJlc3VsdCA9IGV4cG9ydHMudGVzdENhY2hlW25vcm1hbGl6ZWRGZWF0dXJlXSA9IGV4cG9ydHMudGVzdEZ1bmN0aW9uc1tub3JtYWxpemVkRmVhdHVyZV0uY2FsbChudWxsKTtcclxuICAgICAgICBkZWxldGUgZXhwb3J0cy50ZXN0RnVuY3Rpb25zW25vcm1hbGl6ZWRGZWF0dXJlXTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG5vcm1hbGl6ZWRGZWF0dXJlIGluIGV4cG9ydHMudGVzdENhY2hlKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gZXhwb3J0cy50ZXN0Q2FjaGVbbm9ybWFsaXplZEZlYXR1cmVdO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZmVhdHVyZSBpbiB0ZXN0VGhlbmFibGVzKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkF0dGVtcHQgdG8gZGV0ZWN0IHVucmVnaXN0ZXJlZCBoYXMgZmVhdHVyZSBcXFwiXCIgKyBmZWF0dXJlICsgXCJcXFwiXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBoYXM7XHJcbi8qXHJcbiAqIE91dCBvZiB0aGUgYm94IGZlYXR1cmUgdGVzdHNcclxuICovXHJcbi8qIEVudmlyb25tZW50cyAqL1xyXG4vKiBVc2VkIGFzIGEgdmFsdWUgdG8gcHJvdmlkZSBhIGRlYnVnIG9ubHkgY29kZSBwYXRoICovXHJcbmFkZCgnZGVidWcnLCB0cnVlKTtcclxuLyogRGV0ZWN0cyBpZiB0aGUgZW52aXJvbm1lbnQgaXMgXCJicm93c2VyIGxpa2VcIiAqL1xyXG5hZGQoJ2hvc3QtYnJvd3NlcicsIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGxvY2F0aW9uICE9PSAndW5kZWZpbmVkJyk7XHJcbi8qIERldGVjdHMgaWYgdGhlIGVudmlyb25tZW50IGFwcGVhcnMgdG8gYmUgTm9kZUpTICovXHJcbmFkZCgnaG9zdC1ub2RlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLnZlcnNpb25zICYmIHByb2Nlc3MudmVyc2lvbnMubm9kZSkge1xyXG4gICAgICAgIHJldHVybiBwcm9jZXNzLnZlcnNpb25zLm5vZGU7XHJcbiAgICB9XHJcbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2hhcy9oYXMuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL2hhcy9oYXMuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBpdGVyYXRvcl8xID0gcmVxdWlyZShcIi4vaXRlcmF0b3JcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuL2dsb2JhbFwiKTtcclxudmFyIG9iamVjdF8xID0gcmVxdWlyZShcIi4vb2JqZWN0XCIpO1xyXG52YXIgaGFzXzEgPSByZXF1aXJlKFwiLi9zdXBwb3J0L2hhc1wiKTtcclxucmVxdWlyZShcIi4vU3ltYm9sXCIpO1xyXG5leHBvcnRzLk1hcCA9IGdsb2JhbF8xLmRlZmF1bHQuTWFwO1xyXG5pZiAoIWhhc18xLmRlZmF1bHQoJ2VzNi1tYXAnKSkge1xyXG4gICAgZXhwb3J0cy5NYXAgPSAoX2EgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIE1hcChpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fa2V5cyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzW1N5bWJvbC50b1N0cmluZ1RhZ10gPSAnTWFwJztcclxuICAgICAgICAgICAgICAgIGlmIChpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVyYXRvcl8xLmlzQXJyYXlMaWtlKGl0ZXJhYmxlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZXJhYmxlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBpdGVyYWJsZVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KHZhbHVlWzBdLCB2YWx1ZVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpdGVyYWJsZV8xID0gdHNsaWJfMS5fX3ZhbHVlcyhpdGVyYWJsZSksIGl0ZXJhYmxlXzFfMSA9IGl0ZXJhYmxlXzEubmV4dCgpOyAhaXRlcmFibGVfMV8xLmRvbmU7IGl0ZXJhYmxlXzFfMSA9IGl0ZXJhYmxlXzEubmV4dCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gaXRlcmFibGVfMV8xLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KHZhbHVlWzBdLCB2YWx1ZVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVfMV8xKSB7IGVfMSA9IHsgZXJyb3I6IGVfMV8xIH07IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVyYWJsZV8xXzEgJiYgIWl0ZXJhYmxlXzFfMS5kb25lICYmIChfYSA9IGl0ZXJhYmxlXzEucmV0dXJuKSkgX2EuY2FsbChpdGVyYWJsZV8xKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBlXzEsIF9hO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBBbiBhbHRlcm5hdGl2ZSB0byBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiB1c2luZyBPYmplY3QuaXNcclxuICAgICAgICAgICAgICogdG8gY2hlY2sgZm9yIGVxdWFsaXR5LiBTZWUgaHR0cDovL216bC5sYS8xenVLTzJWXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBNYXAucHJvdG90eXBlLl9pbmRleE9mS2V5ID0gZnVuY3Rpb24gKGtleXMsIGtleSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aF8xID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGhfMTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iamVjdF8xLmlzKGtleXNbaV0sIGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWFwLnByb3RvdHlwZSwgXCJzaXplXCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9rZXlzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBNYXAucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fa2V5cy5sZW5ndGggPSB0aGlzLl92YWx1ZXMubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9pbmRleE9mS2V5KHRoaXMuX2tleXMsIGtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fa2V5cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZXMgPSB0aGlzLl9rZXlzLm1hcChmdW5jdGlvbiAoa2V5LCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtrZXksIF90aGlzLl92YWx1ZXNbaV1dO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGl0ZXJhdG9yXzEuU2hpbUl0ZXJhdG9yKHZhbHVlcyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSB0aGlzLl9rZXlzO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IHRoaXMuX3ZhbHVlcztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGhfMiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoXzI7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdmFsdWVzW2ldLCBrZXlzW2ldLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9pbmRleE9mS2V5KHRoaXMuX2tleXMsIGtleSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogdGhpcy5fdmFsdWVzW2luZGV4XTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faW5kZXhPZktleSh0aGlzLl9rZXlzLCBrZXkpID4gLTE7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgaXRlcmF0b3JfMS5TaGltSXRlcmF0b3IodGhpcy5fa2V5cyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2luZGV4T2ZLZXkodGhpcy5fa2V5cywga2V5KTtcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gaW5kZXggPCAwID8gdGhpcy5fa2V5cy5sZW5ndGggOiBpbmRleDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2tleXNbaW5kZXhdID0ga2V5O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVzW2luZGV4XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE1hcC5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBpdGVyYXRvcl8xLlNoaW1JdGVyYXRvcih0aGlzLl92YWx1ZXMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNYXAucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lbnRyaWVzKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBNYXA7XHJcbiAgICAgICAgfSgpKSxcclxuICAgICAgICBfYVtTeW1ib2wuc3BlY2llc10gPSBfYSxcclxuICAgICAgICBfYSk7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5NYXA7XHJcbnZhciBfYTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL01hcC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9NYXAuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuL2dsb2JhbFwiKTtcclxudmFyIHF1ZXVlXzEgPSByZXF1aXJlKFwiLi9zdXBwb3J0L3F1ZXVlXCIpO1xyXG5yZXF1aXJlKFwiLi9TeW1ib2xcIik7XHJcbnZhciBoYXNfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvaGFzXCIpO1xyXG5leHBvcnRzLlNoaW1Qcm9taXNlID0gZ2xvYmFsXzEuZGVmYXVsdC5Qcm9taXNlO1xyXG5leHBvcnRzLmlzVGhlbmFibGUgPSBmdW5jdGlvbiBpc1RoZW5hYmxlKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRoZW4gPT09ICdmdW5jdGlvbic7XHJcbn07XHJcbmlmICghaGFzXzEuZGVmYXVsdCgnZXM2LXByb21pc2UnKSkge1xyXG4gICAgZ2xvYmFsXzEuZGVmYXVsdC5Qcm9taXNlID0gZXhwb3J0cy5TaGltUHJvbWlzZSA9IChfYSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIENyZWF0ZXMgYSBuZXcgUHJvbWlzZS5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSBleGVjdXRvclxyXG4gICAgICAgICAgICAgKiBUaGUgZXhlY3V0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIGltbWVkaWF0ZWx5IHdoZW4gdGhlIFByb21pc2UgaXMgaW5zdGFudGlhdGVkLiBJdCBpcyByZXNwb25zaWJsZSBmb3JcclxuICAgICAgICAgICAgICogc3RhcnRpbmcgdGhlIGFzeW5jaHJvbm91cyBvcGVyYXRpb24gd2hlbiBpdCBpcyBpbnZva2VkLlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBUaGUgZXhlY3V0b3IgbXVzdCBjYWxsIGVpdGhlciB0aGUgcGFzc2VkIGByZXNvbHZlYCBmdW5jdGlvbiB3aGVuIHRoZSBhc3luY2hyb25vdXMgb3BlcmF0aW9uIGhhcyBjb21wbGV0ZWRcclxuICAgICAgICAgICAgICogc3VjY2Vzc2Z1bGx5LCBvciB0aGUgYHJlamVjdGAgZnVuY3Rpb24gd2hlbiB0aGUgb3BlcmF0aW9uIGZhaWxzLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcikge1xyXG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogVGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhpcyBwcm9taXNlLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gMSAvKiBQZW5kaW5nICovO1xyXG4gICAgICAgICAgICAgICAgdGhpc1tTeW1ib2wudG9TdHJpbmdUYWddID0gJ1Byb21pc2UnO1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBJZiB0cnVlLCB0aGUgcmVzb2x1dGlvbiBvZiB0aGlzIHByb21pc2UgaXMgY2hhaW5lZCAoXCJsb2NrZWQgaW5cIikgdG8gYW5vdGhlciBwcm9taXNlLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgaXNDaGFpbmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFdoZXRoZXIgb3Igbm90IHRoaXMgcHJvbWlzZSBpcyBpbiBhIHJlc29sdmVkIHN0YXRlLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgaXNSZXNvbHZlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuc3RhdGUgIT09IDEgLyogUGVuZGluZyAqLyB8fCBpc0NoYWluZWQ7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBDYWxsYmFja3MgdGhhdCBzaG91bGQgYmUgaW52b2tlZCBvbmNlIHRoZSBhc3luY2hyb25vdXMgb3BlcmF0aW9uIGhhcyBjb21wbGV0ZWQuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciBjYWxsYmFja3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogSW5pdGlhbGx5IHB1c2hlcyBjYWxsYmFja3Mgb250byBhIHF1ZXVlIGZvciBleGVjdXRpb24gb25jZSB0aGlzIHByb21pc2Ugc2V0dGxlcy4gQWZ0ZXIgdGhlIHByb21pc2Ugc2V0dGxlcyxcclxuICAgICAgICAgICAgICAgICAqIGVucXVldWVzIGNhbGxiYWNrcyBmb3IgZXhlY3V0aW9uIG9uIHRoZSBuZXh0IGV2ZW50IGxvb3AgdHVybi5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIHdoZW5GaW5pc2hlZCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFNldHRsZXMgdGhpcyBwcm9taXNlLlxyXG4gICAgICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSBuZXdTdGF0ZSBUaGUgcmVzb2x2ZWQgc3RhdGUgZm9yIHRoaXMgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7VHxhbnl9IHZhbHVlIFRoZSByZXNvbHZlZCB2YWx1ZSBmb3IgdGhpcyBwcm9taXNlLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICB2YXIgc2V0dGxlID0gZnVuY3Rpb24gKG5ld1N0YXRlLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEEgcHJvbWlzZSBjYW4gb25seSBiZSBzZXR0bGVkIG9uY2UuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKF90aGlzLnN0YXRlICE9PSAxIC8qIFBlbmRpbmcgKi8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zdGF0ZSA9IG5ld1N0YXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnJlc29sdmVkVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB3aGVuRmluaXNoZWQgPSBxdWV1ZV8xLnF1ZXVlTWljcm9UYXNrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIE9ubHkgZW5xdWV1ZSBhIGNhbGxiYWNrIHJ1bm5lciBpZiB0aGVyZSBhcmUgY2FsbGJhY2tzIHNvIHRoYXQgaW5pdGlhbGx5IGZ1bGZpbGxlZCBQcm9taXNlcyBkb24ndCBoYXZlIHRvXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gd2FpdCBhbiBleHRyYSB0dXJuLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja3MgJiYgY2FsbGJhY2tzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVldWVfMS5xdWV1ZU1pY3JvVGFzayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvdW50ID0gY2FsbGJhY2tzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzW2ldLmNhbGwobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFJlc29sdmVzIHRoaXMgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gbmV3U3RhdGUgVGhlIHJlc29sdmVkIHN0YXRlIGZvciB0aGlzIHByb21pc2UuXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1R8YW55fSB2YWx1ZSBUaGUgcmVzb2x2ZWQgdmFsdWUgZm9yIHRoaXMgcHJvbWlzZS5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc29sdmUgPSBmdW5jdGlvbiAobmV3U3RhdGUsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzUmVzb2x2ZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChleHBvcnRzLmlzVGhlbmFibGUodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnRoZW4oc2V0dGxlLmJpbmQobnVsbCwgMCAvKiBGdWxmaWxsZWQgKi8pLCBzZXR0bGUuYmluZChudWxsLCAyIC8qIFJlamVjdGVkICovKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2hhaW5lZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0bGUobmV3U3RhdGUsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aGVuID0gZnVuY3Rpb24gKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hlbkZpbmlzaGVkIGluaXRpYWxseSBxdWV1ZXMgdXAgY2FsbGJhY2tzIGZvciBleGVjdXRpb24gYWZ0ZXIgdGhlIHByb21pc2UgaGFzIHNldHRsZWQuIE9uY2UgdGhlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHByb21pc2UgaGFzIHNldHRsZWQsIHdoZW5GaW5pc2hlZCB3aWxsIHNjaGVkdWxlIGNhbGxiYWNrcyBmb3IgZXhlY3V0aW9uIG9uIHRoZSBuZXh0IHR1cm4gdGhyb3VnaCB0aGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXZlbnQgbG9vcC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2hlbkZpbmlzaGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IF90aGlzLnN0YXRlID09PSAyIC8qIFJlamVjdGVkICovID8gb25SZWplY3RlZCA6IG9uRnVsZmlsbGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY2FsbGJhY2soX3RoaXMucmVzb2x2ZWRWYWx1ZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChfdGhpcy5zdGF0ZSA9PT0gMiAvKiBSZWplY3RlZCAqLykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChfdGhpcy5yZXNvbHZlZFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoX3RoaXMucmVzb2x2ZWRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhlY3V0b3IocmVzb2x2ZS5iaW5kKG51bGwsIDAgLyogRnVsZmlsbGVkICovKSwgcmVzb2x2ZS5iaW5kKG51bGwsIDIgLyogUmVqZWN0ZWQgKi8pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldHRsZSgyIC8qIFJlamVjdGVkICovLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgUHJvbWlzZS5hbGwgPSBmdW5jdGlvbiAoaXRlcmFibGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcyhmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wbGV0ZSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvdGFsID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9wdWxhdGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZnVsZmlsbChpbmRleCwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzW2luZGV4XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArK2NvbXBsZXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5pc2goKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZmluaXNoKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocG9wdWxhdGluZyB8fCBjb21wbGV0ZSA8IHRvdGFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh2YWx1ZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBwcm9jZXNzSXRlbShpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArK3RvdGFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhwb3J0cy5pc1RoZW5hYmxlKGl0ZW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBhbiBpdGVtIFByb21pc2UgcmVqZWN0cywgdGhpcyBQcm9taXNlIGlzIGltbWVkaWF0ZWx5IHJlamVjdGVkIHdpdGggdGhlIGl0ZW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFByb21pc2UncyByZWplY3Rpb24gZXJyb3IuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnRoZW4oZnVsZmlsbC5iaW5kKG51bGwsIGluZGV4KSwgcmVqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZShpdGVtKS50aGVuKGZ1bGZpbGwuYmluZChudWxsLCBpbmRleCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpdGVyYWJsZV8xID0gdHNsaWJfMS5fX3ZhbHVlcyhpdGVyYWJsZSksIGl0ZXJhYmxlXzFfMSA9IGl0ZXJhYmxlXzEubmV4dCgpOyAhaXRlcmFibGVfMV8xLmRvbmU7IGl0ZXJhYmxlXzFfMSA9IGl0ZXJhYmxlXzEubmV4dCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBpdGVyYWJsZV8xXzEudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzSXRlbShpLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVfMV8xKSB7IGVfMSA9IHsgZXJyb3I6IGVfMV8xIH07IH1cclxuICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVyYWJsZV8xXzEgJiYgIWl0ZXJhYmxlXzFfMS5kb25lICYmIChfYSA9IGl0ZXJhYmxlXzEucmV0dXJuKSkgX2EuY2FsbChpdGVyYWJsZV8xKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBvcHVsYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBmaW5pc2goKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZV8xLCBfYTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBQcm9taXNlLnJhY2UgPSBmdW5jdGlvbiAoaXRlcmFibGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcyhmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaXRlcmFibGVfMiA9IHRzbGliXzEuX192YWx1ZXMoaXRlcmFibGUpLCBpdGVyYWJsZV8yXzEgPSBpdGVyYWJsZV8yLm5leHQoKTsgIWl0ZXJhYmxlXzJfMS5kb25lOyBpdGVyYWJsZV8yXzEgPSBpdGVyYWJsZV8yLm5leHQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBpdGVyYWJsZV8yXzEudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIFByb21pc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBhIFByb21pc2UgaXRlbSByZWplY3RzLCB0aGlzIFByb21pc2UgaXMgaW1tZWRpYXRlbHkgcmVqZWN0ZWQgd2l0aCB0aGUgaXRlbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFByb21pc2UncyByZWplY3Rpb24gZXJyb3IuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS50aGVuKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQcm9taXNlLnJlc29sdmUoaXRlbSkudGhlbihyZXNvbHZlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZV8yXzEpIHsgZV8yID0geyBlcnJvcjogZV8yXzEgfTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZXJhYmxlXzJfMSAmJiAhaXRlcmFibGVfMl8xLmRvbmUgJiYgKF9hID0gaXRlcmFibGVfMi5yZXR1cm4pKSBfYS5jYWxsKGl0ZXJhYmxlXzIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7IH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVfMiwgX2E7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QgPSBmdW5jdGlvbiAocmVhc29uKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2ggPSBmdW5jdGlvbiAob25SZWplY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZTtcclxuICAgICAgICB9KCkpLFxyXG4gICAgICAgIF9hW1N5bWJvbC5zcGVjaWVzXSA9IGV4cG9ydHMuU2hpbVByb21pc2UsXHJcbiAgICAgICAgX2EpO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGV4cG9ydHMuU2hpbVByb21pc2U7XHJcbnZhciBfYTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1Byb21pc2UuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vUHJvbWlzZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIi4vZ2xvYmFsXCIpO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgaGFzXzEgPSByZXF1aXJlKFwiLi9zdXBwb3J0L2hhc1wiKTtcclxucmVxdWlyZShcIi4vU3ltYm9sXCIpO1xyXG5leHBvcnRzLlNldCA9IGdsb2JhbF8xLmRlZmF1bHQuU2V0O1xyXG5pZiAoIWhhc18xLmRlZmF1bHQoJ2VzNi1zZXQnKSkge1xyXG4gICAgZXhwb3J0cy5TZXQgPSAoX2EgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFNldChpdGVyYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0RGF0YSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpc1tTeW1ib2wudG9TdHJpbmdUYWddID0gJ1NldCc7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlcmFibGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlcmF0b3JfMS5pc0FycmF5TGlrZShpdGVyYWJsZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVyYWJsZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGQoaXRlcmFibGVbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaXRlcmFibGVfMSA9IHRzbGliXzEuX192YWx1ZXMoaXRlcmFibGUpLCBpdGVyYWJsZV8xXzEgPSBpdGVyYWJsZV8xLm5leHQoKTsgIWl0ZXJhYmxlXzFfMS5kb25lOyBpdGVyYWJsZV8xXzEgPSBpdGVyYWJsZV8xLm5leHQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGl0ZXJhYmxlXzFfMS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVfMV8xKSB7IGVfMSA9IHsgZXJyb3I6IGVfMV8xIH07IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVyYWJsZV8xXzEgJiYgIWl0ZXJhYmxlXzFfMS5kb25lICYmIChfYSA9IGl0ZXJhYmxlXzEucmV0dXJuKSkgX2EuY2FsbChpdGVyYWJsZV8xKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBlXzEsIF9hO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFNldC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXModmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXREYXRhLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFNldC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXREYXRhLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFNldC5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWR4ID0gdGhpcy5fc2V0RGF0YS5pbmRleE9mKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGlmIChpZHggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0RGF0YS5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTZXQucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGl0ZXJhdG9yXzEuU2hpbUl0ZXJhdG9yKHRoaXMuX3NldERhdGEubWFwKGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gW3ZhbHVlLCB2YWx1ZV07IH0pKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgU2V0LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrZm4sIHRoaXNBcmcpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVyYXRvciA9IHRoaXMudmFsdWVzKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKCFyZXN1bHQuZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrZm4uY2FsbCh0aGlzQXJnLCByZXN1bHQudmFsdWUsIHJlc3VsdC52YWx1ZSwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTZXQucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NldERhdGEuaW5kZXhPZih2YWx1ZSkgPiAtMTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgU2V0LnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBpdGVyYXRvcl8xLlNoaW1JdGVyYXRvcih0aGlzLl9zZXREYXRhKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFNldC5wcm90b3R5cGUsIFwic2l6ZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2V0RGF0YS5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgU2V0LnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGl0ZXJhdG9yXzEuU2hpbUl0ZXJhdG9yKHRoaXMuX3NldERhdGEpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTZXQucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGl0ZXJhdG9yXzEuU2hpbUl0ZXJhdG9yKHRoaXMuX3NldERhdGEpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gU2V0O1xyXG4gICAgICAgIH0oKSksXHJcbiAgICAgICAgX2FbU3ltYm9sLnNwZWNpZXNdID0gX2EsXHJcbiAgICAgICAgX2EpO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGV4cG9ydHMuU2V0O1xyXG52YXIgX2E7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9TZXQuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vU2V0LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBoYXNfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvaGFzXCIpO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi9nbG9iYWxcIik7XHJcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi9zdXBwb3J0L3V0aWxcIik7XHJcbmV4cG9ydHMuU3ltYm9sID0gZ2xvYmFsXzEuZGVmYXVsdC5TeW1ib2w7XHJcbmlmICghaGFzXzEuZGVmYXVsdCgnZXM2LXN5bWJvbCcpKSB7XHJcbiAgICAvKipcclxuICAgICAqIFRocm93cyBpZiB0aGUgdmFsdWUgaXMgbm90IGEgc3ltYm9sLCB1c2VkIGludGVybmFsbHkgd2l0aGluIHRoZSBTaGltXHJcbiAgICAgKiBAcGFyYW0gIHthbnl9ICAgIHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVja1xyXG4gICAgICogQHJldHVybiB7c3ltYm9sfSAgICAgICBSZXR1cm5zIHRoZSBzeW1ib2wgb3IgdGhyb3dzXHJcbiAgICAgKi9cclxuICAgIHZhciB2YWxpZGF0ZVN5bWJvbF8xID0gZnVuY3Rpb24gdmFsaWRhdGVTeW1ib2wodmFsdWUpIHtcclxuICAgICAgICBpZiAoIWlzU3ltYm9sKHZhbHVlKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHZhbHVlICsgJyBpcyBub3QgYSBzeW1ib2wnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfTtcclxuICAgIHZhciBkZWZpbmVQcm9wZXJ0aWVzXzEgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllcztcclxuICAgIHZhciBkZWZpbmVQcm9wZXJ0eV8xID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xyXG4gICAgdmFyIGNyZWF0ZV8xID0gT2JqZWN0LmNyZWF0ZTtcclxuICAgIHZhciBvYmpQcm90b3R5cGVfMSA9IE9iamVjdC5wcm90b3R5cGU7XHJcbiAgICB2YXIgZ2xvYmFsU3ltYm9sc18xID0ge307XHJcbiAgICB2YXIgZ2V0U3ltYm9sTmFtZV8xID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgY3JlYXRlZCA9IGNyZWF0ZV8xKG51bGwpO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZGVzYykge1xyXG4gICAgICAgICAgICB2YXIgcG9zdGZpeCA9IDA7XHJcbiAgICAgICAgICAgIHZhciBuYW1lO1xyXG4gICAgICAgICAgICB3aGlsZSAoY3JlYXRlZFtTdHJpbmcoZGVzYykgKyAocG9zdGZpeCB8fCAnJyldKSB7XHJcbiAgICAgICAgICAgICAgICArK3Bvc3RmaXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVzYyArPSBTdHJpbmcocG9zdGZpeCB8fCAnJyk7XHJcbiAgICAgICAgICAgIGNyZWF0ZWRbZGVzY10gPSB0cnVlO1xyXG4gICAgICAgICAgICBuYW1lID0gJ0BAJyArIGRlc2M7XHJcbiAgICAgICAgICAgIC8vIEZJWE1FOiBUZW1wb3JhcnkgZ3VhcmQgdW50aWwgdGhlIGR1cGxpY2F0ZSBleGVjdXRpb24gd2hlbiB0ZXN0aW5nIGNhbiBiZVxyXG4gICAgICAgICAgICAvLyBwaW5uZWQgZG93bi5cclxuICAgICAgICAgICAgaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9ialByb3RvdHlwZV8xLCBuYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydHlfMShvYmpQcm90b3R5cGVfMSwgbmFtZSwge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmluZVByb3BlcnR5XzEodGhpcywgbmFtZSwgdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcih2YWx1ZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgICAgIH07XHJcbiAgICB9KSgpO1xyXG4gICAgdmFyIEludGVybmFsU3ltYm9sXzEgPSBmdW5jdGlvbiBTeW1ib2woZGVzY3JpcHRpb24pIHtcclxuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIEludGVybmFsU3ltYm9sXzEpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVHlwZUVycm9yOiBTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFN5bWJvbChkZXNjcmlwdGlvbik7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5TeW1ib2wgPSBnbG9iYWxfMS5kZWZhdWx0LlN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbChkZXNjcmlwdGlvbikge1xyXG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgU3ltYm9sKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1R5cGVFcnJvcjogU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzeW0gPSBPYmplY3QuY3JlYXRlKEludGVybmFsU3ltYm9sXzEucHJvdG90eXBlKTtcclxuICAgICAgICBkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uID09PSB1bmRlZmluZWQgPyAnJyA6IFN0cmluZyhkZXNjcmlwdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnRpZXNfMShzeW0sIHtcclxuICAgICAgICAgICAgX19kZXNjcmlwdGlvbl9fOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGRlc2NyaXB0aW9uKSxcclxuICAgICAgICAgICAgX19uYW1lX186IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZ2V0U3ltYm9sTmFtZV8xKGRlc2NyaXB0aW9uKSlcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvKiBEZWNvcmF0ZSB0aGUgU3ltYm9sIGZ1bmN0aW9uIHdpdGggdGhlIGFwcHJvcHJpYXRlIHByb3BlcnRpZXMgKi9cclxuICAgIGRlZmluZVByb3BlcnR5XzEoZXhwb3J0cy5TeW1ib2wsICdmb3InLCB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICBpZiAoZ2xvYmFsU3ltYm9sc18xW2tleV0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbFN5bWJvbHNfMVtrZXldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKGdsb2JhbFN5bWJvbHNfMVtrZXldID0gZXhwb3J0cy5TeW1ib2woU3RyaW5nKGtleSkpKTtcclxuICAgIH0pKTtcclxuICAgIGRlZmluZVByb3BlcnRpZXNfMShleHBvcnRzLlN5bWJvbCwge1xyXG4gICAgICAgIGtleUZvcjogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihmdW5jdGlvbiAoc3ltKSB7XHJcbiAgICAgICAgICAgIHZhciBrZXk7XHJcbiAgICAgICAgICAgIHZhbGlkYXRlU3ltYm9sXzEoc3ltKTtcclxuICAgICAgICAgICAgZm9yIChrZXkgaW4gZ2xvYmFsU3ltYm9sc18xKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsU3ltYm9sc18xW2tleV0gPT09IHN5bSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuICAgICAgICBoYXNJbnN0YW5jZTogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3IoJ2hhc0luc3RhbmNlJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgaXNDb25jYXRTcHJlYWRhYmxlOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcignaXNDb25jYXRTcHJlYWRhYmxlJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgaXRlcmF0b3I6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCdpdGVyYXRvcicpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIG1hdGNoOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcignbWF0Y2gnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICBvYnNlcnZhYmxlOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcignb2JzZXJ2YWJsZScpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIHJlcGxhY2U6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCdyZXBsYWNlJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgc2VhcmNoOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcignc2VhcmNoJyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgc3BlY2llczogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3IoJ3NwZWNpZXMnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICBzcGxpdDogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3IoJ3NwbGl0JyksIGZhbHNlLCBmYWxzZSksXHJcbiAgICAgICAgdG9QcmltaXRpdmU6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wuZm9yKCd0b1ByaW1pdGl2ZScpLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgICAgIHRvU3RyaW5nVGFnOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcigndG9TdHJpbmdUYWcnKSwgZmFsc2UsIGZhbHNlKSxcclxuICAgICAgICB1bnNjb3BhYmxlczogdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5mb3IoJ3Vuc2NvcGFibGVzJyksIGZhbHNlLCBmYWxzZSlcclxuICAgIH0pO1xyXG4gICAgLyogRGVjb3JhdGUgdGhlIEludGVybmFsU3ltYm9sIG9iamVjdCAqL1xyXG4gICAgZGVmaW5lUHJvcGVydGllc18xKEludGVybmFsU3ltYm9sXzEucHJvdG90eXBlLCB7XHJcbiAgICAgICAgY29uc3RydWN0b3I6IHV0aWxfMS5nZXRWYWx1ZURlc2NyaXB0b3IoZXhwb3J0cy5TeW1ib2wpLFxyXG4gICAgICAgIHRvU3RyaW5nOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19uYW1lX187XHJcbiAgICAgICAgfSwgZmFsc2UsIGZhbHNlKVxyXG4gICAgfSk7XHJcbiAgICAvKiBEZWNvcmF0ZSB0aGUgU3ltYm9sLnByb3RvdHlwZSAqL1xyXG4gICAgZGVmaW5lUHJvcGVydGllc18xKGV4cG9ydHMuU3ltYm9sLnByb3RvdHlwZSwge1xyXG4gICAgICAgIHRvU3RyaW5nOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdTeW1ib2wgKCcgKyB2YWxpZGF0ZVN5bWJvbF8xKHRoaXMpLl9fZGVzY3JpcHRpb25fXyArICcpJztcclxuICAgICAgICB9KSxcclxuICAgICAgICB2YWx1ZU9mOiB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRlU3ltYm9sXzEodGhpcyk7XHJcbiAgICAgICAgfSlcclxuICAgIH0pO1xyXG4gICAgZGVmaW5lUHJvcGVydHlfMShleHBvcnRzLlN5bWJvbC5wcm90b3R5cGUsIGV4cG9ydHMuU3ltYm9sLnRvUHJpbWl0aXZlLCB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdmFsaWRhdGVTeW1ib2xfMSh0aGlzKTtcclxuICAgIH0pKTtcclxuICAgIGRlZmluZVByb3BlcnR5XzEoZXhwb3J0cy5TeW1ib2wucHJvdG90eXBlLCBleHBvcnRzLlN5bWJvbC50b1N0cmluZ1RhZywgdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcignU3ltYm9sJywgZmFsc2UsIGZhbHNlLCB0cnVlKSk7XHJcbiAgICBkZWZpbmVQcm9wZXJ0eV8xKEludGVybmFsU3ltYm9sXzEucHJvdG90eXBlLCBleHBvcnRzLlN5bWJvbC50b1ByaW1pdGl2ZSwgdXRpbF8xLmdldFZhbHVlRGVzY3JpcHRvcihleHBvcnRzLlN5bWJvbC5wcm90b3R5cGVbZXhwb3J0cy5TeW1ib2wudG9QcmltaXRpdmVdLCBmYWxzZSwgZmFsc2UsIHRydWUpKTtcclxuICAgIGRlZmluZVByb3BlcnR5XzEoSW50ZXJuYWxTeW1ib2xfMS5wcm90b3R5cGUsIGV4cG9ydHMuU3ltYm9sLnRvU3RyaW5nVGFnLCB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLnByb3RvdHlwZVtleHBvcnRzLlN5bWJvbC50b1N0cmluZ1RhZ10sIGZhbHNlLCBmYWxzZSwgdHJ1ZSkpO1xyXG59XHJcbi8qKlxyXG4gKiBBIGN1c3RvbSBndWFyZCBmdW5jdGlvbiB0aGF0IGRldGVybWluZXMgaWYgYW4gb2JqZWN0IGlzIGEgc3ltYm9sIG9yIG5vdFxyXG4gKiBAcGFyYW0gIHthbnl9ICAgICAgIHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjayB0byBzZWUgaWYgaXQgaXMgYSBzeW1ib2wgb3Igbm90XHJcbiAqIEByZXR1cm4ge2lzIHN5bWJvbH0gICAgICAgUmV0dXJucyB0cnVlIGlmIGEgc3ltYm9sIG9yIG5vdCAoYW5kIG5hcnJvd3MgdGhlIHR5cGUgZ3VhcmQpXHJcbiAqL1xyXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xyXG4gICAgcmV0dXJuICh2YWx1ZSAmJiAodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJyB8fCB2YWx1ZVsnQEB0b1N0cmluZ1RhZyddID09PSAnU3ltYm9sJykpIHx8IGZhbHNlO1xyXG59XHJcbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcclxuLyoqXHJcbiAqIEZpbGwgYW55IG1pc3Npbmcgd2VsbCBrbm93biBzeW1ib2xzIGlmIHRoZSBuYXRpdmUgU3ltYm9sIGlzIG1pc3NpbmcgdGhlbVxyXG4gKi9cclxuW1xyXG4gICAgJ2hhc0luc3RhbmNlJyxcclxuICAgICdpc0NvbmNhdFNwcmVhZGFibGUnLFxyXG4gICAgJ2l0ZXJhdG9yJyxcclxuICAgICdzcGVjaWVzJyxcclxuICAgICdyZXBsYWNlJyxcclxuICAgICdzZWFyY2gnLFxyXG4gICAgJ3NwbGl0JyxcclxuICAgICdtYXRjaCcsXHJcbiAgICAndG9QcmltaXRpdmUnLFxyXG4gICAgJ3RvU3RyaW5nVGFnJyxcclxuICAgICd1bnNjb3BhYmxlcycsXHJcbiAgICAnb2JzZXJ2YWJsZSdcclxuXS5mb3JFYWNoKGZ1bmN0aW9uICh3ZWxsS25vd24pIHtcclxuICAgIGlmICghZXhwb3J0cy5TeW1ib2xbd2VsbEtub3duXSkge1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLlN5bWJvbCwgd2VsbEtub3duLCB1dGlsXzEuZ2V0VmFsdWVEZXNjcmlwdG9yKGV4cG9ydHMuU3ltYm9sLmZvcih3ZWxsS25vd24pLCBmYWxzZSwgZmFsc2UpKTtcclxuICAgIH1cclxufSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGV4cG9ydHMuU3ltYm9sO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vU3ltYm9sLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1N5bWJvbC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIi4vZ2xvYmFsXCIpO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgaGFzXzEgPSByZXF1aXJlKFwiLi9zdXBwb3J0L2hhc1wiKTtcclxucmVxdWlyZShcIi4vU3ltYm9sXCIpO1xyXG5leHBvcnRzLldlYWtNYXAgPSBnbG9iYWxfMS5kZWZhdWx0LldlYWtNYXA7XHJcbmlmICghaGFzXzEuZGVmYXVsdCgnZXM2LXdlYWttYXAnKSkge1xyXG4gICAgdmFyIERFTEVURURfMSA9IHt9O1xyXG4gICAgdmFyIGdldFVJRF8xID0gZnVuY3Rpb24gZ2V0VUlEKCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMDApO1xyXG4gICAgfTtcclxuICAgIHZhciBnZW5lcmF0ZU5hbWVfMSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHN0YXJ0SWQgPSBNYXRoLmZsb29yKERhdGUubm93KCkgJSAxMDAwMDAwMDApO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBnZW5lcmF0ZU5hbWUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnX193bScgKyBnZXRVSURfMSgpICsgKHN0YXJ0SWQrKyArICdfXycpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KSgpO1xyXG4gICAgZXhwb3J0cy5XZWFrTWFwID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIFdlYWtNYXAoaXRlcmFibGUpIHtcclxuICAgICAgICAgICAgdGhpc1tTeW1ib2wudG9TdHJpbmdUYWddID0gJ1dlYWtNYXAnO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ19uYW1lJywge1xyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGdlbmVyYXRlTmFtZV8xKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Zyb3plbkVudHJpZXMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKGl0ZXJhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlcmF0b3JfMS5pc0FycmF5TGlrZShpdGVyYWJsZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZXJhYmxlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gaXRlcmFibGVbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KGl0ZW1bMF0sIGl0ZW1bMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGl0ZXJhYmxlXzEgPSB0c2xpYl8xLl9fdmFsdWVzKGl0ZXJhYmxlKSwgaXRlcmFibGVfMV8xID0gaXRlcmFibGVfMS5uZXh0KCk7ICFpdGVyYWJsZV8xXzEuZG9uZTsgaXRlcmFibGVfMV8xID0gaXRlcmFibGVfMS5uZXh0KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfYSA9IHRzbGliXzEuX19yZWFkKGl0ZXJhYmxlXzFfMS52YWx1ZSwgMiksIGtleSA9IF9hWzBdLCB2YWx1ZSA9IF9hWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXQoa2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVfMV8xKSB7IGVfMSA9IHsgZXJyb3I6IGVfMV8xIH07IH1cclxuICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVyYWJsZV8xXzEgJiYgIWl0ZXJhYmxlXzFfMS5kb25lICYmIChfYiA9IGl0ZXJhYmxlXzEucmV0dXJuKSkgX2IuY2FsbChpdGVyYWJsZV8xKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBlXzEsIF9iO1xyXG4gICAgICAgIH1cclxuICAgICAgICBXZWFrTWFwLnByb3RvdHlwZS5fZ2V0RnJvemVuRW50cnlJbmRleCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9mcm96ZW5FbnRyaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZnJvemVuRW50cmllc1tpXS5rZXkgPT09IGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFdlYWtNYXAucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkIHx8IGtleSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBlbnRyeSA9IGtleVt0aGlzLl9uYW1lXTtcclxuICAgICAgICAgICAgaWYgKGVudHJ5ICYmIGVudHJ5LmtleSA9PT0ga2V5ICYmIGVudHJ5LnZhbHVlICE9PSBERUxFVEVEXzEpIHtcclxuICAgICAgICAgICAgICAgIGVudHJ5LnZhbHVlID0gREVMRVRFRF8xO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGZyb3plbkluZGV4ID0gdGhpcy5fZ2V0RnJvemVuRW50cnlJbmRleChrZXkpO1xyXG4gICAgICAgICAgICBpZiAoZnJvemVuSW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZnJvemVuRW50cmllcy5zcGxpY2UoZnJvemVuSW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgV2Vha01hcC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwga2V5ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBlbnRyeSA9IGtleVt0aGlzLl9uYW1lXTtcclxuICAgICAgICAgICAgaWYgKGVudHJ5ICYmIGVudHJ5LmtleSA9PT0ga2V5ICYmIGVudHJ5LnZhbHVlICE9PSBERUxFVEVEXzEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbnRyeS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZnJvemVuSW5kZXggPSB0aGlzLl9nZXRGcm96ZW5FbnRyeUluZGV4KGtleSk7XHJcbiAgICAgICAgICAgIGlmIChmcm96ZW5JbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZnJvemVuRW50cmllc1tmcm96ZW5JbmRleF0udmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIFdlYWtNYXAucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkIHx8IGtleSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBlbnRyeSA9IGtleVt0aGlzLl9uYW1lXTtcclxuICAgICAgICAgICAgaWYgKEJvb2xlYW4oZW50cnkgJiYgZW50cnkua2V5ID09PSBrZXkgJiYgZW50cnkudmFsdWUgIT09IERFTEVURURfMSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBmcm96ZW5JbmRleCA9IHRoaXMuX2dldEZyb3plbkVudHJ5SW5kZXgoa2V5KTtcclxuICAgICAgICAgICAgaWYgKGZyb3plbkluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFdlYWtNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICgha2V5IHx8ICh0eXBlb2Yga2V5ICE9PSAnb2JqZWN0JyAmJiB0eXBlb2Yga2V5ICE9PSAnZnVuY3Rpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCB2YWx1ZSB1c2VkIGFzIHdlYWsgbWFwIGtleScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBlbnRyeSA9IGtleVt0aGlzLl9uYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFlbnRyeSB8fCBlbnRyeS5rZXkgIT09IGtleSkge1xyXG4gICAgICAgICAgICAgICAgZW50cnkgPSBPYmplY3QuY3JlYXRlKG51bGwsIHtcclxuICAgICAgICAgICAgICAgICAgICBrZXk6IHsgdmFsdWU6IGtleSB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChPYmplY3QuaXNGcm96ZW4oa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Zyb3plbkVudHJpZXMucHVzaChlbnRyeSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2V5LCB0aGlzLl9uYW1lLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBlbnRyeVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVudHJ5LnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIFdlYWtNYXA7XHJcbiAgICB9KCkpO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGV4cG9ydHMuV2Vha01hcDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL1dlYWtNYXAuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vV2Vha01hcC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIi4vZ2xvYmFsXCIpO1xyXG52YXIgaXRlcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2l0ZXJhdG9yXCIpO1xyXG52YXIgbnVtYmVyXzEgPSByZXF1aXJlKFwiLi9udW1iZXJcIik7XHJcbnZhciBoYXNfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvaGFzXCIpO1xyXG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vc3VwcG9ydC91dGlsXCIpO1xyXG5pZiAoaGFzXzEuZGVmYXVsdCgnZXM2LWFycmF5JykgJiYgaGFzXzEuZGVmYXVsdCgnZXM2LWFycmF5LWZpbGwnKSkge1xyXG4gICAgZXhwb3J0cy5mcm9tID0gZ2xvYmFsXzEuZGVmYXVsdC5BcnJheS5mcm9tO1xyXG4gICAgZXhwb3J0cy5vZiA9IGdsb2JhbF8xLmRlZmF1bHQuQXJyYXkub2Y7XHJcbiAgICBleHBvcnRzLmNvcHlXaXRoaW4gPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LkFycmF5LnByb3RvdHlwZS5jb3B5V2l0aGluKTtcclxuICAgIGV4cG9ydHMuZmlsbCA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuQXJyYXkucHJvdG90eXBlLmZpbGwpO1xyXG4gICAgZXhwb3J0cy5maW5kID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5BcnJheS5wcm90b3R5cGUuZmluZCk7XHJcbiAgICBleHBvcnRzLmZpbmRJbmRleCA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuQXJyYXkucHJvdG90eXBlLmZpbmRJbmRleCk7XHJcbn1cclxuZWxzZSB7XHJcbiAgICAvLyBJdCBpcyBvbmx5IG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaS9pT1MgdGhhdCBoYXZlIGEgYmFkIGZpbGwgaW1wbGVtZW50YXRpb24gYW5kIHNvIGFyZW4ndCBpbiB0aGUgd2lsZFxyXG4gICAgLy8gVG8gbWFrZSB0aGluZ3MgZWFzaWVyLCBpZiB0aGVyZSBpcyBhIGJhZCBmaWxsIGltcGxlbWVudGF0aW9uLCB0aGUgd2hvbGUgc2V0IG9mIGZ1bmN0aW9ucyB3aWxsIGJlIGZpbGxlZFxyXG4gICAgLyoqXHJcbiAgICAgKiBFbnN1cmVzIGEgbm9uLW5lZ2F0aXZlLCBub24taW5maW5pdGUsIHNhZmUgaW50ZWdlci5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbGVuZ3RoIFRoZSBudW1iZXIgdG8gdmFsaWRhdGVcclxuICAgICAqIEByZXR1cm4gQSBwcm9wZXIgbGVuZ3RoXHJcbiAgICAgKi9cclxuICAgIHZhciB0b0xlbmd0aF8xID0gZnVuY3Rpb24gdG9MZW5ndGgobGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKGlzTmFOKGxlbmd0aCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpO1xyXG4gICAgICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XHJcbiAgICAgICAgICAgIGxlbmd0aCA9IE1hdGguZmxvb3IobGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRW5zdXJlIGEgbm9uLW5lZ2F0aXZlLCByZWFsLCBzYWZlIGludGVnZXJcclxuICAgICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobGVuZ3RoLCAwKSwgbnVtYmVyXzEuTUFYX1NBRkVfSU5URUdFUik7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBGcm9tIEVTNiA3LjEuNCBUb0ludGVnZXIoKVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB2YWx1ZSBBIHZhbHVlIHRvIGNvbnZlcnRcclxuICAgICAqIEByZXR1cm4gQW4gaW50ZWdlclxyXG4gICAgICovXHJcbiAgICB2YXIgdG9JbnRlZ2VyXzEgPSBmdW5jdGlvbiB0b0ludGVnZXIodmFsdWUpIHtcclxuICAgICAgICB2YWx1ZSA9IE51bWJlcih2YWx1ZSk7XHJcbiAgICAgICAgaWYgKGlzTmFOKHZhbHVlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSAwIHx8ICFpc0Zpbml0ZSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKHZhbHVlID4gMCA/IDEgOiAtMSkgKiBNYXRoLmZsb29yKE1hdGguYWJzKHZhbHVlKSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBOb3JtYWxpemVzIGFuIG9mZnNldCBhZ2FpbnN0IGEgZ2l2ZW4gbGVuZ3RoLCB3cmFwcGluZyBpdCBpZiBuZWdhdGl2ZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUgVGhlIG9yaWdpbmFsIG9mZnNldFxyXG4gICAgICogQHBhcmFtIGxlbmd0aCBUaGUgdG90YWwgbGVuZ3RoIHRvIG5vcm1hbGl6ZSBhZ2FpbnN0XHJcbiAgICAgKiBAcmV0dXJuIElmIG5lZ2F0aXZlLCBwcm92aWRlIGEgZGlzdGFuY2UgZnJvbSB0aGUgZW5kIChsZW5ndGgpOyBvdGhlcndpc2UgcHJvdmlkZSBhIGRpc3RhbmNlIGZyb20gMFxyXG4gICAgICovXHJcbiAgICB2YXIgbm9ybWFsaXplT2Zmc2V0XzEgPSBmdW5jdGlvbiBub3JtYWxpemVPZmZzZXQodmFsdWUsIGxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybiB2YWx1ZSA8IDAgPyBNYXRoLm1heChsZW5ndGggKyB2YWx1ZSwgMCkgOiBNYXRoLm1pbih2YWx1ZSwgbGVuZ3RoKTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmZyb20gPSBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZSwgbWFwRnVuY3Rpb24sIHRoaXNBcmcpIHtcclxuICAgICAgICBpZiAoYXJyYXlMaWtlID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZnJvbTogcmVxdWlyZXMgYW4gYXJyYXktbGlrZSBvYmplY3QnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1hcEZ1bmN0aW9uICYmIHRoaXNBcmcpIHtcclxuICAgICAgICAgICAgbWFwRnVuY3Rpb24gPSBtYXBGdW5jdGlvbi5iaW5kKHRoaXNBcmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZSAqL1xyXG4gICAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoXzEoYXJyYXlMaWtlLmxlbmd0aCk7XHJcbiAgICAgICAgLy8gU3VwcG9ydCBleHRlbnNpb25cclxuICAgICAgICB2YXIgYXJyYXkgPSB0eXBlb2YgQ29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgPyBPYmplY3QobmV3IENvbnN0cnVjdG9yKGxlbmd0aCkpIDogbmV3IEFycmF5KGxlbmd0aCk7XHJcbiAgICAgICAgaWYgKCFpdGVyYXRvcl8xLmlzQXJyYXlMaWtlKGFycmF5TGlrZSkgJiYgIWl0ZXJhdG9yXzEuaXNJdGVyYWJsZShhcnJheUxpa2UpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgdGhpcyBpcyBhbiBhcnJheSBhbmQgdGhlIG5vcm1hbGl6ZWQgbGVuZ3RoIGlzIDAsIGp1c3QgcmV0dXJuIGFuIGVtcHR5IGFycmF5LiB0aGlzIHByZXZlbnRzIGEgcHJvYmxlbVxyXG4gICAgICAgIC8vIHdpdGggdGhlIGl0ZXJhdGlvbiBvbiBJRSB3aGVuIHVzaW5nIGEgTmFOIGFycmF5IGxlbmd0aC5cclxuICAgICAgICBpZiAoaXRlcmF0b3JfMS5pc0FycmF5TGlrZShhcnJheUxpa2UpKSB7XHJcbiAgICAgICAgICAgIGlmIChsZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5TGlrZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSBtYXBGdW5jdGlvbiA/IG1hcEZ1bmN0aW9uKGFycmF5TGlrZVtpXSwgaSkgOiBhcnJheUxpa2VbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGFycmF5TGlrZV8xID0gdHNsaWJfMS5fX3ZhbHVlcyhhcnJheUxpa2UpLCBhcnJheUxpa2VfMV8xID0gYXJyYXlMaWtlXzEubmV4dCgpOyAhYXJyYXlMaWtlXzFfMS5kb25lOyBhcnJheUxpa2VfMV8xID0gYXJyYXlMaWtlXzEubmV4dCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gYXJyYXlMaWtlXzFfMS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBhcnJheVtpXSA9IG1hcEZ1bmN0aW9uID8gbWFwRnVuY3Rpb24odmFsdWUsIGkpIDogdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XHJcbiAgICAgICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXlMaWtlXzFfMSAmJiAhYXJyYXlMaWtlXzFfMS5kb25lICYmIChfYSA9IGFycmF5TGlrZV8xLnJldHVybikpIF9hLmNhbGwoYXJyYXlMaWtlXzEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhcnJheUxpa2UubGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgYXJyYXkubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICAgICAgdmFyIGVfMSwgX2E7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5vZiA9IGZ1bmN0aW9uIG9mKCkge1xyXG4gICAgICAgIHZhciBpdGVtcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIGl0ZW1zW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChpdGVtcyk7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5jb3B5V2l0aGluID0gZnVuY3Rpb24gY29weVdpdGhpbih0YXJnZXQsIG9mZnNldCwgc3RhcnQsIGVuZCkge1xyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjb3B5V2l0aGluOiB0YXJnZXQgbXVzdCBiZSBhbiBhcnJheS1saWtlIG9iamVjdCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGhfMSh0YXJnZXQubGVuZ3RoKTtcclxuICAgICAgICBvZmZzZXQgPSBub3JtYWxpemVPZmZzZXRfMSh0b0ludGVnZXJfMShvZmZzZXQpLCBsZW5ndGgpO1xyXG4gICAgICAgIHN0YXJ0ID0gbm9ybWFsaXplT2Zmc2V0XzEodG9JbnRlZ2VyXzEoc3RhcnQpLCBsZW5ndGgpO1xyXG4gICAgICAgIGVuZCA9IG5vcm1hbGl6ZU9mZnNldF8xKGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogdG9JbnRlZ2VyXzEoZW5kKSwgbGVuZ3RoKTtcclxuICAgICAgICB2YXIgY291bnQgPSBNYXRoLm1pbihlbmQgLSBzdGFydCwgbGVuZ3RoIC0gb2Zmc2V0KTtcclxuICAgICAgICB2YXIgZGlyZWN0aW9uID0gMTtcclxuICAgICAgICBpZiAob2Zmc2V0ID4gc3RhcnQgJiYgb2Zmc2V0IDwgc3RhcnQgKyBjb3VudCkge1xyXG4gICAgICAgICAgICBkaXJlY3Rpb24gPSAtMTtcclxuICAgICAgICAgICAgc3RhcnQgKz0gY291bnQgLSAxO1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gY291bnQgLSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aGlsZSAoY291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgIGlmIChzdGFydCBpbiB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldFtvZmZzZXRdID0gdGFyZ2V0W3N0YXJ0XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0YXJnZXRbb2Zmc2V0XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvZmZzZXQgKz0gZGlyZWN0aW9uO1xyXG4gICAgICAgICAgICBzdGFydCArPSBkaXJlY3Rpb247XHJcbiAgICAgICAgICAgIGNvdW50LS07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5maWxsID0gZnVuY3Rpb24gZmlsbCh0YXJnZXQsIHZhbHVlLCBzdGFydCwgZW5kKSB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoXzEodGFyZ2V0Lmxlbmd0aCk7XHJcbiAgICAgICAgdmFyIGkgPSBub3JtYWxpemVPZmZzZXRfMSh0b0ludGVnZXJfMShzdGFydCksIGxlbmd0aCk7XHJcbiAgICAgICAgZW5kID0gbm9ybWFsaXplT2Zmc2V0XzEoZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0ludGVnZXJfMShlbmQpLCBsZW5ndGgpO1xyXG4gICAgICAgIHdoaWxlIChpIDwgZW5kKSB7XHJcbiAgICAgICAgICAgIHRhcmdldFtpKytdID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5maW5kID0gZnVuY3Rpb24gZmluZCh0YXJnZXQsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gZXhwb3J0cy5maW5kSW5kZXgodGFyZ2V0LCBjYWxsYmFjaywgdGhpc0FyZyk7XHJcbiAgICAgICAgcmV0dXJuIGluZGV4ICE9PSAtMSA/IHRhcmdldFtpbmRleF0gOiB1bmRlZmluZWQ7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5maW5kSW5kZXggPSBmdW5jdGlvbiBmaW5kSW5kZXgodGFyZ2V0LCBjYWxsYmFjaywgdGhpc0FyZykge1xyXG4gICAgICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aF8xKHRhcmdldC5sZW5ndGgpO1xyXG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZmluZDogc2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpc0FyZykge1xyXG4gICAgICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrLmJpbmQodGhpc0FyZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKHRhcmdldFtpXSwgaSwgdGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfTtcclxufVxyXG5pZiAoaGFzXzEuZGVmYXVsdCgnZXM3LWFycmF5JykpIHtcclxuICAgIGV4cG9ydHMuaW5jbHVkZXMgPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LkFycmF5LnByb3RvdHlwZS5pbmNsdWRlcyk7XHJcbn1cclxuZWxzZSB7XHJcbiAgICAvKipcclxuICAgICAqIEVuc3VyZXMgYSBub24tbmVnYXRpdmUsIG5vbi1pbmZpbml0ZSwgc2FmZSBpbnRlZ2VyLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBsZW5ndGggVGhlIG51bWJlciB0byB2YWxpZGF0ZVxyXG4gICAgICogQHJldHVybiBBIHByb3BlciBsZW5ndGhcclxuICAgICAqL1xyXG4gICAgdmFyIHRvTGVuZ3RoXzIgPSBmdW5jdGlvbiB0b0xlbmd0aChsZW5ndGgpIHtcclxuICAgICAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKTtcclxuICAgICAgICBpZiAoaXNOYU4obGVuZ3RoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcclxuICAgICAgICAgICAgbGVuZ3RoID0gTWF0aC5mbG9vcihsZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFbnN1cmUgYSBub24tbmVnYXRpdmUsIHJlYWwsIHNhZmUgaW50ZWdlclxyXG4gICAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChsZW5ndGgsIDApLCBudW1iZXJfMS5NQVhfU0FGRV9JTlRFR0VSKTtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXModGFyZ2V0LCBzZWFyY2hFbGVtZW50LCBmcm9tSW5kZXgpIHtcclxuICAgICAgICBpZiAoZnJvbUluZGV4ID09PSB2b2lkIDApIHsgZnJvbUluZGV4ID0gMDsgfVxyXG4gICAgICAgIHZhciBsZW4gPSB0b0xlbmd0aF8yKHRhcmdldC5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBmcm9tSW5kZXg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudEVsZW1lbnQgPSB0YXJnZXRbaV07XHJcbiAgICAgICAgICAgIGlmIChzZWFyY2hFbGVtZW50ID09PSBjdXJyZW50RWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgKHNlYXJjaEVsZW1lbnQgIT09IHNlYXJjaEVsZW1lbnQgJiYgY3VycmVudEVsZW1lbnQgIT09IGN1cnJlbnRFbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vYXJyYXkuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vYXJyYXkuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGdsb2JhbE9iamVjdCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvLyBnbG9iYWwgc3BlYyBkZWZpbmVzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0IGNhbGxlZCAnZ2xvYmFsJ1xyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLWdsb2JhbFxyXG4gICAgICAgIC8vIGBnbG9iYWxgIGlzIGFsc28gZGVmaW5lZCBpbiBOb2RlSlNcclxuICAgICAgICByZXR1cm4gZ2xvYmFsO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvLyB3aW5kb3cgaXMgZGVmaW5lZCBpbiBicm93c2Vyc1xyXG4gICAgICAgIHJldHVybiB3aW5kb3c7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvLyBzZWxmIGlzIGRlZmluZWQgaW4gV2ViV29ya2Vyc1xyXG4gICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgfVxyXG59KSgpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBnbG9iYWxPYmplY3Q7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnJlcXVpcmUoXCIuL1N5bWJvbFwiKTtcclxudmFyIHN0cmluZ18xID0gcmVxdWlyZShcIi4vc3RyaW5nXCIpO1xyXG52YXIgc3RhdGljRG9uZSA9IHsgZG9uZTogdHJ1ZSwgdmFsdWU6IHVuZGVmaW5lZCB9O1xyXG4vKipcclxuICogQSBjbGFzcyB0aGF0IF9zaGltc18gYW4gaXRlcmF0b3IgaW50ZXJmYWNlIG9uIGFycmF5IGxpa2Ugb2JqZWN0cy5cclxuICovXHJcbnZhciBTaGltSXRlcmF0b3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBTaGltSXRlcmF0b3IobGlzdCkge1xyXG4gICAgICAgIHRoaXMuX25leHRJbmRleCA9IC0xO1xyXG4gICAgICAgIGlmIChpc0l0ZXJhYmxlKGxpc3QpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX25hdGl2ZUl0ZXJhdG9yID0gbGlzdFtTeW1ib2wuaXRlcmF0b3JdKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9saXN0ID0gbGlzdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiB0aGUgbmV4dCBpdGVyYXRpb24gcmVzdWx0IGZvciB0aGUgSXRlcmF0b3JcclxuICAgICAqL1xyXG4gICAgU2hpbUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9uYXRpdmVJdGVyYXRvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbmF0aXZlSXRlcmF0b3IubmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuX2xpc3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRpY0RvbmU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgrK3RoaXMuX25leHRJbmRleCA8IHRoaXMuX2xpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBkb25lOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLl9saXN0W3RoaXMuX25leHRJbmRleF1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0YXRpY0RvbmU7XHJcbiAgICB9O1xyXG4gICAgU2hpbUl0ZXJhdG9yLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTaGltSXRlcmF0b3I7XHJcbn0oKSk7XHJcbmV4cG9ydHMuU2hpbUl0ZXJhdG9yID0gU2hpbUl0ZXJhdG9yO1xyXG4vKipcclxuICogQSB0eXBlIGd1YXJkIGZvciBjaGVja2luZyBpZiBzb21ldGhpbmcgaGFzIGFuIEl0ZXJhYmxlIGludGVyZmFjZVxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHR5cGUgZ3VhcmQgYWdhaW5zdFxyXG4gKi9cclxuZnVuY3Rpb24gaXNJdGVyYWJsZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZVtTeW1ib2wuaXRlcmF0b3JdID09PSAnZnVuY3Rpb24nO1xyXG59XHJcbmV4cG9ydHMuaXNJdGVyYWJsZSA9IGlzSXRlcmFibGU7XHJcbi8qKlxyXG4gKiBBIHR5cGUgZ3VhcmQgZm9yIGNoZWNraW5nIGlmIHNvbWV0aGluZyBpcyBBcnJheUxpa2VcclxuICpcclxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0eXBlIGd1YXJkIGFnYWluc3RcclxuICovXHJcbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcic7XHJcbn1cclxuZXhwb3J0cy5pc0FycmF5TGlrZSA9IGlzQXJyYXlMaWtlO1xyXG4vKipcclxuICogUmV0dXJucyB0aGUgaXRlcmF0b3IgZm9yIGFuIG9iamVjdFxyXG4gKlxyXG4gKiBAcGFyYW0gaXRlcmFibGUgVGhlIGl0ZXJhYmxlIG9iamVjdCB0byByZXR1cm4gdGhlIGl0ZXJhdG9yIGZvclxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0KGl0ZXJhYmxlKSB7XHJcbiAgICBpZiAoaXNJdGVyYWJsZShpdGVyYWJsZSkpIHtcclxuICAgICAgICByZXR1cm4gaXRlcmFibGVbU3ltYm9sLml0ZXJhdG9yXSgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNBcnJheUxpa2UoaXRlcmFibGUpKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBTaGltSXRlcmF0b3IoaXRlcmFibGUpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZ2V0ID0gZ2V0O1xyXG4vKipcclxuICogU2hpbXMgdGhlIGZ1bmN0aW9uYWxpdHkgb2YgYGZvciAuLi4gb2ZgIGJsb2Nrc1xyXG4gKlxyXG4gKiBAcGFyYW0gaXRlcmFibGUgVGhlIG9iamVjdCB0aGUgcHJvdmlkZXMgYW4gaW50ZXJhdG9yIGludGVyZmFjZVxyXG4gKiBAcGFyYW0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHdoaWNoIHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoIGl0ZW0gb2YgdGhlIGl0ZXJhYmxlXHJcbiAqIEBwYXJhbSB0aGlzQXJnIE9wdGlvbmFsIHNjb3BlIHRvIHBhc3MgdGhlIGNhbGxiYWNrXHJcbiAqL1xyXG5mdW5jdGlvbiBmb3JPZihpdGVyYWJsZSwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcclxuICAgIHZhciBicm9rZW4gPSBmYWxzZTtcclxuICAgIGZ1bmN0aW9uIGRvQnJlYWsoKSB7XHJcbiAgICAgICAgYnJva2VuID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIC8qIFdlIG5lZWQgdG8gaGFuZGxlIGl0ZXJhdGlvbiBvZiBkb3VibGUgYnl0ZSBzdHJpbmdzIHByb3Blcmx5ICovXHJcbiAgICBpZiAoaXNBcnJheUxpa2UoaXRlcmFibGUpICYmIHR5cGVvZiBpdGVyYWJsZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICB2YXIgbCA9IGl0ZXJhYmxlLmxlbmd0aDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7ICsraSkge1xyXG4gICAgICAgICAgICB2YXIgY2hhciA9IGl0ZXJhYmxlW2ldO1xyXG4gICAgICAgICAgICBpZiAoaSArIDEgPCBsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29kZSA9IGNoYXIuY2hhckNvZGVBdCgwKTtcclxuICAgICAgICAgICAgICAgIGlmIChjb2RlID49IHN0cmluZ18xLkhJR0hfU1VSUk9HQVRFX01JTiAmJiBjb2RlIDw9IHN0cmluZ18xLkhJR0hfU1VSUk9HQVRFX01BWCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYXIgKz0gaXRlcmFibGVbKytpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGNoYXIsIGl0ZXJhYmxlLCBkb0JyZWFrKTtcclxuICAgICAgICAgICAgaWYgKGJyb2tlbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGl0ZXJhdG9yID0gZ2V0KGl0ZXJhYmxlKTtcclxuICAgICAgICBpZiAoaXRlcmF0b3IpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcclxuICAgICAgICAgICAgd2hpbGUgKCFyZXN1bHQuZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCByZXN1bHQudmFsdWUsIGl0ZXJhYmxlLCBkb0JyZWFrKTtcclxuICAgICAgICAgICAgICAgIGlmIChicm9rZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5mb3JPZiA9IGZvck9mO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vaXRlcmF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vaXRlcmF0b3IuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIi4vZ2xvYmFsXCIpO1xyXG4vKipcclxuICogVGhlIHNtYWxsZXN0IGludGVydmFsIGJldHdlZW4gdHdvIHJlcHJlc2VudGFibGUgbnVtYmVycy5cclxuICovXHJcbmV4cG9ydHMuRVBTSUxPTiA9IDE7XHJcbi8qKlxyXG4gKiBUaGUgbWF4aW11bSBzYWZlIGludGVnZXIgaW4gSmF2YVNjcmlwdFxyXG4gKi9cclxuZXhwb3J0cy5NQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcclxuLyoqXHJcbiAqIFRoZSBtaW5pbXVtIHNhZmUgaW50ZWdlciBpbiBKYXZhU2NyaXB0XHJcbiAqL1xyXG5leHBvcnRzLk1JTl9TQUZFX0lOVEVHRVIgPSAtZXhwb3J0cy5NQVhfU0FGRV9JTlRFR0VSO1xyXG4vKipcclxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgTmFOIHdpdGhvdXQgY29lcnNpb24uXHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxyXG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIE5hTiwgZmFsc2UgaWYgaXQgaXMgbm90XHJcbiAqL1xyXG5mdW5jdGlvbiBpc05hTih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgZ2xvYmFsXzEuZGVmYXVsdC5pc05hTih2YWx1ZSk7XHJcbn1cclxuZXhwb3J0cy5pc05hTiA9IGlzTmFOO1xyXG4vKipcclxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYSBmaW5pdGUgbnVtYmVyIHdpdGhvdXQgY29lcnNpb24uXHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxyXG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIGZpbml0ZSwgZmFsc2UgaWYgaXQgaXMgbm90XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0Zpbml0ZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgZ2xvYmFsXzEuZGVmYXVsdC5pc0Zpbml0ZSh2YWx1ZSk7XHJcbn1cclxuZXhwb3J0cy5pc0Zpbml0ZSA9IGlzRmluaXRlO1xyXG4vKipcclxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYW4gaW50ZWdlci5cclxuICpcclxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0XHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgYW4gaW50ZWdlciwgZmFsc2UgaWYgaXQgaXMgbm90XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0ludGVnZXIodmFsdWUpIHtcclxuICAgIHJldHVybiBpc0Zpbml0ZSh2YWx1ZSkgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlO1xyXG59XHJcbmV4cG9ydHMuaXNJbnRlZ2VyID0gaXNJbnRlZ2VyO1xyXG4vKipcclxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYW4gaW50ZWdlciB0aGF0IGlzICdzYWZlLCcgbWVhbmluZzpcclxuICogICAxLiBpdCBjYW4gYmUgZXhwcmVzc2VkIGFzIGFuIElFRUUtNzU0IGRvdWJsZSBwcmVjaXNpb24gbnVtYmVyXHJcbiAqICAgMi4gaXQgaGFzIGEgb25lLXRvLW9uZSBtYXBwaW5nIHRvIGEgbWF0aGVtYXRpY2FsIGludGVnZXIsIG1lYW5pbmcgaXRzXHJcbiAqICAgICAgSUVFRS03NTQgcmVwcmVzZW50YXRpb24gY2Fubm90IGJlIHRoZSByZXN1bHQgb2Ygcm91bmRpbmcgYW55IG90aGVyXHJcbiAqICAgICAgaW50ZWdlciB0byBmaXQgdGhlIElFRUUtNzU0IHJlcHJlc2VudGF0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdFxyXG4gKiBAcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGlzIGFuIGludGVnZXIsIGZhbHNlIGlmIGl0IGlzIG5vdFxyXG4gKi9cclxuZnVuY3Rpb24gaXNTYWZlSW50ZWdlcih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIGlzSW50ZWdlcih2YWx1ZSkgJiYgTWF0aC5hYnModmFsdWUpIDw9IGV4cG9ydHMuTUFYX1NBRkVfSU5URUdFUjtcclxufVxyXG5leHBvcnRzLmlzU2FmZUludGVnZXIgPSBpc1NhZmVJbnRlZ2VyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vbnVtYmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL251bWJlci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiLi9nbG9iYWxcIik7XHJcbnZhciBoYXNfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvaGFzXCIpO1xyXG52YXIgU3ltYm9sXzEgPSByZXF1aXJlKFwiLi9TeW1ib2xcIik7XHJcbmlmIChoYXNfMS5kZWZhdWx0KCdlczYtb2JqZWN0JykpIHtcclxuICAgIHZhciBnbG9iYWxPYmplY3QgPSBnbG9iYWxfMS5kZWZhdWx0Lk9iamVjdDtcclxuICAgIGV4cG9ydHMuYXNzaWduID0gZ2xvYmFsT2JqZWN0LmFzc2lnbjtcclxuICAgIGV4cG9ydHMuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZ2xvYmFsT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcclxuICAgIGV4cG9ydHMuZ2V0T3duUHJvcGVydHlOYW1lcyA9IGdsb2JhbE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xyXG4gICAgZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBnbG9iYWxPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xyXG4gICAgZXhwb3J0cy5pcyA9IGdsb2JhbE9iamVjdC5pcztcclxuICAgIGV4cG9ydHMua2V5cyA9IGdsb2JhbE9iamVjdC5rZXlzO1xyXG59XHJcbmVsc2Uge1xyXG4gICAgZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24gc3ltYm9sQXdhcmVLZXlzKG8pIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMobykuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuICFCb29sZWFuKGtleS5tYXRjaCgvXkBALisvKSk7IH0pO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuYXNzaWduID0gZnVuY3Rpb24gYXNzaWduKHRhcmdldCkge1xyXG4gICAgICAgIHZhciBzb3VyY2VzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgc291cmNlc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIC8vIFR5cGVFcnJvciBpZiB1bmRlZmluZWQgb3IgbnVsbFxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3QnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRvID0gT2JqZWN0KHRhcmdldCk7XHJcbiAgICAgICAgc291cmNlcy5mb3JFYWNoKGZ1bmN0aW9uIChuZXh0U291cmNlKSB7XHJcbiAgICAgICAgICAgIGlmIChuZXh0U291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTa2lwIG92ZXIgaWYgdW5kZWZpbmVkIG9yIG51bGxcclxuICAgICAgICAgICAgICAgIGV4cG9ydHMua2V5cyhuZXh0U291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uIChuZXh0S2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9bbmV4dEtleV0gPSBuZXh0U291cmNlW25leHRLZXldO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdG87XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobywgcHJvcCkge1xyXG4gICAgICAgIGlmIChTeW1ib2xfMS5pc1N5bWJvbChwcm9wKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvLCBwcm9wKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8sIHByb3ApO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBleHBvcnRzLmdldE93blByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKG8pIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobykuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuICFCb29sZWFuKGtleS5tYXRjaCgvXkBALisvKSk7IH0pO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKG8pIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobylcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBCb29sZWFuKGtleS5tYXRjaCgvXkBALisvKSk7IH0pXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gU3ltYm9sLmZvcihrZXkuc3Vic3RyaW5nKDIpKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5pcyA9IGZ1bmN0aW9uIGlzKHZhbHVlMSwgdmFsdWUyKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlMSA9PT0gdmFsdWUyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTEgIT09IDAgfHwgMSAvIHZhbHVlMSA9PT0gMSAvIHZhbHVlMjsgLy8gLTBcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlMSAhPT0gdmFsdWUxICYmIHZhbHVlMiAhPT0gdmFsdWUyOyAvLyBOYU5cclxuICAgIH07XHJcbn1cclxuaWYgKGhhc18xLmRlZmF1bHQoJ2VzMjAxNy1vYmplY3QnKSkge1xyXG4gICAgdmFyIGdsb2JhbE9iamVjdCA9IGdsb2JhbF8xLmRlZmF1bHQuT2JqZWN0O1xyXG4gICAgZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID0gZ2xvYmFsT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnM7XHJcbiAgICBleHBvcnRzLmVudHJpZXMgPSBnbG9iYWxPYmplY3QuZW50cmllcztcclxuICAgIGV4cG9ydHMudmFsdWVzID0gZ2xvYmFsT2JqZWN0LnZhbHVlcztcclxufVxyXG5lbHNlIHtcclxuICAgIGV4cG9ydHMuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcnMobykge1xyXG4gICAgICAgIHJldHVybiBleHBvcnRzLmdldE93blByb3BlcnR5TmFtZXMobykucmVkdWNlKGZ1bmN0aW9uIChwcmV2aW91cywga2V5KSB7XHJcbiAgICAgICAgICAgIHByZXZpb3VzW2tleV0gPSBleHBvcnRzLmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvLCBrZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJldmlvdXM7XHJcbiAgICAgICAgfSwge30pO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuZW50cmllcyA9IGZ1bmN0aW9uIGVudHJpZXMobykge1xyXG4gICAgICAgIHJldHVybiBleHBvcnRzLmtleXMobykubWFwKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIFtrZXksIG9ba2V5XV07IH0pO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMudmFsdWVzID0gZnVuY3Rpb24gdmFsdWVzKG8pIHtcclxuICAgICAgICByZXR1cm4gZXhwb3J0cy5rZXlzKG8pLm1hcChmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBvW2tleV07IH0pO1xyXG4gICAgfTtcclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vb2JqZWN0LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL29iamVjdC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIi4vZ2xvYmFsXCIpO1xyXG52YXIgaGFzXzEgPSByZXF1aXJlKFwiLi9zdXBwb3J0L2hhc1wiKTtcclxudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3N1cHBvcnQvdXRpbFwiKTtcclxuLyoqXHJcbiAqIFRoZSBtaW5pbXVtIGxvY2F0aW9uIG9mIGhpZ2ggc3Vycm9nYXRlc1xyXG4gKi9cclxuZXhwb3J0cy5ISUdIX1NVUlJPR0FURV9NSU4gPSAweGQ4MDA7XHJcbi8qKlxyXG4gKiBUaGUgbWF4aW11bSBsb2NhdGlvbiBvZiBoaWdoIHN1cnJvZ2F0ZXNcclxuICovXHJcbmV4cG9ydHMuSElHSF9TVVJST0dBVEVfTUFYID0gMHhkYmZmO1xyXG4vKipcclxuICogVGhlIG1pbmltdW0gbG9jYXRpb24gb2YgbG93IHN1cnJvZ2F0ZXNcclxuICovXHJcbmV4cG9ydHMuTE9XX1NVUlJPR0FURV9NSU4gPSAweGRjMDA7XHJcbi8qKlxyXG4gKiBUaGUgbWF4aW11bSBsb2NhdGlvbiBvZiBsb3cgc3Vycm9nYXRlc1xyXG4gKi9cclxuZXhwb3J0cy5MT1dfU1VSUk9HQVRFX01BWCA9IDB4ZGZmZjtcclxuaWYgKGhhc18xLmRlZmF1bHQoJ2VzNi1zdHJpbmcnKSAmJiBoYXNfMS5kZWZhdWx0KCdlczYtc3RyaW5nLXJhdycpKSB7XHJcbiAgICBleHBvcnRzLmZyb21Db2RlUG9pbnQgPSBnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5mcm9tQ29kZVBvaW50O1xyXG4gICAgZXhwb3J0cy5yYXcgPSBnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5yYXc7XHJcbiAgICBleHBvcnRzLmNvZGVQb2ludEF0ID0gdXRpbF8xLndyYXBOYXRpdmUoZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcucHJvdG90eXBlLmNvZGVQb2ludEF0KTtcclxuICAgIGV4cG9ydHMuZW5kc1dpdGggPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5wcm90b3R5cGUuZW5kc1dpdGgpO1xyXG4gICAgZXhwb3J0cy5pbmNsdWRlcyA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlcyk7XHJcbiAgICBleHBvcnRzLm5vcm1hbGl6ZSA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnByb3RvdHlwZS5ub3JtYWxpemUpO1xyXG4gICAgZXhwb3J0cy5yZXBlYXQgPSB1dGlsXzEud3JhcE5hdGl2ZShnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5wcm90b3R5cGUucmVwZWF0KTtcclxuICAgIGV4cG9ydHMuc3RhcnRzV2l0aCA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoKTtcclxufVxyXG5lbHNlIHtcclxuICAgIC8qKlxyXG4gICAgICogVmFsaWRhdGVzIHRoYXQgdGV4dCBpcyBkZWZpbmVkLCBhbmQgbm9ybWFsaXplcyBwb3NpdGlvbiAoYmFzZWQgb24gdGhlIGdpdmVuIGRlZmF1bHQgaWYgdGhlIGlucHV0IGlzIE5hTikuXHJcbiAgICAgKiBVc2VkIGJ5IHN0YXJ0c1dpdGgsIGluY2x1ZGVzLCBhbmQgZW5kc1dpdGguXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiBOb3JtYWxpemVkIHBvc2l0aW9uLlxyXG4gICAgICovXHJcbiAgICB2YXIgbm9ybWFsaXplU3Vic3RyaW5nQXJnc18xID0gZnVuY3Rpb24gKG5hbWUsIHRleHQsIHNlYXJjaCwgcG9zaXRpb24sIGlzRW5kKSB7XHJcbiAgICAgICAgaWYgKGlzRW5kID09PSB2b2lkIDApIHsgaXNFbmQgPSBmYWxzZTsgfVxyXG4gICAgICAgIGlmICh0ZXh0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLicgKyBuYW1lICsgJyByZXF1aXJlcyBhIHZhbGlkIHN0cmluZyB0byBzZWFyY2ggYWdhaW5zdC4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRleHQubGVuZ3RoO1xyXG4gICAgICAgIHBvc2l0aW9uID0gcG9zaXRpb24gIT09IHBvc2l0aW9uID8gKGlzRW5kID8gbGVuZ3RoIDogMCkgOiBwb3NpdGlvbjtcclxuICAgICAgICByZXR1cm4gW3RleHQsIFN0cmluZyhzZWFyY2gpLCBNYXRoLm1pbihNYXRoLm1heChwb3NpdGlvbiwgMCksIGxlbmd0aCldO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuZnJvbUNvZGVQb2ludCA9IGZ1bmN0aW9uIGZyb21Db2RlUG9pbnQoKSB7XHJcbiAgICAgICAgdmFyIGNvZGVQb2ludHMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBjb2RlUG9pbnRzW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcuZnJvbUNvZGVQb2ludFxyXG4gICAgICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xyXG4gICAgICAgIGlmICghbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGZyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XHJcbiAgICAgICAgdmFyIE1BWF9TSVpFID0gMHg0MDAwO1xyXG4gICAgICAgIHZhciBjb2RlVW5pdHMgPSBbXTtcclxuICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcclxuICAgICAgICAgICAgdmFyIGNvZGVQb2ludCA9IE51bWJlcihhcmd1bWVudHNbaW5kZXhdKTtcclxuICAgICAgICAgICAgLy8gQ29kZSBwb2ludHMgbXVzdCBiZSBmaW5pdGUgaW50ZWdlcnMgd2l0aGluIHRoZSB2YWxpZCByYW5nZVxyXG4gICAgICAgICAgICB2YXIgaXNWYWxpZCA9IGlzRmluaXRlKGNvZGVQb2ludCkgJiYgTWF0aC5mbG9vcihjb2RlUG9pbnQpID09PSBjb2RlUG9pbnQgJiYgY29kZVBvaW50ID49IDAgJiYgY29kZVBvaW50IDw9IDB4MTBmZmZmO1xyXG4gICAgICAgICAgICBpZiAoIWlzVmFsaWQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IoJ3N0cmluZy5mcm9tQ29kZVBvaW50OiBJbnZhbGlkIGNvZGUgcG9pbnQgJyArIGNvZGVQb2ludCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvZGVQb2ludCA8PSAweGZmZmYpIHtcclxuICAgICAgICAgICAgICAgIC8vIEJNUCBjb2RlIHBvaW50XHJcbiAgICAgICAgICAgICAgICBjb2RlVW5pdHMucHVzaChjb2RlUG9pbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gQXN0cmFsIGNvZGUgcG9pbnQ7IHNwbGl0IGluIHN1cnJvZ2F0ZSBoYWx2ZXNcclxuICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nI3N1cnJvZ2F0ZS1mb3JtdWxhZVxyXG4gICAgICAgICAgICAgICAgY29kZVBvaW50IC09IDB4MTAwMDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGlnaFN1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgPj4gMTApICsgZXhwb3J0cy5ISUdIX1NVUlJPR0FURV9NSU47XHJcbiAgICAgICAgICAgICAgICB2YXIgbG93U3Vycm9nYXRlID0gY29kZVBvaW50ICUgMHg0MDAgKyBleHBvcnRzLkxPV19TVVJST0dBVEVfTUlOO1xyXG4gICAgICAgICAgICAgICAgY29kZVVuaXRzLnB1c2goaGlnaFN1cnJvZ2F0ZSwgbG93U3Vycm9nYXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaW5kZXggKyAxID09PSBsZW5ndGggfHwgY29kZVVuaXRzLmxlbmd0aCA+IE1BWF9TSVpFKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIGNvZGVVbml0cyk7XHJcbiAgICAgICAgICAgICAgICBjb2RlVW5pdHMubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMucmF3ID0gZnVuY3Rpb24gcmF3KGNhbGxTaXRlKSB7XHJcbiAgICAgICAgdmFyIHN1YnN0aXR1dGlvbnMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBzdWJzdGl0dXRpb25zW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmF3U3RyaW5ncyA9IGNhbGxTaXRlLnJhdztcclxuICAgICAgICB2YXIgcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgdmFyIG51bVN1YnN0aXR1dGlvbnMgPSBzdWJzdGl0dXRpb25zLmxlbmd0aDtcclxuICAgICAgICBpZiAoY2FsbFNpdGUgPT0gbnVsbCB8fCBjYWxsU2l0ZS5yYXcgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcucmF3IHJlcXVpcmVzIGEgdmFsaWQgY2FsbFNpdGUgb2JqZWN0IHdpdGggYSByYXcgdmFsdWUnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aF8xID0gcmF3U3RyaW5ncy5sZW5ndGg7IGkgPCBsZW5ndGhfMTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCArPSByYXdTdHJpbmdzW2ldICsgKGkgPCBudW1TdWJzdGl0dXRpb25zICYmIGkgPCBsZW5ndGhfMSAtIDEgPyBzdWJzdGl0dXRpb25zW2ldIDogJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMuY29kZVBvaW50QXQgPSBmdW5jdGlvbiBjb2RlUG9pbnRBdCh0ZXh0LCBwb3NpdGlvbikge1xyXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gdm9pZCAwKSB7IHBvc2l0aW9uID0gMDsgfVxyXG4gICAgICAgIC8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLmNvZGVQb2ludEF0XHJcbiAgICAgICAgaWYgKHRleHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcuY29kZVBvaW50QXQgcmVxdXJpZXMgYSB2YWxpZCBzdHJpbmcuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsZW5ndGggPSB0ZXh0Lmxlbmd0aDtcclxuICAgICAgICBpZiAocG9zaXRpb24gIT09IHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uIDwgMCB8fCBwb3NpdGlvbiA+PSBsZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gR2V0IHRoZSBmaXJzdCBjb2RlIHVuaXRcclxuICAgICAgICB2YXIgZmlyc3QgPSB0ZXh0LmNoYXJDb2RlQXQocG9zaXRpb24pO1xyXG4gICAgICAgIGlmIChmaXJzdCA+PSBleHBvcnRzLkhJR0hfU1VSUk9HQVRFX01JTiAmJiBmaXJzdCA8PSBleHBvcnRzLkhJR0hfU1VSUk9HQVRFX01BWCAmJiBsZW5ndGggPiBwb3NpdGlvbiArIDEpIHtcclxuICAgICAgICAgICAgLy8gU3RhcnQgb2YgYSBzdXJyb2dhdGUgcGFpciAoaGlnaCBzdXJyb2dhdGUgYW5kIHRoZXJlIGlzIGEgbmV4dCBjb2RlIHVuaXQpOyBjaGVjayBmb3IgbG93IHN1cnJvZ2F0ZVxyXG4gICAgICAgICAgICAvLyBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZyNzdXJyb2dhdGUtZm9ybXVsYWVcclxuICAgICAgICAgICAgdmFyIHNlY29uZCA9IHRleHQuY2hhckNvZGVBdChwb3NpdGlvbiArIDEpO1xyXG4gICAgICAgICAgICBpZiAoc2Vjb25kID49IGV4cG9ydHMuTE9XX1NVUlJPR0FURV9NSU4gJiYgc2Vjb25kIDw9IGV4cG9ydHMuTE9XX1NVUlJPR0FURV9NQVgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoZmlyc3QgLSBleHBvcnRzLkhJR0hfU1VSUk9HQVRFX01JTikgKiAweDQwMCArIHNlY29uZCAtIGV4cG9ydHMuTE9XX1NVUlJPR0FURV9NSU4gKyAweDEwMDAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmaXJzdDtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLmVuZHNXaXRoID0gZnVuY3Rpb24gZW5kc1dpdGgodGV4dCwgc2VhcmNoLCBlbmRQb3NpdGlvbikge1xyXG4gICAgICAgIGlmIChlbmRQb3NpdGlvbiA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGVuZFBvc2l0aW9uID0gdGV4dC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF9hID0gdHNsaWJfMS5fX3JlYWQobm9ybWFsaXplU3Vic3RyaW5nQXJnc18xKCdlbmRzV2l0aCcsIHRleHQsIHNlYXJjaCwgZW5kUG9zaXRpb24sIHRydWUpLCAzKSwgdGV4dCA9IF9hWzBdLCBzZWFyY2ggPSBfYVsxXSwgZW5kUG9zaXRpb24gPSBfYVsyXTtcclxuICAgICAgICB2YXIgc3RhcnQgPSBlbmRQb3NpdGlvbiAtIHNlYXJjaC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZXh0LnNsaWNlKHN0YXJ0LCBlbmRQb3NpdGlvbikgPT09IHNlYXJjaDtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0cy5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzKHRleHQsIHNlYXJjaCwgcG9zaXRpb24pIHtcclxuICAgICAgICBpZiAocG9zaXRpb24gPT09IHZvaWQgMCkgeyBwb3NpdGlvbiA9IDA7IH1cclxuICAgICAgICBfYSA9IHRzbGliXzEuX19yZWFkKG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3NfMSgnaW5jbHVkZXMnLCB0ZXh0LCBzZWFyY2gsIHBvc2l0aW9uKSwgMyksIHRleHQgPSBfYVswXSwgc2VhcmNoID0gX2FbMV0sIHBvc2l0aW9uID0gX2FbMl07XHJcbiAgICAgICAgcmV0dXJuIHRleHQuaW5kZXhPZihzZWFyY2gsIHBvc2l0aW9uKSAhPT0gLTE7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgfTtcclxuICAgIGV4cG9ydHMucmVwZWF0ID0gZnVuY3Rpb24gcmVwZWF0KHRleHQsIGNvdW50KSB7XHJcbiAgICAgICAgaWYgKGNvdW50ID09PSB2b2lkIDApIHsgY291bnQgPSAwOyB9XHJcbiAgICAgICAgLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL1N0cmluZy5wcm90b3R5cGUucmVwZWF0XHJcbiAgICAgICAgaWYgKHRleHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHJpbmcucmVwZWF0IHJlcXVpcmVzIGEgdmFsaWQgc3RyaW5nLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY291bnQgIT09IGNvdW50KSB7XHJcbiAgICAgICAgICAgIGNvdW50ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvdW50IDwgMCB8fCBjb3VudCA9PT0gSW5maW5pdHkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSBub24tbmVnYXRpdmUgZmluaXRlIGNvdW50LicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgd2hpbGUgKGNvdW50KSB7XHJcbiAgICAgICAgICAgIGlmIChjb3VudCAlIDIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSB0ZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb3VudCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHRleHQgKz0gdGV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb3VudCA+Pj0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLnN0YXJ0c1dpdGggPSBmdW5jdGlvbiBzdGFydHNXaXRoKHRleHQsIHNlYXJjaCwgcG9zaXRpb24pIHtcclxuICAgICAgICBpZiAocG9zaXRpb24gPT09IHZvaWQgMCkgeyBwb3NpdGlvbiA9IDA7IH1cclxuICAgICAgICBzZWFyY2ggPSBTdHJpbmcoc2VhcmNoKTtcclxuICAgICAgICBfYSA9IHRzbGliXzEuX19yZWFkKG5vcm1hbGl6ZVN1YnN0cmluZ0FyZ3NfMSgnc3RhcnRzV2l0aCcsIHRleHQsIHNlYXJjaCwgcG9zaXRpb24pLCAzKSwgdGV4dCA9IF9hWzBdLCBzZWFyY2ggPSBfYVsxXSwgcG9zaXRpb24gPSBfYVsyXTtcclxuICAgICAgICB2YXIgZW5kID0gcG9zaXRpb24gKyBzZWFyY2gubGVuZ3RoO1xyXG4gICAgICAgIGlmIChlbmQgPiB0ZXh0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZXh0LnNsaWNlKHBvc2l0aW9uLCBlbmQpID09PSBzZWFyY2g7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgfTtcclxufVxyXG5pZiAoaGFzXzEuZGVmYXVsdCgnZXMyMDE3LXN0cmluZycpKSB7XHJcbiAgICBleHBvcnRzLnBhZEVuZCA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnByb3RvdHlwZS5wYWRFbmQpO1xyXG4gICAgZXhwb3J0cy5wYWRTdGFydCA9IHV0aWxfMS53cmFwTmF0aXZlKGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnByb3RvdHlwZS5wYWRTdGFydCk7XHJcbn1cclxuZWxzZSB7XHJcbiAgICBleHBvcnRzLnBhZEVuZCA9IGZ1bmN0aW9uIHBhZEVuZCh0ZXh0LCBtYXhMZW5ndGgsIGZpbGxTdHJpbmcpIHtcclxuICAgICAgICBpZiAoZmlsbFN0cmluZyA9PT0gdm9pZCAwKSB7IGZpbGxTdHJpbmcgPSAnICc7IH1cclxuICAgICAgICBpZiAodGV4dCA9PT0gbnVsbCB8fCB0ZXh0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyaW5nLnJlcGVhdCByZXF1aXJlcyBhIHZhbGlkIHN0cmluZy4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1heExlbmd0aCA9PT0gSW5maW5pdHkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3N0cmluZy5wYWRFbmQgcmVxdWlyZXMgYSBub24tbmVnYXRpdmUgZmluaXRlIGNvdW50LicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobWF4TGVuZ3RoID09PSBudWxsIHx8IG1heExlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IG1heExlbmd0aCA8IDApIHtcclxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHN0clRleHQgPSBTdHJpbmcodGV4dCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBtYXhMZW5ndGggLSBzdHJUZXh0Lmxlbmd0aDtcclxuICAgICAgICBpZiAocGFkZGluZyA+IDApIHtcclxuICAgICAgICAgICAgc3RyVGV4dCArPVxyXG4gICAgICAgICAgICAgICAgZXhwb3J0cy5yZXBlYXQoZmlsbFN0cmluZywgTWF0aC5mbG9vcihwYWRkaW5nIC8gZmlsbFN0cmluZy5sZW5ndGgpKSArXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbFN0cmluZy5zbGljZSgwLCBwYWRkaW5nICUgZmlsbFN0cmluZy5sZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3RyVGV4dDtcclxuICAgIH07XHJcbiAgICBleHBvcnRzLnBhZFN0YXJ0ID0gZnVuY3Rpb24gcGFkU3RhcnQodGV4dCwgbWF4TGVuZ3RoLCBmaWxsU3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKGZpbGxTdHJpbmcgPT09IHZvaWQgMCkgeyBmaWxsU3RyaW5nID0gJyAnOyB9XHJcbiAgICAgICAgaWYgKHRleHQgPT09IG51bGwgfHwgdGV4dCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZy5yZXBlYXQgcmVxdWlyZXMgYSB2YWxpZCBzdHJpbmcuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtYXhMZW5ndGggPT09IEluZmluaXR5KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdzdHJpbmcucGFkU3RhcnQgcmVxdWlyZXMgYSBub24tbmVnYXRpdmUgZmluaXRlIGNvdW50LicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobWF4TGVuZ3RoID09PSBudWxsIHx8IG1heExlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IG1heExlbmd0aCA8IDApIHtcclxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHN0clRleHQgPSBTdHJpbmcodGV4dCk7XHJcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBtYXhMZW5ndGggLSBzdHJUZXh0Lmxlbmd0aDtcclxuICAgICAgICBpZiAocGFkZGluZyA+IDApIHtcclxuICAgICAgICAgICAgc3RyVGV4dCA9XHJcbiAgICAgICAgICAgICAgICBleHBvcnRzLnJlcGVhdChmaWxsU3RyaW5nLCBNYXRoLmZsb29yKHBhZGRpbmcgLyBmaWxsU3RyaW5nLmxlbmd0aCkpICtcclxuICAgICAgICAgICAgICAgICAgICBmaWxsU3RyaW5nLnNsaWNlKDAsIHBhZGRpbmcgJSBmaWxsU3RyaW5nLmxlbmd0aCkgK1xyXG4gICAgICAgICAgICAgICAgICAgIHN0clRleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHJUZXh0O1xyXG4gICAgfTtcclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3RyaW5nLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N0cmluZy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIGhhc18xID0gcmVxdWlyZShcIkBkb2pvL2hhcy9oYXNcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuLi9nbG9iYWxcIik7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGhhc18xLmRlZmF1bHQ7XHJcbnRzbGliXzEuX19leHBvcnRTdGFyKHJlcXVpcmUoXCJAZG9qby9oYXMvaGFzXCIpLCBleHBvcnRzKTtcclxuLyogRUNNQVNjcmlwdCA2IGFuZCA3IEZlYXR1cmVzICovXHJcbi8qIEFycmF5ICovXHJcbmhhc18xLmFkZCgnZXM2LWFycmF5JywgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIChbJ2Zyb20nLCAnb2YnXS5ldmVyeShmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBrZXkgaW4gZ2xvYmFsXzEuZGVmYXVsdC5BcnJheTsgfSkgJiZcclxuICAgICAgICBbJ2ZpbmRJbmRleCcsICdmaW5kJywgJ2NvcHlXaXRoaW4nXS5ldmVyeShmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBrZXkgaW4gZ2xvYmFsXzEuZGVmYXVsdC5BcnJheS5wcm90b3R5cGU7IH0pKTtcclxufSwgdHJ1ZSk7XHJcbmhhc18xLmFkZCgnZXM2LWFycmF5LWZpbGwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoJ2ZpbGwnIGluIGdsb2JhbF8xLmRlZmF1bHQuQXJyYXkucHJvdG90eXBlKSB7XHJcbiAgICAgICAgLyogU29tZSB2ZXJzaW9ucyBvZiBTYWZhcmkgZG8gbm90IHByb3Blcmx5IGltcGxlbWVudCB0aGlzICovXHJcbiAgICAgICAgcmV0dXJuIFsxXS5maWxsKDksIE51bWJlci5QT1NJVElWRV9JTkZJTklUWSlbMF0gPT09IDE7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0sIHRydWUpO1xyXG5oYXNfMS5hZGQoJ2VzNy1hcnJheScsIGZ1bmN0aW9uICgpIHsgcmV0dXJuICdpbmNsdWRlcycgaW4gZ2xvYmFsXzEuZGVmYXVsdC5BcnJheS5wcm90b3R5cGU7IH0sIHRydWUpO1xyXG4vKiBNYXAgKi9cclxuaGFzXzEuYWRkKCdlczYtbWFwJywgZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0Lk1hcCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIC8qXHJcbiAgICBJRTExIGFuZCBvbGRlciB2ZXJzaW9ucyBvZiBTYWZhcmkgYXJlIG1pc3NpbmcgY3JpdGljYWwgRVM2IE1hcCBmdW5jdGlvbmFsaXR5XHJcbiAgICBXZSB3cmFwIHRoaXMgaW4gYSB0cnkvY2F0Y2ggYmVjYXVzZSBzb21ldGltZXMgdGhlIE1hcCBjb25zdHJ1Y3RvciBleGlzdHMsIGJ1dCBkb2VzIG5vdFxyXG4gICAgdGFrZSBhcmd1bWVudHMgKGlPUyA4LjQpXHJcbiAgICAgKi9cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB2YXIgbWFwID0gbmV3IGdsb2JhbF8xLmRlZmF1bHQuTWFwKFtbMCwgMV1dKTtcclxuICAgICAgICAgICAgcmV0dXJuIChtYXAuaGFzKDApICYmXHJcbiAgICAgICAgICAgICAgICB0eXBlb2YgbWFwLmtleXMgPT09ICdmdW5jdGlvbicgJiZcclxuICAgICAgICAgICAgICAgIGhhc18xLmRlZmF1bHQoJ2VzNi1zeW1ib2wnKSAmJlxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIG1hcC52YWx1ZXMgPT09ICdmdW5jdGlvbicgJiZcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBtYXAuZW50cmllcyA9PT0gJ2Z1bmN0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBub3QgdGVzdGluZyBvbiBpT1MgYXQgdGhlIG1vbWVudCAqL1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59LCB0cnVlKTtcclxuLyogTWF0aCAqL1xyXG5oYXNfMS5hZGQoJ2VzNi1tYXRoJywgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICAnY2x6MzInLFxyXG4gICAgICAgICdzaWduJyxcclxuICAgICAgICAnbG9nMTAnLFxyXG4gICAgICAgICdsb2cyJyxcclxuICAgICAgICAnbG9nMXAnLFxyXG4gICAgICAgICdleHBtMScsXHJcbiAgICAgICAgJ2Nvc2gnLFxyXG4gICAgICAgICdzaW5oJyxcclxuICAgICAgICAndGFuaCcsXHJcbiAgICAgICAgJ2Fjb3NoJyxcclxuICAgICAgICAnYXNpbmgnLFxyXG4gICAgICAgICdhdGFuaCcsXHJcbiAgICAgICAgJ3RydW5jJyxcclxuICAgICAgICAnZnJvdW5kJyxcclxuICAgICAgICAnY2JydCcsXHJcbiAgICAgICAgJ2h5cG90J1xyXG4gICAgXS5ldmVyeShmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuTWF0aFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJzsgfSk7XHJcbn0sIHRydWUpO1xyXG5oYXNfMS5hZGQoJ2VzNi1tYXRoLWltdWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoJ2ltdWwnIGluIGdsb2JhbF8xLmRlZmF1bHQuTWF0aCkge1xyXG4gICAgICAgIC8qIFNvbWUgdmVyc2lvbnMgb2YgU2FmYXJpIG9uIGlvcyBkbyBub3QgcHJvcGVybHkgaW1wbGVtZW50IHRoaXMgKi9cclxuICAgICAgICByZXR1cm4gTWF0aC5pbXVsKDB4ZmZmZmZmZmYsIDUpID09PSAtNTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufSwgdHJ1ZSk7XHJcbi8qIE9iamVjdCAqL1xyXG5oYXNfMS5hZGQoJ2VzNi1vYmplY3QnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gKGhhc18xLmRlZmF1bHQoJ2VzNi1zeW1ib2wnKSAmJlxyXG4gICAgICAgIFsnYXNzaWduJywgJ2lzJywgJ2dldE93blByb3BlcnR5U3ltYm9scycsICdzZXRQcm90b3R5cGVPZiddLmV2ZXJ5KGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5PYmplY3RbbmFtZV0gPT09ICdmdW5jdGlvbic7IH0pKTtcclxufSwgdHJ1ZSk7XHJcbmhhc18xLmFkZCgnZXMyMDE3LW9iamVjdCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBbJ3ZhbHVlcycsICdlbnRyaWVzJywgJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcnMnXS5ldmVyeShmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuT2JqZWN0W25hbWVdID09PSAnZnVuY3Rpb24nOyB9KTtcclxufSwgdHJ1ZSk7XHJcbi8qIE9ic2VydmFibGUgKi9cclxuaGFzXzEuYWRkKCdlcy1vYnNlcnZhYmxlJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuT2JzZXJ2YWJsZSAhPT0gJ3VuZGVmaW5lZCc7IH0sIHRydWUpO1xyXG4vKiBQcm9taXNlICovXHJcbmhhc18xLmFkZCgnZXM2LXByb21pc2UnLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5Qcm9taXNlICE9PSAndW5kZWZpbmVkJyAmJiBoYXNfMS5kZWZhdWx0KCdlczYtc3ltYm9sJyk7IH0sIHRydWUpO1xyXG4vKiBTZXQgKi9cclxuaGFzXzEuYWRkKCdlczYtc2V0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LlNldCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIC8qIElFMTEgYW5kIG9sZGVyIHZlcnNpb25zIG9mIFNhZmFyaSBhcmUgbWlzc2luZyBjcml0aWNhbCBFUzYgU2V0IGZ1bmN0aW9uYWxpdHkgKi9cclxuICAgICAgICB2YXIgc2V0ID0gbmV3IGdsb2JhbF8xLmRlZmF1bHQuU2V0KFsxXSk7XHJcbiAgICAgICAgcmV0dXJuIHNldC5oYXMoMSkgJiYgJ2tleXMnIGluIHNldCAmJiB0eXBlb2Ygc2V0LmtleXMgPT09ICdmdW5jdGlvbicgJiYgaGFzXzEuZGVmYXVsdCgnZXM2LXN5bWJvbCcpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59LCB0cnVlKTtcclxuLyogU3RyaW5nICovXHJcbmhhc18xLmFkZCgnZXM2LXN0cmluZycsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAoW1xyXG4gICAgICAgIC8qIHN0YXRpYyBtZXRob2RzICovXHJcbiAgICAgICAgJ2Zyb21Db2RlUG9pbnQnXHJcbiAgICBdLmV2ZXJ5KGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHR5cGVvZiBnbG9iYWxfMS5kZWZhdWx0LlN0cmluZ1trZXldID09PSAnZnVuY3Rpb24nOyB9KSAmJlxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgLyogaW5zdGFuY2UgbWV0aG9kcyAqL1xyXG4gICAgICAgICAgICAnY29kZVBvaW50QXQnLFxyXG4gICAgICAgICAgICAnbm9ybWFsaXplJyxcclxuICAgICAgICAgICAgJ3JlcGVhdCcsXHJcbiAgICAgICAgICAgICdzdGFydHNXaXRoJyxcclxuICAgICAgICAgICAgJ2VuZHNXaXRoJyxcclxuICAgICAgICAgICAgJ2luY2x1ZGVzJ1xyXG4gICAgICAgIF0uZXZlcnkoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnByb3RvdHlwZVtrZXldID09PSAnZnVuY3Rpb24nOyB9KSk7XHJcbn0sIHRydWUpO1xyXG5oYXNfMS5hZGQoJ2VzNi1zdHJpbmctcmF3JywgZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gZ2V0Q2FsbFNpdGUoY2FsbFNpdGUpIHtcclxuICAgICAgICB2YXIgc3Vic3RpdHV0aW9ucyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIHN1YnN0aXR1dGlvbnNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXN1bHQgPSB0c2xpYl8xLl9fc3ByZWFkKGNhbGxTaXRlKTtcclxuICAgICAgICByZXN1bHQucmF3ID0gY2FsbFNpdGUucmF3O1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBpZiAoJ3JhdycgaW4gZ2xvYmFsXzEuZGVmYXVsdC5TdHJpbmcpIHtcclxuICAgICAgICB2YXIgYiA9IDE7XHJcbiAgICAgICAgdmFyIGNhbGxTaXRlID0gZ2V0Q2FsbFNpdGUodGVtcGxhdGVPYmplY3RfMSB8fCAodGVtcGxhdGVPYmplY3RfMSA9IHRzbGliXzEuX19tYWtlVGVtcGxhdGVPYmplY3QoW1wiYVxcblwiLCBcIlwiXSwgW1wiYVxcXFxuXCIsIFwiXCJdKSksIGIpO1xyXG4gICAgICAgIGNhbGxTaXRlLnJhdyA9IFsnYVxcXFxuJ107XHJcbiAgICAgICAgdmFyIHN1cHBvcnRzVHJ1bmMgPSBnbG9iYWxfMS5kZWZhdWx0LlN0cmluZy5yYXcoY2FsbFNpdGUsIDQyKSA9PT0gJ2E6XFxcXG4nO1xyXG4gICAgICAgIHJldHVybiBzdXBwb3J0c1RydW5jO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59LCB0cnVlKTtcclxuaGFzXzEuYWRkKCdlczIwMTctc3RyaW5nJywgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIFsncGFkU3RhcnQnLCAncGFkRW5kJ10uZXZlcnkoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuU3RyaW5nLnByb3RvdHlwZVtrZXldID09PSAnZnVuY3Rpb24nOyB9KTtcclxufSwgdHJ1ZSk7XHJcbi8qIFN5bWJvbCAqL1xyXG5oYXNfMS5hZGQoJ2VzNi1zeW1ib2wnLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5TeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBTeW1ib2woKSA9PT0gJ3N5bWJvbCc7IH0sIHRydWUpO1xyXG4vKiBXZWFrTWFwICovXHJcbmhhc18xLmFkZCgnZXM2LXdlYWttYXAnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQuV2Vha01hcCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvKiBJRTExIGFuZCBvbGRlciB2ZXJzaW9ucyBvZiBTYWZhcmkgYXJlIG1pc3NpbmcgY3JpdGljYWwgRVM2IE1hcCBmdW5jdGlvbmFsaXR5ICovXHJcbiAgICAgICAgdmFyIGtleTEgPSB7fTtcclxuICAgICAgICB2YXIga2V5MiA9IHt9O1xyXG4gICAgICAgIHZhciBtYXAgPSBuZXcgZ2xvYmFsXzEuZGVmYXVsdC5XZWFrTWFwKFtba2V5MSwgMV1dKTtcclxuICAgICAgICBPYmplY3QuZnJlZXplKGtleTEpO1xyXG4gICAgICAgIHJldHVybiBtYXAuZ2V0KGtleTEpID09PSAxICYmIG1hcC5zZXQoa2V5MiwgMikgPT09IG1hcCAmJiBoYXNfMS5kZWZhdWx0KCdlczYtc3ltYm9sJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn0sIHRydWUpO1xyXG4vKiBNaXNjZWxsYW5lb3VzIGZlYXR1cmVzICovXHJcbmhhc18xLmFkZCgnbWljcm90YXNrcycsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGhhc18xLmRlZmF1bHQoJ2VzNi1wcm9taXNlJykgfHwgaGFzXzEuZGVmYXVsdCgnaG9zdC1ub2RlJykgfHwgaGFzXzEuZGVmYXVsdCgnZG9tLW11dGF0aW9ub2JzZXJ2ZXInKTsgfSwgdHJ1ZSk7XHJcbmhhc18xLmFkZCgncG9zdG1lc3NhZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBJZiB3aW5kb3cgaXMgdW5kZWZpbmVkLCBhbmQgd2UgaGF2ZSBwb3N0TWVzc2FnZSwgaXQgcHJvYmFibHkgbWVhbnMgd2UncmUgaW4gYSB3ZWIgd29ya2VyLiBXZWIgd29ya2VycyBoYXZlXHJcbiAgICAvLyBwb3N0IG1lc3NhZ2UgYnV0IGl0IGRvZXNuJ3Qgd29yayBob3cgd2UgZXhwZWN0IGl0IHRvLCBzbyBpdCdzIGJlc3QganVzdCB0byBwcmV0ZW5kIGl0IGRvZXNuJ3QgZXhpc3QuXHJcbiAgICByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQud2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5wb3N0TWVzc2FnZSA9PT0gJ2Z1bmN0aW9uJztcclxufSwgdHJ1ZSk7XHJcbmhhc18xLmFkZCgncmFmJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gdHlwZW9mIGdsb2JhbF8xLmRlZmF1bHQucmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nOyB9LCB0cnVlKTtcclxuaGFzXzEuYWRkKCdzZXRpbW1lZGlhdGUnLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0eXBlb2YgZ2xvYmFsXzEuZGVmYXVsdC5zZXRJbW1lZGlhdGUgIT09ICd1bmRlZmluZWQnOyB9LCB0cnVlKTtcclxuLyogRE9NIEZlYXR1cmVzICovXHJcbmhhc18xLmFkZCgnZG9tLW11dGF0aW9ub2JzZXJ2ZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoaGFzXzEuZGVmYXVsdCgnaG9zdC1icm93c2VyJykgJiYgQm9vbGVhbihnbG9iYWxfMS5kZWZhdWx0Lk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsXzEuZGVmYXVsdC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyKSkge1xyXG4gICAgICAgIC8vIElFMTEgaGFzIGFuIHVucmVsaWFibGUgTXV0YXRpb25PYnNlcnZlciBpbXBsZW1lbnRhdGlvbiB3aGVyZSBzZXRQcm9wZXJ0eSgpIGRvZXMgbm90XHJcbiAgICAgICAgLy8gZ2VuZXJhdGUgYSBtdXRhdGlvbiBldmVudCwgb2JzZXJ2ZXJzIGNhbiBjcmFzaCwgYW5kIHRoZSBxdWV1ZSBkb2VzIG5vdCBkcmFpblxyXG4gICAgICAgIC8vIHJlbGlhYmx5LiBUaGUgZm9sbG93aW5nIGZlYXR1cmUgdGVzdCB3YXMgYWRhcHRlZCBmcm9tXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vdDEwa28vNGFjZWI4YzcxNjgxZmRiMjc1ZTMzZWZlNWU1NzZiMTRcclxuICAgICAgICB2YXIgZXhhbXBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lICovXHJcbiAgICAgICAgdmFyIEhvc3RNdXRhdGlvbk9ic2VydmVyID0gZ2xvYmFsXzEuZGVmYXVsdC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbF8xLmRlZmF1bHQuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcclxuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgSG9zdE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKCkgeyB9KTtcclxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGV4YW1wbGUsIHsgYXR0cmlidXRlczogdHJ1ZSB9KTtcclxuICAgICAgICBleGFtcGxlLnN0eWxlLnNldFByb3BlcnR5KCdkaXNwbGF5JywgJ2Jsb2NrJyk7XHJcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4ob2JzZXJ2ZXIudGFrZVJlY29yZHMoKS5sZW5ndGgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59LCB0cnVlKTtcclxuaGFzXzEuYWRkKCdkb20td2ViYW5pbWF0aW9uJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gaGFzXzEuZGVmYXVsdCgnaG9zdC1icm93c2VyJykgJiYgZ2xvYmFsXzEuZGVmYXVsdC5BbmltYXRpb24gIT09IHVuZGVmaW5lZCAmJiBnbG9iYWxfMS5kZWZhdWx0LktleWZyYW1lRWZmZWN0ICE9PSB1bmRlZmluZWQ7IH0sIHRydWUpO1xyXG52YXIgdGVtcGxhdGVPYmplY3RfMTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvaGFzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvaGFzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCIuLi9nbG9iYWxcIik7XHJcbnZhciBoYXNfMSA9IHJlcXVpcmUoXCIuL2hhc1wiKTtcclxuZnVuY3Rpb24gZXhlY3V0ZVRhc2soaXRlbSkge1xyXG4gICAgaWYgKGl0ZW0gJiYgaXRlbS5pc0FjdGl2ZSAmJiBpdGVtLmNhbGxiYWNrKSB7XHJcbiAgICAgICAgaXRlbS5jYWxsYmFjaygpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGdldFF1ZXVlSGFuZGxlKGl0ZW0sIGRlc3RydWN0b3IpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7IH07XHJcbiAgICAgICAgICAgIGl0ZW0uaXNBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgaXRlbS5jYWxsYmFjayA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChkZXN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICBkZXN0cnVjdG9yKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbnZhciBjaGVja01pY3JvVGFza1F1ZXVlO1xyXG52YXIgbWljcm9UYXNrcztcclxuLyoqXHJcbiAqIFNjaGVkdWxlcyBhIGNhbGxiYWNrIHRvIHRoZSBtYWNyb3Rhc2sgcXVldWUuXHJcbiAqXHJcbiAqIEBwYXJhbSBjYWxsYmFjayB0aGUgZnVuY3Rpb24gdG8gYmUgcXVldWVkIGFuZCBsYXRlciBleGVjdXRlZC5cclxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggYSBgZGVzdHJveWAgbWV0aG9kIHRoYXQsIHdoZW4gY2FsbGVkLCBwcmV2ZW50cyB0aGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmcm9tIGV4ZWN1dGluZy5cclxuICovXHJcbmV4cG9ydHMucXVldWVUYXNrID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBkZXN0cnVjdG9yO1xyXG4gICAgdmFyIGVucXVldWU7XHJcbiAgICAvLyBTaW5jZSB0aGUgSUUgaW1wbGVtZW50YXRpb24gb2YgYHNldEltbWVkaWF0ZWAgaXMgbm90IGZsYXdsZXNzLCB3ZSB3aWxsIHRlc3QgZm9yIGBwb3N0TWVzc2FnZWAgZmlyc3QuXHJcbiAgICBpZiAoaGFzXzEuZGVmYXVsdCgncG9zdG1lc3NhZ2UnKSkge1xyXG4gICAgICAgIHZhciBxdWV1ZV8xID0gW107XHJcbiAgICAgICAgZ2xvYmFsXzEuZGVmYXVsdC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIC8vIENvbmZpcm0gdGhhdCB0aGUgZXZlbnQgd2FzIHRyaWdnZXJlZCBieSB0aGUgY3VycmVudCB3aW5kb3cgYW5kIGJ5IHRoaXMgcGFydGljdWxhciBpbXBsZW1lbnRhdGlvbi5cclxuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsXzEuZGVmYXVsdCAmJiBldmVudC5kYXRhID09PSAnZG9qby1xdWV1ZS1tZXNzYWdlJykge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocXVldWVfMS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlVGFzayhxdWV1ZV8xLnNoaWZ0KCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIHF1ZXVlXzEucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgZ2xvYmFsXzEuZGVmYXVsdC5wb3N0TWVzc2FnZSgnZG9qby1xdWV1ZS1tZXNzYWdlJywgJyonKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaGFzXzEuZGVmYXVsdCgnc2V0aW1tZWRpYXRlJykpIHtcclxuICAgICAgICBkZXN0cnVjdG9yID0gZ2xvYmFsXzEuZGVmYXVsdC5jbGVhckltbWVkaWF0ZTtcclxuICAgICAgICBlbnF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNldEltbWVkaWF0ZShleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZGVzdHJ1Y3RvciA9IGdsb2JhbF8xLmRlZmF1bHQuY2xlYXJUaW1lb3V0O1xyXG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChleGVjdXRlVGFzay5iaW5kKG51bGwsIGl0ZW0pLCAwKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcXVldWVUYXNrKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBpZCA9IGVucXVldWUoaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIGdldFF1ZXVlSGFuZGxlKGl0ZW0sIGRlc3RydWN0b3IgJiZcclxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZGVzdHJ1Y3RvcihpZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy8gVE9ETzogVXNlIGFzcGVjdC5iZWZvcmUgd2hlbiBpdCBpcyBhdmFpbGFibGUuXHJcbiAgICByZXR1cm4gaGFzXzEuZGVmYXVsdCgnbWljcm90YXNrcycpXHJcbiAgICAgICAgPyBxdWV1ZVRhc2tcclxuICAgICAgICA6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICBjaGVja01pY3JvVGFza1F1ZXVlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBxdWV1ZVRhc2soY2FsbGJhY2spO1xyXG4gICAgICAgIH07XHJcbn0pKCk7XHJcbi8vIFdoZW4gbm8gbWVjaGFuaXNtIGZvciByZWdpc3RlcmluZyBtaWNyb3Rhc2tzIGlzIGV4cG9zZWQgYnkgdGhlIGVudmlyb25tZW50LCBtaWNyb3Rhc2tzIHdpbGxcclxuLy8gYmUgcXVldWVkIGFuZCB0aGVuIGV4ZWN1dGVkIGluIGEgc2luZ2xlIG1hY3JvdGFzayBiZWZvcmUgdGhlIG90aGVyIG1hY3JvdGFza3MgYXJlIGV4ZWN1dGVkLlxyXG5pZiAoIWhhc18xLmRlZmF1bHQoJ21pY3JvdGFza3MnKSkge1xyXG4gICAgdmFyIGlzTWljcm9UYXNrUXVldWVkXzEgPSBmYWxzZTtcclxuICAgIG1pY3JvVGFza3MgPSBbXTtcclxuICAgIGNoZWNrTWljcm9UYXNrUXVldWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCFpc01pY3JvVGFza1F1ZXVlZF8xKSB7XHJcbiAgICAgICAgICAgIGlzTWljcm9UYXNrUXVldWVkXzEgPSB0cnVlO1xyXG4gICAgICAgICAgICBleHBvcnRzLnF1ZXVlVGFzayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpc01pY3JvVGFza1F1ZXVlZF8xID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAobWljcm9UYXNrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHZvaWQgMDtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoKGl0ZW0gPSBtaWNyb1Rhc2tzLnNoaWZ0KCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4ZWN1dGVUYXNrKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG4vKipcclxuICogU2NoZWR1bGVzIGFuIGFuaW1hdGlvbiB0YXNrIHdpdGggYHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIGlmIGl0IGV4aXN0cywgb3Igd2l0aCBgcXVldWVUYXNrYCBvdGhlcndpc2UuXHJcbiAqXHJcbiAqIFNpbmNlIHJlcXVlc3RBbmltYXRpb25GcmFtZSdzIGJlaGF2aW9yIGRvZXMgbm90IG1hdGNoIHRoYXQgZXhwZWN0ZWQgZnJvbSBgcXVldWVUYXNrYCwgaXQgaXMgbm90IHVzZWQgdGhlcmUuXHJcbiAqIEhvd2V2ZXIsIGF0IHRpbWVzIGl0IG1ha2VzIG1vcmUgc2Vuc2UgdG8gZGVsZWdhdGUgdG8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lOyBoZW5jZSB0aGUgZm9sbG93aW5nIG1ldGhvZC5cclxuICpcclxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSBmdW5jdGlvbiB0byBiZSBxdWV1ZWQgYW5kIGxhdGVyIGV4ZWN1dGVkLlxyXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCBhIGBkZXN0cm95YCBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIHByZXZlbnRzIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZyb20gZXhlY3V0aW5nLlxyXG4gKi9cclxuZXhwb3J0cy5xdWV1ZUFuaW1hdGlvblRhc2sgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCFoYXNfMS5kZWZhdWx0KCdyYWYnKSkge1xyXG4gICAgICAgIHJldHVybiBleHBvcnRzLnF1ZXVlVGFzaztcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHF1ZXVlQW5pbWF0aW9uVGFzayhjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBpdGVtID0ge1xyXG4gICAgICAgICAgICBpc0FjdGl2ZTogdHJ1ZSxcclxuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgcmFmSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSk7XHJcbiAgICAgICAgcmV0dXJuIGdldFF1ZXVlSGFuZGxlKGl0ZW0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUocmFmSWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy8gVE9ETzogVXNlIGFzcGVjdC5iZWZvcmUgd2hlbiBpdCBpcyBhdmFpbGFibGUuXHJcbiAgICByZXR1cm4gaGFzXzEuZGVmYXVsdCgnbWljcm90YXNrcycpXHJcbiAgICAgICAgPyBxdWV1ZUFuaW1hdGlvblRhc2tcclxuICAgICAgICA6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICBjaGVja01pY3JvVGFza1F1ZXVlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBxdWV1ZUFuaW1hdGlvblRhc2soY2FsbGJhY2spO1xyXG4gICAgICAgIH07XHJcbn0pKCk7XHJcbi8qKlxyXG4gKiBTY2hlZHVsZXMgYSBjYWxsYmFjayB0byB0aGUgbWljcm90YXNrIHF1ZXVlLlxyXG4gKlxyXG4gKiBBbnkgY2FsbGJhY2tzIHJlZ2lzdGVyZWQgd2l0aCBgcXVldWVNaWNyb1Rhc2tgIHdpbGwgYmUgZXhlY3V0ZWQgYmVmb3JlIHRoZSBuZXh0IG1hY3JvdGFzay4gSWYgbm8gbmF0aXZlXHJcbiAqIG1lY2hhbmlzbSBmb3Igc2NoZWR1bGluZyBtYWNyb3Rhc2tzIGlzIGV4cG9zZWQsIHRoZW4gYW55IGNhbGxiYWNrcyB3aWxsIGJlIGZpcmVkIGJlZm9yZSBhbnkgbWFjcm90YXNrXHJcbiAqIHJlZ2lzdGVyZWQgd2l0aCBgcXVldWVUYXNrYCBvciBgcXVldWVBbmltYXRpb25UYXNrYC5cclxuICpcclxuICogQHBhcmFtIGNhbGxiYWNrIHRoZSBmdW5jdGlvbiB0byBiZSBxdWV1ZWQgYW5kIGxhdGVyIGV4ZWN1dGVkLlxyXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCBhIGBkZXN0cm95YCBtZXRob2QgdGhhdCwgd2hlbiBjYWxsZWQsIHByZXZlbnRzIHRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZyb20gZXhlY3V0aW5nLlxyXG4gKi9cclxuZXhwb3J0cy5xdWV1ZU1pY3JvVGFzayA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZW5xdWV1ZTtcclxuICAgIGlmIChoYXNfMS5kZWZhdWx0KCdob3N0LW5vZGUnKSkge1xyXG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBnbG9iYWxfMS5kZWZhdWx0LnByb2Nlc3MubmV4dFRpY2soZXhlY3V0ZVRhc2suYmluZChudWxsLCBpdGVtKSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGhhc18xLmRlZmF1bHQoJ2VzNi1wcm9taXNlJykpIHtcclxuICAgICAgICBlbnF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgZ2xvYmFsXzEuZGVmYXVsdC5Qcm9taXNlLnJlc29sdmUoaXRlbSkudGhlbihleGVjdXRlVGFzayk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGhhc18xLmRlZmF1bHQoJ2RvbS1tdXRhdGlvbm9ic2VydmVyJykpIHtcclxuICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZSAqL1xyXG4gICAgICAgIHZhciBIb3N0TXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbF8xLmRlZmF1bHQuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWxfMS5kZWZhdWx0LldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XHJcbiAgICAgICAgdmFyIG5vZGVfMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHZhciBxdWV1ZV8yID0gW107XHJcbiAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IEhvc3RNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2hpbGUgKHF1ZXVlXzIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBxdWV1ZV8yLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSAmJiBpdGVtLmlzQWN0aXZlICYmIGl0ZW0uY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGVfMSwgeyBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xyXG4gICAgICAgIGVucXVldWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICBxdWV1ZV8yLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIG5vZGVfMS5zZXRBdHRyaWJ1dGUoJ3F1ZXVlU3RhdHVzJywgJzEnKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZW5xdWV1ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGNoZWNrTWljcm9UYXNrUXVldWUoKTtcclxuICAgICAgICAgICAgbWljcm9UYXNrcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB7XHJcbiAgICAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcclxuICAgICAgICB9O1xyXG4gICAgICAgIGVucXVldWUoaXRlbSk7XHJcbiAgICAgICAgcmV0dXJuIGdldFF1ZXVlSGFuZGxlKGl0ZW0pO1xyXG4gICAgfTtcclxufSkoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby9zaGltL3N1cHBvcnQvcXVldWUuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC9xdWV1ZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vKipcclxuICogSGVscGVyIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGEgdmFsdWUgcHJvcGVydHkgZGVzY3JpcHRvclxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsdWUgICAgICAgIFRoZSB2YWx1ZSB0aGUgcHJvcGVydHkgZGVzY3JpcHRvciBzaG91bGQgYmUgc2V0IHRvXHJcbiAqIEBwYXJhbSBlbnVtZXJhYmxlICAgSWYgdGhlIHByb3BlcnR5IHNob3VsZCBiZSBlbnVtYmVyYWJsZSwgZGVmYXVsdHMgdG8gZmFsc2VcclxuICogQHBhcmFtIHdyaXRhYmxlICAgICBJZiB0aGUgcHJvcGVydHkgc2hvdWxkIGJlIHdyaXRhYmxlLCBkZWZhdWx0cyB0byB0cnVlXHJcbiAqIEBwYXJhbSBjb25maWd1cmFibGUgSWYgdGhlIHByb3BlcnR5IHNob3VsZCBiZSBjb25maWd1cmFibGUsIGRlZmF1bHRzIHRvIHRydWVcclxuICogQHJldHVybiAgICAgICAgICAgICBUaGUgcHJvcGVydHkgZGVzY3JpcHRvciBvYmplY3RcclxuICovXHJcbmZ1bmN0aW9uIGdldFZhbHVlRGVzY3JpcHRvcih2YWx1ZSwgZW51bWVyYWJsZSwgd3JpdGFibGUsIGNvbmZpZ3VyYWJsZSkge1xyXG4gICAgaWYgKGVudW1lcmFibGUgPT09IHZvaWQgMCkgeyBlbnVtZXJhYmxlID0gZmFsc2U7IH1cclxuICAgIGlmICh3cml0YWJsZSA9PT0gdm9pZCAwKSB7IHdyaXRhYmxlID0gdHJ1ZTsgfVxyXG4gICAgaWYgKGNvbmZpZ3VyYWJsZSA9PT0gdm9pZCAwKSB7IGNvbmZpZ3VyYWJsZSA9IHRydWU7IH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICAgIGVudW1lcmFibGU6IGVudW1lcmFibGUsXHJcbiAgICAgICAgd3JpdGFibGU6IHdyaXRhYmxlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogY29uZmlndXJhYmxlXHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMuZ2V0VmFsdWVEZXNjcmlwdG9yID0gZ2V0VmFsdWVEZXNjcmlwdG9yO1xyXG5mdW5jdGlvbiB3cmFwTmF0aXZlKG5hdGl2ZUZ1bmN0aW9uKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgYXJnc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5hdGl2ZUZ1bmN0aW9uLmFwcGx5KHRhcmdldCwgYXJncyk7XHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMud3JhcE5hdGl2ZSA9IHdyYXBOYXRpdmU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vc2hpbS9zdXBwb3J0L3V0aWwuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3NoaW0vc3VwcG9ydC91dGlsLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgV2lkZ2V0QmFzZV8xID0gcmVxdWlyZShcIi4vV2lkZ2V0QmFzZVwiKTtcclxudmFyIGluamVjdF8xID0gcmVxdWlyZShcIi4vZGVjb3JhdG9ycy9pbmplY3RcIik7XHJcbnZhciBkXzEgPSByZXF1aXJlKFwiLi9kXCIpO1xyXG52YXIgYWx3YXlzUmVuZGVyXzEgPSByZXF1aXJlKFwiLi9kZWNvcmF0b3JzL2Fsd2F5c1JlbmRlclwiKTtcclxuZnVuY3Rpb24gQ29udGFpbmVyKGNvbXBvbmVudCwgbmFtZSwgX2EpIHtcclxuICAgIHZhciBnZXRQcm9wZXJ0aWVzID0gX2EuZ2V0UHJvcGVydGllcztcclxuICAgIHZhciBXaWRnZXRDb250YWluZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgdHNsaWJfMS5fX2V4dGVuZHMoV2lkZ2V0Q29udGFpbmVyLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIFdpZGdldENvbnRhaW5lcigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBXaWRnZXRDb250YWluZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRfMS53KGNvbXBvbmVudCwgdGhpcy5wcm9wZXJ0aWVzLCB0aGlzLmNoaWxkcmVuKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFdpZGdldENvbnRhaW5lciA9IHRzbGliXzEuX19kZWNvcmF0ZShbXHJcbiAgICAgICAgICAgIGFsd2F5c1JlbmRlcl8xLmFsd2F5c1JlbmRlcigpLFxyXG4gICAgICAgICAgICBpbmplY3RfMS5pbmplY3QoeyBuYW1lOiBuYW1lLCBnZXRQcm9wZXJ0aWVzOiBnZXRQcm9wZXJ0aWVzIH0pXHJcbiAgICAgICAgXSwgV2lkZ2V0Q29udGFpbmVyKTtcclxuICAgICAgICByZXR1cm4gV2lkZ2V0Q29udGFpbmVyO1xyXG4gICAgfShXaWRnZXRCYXNlXzEuV2lkZ2V0QmFzZSkpO1xyXG4gICAgcmV0dXJuIFdpZGdldENvbnRhaW5lcjtcclxufVxyXG5leHBvcnRzLkNvbnRhaW5lciA9IENvbnRhaW5lcjtcclxuZXhwb3J0cy5kZWZhdWx0ID0gQ29udGFpbmVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL0NvbnRhaW5lci5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvQ29udGFpbmVyLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgRXZlbnRlZF8xID0gcmVxdWlyZShcIkBkb2pvL2NvcmUvRXZlbnRlZFwiKTtcclxudmFyIEluamVjdG9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoSW5qZWN0b3IsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBJbmplY3RvcihwYXlsb2FkKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5fcGF5bG9hZCA9IHBheWxvYWQ7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgSW5qZWN0b3IucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGF5bG9hZDtcclxuICAgIH07XHJcbiAgICBJbmplY3Rvci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHBheWxvYWQpIHtcclxuICAgICAgICB0aGlzLl9wYXlsb2FkID0gcGF5bG9hZDtcclxuICAgICAgICB0aGlzLmVtaXQoeyB0eXBlOiAnaW52YWxpZGF0ZScgfSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEluamVjdG9yO1xyXG59KEV2ZW50ZWRfMS5FdmVudGVkKSk7XHJcbmV4cG9ydHMuSW5qZWN0b3IgPSBJbmplY3RvcjtcclxuZXhwb3J0cy5kZWZhdWx0ID0gSW5qZWN0b3I7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvSW5qZWN0b3IuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL0luamVjdG9yLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgRXZlbnRlZF8xID0gcmVxdWlyZShcIkBkb2pvL2NvcmUvRXZlbnRlZFwiKTtcclxudmFyIE1hcF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vTWFwXCIpO1xyXG4vKipcclxuICogRW51bSB0byBpZGVudGlmeSB0aGUgdHlwZSBvZiBldmVudC5cclxuICogTGlzdGVuaW5nIHRvICdQcm9qZWN0b3InIHdpbGwgbm90aWZ5IHdoZW4gcHJvamVjdG9yIGlzIGNyZWF0ZWQgb3IgdXBkYXRlZFxyXG4gKiBMaXN0ZW5pbmcgdG8gJ1dpZGdldCcgd2lsbCBub3RpZnkgd2hlbiB3aWRnZXQgcm9vdCBpcyBjcmVhdGVkIG9yIHVwZGF0ZWRcclxuICovXHJcbnZhciBOb2RlRXZlbnRUeXBlO1xyXG4oZnVuY3Rpb24gKE5vZGVFdmVudFR5cGUpIHtcclxuICAgIE5vZGVFdmVudFR5cGVbXCJQcm9qZWN0b3JcIl0gPSBcIlByb2plY3RvclwiO1xyXG4gICAgTm9kZUV2ZW50VHlwZVtcIldpZGdldFwiXSA9IFwiV2lkZ2V0XCI7XHJcbn0pKE5vZGVFdmVudFR5cGUgPSBleHBvcnRzLk5vZGVFdmVudFR5cGUgfHwgKGV4cG9ydHMuTm9kZUV2ZW50VHlwZSA9IHt9KSk7XHJcbnZhciBOb2RlSGFuZGxlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKE5vZGVIYW5kbGVyLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gTm9kZUhhbmRsZXIoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuX25vZGVNYXAgPSBuZXcgTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIE5vZGVIYW5kbGVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vZGVNYXAuZ2V0KGtleSk7XHJcbiAgICB9O1xyXG4gICAgTm9kZUhhbmRsZXIucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZU1hcC5oYXMoa2V5KTtcclxuICAgIH07XHJcbiAgICBOb2RlSGFuZGxlci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGVsZW1lbnQsIGtleSkge1xyXG4gICAgICAgIHRoaXMuX25vZGVNYXAuc2V0KGtleSwgZWxlbWVudCk7XHJcbiAgICAgICAgdGhpcy5lbWl0KHsgdHlwZToga2V5IH0pO1xyXG4gICAgfTtcclxuICAgIE5vZGVIYW5kbGVyLnByb3RvdHlwZS5hZGRSb290ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZW1pdCh7IHR5cGU6IE5vZGVFdmVudFR5cGUuV2lkZ2V0IH0pO1xyXG4gICAgfTtcclxuICAgIE5vZGVIYW5kbGVyLnByb3RvdHlwZS5hZGRQcm9qZWN0b3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5lbWl0KHsgdHlwZTogTm9kZUV2ZW50VHlwZS5Qcm9qZWN0b3IgfSk7XHJcbiAgICB9O1xyXG4gICAgTm9kZUhhbmRsZXIucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuX25vZGVNYXAuY2xlYXIoKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTm9kZUhhbmRsZXI7XHJcbn0oRXZlbnRlZF8xLkV2ZW50ZWQpKTtcclxuZXhwb3J0cy5Ob2RlSGFuZGxlciA9IE5vZGVIYW5kbGVyO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBOb2RlSGFuZGxlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9Ob2RlSGFuZGxlci5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvTm9kZUhhbmRsZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBQcm9taXNlXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9Qcm9taXNlXCIpO1xyXG52YXIgTWFwXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9NYXBcIik7XHJcbnZhciBTeW1ib2xfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL1N5bWJvbFwiKTtcclxudmFyIEV2ZW50ZWRfMSA9IHJlcXVpcmUoXCJAZG9qby9jb3JlL0V2ZW50ZWRcIik7XHJcbi8qKlxyXG4gKiBXaWRnZXQgYmFzZSBzeW1ib2wgdHlwZVxyXG4gKi9cclxuZXhwb3J0cy5XSURHRVRfQkFTRV9UWVBFID0gU3ltYm9sXzEuZGVmYXVsdCgnV2lkZ2V0IEJhc2UnKTtcclxuLyoqXHJcbiAqIENoZWNrcyBpcyB0aGUgaXRlbSBpcyBhIHN1YmNsYXNzIG9mIFdpZGdldEJhc2UgKG9yIGEgV2lkZ2V0QmFzZSlcclxuICpcclxuICogQHBhcmFtIGl0ZW0gdGhlIGl0ZW0gdG8gY2hlY2tcclxuICogQHJldHVybnMgdHJ1ZS9mYWxzZSBpbmRpY2F0aW5nIGlmIHRoZSBpdGVtIGlzIGEgV2lkZ2V0QmFzZUNvbnN0cnVjdG9yXHJcbiAqL1xyXG5mdW5jdGlvbiBpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcihpdGVtKSB7XHJcbiAgICByZXR1cm4gQm9vbGVhbihpdGVtICYmIGl0ZW0uX3R5cGUgPT09IGV4cG9ydHMuV0lER0VUX0JBU0VfVFlQRSk7XHJcbn1cclxuZXhwb3J0cy5pc1dpZGdldEJhc2VDb25zdHJ1Y3RvciA9IGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yO1xyXG5mdW5jdGlvbiBpc1dpZGdldENvbnN0cnVjdG9yRGVmYXVsdEV4cG9ydChpdGVtKSB7XHJcbiAgICByZXR1cm4gQm9vbGVhbihpdGVtICYmXHJcbiAgICAgICAgaXRlbS5oYXNPd25Qcm9wZXJ0eSgnX19lc01vZHVsZScpICYmXHJcbiAgICAgICAgaXRlbS5oYXNPd25Qcm9wZXJ0eSgnZGVmYXVsdCcpICYmXHJcbiAgICAgICAgaXNXaWRnZXRCYXNlQ29uc3RydWN0b3IoaXRlbS5kZWZhdWx0KSk7XHJcbn1cclxuZXhwb3J0cy5pc1dpZGdldENvbnN0cnVjdG9yRGVmYXVsdEV4cG9ydCA9IGlzV2lkZ2V0Q29uc3RydWN0b3JEZWZhdWx0RXhwb3J0O1xyXG4vKipcclxuICogVGhlIFJlZ2lzdHJ5IGltcGxlbWVudGF0aW9uXHJcbiAqL1xyXG52YXIgUmVnaXN0cnkgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhSZWdpc3RyeSwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFJlZ2lzdHJ5KCkge1xyXG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogRW1pdCBsb2FkZWQgZXZlbnQgZm9yIHJlZ2lzdHJ5IGxhYmVsXHJcbiAgICAgKi9cclxuICAgIFJlZ2lzdHJ5LnByb3RvdHlwZS5lbWl0TG9hZGVkRXZlbnQgPSBmdW5jdGlvbiAod2lkZ2V0TGFiZWwsIGl0ZW0pIHtcclxuICAgICAgICB0aGlzLmVtaXQoe1xyXG4gICAgICAgICAgICB0eXBlOiB3aWRnZXRMYWJlbCxcclxuICAgICAgICAgICAgYWN0aW9uOiAnbG9hZGVkJyxcclxuICAgICAgICAgICAgaXRlbTogaXRlbVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFJlZ2lzdHJ5LnByb3RvdHlwZS5kZWZpbmUgPSBmdW5jdGlvbiAobGFiZWwsIGl0ZW0pIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0aGlzLl93aWRnZXRSZWdpc3RyeSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3dpZGdldFJlZ2lzdHJ5ID0gbmV3IE1hcF8xLmRlZmF1bHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX3dpZGdldFJlZ2lzdHJ5LmhhcyhsYWJlbCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwid2lkZ2V0IGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZCBmb3IgJ1wiICsgbGFiZWwudG9TdHJpbmcoKSArIFwiJ1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fd2lkZ2V0UmVnaXN0cnkuc2V0KGxhYmVsLCBpdGVtKTtcclxuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIFByb21pc2VfMS5kZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIGl0ZW0udGhlbihmdW5jdGlvbiAod2lkZ2V0Q3Rvcikge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgd2lkZ2V0Q3Rvcik7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIHdpZGdldEN0b3IpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpZGdldEN0b3I7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChpc1dpZGdldEJhc2VDb25zdHJ1Y3RvcihpdGVtKSkge1xyXG4gICAgICAgICAgICB0aGlzLmVtaXRMb2FkZWRFdmVudChsYWJlbCwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFJlZ2lzdHJ5LnByb3RvdHlwZS5kZWZpbmVJbmplY3RvciA9IGZ1bmN0aW9uIChsYWJlbCwgaXRlbSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbmplY3RvclJlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5qZWN0b3JSZWdpc3RyeSA9IG5ldyBNYXBfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LmhhcyhsYWJlbCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW5qZWN0b3IgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIGZvciAnXCIgKyBsYWJlbC50b1N0cmluZygpICsgXCInXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9pbmplY3RvclJlZ2lzdHJ5LnNldChsYWJlbCwgaXRlbSk7XHJcbiAgICAgICAgdGhpcy5lbWl0TG9hZGVkRXZlbnQobGFiZWwsIGl0ZW0pO1xyXG4gICAgfTtcclxuICAgIFJlZ2lzdHJ5LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAobGFiZWwpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICghdGhpcy5oYXMobGFiZWwpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX3dpZGdldFJlZ2lzdHJ5LmdldChsYWJlbCk7XHJcbiAgICAgICAgaWYgKGlzV2lkZ2V0QmFzZUNvbnN0cnVjdG9yKGl0ZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIFByb21pc2VfMS5kZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcHJvbWlzZSA9IGl0ZW0oKTtcclxuICAgICAgICB0aGlzLl93aWRnZXRSZWdpc3RyeS5zZXQobGFiZWwsIHByb21pc2UpO1xyXG4gICAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAod2lkZ2V0Q3Rvcikge1xyXG4gICAgICAgICAgICBpZiAoaXNXaWRnZXRDb25zdHJ1Y3RvckRlZmF1bHRFeHBvcnQod2lkZ2V0Q3RvcikpIHtcclxuICAgICAgICAgICAgICAgIHdpZGdldEN0b3IgPSB3aWRnZXRDdG9yLmRlZmF1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX3RoaXMuX3dpZGdldFJlZ2lzdHJ5LnNldChsYWJlbCwgd2lkZ2V0Q3Rvcik7XHJcbiAgICAgICAgICAgIF90aGlzLmVtaXRMb2FkZWRFdmVudChsYWJlbCwgd2lkZ2V0Q3Rvcik7XHJcbiAgICAgICAgICAgIHJldHVybiB3aWRnZXRDdG9yO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuZ2V0SW5qZWN0b3IgPSBmdW5jdGlvbiAobGFiZWwpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzSW5qZWN0b3IobGFiZWwpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5faW5qZWN0b3JSZWdpc3RyeS5nZXQobGFiZWwpO1xyXG4gICAgfTtcclxuICAgIFJlZ2lzdHJ5LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAobGFiZWwpIHtcclxuICAgICAgICByZXR1cm4gQm9vbGVhbih0aGlzLl93aWRnZXRSZWdpc3RyeSAmJiB0aGlzLl93aWRnZXRSZWdpc3RyeS5oYXMobGFiZWwpKTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeS5wcm90b3R5cGUuaGFzSW5qZWN0b3IgPSBmdW5jdGlvbiAobGFiZWwpIHtcclxuICAgICAgICByZXR1cm4gQm9vbGVhbih0aGlzLl9pbmplY3RvclJlZ2lzdHJ5ICYmIHRoaXMuX2luamVjdG9yUmVnaXN0cnkuaGFzKGxhYmVsKSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFJlZ2lzdHJ5O1xyXG59KEV2ZW50ZWRfMS5FdmVudGVkKSk7XHJcbmV4cG9ydHMuUmVnaXN0cnkgPSBSZWdpc3RyeTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gUmVnaXN0cnk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvUmVnaXN0cnkuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL1JlZ2lzdHJ5LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgTWFwXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9NYXBcIik7XHJcbnZhciBFdmVudGVkXzEgPSByZXF1aXJlKFwiQGRvam8vY29yZS9FdmVudGVkXCIpO1xyXG52YXIgUmVnaXN0cnlfMSA9IHJlcXVpcmUoXCIuL1JlZ2lzdHJ5XCIpO1xyXG52YXIgUmVnaXN0cnlIYW5kbGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoUmVnaXN0cnlIYW5kbGVyLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gUmVnaXN0cnlIYW5kbGVyKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuX3JlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5XzEuUmVnaXN0cnkoKTtcclxuICAgICAgICBfdGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcCA9IG5ldyBNYXBfMS5NYXAoKTtcclxuICAgICAgICBfdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwID0gbmV3IE1hcF8xLk1hcCgpO1xyXG4gICAgICAgIF90aGlzLm93bihfdGhpcy5fcmVnaXN0cnkpO1xyXG4gICAgICAgIHZhciBkZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoX3RoaXMuYmFzZVJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcC5kZWxldGUoX3RoaXMuYmFzZVJlZ2lzdHJ5KTtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9yZWdpc3RyeUluamVjdG9yTGFiZWxNYXAuZGVsZXRlKF90aGlzLmJhc2VSZWdpc3RyeSk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5iYXNlUmVnaXN0cnkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIF90aGlzLm93bih7IGRlc3Ryb3k6IGRlc3Ryb3kgfSk7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlZ2lzdHJ5SGFuZGxlci5wcm90b3R5cGUsIFwiYmFzZVwiLCB7XHJcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoYmFzZVJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJhc2VSZWdpc3RyeSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcC5kZWxldGUodGhpcy5iYXNlUmVnaXN0cnkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwLmRlbGV0ZSh0aGlzLmJhc2VSZWdpc3RyeSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5iYXNlUmVnaXN0cnkgPSBiYXNlUmVnaXN0cnk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgICBSZWdpc3RyeUhhbmRsZXIucHJvdG90eXBlLmRlZmluZSA9IGZ1bmN0aW9uIChsYWJlbCwgd2lkZ2V0KSB7XHJcbiAgICAgICAgdGhpcy5fcmVnaXN0cnkuZGVmaW5lKGxhYmVsLCB3aWRnZXQpO1xyXG4gICAgfTtcclxuICAgIFJlZ2lzdHJ5SGFuZGxlci5wcm90b3R5cGUuZGVmaW5lSW5qZWN0b3IgPSBmdW5jdGlvbiAobGFiZWwsIGluamVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5fcmVnaXN0cnkuZGVmaW5lSW5qZWN0b3IobGFiZWwsIGluamVjdG9yKTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeUhhbmRsZXIucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChsYWJlbCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5oYXMobGFiZWwpIHx8IEJvb2xlYW4odGhpcy5iYXNlUmVnaXN0cnkgJiYgdGhpcy5iYXNlUmVnaXN0cnkuaGFzKGxhYmVsKSk7XHJcbiAgICB9O1xyXG4gICAgUmVnaXN0cnlIYW5kbGVyLnByb3RvdHlwZS5oYXNJbmplY3RvciA9IGZ1bmN0aW9uIChsYWJlbCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5oYXNJbmplY3RvcihsYWJlbCkgfHwgQm9vbGVhbih0aGlzLmJhc2VSZWdpc3RyeSAmJiB0aGlzLmJhc2VSZWdpc3RyeS5oYXNJbmplY3RvcihsYWJlbCkpO1xyXG4gICAgfTtcclxuICAgIFJlZ2lzdHJ5SGFuZGxlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlKSB7XHJcbiAgICAgICAgaWYgKGdsb2JhbFByZWNlZGVuY2UgPT09IHZvaWQgMCkgeyBnbG9iYWxQcmVjZWRlbmNlID0gZmFsc2U7IH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0KGxhYmVsLCBnbG9iYWxQcmVjZWRlbmNlLCAnZ2V0JywgdGhpcy5fcmVnaXN0cnlXaWRnZXRMYWJlbE1hcCk7XHJcbiAgICB9O1xyXG4gICAgUmVnaXN0cnlIYW5kbGVyLnByb3RvdHlwZS5nZXRJbmplY3RvciA9IGZ1bmN0aW9uIChsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSkge1xyXG4gICAgICAgIGlmIChnbG9iYWxQcmVjZWRlbmNlID09PSB2b2lkIDApIHsgZ2xvYmFsUHJlY2VkZW5jZSA9IGZhbHNlOyB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldChsYWJlbCwgZ2xvYmFsUHJlY2VkZW5jZSwgJ2dldEluamVjdG9yJywgdGhpcy5fcmVnaXN0cnlJbmplY3RvckxhYmVsTWFwKTtcclxuICAgIH07XHJcbiAgICBSZWdpc3RyeUhhbmRsZXIucHJvdG90eXBlLl9nZXQgPSBmdW5jdGlvbiAobGFiZWwsIGdsb2JhbFByZWNlZGVuY2UsIGdldEZ1bmN0aW9uTmFtZSwgbGFiZWxNYXApIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciByZWdpc3RyaWVzID0gZ2xvYmFsUHJlY2VkZW5jZSA/IFt0aGlzLmJhc2VSZWdpc3RyeSwgdGhpcy5fcmVnaXN0cnldIDogW3RoaXMuX3JlZ2lzdHJ5LCB0aGlzLmJhc2VSZWdpc3RyeV07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWdpc3RyaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciByZWdpc3RyeSA9IHJlZ2lzdHJpZXNbaV07XHJcbiAgICAgICAgICAgIGlmICghcmVnaXN0cnkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gcmVnaXN0cnlbZ2V0RnVuY3Rpb25OYW1lXShsYWJlbCk7XHJcbiAgICAgICAgICAgIHZhciByZWdpc3RlcmVkTGFiZWxzID0gbGFiZWxNYXAuZ2V0KHJlZ2lzdHJ5KSB8fCBbXTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJlZ2lzdGVyZWRMYWJlbHMuaW5kZXhPZihsYWJlbCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlID0gcmVnaXN0cnkub24obGFiZWwsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5hY3Rpb24gPT09ICdsb2FkZWQnICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzW2dldEZ1bmN0aW9uTmFtZV0obGFiZWwsIGdsb2JhbFByZWNlZGVuY2UpID09PSBldmVudC5pdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmVtaXQoeyB0eXBlOiAnaW52YWxpZGF0ZScgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm93bihoYW5kbGUpO1xyXG4gICAgICAgICAgICAgICAgbGFiZWxNYXAuc2V0KHJlZ2lzdHJ5LCB0c2xpYl8xLl9fc3ByZWFkKHJlZ2lzdGVyZWRMYWJlbHMsIFtsYWJlbF0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUmVnaXN0cnlIYW5kbGVyO1xyXG59KEV2ZW50ZWRfMS5FdmVudGVkKSk7XHJcbmV4cG9ydHMuUmVnaXN0cnlIYW5kbGVyID0gUmVnaXN0cnlIYW5kbGVyO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBSZWdpc3RyeUhhbmRsZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvUmVnaXN0cnlIYW5kbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeUhhbmRsZXIuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBNYXBfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL01hcFwiKTtcclxudmFyIFdlYWtNYXBfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL1dlYWtNYXBcIik7XHJcbnZhciBkXzEgPSByZXF1aXJlKFwiLi9kXCIpO1xyXG52YXIgZGlmZl8xID0gcmVxdWlyZShcIi4vZGlmZlwiKTtcclxudmFyIFJlZ2lzdHJ5SGFuZGxlcl8xID0gcmVxdWlyZShcIi4vUmVnaXN0cnlIYW5kbGVyXCIpO1xyXG52YXIgTm9kZUhhbmRsZXJfMSA9IHJlcXVpcmUoXCIuL05vZGVIYW5kbGVyXCIpO1xyXG52YXIgdmRvbV8xID0gcmVxdWlyZShcIi4vdmRvbVwiKTtcclxudmFyIFJlZ2lzdHJ5XzEgPSByZXF1aXJlKFwiLi9SZWdpc3RyeVwiKTtcclxudmFyIGRlY29yYXRvck1hcCA9IG5ldyBNYXBfMS5kZWZhdWx0KCk7XHJcbnZhciBib3VuZEF1dG8gPSBkaWZmXzEuYXV0by5iaW5kKG51bGwpO1xyXG4vKipcclxuICogTWFpbiB3aWRnZXQgYmFzZSBmb3IgYWxsIHdpZGdldHMgdG8gZXh0ZW5kXHJcbiAqL1xyXG52YXIgV2lkZ2V0QmFzZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFdpZGdldEJhc2UoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJbmRpY2F0ZXMgaWYgaXQgaXMgdGhlIGluaXRpYWwgc2V0IHByb3BlcnRpZXMgY3ljbGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLl9pbml0aWFsUHJvcGVydGllcyA9IHRydWU7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQXJyYXkgb2YgcHJvcGVydHkga2V5cyBjb25zaWRlcmVkIGNoYW5nZWQgZnJvbSB0aGUgcHJldmlvdXMgc2V0IHByb3BlcnRpZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzID0gW107XHJcbiAgICAgICAgdGhpcy5fbm9kZUhhbmRsZXIgPSBuZXcgTm9kZUhhbmRsZXJfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5faGFuZGxlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkcmVuID0gW107XHJcbiAgICAgICAgdGhpcy5fZGVjb3JhdG9yQ2FjaGUgPSBuZXcgTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSB7fTtcclxuICAgICAgICB0aGlzLl9ib3VuZFJlbmRlckZ1bmMgPSB0aGlzLnJlbmRlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX2JvdW5kSW52YWxpZGF0ZSA9IHRoaXMuaW52YWxpZGF0ZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHZkb21fMS53aWRnZXRJbnN0YW5jZU1hcC5zZXQodGhpcywge1xyXG4gICAgICAgICAgICBkaXJ0eTogdHJ1ZSxcclxuICAgICAgICAgICAgb25BdHRhY2g6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLm9uQXR0YWNoKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRGV0YWNoOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5vbkRldGFjaCgpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBub2RlSGFuZGxlcjogdGhpcy5fbm9kZUhhbmRsZXIsXHJcbiAgICAgICAgICAgIHJlZ2lzdHJ5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMucmVnaXN0cnk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvcmVQcm9wZXJ0aWVzOiB7fSxcclxuICAgICAgICAgICAgcmVuZGVyaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgaW5wdXRQcm9wZXJ0aWVzOiB7fVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3J1bkFmdGVyQ29uc3RydWN0b3JzKCk7XHJcbiAgICB9XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5tZXRhID0gZnVuY3Rpb24gKE1ldGFUeXBlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX21ldGFNYXAgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tZXRhTWFwID0gbmV3IE1hcF8xLmRlZmF1bHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNhY2hlZCA9IHRoaXMuX21ldGFNYXAuZ2V0KE1ldGFUeXBlKTtcclxuICAgICAgICBpZiAoIWNhY2hlZCkge1xyXG4gICAgICAgICAgICBjYWNoZWQgPSBuZXcgTWV0YVR5cGUoe1xyXG4gICAgICAgICAgICAgICAgaW52YWxpZGF0ZTogdGhpcy5fYm91bmRJbnZhbGlkYXRlLFxyXG4gICAgICAgICAgICAgICAgbm9kZUhhbmRsZXI6IHRoaXMuX25vZGVIYW5kbGVyLFxyXG4gICAgICAgICAgICAgICAgYmluZDogdGhpc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5vd24oY2FjaGVkKTtcclxuICAgICAgICAgICAgdGhpcy5fbWV0YU1hcC5zZXQoTWV0YVR5cGUsIGNhY2hlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjYWNoZWQ7XHJcbiAgICB9O1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUub25BdHRhY2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gRG8gbm90aGluZyBieSBkZWZhdWx0LlxyXG4gICAgfTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLm9uRGV0YWNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIERvIG5vdGhpbmcgYnkgZGVmYXVsdC5cclxuICAgIH07XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV2lkZ2V0QmFzZS5wcm90b3R5cGUsIFwicHJvcGVydGllc1wiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdpZGdldEJhc2UucHJvdG90eXBlLCBcImNoYW5nZWRQcm9wZXJ0eUtleXNcIiwge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHNsaWJfMS5fX3NwcmVhZCh0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9fc2V0Q29yZVByb3BlcnRpZXNfXyA9IGZ1bmN0aW9uIChjb3JlUHJvcGVydGllcykge1xyXG4gICAgICAgIHZhciBiYXNlUmVnaXN0cnkgPSBjb3JlUHJvcGVydGllcy5iYXNlUmVnaXN0cnk7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IHZkb21fMS53aWRnZXRJbnN0YW5jZU1hcC5nZXQodGhpcyk7XHJcbiAgICAgICAgaWYgKGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iYXNlUmVnaXN0cnkgIT09IGJhc2VSZWdpc3RyeSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnlIYW5kbGVyXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vd24odGhpcy5fcmVnaXN0cnkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vd24odGhpcy5fcmVnaXN0cnkub24oJ2ludmFsaWRhdGUnLCB0aGlzLl9ib3VuZEludmFsaWRhdGUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RyeS5iYXNlID0gYmFzZVJlZ2lzdHJ5O1xyXG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzID0gY29yZVByb3BlcnRpZXM7XHJcbiAgICB9O1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuX19zZXRQcm9wZXJ0aWVzX18gPSBmdW5jdGlvbiAob3JpZ2luYWxQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gdmRvbV8xLndpZGdldEluc3RhbmNlTWFwLmdldCh0aGlzKTtcclxuICAgICAgICBpbnN0YW5jZURhdGEuaW5wdXRQcm9wZXJ0aWVzID0gb3JpZ2luYWxQcm9wZXJ0aWVzO1xyXG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5fcnVuQmVmb3JlUHJvcGVydGllcyhvcmlnaW5hbFByb3BlcnRpZXMpO1xyXG4gICAgICAgIHZhciByZWdpc3RlcmVkRGlmZlByb3BlcnR5TmFtZXMgPSB0aGlzLmdldERlY29yYXRvcigncmVnaXN0ZXJlZERpZmZQcm9wZXJ0eScpO1xyXG4gICAgICAgIHZhciBjaGFuZ2VkUHJvcGVydHlLZXlzID0gW107XHJcbiAgICAgICAgdmFyIHByb3BlcnR5TmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcclxuICAgICAgICBpZiAodGhpcy5faW5pdGlhbFByb3BlcnRpZXMgPT09IGZhbHNlIHx8IHJlZ2lzdGVyZWREaWZmUHJvcGVydHlOYW1lcy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgdmFyIGFsbFByb3BlcnRpZXMgPSB0c2xpYl8xLl9fc3ByZWFkKHByb3BlcnR5TmFtZXMsIE9iamVjdC5rZXlzKHRoaXMuX3Byb3BlcnRpZXMpKTtcclxuICAgICAgICAgICAgdmFyIGNoZWNrZWRQcm9wZXJ0aWVzID0gW107XHJcbiAgICAgICAgICAgIHZhciBkaWZmUHJvcGVydHlSZXN1bHRzID0ge307XHJcbiAgICAgICAgICAgIHZhciBydW5SZWFjdGlvbnMgPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gYWxsUHJvcGVydGllc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChjaGVja2VkUHJvcGVydGllcy5pbmRleE9mKHByb3BlcnR5TmFtZSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjaGVja2VkUHJvcGVydGllcy5wdXNoKHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldmlvdXNQcm9wZXJ0eSA9IHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdQcm9wZXJ0eSA9IHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5KHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSwgaW5zdGFuY2VEYXRhLmNvcmVQcm9wZXJ0aWVzLmJpbmQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlZ2lzdGVyZWREaWZmUHJvcGVydHlOYW1lcy5pbmRleE9mKHByb3BlcnR5TmFtZSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcnVuUmVhY3Rpb25zID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGlmZkZ1bmN0aW9ucyA9IHRoaXMuZ2V0RGVjb3JhdG9yKFwiZGlmZlByb3BlcnR5OlwiICsgcHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpXzEgPSAwOyBpXzEgPCBkaWZmRnVuY3Rpb25zLmxlbmd0aDsgaV8xKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGRpZmZGdW5jdGlvbnNbaV8xXShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuY2hhbmdlZCAmJiBjaGFuZ2VkUHJvcGVydHlLZXlzLmluZGV4T2YocHJvcGVydHlOYW1lKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWRQcm9wZXJ0eUtleXMucHVzaChwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgaW4gcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlmZlByb3BlcnR5UmVzdWx0c1twcm9wZXJ0eU5hbWVdID0gcmVzdWx0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGJvdW5kQXV0byhwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5jaGFuZ2VkICYmIGNoYW5nZWRQcm9wZXJ0eUtleXMuaW5kZXhPZihwcm9wZXJ0eU5hbWUpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkUHJvcGVydHlLZXlzLnB1c2gocHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5TmFtZSBpbiBwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZmZQcm9wZXJ0eVJlc3VsdHNbcHJvcGVydHlOYW1lXSA9IHJlc3VsdC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJ1blJlYWN0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwRGlmZlByb3BlcnR5UmVhY3Rpb25zKHByb3BlcnRpZXMsIGNoYW5nZWRQcm9wZXJ0eUtleXMpLmZvckVhY2goZnVuY3Rpb24gKGFyZ3MsIHJlYWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3MuY2hhbmdlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFjdGlvbi5jYWxsKF90aGlzLCBhcmdzLnByZXZpb3VzUHJvcGVydGllcywgYXJncy5uZXdQcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0gZGlmZlByb3BlcnR5UmVzdWx0cztcclxuICAgICAgICAgICAgdGhpcy5fY2hhbmdlZFByb3BlcnR5S2V5cyA9IGNoYW5nZWRQcm9wZXJ0eUtleXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsUHJvcGVydGllcyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnR5TmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eShwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0sIGluc3RhbmNlRGF0YS5jb3JlUHJvcGVydGllcy5iaW5kKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWRQcm9wZXJ0eUtleXMucHVzaChwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZWRQcm9wZXJ0eUtleXMgPSBjaGFuZ2VkUHJvcGVydHlLZXlzO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzID0gdHNsaWJfMS5fX2Fzc2lnbih7fSwgcHJvcGVydGllcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9jaGFuZ2VkUHJvcGVydHlLZXlzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXaWRnZXRCYXNlLnByb3RvdHlwZSwgXCJjaGlsZHJlblwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9fc2V0Q2hpbGRyZW5fXyA9IGZ1bmN0aW9uIChjaGlsZHJlbikge1xyXG4gICAgICAgIGlmICh0aGlzLl9jaGlsZHJlbi5sZW5ndGggPiAwIHx8IGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBjaGlsZHJlbjtcclxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9fcmVuZGVyX18gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IHZkb21fMS53aWRnZXRJbnN0YW5jZU1hcC5nZXQodGhpcyk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhLmRpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgdmFyIHJlbmRlciA9IHRoaXMuX3J1bkJlZm9yZVJlbmRlcnMoKTtcclxuICAgICAgICB2YXIgZE5vZGUgPSByZW5kZXIoKTtcclxuICAgICAgICBkTm9kZSA9IHRoaXMucnVuQWZ0ZXJSZW5kZXJzKGROb2RlKTtcclxuICAgICAgICB0aGlzLl9ub2RlSGFuZGxlci5jbGVhcigpO1xyXG4gICAgICAgIHJldHVybiBkTm9kZTtcclxuICAgIH07XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5pbnZhbGlkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZURhdGEgPSB2ZG9tXzEud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHRoaXMpO1xyXG4gICAgICAgIGlmIChpbnN0YW5jZURhdGEuaW52YWxpZGF0ZSkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZURhdGEuaW52YWxpZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGRfMS52KCdkaXYnLCB7fSwgdGhpcy5jaGlsZHJlbik7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0byBhZGQgZGVjb3JhdG9ycyB0byBXaWRnZXRCYXNlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRlY29yYXRvcktleSBUaGUga2V5IG9mIHRoZSBkZWNvcmF0b3JcclxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIGRlY29yYXRvclxyXG4gICAgICovXHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5hZGREZWNvcmF0b3IgPSBmdW5jdGlvbiAoZGVjb3JhdG9yS2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIHZhbHVlID0gQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IFt2YWx1ZV07XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoJ2NvbnN0cnVjdG9yJykpIHtcclxuICAgICAgICAgICAgdmFyIGRlY29yYXRvckxpc3QgPSBkZWNvcmF0b3JNYXAuZ2V0KHRoaXMuY29uc3RydWN0b3IpO1xyXG4gICAgICAgICAgICBpZiAoIWRlY29yYXRvckxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGRlY29yYXRvckxpc3QgPSBuZXcgTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgZGVjb3JhdG9yTWFwLnNldCh0aGlzLmNvbnN0cnVjdG9yLCBkZWNvcmF0b3JMaXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgc3BlY2lmaWNEZWNvcmF0b3JMaXN0ID0gZGVjb3JhdG9yTGlzdC5nZXQoZGVjb3JhdG9yS2V5KTtcclxuICAgICAgICAgICAgaWYgKCFzcGVjaWZpY0RlY29yYXRvckxpc3QpIHtcclxuICAgICAgICAgICAgICAgIHNwZWNpZmljRGVjb3JhdG9yTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZGVjb3JhdG9yTGlzdC5zZXQoZGVjb3JhdG9yS2V5LCBzcGVjaWZpY0RlY29yYXRvckxpc3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNwZWNpZmljRGVjb3JhdG9yTGlzdC5wdXNoLmFwcGx5KHNwZWNpZmljRGVjb3JhdG9yTGlzdCwgdHNsaWJfMS5fX3NwcmVhZCh2YWx1ZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGRlY29yYXRvcnMgPSB0aGlzLmdldERlY29yYXRvcihkZWNvcmF0b3JLZXkpO1xyXG4gICAgICAgICAgICB0aGlzLl9kZWNvcmF0b3JDYWNoZS5zZXQoZGVjb3JhdG9yS2V5LCB0c2xpYl8xLl9fc3ByZWFkKGRlY29yYXRvcnMsIHZhbHVlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdG8gYnVpbGQgdGhlIGxpc3Qgb2YgZGVjb3JhdG9ycyBmcm9tIHRoZSBnbG9iYWwgZGVjb3JhdG9yIG1hcC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGVjb3JhdG9yS2V5ICBUaGUga2V5IG9mIHRoZSBkZWNvcmF0b3JcclxuICAgICAqIEByZXR1cm4gQW4gYXJyYXkgb2YgZGVjb3JhdG9yIHZhbHVlc1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuX2J1aWxkRGVjb3JhdG9yTGlzdCA9IGZ1bmN0aW9uIChkZWNvcmF0b3JLZXkpIHtcclxuICAgICAgICB2YXIgYWxsRGVjb3JhdG9ycyA9IFtdO1xyXG4gICAgICAgIHZhciBjb25zdHJ1Y3RvciA9IHRoaXMuY29uc3RydWN0b3I7XHJcbiAgICAgICAgd2hpbGUgKGNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZU1hcCA9IGRlY29yYXRvck1hcC5nZXQoY29uc3RydWN0b3IpO1xyXG4gICAgICAgICAgICBpZiAoaW5zdGFuY2VNYXApIHtcclxuICAgICAgICAgICAgICAgIHZhciBkZWNvcmF0b3JzID0gaW5zdGFuY2VNYXAuZ2V0KGRlY29yYXRvcktleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGVjb3JhdG9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsbERlY29yYXRvcnMudW5zaGlmdC5hcHBseShhbGxEZWNvcmF0b3JzLCB0c2xpYl8xLl9fc3ByZWFkKGRlY29yYXRvcnMpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvciA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb25zdHJ1Y3Rvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhbGxEZWNvcmF0b3JzO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdG8gcmV0cmlldmUgZGVjb3JhdG9yIHZhbHVlc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkZWNvcmF0b3JLZXkgVGhlIGtleSBvZiB0aGUgZGVjb3JhdG9yXHJcbiAgICAgKiBAcmV0dXJucyBBbiBhcnJheSBvZiBkZWNvcmF0b3IgdmFsdWVzXHJcbiAgICAgKi9cclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLmdldERlY29yYXRvciA9IGZ1bmN0aW9uIChkZWNvcmF0b3JLZXkpIHtcclxuICAgICAgICB2YXIgYWxsRGVjb3JhdG9ycyA9IHRoaXMuX2RlY29yYXRvckNhY2hlLmdldChkZWNvcmF0b3JLZXkpO1xyXG4gICAgICAgIGlmIChhbGxEZWNvcmF0b3JzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFsbERlY29yYXRvcnM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFsbERlY29yYXRvcnMgPSB0aGlzLl9idWlsZERlY29yYXRvckxpc3QoZGVjb3JhdG9yS2V5KTtcclxuICAgICAgICB0aGlzLl9kZWNvcmF0b3JDYWNoZS5zZXQoZGVjb3JhdG9yS2V5LCBhbGxEZWNvcmF0b3JzKTtcclxuICAgICAgICByZXR1cm4gYWxsRGVjb3JhdG9ycztcclxuICAgIH07XHJcbiAgICBXaWRnZXRCYXNlLnByb3RvdHlwZS5fbWFwRGlmZlByb3BlcnR5UmVhY3Rpb25zID0gZnVuY3Rpb24gKG5ld1Byb3BlcnRpZXMsIGNoYW5nZWRQcm9wZXJ0eUtleXMpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciByZWFjdGlvbkZ1bmN0aW9ucyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdkaWZmUmVhY3Rpb24nKTtcclxuICAgICAgICByZXR1cm4gcmVhY3Rpb25GdW5jdGlvbnMucmVkdWNlKGZ1bmN0aW9uIChyZWFjdGlvblByb3BlcnR5TWFwLCBfYSkge1xyXG4gICAgICAgICAgICB2YXIgcmVhY3Rpb24gPSBfYS5yZWFjdGlvbiwgcHJvcGVydHlOYW1lID0gX2EucHJvcGVydHlOYW1lO1xyXG4gICAgICAgICAgICB2YXIgcmVhY3Rpb25Bcmd1bWVudHMgPSByZWFjdGlvblByb3BlcnR5TWFwLmdldChyZWFjdGlvbik7XHJcbiAgICAgICAgICAgIGlmIChyZWFjdGlvbkFyZ3VtZW50cyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZWFjdGlvbkFyZ3VtZW50cyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c1Byb3BlcnRpZXM6IHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIG5ld1Byb3BlcnRpZXM6IHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlYWN0aW9uQXJndW1lbnRzLnByZXZpb3VzUHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gX3RoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcclxuICAgICAgICAgICAgcmVhY3Rpb25Bcmd1bWVudHMubmV3UHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gbmV3UHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xyXG4gICAgICAgICAgICBpZiAoY2hhbmdlZFByb3BlcnR5S2V5cy5pbmRleE9mKHByb3BlcnR5TmFtZSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZWFjdGlvbkFyZ3VtZW50cy5jaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZWFjdGlvblByb3BlcnR5TWFwLnNldChyZWFjdGlvbiwgcmVhY3Rpb25Bcmd1bWVudHMpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVhY3Rpb25Qcm9wZXJ0eU1hcDtcclxuICAgICAgICB9LCBuZXcgTWFwXzEuZGVmYXVsdCgpKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEJpbmRzIHVuYm91bmQgcHJvcGVydHkgZnVuY3Rpb25zIHRvIHRoZSBzcGVjaWZpZWQgYGJpbmRgIHByb3BlcnR5XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHByb3BlcnRpZXMgcHJvcGVydGllcyB0byBjaGVjayBmb3IgZnVuY3Rpb25zXHJcbiAgICAgKi9cclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eSA9IGZ1bmN0aW9uIChwcm9wZXJ0eSwgYmluZCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgcHJvcGVydHkgPT09ICdmdW5jdGlvbicgJiYgUmVnaXN0cnlfMS5pc1dpZGdldEJhc2VDb25zdHJ1Y3Rvcihwcm9wZXJ0eSkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kRnVuY3Rpb25Qcm9wZXJ0eU1hcCA9IG5ldyBXZWFrTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBiaW5kSW5mbyA9IHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwLmdldChwcm9wZXJ0eSkgfHwge307XHJcbiAgICAgICAgICAgIHZhciBib3VuZEZ1bmMgPSBiaW5kSW5mby5ib3VuZEZ1bmMsIHNjb3BlID0gYmluZEluZm8uc2NvcGU7XHJcbiAgICAgICAgICAgIGlmIChib3VuZEZ1bmMgPT09IHVuZGVmaW5lZCB8fCBzY29wZSAhPT0gYmluZCkge1xyXG4gICAgICAgICAgICAgICAgYm91bmRGdW5jID0gcHJvcGVydHkuYmluZChiaW5kKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRGdW5jdGlvblByb3BlcnR5TWFwLnNldChwcm9wZXJ0eSwgeyBib3VuZEZ1bmM6IGJvdW5kRnVuYywgc2NvcGU6IGJpbmQgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJvdW5kRnVuYztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5O1xyXG4gICAgfTtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXaWRnZXRCYXNlLnByb3RvdHlwZSwgXCJyZWdpc3RyeVwiLCB7XHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZWdpc3RyeSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWdpc3RyeSA9IG5ldyBSZWdpc3RyeUhhbmRsZXJfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm93bih0aGlzLl9yZWdpc3RyeSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm93bih0aGlzLl9yZWdpc3RyeS5vbignaW52YWxpZGF0ZScsIHRoaXMuX2JvdW5kSW52YWxpZGF0ZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLl9ydW5CZWZvcmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBiZWZvcmVQcm9wZXJ0aWVzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2JlZm9yZVByb3BlcnRpZXMnKTtcclxuICAgICAgICBpZiAoYmVmb3JlUHJvcGVydGllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBiZWZvcmVQcm9wZXJ0aWVzLnJlZHVjZShmdW5jdGlvbiAocHJvcGVydGllcywgYmVmb3JlUHJvcGVydGllc0Z1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHNsaWJfMS5fX2Fzc2lnbih7fSwgcHJvcGVydGllcywgYmVmb3JlUHJvcGVydGllc0Z1bmN0aW9uLmNhbGwoX3RoaXMsIHByb3BlcnRpZXMpKTtcclxuICAgICAgICAgICAgfSwgdHNsaWJfMS5fX2Fzc2lnbih7fSwgcHJvcGVydGllcykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJvcGVydGllcztcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJ1biBhbGwgcmVnaXN0ZXJlZCBiZWZvcmUgcmVuZGVycyBhbmQgcmV0dXJuIHRoZSB1cGRhdGVkIHJlbmRlciBtZXRob2RcclxuICAgICAqL1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuX3J1bkJlZm9yZVJlbmRlcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgYmVmb3JlUmVuZGVycyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdiZWZvcmVSZW5kZXInKTtcclxuICAgICAgICBpZiAoYmVmb3JlUmVuZGVycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBiZWZvcmVSZW5kZXJzLnJlZHVjZShmdW5jdGlvbiAocmVuZGVyLCBiZWZvcmVSZW5kZXJGdW5jdGlvbikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHVwZGF0ZWRSZW5kZXIgPSBiZWZvcmVSZW5kZXJGdW5jdGlvbi5jYWxsKF90aGlzLCByZW5kZXIsIF90aGlzLl9wcm9wZXJ0aWVzLCBfdGhpcy5fY2hpbGRyZW4pO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF1cGRhdGVkUmVuZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdSZW5kZXIgZnVuY3Rpb24gbm90IHJldHVybmVkIGZyb20gYmVmb3JlUmVuZGVyLCB1c2luZyBwcmV2aW91cyByZW5kZXInKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVuZGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZWRSZW5kZXI7XHJcbiAgICAgICAgICAgIH0sIHRoaXMuX2JvdW5kUmVuZGVyRnVuYyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9ib3VuZFJlbmRlckZ1bmM7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSdW4gYWxsIHJlZ2lzdGVyZWQgYWZ0ZXIgcmVuZGVycyBhbmQgcmV0dXJuIHRoZSBkZWNvcmF0ZWQgRE5vZGVzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGROb2RlIFRoZSBETm9kZXMgdG8gcnVuIHRocm91Z2ggdGhlIGFmdGVyIHJlbmRlcnNcclxuICAgICAqL1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUucnVuQWZ0ZXJSZW5kZXJzID0gZnVuY3Rpb24gKGROb2RlKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgYWZ0ZXJSZW5kZXJzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2FmdGVyUmVuZGVyJyk7XHJcbiAgICAgICAgaWYgKGFmdGVyUmVuZGVycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhZnRlclJlbmRlcnMucmVkdWNlKGZ1bmN0aW9uIChkTm9kZSwgYWZ0ZXJSZW5kZXJGdW5jdGlvbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFmdGVyUmVuZGVyRnVuY3Rpb24uY2FsbChfdGhpcywgZE5vZGUpO1xyXG4gICAgICAgICAgICB9LCBkTm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9tZXRhTWFwICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWV0YU1hcC5mb3JFYWNoKGZ1bmN0aW9uIChtZXRhKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhLmFmdGVyUmVuZGVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZE5vZGU7XHJcbiAgICB9O1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUuX3J1bkFmdGVyQ29uc3RydWN0b3JzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGFmdGVyQ29uc3RydWN0b3JzID0gdGhpcy5nZXREZWNvcmF0b3IoJ2FmdGVyQ29uc3RydWN0b3InKTtcclxuICAgICAgICBpZiAoYWZ0ZXJDb25zdHJ1Y3RvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBhZnRlckNvbnN0cnVjdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChhZnRlckNvbnN0cnVjdG9yKSB7IHJldHVybiBhZnRlckNvbnN0cnVjdG9yLmNhbGwoX3RoaXMpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgV2lkZ2V0QmFzZS5wcm90b3R5cGUub3duID0gZnVuY3Rpb24gKGhhbmRsZSkge1xyXG4gICAgICAgIHRoaXMuX2hhbmRsZXMucHVzaChoYW5kbGUpO1xyXG4gICAgfTtcclxuICAgIFdpZGdldEJhc2UucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuX2hhbmRsZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgaGFuZGxlID0gdGhpcy5faGFuZGxlcy5wb3AoKTtcclxuICAgICAgICAgICAgaWYgKGhhbmRsZSkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIHN0YXRpYyBpZGVudGlmaWVyXHJcbiAgICAgKi9cclxuICAgIFdpZGdldEJhc2UuX3R5cGUgPSBSZWdpc3RyeV8xLldJREdFVF9CQVNFX1RZUEU7XHJcbiAgICByZXR1cm4gV2lkZ2V0QmFzZTtcclxufSgpKTtcclxuZXhwb3J0cy5XaWRnZXRCYXNlID0gV2lkZ2V0QmFzZTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gV2lkZ2V0QmFzZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lID0gJyc7XHJcbnZhciBicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUgPSAnJztcclxuZnVuY3Rpb24gZGV0ZXJtaW5lQnJvd3NlclN0eWxlTmFtZXMoZWxlbWVudCkge1xyXG4gICAgaWYgKCdXZWJraXRUcmFuc2l0aW9uJyBpbiBlbGVtZW50LnN0eWxlKSB7XHJcbiAgICAgICAgYnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSA9ICd3ZWJraXRUcmFuc2l0aW9uRW5kJztcclxuICAgICAgICBicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUgPSAnd2Via2l0QW5pbWF0aW9uRW5kJztcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKCd0cmFuc2l0aW9uJyBpbiBlbGVtZW50LnN0eWxlIHx8ICdNb3pUcmFuc2l0aW9uJyBpbiBlbGVtZW50LnN0eWxlKSB7XHJcbiAgICAgICAgYnJvd3NlclNwZWNpZmljVHJhbnNpdGlvbkVuZEV2ZW50TmFtZSA9ICd0cmFuc2l0aW9uZW5kJztcclxuICAgICAgICBicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUgPSAnYW5pbWF0aW9uZW5kJztcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignWW91ciBicm93c2VyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBpbml0aWFsaXplKGVsZW1lbnQpIHtcclxuICAgIGlmIChicm93c2VyU3BlY2lmaWNBbmltYXRpb25FbmRFdmVudE5hbWUgPT09ICcnKSB7XHJcbiAgICAgICAgZGV0ZXJtaW5lQnJvd3NlclN0eWxlTmFtZXMoZWxlbWVudCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcnVuQW5kQ2xlYW5VcChlbGVtZW50LCBzdGFydEFuaW1hdGlvbiwgZmluaXNoQW5pbWF0aW9uKSB7XHJcbiAgICBpbml0aWFsaXplKGVsZW1lbnQpO1xyXG4gICAgdmFyIGZpbmlzaGVkID0gZmFsc2U7XHJcbiAgICB2YXIgdHJhbnNpdGlvbkVuZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIWZpbmlzaGVkKSB7XHJcbiAgICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGJyb3dzZXJTcGVjaWZpY1RyYW5zaXRpb25FbmRFdmVudE5hbWUsIHRyYW5zaXRpb25FbmQpO1xyXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kKTtcclxuICAgICAgICAgICAgZmluaXNoQW5pbWF0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHN0YXJ0QW5pbWF0aW9uKCk7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoYnJvd3NlclNwZWNpZmljQW5pbWF0aW9uRW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kKTtcclxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihicm93c2VyU3BlY2lmaWNUcmFuc2l0aW9uRW5kRXZlbnROYW1lLCB0cmFuc2l0aW9uRW5kKTtcclxufVxyXG5mdW5jdGlvbiBleGl0KG5vZGUsIHByb3BlcnRpZXMsIGV4aXRBbmltYXRpb24sIHJlbW92ZU5vZGUpIHtcclxuICAgIHZhciBhY3RpdmVDbGFzcyA9IHByb3BlcnRpZXMuZXhpdEFuaW1hdGlvbkFjdGl2ZSB8fCBleGl0QW5pbWF0aW9uICsgXCItYWN0aXZlXCI7XHJcbiAgICBydW5BbmRDbGVhblVwKG5vZGUsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoZXhpdEFuaW1hdGlvbik7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKGFjdGl2ZUNsYXNzKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZW1vdmVOb2RlKCk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBlbnRlcihub2RlLCBwcm9wZXJ0aWVzLCBlbnRlckFuaW1hdGlvbikge1xyXG4gICAgdmFyIGFjdGl2ZUNsYXNzID0gcHJvcGVydGllcy5lbnRlckFuaW1hdGlvbkFjdGl2ZSB8fCBlbnRlckFuaW1hdGlvbiArIFwiLWFjdGl2ZVwiO1xyXG4gICAgcnVuQW5kQ2xlYW5VcChub2RlLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKGVudGVyQW5pbWF0aW9uKTtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIG5vZGUuY2xhc3NMaXN0LnJlbW92ZShlbnRlckFuaW1hdGlvbik7XHJcbiAgICAgICAgbm9kZS5jbGFzc0xpc3QucmVtb3ZlKGFjdGl2ZUNsYXNzKTtcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IHtcclxuICAgIGVudGVyOiBlbnRlcixcclxuICAgIGV4aXQ6IGV4aXRcclxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9hbmltYXRpb25zL2Nzc1RyYW5zaXRpb25zLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9hbmltYXRpb25zL2Nzc1RyYW5zaXRpb25zLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgU3ltYm9sXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9TeW1ib2xcIik7XHJcbi8qKlxyXG4gKiBUaGUgc3ltYm9sIGlkZW50aWZpZXIgZm9yIGEgV05vZGUgdHlwZVxyXG4gKi9cclxuZXhwb3J0cy5XTk9ERSA9IFN5bWJvbF8xLmRlZmF1bHQoJ0lkZW50aWZpZXIgZm9yIGEgV05vZGUuJyk7XHJcbi8qKlxyXG4gKiBUaGUgc3ltYm9sIGlkZW50aWZpZXIgZm9yIGEgVk5vZGUgdHlwZVxyXG4gKi9cclxuZXhwb3J0cy5WTk9ERSA9IFN5bWJvbF8xLmRlZmF1bHQoJ0lkZW50aWZpZXIgZm9yIGEgVk5vZGUuJyk7XHJcbi8qKlxyXG4gKiBIZWxwZXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRydWUgaWYgdGhlIGBETm9kZWAgaXMgYSBgV05vZGVgIHVzaW5nIHRoZSBgdHlwZWAgcHJvcGVydHlcclxuICovXHJcbmZ1bmN0aW9uIGlzV05vZGUoY2hpbGQpIHtcclxuICAgIHJldHVybiBCb29sZWFuKGNoaWxkICYmIHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycgJiYgY2hpbGQudHlwZSA9PT0gZXhwb3J0cy5XTk9ERSk7XHJcbn1cclxuZXhwb3J0cy5pc1dOb2RlID0gaXNXTm9kZTtcclxuLyoqXHJcbiAqIEhlbHBlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgdHJ1ZSBpZiB0aGUgYEROb2RlYCBpcyBhIGBWTm9kZWAgdXNpbmcgdGhlIGB0eXBlYCBwcm9wZXJ0eVxyXG4gKi9cclxuZnVuY3Rpb24gaXNWTm9kZShjaGlsZCkge1xyXG4gICAgcmV0dXJuIEJvb2xlYW4oY2hpbGQgJiYgdHlwZW9mIGNoaWxkICE9PSAnc3RyaW5nJyAmJiBjaGlsZC50eXBlID09PSBleHBvcnRzLlZOT0RFKTtcclxufVxyXG5leHBvcnRzLmlzVk5vZGUgPSBpc1ZOb2RlO1xyXG5mdW5jdGlvbiBpc0VsZW1lbnROb2RlKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gISF2YWx1ZS50YWdOYW1lO1xyXG59XHJcbmV4cG9ydHMuaXNFbGVtZW50Tm9kZSA9IGlzRWxlbWVudE5vZGU7XHJcbmZ1bmN0aW9uIGRlY29yYXRlKGROb2Rlcywgb3B0aW9uc09yTW9kaWZpZXIsIHByZWRpY2F0ZSkge1xyXG4gICAgdmFyIHNoYWxsb3cgPSBmYWxzZTtcclxuICAgIHZhciBtb2RpZmllcjtcclxuICAgIGlmICh0eXBlb2Ygb3B0aW9uc09yTW9kaWZpZXIgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBtb2RpZmllciA9IG9wdGlvbnNPck1vZGlmaWVyO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgbW9kaWZpZXIgPSBvcHRpb25zT3JNb2RpZmllci5tb2RpZmllcjtcclxuICAgICAgICBwcmVkaWNhdGUgPSBvcHRpb25zT3JNb2RpZmllci5wcmVkaWNhdGU7XHJcbiAgICAgICAgc2hhbGxvdyA9IG9wdGlvbnNPck1vZGlmaWVyLnNoYWxsb3cgfHwgZmFsc2U7XHJcbiAgICB9XHJcbiAgICB2YXIgbm9kZXMgPSBBcnJheS5pc0FycmF5KGROb2RlcykgPyB0c2xpYl8xLl9fc3ByZWFkKGROb2RlcykgOiBbZE5vZGVzXTtcclxuICAgIGZ1bmN0aW9uIGJyZWFrZXIoKSB7XHJcbiAgICAgICAgbm9kZXMgPSBbXTtcclxuICAgIH1cclxuICAgIHdoaWxlIChub2Rlcy5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzLnNoaWZ0KCk7XHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgaWYgKCFzaGFsbG93ICYmIChpc1dOb2RlKG5vZGUpIHx8IGlzVk5vZGUobm9kZSkpICYmIG5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgIG5vZGVzID0gdHNsaWJfMS5fX3NwcmVhZChub2Rlcywgbm9kZS5jaGlsZHJlbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFwcmVkaWNhdGUgfHwgcHJlZGljYXRlKG5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICBtb2RpZmllcihub2RlLCBicmVha2VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBkTm9kZXM7XHJcbn1cclxuZXhwb3J0cy5kZWNvcmF0ZSA9IGRlY29yYXRlO1xyXG4vKipcclxuICogV3JhcHBlciBmdW5jdGlvbiBmb3IgY2FsbHMgdG8gY3JlYXRlIGEgd2lkZ2V0LlxyXG4gKi9cclxuZnVuY3Rpb24gdyh3aWRnZXRDb25zdHJ1Y3RvciwgcHJvcGVydGllcywgY2hpbGRyZW4pIHtcclxuICAgIGlmIChjaGlsZHJlbiA9PT0gdm9pZCAwKSB7IGNoaWxkcmVuID0gW107IH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgY2hpbGRyZW46IGNoaWxkcmVuLFxyXG4gICAgICAgIHdpZGdldENvbnN0cnVjdG9yOiB3aWRnZXRDb25zdHJ1Y3RvcixcclxuICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzLFxyXG4gICAgICAgIHR5cGU6IGV4cG9ydHMuV05PREVcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy53ID0gdztcclxuZnVuY3Rpb24gdih0YWcsIHByb3BlcnRpZXNPckNoaWxkcmVuLCBjaGlsZHJlbikge1xyXG4gICAgaWYgKHByb3BlcnRpZXNPckNoaWxkcmVuID09PSB2b2lkIDApIHsgcHJvcGVydGllc09yQ2hpbGRyZW4gPSB7fTsgfVxyXG4gICAgaWYgKGNoaWxkcmVuID09PSB2b2lkIDApIHsgY2hpbGRyZW4gPSB1bmRlZmluZWQ7IH1cclxuICAgIHZhciBwcm9wZXJ0aWVzID0gcHJvcGVydGllc09yQ2hpbGRyZW47XHJcbiAgICB2YXIgZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2s7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wZXJ0aWVzT3JDaGlsZHJlbikpIHtcclxuICAgICAgICBjaGlsZHJlbiA9IHByb3BlcnRpZXNPckNoaWxkcmVuO1xyXG4gICAgICAgIHByb3BlcnRpZXMgPSB7fTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIGRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrID0gcHJvcGVydGllcztcclxuICAgICAgICBwcm9wZXJ0aWVzID0ge307XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRhZzogdGFnLFxyXG4gICAgICAgIGRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrOiBkZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayxcclxuICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW4sXHJcbiAgICAgICAgcHJvcGVydGllczogcHJvcGVydGllcyxcclxuICAgICAgICB0eXBlOiBleHBvcnRzLlZOT0RFXHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMudiA9IHY7XHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBWTm9kZSBmb3IgYW4gZXhpc3RpbmcgRE9NIE5vZGUuXHJcbiAqL1xyXG5mdW5jdGlvbiBkb20oX2EsIGNoaWxkcmVuKSB7XHJcbiAgICB2YXIgbm9kZSA9IF9hLm5vZGUsIF9iID0gX2EuYXR0cnMsIGF0dHJzID0gX2IgPT09IHZvaWQgMCA/IHt9IDogX2IsIF9jID0gX2EucHJvcHMsIHByb3BzID0gX2MgPT09IHZvaWQgMCA/IHt9IDogX2MsIF9kID0gX2Eub24sIG9uID0gX2QgPT09IHZvaWQgMCA/IHt9IDogX2QsIF9lID0gX2EuZGlmZlR5cGUsIGRpZmZUeXBlID0gX2UgPT09IHZvaWQgMCA/ICdub25lJyA6IF9lO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0YWc6IGlzRWxlbWVudE5vZGUobm9kZSkgPyBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA6ICcnLFxyXG4gICAgICAgIHByb3BlcnRpZXM6IHByb3BzLFxyXG4gICAgICAgIGF0dHJpYnV0ZXM6IGF0dHJzLFxyXG4gICAgICAgIGV2ZW50czogb24sXHJcbiAgICAgICAgY2hpbGRyZW46IGNoaWxkcmVuLFxyXG4gICAgICAgIHR5cGU6IGV4cG9ydHMuVk5PREUsXHJcbiAgICAgICAgZG9tTm9kZTogbm9kZSxcclxuICAgICAgICB0ZXh0OiBpc0VsZW1lbnROb2RlKG5vZGUpID8gdW5kZWZpbmVkIDogbm9kZS5kYXRhLFxyXG4gICAgICAgIGRpZmZUeXBlOiBkaWZmVHlwZVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLmRvbSA9IGRvbTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBoYW5kbGVEZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2hhbmRsZURlY29yYXRvclwiKTtcclxuZnVuY3Rpb24gYWZ0ZXJSZW5kZXIobWV0aG9kKSB7XHJcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yXzEuaGFuZGxlRGVjb3JhdG9yKGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XHJcbiAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcignYWZ0ZXJSZW5kZXInLCBwcm9wZXJ0eUtleSA/IHRhcmdldFtwcm9wZXJ0eUtleV0gOiBtZXRob2QpO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5hZnRlclJlbmRlciA9IGFmdGVyUmVuZGVyO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBhZnRlclJlbmRlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2FmdGVyUmVuZGVyLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBoYW5kbGVEZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2hhbmRsZURlY29yYXRvclwiKTtcclxudmFyIGJlZm9yZVByb3BlcnRpZXNfMSA9IHJlcXVpcmUoXCIuL2JlZm9yZVByb3BlcnRpZXNcIik7XHJcbmZ1bmN0aW9uIGFsd2F5c1JlbmRlcigpIHtcclxuICAgIHJldHVybiBoYW5kbGVEZWNvcmF0b3JfMS5oYW5kbGVEZWNvcmF0b3IoZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcclxuICAgICAgICBiZWZvcmVQcm9wZXJ0aWVzXzEuYmVmb3JlUHJvcGVydGllcyhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZSgpO1xyXG4gICAgICAgIH0pKHRhcmdldCk7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmFsd2F5c1JlbmRlciA9IGFsd2F5c1JlbmRlcjtcclxuZXhwb3J0cy5kZWZhdWx0ID0gYWx3YXlzUmVuZGVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvYWx3YXlzUmVuZGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2Fsd2F5c1JlbmRlci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgaGFuZGxlRGVjb3JhdG9yXzEgPSByZXF1aXJlKFwiLi9oYW5kbGVEZWNvcmF0b3JcIik7XHJcbmZ1bmN0aW9uIGJlZm9yZVByb3BlcnRpZXMobWV0aG9kKSB7XHJcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yXzEuaGFuZGxlRGVjb3JhdG9yKGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XHJcbiAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcignYmVmb3JlUHJvcGVydGllcycsIHByb3BlcnR5S2V5ID8gdGFyZ2V0W3Byb3BlcnR5S2V5XSA6IG1ldGhvZCk7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmJlZm9yZVByb3BlcnRpZXMgPSBiZWZvcmVQcm9wZXJ0aWVzO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBiZWZvcmVQcm9wZXJ0aWVzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvYmVmb3JlUHJvcGVydGllcy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9iZWZvcmVQcm9wZXJ0aWVzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciByZWdpc3RlckN1c3RvbUVsZW1lbnRfMSA9IHJlcXVpcmUoXCIuLi9yZWdpc3RlckN1c3RvbUVsZW1lbnRcIik7XHJcbi8qKlxyXG4gKiBUaGlzIERlY29yYXRvciBpcyBwcm92aWRlZCBwcm9wZXJ0aWVzIHRoYXQgZGVmaW5lIHRoZSBiZWhhdmlvciBvZiBhIGN1c3RvbSBlbGVtZW50LCBhbmRcclxuICogcmVnaXN0ZXJzIHRoYXQgY3VzdG9tIGVsZW1lbnQuXHJcbiAqL1xyXG5mdW5jdGlvbiBjdXN0b21FbGVtZW50KF9hKSB7XHJcbiAgICB2YXIgdGFnID0gX2EudGFnLCBfYiA9IF9hLnByb3BlcnRpZXMsIHByb3BlcnRpZXMgPSBfYiA9PT0gdm9pZCAwID8gW10gOiBfYiwgX2MgPSBfYS5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzID0gX2MgPT09IHZvaWQgMCA/IFtdIDogX2MsIF9kID0gX2EuZXZlbnRzLCBldmVudHMgPSBfZCA9PT0gdm9pZCAwID8gW10gOiBfZCwgX2UgPSBfYS5jaGlsZFR5cGUsIGNoaWxkVHlwZSA9IF9lID09PSB2b2lkIDAgPyByZWdpc3RlckN1c3RvbUVsZW1lbnRfMS5DdXN0b21FbGVtZW50Q2hpbGRUeXBlLkRPSk8gOiBfZTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XHJcbiAgICAgICAgdGFyZ2V0LnByb3RvdHlwZS5fX2N1c3RvbUVsZW1lbnREZXNjcmlwdG9yID0ge1xyXG4gICAgICAgICAgICB0YWdOYW1lOiB0YWcsXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXMsXHJcbiAgICAgICAgICAgIGV2ZW50czogZXZlbnRzLFxyXG4gICAgICAgICAgICBjaGlsZFR5cGU6IGNoaWxkVHlwZVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMuY3VzdG9tRWxlbWVudCA9IGN1c3RvbUVsZW1lbnQ7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGN1c3RvbUVsZW1lbnQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9jdXN0b21FbGVtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnQuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGhhbmRsZURlY29yYXRvcl8xID0gcmVxdWlyZShcIi4vaGFuZGxlRGVjb3JhdG9yXCIpO1xyXG4vKipcclxuICogRGVjb3JhdG9yIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVnaXN0ZXIgYSBmdW5jdGlvbiBhcyBhIHNwZWNpZmljIHByb3BlcnR5IGRpZmZcclxuICpcclxuICogQHBhcmFtIHByb3BlcnR5TmFtZSAgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IG9mIHdoaWNoIHRoZSBkaWZmIGZ1bmN0aW9uIGlzIGFwcGxpZWRcclxuICogQHBhcmFtIGRpZmZUeXBlICAgICAgVGhlIGRpZmYgdHlwZSwgZGVmYXVsdCBpcyBEaWZmVHlwZS5BVVRPLlxyXG4gKiBAcGFyYW0gZGlmZkZ1bmN0aW9uICBBIGRpZmYgZnVuY3Rpb24gdG8gcnVuIGlmIGRpZmZUeXBlIGlmIERpZmZUeXBlLkNVU1RPTVxyXG4gKi9cclxuZnVuY3Rpb24gZGlmZlByb3BlcnR5KHByb3BlcnR5TmFtZSwgZGlmZkZ1bmN0aW9uLCByZWFjdGlvbkZ1bmN0aW9uKSB7XHJcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yXzEuaGFuZGxlRGVjb3JhdG9yKGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XHJcbiAgICAgICAgdGFyZ2V0LmFkZERlY29yYXRvcihcImRpZmZQcm9wZXJ0eTpcIiArIHByb3BlcnR5TmFtZSwgZGlmZkZ1bmN0aW9uLmJpbmQobnVsbCkpO1xyXG4gICAgICAgIHRhcmdldC5hZGREZWNvcmF0b3IoJ3JlZ2lzdGVyZWREaWZmUHJvcGVydHknLCBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgIGlmIChyZWFjdGlvbkZ1bmN0aW9uIHx8IHByb3BlcnR5S2V5KSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5hZGREZWNvcmF0b3IoJ2RpZmZSZWFjdGlvbicsIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZTogcHJvcGVydHlOYW1lLFxyXG4gICAgICAgICAgICAgICAgcmVhY3Rpb246IHByb3BlcnR5S2V5ID8gdGFyZ2V0W3Byb3BlcnR5S2V5XSA6IHJlYWN0aW9uRnVuY3Rpb25cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5kaWZmUHJvcGVydHkgPSBkaWZmUHJvcGVydHk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGRpZmZQcm9wZXJ0eTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2RpZmZQcm9wZXJ0eS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9kaWZmUHJvcGVydHkuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLyoqXHJcbiAqIEdlbmVyaWMgZGVjb3JhdG9yIGhhbmRsZXIgdG8gdGFrZSBjYXJlIG9mIHdoZXRoZXIgb3Igbm90IHRoZSBkZWNvcmF0b3Igd2FzIGNhbGxlZCBhdCB0aGUgY2xhc3MgbGV2ZWxcclxuICogb3IgdGhlIG1ldGhvZCBsZXZlbC5cclxuICpcclxuICogQHBhcmFtIGhhbmRsZXJcclxuICovXHJcbmZ1bmN0aW9uIGhhbmRsZURlY29yYXRvcihoYW5kbGVyKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXksIGRlc2NyaXB0b3IpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBoYW5kbGVyKHRhcmdldC5wcm90b3R5cGUsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBoYW5kbGVyKHRhcmdldCwgcHJvcGVydHlLZXkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5oYW5kbGVEZWNvcmF0b3IgPSBoYW5kbGVEZWNvcmF0b3I7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGhhbmRsZURlY29yYXRvcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2hhbmRsZURlY29yYXRvci5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9oYW5kbGVEZWNvcmF0b3IuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIFdlYWtNYXBfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL1dlYWtNYXBcIik7XHJcbnZhciBoYW5kbGVEZWNvcmF0b3JfMSA9IHJlcXVpcmUoXCIuL2hhbmRsZURlY29yYXRvclwiKTtcclxudmFyIGJlZm9yZVByb3BlcnRpZXNfMSA9IHJlcXVpcmUoXCIuL2JlZm9yZVByb3BlcnRpZXNcIik7XHJcbi8qKlxyXG4gKiBNYXAgb2YgaW5zdGFuY2VzIGFnYWluc3QgcmVnaXN0ZXJlZCBpbmplY3RvcnMuXHJcbiAqL1xyXG52YXIgcmVnaXN0ZXJlZEluamVjdG9yc01hcCA9IG5ldyBXZWFrTWFwXzEuZGVmYXVsdCgpO1xyXG4vKipcclxuICogRGVjb3JhdG9yIHJldHJpZXZlcyBhbiBpbmplY3RvciBmcm9tIGFuIGF2YWlsYWJsZSByZWdpc3RyeSB1c2luZyB0aGUgbmFtZSBhbmRcclxuICogY2FsbHMgdGhlIGBnZXRQcm9wZXJ0aWVzYCBmdW5jdGlvbiB3aXRoIHRoZSBwYXlsb2FkIGZyb20gdGhlIGluamVjdG9yXHJcbiAqIGFuZCBjdXJyZW50IHByb3BlcnRpZXMgd2l0aCB0aGUgdGhlIGluamVjdGVkIHByb3BlcnRpZXMgcmV0dXJuZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSBJbmplY3RDb25maWcgdGhlIGluamVjdCBjb25maWd1cmF0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBpbmplY3QoX2EpIHtcclxuICAgIHZhciBuYW1lID0gX2EubmFtZSwgZ2V0UHJvcGVydGllcyA9IF9hLmdldFByb3BlcnRpZXM7XHJcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yXzEuaGFuZGxlRGVjb3JhdG9yKGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XHJcbiAgICAgICAgYmVmb3JlUHJvcGVydGllc18xLmJlZm9yZVByb3BlcnRpZXMoZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIGluamVjdG9yID0gdGhpcy5yZWdpc3RyeS5nZXRJbmplY3RvcihuYW1lKTtcclxuICAgICAgICAgICAgaWYgKGluamVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVnaXN0ZXJlZEluamVjdG9ycyA9IHJlZ2lzdGVyZWRJbmplY3RvcnNNYXAuZ2V0KHRoaXMpIHx8IFtdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlZ2lzdGVyZWRJbmplY3RvcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJlZEluamVjdG9yc01hcC5zZXQodGhpcywgcmVnaXN0ZXJlZEluamVjdG9ycyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocmVnaXN0ZXJlZEluamVjdG9ycy5pbmRleE9mKGluamVjdG9yKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm93bihpbmplY3Rvci5vbignaW52YWxpZGF0ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaW52YWxpZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICByZWdpc3RlcmVkSW5qZWN0b3JzLnB1c2goaW5qZWN0b3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFByb3BlcnRpZXMoaW5qZWN0b3IuZ2V0KCksIHByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkodGFyZ2V0KTtcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuaW5qZWN0ID0gaW5qZWN0O1xyXG5leHBvcnRzLmRlZmF1bHQgPSBpbmplY3Q7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGVjb3JhdG9ycy9pbmplY3QuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvaW5qZWN0LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBSZWdpc3RyeV8xID0gcmVxdWlyZShcIi4vUmVnaXN0cnlcIik7XHJcbmZ1bmN0aW9uIGlzT2JqZWN0T3JBcnJheSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nIHx8IEFycmF5LmlzQXJyYXkodmFsdWUpO1xyXG59XHJcbmZ1bmN0aW9uIGFsd2F5cyhwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjaGFuZ2VkOiB0cnVlLFxyXG4gICAgICAgIHZhbHVlOiBuZXdQcm9wZXJ0eVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLmFsd2F5cyA9IGFsd2F5cztcclxuZnVuY3Rpb24gaWdub3JlKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNoYW5nZWQ6IGZhbHNlLFxyXG4gICAgICAgIHZhbHVlOiBuZXdQcm9wZXJ0eVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLmlnbm9yZSA9IGlnbm9yZTtcclxuZnVuY3Rpb24gcmVmZXJlbmNlKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNoYW5nZWQ6IHByZXZpb3VzUHJvcGVydHkgIT09IG5ld1Byb3BlcnR5LFxyXG4gICAgICAgIHZhbHVlOiBuZXdQcm9wZXJ0eVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLnJlZmVyZW5jZSA9IHJlZmVyZW5jZTtcclxuZnVuY3Rpb24gc2hhbGxvdyhwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSkge1xyXG4gICAgdmFyIGNoYW5nZWQgPSBmYWxzZTtcclxuICAgIHZhciB2YWxpZE9sZFByb3BlcnR5ID0gcHJldmlvdXNQcm9wZXJ0eSAmJiBpc09iamVjdE9yQXJyYXkocHJldmlvdXNQcm9wZXJ0eSk7XHJcbiAgICB2YXIgdmFsaWROZXdQcm9wZXJ0eSA9IG5ld1Byb3BlcnR5ICYmIGlzT2JqZWN0T3JBcnJheShuZXdQcm9wZXJ0eSk7XHJcbiAgICBpZiAoIXZhbGlkT2xkUHJvcGVydHkgfHwgIXZhbGlkTmV3UHJvcGVydHkpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjaGFuZ2VkOiB0cnVlLFxyXG4gICAgICAgICAgICB2YWx1ZTogbmV3UHJvcGVydHlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgdmFyIHByZXZpb3VzS2V5cyA9IE9iamVjdC5rZXlzKHByZXZpb3VzUHJvcGVydHkpO1xyXG4gICAgdmFyIG5ld0tleXMgPSBPYmplY3Qua2V5cyhuZXdQcm9wZXJ0eSk7XHJcbiAgICBpZiAocHJldmlvdXNLZXlzLmxlbmd0aCAhPT0gbmV3S2V5cy5sZW5ndGgpIHtcclxuICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNoYW5nZWQgPSBuZXdLZXlzLnNvbWUoZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3UHJvcGVydHlba2V5XSAhPT0gcHJldmlvdXNQcm9wZXJ0eVtrZXldO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBjaGFuZ2VkOiBjaGFuZ2VkLFxyXG4gICAgICAgIHZhbHVlOiBuZXdQcm9wZXJ0eVxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLnNoYWxsb3cgPSBzaGFsbG93O1xyXG5mdW5jdGlvbiBhdXRvKHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KSB7XHJcbiAgICB2YXIgcmVzdWx0O1xyXG4gICAgaWYgKHR5cGVvZiBuZXdQcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIGlmIChuZXdQcm9wZXJ0eS5fdHlwZSA9PT0gUmVnaXN0cnlfMS5XSURHRVRfQkFTRV9UWVBFKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBpZ25vcmUocHJldmlvdXNQcm9wZXJ0eSwgbmV3UHJvcGVydHkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzT2JqZWN0T3JBcnJheShuZXdQcm9wZXJ0eSkpIHtcclxuICAgICAgICByZXN1bHQgPSBzaGFsbG93KHByZXZpb3VzUHJvcGVydHksIG5ld1Byb3BlcnR5KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdCA9IHJlZmVyZW5jZShwcmV2aW91c1Byb3BlcnR5LCBuZXdQcm9wZXJ0eSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbmV4cG9ydHMuYXV0byA9IGF1dG87XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGlmZi5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvZGlmZi5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIERlc3Ryb3lhYmxlXzEgPSByZXF1aXJlKFwiQGRvam8vY29yZS9EZXN0cm95YWJsZVwiKTtcclxudmFyIFNldF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vU2V0XCIpO1xyXG52YXIgQmFzZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKEJhc2UsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBCYXNlKHByb3BlcnRpZXMpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLl9yZXF1ZXN0ZWROb2RlS2V5cyA9IG5ldyBTZXRfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgX3RoaXMuX2ludmFsaWRhdGUgPSBwcm9wZXJ0aWVzLmludmFsaWRhdGU7XHJcbiAgICAgICAgX3RoaXMubm9kZUhhbmRsZXIgPSBwcm9wZXJ0aWVzLm5vZGVIYW5kbGVyO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmJpbmQpIHtcclxuICAgICAgICAgICAgX3RoaXMuX2JpbmQgPSBwcm9wZXJ0aWVzLmJpbmQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIEJhc2UucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub2RlSGFuZGxlci5oYXMoa2V5KTtcclxuICAgIH07XHJcbiAgICBCYXNlLnByb3RvdHlwZS5nZXROb2RlID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHN0cmluZ0tleSA9IFwiXCIgKyBrZXk7XHJcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGVIYW5kbGVyLmdldChzdHJpbmdLZXkpO1xyXG4gICAgICAgIGlmICghbm9kZSAmJiAhdGhpcy5fcmVxdWVzdGVkTm9kZUtleXMuaGFzKHN0cmluZ0tleSkpIHtcclxuICAgICAgICAgICAgdmFyIGhhbmRsZV8xID0gdGhpcy5ub2RlSGFuZGxlci5vbihzdHJpbmdLZXksIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZV8xLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9yZXF1ZXN0ZWROb2RlS2V5cy5kZWxldGUoc3RyaW5nS2V5KTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmludmFsaWRhdGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMub3duKGhhbmRsZV8xKTtcclxuICAgICAgICAgICAgdGhpcy5fcmVxdWVzdGVkTm9kZUtleXMuYWRkKHN0cmluZ0tleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfTtcclxuICAgIEJhc2UucHJvdG90eXBlLmludmFsaWRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5faW52YWxpZGF0ZSgpO1xyXG4gICAgfTtcclxuICAgIEJhc2UucHJvdG90eXBlLmFmdGVyUmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIERvIG5vdGhpbmcgYnkgZGVmYXVsdC5cclxuICAgIH07XHJcbiAgICByZXR1cm4gQmFzZTtcclxufShEZXN0cm95YWJsZV8xLkRlc3Ryb3lhYmxlKSk7XHJcbmV4cG9ydHMuQmFzZSA9IEJhc2U7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEJhc2U7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvbWV0YS9CYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9tZXRhL0Jhc2UuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBCYXNlXzEgPSByZXF1aXJlKFwiLi9CYXNlXCIpO1xyXG52YXIgbGFuZ18xID0gcmVxdWlyZShcIkBkb2pvL2NvcmUvbGFuZ1wiKTtcclxudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vZ2xvYmFsXCIpO1xyXG52YXIgZGVmYXVsdFJlc3VsdHMgPSB7XHJcbiAgICBhY3RpdmU6IGZhbHNlLFxyXG4gICAgY29udGFpbnNGb2N1czogZmFsc2VcclxufTtcclxudmFyIEZvY3VzID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoRm9jdXMsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBGb2N1cygpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5fb25Gb2N1c0NoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMuX2FjdGl2ZUVsZW1lbnQgPSBnbG9iYWxfMS5kZWZhdWx0LmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiAgICAgICAgICAgIF90aGlzLmludmFsaWRhdGUoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIEZvY3VzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmdldE5vZGUoa2V5KTtcclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRzbGliXzEuX19hc3NpZ24oe30sIGRlZmF1bHRSZXN1bHRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLl9hY3RpdmVFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FjdGl2ZUVsZW1lbnQgPSBnbG9iYWxfMS5kZWZhdWx0LmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUxpc3RlbmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGFjdGl2ZTogbm9kZSA9PT0gdGhpcy5fYWN0aXZlRWxlbWVudCxcclxuICAgICAgICAgICAgY29udGFpbnNGb2N1czogbm9kZS5jb250YWlucyh0aGlzLl9hY3RpdmVFbGVtZW50KVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgRm9jdXMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuZ2V0Tm9kZShrZXkpO1xyXG4gICAgICAgIG5vZGUgJiYgbm9kZS5mb2N1cygpO1xyXG4gICAgfTtcclxuICAgIEZvY3VzLnByb3RvdHlwZS5fY3JlYXRlTGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZ2xvYmFsXzEuZGVmYXVsdC5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgdGhpcy5fb25Gb2N1c0NoYW5nZSk7XHJcbiAgICAgICAgZ2xvYmFsXzEuZGVmYXVsdC5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c291dCcsIHRoaXMuX29uRm9jdXNDaGFuZ2UpO1xyXG4gICAgICAgIHRoaXMub3duKGxhbmdfMS5jcmVhdGVIYW5kbGUodGhpcy5fcmVtb3ZlTGlzdGVuZXIuYmluZCh0aGlzKSkpO1xyXG4gICAgfTtcclxuICAgIEZvY3VzLnByb3RvdHlwZS5fcmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZ2xvYmFsXzEuZGVmYXVsdC5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1c2luJywgdGhpcy5fb25Gb2N1c0NoYW5nZSk7XHJcbiAgICAgICAgZ2xvYmFsXzEuZGVmYXVsdC5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1c291dCcsIHRoaXMuX29uRm9jdXNDaGFuZ2UpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBGb2N1cztcclxufShCYXNlXzEuQmFzZSkpO1xyXG5leHBvcnRzLkZvY3VzID0gRm9jdXM7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEZvY3VzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21ldGEvRm9jdXMuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21ldGEvRm9jdXMuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBsYW5nXzEgPSByZXF1aXJlKFwiQGRvam8vY29yZS9sYW5nXCIpO1xyXG52YXIgY3NzVHJhbnNpdGlvbnNfMSA9IHJlcXVpcmUoXCIuLi9hbmltYXRpb25zL2Nzc1RyYW5zaXRpb25zXCIpO1xyXG52YXIgYWZ0ZXJSZW5kZXJfMSA9IHJlcXVpcmUoXCIuLy4uL2RlY29yYXRvcnMvYWZ0ZXJSZW5kZXJcIik7XHJcbnZhciBkXzEgPSByZXF1aXJlKFwiLi8uLi9kXCIpO1xyXG52YXIgdmRvbV8xID0gcmVxdWlyZShcIi4vLi4vdmRvbVwiKTtcclxuLyoqXHJcbiAqIFJlcHJlc2VudHMgdGhlIGF0dGFjaCBzdGF0ZSBvZiB0aGUgcHJvamVjdG9yXHJcbiAqL1xyXG52YXIgUHJvamVjdG9yQXR0YWNoU3RhdGU7XHJcbihmdW5jdGlvbiAoUHJvamVjdG9yQXR0YWNoU3RhdGUpIHtcclxuICAgIFByb2plY3RvckF0dGFjaFN0YXRlW1Byb2plY3RvckF0dGFjaFN0YXRlW1wiQXR0YWNoZWRcIl0gPSAxXSA9IFwiQXR0YWNoZWRcIjtcclxuICAgIFByb2plY3RvckF0dGFjaFN0YXRlW1Byb2plY3RvckF0dGFjaFN0YXRlW1wiRGV0YWNoZWRcIl0gPSAyXSA9IFwiRGV0YWNoZWRcIjtcclxufSkoUHJvamVjdG9yQXR0YWNoU3RhdGUgPSBleHBvcnRzLlByb2plY3RvckF0dGFjaFN0YXRlIHx8IChleHBvcnRzLlByb2plY3RvckF0dGFjaFN0YXRlID0ge30pKTtcclxuLyoqXHJcbiAqIEF0dGFjaCB0eXBlIGZvciB0aGUgcHJvamVjdG9yXHJcbiAqL1xyXG52YXIgQXR0YWNoVHlwZTtcclxuKGZ1bmN0aW9uIChBdHRhY2hUeXBlKSB7XHJcbiAgICBBdHRhY2hUeXBlW0F0dGFjaFR5cGVbXCJBcHBlbmRcIl0gPSAxXSA9IFwiQXBwZW5kXCI7XHJcbiAgICBBdHRhY2hUeXBlW0F0dGFjaFR5cGVbXCJNZXJnZVwiXSA9IDJdID0gXCJNZXJnZVwiO1xyXG59KShBdHRhY2hUeXBlID0gZXhwb3J0cy5BdHRhY2hUeXBlIHx8IChleHBvcnRzLkF0dGFjaFR5cGUgPSB7fSkpO1xyXG5mdW5jdGlvbiBQcm9qZWN0b3JNaXhpbihCYXNlKSB7XHJcbiAgICB2YXIgUHJvamVjdG9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIHRzbGliXzEuX19leHRlbmRzKFByb2plY3RvciwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBQcm9qZWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmFwcGx5KHRoaXMsIHRzbGliXzEuX19zcHJlYWQoYXJncykpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLl9hc3luYyA9IHRydWU7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzID0ge307XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25zOiBjc3NUcmFuc2l0aW9uc18xLmRlZmF1bHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgX3RoaXMucm9vdCA9IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2plY3RvclN0YXRlID0gUHJvamVjdG9yQXR0YWNoU3RhdGUuRGV0YWNoZWQ7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAocm9vdCkge1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IEF0dGFjaFR5cGUuQXBwZW5kLFxyXG4gICAgICAgICAgICAgICAgcm9vdDogcm9vdFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNoKG9wdGlvbnMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgUHJvamVjdG9yLnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uIChyb290KSB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogQXR0YWNoVHlwZS5NZXJnZSxcclxuICAgICAgICAgICAgICAgIHJvb3Q6IHJvb3RcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2F0dGFjaChvcHRpb25zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0b3IucHJvdG90eXBlLCBcInJvb3RcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb290O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChyb290KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBhbHJlYWR5IGF0dGFjaGVkLCBjYW5ub3QgY2hhbmdlIHJvb3QgZWxlbWVudCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm9vdCA9IHJvb3Q7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9qZWN0b3IucHJvdG90eXBlLCBcImFzeW5jXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYXN5bmM7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGFzeW5jKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSA9PT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb2plY3RvciBhbHJlYWR5IGF0dGFjaGVkLCBjYW5ub3QgY2hhbmdlIGFzeW5jIG1vZGUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2FzeW5jID0gYXN5bmM7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFByb2plY3Rvci5wcm90b3R5cGUuc2FuZGJveCA9IGZ1bmN0aW9uIChkb2MpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKGRvYyA9PT0gdm9pZCAwKSB7IGRvYyA9IGRvY3VtZW50OyB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2plY3RvclN0YXRlID09PSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9qZWN0b3IgYWxyZWFkeSBhdHRhY2hlZCwgY2Fubm90IGNyZWF0ZSBzYW5kYm94Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fYXN5bmMgPSBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIHByZXZpb3VzUm9vdCA9IHRoaXMucm9vdDtcclxuICAgICAgICAgICAgLyogZnJlZSB1cCB0aGUgZG9jdW1lbnQgZnJhZ21lbnQgZm9yIEdDICovXHJcbiAgICAgICAgICAgIHRoaXMub3duKHtcclxuICAgICAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fcm9vdCA9IHByZXZpb3VzUm9vdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2F0dGFjaCh7XHJcbiAgICAgICAgICAgICAgICAvKiBEb2N1bWVudEZyYWdtZW50IGlzIG5vdCBhc3NpZ25hYmxlIHRvIEVsZW1lbnQsIGJ1dCBwcm92aWRlcyBldmVyeXRoaW5nIG5lZWRlZCB0byB3b3JrICovXHJcbiAgICAgICAgICAgICAgICByb290OiBkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogQXR0YWNoVHlwZS5BcHBlbmRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0b3IucHJvdG90eXBlLnNldENoaWxkcmVuID0gZnVuY3Rpb24gKGNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX19zZXRDaGlsZHJlbl9fKGNoaWxkcmVuKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rvci5wcm90b3R5cGUuc2V0UHJvcGVydGllcyA9IGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX19zZXRQcm9wZXJ0aWVzX18ocHJvcGVydGllcyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0b3IucHJvdG90eXBlLl9fc2V0UHJvcGVydGllc19fID0gZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMgJiYgdGhpcy5fcHJvamVjdG9yUHJvcGVydGllcy5yZWdpc3RyeSAhPT0gcHJvcGVydGllcy5yZWdpc3RyeSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3Byb2plY3RvclByb3BlcnRpZXMucmVnaXN0cnkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzLnJlZ2lzdHJ5LmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0b3JQcm9wZXJ0aWVzID0gbGFuZ18xLmFzc2lnbih7fSwgcHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUuX19zZXRDb3JlUHJvcGVydGllc19fLmNhbGwodGhpcywgeyBiaW5kOiB0aGlzLCBiYXNlUmVnaXN0cnk6IHByb3BlcnRpZXMucmVnaXN0cnkgfSk7XHJcbiAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUuX19zZXRQcm9wZXJ0aWVzX18uY2FsbCh0aGlzLCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rvci5wcm90b3R5cGUudG9IdG1sID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9qZWN0b3JTdGF0ZSAhPT0gUHJvamVjdG9yQXR0YWNoU3RhdGUuQXR0YWNoZWQgfHwgIXRoaXMuX3Byb2plY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvamVjdG9yIGlzIG5vdCBhdHRhY2hlZCwgY2Fubm90IHJldHVybiBhbiBIVE1MIHN0cmluZyBvZiBwcm9qZWN0aW9uLicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wcm9qZWN0aW9uLmRvbU5vZGUuY2hpbGROb2Rlc1swXS5vdXRlckhUTUw7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0b3IucHJvdG90eXBlLmFmdGVyUmVuZGVyID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IHJlc3VsdDtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT09ICdzdHJpbmcnIHx8IHJlc3VsdCA9PT0gbnVsbCB8fCByZXN1bHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IGRfMS52KCdzcGFuJywge30sIFtyZXN1bHRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFByb2plY3Rvci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBQcm9qZWN0b3IucHJvdG90eXBlLl9hdHRhY2ggPSBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIHR5cGUgPSBfYS50eXBlLCByb290ID0gX2Eucm9vdDtcclxuICAgICAgICAgICAgaWYgKHJvb3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucm9vdCA9IHJvb3Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNoSGFuZGxlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdG9yU3RhdGUgPSBQcm9qZWN0b3JBdHRhY2hTdGF0ZS5BdHRhY2hlZDtcclxuICAgICAgICAgICAgdmFyIGhhbmRsZSA9IHtcclxuICAgICAgICAgICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoX3RoaXMucHJvamVjdG9yU3RhdGUgPT09IFByb2plY3RvckF0dGFjaFN0YXRlLkF0dGFjaGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9wcm9qZWN0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5wcm9qZWN0b3JTdGF0ZSA9IFByb2plY3RvckF0dGFjaFN0YXRlLkRldGFjaGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5vd24oaGFuZGxlKTtcclxuICAgICAgICAgICAgdGhpcy5fYXR0YWNoSGFuZGxlID0gaGFuZGxlO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0aW9uT3B0aW9ucyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zLCB7IHN5bmM6ICF0aGlzLl9hc3luYyB9KTtcclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEF0dGFjaFR5cGUuQXBwZW5kOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Byb2plY3Rpb24gPSB2ZG9tXzEuZG9tLmFwcGVuZCh0aGlzLnJvb3QsIHRoaXMsIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgQXR0YWNoVHlwZS5NZXJnZTpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9qZWN0aW9uID0gdmRvbV8xLmRvbS5tZXJnZSh0aGlzLnJvb3QsIHRoaXMsIHRoaXMuX3Byb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXR0YWNoSGFuZGxlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdHNsaWJfMS5fX2RlY29yYXRlKFtcclxuICAgICAgICAgICAgYWZ0ZXJSZW5kZXJfMS5hZnRlclJlbmRlcigpLFxyXG4gICAgICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICAgICAgICAgIHRzbGliXzEuX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcclxuICAgICAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG4gICAgICAgIF0sIFByb2plY3Rvci5wcm90b3R5cGUsIFwiYWZ0ZXJSZW5kZXJcIiwgbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIFByb2plY3RvcjtcclxuICAgIH0oQmFzZSkpO1xyXG4gICAgcmV0dXJuIFByb2plY3RvcjtcclxufVxyXG5leHBvcnRzLlByb2plY3Rvck1peGluID0gUHJvamVjdG9yTWl4aW47XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFByb2plY3Rvck1peGluO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9Qcm9qZWN0b3IuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9Qcm9qZWN0b3IuanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBJbmplY3Rvcl8xID0gcmVxdWlyZShcIi4vLi4vSW5qZWN0b3JcIik7XHJcbnZhciBpbmplY3RfMSA9IHJlcXVpcmUoXCIuLy4uL2RlY29yYXRvcnMvaW5qZWN0XCIpO1xyXG52YXIgaGFuZGxlRGVjb3JhdG9yXzEgPSByZXF1aXJlKFwiLi8uLi9kZWNvcmF0b3JzL2hhbmRsZURlY29yYXRvclwiKTtcclxudmFyIGRpZmZQcm9wZXJ0eV8xID0gcmVxdWlyZShcIi4vLi4vZGVjb3JhdG9ycy9kaWZmUHJvcGVydHlcIik7XHJcbnZhciBkaWZmXzEgPSByZXF1aXJlKFwiLi8uLi9kaWZmXCIpO1xyXG52YXIgVEhFTUVfS0VZID0gJyBfa2V5JztcclxuZXhwb3J0cy5JTkpFQ1RFRF9USEVNRV9LRVkgPSBTeW1ib2woJ3RoZW1lJyk7XHJcbi8qKlxyXG4gKiBEZWNvcmF0b3IgZm9yIGJhc2UgY3NzIGNsYXNzZXNcclxuICovXHJcbmZ1bmN0aW9uIHRoZW1lKHRoZW1lKSB7XHJcbiAgICByZXR1cm4gaGFuZGxlRGVjb3JhdG9yXzEuaGFuZGxlRGVjb3JhdG9yKGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgICAgICB0YXJnZXQuYWRkRGVjb3JhdG9yKCdiYXNlVGhlbWVDbGFzc2VzJywgdGhlbWUpO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy50aGVtZSA9IHRoZW1lO1xyXG4vKipcclxuICogQ3JlYXRlcyBhIHJldmVyc2UgbG9va3VwIGZvciB0aGUgY2xhc3NlcyBwYXNzZWQgaW4gdmlhIHRoZSBgdGhlbWVgIGZ1bmN0aW9uLlxyXG4gKlxyXG4gKiBAcGFyYW0gY2xhc3NlcyBUaGUgYmFzZUNsYXNzZXMgb2JqZWN0XHJcbiAqIEByZXF1aXJlc1xyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlVGhlbWVDbGFzc2VzTG9va3VwKGNsYXNzZXMpIHtcclxuICAgIHJldHVybiBjbGFzc2VzLnJlZHVjZShmdW5jdGlvbiAoY3VycmVudENsYXNzTmFtZXMsIGJhc2VDbGFzcykge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKGJhc2VDbGFzcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDbGFzc05hbWVzW2Jhc2VDbGFzc1trZXldXSA9IGtleTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gY3VycmVudENsYXNzTmFtZXM7XHJcbiAgICB9LCB7fSk7XHJcbn1cclxuLyoqXHJcbiAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgaXMgZ2l2ZW4gYSB0aGVtZSBhbmQgYW4gb3B0aW9uYWwgcmVnaXN0cnksIHRoZSB0aGVtZVxyXG4gKiBpbmplY3RvciBpcyBkZWZpbmVkIGFnYWluc3QgdGhlIHJlZ2lzdHJ5LCByZXR1cm5pbmcgdGhlIHRoZW1lLlxyXG4gKlxyXG4gKiBAcGFyYW0gdGhlbWUgdGhlIHRoZW1lIHRvIHNldFxyXG4gKiBAcGFyYW0gdGhlbWVSZWdpc3RyeSByZWdpc3RyeSB0byBkZWZpbmUgdGhlIHRoZW1lIGluamVjdG9yIGFnYWluc3QuIERlZmF1bHRzXHJcbiAqIHRvIHRoZSBnbG9iYWwgcmVnaXN0cnlcclxuICpcclxuICogQHJldHVybnMgdGhlIHRoZW1lIGluamVjdG9yIHVzZWQgdG8gc2V0IHRoZSB0aGVtZVxyXG4gKi9cclxuZnVuY3Rpb24gcmVnaXN0ZXJUaGVtZUluamVjdG9yKHRoZW1lLCB0aGVtZVJlZ2lzdHJ5KSB7XHJcbiAgICB2YXIgdGhlbWVJbmplY3RvciA9IG5ldyBJbmplY3Rvcl8xLkluamVjdG9yKHRoZW1lKTtcclxuICAgIHRoZW1lUmVnaXN0cnkuZGVmaW5lSW5qZWN0b3IoZXhwb3J0cy5JTkpFQ1RFRF9USEVNRV9LRVksIHRoZW1lSW5qZWN0b3IpO1xyXG4gICAgcmV0dXJuIHRoZW1lSW5qZWN0b3I7XHJcbn1cclxuZXhwb3J0cy5yZWdpc3RlclRoZW1lSW5qZWN0b3IgPSByZWdpc3RlclRoZW1lSW5qZWN0b3I7XHJcbi8qKlxyXG4gKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgYSBjbGFzcyBkZWNvcmF0ZWQgd2l0aCB3aXRoIFRoZW1lZCBmdW5jdGlvbmFsaXR5XHJcbiAqL1xyXG5mdW5jdGlvbiBUaGVtZWRNaXhpbihCYXNlKSB7XHJcbiAgICB2YXIgVGhlbWVkID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIHRzbGliXzEuX19leHRlbmRzKFRoZW1lZCwgX3N1cGVyKTtcclxuICAgICAgICBmdW5jdGlvbiBUaGVtZWQoKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogUmVnaXN0ZXJlZCBiYXNlIHRoZW1lIGtleXNcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIF90aGlzLl9yZWdpc3RlcmVkQmFzZVRoZW1lS2V5cyA9IFtdO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSW5kaWNhdGVzIGlmIGNsYXNzZXMgbWV0YSBkYXRhIG5lZWQgdG8gYmUgY2FsY3VsYXRlZC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIF90aGlzLl9yZWNhbGN1bGF0ZUNsYXNzZXMgPSB0cnVlO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogTG9hZGVkIHRoZW1lXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBfdGhpcy5fdGhlbWUgPSB7fTtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBUaGVtZWQucHJvdG90eXBlLnRoZW1lID0gZnVuY3Rpb24gKGNsYXNzZXMpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlY2FsY3VsYXRlQ2xhc3Nlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjYWxjdWxhdGVUaGVtZUNsYXNzZXMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjbGFzc2VzKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzZXMubWFwKGZ1bmN0aW9uIChjbGFzc05hbWUpIHsgcmV0dXJuIF90aGlzLl9nZXRUaGVtZUNsYXNzKGNsYXNzTmFtZSk7IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9nZXRUaGVtZUNsYXNzKGNsYXNzZXMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRnVuY3Rpb24gZmlyZWQgd2hlbiBgdGhlbWVgIG9yIGBleHRyYUNsYXNzZXNgIGFyZSBjaGFuZ2VkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFRoZW1lZC5wcm90b3R5cGUub25Qcm9wZXJ0aWVzQ2hhbmdlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVjYWxjdWxhdGVDbGFzc2VzID0gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFRoZW1lZC5wcm90b3R5cGUuX2dldFRoZW1lQ2xhc3MgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgIGlmIChjbGFzc05hbWUgPT09IHVuZGVmaW5lZCB8fCBjbGFzc05hbWUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc05hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGV4dHJhQ2xhc3NlcyA9IHRoaXMucHJvcGVydGllcy5leHRyYUNsYXNzZXMgfHwge307XHJcbiAgICAgICAgICAgIHZhciB0aGVtZUNsYXNzTmFtZSA9IHRoaXMuX2Jhc2VUaGVtZUNsYXNzZXNSZXZlcnNlTG9va3VwW2NsYXNzTmFtZV07XHJcbiAgICAgICAgICAgIHZhciByZXN1bHRDbGFzc05hbWVzID0gW107XHJcbiAgICAgICAgICAgIGlmICghdGhlbWVDbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkNsYXNzIG5hbWU6ICdcIiArIGNsYXNzTmFtZSArIFwiJyBub3QgZm91bmQgaW4gdGhlbWVcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXh0cmFDbGFzc2VzW3RoZW1lQ2xhc3NOYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q2xhc3NOYW1lcy5wdXNoKGV4dHJhQ2xhc3Nlc1t0aGVtZUNsYXNzTmFtZV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl90aGVtZVt0aGVtZUNsYXNzTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdENsYXNzTmFtZXMucHVzaCh0aGlzLl90aGVtZVt0aGVtZUNsYXNzTmFtZV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q2xhc3NOYW1lcy5wdXNoKHRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWVbdGhlbWVDbGFzc05hbWVdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0Q2xhc3NOYW1lcy5qb2luKCcgJyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBUaGVtZWQucHJvdG90eXBlLl9yZWNhbGN1bGF0ZVRoZW1lQ2xhc3NlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIF9hID0gdGhpcy5wcm9wZXJ0aWVzLnRoZW1lLCB0aGVtZSA9IF9hID09PSB2b2lkIDAgPyB7fSA6IF9hO1xyXG4gICAgICAgICAgICB2YXIgYmFzZVRoZW1lcyA9IHRoaXMuZ2V0RGVjb3JhdG9yKCdiYXNlVGhlbWVDbGFzc2VzJyk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZSA9IGJhc2VUaGVtZXMucmVkdWNlKGZ1bmN0aW9uIChmaW5hbEJhc2VUaGVtZSwgYmFzZVRoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9hID0gVEhFTUVfS0VZLCBrZXkgPSBiYXNlVGhlbWVbX2FdLCBjbGFzc2VzID0gdHNsaWJfMS5fX3Jlc3QoYmFzZVRoZW1lLCBbdHlwZW9mIF9hID09PSBcInN5bWJvbFwiID8gX2EgOiBfYSArIFwiXCJdKTtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fcmVnaXN0ZXJlZEJhc2VUaGVtZUtleXMucHVzaChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0c2xpYl8xLl9fYXNzaWduKHt9LCBmaW5hbEJhc2VUaGVtZSwgY2xhc3Nlcyk7XHJcbiAgICAgICAgICAgICAgICB9LCB7fSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlVGhlbWVDbGFzc2VzUmV2ZXJzZUxvb2t1cCA9IGNyZWF0ZVRoZW1lQ2xhc3Nlc0xvb2t1cChiYXNlVGhlbWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90aGVtZSA9IHRoaXMuX3JlZ2lzdGVyZWRCYXNlVGhlbWVLZXlzLnJlZHVjZShmdW5jdGlvbiAoYmFzZVRoZW1lLCB0aGVtZUtleSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRzbGliXzEuX19hc3NpZ24oe30sIGJhc2VUaGVtZSwgdGhlbWVbdGhlbWVLZXldKTtcclxuICAgICAgICAgICAgfSwge30pO1xyXG4gICAgICAgICAgICB0aGlzLl9yZWNhbGN1bGF0ZUNsYXNzZXMgPSBmYWxzZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRzbGliXzEuX19kZWNvcmF0ZShbXHJcbiAgICAgICAgICAgIGRpZmZQcm9wZXJ0eV8xLmRpZmZQcm9wZXJ0eSgndGhlbWUnLCBkaWZmXzEuc2hhbGxvdyksXHJcbiAgICAgICAgICAgIGRpZmZQcm9wZXJ0eV8xLmRpZmZQcm9wZXJ0eSgnZXh0cmFDbGFzc2VzJywgZGlmZl8xLnNoYWxsb3cpLFxyXG4gICAgICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICAgICAgICAgIHRzbGliXzEuX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtdKSxcclxuICAgICAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG4gICAgICAgIF0sIFRoZW1lZC5wcm90b3R5cGUsIFwib25Qcm9wZXJ0aWVzQ2hhbmdlZFwiLCBudWxsKTtcclxuICAgICAgICBUaGVtZWQgPSB0c2xpYl8xLl9fZGVjb3JhdGUoW1xyXG4gICAgICAgICAgICBpbmplY3RfMS5pbmplY3Qoe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogZXhwb3J0cy5JTkpFQ1RFRF9USEVNRV9LRVksXHJcbiAgICAgICAgICAgICAgICBnZXRQcm9wZXJ0aWVzOiBmdW5jdGlvbiAodGhlbWUsIHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXByb3BlcnRpZXMudGhlbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgdGhlbWU6IHRoZW1lIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdLCBUaGVtZWQpO1xyXG4gICAgICAgIHJldHVybiBUaGVtZWQ7XHJcbiAgICB9KEJhc2UpKTtcclxuICAgIHJldHVybiBUaGVtZWQ7XHJcbn1cclxuZXhwb3J0cy5UaGVtZWRNaXhpbiA9IFRoZW1lZE1peGluO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBUaGVtZWRNaXhpbjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgV2lkZ2V0QmFzZV8xID0gcmVxdWlyZShcIi4vV2lkZ2V0QmFzZVwiKTtcclxudmFyIFByb2plY3Rvcl8xID0gcmVxdWlyZShcIi4vbWl4aW5zL1Byb2plY3RvclwiKTtcclxudmFyIGFycmF5XzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9hcnJheVwiKTtcclxudmFyIGRfMSA9IHJlcXVpcmUoXCIuL2RcIik7XHJcbnZhciBnbG9iYWxfMSA9IHJlcXVpcmUoXCJAZG9qby9zaGltL2dsb2JhbFwiKTtcclxudmFyIFJlZ2lzdHJ5XzEgPSByZXF1aXJlKFwiLi9SZWdpc3RyeVwiKTtcclxudmFyIFRoZW1lZF8xID0gcmVxdWlyZShcIi4vbWl4aW5zL1RoZW1lZFwiKTtcclxudmFyIGFsd2F5c1JlbmRlcl8xID0gcmVxdWlyZShcIi4vZGVjb3JhdG9ycy9hbHdheXNSZW5kZXJcIik7XHJcbnZhciBDdXN0b21FbGVtZW50Q2hpbGRUeXBlO1xyXG4oZnVuY3Rpb24gKEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUpIHtcclxuICAgIEN1c3RvbUVsZW1lbnRDaGlsZFR5cGVbXCJET0pPXCJdID0gXCJET0pPXCI7XHJcbiAgICBDdXN0b21FbGVtZW50Q2hpbGRUeXBlW1wiTk9ERVwiXSA9IFwiTk9ERVwiO1xyXG4gICAgQ3VzdG9tRWxlbWVudENoaWxkVHlwZVtcIlRFWFRcIl0gPSBcIlRFWFRcIjtcclxufSkoQ3VzdG9tRWxlbWVudENoaWxkVHlwZSA9IGV4cG9ydHMuQ3VzdG9tRWxlbWVudENoaWxkVHlwZSB8fCAoZXhwb3J0cy5DdXN0b21FbGVtZW50Q2hpbGRUeXBlID0ge30pKTtcclxuZnVuY3Rpb24gRG9tVG9XaWRnZXRXcmFwcGVyKGRvbU5vZGUpIHtcclxuICAgIHZhciBEb21Ub1dpZGdldFdyYXBwZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgdHNsaWJfMS5fX2V4dGVuZHMoRG9tVG9XaWRnZXRXcmFwcGVyLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIERvbVRvV2lkZ2V0V3JhcHBlcigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBEb21Ub1dpZGdldFdyYXBwZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyh0aGlzLnByb3BlcnRpZXMpLnJlZHVjZShmdW5jdGlvbiAocHJvcHMsIGtleSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gX3RoaXMucHJvcGVydGllc1trZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleS5pbmRleE9mKCdvbicpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gXCJfX1wiICsga2V5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJvcHNba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BzO1xyXG4gICAgICAgICAgICB9LCB7fSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkXzEuZG9tKHsgbm9kZTogZG9tTm9kZSwgcHJvcHM6IHByb3BlcnRpZXMsIGRpZmZUeXBlOiAnZG9tJyB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShEb21Ub1dpZGdldFdyYXBwZXIsIFwiZG9tTm9kZVwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvbU5vZGU7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIERvbVRvV2lkZ2V0V3JhcHBlciA9IHRzbGliXzEuX19kZWNvcmF0ZShbXHJcbiAgICAgICAgICAgIGFsd2F5c1JlbmRlcl8xLmFsd2F5c1JlbmRlcigpXHJcbiAgICAgICAgXSwgRG9tVG9XaWRnZXRXcmFwcGVyKTtcclxuICAgICAgICByZXR1cm4gRG9tVG9XaWRnZXRXcmFwcGVyO1xyXG4gICAgfShXaWRnZXRCYXNlXzEuV2lkZ2V0QmFzZSkpO1xyXG4gICAgcmV0dXJuIERvbVRvV2lkZ2V0V3JhcHBlcjtcclxufVxyXG5leHBvcnRzLkRvbVRvV2lkZ2V0V3JhcHBlciA9IERvbVRvV2lkZ2V0V3JhcHBlcjtcclxuZnVuY3Rpb24gY3JlYXRlKGRlc2NyaXB0b3IsIFdpZGdldENvbnN0cnVjdG9yKSB7XHJcbiAgICB2YXIgYXR0cmlidXRlcyA9IGRlc2NyaXB0b3IuYXR0cmlidXRlcywgY2hpbGRUeXBlID0gZGVzY3JpcHRvci5jaGlsZFR5cGU7XHJcbiAgICB2YXIgYXR0cmlidXRlTWFwID0ge307XHJcbiAgICBhdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgIHZhciBhdHRyaWJ1dGVOYW1lID0gcHJvcGVydHlOYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgYXR0cmlidXRlTWFwW2F0dHJpYnV0ZU5hbWVdID0gcHJvcGVydHlOYW1lO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIHRzbGliXzEuX19leHRlbmRzKGNsYXNzXzEsIF9zdXBlcik7XHJcbiAgICAgICAgZnVuY3Rpb24gY2xhc3NfMSgpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0aWVzID0ge307XHJcbiAgICAgICAgICAgIF90aGlzLl9jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgICAgICBfdGhpcy5fZXZlbnRQcm9wZXJ0aWVzID0ge307XHJcbiAgICAgICAgICAgIF90aGlzLl9pbml0aWFsaXNlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNsYXNzXzEucHJvdG90eXBlLmNvbm5lY3RlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5faW5pdGlhbGlzZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZG9tUHJvcGVydGllcyA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IGRlc2NyaXB0b3IuYXR0cmlidXRlcywgcHJvcGVydGllcyA9IGRlc2NyaXB0b3IucHJvcGVydGllcywgZXZlbnRzID0gZGVzY3JpcHRvci5ldmVudHM7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSB0c2xpYl8xLl9fYXNzaWduKHt9LCB0aGlzLl9wcm9wZXJ0aWVzLCB0aGlzLl9hdHRyaWJ1dGVzVG9Qcm9wZXJ0aWVzKGF0dHJpYnV0ZXMpKTtcclxuICAgICAgICAgICAgdHNsaWJfMS5fX3NwcmVhZChhdHRyaWJ1dGVzLCBwcm9wZXJ0aWVzKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IF90aGlzW3Byb3BlcnR5TmFtZV07XHJcbiAgICAgICAgICAgICAgICB2YXIgZmlsdGVyZWRQcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUucmVwbGFjZSgvXm9uLywgJ19fJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRvbVByb3BlcnRpZXNbZmlsdGVyZWRQcm9wZXJ0eU5hbWVdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuX2dldFByb3BlcnR5KHByb3BlcnR5TmFtZSk7IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIF90aGlzLl9zZXRQcm9wZXJ0eShwcm9wZXJ0eU5hbWUsIHZhbHVlKTsgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBldmVudE5hbWUgPSBwcm9wZXJ0eU5hbWUucmVwbGFjZSgvXm9uLywgJycpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmlsdGVyZWRQcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUucmVwbGFjZSgvXm9uLywgJ19fb24nKTtcclxuICAgICAgICAgICAgICAgIGRvbVByb3BlcnRpZXNbZmlsdGVyZWRQcm9wZXJ0eU5hbWVdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuX2dldEV2ZW50UHJvcGVydHkocHJvcGVydHlOYW1lKTsgfSxcclxuICAgICAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gX3RoaXMuX3NldEV2ZW50UHJvcGVydHkocHJvcGVydHlOYW1lLCB2YWx1ZSk7IH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fZXZlbnRQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IF90aGlzLl9nZXRFdmVudFByb3BlcnR5KHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudENhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50Q2FsbGJhY2suYXBwbHkodm9pZCAwLCB0c2xpYl8xLl9fc3ByZWFkKGFyZ3MpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IGFyZ3NcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywgZG9tUHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IGNoaWxkVHlwZSA9PT0gQ3VzdG9tRWxlbWVudENoaWxkVHlwZS5URVhUID8gdGhpcy5jaGlsZE5vZGVzIDogdGhpcy5jaGlsZHJlbjtcclxuICAgICAgICAgICAgYXJyYXlfMS5mcm9tKGNoaWxkcmVuKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZFR5cGUgPT09IEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUuRE9KTykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTm9kZS5hZGRFdmVudExpc3RlbmVyKCdkb2pvLWNlLXJlbmRlcicsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLl9yZW5kZXIoKTsgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGROb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2Rvam8tY2UtY29ubmVjdGVkJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuX3JlbmRlcigpOyB9KTtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fY2hpbGRyZW4ucHVzaChEb21Ub1dpZGdldFdyYXBwZXIoY2hpbGROb2RlKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fY2hpbGRyZW4ucHVzaChkXzEuZG9tKHsgbm9kZTogY2hpbGROb2RlLCBkaWZmVHlwZTogJ2RvbScgfSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdkb2pvLWNlLWNvbm5lY3RlZCcsIGZ1bmN0aW9uIChlKSB7IHJldHVybiBfdGhpcy5fY2hpbGRDb25uZWN0ZWQoZSk7IH0pO1xyXG4gICAgICAgICAgICB2YXIgd2lkZ2V0UHJvcGVydGllcyA9IHRoaXMuX3Byb3BlcnRpZXM7XHJcbiAgICAgICAgICAgIHZhciByZW5kZXJDaGlsZHJlbiA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLl9fY2hpbGRyZW5fXygpOyB9O1xyXG4gICAgICAgICAgICB2YXIgV3JhcHBlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICAgICAgICAgIHRzbGliXzEuX19leHRlbmRzKGNsYXNzXzIsIF9zdXBlcik7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBjbGFzc18yKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNsYXNzXzIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZF8xLncoV2lkZ2V0Q29uc3RydWN0b3IsIHdpZGdldFByb3BlcnRpZXMsIHJlbmRlckNoaWxkcmVuKCkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc18yO1xyXG4gICAgICAgICAgICB9KFdpZGdldEJhc2VfMS5XaWRnZXRCYXNlKSk7XHJcbiAgICAgICAgICAgIHZhciByZWdpc3RyeSA9IG5ldyBSZWdpc3RyeV8xLmRlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIHRoZW1lQ29udGV4dCA9IFRoZW1lZF8xLnJlZ2lzdGVyVGhlbWVJbmplY3Rvcih0aGlzLl9nZXRUaGVtZSgpLCByZWdpc3RyeSk7XHJcbiAgICAgICAgICAgIGdsb2JhbF8xLmRlZmF1bHQuYWRkRXZlbnRMaXN0ZW5lcignZG9qby10aGVtZS1zZXQnLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGVtZUNvbnRleHQuc2V0KF90aGlzLl9nZXRUaGVtZSgpKTsgfSk7XHJcbiAgICAgICAgICAgIHZhciBQcm9qZWN0b3IgPSBQcm9qZWN0b3JfMS5Qcm9qZWN0b3JNaXhpbihXcmFwcGVyKTtcclxuICAgICAgICAgICAgdGhpcy5fcHJvamVjdG9yID0gbmV3IFByb2plY3RvcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9qZWN0b3Iuc2V0UHJvcGVydGllcyh7IHJlZ2lzdHJ5OiByZWdpc3RyeSB9KTtcclxuICAgICAgICAgICAgdGhpcy5fcHJvamVjdG9yLmFwcGVuZCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5faW5pdGlhbGlzZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdkb2pvLWNlLWNvbm5lY3RlZCcsIHtcclxuICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHRoaXNcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NfMS5wcm90b3R5cGUuX2dldFRoZW1lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoZ2xvYmFsXzEuZGVmYXVsdCAmJiBnbG9iYWxfMS5kZWZhdWx0LmRvam9jZSAmJiBnbG9iYWxfMS5kZWZhdWx0LmRvam9jZS50aGVtZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdsb2JhbF8xLmRlZmF1bHQuZG9qb2NlLnRoZW1lc1tnbG9iYWxfMS5kZWZhdWx0LmRvam9jZS50aGVtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGNsYXNzXzEucHJvdG90eXBlLl9jaGlsZENvbm5lY3RlZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBub2RlID0gZS5kZXRhaWw7XHJcbiAgICAgICAgICAgIGlmIChub2RlLnBhcmVudE5vZGUgPT09IHRoaXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBleGlzdHMgPSB0aGlzLl9jaGlsZHJlbi5zb21lKGZ1bmN0aW9uIChjaGlsZCkgeyByZXR1cm4gY2hpbGQuZG9tTm9kZSA9PT0gbm9kZTsgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWV4aXN0cykge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignZG9qby1jZS1yZW5kZXInLCBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5fcmVuZGVyKCk7IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuLnB1c2goRG9tVG9XaWRnZXRXcmFwcGVyKG5vZGUpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NfMS5wcm90b3R5cGUuX3JlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Byb2plY3Rvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvamVjdG9yLmludmFsaWRhdGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2Rvam8tY2UtcmVuZGVyJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogdGhpc1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjbGFzc18xLnByb3RvdHlwZS5fX3Byb3BlcnRpZXNfXyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRzbGliXzEuX19hc3NpZ24oe30sIHRoaXMuX3Byb3BlcnRpZXMsIHRoaXMuX2V2ZW50UHJvcGVydGllcyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjbGFzc18xLnByb3RvdHlwZS5fX2NoaWxkcmVuX18gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZFR5cGUgPT09IEN1c3RvbUVsZW1lbnRDaGlsZFR5cGUuRE9KTykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuLmZpbHRlcihmdW5jdGlvbiAoQ2hpbGQpIHsgcmV0dXJuIENoaWxkLmRvbU5vZGUuaXNXaWRnZXQ7IH0pLm1hcChmdW5jdGlvbiAoQ2hpbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZG9tTm9kZSA9IENoaWxkLmRvbU5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRfMS53KENoaWxkLCB0c2xpYl8xLl9fYXNzaWduKHt9LCBkb21Ob2RlLl9fcHJvcGVydGllc19fKCkpLCB0c2xpYl8xLl9fc3ByZWFkKGRvbU5vZGUuX19jaGlsZHJlbl9fKCkpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjbGFzc18xLnByb3RvdHlwZS5hdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAobmFtZSwgb2xkVmFsdWUsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBhdHRyaWJ1dGVNYXBbbmFtZV07XHJcbiAgICAgICAgICAgIHRoaXMuX3NldFByb3BlcnR5KHByb3BlcnR5TmFtZSwgdmFsdWUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NfMS5wcm90b3R5cGUuX3NldEV2ZW50UHJvcGVydHkgPSBmdW5jdGlvbiAocHJvcGVydHlOYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudFByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2xhc3NfMS5wcm90b3R5cGUuX2dldEV2ZW50UHJvcGVydHkgPSBmdW5jdGlvbiAocHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ldmVudFByb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNsYXNzXzEucHJvdG90eXBlLl9zZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXIoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNsYXNzXzEucHJvdG90eXBlLl9nZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNsYXNzXzEucHJvdG90eXBlLl9hdHRyaWJ1dGVzVG9Qcm9wZXJ0aWVzID0gZnVuY3Rpb24gKGF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXMucmVkdWNlKGZ1bmN0aW9uIChwcm9wZXJ0aWVzLCBwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVOYW1lID0gcHJvcGVydHlOYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBfdGhpcy5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICB9LCB7fSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2xhc3NfMSwgXCJvYnNlcnZlZEF0dHJpYnV0ZXNcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhhdHRyaWJ1dGVNYXApO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2xhc3NfMS5wcm90b3R5cGUsIFwiaXNXaWRnZXRcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gY2xhc3NfMTtcclxuICAgIH0oSFRNTEVsZW1lbnQpKTtcclxufVxyXG5leHBvcnRzLmNyZWF0ZSA9IGNyZWF0ZTtcclxuZnVuY3Rpb24gcmVnaXN0ZXIoV2lkZ2V0Q29uc3RydWN0b3IpIHtcclxuICAgIHZhciBkZXNjcmlwdG9yID0gV2lkZ2V0Q29uc3RydWN0b3IucHJvdG90eXBlICYmIFdpZGdldENvbnN0cnVjdG9yLnByb3RvdHlwZS5fX2N1c3RvbUVsZW1lbnREZXNjcmlwdG9yO1xyXG4gICAgaWYgKCFkZXNjcmlwdG9yKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZ2V0IGRlc2NyaXB0b3IgZm9yIEN1c3RvbSBFbGVtZW50LCBoYXZlIHlvdSBhZGRlZCB0aGUgQGN1c3RvbUVsZW1lbnQgZGVjb3JhdG9yIHRvIHlvdXIgV2lkZ2V0PycpO1xyXG4gICAgfVxyXG4gICAgZ2xvYmFsXzEuZGVmYXVsdC5jdXN0b21FbGVtZW50cy5kZWZpbmUoZGVzY3JpcHRvci50YWdOYW1lLCBjcmVhdGUoZGVzY3JpcHRvciwgV2lkZ2V0Q29uc3RydWN0b3IpKTtcclxufVxyXG5leHBvcnRzLnJlZ2lzdGVyID0gcmVnaXN0ZXI7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IHJlZ2lzdGVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldC1jb3JlL3JlZ2lzdGVyQ3VzdG9tRWxlbWVudC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0LWNvcmUvcmVnaXN0ZXJDdXN0b21FbGVtZW50LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgZ2xvYmFsXzEgPSByZXF1aXJlKFwiQGRvam8vc2hpbS9nbG9iYWxcIik7XHJcbnZhciBhcnJheV8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vYXJyYXlcIik7XHJcbnZhciBkXzEgPSByZXF1aXJlKFwiLi9kXCIpO1xyXG52YXIgUmVnaXN0cnlfMSA9IHJlcXVpcmUoXCIuL1JlZ2lzdHJ5XCIpO1xyXG52YXIgV2Vha01hcF8xID0gcmVxdWlyZShcIkBkb2pvL3NoaW0vV2Vha01hcFwiKTtcclxudmFyIE5BTUVTUEFDRV9XMyA9ICdodHRwOi8vd3d3LnczLm9yZy8nO1xyXG52YXIgTkFNRVNQQUNFX1NWRyA9IE5BTUVTUEFDRV9XMyArICcyMDAwL3N2Zyc7XHJcbnZhciBOQU1FU1BBQ0VfWExJTksgPSBOQU1FU1BBQ0VfVzMgKyAnMTk5OS94bGluayc7XHJcbnZhciBlbXB0eUFycmF5ID0gW107XHJcbmV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAgPSBuZXcgV2Vha01hcF8xLmRlZmF1bHQoKTtcclxudmFyIGluc3RhbmNlTWFwID0gbmV3IFdlYWtNYXBfMS5kZWZhdWx0KCk7XHJcbnZhciBwcm9qZWN0b3JTdGF0ZU1hcCA9IG5ldyBXZWFrTWFwXzEuZGVmYXVsdCgpO1xyXG5mdW5jdGlvbiBzYW1lKGRub2RlMSwgZG5vZGUyKSB7XHJcbiAgICBpZiAoZF8xLmlzVk5vZGUoZG5vZGUxKSAmJiBkXzEuaXNWTm9kZShkbm9kZTIpKSB7XHJcbiAgICAgICAgaWYgKGRub2RlMS50YWcgIT09IGRub2RlMi50YWcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZG5vZGUxLnByb3BlcnRpZXMua2V5ICE9PSBkbm9kZTIucHJvcGVydGllcy5rZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGRfMS5pc1dOb2RlKGRub2RlMSkgJiYgZF8xLmlzV05vZGUoZG5vZGUyKSkge1xyXG4gICAgICAgIGlmIChkbm9kZTEuaW5zdGFuY2UgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZG5vZGUyLndpZGdldENvbnN0cnVjdG9yID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkbm9kZTEud2lkZ2V0Q29uc3RydWN0b3IgIT09IGRub2RlMi53aWRnZXRDb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkbm9kZTEucHJvcGVydGllcy5rZXkgIT09IGRub2RlMi5wcm9wZXJ0aWVzLmtleSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcbnZhciBtaXNzaW5nVHJhbnNpdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignUHJvdmlkZSBhIHRyYW5zaXRpb25zIG9iamVjdCB0byB0aGUgcHJvamVjdGlvbk9wdGlvbnMgdG8gZG8gYW5pbWF0aW9ucycpO1xyXG59O1xyXG5mdW5jdGlvbiBnZXRQcm9qZWN0aW9uT3B0aW9ucyhwcm9qZWN0b3JPcHRpb25zLCBwcm9qZWN0b3JJbnN0YW5jZSkge1xyXG4gICAgdmFyIGRlZmF1bHRzID0ge1xyXG4gICAgICAgIG5hbWVzcGFjZTogdW5kZWZpbmVkLFxyXG4gICAgICAgIHN0eWxlQXBwbHllcjogZnVuY3Rpb24gKGRvbU5vZGUsIHN0eWxlTmFtZSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgZG9tTm9kZS5zdHlsZVtzdHlsZU5hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB0cmFuc2l0aW9uczoge1xyXG4gICAgICAgICAgICBlbnRlcjogbWlzc2luZ1RyYW5zaXRpb24sXHJcbiAgICAgICAgICAgIGV4aXQ6IG1pc3NpbmdUcmFuc2l0aW9uXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZXB0aDogMCxcclxuICAgICAgICBtZXJnZTogZmFsc2UsXHJcbiAgICAgICAgc3luYzogZmFsc2UsXHJcbiAgICAgICAgcHJvamVjdG9ySW5zdGFuY2U6IHByb2plY3Rvckluc3RhbmNlXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHRzbGliXzEuX19hc3NpZ24oe30sIGRlZmF1bHRzLCBwcm9qZWN0b3JPcHRpb25zKTtcclxufVxyXG5mdW5jdGlvbiBjaGVja1N0eWxlVmFsdWUoc3R5bGVWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU3R5bGUgdmFsdWVzIG11c3QgYmUgc3RyaW5ncycpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZUV2ZW50KGRvbU5vZGUsIGV2ZW50TmFtZSwgY3VycmVudFZhbHVlLCBwcm9qZWN0aW9uT3B0aW9ucywgYmluZCwgcHJldmlvdXNWYWx1ZSkge1xyXG4gICAgdmFyIHByb2plY3RvclN0YXRlID0gcHJvamVjdG9yU3RhdGVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgIHZhciBldmVudE1hcCA9IHByb2plY3RvclN0YXRlLm5vZGVNYXAuZ2V0KGRvbU5vZGUpIHx8IG5ldyBXZWFrTWFwXzEuZGVmYXVsdCgpO1xyXG4gICAgaWYgKHByZXZpb3VzVmFsdWUpIHtcclxuICAgICAgICB2YXIgcHJldmlvdXNFdmVudCA9IGV2ZW50TWFwLmdldChwcmV2aW91c1ZhbHVlKTtcclxuICAgICAgICBkb21Ob2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBwcmV2aW91c0V2ZW50KTtcclxuICAgIH1cclxuICAgIHZhciBjYWxsYmFjayA9IGN1cnJlbnRWYWx1ZS5iaW5kKGJpbmQpO1xyXG4gICAgaWYgKGV2ZW50TmFtZSA9PT0gJ2lucHV0Jykge1xyXG4gICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAgICAgICBjdXJyZW50VmFsdWUuY2FsbCh0aGlzLCBldnQpO1xyXG4gICAgICAgICAgICBldnQudGFyZ2V0WydvbmlucHV0LXZhbHVlJ10gPSBldnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgIH0uYmluZChiaW5kKTtcclxuICAgIH1cclxuICAgIGRvbU5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGNhbGxiYWNrKTtcclxuICAgIGV2ZW50TWFwLnNldChjdXJyZW50VmFsdWUsIGNhbGxiYWNrKTtcclxuICAgIHByb2plY3RvclN0YXRlLm5vZGVNYXAuc2V0KGRvbU5vZGUsIGV2ZW50TWFwKTtcclxufVxyXG5mdW5jdGlvbiBhZGRDbGFzc2VzKGRvbU5vZGUsIGNsYXNzZXMpIHtcclxuICAgIGlmIChjbGFzc2VzKSB7XHJcbiAgICAgICAgdmFyIGNsYXNzTmFtZXMgPSBjbGFzc2VzLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc05hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGRvbU5vZGUuY2xhc3NMaXN0LmFkZChjbGFzc05hbWVzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gcmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBjbGFzc2VzKSB7XHJcbiAgICBpZiAoY2xhc3Nlcykge1xyXG4gICAgICAgIHZhciBjbGFzc05hbWVzID0gY2xhc3Nlcy5zcGxpdCgnICcpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3NOYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBkb21Ob2RlLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGJ1aWxkUHJldmlvdXNQcm9wZXJ0aWVzKGRvbU5vZGUsIHByZXZpb3VzLCBjdXJyZW50KSB7XHJcbiAgICB2YXIgZGlmZlR5cGUgPSBjdXJyZW50LmRpZmZUeXBlLCBwcm9wZXJ0aWVzID0gY3VycmVudC5wcm9wZXJ0aWVzLCBhdHRyaWJ1dGVzID0gY3VycmVudC5hdHRyaWJ1dGVzO1xyXG4gICAgaWYgKCFkaWZmVHlwZSB8fCBkaWZmVHlwZSA9PT0gJ3Zkb20nKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgcHJvcGVydGllczogcHJldmlvdXMucHJvcGVydGllcywgYXR0cmlidXRlczogcHJldmlvdXMuYXR0cmlidXRlcywgZXZlbnRzOiBwcmV2aW91cy5ldmVudHMgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGRpZmZUeXBlID09PSAnbm9uZScpIHtcclxuICAgICAgICByZXR1cm4geyBwcm9wZXJ0aWVzOiB7fSwgYXR0cmlidXRlczogcHJldmlvdXMuYXR0cmlidXRlcyA/IHt9IDogdW5kZWZpbmVkLCBldmVudHM6IHByZXZpb3VzLmV2ZW50cyB9O1xyXG4gICAgfVxyXG4gICAgdmFyIG5ld1Byb3BlcnRpZXMgPSB7XHJcbiAgICAgICAgcHJvcGVydGllczoge31cclxuICAgIH07XHJcbiAgICBpZiAoYXR0cmlidXRlcykge1xyXG4gICAgICAgIG5ld1Byb3BlcnRpZXMuYXR0cmlidXRlcyA9IHt9O1xyXG4gICAgICAgIG5ld1Byb3BlcnRpZXMuZXZlbnRzID0gcHJldmlvdXMuZXZlbnRzO1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHByb3BlcnRpZXMpLmZvckVhY2goZnVuY3Rpb24gKHByb3BOYW1lKSB7XHJcbiAgICAgICAgICAgIG5ld1Byb3BlcnRpZXMucHJvcGVydGllc1twcm9wTmFtZV0gPSBkb21Ob2RlW3Byb3BOYW1lXTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyTmFtZSkge1xyXG4gICAgICAgICAgICBuZXdQcm9wZXJ0aWVzLmF0dHJpYnV0ZXNbYXR0ck5hbWVdID0gZG9tTm9kZS5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBuZXdQcm9wZXJ0aWVzO1xyXG4gICAgfVxyXG4gICAgbmV3UHJvcGVydGllcy5wcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMocHJvcGVydGllcykucmVkdWNlKGZ1bmN0aW9uIChwcm9wcywgcHJvcGVydHkpIHtcclxuICAgICAgICBwcm9wc1twcm9wZXJ0eV0gPSBkb21Ob2RlLmdldEF0dHJpYnV0ZShwcm9wZXJ0eSkgfHwgZG9tTm9kZVtwcm9wZXJ0eV07XHJcbiAgICAgICAgcmV0dXJuIHByb3BzO1xyXG4gICAgfSwge30pO1xyXG4gICAgcmV0dXJuIG5ld1Byb3BlcnRpZXM7XHJcbn1cclxuZnVuY3Rpb24gZm9jdXNOb2RlKHByb3BWYWx1ZSwgcHJldmlvdXNWYWx1ZSwgZG9tTm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIHZhciByZXN1bHQ7XHJcbiAgICBpZiAodHlwZW9mIHByb3BWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJlc3VsdCA9IHByb3BWYWx1ZSgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gcHJvcFZhbHVlICYmICFwcmV2aW91c1ZhbHVlO1xyXG4gICAgfVxyXG4gICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHZhciBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICAgICAgcHJvamVjdG9yU3RhdGUuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRvbU5vZGUuZm9jdXMoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiByZW1vdmVPcnBoYW5lZEV2ZW50cyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zLCBvbmx5RXZlbnRzKSB7XHJcbiAgICBpZiAob25seUV2ZW50cyA9PT0gdm9pZCAwKSB7IG9ubHlFdmVudHMgPSBmYWxzZTsgfVxyXG4gICAgdmFyIHByb2plY3RvclN0YXRlID0gcHJvamVjdG9yU3RhdGVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgIHZhciBldmVudE1hcCA9IHByb2plY3RvclN0YXRlLm5vZGVNYXAuZ2V0KGRvbU5vZGUpO1xyXG4gICAgaWYgKGV2ZW50TWFwKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMocHJldmlvdXNQcm9wZXJ0aWVzKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wTmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgaXNFdmVudCA9IHByb3BOYW1lLnN1YnN0cigwLCAyKSA9PT0gJ29uJyB8fCBvbmx5RXZlbnRzO1xyXG4gICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gb25seUV2ZW50cyA/IHByb3BOYW1lIDogcHJvcE5hbWUuc3Vic3RyKDIpO1xyXG4gICAgICAgICAgICBpZiAoaXNFdmVudCAmJiAhcHJvcGVydGllc1twcm9wTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBldmVudENhbGxiYWNrID0gZXZlbnRNYXAuZ2V0KHByZXZpb3VzUHJvcGVydGllc1twcm9wTmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50Q2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBldmVudENhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZUF0dHJpYnV0ZShkb21Ob2RlLCBhdHRyTmFtZSwgYXR0clZhbHVlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgaWYgKHByb2plY3Rpb25PcHRpb25zLm5hbWVzcGFjZSA9PT0gTkFNRVNQQUNFX1NWRyAmJiBhdHRyTmFtZSA9PT0gJ2hyZWYnKSB7XHJcbiAgICAgICAgZG9tTm9kZS5zZXRBdHRyaWJ1dGVOUyhOQU1FU1BBQ0VfWExJTkssIGF0dHJOYW1lLCBhdHRyVmFsdWUpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoKGF0dHJOYW1lID09PSAncm9sZScgJiYgYXR0clZhbHVlID09PSAnJykgfHwgYXR0clZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBkb21Ob2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkb21Ob2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB1cGRhdGVBdHRyaWJ1dGVzKGRvbU5vZGUsIHByZXZpb3VzQXR0cmlidXRlcywgYXR0cmlidXRlcywgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIHZhciBhdHRyTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKTtcclxuICAgIHZhciBhdHRyQ291bnQgPSBhdHRyTmFtZXMubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdHRyQ291bnQ7IGkrKykge1xyXG4gICAgICAgIHZhciBhdHRyTmFtZSA9IGF0dHJOYW1lc1tpXTtcclxuICAgICAgICB2YXIgYXR0clZhbHVlID0gYXR0cmlidXRlc1thdHRyTmFtZV07XHJcbiAgICAgICAgdmFyIHByZXZpb3VzQXR0clZhbHVlID0gcHJldmlvdXNBdHRyaWJ1dGVzW2F0dHJOYW1lXTtcclxuICAgICAgICBpZiAoYXR0clZhbHVlICE9PSBwcmV2aW91c0F0dHJWYWx1ZSkge1xyXG4gICAgICAgICAgICB1cGRhdGVBdHRyaWJ1dGUoZG9tTm9kZSwgYXR0ck5hbWUsIGF0dHJWYWx1ZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB1cGRhdGVQcm9wZXJ0aWVzKGRvbU5vZGUsIHByZXZpb3VzUHJvcGVydGllcywgcHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMsIGluY2x1ZGVzRXZlbnRzQW5kQXR0cmlidXRlcykge1xyXG4gICAgaWYgKGluY2x1ZGVzRXZlbnRzQW5kQXR0cmlidXRlcyA9PT0gdm9pZCAwKSB7IGluY2x1ZGVzRXZlbnRzQW5kQXR0cmlidXRlcyA9IHRydWU7IH1cclxuICAgIHZhciBwcm9wZXJ0aWVzVXBkYXRlZCA9IGZhbHNlO1xyXG4gICAgdmFyIHByb3BOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xyXG4gICAgdmFyIHByb3BDb3VudCA9IHByb3BOYW1lcy5sZW5ndGg7XHJcbiAgICBpZiAocHJvcE5hbWVzLmluZGV4T2YoJ2NsYXNzZXMnKSA9PT0gLTEgJiYgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMpIHtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3NlcykpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMuY2xhc3Nlc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLmNsYXNzZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGluY2x1ZGVzRXZlbnRzQW5kQXR0cmlidXRlcyAmJiByZW1vdmVPcnBoYW5lZEV2ZW50cyhkb21Ob2RlLCBwcmV2aW91c1Byb3BlcnRpZXMsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcENvdW50OyBpKyspIHtcclxuICAgICAgICB2YXIgcHJvcE5hbWUgPSBwcm9wTmFtZXNbaV07XHJcbiAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BlcnRpZXNbcHJvcE5hbWVdO1xyXG4gICAgICAgIHZhciBwcmV2aW91c1ZhbHVlID0gcHJldmlvdXNQcm9wZXJ0aWVzW3Byb3BOYW1lXTtcclxuICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdjbGFzc2VzJykge1xyXG4gICAgICAgICAgICB2YXIgcHJldmlvdXNDbGFzc2VzID0gQXJyYXkuaXNBcnJheShwcmV2aW91c1ZhbHVlKSA/IHByZXZpb3VzVmFsdWUgOiBbcHJldmlvdXNWYWx1ZV07XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q2xhc3NlcyA9IEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSA/IHByb3BWYWx1ZSA6IFtwcm9wVmFsdWVdO1xyXG4gICAgICAgICAgICBpZiAocHJldmlvdXNDbGFzc2VzICYmIHByZXZpb3VzQ2xhc3Nlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXByb3BWYWx1ZSB8fCBwcm9wVmFsdWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaV8xID0gMDsgaV8xIDwgcHJldmlvdXNDbGFzc2VzLmxlbmd0aDsgaV8xKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3Nlcyhkb21Ob2RlLCBwcmV2aW91c0NsYXNzZXNbaV8xXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0NsYXNzZXMgPSB0c2xpYl8xLl9fc3ByZWFkKGN1cnJlbnRDbGFzc2VzKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpXzIgPSAwOyBpXzIgPCBwcmV2aW91c0NsYXNzZXMubGVuZ3RoOyBpXzIrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJldmlvdXNDbGFzc05hbWUgPSBwcmV2aW91c0NsYXNzZXNbaV8yXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzQ2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xhc3NJbmRleCA9IG5ld0NsYXNzZXMuaW5kZXhPZihwcmV2aW91c0NsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2xhc3NJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVDbGFzc2VzKGRvbU5vZGUsIHByZXZpb3VzQ2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NsYXNzZXMuc3BsaWNlKGNsYXNzSW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGlfMyA9IDA7IGlfMyA8IG5ld0NsYXNzZXMubGVuZ3RoOyBpXzMrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRDbGFzc2VzKGRvbU5vZGUsIG5ld0NsYXNzZXNbaV8zXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaV80ID0gMDsgaV80IDwgY3VycmVudENsYXNzZXMubGVuZ3RoOyBpXzQrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkZENsYXNzZXMoZG9tTm9kZSwgY3VycmVudENsYXNzZXNbaV80XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocHJvcE5hbWUgPT09ICdmb2N1cycpIHtcclxuICAgICAgICAgICAgZm9jdXNOb2RlKHByb3BWYWx1ZSwgcHJldmlvdXNWYWx1ZSwgZG9tTm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ3N0eWxlcycpIHtcclxuICAgICAgICAgICAgdmFyIHN0eWxlTmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wVmFsdWUpO1xyXG4gICAgICAgICAgICB2YXIgc3R5bGVDb3VudCA9IHN0eWxlTmFtZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHN0eWxlQ291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0eWxlTmFtZSA9IHN0eWxlTmFtZXNbal07XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3U3R5bGVWYWx1ZSA9IHByb3BWYWx1ZVtzdHlsZU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZFN0eWxlVmFsdWUgPSBwcmV2aW91c1ZhbHVlICYmIHByZXZpb3VzVmFsdWVbc3R5bGVOYW1lXTtcclxuICAgICAgICAgICAgICAgIGlmIChuZXdTdHlsZVZhbHVlID09PSBvbGRTdHlsZVZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzVXBkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpZiAobmV3U3R5bGVWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrU3R5bGVWYWx1ZShuZXdTdHlsZVZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5zdHlsZUFwcGx5ZXIoZG9tTm9kZSwgc3R5bGVOYW1lLCBuZXdTdHlsZVZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zLnN0eWxlQXBwbHllcihkb21Ob2RlLCBzdHlsZU5hbWUsICcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFwcm9wVmFsdWUgJiYgdHlwZW9mIHByZXZpb3VzVmFsdWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wVmFsdWUgPSAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcE5hbWUgPT09ICd2YWx1ZScpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkb21WYWx1ZSA9IGRvbU5vZGVbcHJvcE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRvbVZhbHVlICE9PSBwcm9wVmFsdWUgJiZcclxuICAgICAgICAgICAgICAgICAgICAoZG9tTm9kZVsnb25pbnB1dC12YWx1ZSddXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gZG9tVmFsdWUgPT09IGRvbU5vZGVbJ29uaW5wdXQtdmFsdWUnXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHByb3BWYWx1ZSAhPT0gcHJldmlvdXNWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlW3Byb3BOYW1lXSA9IHByb3BWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlWydvbmlucHV0LXZhbHVlJ10gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcFZhbHVlICE9PSBwcmV2aW91c1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc1VwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHByb3BOYW1lICE9PSAna2V5JyAmJiBwcm9wVmFsdWUgIT09IHByZXZpb3VzVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0eXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnZnVuY3Rpb24nICYmIHByb3BOYW1lLmxhc3RJbmRleE9mKCdvbicsIDApID09PSAwICYmIGluY2x1ZGVzRXZlbnRzQW5kQXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUV2ZW50KGRvbU5vZGUsIHByb3BOYW1lLnN1YnN0cigyKSwgcHJvcFZhbHVlLCBwcm9qZWN0aW9uT3B0aW9ucywgcHJvcGVydGllcy5iaW5kLCBwcmV2aW91c1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnICYmIHByb3BOYW1lICE9PSAnaW5uZXJIVE1MJyAmJiBpbmNsdWRlc0V2ZW50c0FuZEF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVBdHRyaWJ1dGUoZG9tTm9kZSwgcHJvcE5hbWUsIHByb3BWYWx1ZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocHJvcE5hbWUgPT09ICdzY3JvbGxMZWZ0JyB8fCBwcm9wTmFtZSA9PT0gJ3Njcm9sbFRvcCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZG9tTm9kZVtwcm9wTmFtZV0gIT09IHByb3BWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlW3Byb3BOYW1lXSA9IHByb3BWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlW3Byb3BOYW1lXSA9IHByb3BWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNVcGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwcm9wZXJ0aWVzVXBkYXRlZDtcclxufVxyXG5mdW5jdGlvbiBmaW5kSW5kZXhPZkNoaWxkKGNoaWxkcmVuLCBzYW1lQXMsIHN0YXJ0KSB7XHJcbiAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChzYW1lKGNoaWxkcmVuW2ldLCBzYW1lQXMpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAtMTtcclxufVxyXG5mdW5jdGlvbiB0b1BhcmVudFZOb2RlKGRvbU5vZGUpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGFnOiAnJyxcclxuICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcclxuICAgICAgICBjaGlsZHJlbjogdW5kZWZpbmVkLFxyXG4gICAgICAgIGRvbU5vZGU6IGRvbU5vZGUsXHJcbiAgICAgICAgdHlwZTogZF8xLlZOT0RFXHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMudG9QYXJlbnRWTm9kZSA9IHRvUGFyZW50Vk5vZGU7XHJcbmZ1bmN0aW9uIHRvVGV4dFZOb2RlKGRhdGEpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGFnOiAnJyxcclxuICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcclxuICAgICAgICBjaGlsZHJlbjogdW5kZWZpbmVkLFxyXG4gICAgICAgIHRleHQ6IFwiXCIgKyBkYXRhLFxyXG4gICAgICAgIGRvbU5vZGU6IHVuZGVmaW5lZCxcclxuICAgICAgICB0eXBlOiBkXzEuVk5PREVcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy50b1RleHRWTm9kZSA9IHRvVGV4dFZOb2RlO1xyXG5mdW5jdGlvbiB0b0ludGVybmFsV05vZGUoaW5zdGFuY2UsIGluc3RhbmNlRGF0YSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2UsXHJcbiAgICAgICAgcmVuZGVyZWQ6IFtdLFxyXG4gICAgICAgIGNvcmVQcm9wZXJ0aWVzOiBpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMsXHJcbiAgICAgICAgY2hpbGRyZW46IGluc3RhbmNlLmNoaWxkcmVuLFxyXG4gICAgICAgIHdpZGdldENvbnN0cnVjdG9yOiBpbnN0YW5jZS5jb25zdHJ1Y3RvcixcclxuICAgICAgICBwcm9wZXJ0aWVzOiBpbnN0YW5jZURhdGEuaW5wdXRQcm9wZXJ0aWVzLFxyXG4gICAgICAgIHR5cGU6IGRfMS5XTk9ERVxyXG4gICAgfTtcclxufVxyXG5mdW5jdGlvbiBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKGNoaWxkcmVuLCBpbnN0YW5jZSkge1xyXG4gICAgaWYgKGNoaWxkcmVuID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm4gZW1wdHlBcnJheTtcclxuICAgIH1cclxuICAgIGNoaWxkcmVuID0gQXJyYXkuaXNBcnJheShjaGlsZHJlbikgPyBjaGlsZHJlbiA6IFtjaGlsZHJlbl07XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDspIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcclxuICAgICAgICBpZiAoY2hpbGQgPT09IHVuZGVmaW5lZCB8fCBjaGlsZCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjaGlsZHJlbi5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgY2hpbGQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuW2ldID0gdG9UZXh0Vk5vZGUoY2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGRfMS5pc1ZOb2RlKGNoaWxkKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLnByb3BlcnRpZXMuYmluZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQucHJvcGVydGllcy5iaW5kID0gaW5zdGFuY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkLmNoaWxkcmVuICYmIGNoaWxkLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihjaGlsZC5jaGlsZHJlbiwgaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghY2hpbGQuY29yZVByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gZXhwb3J0cy53aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLmNvcmVQcm9wZXJ0aWVzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiaW5kOiBpbnN0YW5jZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzZVJlZ2lzdHJ5OiBpbnN0YW5jZURhdGEuY29yZVByb3BlcnRpZXMuYmFzZVJlZ2lzdHJ5XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5jaGlsZHJlbiAmJiBjaGlsZC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihjaGlsZC5jaGlsZHJlbiwgaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGkrKztcclxuICAgIH1cclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxufVxyXG5leHBvcnRzLmZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4gPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuO1xyXG5mdW5jdGlvbiBub2RlQWRkZWQoZG5vZGUsIHRyYW5zaXRpb25zKSB7XHJcbiAgICBpZiAoZF8xLmlzVk5vZGUoZG5vZGUpICYmIGRub2RlLnByb3BlcnRpZXMpIHtcclxuICAgICAgICB2YXIgZW50ZXJBbmltYXRpb24gPSBkbm9kZS5wcm9wZXJ0aWVzLmVudGVyQW5pbWF0aW9uO1xyXG4gICAgICAgIGlmIChlbnRlckFuaW1hdGlvbikge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGVudGVyQW5pbWF0aW9uID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBlbnRlckFuaW1hdGlvbihkbm9kZS5kb21Ob2RlLCBkbm9kZS5wcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25zLmVudGVyKGRub2RlLmRvbU5vZGUsIGRub2RlLnByb3BlcnRpZXMsIGVudGVyQW5pbWF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBjYWxsT25EZXRhY2goZE5vZGVzLCBwYXJlbnRJbnN0YW5jZSkge1xyXG4gICAgZE5vZGVzID0gQXJyYXkuaXNBcnJheShkTm9kZXMpID8gZE5vZGVzIDogW2ROb2Rlc107XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBkTm9kZSA9IGROb2Rlc1tpXTtcclxuICAgICAgICBpZiAoZF8xLmlzV05vZGUoZE5vZGUpKSB7XHJcbiAgICAgICAgICAgIGlmIChkTm9kZS5yZW5kZXJlZCkge1xyXG4gICAgICAgICAgICAgICAgY2FsbE9uRGV0YWNoKGROb2RlLnJlbmRlcmVkLCBkTm9kZS5pbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGROb2RlLmluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gZXhwb3J0cy53aWRnZXRJbnN0YW5jZU1hcC5nZXQoZE5vZGUuaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VEYXRhLm9uRGV0YWNoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChkTm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgY2FsbE9uRGV0YWNoKGROb2RlLmNoaWxkcmVuLCBwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gbm9kZVRvUmVtb3ZlKGRub2RlLCB0cmFuc2l0aW9ucywgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIGlmIChkXzEuaXNXTm9kZShkbm9kZSkpIHtcclxuICAgICAgICB2YXIgcmVuZGVyZWQgPSBkbm9kZS5yZW5kZXJlZCB8fCBlbXB0eUFycmF5O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVuZGVyZWQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNoaWxkID0gcmVuZGVyZWRbaV07XHJcbiAgICAgICAgICAgIGlmIChkXzEuaXNWTm9kZShjaGlsZCkpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkLmRvbU5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjaGlsZC5kb21Ob2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5vZGVUb1JlbW92ZShjaGlsZCwgdHJhbnNpdGlvbnMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHZhciBkb21Ob2RlXzEgPSBkbm9kZS5kb21Ob2RlO1xyXG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gZG5vZGUucHJvcGVydGllcztcclxuICAgICAgICB2YXIgZXhpdEFuaW1hdGlvbiA9IHByb3BlcnRpZXMuZXhpdEFuaW1hdGlvbjtcclxuICAgICAgICBpZiAocHJvcGVydGllcyAmJiBleGl0QW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICAgIGRvbU5vZGVfMS5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xyXG4gICAgICAgICAgICB2YXIgcmVtb3ZlRG9tTm9kZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGRvbU5vZGVfMSAmJiBkb21Ob2RlXzEucGFyZW50Tm9kZSAmJiBkb21Ob2RlXzEucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb21Ob2RlXzEpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGV4aXRBbmltYXRpb24gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIGV4aXRBbmltYXRpb24oZG9tTm9kZV8xLCByZW1vdmVEb21Ob2RlLCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25zLmV4aXQoZG5vZGUuZG9tTm9kZSwgcHJvcGVydGllcywgZXhpdEFuaW1hdGlvbiwgcmVtb3ZlRG9tTm9kZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZG9tTm9kZV8xICYmIGRvbU5vZGVfMS5wYXJlbnROb2RlICYmIGRvbU5vZGVfMS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvbU5vZGVfMSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gY2hlY2tEaXN0aW5ndWlzaGFibGUoY2hpbGROb2RlcywgaW5kZXhUb0NoZWNrLCBwYXJlbnRJbnN0YW5jZSkge1xyXG4gICAgdmFyIGNoaWxkTm9kZSA9IGNoaWxkTm9kZXNbaW5kZXhUb0NoZWNrXTtcclxuICAgIGlmIChkXzEuaXNWTm9kZShjaGlsZE5vZGUpICYmICFjaGlsZE5vZGUudGFnKSB7XHJcbiAgICAgICAgcmV0dXJuOyAvLyBUZXh0IG5vZGVzIG5lZWQgbm90IGJlIGRpc3Rpbmd1aXNoYWJsZVxyXG4gICAgfVxyXG4gICAgdmFyIGtleSA9IGNoaWxkTm9kZS5wcm9wZXJ0aWVzLmtleTtcclxuICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCB8fCBrZXkgPT09IG51bGwpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGkgIT09IGluZGV4VG9DaGVjaykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBjaGlsZE5vZGVzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNhbWUobm9kZSwgY2hpbGROb2RlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBub2RlSWRlbnRpZmllciA9IHZvaWQgMDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyZW50TmFtZSA9IHBhcmVudEluc3RhbmNlLmNvbnN0cnVjdG9yLm5hbWUgfHwgJ3Vua25vd24nO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkXzEuaXNXTm9kZShjaGlsZE5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVJZGVudGlmaWVyID0gY2hpbGROb2RlLndpZGdldENvbnN0cnVjdG9yLm5hbWUgfHwgJ3Vua25vd24nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZUlkZW50aWZpZXIgPSBjaGlsZE5vZGUudGFnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJBIHdpZGdldCAoXCIgKyBwYXJlbnROYW1lICsgXCIpIGhhcyBoYWQgYSBjaGlsZCBhZGRkZWQgb3IgcmVtb3ZlZCwgYnV0IHRoZXkgd2VyZSBub3QgYWJsZSB0byB1bmlxdWVseSBpZGVudGlmaWVkLiBJdCBpcyByZWNvbW1lbmRlZCB0byBwcm92aWRlIGEgdW5pcXVlICdrZXknIHByb3BlcnR5IHdoZW4gdXNpbmcgdGhlIHNhbWUgd2lkZ2V0IG9yIGVsZW1lbnQgKFwiICsgbm9kZUlkZW50aWZpZXIgKyBcIikgbXVsdGlwbGUgdGltZXMgYXMgc2libGluZ3NcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlQ2hpbGRyZW4ocGFyZW50Vk5vZGUsIG9sZENoaWxkcmVuLCBuZXdDaGlsZHJlbiwgcGFyZW50SW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICBvbGRDaGlsZHJlbiA9IG9sZENoaWxkcmVuIHx8IGVtcHR5QXJyYXk7XHJcbiAgICBuZXdDaGlsZHJlbiA9IG5ld0NoaWxkcmVuO1xyXG4gICAgdmFyIG9sZENoaWxkcmVuTGVuZ3RoID0gb2xkQ2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgdmFyIG5ld0NoaWxkcmVuTGVuZ3RoID0gbmV3Q2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgdmFyIHRyYW5zaXRpb25zID0gcHJvamVjdGlvbk9wdGlvbnMudHJhbnNpdGlvbnM7XHJcbiAgICB2YXIgcHJvamVjdG9yU3RhdGUgPSBwcm9qZWN0b3JTdGF0ZU1hcC5nZXQocHJvamVjdGlvbk9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpO1xyXG4gICAgcHJvamVjdGlvbk9wdGlvbnMgPSB0c2xpYl8xLl9fYXNzaWduKHt9LCBwcm9qZWN0aW9uT3B0aW9ucywgeyBkZXB0aDogcHJvamVjdGlvbk9wdGlvbnMuZGVwdGggKyAxIH0pO1xyXG4gICAgdmFyIG9sZEluZGV4ID0gMDtcclxuICAgIHZhciBuZXdJbmRleCA9IDA7XHJcbiAgICB2YXIgaTtcclxuICAgIHZhciB0ZXh0VXBkYXRlZCA9IGZhbHNlO1xyXG4gICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG9sZENoaWxkID0gb2xkSW5kZXggPCBvbGRDaGlsZHJlbkxlbmd0aCA/IG9sZENoaWxkcmVuW29sZEluZGV4XSA6IHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgbmV3Q2hpbGQgPSBuZXdDaGlsZHJlbltuZXdJbmRleF07XHJcbiAgICAgICAgaWYgKGRfMS5pc1ZOb2RlKG5ld0NoaWxkKSAmJiB0eXBlb2YgbmV3Q2hpbGQuZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgbmV3Q2hpbGQuaW5zZXJ0ZWQgPSBkXzEuaXNWTm9kZShvbGRDaGlsZCkgJiYgb2xkQ2hpbGQuaW5zZXJ0ZWQ7XHJcbiAgICAgICAgICAgIGFkZERlZmVycmVkUHJvcGVydGllcyhuZXdDaGlsZCwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2xkQ2hpbGQgIT09IHVuZGVmaW5lZCAmJiBzYW1lKG9sZENoaWxkLCBuZXdDaGlsZCkpIHtcclxuICAgICAgICAgICAgdGV4dFVwZGF0ZWQgPSB1cGRhdGVEb20ob2xkQ2hpbGQsIG5ld0NoaWxkLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50Vk5vZGUsIHBhcmVudEluc3RhbmNlKSB8fCB0ZXh0VXBkYXRlZDtcclxuICAgICAgICAgICAgb2xkSW5kZXgrKztcclxuICAgICAgICAgICAgbmV3SW5kZXgrKztcclxuICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGZpbmRPbGRJbmRleCA9IGZpbmRJbmRleE9mQ2hpbGQob2xkQ2hpbGRyZW4sIG5ld0NoaWxkLCBvbGRJbmRleCArIDEpO1xyXG4gICAgICAgIHZhciBhZGRDaGlsZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGluc2VydEJlZm9yZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgdmFyIGNoaWxkID0gb2xkQ2hpbGRyZW5bb2xkSW5kZXhdO1xyXG4gICAgICAgICAgICBpZiAoY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXh0SW5kZXggPSBvbGRJbmRleCArIDE7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoaW5zZXJ0QmVmb3JlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZF8xLmlzV05vZGUoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5yZW5kZXJlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBjaGlsZC5yZW5kZXJlZFswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChvbGRDaGlsZHJlbltuZXh0SW5kZXhdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IG9sZENoaWxkcmVuW25leHRJbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0SW5kZXgrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmUgPSBjaGlsZC5kb21Ob2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjcmVhdGVEb20obmV3Q2hpbGQsIHBhcmVudFZOb2RlLCBpbnNlcnRCZWZvcmUsIHByb2plY3Rpb25PcHRpb25zLCBwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIG5vZGVBZGRlZChuZXdDaGlsZCwgdHJhbnNpdGlvbnMpO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUb0NoZWNrID0gbmV3SW5kZXg7XHJcbiAgICAgICAgICAgIHByb2plY3RvclN0YXRlLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tEaXN0aW5ndWlzaGFibGUobmV3Q2hpbGRyZW4sIGluZGV4VG9DaGVjaywgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICghb2xkQ2hpbGQgfHwgZmluZE9sZEluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICBhZGRDaGlsZCgpO1xyXG4gICAgICAgICAgICBuZXdJbmRleCsrO1xyXG4gICAgICAgICAgICByZXR1cm4gXCJjb250aW51ZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmVtb3ZlQ2hpbGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleFRvQ2hlY2sgPSBvbGRJbmRleDtcclxuICAgICAgICAgICAgcHJvamVjdG9yU3RhdGUuYWZ0ZXJSZW5kZXJDYWxsYmFja3MucHVzaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsT25EZXRhY2gob2xkQ2hpbGQsIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG9sZENoaWxkcmVuLCBpbmRleFRvQ2hlY2ssIHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG5vZGVUb1JlbW92ZShvbGRDaGlsZCwgdHJhbnNpdGlvbnMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBmaW5kTmV3SW5kZXggPSBmaW5kSW5kZXhPZkNoaWxkKG5ld0NoaWxkcmVuLCBvbGRDaGlsZCwgbmV3SW5kZXggKyAxKTtcclxuICAgICAgICBpZiAoZmluZE5ld0luZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICByZW1vdmVDaGlsZCgpO1xyXG4gICAgICAgICAgICBvbGRJbmRleCsrO1xyXG4gICAgICAgICAgICByZXR1cm4gXCJjb250aW51ZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhZGRDaGlsZCgpO1xyXG4gICAgICAgIHJlbW92ZUNoaWxkKCk7XHJcbiAgICAgICAgb2xkSW5kZXgrKztcclxuICAgICAgICBuZXdJbmRleCsrO1xyXG4gICAgfTtcclxuICAgIHdoaWxlIChuZXdJbmRleCA8IG5ld0NoaWxkcmVuTGVuZ3RoKSB7XHJcbiAgICAgICAgX2xvb3BfMSgpO1xyXG4gICAgfVxyXG4gICAgaWYgKG9sZENoaWxkcmVuTGVuZ3RoID4gb2xkSW5kZXgpIHtcclxuICAgICAgICB2YXIgX2xvb3BfMiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG9sZENoaWxkID0gb2xkQ2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIHZhciBpbmRleFRvQ2hlY2sgPSBpO1xyXG4gICAgICAgICAgICBwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxPbkRldGFjaChvbGRDaGlsZCwgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgY2hlY2tEaXN0aW5ndWlzaGFibGUob2xkQ2hpbGRyZW4sIGluZGV4VG9DaGVjaywgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbm9kZVRvUmVtb3ZlKG9sZENoaWxkcmVuW2ldLCB0cmFuc2l0aW9ucywgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gUmVtb3ZlIGNoaWxkIGZyYWdtZW50c1xyXG4gICAgICAgIGZvciAoaSA9IG9sZEluZGV4OyBpIDwgb2xkQ2hpbGRyZW5MZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBfbG9vcF8yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRleHRVcGRhdGVkO1xyXG59XHJcbmZ1bmN0aW9uIGFkZENoaWxkcmVuKHBhcmVudFZOb2RlLCBjaGlsZHJlbiwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlLCBpbnNlcnRCZWZvcmUsIGNoaWxkTm9kZXMpIHtcclxuICAgIGlmIChpbnNlcnRCZWZvcmUgPT09IHZvaWQgMCkgeyBpbnNlcnRCZWZvcmUgPSB1bmRlZmluZWQ7IH1cclxuICAgIGlmIChjaGlsZHJlbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdmFyIHByb2plY3RvclN0YXRlID0gcHJvamVjdG9yU3RhdGVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgIGlmIChwcm9qZWN0b3JTdGF0ZS5tZXJnZSAmJiBjaGlsZE5vZGVzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjaGlsZE5vZGVzID0gYXJyYXlfMS5mcm9tKHBhcmVudFZOb2RlLmRvbU5vZGUuY2hpbGROb2Rlcyk7XHJcbiAgICB9XHJcbiAgICBwcm9qZWN0aW9uT3B0aW9ucyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHByb2plY3Rpb25PcHRpb25zLCB7IGRlcHRoOiBwcm9qZWN0aW9uT3B0aW9ucy5kZXB0aCArIDEgfSk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XHJcbiAgICAgICAgaWYgKGRfMS5pc1ZOb2RlKGNoaWxkKSkge1xyXG4gICAgICAgICAgICBpZiAocHJvamVjdG9yU3RhdGUubWVyZ2UgJiYgY2hpbGROb2Rlcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRvbUVsZW1lbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoY2hpbGQuZG9tTm9kZSA9PT0gdW5kZWZpbmVkICYmIGNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbUVsZW1lbnQgPSBjaGlsZE5vZGVzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbUVsZW1lbnQgJiYgZG9tRWxlbWVudC50YWdOYW1lID09PSAoY2hpbGQudGFnLnRvVXBwZXJDYXNlKCkgfHwgdW5kZWZpbmVkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5kb21Ob2RlID0gZG9tRWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3JlYXRlRG9tKGNoaWxkLCBwYXJlbnRWTm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY3JlYXRlRG9tKGNoaWxkLCBwYXJlbnRWTm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UsIGNoaWxkTm9kZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBpbml0UHJvcGVydGllc0FuZENoaWxkcmVuKGRvbU5vZGUsIGRub2RlLCBwYXJlbnRJbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIGFkZENoaWxkcmVuKGRub2RlLCBkbm9kZS5jaGlsZHJlbiwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudEluc3RhbmNlLCB1bmRlZmluZWQpO1xyXG4gICAgaWYgKHR5cGVvZiBkbm9kZS5kZWZlcnJlZFByb3BlcnRpZXNDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyAmJiBkbm9kZS5pbnNlcnRlZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgYWRkRGVmZXJyZWRQcm9wZXJ0aWVzKGRub2RlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBpZiAoZG5vZGUuYXR0cmlidXRlcyAmJiBkbm9kZS5ldmVudHMpIHtcclxuICAgICAgICB1cGRhdGVBdHRyaWJ1dGVzKGRvbU5vZGUsIHt9LCBkbm9kZS5hdHRyaWJ1dGVzLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgdXBkYXRlUHJvcGVydGllcyhkb21Ob2RlLCB7fSwgZG5vZGUucHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMsIGZhbHNlKTtcclxuICAgICAgICByZW1vdmVPcnBoYW5lZEV2ZW50cyhkb21Ob2RlLCB7fSwgZG5vZGUuZXZlbnRzLCBwcm9qZWN0aW9uT3B0aW9ucywgdHJ1ZSk7XHJcbiAgICAgICAgdmFyIGV2ZW50c18xID0gZG5vZGUuZXZlbnRzO1xyXG4gICAgICAgIE9iamVjdC5rZXlzKGV2ZW50c18xKS5mb3JFYWNoKGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICB1cGRhdGVFdmVudChkb21Ob2RlLCBldmVudCwgZXZlbnRzXzFbZXZlbnRdLCBwcm9qZWN0aW9uT3B0aW9ucywgZG5vZGUucHJvcGVydGllcy5iaW5kKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHVwZGF0ZVByb3BlcnRpZXMoZG9tTm9kZSwge30sIGRub2RlLnByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgIH1cclxuICAgIGlmIChkbm9kZS5wcm9wZXJ0aWVzLmtleSAhPT0gbnVsbCAmJiBkbm9kZS5wcm9wZXJ0aWVzLmtleSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICBpbnN0YW5jZURhdGEubm9kZUhhbmRsZXIuYWRkKGRvbU5vZGUsIFwiXCIgKyBkbm9kZS5wcm9wZXJ0aWVzLmtleSk7XHJcbiAgICB9XHJcbiAgICBkbm9kZS5pbnNlcnRlZCA9IHRydWU7XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlRG9tKGRub2RlLCBwYXJlbnRWTm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50SW5zdGFuY2UsIGNoaWxkTm9kZXMpIHtcclxuICAgIHZhciBkb21Ob2RlO1xyXG4gICAgdmFyIHByb2plY3RvclN0YXRlID0gcHJvamVjdG9yU3RhdGVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgIGlmIChkXzEuaXNXTm9kZShkbm9kZSkpIHtcclxuICAgICAgICB2YXIgd2lkZ2V0Q29uc3RydWN0b3IgPSBkbm9kZS53aWRnZXRDb25zdHJ1Y3RvcjtcclxuICAgICAgICB2YXIgcGFyZW50SW5zdGFuY2VEYXRhID0gZXhwb3J0cy53aWRnZXRJbnN0YW5jZU1hcC5nZXQocGFyZW50SW5zdGFuY2UpO1xyXG4gICAgICAgIGlmICghUmVnaXN0cnlfMS5pc1dpZGdldEJhc2VDb25zdHJ1Y3Rvcih3aWRnZXRDb25zdHJ1Y3RvcikpIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBwYXJlbnRJbnN0YW5jZURhdGEucmVnaXN0cnkoKS5nZXQod2lkZ2V0Q29uc3RydWN0b3IpO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdpZGdldENvbnN0cnVjdG9yID0gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGluc3RhbmNlXzEgPSBuZXcgd2lkZ2V0Q29uc3RydWN0b3IoKTtcclxuICAgICAgICBkbm9kZS5pbnN0YW5jZSA9IGluc3RhbmNlXzE7XHJcbiAgICAgICAgdmFyIGluc3RhbmNlRGF0YV8xID0gZXhwb3J0cy53aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2VfMSk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhXzEuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhXzEuZGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoaW5zdGFuY2VEYXRhXzEucmVuZGVyaW5nID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdG9yU3RhdGUucmVuZGVyUXVldWUucHVzaCh7IGluc3RhbmNlOiBpbnN0YW5jZV8xLCBkZXB0aDogcHJvamVjdGlvbk9wdGlvbnMuZGVwdGggfSk7XHJcbiAgICAgICAgICAgICAgICBzY2hlZHVsZVJlbmRlcihwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGluc3RhbmNlRGF0YV8xLnJlbmRlcmluZyA9IHRydWU7XHJcbiAgICAgICAgaW5zdGFuY2VfMS5fX3NldENvcmVQcm9wZXJ0aWVzX18oZG5vZGUuY29yZVByb3BlcnRpZXMpO1xyXG4gICAgICAgIGluc3RhbmNlXzEuX19zZXRDaGlsZHJlbl9fKGRub2RlLmNoaWxkcmVuKTtcclxuICAgICAgICBpbnN0YW5jZV8xLl9fc2V0UHJvcGVydGllc19fKGRub2RlLnByb3BlcnRpZXMpO1xyXG4gICAgICAgIHZhciByZW5kZXJlZCA9IGluc3RhbmNlXzEuX19yZW5kZXJfXygpO1xyXG4gICAgICAgIGluc3RhbmNlRGF0YV8xLnJlbmRlcmluZyA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChyZW5kZXJlZCkge1xyXG4gICAgICAgICAgICB2YXIgZmlsdGVyZWRSZW5kZXJlZCA9IGZpbHRlckFuZERlY29yYXRlQ2hpbGRyZW4ocmVuZGVyZWQsIGluc3RhbmNlXzEpO1xyXG4gICAgICAgICAgICBkbm9kZS5yZW5kZXJlZCA9IGZpbHRlcmVkUmVuZGVyZWQ7XHJcbiAgICAgICAgICAgIGFkZENoaWxkcmVuKHBhcmVudFZOb2RlLCBmaWx0ZXJlZFJlbmRlcmVkLCBwcm9qZWN0aW9uT3B0aW9ucywgaW5zdGFuY2VfMSwgaW5zZXJ0QmVmb3JlLCBjaGlsZE5vZGVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaW5zdGFuY2VNYXAuc2V0KGluc3RhbmNlXzEsIHsgZG5vZGU6IGRub2RlLCBwYXJlbnRWTm9kZTogcGFyZW50Vk5vZGUgfSk7XHJcbiAgICAgICAgaW5zdGFuY2VEYXRhXzEubm9kZUhhbmRsZXIuYWRkUm9vdCgpO1xyXG4gICAgICAgIHByb2plY3RvclN0YXRlLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLnB1c2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZURhdGFfMS5vbkF0dGFjaCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKHByb2plY3RvclN0YXRlLm1lcmdlICYmIHByb2plY3RvclN0YXRlLm1lcmdlRWxlbWVudCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gcHJvamVjdGlvbk9wdGlvbnMubWVyZ2VFbGVtZW50O1xyXG4gICAgICAgICAgICBwcm9qZWN0b3JTdGF0ZS5tZXJnZUVsZW1lbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGluaXRQcm9wZXJ0aWVzQW5kQ2hpbGRyZW4oZG9tTm9kZSwgZG5vZGUsIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGRvYyA9IHBhcmVudFZOb2RlLmRvbU5vZGUub3duZXJEb2N1bWVudDtcclxuICAgICAgICBpZiAoIWRub2RlLnRhZyAmJiB0eXBlb2YgZG5vZGUudGV4dCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgaWYgKGRub2RlLmRvbU5vZGUgIT09IHVuZGVmaW5lZCAmJiBwYXJlbnRWTm9kZS5kb21Ob2RlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3RG9tTm9kZSA9IGRub2RlLmRvbU5vZGUub3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkbm9kZS50ZXh0KTtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJlbnRWTm9kZS5kb21Ob2RlID09PSBkbm9kZS5kb21Ob2RlLnBhcmVudE5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRWTm9kZS5kb21Ob2RlLnJlcGxhY2VDaGlsZChuZXdEb21Ob2RlLCBkbm9kZS5kb21Ob2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudFZOb2RlLmRvbU5vZGUuYXBwZW5kQ2hpbGQobmV3RG9tTm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG5vZGUuZG9tTm9kZS5wYXJlbnROb2RlICYmIGRub2RlLmRvbU5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkbm9kZS5kb21Ob2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRub2RlLmRvbU5vZGUgPSBuZXdEb21Ob2RlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgPSBkb2MuY3JlYXRlVGV4dE5vZGUoZG5vZGUudGV4dCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5zZXJ0QmVmb3JlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRWTm9kZS5kb21Ob2RlLmluc2VydEJlZm9yZShkb21Ob2RlLCBpbnNlcnRCZWZvcmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Vk5vZGUuZG9tTm9kZS5hcHBlbmRDaGlsZChkb21Ob2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGRub2RlLmRvbU5vZGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRub2RlLnRhZyA9PT0gJ3N2ZycpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHByb2plY3Rpb25PcHRpb25zLCB7IG5hbWVzcGFjZTogTkFNRVNQQUNFX1NWRyB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlID0gZG9jLmNyZWF0ZUVsZW1lbnROUyhwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UsIGRub2RlLnRhZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlID0gZG5vZGUuZG9tTm9kZSA9IGRub2RlLmRvbU5vZGUgfHwgZG9jLmNyZWF0ZUVsZW1lbnQoZG5vZGUudGFnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRvbU5vZGUgPSBkbm9kZS5kb21Ob2RlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluaXRQcm9wZXJ0aWVzQW5kQ2hpbGRyZW4oZG9tTm9kZSwgZG5vZGUsIHBhcmVudEluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChpbnNlcnRCZWZvcmUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50Vk5vZGUuZG9tTm9kZS5pbnNlcnRCZWZvcmUoZG9tTm9kZSwgaW5zZXJ0QmVmb3JlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChkb21Ob2RlLnBhcmVudE5vZGUgIT09IHBhcmVudFZOb2RlLmRvbU5vZGUpIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudFZOb2RlLmRvbU5vZGUuYXBwZW5kQ2hpbGQoZG9tTm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdXBkYXRlRG9tKHByZXZpb3VzLCBkbm9kZSwgcHJvamVjdGlvbk9wdGlvbnMsIHBhcmVudFZOb2RlLCBwYXJlbnRJbnN0YW5jZSkge1xyXG4gICAgaWYgKGRfMS5pc1dOb2RlKGRub2RlKSkge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZSA9IHByZXZpb3VzLmluc3RhbmNlO1xyXG4gICAgICAgIHZhciBfYSA9IGluc3RhbmNlTWFwLmdldChpbnN0YW5jZSksIHBhcmVudFZOb2RlXzEgPSBfYS5wYXJlbnRWTm9kZSwgbm9kZSA9IF9hLmRub2RlO1xyXG4gICAgICAgIHZhciBwcmV2aW91c1JlbmRlcmVkID0gbm9kZSA/IG5vZGUucmVuZGVyZWQgOiBwcmV2aW91cy5yZW5kZXJlZDtcclxuICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gZXhwb3J0cy53aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xyXG4gICAgICAgIGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPSB0cnVlO1xyXG4gICAgICAgIGluc3RhbmNlLl9fc2V0Q29yZVByb3BlcnRpZXNfXyhkbm9kZS5jb3JlUHJvcGVydGllcyk7XHJcbiAgICAgICAgaW5zdGFuY2UuX19zZXRDaGlsZHJlbl9fKGRub2RlLmNoaWxkcmVuKTtcclxuICAgICAgICBpbnN0YW5jZS5fX3NldFByb3BlcnRpZXNfXyhkbm9kZS5wcm9wZXJ0aWVzKTtcclxuICAgICAgICBkbm9kZS5pbnN0YW5jZSA9IGluc3RhbmNlO1xyXG4gICAgICAgIGluc3RhbmNlTWFwLnNldChpbnN0YW5jZSwgeyBkbm9kZTogZG5vZGUsIHBhcmVudFZOb2RlOiBwYXJlbnRWTm9kZV8xIH0pO1xyXG4gICAgICAgIGlmIChpbnN0YW5jZURhdGEuZGlydHkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgdmFyIHJlbmRlcmVkID0gaW5zdGFuY2UuX19yZW5kZXJfXygpO1xyXG4gICAgICAgICAgICBpbnN0YW5jZURhdGEucmVuZGVyaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGRub2RlLnJlbmRlcmVkID0gZmlsdGVyQW5kRGVjb3JhdGVDaGlsZHJlbihyZW5kZXJlZCwgaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB1cGRhdGVDaGlsZHJlbihwYXJlbnRWTm9kZV8xLCBwcmV2aW91c1JlbmRlcmVkLCBkbm9kZS5yZW5kZXJlZCwgaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgZG5vZGUucmVuZGVyZWQgPSBwcmV2aW91c1JlbmRlcmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbnN0YW5jZURhdGEubm9kZUhhbmRsZXIuYWRkUm9vdCgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKHByZXZpb3VzID09PSBkbm9kZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkb21Ob2RlXzIgPSAoZG5vZGUuZG9tTm9kZSA9IHByZXZpb3VzLmRvbU5vZGUpO1xyXG4gICAgICAgIHZhciB0ZXh0VXBkYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHZhciB1cGRhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKCFkbm9kZS50YWcgJiYgdHlwZW9mIGRub2RlLnRleHQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGlmIChkbm9kZS50ZXh0ICE9PSBwcmV2aW91cy50ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3RG9tTm9kZSA9IGRvbU5vZGVfMi5vd25lckRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRub2RlLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgZG9tTm9kZV8yLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0RvbU5vZGUsIGRvbU5vZGVfMik7XHJcbiAgICAgICAgICAgICAgICBkbm9kZS5kb21Ob2RlID0gbmV3RG9tTm9kZTtcclxuICAgICAgICAgICAgICAgIHRleHRVcGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0VXBkYXRlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGRub2RlLnRhZyAmJiBkbm9kZS50YWcubGFzdEluZGV4T2YoJ3N2ZycsIDApID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHByb2plY3Rpb25PcHRpb25zLCB7IG5hbWVzcGFjZTogTkFNRVNQQUNFX1NWRyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJldmlvdXMuY2hpbGRyZW4gIT09IGRub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSBmaWx0ZXJBbmREZWNvcmF0ZUNoaWxkcmVuKGRub2RlLmNoaWxkcmVuLCBwYXJlbnRJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICBkbm9kZS5jaGlsZHJlbiA9IGNoaWxkcmVuO1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlZCA9XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQ2hpbGRyZW4oZG5vZGUsIHByZXZpb3VzLmNoaWxkcmVuLCBjaGlsZHJlbiwgcGFyZW50SW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKSB8fCB1cGRhdGVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBwcmV2aW91c1Byb3BlcnRpZXNfMSA9IGJ1aWxkUHJldmlvdXNQcm9wZXJ0aWVzKGRvbU5vZGVfMiwgcHJldmlvdXMsIGRub2RlKTtcclxuICAgICAgICAgICAgaWYgKGRub2RlLmF0dHJpYnV0ZXMgJiYgZG5vZGUuZXZlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVBdHRyaWJ1dGVzKGRvbU5vZGVfMiwgcHJldmlvdXNQcm9wZXJ0aWVzXzEuYXR0cmlidXRlcywgZG5vZGUuYXR0cmlidXRlcywgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlZCA9XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlUHJvcGVydGllcyhkb21Ob2RlXzIsIHByZXZpb3VzUHJvcGVydGllc18xLnByb3BlcnRpZXMsIGRub2RlLnByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zLCBmYWxzZSkgfHwgdXBkYXRlZDtcclxuICAgICAgICAgICAgICAgIHJlbW92ZU9ycGhhbmVkRXZlbnRzKGRvbU5vZGVfMiwgcHJldmlvdXNQcm9wZXJ0aWVzXzEuZXZlbnRzLCBkbm9kZS5ldmVudHMsIHByb2plY3Rpb25PcHRpb25zLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHZhciBldmVudHNfMiA9IGRub2RlLmV2ZW50cztcclxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGV2ZW50c18yKS5mb3JFYWNoKGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUV2ZW50KGRvbU5vZGVfMiwgZXZlbnQsIGV2ZW50c18yW2V2ZW50XSwgcHJvamVjdGlvbk9wdGlvbnMsIGRub2RlLnByb3BlcnRpZXMuYmluZCwgcHJldmlvdXNQcm9wZXJ0aWVzXzEuZXZlbnRzW2V2ZW50XSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZWQgPVxyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVByb3BlcnRpZXMoZG9tTm9kZV8yLCBwcmV2aW91c1Byb3BlcnRpZXNfMS5wcm9wZXJ0aWVzLCBkbm9kZS5wcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucykgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZG5vZGUucHJvcGVydGllcy5rZXkgIT09IG51bGwgJiYgZG5vZGUucHJvcGVydGllcy5rZXkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlRGF0YSA9IGV4cG9ydHMud2lkZ2V0SW5zdGFuY2VNYXAuZ2V0KHBhcmVudEluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlRGF0YS5ub2RlSGFuZGxlci5hZGQoZG9tTm9kZV8yLCBcIlwiICsgZG5vZGUucHJvcGVydGllcy5rZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh1cGRhdGVkICYmIGRub2RlLnByb3BlcnRpZXMgJiYgZG5vZGUucHJvcGVydGllcy51cGRhdGVBbmltYXRpb24pIHtcclxuICAgICAgICAgICAgZG5vZGUucHJvcGVydGllcy51cGRhdGVBbmltYXRpb24oZG9tTm9kZV8yLCBkbm9kZS5wcm9wZXJ0aWVzLCBwcmV2aW91cy5wcm9wZXJ0aWVzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gYWRkRGVmZXJyZWRQcm9wZXJ0aWVzKHZub2RlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgLy8gdHJhbnNmZXIgYW55IHByb3BlcnRpZXMgdGhhdCBoYXZlIGJlZW4gcGFzc2VkIC0gYXMgdGhlc2UgbXVzdCBiZSBkZWNvcmF0ZWQgcHJvcGVydGllc1xyXG4gICAgdm5vZGUuZGVjb3JhdGVkRGVmZXJyZWRQcm9wZXJ0aWVzID0gdm5vZGUucHJvcGVydGllcztcclxuICAgIHZhciBwcm9wZXJ0aWVzID0gdm5vZGUuZGVmZXJyZWRQcm9wZXJ0aWVzQ2FsbGJhY2soISF2bm9kZS5pbnNlcnRlZCk7XHJcbiAgICB2YXIgcHJvamVjdG9yU3RhdGUgPSBwcm9qZWN0b3JTdGF0ZU1hcC5nZXQocHJvamVjdGlvbk9wdGlvbnMucHJvamVjdG9ySW5zdGFuY2UpO1xyXG4gICAgdm5vZGUucHJvcGVydGllcyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHByb3BlcnRpZXMsIHZub2RlLmRlY29yYXRlZERlZmVycmVkUHJvcGVydGllcyk7XHJcbiAgICBwcm9qZWN0b3JTdGF0ZS5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRzbGliXzEuX19hc3NpZ24oe30sIHZub2RlLmRlZmVycmVkUHJvcGVydGllc0NhbGxiYWNrKCEhdm5vZGUuaW5zZXJ0ZWQpLCB2bm9kZS5kZWNvcmF0ZWREZWZlcnJlZFByb3BlcnRpZXMpO1xyXG4gICAgICAgIHVwZGF0ZVByb3BlcnRpZXModm5vZGUuZG9tTm9kZSwgdm5vZGUucHJvcGVydGllcywgcHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIHZub2RlLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gcnVuRGVmZXJyZWRSZW5kZXJDYWxsYmFja3MocHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIHZhciBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICBpZiAocHJvamVjdG9yU3RhdGUuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKHByb2plY3Rpb25PcHRpb25zLnN5bmMpIHtcclxuICAgICAgICAgICAgd2hpbGUgKHByb2plY3RvclN0YXRlLmRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gcHJvamVjdG9yU3RhdGUuZGVmZXJyZWRSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGdsb2JhbF8xLmRlZmF1bHQucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChwcm9qZWN0b3JTdGF0ZS5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBwcm9qZWN0b3JTdGF0ZS5kZWZlcnJlZFJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBydW5BZnRlclJlbmRlckNhbGxiYWNrcyhwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgdmFyIHByb2plY3RvclN0YXRlID0gcHJvamVjdG9yU3RhdGVNYXAuZ2V0KHByb2plY3Rpb25PcHRpb25zLnByb2plY3Rvckluc3RhbmNlKTtcclxuICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5zeW5jKSB7XHJcbiAgICAgICAgd2hpbGUgKHByb2plY3RvclN0YXRlLmFmdGVyUmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChnbG9iYWxfMS5kZWZhdWx0LnJlcXVlc3RJZGxlQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgZ2xvYmFsXzEuZGVmYXVsdC5yZXF1ZXN0SWRsZUNhbGxiYWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAocHJvamVjdG9yU3RhdGUuYWZ0ZXJSZW5kZXJDYWxsYmFja3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gcHJvamVjdG9yU3RhdGUuYWZ0ZXJSZW5kZXJDYWxsYmFja3Muc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gc2NoZWR1bGVSZW5kZXIocHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIHZhciBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICBpZiAocHJvamVjdGlvbk9wdGlvbnMuc3luYykge1xyXG4gICAgICAgIHJlbmRlcihwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwcm9qZWN0b3JTdGF0ZS5yZW5kZXJTY2hlZHVsZWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHByb2plY3RvclN0YXRlLnJlbmRlclNjaGVkdWxlZCA9IGdsb2JhbF8xLmRlZmF1bHQucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmVuZGVyKHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiByZW5kZXIocHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgIHZhciBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChwcm9qZWN0aW9uT3B0aW9ucy5wcm9qZWN0b3JJbnN0YW5jZSk7XHJcbiAgICBwcm9qZWN0b3JTdGF0ZS5yZW5kZXJTY2hlZHVsZWQgPSB1bmRlZmluZWQ7XHJcbiAgICB2YXIgcmVuZGVyUXVldWUgPSBwcm9qZWN0b3JTdGF0ZS5yZW5kZXJRdWV1ZTtcclxuICAgIHZhciByZW5kZXJzID0gdHNsaWJfMS5fX3NwcmVhZChyZW5kZXJRdWV1ZSk7XHJcbiAgICBwcm9qZWN0b3JTdGF0ZS5yZW5kZXJRdWV1ZSA9IFtdO1xyXG4gICAgcmVuZGVycy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhLmRlcHRoIC0gYi5kZXB0aDsgfSk7XHJcbiAgICB3aGlsZSAocmVuZGVycy5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgaW5zdGFuY2UgPSByZW5kZXJzLnNoaWZ0KCkuaW5zdGFuY2U7XHJcbiAgICAgICAgdmFyIF9hID0gaW5zdGFuY2VNYXAuZ2V0KGluc3RhbmNlKSwgcGFyZW50Vk5vZGUgPSBfYS5wYXJlbnRWTm9kZSwgZG5vZGUgPSBfYS5kbm9kZTtcclxuICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gZXhwb3J0cy53aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xyXG4gICAgICAgIHVwZGF0ZURvbShkbm9kZSwgdG9JbnRlcm5hbFdOb2RlKGluc3RhbmNlLCBpbnN0YW5jZURhdGEpLCBwcm9qZWN0aW9uT3B0aW9ucywgcGFyZW50Vk5vZGUsIGluc3RhbmNlKTtcclxuICAgIH1cclxuICAgIHJ1bkFmdGVyUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgIHJ1bkRlZmVycmVkUmVuZGVyQ2FsbGJhY2tzKHByb2plY3Rpb25PcHRpb25zKTtcclxufVxyXG5leHBvcnRzLmRvbSA9IHtcclxuICAgIGFwcGVuZDogZnVuY3Rpb24gKHBhcmVudE5vZGUsIGluc3RhbmNlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucyA9PT0gdm9pZCAwKSB7IHByb2plY3Rpb25PcHRpb25zID0ge307IH1cclxuICAgICAgICB2YXIgaW5zdGFuY2VEYXRhID0gZXhwb3J0cy53aWRnZXRJbnN0YW5jZU1hcC5nZXQoaW5zdGFuY2UpO1xyXG4gICAgICAgIHZhciBmaW5hbFByb2plY3Rvck9wdGlvbnMgPSBnZXRQcm9qZWN0aW9uT3B0aW9ucyhwcm9qZWN0aW9uT3B0aW9ucywgaW5zdGFuY2UpO1xyXG4gICAgICAgIHZhciBwcm9qZWN0b3JTdGF0ZSA9IHtcclxuICAgICAgICAgICAgYWZ0ZXJSZW5kZXJDYWxsYmFja3M6IFtdLFxyXG4gICAgICAgICAgICBkZWZlcnJlZFJlbmRlckNhbGxiYWNrczogW10sXHJcbiAgICAgICAgICAgIG5vZGVNYXA6IG5ldyBXZWFrTWFwXzEuZGVmYXVsdCgpLFxyXG4gICAgICAgICAgICByZW5kZXJTY2hlZHVsZWQ6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgcmVuZGVyUXVldWU6IFtdLFxyXG4gICAgICAgICAgICBtZXJnZTogcHJvamVjdGlvbk9wdGlvbnMubWVyZ2UgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgIG1lcmdlRWxlbWVudDogcHJvamVjdGlvbk9wdGlvbnMubWVyZ2VFbGVtZW50XHJcbiAgICAgICAgfTtcclxuICAgICAgICBwcm9qZWN0b3JTdGF0ZU1hcC5zZXQoaW5zdGFuY2UsIHByb2plY3RvclN0YXRlKTtcclxuICAgICAgICBmaW5hbFByb2plY3Rvck9wdGlvbnMucm9vdE5vZGUgPSBwYXJlbnROb2RlO1xyXG4gICAgICAgIHZhciBwYXJlbnRWTm9kZSA9IHRvUGFyZW50Vk5vZGUoZmluYWxQcm9qZWN0b3JPcHRpb25zLnJvb3ROb2RlKTtcclxuICAgICAgICB2YXIgbm9kZSA9IHRvSW50ZXJuYWxXTm9kZShpbnN0YW5jZSwgaW5zdGFuY2VEYXRhKTtcclxuICAgICAgICBpbnN0YW5jZU1hcC5zZXQoaW5zdGFuY2UsIHsgZG5vZGU6IG5vZGUsIHBhcmVudFZOb2RlOiBwYXJlbnRWTm9kZSB9KTtcclxuICAgICAgICBpbnN0YW5jZURhdGEuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLmRpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKGluc3RhbmNlRGF0YS5yZW5kZXJpbmcgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0b3JTdGF0ZS5yZW5kZXJRdWV1ZS5wdXNoKHsgaW5zdGFuY2U6IGluc3RhbmNlLCBkZXB0aDogZmluYWxQcm9qZWN0b3JPcHRpb25zLmRlcHRoIH0pO1xyXG4gICAgICAgICAgICAgICAgc2NoZWR1bGVSZW5kZXIoZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdXBkYXRlRG9tKG5vZGUsIG5vZGUsIGZpbmFsUHJvamVjdG9yT3B0aW9ucywgcGFyZW50Vk5vZGUsIGluc3RhbmNlKTtcclxuICAgICAgICBwcm9qZWN0b3JTdGF0ZS5hZnRlclJlbmRlckNhbGxiYWNrcy5wdXNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2VEYXRhLm9uQXR0YWNoKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcnVuRGVmZXJyZWRSZW5kZXJDYWxsYmFja3MoZmluYWxQcm9qZWN0b3JPcHRpb25zKTtcclxuICAgICAgICBydW5BZnRlclJlbmRlckNhbGxiYWNrcyhmaW5hbFByb2plY3Rvck9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGRvbU5vZGU6IGZpbmFsUHJvamVjdG9yT3B0aW9ucy5yb290Tm9kZVxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlOiBmdW5jdGlvbiAoaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgfSxcclxuICAgIG1lcmdlOiBmdW5jdGlvbiAoZWxlbWVudCwgaW5zdGFuY2UsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKHByb2plY3Rpb25PcHRpb25zID09PSB2b2lkIDApIHsgcHJvamVjdGlvbk9wdGlvbnMgPSB7fTsgfVxyXG4gICAgICAgIHByb2plY3Rpb25PcHRpb25zLm1lcmdlID0gdHJ1ZTtcclxuICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5tZXJnZUVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIHZhciBwcm9qZWN0aW9uID0gdGhpcy5hcHBlbmQoZWxlbWVudC5wYXJlbnROb2RlLCBpbnN0YW5jZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIHZhciBwcm9qZWN0b3JTdGF0ZSA9IHByb2plY3RvclN0YXRlTWFwLmdldChpbnN0YW5jZSk7XHJcbiAgICAgICAgcHJvamVjdG9yU3RhdGUubWVyZ2UgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gcHJvamVjdGlvbjtcclxuICAgIH1cclxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS92ZG9tLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXQtY29yZS92ZG9tLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgV2lkZ2V0QmFzZV8xID0gcmVxdWlyZShcIkBkb2pvL3dpZGdldC1jb3JlL1dpZGdldEJhc2VcIik7XHJcbnZhciBUaGVtZWRfMSA9IHJlcXVpcmUoXCJAZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkXCIpO1xyXG52YXIgZF8xID0gcmVxdWlyZShcIkBkb2pvL3dpZGdldC1jb3JlL2RcIik7XHJcbnZhciBjc3MgPSByZXF1aXJlKFwiLi4vdGhlbWUvYnV0dG9uLm0uY3NzXCIpO1xyXG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4uL2NvbW1vbi91dGlsXCIpO1xyXG52YXIgY3VzdG9tRWxlbWVudF8xID0gcmVxdWlyZShcIkBkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvY3VzdG9tRWxlbWVudFwiKTtcclxudmFyIGluZGV4XzEgPSByZXF1aXJlKFwiLi4vaWNvbi9pbmRleFwiKTtcclxudmFyIHJlZ2lzdGVyQ3VzdG9tRWxlbWVudF8xID0gcmVxdWlyZShcIkBkb2pvL3dpZGdldC1jb3JlL3JlZ2lzdGVyQ3VzdG9tRWxlbWVudFwiKTtcclxuZXhwb3J0cy5UaGVtZWRCYXNlID0gVGhlbWVkXzEuVGhlbWVkTWl4aW4oV2lkZ2V0QmFzZV8xLldpZGdldEJhc2UpO1xyXG52YXIgQnV0dG9uQmFzZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKEJ1dHRvbkJhc2UsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBCdXR0b25CYXNlKCkge1xyXG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgIH1cclxuICAgIEJ1dHRvbkJhc2UucHJvdG90eXBlLl9vbkJsdXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMub25CbHVyICYmIHRoaXMucHJvcGVydGllcy5vbkJsdXIoKTtcclxuICAgIH07XHJcbiAgICBCdXR0b25CYXNlLnByb3RvdHlwZS5fb25DbGljayA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcy5vbkNsaWNrICYmIHRoaXMucHJvcGVydGllcy5vbkNsaWNrKCk7XHJcbiAgICB9O1xyXG4gICAgQnV0dG9uQmFzZS5wcm90b3R5cGUuX29uRm9jdXMgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMub25Gb2N1cyAmJiB0aGlzLnByb3BlcnRpZXMub25Gb2N1cygpO1xyXG4gICAgfTtcclxuICAgIEJ1dHRvbkJhc2UucHJvdG90eXBlLl9vbktleURvd24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMub25LZXlEb3duICYmIHRoaXMucHJvcGVydGllcy5vbktleURvd24oZXZlbnQud2hpY2gsIGZ1bmN0aW9uICgpIHsgZXZlbnQucHJldmVudERlZmF1bHQoKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgQnV0dG9uQmFzZS5wcm90b3R5cGUuX29uS2V5UHJlc3MgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMub25LZXlQcmVzcyAmJiB0aGlzLnByb3BlcnRpZXMub25LZXlQcmVzcyhldmVudC53aGljaCwgZnVuY3Rpb24gKCkgeyBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyB9KTtcclxuICAgIH07XHJcbiAgICBCdXR0b25CYXNlLnByb3RvdHlwZS5fb25LZXlVcCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcy5vbktleVVwICYmIHRoaXMucHJvcGVydGllcy5vbktleVVwKGV2ZW50LndoaWNoLCBmdW5jdGlvbiAoKSB7IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IH0pO1xyXG4gICAgfTtcclxuICAgIEJ1dHRvbkJhc2UucHJvdG90eXBlLl9vbk1vdXNlRG93biA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcy5vbk1vdXNlRG93biAmJiB0aGlzLnByb3BlcnRpZXMub25Nb3VzZURvd24oKTtcclxuICAgIH07XHJcbiAgICBCdXR0b25CYXNlLnByb3RvdHlwZS5fb25Nb3VzZVVwID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLm9uTW91c2VVcCAmJiB0aGlzLnByb3BlcnRpZXMub25Nb3VzZVVwKCk7XHJcbiAgICB9O1xyXG4gICAgQnV0dG9uQmFzZS5wcm90b3R5cGUuX29uVG91Y2hTdGFydCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcy5vblRvdWNoU3RhcnQgJiYgdGhpcy5wcm9wZXJ0aWVzLm9uVG91Y2hTdGFydCgpO1xyXG4gICAgfTtcclxuICAgIEJ1dHRvbkJhc2UucHJvdG90eXBlLl9vblRvdWNoRW5kID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLm9uVG91Y2hFbmQgJiYgdGhpcy5wcm9wZXJ0aWVzLm9uVG91Y2hFbmQoKTtcclxuICAgIH07XHJcbiAgICBCdXR0b25CYXNlLnByb3RvdHlwZS5fb25Ub3VjaENhbmNlbCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcy5vblRvdWNoQ2FuY2VsICYmIHRoaXMucHJvcGVydGllcy5vblRvdWNoQ2FuY2VsKCk7XHJcbiAgICB9O1xyXG4gICAgQnV0dG9uQmFzZS5wcm90b3R5cGUuZ2V0Q29udGVudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbjtcclxuICAgIH07XHJcbiAgICBCdXR0b25CYXNlLnByb3RvdHlwZS5nZXRNb2RpZmllckNsYXNzZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF9hID0gdGhpcy5wcm9wZXJ0aWVzLCBkaXNhYmxlZCA9IF9hLmRpc2FibGVkLCBfYiA9IF9hLnBvcHVwLCBwb3B1cCA9IF9iID09PSB2b2lkIDAgPyBmYWxzZSA6IF9iLCBwcmVzc2VkID0gX2EucHJlc3NlZDtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBkaXNhYmxlZCA/IGNzcy5kaXNhYmxlZCA6IG51bGwsXHJcbiAgICAgICAgICAgIHBvcHVwID8gY3NzLnBvcHVwIDogbnVsbCxcclxuICAgICAgICAgICAgcHJlc3NlZCA/IGNzcy5wcmVzc2VkIDogbnVsbFxyXG4gICAgICAgIF07XHJcbiAgICB9O1xyXG4gICAgQnV0dG9uQmFzZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfYSA9IHRoaXMucHJvcGVydGllcywgX2IgPSBfYS5hcmlhLCBhcmlhID0gX2IgPT09IHZvaWQgMCA/IHt9IDogX2IsIGRpc2FibGVkID0gX2EuZGlzYWJsZWQsIGlkID0gX2EuaWQsIF9jID0gX2EucG9wdXAsIHBvcHVwID0gX2MgPT09IHZvaWQgMCA/IGZhbHNlIDogX2MsIG5hbWUgPSBfYS5uYW1lLCBwcmVzc2VkID0gX2EucHJlc3NlZCwgdHlwZSA9IF9hLnR5cGUsIHZhbHVlID0gX2EudmFsdWU7XHJcbiAgICAgICAgaWYgKHBvcHVwID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHBvcHVwID0geyBleHBhbmRlZDogZmFsc2UsIGlkOiAnJyB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZF8xLnYoJ2J1dHRvbicsIHRzbGliXzEuX19hc3NpZ24oeyBjbGFzc2VzOiB0aGlzLnRoZW1lKHRzbGliXzEuX19zcHJlYWQoW2Nzcy5yb290XSwgdGhpcy5nZXRNb2RpZmllckNsYXNzZXMoKSkpLCBkaXNhYmxlZDogZGlzYWJsZWQsXHJcbiAgICAgICAgICAgIGlkOiBpZCxcclxuICAgICAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLCBvbmJsdXI6IHRoaXMuX29uQmx1ciwgb25jbGljazogdGhpcy5fb25DbGljaywgb25mb2N1czogdGhpcy5fb25Gb2N1cywgb25rZXlkb3duOiB0aGlzLl9vbktleURvd24sIG9ua2V5cHJlc3M6IHRoaXMuX29uS2V5UHJlc3MsIG9ua2V5dXA6IHRoaXMuX29uS2V5VXAsIG9ubW91c2Vkb3duOiB0aGlzLl9vbk1vdXNlRG93biwgb25tb3VzZXVwOiB0aGlzLl9vbk1vdXNlVXAsIG9udG91Y2hzdGFydDogdGhpcy5fb25Ub3VjaFN0YXJ0LCBvbnRvdWNoZW5kOiB0aGlzLl9vblRvdWNoRW5kLCBvbnRvdWNoY2FuY2VsOiB0aGlzLl9vblRvdWNoQ2FuY2VsIH0sIHV0aWxfMS5mb3JtYXRBcmlhUHJvcGVydGllcyhhcmlhKSwgeyAnYXJpYS1oYXNwb3B1cCc6IHBvcHVwID8gJ3RydWUnIDogbnVsbCwgJ2FyaWEtY29udHJvbHMnOiBwb3B1cCA/IHBvcHVwLmlkIDogbnVsbCwgJ2FyaWEtZXhwYW5kZWQnOiBwb3B1cCA/IHBvcHVwLmV4cGFuZGVkICsgJycgOiBudWxsLCAnYXJpYS1wcmVzc2VkJzogdHlwZW9mIHByZXNzZWQgPT09ICdib29sZWFuJyA/IHByZXNzZWQudG9TdHJpbmcoKSA6IG51bGwgfSksIHRzbGliXzEuX19zcHJlYWQodGhpcy5nZXRDb250ZW50KCksIFtcclxuICAgICAgICAgICAgcG9wdXAgPyBkXzEudignc3BhbicsIHsgY2xhc3NlczogdGhpcy50aGVtZShjc3MuYWRkb24pIH0sIFtcclxuICAgICAgICAgICAgICAgIGRfMS53KGluZGV4XzEuZGVmYXVsdCwgeyB0eXBlOiAnZG93bkljb24nIH0pXHJcbiAgICAgICAgICAgIF0pIDogbnVsbFxyXG4gICAgICAgIF0pKTtcclxuICAgIH07XHJcbiAgICBCdXR0b25CYXNlID0gdHNsaWJfMS5fX2RlY29yYXRlKFtcclxuICAgICAgICBUaGVtZWRfMS50aGVtZShjc3MpLFxyXG4gICAgICAgIGN1c3RvbUVsZW1lbnRfMS5jdXN0b21FbGVtZW50KHtcclxuICAgICAgICAgICAgdGFnOiAnZG9qby1idXR0b24nLFxyXG4gICAgICAgICAgICBjaGlsZFR5cGU6IHJlZ2lzdGVyQ3VzdG9tRWxlbWVudF8xLkN1c3RvbUVsZW1lbnRDaGlsZFR5cGUuVEVYVCxcclxuICAgICAgICAgICAgcHJvcGVydGllczogWydkaXNhYmxlZCcsICdwcmVzc2VkJywgJ3BvcHVwJywgJ3RoZW1lJywgJ2FyaWEnLCAnZXh0cmFDbGFzc2VzJ10sXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IFsnaWQnLCAnbmFtZScsICd2YWx1ZSddLFxyXG4gICAgICAgICAgICBldmVudHM6IFtcclxuICAgICAgICAgICAgICAgICdvbkJsdXInLFxyXG4gICAgICAgICAgICAgICAgJ29uQ2hhbmdlJyxcclxuICAgICAgICAgICAgICAgICdvbkNsaWNrJyxcclxuICAgICAgICAgICAgICAgICdvbkZvY3VzJyxcclxuICAgICAgICAgICAgICAgICdvbklucHV0JyxcclxuICAgICAgICAgICAgICAgICdvbktleURvd24nLFxyXG4gICAgICAgICAgICAgICAgJ29uS2V5UHJlc3MnLFxyXG4gICAgICAgICAgICAgICAgJ29uS2V5VXAnLFxyXG4gICAgICAgICAgICAgICAgJ29uTW91c2VEb3duJyxcclxuICAgICAgICAgICAgICAgICdvbk1vdXNlVXAnLFxyXG4gICAgICAgICAgICAgICAgJ29uVG91Y2hDYW5jZWwnLFxyXG4gICAgICAgICAgICAgICAgJ29uVG91Y2hFbmQnLFxyXG4gICAgICAgICAgICAgICAgJ29uVG91Y2hTdGFydCdcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pXHJcbiAgICBdLCBCdXR0b25CYXNlKTtcclxuICAgIHJldHVybiBCdXR0b25CYXNlO1xyXG59KGV4cG9ydHMuVGhlbWVkQmFzZSkpO1xyXG5leHBvcnRzLkJ1dHRvbkJhc2UgPSBCdXR0b25CYXNlO1xyXG52YXIgQnV0dG9uID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoQnV0dG9uLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gQnV0dG9uKCkge1xyXG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgIH1cclxuICAgIHJldHVybiBCdXR0b247XHJcbn0oQnV0dG9uQmFzZSkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBCdXR0b247XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy9idXR0b24vaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvYnV0dG9uL2luZGV4LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy9jb21tb24vc3R5bGVzL2Jhc2UubS5jc3Ncbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvY29tbW9uL3N0eWxlcy9iYXNlLm0uY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsInJlcXVpcmUoJ2M6L1VzZXJzL2Rqb25lcy5TQUNCVUsvRG9jdW1lbnRzL2Rldi9kb2pvLXR1dHMvMTAxNV9mb3JtX3ZhbGlkYXRpb24vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvY29tbW9uL3N0eWxlcy9iYXNlLm0uY3NzJyk7XG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbmlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0ZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiAoZmFjdG9yeSgpKTsgfSk7XG59IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xufVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB7XCJ2aXN1YWxseUhpZGRlblwiOlwiXzFBZVdlQXByXCIsXCJmb2N1c2FibGVcIjpcIl8xX3FBTnFYaVwiLFwiaGlkZGVuXCI6XCJfM1FkZFVpQlVcIixcIiBfa2V5XCI6XCJAZG9qby93aWRnZXRzL2Jhc2VcIn07XG59KSk7O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvY29tbW9uL3N0eWxlcy9iYXNlLm0uY3NzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL2NvbW1vbi9zdHlsZXMvYmFzZS5tLmNzcy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5mdW5jdGlvbiBmb3JtYXRBcmlhUHJvcGVydGllcyhhcmlhKSB7XHJcbiAgICB2YXIgZm9ybWF0dGVkQXJpYSA9IE9iamVjdC5rZXlzKGFyaWEpLnJlZHVjZShmdW5jdGlvbiAoYSwga2V5KSB7XHJcbiAgICAgICAgYVtcImFyaWEtXCIgKyBrZXkudG9Mb3dlckNhc2UoKV0gPSBhcmlhW2tleV07XHJcbiAgICAgICAgcmV0dXJuIGE7XHJcbiAgICB9LCB7fSk7XHJcbiAgICByZXR1cm4gZm9ybWF0dGVkQXJpYTtcclxufVxyXG5leHBvcnRzLmZvcm1hdEFyaWFQcm9wZXJ0aWVzID0gZm9ybWF0QXJpYVByb3BlcnRpZXM7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy9jb21tb24vdXRpbC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy9jb21tb24vdXRpbC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcclxudmFyIFdpZGdldEJhc2VfMSA9IHJlcXVpcmUoXCJAZG9qby93aWRnZXQtY29yZS9XaWRnZXRCYXNlXCIpO1xyXG52YXIgVGhlbWVkXzEgPSByZXF1aXJlKFwiQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZFwiKTtcclxudmFyIGRfMSA9IHJlcXVpcmUoXCJAZG9qby93aWRnZXQtY29yZS9kXCIpO1xyXG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4uL2NvbW1vbi91dGlsXCIpO1xyXG52YXIgY3NzID0gcmVxdWlyZShcIi4uL3RoZW1lL2ljb24ubS5jc3NcIik7XHJcbnZhciBiYXNlQ3NzID0gcmVxdWlyZShcIi4uL2NvbW1vbi9zdHlsZXMvYmFzZS5tLmNzc1wiKTtcclxudmFyIGN1c3RvbUVsZW1lbnRfMSA9IHJlcXVpcmUoXCJAZG9qby93aWRnZXQtY29yZS9kZWNvcmF0b3JzL2N1c3RvbUVsZW1lbnRcIik7XHJcbmV4cG9ydHMuVGhlbWVkQmFzZSA9IFRoZW1lZF8xLlRoZW1lZE1peGluKFdpZGdldEJhc2VfMS5XaWRnZXRCYXNlKTtcclxudmFyIEljb25CYXNlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoSWNvbkJhc2UsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBJY29uQmFzZSgpIHtcclxuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICB9XHJcbiAgICBJY29uQmFzZS5wcm90b3R5cGUucmVuZGVyQWx0VGV4dCA9IGZ1bmN0aW9uIChhbHRUZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIGRfMS52KCdzcGFuJywgeyBjbGFzc2VzOiBbYmFzZUNzcy52aXN1YWxseUhpZGRlbl0gfSwgW2FsdFRleHRdKTtcclxuICAgIH07XHJcbiAgICBJY29uQmFzZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfYSA9IHRoaXMucHJvcGVydGllcywgX2IgPSBfYS5hcmlhLCBhcmlhID0gX2IgPT09IHZvaWQgMCA/IHtcclxuICAgICAgICAgICAgaGlkZGVuOiAndHJ1ZSdcclxuICAgICAgICB9IDogX2IsIHR5cGUgPSBfYS50eXBlLCBhbHRUZXh0ID0gX2EuYWx0VGV4dDtcclxuICAgICAgICByZXR1cm4gZF8xLnYoJ3NwYW4nLCB7IGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLnJvb3QpIH0sIFtcclxuICAgICAgICAgICAgZF8xLnYoJ2knLCB0c2xpYl8xLl9fYXNzaWduKHt9LCB1dGlsXzEuZm9ybWF0QXJpYVByb3BlcnRpZXMoYXJpYSksIHsgY2xhc3NlczogdGhpcy50aGVtZShbY3NzLmljb24sIGNzc1t0eXBlXV0pIH0pKSxcclxuICAgICAgICAgICAgYWx0VGV4dCA/IHRoaXMucmVuZGVyQWx0VGV4dChhbHRUZXh0KSA6IG51bGxcclxuICAgICAgICBdKTtcclxuICAgIH07XHJcbiAgICBJY29uQmFzZSA9IHRzbGliXzEuX19kZWNvcmF0ZShbXHJcbiAgICAgICAgVGhlbWVkXzEudGhlbWUoY3NzKSxcclxuICAgICAgICBjdXN0b21FbGVtZW50XzEuY3VzdG9tRWxlbWVudCh7XHJcbiAgICAgICAgICAgIHRhZzogJ2Rvam8taWNvbicsXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IFtcclxuICAgICAgICAgICAgICAgICd0aGVtZScsXHJcbiAgICAgICAgICAgICAgICAnYXJpYScsXHJcbiAgICAgICAgICAgICAgICAnZXh0cmFDbGFzc2VzJ1xyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBbJ3R5cGUnLCAnYWx0VGV4dCddXHJcbiAgICAgICAgfSlcclxuICAgIF0sIEljb25CYXNlKTtcclxuICAgIHJldHVybiBJY29uQmFzZTtcclxufShleHBvcnRzLlRoZW1lZEJhc2UpKTtcclxuZXhwb3J0cy5JY29uQmFzZSA9IEljb25CYXNlO1xyXG52YXIgSWNvbiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKEljb24sIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBJY29uKCkge1xyXG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgIH1cclxuICAgIHJldHVybiBJY29uO1xyXG59KEljb25CYXNlKSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEljb247XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy9pY29uL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL2ljb24vaW5kZXguanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XHJcbnZhciBXaWRnZXRCYXNlXzEgPSByZXF1aXJlKFwiQGRvam8vd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZVwiKTtcclxudmFyIFRoZW1lZF8xID0gcmVxdWlyZShcIkBkb2pvL3dpZGdldC1jb3JlL21peGlucy9UaGVtZWRcIik7XHJcbnZhciBkXzEgPSByZXF1aXJlKFwiQGRvam8vd2lkZ2V0LWNvcmUvZFwiKTtcclxudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuLi9jb21tb24vdXRpbFwiKTtcclxudmFyIGNzcyA9IHJlcXVpcmUoXCIuLi90aGVtZS9sYWJlbC5tLmNzc1wiKTtcclxudmFyIGJhc2VDc3MgPSByZXF1aXJlKFwiLi4vY29tbW9uL3N0eWxlcy9iYXNlLm0uY3NzXCIpO1xyXG52YXIgY3VzdG9tRWxlbWVudF8xID0gcmVxdWlyZShcIkBkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvY3VzdG9tRWxlbWVudFwiKTtcclxuZXhwb3J0cy5UaGVtZWRCYXNlID0gVGhlbWVkXzEuVGhlbWVkTWl4aW4oV2lkZ2V0QmFzZV8xLldpZGdldEJhc2UpO1xyXG52YXIgTGFiZWxCYXNlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoTGFiZWxCYXNlLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gTGFiZWxCYXNlKCkge1xyXG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgIH1cclxuICAgIExhYmVsQmFzZS5wcm90b3R5cGUuZ2V0Um9vdENsYXNzZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF9hID0gdGhpcy5wcm9wZXJ0aWVzLCBkaXNhYmxlZCA9IF9hLmRpc2FibGVkLCBmb2N1c2VkID0gX2EuZm9jdXNlZCwgaW52YWxpZCA9IF9hLmludmFsaWQsIHJlYWRPbmx5ID0gX2EucmVhZE9ubHksIHJlcXVpcmVkID0gX2EucmVxdWlyZWQsIHNlY29uZGFyeSA9IF9hLnNlY29uZGFyeTtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBjc3Mucm9vdCxcclxuICAgICAgICAgICAgZGlzYWJsZWQgPyBjc3MuZGlzYWJsZWQgOiBudWxsLFxyXG4gICAgICAgICAgICBmb2N1c2VkID8gY3NzLmZvY3VzZWQgOiBudWxsLFxyXG4gICAgICAgICAgICBpbnZhbGlkID09PSB0cnVlID8gY3NzLmludmFsaWQgOiBudWxsLFxyXG4gICAgICAgICAgICBpbnZhbGlkID09PSBmYWxzZSA/IGNzcy52YWxpZCA6IG51bGwsXHJcbiAgICAgICAgICAgIHJlYWRPbmx5ID8gY3NzLnJlYWRvbmx5IDogbnVsbCxcclxuICAgICAgICAgICAgcmVxdWlyZWQgPyBjc3MucmVxdWlyZWQgOiBudWxsLFxyXG4gICAgICAgICAgICBzZWNvbmRhcnkgPyBjc3Muc2Vjb25kYXJ5IDogbnVsbFxyXG4gICAgICAgIF07XHJcbiAgICB9O1xyXG4gICAgTGFiZWxCYXNlLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF9hID0gdGhpcy5wcm9wZXJ0aWVzLCBfYiA9IF9hLmFyaWEsIGFyaWEgPSBfYiA9PT0gdm9pZCAwID8ge30gOiBfYiwgZm9ySWQgPSBfYS5mb3JJZCwgaGlkZGVuID0gX2EuaGlkZGVuO1xyXG4gICAgICAgIHJldHVybiBkXzEudignbGFiZWwnLCB0c2xpYl8xLl9fYXNzaWduKHt9LCB1dGlsXzEuZm9ybWF0QXJpYVByb3BlcnRpZXMoYXJpYSksIHsgY2xhc3NlczogdHNsaWJfMS5fX3NwcmVhZCh0aGlzLnRoZW1lKHRoaXMuZ2V0Um9vdENsYXNzZXMoKSksIFtcclxuICAgICAgICAgICAgICAgIGhpZGRlbiA/IGJhc2VDc3MudmlzdWFsbHlIaWRkZW4gOiBudWxsXHJcbiAgICAgICAgICAgIF0pLCBmb3I6IGZvcklkIH0pLCB0aGlzLmNoaWxkcmVuKTtcclxuICAgIH07XHJcbiAgICBMYWJlbEJhc2UgPSB0c2xpYl8xLl9fZGVjb3JhdGUoW1xyXG4gICAgICAgIFRoZW1lZF8xLnRoZW1lKGNzcyksXHJcbiAgICAgICAgY3VzdG9tRWxlbWVudF8xLmN1c3RvbUVsZW1lbnQoe1xyXG4gICAgICAgICAgICB0YWc6ICdkb2pvLWxhYmVsJyxcclxuICAgICAgICAgICAgcHJvcGVydGllczogWyd0aGVtZScsICdhcmlhJywgJ2V4dHJhQ2xhc3NlcycsICdkaXNhYmxlZCcsICdmb2N1c2VkJywgJ3JlYWRPbmx5JywgJ3JlcXVpcmVkJywgJ2ludmFsaWQnLCAnaGlkZGVuJywgJ3NlY29uZGFyeSddLFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBbXSxcclxuICAgICAgICAgICAgZXZlbnRzOiBbXVxyXG4gICAgICAgIH0pXHJcbiAgICBdLCBMYWJlbEJhc2UpO1xyXG4gICAgcmV0dXJuIExhYmVsQmFzZTtcclxufShleHBvcnRzLlRoZW1lZEJhc2UpKTtcclxuZXhwb3J0cy5MYWJlbEJhc2UgPSBMYWJlbEJhc2U7XHJcbnZhciBMYWJlbCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKExhYmVsLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gTGFiZWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIExhYmVsO1xyXG59KExhYmVsQmFzZSkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBMYWJlbDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL2xhYmVsL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL2xhYmVsL2luZGV4LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xyXG52YXIgV2lkZ2V0QmFzZV8xID0gcmVxdWlyZShcIkBkb2pvL3dpZGdldC1jb3JlL1dpZGdldEJhc2VcIik7XHJcbnZhciBUaGVtZWRfMSA9IHJlcXVpcmUoXCJAZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkXCIpO1xyXG52YXIgZF8xID0gcmVxdWlyZShcIkBkb2pvL3dpZGdldC1jb3JlL2RcIik7XHJcbnZhciBGb2N1c18xID0gcmVxdWlyZShcIkBkb2pvL3dpZGdldC1jb3JlL21ldGEvRm9jdXNcIik7XHJcbnZhciBpbmRleF8xID0gcmVxdWlyZShcIi4uL2xhYmVsL2luZGV4XCIpO1xyXG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4uL2NvbW1vbi91dGlsXCIpO1xyXG52YXIgdXVpZF8xID0gcmVxdWlyZShcIkBkb2pvL2NvcmUvdXVpZFwiKTtcclxudmFyIGNzcyA9IHJlcXVpcmUoXCIuLi90aGVtZS90ZXh0LWlucHV0Lm0uY3NzXCIpO1xyXG52YXIgY3VzdG9tRWxlbWVudF8xID0gcmVxdWlyZShcIkBkb2pvL3dpZGdldC1jb3JlL2RlY29yYXRvcnMvY3VzdG9tRWxlbWVudFwiKTtcclxuZXhwb3J0cy5UaGVtZWRCYXNlID0gVGhlbWVkXzEuVGhlbWVkTWl4aW4oV2lkZ2V0QmFzZV8xLldpZGdldEJhc2UpO1xyXG52YXIgVGV4dElucHV0QmFzZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKFRleHRJbnB1dEJhc2UsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBUZXh0SW5wdXRCYXNlKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuX3V1aWQgPSB1dWlkXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIFRleHRJbnB1dEJhc2UucHJvdG90eXBlLl9vbkJsdXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMub25CbHVyICYmIHRoaXMucHJvcGVydGllcy5vbkJsdXIoZXZlbnQudGFyZ2V0LnZhbHVlKTtcclxuICAgIH07XHJcbiAgICBUZXh0SW5wdXRCYXNlLnByb3RvdHlwZS5fb25DaGFuZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMub25DaGFuZ2UgJiYgdGhpcy5wcm9wZXJ0aWVzLm9uQ2hhbmdlKGV2ZW50LnRhcmdldC52YWx1ZSk7XHJcbiAgICB9O1xyXG4gICAgVGV4dElucHV0QmFzZS5wcm90b3R5cGUuX29uQ2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMub25DbGljayAmJiB0aGlzLnByb3BlcnRpZXMub25DbGljayhldmVudC50YXJnZXQudmFsdWUpO1xyXG4gICAgfTtcclxuICAgIFRleHRJbnB1dEJhc2UucHJvdG90eXBlLl9vbkZvY3VzID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLm9uRm9jdXMgJiYgdGhpcy5wcm9wZXJ0aWVzLm9uRm9jdXMoZXZlbnQudGFyZ2V0LnZhbHVlKTtcclxuICAgIH07XHJcbiAgICBUZXh0SW5wdXRCYXNlLnByb3RvdHlwZS5fb25JbnB1dCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcy5vbklucHV0ICYmIHRoaXMucHJvcGVydGllcy5vbklucHV0KGV2ZW50LnRhcmdldC52YWx1ZSk7XHJcbiAgICB9O1xyXG4gICAgVGV4dElucHV0QmFzZS5wcm90b3R5cGUuX29uS2V5RG93biA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcy5vbktleURvd24gJiYgdGhpcy5wcm9wZXJ0aWVzLm9uS2V5RG93bihldmVudC53aGljaCwgZnVuY3Rpb24gKCkgeyBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyB9KTtcclxuICAgIH07XHJcbiAgICBUZXh0SW5wdXRCYXNlLnByb3RvdHlwZS5fb25LZXlQcmVzcyA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcy5vbktleVByZXNzICYmIHRoaXMucHJvcGVydGllcy5vbktleVByZXNzKGV2ZW50LndoaWNoLCBmdW5jdGlvbiAoKSB7IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IH0pO1xyXG4gICAgfTtcclxuICAgIFRleHRJbnB1dEJhc2UucHJvdG90eXBlLl9vbktleVVwID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLm9uS2V5VXAgJiYgdGhpcy5wcm9wZXJ0aWVzLm9uS2V5VXAoZXZlbnQud2hpY2gsIGZ1bmN0aW9uICgpIHsgZXZlbnQucHJldmVudERlZmF1bHQoKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgVGV4dElucHV0QmFzZS5wcm90b3R5cGUuX29uTW91c2VEb3duID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLm9uTW91c2VEb3duICYmIHRoaXMucHJvcGVydGllcy5vbk1vdXNlRG93bigpO1xyXG4gICAgfTtcclxuICAgIFRleHRJbnB1dEJhc2UucHJvdG90eXBlLl9vbk1vdXNlVXAgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMub25Nb3VzZVVwICYmIHRoaXMucHJvcGVydGllcy5vbk1vdXNlVXAoKTtcclxuICAgIH07XHJcbiAgICBUZXh0SW5wdXRCYXNlLnByb3RvdHlwZS5fb25Ub3VjaFN0YXJ0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLm9uVG91Y2hTdGFydCAmJiB0aGlzLnByb3BlcnRpZXMub25Ub3VjaFN0YXJ0KCk7XHJcbiAgICB9O1xyXG4gICAgVGV4dElucHV0QmFzZS5wcm90b3R5cGUuX29uVG91Y2hFbmQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMub25Ub3VjaEVuZCAmJiB0aGlzLnByb3BlcnRpZXMub25Ub3VjaEVuZCgpO1xyXG4gICAgfTtcclxuICAgIFRleHRJbnB1dEJhc2UucHJvdG90eXBlLl9vblRvdWNoQ2FuY2VsID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLm9uVG91Y2hDYW5jZWwgJiYgdGhpcy5wcm9wZXJ0aWVzLm9uVG91Y2hDYW5jZWwoKTtcclxuICAgIH07XHJcbiAgICBUZXh0SW5wdXRCYXNlLnByb3RvdHlwZS5nZXRSb290Q2xhc3NlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX2EgPSB0aGlzLnByb3BlcnRpZXMsIGRpc2FibGVkID0gX2EuZGlzYWJsZWQsIGludmFsaWQgPSBfYS5pbnZhbGlkLCByZWFkT25seSA9IF9hLnJlYWRPbmx5LCByZXF1aXJlZCA9IF9hLnJlcXVpcmVkO1xyXG4gICAgICAgIHZhciBmb2N1cyA9IHRoaXMubWV0YShGb2N1c18xLmRlZmF1bHQpLmdldCgncm9vdCcpO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIGNzcy5yb290LFxyXG4gICAgICAgICAgICBkaXNhYmxlZCA/IGNzcy5kaXNhYmxlZCA6IG51bGwsXHJcbiAgICAgICAgICAgIGZvY3VzLmNvbnRhaW5zRm9jdXMgPyBjc3MuZm9jdXNlZCA6IG51bGwsXHJcbiAgICAgICAgICAgIGludmFsaWQgPT09IHRydWUgPyBjc3MuaW52YWxpZCA6IG51bGwsXHJcbiAgICAgICAgICAgIGludmFsaWQgPT09IGZhbHNlID8gY3NzLnZhbGlkIDogbnVsbCxcclxuICAgICAgICAgICAgcmVhZE9ubHkgPyBjc3MucmVhZG9ubHkgOiBudWxsLFxyXG4gICAgICAgICAgICByZXF1aXJlZCA/IGNzcy5yZXF1aXJlZCA6IG51bGxcclxuICAgICAgICBdO1xyXG4gICAgfTtcclxuICAgIFRleHRJbnB1dEJhc2UucHJvdG90eXBlLnJlbmRlcklucHV0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfYSA9IHRoaXMucHJvcGVydGllcywgX2IgPSBfYS5hcmlhLCBhcmlhID0gX2IgPT09IHZvaWQgMCA/IHt9IDogX2IsIGRpc2FibGVkID0gX2EuZGlzYWJsZWQsIF9jID0gX2EuaWQsIGlkID0gX2MgPT09IHZvaWQgMCA/IHRoaXMuX3V1aWQgOiBfYywgaW52YWxpZCA9IF9hLmludmFsaWQsIG1heExlbmd0aCA9IF9hLm1heExlbmd0aCwgbWluTGVuZ3RoID0gX2EubWluTGVuZ3RoLCBuYW1lID0gX2EubmFtZSwgcGxhY2Vob2xkZXIgPSBfYS5wbGFjZWhvbGRlciwgcmVhZE9ubHkgPSBfYS5yZWFkT25seSwgcmVxdWlyZWQgPSBfYS5yZXF1aXJlZCwgX2QgPSBfYS50eXBlLCB0eXBlID0gX2QgPT09IHZvaWQgMCA/ICd0ZXh0JyA6IF9kLCB2YWx1ZSA9IF9hLnZhbHVlLCBzaG91bGRGb2N1cyA9IF9hLnNob3VsZEZvY3VzO1xyXG4gICAgICAgIGlmIChzaG91bGRGb2N1cykge1xyXG4gICAgICAgICAgICB0aGlzLm1ldGEoRm9jdXNfMS5kZWZhdWx0KS5zZXQoJ2lucHV0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkXzEudignaW5wdXQnLCB0c2xpYl8xLl9fYXNzaWduKHt9LCB1dGlsXzEuZm9ybWF0QXJpYVByb3BlcnRpZXMoYXJpYSksIHsgJ2FyaWEtaW52YWxpZCc6IGludmFsaWQgPyAndHJ1ZScgOiBudWxsLCBjbGFzc2VzOiB0aGlzLnRoZW1lKGNzcy5pbnB1dCksIGRpc2FibGVkOiBkaXNhYmxlZCxcclxuICAgICAgICAgICAgaWQ6IGlkLCBrZXk6ICdpbnB1dCcsIG1heGxlbmd0aDogbWF4TGVuZ3RoID8gXCJcIiArIG1heExlbmd0aCA6IG51bGwsIG1pbmxlbmd0aDogbWluTGVuZ3RoID8gXCJcIiArIG1pbkxlbmd0aCA6IG51bGwsIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBwbGFjZWhvbGRlcixcclxuICAgICAgICAgICAgcmVhZE9ubHk6IHJlYWRPbmx5LCAnYXJpYS1yZWFkb25seSc6IHJlYWRPbmx5ID8gJ3RydWUnIDogbnVsbCwgcmVxdWlyZWQ6IHJlcXVpcmVkLFxyXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsIG9uYmx1cjogdGhpcy5fb25CbHVyLCBvbmNoYW5nZTogdGhpcy5fb25DaGFuZ2UsIG9uY2xpY2s6IHRoaXMuX29uQ2xpY2ssIG9uZm9jdXM6IHRoaXMuX29uRm9jdXMsIG9uaW5wdXQ6IHRoaXMuX29uSW5wdXQsIG9ua2V5ZG93bjogdGhpcy5fb25LZXlEb3duLCBvbmtleXByZXNzOiB0aGlzLl9vbktleVByZXNzLCBvbmtleXVwOiB0aGlzLl9vbktleVVwLCBvbm1vdXNlZG93bjogdGhpcy5fb25Nb3VzZURvd24sIG9ubW91c2V1cDogdGhpcy5fb25Nb3VzZVVwLCBvbnRvdWNoc3RhcnQ6IHRoaXMuX29uVG91Y2hTdGFydCwgb250b3VjaGVuZDogdGhpcy5fb25Ub3VjaEVuZCwgb250b3VjaGNhbmNlbDogdGhpcy5fb25Ub3VjaENhbmNlbCB9KSk7XHJcbiAgICB9O1xyXG4gICAgVGV4dElucHV0QmFzZS5wcm90b3R5cGUucmVuZGVySW5wdXRXcmFwcGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBkXzEudignZGl2JywgeyBjbGFzc2VzOiB0aGlzLnRoZW1lKGNzcy5pbnB1dFdyYXBwZXIpIH0sIFtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJJbnB1dCgpXHJcbiAgICAgICAgXSk7XHJcbiAgICB9O1xyXG4gICAgVGV4dElucHV0QmFzZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfYSA9IHRoaXMucHJvcGVydGllcywgZGlzYWJsZWQgPSBfYS5kaXNhYmxlZCwgX2IgPSBfYS5pZCwgaWQgPSBfYiA9PT0gdm9pZCAwID8gdGhpcy5fdXVpZCA6IF9iLCBpbnZhbGlkID0gX2EuaW52YWxpZCwgbGFiZWwgPSBfYS5sYWJlbCwgX2MgPSBfYS5sYWJlbEFmdGVyLCBsYWJlbEFmdGVyID0gX2MgPT09IHZvaWQgMCA/IGZhbHNlIDogX2MsIF9kID0gX2EubGFiZWxIaWRkZW4sIGxhYmVsSGlkZGVuID0gX2QgPT09IHZvaWQgMCA/IGZhbHNlIDogX2QsIHJlYWRPbmx5ID0gX2EucmVhZE9ubHksIHJlcXVpcmVkID0gX2EucmVxdWlyZWQsIHRoZW1lID0gX2EudGhlbWU7XHJcbiAgICAgICAgdmFyIGZvY3VzID0gdGhpcy5tZXRhKEZvY3VzXzEuZGVmYXVsdCkuZ2V0KCdyb290Jyk7XHJcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gW1xyXG4gICAgICAgICAgICBsYWJlbCA/IGRfMS53KGluZGV4XzEuZGVmYXVsdCwge1xyXG4gICAgICAgICAgICAgICAgdGhlbWU6IHRoZW1lLFxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ6IGRpc2FibGVkLFxyXG4gICAgICAgICAgICAgICAgZm9jdXNlZDogZm9jdXMuY29udGFpbnNGb2N1cyxcclxuICAgICAgICAgICAgICAgIGludmFsaWQ6IGludmFsaWQsXHJcbiAgICAgICAgICAgICAgICByZWFkT25seTogcmVhZE9ubHksXHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogcmVxdWlyZWQsXHJcbiAgICAgICAgICAgICAgICBoaWRkZW46IGxhYmVsSGlkZGVuLFxyXG4gICAgICAgICAgICAgICAgZm9ySWQ6IGlkXHJcbiAgICAgICAgICAgIH0sIFtsYWJlbF0pIDogbnVsbCxcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJJbnB1dFdyYXBwZXIoKVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgcmV0dXJuIGRfMS52KCdkaXYnLCB7XHJcbiAgICAgICAgICAgIGtleTogJ3Jvb3QnLFxyXG4gICAgICAgICAgICBjbGFzc2VzOiB0aGlzLnRoZW1lKHRoaXMuZ2V0Um9vdENsYXNzZXMoKSlcclxuICAgICAgICB9LCBsYWJlbEFmdGVyID8gY2hpbGRyZW4ucmV2ZXJzZSgpIDogY2hpbGRyZW4pO1xyXG4gICAgfTtcclxuICAgIFRleHRJbnB1dEJhc2UgPSB0c2xpYl8xLl9fZGVjb3JhdGUoW1xyXG4gICAgICAgIFRoZW1lZF8xLnRoZW1lKGNzcyksXHJcbiAgICAgICAgY3VzdG9tRWxlbWVudF8xLmN1c3RvbUVsZW1lbnQoe1xyXG4gICAgICAgICAgICB0YWc6ICdkb2pvLXRleHQtaW5wdXQnLFxyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiBbXHJcbiAgICAgICAgICAgICAgICAndGhlbWUnLFxyXG4gICAgICAgICAgICAgICAgJ2FyaWEnLFxyXG4gICAgICAgICAgICAgICAgJ2V4dHJhQ2xhc3NlcycsXHJcbiAgICAgICAgICAgICAgICAnYXJpYScsXHJcbiAgICAgICAgICAgICAgICAnc2hvdWxkRm9jdXMnLFxyXG4gICAgICAgICAgICAgICAgJ2Rpc2FibGVkJyxcclxuICAgICAgICAgICAgICAgICdpbnZhbGlkJyxcclxuICAgICAgICAgICAgICAgICdyZWFkT25seSdcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgYXR0cmlidXRlczogWydsYWJlbCcsICdwbGFjZWhvbGRlcicsICdjb250cm9scycsICd0eXBlJywgJ21pbkxlbmd0aCcsICdtYXhMZW5ndGgnLCAndmFsdWUnLCAnbmFtZSddLFxyXG4gICAgICAgICAgICBldmVudHM6IFtcclxuICAgICAgICAgICAgICAgICdvbkJsdXInLFxyXG4gICAgICAgICAgICAgICAgJ29uQ2hhbmdlJyxcclxuICAgICAgICAgICAgICAgICdvbkNsaWNrJyxcclxuICAgICAgICAgICAgICAgICdvbkZvY3VzJyxcclxuICAgICAgICAgICAgICAgICdvbklucHV0JyxcclxuICAgICAgICAgICAgICAgICdvbktleURvd24nLFxyXG4gICAgICAgICAgICAgICAgJ29uS2V5UHJlc3MnLFxyXG4gICAgICAgICAgICAgICAgJ29uS2V5VXAnLFxyXG4gICAgICAgICAgICAgICAgJ29uTW91c2VEb3duJyxcclxuICAgICAgICAgICAgICAgICdvbk1vdXNlVXAnLFxyXG4gICAgICAgICAgICAgICAgJ29uVG91Y2hDYW5jZWwnLFxyXG4gICAgICAgICAgICAgICAgJ29uVG91Y2hFbmQnLFxyXG4gICAgICAgICAgICAgICAgJ29uVG91Y2hTdGFydCdcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIHRzbGliXzEuX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtdKVxyXG4gICAgXSwgVGV4dElucHV0QmFzZSk7XHJcbiAgICByZXR1cm4gVGV4dElucHV0QmFzZTtcclxufShleHBvcnRzLlRoZW1lZEJhc2UpKTtcclxuZXhwb3J0cy5UZXh0SW5wdXRCYXNlID0gVGV4dElucHV0QmFzZTtcclxudmFyIFRleHRJbnB1dCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIHRzbGliXzEuX19leHRlbmRzKFRleHRJbnB1dCwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFRleHRJbnB1dCgpIHtcclxuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gVGV4dElucHV0O1xyXG59KFRleHRJbnB1dEJhc2UpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gVGV4dElucHV0O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGV4dC1pbnB1dC9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90ZXh0LWlucHV0L2luZGV4LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS9idXR0b24ubS5jc3Ncbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGhlbWUvYnV0dG9uLm0uY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsInJlcXVpcmUoJ2M6L1VzZXJzL2Rqb25lcy5TQUNCVUsvRG9jdW1lbnRzL2Rldi9kb2pvLXR1dHMvMTAxNV9mb3JtX3ZhbGlkYXRpb24vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGhlbWUvYnV0dG9uLm0uY3NzJyk7XG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbmlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0ZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiAoZmFjdG9yeSgpKTsgfSk7XG59IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xufVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB7XCJyb290XCI6XCJLOFQxSkoweFwiLFwicHJlc3NlZFwiOlwiXzJMRzdDcl9ZXCIsXCJwb3B1cFwiOlwiXzFlMjJ0a0ZEXCIsXCJhZGRvblwiOlwiTkdFMW1nRWRcIixcImRpc2FibGVkXCI6XCJfM3g4VDROc0lcIixcIiBfa2V5XCI6XCJAZG9qby93aWRnZXRzL2J1dHRvblwifTtcbn0pKTs7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS9idXR0b24ubS5jc3MuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGhlbWUvYnV0dG9uLm0uY3NzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS9pY29uLm0uY3NzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL2ljb24ubS5jc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwicmVxdWlyZSgnYzovVXNlcnMvZGpvbmVzLlNBQ0JVSy9Eb2N1bWVudHMvZGV2L2Rvam8tdHV0cy8xMDE1X2Zvcm1fdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS9pY29uLm0uY3NzJyk7XG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbmlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0ZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiAoZmFjdG9yeSgpKTsgfSk7XG59IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xufVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB7XCJyb290XCI6XCJfMkw2THMtWnlcIixcImljb25cIjpcIl8zdEYxdlpNLVwiLFwiZG93bkljb25cIjpcIl8zR0Z5SWszR1wiLFwibGVmdEljb25cIjpcIl8xZGI4REtjOFwiLFwicmlnaHRJY29uXCI6XCJfMmExNDNZRVRcIixcImNsb3NlSWNvblwiOlwidzFXWmlldDJcIixcInBsdXNJY29uXCI6XCJfMlZfOTA5T0NcIixcIm1pbnVzSWNvblwiOlwiXzI3S09lNGdIXCIsXCJjaGVja0ljb25cIjpcIm1LaWw0TUNYXCIsXCJ1cEljb25cIjpcIlJ3NFRYcmRiXCIsXCJ1cEFsdEljb25cIjpcImIyQlBxZENPXCIsXCJkb3duQWx0SWNvblwiOlwiXzNRcGtFdy1JXCIsXCJzZWFyY2hJY29uXCI6XCJfM01XcXNDX2JcIixcImJhcnNJY29uXCI6XCJfM3VYV20tSDZcIixcInNldHRpbmdzSWNvblwiOlwiXzNWLS1PTHdsXCIsXCJhbGVydEljb25cIjpcIl8zWWpKT1hXaFwiLFwiaGVscEljb25cIjpcIl8zbUw5MVowc1wiLFwiaW5mb0ljb25cIjpcImRaTGVvNlNmXCIsXCJwaG9uZUljb25cIjpcIl8xdnprTnVOQlwiLFwiZWRpdEljb25cIjpcIl8yeTNJSDNvMlwiLFwiZGF0ZUljb25cIjpcIl8xX3g2UnF0QVwiLFwibGlua0ljb25cIjpcIkhrVjJ2M3lLXCIsXCJsb2NhdGlvbkljb25cIjpcIl8yNC03eV9MelwiLFwic2VjdXJlSWNvblwiOlwiXzJjVER4bW91XCIsXCJtYWlsSWNvblwiOlwiXzEyUE1ZSG5xXCIsXCIgX2tleVwiOlwiQGRvam8vd2lkZ2V0cy9pY29uXCJ9O1xufSkpOztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL2ljb24ubS5jc3MuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGhlbWUvaWNvbi5tLmNzcy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGhlbWUvbGFiZWwubS5jc3Ncbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGhlbWUvbGFiZWwubS5jc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwicmVxdWlyZSgnYzovVXNlcnMvZGpvbmVzLlNBQ0JVSy9Eb2N1bWVudHMvZGV2L2Rvam8tdHV0cy8xMDE1X2Zvcm1fdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS9sYWJlbC5tLmNzcycpO1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdGRlZmluZShbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gKGZhY3RvcnkoKSk7IH0pO1xufSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbn1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4ge1wicm9vdFwiOlwiXzFYbjdHWmpsXCIsXCJyZWFkb25seVwiOlwiXzc5Z013MHZYXCIsXCJpbnZhbGlkXCI6XCJfMUhYUVhhbmRcIixcInZhbGlkXCI6XCJfM1RlTzg1bkRcIixcInJlcXVpcmVkXCI6XCJfMmFfbHdaaThcIixcImRpc2FibGVkXCI6XCJfM2d2OXB0eEhcIixcImZvY3VzZWRcIjpcIl8yUXkybll0YVwiLFwic2Vjb25kYXJ5XCI6XCJfMjlVcFI3R2RcIixcIiBfa2V5XCI6XCJAZG9qby93aWRnZXRzL2xhYmVsXCJ9O1xufSkpOztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL2xhYmVsLm0uY3NzLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL2xhYmVsLm0uY3NzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS90ZXh0LWlucHV0Lm0uY3NzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9AZG9qby93aWRnZXRzL3RoZW1lL3RleHQtaW5wdXQubS5jc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwicmVxdWlyZSgnYzovVXNlcnMvZGpvbmVzLlNBQ0JVSy9Eb2N1bWVudHMvZGV2L2Rvam8tdHV0cy8xMDE1X2Zvcm1fdmFsaWRhdGlvbi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS90ZXh0LWlucHV0Lm0uY3NzJyk7XG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbmlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0ZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiAoZmFjdG9yeSgpKTsgfSk7XG59IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xufVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB7XCJpbnB1dFwiOlwiXzExVmltb1BHXCIsXCJyb290XCI6XCJfMU5nWlVFRTRcIixcImlucHV0V3JhcHBlclwiOlwiVHhJX3FldG9cIixcImRpc2FibGVkXCI6XCJ4S3ZfR0twVFwiLFwiZm9jdXNlZFwiOlwiXzFfY05ZN0U4XCIsXCJyZWFkb25seVwiOlwiXzM5ZmFaRk1YXCIsXCJyZXF1aXJlZFwiOlwiXzFzU2FhYkhvXCIsXCJpbnZhbGlkXCI6XCJfM3R5LUJSTk1cIixcInZhbGlkXCI6XCJfM0E3MXNCbjRcIixcIiBfa2V5XCI6XCJAZG9qby93aWRnZXRzL3RleHQtaW5wdXRcIn07XG59KSk7O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dpZGdldHMvdGhlbWUvdGV4dC1pbnB1dC5tLmNzcy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvQGRvam8vd2lkZ2V0cy90aGVtZS90ZXh0LWlucHV0Lm0uY3NzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgdW5kZWZpbmVkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAoZ2xvYmFsLnNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5leHRIYW5kbGUgPSAxOyAvLyBTcGVjIHNheXMgZ3JlYXRlciB0aGFuIHplcm9cbiAgICB2YXIgdGFza3NCeUhhbmRsZSA9IHt9O1xuICAgIHZhciBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICB2YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xuICAgIHZhciByZWdpc3RlckltbWVkaWF0ZTtcblxuICAgIGZ1bmN0aW9uIHNldEltbWVkaWF0ZShjYWxsYmFjaykge1xuICAgICAgLy8gQ2FsbGJhY2sgY2FuIGVpdGhlciBiZSBhIGZ1bmN0aW9uIG9yIGEgc3RyaW5nXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBuZXcgRnVuY3Rpb24oXCJcIiArIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICAgIC8vIENvcHkgZnVuY3Rpb24gYXJndW1lbnRzXG4gICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAxXTtcbiAgICAgIH1cbiAgICAgIC8vIFN0b3JlIGFuZCByZWdpc3RlciB0aGUgdGFza1xuICAgICAgdmFyIHRhc2sgPSB7IGNhbGxiYWNrOiBjYWxsYmFjaywgYXJnczogYXJncyB9O1xuICAgICAgdGFza3NCeUhhbmRsZVtuZXh0SGFuZGxlXSA9IHRhc2s7XG4gICAgICByZWdpc3RlckltbWVkaWF0ZShuZXh0SGFuZGxlKTtcbiAgICAgIHJldHVybiBuZXh0SGFuZGxlKys7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaGFuZGxlKSB7XG4gICAgICAgIGRlbGV0ZSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuKHRhc2spIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdGFzay5jYWxsYmFjaztcbiAgICAgICAgdmFyIGFyZ3MgPSB0YXNrLmFyZ3M7XG4gICAgICAgIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuSWZQcmVzZW50KGhhbmRsZSkge1xuICAgICAgICAvLyBGcm9tIHRoZSBzcGVjOiBcIldhaXQgdW50aWwgYW55IGludm9jYXRpb25zIG9mIHRoaXMgYWxnb3JpdGhtIHN0YXJ0ZWQgYmVmb3JlIHRoaXMgb25lIGhhdmUgY29tcGxldGVkLlwiXG4gICAgICAgIC8vIFNvIGlmIHdlJ3JlIGN1cnJlbnRseSBydW5uaW5nIGEgdGFzaywgd2UnbGwgbmVlZCB0byBkZWxheSB0aGlzIGludm9jYXRpb24uXG4gICAgICAgIGlmIChjdXJyZW50bHlSdW5uaW5nQVRhc2spIHtcbiAgICAgICAgICAgIC8vIERlbGF5IGJ5IGRvaW5nIGEgc2V0VGltZW91dC4gc2V0SW1tZWRpYXRlIHdhcyB0cmllZCBpbnN0ZWFkLCBidXQgaW4gRmlyZWZveCA3IGl0IGdlbmVyYXRlZCBhXG4gICAgICAgICAgICAvLyBcInRvbyBtdWNoIHJlY3Vyc2lvblwiIGVycm9yLlxuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICAgICAgICAgIGlmICh0YXNrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBydW4odGFzayk7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbW1lZGlhdGUoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHsgcnVuSWZQcmVzZW50KGhhbmRsZSk7IH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhblVzZVBvc3RNZXNzYWdlKCkge1xuICAgICAgICAvLyBUaGUgdGVzdCBhZ2FpbnN0IGBpbXBvcnRTY3JpcHRzYCBwcmV2ZW50cyB0aGlzIGltcGxlbWVudGF0aW9uIGZyb20gYmVpbmcgaW5zdGFsbGVkIGluc2lkZSBhIHdlYiB3b3JrZXIsXG4gICAgICAgIC8vIHdoZXJlIGBnbG9iYWwucG9zdE1lc3NhZ2VgIG1lYW5zIHNvbWV0aGluZyBjb21wbGV0ZWx5IGRpZmZlcmVudCBhbmQgY2FuJ3QgYmUgdXNlZCBmb3IgdGhpcyBwdXJwb3NlLlxuICAgICAgICBpZiAoZ2xvYmFsLnBvc3RNZXNzYWdlICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cykge1xuICAgICAgICAgICAgdmFyIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIG9sZE9uTWVzc2FnZSA9IGdsb2JhbC5vbm1lc3NhZ2U7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShcIlwiLCBcIipcIik7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gb2xkT25NZXNzYWdlO1xuICAgICAgICAgICAgcmV0dXJuIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgLy8gSW5zdGFsbHMgYW4gZXZlbnQgaGFuZGxlciBvbiBgZ2xvYmFsYCBmb3IgdGhlIGBtZXNzYWdlYCBldmVudDogc2VlXG4gICAgICAgIC8vICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vRE9NL3dpbmRvdy5wb3N0TWVzc2FnZVxuICAgICAgICAvLyAqIGh0dHA6Ly93d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL2NvbW1zLmh0bWwjY3Jvc3NEb2N1bWVudE1lc3NhZ2VzXG5cbiAgICAgICAgdmFyIG1lc3NhZ2VQcmVmaXggPSBcInNldEltbWVkaWF0ZSRcIiArIE1hdGgucmFuZG9tKCkgKyBcIiRcIjtcbiAgICAgICAgdmFyIG9uR2xvYmFsTWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBnbG9iYWwgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgZXZlbnQuZGF0YSA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGEuaW5kZXhPZihtZXNzYWdlUHJlZml4KSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudCgrZXZlbnQuZGF0YS5zbGljZShtZXNzYWdlUHJlZml4Lmxlbmd0aCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2xvYmFsLmF0dGFjaEV2ZW50KFwib25tZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKG1lc3NhZ2VQcmVmaXggKyBoYW5kbGUsIFwiKlwiKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGhhbmRsZSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZShoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBodG1sID0gZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIDxzY3JpcHQ+IGVsZW1lbnQ7IGl0cyByZWFkeXN0YXRlY2hhbmdlIGV2ZW50IHdpbGwgYmUgZmlyZWQgYXN5bmNocm9ub3VzbHkgb25jZSBpdCBpcyBpbnNlcnRlZFxuICAgICAgICAgICAgLy8gaW50byB0aGUgZG9jdW1lbnQuIERvIHNvLCB0aHVzIHF1ZXVpbmcgdXAgdGhlIHRhc2suIFJlbWVtYmVyIHRvIGNsZWFuIHVwIG9uY2UgaXQncyBiZWVuIGNhbGxlZC5cbiAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaHRtbC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgICAgIHNjcmlwdCA9IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaHRtbC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBJZiBzdXBwb3J0ZWQsIHdlIHNob3VsZCBhdHRhY2ggdG8gdGhlIHByb3RvdHlwZSBvZiBnbG9iYWwsIHNpbmNlIHRoYXQgaXMgd2hlcmUgc2V0VGltZW91dCBldCBhbC4gbGl2ZS5cbiAgICB2YXIgYXR0YWNoVG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbCk7XG4gICAgYXR0YWNoVG8gPSBhdHRhY2hUbyAmJiBhdHRhY2hUby5zZXRUaW1lb3V0ID8gYXR0YWNoVG8gOiBnbG9iYWw7XG5cbiAgICAvLyBEb24ndCBnZXQgZm9vbGVkIGJ5IGUuZy4gYnJvd3NlcmlmeSBlbnZpcm9ubWVudHMuXG4gICAgaWYgKHt9LnRvU3RyaW5nLmNhbGwoZ2xvYmFsLnByb2Nlc3MpID09PSBcIltvYmplY3QgcHJvY2Vzc11cIikge1xuICAgICAgICAvLyBGb3IgTm9kZS5qcyBiZWZvcmUgMC45XG4gICAgICAgIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGNhblVzZVBvc3RNZXNzYWdlKCkpIHtcbiAgICAgICAgLy8gRm9yIG5vbi1JRTEwIG1vZGVybiBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChnbG9iYWwuTWVzc2FnZUNoYW5uZWwpIHtcbiAgICAgICAgLy8gRm9yIHdlYiB3b3JrZXJzLCB3aGVyZSBzdXBwb3J0ZWRcbiAgICAgICAgaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZG9jICYmIFwib25yZWFkeXN0YXRlY2hhbmdlXCIgaW4gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIikpIHtcbiAgICAgICAgLy8gRm9yIElFIDbigJM4XG4gICAgICAgIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZvciBvbGRlciBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCk7XG4gICAgfVxuXG4gICAgYXR0YWNoVG8uc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuICAgIGF0dGFjaFRvLmNsZWFySW1tZWRpYXRlID0gY2xlYXJJbW1lZGlhdGU7XG59KHR5cGVvZiBzZWxmID09PSBcInVuZGVmaW5lZFwiID8gdHlwZW9mIGdsb2JhbCA9PT0gXCJ1bmRlZmluZWRcIiA/IHRoaXMgOiBnbG9iYWwgOiBzZWxmKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9zZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsInZhciBhcHBseSA9IEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseTtcblxuLy8gRE9NIEFQSXMsIGZvciBjb21wbGV0ZW5lc3NcblxuZXhwb3J0cy5zZXRUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldFRpbWVvdXQsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJUaW1lb3V0KTtcbn07XG5leHBvcnRzLnNldEludGVydmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldEludGVydmFsLCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFySW50ZXJ2YWwpO1xufTtcbmV4cG9ydHMuY2xlYXJUaW1lb3V0ID1cbmV4cG9ydHMuY2xlYXJJbnRlcnZhbCA9IGZ1bmN0aW9uKHRpbWVvdXQpIHtcbiAgaWYgKHRpbWVvdXQpIHtcbiAgICB0aW1lb3V0LmNsb3NlKCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFRpbWVvdXQoaWQsIGNsZWFyRm4pIHtcbiAgdGhpcy5faWQgPSBpZDtcbiAgdGhpcy5fY2xlYXJGbiA9IGNsZWFyRm47XG59XG5UaW1lb3V0LnByb3RvdHlwZS51bnJlZiA9IFRpbWVvdXQucHJvdG90eXBlLnJlZiA9IGZ1bmN0aW9uKCkge307XG5UaW1lb3V0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9jbGVhckZuLmNhbGwod2luZG93LCB0aGlzLl9pZCk7XG59O1xuXG4vLyBEb2VzIG5vdCBzdGFydCB0aGUgdGltZSwganVzdCBzZXRzIHVwIHRoZSBtZW1iZXJzIG5lZWRlZC5cbmV4cG9ydHMuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSwgbXNlY3MpIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IG1zZWNzO1xufTtcblxuZXhwb3J0cy51bmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IC0xO1xufTtcblxuZXhwb3J0cy5fdW5yZWZBY3RpdmUgPSBleHBvcnRzLmFjdGl2ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuXG4gIHZhciBtc2VjcyA9IGl0ZW0uX2lkbGVUaW1lb3V0O1xuICBpZiAobXNlY3MgPj0gMCkge1xuICAgIGl0ZW0uX2lkbGVUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uIG9uVGltZW91dCgpIHtcbiAgICAgIGlmIChpdGVtLl9vblRpbWVvdXQpXG4gICAgICAgIGl0ZW0uX29uVGltZW91dCgpO1xuICAgIH0sIG1zZWNzKTtcbiAgfVxufTtcblxuLy8gc2V0aW1tZWRpYXRlIGF0dGFjaGVzIGl0c2VsZiB0byB0aGUgZ2xvYmFsIG9iamVjdFxucmVxdWlyZShcInNldGltbWVkaWF0ZVwiKTtcbi8vIE9uIHNvbWUgZXhvdGljIGVudmlyb25tZW50cywgaXQncyBub3QgY2xlYXIgd2hpY2ggb2JqZWN0IGBzZXRpbW1laWRhdGVgIHdhc1xuLy8gYWJsZSB0byBpbnN0YWxsIG9udG8uICBTZWFyY2ggZWFjaCBwb3NzaWJpbGl0eSBpbiB0aGUgc2FtZSBvcmRlciBhcyB0aGVcbi8vIGBzZXRpbW1lZGlhdGVgIGxpYnJhcnkuXG5leHBvcnRzLnNldEltbWVkaWF0ZSA9ICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzZWxmLnNldEltbWVkaWF0ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2xvYmFsLnNldEltbWVkaWF0ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMgJiYgdGhpcy5zZXRJbW1lZGlhdGUpO1xuZXhwb3J0cy5jbGVhckltbWVkaWF0ZSA9ICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzZWxmLmNsZWFySW1tZWRpYXRlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiICYmIGdsb2JhbC5jbGVhckltbWVkaWF0ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAodGhpcyAmJiB0aGlzLmNsZWFySW1tZWRpYXRlKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3RpbWVycy1icm93c2VyaWZ5L21haW4uanNcbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDApXHJcbiAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSB5W29wWzBdICYgMiA/IFwicmV0dXJuXCIgOiBvcFswXSA/IFwidGhyb3dcIiA6IFwibmV4dFwiXSkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbMCwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgIH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlmIChvW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9OyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gbWFpbiIsInZhciBnO1xuXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxuZyA9IChmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXM7XG59KSgpO1xuXG50cnkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcbn0gY2F0Y2goZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxuXHRcdGcgPSB3aW5kb3c7XG59XG5cbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XG5cbm1vZHVsZS5leHBvcnRzID0gZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvd2VicGFjay9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJpbXBvcnQgeyBkZWVwQXNzaWduIH0gZnJvbSAnQGRvam8vY29yZS9sYW5nJztcbmltcG9ydCB7IEluamVjdG9yIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvSW5qZWN0b3InO1xuXG5pbXBvcnQgeyBXb3JrZXJQcm9wZXJ0aWVzIH0gZnJvbSAnLi93aWRnZXRzL1dvcmtlcic7XG5pbXBvcnQgeyBXb3JrZXJGb3JtRGF0YSwgV29ya2VyRm9ybUVycm9ycyB9IGZyb20gJy4vd2lkZ2V0cy9Xb3JrZXJGb3JtJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwbGljYXRpb25Db250ZXh0IGV4dGVuZHMgSW5qZWN0b3Ige1xuXG5cdHByaXZhdGUgX3dvcmtlckRhdGE6IFdvcmtlclByb3BlcnRpZXNbXTtcblxuXHRwcml2YXRlIF9mb3JtRGF0YTogUGFydGlhbDxXb3JrZXJGb3JtRGF0YT4gPSB7fTtcblxuXHRwcml2YXRlIF9mb3JtRXJyb3JzOiBXb3JrZXJGb3JtRXJyb3JzID0ge307XG5cblx0Y29uc3RydWN0b3Iod29ya2VyRGF0YTogV29ya2VyUHJvcGVydGllc1tdID0gW10pIHtcblx0XHRzdXBlcih7fSk7XG5cdFx0dGhpcy5fd29ya2VyRGF0YSA9IHdvcmtlckRhdGE7XG5cdH1cblxuXHRnZXQgd29ya2VyRGF0YSgpOiBXb3JrZXJQcm9wZXJ0aWVzW10ge1xuXHRcdHJldHVybiB0aGlzLl93b3JrZXJEYXRhO1xuXHR9XG5cblx0Z2V0IGZvcm1EYXRhKCk6IFBhcnRpYWw8V29ya2VyRm9ybURhdGE+IHtcblx0XHRyZXR1cm4gdGhpcy5fZm9ybURhdGE7XG5cdH1cblxuXHRnZXQgZm9ybUVycm9ycygpOiBXb3JrZXJGb3JtRXJyb3JzIHtcblx0XHRyZXR1cm4gdGhpcy5fZm9ybUVycm9ycztcblx0fVxuXG5cdHB1YmxpYyBmb3JtVmFsaWRhdGUoaW5wdXQ6IFBhcnRpYWw8V29ya2VyRm9ybURhdGE+KTogdm9pZCB7XG5cdFx0dGhpcy5fZm9ybUVycm9ycyA9IGRlZXBBc3NpZ24oe30sIHRoaXMuX2Zvcm1FcnJvcnMsIHRoaXMuX3ZhbGlkYXRlSW5wdXQoaW5wdXQpKTtcblx0XHR0aGlzLmVtaXQoeyB0eXBlOiAnaW52YWxpZGF0ZScgfSk7XG5cdH1cblxuXHRwdWJsaWMgZm9ybUlucHV0KGlucHV0OiBQYXJ0aWFsPFdvcmtlckZvcm1EYXRhPik6IHZvaWQge1xuXHRcdHRoaXMuX2Zvcm1EYXRhID0gZGVlcEFzc2lnbih7fSwgdGhpcy5fZm9ybURhdGEsIGlucHV0KTtcblx0XHR0aGlzLmVtaXQoeyB0eXBlOiAnaW52YWxpZGF0ZScgfSk7XG5cdH1cblxuXHRwdWJsaWMgc3VibWl0Rm9ybSgpOiB2b2lkIHtcblx0XHRpZiAoIXRoaXMuX3ZhbGlkYXRlT25TdWJtaXQoKSkge1xuXHRcdFx0dGhpcy5lbWl0KHsgdHlwZTogJ2ludmFsaWRhdGUnIH0pO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX3dvcmtlckRhdGEgPSBbIC4uLnRoaXMuX3dvcmtlckRhdGEsIHRoaXMuX2Zvcm1EYXRhIF07XG5cdFx0dGhpcy5fZm9ybURhdGEgPSB7fTtcblx0XHR0aGlzLl9mb3JtRXJyb3JzID0ge307XG5cdFx0dGhpcy5lbWl0KHsgdHlwZTogJ2ludmFsaWRhdGUnIH0pO1xuXHR9XG5cblx0Z2V0KCk6IEFwcGxpY2F0aW9uQ29udGV4dCB7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRwcml2YXRlXHQgX3ZhbGlkYXRlSW5wdXQoaW5wdXQ6IFBhcnRpYWw8V29ya2VyRm9ybURhdGE+KTogV29ya2VyRm9ybUVycm9ycyB7XG5cdFx0Y29uc3QgZXJyb3JzOiBXb3JrZXJGb3JtRXJyb3JzID0ge307XG5cblx0XHRmb3IgKGxldCBrZXkgaW4gaW5wdXQpIHtcblx0XHRcdHN3aXRjaCAoa2V5KSB7XG5cdFx0XHRcdGNhc2UgJ2ZpcnN0TmFtZSc6XG5cdFx0XHRcdFx0ZXJyb3JzLmZpcnN0TmFtZSA9ICFpbnB1dC5maXJzdE5hbWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ2xhc3ROYW1lJzpcblx0XHRcdFx0XHRlcnJvcnMubGFzdE5hbWUgPSAhaW5wdXQubGFzdE5hbWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ2VtYWlsJzpcblx0XHRcdFx0XHRlcnJvcnMuZW1haWwgPSAhaW5wdXQuZW1haWwgfHwgIWlucHV0LmVtYWlsLm1hdGNoKC9eW2EtekEtWjAtOS4hIyQlJuKAmSorLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05LV0rKD86XFwuW2EtekEtWjAtOS1dKykqJC8pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBlcnJvcnM7XG5cdH1cblxuXHRwcml2YXRlIF92YWxpZGF0ZU9uU3VibWl0KCk6IGJvb2xlYW4ge1xuXHRcdGNvbnN0IGVycm9ycyA9IHRoaXMuX3ZhbGlkYXRlSW5wdXQodGhpcy5fZm9ybURhdGEpO1xuXHRcdHRoaXMuX2Zvcm1FcnJvcnMgPSBkZWVwQXNzaWduKHsgZmlyc3ROYW1lOiB0cnVlLCBsYXN0TmFtZTogdHJ1ZSwgZW1haWw6IHRydWUgfSwgZXJyb3JzKTtcblxuXHRcdGlmICh0aGlzLl9mb3JtRXJyb3JzLmZpcnN0TmFtZSB8fCB0aGlzLl9mb3JtRXJyb3JzLmxhc3ROYW1lIHx8IHRoaXMuX2Zvcm1FcnJvcnMuZW1haWwpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ0Zvcm0gY29udGFpbnMgZXJyb3JzJyk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgd29ya2VyIG9mIHRoaXMuX3dvcmtlckRhdGEpIHtcblx0XHRcdGlmICh3b3JrZXIuZW1haWwgPT09IHRoaXMuX2Zvcm1EYXRhLmVtYWlsKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0VtYWlsIG11c3QgYmUgdW5pcXVlJyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGludC1sb2FkZXI/P3JlZi0tMCEuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyP3R5cGU9dHMmaW5zdGFuY2VOYW1lPTBfZG9qbyEuL3NyYy9BcHBsaWNhdGlvbkNvbnRleHQudHMiLCJpbXBvcnQgeyBDb250YWluZXIgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9Db250YWluZXInO1xuXG5pbXBvcnQgQXBwbGljYXRpb25Db250ZXh0IGZyb20gJy4vLi4vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCBXb3JrZXJDb250YWluZXIsIHsgV29ya2VyQ29udGFpbmVyUHJvcGVydGllcyB9IGZyb20gJy4vLi4vd2lkZ2V0cy9Xb3JrZXJDb250YWluZXInO1xuXG5mdW5jdGlvbiBnZXRQcm9wZXJ0aWVzKGluamVjdDogQXBwbGljYXRpb25Db250ZXh0LCBwcm9wZXJ0aWVzOiBhbnkpIHtcblx0cmV0dXJuIHsgd29ya2VyRGF0YTogaW5qZWN0LndvcmtlckRhdGEgfTtcbn1cblxuY29uc3QgV29ya2VyQ29udGFpbmVyQ29udGFpbmVyID0gQ29udGFpbmVyKFdvcmtlckNvbnRhaW5lciwgJ2FwcC1zdGF0ZScsIHsgZ2V0UHJvcGVydGllcyB9KTtcblxuZXhwb3J0IGRlZmF1bHQgV29ya2VyQ29udGFpbmVyQ29udGFpbmVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGludC1sb2FkZXI/P3JlZi0tMCEuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyP3R5cGU9dHMmaW5zdGFuY2VOYW1lPTBfZG9qbyEuL3NyYy9jb250YWluZXJzL1dvcmtlckNvbnRhaW5lckNvbnRhaW5lci50cyIsImltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL0NvbnRhaW5lcic7XG5cbmltcG9ydCBBcHBsaWNhdGlvbkNvbnRleHQgZnJvbSAnLi8uLi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IFdvcmtlckZvcm0sIHsgV29ya2VyRm9ybVByb3BlcnRpZXMgfSBmcm9tICcuLy4uL3dpZGdldHMvV29ya2VyRm9ybSc7XG5cbmZ1bmN0aW9uIGdldFByb3BlcnRpZXMoaW5qZWN0OiBBcHBsaWNhdGlvbkNvbnRleHQsIHByb3BlcnRpZXM6IGFueSkge1xuXHRjb25zdCB7XG5cdFx0Zm9ybURhdGEsXG5cdFx0Zm9ybUVycm9ycyxcblx0XHRmb3JtSW5wdXQ6IG9uRm9ybUlucHV0LFxuXHRcdGZvcm1WYWxpZGF0ZTogb25Gb3JtVmFsaWRhdGUsXG5cdFx0c3VibWl0Rm9ybTogb25Gb3JtU2F2ZVxuXHR9ID0gaW5qZWN0O1xuXG5cdHJldHVybiB7XG5cdFx0Zm9ybURhdGEsXG5cdFx0Zm9ybUVycm9ycyxcblx0XHRvbkZvcm1JbnB1dDogb25Gb3JtSW5wdXQuYmluZChpbmplY3QpLFxuXHRcdG9uRm9ybVZhbGlkYXRlOiBvbkZvcm1WYWxpZGF0ZS5iaW5kKGluamVjdCksXG5cdFx0b25Gb3JtU2F2ZTogb25Gb3JtU2F2ZS5iaW5kKGluamVjdClcblx0fTtcbn1cblxuY29uc3QgV29ya2VyRm9ybUNvbnRhaW5lciA9IENvbnRhaW5lcihXb3JrZXJGb3JtLCAnYXBwLXN0YXRlJywgeyBnZXRQcm9wZXJ0aWVzIH0pO1xuXG5leHBvcnQgZGVmYXVsdCBXb3JrZXJGb3JtQ29udGFpbmVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbm9kZV9tb2R1bGVzL3RzbGludC1sb2FkZXI/P3JlZi0tMCEuL25vZGVfbW9kdWxlcy9AZG9qby93ZWJwYWNrLWNvbnRyaWIvY3NzLW1vZHVsZS1kdHMtbG9hZGVyP3R5cGU9dHMmaW5zdGFuY2VOYW1lPTBfZG9qbyEuL3NyYy9jb250YWluZXJzL1dvcmtlckZvcm1Db250YWluZXIudHMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21haW4uY3NzXG4vLyBtb2R1bGUgaWQgPSAuL3NyYy9tYWluLmNzc1xuLy8gbW9kdWxlIGNodW5rcyA9IG1haW4iLCJpbXBvcnQgeyBQcm9qZWN0b3JNaXhpbiB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL21peGlucy9Qcm9qZWN0b3InO1xuaW1wb3J0IHsgUmVnaXN0cnkgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9SZWdpc3RyeSc7XG5cbmltcG9ydCBBcHBsaWNhdGlvbkNvbnRleHQgZnJvbSAnLi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IEFwcCBmcm9tICcuL3dpZGdldHMvQXBwJztcblxuY29uc3Qgcm9vdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ215LWFwcCcpIHx8IHVuZGVmaW5lZDtcblxuY29uc3QgYXBwbGljYXRpb25Db250ZXh0ID0gbmV3IEFwcGxpY2F0aW9uQ29udGV4dChbXG5cdHtcblx0XHRmaXJzdE5hbWU6ICdUaW0nLFxuXHRcdGxhc3ROYW1lOiAnSm9uZXMnLFxuXHRcdGVtYWlsOiAndGltLmpvbmVzQGJpemVjb3JwLm9yZycsXG5cdFx0dGFza3M6IFtcblx0XHRcdCc2MjY3IC0gVW50YW5nbGUgcGFwZXJjbGlwcycsXG5cdFx0XHQnNDM4NCAtIFNocmVkIGRvY3VtZW50cycsXG5cdFx0XHQnOTY2MyAtIERpZ2l0aXplIDE5ODUgYXJjaGl2ZSdcblx0XHRdXG5cdH0sXG5cdHtcblx0XHRmaXJzdE5hbWU6ICdBbGljaWEnLFxuXHRcdGxhc3ROYW1lOiAnRml0emdlcmFsZCdcblx0fSxcblx0e1xuXHRcdGZpcnN0TmFtZTogJ0hhbnMnLFxuXHRcdGxhc3ROYW1lOiAnTXVlbGxlcidcblx0fVxuXSk7XG5cbmNvbnN0IHJlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5KCk7XG5yZWdpc3RyeS5kZWZpbmVJbmplY3RvcignYXBwLXN0YXRlJywgYXBwbGljYXRpb25Db250ZXh0KTtcblxuY29uc3QgUHJvamVjdG9yID0gUHJvamVjdG9yTWl4aW4oQXBwKTtcbmNvbnN0IHByb2plY3RvciA9IG5ldyBQcm9qZWN0b3IoKTtcbnByb2plY3Rvci5zZXRQcm9wZXJ0aWVzKHsgcmVnaXN0cnkgfSk7XG5cbnByb2plY3Rvci5hcHBlbmQocm9vdCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvdHNsaW50LWxvYWRlcj8/cmVmLS0wIS4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dlYnBhY2stY29udHJpYi9jc3MtbW9kdWxlLWR0cy1sb2FkZXI/dHlwZT10cyZpbnN0YW5jZU5hbWU9MF9kb2pvIS4vc3JjL21haW4udHMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxubW9kdWxlLmV4cG9ydHMgPSB7XCIgX2tleVwiOlwiYml6LWUtY29ycC92YWxpZGF0ZWRUZXh0SW5wdXRcIixcImlucHV0V3JhcHBlclwiOlwidmFsaWRhdGVkVGV4dElucHV0LW1fX2lucHV0V3JhcHBlcl9fMkJpeFhcIixcImVycm9yXCI6XCJ2YWxpZGF0ZWRUZXh0SW5wdXQtbV9fZXJyb3JfXzN6T0FfXCJ9O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0eWxlcy92YWxpZGF0ZWRUZXh0SW5wdXQubS5jc3Ncbi8vIG1vZHVsZSBpZCA9IC4vc3JjL3N0eWxlcy92YWxpZGF0ZWRUZXh0SW5wdXQubS5jc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cbm1vZHVsZS5leHBvcnRzID0ge1wiIF9rZXlcIjpcImJpei1lLWNvcnAvd29ya2VyXCIsXCJnZW5lcmFsSW5mb1wiOlwid29ya2VyLW1fX2dlbmVyYWxJbmZvX18zNVUwQ1wiLFwiaW1hZ2VcIjpcIndvcmtlci1tX19pbWFnZV9fMVUtUjVcIixcImltYWdlU21hbGxcIjpcIndvcmtlci1tX19pbWFnZVNtYWxsX18zYjlRRFwiLFwibGFiZWxcIjpcIndvcmtlci1tX19sYWJlbF9fanpzNDBcIixcInRhc2tcIjpcIndvcmtlci1tX190YXNrX19McDd6elwiLFwid29ya2VyXCI6XCJ3b3JrZXItbV9fd29ya2VyX180X1JDTVwiLFwid29ya2VyRnJvbnRcIjpcIndvcmtlci1tX193b3JrZXJGcm9udF9fWE1VTFdcIixcIndvcmtlckJhY2tcIjpcIndvcmtlci1tX193b3JrZXJCYWNrX18zSFZYM1wiLFwicmV2ZXJzZVwiOlwid29ya2VyLW1fX3JldmVyc2VfXzJ0QmI3XCJ9O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0eWxlcy93b3JrZXIubS5jc3Ncbi8vIG1vZHVsZSBpZCA9IC4vc3JjL3N0eWxlcy93b3JrZXIubS5jc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cbm1vZHVsZS5leHBvcnRzID0ge1wiIF9rZXlcIjpcImJpei1lLWNvcnAvd29ya2VyQ29udGFpbmVyXCIsXCJjb250YWluZXJcIjpcIndvcmtlckNvbnRhaW5lci1tX19jb250YWluZXJfXzFqMzdtXCJ9O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0eWxlcy93b3JrZXJDb250YWluZXIubS5jc3Ncbi8vIG1vZHVsZSBpZCA9IC4vc3JjL3N0eWxlcy93b3JrZXJDb250YWluZXIubS5jc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cbm1vZHVsZS5leHBvcnRzID0ge1wiIF9rZXlcIjpcImJpei1lLWNvcnAvd29ya2VyRm9ybVwiLFwid29ya2VyRm9ybVwiOlwid29ya2VyRm9ybS1tX193b3JrZXJGb3JtX18zcUc1bVwiLFwibmFtZUZpZWxkXCI6XCJ3b3JrZXJGb3JtLW1fX25hbWVGaWVsZF9fMlFPVzZcIixcIm5hbWVMYWJlbFwiOlwid29ya2VyRm9ybS1tX19uYW1lTGFiZWxfXzNWQ2dYXCIsXCJ3b3JrZXJCdXR0b25cIjpcIndvcmtlckZvcm0tbV9fd29ya2VyQnV0dG9uX18zVWpuNlwifTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdHlsZXMvd29ya2VyRm9ybS5tLmNzc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvc3R5bGVzL3dvcmtlckZvcm0ubS5jc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSBtYWluIiwiaW1wb3J0IHsgV2lkZ2V0QmFzZSB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL1dpZGdldEJhc2UnO1xuaW1wb3J0IHsgdiwgdyB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2QnO1xuaW1wb3J0IEJhbm5lciBmcm9tICcuL0Jhbm5lcic7XG5pbXBvcnQgV29ya2VyQ29udGFpbmVyQ29udGFpbmVyIGZyb20gJy4vLi4vY29udGFpbmVycy9Xb3JrZXJDb250YWluZXJDb250YWluZXInO1xuaW1wb3J0IFdvcmtlckZvcm1Db250YWluZXIgZnJvbSAnLi8uLi9jb250YWluZXJzL1dvcmtlckZvcm1Db250YWluZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHAgZXh0ZW5kcyBXaWRnZXRCYXNlIHtcblxuXHRwcm90ZWN0ZWQgcmVuZGVyKCkge1xuXHRcdHJldHVybiB2KCdkaXYnLCBbXG5cdFx0XHR3KEJhbm5lciwge30pLFxuXHRcdFx0dyhXb3JrZXJGb3JtQ29udGFpbmVyLCB7fSksXG5cdFx0XHR3KFdvcmtlckNvbnRhaW5lckNvbnRhaW5lciwge30pXG5cdFx0XSk7XG5cdH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpbnQtbG9hZGVyPz9yZWYtLTAhLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZHRzLWxvYWRlcj90eXBlPXRzJmluc3RhbmNlTmFtZT0wX2Rvam8hLi9zcmMvd2lkZ2V0cy9BcHAudHMiLCJpbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZSc7XG5pbXBvcnQgeyB2IH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhbm5lciBleHRlbmRzIFdpZGdldEJhc2Uge1xuXHRwcm90ZWN0ZWQgcmVuZGVyKCkge1xuXHRcdHJldHVybiB2KCdoMScsIHsgdGl0bGU6ICdJIGFtIGEgdGl0bGUhJyB9LCBbICdCaXotRS1Cb2RpZXMnIF0pO1xuXHR9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvdHNsaW50LWxvYWRlcj8/cmVmLS0wIS4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dlYnBhY2stY29udHJpYi9jc3MtbW9kdWxlLWR0cy1sb2FkZXI/dHlwZT10cyZpbnN0YW5jZU5hbWU9MF9kb2pvIS4vc3JjL3dpZGdldHMvQmFubmVyLnRzIiwiaW1wb3J0IHsgV2lkZ2V0QmFzZSB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL1dpZGdldEJhc2UnO1xyXG5pbXBvcnQgeyBUeXBlZFRhcmdldEV2ZW50IH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IHYsIHcgfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9kJztcclxuaW1wb3J0IHV1aWQgZnJvbSAnQGRvam8vY29yZS91dWlkJztcclxuaW1wb3J0IHsgVGhlbWVkTWl4aW4sIHRoZW1lIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZCc7XHJcbmltcG9ydCBUZXh0SW5wdXQsIHsgVGV4dElucHV0UHJvcGVydGllcyB9IGZyb20gJ0Bkb2pvL3dpZGdldHMvdGV4dC1pbnB1dCc7XHJcbmltcG9ydCAqIGFzIGNzcyBmcm9tICcuLi9zdHlsZXMvdmFsaWRhdGVkVGV4dElucHV0Lm0uY3NzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmFsaWRhdGVkVGV4dElucHV0UHJvcGVydGllcyBleHRlbmRzIFRleHRJbnB1dFByb3BlcnRpZXMge1xyXG5cdGVycm9yTWVzc2FnZT86IHN0cmluZztcclxuXHRvblZhbGlkYXRlPzogKHZhbHVlOiBzdHJpbmcpID0+IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBWYWxpZGF0ZWRUZXh0SW5wdXRCYXNlID0gVGhlbWVkTWl4aW4oV2lkZ2V0QmFzZSk7XHJcblxyXG5AdGhlbWUoY3NzKVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWYWxpZGF0ZWRUZXh0SW5wdXQgZXh0ZW5kcyBWYWxpZGF0ZWRUZXh0SW5wdXRCYXNlPFZhbGlkYXRlZFRleHRJbnB1dFByb3BlcnRpZXM+IHtcclxuXHRwcml2YXRlIF9lcnJvcklkID0gdXVpZCgpO1xyXG5cclxuXHRwcml2YXRlIF9vbklucHV0KHZhbHVlOiBzdHJpbmcpIHtcclxuXHRcdGNvbnN0IHsgaW52YWxpZCwgb25JbnB1dCwgb25WYWxpZGF0ZSB9ID0gdGhpcy5wcm9wZXJ0aWVzO1xyXG5cdFx0b25JbnB1dCAmJiBvbklucHV0KHZhbHVlKTtcclxuXHJcblx0XHRpZiAodHlwZW9mIGludmFsaWQgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdG9uVmFsaWRhdGUgJiYgb25WYWxpZGF0ZSh2YWx1ZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9vbkJsdXIodmFsdWU6IHN0cmluZykge1xyXG5cdFx0Y29uc3QgeyBvbkJsdXIsIG9uVmFsaWRhdGUgfSA9IHRoaXMucHJvcGVydGllcztcclxuXHRcdG9uVmFsaWRhdGUgJiYgb25WYWxpZGF0ZSh2YWx1ZSk7XHJcblx0XHRvbkJsdXIgJiYgb25CbHVyKCk7XHJcblx0fVxyXG5cclxuXHRwcm90ZWN0ZWQgcmVuZGVyKCkge1xyXG5cdFx0Y29uc3Qge1xyXG5cdFx0XHRkaXNhYmxlZCxcclxuXHRcdFx0bGFiZWwsXHJcblx0XHRcdG1heExlbmd0aCxcclxuXHRcdFx0bWluTGVuZ3RoLFxyXG5cdFx0XHRuYW1lLFxyXG5cdFx0XHRwbGFjZWhvbGRlcixcclxuXHRcdFx0cmVhZE9ubHksXHJcblx0XHRcdHJlcXVpcmVkLFxyXG5cdFx0XHR0eXBlID0gJ3RleHQnLFxyXG5cdFx0XHR2YWx1ZSxcclxuXHRcdFx0aW52YWxpZCxcclxuXHRcdFx0ZXJyb3JNZXNzYWdlLFxyXG5cdFx0XHRvbkJsdXIsXHJcblx0XHRcdG9uSW5wdXRcclxuXHRcdH0gPSB0aGlzLnByb3BlcnRpZXM7XHJcblxyXG5cdFx0cmV0dXJuIHYoJ2RpdicsIHsgY2xhc3NlczogdGhpcy50aGVtZShjc3MuaW5wdXRXcmFwcGVyKSB9LCBbXHJcblx0XHRcdHcoVGV4dElucHV0LCB7XHJcblx0XHRcdFx0YXJpYToge1xyXG5cdFx0XHRcdFx0ZGVzY3JpYmVkQnk6IHRoaXMuX2Vycm9ySWRcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGRpc2FibGVkLFxyXG5cdFx0XHRcdGludmFsaWQsXHJcblx0XHRcdFx0bGFiZWwsXHJcblx0XHRcdFx0bWF4TGVuZ3RoLFxyXG5cdFx0XHRcdG1pbkxlbmd0aCxcclxuXHRcdFx0XHRuYW1lLFxyXG5cdFx0XHRcdHBsYWNlaG9sZGVyLFxyXG5cdFx0XHRcdHJlYWRPbmx5LFxyXG5cdFx0XHRcdHJlcXVpcmVkLFxyXG5cdFx0XHRcdHR5cGUsXHJcblx0XHRcdFx0dmFsdWUsXHJcblx0XHRcdFx0b25CbHVyOiB0eXBlb2YgaW52YWxpZCA9PT0gJ3VuZGVmaW5lZCcgPyB0aGlzLl9vbkJsdXIgOiBvbkJsdXIsXHJcblx0XHRcdFx0b25JbnB1dDogdGhpcy5fb25JbnB1dFxyXG5cdFx0XHR9KSxcclxuXHRcdFx0aW52YWxpZCA9PT0gdHJ1ZSA/IHYoJ3NwYW4nLCB7XHJcblx0XHRcdFx0aWQ6IHRoaXMuX2Vycm9ySWQsXHJcblx0XHRcdFx0Y2xhc3NlczogdGhpcy50aGVtZShjc3MuZXJyb3IpLFxyXG5cdFx0XHRcdCdhcmlhLWxpdmUnOiAncG9saXRlJ1xyXG5cdFx0XHR9LCBbIGVycm9yTWVzc2FnZSBdKSA6IG51bGxcclxuXHRcdF0pO1xyXG5cdH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvdHNsaW50LWxvYWRlcj8/cmVmLS0wIS4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dlYnBhY2stY29udHJpYi9jc3MtbW9kdWxlLWR0cy1sb2FkZXI/dHlwZT10cyZpbnN0YW5jZU5hbWU9MF9kb2pvIS4vc3JjL3dpZGdldHMvVmFsaWRhdGVkVGV4dElucHV0LnRzIiwiaW1wb3J0IHsgV2lkZ2V0QmFzZSB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL1dpZGdldEJhc2UnO1xuaW1wb3J0IHsgdiB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2QnO1xuaW1wb3J0IHsgdGhlbWUsIFRoZW1lZE1peGluIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZCc7XG5pbXBvcnQgKiBhcyBjc3MgZnJvbSAnLi4vc3R5bGVzL3dvcmtlci5tLmNzcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgV29ya2VyUHJvcGVydGllcyB7XG5cdGZpcnN0TmFtZT86IHN0cmluZztcblx0bGFzdE5hbWU/OiBzdHJpbmc7XG5cdGVtYWlsPzogc3RyaW5nO1xuXHR0aW1lUGVyVGFzaz86IG51bWJlcjtcblx0dGFza3M/OiBzdHJpbmdbXTtcbn1cblxuY29uc3QgV29ya2VyQmFzZSA9IFRoZW1lZE1peGluKFdpZGdldEJhc2UpO1xuXG5AdGhlbWUoY3NzKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV29ya2VyIGV4dGVuZHMgV29ya2VyQmFzZTxXb3JrZXJQcm9wZXJ0aWVzPiB7XG5cdHByaXZhdGUgX2lzRmxpcHBlZCA9IGZhbHNlO1xuXG5cdHByb3RlY3RlZCByZW5kZXIoKSB7XG5cdFx0cmV0dXJuIHYoJ2RpdicsIHtcblx0XHRcdGNsYXNzZXM6IHRoaXMudGhlbWUoWyBjc3Mud29ya2VyLCB0aGlzLl9pc0ZsaXBwZWQgPyBjc3MucmV2ZXJzZSA6IG51bGwgXSlcblx0XHR9LCBbXG5cdFx0XHR0aGlzLl9yZW5kZXJGcm9udCgpLFxuXHRcdFx0dGhpcy5fcmVuZGVyQmFjaygpXG5cdFx0XSk7XG5cdH1cblxuXHRwcml2YXRlIF9yZW5kZXJGcm9udCgpIHtcblx0XHRjb25zdCB7XG5cdFx0XHRmaXJzdE5hbWUgPSAnZmlyc3ROYW1lJyxcblx0XHRcdGxhc3ROYW1lID0gJ2xhc3ROYW1lJ1xuXHRcdH0gPSB0aGlzLnByb3BlcnRpZXM7XG5cblx0XHRyZXR1cm4gdignZGl2Jywge1xuXHRcdFx0a2V5OiAnZnJvbnQnLFxuXHRcdFx0Y2xhc3NlczogdGhpcy50aGVtZShjc3Mud29ya2VyRnJvbnQpLFxuXHRcdFx0b25jbGljazogdGhpcy5mbGlwXG5cdFx0fSwgW1xuXHRcdFx0dignaW1nJywge1xuXHRcdFx0XHRjbGFzc2VzOiB0aGlzLnRoZW1lKGNzcy5pbWFnZSksXG5cdFx0XHRcdHNyYzogJ2h0dHBzOi8vZG9qby5pby90dXRvcmlhbHMvcmVzb3VyY2VzL3dvcmtlci5zdmcnXG5cdFx0XHR9KSxcblx0XHRcdHYoJ2RpdicsIFtcblx0XHRcdFx0dignc3Ryb25nJywgWyBgJHtsYXN0TmFtZX0sICR7Zmlyc3ROYW1lfWAgXSlcblx0XHRcdF0pXG5cdFx0XSk7XG5cdH1cblxuXHRwcml2YXRlIF9yZW5kZXJCYWNrKCkge1xuXHRcdGNvbnN0IHtcblx0XHRcdGZpcnN0TmFtZSA9ICdmaXJzdE5hbWUnLFxuXHRcdFx0bGFzdE5hbWUgPSAnbGFzdE5hbWUnLFxuXHRcdFx0ZW1haWwgPSAndW5hdmFpbGFibGUnLFxuXHRcdFx0dGltZVBlclRhc2sgPSAwLFxuXHRcdFx0dGFza3MgPSBbXVxuXHRcdH0gPSB0aGlzLnByb3BlcnRpZXM7XG5cblx0XHRyZXR1cm4gdignZGl2Jywge1xuXHRcdFx0a2V5OiAnYmFjaycsXG5cdFx0XHRjbGFzc2VzOiB0aGlzLnRoZW1lKGNzcy53b3JrZXJCYWNrKSxcblx0XHRcdG9uY2xpY2s6IHRoaXMuZmxpcFxuXHRcdFx0fSwgW1xuXHRcdFx0XHR2KCdpbWcnLCB7XG5cdFx0XHRcdFx0Y2xhc3NlczogdGhpcy50aGVtZShjc3MuaW1hZ2VTbWFsbCksXG5cdFx0XHRcdFx0c3JjOiAnaHR0cHM6Ly9kb2pvLmlvL3R1dG9yaWFscy9yZXNvdXJjZXMvd29ya2VyLnN2Zydcblx0XHRcdFx0fSksXG5cdFx0XHRcdHYoJ2RpdicsIHtcblx0XHRcdFx0XHRjbGFzc2VzOiB0aGlzLnRoZW1lKGNzcy5nZW5lcmFsSW5mbylcblx0XHRcdFx0fSwgW1xuXHRcdFx0XHRcdHYoJ2RpdicsIHtcblx0XHRcdFx0XHRcdGNsYXNzZXMgOiB0aGlzLnRoZW1lKGNzcy5sYWJlbClcblx0XHRcdFx0XHR9LCBbJ05hbWUnXSksXG5cdFx0XHRcdFx0dignZGl2JywgW2Ake2xhc3ROYW1lfSwgJHtmaXJzdE5hbWV9YF0pLFxuXHRcdFx0XHRcdHYoJ2RpdicsIHtcblx0XHRcdFx0XHRcdGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLmxhYmVsKVxuXHRcdFx0XHRcdH0sIFsnRW1haWwnXSksXG5cdFx0XHRcdFx0dignZGl2JywgW2Ake2VtYWlsfWBdKSxcblx0XHRcdFx0XHR2KCdkaXYnLCB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzOiB0aGlzLnRoZW1lKGNzcy5sYWJlbClcblx0XHRcdFx0XHR9LCBbJ0F2Zy4gVGltZSBwZXIgVGFzayddKSxcblx0XHRcdFx0XHR2KCdkaXYnLCBbYCR7dGltZVBlclRhc2t9YF0pXG5cdFx0XHRcdF0pLFxuXHRcdFx0XHR2KCdkaXYnLCBbXG5cdFx0XHRcdFx0dignc3Ryb25nJywgWydDdXJyZW50IFRhc2tzJ10pLFxuXHRcdFx0XHRcdHYoJ2RpdicsIHRhc2tzLm1hcCh0YXNrID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiB2KCdkaXYnLCB7XG5cdFx0XHRcdFx0XHRcdGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLnRhc2spXG5cdFx0XHRcdFx0XHR9LCBbdGFza10pO1xuXHRcdFx0XHRcdH0pKVxuXHRcdFx0XHRdKVxuXHRcdFx0XVxuXHRcdCk7XG5cdH1cblxuXHRmbGlwKCk6IHZvaWQge1xuXHRcdHRoaXMuX2lzRmxpcHBlZCA9ICF0aGlzLl9pc0ZsaXBwZWQ7XG5cdFx0dGhpcy5pbnZhbGlkYXRlKCk7XG5cdH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpbnQtbG9hZGVyPz9yZWYtLTAhLi9ub2RlX21vZHVsZXMvQGRvam8vd2VicGFjay1jb250cmliL2Nzcy1tb2R1bGUtZHRzLWxvYWRlcj90eXBlPXRzJmluc3RhbmNlTmFtZT0wX2Rvam8hLi9zcmMvd2lkZ2V0cy9Xb3JrZXIudHMiLCJpbXBvcnQgeyBXaWRnZXRCYXNlIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvV2lkZ2V0QmFzZSc7XG5pbXBvcnQgeyB3LCB2IH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvZCc7XG5pbXBvcnQgV29ya2VyLCB7IFdvcmtlclByb3BlcnRpZXMgfSBmcm9tICcuL1dvcmtlcic7XG5pbXBvcnQgeyB0aGVtZSwgVGhlbWVkTWl4aW4gfSBmcm9tICdAZG9qby93aWRnZXQtY29yZS9taXhpbnMvVGhlbWVkJztcbmltcG9ydCAqIGFzIGNzcyBmcm9tICcuLi9zdHlsZXMvd29ya2VyQ29udGFpbmVyLm0uY3NzJztcblxuZXhwb3J0IGludGVyZmFjZSBXb3JrZXJDb250YWluZXJQcm9wZXJ0aWVzIHtcblx0d29ya2VyRGF0YT86IFdvcmtlclByb3BlcnRpZXNbXTtcbn1cblxuY29uc3QgV29ya2VyQ29udGFpbmVyQmFzZSA9IFRoZW1lZE1peGluKFdpZGdldEJhc2UpO1xuXG5AdGhlbWUoY3NzKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV29ya2VyQ29udGFpbmVyIGV4dGVuZHMgV29ya2VyQ29udGFpbmVyQmFzZTxXb3JrZXJDb250YWluZXJQcm9wZXJ0aWVzPiB7XG5cblx0cHJvdGVjdGVkIHJlbmRlcigpIHtcblx0XHRjb25zdCB7XG5cdFx0XHR3b3JrZXJEYXRhID0gW11cblx0XHR9ID0gdGhpcy5wcm9wZXJ0aWVzO1xuXG5cdFx0Y29uc3Qgd29ya2VycyA9IHdvcmtlckRhdGEubWFwKCh3b3JrZXIsIGkpID0+IHcoV29ya2VyLCB7XG5cdFx0XHRrZXk6IGB3b3JrZXItJHtpfWAsXG5cdFx0XHQuLi53b3JrZXJcblx0XHR9KSk7XG5cblx0XHRyZXR1cm4gdignZGl2Jywge1xuXHRcdFx0Y2xhc3NlczogdGhpcy50aGVtZShjc3MuY29udGFpbmVyKVxuXHRcdH0sIHdvcmtlcnMpO1xuXHR9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvdHNsaW50LWxvYWRlcj8/cmVmLS0wIS4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dlYnBhY2stY29udHJpYi9jc3MtbW9kdWxlLWR0cy1sb2FkZXI/dHlwZT10cyZpbnN0YW5jZU5hbWU9MF9kb2pvIS4vc3JjL3dpZGdldHMvV29ya2VyQ29udGFpbmVyLnRzIiwiaW1wb3J0IHsgV2lkZ2V0QmFzZSB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL1dpZGdldEJhc2UnO1xuaW1wb3J0IHsgVHlwZWRUYXJnZXRFdmVudCB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgdiwgdyB9IGZyb20gJ0Bkb2pvL3dpZGdldC1jb3JlL2QnO1xuaW1wb3J0IHsgVGhlbWVkTWl4aW4sIHRoZW1lIH0gZnJvbSAnQGRvam8vd2lkZ2V0LWNvcmUvbWl4aW5zL1RoZW1lZCc7XG5pbXBvcnQgQnV0dG9uIGZyb20gJ0Bkb2pvL3dpZGdldHMvYnV0dG9uJztcbmltcG9ydCBWYWxpZGF0ZWRUZXh0SW5wdXQgZnJvbSAnLi9WYWxpZGF0ZWRUZXh0SW5wdXQnO1xuaW1wb3J0ICogYXMgY3NzIGZyb20gJy4uL3N0eWxlcy93b3JrZXJGb3JtLm0uY3NzJztcblxuZXhwb3J0IGludGVyZmFjZSBXb3JrZXJGb3JtRGF0YSB7XG5cdGZpcnN0TmFtZTogc3RyaW5nO1xuXHRsYXN0TmFtZTogc3RyaW5nO1xuXHRlbWFpbDogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdvcmtlckZvcm1Qcm9wZXJ0aWVzIHtcblx0Zm9ybURhdGE6IFdvcmtlckZvcm1EYXRhO1xuXHRmb3JtRXJyb3JzOiBXb3JrZXJGb3JtRXJyb3JzO1xuXHRvbkZvcm1JbnB1dDogKGRhdGE6IFBhcnRpYWw8V29ya2VyRm9ybURhdGE+KSA9PiB2b2lkO1xuXHRvbkZvcm1WYWxpZGF0ZTogKGRhdGE6IFBhcnRpYWw8V29ya2VyRm9ybURhdGE+KSA9PiB2b2lkO1xuXHRvbkZvcm1TYXZlOiAoKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdvcmtlckZvcm1FcnJvcnMge1xuXHRmaXJzdE5hbWU/OiBib29sZWFuO1xuXHRsYXN0TmFtZT86IGJvb2xlYW47XG5cdGVtYWlsPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IFdvcmtlckZvcm1CYXNlID0gVGhlbWVkTWl4aW4oV2lkZ2V0QmFzZSk7XG5cbkB0aGVtZShjc3MpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXb3JrZXJGb3JtIGV4dGVuZHMgV29ya2VyRm9ybUJhc2U8V29ya2VyRm9ybVByb3BlcnRpZXM+IHtcblxuXHRwcml2YXRlIF9vblN1Ym1pdChldmVudDogRXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRoaXMucHJvcGVydGllcy5vbkZvcm1TYXZlKCk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgb25GaXJzdE5hbWVJbnB1dChmaXJzdE5hbWU6IHN0cmluZykge1xuXHRcdHRoaXMucHJvcGVydGllcy5vbkZvcm1JbnB1dCh7IGZpcnN0TmFtZSB9KTtcblx0fVxuXG5cdHByb3RlY3RlZCBvbkxhc3ROYW1lSW5wdXQobGFzdE5hbWU6IHN0cmluZykge1xuXHRcdHRoaXMucHJvcGVydGllcy5vbkZvcm1JbnB1dCh7IGxhc3ROYW1lIH0pO1xuXHR9XG5cblx0cHJvdGVjdGVkIG9uRW1haWxJbnB1dChlbWFpbDogc3RyaW5nKSB7XG5cdFx0dGhpcy5wcm9wZXJ0aWVzLm9uRm9ybUlucHV0KHsgZW1haWwgfSk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgb25GaXJzdE5hbWVWYWxpZGF0ZShmaXJzdE5hbWU6IHN0cmluZykge1xuXHRcdHRoaXMucHJvcGVydGllcy5vbkZvcm1WYWxpZGF0ZSh7IGZpcnN0TmFtZSB9KTtcblx0fVxuXG5cdHByb3RlY3RlZCBvbkxhc3ROYW1lVmFsaWRhdGUobGFzdE5hbWU6IHN0cmluZykge1xuXHRcdHRoaXMucHJvcGVydGllcy5vbkZvcm1WYWxpZGF0ZSh7IGxhc3ROYW1lIH0pO1xuXHR9XG5cblx0cHJvdGVjdGVkIG9uRW1haWxWYWxpZGF0ZShlbWFpbDogc3RyaW5nKSB7XG5cdFx0dGhpcy5wcm9wZXJ0aWVzLm9uRm9ybVZhbGlkYXRlKHsgZW1haWwgfSk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgcmVuZGVyKCkge1xuXHRcdGNvbnN0IHtcblx0XHRcdGZvcm1EYXRhOiB7IGZpcnN0TmFtZSwgbGFzdE5hbWUsIGVtYWlsIH0sXG5cdFx0XHRmb3JtRXJyb3JzXG5cdFx0fSA9IHRoaXMucHJvcGVydGllcztcblxuXHRcdHJldHVybiB2KCdmb3JtJywge1xuXHRcdFx0Y2xhc3NlczogdGhpcy50aGVtZShjc3Mud29ya2VyRm9ybSksXG5cdFx0XHRub3ZhbGlkYXRlOiAndHJ1ZScsXG5cdFx0XHRvbnN1Ym1pdDogdGhpcy5fb25TdWJtaXRcblx0XHR9LCBbXG5cdFx0dignZmllbGRzZXQnLCB7IGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLm5hbWVGaWVsZCkgfSwgW1xuXHRcdFx0XHR2KCdsZWdlbmQnLCB7IGNsYXNzZXM6IHRoaXMudGhlbWUoY3NzLm5hbWVMYWJlbCkgfSwgWyAnTmFtZScgXSksXG5cdFx0XHRcdHcoVmFsaWRhdGVkVGV4dElucHV0LCB7XG5cdFx0XHRcdFx0a2V5OiAnZmlyc3ROYW1lSW5wdXQnLFxuXHRcdFx0XHRcdGxhYmVsOiAnRmlyc3QgTmFtZScsXG5cdFx0XHRcdFx0bGFiZWxIaWRkZW46IHRydWUsXG5cdFx0XHRcdFx0cGxhY2Vob2xkZXI6ICdHaXZlbiBuYW1lJyxcblx0XHRcdFx0XHR2YWx1ZTogZmlyc3ROYW1lLFxuXHRcdFx0XHRcdHJlcXVpcmVkOiB0cnVlLFxuXHRcdFx0XHRcdG9uSW5wdXQ6IHRoaXMub25GaXJzdE5hbWVJbnB1dCxcblx0XHRcdFx0XHRvblZhbGlkYXRlOiB0aGlzLm9uRmlyc3ROYW1lVmFsaWRhdGUsXG5cdFx0XHRcdFx0aW52YWxpZDogZm9ybUVycm9ycy5maXJzdE5hbWUsXG5cdFx0XHRcdFx0ZXJyb3JNZXNzYWdlOiAnRmlyc3QgbmFtZSBpcyByZXF1aXJlZCdcblx0XHRcdFx0fSksXG5cdFx0XHRcdHcoVmFsaWRhdGVkVGV4dElucHV0LCB7XG5cdFx0XHRcdFx0a2V5OiAnbGFzdE5hbWVJbnB1dCcsXG5cdFx0XHRcdFx0bGFiZWw6ICdMYXN0IE5hbWUnLFxuXHRcdFx0XHRcdGxhYmVsSGlkZGVuOiB0cnVlLFxuXHRcdFx0XHRcdHBsYWNlaG9sZGVyOiAnU3VybmFtZSBuYW1lJyxcblx0XHRcdFx0XHR2YWx1ZTogbGFzdE5hbWUsXG5cdFx0XHRcdFx0cmVxdWlyZWQ6IHRydWUsXG5cdFx0XHRcdFx0b25JbnB1dDogdGhpcy5vbkxhc3ROYW1lSW5wdXQsXG5cdFx0XHRcdFx0b25WYWxpZGF0ZTogdGhpcy5vbkxhc3ROYW1lVmFsaWRhdGUsXG5cdFx0XHRcdFx0aW52YWxpZDogZm9ybUVycm9ycy5sYXN0TmFtZSxcblx0XHRcdFx0XHRlcnJvck1lc3NhZ2U6ICdMYXN0IG5hbWUgaXMgcmVxdWlyZWQnXG5cdFx0XHRcdH0pXG5cdFx0XHRdKSxcblx0XHRcdHcoVmFsaWRhdGVkVGV4dElucHV0LCB7XG5cdFx0XHRcdGxhYmVsOiAnRW1haWwgYWRkcmVzcycsXG5cdFx0XHRcdHR5cGU6ICdlbWFpbCcsXG5cdFx0XHRcdHZhbHVlOiBlbWFpbCxcblx0XHRcdFx0cmVxdWlyZWQ6IHRydWUsXG5cdFx0XHRcdG9uSW5wdXQ6IHRoaXMub25FbWFpbElucHV0LFxuXHRcdFx0XHRvblZhbGlkYXRlOiB0aGlzLm9uRW1haWxWYWxpZGF0ZSxcblx0XHRcdFx0aW52YWxpZDogZm9ybUVycm9ycy5lbWFpbCxcblx0XHRcdFx0ZXJyb3JNZXNzYWdlOiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcydcblx0XHRcdH0pLFxuXHRcdFx0dyhCdXR0b24sIHt9LCBbICdTYXZlJyBdKVxuXHRcdF0pO1xuXHR9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvdHNsaW50LWxvYWRlcj8/cmVmLS0wIS4vbm9kZV9tb2R1bGVzL0Bkb2pvL3dlYnBhY2stY29udHJpYi9jc3MtbW9kdWxlLWR0cy1sb2FkZXI/dHlwZT10cyZpbnN0YW5jZU5hbWU9MF9kb2pvIS4vc3JjL3dpZGdldHMvV29ya2VyRm9ybS50cyJdLCJzb3VyY2VSb290IjoiIn0=