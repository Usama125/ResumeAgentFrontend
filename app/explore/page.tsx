"use client"

import { useState, useEffect, useMemo } from "react"
import React from "react"
import { Search, Users, MapPin, Star, X, Plus, ArrowRight, Sparkles, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import Header from "@/components/Header"
import { PublicUser, APIError } from "@/types"
import { algoliaSearchService } from "@/services/algolia-search"
import { UserService } from "@/services/user"
import { useRateLimit } from "@/hooks/useRateLimit"
import { RateLimitModal } from "@/components/RateLimitModal"
import { getImageUrl } from '@/utils/imageUtils'
import ProfessionalAnalysisModal from "@/components/ProfessionalAnalysisModal"
import { GradientAvatar } from '@/components/ui/avatar'
import ExploreFilters, { FilterState } from "@/components/ExploreFilters"
import Footer from "@/components/Footer"

// Calculate skill matching percentage
const calculateSkillMatch = (userSkills: { name: string; level: string }[] | string[] | undefined, searchQuery: string): number => {
  if (!searchQuery.trim() || !userSkills || userSkills.length === 0) return 100;
  
  const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
  
  // Handle both formats: objects with name property or string arrays (from Algolia)
  const skillNames = userSkills.map(skill => {
    if (typeof skill === 'string') {
      return skill.toLowerCase();
    } else if (skill && typeof skill === 'object' && 'name' in skill) {
      return skill.name.toLowerCase();
    }
    return '';
  }).filter(name => name.length > 0);
  
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
  const [displayedUsers, setDisplayedUsers] = useState<EnhancedPublicUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [loadMoreLoading, setLoadMoreLoading] = useState(false)
  const [hasMoreUsers, setHasMoreUsers] = useState(false)
  const [totalFetched, setTotalFetched] = useState(0)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchTotalFetched, setSearchTotalFetched] = useState(0)
  const [currentSearchQuery, setCurrentSearchQuery] = useState("")
  const [isProfessionalAnalysisModalOpen, setIsProfessionalAnalysisModalOpen] = useState(false)
  const [selectedUserForAnalysis, setSelectedUserForAnalysis] = useState<{ id: string; name: string; designation?: string } | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    locations: [],
    professions: [],
    skills: []
  })
  const [availableFilterOptions, setAvailableFilterOptions] = useState<{
    locations: Array<{value: string, label: string, count: number}>;
    professions: Array<{value: string, label: string, count: number}>;
    skills: Array<{value: string, label: string, count: number}>;
  }>({
    locations: [],
    professions: [],
    skills: []
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { isDark } = useTheme()
  const { showRateLimitModal, hideRateLimitModal, rateLimitState } = useRateLimit()

  // Load filter options on mount and expose debug function
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const facets = await algoliaSearchService.getFacets()
        setAvailableFilterOptions({
          locations: facets.locations.map(f => ({ value: f.value, label: f.value, count: f.count })),
          professions: facets.professions.map(f => ({ value: f.value, label: f.value, count: f.count })),
          skills: facets.skills.map(f => ({ value: f.value, label: f.value, count: f.count }))
        })
      } catch (error) {
        console.error('Error loading filter options:', error)
      }
    }

    // Expose debug function to global window for manual testing
    if (typeof window !== 'undefined') {
      (window as any).algoliaDebugTest = () => algoliaSearchService.manualDebugTest()
      console.log('🔧 Debug function exposed: Run algoliaDebugTest() in console to test search scenarios')
    }

    loadFilterOptions()
  }, [])

  // Fetch initial users on page load and handle URL params
  useEffect(() => {
    let isMounted = true
    
    const fetchInitialUsers = async () => {
      try {
        if (!isMounted) return
        setLoading(true)
        
        // Test Algolia connection first (for debugging)
        try {
          if (isMounted) {
            await algoliaSearchService.testConnection()
          }
        } catch (error) {
          console.warn('⚠️ [EXPLORE] Algolia connection test failed:', error)
          // Continue with normal operation even if test fails
        }
        
        // Check if we have a search query from URL
        const queryFromUrl = searchParams.get('q')
        const filterFromUrl = searchParams.get('filter')
        const initialQuery = queryFromUrl || filterFromUrl
        
        if (initialQuery) {
          if (!isMounted) return
          // Set search state first
          setSearchQuery(initialQuery)
          setCurrentSearchQuery(initialQuery)
          setIsSearchMode(true)
          
          // Perform search with the query from URL
          if (isMounted) {
            await performSearch(initialQuery, false)
          }
        } else {
          if (!isMounted) return
          // Reset search state for non-search pages
          setSearchQuery("")
          setCurrentSearchQuery("")
          setIsSearchMode(false)
          
          // Fetch initial 24 users using Algolia with filters
          console.log('🔍 [EXPLORE] Calling getAllUsers(24, 0)...')
          const searchResponse = await algoliaSearchService.searchUsers({
            q: '',
            limit: 24,
            page: 0,
            advancedFilters: {
              locations: filters.locations,
              professions: filters.professions,
              skills: filters.skills,
              minProfileScore: filters.minProfileScore,
              is_looking_for_job: filters.is_looking_for_job
            }
          })
          console.log('🔍 [EXPLORE] getAllUsers response:', {
            hitsLength: searchResponse.hits.length,
            total: searchResponse.total,
            pages: searchResponse.pages
          })
          
          // Sort initial users by profile_score descending (highest first)
          const sortedUsers = searchResponse.hits
            .map(user => ({ ...user, matchPercentage: undefined }))
            .sort((a, b) => (b.profile_score || 0) - (a.profile_score || 0))
          
          if (isMounted) {
            setDisplayedUsers(sortedUsers)
            setTotalFetched(sortedUsers.length)
            
            // Check if there are more users available (if we got 24 users and there are more pages)
            setHasMoreUsers(searchResponse.total > 24 && searchResponse.pages > 1)
          }
          
          console.log('🔍 [EXPLORE] Final state:', {
            displayedUsersLength: searchResponse.hits.length,
            totalFetched: searchResponse.hits.length,
            hasMoreUsers: searchResponse.total > 24 && searchResponse.pages > 1
          })
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        // Check if it's a rate limit error
        if (error && typeof error === 'object' && 'type' in error && error.type === 'RATE_LIMIT') {
          showRateLimitModal(error as APIError)
        }
        if (isMounted) {
          setDisplayedUsers([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchInitialUsers()
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false
    }
  }, [searchParams])

  // Re-fetch when filters change
  useEffect(() => {
    const hasActiveFilters = Object.values(filters).some(value => {
      if (Array.isArray(value)) return value.length > 0
      return value !== undefined
    })

    if (hasActiveFilters || isSearchMode) {
      performSearch(currentSearchQuery || searchQuery, false)
    }
  }, [filters])

  const performSearch = async (query: string, isLoadMore: boolean = false) => {
    const hasActiveFilters = Object.values(filters).some(value => {
      if (Array.isArray(value)) return value.length > 0
      return value !== undefined
    })

    // Determine if we're in search/filter mode
    const isSearchOrFilterMode = Boolean(query.trim() || hasActiveFilters)
    
    if (!isSearchOrFilterMode) {
      // Reset to initial state - fetch first 24 users sorted by profile_score (no filters, no search)
      setIsSearchMode(false)
      setCurrentSearchQuery("")
      setSearchTotalFetched(0)
      setSearchLoading(true)
      try {
        // Fetch initial 24 users with no filters
        const searchResponse = await algoliaSearchService.searchUsers({
          q: '',
          limit: 24,
          page: 0
        })
        
        // Sort reset users by profile_score descending (highest first)
        const sortedUsers = searchResponse.hits
          .map(user => ({ ...user, matchPercentage: undefined }))
          .sort((a, b) => (b.profile_score || 0) - (a.profile_score || 0))
        
        setDisplayedUsers(sortedUsers)
        setTotalFetched(sortedUsers.length)
        setHasMoreUsers(searchResponse.total > 24 && searchResponse.pages > 1)
      } catch (error) {
        console.error('Error fetching users:', error)
        // Check if it's a rate limit error
        if (error && typeof error === 'object' && 'type' in error && error.type === 'RATE_LIMIT') {
          showRateLimitModal(error as APIError)
        }
        setDisplayedUsers([])
      } finally {
        setSearchLoading(false)
      }
      return
    }

    try {
      if (!isLoadMore) {
        setSearchLoading(true)
        setIsSearchMode(isSearchOrFilterMode)
        setCurrentSearchQuery(query)
        setSearchTotalFetched(0)
      } else {
        setLoadMoreLoading(true)
      }
      
      // Calculate the page for Algolia
      const pageSize = isLoadMore ? 5 : 24
      const currentPage = isLoadMore ? Math.floor(searchTotalFetched / 5) : 0
      
      // Perform Algolia search with pagination and filters
      const searchResponse = await algoliaSearchService.searchUsers({
        q: query,
        limit: pageSize,
        page: currentPage,
        advancedFilters: {
          locations: filters.locations,
          professions: filters.professions,
          skills: filters.skills,
          minProfileScore: filters.minProfileScore,
          is_looking_for_job: filters.is_looking_for_job
        }
      })
      
      console.log('🔍 [EXPLORE] Search with query + filters:', {
        query: query,
        filters: filters,
        resultsCount: searchResponse.hits.length,
        total: searchResponse.total
      })
      
      if (searchResponse && searchResponse.hits.length > 0) {
        const usersWithMatch = searchResponse.hits.map(user => ({
          ...user,
          matchPercentage: calculateSkillMatch(user.skills, query)
        }))
        
        if (isLoadMore) {
          // Add to existing results and maintain global sort order
          setDisplayedUsers(prev => {
            const combined = [...prev, ...usersWithMatch]
            // Sort by profile_score descending (highest first) to maintain global sort order
            return combined.sort((a, b) => (b.profile_score || 0) - (a.profile_score || 0))
          })
          setSearchTotalFetched(prev => prev + usersWithMatch.length)
          
          // Check if there are more results
          setHasMoreUsers(currentPage + 1 < searchResponse.pages)
        } else {
          // Initial search results - sort by profile_score descending
          const sortedUsers = usersWithMatch.sort((a, b) => (b.profile_score || 0) - (a.profile_score || 0))
          setDisplayedUsers(sortedUsers)
          setSearchTotalFetched(sortedUsers.length)
          setHasMoreUsers(searchResponse.pages > 1)
        }
      } else {
        // No results found
        if (!isLoadMore) {
          setDisplayedUsers([])
          setSearchTotalFetched(0)
          setHasMoreUsers(false)
        }
      }
    } catch (error) {
      console.error('Error searching users:', error)
      // Check if it's a rate limit error
      if (error && typeof error === 'object' && 'type' in error && error.type === 'RATE_LIMIT') {
        showRateLimitModal(error as APIError)
        return
      }
      
      // On error, show empty results for new search
      if (!isLoadMore) {
        setDisplayedUsers([])
        setSearchTotalFetched(0)
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
      // Load more regular users using Algolia for consistency
      setLoadMoreLoading(true)
      try {
        // Calculate the current page for Algolia (5 users per page for load more)
        const currentPage = Math.floor(totalFetched / 5) + 1
        
        // Fetch next 5 users using Algolia with filters
        const searchResponse = await algoliaSearchService.searchUsers({
          q: '',
          limit: 5,
          page: currentPage,
          advancedFilters: {
            locations: filters.locations,
            professions: filters.professions,
            skills: filters.skills,
            minProfileScore: filters.minProfileScore,
            is_looking_for_job: filters.is_looking_for_job
          }
        })
        
        if (searchResponse.hits.length > 0) {
          // Combine existing and new users, then sort by profile_score descending
          const newUsers = searchResponse.hits.map(user => ({ ...user, matchPercentage: undefined }))
          setDisplayedUsers(prev => {
            const combined = [...prev, ...newUsers]
            // Sort by profile_score descending (highest first) to maintain global sort order
            return combined.sort((a, b) => (b.profile_score || 0) - (a.profile_score || 0))
          })
          setTotalFetched(prev => prev + searchResponse.hits.length)
          
          // Check if there are more users based on Algolia pagination info
          setHasMoreUsers(currentPage < searchResponse.pages - 1)
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

  const handleOpenProfessionalAnalysis = (userId: string, userName: string, designation?: string) => {
    setSelectedUserForAnalysis({ id: userId, name: userName, designation })
    setIsProfessionalAnalysisModalOpen(true)
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
            {/* Filter Toggle Button - Mobile */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  isDark 
                    ? 'bg-[#2f2f2f] border-[#565869] text-white hover:border-[#10a37f]' 
                    : 'bg-white border-gray-300 text-gray-900 hover:border-[#10a37f]'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {Object.values(filters).some(value => Array.isArray(value) ? value.length > 0 : value !== undefined) && (
                  <div className="w-2 h-2 rounded-full bg-[#10a37f]"></div>
                )}
              </button>
            </div>

            {/* Main Layout with Filters */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Filter Sidebar */}
              <div className={`lg:block ${showFilters ? 'block' : 'hidden'} w-full lg:w-80 flex-shrink-0`}>
                <div className={`sticky top-4 rounded-xl border p-4 ${
                  isDark ? 'bg-[#2f2f2f]/80 border-[#565869]/60 backdrop-blur-sm' : 'bg-white/80 border-gray-300/60 backdrop-blur-sm'
                }`}>
                  <ExploreFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    availableOptions={availableFilterOptions}
                  />
                </div>
              </div>

              {/* Results Section */}
              <div className="flex-1 min-w-0">
                
                {(loading || searchLoading) ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Array.from({ length: 24 }).map((_, index) => (
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
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {displayedUsers.map((user) => (
                      <Card
                        key={user.id}
                        className={`backdrop-blur-sm transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-[#10a37f]/10 hover:scale-105 ${isDark ? 'bg-[#2f2f2f]/80 border-[#565869]/60 hover:border-[#10a37f] hover:bg-[#2f2f2f]' : 'bg-white/80 border-gray-300/60 hover:border-[#10a37f] hover:bg-white'}`}
                        onClick={() => router.push(`/profile/${user.username}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center text-center space-y-3">
                            <div className="relative">
                              {user.profile_picture && !imageErrors[user.id] ? (
                                <img
                                  src={getImageUrl(user.profile_picture)}
                                  alt={user.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                  onError={() => setImageErrors(prev => ({ ...prev, [user.id]: true }))}
                                />
                              ) : (
                                <GradientAvatar className="w-12 h-12" isDark={isDark} />
                              )}
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
                              {/* Show profile score */}
                              {user.profile_score !== undefined && user.profile_score > 0 && (
                                <div className="flex items-center justify-center space-x-1">
                                  <span className={`text-xs font-medium ${user.profile_score >= 80 ? 'text-green-600' : user.profile_score >= 60 ? 'text-yellow-600' : 'text-orange-600'} ${isDark ? 'brightness-125' : ''}`}>
                                    Score: {user.profile_score}/100
                                  </span>
                                </div>
                              )}
                              
                              {/* Professional Analysis Button - Show for all profiles */}
                              <div className="flex items-center justify-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleOpenProfessionalAnalysis(user.id, user.name, user.designation || undefined)
                                  }}
                                  className={`flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                                    isDark 
                                      ? 'bg-[#10a37f]/20 text-[#10a37f] hover:bg-[#10a37f]/30 border border-[#10a37f]/30' 
                                      : 'bg-[#10a37f]/10 text-[#10a37f] hover:bg-[#10a37f]/20 border border-[#10a37f]/20'
                                  }`}
                                  title="Get professional analysis of this candidate"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  AI Analysis
                                </button>
                              </div>
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
                                    <span className="truncate">{isSearchMode ? "Load more" : "5 more"}</span>
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
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Professional Analysis Modal */}
      {selectedUserForAnalysis && (
        <ProfessionalAnalysisModal
          isOpen={isProfessionalAnalysisModalOpen}
          onClose={() => {
            setIsProfessionalAnalysisModalOpen(false)
            setSelectedUserForAnalysis(null)
          }}
          userId={selectedUserForAnalysis.id}
          userName={selectedUserForAnalysis.name}
          userDesignation={selectedUserForAnalysis.designation}
        />
      )}
    </div>
  )
}