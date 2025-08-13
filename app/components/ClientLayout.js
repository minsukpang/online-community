'use client';

import { useEffect } from 'react';
import Navbar from './Navbar'; // 기존 Navbar 컴포넌트 임포트

export default function ClientLayout({ children }) {
  useEffect(() => {
    console.log('ClientLayout useEffect executed. Attempting to load Bootstrap JS...');
    // 로컬에 설치된 bootstrap.bundle.js 파일을 직접 임포트
    import('bootstrap/dist/js/bootstrap.bundle.js')
      .then(() => {
        console.log('Bootstrap JS loaded successfully!');
      })
      .catch(error => {
        console.error('Failed to load Bootstrap JS:', error);
      });
  }, []);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
