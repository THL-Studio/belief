import type {Metadata} from 'next';
import {GeistSans} from 'geist/font/sans'; // Updated import for Geist Sans
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Link from 'next/link';
import { Newspaper } from 'lucide-react'; // Using an appropriate icon

export const metadata: Metadata = {
  title: 'Belief News',
  description: 'Your simple news feed.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="antialiased flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Newspaper className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Belief</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 container py-8">
          {children}
        </main>
         <footer className="py-6 md:px-8 md:py-0 border-t bg-background">
           <div className="container flex flex-col items-center justify-center gap-4 md:h-20 md:flex-row">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built by Firebase Studio.
              </p>
            </div>
         </footer>
        <Toaster />
      </body>
    </html>
  );
}
