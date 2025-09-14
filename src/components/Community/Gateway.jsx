import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import { HeartHandshake } from 'lucide-react';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #ffe0f0;
  /* MODIFIED: Gradient flipped to have pink at the top, blue at the bottom */
  background: linear-gradient(5deg, rgba(200, 215, 230, 1) 0%, rgba(255, 224, 240, 1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  padding: 100px clamp(1.5rem, 5vw, 4rem);
  box-sizing: border-box;
`;

const GatewayCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: clamp(2rem, 8vw, 4rem);
  border-radius: 20px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 650px;
  text-align: center;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease-out forwards;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(45deg, #e0f7fa, #fce4ec);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 6vw, 2.5rem);
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #555;
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 2.5rem;
`;

const EnterButton = styled(Link)`
  display: inline-block;
  padding: 1rem 3rem;
  border-radius: 10px;
  border: none;
  background-color: #333;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
`;

const Gateway = () => {
  return (
    <>
      <Navbar />
      <PageContainer>
        <GatewayCard>
          <IconWrapper>
            <HeartHandshake size={40} color="#333" />
          </IconWrapper>
          <Title>Community Hub</Title>
          <Description>
            This is a safe and anonymous space to share your story and connect with others on a similar journey. Give and receive support, and remember you are not alone.
          </Description>
          <EnterButton to="/communityhub">Enter the Hub</EnterButton>
        </GatewayCard>
      </PageContainer>
    </>
  );
};

export default Gateway;

