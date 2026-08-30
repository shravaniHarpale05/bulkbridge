import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './services/api.js'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
  </BrowserRouter>

)

