import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NutriTrust Web Application",
  description: "NutriTrust Web Application for Comparing Supplements and Vitamins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${plusJakartaSans.variable} ${notoSansThai.variable} h-full antialiased`}
    >
      <body className="flex flex-col min-h-screen font-sans">
        <Header />
        <main className="bg-white flex-1 flex flex-col min-w-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

