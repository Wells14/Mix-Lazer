import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useResponsive } from '@/hooks/useResponsive';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isMobile, isTablet } = useResponsive();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main 
        className={`
          flex-1 
          transition-all 
          duration-300 
          p-4 
          ${isMobile ? 'ml-0' : 'ml-64'}
          ${isTablet ? 'ml-16' : ''}
        `}
      >
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
