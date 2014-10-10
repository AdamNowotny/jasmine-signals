(function (global) {

	var spies = [];
	var jasmineEnv = jasmine.getEnv();

	jasmine.signals = {};

	/*
	* Spies definitions
	*/

	jasmine.signals.spyOnSignal = function (signal, matcher) {
		var spy = new jasmine.signals.SignalSpy(signal, matcher);
		spies.push(spy);
		return spy;
	};

	jasmine.signals.spyOnSignal.spyOnSignal = jasmine.signals.spyOnSignal;

	/*
	* Matchers
	*/

	function actualToString(spy) {
		return spy.dispatches.map(function (d) {
			return '(' + d + ')';
		}).join('');
	}

    jasmine.signals.matchers = {
        toHaveBeenDispatched: function (util, customEqualityTesters) {
            return {
                compare: function (actual, expectedCount) {
                    var result, spy = getSpy(actual);
                    if (!(spy instanceof jasmine.signals.SignalSpy)) {
                        throw new Error('Expected a SignalSpy');
                    }

                    result = {
                        pass: (expectedCount === undefined) ? !!(spy.count) : spy.count === expectedCount
                    };

                    result.message = result.pass ?
                        'Expected ' + spy.signal.toString() + ' not to have been dispatched' :
                        'Expected ' + spy.signal.toString() + ' to have been dispatched';

                    if (expectedCount > 0) {
                        result.message += ' ' + expectedCount + ' times but was ' + spy.count;
                    }
                    if (actual.expectedArgs !== undefined) {
                        result.message += ' with (' + spy.expectedArgs.join(',') + ')';
                        result.message += ' but was with ' + actualToString(spy);
                    }

                    return result;
                }
            };
        },
        toHaveBeenDispatchedWith: function (util, customEqualityTesters) {
            return {
                compare: function (actual, expectedParam) {
                    var result, spy = getSpy(actual), args = [].slice.call(arguments);
                    args.shift();
                    if (!(spy instanceof jasmine.signals.SignalSpy)) {
                        throw new Error('Expected a SignalSpy');
                    }

                    result = {
                        pass: spy.dispatches.filter(spy.signalMatcher).map(function (d) {
                            return util.equals(d, args);
                        }).reduce(function (a, b) {
                            return a || b;
                        }, false)
                    };

                    result.message = result.pass ?
                        'Expected ' + spy.signal.toString() + ' not to have been dispatched' :
                        'Expected ' + spy.signal.toString() + ' to have been dispatched';


                    if (expectedParam !== undefined) {
                        result.message += ' with (' + args.join(', ') + ')';
                        result.message += ' but was ' + (spy.dispatches.length ? 'with ' + actualToString(spy) : 'not dispatched');
                    }

                    return result;
                }
            };
        }
    };

    function getSpy(actual) {
        if (actual instanceof signals.Signal) {
            return spies.filter(function spiesForSignal(d) {
                return d.signal === actual;
            })[0];
        }
        return actual;
    }

    /*
     * Spy implementation
     */

    (function (namespace) {
        namespace.SignalSpy = function (signal, matcher) {
            if (!(signal instanceof signals.Signal)) {
                throw 'spyOnSignal requires a signal as a parameter';
            }
            this.signal = signal;
            this.signalMatcher = matcher || allSignalsMatcher;
            this.count = 0;
            this.dispatches = [];
            this.plan = function() {  };
            this.initialize();
        };

        function allSignalsMatcher() {
            return true;
        }

        function onSignal() {
            var paramArray = (arguments.length) ? Array.prototype.slice.call(arguments) : [];
            this.dispatches.push(paramArray);
            if (this.signalMatcher.apply(this, Array.prototype.slice.call(arguments))) {
                this.count++;
            }
            this.signal.halt();
            return this.plan.apply(this, arguments);
        }

        namespace.SignalSpy.prototype.initialize = function () {
            this.signal.add(onSignal, this, 999);
        };

        namespace.SignalSpy.prototype.stop = function () {
            this.signal.remove(onSignal, this);
        };

        namespace.SignalSpy.prototype.matching = function (predicate) {
            this.signalMatcher = predicate;
            return this;
        };

        namespace.SignalSpy.prototype.andCallThrough = function() {  //TODO: tests
            this.plan = function() {
                var planArgs = arguments;
                this.stop();  //stop spying - remove the spy binding
                this.signal._bindings && this.signal._bindings.forEach(function(binding) { //apply args to original listeners
                    var listener = binding.getListener();
                    listener.apply(this, planArgs);
                }.bind(this));
                this.initialize();  //start again - add our spy back
            }.bind(this);
            return this;
        };

        namespace.SignalSpy.prototype.andThrow = function(exceptionMsg) {  //TODO: tests
            this.plan = function() {
                throw exceptionMsg;
            };
            return this;
        };

        namespace.SignalSpy.prototype.andCallFake = function(fakeFunc) {  //TODO: tests
            this.plan = fakeFunc;
            return this;
        };

    })(jasmine.signals);

    jasmine.createSignalSpyObj = function(baseName, methodNames) {  //TODO: tests
        var obj = {};
        if (!jasmine.isArray_(methodNames) || methodNames.length === 0) {
            throw new Error('createSignalSpyObj requires a non-empty array of method names to create spies for');
        }
        methodNames.forEach(function(name){
            obj[name] = jasmine.signals.spyOnSignal(new signals.Signal());
        });
        return obj;
    };

    beforeEach(function () {
        jasmine.addMatchers(jasmine.signals.matchers);
    });

    afterEach(function () {
        spies.forEach(function (d) {
            d.stop();
        });
        spies = [];
    });

    // exports to multiple environments
    if (typeof define === 'function' && define.amd) { // AMD
        define(['signals'], function (amdSignals) {
            signals = amdSignals;
            spyOnSignal = jasmine.signals.spyOnSignal;
            return jasmine.signals.spyOnSignal;
        });
    } else if (typeof module !== 'undefined' && module.exports) { // node
        module.exports = jasmine.signals.spyOnSignal;
    } else { // browser
        // use string because of Google closure compiler ADVANCED_MODE
        /*jslint sub: true */
        global['spyOnSignal'] = jasmine.signals.spyOnSignal;
        signals = global['signals'];
    }

} (this));
