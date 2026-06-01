'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ThumbsUp, MessageSquare, Flag } from 'lucide-react'

// Sample comments data
const initialComments = [
    {
        id: 1,
        user: {
            name: 'AnimeKing42',
            avatar: '/placeholder.svg?height=40&width=40',
        },
        content:
            'This episode was amazing! The animation quality during the fight scenes was top-notch.',
        date: '2 days ago',
        likes: 24,
        replies: 3,
    },
    {
        id: 2,
        user: {
            name: 'MangaReader',
            avatar: '/placeholder.svg?height=40&width=40',
        },
        content:
            'As a manga reader, I was worried about how they would adapt this arc, but they did an excellent job. The pacing was perfect.',
        date: '3 days ago',
        likes: 18,
        replies: 2,
    },
    {
        id: 3,
        user: {
            name: 'NewToAnime',
            avatar: '/placeholder.svg?height=40&width=40',
        },
        content:
            "I'm new to this series. Is it worth starting from season 1? Or can I just watch this season?",
        date: '5 days ago',
        likes: 7,
        replies: 5,
    },
]

export function Comments() {
    const [comments, setComments] = useState(initialComments)
    const [newComment, setNewComment] = useState('')

    const handleAddComment = () => {
        if (!newComment.trim()) return

        const comment = {
            id: comments.length + 1,
            user: {
                name: 'You',
                avatar: '/placeholder.svg',
            },
            content: newComment,
            date: 'Just now',
            likes: 0,
            replies: 0,
        }

        setComments([comment, ...comments])
        setNewComment('')
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-xl font-bold">
                    Comments ({comments.length})
                </h3>
                {/*  comment form  */}
                <form className="flex gap-4">
                    <div className="h-10 w-10">
                        <Image
                            src="/placeholder.svg"
                            alt="Your avatar"
                            className="rounded-full"
                            width={40}
                            height={40}
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <textarea
                            placeholder="Add a comment..."
                            className="w-full resize-none border-gray-700 bg-gray-900"
                            value={newComment}
                            onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                            ) => setNewComment(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                            >
                                Comment
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex justify-center gap-4">
                        <div className="flex h-10 w-10 flex-col items-center justify-center">
                            <Image
                                src={comment.user.avatar}
                                alt={comment.user.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <div>{comment.user.name.slice(0, 2)}</div>
                        </div>
                        <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                                <span className="font-medium">
                                    {comment.user.name}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {comment.date}
                                </span>
                            </div>
                            <p className="mb-2 text-gray-300">
                                {comment.content}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                <button className="flex items-center gap-1 hover:text-gray-300">
                                    <ThumbsUp className="h-4 w-4" />
                                    <span>{comment.likes}</span>
                                </button>
                                <button className="flex items-center gap-1 hover:text-gray-300">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{comment.replies} replies</span>
                                </button>
                                <button className="flex items-center gap-1 hover:text-gray-300">
                                    <Flag className="h-4 w-4" />
                                    <span>Report</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
