'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/context/ThemeContext';
import { getThemeClasses } from '@/utils/theme';
import { 
  Users, 
  TrendingUp, 
  Eye, 
  Zap, 
  Download,
  Mail,
  MessageSquare,
  Search,
  UserX,
  Calendar,
  CalendarDays,
  BarChart3,
  FileText,
  Star,
  Shield,
  Settings,
  X,
  User,
  Building,
  Trash2,
  AlertTriangle,
  Loader
} from 'lucide-react';

// Types
interface AdminStats {
  total_users: number;
  new_users_today: number;
  new_users_this_week: number;
  new_users_this_month: number;
  total_profile_views: number;
  total_downloads: number;
  total_ai_requests: number;
  total_cover_letters: number;
  total_feedback: number;
  top_professions: Array<{ profession: string; count: number }>;
}

interface UserAnalytics {
  user_id: string;
  username?: string;
  name: string;
  email: string;
  profession?: string;
  location?: string;
  created_at: string;
  last_active?: string;
  profile_views: number;
  resume_downloads: number;
  ai_chat_messages: number;
  ai_content_generations: number;
  cover_letters_generated: number;
  job_matches_requested: number;
  total_estimated_tokens: number;
  profile_completion_score: number;
  is_active: boolean;
  is_blocked: boolean;
}

interface UserFeedback {
  id: string;
  username?: string;
  name?: string;
  email?: string;
  message: string;
  rating?: number;
  page_url?: string;
  created_at: string;
  status: string;
}

interface CoverLetter {
  id: string;
  username?: string;
  company_name: string;
  position: string;
  content: string;
  created_at: string;
  estimated_tokens: number;
  user_id?: string;
  job_description?: string;
  options_used?: {
    jobDescription?: string;
    companyName?: string;
    positionTitle?: string;
    jobType?: string;
    tone?: string;
    length?: string;
    additionalInstructions?: string;
  };
  word_count?: number;
  character_count?: number;
}

