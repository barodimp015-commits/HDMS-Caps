'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import ResearchPost from '@/components/feeds/research-post'
import NewPostForm from '@/components/feeds/new-post-form'
import { ThumbsUp, Heart, Flame, Smile } from 'lucide-react'

interface Comment {
  id: number
  author: string
  avatar: string
  content: string
  timestamp: string
  reactions: Record<string, number>
}

interface Post {
  id: number
  author: string
  avatar: string
  timestamp: string
  title: string
  content: string
  category: string
  replies: number
  reactions: Record<string, number> // allow arbitrary keys
  comments: Comment[]
}

interface ReactionOption {
  icon: React.ReactNode
  id: string
  label: string
}

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: 'Dr. Sarah Chen',
    avatar: 'SC',
    timestamp: '2 hours ago',
    title: 'Novel gene expression patterns in C. elegans',
    content:
      'We discovered unexpected oscillatory patterns in the expression of stress-response genes. The findings challenge current models of gene regulation. Looking for feedback on our analysis approach.',
    category: 'Genetics',
    replies: 8,
    reactions: {
      thumbsup: 24,
      heart: 12,
      fire: 5,
      smile: 3
    },
    comments: [
      {
        id: 1,
        author: 'Dr. James Park',
        avatar: 'JP',
        content:
          'This is fascinating! Have you considered analyzing phase relationships with circadian markers?',
        timestamp: '1 hour ago',
        reactions: { thumbsup: 4 }
      },
      {
        id: 2,
        author: 'Dr. Emma Wilson',
        avatar: 'EW',
        content:
          'Have you tried single-cell transcriptomics to validate these patterns?',
        timestamp: '45 min ago',
        reactions: { thumbsup: 2, heart: 1 }
      }
    ]
  },
  {
    id: 2,
    author: 'Prof. Michael Zhang',
    avatar: 'MZ',
    timestamp: '4 hours ago',
    title: 'Question: Best practices for metagenomics pipeline validation',
    content:
      'I am setting up a new metagenomics pipeline and want to ensure robust validation. What are the current best practices for contamination detection and taxonomic assignment validation?',
    category: 'Methods',
    replies: 15,
    reactions: {
      thumbsup: 18
    },
    comments: [
      {
        id: 1,
        author: 'Dr. Alex Rodriguez',
        avatar: 'AR',
        content:
          'Consider using CheckM for genome quality assessment and PhyloPhlAn for taxonomic profiling. Both are industry standards.',
        timestamp: '3 hours ago',
        reactions: { thumbsup: 8, heart: 2 }
      }
    ]
  }
]

const REACTION_ICONS: ReactionOption[] = [
  { icon: <ThumbsUp className="h-4 w-4 text-blue-600" />, id: 'thumbsup', label: 'Thumbs up' },
  { icon: <Heart className="h-4 w-4 text-red-600" />, id: 'heart', label: 'Heart' },
  { icon: <Flame className="h-4 w-4 text-orange-600" />, id: 'fire', label: 'Fire' },
  { icon: <Smile className="h-4 w-4 text-yellow-600" />, id: 'smile', label: 'Smile' }
]

export default function ResearchFeed() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS)
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set())

  const handleNewPost = (title: string, content: string, category: string) => {
    const newPost: Post = {
      id: posts.length + 1,
      author: 'You',
      avatar: 'U',
      timestamp: 'now',
      title,
      content,
      category,
      replies: 0,
      reactions: {}, // start empty, increment dynamically
      comments: []
    }
    setPosts([newPost, ...posts])
  }

  const toggleComments = (postId: number) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
    }
    setExpandedComments(newExpanded)
  }

  const addReaction = (postId: number, reactionId: string) => {
    setPosts(
      posts.map(post => {
        if (post.id === postId) {
          const reactions = { ...post.reactions }
          reactions[reactionId] = (reactions[reactionId] || 0) + 1
          return { ...post, reactions }
        }
        return post
      })
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* NEW POST FORM */}
        <NewPostForm onSubmit={handleNewPost} />

        {/* CATEGORY BADGES */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['All', 'Genetics', 'Methods', 'Computational Biology', 'Results'].map(cat => (
            <Badge
              key={cat}
              variant={cat === 'All' ? 'default' : 'secondary'}
              className="whitespace-nowrap cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 transition"
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* POSTS FEED */}
        <div className="space-y-4">
          {posts.map(post => (
            <ResearchPost
              key={post.id}
              post={post}
              reactions={REACTION_ICONS}
              onAddReaction={addReaction}
              onToggleComments={() => toggleComments(post.id)}
              isExpanded={expandedComments.has(post.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
