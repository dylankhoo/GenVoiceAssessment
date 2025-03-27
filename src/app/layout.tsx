import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./styles/globals.css";

import Header from "@/components/ui/Header";

export const metadata: Metadata = {
  title: "GenVoice Assessment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body>
          <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex flex-1 flex-col px-4 pt-10 xl:px-8">
              {children}
            </main>
          </div>
        </body>
      </html>
      <Toaster />
    </>
  );
}
