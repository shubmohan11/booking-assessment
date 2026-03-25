import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    // could send to remote logger
    console.error('[ErrorBoundary]', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20 }}>
          <h2>Something went wrong.</h2>
          <pre style={{ color: '#b91c1c' }}>{String(this.state.error)}</pre>
        </div>
      )
    }
    return this.props.children
  }
}
