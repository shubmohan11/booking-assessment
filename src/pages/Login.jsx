import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import client from '../api/client'

export default function Login() {
  const [email, setEmail] = useState('react@hipster-inc.com')
  const [password, setPassword] = useState('React@123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const loginStore = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // use store.login which wraps the API call
      await loginStore.login(email, password)
      console.log('[auth] logged in')
      navigate('/bookings')
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</button>
        {error && <div className="error">{error}</div>}
      </form>
      <div className="note">Use the sample credentials provided in the spec to bypass captcha.</div>
    </div>
  )
}
