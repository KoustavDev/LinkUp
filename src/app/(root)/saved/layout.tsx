import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkUp - save",
  description: "Saved post on LinkUp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section>{children}</section>;
}
