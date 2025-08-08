
import Link from 'next/link';

// Helper function to capitalize category name for display
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function getPosts(categoryName) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/category/${categoryName}`, { cache: 'no-store' });
  if (!res.ok) {
    // Return an empty array if the category doesn't exist or another error occurs
    return [];
  }
  return res.json();
}

export default async function CategoryPage({ params }) {
  const { categoryName } = params;
  const posts = await getPosts(categoryName);
  const displayCategoryName = capitalize(categoryName.replace('-', ' '));

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{displayCategoryName}</h1>
        <Link href={`/posts/new?category=${categoryName}`} className="btn btn-primary">New Post</Link>
      </div>
      <div className="list-group">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`} className="list-group-item list-group-item-action">
              {post.title}
            </Link>
          ))
        ) : (
          <p>No posts in this category yet.</p>
        )}
      </div>
    </div>
  );
}
