import React from "react";
import styled from "styled-components";

const Button = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  &:focus {
    border-radius: 0px;
    background: rgba(255, 255, 255, 1);
  }

  padding: 6px;
  padding-left: auto;
  padding-right: auto;
  margin-top: 4px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: black;
  width: ${props => props.width || null};
  height: 35px;
  border: none;
  border-radius: 20px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(230, 238, 235);
  transition: all 0.3s ease;
  min-width: 20%;
`;

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

const FriendRequest = ({ user, accept, reject}) => {
    return (
        <Container>
            <UserName>{user.username}</UserName>
            {accept ? <Button style={{color:"green"}}
                width={"10%"}
                onClick={accept}>✔️</Button> : "" }

            {reject ? <Button style={{color:"red",paddingLeft:"auto",paddingRight:"auto"}}
                              width={"15px"}
                              onClick={reject}>❌</Button> :""}
        </Container>
    );
};

export default FriendRequest;
