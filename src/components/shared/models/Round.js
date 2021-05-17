/**
 * Round Model
 */

class Round {
  status;
  constructor(data= {}) {
    this.drawerName = data.drawerName;
    this.gotPoints = data.getPoints;
    this.hasDrawn = data.hasDrawn;
    this.hasGuessed = data.hasGuessed;
    this.id = data.id;
    this.index = data.index;
    this.players = data.players;
    this.status = data.status;
    this.word = data.word;
    this.words = data.words;
  }
}

export default Round;
