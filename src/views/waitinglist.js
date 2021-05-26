import React from "react";
import styled from "styled-components";


const Container = styled.div`
  margin: 6px 0;
  width: 200px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #ffffff26;
  position:relative;
`;

const UserName = styled.div`
  font-weight: lighter;

  font-size: 17px;
  text-align: center;

`;
const Button = styled.button`
  &:hover {
    transform: translateY(-2px);
    color: rgba(255,0,0,1);
  }
    position: absolute;
    font-family: Arial Black  ;
    right:20px;
    font-size: 25px;
    font-weight: bolder;
 color: rgb(255,0,0,0.3);
  background-color: rgba(0,0,0,0);
    border: 0px;



`;


/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */

const waitingList = ({ user, f_onClick }) => {
  return (
    <Container>
      <UserName>{user.name}</UserName>

      { f_onClick ? <Button onClick={f_onClick}>X</Button> : "" }
    </Container>
  );
};

export default waitingList;
