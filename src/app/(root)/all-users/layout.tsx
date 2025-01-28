import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkUp - all user",
  description: "All users on LinkUp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>{children}</section>
  );
}
