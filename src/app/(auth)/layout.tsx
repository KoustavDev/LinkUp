"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuth = false;
  const router = useRouter();
  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (cookieFallback) {
      router.back();
    }
  }, [router]);
  if (isAuth) {
    router.push("/");
    return null; // Prevent rendering during the redirect
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login Form */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/images/logo.svg"
                width={32}
                height={32}
                alt="Logo"
                className="h-8 w-auto"
                priority
              />
              <h1 className="text-xl font-bold">LinkUp</h1>
            </div>
          </div>

          {/* Login Form */}
          {children}
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/side-img.svg"
            alt="Authentication background"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 0vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}
