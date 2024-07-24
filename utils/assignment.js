class AssignmentStrategy {
  constructor(_moderators) {
    this.moderators = _moderators;
  }
  getSelectedModerator() {
    throw new Error("You have to implement the method assignTask!");
  }
}

class RoundRobin extends AssignmentStrategy {
  constructor(_moderators) {
    super(_moderators);
  }
  getSelectedModerator() {
    return this.moderators[0];
  }
}

class WeightedRoundRobin extends AssignmentStrategy {
  constructor(_moderators) {
    super(_moderators);
  }
  getSelectedModerator() {
    return this.moderators[0];
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

    return bestPerformanceModerator;
  }
}

module.exports = { PerformanceBased, RoundRobin, WeightedRoundRobin };
