import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkUp - Create Post",
  description: "Create post on LinkUp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section>{children}</section>;
}
