import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Wind, Library } from 'lucide-react';
import Navbar from '../Navbar';

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  /* MODIFIED: Gradient updated to match the main theme (blue on top, pink on bottom) */
  background: linear-gradient(5deg, rgba(255, 224, 240, 1) 0%, rgba(200, 215, 230, 1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  padding: 100px clamp(1.5rem, 5vw, 4rem);
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  text-align: center;
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: clamp(3rem, 6vw, 4.5rem);
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #555;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2.5rem;
`;

const ToolCard = styled(Link)`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(5px);
  padding: 2.5rem 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-decoration: none;
  color: #333;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }

  h3 {
    font-family: 'Montserrat', sans-serif;
    margin-top: 1.5rem;
    font-size: 1.25rem;
  }
`;

const Gateway = () => {
  return (
    <>
      <Navbar />
      <PageContainer>
        <ContentWrapper>
          <Title>Resources & Skills</Title>
          <Subtitle>
            Tools to find calm in moments of crisis and knowledge to empower your journey.
          </Subtitle>
          <ToolsGrid>
            <ToolCard to="/breathingexercise">
              <Wind size={48} color="#3B82F6" />
              <h3>SOS Grounding</h3>
              <p>A guided breathing exercise to help you find calm and center yourself.</p>
            </ToolCard>
            
            <ToolCard to="/resourcelibrary">
              <Library size={48} color="#8B5CF6" />
              <h3>Resource Library</h3>
              <p>A curated collection of articles and guides to support your growth.</p>
            </ToolCard>
          </ToolsGrid>
        </ContentWrapper>
      </PageContainer>
    </>
  );
};

export default Gateway;

