import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Lobby from "../shared/models/Lobby";
import Game from "../shared/models/Game";
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import { FormContainer } from '../../views/design/FormContainer.js';
import { Label } from '../../views/design/Label.js';
import { Legend } from '../../views/design/Legend.js';
import { InputField } from '../../views/design/InputField.js';
import { OneLineBlock } from '../../views/design/OneLineBlock.js';
import { SelectField } from '../../views/design/SelectField.js';
import Message from "../../views/Message";
import {Chatbox} from "../../views/design/Chatbox";
import {Messages} from "../../views/design/Messages";


const PlayerUl = styled.ul`
`;

const PlayerLi = styled.li`
  border: 1px solid grey;
  border-radius: 7px;
  padding: 7px;
  margin-bottom: 12px;
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FloatLeft = styled.div`
  width: 50%;
  float: left;
`;

const FloatRight = styled.div`
  float: right;
  width: 50%;
`;

class WaitingScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      lobbyId: localStorage.getItem('lobbyId'),
      loginId: localStorage.getItem('loginId'),
      username: localStorage.getItem('username'), // own username
      lobby: null,
      owner: false,

      // Chat
      chat_message: "", // Value of the chat input field
      messages: [], // JSON of all chat messages
      timestamp_last_message: "1900-01-01 00:00:00:000" // Time of the last message that was received
    };
    }

  async componentDidMount() {
    let intervalLobbyinfo = setInterval(async () => {
      // get lobby and update local lobby object
      try {
        const url = '/lobbies/' + this.state.lobbyId;
        const response = await api.get(url);
        let lobby = new Lobby(response.data);
        this.setState({ lobby });
      } catch(error) {
        alert(`Something went wrong while fetching the lobby: \n${handleError(error)}`);
      }

      // Check if lobby is started, then go to draw screen
      if(this.state.lobby.status === "PLAYING") {
        localStorage.setItem("gameId", this.state.lobbyId);
        this.props.history.push(`/draw`)
      }

      /// Find out who is the owner of the Lobby
      let owner_name = this.state.lobby.members[0];
      if (owner_name === this.state.username)
        this.setState({ owner: true });
      else
        this.setState({ owner: false });

      }, 3000);
    this.setState({ intervalLobbyinfo });


    // Regularly poll the chat
    let intervalChat = setInterval(async () => {
      try {
        const requestBody = JSON.stringify({
          timeStamp: this.state.timestamp_last_message
        });
        const url = '/lobbies/' + this.state.lobbyId + '/chats'

        /** await the confirmation of the backend **/
        const response = await api.post(url, requestBody);

        // Set timestamp_last_message
        if(response.data.messages.length === 0)
          return;

        let timestamp_last_message = response.data.messages[response.data.messages.length -1].timeStamp;
        let messages = this.state.messages.concat(response.data.messages);
        this.setState({ timestamp_last_message, messages });
      } catch (error) {
        this.errorInChat(`Something went wrong while polling the chat: \n${handleError(error)}`);
      }
    }, 2000);
    this.setState({ intervalChat });

  }

  errorInChat(errMsg) {
    this.state.messages.push({"writerName": "SYSTEM", "timeStamp": this.getCurrentDateString(), message: errMsg});
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalLobbyinfo);
    clearInterval(this.state.intervalChat);
  }

  async startgame() {
    try {
      const requestBody = JSON.stringify({ id: this.state.lobbyId });
      const url = '/games/'+ this.state.lobbyId + '/start'
      const response = await api.post(url, requestBody);
      const game = new Game(response.data);

      // set the gameID
      localStorage.setItem("gameId", game.id)
      this.props.history.push(`/draw`)
    } catch (error) {
      alert(`Something went wrong during the starting the game: \n${handleError(error)}`);
    }
  }

  getCurrentDateString() {
    let date = new Date();

    let day = date.getDate();
    if (day < 10) day = "0" + day;

    let month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;

    let hours = date.getHours();
    if (hours < 10) hours = "0" + hours;

    let minutes = date.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;

    let seconds = date.getSeconds();
    if (seconds < 10) seconds = "0" + seconds;

    let milliseconds = date.getMilliseconds();
    if (milliseconds < 100) milliseconds = "0" + milliseconds;
    if (milliseconds < 10) milliseconds = "0" + milliseconds;

    return date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + ":" + milliseconds;
  }

  async sendMessage() {
    let timeStamp = this.getCurrentDateString();

    try {
      const requestBody = JSON.stringify({
        timeStamp: timeStamp,
        message: this.state.chat_message,
        writerName: this.state.username
      });

      /** await the confirmation of the backend **/
      const url = '/lobbies/' + this.state.lobbyId +'/chats';
      await api.put(url, requestBody);
      this.setState({ chat_message: "" });
    } catch (error) {
      this.state.messages.push({"sender": "SYSTEM", "timestamp": "TODO", message: `Something went wrong while sending the chat message: \n${handleError(error)}`});
    }
  }

  async goback() {
    try {
      const requestBody = JSON.stringify({
        username: localStorage.getItem('username')
      });

      const url = '/lobbies/' + this.state.lobbyId +'/leavers';
      await api.put(url, requestBody);

    } catch(error) {
      alert(`Something went wrong during the removing of a player: \n${handleError(error)}`)
    }
    this.props.history.push(`/mainScreen`);

  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  async sendInputChange(key, value) {
    try {
      // const requestBody = JSON.stringify({
      //   key: value
      // });
      let requestBody = "{\"" + key + "\"" + ":\"" + value + "\"}";

      console.log("Update lobby, requestBody", requestBody);

      // wait for making new Lobby
      const response = await api.put('/lobbies/' + this.state.lobby.id, requestBody);
      console.log("Update lobby, response.data", response.data);

      // // get new lobby and update the new Lobby Object
      // const lobby = new Lobby(response.data);
    }
    catch (error){
      alert(`Something went wrong during the lobby modification: \n${handleError(error)}`);
    }

  }

  render() {
    return (
      // Lobby list
      <BaseContainer>
          <Legend>Chill Area</Legend>
          {!this.state.lobby ? (
            <Spinner />
          ):(
            <div style={{overflow: "auto"}} >
            <FloatLeft>
            {this.state.lobby.members.map(user => {
              return(
                <PlayerUl>
                  <PlayerLi>{user}</PlayerLi>
                </PlayerUl>
              );
            })}
          <Chatbox>
            <Messages>
              {this.state.messages.slice(0).reverse().map(message => {
                return (
                  <Message message={message} />
                );
              })}
            </Messages>

            <InputField disabled={this.state.drawer} placeholder="Type here" value={this.state.chat_message} onChange={e => {this.handleInputChange("chat_message", e.target.value);}} id="input_chat_message" />
            { this.state.chat_message === "" ?
              <Button disabled onClick={() => {this.sendMessage()}} >Send</Button>
              :
              <Button onClick={() => {this.sendMessage()}} >Send</Button>
            }
          </Chatbox>
          </FloatLeft>

          <FloatRight>
          <FormContainer>
          <Label>Lobbyname</Label>
          <h2>{this.state.lobby.lobbyname} (#{this.state.lobbyId})</h2>
          <Label>Gamemode</Label>
            <SelectField id="form_gamemode" value={this.state.lobby.gameMode} disabled={!this.state.owner} onChange={e => {this.sendInputChange("gameMode", e.target.value);}}>
              <option value="CLASSIC">Classic</option>
              <option value="SPEED">Speed</option>
            </SelectField>
            <h2>{this.state.lobby.gamemode}</h2>

          <Label>Max. Players</Label>
            <SelectField id="from_player" value={this.state.lobby.size} disabled={!this.state.owner} onChange={e => {this.sendInputChange("size", e.target.value);}}>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </SelectField>
            <h2>{this.state.lobby.size}</h2>

          <Label>Rounds</Label>
            <SelectField id="from_rounds" value={this.state.lobby.rounds} disabled={!this.state.owner} onChange={e => {this.sendInputChange("rounds", e.target.value);}}>
              <option value={this.state.lobby.rounds}>{this.state.lobby.rounds}</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </SelectField>
            <h2>{this.state.lobby.rounds}</h2>

          <Label>Private</Label>
          <OneLineBlock>
          <InputField id="form_private" type="checkbox" checked={this.state.lobby.password !== ""} disabled={!this.state.owner} onChange={e => {this.handleInputChange('private', e.target.checked);}} />
          {this.state.lobby.password !== "" ? (
              <div>
                <InputField id="form_password" value={this.state.lobby.password} disabled={!this.state.owner} onChange={e => {this.sendInputChange('password', e.target.value);}}/>
              </div>
          ) : ""  }
          </OneLineBlock>
            </FormContainer>
            </FloatRight>
            </div>
          )}
        

          <Button disabled={ !this.state.owner || (this.state.lobby && this.state.lobby.members.length < 2) } onClick={() => {this.startgame();}}>Start the Game</Button>
          <Button onClick={() => {this.goback();}}>Back</Button>
      </BaseContainer>
    );
  }
}
export default withRouter(WaitingScreen);

