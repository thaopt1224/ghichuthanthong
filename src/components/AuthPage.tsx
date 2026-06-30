import { useState, type FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Logo } from './Logo'

function getAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Email không hợp lệ.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email hoặc mật khẩu không đúng.'
    case 'auth/email-already-in-use':
      return 'Email đã được sử dụng.'
    case 'auth/weak-password':
      return 'Mật khẩu phải có ít nhất 6 ký tự.'
    default:
      return 'Đã xảy ra lỗi. Vui lòng thử lại.'
  }
}

export function AuthPage() {
  const { login, register } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isRegister) {
        await register(email, password)
      } else {
        await login(email, password)
      }
    } catch (err) {
      const code = (err as { code?: string }).code ?? ''
      setError(getAuthErrorMessage(code))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Logo size={52} />
          <h1>Vô Hạn Ghi Chú</h1>
          <p>Lưu lại những điều thú vị bạn gặp</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="error-msg">{error}</p>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ban@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
            {submitting ? 'Đang xử lý...' : isRegister ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </form>

        <p className="auth-toggle">
          {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
          <button type="button" onClick={() => { setIsRegister(!isRegister); setError('') }}>
            {isRegister ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </p>
      </div>
    </div>
  )
}
