"use client"

import { useState, useCallback, useRef } from 'react';
import { useChat } from 'ai/react';
import { ChatService } from '@/services/chat';

interface Message {
  type: 'user' | 'ai';
  content: string;
}

interface UseAIChatProps {
  profileData: any;
  context: 'self-profile' | 'recruiter';
  userId?: string;
  username?: string;
  token?: string;
  showRateLimitModal?: (error: any) => void;
}

export function useAIChat({ profileData, context, userId, username, token, showRateLimitModal }: UseAIChatProps) {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [messageCount, setMessageCount] = useState(0);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const [showMessageLimitModal, setShowMessageLimitModal] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string>('');
  const isStreamingRef = useRef(false);
  
  const MESSAGE_LIMIT = parseInt(process.env.NEXT_PUBLIC_MESSAGE_LIMIT || '20');

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleAISubmit,
    isLoading,
    setMessages,
    setInput
  } = useChat({
    api: '/api/chat/ai',
    body: {
      profileData,
      context
    },
    onResponse: (response) => {
      isStreamingRef.current = true;
      setCurrentStreamingMessage('');
    },
    onFinish: (message) => {
      // Add final AI response to chat history
      setChatHistory(prev => [...prev, {
        type: 'ai',
        content: message.content
      }]);
      setCurrentStreamingMessage('');
      isStreamingRef.current = false;
    },
    onError: (error) => {
      console.error('AI Chat error:', error);
      setChatHistory(prev => [...prev, {
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your message. Please try again.'
      }]);
      setCurrentStreamingMessage('');
      isStreamingRef.current = false;
    }
  });

  const handleSendMessage = useCallback(async (messageText?: string) => {
    const finalMessage = messageText || input;
    if (!finalMessage.trim()) return;

    // Store the pending message for potential retry
    setPendingMessage(finalMessage);

    // If already at message limit, just show the modal and message again
    if (messageCount >= MESSAGE_LIMIT) {
      setChatHistory(prev => [...prev, 
        {
          type: 'user',
          content: finalMessage
        },
        {
          type: 'ai',
          content: `You've reached the conversation limit of ${MESSAGE_LIMIT} messages. Start a new conversation to continue chatting! 💬`
        }
      ]);
      setShowMessageLimitModal(true);
      setInput(''); // Clear input field
      return;
    }

    // Priority 1: Check backend rate limiting first
    try {
      if (userId) {
        await ChatService.sendMessage(userId, finalMessage, token);
      } else if (username) {
        const response = await fetch(`/api/chat/username/${username}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ message: finalMessage })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 429) {
            // Extract the actual data from the nested detail structure
            const detail = errorData.detail || errorData;
            const message = detail.message || errorData.message || 'Rate limit reached. Please try again later.';
            
            // Add user message first, then the rate limit response
            setChatHistory(prev => [...prev, 
              {
                type: 'user',
                content: finalMessage
              },
              {
                type: 'ai',
                content: message
              }
            ]);
            
            setInput(''); // Clear input field
            
            throw { 
              type: 'RATE_LIMIT', 
              message: message,
              rateLimitData: {
                resetInSeconds: detail.reset_in_seconds || errorData.reset_in_seconds,
                isAuthenticated: detail.is_authenticated || errorData.is_authenticated,
                rateLimitType: detail.rate_limit_type || errorData.rate_limit_type || 'chat'
              }
            };
          }
          throw new Error('Rate limit check failed');
        }
      }
    } catch (error: any) {
      console.error('Rate limiting error:', error);
      
      if (error.type === 'RATE_LIMIT') {
        // For userId path, we need to show the message in chat as well
        if (userId && error.message) {
          setChatHistory(prev => [...prev, 
            {
              type: 'user',
              content: finalMessage
            },
            {
              type: 'ai',
              content: error.message
            }
          ]);
        }
        
        setInput(''); // Clear input field
        
        // Priority 1: Show rate limit modal (from backend)
        if (showRateLimitModal) {
          showRateLimitModal(error);
        }
        return;
      }
    }

    // Priority 2: Check message context limit (frontend)
    if (messageCount >= MESSAGE_LIMIT) {
      // Add user message first, then the limit response
      setChatHistory(prev => [...prev, 
        {
          type: 'user',
          content: finalMessage
        },
        {
          type: 'ai',
          content: `You've reached the conversation limit of ${MESSAGE_LIMIT} messages. Start a new conversation to continue chatting! 💬`
        }
      ]);
      
      setInput(''); // Clear input field
      setShowMessageLimitModal(true);
      return;
    }

    // All checks passed - proceed with sending message
    await sendMessageToAI(finalMessage);
  }, [input, messageCount, MESSAGE_LIMIT, userId, username, token, showRateLimitModal, setChatHistory, setInput]);

  const sendMessageToAI = useCallback(async (finalMessage: string) => {
    // Immediately add user message to chat history for instant feedback
    setChatHistory(prev => [...prev, {
      type: 'user',
      content: finalMessage
    }]);

    // Increment message count
    setMessageCount(prev => prev + 1);

    // Submit to AI immediately (this will handle the streaming response)
    const event = {
      preventDefault: () => {},
      target: { value: finalMessage }
    } as any;
    
    // Set input for AI chat
    setInput(finalMessage);
    handleAISubmit(event);
    
    // Clear input after sending
    setTimeout(() => setInput(''), 100);
  }, [setChatHistory, setMessageCount, setInput, handleAISubmit]);

  const handleNewConversation = useCallback(() => {
    setChatHistory([]);
    setMessages([]);
    setMessageCount(0);
    setInput('');
    setShowMessageLimitModal(false);
    setPendingMessage('');
  }, [setMessages, setInput]);

  const handleMessageLimitModalConfirm = useCallback(() => {
    // Just start a fresh conversation without sending the pending message
    handleNewConversation();
  }, [handleNewConversation]);

  const handleMessageLimitModalCancel = useCallback(() => {
    setShowMessageLimitModal(false);
    setPendingMessage('');
  }, []);

  const clearChat = useCallback(() => {
    handleNewConversation();
  }, [handleNewConversation]);

  // Get the latest AI message for streaming
  const latestAIMessage = messages[messages.length - 1];
  const displayedStreamingMessage = latestAIMessage?.role === 'assistant' && isStreamingRef.current 
    ? latestAIMessage.content 
    : '';

  // Create a wrapper function that matches the expected interface
  const setInputWrapper = useCallback((value: string) => {
    // Create a synthetic event object that handleInputChange expects
    const syntheticEvent = {
      target: { value }
    } as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(syntheticEvent);
  }, [handleInputChange]);

  return {
    chatHistory,
    setChatHistory,
    input,
    setInput: setInputWrapper,
    isLoading,
    handleSendMessage,
    clearChat,
    messageCount,
    messageLimit: MESSAGE_LIMIT,
    isLimitReached: messageCount >= MESSAGE_LIMIT,
    currentStreamingMessage: displayedStreamingMessage,
    isStreaming: isLoading,
    // Modal states
    showMessageLimitModal,
    handleMessageLimitModalConfirm,
    handleMessageLimitModalCancel,
    pendingMessage
  };
}