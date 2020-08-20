// https://github.com/myshov/history-of-javascript/blob/master/8_asynchronous_js_fight_with_complexity/f_csp_2013/app.js

const path = require('path');
const util = require('util');

const Piscina = require('piscina');

const piscina = new Piscina({
	filename: path.resolve(__dirname, 'worker.js')
});

(async function () {
	const result = await piscina.runTask({a: 4, b: 6});
	console.log(result);
})();

const csp = require('js-csp');

const toCh = csp.chan();
const fromCh = csp.chan();

const waitAndPut = async function (value, ch) {
	const result = await piscina.runTask({a: value, b: 5});
	console.log('result from worker', result);
	csp.putAsync(ch, result);
	ch.close();
};

// Notice that we're keeping `toCh` open after `fromCh` is closed
csp.operations.pipelineAsync(3, toCh, waitAndPut, fromCh, true);

csp.go(function* () {
	let value = yield toCh;

	while (value !== csp.CLOSED) {
		console.log("Got ", value);
		value = yield toCh;
	};
});

csp.putAsync(fromCh, 3000);
csp.putAsync(fromCh, 2000);
csp.putAsync(fromCh, 1000);