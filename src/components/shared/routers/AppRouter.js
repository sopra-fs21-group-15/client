import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../login/Login";
//import { RegistrationGuard } from "../routeProtectors/LoginGuard"; // is this needed?
import Registration from "../../registration/Registration";
import CreateLobby from "../../createLobby/CreateLobby";
import DrawScreen from "../../drawScreen/DrawScreen";
import WaitingScreen from "../../waitingScreen/WaitingScreen";

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
            <Route
              path="/game"
              render={() => (
                <GameGuard>
                  <GameRouter base={"/game"} />
                </GameGuard>
              )}
            />
            <Route
              path="/login"
              exact
              render={() => (
                <LoginGuard>
                  <Login />
                </LoginGuard>
              )}
            />
              <Route
                path="/registration"
                exact
                render={() => (
                    <Registration />
                )}
            />
            <Route
              path="/createLobby"
              exact
              render={() => (
                  <CreateLobby />
              )}
            />
            <Route
                path="/waitingRoom"
                exact
                render={() => (
                    <WaitingScreen />
                )}
            />
            <Route
              path="/draw"
              exact
              render={() => (
                  <DrawScreen />
              )}
            />
            <Route path="/" exact render={() => <Redirect to={"/game"} />}/>

            <Route path="/waitingScreen" exact render={() => (<WaitingScreen/>)}/>

          </div>
        </Switch>
      </BrowserRouter>
    );
  }
}
/*
* Don't forget to export your component!
 */
export default AppRouter;
