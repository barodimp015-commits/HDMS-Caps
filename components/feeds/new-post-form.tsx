'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Send, X } from 'lucide-react'

interface Props {
  onSubmit: (title: string, content: string, category: string) => void
}

export default function NewPostForm({ onSubmit }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('General')

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSubmit(title, content, category)
      setTitle('')
      setContent('')
      setCategory('General')
      setIsOpen(false)
    }
  }

  if (!isOpen) {
    return (
      <Card className="border-blue-200 dark:border-primary bg-gradient-to-r from-blue-50 to-teal-50 dark:from-primary dark:to-teal-950">
        <CardContent className="p-4">
          <div className="flex gap-3 items-center cursor-pointer" onClick={() => setIsOpen(true)}>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-white font-semibold">U</AvatarFallback>
            </Avatar>
            <Input
              placeholder="Share research, ask questions, or discuss findings..."
              readOnly
              className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 cursor-pointer border-slate-200 dark:border-slate-800"
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-950">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Create a new post</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* CATEGORY SELECT */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General">General Discussion</SelectItem>
              <SelectItem value="Genetics">Genetics</SelectItem>
              <SelectItem value="Methods">Methods & Protocols</SelectItem>
              <SelectItem value="Computational Biology">Computational Biology</SelectItem>
              <SelectItem value="Results">Results & Findings</SelectItem>
              <SelectItem value="Question">Question</SelectItem>
            </SelectContent>
          </Select>

          {/* TITLE INPUT */}
          <Input
            placeholder="Post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
          />

          {/* CONTENT TEXTAREA */}
          <Textarea
            placeholder="Share your research, ask questions, or discuss findings..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white min-h-24"
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 justify-end pt-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="border-slate-200 dark:border-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="bg-primary  text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            Post
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
