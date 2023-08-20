const { warn } = require('../utils/loging.js');
const config = require('../constant.js');

module.exports = inject;

const ARG_REGEX = /--\w+/g;

function inject(bot) {
	bot.on('chat', (username, message) => {
		if (username === config.master) {
			if (message.startsWith(config.username + ' ')) {
				const command = message.split(' ')[1];
				const arg = message ? message.match(ARG_REGEX) : null;

				if (command === 'echo') {
					const echo = message.split(' ')[2];
					bot.chat(echo);
				} else if (command === 'quit') {
					bot.quit();
					warn('Bot has been quit');
				} else if (command === 'follow') {
					if (!arg) {
						bot.chat('Please provide a username to follow');
					} else if (arg[0] === '--me') {
						bot.follow.follow(username);
					} else {
						const target = arg[0].split('--')[1];
						bot.follow.follow(target);
					}
				} else if (command === 'stop-follow') {
					bot.follow.stop();
				} else if (command === 'cuttrees') {
					const radius = bot.lumberJack.defaultRadius;
					bot.lumberJack.cutTreesInRadius(radius);
				} else {
					bot.chat('Unknown command');
				}
        	};
		}
	});
};
