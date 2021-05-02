/**
 * Lobby Model
 */

class Game{
  status;
  constructor(data= {}) {
    this.id = data.id;
    this.timer = data.timePerRounds;
    this.members = data.players;
    this.roundTracker = data.roundTracker;
    this.rounds = data.numberofRounds;
  }
}

export default Game;
