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

	var spyOnSignal = jasmine.signals.spyOnSignal;

	/*
	* Matchers
	*/

	jasmine.signals.matchers = {
		toHaveBeenDispatched: function (expectedCount) {
			if (!(this.actual instanceof jasmine.signals.SignalSpy)) {
				throw new Error('Expected a SignalSpy');
			}

			this.message = function() {
				var message = 'Expected ' + this.actual.signal.toString() + ' to have been dispatched';
				if (expectedCount > 0) {
					message += ' (' + expectedCount + ' times but was ' + this.actual.count + ')';
				}
				if (this.actual._matchingValuesMessage !== '') {
					message += ' with ' + this.actual._paramCount + ' params: '  + this.actual._matchingValuesMessage;
				}
				return message;
			};

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
			this.matcher = matcher || allSignalsMatcher;
			this.count = 0;
			this._matchingValuesMessage = '';
			this._paramCount = 0;
			this.initialize();
		};

		function allSignalsMatcher() {
			return true;
		}

		namespace.SignalSpy.prototype.initialize = function () {
			this.signal.add(onSignal, this);

			function onSignal(parameters) {
				if (this.matcher.apply(this, [].splice.call(arguments, 0))){
					this.count++;
				}
			}
		};

		namespace.SignalSpy.prototype.reset = function () {
			this.count = 0;
		};

		namespace.SignalSpy.prototype.matching = function (predicate) {
			this.matcher = predicate;
			return this;
		};

		namespace.SignalSpy.prototype.matchingValues = function () {
			var expectedArgs = arguments;

			this.matcher = function () {
				if(this._matchingValuesMessage !== '') {
					this._matchingValuesMessage += ", ";
				}
				this._paramCount = expectedArgs.length;

				for (var i = 0; i < expectedArgs.length; i++) {
					if (arguments[i] !== expectedArgs[i]) {
						this._matchingValuesMessage += "(expected `" + expectedArgs[i] + "` but was `" + arguments[i] + "`)";
						return false;
					}
					else{
						this._matchingValuesMessage += "(`" + expectedArgs[i] + "` was `" + arguments[i] + "`)";
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
		global['spyOnSignal'] = spyOnSignal;
		signals = global['signals'];
	}

} (this));
