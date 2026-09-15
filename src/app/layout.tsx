import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Vidyasys — Learn, Share, Build & Grow",
    template: "%s | Vidyasys",
  },
  description:
    "One platform where students Learn, Share, Build & Grow. Buy/rent academic notes, projects, hardware kits, and book peer tutors at your college.",
  keywords: [
    "student marketplace",
    "academic notes",
    "peer tutoring",
    "college projects",
    "campus marketplace",
    "student ecosystem",
  ],
  openGraph: {
    title: "Vidyasys — Learn, Share, Build & Grow",
    description:
      "One platform where students Learn, Share, Build & Grow. College-focused student ecosystem and marketplace.",
    url: "https://vidyasys.vercel.app",
    siteName: "Vidyasys",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidyasys — Learn, Share, Build & Grow",
    description:
      "One platform where students Learn, Share, Build & Grow.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
