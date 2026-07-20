import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0A0B0E] text-[#e2e2e9] font-sans h-screen flex flex-col overflow-hidden">
      {/* Native Window Titlebar Area */}
      <div className="h-8 w-full bg-[#0A0B0E] fixed top-0 left-0 z-50 app-region-drag border-b border-white/5"></div>
      
      <TopNavBar />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <div className="flex-1 md:ml-20 flex flex-col h-full overflow-hidden">
          <main className="flex-1 overflow-y-auto mt-24 p-8 relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
