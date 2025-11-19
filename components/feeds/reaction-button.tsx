'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, ThumbsUp, Flame, Smile } from 'lucide-react'

interface ReactionButtonProps {
  reactions: Array<{ icon: React.ReactNode; id: string; label: string }>
  onSelect: (id: string) => void
}

export default function ReactionButton({ reactions, onSelect }: ReactionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Heart className="h-4 w-4 mr-1" />
        React
      </Button>

      {isOpen && (
        <div
          className="absolute bottom-full left-0 mb-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg p-2 flex gap-2"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {reactions.map(({ icon, id, label }) => (
            <button
              key={id}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
              title={label}
              onClick={() => {
                onSelect(id)
                setIsOpen(false)
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
