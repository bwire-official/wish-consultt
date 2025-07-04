'use client'

import { CheckSquare, Archive, Trash2, Eye } from 'lucide-react'

interface BulkActionsProps {
  selectedCount: number
  onClearSelection: () => void
  onBulkAction: (action: string) => void
  bulkActionLoading: boolean
}

export function BulkActions({ 
  selectedCount, 
  onClearSelection, 
  onBulkAction, 
  bulkActionLoading 
}: BulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <div className="p-4 mb-4 border-l-4 border-l-blue-500 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-200/60 dark:border-slate-600/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-slate-900 dark:text-white">
              {selectedCount} announcement{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
          <button
            onClick={onClearSelection}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            Clear selection
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Bulk Publish */}
          <button
            onClick={() => onBulkAction('publish')}
            disabled={bulkActionLoading}
            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bulkActionLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
            ) : (
              <Eye className="h-4 w-4 mr-1" />
            )}
            Publish
          </button>
          
          {/* Bulk Archive */}
          <button
            onClick={() => onBulkAction('archive')}
            disabled={bulkActionLoading}
            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bulkActionLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
            ) : (
              <Archive className="h-4 w-4 mr-1" />
            )}
            Archive
          </button>
          
          {/* Bulk Delete */}
          <button
            onClick={() => onBulkAction('delete')}
            disabled={bulkActionLoading}
            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bulkActionLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
            ) : (
              <Trash2 className="h-4 w-4 mr-1" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}