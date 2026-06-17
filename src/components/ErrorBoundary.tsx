import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="auth-page">
          <div className="auth-card">
            <div className="auth-logo">
              <h1 style={{ color: 'var(--danger)' }}>Đã xảy ra lỗi</h1>
              <p>{this.state.error.message}</p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={() => window.location.reload()}
            >
              Tải lại trang
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
