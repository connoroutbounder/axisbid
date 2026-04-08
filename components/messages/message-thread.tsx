'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { formatRelativeDate } from '@/lib/utils'

interface Message {
  id: string
  jobId: string
  senderId: string
  content: string
  createdAt: string
  sender: {
    id: string
    name: string | null
    image: string | null
  }
}

interface MessageThreadProps {
  jobId: string
}

export default function MessageThread({ jobId }: MessageThreadProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?jobId=${jobId}`)
      if (!res.ok) {
        if (res.status === 403) {
          setError('You do not have access to this conversation.')
          return
        }
        throw new Error('Failed to fetch messages')
      }
      const data = await res.json()
      setMessages(data)
      setError(null)
    } catch {
      setError('Failed to load messages.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const content = newMessage.trim()
    if (!content || sending) return

    setSending(true)
    setNewMessage('')

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, content }),
      })

      if (!res.ok) throw new Error('Failed to send message')

      const message = await res.json()
      setMessages((prev) => [...prev, message])
    } catch {
      setNewMessage(content)
      setError('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const currentUserId = session?.user?.id

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        Loading messages...
      </div>
    )
  }

  if (error && messages.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[500px] border border-gray-200 rounded-lg bg-white">
      {/* Messages area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No messages yet. Start the conversation.
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === currentUserId
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    isOwn
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 text-gray-900 border border-gray-200'
                  }`}
                >
                  <div
                    className={`text-xs font-medium mb-1 ${
                      isOwn ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {isOwn ? 'You' : message.sender.name || 'Unknown'}
                  </div>
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <div
                    className={`text-xs mt-1 ${
                      isOwn ? 'text-blue-200' : 'text-gray-400'
                    }`}
                  >
                    {formatRelativeDate(message.createdAt)}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error banner */}
      {error && messages.length > 0 && (
        <div className="px-4 py-2 bg-red-50 text-red-600 text-sm border-t border-red-100">
          {error}
        </div>
      )}

      {/* Input area */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 p-4 border-t border-gray-200"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}
