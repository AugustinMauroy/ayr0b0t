module.exports = inject;

function inject(bot) {
    
	class Follow {
		constructor() {
			this.target = null;
			this.following = false;
		}

		follow(playerName) {
			this.target = bot.players[playerName].entity;
			if (!this.target) {
				bot.chat('I cannot see ' + playerName);
				return;
			}
			bot.chat('Following ' + playerName);
			this.following = true;
		}

		stop() {
			if (!this.following) {
				bot.chat('I am not following anyone');
			}
			this.following = false;
		}
	}

	const follow = new Follow(bot);
	bot.follow = follow;
};
