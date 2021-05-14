import React from "react";
import styled from "styled-components";

const Container = styled.li`
  align-items: left;
  text-align: left;
  border: 1px solid #ffffff26;
  padding: 0;
  margin: 0;
  border-bottom: 1px rgba(0,0,0,0.2) dashed;
`;

const Sender = styled.span`
  color: blue;
  font-weight: lighter;
  font-size: 10px;
  padding: 0;
  margin: 0;
`;

const Timestamp = styled.span`
  font-weight: lighter;
  font-size: 10px;
  color: rgba(0,0,0,0.5);
  padding: 0;
  margin: 0;
`;

const MessageBody = styled.p`
  font-size: 12px;
  padding: 0;
  margin: 0;
`;

const Message = ({ message }) => {
  return (
    <Container>
      <Sender>{message.writerName}</Sender>
      <Timestamp>({message.timeStamp})</Timestamp>
      <MessageBody>{message.message}</MessageBody>
    </Container>
  );
};

export default Message;
