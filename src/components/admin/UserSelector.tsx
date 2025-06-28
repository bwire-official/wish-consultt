"use client";

import { useState, useEffect } from "react";
import { Search, User, X } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/service";
import Image from "next/image";

interface User {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  avatar_url: string | null;
}

interface UserSelectorProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (userId: string, user?: User) => void;
  onClear?: () => void;
}

export default function UserSelector({ 
  placeholder = "Search for a user...", 
  className = "",
  onChange,
  onClear
}: UserSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Search users as user types
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 2) {
        setUsers([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabaseAdmin
          .from('profiles')
          .select('id, full_name, email, role, avatar_url')
          .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
          .limit(10);

        if (error) {
          console.error('Error searching users:', error);
          setUsers([]);
        } else {
          if (Array.isArray(data) && data.length > 0 && data.every(u => u && typeof u === 'object' && 'id' in u && 'full_name' in u && 'email' in u && 'role' in u)) {
            setUsers(data);
          } else {
            setUsers([]);
          }
          setShowDropdown(true);
        }
      } catch (error) {
        console.error('Error searching users:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSearchQuery(user.full_name || user.email || 'Unknown User');
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
    setSearchQuery(e.target.value);
    
    if (!e.target.value.trim()) {
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
            if (users.length > 0) setShowDropdown(true);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-white/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
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
      {isLoading && (
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
                    alt={user.full_name || user.email || 'User'}
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
                  {user.full_name || user.email || 'Unknown User'}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {user.email || 'No email'}
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
      {showDropdown && !isLoading && searchQuery.length >= 2 && users.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 p-4 text-center text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg z-50">
          No users found matching &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
} 