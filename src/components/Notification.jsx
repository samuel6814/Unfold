import React from 'react';
import styled, { keyframes } from 'styled-components';
import { CheckCircle, XCircle } from 'lucide-react';

const slideIn = keyframes`
  from {
    transform: translateY(-100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100px);
    opacity: 0;
  }
`;

const NotificationWrapper = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  background-color: ${props => props.type === 'success' ? '#4CAF50' : '#F44336'};
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: ${slideIn} 0.5s ease-out forwards, ${slideOut} 0.5s 2.5s ease-out forwards;
`;

const Message = styled.p`
  margin: 0;
  font-weight: 600;
`;

const Notification = ({ message, type }) => {
  return (
    <NotificationWrapper type={type}>
      {type === 'success' ? <CheckCircle /> : <XCircle />}
      <Message>{message}</Message>
    </NotificationWrapper>
  );
};

export default Notification;

