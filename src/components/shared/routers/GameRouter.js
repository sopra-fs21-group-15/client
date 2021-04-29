import React from "react";
import styled from "styled-components";
import Prompt, { Redirect, Route } from "react-router-dom";
import Game from "../../mainScreen/MainScreen";
import ProfilePage from "../../profilepage/ProfilePage";
import EditProfile from "../../profilepage/EditProfile";
import WaitingScreen from "../../waitingScreen/WaitingScreen";


const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class GameRouter extends React.Component {
  render() {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */
    return (
      <Container>
        <Route
          exact
          path={`${this.props.base}/dashboard`}
          render={() => <Game />}
        />

        <Route
          exact
          path={`${this.props.base}`}
          render={() => <Redirect to={`${this.props.base}/dashboard`} />}
        />

        <Route

          exact
          path={`${this.props.base}/dashboard/profilepage`}
          render={() => <ProfilePage />}

        />

        <Route
          exact
          path={`${this.props.base}/dashboard/profilepage/editprofile`}
          render={() => <EditProfile/>}
        />

        <Route
          exact
          path={`${this.props.base}/createLobby`}
          render={() => <createLobby/>}
        />

        <Route
            exact
            path={`${this.props.base}/waitingScreen`}
            render={() => <WaitingScreen/>}
        />


      </Container>
    );
  }
}
/*
* Don't forget to export your component!
 */
export default GameRouter;
