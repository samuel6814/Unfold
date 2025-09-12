import { StrictMode } from 'react'
import {createRoot} from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RecoveryTools from "./components/CoreRecovery/CoreRecovery"
import Testimonials from "./components/Testimonials"
import Login from "./components/Authentication/Login"
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>} />
      <Route path="/recoverytools" element={<RecoveryTools />} /> 
      <Route path="/testimonials" element={<Testimonials />} /> 
      <Route path="/login" element={<Login />} /> 

    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
