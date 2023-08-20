// need to be use with precaution, it's not perfect and can break some blocks
// @TODO: add a way to stop the lumberjack, optimize the code, add a way to use axe
const { goals } = require('mineflayer-pathfinder');

module.exports = inject;

function inject(bot) {
	const mcData = require('minecraft-data')(bot.version);
	const LOG_BLOCKS = [mcData.blocksByName.oak_log.id, mcData.blocksByName.spruce_log.id, mcData.blocksByName.birch_log.id, mcData.blocksByName.jungle_log.id, mcData.blocksByName.acacia_log.id, mcData.blocksByName.dark_oak_log.id];

	class LumberJack {
		constructor() {
		  this.defaultRadius = 15;
		}
	
		async cutTreesInRadius(radius) {
		  const trees = this.findTreesInRadius(radius);

		  if (trees.length === 0) {
				bot.chat(`No trees found within ${radius} blocks.`);
				return;
		  }

		  for (const tree of trees) {
				await this.destroyTree(tree);
		  }
		}
	
		findTreesInRadius(radius) {
		  const trees = bot.findBlocks({
				point: bot.entity.position,
				matching: LOG_BLOCKS,
				maxDistance: radius,
				count: 50,
		  });
		  
		  return this.sortByDistanceFromBot(trees, bot.entity.position);
		}

		distanceSquared(pos1, pos2) {
			const dx = pos1.x - pos2.x;
			const dy = pos1.y - pos2.y;
			const dz = pos1.z - pos2.z;
			return dx * dx + dy * dy + dz * dz;
		}		

		sortByDistanceFromBot(blockList, botPosition) {
			return blockList.sort((a, b) => {
				const distA = this.distanceSquared(a, botPosition);
				const distB = this.distanceSquared(b, botPosition);
				return distA - distB;
			});
		}
	
		async destroyTree(treePosition) {
			const treeGoal = new goals.GoalBlock(treePosition.x, treePosition.y, treePosition.z);
    		await bot.pathfinder.goto(treeGoal);
			await bot.dig(bot.blockAt(treePosition), true);
		}
	}

	bot.lumberJack = new LumberJack();
}
