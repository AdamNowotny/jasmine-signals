describe('jasmine-signals', function() {

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
		var signal = new signals.Signal();

		spyOnSignal(signal);

		expect(signal.getNumListeners()).toBe(1);
	});

	describe('toHaveBeenDispatched', function() {

		it('should require expect to use spy', function() {
			var signal = new signals.Signal();
			var signalSpy = spyOnSignal(signal);

			signal.dispatch();

			expect(function() {
				expect(signal).toHaveBeenDispatched();
			}).toThrow(new Error('Expected a SignalSpy'));
		});

		it('should know if signal dispatched', function() {
			var signal = new signals.Signal();
			var signalSpy = spyOnSignal(signal);

			signal.dispatch();

			expect(signalSpy).toHaveBeenDispatched();
		});

		it('should know if signal not dispatched', function() {
			var signal = new signals.Signal();
			var signalSpy = spyOnSignal(signal);

			expect(signalSpy).not.toHaveBeenDispatched();
		});

	});

	describe('toHaveBeenDispatched with count', function() {

		it('should pass if dispatched specified number of times', function() {
			var signal = new signals.Signal();
			var signalSpy = spyOnSignal(signal);

			signal.dispatch();
			signal.dispatch();
			signal.dispatch();

			expect(signalSpy).toHaveBeenDispatched(3);
		});

		it('should fail if signal count wrong', function() {
			var signal = new signals.Signal();
			var signalSpy = spyOnSignal(signal);

			signal.dispatch();

			expect(signalSpy).not.toHaveBeenDispatched(3);
		});

	});

	describe('matching', function() {

		it('should spyOnSignal with function matcher', function() {
			var signal = new signals.Signal();
			var signalSpy = spyOnSignal(signal).matching(function(signalInfo) {
				return signalInfo === 1;
			});

			signal.dispatch(1);
			signal.dispatch(5);
			signal.dispatch(1);

			expect(signalSpy).toHaveBeenDispatched();
			expect(signalSpy).toHaveBeenDispatched(2);
		});

	});

	describe('matchingValues', function() {

		it('should spyOnSignal matching values', function() {
			var signal = new signals.Signal();
			var signalSpy = spyOnSignal(signal).matchingValues(1);

			signal.dispatch(1);
			signal.dispatch(5);
			signal.dispatch(1);

			expect(signalSpy).toHaveBeenDispatched();
			expect(signalSpy).toHaveBeenDispatched(2);
		});


        it('should spyOnSignal matching multiple values', function() {
            var signal = new signals.Signal();
            var signalSpy = spyOnSignal(signal).matchingValues('a','b');

            signal.dispatch('a',3);
            signal.dispatch(5);
            signal.dispatch('a','b');

            expect(signalSpy).toHaveBeenDispatched();
            expect(signalSpy).toHaveBeenDispatched(1);
        });

	});

});

