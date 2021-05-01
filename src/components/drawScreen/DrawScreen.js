import styled from 'styled-components';
import React from 'react';
import { api, handleError } from '../../helpers/api';
import Scores from '../../views/Scores';
import Lobby from '../../views/Lobby';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import Colour from '../../views/Colour';
import Message from '../../views/Message';

const Users = styled.ul`
  list-style: none;
  padding-left: 0;

`;
const Blur = styled.div`
position: absolute;
top:0px;
left: 0px;
width: 100%;
height: 100%;
background: rgba(50, 50, 50, 0.5);
z-index: 1;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 45px;
  width: 15%;
`;
const selection = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  top: 50%;
  width: 15%;
  left: 500px;
  align-items: column;
`;
const Canvas = styled.canvas`
  position: absolute;

  // Place not in the middle of the whole screen but in middle of what is left
  // when you substract the sidebar-width.
  left: calc(57.5% - 256px / 2);
  transform: translateX(-50%);

  box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.7);
  border-radius: 8px;
`;

const Sidebar = styled.div`
  width: 256px;
  height: 100%;
  background: rgba(50, 50, 50, 0.9);
  box-shadow: rgba(0, 0, 0, 0.9) 0px -4px 4px;

  transition: width 1s;

  position: absolute;
  right: 0px;
  top: 0px;

  padding: 0px 5px;
  text-align: center;
  overflow-y: auto;
`;

const Chatbox = styled.div`
`;

const Messages = styled.ul`
  background: white;
  height: 250px;
  list-style-type: none;
  list-style-position: outside;
  padding: 0px;
  overflow-y: scroll;
  overflow-x: hidden;
  border-radius: 8px;

`;

const HR = styled.hr`
  color: rgba(255, 255, 255, 0.1);
  width 90%;
  margin-top: 1em;
  margin-bottom: 1em;
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
  // display: inline-block;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, 32px);

  // background: rgba(255, 0, 0, 0.3);
`;

const Label = styled.label`
  color: #999999;
  margin-bottom: 10px;
  font-variant: small-caps;
`;

const InputField = styled.input`
  &::placeholder {
    color: black;
  }
  height: 35px;
  padding-left: 15px;
  margin: 12px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 1);
  color: black;
`;

const Timer = styled.div`
  position: absolute;
  //min-width: 100px;
  background: rgba(50, 50, 50, 0.9);;
  color: white;
  text-align: center;
  font-size: 48px;
  font-variant: small-caps;
  font-weight: 900;
  padding: 10px;

  // Place not in the middle of the whole screen but in middle of what is left
  // when you substract the sidebar-width.
  left: calc(80% - 256px / 2);
  bottom: 100px;
  transform: translateX(-50%);

  box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.7);
  border-radius: 8px;
`;
const Scoreboard = styled.div`
    position: absolute;
    width:190px ;
    background: rgba(50, 50, 50, 0.9);
    color: white;
    text-align: center;
    font-color: white;
    left: calc(14% - 190px / 2);
    top: 100px;
    transform: translateX(-50%);
    box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.7);
    border-radius: 8px;


`;
const Scoreboardlabel = styled.label`
    font-size: 25px;
    font-variant: small-caps;
    padding-top: 15px;

