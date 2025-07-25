"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Clock, UserCheck, MessageCircle, Search, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { getThemeClasses } from '@/utils/theme';
import { useRouter } from 'next/navigation';

interface RateLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  resetInSeconds: number;
  isAuthenticated: boolean;
  rateLimitType: 'job_matching' | 'chat';
}

export function RateLimitModal({
  isOpen,
  onClose,
  message,
  resetInSeconds,
  isAuthenticated,
  rateLimitType
}: RateLimitModalProps) {
  const { isDark } = useTheme();
  const theme = getThemeClasses(isDark);
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(resetInSeconds);
  const [mounted, setMounted] = useState(false);

  // Only mount on client side to prevent SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update timeRemaining only when resetInSeconds changes (new modal open)
  useEffect(() => {
    setTimeRemaining(resetInSeconds);
  }, [resetInSeconds]);

  // Timer effect that doesn't cause component recreation
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    // Always show hours, minutes, and seconds
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  const getIcon = () => {
    if (rateLimitType === 'job_matching') {
      return (
        <div className="relative">
          <Search className="w-16 h-16 text-[#10a37f] drop-shadow-lg relative z-10" />
          <div className="absolute inset-0 bg-[#10a37f] rounded-full blur-sm opacity-30 scale-150"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full blur-md opacity-20 scale-200"></div>
        </div>
      );
    }
    return (
      <div className="relative">
        <MessageCircle className="w-16 h-16 text-[#10a37f] drop-shadow-lg relative z-10" />
        <div className="absolute inset-0 bg-[#10a37f] rounded-full blur-sm opacity-30 scale-150"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-full blur-md opacity-20 scale-200"></div>
      </div>
    );
  };

  const getUpgradeMessage = () => {
    if (isAuthenticated) {
      return null;
    }
    
    return (
      <div className={`mt-6 p-6 ${isDark ? 'bg-gradient-to-r from-[#40414f]/50 to-[#40414f]/30' : 'bg-gradient-to-r from-gray-100/50 to-gray-200/30'} backdrop-blur-sm rounded-xl border ${theme.border.secondary}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <UserCheck className="w-5 h-5 text-[#10a37f] drop-shadow-lg relative z-10" />
            <div className="absolute inset-0 bg-[#10a37f] rounded-full blur-sm opacity-30 scale-150"></div>
          </div>
          <h4 className={`font-semibold ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent' : 'text-gray-900'}`}>
            Want More? Sign Up! 🚀
          </h4>
        </div>
        <p className={`text-sm ${theme.text.secondary} mb-4`}>
          {rateLimitType === 'job_matching' 
            ? "Get 5 requests per day vs 3 for guests!"
            : "Get 15 requests per day vs 10 for guests!"
          }
        </p>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <Button
            onClick={() => {
              onClose();
              router.push('/auth');
            }}
            className="relative w-full bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#10a37f]/25 hover:scale-[1.02]"
          >
            Sign Up Now! ✨
          </Button>
        </div>
      </div>
    );
  };

  // Portal-based modal to prevent re-renders and blinking
  const modalContent = (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ 
        opacity: isOpen ? 1 : 0, 
        transition: 'opacity 200ms ease-in-out',
        backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.6)' : 'transparent'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="relative max-w-md w-full mx-4"
        style={{
          transform: isOpen ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 200ms ease-in-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-3xl blur opacity-20"></div>
        
        <div className={`relative ${theme.bg.card} backdrop-blur-sm ${theme.border.secondary} rounded-3xl overflow-hidden transition-colors duration-300`}>
          {/* Card header gradient */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#10a37f]/50 to-transparent"></div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-6 right-6 p-2 rounded-xl transition-all duration-300 ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200'} z-10`}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center pt-8 pb-6 px-8">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#10a37f]/20 text-[#10a37f] border border-[#10a37f]/30">
                ⏰ Daily Limit Reached
              </span>
            </div>
            
            <div className="flex justify-center mb-6">
              {getIcon()}
            </div>

            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent' : 'text-gray-900'}`}>
              {rateLimitType === 'job_matching' ? 'Search Limit Reached! 🎯' : 'Chat Limit Reached! 💬'}
            </h2>
            
            <p className={`${theme.text.secondary} leading-relaxed mb-6`}>
              You've reached your daily limit. Come back tomorrow for more amazing opportunities! ✨
            </p>

            {/* Status indicators */}
            <div className="space-y-4">
              <div className={`flex items-center justify-center gap-3 p-4 rounded-xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                <Clock className="w-5 h-5 text-[#10a37f]" />
                <span className={`${theme.text.primary} font-medium`}>
                  Resets in: {formatTime(timeRemaining)}
                </span>
              </div> 
            </div>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            {getUpgradeMessage()}

            <div className="mt-6">
              <Button 
                onClick={onClose} 
                variant="outline"
                className={`w-full py-3 rounded-xl transition-all duration-300 ${theme.border.secondary} hover:bg-[#10a37f]/10 hover:border-[#10a37f]/30 hover:text-[#10a37f]`}
              >
                Got it! See you tomorrow 🌅
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Only render on client side and use portal to prevent parent re-renders
  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(modalContent, document.body);
}

export default RateLimitModal;