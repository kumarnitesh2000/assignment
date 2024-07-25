const logger = require("./logger");

class AssignmentStrategy {
  constructor(_moderators) {
    this.moderators = _moderators;
  }
  getSelectedModerator() {
    throw new Error("You have to implement the method assignTask!");
  }
}

class RoundRobin extends AssignmentStrategy {
  constructor(_moderators, _redisClient) {
    super(_moderators);
    this.redisClient = _redisClient;
    this.currentIndexKey = "roundRobinCurrentIndex";
  }
  getSelectedModerator() {
    return this.redisClient.get(this.currentIndexKey).then((currentIndex) => {
      logger.info(`currentIndex is ${currentIndex} in redis`);
      if (currentIndex === null) {
        currentIndex = 0;
      } else {
        currentIndex = parseInt(currentIndex);
      }

      const selectedModerator = this.moderators[currentIndex];
      currentIndex = (currentIndex + 1) % this.moderators.length;
      logger.info(`adding currentIndex ${currentIndex} in redis`);
      return this.redisClient
        .set(this.currentIndexKey, currentIndex)
        .then(() => selectedModerator);
    });
  }
}

class WeightedRoundRobin extends AssignmentStrategy {
  constructor(_moderators, _redisClient) {
    super(_moderators);
    this.redisClient = _redisClient;
    this.currentIndexKey = "weightedRoundRobinCurrentIndex";
  }
  getSelectedModerator() {
    return this.redisClient.get(this.currentIndexKey).then((currentIndex) => {
      // Initialize the index if it's not found
      if (currentIndex === null) {
        currentIndex = 0;
      } else {
        currentIndex = parseInt(currentIndex);
      }

      // Calculate total weight
      const totalWeight = this.moderators.reduce(
        (sum, mod) => sum + mod.weight,
        0
      );
      let currentWeight = 0;
      const weightedIndex = currentIndex % totalWeight;
      let selectedModerator = this.moderators[0];

      for (const mod of this.moderators) {
        currentWeight += mod.weight;
        if (weightedIndex < currentWeight) {
          selectedModerator = mod;
          break;
        }
      }

      // Update the index for the next selection
      currentIndex = (currentIndex + 1) % totalWeight;

      // Store the updated index in Redis
      return this.redisClient
        .set(this.currentIndexKey, currentIndex)
        .then(() => selectedModerator);
    });
  }
}

class PerformanceBased extends AssignmentStrategy {
  constructor(_moderators) {
    super(_moderators);
  }
  getSelectedModerator() {
    let bestPerformanceModerator = this.moderators[0];
    for (const moderator of this.moderators) {
      if (
        moderator.performance_score > bestPerformanceModerator.performance_score
      ) {
        bestPerformanceModerator = moderator;
      }
    }

    return Promise.resolve(bestPerformanceModerator);
  }
}

module.exports = { PerformanceBased, RoundRobin, WeightedRoundRobin };
