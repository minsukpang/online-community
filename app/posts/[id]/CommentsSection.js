'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/db';

function CommentItem({ comment, postId, onReplySuccess }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyFile, setReplyFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setReplyFile(e.target.files[0]);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent) return;

    let imageUrl = null;
    if (replyFile) {
      setUploading(true);
      const fileName = `${Date.now()}_${replyFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, replyFile);

      if (uploadError) {
        console.error('Error uploading reply image:', uploadError);
        alert('Failed to upload image.');
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
      setUploading(false);
    }

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: replyContent, parentId: comment.id, imageurl: imageUrl }),
    });

    if (res.ok) {
      setReplyContent('');
      setReplyFile(null);
      setShowReplyForm(false);
      onReplySuccess();
    } else {
      alert('Failed to post reply');
    }
  };

  return (
    <li className="list-group-item mb-2">
      <div>{comment.content}</div>
      {comment.imageurl && (
        <img src={comment.imageurl} alt="Comment image" className="img-fluid rounded my-2" style={{ maxHeight: '200px' }} />
      )}
      <small className="text-muted">Posted at: {new Date(comment.createdat).toLocaleString()}</small>
      <button className="btn btn-sm btn-link" onClick={() => setShowReplyForm(!showReplyForm)}>
        {showReplyForm ? 'Cancel' : 'Reply'}
      </button>

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="mt-2">
          <textarea
            className="form-control mb-2"
            rows="2"
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          ></textarea>
          <div className="mb-2">
            <label htmlFor={`reply-image-${comment.id}`} className="form-label small">Image (Optional)</label>
            <input type="file" className="form-control form-control-sm" id={`reply-image-${comment.id}`} onChange={handleFileChange} accept="image/*" />
          </div>
          <button type="submit" className="btn btn-sm btn-primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Post Reply'}
          </button>
        </form>
      )}

      {comment.children && comment.children.length > 0 && (
        <ul className="list-group mt-2 ms-4">
          {comment.children.map(childComment => (
            <CommentItem
              key={childComment.id}
              comment={childComment}
              postId={postId}
              onReplySuccess={onReplySuccess}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function CommentsSection({ postId, initialComments }) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchComments = async () => {
    const res = await fetch(`/api/posts/${postId}/comments`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setComments(data);
    } else {
      console.error('Failed to fetch comments');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) return;

    let imageUrl = null;
    if (newFile) {
      setUploading(true);
      const fileName = `${Date.now()}_${newFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, newFile);

      if (uploadError) {
        console.error('Error uploading comment image:', uploadError);
        alert('Failed to upload image.');
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
      setUploading(false);
    }

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newComment, imageurl: imageUrl }),
    });

    if (res.ok) {
      setNewComment('');
      setNewFile(null);
      // Reset file input
      const fileInput = document.getElementById('comment-image');
      if(fileInput) fileInput.value = '';
      fetchComments();
    } else {
      alert('Failed to post comment');
    }
  };

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  return (
    <div>
      <h2>Comments</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="3"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="comment-image" className="form-label">Image (Optional)</label>
          <input type="file" className="form-control" id="comment-image" onChange={handleFileChange} accept="image/*" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Post Comment'}
        </button>
      </form>

      <ul className="list-group">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onReplySuccess={fetchComments}
            />
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </ul>
    </div>
  );
}