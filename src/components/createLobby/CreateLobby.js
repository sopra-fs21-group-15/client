import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import {api, handleError} from "../../helpers/api";
import Lobby from "../shared/models/Lobby";

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
  background: rgba(50, 50, 50, 0.9);
  border-radius: 10px;
  padding: 50px;
`;

const FormContainer = styled.div`
  margin-top: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const OneLineBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;


const InputField = styled.input`
  &::placeholder {
    color: black;
  }
  height: 35px;
  padding-left: 15px;
  margin: 12px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 1);
  color: black;
  
`;

const SelectField = styled.select`
  &::placeholder {
    color: black;
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 1);
  color: black;
`;

const Label = styled.label`
  color: #999999;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
`;

class CreateLobby extends React.Component {
  constructor() {
    super();
    this.state = {
      loginId: localStorage.getItem('loginId'),
      size: 7,
      rounds: 4,
      private: false,
      lobbyName: "",
      gameMode: "Classic",
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
            //timer: this.state.gameMode
          }
      )

      // wait for making new Lobby
      const response = await api.post('/lobbies/' + this.state.loginId, requestBody);
      // get new lobby and update the new Lobby Object
      const lobby = new Lobby(response.data);

      // set the lobbyID
      localStorage.setItem("lobbyId",lobby.lobbyId)

      this.props.history.push(`/waitingRoom`)

    }
    catch (error){
      alert(`Something went wrong during the lobby creation: \n${handleError(error)}`);
      this.props.history.push(`/game/dashboard`);
    }

  }

  goback() {
    this.props.history.push(`/game`);
  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  async componentDidMount() {}

  render() {
    return (
      // Lobby list
      <Container>
        <FormContainer>
          <h2>Create a Lobby</h2>
          <hr width="100%" />

          <Label>Lobbyname</Label>
          <InputField id="form_name"
              onChange={ e => {this.handleInputChange("lobbyName", e.target.value)}}/>

          <Label>Gamemode</Label>
          <SelectField id="form_gamemode" value={this.state.gameMode} onChange={e => this.handleInputChange("gameMode",e.target.value)}>
            <option value="classic">Classic</option>
            <option value="pokemon">Pokemon</option>
          </SelectField>

          <Label>Max. Players</Label>
          <OneLineBlock>
            <InputField value={this.state.size} onChange={e => {this.handleInputChange('maxPlayers', e.target.value);}} id="form_max_players" type="range" min="3" max="10" />
            <InputField type="text" id="form_max_players_display" value={this.state.size} />
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
          <hr width="100%" />
          <ButtonContainer>
            <Button width="25%" onClick={() => {this.createLobby();}}>Create Lobby</Button>
          </ButtonContainer>
          <ButtonContainer>
            <Button width="25%" onClick={() => {this.goback();}}>Back</Button>
          </ButtonContainer>

        </FormContainer>
      </Container>
    );
  }
}

export default withRouter(CreateLobby);
