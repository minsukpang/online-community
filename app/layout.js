'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense, useEffect } from 'react'; // useEffect 임포트

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Community",
  description: "A simple community board",
};

import Navbar from './components/Navbar';

export default function RootLayout({ children }) {
  useEffect(() => {
    console.log('Attempting to load Bootstrap JS...');
    // 클라이언트 사이드에서만 실행되도록 동적 임포트 사용
    // 로컬에 설치된 bootstrap.bundle.js 파일을 직접 임포트
    import('bootstrap/dist/js/bootstrap.bundle.js')
      .then(() => {
        console.log('Bootstrap JS loaded successfully!');
      })
      .catch(error => {
        console.error('Failed to load Bootstrap JS:', error);
      });
  }, []); // 한 번만 실행되도록 빈 배열 전달

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container mt-4">
          <Suspense fallback={<div>Loading...</div>}>            {children}
          </Suspense>
        </main>
      </body>
    </html>
  );
}
