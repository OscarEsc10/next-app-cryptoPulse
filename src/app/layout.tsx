import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import "./globals.css";

// Modern, distinctive sans for crypto UI
const sora = Sora({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

// Precise monospace for prices and code
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Crypto",
  description: "Learning 'bout Crypto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Header/>
        {children}
      </body>
    </html>
  );
}
