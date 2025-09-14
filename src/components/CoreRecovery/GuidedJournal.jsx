import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/Firebase';
import Navbar from '../Navbar';
import { Plus, Pencil, Trash2, Smile, Meh, Frown, Heart, Zap } from 'lucide-react';

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

const JournalWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 2.5rem;
  color: #1a1a1a;
`;

const JournalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const EntryCard = styled.div`
  background-color: ${props => props.bgColor || '#fff7e0'};
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 300px;
  position: relative; // For positioning icons

  h3 {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.2rem;
    color: #333;
    margin: 0 0 0.5rem 0;
    padding-right: 4rem; // Space for icons
  }
  
  small {
    color: #888;
    margin-bottom: 1rem;
  }

  p {
    flex-grow: 1;
    color: #555;
    line-height: 1.6;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  padding: 0;
  transition: color 0.2s ease;
  &:hover { color: #333; }
`;

const MoodDisplay = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
`;

const NewEntryCard = styled.div`
  background: transparent;
  border: 2px dashed #bbb;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  min-height: 300px;
  color: #666;
  transition: all 0.2s ease-in-out;
  &:hover {
    border-color: #333;
    color: #333;
    background: rgba(255, 255, 255, 0.5);
  }
`;

const WritingContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  max-width: 800px;
  margin: 0 auto;
`;

const Prompt = styled.p`
  font-size: 1.2rem;
  color: #555;
  text-align: center;
  margin-bottom: 1.5rem;
  font-style: italic;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 250px;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  resize: vertical;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #90b0c5; }
`;

const MoodSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const MoodButton = styled.button`
  background: none;
  border: 2px solid ${props => props.selected ? props.color : 'transparent'};
  border-radius: 50%;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.color};
  &:hover { transform: scale(1.1); }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.8rem 2rem;
  border-radius: 8px;
  border: none;
  background-color: ${props => props.primary ? '#333' : '#eee'};
  color: ${props => props.primary ? '#fff' : '#555'};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  &:hover { background-color: ${props => props.primary ? '#000' : '#ddd'}; }
`;

// --- Helper Data & Components ---

const prompts = [
  "What is one small victory you had today?",
  "Describe a feeling you're having trouble naming.",
  "What are you grateful for in this moment?",
  "Write about something that made you smile recently.",
  "What is a boundary you can set to protect your peace?",
];
const noteColors = ['#e0f7fa', '#fffde7', '#fce4ec', '#f3e5f5'];

const moods = [
  { name: 'Happy', icon: Smile, color: '#4CAF50' },
  { name: 'Calm', icon: Meh, color: '#FFC107' },
  { name: 'Sad', icon: Frown, color: '#F44336' },
  { name: 'Loved', icon: Heart, color: '#E91E63' },
  { name: 'Anxious', icon: Zap, color: '#2196F3' },
];

const MoodIcon = ({ moodName }) => {
  const mood = moods.find(m => m.name === moodName);
  if (!mood) return null;
  const IconComponent = mood.icon;
  return <IconComponent size={24} color={mood.color} />;
};

// --- Main Journal Component ---

const GuidedJournal = () => {
  const [view, setView] = useState('list');
  const [currentEntryText, setCurrentEntryText] = useState('');
  const [pastEntries, setPastEntries] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null); // To hold the entry being edited

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const journalCollectionRef = collection(db, 'users', user.uid, 'journalEntries');
      const q = query(journalCollectionRef, orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setPastEntries(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      });
      return () => unsubscribe();
    }
  }, []);

  const handleStartNewEntry = () => {
    setEditingEntry(null);
    setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    setCurrentEntryText('');
    setSelectedMood(null);
    setView('writing');
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setCurrentPrompt(entry.prompt);
    setCurrentEntryText(entry.text);
    setSelectedMood(entry.mood);
    setView('writing');
  };

  const handleDeleteEntry = async (entryId) => {
    // A confirmation dialog is recommended in a real app!
    // if (window.confirm("Are you sure you want to delete this entry?")) {
      const user = auth.currentUser;
      if (user) {
        const entryDocRef = doc(db, 'users', user.uid, 'journalEntries', entryId);
        await deleteDoc(entryDocRef);
      }
    // }
  };

  const handleSaveOrUpdateEntry = async () => {
    if (currentEntryText.trim() === '') return;
    const user = auth.currentUser;
    if (!user) return;
    
    const entryData = {
      prompt: currentPrompt,
      text: currentEntryText,
      mood: selectedMood,
      createdAt: editingEntry ? editingEntry.createdAt : serverTimestamp(), // Keep original date on edit
      updatedAt: serverTimestamp(),
    };

    if (editingEntry) {
      // Update existing entry
      const entryDocRef = doc(db, 'users', user.uid, 'journalEntries', editingEntry.id);
      await updateDoc(entryDocRef, entryData);
    } else {
      // Add new entry
      const journalCollectionRef = collection(db, 'users', user.uid, 'journalEntries');
      await addDoc(journalCollectionRef, entryData);
    }
    setView('list');
  };
  
  return (
    <>
      <Navbar />
      <PageContainer>
        <JournalWrapper>
          {view === 'list' ? (
            <>
              <Header>
                <Title>My Journal</Title>
              </Header>
              <JournalGrid>
                <NewEntryCard onClick={handleStartNewEntry}>
                  <Plus size={48} />
                  New Entry
                </NewEntryCard>
                {pastEntries.map((entry, index) => (
                  <EntryCard key={entry.id} bgColor={noteColors[index % noteColors.length]}>
                    <IconContainer>
                      <IconButton onClick={() => handleEditEntry(entry)}><Pencil size={18} /></IconButton>
                      <IconButton onClick={() => handleDeleteEntry(entry.id)}><Trash2 size={18} /></IconButton>
                    </IconContainer>
                    <h3>{entry.prompt}</h3>
                    <small>{new Date(entry.createdAt?.toDate()).toLocaleDateString()}</small>
                    <p>{entry.text}</p>
                    {entry.mood && <MoodDisplay><MoodIcon moodName={entry.mood} /></MoodDisplay>}
                  </EntryCard>
                ))}
              </JournalGrid>
            </>
          ) : (
            <WritingContainer>
              <Prompt>"{currentPrompt}"</Prompt>
              <Textarea 
                value={currentEntryText}
                onChange={(e) => setCurrentEntryText(e.target.value)}
                placeholder="Let your thoughts flow..."
              />
              <MoodSelector>
                {moods.map(mood => (
                  <MoodButton 
                    key={mood.name} 
                    color={mood.color} 
                    selected={selectedMood === mood.name}
                    onClick={() => setSelectedMood(mood.name)}
                  >
                    <mood.icon size={32} />
                  </MoodButton>
                ))}
              </MoodSelector>
              <ButtonGroup>
                <Button onClick={() => setView('list')}>Cancel</Button>
                <Button primary onClick={handleSaveOrUpdateEntry}>
                  {editingEntry ? 'Update Entry' : 'Save Entry'}
                </Button>
              </ButtonGroup>
            </WritingContainer>
          )}
        </JournalWrapper>
      </PageContainer>
    </>
  );
};

export default GuidedJournal;

