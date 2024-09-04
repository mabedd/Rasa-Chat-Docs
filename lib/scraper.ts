import axios from 'axios'
const cheerio = require('cheerio')

interface ScrapedElement {
  tag: string
  content: string
}

export async function scrapeDocs(url: string): Promise<ScrapedElement[]> {
  try {
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)

    const scrapedContent: ScrapedElement[] = []

    $('h1, h2, h3, p, pre').each((i, element) => {
      const tag = $(element).get(0)?.tagName
      const content = $(element).text().trim()

      if (tag && content) {
        scrapedContent.push({ tag, content })
      }
    })

    return scrapedContent
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error)
    return []
  }
}
