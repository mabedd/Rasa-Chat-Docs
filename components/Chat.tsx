'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function Chat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [
      {
        role: 'system',
        content: 'Welcome! How can I assist you today with Rasa?',
      },
    ]
  )
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message to the chat
    setMessages((prev) => [...prev, { role: 'user', content: input }])
    setInput('')
    setLoading(true)

    // Send request to the API
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: input }),
    })

    const data = await res.json()
    setMessages((prev) => [...prev, { role: 'bot', content: data.response }])
    setLoading(false)
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-secondary text-accent'>
      <Card className='w-full max-w-lg p-6 shadow-lg rounded-lg'>
        <h2 className='text-2xl font-semibold text-primary text-center mb-4'>
          Rasa Docs Chatbot
        </h2>

        <div className='h-96 overflow-y-auto bg-white p-4 rounded-lg shadow-inner mb-4'>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`my-2 ${
                msg.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <p
                className={`inline-block p-2 rounded-md ${
                  msg.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.content}
              </p>
            </div>
          ))}

          {loading && (
            <motion.div
              className='my-2 text-left'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className='inline-block p-2 rounded-md bg-gray-100 text-gray-800'>
                Typing...
              </p>
            </motion.div>
          )}
        </div>

        <form onSubmit={handleSubmit} className='flex space-x-2'>
          <Input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Ask a question...'
            className='flex-grow p-2 border rounded'
          />
          <Button
            type='submit'
            className='bg-primary text-white px-4 py-2 rounded-md'
          >
            Send
          </Button>
        </form>
      </Card>
    </div>
  )
}
