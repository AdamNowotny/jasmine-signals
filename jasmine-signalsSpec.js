describe('jasmine-signals', function() {
	var signal, spy, listenerSpy, result;

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

	it('should accept signal in expectations', function () {
		signal.dispatch();

		expect(signal).toHaveBeenDispatched();
	});

    it('should halt dispatch before it reaches listeners added before spy invocation', function () {
        var signal = new signals.Signal();
        listenerSpy = jasmine.createSpy('listenerSpy');
        signal.add(listenerSpy);
        spy = spyOnSignal(signal);
        signal.dispatch();

        expect(spy).toHaveBeenDispatched();
        expect(listenerSpy).not.toHaveBeenCalled();
    });

    it('should halt dispatch before it reaches listeners added after spy invocation', function () {
        listenerSpy = jasmine.createSpy('listenerSpy');
        signal.add(listenerSpy);
        signal.dispatch();

        expect(spy).toHaveBeenDispatched();
        expect(listenerSpy).not.toHaveBeenCalled();
    });

    describe('stop', function() {
        it('should unsubscribe from the signal', function() {
            spy.stop();

            expect(signal.getNumListeners()).toBe(0);
        });
        it('should resume normal dispatch to listeners', function () {
            listenerSpy = jasmine.createSpy('listenerSpy');
            signal.add(listenerSpy);
            spy.stop();
            signal.dispatch();

            expect(spy).not.toHaveBeenDispatched();
            expect(listenerSpy).toHaveBeenCalled();
        });
    });

    describe('andThrow', function() {
        it('should throw the correct exception', function() {
            var exceptionMsg = 'test exception';
            spy.andThrow(exceptionMsg);

            expect(spy).not.toHaveBeenDispatched();
            expect(signal.dispatch).toThrow(exceptionMsg);
        });
        it('should not throw an exception after the spy has been stopped', function () {
            var exceptionMsg = 'test exception';
            spy.andThrow(exceptionMsg);
            spy.stop();

            expect(spy).not.toHaveBeenDispatched();
            expect(signal.dispatch).not.toThrow(exceptionMsg);
        });
    });

    describe('andCallFake', function() {
        it('should call the mock function on signal dispatch', function() {
            listenerSpy = jasmine.createSpy('listenerSpy');
            spy.andCallFake(listenerSpy);
            signal.dispatch();

            expect(spy).toHaveBeenDispatched();
            expect(listenerSpy).toHaveBeenCalled();
        });
        it('should not call the mock function after the spy has been stopped', function () {
            listenerSpy = jasmine.createSpy('listenerSpy');
            spy.andCallFake(listenerSpy);
            spy.stop();
            signal.dispatch();

            expect(spy).not.toHaveBeenDispatched();
            expect(listenerSpy).not.toHaveBeenCalled();
        });
    });

    describe('andCallThrough', function() {
        it('should call through to listeners added before spy invocation', function () {
            var signal = new signals.Signal();
            listenerSpy = jasmine.createSpy('listenerSpy');
            signal.add(listenerSpy);
            spy = spyOnSignal(signal).andCallThrough();
            signal.dispatch();

            expect(spy).toHaveBeenDispatched();
            expect(listenerSpy).toHaveBeenCalled();
        });

        it('should call through to listeners added after spy invocation', function () {
            listenerSpy = jasmine.createSpy('listenerSpy');
            signal.add(listenerSpy);
            spy.andCallThrough();
            signal.dispatch();

            expect(spy).toHaveBeenDispatched();
            expect(listenerSpy).toHaveBeenCalled();
        });
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

        it('supports jasmine.any', function () {
            signal.dispatch('some string', {foo: 'bar'});

            expect(spy).toHaveBeenDispatchedWith(jasmine.any(String),jasmine.any(Object));
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

    describe('createSignalSpyObj', function() {
        var error_msg = 'createSignalSpyObj requires a non-empty array of method names to create spies for';

        it('should throw an error if methodNames is an empty array', function() {
            expect(function() {
                jasmine.createSignalSpyObj([]);
            }).toThrowError(error_msg);
        });
        it('should throw an error if methodNames is not an array', function() {
            expect(function() {
                jasmine.createSignalSpyObj({});
            }).toThrowError(error_msg);
        });
        it('should return an object of SignalSpies', function() {
            var methodNames = ['test1', 'test2', 'test3'],
                spies = jasmine.createSignalSpyObj(methodNames);

            methodNames.forEach(function(spy_name) {
                expect(spies[spy_name] instanceof jasmine.signals.SignalSpy).toEqual(true);
            });
        });
    });

});

