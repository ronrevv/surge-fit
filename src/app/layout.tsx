import type { Metadata } from "next";
import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SurgeFit — Operating System for the Fitness Industry",
  description: "AI-powered fitness ecosystem connecting Trainees, Trainers, Gym Branches, Gym Chains, and Fitness Businesses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${jetBrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
