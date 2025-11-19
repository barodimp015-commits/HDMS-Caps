'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Share2, ThumbsUp, Heart, Flame, Smile } from 'lucide-react'
import CommentSection from './comment-section'
import ReactionButton from './reaction-button'

interface Post {
  id: number
  author: string
  avatar: string
  timestamp: string
  title: string
  content: string
  category: string
  replies: number
  reactions: Record<string, number>
  comments: Array<{
    id: number
    author: string
    avatar: string
    content: string
    timestamp: string
    reactions: Record<string, number>
  }>
}

interface Props {
  post: Post
  reactions: Array<{ icon: React.ReactNode; id: string; label: string }>
  onAddReaction: (postId: number, reactionId: string) => void
  onToggleComments: () => void
  isExpanded: boolean
}

const REACTION_ICON_MAP: Record<string, React.ReactNode> = {
  'thumbsup': <ThumbsUp className="h-3 w-3 text-blue-600" />,
  'heart': <Heart className="h-3 w-3 text-red-600" />,
  'fire': <Flame className="h-3 w-3 text-orange-600" />,
  'smile': <Smile className="h-3 w-3 text-yellow-600" />
}

export default function ResearchPost({
  post,
  reactions,
  onAddReaction,
  onToggleComments,
  isExpanded
}: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-white font-semibold">{post.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-900 dark:text-white">{post.author}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{post.timestamp}</span>
              </div>
              <Badge variant="secondary" className="mt-1 bg-blue-100 dark:bg-primary-300 text-primary dark:text-primary-300">{post.category}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* POST TITLE & CONTENT */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 leading-snug">{post.title}</h3>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{post.content}</p>
        </div>

        {Object.keys(post.reactions).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(post.reactions).map(([reactionId, count]) => (
              <button
                key={reactionId}
                className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-sm flex items-center gap-1"
                onClick={() => onAddReaction(post.id, reactionId)}
              >
                {REACTION_ICON_MAP[reactionId]} <span className="text-xs text-slate-600 dark:text-slate-400">{count}</span>
              </button>
            ))}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex items-center gap-1 pt-2 border-t border-slate-200 dark:border-slate-800">
          {/* Reaction Menu */}
          <ReactionButton 
            reactions={reactions}
            onSelect={(id) => onAddReaction(post.id, id)}
          />

          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            onClick={onToggleComments}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            {post.replies}
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <Share2 className="h-4 w-4 mr-1" />
          </Button>
        </div>

        {/* COMMENTS SECTION */}
        {isExpanded && (
          <CommentSection comments={post.comments} />
        )}
      </CardContent>
    </Card>
  )
}
