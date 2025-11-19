'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, ThumbsUp, Heart, Flame, Smile } from 'lucide-react'
import { useState } from 'react'

interface Comment {
  id: number
  author: string
  avatar: string
  content: string
  timestamp: string
  reactions: Record<string, number>
}

interface Props {
  comments: Comment[]
}

const REACTION_ICON_MAP: Record<string, React.ReactNode> = {
  'thumbsup': <ThumbsUp className="h-3 w-3 text-blue-600" />,
  'heart': <Heart className="h-3 w-3 text-red-600" />,
  'fire': <Flame className="h-3 w-3 text-orange-600" />,
  'smile': <Smile className="h-3 w-3 text-yellow-600" />
}

export default function CommentSection({ comments }: Props) {
  const [newComment, setNewComment] = useState('')

  return (
    <div className="space-y-3 pt-2 mt-4 border-t border-slate-200 dark:border-slate-800">
      {/* EXISTING COMMENTS */}
      {comments.map(comment => (
        <div key={comment.id} className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-slate-300 dark:bg-slate-700 text-xs font-semibold">
              {comment.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{comment.author}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{comment.timestamp}</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">{comment.content}</p>

            <div className="flex gap-2 mt-2">
              {Object.entries(comment.reactions).map(([reactionId, count]) => (
                <button
                  key={reactionId}
                  className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition flex items-center gap-1"
                >
                  {REACTION_ICON_MAP[reactionId]} {count}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* NEW COMMENT INPUT */}
      <div className="flex gap-2 mt-3 pt-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">U</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="text-sm h-8 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          />
          <Button size="sm" variant="outline" className="h-8">Reply</Button>
        </div>
      </div>
    </div>
  )
}
