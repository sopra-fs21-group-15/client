import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import Lobby from '../../views/Lobby';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import User from "../shared/models/User";

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
  background: rgba(50, 50, 50, 0.9);
  border-radius: 10px;
  padding: 50px;
  margin-top: 50px;
`;

const FriendsListContainer = styled.div`
  float: right;
  padding-left: 35px; 
`;

const LobbylistContainer = styled.div`
  float: left;
  padding-right: 35px;
  max-height: 550px;
  overflow: hidden;
`;

const ListsContainer = styled.div`
  height: 300px;
  max-height: 300px;
`;


const Users = styled.ul`
  list-style: none;
  padding-left: 0;
  padding-bottom: 10px;
  max-height: 250px;
  overflow-y: auto;
  
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Lobbies = styled.ul`
  list-style: none;
  padding-left: 0;
  padding-bottom: 1px;
  max-height: 380px;
  overflow-y: auto;
`;

class MainScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
      userId: localStorage.getItem("visited User"),
      users: null,
      friends: null,
      lobbies: null,
      lobby: null,
      lobbyId: localStorage.getItem("lobbyId"),
      loginId: localStorage.getItem('loginId'),
      username: localStorage.getItem('username')
    };
  }

  async getUser() {
    try {
      const url = '/users/' + this.state.loginId;

      // wait for the user information
      const response = await api.get(url);
      const user = new User(response.data);
      this.setState({user: user})
    }
    catch (error) {
      alert(`Something went wrong while fetching the user: \n${handleError(error)}`);
    }
  }

// changed logout to put player on OFFLINE
  async logout() {
    try {
      const url = '/logout/' + this.state.loginId;
      await api.put(url);

      localStorage.removeItem('token');
      localStorage.removeItem('loginId');
      localStorage.removeItem('visited user');
      this.props.history.push('/login');
    }
    //If you have not logout push the user to login page
    catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('loginId');
      this.props.history.push(`/login`); //redirect user to game page
    }
  }

  createLobby() {
    this.props.history.push(`/createLobby`);
  }

  async componentDidMount() {
    // Get specific user
    this.getUser()

    try {
      const response = await api.get('/users');
      this.setState({ users: response.data });

      const responseLobby = await api.get('/lobbies');
      this.setState({lobbies: responseLobby.data});
    } catch (error) {
      alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
    }
  }

  async join_lobby(lobby) {
    let input_password = "";
    if (lobby.password !== "")
      input_password = prompt("Please enter the Lobby password");

    try {
      const requestBody = JSON.stringify({
            lobbyname: this.state.username,
            password: input_password
          });

      await api.put('/lobbies/' + lobby.id + '/joiners', requestBody);

      localStorage.setItem("lobbyId", lobby.id)
      this.props.history.push("/waitingScreen")

    } catch (error) {
      alert(`Something went wrong during joining the lobby: \n${handleError(error)}`);
    }
  }

  go_to_profile(user) {
    // set the id for the profile the user is visiting
    localStorage.setItem("visited User", user.id);
    // go to profile page
    this.props.history.push("/game/dashboard/profilepage");
  }


  render() {
    return (
      // Lobby list
      <Container>
          <ListsContainer>
        {!this.state.lobbies ? (
          <Spinner />
        )
        :
        (
          <LobbylistContainer>
            <h2>Lobbies</h2>
            <Lobbies>
              {this.state.lobbies.map(lobby => {
                return (
                    <Lobby lobby={lobby} f_onClick={() => this.join_lobby(lobby)}/>
                );
              })}
            </Lobbies>
            <Button
                onClick={() => {
                  this.createLobby();
                }}
            >
              Create Lobby
            </Button>
          </LobbylistContainer>
        )}
          {!this.state.users || !this.state.user ? (
            <Spinner />
          )
          :
          (
              // User and his FriendsList
              //
          <FriendsListContainer>
            <h2>Hello {this.state.user.username}</h2>
            <Button
                onClick={() => {this.go_to_profile(this.state.username)}}
            >View Profile</Button>

            <h2 style={{marginTop:41+"px"}}>Registered Users</h2>
            <Users>
              {this.state.users.map(user => {
                return (
                    <PlayerContainer key={user.id}>
                      <Player user={user} f_onClick={() => this.go_to_profile(user)}/>
                    </PlayerContainer>
                );
              })}
            </Users>
            <Button
                width="55%"
                onClick={() => {
                  this.logout();
                }}
            >
              Logout
            </Button>
            </FriendsListContainer>

          )}
          </ListsContainer>
      </Container>

    );
  }
}

export default withRouter(MainScreen);
