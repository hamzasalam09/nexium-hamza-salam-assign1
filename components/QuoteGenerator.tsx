'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative">
      {/* Modern background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto py-12 relative z-10">
        {/* Modern header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 mb-8 shadow-2xl">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-7xl font-extrabold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6 tracking-tight">
            QuoteGenie
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Discover profound wisdom and inspiration. Generate personalized quotes that resonate with your soul.
          </p>
        </div>

        {/* Modern glassmorphism card */}
        <Card className="mb-12 backdrop-blur-2xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm">
            <CardTitle className="text-3xl font-bold text-white mb-3">What moves you?</CardTitle>
            <CardDescription className="text-slate-300 text-lg">
              Enter a topic or select from our curated suggestions. Press Enter for instant inspiration!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="topic" className="text-white font-semibold text-lg">Your Topic</Label>
                <Input
                  id="topic"
                  type="text"
                  placeholder="motivation, wisdom, love, success..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="text-xl bg-white/10 border-white/20 text-white placeholder:text-white/40 backdrop-blur-sm focus:bg-white/20 transition-all duration-300 h-14 rounded-2xl px-6"
                />
              </div>
              
              <div className="space-y-6">
                <Label className="text-white/90 font-semibold text-lg">Popular Topics:</Label>
                <div className="flex flex-wrap gap-4">
                  {availableTopics.map((topicName) => (
                    <Badge
                      key={topicName}
                      variant="secondary"
                      className="cursor-pointer bg-gradient-to-r from-white/10 to-white/15 hover:from-white/20 hover:to-white/25 text-white border-white/20 transition-all duration-300 hover:scale-110 capitalize px-6 py-3 text-base font-semibold rounded-full shadow-lg"
                      onClick={() => handleTopicClick(topicName)}
                    >
                      {topicName}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Separator className="bg-white/20 my-8" />
              
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-2xl text-lg" 
                  disabled={!topic.trim() || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Magic...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Quotes
                    </div>
                  )}
                </Button>
                {(quotes.length > 0 || topic.trim()) && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={clearResults}
                    disabled={isLoading}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 px-8 rounded-2xl font-semibold"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Generating wisdom on "{topic}"...
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full shadow-lg animate-pulse"></div>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((index) => (
                <Card 
                  key={index} 
                  className="h-full backdrop-blur-2xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl overflow-hidden"
                >
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="flex-grow space-y-6">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="space-y-3">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-5/6" />
                        <Skeleton className="h-6 w-4/6" />
                        <Skeleton className="h-6 w-3/6" />
                      </div>
                    </div>
                    <div className="mt-8 space-y-6">
                      <div className="border-t border-white/20 pt-6">
                        <Skeleton className="h-6 w-40 ml-auto" />
                      </div>
                      <Skeleton className="h-12 w-full rounded-2xl" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Modern quotes display */}
        {quotes.length > 0 && !isLoading && (
          <div className="space-y-12">
            <div className="text-center animate-in fade-in slide-in-from-top-4 duration-700">
              <h2 className="text-4xl font-bold text-white mb-4">
                Wisdom on "{topic}"
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full shadow-lg"></div>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {quotes.map((quote, index) => (
                <Card 
                  key={index} 
                  className="group h-full backdrop-blur-2xl bg-white/5 border border-white/10 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-[1.03] rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700"
                  style={{ 
                    animationDelay: `${index * 200}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="flex-grow space-y-6">
                      <div className="text-purple-300/60 text-8xl font-serif leading-none">"</div>
                      <blockquote className="text-xl text-white/95 leading-relaxed font-medium -mt-6 pl-4">
                        {quote.text}
                      </blockquote>
                    </div>
                    <div className="mt-8 space-y-6">
                      <cite className="text-purple-200/90 font-bold text-lg text-right block border-t border-white/20 pt-6">
                        — {quote.author}
                      </cite>
                      <Button 
                        variant="outline" 
                        className="w-full bg-white/5 border-white/20 text-white hover:bg-white/15 transition-all duration-300 group-hover:shadow-xl rounded-2xl py-3 font-semibold text-base" 
                        onClick={() => copyToClipboard(quote.text, quote.author, index)}
                        disabled={copyingIndex === index}
                      >
                        {copyingIndex === index ? (
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                            Copying...
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Quote
                          </div>
                        )}
                      </Button>
                    </div>
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