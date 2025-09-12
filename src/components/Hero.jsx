import React from 'react';
import styled, { keyframes } from 'styled-components';
import Navbar from './Navbar';
import crumpledPaperImage from '../assets/crumpled-paper.jpg'; // Make sure this path is correct

// Keyframes for the 'unfold' text animation
const unfoldText = keyframes`
  0% {
    transform: scaleY(0) rotateX(90deg);
    opacity: 0;
  }
  100% {
    transform: scaleY(1) rotateX(0deg);
    opacity: 1;
  }
`;

// Keyframes for a slow, continuous rotation for the image
const slowRotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// HeroSection with gradient background
const HeroSection = styled.section`
  min-height: 100vh;
  width: 100%;
  background: #ffe0f0;
  background: linear-gradient(5deg, rgba(255, 224, 240, 1) 0%, rgba(200, 215, 230, 1) 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
`;

// Container for the main content
const HeroContent = styled.main`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8rem;
  position: relative;
`;

const LeftColumn = styled.div`
  max-width: 500px;
  z-index: 2;
`;

const SmallHeading = styled.p`
  color: #666;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const MainHeadline = styled.h1`
  font-size: 4.5rem;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  perspective: 400px;
`;

const AnimatedLetter = styled.span`
  display: inline-block;
  opacity: 0;
  transform-origin: bottom;
  animation: ${unfoldText} 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000) forwards;
  animation-delay: var(--delay);
`;

const Description = styled.p`
  color: #555;
  line-height: 1.6;
  max-width: 450px;
`;

const RightColumn = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 60%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 8rem;
`;

const PaperGraphic = styled.img`
  width: 500px;
  height: auto;
  position: relative;
  left: -100px;
  z-index: 1;
  opacity: 1;
  filter: brightness(1.1) contrast(1) saturate(1);
  animation: ${slowRotate} 60s linear infinite;
`;

// REMOVED StatsContainer, StatsNumber, and StatsLabel styled components

const Hero = () => {
  const headlineText = "YOU ARE NOT ALONE ";
  
  return (
    <HeroSection>
      <Navbar />
      <HeroContent>
        <LeftColumn>
          <SmallHeading>Unfold: Rediscover yourself. Reclaim your story.</SmallHeading>
          <MainHeadline>
            {headlineText.split('').map((letter, index) => (
              <AnimatedLetter
                key={index}
                style={{ '--delay': `${index * 0.04}s` }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </AnimatedLetter>
            ))}
          </MainHeadline>
          <Description>
          You deserve a safe space to heal. A place where you don't have to pretend, where your feelings are valid, and your voice is the most important one in the room. We're here to listen.
          </Description>
        </LeftColumn>
        <RightColumn>
          <PaperGraphic src={crumpledPaperImage} alt="Crumpled paper illustration" />
        </RightColumn>
        {/* REMOVED the StatsContainer JSX block */}
      </HeroContent>
    </HeroSection>
  );
};

export default Hero;