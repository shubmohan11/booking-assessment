import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function NavBar() {
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">BookingApp</Link>
      </div>
      <div className="nav-right">
        {token ? (
          <>
            <Link to="/bookings">Bookings</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  )
}
