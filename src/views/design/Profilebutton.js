import styled from "styled-components";

export const Profilebutton = styled.button`
  &:hover {
    transform: translateY(-5px);
  }
  padding: 20px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  width: ${props => props.width || null};
  height: 100px;
  border: none;
  border-radius: 20px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(42, 0, 128);
  transition: all 0.3s ease;
`;