type ActiveTab = 'overview' | 'users' | 'analytics' | 'feedback' | 'content';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const { isDark } = useTheme();
  const themeClasses = getThemeClasses(isDark);
  
  // Data states
  const [stats, setStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [topProfessions, setTopProfessions] = useState<any[]>([]);
  const [users, setUsers] = useState<UserAnalytics[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [feedback, setFeedback] = useState<UserFeedback[]>([]);
  const [content, setContent] = useState<CoverLetter[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<CoverLetter | null>(null);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{type: 'single' | 'all', id?: string}>({type: 'single'});
  const [deleting, setDeleting] = useState(false);
  
  // Pagination states
  const [usersOffset, setUsersOffset] = useState(0);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [loadingMoreUsers, setLoadingMoreUsers] = useState(false);
  const [blockingUsers, setBlockingUsers] = useState<Set<string>>(new Set());
  
  // Loading states for each section
  const [loading, setLoading] = useState({
    stats: false,
    recentUsers: false,
    topProfessions: false,
    users: false,
    analytics: false,
    feedback: false,
    content: false,
    resumes: false
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      loadStatsData(token);
    }
  }, []);

  const handleLogin = async () => {
    if (!adminKey.trim()) {
      setError('Please enter admin key');
      return;
    }

    setLoginLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_key: adminKey })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('admin_token', data.access_token);
        setIsAuthenticated(true);
        loadStatsData(data.access_token);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Invalid admin key');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const loadStatsData = async (token: string) => {
    if (loading.stats || stats) return;
    
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      const response = await fetch('/api/admin/stats', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error loading stats data:', err);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const loadRecentUsersData = async () => {
    if (loading.recentUsers || recentUsers.length > 0) return;
    
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    setLoading(prev => ({ ...prev, recentUsers: true }));
    try {
      const response = await fetch('/api/admin/recent-users?limit=5', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecentUsers(data);
      }
    } catch (err) {
      console.error('Error loading recent users data:', err);
    } finally {
      setLoading(prev => ({ ...prev, recentUsers: false }));
    }
  };

  const loadTopProfessionsData = async () => {
    if (loading.topProfessions || topProfessions.length > 0) return;
    
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    setLoading(prev => ({ ...prev, topProfessions: true }));
    try {
      const response = await fetch('/api/admin/top-professions', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTopProfessions(data);
      }
    } catch (err) {
      console.error('Error loading top professions data:', err);
    } finally {
      setLoading(prev => ({ ...prev, topProfessions: false }));
    }
  };

  const loadUsersData = async (reset = false) => {
    if (loading.users) return;
    
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    const currentOffset = reset ? 0 : usersOffset;
    
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const url = new URL('/api/admin/users', window.location.origin);
      if (searchQuery) url.searchParams.set('search', searchQuery);
      url.searchParams.set('limit', '5'); // Load 5 users at a time
      url.searchParams.set('offset', currentOffset.toString());

      const response = await fetch(url.toString(), {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (reset) {
          // Reset users list (for search or initial load)
          setUsers(data);
          setUsersOffset(data.length);
        } else {
          // Append to existing users (for pagination)
          setUsers(prev => [...prev, ...data]);
          setUsersOffset(prev => prev + data.length);
        }
        
        // Check if there are more users to load
        setHasMoreUsers(data.length === 5);
      }
    } catch (err) {
      console.error('Error loading users data:', err);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const loadMoreUsers = async () => {
    if (loadingMoreUsers || !hasMoreUsers) return;
    
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    setLoadingMoreUsers(true);
    try {
      const url = new URL('/api/admin/users', window.location.origin);
      if (searchQuery) url.searchParams.set('search', searchQuery);
      url.searchParams.set('limit', '5');
      url.searchParams.set('offset', usersOffset.toString());

      const response = await fetch(url.toString(), {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.length > 0) {
          setUsers(prev => [...prev, ...data]);
          setUsersOffset(prev => prev + data.length);
        }
        
        // Check if there are more users to load
        setHasMoreUsers(data.length === 5);
      }
    } catch (err) {
      console.error('Error loading more users:', err);
    } finally {
      setLoadingMoreUsers(false);
    }
  };

  const loadAnalyticsData = async () => {
    if (loading.analytics || analytics) return;
    
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    setLoading(prev => ({ ...prev, analytics: true }));
    try {
      const response = await fetch('/api/admin/analytics', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Error loading analytics data:', err);
    } finally {
      setLoading(prev => ({ ...prev, analytics: false }));
    }
  };

  const loadFeedbackData = async () => {
    if (loading.feedback || feedback.length > 0) return;
    
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    setLoading(prev => ({ ...prev, feedback: true }));
    try {
      const response = await fetch('/api/admin/feedback', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data);
      }
    } catch (err) {
      console.error('Error loading feedback data:', err);
    } finally {
      setLoading(prev => ({ ...prev, feedback: false }));
    }
  };

  const loadContentData = async () => {
    if (loading.content) return; // Only prevent if currently loading
    
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    setLoading(prev => ({ ...prev, content: true }));
    try {
      const response = await fetch('/api/admin/content', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (err) {
      console.error('Error loading content data:', err);
    } finally {
      setLoading(prev => ({ ...prev, content: false }));
    }
  };

  const handleDeleteCoverLetter = async (letterId?: string, deleteAll: boolean = false) => {
    setDeleting(true);
    try {
      const params = new URLSearchParams();
      if (letterId) {
        params.append('letterId', letterId);
      } else if (deleteAll) {
        params.append('deleteAll', 'true');
      }

      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/content/delete?${params.toString()}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        
        if (deleteAll) {
          setContent([]);
          alert(`Successfully deleted ${result.deleted_count} cover letters`);
        } else {
          // Remove the deleted letter from the list
          setContent(prev => prev.filter(letter => letter.id !== letterId));
          alert('Cover letter deleted successfully');
        }
        
        // Close modals
        setShowDeleteConfirm(false);
        setShowCoverLetterModal(false);
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to delete cover letter');
      }
    } catch (error) {
      console.error('Error deleting cover letter:', error);
      alert('Error deleting cover letter');
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = (type: 'single' | 'all', id?: string) => {
    setDeleteTarget({ type, id });
    setShowDeleteConfirm(true);
  };

  const executeDelete = () => {
    if (deleteTarget.type === 'all') {
      handleDeleteCoverLetter(undefined, true);
    } else if (deleteTarget.id) {
      handleDeleteCoverLetter(deleteTarget.id);
    }
  };



  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    
    // Lazy load data when tab is first accessed
    switch (tab) {
      case 'users':
        if (users.length === 0) {
          // Reset pagination state and load first batch
          setUsersOffset(0);
          setHasMoreUsers(true);
          loadUsersData(true);
        }
        break;
      case 'analytics':
        loadAnalyticsData();
        break;
      case 'feedback':
        loadFeedbackData();
        break;
      case 'content':
        loadContentData();
        break;
    }
  };

  const handleBlockUser = async (userId: string, block: boolean) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    // Add user to blocking set
    setBlockingUsers(prev => new Set(prev).add(userId));

    try {
      const response = await fetch('/api/admin/users/block', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId, block })
      });

      if (response.ok) {
        // Update user state locally instead of reloading entire list
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.user_id === userId 
              ? { ...user, is_blocked: block }
              : user
          )
        );
      } else {
        console.error('Failed to update user status');
      }
    } catch (err) {
      console.error('Error updating user status:', err);
    } finally {
      // Remove user from blocking set
      setBlockingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setStats(null);
    setRecentUsers([]);
    setTopProfessions([]);
    setUsers([]);
    setAnalytics(null);
    setFeedback([]);
    setContent([]);
    setResumes([]);
    // Reset pagination state
    setUsersOffset(0);
    setHasMoreUsers(true);
    setLoadingMoreUsers(false);
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${themeClasses.bg.primary}`}>
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className={`w-full max-w-md ${themeClasses.bg.card} ${themeClasses.border.primary}`}>
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className={`text-2xl font-bold ${themeClasses.text.primary}`}>Admin Access</CardTitle>
              <p className={themeClasses.text.secondary}>Enter your admin key to continue</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className={`${themeClasses.bg.input} ${themeClasses.border.primary} ${themeClasses.text.primary}`}
              />
              {error && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                  <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
                </Alert>
              )}
              <Button 
                onClick={handleLogin} 
                disabled={loginLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                {loginLoading ? 'Accessing...' : 'Access Dashboard'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
          <div className={`min-h-screen ${themeClasses.bg.primary}`}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text.primary}`}>Admin Dashboard</h1>
            <p className={themeClasses.text.secondary}>Manage users and monitor platform analytics</p>
          </div>
          <Button 
            onClick={logout} 
            variant="outline" 
            className={`${themeClasses.border.primary} ${themeClasses.text.secondary} hover:${themeClasses.text.secondary}`}
          >
            <Settings className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className={`mb-8 border-b ${themeClasses.border.primary}`}>
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'feedback', label: 'Feedback', icon: MessageSquare },
              { id: 'content', label: 'Content', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as ActiveTab)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? `border-blue-500 ${themeClasses.text.primary}`
                      : `border-transparent ${themeClasses.text.secondary} hover:${themeClasses.text.primary} hover:border-gray-300`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {loading[tab.id as keyof typeof loading] && (
                    <div className="w-3 h-3 border border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab 
            stats={stats}
            recentUsers={recentUsers}
            topProfessions={topProfessions}
            loading={loading}
            loadRecentUsers={loadRecentUsersData}
            loadTopProfessions={loadTopProfessionsData}
            themeClasses={themeClasses}
          />
        )}
        
        {activeTab === 'users' && (
          <UsersTab 
            users={users}
            loading={loading.users}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={() => {
              setUsersOffset(0);
              setHasMoreUsers(true);
              loadUsersData(true);
            }}
            onBlockUser={handleBlockUser}
            onLoadMore={loadMoreUsers}
            hasMoreUsers={hasMoreUsers}
            loadingMoreUsers={loadingMoreUsers}
            blockingUsers={blockingUsers}
            themeClasses={themeClasses}
          />
        )}
        
        {activeTab === 'analytics' && (
          <AnalyticsTab 
            data={analytics}
            loading={loading.analytics}
            themeClasses={themeClasses}
          />
        )}
        
        {activeTab === 'feedback' && (
          <FeedbackTab 
            feedback={feedback}
            loading={loading.feedback}
            themeClasses={themeClasses}
          />
        )}
        
        {activeTab === 'content' && (
          <ContentTab 
            content={content}
            loading={loading.content}
            themeClasses={themeClasses}
            onViewLetter={(letter: CoverLetter) => {
              setSelectedCoverLetter(letter);
              setShowCoverLetterModal(true);
            }}
            onDeleteLetter={(id: string) => confirmDelete('single', id)}
            onDeleteAll={() => confirmDelete('all')}
            onRefresh={loadContentData}
          />
        )}
      </div>
      
      {/* Cover Letter Details Modal */}
      {showCoverLetterModal && selectedCoverLetter && (
        <CoverLetterModal
          letter={selectedCoverLetter}
          isOpen={showCoverLetterModal}
          onClose={() => {
            setShowCoverLetterModal(false);
            setSelectedCoverLetter(null);
          }}
          onDelete={(id: string) => confirmDelete('single', id)}
          themeClasses={themeClasses}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={executeDelete}
          deleteType={deleteTarget.type}
          isDeleting={deleting}
          themeClasses={themeClasses}
        />
      )}
    </div>
  );
}

