const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals  } = require('mineflayer-pathfinder');
const autoeat = require('mineflayer-auto-eat').plugin;
const config = require('./constant.js');
const commander = require('./plugins/commander.js');
const follower = require('./plugins/follower.js');
const lumberJack = require('./plugins/lumberJack.js');
const selfDefence = require('./plugins/selfDefence.js');

const bot = mineflayer.createBot({
	host: config.host,
	port: config.port,
	username: config.username,
});

bot.loadPlugin(pathfinder);
bot.loadPlugin(autoeat);
bot.loadPlugin(commander);
bot.loadPlugin(follower);
bot.loadPlugin(lumberJack);
bot.loadPlugin(selfDefence);

bot.once('spawn', () => {
	const mcData = require('minecraft-data')(bot.version);
	const defaultMove = new Movements(bot, mcData);
	defaultMove.scafoldingBlocks = [];

	bot.pathfinder.setMovements(defaultMove);
	setInterval(() => {
		if (bot.follow.following) {
			
			const { x: targetX, y: targetY, z: targetZ } = bot.follow.target.position;
			const goal = new goals.GoalBlock(targetX, targetY, targetZ);
			bot.pathfinder.setGoal(goal);
		}
	}, 500);
});
