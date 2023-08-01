function warn (msg) {
// eslint-disable-next-line no-console
	console.warn(`\x1b[33m[warn]\x1b[0m: ${msg}`);
};

function error (msg) {
// eslint-disable-next-line no-console
	console.error(`\x1b[31m[error]\x1b[0m: ${msg}`);
}

exports.warn = warn;
exports.error = error;
