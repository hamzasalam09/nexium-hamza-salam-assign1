'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import quotesData from '@/data/quotes.json'

interface Quote {
  text: string
  author: string
}

export default function QuoteGenerator() {
  const [topic, setTopic] = useState('')
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [isLoading, setIsLoading] = useState(false)

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

  const handleTopicClick = (selectedTopic: string) => {
    setTopic(selectedTopic)
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
            <CardTitle>Enter a Topic</CardTitle>
            <CardDescription>
              Type any topic or click on a suggestion below
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
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={!topic.trim() || isLoading}
              >
                {isLoading ? 'Generating Quotes...' : 'Generate Quotes'}
              </Button>
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