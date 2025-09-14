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

// MODIFIED: Added column direction and gap for mobile
const HeroContent = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column; /* Stack vertically on mobile */
  align-items: center;
  justify-content: center;
  gap: 2rem; /* Add space between text and image on mobile */
  width: 100%;
  padding: 80px clamp(1.5rem, 5vw, 8rem);
  box-sizing: border-box;

  /* On larger screens, switch to a two-column layout */
  @media (min-width: 992px) {
    flex-direction: row; /* Side-by-side on desktop */
    justify-content: space-between;
  }
`;

// MODIFIED: Text alignment and max-width adjustments for responsiveness
const LeftColumn = styled.div`
  max-width: 550px;
  z-index: 2;
  text-align: center;

  @media (min-width: 992px) {
    text-align: left;
  }
`;

const SmallHeading = styled.p`
  color: #666;
  font-weight: 500;
  margin-bottom: 1rem;
`;

// MODIFIED: Responsive font size
const MainHeadline = styled.h1`
  font-size: clamp(2.5rem, 8vw, 4.5rem);
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
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 992px) {
    margin-left: 0;
    margin-right: 0;
  }
`;

// MODIFIED: Now visible on mobile
const RightColumn = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  width: 100%;
`;

// MODIFIED: Made the image responsive
const PaperGraphic = styled.img`
  width: 100%;
  max-width: 300px; /* Smaller max-width for mobile */
  height: auto;
  z-index: 1;
  opacity: 1;
  filter: brightness(1.1) contrast(1) saturate(1);
  animation: ${slowRotate} 60s linear infinite;

  @media (min-width: 992px) {
    max-width: 500px; /* Restore larger size for desktop */
  }
`;

const Hero = () => {
  // MODIFIED: Split headline into two lines
  const headlineText = "YOU ARE NOT\nALONE";
  const headlineLines = headlineText.split('\n');
  
  return (
    <HeroSection>
      <Navbar />
      <HeroContent>
        <LeftColumn>
          <SmallHeading>Unfold: Rediscover yourself. Reclaim your story.</SmallHeading>
          <MainHeadline>
            {/* MODIFIED: Re-introduced logic for multi-line animation */}
            {headlineLines.map((line, lineIndex) => {
              const previousLinesLength = headlineLines.slice(0, lineIndex).reduce((acc, l) => acc + l.length, 0);
              return (
                <div key={lineIndex}>
                  {line.split('').map((letter, letterIndex) => {
                    const globalIndex = previousLinesLength + letterIndex;
                    return (
                      <AnimatedLetter
                        key={letterIndex}
                        style={{ '--delay': `${globalIndex * 0.04}s` }}
                      >
                        {letter === ' ' ? '\u00A0' : letter}
                      </AnimatedLetter>
                    );
                  })}
                </div>
              );
            })}
          </MainHeadline>
          <Description>
          You deserve a safe space to heal. A place where you don't have to pretend, where your feelings are valid, and your voice is the most important one in the room. We're here to listen.
          </Description>
        </LeftColumn>
        <RightColumn>
          <PaperGraphic src={crumpledPaperImage} alt="Crumpled paper illustration" />
        </RightColumn>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero;

