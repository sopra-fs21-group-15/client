import styled from 'styled-components';
import React from 'react';
import { api, handleError } from '../../helpers/api';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import Colour from '../../views/Colour';
import Message from '../../views/Message';
import Round from "../shared/models/Round";
import { HR } from '../../views/design/HR.js';
import { Label } from '../../views/design/Label.js';
import { InputField } from '../../views/design/InputField.js';
import { Chatbox } from '../../views/design/Chatbox.js';
import { Messages } from '../../views/design/Messages.js';


const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const Canvas = styled.canvas`
  position: absolute;
  // Place not in the middle of the whole screen but in middle of what is left
  // when you substract the sidebar-width.
  left: calc(55.5% - 256px / 2);
  transform: translateX(-50%);
  box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.7);
  border-radius: 8px;
`;

const Sidebar = styled.div`
  width: 256px;
  height: 100%;
  background: rgba(50, 50, 50, 0.8);
  backdrop-filter: blur(6px);
  box-shadow: rgba(0, 0, 0, 0.9) 0px -4px 4px;

  transition: width 1s;

  position: absolute;
  right: 0px;
  top: 0px;

  padding: 0px 5px;
  text-align: center;
  overflow-y: auto;
`;

const H1 = styled.h1`
  color: white;
  font-variant: small-caps;
`;

const BrushPreview = styled.div`
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
  margin: 0 auto;
`;

const ColoursContainer = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, 32px);
`;

const Timer = styled.div`
  position: absolute;
  background: rgba(50, 50, 50, 0.8);;
  backdrop-filter: blur(6px);
  color: white;
  text-align: center;
  font-size: 40px;
  font-variant: small-caps;
  font-weight: 900;
  padding: 7px;

  // Place bottom-right corner of div with 20px distance to bottom of viewport
  // and sidebar
  left: calc(100vw - 256px - 20px);
  transform: translateX(-100%);
  bottom: 20px;

  box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.7);
  border-radius: 8px;
`;

const Hint = styled.div`
  position: absolute;
  background: rgba(50, 50, 50, 0.8);;
  backdrop-filter: blur(6px);
  color: white;
  text-align: center;
  font-size: 40px;
  font-variant: small-caps;
  font-weight: 900;
  padding: 7px;
  letter-spacing: 7px;

  left: 20px;
  bottom: 20px;

  box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.7);
  border-radius: 8px;
`;

const Scoreboard = styled.div`
  position: absolute;
  background: rgba(50, 50, 50, 0.8);
  backdrop-filter: blur(6px);
  color: white;
  text-align: center;
  font-color: white;
  min-width: 128px;
  min-height: 128px;

  left: 20px;
  top: 20px;

  box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  font-variant: small-caps;
  font-weight: 900;
  text-shadow: 2px 2px black;
