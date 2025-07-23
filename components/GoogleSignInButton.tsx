"use client"

import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

interface GoogleSignInButtonProps {
  isSignUp?: boolean;
  disabled?: boolean;
}

export default function GoogleSignInButton({ isSignUp = false, disabled = false }: GoogleSignInButtonProps) {
  const { googleLogin } = useAuth();
  const { isDark } = useTheme();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log('🚀 [GOOGLE SIGN-IN] Token received from Google');
        
        // Get user info from Google using the access token
        const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`);
        const userInfo = await userInfoResponse.json();
        
        console.log('✅ [GOOGLE SIGN-IN] User info received:', userInfo);
        
        // Create a mock ID token with the user info (our backend will handle this differently)
        const mockIdToken = btoa(JSON.stringify({
          sub: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          email_verified: userInfo.verified_email,
          iss: 'accounts.google.com',
          aud: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
        }));
        
        await googleLogin(mockIdToken);
      } catch (error) {
        console.error('🚨 [GOOGLE SIGN-IN] Authentication failed:', error);
      }
    },
    onError: () => {
      console.error('🚨 [GOOGLE SIGN-IN] Google Sign-In failed');
    }
  });

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] rounded-xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
      <Button
        onClick={() => handleGoogleLogin()}
        disabled={disabled}
        className={`relative w-full ${isDark ? 'bg-white/95 hover:bg-white text-gray-900 border border-gray-200 hover:border-gray-300' : 'bg-gray-900 hover:bg-gray-800 text-white border border-gray-300 hover:border-gray-400'} transition-all duration-300 py-3 rounded-xl font-medium hover:shadow-lg disabled:opacity-50`}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {isSignUp ? "Sign up with Google" : "Continue with Google"}
      </Button>
    </div>
  );
}