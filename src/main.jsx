import { StrictMode } from 'react'
import {createRoot} from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RecoveryTools from "./components/CoreRecovery/GuidedJournal"
import Testimonials from "./components/Testimonials"
import Login from "./components/Authentication/Login"
import App from './App'
import SignUp from './components/Authentication/SignUp'
import CoreRecovery from './components/CoreRecovery/GuidedJournal'
import MoodTracker from './components/CoreRecovery/MoodTracker'
import GuidedJournal from './components/CoreRecovery/GuidedJournal'
import HabitTracker from './components/CoreRecovery/HabitTracker'
import AiCounsellor from './components/AiCounsellor/AiCounsellor'
import CommunityHub from './components/Community/CommunityHub'
import BreathingExercise from './components/RescourceSkills/BreathingExercise'
import ResourceLibrary from './components/RescourceSkills/ResoureLibrary'
import PersonalGoalSetting from './components/RescourceSkills/PersonalGoalSetting'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>} />
      <Route path="/recoverytools" element={<RecoveryTools />} /> 
      <Route path="/testimonials" element={<Testimonials />} /> 
      <Route path="/login" element={<Login />} /> 
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/recoverytools" element={<CoreRecovery />} />
      <Route path="/moodtracker" element={<MoodTracker />} />
      <Route path="/guidedjournal" element={<GuidedJournal />} />
      <Route path="/habittracker" element={<HabitTracker />} />
      <Route path="/chat" element={<AiCounsellor />} />
      <Route path="/communityhub" element={<CommunityHub/>} />
      <Route path="/breathingexercise" element={<BreathingExercise/>} />
      <Route path="/resourcelibrary" element={<ResourceLibrary/>} />
      <Route path="/personalgoals" element={<PersonalGoalSetting/>} />
      <Route path="/testimonials" element={<Testimonials/>} />

    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
