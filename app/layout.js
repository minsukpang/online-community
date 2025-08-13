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
  // 클라이언트 컴포넌트에서만 실행되도록 useEffect 사용
  useEffect(() => {
    // Bootstrap JavaScript 파일을 동적으로 로드
    // window 객체가 브라우저 환경에서만 존재하므로 조건부 렌더링
    if (typeof window !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []); // 한 번만 실행되도록 빈 배열 전달

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container mt-4">
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </body>
    </html>
  );
}
