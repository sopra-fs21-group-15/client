/**
 * Lobby Model
 */

class Lobby{
  status;
  constructor(data= {}) {
    this.id = data.id;
    this.password = data.password;
    this.lobbyname = data.lobbyname;
    this.size = data.size;
    this.timer = data.timer;
    this.members = data.members;
    this.status = data.status;
    this.rounds = data.rounds;
    this.gameMode = data.gameMode;
  }
}

export default Lobby;
