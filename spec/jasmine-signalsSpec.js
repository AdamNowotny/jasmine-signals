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

	});

	describe('toHaveBeenDispatched with count', function() {

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

});

