import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { scrapeDocs } from '@/lib/scraper' // Import your scraper

// Create an instance of OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

let docsContent: { tag: string; content: string }[] = []

;(async () => {
  docsContent = await scrapeDocs('https://rasa.com/docs/rasa/')
})()

export async function POST(req: NextRequest) {
  const { query } = await req.json()

  const relevantDocs = docsContent
    .filter((item) => item.content.toLowerCase().includes(query.toLowerCase()))
    .map((item) => item.content)
    .join('\n\n')

  const context =
    relevantDocs || 'No relevant documentation was found for this query.'
  const prompt = `You are a helpful assistant. Answer the following question based on this context: ${context}. The user asked: ${query}`

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  })

  return NextResponse.json({ response: completion.choices[0].message.content })
}
