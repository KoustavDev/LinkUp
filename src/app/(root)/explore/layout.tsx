import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkUp - Explore",
  description: "Explore in LinkUp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section>{children}</section>;
}
