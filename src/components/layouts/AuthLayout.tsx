
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-ios-gray-100 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-ios-blue">{title}</h1>
          {subtitle && <p className="text-ios-gray-600">{subtitle}</p>}
        </div>
        <div className="ios-card p-6 shadow-md">{children}</div>
      </div>
    </div>
  );
}
