import React from "react";
import styled from "styled-components";
import { Button } from './design/Button';

const Container = styled.div`
  margin: 3px 0;
  width: 280px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #ffffff26;
`;

const UserName = styled.div`
  font-weight: lighter;
  margin-left: 5px;
  font-size: 17px;
  margin-right: auto;
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
      <UserName>{user.username} {user.status==="ONLINE" ? "🟢" : "🔴"}</UserName>
      {f_onClick ? <Button onClick={f_onClick}>Profile</Button> : "" }
    </Container>
  );
};

export default Player;
