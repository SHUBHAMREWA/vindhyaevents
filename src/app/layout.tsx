import type { Metadata } from "next";
import "@/styles/index.css";

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
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
        


      </body>
    </html>
  );
}
