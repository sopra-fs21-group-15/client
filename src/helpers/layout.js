import styled from "styled-components";

export const DESKTOP_WIDTH = 1160;
export const SMALL_LAPTOPS_WIDTH = 970;
export const TABLETS_WIDTH = 750;
export const SMALL_WIDTH = 768;

export const BaseContainer = styled.div`
 
  margin-left: auto;
  margin-right: auto;
  width: 800px;
  max-width: ${DESKTOP_WIDTH}px;
  justify-content: center;
  color: white;
  text-align: center;
  background: rgba(50, 50, 50, 0.8);
  backdrop-filter: blur(6px);
  border-radius: 10px;
  padding: 30px;
  padding-left: 60px;
  padding-right: 60px;
`;
