'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from 'react';
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Community",
  description: "A simple community board",
};

import Navbar from './components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container mt-4">
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </main>
        {/* Bootstrap JavaScript를 next/script 컴포넌트로 로드 */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="beforeInteractive" // lazyOnload 대신 beforeInteractive 사용
        />
      </body>
    </html>
  );
}