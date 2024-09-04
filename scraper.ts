import axios from 'axios'
const cheerio = require('cheerio') // CommonJS require

interface ScrapedElement {
  tag: string
  content: string
}

async function scrapeDocs(url: string): Promise<ScrapedElement[]> {
  try {
    const { data } = await axios.get(url)
    const $ = cheerio.load(data) // Properly use cheerio.load

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

// Test scraping function
;(async () => {
  const docsUrl = 'https://rasa.com/docs/rasa/'
  const content = await scrapeDocs(docsUrl)
  console.log(content)
})()
