import styled from "styled-components";

export const Messages = styled.ul`
  background: rgba(255,255,255,0.9);
  color: black;
  height: 250px;
  list-style-type: none;
  list-style-position: outside;
  padding: 0px;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 8px;

  display: flex;
  flex-direction: column-reverse;
`;
