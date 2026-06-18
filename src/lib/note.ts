import type { Note, NoteInput } from '../types/note'

export function normalizeNote(id: string, data: Record<string, unknown>): Note {
  const category = typeof data.category === 'string' ? data.category : ''

  return {
    id,
    title: String(data.title ?? ''),
    content: String(data.content ?? ''),
    url: String(data.url ?? ''),
    category,
    subcategory: String(data.subcategory ?? ''),
    hashtags: Array.isArray(data.hashtags)
      ? data.hashtags.map((tag) => String(tag).toLowerCase())
      : [],
    createdAt: Number(data.createdAt ?? 0),
    updatedAt: Number(data.updatedAt ?? 0),
  }
}

export function noteToCloneDraft(note: Note): NoteInput {
  return {
    title: `${note.title} (bản sao)`,
    content: note.content,
    url: note.url,
    category: note.category,
    subcategory: note.subcategory,
    hashtags: [...note.hashtags],
  }
}
