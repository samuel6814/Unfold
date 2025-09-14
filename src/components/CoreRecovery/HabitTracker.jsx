import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/Firebase';
import Navbar from '../Navbar';
import { BrainCircuit, Footprints, Droplets, MessageSquare } from 'lucide-react'; // Icons for habits

// --- Styled Components ---

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #ffe0f0;
  background: linear-gradient(5deg, rgba(255, 224, 240, 1) 0%, rgba(200, 215, 230, 1) 100%);
  font-family: 'Inter', sans-serif;
  padding: 100px clamp(1.5rem, 5vw, 4rem);
  box-sizing: border-box;
`;

// Responsive grid for the dashboard layout
const TrackerGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
    align-items: flex-start;
  }
`;

// Base card style for the dashboard
const Card = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: clamp(1.5rem, 5vw, 2.5rem);
  border-radius: 20px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: #1a1a1a;
  margin: 0 0 1.5rem 0;
  text-align: left;
`;

// Sobriety Milestone Card Components
const SobrietyCard = styled(Card)`
  text-align: center;
`;

const CircularProgressContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 1rem auto 2rem;
`;

const Svg = styled.svg`
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const CircleBg = styled.circle`
  fill: none;
  stroke: #eee;
  stroke-width: 15;
`;

const CircleProgress = styled.circle`
  fill: none;
  stroke: #FF9800;
  stroke-width: 15;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
`;

const SobrietyCounter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  font-weight: 800;
  color: #FF9800;
  
  span {
    display: block;
    font-size: 1rem;
    font-weight: 500;
    color: #555;
  }
`;

const InputGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  max-width: 150px;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  border: none;
  background-color: #333;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover { background-color: #000; }
  &:disabled { background-color: #ccc; cursor: not-allowed; }
`;

// Daily Habits Card Components
const HabitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HabitItem = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f7f7f7;
  padding: 1rem;
  border-radius: 10px;
  cursor: pointer;
  border: 2px solid ${props => props.checked ? '#FF9800' : 'transparent'};
  transition: all 0.2s ease;
  
  span {
    flex-grow: 1;
    text-align: left;
    font-weight: 600;
  }
`;

const CustomCheckbox = styled.input`
  appearance: none;
  width: 24px;
  height: 24px;
  border: 2px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  
  &:checked {
    background-color: #FF9800;
    border-color: #FF9800;
  }
  
  &:checked::after {
    content: '✓';
    font-size: 18px;
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;


// --- Helper Data & Components ---

const dailyHabits = [
  { id: 'meditate', name: 'Meditate', icon: BrainCircuit },
  { id: 'exercise', name: 'Exercise', icon: Footprints },
  { id: 'hydrate', name: 'Hydrate', icon: Droplets },
  { id: 'connect', name: 'Connect', icon: MessageSquare },
];

const CircularProgressBar = ({ days }) => {
  const goal = 30; // Example: progress towards a 30-day milestone
  const percentage = Math.min((days / goal) * 100, 100);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <CircularProgressContainer>
      <Svg viewBox="0 0 200 200">
        <CircleBg cx="100" cy="100" r={radius} />
        <CircleProgress cx="100" cy="100" r={radius} strokeDasharray={circumference} strokeDashoffset={offset} />
      </Svg>
      <SobrietyCounter>
        {days}
        <span>Days</span>
      </SobrietyCounter>
    </CircularProgressContainer>
  );
};

// --- Main Habit Tracker Component ---

const HabitTracker = () => {
  const [sobrietyStartDate, setSobrietyStartDate] = useState('');
  const [daysSober, setDaysSober] = useState(0);
  const [checkedHabits, setCheckedHabits] = useState({});
  const [isHabitsLoggedToday, setIsHabitsLoggedToday] = useState(false);

  const todayDateString = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const settingsDocRef = doc(db, 'users', user.uid, 'settings', 'sobriety');
    getDoc(settingsDocRef).then(docSnap => {
      if (docSnap.exists()) {
        const date = docSnap.data().startDate;
        setSobrietyStartDate(date);
        const start = new Date(date);
        const today = new Date();
        const diffTime = Math.abs(today - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysSober(diffDays);
      }
    });

    const habitsCollectionRef = collection(db, 'users', user.uid, 'habitEntries');
    const q = query(habitsCollectionRef, where('date', '==', todayDateString));
    getDocs(q).then(querySnapshot => {
      if (!querySnapshot.empty) {
        setIsHabitsLoggedToday(true);
        const loggedData = querySnapshot.docs[0].data();
        const initialChecked = {};
        dailyHabits.forEach(habit => {
          initialChecked[habit.id] = loggedData.habits.includes(habit.id);
        });
        setCheckedHabits(initialChecked);
      }
    });
  }, [todayDateString]);

  const handleSetSobrietyDate = async () => {
    const user = auth.currentUser;
    if (user && sobrietyStartDate) {
      const settingsDocRef = doc(db, 'users', user.uid, 'settings', 'sobriety');
      await setDoc(settingsDocRef, { startDate: sobrietyStartDate });
      alert('Sobriety start date saved!');
    }
  };

  const handleHabitChange = (habitId) => {
    if (isHabitsLoggedToday) return; // Prevent changes after logging
    setCheckedHabits(prev => ({ ...prev, [habitId]: !prev[habitId] }));
  };

  const handleLogHabits = async () => {
    const user = auth.currentUser;
    if (user) {
      const habitsToLog = Object.keys(checkedHabits).filter(key => checkedHabits[key]);
      const habitsCollectionRef = collection(db, 'users', user.uid, 'habitEntries');
      await addDoc(habitsCollectionRef, {
        date: todayDateString,
        habits: habitsToLog,
        createdAt: serverTimestamp()
      });
      setIsHabitsLoggedToday(true);
      alert('Habits for today logged!');
    }
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <TrackerGrid>
          <SobrietyCard>
            <Title>Sobriety Milestone</Title>
            <CircularProgressBar days={daysSober} />
            <InputGroup>
              <Input 
                type="date" 
                value={sobrietyStartDate} 
                onChange={(e) => setSobrietyStartDate(e.target.value)}
              />
              <Button onClick={handleSetSobrietyDate}>Set Date</Button>
            </InputGroup>
          </SobrietyCard>
          
          <Card>
            <Title>Daily Habits</Title>
            <HabitList>
              {dailyHabits.map(habit => {
                const Icon = habit.icon;
                return (
                  <HabitItem key={habit.id} checked={!!checkedHabits[habit.id]}>
                    <Icon size={24} color="#555" />
                    <span>{habit.name}</span>
                    <CustomCheckbox 
                      type="checkbox"
                      checked={!!checkedHabits[habit.id]}
                      onChange={() => handleHabitChange(habit.id)}
                      disabled={isHabitsLoggedToday}
                    />
                  </HabitItem>
                );
              })}
            </HabitList>
            <Button 
              onClick={handleLogHabits} 
              style={{ marginTop: '2rem', width: '100%' }}
              disabled={isHabitsLoggedToday}
            >
              {isHabitsLoggedToday ? 'Logged for Today' : 'Log Today\'s Habits'}
            </Button>
          </Card>
        </TrackerGrid>
      </PageContainer>
    </>
  );
};

export default HabitTracker;

