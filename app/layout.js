'use client'; // 이 지시어는 이미 추가됨

import 'bootstrap/dist/css/bootstrap.min.css';
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from 'react';
import Script from 'next/script'; // Script 컴포넌트 임포트

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
          strategy="lazyOnload" // 페이지 로드 후 스크립트 로드
        />
      </body>
    </html>
  );
}
