import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin: 6px 0;
  width: 600px;
  padding: 100px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #ffffff26;
`;

const Gridcontainer = styled.div`
  grid-template-columns: auto auto;
  grid-gap: 10px;
  background-color: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  padding: 10px;
`;

const Ingrid = styled.div`
  background-color: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  text-align: center;
  padding: 20px 0;
  font-size: 20px;
`;

const UserName = styled.div`
  font-weight: lighter;
  margin-left: 5px;
  color: #ffffcc;
`;

const Name = styled.div`
  font-weight: bold;
  color: #ffffcc;
`;

const Id = styled.div`
  margin-left: auto;
  margin-right: 10px;
  font-weight: bold;
  color: #ffffcc;
`;

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */

 // Correct Layout
const Profile = ({ user }) => {
  return (
    <Gridcontainer>
      <Ingrid>
        <Id> Username: {user.username} </Id>
      </Ingrid>
      <Ingrid>
        <UserName> Online Status: {user.status}</UserName>
      </Ingrid>
      <Ingrid>
        <Name> Creation Date: {user.creation_date}</Name>
      </Ingrid>
      <Ingrid>
        <Name>Birth Date: {user.birth_date ? user.birth_date: "Not yet added"} </Name>
      </Ingrid>
    </Gridcontainer>
  );
};

export default Profile;
