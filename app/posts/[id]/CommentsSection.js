'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function CommentItem({ comment, postId, onReplySuccess }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent) return;

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: replyContent, parentId: comment.id }),
    });

    if (res.ok) {
      setReplyContent('');
      setShowReplyForm(false);
      onReplySuccess(); // Callback to refresh comments in parent
    } else {
      alert('Failed to post reply');
    }
  };

  return (
    <li className="list-group-item mb-2">
      <div>{comment.content}</div>
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
          <button type="submit" className="btn btn-sm btn-primary">Post Reply</button>
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
  const router = useRouter();

  const fetchComments = async () => {
    const res = await fetch(`/api/posts/${postId}/comments`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      console.log('Fetched comments data:', data); // ADD THIS LOG
      setComments(data);
    } else {
      console.error('Failed to fetch comments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) return;

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: newComment }),
    });

    console.log('Response object:', res);
    console.log('res.ok:', res.ok);

    if (res.ok) {
      console.log('Comment posted successfully! Updating UI...');
      setNewComment('');
      fetchComments(); // Refresh comments after posting new one
    } else {
      console.log('Comment post failed. Alerting user.');
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
        <button type="submit" className="btn btn-primary">Post Comment</button>
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