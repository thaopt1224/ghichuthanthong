import type { CategoryId } from '../lib/categories'

export interface Note {
  id: string
  title: string
  content: string
  url: string
  category: CategoryId | ''
  subcategory: string
  hashtags: string[]
  createdAt: number
  updatedAt: number
}

export type NoteInput = Pick<
  Note,
  'title' | 'content' | 'url' | 'category' | 'subcategory' | 'hashtags'
>
