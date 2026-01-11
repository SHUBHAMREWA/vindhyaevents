import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google"; // Elegant & Modern fonts
import "@/styles/index.css";

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  display: "swap" 
});

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit",
  display: "swap" 
});

export const metadata: Metadata = {
  title: "Elegant Wedding Website | Timeless Memories",
  description: "Beautifully Crafted, Perfectly Planned Wedding Events and Decor Services.",
   icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${playfair.variable} ${outfit.variable}`}>
      <body className="antialiased font-sans">
        {children}
        


      </body>
    </html>
  );
}
