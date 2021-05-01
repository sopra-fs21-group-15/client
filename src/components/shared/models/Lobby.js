/**
 * Lobby Model
 */

class Lobby{
    constructor(data= {}) {
        this.lobbyName = data.lobbyName;
        this.lobbyId = data.lobbyId;
        this.rounds = null;
        this.password = null;
        this.maxPlayers = null;
        this.gameMode = null;

    }
}

export default Lobby;