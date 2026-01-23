import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "Renaissance",
  description: "Next-gen football engagement platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider defaultTheme="dark" storageKey="renaissance-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
