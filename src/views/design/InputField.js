import styled from "styled-components";

export const InputField = styled.input`
  &::placeholder {
    color: black;
  }

  &:hover {
    transform: translateY(-2px);
  }

  &:focus {
    border-radius: 0px;
    background: rgba(255, 255, 255, 1);
  }

  height: 35px;
  padding-left: 15px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.9);
  color: black;
  transition: all 0.3s ease;
  margin: 12px;
`;
