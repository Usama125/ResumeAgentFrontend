"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Sparkles, CheckCircle, Trash2, Copy } from 'lucide-react'
import { PublicUser } from '@/types'

interface PublicChatPanelProps {
  user: PublicUser
  chatHistory: Array<{ type: "user" | "ai"; content: string }>
  setChatHistory: (history: Array<{ type: "user" | "ai"; content: string }>) => void
  suggestedQuestions: string[]
  message: string
  setMessage: (message: string) => void
  isLoading: boolean
  handleSendMessage: (messageText?: string) => Promise<void>
  className?: string
}

export function PublicChatPanel({
  user,
  chatHistory,
  setChatHistory,
  suggestedQuestions,
  message,
  setMessage,
  isLoading,
  handleSendMessage,
  className
}: PublicChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [localMessage, setLocalMessage] = useState('')
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])
  
  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (localMessage.trim()) {
      setMessage(localMessage)
      handleSendMessage(localMessage)
      setLocalMessage('')
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }
  
  const selectSuggestion = (suggestion: string) => {
    setLocalMessage(suggestion)
    inputRef.current?.focus()
  }
  
  const clearChat = () => {
    setChatHistory([])
  }
  
  const firstName = user.name.split(' ')[0]
  
  return (
    <div className={`flex flex-col h-full relative ${className || ''}`}>
      {/* Background matching profile view */}
      <div className="absolute inset-0 bg-gray-50 dark:bg-[#212121]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/5 via-transparent to-[#10a37f]/10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#10a37f]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0d8f6f]/5 rounded-full blur-2xl"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#10a37f] to-[#0d8f6f]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Chat with {firstName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ask about their experience and skills
                </p>
              </div>
            </div>
            
            {chatHistory.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.length === 0 ? (
            <div className="space-y-6 py-8 text-center md:text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#10a37f] to-[#0d8f6f] flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Learn About {firstName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-sm">
                  Ask questions about their experience, skills, projects, or availability for work opportunities.
                </p>
              </div>
              
              {/* Quick Start Options */}
              <div className="space-y-3 text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Try these to get started:
                </p>
                <div className="grid gap-2 w-full">
                  {suggestedQuestions.slice(0, 4).map((option, index) => (
                    <div
                      key={index}
                      onClick={() => selectSuggestion(option)}
                      className="flex items-center justify-start p-3 text-sm text-left bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg hover:from-[#10a37f]/10 hover:to-[#0d8f6f]/10 dark:hover:from-[#10a37f]/20 dark:hover:to-[#0d8f6f]/20 transition-all duration-200 border border-gray-200 dark:border-gray-600 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10a37f]/20 to-[#0d8f6f]/20 flex items-center justify-center mr-3 flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-[#10a37f]" />
                      </div>
                      <span className="text-gray-900 dark:text-white text-left">
                        {option.length > 50 ? option.substring(0, 50) + '...' : option}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {chatHistory.map((chat, index) => (
                <div key={index} className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}>
                  {chat.type === 'user' ? (
                    <div className="max-w-[80%] bg-gradient-to-r from-[#10a37f]/80 to-[#0d8f6f]/80 text-white rounded-lg px-4 py-2 shadow-lg shadow-[#10a37f]/25">
                      <p className="text-sm whitespace-pre-wrap">{chat.content}</p>
                    </div>
                  ) : (
                    <div className="max-w-[85%] space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#10a37f] to-[#0d8f6f] flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3">
                          <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                            {chat.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#10a37f] to-[#0d8f6f] flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-sm text-gray-500">Processing...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={localMessage}
                onChange={(e) => setLocalMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask about ${firstName}'s experience, skills, or availability...`}
                className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 pr-12 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px] max-h-[120px]"
                disabled={isLoading}
                rows={2}
              />
              
              <Button
                type="submit"
                disabled={!localMessage.trim() || isLoading}
                size="sm"
                className="absolute bottom-2 right-2 w-8 h-8 p-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white"
              >
                {isLoading ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Press Enter to send, Shift+Enter for new line</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}