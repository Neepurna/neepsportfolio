import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Add touch detection
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// Add a class to the HTML element for touch-specific CSS
if (isTouchDevice()) {
  document.documentElement.classList.add('touch-device')
}

// Fix viewport height issues on mobile browsers
const setVhProperty = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

// Set the property initially and on resize
setVhProperty()
window.addEventListener('resize', setVhProperty)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
