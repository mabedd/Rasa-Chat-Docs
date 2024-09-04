'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export default function Chat() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Send user query to the API
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: input }),
    })
    const data = await res.json()
    setResponse(data.response)
    setInput('')
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gray-50'>
      <Card className='w-full max-w-lg p-6 shadow-lg rounded-lg'>
        <h2 className='text-2xl font-semibold mb-4 text-center'>
          Ask the Docs Chatbot
        </h2>
        <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
          <Input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Ask a question...'
            className='p-2 border rounded'
          />
          <Button
            type='submit'
            className='w-full bg-blue-500 text-white rounded py-2'
          >
            Ask
          </Button>
        </form>

        {response && (
          <CardContent className='mt-6 p-4 border rounded bg-gray-100'>
            <p>{response}</p>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
