import React from 'react';
import { BaseContainer } from '../../helpers/layout';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import {api, handleError} from "../../helpers/api";
import Lobby from "../shared/models/Lobby";
import { FormContainer } from '../../views/design/FormContainer.js';
import { Legend } from '../../views/design/Legend.js';
import { Label } from '../../views/design/Label.js';
import { InputField } from '../../views/design/InputField.js';
import { HR } from '../../views/design/HR.js';
import { OneLineBlock } from '../../views/design/OneLineBlock.js';
import { SelectField } from '../../views/design/SelectField.js';


class CreateLobby extends React.Component {
  constructor() {
    super();
    this.state = {
      loginId: localStorage.getItem('loginId'),
      maxPlayers: 7,
      rounds: 4,
      private: false,
      lobbyName: "",
      gameMode: "CLASSIC",
      password: ""
    };
  }

  async createLobby() {
    try {
      const requestBody = JSON.stringify({
        lobbyname: this.state.lobbyName,
        rounds: this.state.rounds,
        password: this.state.password,
        size: this.state.maxPlayers,
        timer: 60,
        gameMode: this.state.gameMode
      });

      if (this.state.lobbyName.length > 12) {
        alert("LobbyName can only have 12 characters")
        return;
      }

      // wait for making new Lobby
      const response = await api.post('/lobbies/' + this.state.loginId, requestBody);

      // get new lobby and update the new Lobby Object
      const lobby = new Lobby(response.data);

      // set the lobbyID
      localStorage.setItem("lobbyId", lobby.id)
      this.props.history.push(`/waitingScreen`)
    }
    catch (error){
      alert(`Something went wrong during the lobby creation: \n${handleError(error)}`);
      this.props.history.push(`/mainScreen`);
    }
  }

  goback() {
    this.props.history.push(`/mainScreen`);
  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  onKeyDown(event){
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.createLobby();
    }
  }


  render() {
    return (
      // Lobby list
      <BaseContainer>
        <FormContainer>
          <Legend>Create a Lobby</Legend>
          <HR/>

          <Label>Lobbyname</Label>
          <InputField id="form_name"
                      onChange={ e => {
                        if (e.target.value.length-1 >= 12){
                          alert("Lobby Name can only have 12 characters")
                          e.target.value = e.target.value.substring(0,12)}
                        else {this.handleInputChange("lobbyName", e.target.value)}}}
              onKeyDown={(e)=>this.onKeyDown(e)}/>

          <Label>Gamemode</Label>
          <SelectField id="form_gamemode" value={this.state.gameMode} onChange={e => this.handleInputChange("gameMode",e.target.value)}>
            <option value="CLASSIC">Classic</option>
            <option value="SPEED">Speed</option>
          </SelectField>

          <Label>Max. Players</Label>
          <OneLineBlock>
            <InputField value={this.state.max_players} onChange={e => {this.handleInputChange('maxPlayers', e.target.value);}} id="form_max_players" type="range" min="3" max="10" />
            <InputField type="text" id="form_max_players_display" value={this.state.maxPlayers} />
          </OneLineBlock>


          <Label>Rounds</Label>
          <OneLineBlock>
            <InputField value={this.state.rounds} onChange={e => {this.handleInputChange('rounds', e.target.value);}} id="form_rounds" type="range" min="1" max="10" />
            <InputField type="text" id="form_rounds_display" value={this.state.rounds} />
          </OneLineBlock>

          <Label>Private</Label>
          <OneLineBlock>
            <InputField id="form_private" type="checkbox" onChange={e => {this.handleInputChange('private', e.target.checked);}} />
            {this.state.private === true ? <InputField id="form_password" value={this.state.password} onChange={e => {this.handleInputChange('password', e.target.value);}} placeholder="Password" /> : "" }
          </OneLineBlock>
          <HR/>
          <Button disabled={this.state.lobbyName === ""} width="25%" onClick={() => {this.createLobby();}}>Create Lobby</Button>
          <Button width="25%" onClick={() => {this.goback();}}>Back</Button>
        </FormContainer>
      </BaseContainer>
    );
  }
}

export default withRouter(CreateLobby);
