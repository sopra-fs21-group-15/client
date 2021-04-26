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
const Layout = styled.div`
    display:flex;
    flex-direction:row;
  `;
const UserlistContainer = styled.div`
  float: left;
  padding-right: 50%;
  display:flex;
  flex-direction: column;
`;
const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const LobbyinformationContainer = styled.div`
  float: right;
  padding-right: 15px;
  padding-right: 50%;
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
  align-items: right;
  min-height: 300px;
  justify-content: right;
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
      ownerID: null,
      max_players: null,
      rounds: null,
      private: false
    };
  }

  async componentDidMount() {
   try {
        const response = await api.get('/users');
        this.setState({ users: response.data });
      } catch (error) {
        alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
      }
    try {
        const response = await api.get('/lobbies');
        this.setState({ lobby: response.data });
        } catch (error) {
            alert(`Something went wrong while fetching the lobby data: \n${handleError(error)}`);
      }

  }

  async startgame() {
     try{
        const requestBody_2 = JSON.stringify({
            gamemode: this.state.form_gamemode,
            max_players: this.state.from_player,
            rounds: this.state.from_rounds,
            private: this.state.form_private,
            password: this.state.form_password,

        });

        const url = '/lobbies';
        /** give the changes to the backend **/
        await api.put(url, requestBody_2);
        }
        catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        this.props.history.push(`/draw`)
        }

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
          <Layout>
          <UserlistContainer>
          {this.state.users.map(user => {
            return (
            <PlayerContainer key={user.id}>
               <Player user={user} f_onClick={() => this.go_to_profile(user)} />
               <Button>
               kick out
               </Button>
            </PlayerContainer>
            );
              })}

          </UserlistContainer>
          <LobbyinformationContainer>
          <Lobbyinformation>
            <Label>Lobbyname</Label>
            <h2>Name of the Lobby</h2>
            <Label>Gamemode</Label>
            <SelectField id="form_gamemode"
            disabled={this.state.ownerID!=this.state.loginID}
            >
                <option value="classic">Classic</option>
                <option value="pokemon">Pokemon</option>
            </SelectField>

            <Label>Max. Players</Label>
            <SelectField id="from_player"
            disabled={this.state.ownerID!=this.state.loginID}
            >
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
            <SelectField id="from_rounds"
            disabled={this.state.ownerID!=this.state.loginID}
            >
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
                <InputField id="form_private" type="checkbox" disabled={this.state.ownerID!=this.state.loginID} onChange={e => {this.handleInputChange('private', e.target.checked);}} />
                {this.state.private == true ? <InputField id="form_password" placeholder="Password" /> : "" }
            </OneLineBlock>
            </Lobbyinformation>
            </LobbyinformationContainer>
            </Layout>
            <hr width="100%" />
            <ButtonContainer>

               <Button
               disabled={!this.state.users<2 && !this.state.loginID == this.state.ownerID }
               width="25%" onClick={() => {this.startgame();}}>
               Start the Game
               </Button>

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
