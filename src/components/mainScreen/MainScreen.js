import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { Profilebutton } from '../../views/design/Profilebutton';
import { withRouter } from 'react-router-dom';

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
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

class MainScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null,
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

  async componentDidMount() {
    try {
      const response = await api.get('/users');
      // delays continuous execution of an async operation for 1 second.
      // This is just a fake async call, so that the spinner can be displayed
      // feel free to remove it :)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the returned users and update the state.
      this.setState({ users: response.data });

      // This is just some data for you to see what is available.
      // Feel free to remove it.
      console.log('request to:', response.request.responseURL);
      console.log('status code:', response.status);
      console.log('status text:', response.statusText);
      console.log('requested data:', response.data);

      // See here to get more data.
      console.log(response);
    } catch (error) {
      alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
    }
  }

  render() {
    return (
      <Container>
        <h2>Welcome & Happy Coding! </h2>
        <p>Get all users from secure end point:</p>
        {!this.state.users ? (
          <Spinner />
        )
        :
        (
          <div>
            <Users>
              {this.state.users.map(user => {
                return (
                  <PlayerContainer key={user.id}>
                    <Profilebutton
                      width="100%"
                      onClick={() => {
                      localStorage.setItem("visited User", user.id);
                      /**set the id for the profile the user is visiting**/
                      this.props.history.push("/game/dashboard/profilepage");
                      /** go to profile page **/
                      }}
                      >
                      <Player user={user} />
                    </Profilebutton>
                    <p> </p>
                  </PlayerContainer>
                );
              })}
            </Users>
            <Button
              width="100%"
              onClick={() => {
                this.logout();
                /** log out **/
              }}
            >
              Logout
            </Button>
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(MainScreen);
