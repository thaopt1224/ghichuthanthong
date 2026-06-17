import { useEffect, useState, type FormEvent } from 'react'
import {
  CATEGORIES,
  CATEGORY_IDS,
  type CategoryId,
} from '../lib/categories'
import { formatHashtags, parseHashtags } from '../lib/hashtags'
import type { Note, NoteInput } from '../types/note'

interface NoteFormModalProps {
  note?: Note | null
  onClose: () => void
  onSave: (input: NoteInput) => Promise<void>
}

const emptyForm: NoteInput = {
  title: '',
  content: '',
  url: '',
  category: '',
  subcategory: '',
  hashtags: [],
}

export function NoteFormModal({ note, onClose, onSave }: NoteFormModalProps) {
  const [form, setForm] = useState<NoteInput>(emptyForm)
  const [hashtagInput, setHashtagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const subcategories = form.category
    ? CATEGORIES[form.category].subcategories
    : []

  useEffect(() => {
    if (note) {
      setForm({
        title: note.title,
        content: note.content,
        url: note.url,
        category: note.category,
        subcategory: note.subcategory,
        hashtags: note.hashtags,
      })
      setHashtagInput(formatHashtags(note.hashtags))
    } else {
      setForm(emptyForm)
      setHashtagInput('')
    }
  }, [note])

  const handleCategoryChange = (category: CategoryId | '') => {
    const subcategory = category ? CATEGORIES[category].subcategories[0] : ''
    setForm({ ...form, category, subcategory })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSave({
        ...form,
        hashtags: parseHashtags(hashtagInput),
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không lưu được ghi chú.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{note ? 'Sửa ghi chú' : 'Ghi chú mới'}</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-msg">{error}</p>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Danh mục</label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value as CategoryId | '')}
              >
                <option value="">— Chọn —</option>
                {CATEGORY_IDS.map((id) => (
                  <option key={id} value={id}>
                    {CATEGORIES[id].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subcategory">Loại</label>
              <select
                id="subcategory"
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                disabled={!form.category}
              >
                <option value="">— Chọn —</option>
                {subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Tiêu đề</label>
            <input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="VD: One Piece — Tập 1089"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Nội dung ghi chú</label>
            <textarea
              id="content"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Điều gì khiến bạn thấy thú vị?"
              rows={5}
            />
          </div>

          <div className="form-group">
            <label htmlFor="hashtags">Hashtag</label>
            <input
              id="hashtags"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              placeholder="onepiece, hay, epso (cách nhau bởi dấu phẩy)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="url">Link (tuỳ chọn)</label>
            <input
              id="url"
              type="url"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Huỷ
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
