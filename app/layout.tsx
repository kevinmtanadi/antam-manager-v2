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
          <main className="flex w-full bg-default-50 h-screen">
            <Sidebar />
            <div className="ml-[65px] flex w-full justify-center">
              <div className="max-w-[1000px] w-11/12">
                <div className="mx-auto">{children}</div>
              </div>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
