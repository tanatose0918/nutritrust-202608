import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MedicalDisclaimerBanner from "@/components/layout/MedicalDisclaimerBanner";
import PrimeReactClientProvider from "@/components/providers/PrimeReactClientProvider";

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
  title: "NutriTrust - Supplements & Nutrition Intelligence",
  description: "Independent Nutrition & Supplement Comparison Platform",
  icons: {
    icon: "/nttco.ico",
    shortcut: "/nttco.ico",
    apple: "/nttco.ico",
  },
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
      <body className="flex flex-col min-h-screen font-sans pb-16">
        <PrimeReactClientProvider>
          <Header />
          <main className="bg-white flex-1 flex flex-col min-w-0">
            {children}
          </main>
          <Footer />
          <MedicalDisclaimerBanner />
        </PrimeReactClientProvider>
      </body>
    </html>
  );
}
