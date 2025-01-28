import Profile from "@/components/special/Profile";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

export default async function Layout({ children, params }: LayoutProps) {
  const { id } = await params;
  return (
    <div className="profile-container mb-16 lg:mb-0">
      <Profile userId={id} />
      <section>{children}</section>
    </div>
  );
}
