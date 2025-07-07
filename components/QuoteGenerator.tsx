'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import quotesData from '@/data/quotes.json'

interface Quote {
  text: string
  author: string
}

export default function QuoteGenerator() {
  const [topic, setTopic] = useState('')
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copyingIndex, setCopyingIndex] = useState<number | null>(null)

  const availableTopics = Object.keys(quotesData)

  const generateQuotes = () => {
    if (!topic.trim()) return

    setIsLoading(true)
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const topicKey = topic.toLowerCase().trim()
      const availableQuotes = quotesData[topicKey as keyof typeof quotesData] || []
      
      if (availableQuotes.length === 0) {
        // If exact topic not found, search in all categories
        const allQuotes: Quote[] = []
        Object.values(quotesData).forEach(categoryQuotes => {
          allQuotes.push(...categoryQuotes)
        })
        
        // Filter quotes that contain the topic keyword
        const filteredQuotes = allQuotes.filter(quote => 
          quote.text.toLowerCase().includes(topicKey) || 
          quote.author.toLowerCase().includes(topicKey)
        )
        
        if (filteredQuotes.length > 0) {
          // Get random 3 quotes from filtered results
          const shuffled = [...filteredQuotes].sort(() => 0.5 - Math.random())
          setQuotes(shuffled.slice(0, 3))
        } else {
          // If no matches found, show quotes from a random category
          const categories = Object.keys(quotesData)
          const randomCategory = categories[Math.floor(Math.random() * categories.length)]
          const randomQuotes = quotesData[randomCategory as keyof typeof quotesData]
          const shuffled = [...randomQuotes].sort(() => 0.5 - Math.random())
          setQuotes(shuffled.slice(0, 3))
        }
      } else {
        // Get random 3 quotes from the exact topic match
        const shuffled = [...availableQuotes].sort(() => 0.5 - Math.random())
        setQuotes(shuffled.slice(0, 3))
      }
      
      setIsLoading(false)
    }, 800)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    generateQuotes()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && topic.trim()) {
      generateQuotes()
    }
  }

  const handleTopicClick = (selectedTopic: string) => {
    setTopic(selectedTopic)
  }

  const clearResults = () => {
    setTopic('')
    setQuotes([])
    toast.info('Results cleared!', {
      description: 'Ready to generate new quotes',
      duration: 2000,
    })
  }

  const copyToClipboard = async (text: string, author: string, index: number) => {
    const quoteText = `"${text}" - ${author}`
    setCopyingIndex(index)
    
    try {
      await navigator.clipboard.writeText(quoteText)
      toast.success('Quote copied to clipboard!', {
        description: `"${text.slice(0, 50)}${text.length > 50 ? '...' : ''}"`,
        duration: 3000,
      })
    } catch (err) {
      toast.error('Failed to copy quote', {
        description: 'Please try again or copy manually',
        duration: 4000,
      })
    } finally {
      setCopyingIndex(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quote Generator</h1>
          <p className="text-lg text-gray-600">Get inspired with quotes tailored to your topic</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter a Topic</CardTitle>          <CardDescription>
            Type any topic or click on a suggestion below. Press Enter to generate quotes quickly!
          </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  type="text"
                  placeholder="e.g., motivation, success, inspiration..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm text-gray-600">Popular Topics:</Label>
                <div className="flex flex-wrap gap-2">
                  {availableTopics.map((topicName) => (
                    <Badge
                      key={topicName}
                      variant="secondary"
                      className="cursor-pointer hover:bg-blue-100 transition-colors capitalize"
                      onClick={() => handleTopicClick(topicName)}
                    >
                      {topicName}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={!topic.trim() || isLoading}
                >
                  {isLoading ? 'Generating Quotes...' : 'Generate Quotes'}
                </Button>
                {(quotes.length > 0 || topic.trim()) && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={clearResults}
                    disabled={isLoading}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {quotes.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 text-center">
              Quotes for "{topic}"
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quotes.map((quote, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <blockquote className="text-lg text-gray-700 mb-4 flex-grow">
                      "{quote.text}"
                    </blockquote>
                    <cite className="text-sm font-semibold text-gray-500 text-right">
                      — {quote.author}
                    </cite>
                    <Button 
                      variant="outline" 
                      className="mt-4" 
                      onClick={() => copyToClipboard(quote.text, quote.author, index)}
                      disabled={copyingIndex === index}
                    >
                      {copyingIndex === index ? 'Copying...' : 'Copy Quote'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}