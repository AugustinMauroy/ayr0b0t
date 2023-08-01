const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const config = require('./constant.js');
const { warn } = require('./utils/loging.js');

const ARG_REGEX = /--\w+/g;

const bot = mineflayer.createBot({
	host: config.host,
	port: config.port,
	username: config.username,
});

bot.loadPlugin(pathfinder);

const botStatement = {
	follow : {
		username: '',
		status: false,
	}
};

bot.on('chat', (username, message) => {
	if (username === config.master) {
		if (message.startsWith(config.username + ' ')) {
			const command = message.split(' ')[1];
			const arg = message? message.match(ARG_REGEX) : null;

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
					bot.chat('Following ' + username);
					botStatement.follow.username = username;
					botStatement.follow.status = true;
					follow();
				} else {
					const target = arg[0].split('--')[1];
					bot.chat('Following ' + target);
					botStatement.follow.username = target;
					botStatement.follow.status = true;
					follow();
				}
			} else if (command === 'stop-follow') {
				if (botStatement.follow.status === false) {
					bot.chat('Bot is not following anyone');
				} else {
					botStatement.follow.status = false;
				}
			} else {
				bot.chat('Unknown command');
			}
		}
	};
});

async function follow() {
	const mcData = require('minecraft-data')(bot.version);
	const movements = new Movements(bot, mcData);
	movements.scafoldingBlocks = [];

	bot.pathfinder.setMovements(movements);

	while (botStatement.follow.status) {
		const target = bot.players[botStatement.follow.username];

		if (!target) {
			bot.chat('Player ' + botStatement.follow.username + ' not found');
			botStatement.follow.status = false;
			break;
		}

		const goal = new goals.GoalFollow(target.entity, 1);
		bot.pathfinder.setGoal(goal);

		await new Promise(resolve => {
			bot.once('goal_reached', resolve);
		});
	}

	bot.chat('Stopped following ' + botStatement.follow.username);
	bot.pathfinder.setGoal(null);
	botStatement.follow.username = '';
	botStatement.follow.status = false;
}
