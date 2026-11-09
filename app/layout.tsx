import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Do Rio à Cuia",
  description: "Cotação justa para quem produz, açaí seguro para quem consome.",
};

export const viewport: Viewport = {
  themeColor: "#3F1A52",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
