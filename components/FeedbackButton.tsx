'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquare, Send, Star, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTheme } from '@/context/ThemeContext';
import { getThemeClasses } from '@/utils/theme';

interface FeedbackButtonProps {
  className?: string;
}

export default function FeedbackButton({ className }: FeedbackButtonProps) {
  const { isDark } = useTheme();
  const themeClasses = getThemeClasses(isDark);
  const pathname = usePathname();
  
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's sm breakpoint
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Check if we should hide the button (mobile + profile pages)
  const shouldHideButton = isMobile && (pathname === '/profile' || pathname?.startsWith('/profile/'));

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Please enter your feedback message');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          rating: rating || undefined,
          page_url: window.location.href,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          setSubmitted(false);
          setMessage('');
          setName('');
          setEmail('');
          setRating(0);
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to submit feedback');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= (hoveredRating || rating);
      
      return (
        <button
          key={index}
          type="button"
          className={`p-1 transition-all duration-200 ${
            isActive ? 'text-[#10a37f] scale-110' : `${themeClasses.text.secondary} hover:text-[#10a37f] hover:scale-105`
          }`}
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          <Star className={`h-5 w-5 ${isActive ? 'fill-current' : ''}`} />
        </button>
      );
    });
  };

  const backgroundGradient = isDark 
    ? 'bg-gradient-to-br from-[#1a1a1a] via-[#212121] to-[#1a1a1a]' 
    : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100';

  const errorBgClass = isDark ? 'bg-red-900/20' : 'bg-red-50';
  const errorTextClass = isDark ? 'text-red-400' : 'text-red-800';

  // Don't render the button on mobile profile pages
  if (shouldHideButton) {
    return null;
  }

  return (
    <>
      {/* Floating Feedback Button */}
      <div className={`fixed bottom-6 left-6 z-50 ${className || ''}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white shadow-xl hover:shadow-2xl rounded-full h-12 w-12 sm:h-14 sm:w-14 p-0 transition-all duration-300 hover:scale-110"
          size="lg"
        >
          <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="relative w-full max-w-md h-auto max-h-[90vh] flex flex-col border-0 rounded-2xl shadow-2xl overflow-hidden"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 50,
              minHeight: '400px',
              maxWidth: '448px', // Explicit max-width constraint
            }}
          >
            {/* Background gradients - matching platform design */}
            <div className={`absolute inset-0 ${backgroundGradient}`}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/10 via-transparent to-[#10a37f]/5"></div>
            
            {/* Decorative floating elements */}
            <div className="absolute top-10 left-8 w-20 h-20 bg-[#10a37f]/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-10 right-8 w-24 h-24 bg-[#10a37f]/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
            
            {/* Content wrapper */}
            <div className="relative z-10 w-full h-full flex flex-col min-h-0">
              {/* Header - Fixed */}
              <div className={`flex-shrink-0 flex items-center justify-between px-6 py-4 border-b ${themeClasses.border.primary}`}>
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="flex-shrink-0 p-2 rounded-xl bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] text-white">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h2 className={`text-xl font-bold ${themeClasses.text.primary} truncate`}>
                    Give Feedback
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className={`flex-shrink-0 h-8 w-8 p-0 ${themeClasses.text.secondary} hover:${themeClasses.text.primary} hover:bg-[#10a37f]/10`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
                <div className="p-6 space-y-6">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-[#10a37f]/20 animate-ping"></div>
                    </div>
                    <h3 className={`text-2xl font-bold ${themeClasses.text.primary} mb-3`}>
                      Thank you!
                    </h3>
                    <p className={`${themeClasses.text.secondary} text-lg`}>
                      Your feedback has been submitted successfully.
                    </p>
                    <p className={`${themeClasses.text.secondary} text-sm mt-2`}>
                      We appreciate your input to help improve our platform.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Rating */}
                    <div className={`p-4 rounded-xl ${themeClasses.bg.cardHover} ${themeClasses.border.primary} border`}>
                      <label className={`block text-sm font-semibold ${themeClasses.text.primary} mb-3`}>
                        Rate your experience (optional)
                      </label>
                      <div className="flex justify-center space-x-2">
                        {renderStars()}
                      </div>
                    </div>

                    {/* Message */}
                    <div className={`p-4 rounded-xl ${themeClasses.bg.cardHover} ${themeClasses.border.primary} border`}>
                      <label className={`block text-sm font-semibold ${themeClasses.text.primary} mb-3`}>
                        Your feedback *
                      </label>
                      <Textarea
                        placeholder="Tell us what you think about our platform..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className={`min-h-[100px] resize-none ${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} focus:border-[#10a37f] focus:ring-[#10a37f]/20 transition-all duration-200`}
                        maxLength={500}
                      />
                      <p className={`text-xs ${themeClasses.text.secondary} mt-2`}>
                        {message.length}/500 characters
                      </p>
                    </div>

                    {/* Name (Optional) */}
                    <div className={`p-4 rounded-xl ${themeClasses.bg.cardHover} ${themeClasses.border.primary} border`}>
                      <label className={`block text-sm font-semibold ${themeClasses.text.primary} mb-3`}>
                        Name (optional)
                      </label>
                      <Input
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full ${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} focus:border-[#10a37f] focus:ring-[#10a37f]/20 transition-all duration-200`}
                      />
                    </div>

                    {/* Email (Optional) */}
                    <div className={`p-4 rounded-xl ${themeClasses.bg.cardHover} ${themeClasses.border.primary} border`}>
                      <label className={`block text-sm font-semibold ${themeClasses.text.primary} mb-3`}>
                        Email (optional)
                      </label>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full ${themeClasses.bg.secondary} ${themeClasses.border.primary} ${themeClasses.text.primary} focus:border-[#10a37f] focus:ring-[#10a37f]/20 transition-all duration-200`}
                      />
                      <p className={`text-xs ${themeClasses.text.secondary} mt-2`}>
                        We'll only use this to follow up if needed
                      </p>
                    </div>

                    {error && (
                      <Alert className={`border-2 border-red-500/50 ${errorBgClass}`}>
                        <AlertDescription className={`${errorTextClass} font-medium`}>
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
                </div>
              </div>

              {/* Sticky Footer Actions */}
              {!submitted && (
                <div className={`flex-shrink-0 px-6 py-4 border-t ${themeClasses.border.primary} bg-gradient-to-r from-transparent via-[#10a37f]/5 to-transparent`}>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className={`flex-1 ${themeClasses.border.primary} ${themeClasses.text.secondary} hover:${themeClasses.text.primary} hover:bg-[#10a37f]/10`}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={loading || !message.trim()}
                      className={`flex-1 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] hover:from-[#0d8f6f] hover:to-[#0a7a5f] text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${loading ? 'animate-pulse' : 'hover:shadow-lg hover:scale-105'}`}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Feedback
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}