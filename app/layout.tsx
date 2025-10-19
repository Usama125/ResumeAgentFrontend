import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { SettingsProvider } from '@/context/SettingsContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from "@/components/ui/toaster"
import GlobalSettingsModal from '@/components/GlobalSettingsModal'

export const metadata: Metadata = {
  title: 'AI Resume Builder',
  description: 'AI-powered professional profiles and talent discovery platform',
  generator: 'Next.js',
  icons: {
    icon: '/logo_updated.png',
    shortcut: '/logo_updated.png',
    apple: '/logo_updated.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    localStorage.setItem('theme', theme);
                  }
                  document.documentElement.className = theme;
                } catch (e) {
                  document.documentElement.className = 'dark';
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <ThemeProvider>
            <AuthProvider>
              <SettingsProvider>
                {children}
                <GlobalSettingsModal />
                <Toaster />
              </SettingsProvider>
            </AuthProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
