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
	float: right;
	padding-left: 35px;
`;

const LobbylistContainer = styled.div`
	float: left;
	padding-right: 35px;
`;

const ListsContainer = styled.div`
`;

const ButtonsContainer = styled.div`
	display: block;
	margin-left: auto;
	margin-right: auto;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;

`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LobbyContainer = styled.li`
  align-items: center;
  justify-content: center;
`;

class MainScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null,
			lobbies: null,
      loginId: localStorage.getItem('loginId') //added the login Id
    };
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
    // Get users
    try {
      const response = await api.get('/users');
      this.setState({ users: response.data });
    } catch (error) {
      alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
    }

		// Get lobbies
    try {
      const response = await api.get('/lobbies');
      this.setState({ lobbies: response.data });
    } catch (error) {
      alert(`Something went wrong while fetching the lobbies: \n${handleError(error)}`);

			// TODO remove
			// Set lobbies to fake data, since backend is not implemented yet
			this.setState({ lobbies: [{"id":1,"password":"123","name":"lobby1"},{"id":2,"password":"123","name":"lobby2"}] });

    }
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
            <Users>
              {this.state.lobbies.map(lobby => {
                return (
                  <LobbyContainer key={lobby.id}>
                  	<Lobby lobby={lobby} f_onClick={() => this.join_lobby(lobby)} />
                  </LobbyContainer>
                );
              })}
            </Users>
					</LobbylistContainer>
        )}
        	{!this.state.users ? (
        	  <Spinner />
        	)
        	:
        	(
					<UserlistContainer>
						<h2>Users</h2>
        	    <Users>
        	      {this.state.users.map(user => {
        	        return (
        	          <PlayerContainer key={user.id}>
        	            <Player user={user} f_onClick={() => this.go_to_profile(user)} />
        	          </PlayerContainer>
        	        );
        	      })}
        	    </Users>
						</UserlistContainer>
        	)}
					</ListsContainer>
					<ButtonsContainer>
        		<Button
							onClick={() => {
								this.logout();
							}}
						>
							Logout
						</Button>
						<br/><br/>
        		<Button
							onClick={() => {
								this.createLobby();
							}}
						>
							Create Lobby
						</Button>
					</ButtonsContainer>
      </Container>

    );
  }
}

export default withRouter(MainScreen);
