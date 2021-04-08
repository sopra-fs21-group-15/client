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

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
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
  margin-left: -4px;
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
      users: null,
      lobbies: null,
      loginId: localStorage.getItem('loginId') //added the login Id
    };
  }

  async componentDidMount() {
    return;
  }

  async createLobby() {
    return;
  }

  goback() {
    this.props.history.push(`/game`);
  }

  render() {
    return (
      // Lobby list
      <Container>
        <FormContainer>
          <h2>Create a Lobby</h2>

          <Label>Lobbyname</Label>
          <InputField id="form_name" />

          <Label>Gamemode</Label>
          <SelectField id="form_gamemode">
            <option value="classic">Classic</option>
            <option value="pokemon">Pokemon</option>
          </SelectField>

          <Label>Max. Players</Label>
          <InputField id="form_max_players" type="range" min="3" max="10" value="7" />

          <Label>Rounds</Label>
          <InputField id="form_rounds" type="range" min="1" max="10" value="7" />

          <Label>Private</Label>
          <InputField id="form_priv" type="checkbox" />

          <ButtonContainer>
            <Button width="25%" onClick={() => {this.login();}}>Create Lobby</Button>
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
