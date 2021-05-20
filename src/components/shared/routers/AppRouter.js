import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import { GameGuard } from "../routeProtectors/GameGuard";
import Login from "../../login/Login";
import Registration from "../../registration/Registration";
import CreateLobby from "../../createLobby/CreateLobby";
import DrawScreen from "../../drawScreen/DrawScreen";
import WaitingScreen from "../../waitingScreen/WaitingScreen";
import MainScreen from "../../mainScreen/MainScreen";
import ProfilePage from "../../profilepage/ProfilePage";
import EditProfile from "../../profilepage/EditProfile";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
class AppRouter extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <div>
            <Route path="/login" exact render={() => (
              <LoginGuard>
                <Login />
              </LoginGuard>
            )}/>

            <Route path="/registration" exact render={() => (
              <LoginGuard>
                <Registration />
              </LoginGuard>
            )} />

            <Route path="/mainScreen" exact render={() => (
              <GameGuard>
                <MainScreen/>
              </GameGuard>
            )}/>

            <Route path="/createLobby" exact render={() => (
              <GameGuard>
                <CreateLobby />
              </GameGuard>
            )} />

            <Route path="/draw" exact render={() => (
              <GameGuard>
                <DrawScreen />
              </GameGuard>
            )} />

            <Route path="/waitingScreen" exact render={() => (
              <GameGuard>
                <WaitingScreen />
              </GameGuard>
            )}/>

            <Route path="/profilePage" exact render={() => (
              <GameGuard>
                <ProfilePage />
              </GameGuard>
            )}/>

            <Route path="/editProfile" exact render={() => (
              <GameGuard>
                <EditProfile />
              </GameGuard>
            )}/>

            <Route path="/" exact render={() => <Redirect to={"/mainScreen"} />} />
          </div>
        </Switch>
      </BrowserRouter>
    );
  }
}
export default AppRouter;
