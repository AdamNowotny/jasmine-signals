describe('jasmine-signals', function() {
	var signal, spy, result;

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

	it('should accept signal in expectations', function () {
		signal.dispatch();

		expect(signal).toHaveBeenDispatched();
	});

	describe('toHaveBeenDispatched', function() {

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

        describe('messages', function () {

            it('should show message when signal expected', function () {
                result = jasmine.signals.matchers.toHaveBeenDispatched(jasmine.matchersUtil).compare(spy);
                expect(result.message).toBe('Expected [Signal active:true numListeners:1] to have been dispatched');
            });

            it('should show message when signal not expected', function () {
                signal.dispatch();
                result = jasmine.signals.matchers.toHaveBeenDispatched(jasmine.matchersUtil).compare(spy);
                expect(result.message).toBe('Expected [Signal active:true numListeners:1] not to have been dispatched');
            });

            it('should show message when signal expected with count', function () {
                result = jasmine.signals.matchers.toHaveBeenDispatched(jasmine.matchersUtil).compare(spy, 2);
                expect(result.message).toBe('Expected [Signal active:true numListeners:1] to have been dispatched 2 times but was 0');
            });

            it('should show message when signal not expected with count', function () {
                signal.dispatch();
                signal.dispatch();
                result = jasmine.signals.matchers.toHaveBeenDispatched(jasmine.matchersUtil).compare(spy, 2);
                expect(result.message).toBe('Expected [Signal active:true numListeners:1] not to have been dispatched 2 times but was 2');
            });

        });

	});

	describe('toHaveBeenDispatchedWith', function() {

		it('should know if signal dispatched with parameters', function() {
            result = jasmine.signals.matchers.toHaveBeenDispatched(jasmine.matchersUtil).compare(spy, [2, 6]);
            expect(result.pass).toBe(false);
		});

		it('should know if signal not dispatched with parameters', function() {
            result = jasmine.signals.matchers.toHaveBeenDispatched(jasmine.matchersUtil).compare(spy, [2, 6]);
			signal.dispatch(1, 5);
            expect(result.pass).toBe(false);
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

		it('should know if signal dispatched with same parameters', function() {
			signal.dispatch(1);

			expect(spy).not.toHaveBeenDispatchedWith(1, 5);
		});

		it('supports simple object equality', function () {
			signal.dispatch({foo: 'bar'});

			expect(spy).toHaveBeenDispatchedWith({foo: 'bar'});
		});

        describe('messages', function () {
            it('should show message when signal expected with matching values', function () {
                signal.dispatch(3, 4);
                signal.dispatch(5, 6);
                result = jasmine.signals.matchers.toHaveBeenDispatchedWith(jasmine.matchersUtil).compare(spy, 1, 2);
                expect(result.message).toBe('Expected [Signal active:true numListeners:1] to have been dispatched with (1, 2) but was with (3,4)(5,6)');
            });
            it('should show message when signal not expected with matching values', function () {
                signal.dispatch(1, 2);
                signal.dispatch(3, 4);
                result = jasmine.signals.matchers.toHaveBeenDispatchedWith(jasmine.matchersUtil).compare(spy, 1, 2);
                expect(result.message).toBe('Expected [Signal active:true numListeners:1] not to have been dispatched with (1, 2) but was with (1,2)(3,4)');
            });
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

});