// Tab Components
function OverviewTab({ stats, recentUsers, topProfessions, loading, loadRecentUsers, loadTopProfessions, themeClasses }: any) {
  // Load additional data when component mounts
  React.useEffect(() => {
    if (!recentUsers.length) {
      loadRecentUsers();
    }
    if (!topProfessions.length) {
      loadTopProfessions();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards - 6 cards as requested */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.total_users}
          icon={Users}
          color="blue"
          loading={loading.stats}
          themeClasses={themeClasses}
        />
        <StatCard
          title="Profile Views"
          value={stats?.total_profile_views}
          icon={Eye}
          color="purple"
          loading={loading.stats}
          themeClasses={themeClasses}
        />
        <StatCard
          title="AI Requests"
          value={stats?.total_ai_requests}
          icon={Zap}
          color="yellow"
          loading={loading.stats}
          themeClasses={themeClasses}
        />
        <StatCard
          title="Cover Letters"
          value={stats?.total_cover_letters}
          icon={Mail}
          color="green"
          loading={loading.stats}
          themeClasses={themeClasses}
        />
        <StatCard
          title="Total Downloads"
          value={stats?.total_downloads}
          icon={Download}
          color="indigo"
          loading={loading.stats}
          themeClasses={themeClasses}
        />
        <StatCard
          title="Total Feedback"
          value={stats?.total_feedback}
          icon={MessageSquare}
          color="pink"
          loading={loading.stats}
          themeClasses={themeClasses}
        />
      </div>

      {/* Recent Users and Top Professions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={`${themeClasses.bg.card} ${themeClasses.border.primary}`}>
          <CardHeader>
            <CardTitle className={themeClasses.text.primary}>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading.recentUsers ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`p-3 rounded-lg ${themeClasses.bg.cardHover} animate-pulse`}>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className={`h-12 w-12 ${themeClasses.text.secondary} mx-auto mb-4`} />
                <p className={themeClasses.text.secondary}>No recent users</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentUsers.map((user: any) => (
                  <div key={user.user_id} className={`flex items-center justify-between p-3 rounded-lg ${themeClasses.bg.cardHover}`}>
                    <div>
                      <p className={`font-medium ${themeClasses.text.primary}`}>{user.name}</p>
                      <p className={`text-sm ${themeClasses.text.secondary}`}>{user.email}</p>
                      <p className={`text-xs ${themeClasses.text.secondary}`}>{user.profession || 'No profession'}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${themeClasses.text.secondary}`}>
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                      <Badge variant="outline" className={themeClasses.border.primary}>
                        @{user.username || 'No username'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={`${themeClasses.bg.card} ${themeClasses.border.primary}`}>
          <CardHeader>
            <CardTitle className={themeClasses.text.primary}>Top Professions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading.topProfessions ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : topProfessions.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className={`h-12 w-12 ${themeClasses.text.secondary} mx-auto mb-4`} />
                <p className={themeClasses.text.secondary}>No profession data</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topProfessions.map((profession: any, index: number) => (
                  <div key={profession.profession} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className={`${themeClasses.border.primary} ${themeClasses.text.secondary}`}>
                        #{index + 1}
                      </Badge>
                      <span className={themeClasses.text.primary}>{profession.profession}</span>
                    </div>
                    <Badge className="bg-blue-600 text-white">
                      {profession.count} users
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UsersTab({ users, loading, searchQuery, setSearchQuery, onSearch, onBlockUser, onLoadMore, hasMoreUsers, loadingMoreUsers, blockingUsers, themeClasses }: any) {
  return (
    <Card className={`${themeClasses.bg.card} ${themeClasses.border.primary}`}>
      <CardHeader>
        <CardTitle className={themeClasses.text.primary}>User Management</CardTitle>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            className={`${themeClasses.bg.input} ${themeClasses.border.primary} ${themeClasses.text.primary} max-w-sm`}
          />
          <Button onClick={onSearch} variant="outline" size="sm" disabled={loading}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`p-4 rounded-lg ${themeClasses.bg.cardHover} animate-pulse`}>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user: UserAnalytics) => (
              <div key={user.user_id} className={`flex items-center justify-between p-4 rounded-lg ${themeClasses.bg.cardHover}`}>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className={`font-medium ${themeClasses.text.primary}`}>{user.name}</p>
                      <p className={`text-sm ${themeClasses.text.secondary}`}>{user.email}</p>
                      <p className={`text-xs ${themeClasses.text.secondary}`}>@{user.username || 'No username'}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className={`text-sm ${themeClasses.text.secondary}`}>
                      {user.profession || 'No profession'} • {user.location || 'No location'}
                    </p>
                  </div>
                </div>
                
                <div className="text-center px-4">
                  <p className={`text-sm ${themeClasses.text.secondary}`}>Stats</p>
                  <div className={`flex space-x-4 text-xs ${themeClasses.text.secondary}`}>
                    <span>{user.profile_views} views</span>
                    <span>{user.ai_chat_messages + user.ai_content_generations + user.cover_letters_generated} AI</span>
                    <span>{user.resume_downloads} DL</span>
                  </div>
                </div>
                
                <div className="text-center px-4">
                  <div className="flex flex-col space-y-1">
                    <Badge className={user.is_active ? "bg-green-600" : "bg-gray-600"}>
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline" className={`${themeClasses.border.primary} ${themeClasses.text.secondary}`}>
                      {user.profile_completion_score}% Complete
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <Button
                    onClick={() => onBlockUser(user.user_id, !user.is_blocked)}
                    variant={user.is_blocked ? "default" : "destructive"}
                    size="sm"
                    disabled={blockingUsers.has(user.user_id)}
                  >
                    {blockingUsers.has(user.user_id) ? (
                      <Loader className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <UserX className="h-4 w-4 mr-1" />
                    )}
                    {blockingUsers.has(user.user_id) 
                      ? "Processing..." 
                      : (user.is_blocked ? "Unblock" : "Block")
                    }
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Load More Button */}
            {!loading && users.length > 0 && (
              <div className="mt-6 text-center">
                {hasMoreUsers ? (
                  <Button
                    onClick={onLoadMore}
                    disabled={loadingMoreUsers}
                    variant="outline"
                    className={`${themeClasses.border.primary} ${themeClasses.text.primary}`}
                  >
                    {loadingMoreUsers ? (
                      <>
                        <div className="w-4 h-4 border border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      'Load More Users'
                    )}
                  </Button>
                ) : (
                  <p className={`text-sm ${themeClasses.text.secondary}`}>
                    No more users to load
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AnalyticsTab({ data, loading, themeClasses }: any) {
  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className={`${themeClasses.bg.card} ${themeClasses.border.primary}`}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className={`${themeClasses.bg.card} ${themeClasses.border.primary}`}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* User Analytics Row */}
      <div>
        <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>User Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={data?.stats?.total_users ?? 0}
            icon={Users}
            color="blue"
            themeClasses={themeClasses}
          />
          <StatCard
            title="New Users Today"
            value={data?.stats?.new_users_today ?? 0}
            icon={TrendingUp}
            color="green"
            themeClasses={themeClasses}
          />
          <StatCard
            title="New This Week"
            value={data?.stats?.new_users_this_week ?? 0}
            icon={Calendar}
            color="purple"
            themeClasses={themeClasses}
          />
          <StatCard
            title="New This Month"
            value={data?.stats?.new_users_this_month ?? 0}
            icon={CalendarDays}
            color="indigo"
            themeClasses={themeClasses}
          />
        </div>
      </div>

      {/* Activity Analytics Row */}
      <div>
        <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Platform Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Profile Views"
            value={data?.stats?.total_profile_views ?? 0}
            icon={Eye}
            color="purple"
            themeClasses={themeClasses}
          />
          <StatCard
            title="Total Downloads"
            value={data?.stats?.total_downloads ?? 0}
            icon={Download}
            color="indigo"
            themeClasses={themeClasses}
          />
        </div>
      </div>

      {/* Content Analytics Row */}
      <div>
        <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Content & AI Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="AI Requests"
            value={data?.stats?.total_ai_requests ?? 0}
            icon={Zap}
            color="yellow"
            themeClasses={themeClasses}
          />
          <StatCard
            title="Cover Letters"
            value={data?.stats?.total_cover_letters ?? 0}
            icon={Mail}
            color="green"
            themeClasses={themeClasses}
          />
          <StatCard
            title="User Feedback"
            value={data?.stats?.total_feedback ?? 0}
            icon={MessageSquare}
            color="pink"
            themeClasses={themeClasses}
          />
        </div>
      </div>

      {/* Recent Actions Section */}
      {data.recent_actions && data.recent_actions.length > 0 && (
        <div>
          <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Recent User Actions</h3>
          <Card className={`${themeClasses.bg.card} ${themeClasses.border.primary}`}>
            <CardContent className="p-6">
              <div className="space-y-3">
                {data.recent_actions.slice(0, 10).map((action: any, index: number) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${themeClasses.bg.cardHover}`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${getActionColor(action.action_type)}`}></div>
                      <div>
                        <p className={`font-medium ${themeClasses.text.primary}`}>
                          {formatActionType(action.action_type)}
                        </p>
                        <p className={`text-sm ${themeClasses.text.secondary}`}>
                          {action.username || action.user_id || 'Anonymous'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs ${themeClasses.text.secondary}`}>
                        {new Date(action.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Helper functions for action display
function getActionColor(actionType: string): string {
  const colors: { [key: string]: string } = {
    'profile_view': 'bg-blue-500',
    'resume_download': 'bg-green-500',
    'ai_chat': 'bg-purple-500',
    'ai_resume_analysis': 'bg-yellow-500',
    'user_registration': 'bg-indigo-500',
    'user_login': 'bg-pink-500',
    'cover_letter_generation': 'bg-orange-500',
    'profile_update': 'bg-cyan-500'
  };
  return colors[actionType] || 'bg-gray-500';
}

function formatActionType(actionType: string): string {
  const formats: { [key: string]: string } = {
    'profile_view': 'Profile View',
    'resume_download': 'Resume Download', 
    'ai_chat': 'AI Chat',
    'ai_resume_analysis': 'AI Resume Analysis',
    'user_registration': 'User Registration',
    'user_login': 'User Login',
    'cover_letter_generation': 'Cover Letter Generated',
    'profile_update': 'Profile Update',
    'pdf_download': 'PDF Download'
  };
  return formats[actionType] || actionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function FeedbackTab({ feedback, loading, themeClasses }: any) {
  return (
    <Card className={`${themeClasses.bg.card} ${themeClasses.border.primary}`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text.primary} flex items-center`}>
          <MessageSquare className="h-5 w-5 mr-2" />
          User Feedback
          <Badge className="ml-2">{feedback.length} total</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`p-4 rounded-lg ${themeClasses.bg.cardHover} animate-pulse`}>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : feedback.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className={`h-12 w-12 ${themeClasses.text.secondary} mx-auto mb-4`} />
            <p className={themeClasses.text.secondary}>No feedback yet</p>
            <p className={`text-sm ${themeClasses.text.secondary}`}>Users can submit feedback using the floating button</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedback.map((item: UserFeedback) => (
              <div key={item.id} className={`p-4 rounded-lg ${themeClasses.bg.cardHover}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className={`font-medium ${themeClasses.text.primary}`}>
                      {item.name || item.username || 'Anonymous'}
                    </p>
                    {item.email && (
                      <p className={`text-sm ${themeClasses.text.secondary}`}>{item.email}</p>
                    )}
                  </div>
                  <div className="text-right">
                    {item.rating && (
                      <div className="flex items-center space-x-1 mb-1">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    )}
                    <p className={`text-xs ${themeClasses.text.secondary}`}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className={themeClasses.text.primary}>{item.message}</p>
                {item.page_url && (
                  <p className={`text-xs ${themeClasses.text.secondary} mt-2`}>From: {item.page_url}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ContentTab({ content, loading, themeClasses, onViewLetter, onDeleteLetter, onDeleteAll, onRefresh }: any) {
  return (
    <Card className={`${themeClasses.bg.card} ${themeClasses.border.primary}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`${themeClasses.text.primary} flex items-center`}>
            <Mail className="h-5 w-5 mr-2" />
            Generated Cover Letters
            <Badge className="ml-2">{content.length} total</Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              className={`${themeClasses.border.primary} ${themeClasses.text.secondary} hover:${themeClasses.text.primary}`}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {content.length > 0 && (
              <Button
                onClick={onDeleteAll}
                variant="outline"
                size="sm"
                className={`text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700`}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`p-4 rounded-lg ${themeClasses.bg.cardHover} animate-pulse`}>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : content.length === 0 ? (
          <div className="text-center py-8">
            <FileText className={`h-12 w-12 ${themeClasses.text.secondary} mx-auto mb-4`} />
            <p className={themeClasses.text.secondary}>No cover letters generated yet</p>
            <p className={`text-sm ${themeClasses.text.secondary}`}>Cover letters will appear here when users generate them</p>
          </div>
        ) : (
          <div className="space-y-4">
            {content.map((letter: CoverLetter) => (
              <div 
                key={letter.id} 
                className={`p-4 rounded-lg ${themeClasses.bg.cardHover} border border-transparent hover:border-[#10a37f]/30 transition-all duration-200`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 cursor-pointer" onClick={() => onViewLetter(letter)}>
                    <p className={`font-medium ${themeClasses.text.primary}`}>{letter.company_name}</p>
                    <p className={`text-sm ${themeClasses.text.secondary}`}>{letter.position}</p>
                    <p className={`text-xs ${themeClasses.text.secondary}`}>
                      By: {letter.username || 'Guest User'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className={`text-xs ${themeClasses.text.secondary}`}>
                        {new Date(letter.created_at).toLocaleDateString()}
                      </p>
                      <Badge variant="outline" className={`${themeClasses.border.primary} ${themeClasses.text.secondary} mt-1`}>
                        ~{letter.estimated_tokens} tokens
                      </Badge>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteLetter(letter.id);
                      }}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="cursor-pointer" onClick={() => onViewLetter(letter)}>
                  <p className={`${themeClasses.text.primary} text-sm line-clamp-3`}>
                    {letter.content.substring(0, 200)}...
                  </p>
                  <div className="mt-2 flex items-center text-xs text-[#10a37f]">
                    <Eye className="h-3 w-3 mr-1" />
                    Click to view full details
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}



function StatCard({ title, value, icon: Icon, color, loading, themeClasses }: any) {
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    yellow: 'text-yellow-500',
    indigo: 'text-indigo-500',
    pink: 'text-pink-500'
  };

  return (
    <Card className={`${themeClasses.bg.card} ${themeClasses.border.primary}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${themeClasses.text.secondary}`}>{title}</p>
            {loading ? (
              <div className="h-8 bg-gray-300 rounded w-20 animate-pulse mt-1"></div>
            ) : (
              <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                {value !== undefined && value !== null ? value.toLocaleString() : '0'}
              </p>
            )}
          </div>
          <Icon className={`h-8 w-8 ${colorClasses[color as keyof typeof colorClasses]}`} />
        </div>
      </CardContent>
    </Card>
  );
}

function CoverLetterModal({ letter, isOpen, onClose, onDelete, themeClasses }: {
  letter: CoverLetter;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  themeClasses: any;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${themeClasses.bg.card} rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden`}>
        {/* Header */}
        <div className={`p-6 border-b ${themeClasses.border.primary} flex items-center justify-between`}>
          <div>
            <h2 className={`text-xl font-bold ${themeClasses.text.primary}`}>Cover Letter Details</h2>
            <p className={`text-sm ${themeClasses.text.secondary}`}>
              Generated on {new Date(letter.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={() => onDelete(letter.id)}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button 
              onClick={onClose}
              variant="ghost" 
              size="sm"
              className={`${themeClasses.text.secondary} hover:${themeClasses.text.primary}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            
            {/* User & Job Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={`${themeClasses.bg.cardHover} ${themeClasses.border.primary}`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm ${themeClasses.text.primary} flex items-center`}>
                    <User className="h-4 w-4 mr-2" />
                    User Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className={`text-xs ${themeClasses.text.secondary}`}>Username:</span>
                    <p className={`font-medium ${themeClasses.text.primary}`}>{letter.username || 'Guest User'}</p>
                  </div>
                  {letter.user_id && (
                    <div>
                      <span className={`text-xs ${themeClasses.text.secondary}`}>User ID:</span>
                      <p className={`font-mono text-xs ${themeClasses.text.primary}`}>{letter.user_id}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className={`${themeClasses.bg.cardHover} ${themeClasses.border.primary}`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm ${themeClasses.text.primary} flex items-center`}>
                    <Building className="h-4 w-4 mr-2" />
                    Job Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className={`text-xs ${themeClasses.text.secondary}`}>Company:</span>
                    <p className={`font-medium ${themeClasses.text.primary}`}>{letter.company_name}</p>
                  </div>
                  <div>
                    <span className={`text-xs ${themeClasses.text.secondary}`}>Position:</span>
                    <p className={`font-medium ${themeClasses.text.primary}`}>{letter.position}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Options Used */}
            {letter.options_used && (
              <Card className={`${themeClasses.bg.cardHover} ${themeClasses.border.primary}`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm ${themeClasses.text.primary} flex items-center`}>
                    <Settings className="h-4 w-4 mr-2" />
                    Generation Options Selected by User
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {letter.options_used.tone && (
                      <div>
                        <span className={`text-xs ${themeClasses.text.secondary}`}>Tone:</span>
                        <Badge variant="outline" className={`ml-2 ${themeClasses.border.primary}`}>
                          {letter.options_used.tone}
                        </Badge>
                      </div>
                    )}
                    {letter.options_used.length && (
                      <div>
                        <span className={`text-xs ${themeClasses.text.secondary}`}>Length:</span>
                        <Badge variant="outline" className={`ml-2 ${themeClasses.border.primary}`}>
                          {letter.options_used.length}
                        </Badge>
                      </div>
                    )}
                    {letter.options_used.jobType && (
                      <div>
                        <span className={`text-xs ${themeClasses.text.secondary}`}>Job Type:</span>
                        <Badge variant="outline" className={`ml-2 ${themeClasses.border.primary}`}>
                          {letter.options_used.jobType}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {letter.options_used.jobDescription && (
                    <div className="mt-4">
                      <span className={`text-xs ${themeClasses.text.secondary}`}>Job Description:</span>
                      <p className={`text-sm ${themeClasses.text.primary} mt-1 p-2 rounded ${themeClasses.bg.secondary}`}>
                        {letter.options_used.jobDescription}
                      </p>
                    </div>
                  )}
                  
                  {letter.options_used.additionalInstructions && (
                    <div className="mt-4">
                      <span className={`text-xs ${themeClasses.text.secondary}`}>Additional Instructions:</span>
                      <p className={`text-sm ${themeClasses.text.primary} mt-1 p-2 rounded ${themeClasses.bg.secondary}`}>
                        {letter.options_used.additionalInstructions}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Generated Cover Letter Content */}
            <Card className={`${themeClasses.bg.cardHover} ${themeClasses.border.primary}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-sm ${themeClasses.text.primary} flex items-center justify-between`}>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Generated Cover Letter
                  </div>
                  <div className="flex space-x-2">
                    {letter.word_count && (
                      <Badge variant="outline" className={themeClasses.border.primary}>
                        {letter.word_count} words
                      </Badge>
                    )}
                    {letter.character_count && (
                      <Badge variant="outline" className={themeClasses.border.primary}>
                        {letter.character_count} chars
                      </Badge>
                    )}
                    <Badge variant="outline" className={themeClasses.border.primary}>
                      ~{letter.estimated_tokens} tokens
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded ${themeClasses.bg.secondary} ${themeClasses.border.primary} border`}>
                  <pre className={`${themeClasses.text.primary} whitespace-pre-wrap text-sm leading-relaxed font-sans`}>
                    {letter.content}
                  </pre>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm, deleteType, isDeleting, themeClasses }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleteType: 'single' | 'all';
  isDeleting: boolean;
  themeClasses: any;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${themeClasses.bg.card} rounded-lg shadow-xl max-w-md w-full`}>
        <div className={`p-6 border-b ${themeClasses.border.primary}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${themeClasses.text.primary}`}>
                {deleteType === 'all' ? 'Delete All Cover Letters' : 'Delete Cover Letter'}
              </h3>
              <p className={`text-sm ${themeClasses.text.secondary}`}>
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className={`${themeClasses.text.primary} mb-6`}>
            {deleteType === 'all' 
              ? 'Are you sure you want to delete ALL cover letters? This will permanently remove all generated cover letters from the system.'
              : 'Are you sure you want to delete this cover letter? This will permanently remove it from the system.'
            }
          </p>

          <div className="flex space-x-3 justify-end">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isDeleting}
              className={`${themeClasses.border.primary} ${themeClasses.text.secondary}`}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleteType === 'all' ? 'Delete All' : 'Delete'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}