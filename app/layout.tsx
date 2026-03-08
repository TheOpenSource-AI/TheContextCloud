import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { UniversalSearch } from "@/components/organisms/UniversalSearch";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Context Cloud | AI-Native Enterprise Context",
  description: "The Context Infrastructure for the Agentic Enterprise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-slate-50 flex h-screen overflow-hidden`}>
        <SidebarLayout />
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 z-10 shrink-0">
            <div className="flex items-center gap-4">
              <UniversalSearch />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-slate-500">Workspace: Demo Prod</div>
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm">
                JD
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-auto custom-scrollbar relative">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
