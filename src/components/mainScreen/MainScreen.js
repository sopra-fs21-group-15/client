import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import Lobby from '../../views/Lobby';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import User from "../shared/models/User";
import Friends from "../../views/Friends";

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
  max-height 550px;
  overflow: hidden;
`;

const ListsContainer = styled.div`
  height: 300px;
  max-height: 300px;
`;
const FriendsContainer = styled.div`
  height: 300px;
  max-height: 300px;
  padding-top: 20px;
`

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
  padding-bottom: 1px;
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
      loginId: localStorage.getItem('loginId') //added the login Id
    };
  }

  async getUser() {
    try {
      const url = '/users/' + this.state.userId;
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
    this.getUser()
    // Get users
    try {
      const response = await api.get('/users');
      this.setState({ users: response.data });
      //TODO: Fake data for the lobbies and Friends Need to remove it Later
      this.setState({ friends: [{"id":31,"password":"123","name":"John"},{"id":42,"password":"123","name":"Tommy"}] });
      this.setState({ lobbies: [{"id":1,"password":"123","name":"lobby1"},{"id":2,"password":"123","name":"lobby2"},
          {"id":1,"password":"123","name":"lobby1"},{"id":2,"password":"123","name":"lobby2"},
          {"id":1,"password":"123","name":"lobby1"},{"id":2,"password":"123","name":"lobby2"},
          {"id":1,"password":"123","name":"lobby1"},{"id":2,"password":"123","name":"lobby2"},
          {"id":1,"password":"123","name":"lobby1"},{"id":2,"password":"123","name":"lobby2"}] });
    } catch (error) {
      alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
    }

    //TODO get this method to work after the backend is done with their implementations
    /**try {
      const response = await api.get('/lobbies');
      this.setState({ lobbies: response.data });
    } catch (error) {
      alert(`Something went wrong while fetching the lobbies: \n${handleError(error)}`);
    }*/
  }

  join_lobby(lobby) {
    localStorage.setItem("visited lobby", lobby.id);
    /**set the id for the profile the user is visiting**/
    this.props.history.push("/game/dashboard/profilepage"); // TODO: go to right page
    /** go to profile page **/
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
                    <Lobby lobby={lobby} f_onClick={() => this.join_lobby(lobby)} />
                );
              })}
            </Lobbies>
            <Button
                width = "70%"
                onClick={() => {
                  this.createLobby();
                }}
            >
              Create Lobby
            </Button>
          </LobbylistContainer>
        )}
          {!this.state.users || !this.state.user || !this.state.friends? (
            <Spinner />
          )
          :
          (
          <FriendsListContainer>
            <h2>Hello {this.state.user.username}</h2>
            <Button
                width = "70%"
                onclick={() => {this.go_to_profile(this.state.user)}}
              >
              Profile
              </Button>

            <Button
                width="70%"
                onClick={() => {
                  this.logout();
                }}
            >
              Logout
            </Button>


            <h2>Friends List</h2>
            <Users>
              {this.state.friends.map(lobby => {
                return (
                    <Lobby lobby={lobby} f_onClick={() => this.go_to_profile(lobby)} />
                    );
              })}
            </Users>
            </FriendsListContainer>
          )}
          </ListsContainer>
      </Container>

    );
  }
}

export default withRouter(MainScreen);
