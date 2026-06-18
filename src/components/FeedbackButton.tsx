import { useState, type FormEvent } from 'react'
import { buildFeedbackMailtoUrl } from '../lib/feedback'

interface FeedbackButtonProps {
  userEmail?: string | null
}

export function FeedbackButton({ userEmail }: FeedbackButtonProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [replyEmail, setReplyEmail] = useState(userEmail ?? '')
  const [error, setError] = useState('')

  const close = () => {
    setOpen(false)
    setError('')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = message.trim()
    if (!trimmed) {
      setError('Vui lòng nhập nội dung phản hồi.')
      return
    }

    const mailtoUrl = buildFeedbackMailtoUrl(trimmed, {
      replyEmail: replyEmail.trim() || undefined,
      userEmail: userEmail ?? undefined,
    })

    window.location.href = mailtoUrl
    setMessage('')
    setOpen(false)
    setError('')
  }

  return (
    <>
      <button
        type="button"
        className="feedback-fab"
        onClick={() => setOpen(true)}
        aria-label="Gửi phản hồi cho nhà phát triển"
        title="Phản hồi"
      >
        ✉
      </button>

      {open && (
        <div className="modal-overlay" onClick={close}>
          <div
            className="modal feedback-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="feedback-title"
          >
            <h2 id="feedback-title">Gửi phản hồi</h2>
            <p className="feedback-hint">
              Ý kiến của bạn giúp cải thiện app. Sau khi gửi, ứng dụng email sẽ mở để bạn
              hoàn tất.
            </p>

            <form onSubmit={handleSubmit}>
              {error && <p className="error-msg">{error}</p>}

              <div className="form-group">
                <label htmlFor="feedback-message">Nội dung</label>
                <textarea
                  id="feedback-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mô tả lỗi, góp ý hoặc đề xuất tính năng..."
                  rows={5}
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="feedback-reply-email">Email liên hệ (tuỳ chọn)</label>
                <input
                  id="feedback-reply-email"
                  type="email"
                  value={replyEmail}
                  onChange={(e) => setReplyEmail(e.target.value)}
                  placeholder="để nhà phát triển phản hồi lại"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={close}>
                  Huỷ
                </button>
                <button type="submit" className="btn btn-primary">
                  Gửi qua email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
