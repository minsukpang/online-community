
import Link from 'next/link';

const categories = [
  { name: 'Game', slug: 'game', description: 'All about games' },
  { name: 'Politics', slug: 'politics', description: 'Political discussions' },
  { name: 'Current Events', slug: 'current-events', description: 'Latest news and events' },
  { name: 'Music', slug: 'music', description: 'Music and artists' },
  { name: 'General', slug: 'general', description: 'Anything and everything' },
  { name: 'Academics', slug: 'academics', description: 'Study and research' },
];

export default function HomePage() {
  return (
    <div>
      <h1 className="text-center mb-4">Select a Category</h1>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {categories.map((category) => (
          <div key={category.slug} className="col">
            <Link href={`/category/${category.slug}`} className="text-decoration-none">
              <div className="card h-100 text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{category.name}</h5>
                  <p className="card-text text-muted">{category.description}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
