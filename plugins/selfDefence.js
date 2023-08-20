const { goals } = require('mineflayer-pathfinder');

module.exports = inject;

function inject(bot) {
	class SelfDefence {
		constructor() {
			this.weaponPriority = ['netherite_sword', 'diamond_sword', 'iron_sword', 'stone_sword', 'wooden_sword'];
			bot.on('entityUpdate', (entity) => {
				if (entity.type === 'hostile' && entity.mobType !== 'Armor Stand') {
					if (entity.position.distanceTo(bot.entity.position) <= 10) {
						if (!this.isDefending) {
							const weapon = this.getBestWeapon();
							if (weapon) {
								this.equipWeapon(weapon);
							}
						}

						this.attackMob(entity);
					}
				}
			});
		}

		getNearestMob() {
			const mobs = bot.entities;
			const mobArray = Object.values(mobs);

			// Filter mobs and find the nearest one
			let nearestMob = null;
			let nearestDistance = Infinity;

			for (const mob of mobArray) {
				if (mob.type === 'mob' && mob.position) {
					const distance = mob.position.distanceTo(bot.entity.position);
					if (distance <= 10 && distance < nearestDistance) {
						nearestMob = mob;
						nearestDistance = distance;
					}
				}
			}

			return nearestMob;
		}

		getBestWeapon() {
			for (const weapon of this.weaponPriority) {
				if (bot.inventory.items().find(item => item.name.includes(weapon))) {
					return weapon;
				}
			}

			return null;
		}

		equipWeapon(weapon) {
			const weaponItem = bot.inventory.items().find(item => item.name.includes(weapon));

			if (weaponItem) {
				bot.equip(weaponItem, 'hand');
			}
		}

		attackMob(mob) {
			// move near the mob and attack it
			const goal = new goals.GoalFollow(mob, 1);
			bot.pathfinder.setGoal(goal, true);
			bot.lookAt(mob.position.offset(0, 1.6, 0));
			bot.attack(mob);
		}
	}

	bot.selfDefence = new SelfDefence();
};
