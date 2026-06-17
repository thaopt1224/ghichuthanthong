import { useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import { useNotes } from '../hooks/useNotes'
import { useAuth } from '../hooks/useAuth'
import { CATEGORIES, type CategoryId } from '../lib/categories'
import { filterNotes } from '../lib/search'
import { noteToCloneDraft } from '../lib/note'
import type { Note, NoteInput } from '../types/note'
import { FilterBar } from './FilterBar'
import { Logo } from './Logo'
import { NoteCard } from './NoteCard'
import { NoteFormModal } from './NoteFormModal'

export function Dashboard({ user }: { user: User }) {
  const { logout } = useAuth()
  const { notes, loading, error, addNote, updateNote, removeNote } = useNotes(user)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState<CategoryId | ''>('')
  const [subcategory, setSubcategory] = useState('')
  const [hashtag, setHashtag] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [cloneDraft, setCloneDraft] = useState<NoteInput | null>(null)

  const subcategoryOptions = useMemo(() => {
    if (!category) return []
    return CATEGORIES[category].subcategories
  }, [category])

  const hashtagOptions = useMemo(() => {
    const counts = new Map<string, number>()
    for (const note of notes) {
      for (const tag of note.hashtags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1)
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag)
  }, [notes])

  const filteredNotes = useMemo(
    () => filterNotes(notes, { searchQuery, category, subcategory, hashtag }),
    [notes, searchQuery, category, subcategory, hashtag],
  )

  const handleCategoryChange = (next: CategoryId | '') => {
    setCategory(next)
    setSubcategory('')
  }

  const clearFilters = () => {
    setCategory('')
    setSubcategory('')
    setHashtag('')
  }

  const openCreate = () => {
    setEditingNote(null)
    setCloneDraft(null)
    setModalOpen(true)
  }

  const openEdit = (note: Note) => {
    setEditingNote(note)
    setCloneDraft(null)
    setModalOpen(true)
  }

  const openClone = (note: Note) => {
    setEditingNote(null)
    setCloneDraft(noteToCloneDraft(note))
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingNote(null)
    setCloneDraft(null)
  }

  const handleSave = async (input: NoteInput) => {
    if (editingNote) {
      await updateNote(editingNote.id, input)
    } else {
      await addNote(input)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <Logo size={24} />
          <h1>Ghi Chú Thần Thông</h1>
        </div>
        <div className="header-user">
          <span>{user.email}</span>
          <button type="button" className="btn btn-ghost" onClick={logout}>
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="main">
        {error && (
          <div className="error-banner" role="alert">
            <strong>Không kết nối được dữ liệu</strong>
            <p>{error}</p>
          </div>
        )}

        <section className="search-bar">
          <div className="search-input-wrap">
            <span className="search-icon" aria-hidden>⌕</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm — VD: phim anime onepiece, truyện manga chương 10..."
              aria-label="Tìm kiếm ghi chú"
            />
          </div>
          <p className="search-hint">
            Tìm theo tiêu đề, nội dung, hashtag, danh mục và loại.
          </p>
        </section>

        <FilterBar
          category={category}
          subcategory={subcategory}
          hashtag={hashtag}
          subcategoryOptions={subcategoryOptions}
          hashtagOptions={hashtagOptions}
          onCategoryChange={handleCategoryChange}
          onSubcategoryChange={setSubcategory}
          onHashtagChange={setHashtag}
          onClear={clearFilters}
        />

        <div className="toolbar">
          <h2>
            {searchQuery || category || subcategory || hashtag
              ? `${filteredNotes.length} kết quả`
              : `${notes.length} ghi chú`}
          </h2>
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            + Ghi chú mới
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <Logo size={40} />
            <p>
              {searchQuery || category || subcategory || hashtag
                ? 'Không tìm thấy ghi chú phù hợp.'
                : 'Chưa có ghi chú nào. Hãy lưu điều thú vị đầu tiên!'}
            </p>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={openEdit}
                onClone={openClone}
                onDelete={removeNote}
                onHashtagClick={setHashtag}
              />
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <NoteFormModal
          note={editingNote}
          draft={cloneDraft}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
