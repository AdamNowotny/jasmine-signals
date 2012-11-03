jasmine-signals
================
`jasmine-signals` is a [Jasmine](https://github.com/pivotal/jasmine) matcher extension that simplifies writing specs for components using [JS-Signals](http://millermedeiros.github.com/js-signals/).

Adds to expectations to Jasmine:
 * toHaveBeenDispatched
 * toHaveBeenDispatchedWith

How to use
--------------

### Create
First define which signal you're interested in.

```js
var signal = new signals.Signal();
var signalSpy = spyOnSignal(signal);
```

### Filtering signals
You can pass a boolean function to specify which dispatches to register.
=======
### Filter
You can pass a boolean function to specify which signal dispatches to count.
>>>>>>> allow passing signal to expectation

```js
var signal = new signals.Signal();
var signalSpy = spyOnSignal(signal).matching(function (dispatchInfo) {
	return dispatchInfo !== null;
});
signal.dispatch();  // ignored
signal.dispatch(5); // registered
```

### Expectations
After defining the spy you can set expectations in your spec.

```js
expect(signalSpy).toHaveBeenDispatched();  // expect signal to have been dispatched at least once
expect(signal).toHaveBeenDispatched(); // passing signal is also allowed, first spy will be used
expect(signal).toHaveBeenDispatched(3); // expect signal to have been dispatched 3 times
expect(signal).toHaveBeenDispatchedWith(1, 5); // expect signal to have been dispatched with parameters
```

AMD
-------------
It's possible to use `jasmine-signals` as an AMD (Asynchronous Module Definition) module.

`jasmine-signals` depends on JS-Signals, so first define `signals` path:

```js
require.config({
	paths: {
		signals: 'lib/js-signals/signals',
		jasmineSignals: 'lib/jasmine-signals/jasmine-signals'
	}
});
```

Then use it in `Jasmine` tests like this:

```js
define(['myClass', 'jasmineSignals'], function(myClass, spyOnSignal) {
	it('should signal completed', function () {
		spyOnSignal(myClass.completed);

		myClass.doSomething();

		expect(myClass.completed).toHaveBeenDispatched();
	});
});
```

Examples
--------
Check the [spec](https://github.com/AdamNowotny/jasmine-signals/tree/master/spec) folder for full examples.

Contributors
------------
[Adam Nowotny](https://github.com/AdamNowotny)

[Gavin Jackson](https://github.com/gavJackson)

License
-------
This code is distributed under Apache License version 2.0
