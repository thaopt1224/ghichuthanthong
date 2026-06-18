export const FEEDBACK_EMAIL = 'thaopt.1224@gmail.com'

export function buildFeedbackMailtoUrl(
  message: string,
  options?: { replyEmail?: string; userEmail?: string },
): string {
  const subject = encodeURIComponent('Ghi Chú Thần Thông — Feedback')
  const lines = [message.trim()]

  if (options?.replyEmail?.trim()) {
    lines.push('', `Email liên hệ: ${options.replyEmail.trim()}`)
  } else if (options?.userEmail) {
    lines.push('', `Tài khoản đăng nhập: ${options.userEmail}`)
  }

  const body = encodeURIComponent(lines.join('\n'))
  return `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`
}
