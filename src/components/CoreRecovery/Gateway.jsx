import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { Smile, BookOpen, Target } from 'lucide-react';
import Navbar from '../Navbar';

// NEW: Keyframe for the fade-in-up reveal animation
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

// The main container is a full page with the hero background and centering.
const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #c8d7e6;
  background: linear-gradient(5deg, rgba(200, 215, 230, 1) 0%, rgba(255, 224, 240, 1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  padding: 100px clamp(1.5rem, 5vw, 4rem);
  box-sizing: border-box;
  overflow: hidden;
`;

// A wrapper for the content to control its max-width
const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  text-align: center;
`;

// MODIFIED: Added animation
const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: clamp(3rem, 6vw, 4.5rem);
  color: #1a1a1a;
  line-height: 1.1;
  margin-bottom: 1rem;
  
  /* Animation */
  opacity: 0;
  animation: ${fadeInUp} 0.8s 0.2s ease-out forwards;
`;

// MODIFIED: Added animation
const Subtitle = styled.p`
  color: #555;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  /* Animation */
  opacity: 0;
  animation: ${fadeInUp} 0.8s 0.4s ease-out forwards;

  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2.5rem;
`;

// MODIFIED: Added animation with staggered delay
const ToolCard = styled(Link)`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(5px);
  padding: 2.5rem 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-decoration: none;
  color: #333;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

  /* Animation */
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease-out forwards;
  
  /* Staggered delay for each card */
  &:nth-child(1) { animation-delay: 0.6s; }
  &:nth-child(2) { animation-delay: 0.8s; }
  &:nth-child(3) { animation-delay: 1s; }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.hovercolor || '#333'};
  }

  h3 {
    font-family: 'Montserrat', sans-serif;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
  }

  p {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const Gateway = () => {
  return (
    <>
      <Navbar />
      <PageContainer>
        <ContentWrapper>
          <Title>Recovery Toolkit</Title>
          <Subtitle>
            Here you'll find a collection of tools designed to support you on your journey of self-discovery and healing.
          </Subtitle>
          <ToolsGrid>
            <ToolCard to="/moodtracker" hovercolor="#4CAF50">
              <Smile size={48} color="#000300" />
              <h3>Daily Check-in</h3>
              <p>Log your daily mood to recognize patterns and celebrate your emotional progress.</p>
            </ToolCard>
            
            <ToolCard to="/guidedjournal" hovercolor="#2196F3">
              <BookOpen size={48} color="#000000" />
              <h3>Guided Journal</h3>
              <p>Reflect on your thoughts and feelings with structured, recovery-focused prompts.</p>
            </ToolCard>
            
            <ToolCard to="/habittracker" hovercolor="#FF9800">
              <Target size={48} color="#000000" />
              <h3>Habit Tracker</h3>
              <p>Build positive daily habits and track your sobriety milestones to visualize progress.</p>
            </ToolCard>
          </ToolsGrid>
        </ContentWrapper>
      </PageContainer>
    </>
  );
};

export default Gateway;

