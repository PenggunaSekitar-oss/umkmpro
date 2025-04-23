
import React from "react";
import { BottomNav } from "../ios-ui/BottomNav";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  activeRoute?: string;
}

export function AppLayout({ children, title, activeRoute }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-ios-gray-100">
      <header className="ios-blur sticky top-0 z-40 w-full border-b border-ios-gray-200">
        <div className="container mx-auto flex h-16 items-center justify-center">
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
      </header>
      <main className="container mx-auto pt-4 pb-24 px-4">
        {children}
      </main>
      <BottomNav activeRoute={activeRoute} />
    </div>
  );
}
