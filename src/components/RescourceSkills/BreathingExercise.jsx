import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Navbar from '../Navbar';

// --- Styled Components ---

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #c8d7e6; /* Calming blue as the base */
  background: linear-gradient(5deg, rgba(255, 224, 240, 1) 0%, rgba(200, 215, 230, 1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  padding: 100px 2rem;
  box-sizing: border-box;
  overflow: hidden;
`;

const BreathingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  text-align: center;
`;

// Keyframe for the breathing animation
const breatheAnimation = keyframes`
  0% { transform: scale(0.8); }
  50% { transform: scale(1); }
  100% { transform: scale(0.8); }
`;

const BreathingCircle = styled.div`
  width: clamp(200px, 50vw, 300px);
  height: clamp(200px, 50vw, 300px);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  animation: ${props => props.isBreathing ? breatheAnimation : 'none'} 8s ease-in-out infinite;
`;

const InstructionText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 600;
  color: #333;
  min-height: 60px; /* Prevent layout shift as text changes */
`;

const Button = styled.button`
  padding: 1rem 3rem;
  border-radius: 10px;
  border: none;
  background-color: #333;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover { background-color: #000; }
`;


// --- Breathing Exercise Component ---

const breathingCycle = [
  { text: 'Breathe In...', duration: 4000 }, // 4 seconds
  { text: 'Hold', duration: 4000 },          // 4 seconds
  { text: 'Breathe Out...', duration: 4000 }, // 4 seconds
  { text: 'Hold', duration: 4000 },          // 4 seconds
];

const BreathingExercise = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [instruction, setInstruction] = useState('Press Start to Begin');
  
  useEffect(() => {
    let timer;
    if (isBreathing) {
      let cycleIndex = 0;
      const runCycle = () => {
        setInstruction(breathingCycle[cycleIndex].text);
        timer = setTimeout(() => {
          cycleIndex = (cycleIndex + 1) % breathingCycle.length;
          runCycle();
        }, breathingCycle[cycleIndex].duration);
      };
      runCycle();
    } else {
      setInstruction('Press Start to Begin');
    }
    
    return () => clearTimeout(timer); // Cleanup timer on stop or unmount
  }, [isBreathing]);

  return (
    <>
      <Navbar />
      <PageContainer>
        <BreathingWrapper>
          <BreathingCircle isBreathing={isBreathing}>
            <InstructionText>{instruction}</InstructionText>
          </BreathingCircle>
          <Button onClick={() => setIsBreathing(!isBreathing)}>
            {isBreathing ? 'Stop' : 'Start'}
          </Button>
        </BreathingWrapper>
      </PageContainer>
    </>
  );
};

export default BreathingExercise;
