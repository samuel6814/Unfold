import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { doc, setDoc, getDoc, collection, addDoc, onSnapshot, query, updateDoc, deleteDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/Firebase';
import Navbar from '../Navbar';
import { Trash2 } from 'lucide-react';

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(5deg, rgba(255, 224, 240, 1) 0%, rgba(200, 215, 230, 1) 100%);
  font-family: 'Inter', sans-serif;
  padding: 100px clamp(1.5rem, 5vw, 4rem);
  box-sizing: border-box;
`;

const GoalsWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: clamp(1.5rem, 5vw, 2rem);
  border-radius: 20px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  resize: vertical;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;

  &:focus {
    outline: none;
    border-color: #90b0c5;
  }
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
  margin-top: 1rem;
  float: right;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #000;
  }
`;

const GoalInputForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;

  &:focus {
    outline: none;
    border-color: #90b0c5;
  }
`;

const GoalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const GoalItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f7f7f7;
  padding: 1rem;
  border-radius: 8px;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => props.completed ? '#aaa' : '#333'};
  transition: all 0.2s ease;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #aaa;
  margin-left: auto;
  padding: 0.2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover { 
    color: #f44336;
    background-color: #fde8e8;
  }
`;

const PersonalGoalSetting = () => {
  const [why, setWhy] = useState('');
  const [goals, setGoals] = useState([]);
  const [newGoalText, setNewGoalText] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch "why"
        const whyDocRef = doc(db, 'users', currentUser.uid, 'settings', 'motivation');
        getDoc(whyDocRef).then(docSnap => {
          if (docSnap.exists()) setWhy(docSnap.data().text);
        });
        // Fetch goals
        const goalsCollectionRef = collection(db, 'users', currentUser.uid, 'goals');
        const q = query(goalsCollectionRef, orderBy('createdAt', 'asc'));
        onSnapshot(q, snapshot => {
          setGoals(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        });
      } else {
        setUser(null);
        setWhy('');
        setGoals([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSaveWhy = async () => {
    if (!user) return;
    const whyDocRef = doc(db, 'users', user.uid, 'settings', 'motivation');
    await setDoc(whyDocRef, { text: why });
    alert('Your motivation has been saved!');
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (newGoalText.trim() === '' || !user) return;
    const goalsCollectionRef = collection(db, 'users', user.uid, 'goals');
    await addDoc(goalsCollectionRef, {
      text: newGoalText,
      isCompleted: false,
      createdAt: serverTimestamp(),
    });
    setNewGoalText('');
  };

  const handleToggleGoal = async (goal) => {
    if (!user) return;
    const goalDocRef = doc(db, 'users', user.uid, 'goals', goal.id);
    await updateDoc(goalDocRef, { isCompleted: !goal.isCompleted });
  };
  
  const handleDeleteGoal = async (goalId) => {
    if (!user) return;
    const goalDocRef = doc(db, 'users', user.uid, 'goals', goalId);
    await deleteDoc(goalDocRef);
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <GoalsWrapper>
          <Card>
            <Title>My "Why" for Recovery</Title>
            <Textarea 
              placeholder="What is your core motivation? Write down what drives you on this journey..."
              value={why}
              onChange={(e) => setWhy(e.target.value)}
            />
            <Button onClick={handleSaveWhy}>Save My Why</Button>
          </Card>
          <Card>
            <Title>My Actionable Goals</Title>
            <GoalList>
              {goals.map(goal => (
                <GoalItem key={goal.id} completed={goal.isCompleted}>
                  <Checkbox 
                    type="checkbox" 
                    checked={goal.isCompleted}
                    onChange={() => handleToggleGoal(goal)}
                  />
                  <span>{goal.text}</span>
                  <DeleteButton onClick={() => handleDeleteGoal(goal.id)}>
                    <Trash2 size={18} />
                  </DeleteButton>
                </GoalItem>
              ))}
            </GoalList>
            <GoalInputForm onSubmit={handleAddGoal}>
              <Input 
                type="text"
                placeholder="Add a new goal..."
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
              />
              <Button as="button" type="submit" style={{marginTop: 0, float: 'none'}}>Add Goal</Button>
            </GoalInputForm>
          </Card>
        </GoalsWrapper>
      </PageContainer>
    </>
  );
};

export default PersonalGoalSetting;

 