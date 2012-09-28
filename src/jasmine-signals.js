(function (global) {

	var signals;

	jasmine.signals = {};

	/*
	* Spies definitions
	*/

	jasmine.signals.spyOnSignal = function (signal, matcher) {
		var spy = new jasmine.signals.SignalSpy(signal, matcher);
		return spy;
	};

	/*
	* Matchers
	*/

	jasmine.signals.matchers = {
		toHaveBeenDispatched: function (expectedCount) {
			this.message = function() {
				var not = this.isNot ? ' not' : '';
				var message = 'Expected ' + this.actual.signal.toString() + not + ' to have been dispatched';
				if (expectedCount > 0) {
					message += (this.isNot) ?
						' ' + expectedCount + ' times' :
						' ' + expectedCount + ' times but was ' + this.actual.count;
				}
				if (this.actual.expectedArgs !== undefined) {
					var dispatchMessage = '';
					for (var i = 0; i < this.actual.totalCount; i++) {
						if (!this.actual.signalMatcher(this.actual.dispatches[i])) {
							dispatchMessage += '(' + this.actual.dispatches[i] + ')';
						}
					}
					message += ' with (' + this.actual.expectedArgs.join(',') + ') but was with ' + dispatchMessage;
				}
				return message;
			};

			if (!(this.actual instanceof jasmine.signals.SignalSpy)) {
				throw new Error('Expected a SignalSpy');
			}
			if (expectedCount === undefined) {
				return this.actual.count > 0;
			} else {
				return this.actual.count === expectedCount;
			}
		}
	};

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
			this.totalCount = 0;
			this.dispatches = [];
			this.initialize();
		};

		function allSignalsMatcher() {
			return true;
		}

		namespace.SignalSpy.prototype.initialize = function () {
			this.signal.add(function () {
				var paramArray = (arguments.length) ? Array.prototype.slice.call(arguments) : [];
				this.dispatches.push(paramArray);
				this.totalCount++;
				if (this.signalMatcher.apply(this, Array.prototype.slice.call(arguments))) {
					this.count++;
				}
			}, this);
		};

		namespace.SignalSpy.prototype.matching = function (predicate) {
			this.signalMatcher = predicate;
			return this;
		};

		namespace.SignalSpy.prototype.matchingValues = function () {
			this.expectedArgs = Array.prototype.slice.call(arguments);
			this.signalMatcher = function () {
				for (var i = 0; i < this.expectedArgs.length; i++) {
					if (arguments[i] !== this.expectedArgs[i]) {
						return false;
					}
				}
				return true;
			};
			return this;
		};
	})(jasmine.signals);

	beforeEach(function () {
		this.addMatchers(jasmine.signals.matchers);
	});

	// exports to multiple environments
	if (typeof define === 'function' && define.amd) { // AMD
		define(['signals'], function (amdSignals) {
			signals = amdSignals;
			return jasmine.signals;
		});
	} else if (typeof module !== 'undefined' && module.exports) { // node
		module.exports = jasmine.signals;
	} else { // browser
		// use string because of Google closure compiler ADVANCED_MODE
		global['spyOnSignal'] = jasmine.signals.spyOnSignal;
		signals = global['signals'];
	}

} (this));
