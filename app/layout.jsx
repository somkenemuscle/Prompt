import { Inter } from "next/font/google";
import '@styles/globals.css'
const inter = Inter({ subsets: ["latin"] });
import {
  ClerkProvider
} from "@clerk/nextjs";

export const metadata = {
  title: "Prompt",
  description: "Generated Prompts For Ai",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
