import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import Lobby from '../../views/Lobby';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
  background: rgba(50, 50, 50, 0.9);
  border-radius: 10px;
  padding: 50px;
`;

const UserlistContainer = styled.div`
  float: left;
  padding-left: 35px;
`;

const LobbyinformationContainer = styled.div`
  float: right;
  padding-right: 15px;
`;
const Lobbyinformation = styled.li`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: right;
`;

const FormContainer = styled.div`
  margin-top: 2em;
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

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(255,255,255), rgb(180, 190, 200));
  transition: opacity 0.5s ease, transform 0.5s ease;
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

class waitingScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null,
      lobbies: null,
      loginId: localStorage.getItem('loginId'),
      max_players: 7,
      rounds: 3,
      private: false
    };
  }

  async componentDidMount() {
  }

  async startgame() {
    this.props.history.push(`/playingfield`)
    return;
  }

  goback() {
    this.props.history.push(`/game`);
  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  render() {
    return (
      // Lobby list
      <Container>
        <FormContainer>
          <h2>Chill Area</h2>
          <hr width="100%" />
          <UserlistContainer>


          </UserlistContainer>
          <LobbyinformationContainer>
          <Lobbyinformation>
            <Label>Lobbyname</Label>
            <InputField id="form_name" />

            <Label>Gamemode</Label>
            <SelectField id="form_gamemode">
                <option value="classic">Classic</option>
                <option value="pokemon">Pokemon</option>
            </SelectField>

            <Label>Max. Players</Label>
            <SelectField id="from_player">
                <option value={this.state.max_players}>{this.state.max_players}</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </SelectField>


            <Label>Rounds</Label>
            <SelectField id="from_rounds">
                <option value={this.state.rounds}>{this.state.rounds}</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
            </SelectField>

            <Label>Private</Label>
            <OneLineBlock>
                <InputField id="form_private" type="checkbox" onChange={e => {this.handleInputChange('private', e.target.checked);}} />
                {this.state.private == true ? <InputField id="form_password" placeholder="Password" /> : "" }
            </OneLineBlock>
            </Lobbyinformation>
            </LobbyinformationContainer>
            <hr width="100%" />
            <ButtonContainer>
                <Button width="25%" onClick={() => {this.startgame();}}>Start the Game</Button>
          </ButtonContainer>
          <ButtonContainer>
            <Button width="25%" onClick={() => {this.goback();}}>Back</Button>
          </ButtonContainer>

        </FormContainer>
      </Container>
    );
  }
}

export default withRouter(waitingScreen);
