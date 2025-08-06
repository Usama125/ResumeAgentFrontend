"use client"

import { useState, useEffect, useMemo } from "react"
import React from "react"
import { Search, Users, MapPin, Star, X, Plus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import Header from "@/components/Header"
import { PublicUser, APIError } from "@/types"
import { SearchService } from "@/services/search"
import { UserService } from "@/services/user"
import { useRateLimit } from "@/hooks/useRateLimit"
import { RateLimitModal } from "@/components/RateLimitModal"
import { getImageUrl } from '@/utils/imageUtils'

// Calculate skill matching percentage
const calculateSkillMatch = (userSkills: { name: string; level: string }[] | undefined, searchQuery: string): number => {
  if (!searchQuery.trim() || !userSkills) return 100;
  
  const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
  const skillNames = userSkills.map(skill => skill.name.toLowerCase());
  
  let matchedTerms = 0;
  searchTerms.forEach(term => {
    if (skillNames.some(skill => skill.includes(term))) {
      matchedTerms++;
    }
  });
  
  return searchTerms.length > 0 ? Math.round((matchedTerms / searchTerms.length) * 100) : 0;
};

// Enhanced user interface for displaying users with match percentage
interface EnhancedPublicUser extends PublicUser {
  matchPercentage?: number;
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [allUsers, setAllUsers] = useState<PublicUser[]>([])
  const [displayedUsers, setDisplayedUsers] = useState<EnhancedPublicUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [loadMoreLoading, setLoadMoreLoading] = useState(false)
  const [hasMoreUsers, setHasMoreUsers] = useState(false)
  const [totalFetched, setTotalFetched] = useState(0)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchTotalFetched, setSearchTotalFetched] = useState(0)
  const [currentSearchQuery, setCurrentSearchQuery] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { isDark } = useTheme()
  const { showRateLimitModal, hideRateLimitModal, rateLimitState } = useRateLimit()

  // Get initial search query from URL params
  useEffect(() => {
    const queryFromUrl = searchParams.get('q')
    const filterFromUrl = searchParams.get('filter')
    
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl)
      setCurrentSearchQuery(queryFromUrl)
      setIsSearchMode(true)
    } else if (filterFromUrl) {
      setSearchQuery(filterFromUrl)
      setCurrentSearchQuery(filterFromUrl)
      setIsSearchMode(true)
    }
  }, [searchParams])

  // Fetch initial users on page load
  useEffect(() => {
    const fetchInitialUsers = async () => {
      try {
        setLoading(true)
        
        // Check if we have a search query from URL
        const queryFromUrl = searchParams.get('q')
        const filterFromUrl = searchParams.get('filter')
        const initialQuery = queryFromUrl || filterFromUrl
        
        if (initialQuery) {
          // Perform search immediately if we have a query
          await performSearch(initialQuery, false)
        } else {
          // Fetch initial users (11 users + check if more exist)
          const users = await UserService.getFeaturedUsers(12, 0, true) // Use listing_only for better performance
          
          if (users.length > 11) {
            // Show first 11 users + load more card
            setDisplayedUsers(users.slice(0, 11).map(user => ({ ...user, matchPercentage: undefined })))
            setHasMoreUsers(true)
            setTotalFetched(11)
          } else {
            // Show all users (11 or less)
            setDisplayedUsers(users.map(user => ({ ...user, matchPercentage: undefined })))
            setHasMoreUsers(false)
            setTotalFetched(users.length)
          }
        }
        
        // Store all users for search functionality
        const allUsersResponse = await UserService.getFeaturedUsers(100, 0)
        setAllUsers(allUsersResponse)
      } catch (error) {
        console.error('Error fetching users:', error)
        // Check if it's a rate limit error
        if (error && typeof error === 'object' && 'type' in error && error.type === 'RATE_LIMIT') {
          showRateLimitModal(error as APIError)
        }
        setDisplayedUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchInitialUsers()
  }, [searchParams])

  const performSearch = async (query: string, isLoadMore: boolean = false) => {
    if (!query.trim()) {
      // Reset to initial state - fetch first 11 users
      setIsSearchMode(false)
      setCurrentSearchQuery("")
      setSearchTotalFetched(0)
      setSearchLoading(true)
      try {
        const users = await UserService.getFeaturedUsers(12, 0)
        if (users.length > 11) {
          setDisplayedUsers(users.slice(0, 11).map(user => ({ ...user, matchPercentage: undefined })))
          setHasMoreUsers(true)
          setTotalFetched(11)
        } else {
          setDisplayedUsers(users.map(user => ({ ...user, matchPercentage: undefined })))
          setHasMoreUsers(false)
          setTotalFetched(users.length)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        // Check if it's a rate limit error
        if (error && typeof error === 'object' && 'type' in error && error.type === 'RATE_LIMIT') {
          showRateLimitModal(error as APIError)
        }
      } finally {
        setSearchLoading(false)
      }
      return
    }

    try {
      if (!isLoadMore) {
        setSearchLoading(true)
        setIsSearchMode(true)
        setCurrentSearchQuery(query)
        setSearchTotalFetched(0)
      } else {
        setLoadMoreLoading(true)
      }
      
      // Perform API search
      const searchResults = await SearchService.searchUsers({
        q: query,
        limit: isLoadMore ? 6 : 12,
        skip: isLoadMore ? searchTotalFetched : 0
      }, true) // Use listing_only for better performance
      
      // If API search returns results, use them with match percentage
      if (searchResults && searchResults.length > 0) {
        const usersWithMatch = searchResults.map(user => ({
          ...user,
          matchPercentage: calculateSkillMatch(user.skills, query)
        }))
        
        // Sort by match percentage (descending)
        usersWithMatch.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
        
        if (isLoadMore) {
          // Add to existing results (6 more users)
          setDisplayedUsers(prev => [...prev, ...usersWithMatch])
          setSearchTotalFetched(prev => prev + usersWithMatch.length)
          
          // Check if there are more results - if we got less than 6, we've reached the end
          if (usersWithMatch.length < 6) {
            setHasMoreUsers(false)
          } else {
            // Check if there are more results by trying to fetch one extra
            const checkMoreResults = await SearchService.searchUsers({
              q: query,
              limit: 1,
              skip: searchTotalFetched + usersWithMatch.length
            }, true) // Use listing_only for better performance
            setHasMoreUsers(checkMoreResults.length > 0)
          }
        } else {
          // Initial search - show first 11 users if we have more than 11
          if (usersWithMatch.length > 11) {
            setDisplayedUsers(usersWithMatch.slice(0, 11))
            setSearchTotalFetched(11)
            setHasMoreUsers(true)
          } else {
            setDisplayedUsers(usersWithMatch)
            setSearchTotalFetched(usersWithMatch.length)
            setHasMoreUsers(false)
          }
        }
      } else {
        // Fallback to local filtering if API doesn't return results
        if (!isLoadMore) {
          const queryTerms = query.toLowerCase().split(' ').filter(term => term.trim().length > 0)
          
          const filtered = allUsers.filter((user) => {
            // Check if all query terms match at least one field
            return queryTerms.every(term => {
              const nameMatch = user.name.toLowerCase().includes(term)
              const usernameMatch = user.username && user.username.toLowerCase().includes(term)
              const emailMatch = user.email && user.email.toLowerCase().includes(term)
              const designationMatch = user.designation && user.designation.toLowerCase().includes(term)
              const skillsMatch = user.skills && user.skills.some((skill) => skill.name.toLowerCase().includes(term))
              const locationMatch = user.location && user.location.toLowerCase().includes(term)
              
              return nameMatch || usernameMatch || emailMatch || designationMatch || skillsMatch || locationMatch
            })
          })
          
          const usersWithMatch = filtered.map(user => ({
            ...user,
            matchPercentage: calculateSkillMatch(user.skills || [], query)
          }))
          
          usersWithMatch.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
          setDisplayedUsers(usersWithMatch)
          setSearchTotalFetched(usersWithMatch.length)
          setHasMoreUsers(false)
        }
      }
    } catch (error) {
      console.error('Error searching users:', error)
      // Check if it's a rate limit error
      if (error && typeof error === 'object' && 'type' in error && error.type === 'RATE_LIMIT') {
        showRateLimitModal(error as APIError)
        return; // Don't fallback to local search on rate limit
      }
      // Fallback to local search on other errors
      if (!isLoadMore) {
        const queryTerms = query.toLowerCase().split(' ').filter(term => term.trim().length > 0)
        
        const filtered = allUsers.filter((user) => {
          // Check if all query terms match at least one field
          return queryTerms.every(term => {
            const nameMatch = user.name.toLowerCase().includes(term)
            const usernameMatch = user.username && user.username.toLowerCase().includes(term)
            const emailMatch = user.email && user.email.toLowerCase().includes(term)
            const designationMatch = user.designation && user.designation.toLowerCase().includes(term)
            const skillsMatch = user.skills && user.skills.some((skill) => skill.name.toLowerCase().includes(term))
            const locationMatch = user.location && user.location.toLowerCase().includes(term)
            
            return nameMatch || usernameMatch || emailMatch || designationMatch || skillsMatch || locationMatch
          })
        })
        
        const usersWithMatch = filtered.map(user => ({
          ...user,
          matchPercentage: calculateSkillMatch(user.skills || [], query)
        }))
        
        usersWithMatch.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
        setDisplayedUsers(usersWithMatch)
        setSearchTotalFetched(usersWithMatch.length)
        setHasMoreUsers(false)
      }
    } finally {
      if (isLoadMore) {
        setLoadMoreLoading(false)
      } else {
        setSearchLoading(false)
      }
    }
  }

  const handleSearchButtonClick = () => {
    // Clean the search query of any line breaks before searching
    const cleanQuery = searchQuery.replace(/\n/g, ' ').trim()
    if (cleanQuery !== searchQuery) {
      setSearchQuery(cleanQuery)
    }
    // Update URL with search query
    const newUrl = cleanQuery ? `/explore?q=${encodeURIComponent(cleanQuery)}` : '/explore'
    window.history.pushState({}, '', newUrl)
    performSearch(cleanQuery)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // Clean the search query of any line breaks before searching
      const cleanQuery = searchQuery.replace(/\n/g, ' ').trim()
      setSearchQuery(cleanQuery)
      // Update URL with search query
      const newUrl = cleanQuery ? `/explore?q=${encodeURIComponent(cleanQuery)}` : '/explore'
      window.history.pushState({}, '', newUrl)
      performSearch(cleanQuery)
    }
    // Allow Shift+Enter for line breaks (default behavior)
  }

  const clearSearch = () => {
    setSearchQuery("")
    // Update URL to remove query
    window.history.pushState({}, '', '/explore')
    performSearch("") // Reset to initial state
  }

  const handleLoadMore = async () => {
    if (loadMoreLoading) return
    
    if (isSearchMode) {
      // Load more search results
      await performSearch(currentSearchQuery, true)
    } else {
      // Load more regular users
      setLoadMoreLoading(true)
      try {
        // Fetch next 6 users
        const newUsers = await UserService.getFeaturedUsers(6, totalFetched, true) // Use listing_only for better performance
        
        if (newUsers.length > 0) {
          setDisplayedUsers(prev => [
            ...prev,
            ...newUsers.map(user => ({ ...user, matchPercentage: undefined }))
          ])
          setTotalFetched(prev => prev + newUsers.length)
          
          // Check if there are more users - if we got less than 6, we've reached the end
          if (newUsers.length < 6) {
            setHasMoreUsers(false)
          } else {
            // Check if there are more users by fetching one extra
            const checkMoreUsers = await UserService.getFeaturedUsers(1, totalFetched + newUsers.length, true) // Use listing_only for better performance
            setHasMoreUsers(checkMoreUsers.length > 0)
          }
        } else {
          setHasMoreUsers(false)
        }
      } catch (error) {
        console.error('Error loading more users:', error)
        // Check if it's a rate limit error
        if (error && typeof error === 'object' && 'type' in error && error.type === 'RATE_LIMIT') {
          showRateLimitModal(error as APIError)
        }
      } finally {
        setLoadMoreLoading(false)
      }
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    const query = suggestion.replace(/"/g, '') // Remove quotes
    setSearchQuery(query)
    // Update URL with filter
    window.history.pushState({}, '', `/explore?filter=${encodeURIComponent(query)}`)
    performSearch(query)
  }

  const popularSearches = ["React developers", "Product managers", "AWS certified", "UX designers", "Node.js", "Python"]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#212121] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header variant="default" />
      <RateLimitModal
        isOpen={rateLimitState.isOpen}
        onClose={hideRateLimitModal}
        message={rateLimitState.message}
        resetInSeconds={rateLimitState.resetInSeconds}
        isAuthenticated={rateLimitState.isAuthenticated}
        rateLimitType={rateLimitState.rateLimitType}
      />

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background gradients */}
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-[#1a1a1a] via-[#10a37f]/5 to-transparent' : 'bg-gradient-to-b from-white via-[#10a37f]/3 to-transparent'}`}></div>
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#10a37f]/15 via-[#10a37f]/8 to-[#10a37f]/3' : 'bg-gradient-to-br from-[#10a37f]/8 via-[#10a37f]/4 to-[#10a37f]/2'}`}></div>
          
          {/* Decorative floating elements - reduced for compact layout */}
          <div className="absolute top-10 left-10 w-16 h-16 bg-[#10a37f]/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-8 right-20 w-12 h-12 bg-[#0d8f6f]/15 rounded-full blur-lg"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="relative text-center py-6 px-4">
              <h1 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'}`}>
                Discover Amazing
                <span className="block bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] bg-clip-text text-transparent">
                  Professional Talent
                </span>
              </h1>

              {/* Search Section */}
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <div className={`relative backdrop-blur-sm rounded-xl border transition-all duration-300 shadow-lg ${isDark ? 'bg-white/10 border-white/20 hover:border-white/30 focus-within:border-white' : 'bg-black/5 border-gray-300/60 hover:border-gray-400/80 focus-within:border-[#10a37f]'}`}>
                    <div className="flex items-end pl-5 pr-3 py-2">
                      <div className="flex-1 relative">
                        <textarea
                          placeholder="Search for professionals by skills, experience, or job title..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className={`w-full bg-transparent border-0 focus:ring-0 focus:outline-none resize-none text-base leading-6 pr-4 ${isDark ? 'text-white placeholder-gray-300' : 'text-gray-900 placeholder-gray-500'}`}
                          rows={1}
                          style={{
                            minHeight: '24px',
                            maxHeight: '200px',
                            marginTop: '7px',
                            overflow: 'hidden',
                            scrollbarWidth: 'thin',
                            scrollbarColor: isDark ? 'rgba(255,255,255,0.3) transparent' : 'rgba(0,0,0,0.3) transparent'
                          }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            const scrollHeight = target.scrollHeight;
                            target.style.height = Math.min(scrollHeight, 200) + 'px';
                            target.style.overflow = scrollHeight > 200 ? 'auto' : 'hidden';
                          }}
                        />
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        {searchQuery && (
                          <button
                            onClick={clearSearch}
                            className={`p-1.5 transition-colors rounded-lg ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={handleSearchButtonClick}
                          disabled={!searchQuery.trim() || searchLoading}
                          className={`p-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                          style={{ marginBottom: '3px' }}
                        >
                          {searchLoading ? (
                            <div className={`w-4 h-4 rounded animate-pulse ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                          ) : (
                            <Search className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Popular searches: 
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 px-4 sm:px-0">
                    {popularSearches.map((suggestion) => {
                      const isActive = searchQuery.toLowerCase() === suggestion.toLowerCase();
                      return (
                        <button
                          key={suggestion}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSuggestionClick(suggestion);
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 cursor-pointer select-none outline-none focus:outline-none flex items-center justify-center text-center ${
                            isActive 
                              ? "bg-[#10a37f] text-white border-[#10a37f] shadow-lg shadow-[#10a37f]/25" 
                              : isDark
                                ? "bg-[#40414f] hover:bg-[#10a37f] text-gray-300 hover:text-white border-[#565869] hover:border-[#10a37f] active:bg-[#10a37f]"
                                : "bg-gray-200 hover:bg-[#10a37f] text-gray-700 hover:text-white border-gray-300 hover:border-[#10a37f] active:bg-[#10a37f]"
                          }`}
                          type="button"
                          style={{ cursor: 'pointer' }}
                        >
                          "{suggestion}"
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profiles Section */}
        <div className={`relative ${isDark ? 'bg-gradient-to-b from-[#10a37f]/5 via-[#10a37f]/3 to-transparent' : 'bg-gradient-to-b from-[#10a37f]/3 via-[#10a37f]/2 to-transparent'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-4">
            {/* Results Section */}
            <div className="mb-2">
              <div className="mb-8 text-center">
                <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {isSearchMode ? `Search Results${currentSearchQuery ? ` for "${currentSearchQuery}"` : ''}` : 'Featured Professionals'}
                </h3>
                <div className="w-20 h-0.5 bg-gradient-to-r from-[#10a37f] to-[#0d8f6f] mx-auto"></div>
              </div>
              
              {(loading || searchLoading) ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <Card key={index} className={`backdrop-blur-sm animate-pulse ${isDark ? 'bg-[#2f2f2f]/80 border-[#565869]/60' : 'bg-white/80 border-gray-300/60'}`}>
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                          <div className="space-y-2 w-full">
                            <div className={`h-4 rounded w-3/4 mx-auto ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                            <div className={`h-3 rounded w-1/2 mx-auto ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                            <div className={`h-3 rounded w-2/3 mx-auto ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {displayedUsers.map((user) => (
                    <Card
                      key={user.id}
                      className={`backdrop-blur-sm transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-[#10a37f]/10 hover:scale-105 ${isDark ? 'bg-[#2f2f2f]/80 border-[#565869]/60 hover:border-[#10a37f] hover:bg-[#2f2f2f]' : 'bg-white/80 border-gray-300/60 hover:border-[#10a37f] hover:bg-white'}`}
                      onClick={() => router.push(`/profile/${user.username}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className="relative">
                            <img
                              src={getImageUrl(user.profile_picture)}
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder-user.jpg";
                              }}
                            />
                            {user.is_looking_for_job && (
                              <div className={`absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 ${isDark ? 'border-[#2f2f2f]' : 'border-white'}`}></div>
                            )}
                          </div>
                          <div className="space-y-1 w-full">
                            <h3 className={`text-sm font-semibold group-hover:text-[#10a37f] transition-colors truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {user.name}
                            </h3>
                            <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user.designation}</p>
                            <div className={`flex items-center justify-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{user.location}</span>
                            </div>
                            {/* Show match percentage when search is active */}
                            {searchQuery && user.matchPercentage !== undefined && (
                              <div className="flex items-center justify-center space-x-1">
                                <Star className="w-3 h-3 text-[#10a37f]" />
                                <span className="text-xs text-[#10a37f] font-medium">
                                  {user.matchPercentage}% match
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Load More Card - Show when there are more users (both search and non-search) */}
                  {hasMoreUsers && (
                    <Card
                      className={`backdrop-blur-sm transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-[#10a37f]/10 hover:scale-105 ${isDark ? 'bg-[#2f2f2f]/80 border-[#565869]/60 hover:border-[#10a37f] hover:bg-[#10a37f]/10' : 'bg-white/80 border-gray-300/60 hover:border-[#10a37f] hover:bg-[#10a37f]/5'}`}
                      onClick={handleLoadMore}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center space-y-3 h-full justify-center">
                          {loadMoreLoading ? (
                            <>
                              <div className={`w-12 h-12 rounded-full animate-pulse ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                              <div className="space-y-1 w-full">
                                <div className={`h-4 rounded w-3/4 mx-auto animate-pulse ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                                <div className={`h-3 rounded w-1/2 mx-auto animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#10a37f]/20 to-[#0d8f6f]/20 border-2 border-[#10a37f]/50 flex items-center justify-center group-hover:border-[#10a37f] group-hover:bg-[#10a37f]/30 transition-all duration-300">
                                  <Plus className="w-6 h-6 text-[#10a37f] group-hover:text-white transition-colors duration-300" />
                                </div>
                              </div>
                              <div className="space-y-1 w-full">
                                <h3 className="text-sm font-semibold text-[#10a37f] group-hover:text-white transition-colors duration-300">
                                  Load More
                                </h3>
                                <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-500'}`}>
                                  {isSearchMode ? "More search results" : "View more profiles"}
                                </p>
                                <div className={`flex items-center justify-center text-xs transition-colors duration-300 ${isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-500'}`}>
                                  <ArrowRight className="w-3 h-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">{isSearchMode ? "Load more" : "6 more"}</span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>

            {/* Empty State */}
            {!loading && !searchLoading && displayedUsers.length === 0 && (
              <div className="text-center pt-4 pb-16">
                <div className={`rounded-2xl p-12 ${isDark ? 'bg-[#2f2f2f]/50 border-[#565869]/50' : 'bg-white/50 border-gray-300/50'} backdrop-blur-sm border`}>
                  <Users className={`w-20 h-20 mx-auto mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <h3 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>No professionals found</h3>
                  <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {searchQuery ? 'Try adjusting your search criteria or browse all available profiles.' : 'No users available at the moment.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}