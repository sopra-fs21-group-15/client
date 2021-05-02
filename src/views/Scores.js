import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin: 6px 0;
  width: 150px;
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

const Points = styled.div`
  font-weight: lighter;
  font-size: 17px;
  text-align: center;
  `;
/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */

const Score = ({ user, f_onClick }) => {
  return (
    <Container>
      <UserName>{user.name}</UserName>
      <Points>:  {user.points}</Points>

    </Container>
  );
};

export default Score;
