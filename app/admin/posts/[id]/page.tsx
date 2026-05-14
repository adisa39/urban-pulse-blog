'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PostEditor from '@/components/PostEditor';
import { ApiPost } from '@/lib/hooks';

export default function AdminEditPostByIdPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<ApiPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(r => r.json())
      .then(data => { setPost(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
    </div>
  );

  if (!post) return (
    <div className="text-center py-24">
      <p className="font-serif text-xl mb-2" style={{ color: 'var(--text-primary)' }}>Post not found</p>
      <p style={{ color: 'var(--text-muted)' }}>The post with ID &quot;{id}&quot; could not be found.</p>
    </div>
  );

  return <PostEditor mode="edit" initial={post} postId={id} />;
}
