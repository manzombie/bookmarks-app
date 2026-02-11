'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

type Bookmark = {
  id: string
  url: string
  title: string | null
  description: string | null
  tags: string[] | null
  created_at: string
}

export default function Bookmarks({ user }: { user: User }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [newUrl, setNewUrl] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookmarks()
  }, [])

  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setBookmarks(data)
    }
    setLoading(false)
  }

  const addBookmark = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUrl.trim()) return

    const { error } = await supabase.from('bookmarks').insert({
      url: newUrl,
      user_id: user.id,
    })

    if (!error) {
      setNewUrl('')
      fetchBookmarks()
    }
  }

  const deleteBookmark = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
    fetchBookmarks()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bookmarks</h1>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Sign Out
        </button>
      </div>

      <form onSubmit={addBookmark} className="mb-8 flex gap-2">
        <input
          type="url"
          placeholder="Paste a URL..."
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : bookmarks.length === 0 ? (
        <p className="text-gray-500">No bookmarks yet. Add your first one!</p>
      ) : (
        <ul className="space-y-3">
          {bookmarks.map((bookmark) => (
            <li
              key={bookmark.id}
              className="p-4 bg-white rounded-lg shadow-sm border flex justify-between items-start"
            >
              <div className="flex-1 min-w-0">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {bookmark.title || bookmark.url}
                </a>
                {bookmark.description && (
                  <p className="text-sm text-gray-500 mt-1">{bookmark.description}</p>
                )}
                {bookmark.tags && bookmark.tags.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {bookmark.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => deleteBookmark(bookmark.id)}
                className="ml-4 text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
