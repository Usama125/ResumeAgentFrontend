import { secureAPI } from '@/lib/secure-api-client';
import { ChatMessage, ChatResponse, ChatSuggestionsResponse, APIError } from '@/types';
import { ErrorHandler } from '@/utils/errorHandler';

// Chat service (HMAC secured)
export class ChatService {
  
  // Send chat message to user profile
  static async sendMessage(
    userId: string, 
    message: string, 
    token?: string
  ): Promise<ChatResponse> {
    try {
      const chatMessage: ChatMessage = { message };
      return await secureAPI.post<ChatResponse>(`/chat/${userId}`, chatMessage, token);
    } catch (error: any) {
      // If it's a rate limit error, store the info for the modal
      if (error.type === 'RATE_LIMIT' && error.rateLimitData) {
        this.storeRateLimitInfo(
          error.rateLimitData.remaining,
          Date.now() + (error.rateLimitData.resetInSeconds * 1000)
        );
      }
      throw error;
    }
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