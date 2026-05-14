'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PostEditor from '@/components/PostEditor';
import { ApiPost } from '@/lib/hooks';

export default function EditPostPage() {
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
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
    </div>
  );

  if (!post) return (
    <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Post not found.</div>
  );

  return <PostEditor mode="edit" initial={post} postId={id} />;
}
