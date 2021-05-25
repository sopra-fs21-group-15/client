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
  overflow: auto;
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
      localStorage.removeItem('username');
      localStorage.removeItem('visited user');
      this.props.history.push('/login');
    }
    catch (error) {
      alert("Could not notify backend of logout");
    }
    localStorage.removeItem('token');
    localStorage.removeItem('loginId');
    localStorage.removeItem('username');
    localStorage.removeItem('visited user');
    this.props.history.push('/login');
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

    let intervaleLobbylist = setInterval(async () => {
      try {
        const response = await api.get('/users');
        this.setState({ users: response.data });
        const responseLobby = await api.get('/lobbies');
        this.setState({lobbies: responseLobby.data});
      } catch (error) {
        alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
      }
    }, 1000);
    this.setState({ intervaleLobbylist });
  }

  componentWillUnmount() {
    // Clear all intervals
    clearInterval(this.state.intervaleLobbylist);
  }

  async join_lobby(lobby) {
    let input_password = "";

    // Spectate if game already started
    if (lobby.status === "PLAYING") {
      localStorage.setItem("lobbyId", lobby.id)
      this.props.history.push("/waitingScreen")
      return;
    }

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
    this.props.history.push("/profilePage");
  }


  render() {
    return (
      // Lobby list
      <BaseContainer>
          <ListsContainer>
        {!this.state.lobbies ? (
          <Spinner />
        ):(
          <LobbylistContainer>
            <h2>Lobbies</h2>
            <Lobbies>
              {this.state.lobbies.map(lobby => {
                return (
                    <Lobby lobby={lobby} f_onClick={() => this.join_lobby(lobby)}/>
                );
              })}
            </Lobbies>
            <Button onClick={() => {this.createLobby();}}>
              Create Lobby
            </Button>
          </LobbylistContainer>
        )}
          {!this.state.users || !this.state.user ? (
            <Spinner />
          ):(
          // User and his FriendsList
          <FriendsListContainer>
            <h2>Hello {this.state.user.username}</h2>

            <Button
                style={{marginTop:38+"px"}}
                onClick={() => {this.go_to_profile(this.state.user)}}
            >View Profile</Button>



            <h2 style={{marginTop:"41px"}}>Registered Users</h2>
            <Users>
              {this.state.users.map(user => {
                return (
                    <PlayerContainer>
                      <Player user={user} f_onClick={() => this.go_to_profile(user)}/>
                    </PlayerContainer>
                );
              })}
            </Users>
            </FriendsListContainer> )}
            <Button onClick={() => { this.logout(); }} > Logout </Button>
      </ListsContainer>
      </BaseContainer>

    );
  }
}

export default withRouter(MainScreen);
