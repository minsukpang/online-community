
import CommentsSection from './CommentsSection';

async function getPost(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch post');
  }
  return res.json();
}

async function getComments(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}/comments`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch comments');
  }
  return res.json();
}

export default async function PostDetailPage({ params }) {
  const { id } = params;
  const post = await getPost(id);
  const comments = await getComments(id);

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">{post.title}</h1>
          <h6 className="card-subtitle mb-2 text-muted">Category: {post.category}</h6>
          <p className="card-text">{post.content}</p>
        </div>
      </div>

      <hr className="my-4" />

      <CommentsSection postId={id} initialComments={comments} />
    </div>
  );
}
