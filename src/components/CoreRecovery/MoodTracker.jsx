import React, { useState } from 'react';
import styled from 'styled-components';
import { Smile, Meh, Frown, Heart, Zap } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/Firebase';
import Navbar from '../Navbar';

// Main layout container
const TrackerContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffe0f0;
  background: linear-gradient(5deg, rgba(255, 224, 240, 1) 0%, rgba(200, 215, 230, 1) 100%);
  font-family: 'Inter', sans-serif;
  padding: 80px clamp(1rem, 5vw, 2rem); /* Responsive padding */
  box-sizing: border-box;
`;

// The main card for the mood tracker
const MoodCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: clamp(2rem, 8vw, 3rem); /* Responsive padding */
  border-radius: 15px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 100%;
  max-width: 650px; /* Slightly increased max-width */
  text-align: center;
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: clamp(1.8rem, 5vw, 2.5rem); /* Responsive font size */
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #555;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
`;

// MODIFIED: Added flex-wrap for responsiveness
const MoodOptionsContainer = styled.div`
  display: flex;
  justify-content: center; /* Center items when they wrap */
  flex-wrap: wrap; /* Allow buttons to wrap onto the next line */
  gap: 1rem;
`;

// MODIFIED: Responsive adjustments for padding and icon size
const MoodButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 2px solid transparent;
  border-radius: 10px;
  padding: 0.5rem; /* Reduced padding for smaller screens */
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
  color: ${props => props.color || '#333'};
  flex-basis: 80px; /* Give a base width to each button */

  &:hover {
    transform: scale(1.1);
    border-color: ${props => props.color || '#ccc'};
  }

  span {
    font-weight: 600;
    font-size: 0.9rem;
  }

  /* Adjust icon size for responsiveness */
  svg {
    width: 40px;
    height: 40px;
  }

  @media (min-width: 768px) {
    padding: 1rem;
    flex-basis: 100px;
    svg {
      width: 48px;
      height: 48px;
    }
  }
`;

const ConfirmationMessage = styled.div`
  padding: 2rem;
  text-align: center;

  h2 {
    font-family: 'Montserrat', sans-serif;
    color: #1a1a1a;
    font-size: 2rem;
  }

  p {
    color: #555;
    font-size: 1.1rem;
  }
`;

const MoodTracker = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleMoodSelect = async (mood) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No user is logged in to save mood.");
      return;
    }
    try {
      const moodEntriesCollectionRef = collection(db, 'users', user.uid, 'moodEntries');
      await addDoc(moodEntriesCollectionRef, {
        mood: mood,
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
      <Navbar />
      <TrackerContainer>
        <MoodCard>
          {!submitted ? (
            <>
              <Title>Daily Check-in</Title>
              <Subtitle>How are you feeling right now?</Subtitle>
              <MoodOptionsContainer>
                <MoodButton color="#4CAF50" onClick={() => handleMoodSelect('Happy')}>
                  <Smile />
                  <span>Happy</span>
                </MoodButton>
                <MoodButton color="#FFC107" onClick={() => handleMoodSelect('Calm')}>
                  <Meh />
                  <span>Calm</span>
                </MoodButton>
                <MoodButton color="#F44336" onClick={() => handleMoodSelect('Sad')}>
                  <Frown />
                  <span>Sad</span>
                </MoodButton>
                <MoodButton color="#E91E63" onClick={() => handleMoodSelect('Loved')}>
                  <Heart />
                  <span>Loved</span>
                </MoodButton>
                <MoodButton color="#2196F3" onClick={() => handleMoodSelect('Anxious')}>
                  <Zap />
                  <span>Anxious</span>
                </MoodButton>
              </MoodOptionsContainer>
            </>
          ) : (
            <ConfirmationMessage>
              <h2>Thank You!</h2>
              <p>Your check-in has been logged. Remember, every feeling is valid.</p>
            </ConfirmationMessage>
          )}
        </MoodCard>
      </TrackerContainer>
    </>
  );
};

export default MoodTracker;

