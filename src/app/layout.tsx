import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Laundry Hub",
    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    template: `%s | Laundry Hub`,
  },
  openGraph: {
    description: "create with love and neat",
    images: "/landing-page.png",
  },
  // applicationName: "google-site-verification",
  // verification: {
  // 	google: "nriBV-HuufyRSMI3ohhaOVYR2alVHQkkOlDUEeJGnoI",
  // },
  metadataBase: new URL("https://laundry-hub.vercel.app/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.className} bg-[#EBEBEB] antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
