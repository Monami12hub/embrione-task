import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "The Embrione - Meet The Team",
  description: "Onboarding & moderation system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-neutral-950 via-purple-950 to-neutral-950 bg-fixed text-white antialiased">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <Toaster richColors theme="dark" position="top-right" />
      </body>
    </html>
  );
}
