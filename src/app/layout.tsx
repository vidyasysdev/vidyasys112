import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { CommandPalette } from "@/components/search/CommandPalette";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Vidyasys — Your Polytechnic. Your Resources. Your Ecosystem.",
    template: "%s | Vidyasys",
  },
  description:
    "Vidyasys brings academic resources, projects, peer learning and student services together in one platform. Launching with Vidyalankar Polytechnic.",
  keywords: [
    "student ecosystem",
    "polytechnic notes",
    "peer tutoring",
    "academic projects",
    "campus marketplace",
    "vidyalankar polytechnic",
  ],
  openGraph: {
    title: "Vidyasys — Your Polytechnic. Your Resources. Your Ecosystem.",
    description:
      "Academic resources, projects, peer learning and student services in one platform.",
    url: "https://vidyasys.in",
    siteName: "Vidyasys",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidyasys — Your Polytechnic. Your Resources. Your Ecosystem.",
    description: "Academic resources, projects, peer learning and student services in one platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const themeInit = `try{var t=localStorage.getItem("vidyasys-theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-screen bg-canvas text-ink font-sans antialiased">
        <ThemeProvider>
          {children}
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