`;


const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Hint = styled.div`
  position: absolute;
  //min-width: 100px;
  background: rgba(50, 50, 50, 0.9);;
  color: white;
  text-align: center;
  font-size: 48px;
  font-variant: small-caps;
  font-weight: 900;
  padding: 10px;
  letter-spacing: 7px;

  // Place not in the middle of the whole screen but in middle of what is left
  // when you substract the sidebar-width.
  left: calc(20% - 256px / 2);
  bottom: 100px;
  transform: translateX(-50%);

  box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.7);
  border-radius: 8px;
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

    let messages = [ {"sender": "niklassc", "timestamp": "2021-04-25T16:24:24+02:00", message: "Hello World"}, {"sender": "example_user", "timestamp": "2021-04-25T16:24:30+02:00", message: "Hello"}, {"sender": "niklassc", "timestamp": "2021-04-25T16:24:59+02:00", message: "test"} ];

    this.state = {
      game_id: 7, // TODO get actual id
      drawer: false, // If false, you're guesser
      timeout: new Date(), // Timestamp when the time is over
      time_left: Infinity, // in seconds
      hint: "A__b_c_", // Will contain some letters and underscores
      canvas_width: 854,
      canvas_height: 480,
      draw_colour: "#ffffff",
      draw_size: 5,
      mouse_down: false, // stores whether the LEFT mouse button is down
      loginId: localStorage.getItem('loginId'), //added the login Id
      chat_message: "", // Value of the chat input field
      users: "",
      messages, // JSON of all chat messages
      timestamp_last_message: 0,
      timestamp_last_draw_instruction: 0 // Time of the last draw instruction that was received (guesser mode)
    };
  }

  handleInputChange(key, value) {
    this.setState({ [key]: value });
  }

  resetCanvas() {
    this.mainCanvas.current.width = this.state.canvas_width;
    this.mainCanvas.current.height = this.state.canvas_height;
    let ctx = this.mainCanvas.current.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.state.canvas_width, this.state.canvas_height);
  }

  fillCanvas() {
    this.mainCanvas.current.width = this.state.canvas_width;
    this.mainCanvas.current.height = this.state.canvas_height;
    let ctx = this.mainCanvas.current.getContext('2d');

    ctx.fillStyle = this.state.draw_colour;
    ctx.fillRect(0, 0, this.state.canvas_width, this.state.canvas_height);
  }

  updateBrushPreview() {
    this.brushPreview.current.style.width = this.state.draw_size + "px";
    this.brushPreview.current.style.height = this.state.draw_size + "px";
    this.brushPreview.current.style.background = this.state.draw_colour;
  }

  changeColour(colour) {
    this.setState({ ['draw_colour']: colour });

    let ctx = this.mainCanvas.current.getContext('2d');
    ctx.strokeStyle = colour;

    this.updateBrushPreview();
  }

  changeSize(size) {
    this.setState({ ['draw_size']: size });

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

    ctx.lineTo(x, y);
    ctx.stroke();
  }

  async sendDrawInstruction(x, y, size, colour) {
    try {
      const requestBody = JSON.stringify({
        user_id: this.state.loginId,
        game_id: this.state.game_id,
        x: x,
        y: y,
        size: size,
        colour: colour
      });
      /** await the confirmation of the backend **/
      const response = await api.put('/drawing', requestBody);
    } catch (error) {
      this.state.messages.push({"sender": "SYSTEM", "timestamp": "TODO", message: `Something went wrong while sending the drawing instruction: \n${handleError(error)}`});
    }
  }

  canvas_onMouseDown(button) {
    // Return if you're not the drawer
    if(!this.state.drawer)
      return;

    if(button == 0) {
      let ctx = this.mainCanvas.current.getContext('2d');
      this.setState({ mouse_down: true });
      ctx.beginPath();
    }
  }

  canvas_onMouseUp(button) {
    if(button == 0)
      this.setState({ mouse_down: false });
  }

  componentDidMount() {
    this.resetCanvas();
    this.updateBrushPreview();

    // Regularly update the time left
    let intervalID= setInterval(async () => {
      // Countdown the timer
      let date_now = new Date();
      let time_left = Math.round((this.state.timeout - date_now) / 1000);
      this.setState({ time_left });

      // Poll the chat
      try {
        const requestBody = JSON.stringify({
          user_id: this.state.loginId,
          game_id: this.state.game_id,
          timestamp: this.state.timestamp_last_message
        });

        /** await the confirmation of the backend **/
        const response = await api.get('/chat', requestBody);

        // Set timestamp_last_message
        let timestamp_last_message = response[response.lenght -1].timestamp;

        // Add new messages to our chat
        let messages = this.state.messages.concat(response);
        this.setState({ timestamp_last_message, messages });
      } catch (error) {
        this.state.messages.push({"sender": "SYSTEM", "timestamp": "TODO", message: `Something went wrong while polling the chat: \n${handleError(error)}`});
      }

      // Poll draw instructions (guesser mode)
      if(this.state.drawer)
        return;
      try {
        const requestBody = JSON.stringify({
          user_id: this.state.loginId,
          game_id: this.state.game_id,
          timestamp: this.state.timestamp_last_draw_instruction
        });
        /** await the confirmation of the backend **/
        const response = await api.get('/draw', requestBody);

        let timestamp_last_draw_instruction;
        response.forEach(instr => {
          let ctx = this.mainCanvas.current.getContext('2d');
          ctx.lineWidth = instr.size;
          ctx.fillStyle = instr.colour;
          ctx.lineTo(instr.x, instr.y);
          ctx.stroke();
          timestamp_last_draw_instruction = instr.timestamp;
        });
        this.setState({ timestamp_last_draw_instruction });

      } catch(error) {
        this.state.messages.push({"sender": "SYSTEM", "timestamp": "TODO", message: `Something went wrong while polling the draw-instructions: \n${handleError(error)}`});
      }

    }, 1000);
    this.setState({users: [{"id":5 , "name": "Kilian", "points":"5000"}, {"id":2 , "name": "Nik", "points":"6000"}, {"id":3 , "name": "Josip", "points":"15000"}]});
    this.setState({ intervalID });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalID);
  }

  async send_message() {
    try {
      const requestBody = JSON.stringify({
        user_id: this.state.loginId,
        game_id: this.state.game_id,
        message: this.state.chat_message
      });
      /** await the confirmation of the backend **/
      const response = await api.put('/chat', requestBody);
      this.setState({ chat_message: "" });
    } catch (error) {
      this.state.messages.push({"sender": "SYSTEM", "timestamp": "TODO", message: `Something went wrong while sending the chat message: \n${handleError(error)}`});
    }
  }

  download_image() {
    let link = document.createElement("a");
    link.download = "canvas.png";
    link.href = this.mainCanvas.current.toDataURL("image/png");
    link.click();
  }
  async show_leaderboard(){
    try{
      const responseusers = await api.get('');
      this.setState({users: responseusers.data})
    }catch(error){
      alert(`Something went wrong while fetching the points: \n${handleError(error)}`)
    }
  }

  render() {
    return ([

      // Lobby list
      <Canvas id="mainCanvas" ref={this.mainCanvas} onMouseMove={(e) => this.canvas_onMouseMove(e.clientX, e.clientY)}
    onMouseDown={(e) => {
      this.canvas_onMouseDown(e.button)
    }} onMouseUp={(e) => {
  this.canvas_onMouseUp(e.button)
}}/>,
      <Timer>{this.state.time_left}</Timer>,
      <Hint>{this.state.hint}</Hint>,
      <Sidebar>
        <H1 onClick={this.changeColour}>Tools</H1>
        <HR />

        {this.state.drawer ? ([
          <ColoursContainer>
              {this.colours.map(colour => {
                return (
                  <Colour colour={colour} f_onClick={() => {this.changeColour(colour)}} />
                );
              })},
          </ColoursContainer>,
          <HR/>,
          <Label>Size</Label>,
          <InputField value={this.state.draw_size} onChange={e => {this.changeSize(e.target.value);}} id="input_size" type="range" min="1" max="100" />,
          <HR/>,
          <Button width="40%" onClick={() => {this.fillCanvas()}}>Fill</Button>,
          <Button width="40%" onClick={() => {this.resetCanvas()}}>Clear</Button>,
          <HR/>
        ]) : ( "" )}

        <Button width="80%" onClick={() => {this.download_image()}}>Download image</Button>
        <HR/>
        <BrushPreview ref={this.brushPreview}/>
        <Chatbox>
          <Messages>
            {this.state.messages.map(message => {
              return (
                <Message message={message} />
              );
            })}
          </Messages>

          <InputField disabled={this.state.drawer} placeholder="Type here" value={this.state.chat_message} onChange={e => {this.handleInputChange("chat_message", e.target.value);}} id="input_chat_message" />
          { this.state.chat_message == "" ?

            <Button disabled width="40%" onClick={() => {this.send_message()}} >Send</Button>
            :
            <Button width="40%" onClick={() => {this.send_message()}} >Send</Button>
          }

        </Chatbox>
      </Sidebar>,
      <Scoreboard>
      <Scoreboardlabel>Scoreboard</Scoreboardlabel>
      <HR/>
        {!this.state.users ? (
                              <Spinner />
                            )
                            :
                            (
        <Users>
        {this.state.users.map(user =>{
        return(
        <PlayerContainer key={user.id}>
                <Scores user={user}/>
        </PlayerContainer>
                );
                })}

        </Users>
        )}
      </Scoreboard>

    ]);
  }
}

export default withRouter(DrawScreen);
