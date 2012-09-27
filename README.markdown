jasmine-signals
================
`jasmine-signals` is a [Jasmine](https://github.com/pivotal/jasmine) matcher extension that simplifies writing specs for components using [JS-Signals](http://millermedeiros.github.com/js-signals/).

The matchers can be used to count how many times specified signal has been dispatched.

You can also restrict which signal dispatches to count.

How to use
--------------

### Signal spies
First define which signal you're interested in.

```js
var signal = new signals.Signal();
var signalSpy = spyOnSignal(signal);
```

### Specific parameters using predicate
You can also pass a boolean function to specify which dispatches to count.

```js
var signal = new signals.Signal();
var signalSpy = spyOnSignal(signal).matching(function (dispatchInfo) {
	return dispatchInfo === 5;
});
```

This will only look at signals dispatched like this:

```js
signal.dispatch(5);
```

### Specific parameter values
You can simplify the above using:

```js
var signal = new signals.Signal();
var signalSpy = spyOnSignal(signal).matchingValues(5);
```

### Expectations
After defining the spy you can set expectations in your spec.

```js
expect(signalSpy).toHaveBeenDispatched();  // expect signal to have been dispatched at least once
expect(signalSpy).toHaveBeenDispatched(3); // expect signal to have been dispatched 3 times
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
define(['myClass', 'jasmineSignals'], function(myClass, jasmineSignals) {
	var spyOnSignal = jasmineSignals.spyOnSignal;

	it('should signal completed', function () {
		var completedSpy = spyOnSignal(myClass.completed);

		myClass.doSomething();

		expect(spy).toHaveBeenDispatched();
	});
});
```

Examples
--------
Check the [spec](https://github.com/AdamNowotny/jasmine-signals/tree/master/spec) folder for full examples.

License
-------
This code is distributed under Apache License version 2.0
