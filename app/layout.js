import 'bootstrap/dist/css/bootstrap.min.css';
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from 'react';
// import Navbar from './components/Navbar'; // Navbar 임포트 제거

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Community",
  description: "A simple community board",
};

// ClientLayout 컴포넌트를 임포트할 예정
import ClientLayout from './components/ClientLayout';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navbar 대신 ClientLayout을 렌더링 */}
        <ClientLayout>
          <main className="container mt-4">
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </main>
        </ClientLayout>
      </body>
    </html>
  );
}