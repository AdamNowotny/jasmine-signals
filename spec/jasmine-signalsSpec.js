describe('jasmine-signals', function() {

	var signal;
	var spy;

	beforeEach(function () {
		signal = new signals.Signal();
		spy = spyOnSignal(signal);
	});

	it('should fail if not spying on signal', function() {
		expect(function() {
			spyOnSignal({ });
		}).toThrow('spyOnSignal requires a signal as a parameter');
	});

	it('should fail if signal to spy on not specified', function() {
		expect(function() {
			spyOnSignal();
		}).toThrow('spyOnSignal requires a signal as a parameter');
	});

	it('should fail if signal to spy on is null', function() {
		expect(function() {
			spyOnSignal(null);
		}).toThrow('spyOnSignal requires a signal as a parameter');
	});

	it('should subscribe to signal on spy', function() {
		expect(signal.getNumListeners()).toBe(1);
	});

	it('should unsubscribe from signal on stop', function() {
		spy.stop();
		
		expect(signal.getNumListeners()).toBe(0);
	});

	describe('toHaveBeenDispatched', function() {

		it('should require expect to use spy', function() {
			signal.dispatch();

			expect(function() {
				expect(signal).toHaveBeenDispatched();
			}).toThrow(new Error('Expected a SignalSpy'));
		});

		it('should know if signal dispatched', function() {
			signal.dispatch();

			expect(spy).toHaveBeenDispatched();
		});

		it('should know if signal not dispatched', function() {
			expect(spy).not.toHaveBeenDispatched();
		});

		it('should pass if dispatched specified number of times', function() {
			signal.dispatch();
			signal.dispatch();
			signal.dispatch();

			expect(spy).toHaveBeenDispatched(3);
		});

		it('should fail if signal count wrong', function() {
			signal.dispatch();

			expect(spy).not.toHaveBeenDispatched(3);
		});

	});

	describe('toHaveBeenDispatchedWith', function() {

		it('should require expect to use spy', function() {
			signal.dispatch();

			expect(function() {
				expect(signal).toHaveBeenDispatchedWith();
			}).toThrow(new Error('Expected a SignalSpy'));
		});

		it('should know if signal dispatched with parameters', function() {
			var expectParam = {
				actual: spy,
				isNot: false
			};

			expect(jasmine.signals.matchers.toHaveBeenDispatchedWith.apply(expectParam, [2, 6])).toBe(false);
		});

		it('should know if signal not dispatched with parameters', function() {
			var expectParam = {
				actual: spy,
				isNot: true
			};
			
			signal.dispatch(1, 5);

			expect(jasmine.signals.matchers.toHaveBeenDispatchedWith.apply(expectParam, [2, 6])).toBe(false);
		});

		it('should know if signal dispatched with parameters', function() {
			signal.dispatch(1, 5);
			signal.dispatch(2, 6);

			expect(spy).toHaveBeenDispatchedWith(1, 5);
			expect(spy).toHaveBeenDispatchedWith(2, 6);
		});

		it('should know if signal not dispatched', function() {
			signal.dispatch(1, 5);

			expect(spy).not.toHaveBeenDispatchedWith(2, 3);
		});

	});

	describe('matching', function() {

		it('should spyOnSignal with function matcher', function() {
			spy.matching(function(signalInfo) {
				return signalInfo === 1;
			});

			signal.dispatch(1);
			signal.dispatch(5);
			signal.dispatch(1);

			expect(spy).toHaveBeenDispatched();
			expect(spy).toHaveBeenDispatched(2);
		});

	});

	describe('matchingValues', function() {

		it('should spyOnSignal matching values', function() {
			spy.matchingValues(1);

			signal.dispatch(1);
			signal.dispatch(5);
			signal.dispatch(1);

			expect(spy).toHaveBeenDispatched();
			expect(spy).toHaveBeenDispatched(2);
		});


		it('should spyOnSignal matching multiple values', function() {
			spy.matchingValues('a', 'b');

			signal.dispatch('a', 3);
			signal.dispatch('a', 'b');
			signal.dispatch(5);

			expect(spy).toHaveBeenDispatched();
			expect(spy).toHaveBeenDispatched(1);
		});

	});

	describe('messages', function () {

		it('should show message when signal expected', function () {
			var expectParam = {
				actual: spy
			};

			var messageFunction = jasmine.signals.matchers.toHaveBeenDispatched.apply(expectParam);

			expect(expectParam.message()).toBe('Expected [Signal active:true numListeners:1] to have been dispatched');
		});

		it('should show message when signal not expected', function () {
			signal.dispatch();
			var expectParam = {
				actual: spy,
				isNot: true
			};

			var messageFunction = jasmine.signals.matchers.toHaveBeenDispatched.apply(expectParam);

			expect(expectParam.message()).toBe('Expected [Signal active:true numListeners:1] not to have been dispatched');
		});

		it('should show message when signal expected with count', function () {
			var expectParam = {
				actual: spy
			};

			var messageFunction = jasmine.signals.matchers.toHaveBeenDispatched.apply(expectParam, [2]);

			expect(expectParam.message()).toBe('Expected [Signal active:true numListeners:1] to have been dispatched 2 times but was 0');
		});

		it('should show message when signal not expected with count', function () {
			signal.dispatch();
			signal.dispatch();
			var expectParam = {
				actual: spy,
				isNot: true
			};

			var messageFunction = jasmine.signals.matchers.toHaveBeenDispatched.apply(expectParam, [2]);

			expect(expectParam.message()).toBe('Expected [Signal active:true numListeners:1] not to have been dispatched 2 times');
		});

		it('should show message when signal expected with matching values', function () {
			spy.matchingValues(1, 2);
			signal.dispatch(3, 4);
			signal.dispatch(5, 6);
			var expectParam = {
				actual: spy
			};

			var messageFunction = jasmine.signals.matchers.toHaveBeenDispatched.apply(expectParam);

			expect(expectParam.message()).toBe('Expected [Signal active:true numListeners:1] to have been dispatched with (1,2) but was with (3,4)(5,6)');
		});

		it('should show message when signal not expected with matching values', function () {
			spy.matchingValues(1, 2);
			signal.dispatch(3, 4);
			signal.dispatch(1, 2);
			var expectParam = {
				actual: spy,
				isNot: true
			};

			var messageFunction = jasmine.signals.matchers.toHaveBeenDispatched.apply(expectParam);

			expect(expectParam.message()).toBe('Expected [Signal active:true numListeners:1] not to have been dispatched with (1,2) but was with (3,4)(1,2)');
		});

	});
});

