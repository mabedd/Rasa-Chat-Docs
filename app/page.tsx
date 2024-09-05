'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

interface Message {
  text: string
  sender: 'user' | 'bot'
}

export default function Chat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello! How can I assist you today?', sender: 'bot' },
  ])
  const [isTyping, setIsTyping] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const userMessage: Message = { text: input, sender: 'user' }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    setIsTyping(true)

    // Send user query to the API
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: input }),
    })
    const data = await res.json()

    setTimeout(() => {
      const botMessage: Message = { text: data.response, sender: 'bot' }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 2000) // Simulates bot "thinking" delay
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black'>
      <Card className='w-full max-w-2xl p-6 shadow-lg rounded-lg bg-gray-900 flex flex-col h-[80vh] border border-gray-700'>
        <CardContent className='flex-grow overflow-y-auto space-y-4'>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-200'
                } p-3 rounded-lg max-w-xs shadow-lg`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className='flex justify-start'>
              <div className='bg-gray-700 text-gray-200 p-3 rounded-lg max-w-xs shadow-lg'>
                Typing...
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className='flex-none'>
          <form onSubmit={handleSubmit} className='flex space-x-4 w-full'>
            <Input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Type your message...'
              className='flex-grow p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <Button
              type='submit'
              className='bg-blue-600 text-white rounded py-2 px-4 hover:bg-blue-700 transition-all shadow-lg'
            >
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
