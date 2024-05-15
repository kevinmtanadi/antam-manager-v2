import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./Sidebar";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Antam Manager",
  description: "Antam Manager App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <main className="flex w-full">
            <Sidebar />
            <div className="w-8/12 sm:w-10/12 max-w-5xl mx-auto">
              <div className="mx-auto">{children}</div>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
