import styled from "styled-components";

export const Button = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  &:focus {
    border-radius: 0px;
    background: rgba(255, 255, 255, 1);
  }

  padding: 6px;
  padding-left: 30px;
  padding-right: 30px;
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

  margin-top: 20px;
  min-width: 200px;
  width: 25%;
`;
