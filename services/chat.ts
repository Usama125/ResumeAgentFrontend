import { secureAPI } from '@/lib/secure-api-client';
import { ChatMessage, ChatResponse, ChatSuggestionsResponse } from '@/types';

// Chat service (HMAC secured)
export class ChatService {
  
  // Send chat message to user profile
  static async sendMessage(
    userId: string, 
    message: string, 
    token?: string
  ): Promise<ChatResponse> {
    const chatMessage: ChatMessage = { message };
    return secureAPI.post<ChatResponse>(`/chat/${userId}`, chatMessage, token);
  }

  // Get suggestion chips for user
  static async getSuggestions(
    userId: string, 
    token?: string
  ): Promise<ChatSuggestionsResponse> {
    return secureAPI.get<ChatSuggestionsResponse>(`/chat/suggestions/${userId}`, token);
  }

  // Rate limiting info (if needed)
  static getRateLimitInfo(): { remaining: number; resetTime: number } | null {
    if (typeof window === 'undefined') return null;
    
    const limitInfo = localStorage.getItem('chat_rate_limit');
    return limitInfo ? JSON.parse(limitInfo) : null;
  }

  // Store rate limiting info
  static storeRateLimitInfo(remaining: number, resetTime: number): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('chat_rate_limit', JSON.stringify({
      remaining,
      resetTime
    }));
  }
}

export default ChatService;