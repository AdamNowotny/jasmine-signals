jasmine-signals
================
`jasmine-signals` is a [Jasmine](https://github.com/pivotal/jasmine) matcher extension that simplifies writing specs for components using [JS-Signals](http://millermedeiros.github.com/js-signals/).

Adds new matchers to Jasmine:
 * toHaveBeenDispatched
 * toHaveBeenDispatchedWith

How to use
--------------
### Installation
```js
bower install jasmine-signals
```
or just copy [jasmine-signals.js](https://raw.github.com/AdamNowotny/jasmine-signals/master/jasmine-signals.js) to wherever you like.

### Create
First define which signal you're interested in.

```js
var signal = new signals.Signal();
var signalSpy = spyOnSignal(signal);
```

### Filtering signals
You can pass a boolean function to specify which dispatches to register.

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
		signals: 'components/js-signals/signals',
		jasmineSignals: 'components/jasmine-signals/jasmine-signals'
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
Just look at the specs: [jasmine-signalsSpec.js](https://github.com/AdamNowotny/jasmine-signals/tree/master/jasmine-signalsSpec.js)

Development
-----------
Install node.js, [bower](http://twitter.github.com/bower), get sources from git
```js
bower update
```
Open `SpecRunner.html` in the browser to run the tests.

Contributors
------------
[Adam Nowotny](https://github.com/AdamNowotny)

[Gavin Jackson](https://github.com/gavJackson)

License
-------
This code is distributed under Apache License version 2.0
