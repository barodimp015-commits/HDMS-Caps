export interface Comment {
  id: number
  author: string
  avatar: string
  content: string
  timestamp: string
  reactions: Record<string, number>
}

export interface Post {
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

export interface ReactionOption {
  icon: React.ReactNode
  id: string
  label: string
}


export interface HerbariumContribution {
  year: number
  specimens: number
  families: number
  sites: number
}