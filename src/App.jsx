import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import './App.css'

const Login = lazy(() => import('./pages/Login'))
const Bookings = lazy(() => import('./pages/Bookings'))

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="app-container">
        <Suspense fallback={<div>Loading…</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/bookings" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  )
}

export default App
