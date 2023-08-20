const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals  } = require('mineflayer-pathfinder');
const config = require('./constant.js');
const commander = require('./plugins/commander.js');
const follower = require('./plugins/follower.js');

const bot = mineflayer.createBot({
	host: config.host,
	port: config.port,
	username: config.username,
});

bot.loadPlugin(pathfinder);
bot.loadPlugin(commander);
bot.loadPlugin(follower);

const mcData = require('minecraft-data')(bot.version);
const movements = new Movements(bot, mcData);
movements.scafoldingBlocks = [];

bot.pathfinder.setMovements(movements);

setInterval(() => {
	if (bot.follow.following) {
		const { x: targetX, y: targetY, z: targetZ } = bot.follow.target.position;

		const goal = new goals.GoalBlock(targetX, targetY, targetZ);
		bot.pathfinder.setGoal(goal);
	}
}, 500);
