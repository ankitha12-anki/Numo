import React from 'react';
import AnoAI from '@/src/components/ui/animated-shader-background';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white">
      <AnoAI />
      <main className="relative z-10 flex min-h-screen items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
