'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import ResearchPost from '@/components/feeds/research-post'
import NewPostForm from '@/components/feeds/new-post-form'
import { ThumbsUp, Heart, Flame, Smile, Leaf } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
    const [herbariumContributions] = useState([
      { year: 2024, specimens: 245, families: 18, sites: 5 },
      { year: 2023, specimens: 320, families: 22, sites: 7 },
      { year: 2022, specimens: 285, families: 20, sites: 6 },
    ])

return (
  <div className="min-h-screen bg-white">
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN – FEED */}
        <div className="lg:col-span-2 space-y-6">

          {/* NEW POST BOX */}
          <NewPostForm onSubmit={handleNewPost} />
   

          {/* CATEGORY FILTER */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['All', 'Genetics', 'Methods', 'Computational Biology', 'Results'].map(cat => (
              <Badge
                key={cat}
                variant={cat === 'All' ? 'default' : 'outline'}
                className="px-4 py-1 rounded-full text-sm border-gray-300 hover:bg-green-600 hover:text-white transition"
              >
                {cat}
              </Badge>
            ))}
          </div>

          {/* POSTS FEED */}
          <div className="space-y-6">
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

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-1 space-y-6">

          {/* Submit Specimens */}
          <Card className="border-gray-200 shadow-sm rounded-xl">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-green-700">Submit New Specimens</CardTitle>
              <CardDescription>Add digitized specimens to the herbarium collection</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Link href={'/researcher/specimens/new'}>
                <Button className="bg-primary hover:bg-green-800 text-white w-full">
                  <Leaf className="h-4 w-4 mr-2" />
                  Upload Specimens
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border-gray-200 shadow-sm rounded-xl">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-green-700">Contribution Summary</CardTitle>
              <CardDescription>Total herbarium contributions and impact metrics</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <p className="text-xs text-gray-600">Total Specimens</p>
                <p className="text-2xl font-bold text-green-700">850</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <p className="text-xs text-gray-600">Plant Families</p>
                <p className="text-2xl font-bold text-green-700">60</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <p className="text-xs text-gray-600">Collection Sites</p>
                <p className="text-2xl font-bold text-green-700">18</p>
              </div>
            </CardContent>
          </Card>

          {/* Yearly Contributions */}
          <Card className="border-gray-200 shadow-sm rounded-xl">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-green-700 flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Herbarium Contributions
              </CardTitle>
              <CardDescription>Your contributions to the MSU Herbarium collection</CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-3">
              {herbariumContributions.map((contrib, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <div>
                    <p className="text-xs text-gray-500">Year</p>
                    <p className="font-semibold text-green-700">{contrib.year}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Specimens</p>
                    <p className="font-semibold">{contrib.specimens}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Families</p>
                    <p className="font-semibold">{contrib.families}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sites</p>
                    <p className="font-semibold">{contrib.sites}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

      </div>
    </main>
  </div>
)

}