`;

const ScoreboardList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const ScoreboardElement = styled.li`
`;

const Wordbox = styled.div`
  position fixed;
  left: 0;
  top: 0;
  background: rgba(50, 50, 50, 0.8);
  backdrop-filter: blur(6px);
  box-shadow: rgba(0, 0, 0, 0.9) 0px -4px 4px;
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
`;


class DrawScreen extends React.Component {
  constructor() {
    super();

    this.mainCanvas = React.createRef();
    this.brushPreview = React.createRef();

    this.colours = [
      "#000000",
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffeb3b",
      "#ffc107",
      "#ff9800",
      "#ff5722",
      "#795548",
      "#9e9e9e",
      "#607d8b",
      "#ffffff"
      ];

    this.state = {
      game_id: localStorage.getItem('gameId'),
      round: null, // Round object, regularly fetched from backend
      scoreboard: null, // Scoreboard, regularly fetched from backend
      drawer: false, // If false, you're guesser
      time_left: Infinity, // in seconds
      loginId: localStorage.getItem('loginId'),
      hint: "Loading...", // Shows hint for guessers, shows word for drawer
      username: localStorage.getItem('username'),
      users: "",
      drawInstructionBuffer: [], // Buffer of drawInstructions that will be sent to the backend
      guessed: false, // True when this client guessed to word in this phase

      // Draw + Canvas related
      canvas_width: 854,
      canvas_height: 480,
      draw_colour: "#ffffff",
      draw_size: 5,
      mouse_down: false, // stores whether the LEFT mouse button is down

      // Draw instructions
      timestamp_last_draw_instruction: "1900-01-01 00:00:00:000", // Time of the last draw instruction that was received (guesser mode)

      // Chat
      chat_message: "", // Value of the chat input field
      messages: [], // JSON of all chat messages
      timestamp_last_message: "1900-01-01 00:00:00:000", // Time of the last message that was received
    };
  }

  handleInputChange(key, value) {
    this.setState({ [key]: value });
  }

  async resetCanvas() {
    let draw_colour = this.state.draw_colour;
    await this.setState({ draw_colour: "#FFFFFF" });
    this.fillCanvas();
    await this.setState({ draw_colour });
  }

  fillCanvas() {
    this.mainCanvas.current.width = this.state.canvas_width;
    this.mainCanvas.current.height = this.state.canvas_height;
    let ctx = this.mainCanvas.current.getContext('2d');

    ctx.fillStyle = this.state.draw_colour;
    ctx.fillRect(0, 0, this.state.canvas_width, this.state.canvas_height);

    if(this.state.round && this.state.drawer)
      this.sendDrawInstruction(-1, -1, -1, this.state.draw_colour);
  }

  updateBrushPreview() {
    this.brushPreview.current.style.width = this.state.draw_size + "px";
    this.brushPreview.current.style.height = this.state.draw_size + "px";
    this.brushPreview.current.style.background = this.state.draw_colour;
  }

  async changeColour(colour) {
    await this.setState({ draw_colour: colour });

    let ctx = this.mainCanvas.current.getContext('2d');
    ctx.strokeStyle = colour;

    this.updateBrushPreview();
  }

  async changeSize(size) {
    await this.setState({ draw_size: size });

    let ctx = this.mainCanvas.current.getContext('2d');
    ctx.lineWidth = size;

    this.updateBrushPreview();
  }

  // Draws a line at the position x,y
  canvas_onMouseMove(x, y) {
    if(!this.state.mouse_down)
      return;

    let ctx = this.mainCanvas.current.getContext('2d');

    // Calculate mouse position relative to canvas
    let rect = this.mainCanvas.current.getBoundingClientRect();
    x -= rect.left;
    y -= rect.top;

    // Send draw instruction to the backend
    this.sendDrawInstruction(x, y, ctx.lineWidth, ctx.strokeStyle);
    // Add the drawInstruction to the send-buffer
    // let buffer = this.state.drawInstructionBuffer.push({x: x, y: y, size: ctx.lineWidth, colour: ctx.strokeStyle});

    ctx.lineTo(x, y);
    ctx.stroke();
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

  async sendDrawInstruction(x, y, size, colour) {
      // await api.put('/games/' + this.state.game_id +'/drawing', requestBody);
    this.state.drawInstructionBuffer.push( {"x": Math.round(x), "y": Math.round(y), "timeStamp": this.getCurrentDateString(), "size": size, "colour": colour} );
  }

  canvas_onMouseDown(button) {
    // Return if you're not the drawer
    if(!this.state.drawer)
      return;

    if(button === 0) {
      let ctx = this.mainCanvas.current.getContext('2d');
      this.setState({ mouse_down: true });
      ctx.beginPath();
      if(this.state.round && this.state.drawer)
        this.sendDrawInstruction(-2, -2, -2, "#FF0000");
    }
  }

  canvas_onMouseUp(button) {
    if(button === 0)
      this.setState({ mouse_down: false });
  }

  componentDidMount() {
    this.resetCanvas();
    this.updateBrushPreview();

    // Regularly update the time left
    let interval_countdown = setInterval(async () => {
      if(!this.state.round)
        return;
      // Countdown the timer
      let date_now = new Date();
      let time_left = Math.round((this.state.round.endsAt - date_now) / 1000);
      this.setState({ time_left });
    }, 1000);
    this.setState({ interval_countdown });

    // Regularly fetch round info
    let intervalRoundInfo = setInterval(async () => {
      try {
        const response = await api.get('/games/' + this.state.game_id + "/update");
        console.log("ROUND", response.data);

        let round = new Round(response.data);
        // Clear canvas if drawer changed (by comparison to previous round object)
        if (!this.state.round || this.state.round.drawerName !== round.drawerName || this.state.round.id !== round.id ) {
          this.resetCanvas();
          this.setState({ guessed: false });
        }
        this.setState({ round });

        // Set drawer
        if(this.state.username === this.state.round.drawerName)
          this.setState({ drawer: true, hint: round.word });
        else {
          this.setState({ drawer: false });
          if(round.word)
            this.setState({ hint: "_".repeat(round.word.length) });
        }
      } catch (error) {
        this.systemMsgInChat(`Something went wrong while fetching the round-info: \n${handleError(error)}`);
      }
    }, 5000);
    this.setState({ intervalRoundInfo });


    // Regularly fetch scoreboard
    let intervalScoreboard = setInterval(async () => {
      try {
        const response = await api.get('/games/' + this.state.game_id + "/score");
        console.log("Scoreboard", response.data);

        // Rewrite format into one list of objects
        let scoreboard = [];
        for (let i = 0; i < response.data.players.length; i++)
          scoreboard.push({ "username": response.data.players[i], "ranking": response.data.ranking[i], "score": response.data.score[i] });


        this.setState({ scoreboard });
      } catch (error) {
        this.systemMsgInChat(`Something went wrong while fetching the scoreboard: \n${handleError(error)}`);
      }
    }, 5000);
    this.setState({ intervalScoreboard });


    // Regularly poll the chat
    let intervalChat = setInterval(async () => {
      try {
        const requestBody = JSON.stringify({
          timeStamp: this.state.timestamp_last_message
        });
        const url = '/games/' + this.state.game_id + '/chats'
        const response = await api.post(url, requestBody);

        // Set timestamp_last_message
        if(response.data.messages.length === 0)
          return;
        let timestamp_last_message = response.data.messages[response.data.messages.length -1].timeStamp;
        let messages = this.state.messages.concat(response.data.messages);
        this.setState({ timestamp_last_message, messages });
      } catch (error) {
        this.systemMsgInChat(`Something went wrong while polling the chat: \n${handleError(error)}`);
      }
    }, 2000);
    this.setState({ intervalChat });


    // Regularly send buffer of draw instructions (drawer mode)
    let intervalSendDrawInstructionBuffer = setInterval(async () => {
      // Send the buffer of draw instructions (drawer mode)
      if(!this.state.drawer || this.state.drawInstructionBuffer.length === 0)
        return;
      try {
        console.log("DrawInstructionSEND", this.state.drawInstructionBuffer);
        await api.put('/games/' + this.state.game_id +'/drawing', JSON.stringify(this.state.drawInstructionBuffer));

        await this.setState({ drawInstructionBuffer: [] });
      } catch(error) {
        this.systemMsgInChat(`Something went wrong while sending the draw-instructions: \n${handleError(error)}`);
      }
    }, 3000);
    this.setState({ intervalSendDrawInstructionBuffer });

    // Regularly pull draw instructions (guesser mode)
    let interval_draw_instructions = setInterval(async () => {
      // Poll draw instructions (guesser mode)
      if(this.state.drawer || !this.state.round)
        return;
      try {
        const requestBody = JSON.stringify({
          timeString: this.state.timestamp_last_draw_instruction
        });
        const response = await api.post('/games/' + this.state.game_id +'/drawing', requestBody);

        let timestamp_last_draw_instruction;
        let ctx = this.mainCanvas.current.getContext('2d');
        response.data.forEach(instr => {
          if(instr.x === -1) {
            // Fill/Clear-instructions have x = -1
            this.setState({ draw_colour: instr.colour });
            this.fillCanvas();
          } else if(instr.x === -2) {
            // LineBegin-instructions have x = -2
            ctx.beginPath();
          } else {
            // Normal draw instructions
            ctx.lineWidth = instr.size;
            ctx.strokeStyle = instr.colour;
            ctx.lineTo(instr.x, instr.y);
            ctx.stroke();
            timestamp_last_draw_instruction = instr.timeStamp;
            this.setState({ timestamp_last_draw_instruction });
          }
        });

      } catch(error) {
        this.systemMsgInChat(`Something went wrong while polling the draw-instructions: \n${handleError(error)}`);
      }
    }, 5000);
    this.setState({ interval_draw_instructions });

    this.setState({users: [{"id":5 , "name": "Kilian", "points":"5000"}, {"id":2 , "name": "Nik", "points":"6000"}, {"id":3 , "name": "Josip", "points":"15000"}]});
  }

  componentWillUnmount() {
    // Clear all intervals
    clearInterval(this.state.interval_countdown);
    clearInterval(this.state.intervalChat);
    clearInterval(this.state.interval_draw_instructions);
    clearInterval(this.state.intervalSendDrawInstructionBuffer);
    clearInterval(this.state.intervalRoundInfo);
    clearInterval(this.state.intervalScoreboard);
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
      const url = '/games/' + this.state.game_id +'/chats';
      const response = await api.put(url, requestBody);
      this.setState({ chat_message: "" });

      if(response.data) {
        alert("You guessed the word correctly!");
        this.systemMsgInChat("YOU GUESSED THE WORD!");
        this.setState({ guessed: true });
      }
    } catch (error) {
      this.systemMsgInChat(`Something went wrong while sending the chat message: \n${handleError(error)}`);
    }
  }

  systemMsgInChat(errMsg) {
    this.state.messages.push({"writerName": "SYSTEM", "timeStamp": this.getCurrentDateString(), message: errMsg});
  }

  download_image() {
    let link = document.createElement("a");
    link.download = "canvas.png";
    link.href = this.mainCanvas.current.toDataURL("image/png");
    link.click();
  }

  async chooseWord(word) {
    try {
      const url = '/games/' + this.state.game_id + '/choices/' + this.state.username + '/' + this.state.round.selection.indexOf(word);
      await api.put(url);
    } catch(error) {
      alert(`Something went wrong while choosing the word: \n${handleError(error)}`)
    }
  }

  async leaveGame() {
    if(!window.confirm("Are you sure you want to leave the game?"))
      return;

    try {
      const requestBody = JSON.stringify({
        username: localStorage.getItem('username')
      });

      const url = '/games/' + this.state.game_id +'/leavers';
      await api.put(url, requestBody);

    } catch(error) {
      alert(`Something went wrong during the removing of a player: \n${handleError(error)}`)
    }
    this.props.history.push(`/mainScreen`);
  }

  ordinalSuffix(i) {
    var j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
      return i + "rd";
    }
    return i + "th";
  }

  render() {
    return ([
      // Lobby list
      <Canvas id="mainCanvas" ref={this.mainCanvas} onMouseMove={(e) => this.canvas_onMouseMove(e.clientX, e.clientY)}
      onMouseDown={(e) => { this.canvas_onMouseDown(e.button)}} onMouseUp={(e) => { this.canvas_onMouseUp(e.button)}}/>,

      <Hint>{this.state.hint}</Hint>,
      <Sidebar>
        <H1>Tools #{this.state.game_id}</H1>
        {this.state.drawer ? ([
          <ColoursContainer>
              {this.colours.map(colour => {
                return (
                  <Colour colour={colour} f_onClick={() => {this.changeColour(colour)}} />
                );
              })}
          </ColoursContainer>,
          <Label>Size</Label>,
          <InputField value={this.state.draw_size} onChange={e => {this.changeSize(e.target.value);}} id="input_size" type="range" min="1" max="100" />,
          <Button onClick={() => {this.fillCanvas()}}>Fill</Button>,
          <Button onClick={() => {this.resetCanvas()}}>Clear</Button>,
        ]) : ( "" )}

        <Button onClick={() => {this.download_image()}}>Download image</Button>
        <HR/>
        <BrushPreview ref={this.brushPreview}/>
        <HR/>
        <Chatbox>
          <Messages>
            {this.state.messages.slice(0).reverse().map(message => {
              return (
                <Message message={message} />
              );
            })}
          </Messages>

          <InputField disabled={this.state.drawer || this.state.guessed} placeholder="Type here" value={this.state.chat_message} onChange={e => {this.handleInputChange("chat_message", e.target.value);}} id="input_chat_message" />
          { this.state.chat_message === "" ?
            <Button disabled onClick={() => {this.sendMessage()}} >Send</Button>
            :
            <Button onClick={() => {this.sendMessage()}} >Send</Button>
          }
        </Chatbox>
        <Button onClick={() => {this.leaveGame()}}>Leave Game</Button>
      </Sidebar>,
      <Scoreboard>
      {!this.state.scoreboard ? (
        <Spinner />
      ):(
        <Users>
        <ScoreboardList>
        {this.state.scoreboard.map(entry =>{return(
          <ScoreboardElement>{this.ordinalSuffix(entry.ranking)}: {entry.username} - {entry.score} Pts</ScoreboardElement>
        );})}
        </ScoreboardList>
        </Users>
      )}
      </Scoreboard>,
      <div>
        {this.state.round && this.state.drawer && this.state.round.status === "SELECTING" ? (
          <Wordbox>
            {this.state.round.selection.map(word => {
              return (
                <Button onClick={() => this.chooseWord(word)}>{word}</Button>
              );
            })}
          </Wordbox>
        ): ""}
      </div>,
      <Timer>{this.state.time_left}</Timer>
    ]);
  }
}

export default withRouter(DrawScreen);
