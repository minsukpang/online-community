'use client';

import Link from 'next/link';

const categoryMapping = {
  game: 'Game',
  politics: 'Politics',
  'current-events': 'Current Events',
  music: 'Music',
  general: 'General',
  academics: 'Academics',
};

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link href="/" className="navbar-brand">Community</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {Object.entries(categoryMapping).map(([slug, name]) => (
              <li key={slug} className="nav-item">
                <Link href={`/category/${slug}`} className="nav-link">
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}