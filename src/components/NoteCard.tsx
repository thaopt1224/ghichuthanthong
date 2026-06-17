import { getCategoryLabel } from '../lib/categories'
import type { Note } from '../types/note'

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
  onHashtagClick?: (tag: string) => void
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function NoteCard({ note, onEdit, onDelete, onHashtagClick }: NoteCardProps) {
  const handleDelete = () => {
    if (window.confirm('Xoá ghi chú này?')) {
      onDelete(note.id)
    }
  }

  const hasMeta = note.category || note.subcategory || note.hashtags.length > 0

  return (
    <article className="note-card">
      <div className="note-card-header">
        <h3>{note.title}</h3>
        <time className="note-date" dateTime={new Date(note.updatedAt).toISOString()}>
          {formatDate(note.updatedAt)}
        </time>
      </div>

      {hasMeta && (
        <div className="note-meta">
          {note.category && (
            <span className="badge badge-category">{getCategoryLabel(note.category)}</span>
          )}
          {note.subcategory && (
            <span className="badge badge-subcategory">{note.subcategory}</span>
          )}
          {note.hashtags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="badge badge-hashtag"
              onClick={() => onHashtagClick?.(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {note.content && <p className="note-content">{note.content}</p>}

      {note.url && (
        <a className="note-link" href={note.url} target="_blank" rel="noopener noreferrer">
          ↗ {note.url}
        </a>
      )}

      <div className="note-actions">
        <button type="button" className="btn btn-ghost" onClick={() => onEdit(note)}>
          Sửa
        </button>
        <button type="button" className="btn btn-danger" onClick={handleDelete}>
          Xoá
        </button>
      </div>
    </article>
  )
}
