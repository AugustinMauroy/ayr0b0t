const fs = require('node:fs');
const path = require('node:path');

function warn (msg) {
// eslint-disable-next-line no-console
	console.warn(`\x1b[33m[warn]\x1b[0m: ${msg}`);
};

function error (msg) {
// eslint-disable-next-line no-console
	console.error(`\x1b[31m[error]\x1b[0m: ${msg}`);
}

function log (msg) {
// eslint-disable-next-line no-console
	console.log(`\x1b[32m[log]\x1b[0m: ${msg}`);
}


function logEntry(entry) {
	const filename = path.join(process.cwd(), 'logs', 'lumberjack.log');
	fs.appendFile(filename, entry + '\n', (err) => {
		if (err) {
			error('Une erreur est survenue lors de l\'enregistrement :', err);
		};
	});
}

exports.warn = warn;
exports.error = error;
exports.log = log;
exports.logEntry = logEntry;
