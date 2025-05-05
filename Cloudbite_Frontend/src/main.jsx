import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import StoreContextProvider from './Context/StoreContext'
import { AuthProvider } from './components/auth_components/AuthProvider'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreContextProvider>
      <AuthProvider> {/* ✅ Wrap AuthContext inside StoreContext if needed */}
        <App />
      </AuthProvider>
    </StoreContextProvider>
  </BrowserRouter>
)
