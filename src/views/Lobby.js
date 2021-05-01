import React from "react";
import styled from "styled-components";
import { Button } from './design/Button';



const Container = styled.div`
  margin: 6px 0;
  width: 280px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #ffffff26;
`;

const LobbyName = styled.div`
  font-weight: lighter;
  margin-left: 5px;
  font-size: 17px;
  margin-right: auto;
  
`;

export const ButtonLobbies = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 6px;
  padding-left:30px;
  padding-right: 30px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: black;
  width: ${props => props.width || null};
  border: none;
  height: 35px;
  border-radius: 20px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(230, 238, 235);
  transition: all 0.3s ease;
`;


/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */



const Lobby = ({ lobby, f_onClick }) => {

    return (
    <Container>
      <LobbyName>{lobby.name}{lobby.private !== "" ? " 🔒" : ""}</LobbyName>
      {f_onClick ? <ButtonLobbies onClick={f_onClick}>Join Lobby</ButtonLobbies> : ""}
    </Container>
  );
    //<img src={"Lock.png"} alt="hello"/> {Password ? <img src={"Lock.png"} alt={"hello"} width={"50px"} height={"50px"}/>:""}
    //{Password ? <img src={require("Lock.png")} alt={"Logo"}/> : ""
};

export default Lobby;
