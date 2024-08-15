import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import Provider from "@/components/Layout/Provider";
import Layout from "@/components/Layout";
import { PreloaderProvider } from "@/components/Layout/PreloaderContext";
import { ThemeProvider } from "@/components/Layout/Theme-Provider";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Compadre",
  description: "Your AI compadre through and through",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <Provider>
          <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <PreloaderProvider>
                <Layout>
                  {children}
                </Layout>
              </PreloaderProvider>
            </ThemeProvider>
          </body>
        </Provider>
      </html>
    </ClerkProvider>
  );
}