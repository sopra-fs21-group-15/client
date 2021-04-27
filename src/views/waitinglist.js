import React from "react";
import styled from "styled-components";
import { Button } from './design/Button';

const Container = styled.div`
  margin: 6px 0;
  width: 200px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #ffffff26;
`;

const UserName = styled.div`
  font-weight: lighter;

  font-size: 17px;
  text-align: center;
`;

const kickout =  styled.button`
position: absolut;
right: 32px;
top: 32px;
width: 32px;
height: 32px;
opacity: 0.5;
cursor: ${props => (props.disabled ? "default" : "pointer")};
opacity: ${props => (props.disabled ? 0.1 : 1)};
}
.kickout:hover{
opacity: 1;
}
.kickout:before, .kickout:after {
  position: absolute;
  left: 15px;
  content: ' ';
  height: 33px;
  width: 5px;
  background-color: #FF0000;
}
.kickout:before {
  transform: rotate(45deg);
}
.kickout:after {
  transform: rotate(-45deg);
}
`;

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */

const Player = ({ user, f_onClick }) => {
  return (
    <Container>
      <UserName>{user.name}</UserName>

      { f_onClick ? <Button onClick={f_onClick}>Profile</Button> : "" }
    </Container>
  );
};

export default Player;
