'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { categoryMapping, categories } from '@/lib/constants';
import { supabase } from '@/lib/db'; // Import supabase client

export default function NewPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const categorySlug = searchParams.get('category');
    if (categorySlug && categoryMapping[categorySlug]) {
      setCategory(categoryMapping[categorySlug]);
    }
  }, [searchParams]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Title and content are required.');
      return;
    }

    let imageUrl = null;

    if (file) {
      setUploading(true);
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        alert('Failed to upload image.');
        setUploading(false);
        return;
      }
      
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
      setUploading(false);
    }

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, category, imageurl: imageUrl }),
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
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Image (Optional)</label>
          <input 
            type="file"
            className="form-control"
            id="image"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}