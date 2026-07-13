/**
 * main.jsx — React application entry point
 * 
 * Wraps the App component in BrowserRouter for client-side routing
 * and StrictMode for development warnings.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UploadProvider } from './context/UploadContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UploadProvider>
        <App />
      </UploadProvider>
    </BrowserRouter>
  </StrictMode>,
)
