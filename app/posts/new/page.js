'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const categoryMapping = {
  game: 'Game',
  politics: 'Politics',
  'current-events': 'Current Events',
  music: 'Music',
  general: 'General',
  academics: 'Academics',
};

const categories = Object.values(categoryMapping);

export default function NewPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0]);

  useEffect(() => {
    const categorySlug = searchParams.get('category');
    if (categorySlug && categoryMapping[categorySlug]) {
      setCategory(categoryMapping[categorySlug]);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Title and content are required.');
      return;
    }

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, category }),
    });

    if (res.ok) {
      const categorySlug = Object.keys(categoryMapping).find(key => categoryMapping[key] === category);
      router.push(`/category/${categorySlug || 'general'}`);
      router.refresh();
    } else {
      alert('Failed to create post');
    }
  };

  return (
    <div>
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            className="form-control"
            id="content"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}