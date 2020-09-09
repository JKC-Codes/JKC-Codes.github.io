const regEx = require('./regular-expressions.js');

function isSpeed(option) {
	return new RegExp(regEx.speed,'i').test(option);
}

function isLanguage(option) {
	if(typeof option !== 'string') { return false; }
	try {
		Intl.getCanonicalLocales(option);
		return true;
	}
	catch {
		return false;
	}
}

module.exports = function(customOptions) {
	// Create object from instance options array
	const options = {};
	customOptions.forEach(option => {
		if(isSpeed(option)) {
			options.speed = option;
		}
		else if(isLanguage(option)) {
			options.language = option;
		}
		else {
			throw new Error(`Time-to-read encountered an unrecognised option: ${option}`);
		}
	})
	return options;
}