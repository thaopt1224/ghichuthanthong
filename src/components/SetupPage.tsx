import { Logo } from './Logo'

export function SetupPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Logo size={52} />
          <h1>Chưa cấu hình Firebase</h1>
          <p>App cần file <code>.env</code> với thông tin Firebase để chạy.</p>
        </div>

        <ol style={{ margin: '0 0 1.25rem', paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
          <li>Tạo project tại <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
          <li>Bật Authentication → Email/Password</li>
          <li>Tạo Firestore Database</li>
          <li>Copy config Web app vào file <code>.env</code></li>
        </ol>

        <pre style={{
          margin: 0,
          padding: '0.85rem',
          background: 'var(--black-soft)',
          border: '1px solid var(--black-border)',
          borderRadius: 'var(--radius)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          overflowX: 'auto',
        }}>
{`cp .env.example .env
# Sau đó sửa .env với config thật`}
        </pre>

        <p style={{ margin: '1rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Sau khi lưu <code>.env</code>, restart dev server (<code>npm run dev</code>).
        </p>
      </div>
    </div>
  )
}
