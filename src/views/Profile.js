import React from "react";
import styled from "styled-components";



const Gridcontainer = styled.div`
  grid-template-columns: auto auto;
  grid-gap: 10px;
  background-color: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  padding: 10px;
  margin-top: -50px;
`;

const Ingrid = styled.div`
  background-color: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  text-align: left;
  padding: 8px;
  font-size: 20px;
`;


const Name = styled.div`
  font-weight: bold;
  margin-right: auto;
  color: white;
`;



/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */

 // Correct Profile Layout
const Profile = ({ user }) => {
  return (
    <Gridcontainer>
      <Ingrid>
          <Name style={{marginTop:10+"px"}}>Username: {user.username} </Name>
      </Ingrid>
      <Ingrid>
        <Name> Online Status: {user.status}</Name>
      </Ingrid>
      <Ingrid>
        <Name> Creation Date: {user.creationDate.substring(0,16)}</Name>
      </Ingrid>
      <Ingrid>
        <Name>Birth Date: {user.birthDate ? user.birthDate: "-"} </Name>
      </Ingrid>
        <Ingrid>
            <Name>#Tag: {user.userTag ? user.userTag : "-"} </Name>
        </Ingrid>
    </Gridcontainer>
  );
};

export default Profile;
