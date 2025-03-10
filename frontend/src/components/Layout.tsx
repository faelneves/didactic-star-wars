import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed z-10 top-0 left-0 right-0 py-[14px] flex justify-center shadow-header bg-white">
        <span className="font-bold text-[18px] text-green-teal">SWStarter</span>
      </header>
      <main className="bg-ligth-silver flex-1">
        <div className="pt-20 md:px-8 container mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}