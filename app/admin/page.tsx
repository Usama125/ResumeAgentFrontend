"use client";

import React, { useEffect, useMemo, useState } from 'react';
import type { PublicUser } from '@/types';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState('');
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const expected = useMemo(() => process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '', []);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('admin_pw') : null;
    if (saved && expected && saved === expected) {
      setAuthed(true);
    }
  }, [expected]);

  const fetchUsers = async (skip: number = 0, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/users?limit=10&skip=${skip}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      
      if (append) {
        setUsers(prev => [...prev, ...data.users]);
      } else {
        setUsers(data.users);
        setTotalUsers(data.total);
      }
      
      setHasMore(data.users.length === 10);
    } catch (e: any) {
      setError(e?.message || 'Failed to load users');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!authed) return;
    fetchUsers(0, false);
  }, [authed]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchUsers(users.length, true);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(userId);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Remove user from local state
      setUsers(prev => prev.filter(u => u.id !== userId));
      setTotalUsers(prev => prev - 1);
      setSelectedUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    } catch (e: any) {
      setError(e?.message || 'Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  const bulkDeleteUsers = async () => {
    if (selectedUsers.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedUsers.size} users? This action cannot be undone.`)) {
      return;
    }

    try {
      setBulkDeleting(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/users/bulk-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_ids: Array.from(selectedUsers)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      // Remove deleted users from local state
      setUsers(prev => prev.filter(u => !selectedUsers.has(u.id)));
      setTotalUsers(prev => prev - result.deleted_count);
      setSelectedUsers(new Set());
    } catch (e: any) {
      setError(e?.message || 'Failed to delete users');
    } finally {
      setBulkDeleting(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const selectAllUsers = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(u => u.id)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === expected && expected) {
      localStorage.setItem('admin_pw', input);
      setAuthed(true);
    } else {
      alert('Invalid password');
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-md shadow-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Admin Access</h2>
            <p className="text-muted-foreground">Enter your admin password to continue</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                placeholder="Enter admin password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage and monitor user registrations</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-card border border-border rounded-lg px-4 py-2">
                <span className="text-foreground font-semibold">
                  {users.length} / {totalUsers} Users
                </span>
              </div>
              {selectedUsers.size > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground text-sm">
                    {selectedUsers.size} selected
                  </span>
                  <button
                    onClick={bulkDeleteUsers}
                    disabled={bulkDeleting}
                    className="px-3 py-1.5 bg-destructive hover:bg-destructive/90 disabled:bg-muted text-destructive-foreground disabled:text-muted-foreground text-sm font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    {bulkDeleting ? 'Deleting...' : 'Delete Selected'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-3 text-foreground">Loading users...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-destructive mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-destructive-foreground">{error}</span>
            </div>
          </div>
        )}

        {/* Users Table */}
        {!loading && (
          <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-muted/50 border-b border-border">
              <div className="grid grid-cols-12 gap-4 px-6 py-4">
                <div className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === users.length && users.length > 0}
                    onChange={selectAllUsers}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                </div>
                <div className="col-span-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Name</div>
                <div className="col-span-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Email</div>
                <div className="col-span-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Username</div>
                <div className="col-span-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Profile</div>
                <div className="col-span-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border">
              {users.map((u, index) => (
                <div key={u.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-muted/30 transition-colors duration-200">
                  <div className="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(u.id)}
                      onChange={() => toggleUserSelection(u.id)}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                    />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-foreground font-semibold text-sm">
                        {(u.name || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-foreground font-medium">{u.name || 'Unknown User'}</div>
                      <div className="text-muted-foreground text-sm">#{index + 1}</div>
                    </div>
                  </div>
                  
                  <div className="col-span-3 flex items-center">
                    <div className="text-muted-foreground truncate">{(u as any).email || '-'}</div>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <span className="bg-muted text-foreground px-2 py-1 rounded-md text-sm font-mono">
                      {u.username || '-'}
                    </span>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    {u.username ? (
                      <a 
                        href={`https://cvchatter.com/profile/${u.username}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Profile
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">No profile</span>
                    )}
                  </div>
                  
                  <div className="col-span-2 flex items-center space-x-2">
                    <button 
                      onClick={() => deleteUser(u.id)}
                      disabled={deleting === u.id}
                      className="p-2 text-destructive hover:text-destructive-foreground hover:bg-destructive rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete user"
                    >
                      {deleting === u.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-destructive"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="text-center mt-8">
            <button 
              onClick={loadMore}
              disabled={loadingMore}
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground disabled:text-muted-foreground font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Load More Users
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


