import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Use Bootstrap instead of Tailwind
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Image Analysis App",
    description: "Upload an image and analyze it with AI models.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {children}
                <SpeedInsights />
            </body>
        </html>
    );
}
