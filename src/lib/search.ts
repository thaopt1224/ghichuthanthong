import Fuse from 'fuse.js'
import { getCategoryLabel } from './categories'
import type { CategoryId } from './categories'
import type { Note } from '../types/note'

export interface NoteFilters {
  searchQuery: string
  category: CategoryId | ''
  subcategory: string
  hashtag: string
}

const STOP_WORDS = new Set([
  'tôi', 'toi', 'mình', 'minh', 'của', 'cua', 'và', 'va', 'với', 'voi',
  'là', 'la', 'có', 'co', 'đã', 'da', 'đang', 'dang', 'một', 'mot',
  'cái', 'cai', 'này', 'nay', 'đó', 'do', 'khi', 'nào', 'nao',
  'gì', 'gi', 'ở', 'o', 'trong', 'cho', 'về', 've', 'từ', 'tu',
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'my', 'me', 'i',
  'tìm', 'tim', 'kiếm', 'kiem', 'search', 'find', 'muốn', 'muon',
  'nhớ', 'nho', 'ghi', 'chú', 'chu', 'note', 'about', 'liên', 'lien',
  'quan', 'đến', 'den', 'nào', 'nao', 'đó', 'do',
])

const SYNONYMS: Record<string, string[]> = {
  phim: ['movie', 'film', 'anime', 'series', 'tập', 'tap', 'episode', 'ep'],
  truyện: ['manga', 'novel', 'book', 'chương', 'chuong', 'chapter', 'chap'],
  tập: ['episode', 'ep', 'phim'],
  chương: ['chapter', 'chap', 'truyện'],
  anime: ['phim', 'manga'],
  manga: ['truyện', 'comic'],
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function expandKeywords(tokens: string[]): string[] {
  const expanded = new Set(tokens)
  for (const token of tokens) {
    const synonyms = SYNONYMS[token]
    if (synonyms) {
      synonyms.forEach((s) => expanded.add(s))
    }
  }
  return [...expanded]
}

export function parseNaturalQuery(query: string): string[] {
  const normalized = normalize(query)
  const tokens = normalized
    .split(/[\s,;.!?]+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t))

  return expandKeywords(tokens)
}

export function searchNotes(notes: Note[], query: string): Note[] {
  const trimmed = query.trim()
  if (!trimmed) return notes

  const keywords = parseNaturalQuery(trimmed)

  const fuse = new Fuse(notes, {
    keys: [
      { name: 'title', weight: 0.35 },
      { name: 'content', weight: 0.3 },
      { name: 'url', weight: 0.1 },
      { name: 'hashtags', weight: 0.15 },
      { name: 'subcategory', weight: 0.05 },
      {
        name: 'category',
        weight: 0.05,
        getFn: (note) => getCategoryLabel(note.category),
      },
    ],
    threshold: 0.4,
    ignoreLocation: true,
    includeScore: true,
    minMatchCharLength: 2,
  })

  if (keywords.length === 0) {
    return fuse.search(trimmed).map((r) => r.item)
  }

  const scored = new Map<string, { note: Note; score: number }>()

  for (const keyword of keywords) {
    const results = fuse.search(keyword)
    for (const result of results) {
      const existing = scored.get(result.item.id)
      const bonus = result.score != null ? 1 - result.score : 0.5
      if (existing) {
        existing.score += bonus
      } else {
        scored.set(result.item.id, { note: result.item, score: bonus })
      }
    }
  }

  const fullQueryResults = fuse.search(trimmed)
  for (const result of fullQueryResults) {
    const existing = scored.get(result.item.id)
    const bonus = (result.score != null ? 1 - result.score : 0.5) * 1.5
    if (existing) {
      existing.score += bonus
    } else {
      scored.set(result.item.id, { note: result.item, score: bonus })
    }
  }

  const minMatches = keywords.length <= 2 ? 1 : Math.ceil(keywords.length * 0.4)

  return [...scored.values()]
    .filter((entry) => entry.score >= minMatches * 0.3)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.note)
}

export function filterNotes(notes: Note[], filters: NoteFilters): Note[] {
  let result = searchNotes(notes, filters.searchQuery)

  if (filters.category) {
    result = result.filter((note) => note.category === filters.category)
  }
  if (filters.subcategory) {
    result = result.filter((note) => note.subcategory === filters.subcategory)
  }
  if (filters.hashtag) {
    result = result.filter((note) => note.hashtags.includes(filters.hashtag))
  }

  return result
}
