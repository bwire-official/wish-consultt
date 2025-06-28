"use client";

import { useState, useEffect } from "react";
import { Search, User, X } from "lucide-react";
import { searchUsers } from "@/app/admin/announcements/actions";
import Image from "next/image";

interface User {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  avatar_url: string | null;
  username: string | null;
}

interface UserSelectProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (userId: string, user?: User) => void;
  onClear?: () => void;
}

export default function UserSelect({ 
  placeholder = "Search for a user...", 
  className = "",
  onChange,
  onClear
}: UserSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Search users as user types
  useEffect(() => {
    const performSearch = async () => {
      // Don't search if a user is already selected
      if (selectedUser) {
        setUsers([]);
        setShowDropdown(false);
        return;
      }

      if (searchQuery.trim().length < 2) {
        setUsers([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchUsers(searchQuery);
        console.log('Search results:', data);
        if (Array.isArray(data) && data.length > 0 && data.every(u => u && typeof u === 'object' && 'id' in u && 'full_name' in u && 'email' in u && 'role' in u)) {
          setUsers(data);
        } else {
          setUsers([]);
        }
        setShowDropdown(true);
      } catch (error) {
        console.error('Error searching users:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedUser]);

  const handleUserSelect = (user: User) => {
    console.log('User selected:', user);
    setSelectedUser(user);
    setSearchQuery(`${user.full_name || 'Unknown'} (@${user.username || 'no-username'})`);
    setShowDropdown(false);
    setUsers([]);
    
    if (onChange) {
      onChange(user.id, user);
    }
  };

  const handleClear = () => {
    setSelectedUser(null);
    setSearchQuery("");
    setShowDropdown(false);
    setUsers([]);
    
    if (onClear) {
      onClear();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Don't allow typing if a user is already selected
    if (selectedUser) {
      return;
    }

    const value = e.target.value;
    setSearchQuery(value);
    
    if (!value.trim()) {
      setShowDropdown(false);
      setUsers([]);
      if (onClear) {
        onClear();
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => {
            if (users.length > 0 && !selectedUser) setShowDropdown(true);
          }}
          placeholder={selectedUser ? "User selected" : placeholder}
          readOnly={selectedUser !== null}
          className={`w-full pl-10 pr-10 py-2 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 ${selectedUser ? 'ring-2 ring-green-500/50 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20' : ''}`}
        />
        {selectedUser && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && !selectedUser && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 text-center text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg z-50">
          Searching users...
        </div>
      )}

      {/* Users dropdown */}
      {showDropdown && users.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg z-50 max-h-60 overflow-y-auto">
          {users.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => handleUserSelect(user)}
              className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.avatar_url ? (
                  <Image 
                    src={user.avatar_url} 
                    alt={user.full_name || user.username || 'User'}
                    className="w-8 h-8 rounded-full object-cover"
                    width={32}
                    height={32}
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900 dark:text-white truncate">
                  {user.full_name || user.username || 'Unknown User'}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {user.username && `@${user.username} • `}{user.email}
                </div>
              </div>
              <div className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full capitalize">
                {user.role}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {showDropdown && !isLoading && !selectedUser && searchQuery.length >= 2 && users.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 p-4 text-center text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg z-50">
          No users found matching &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
} 