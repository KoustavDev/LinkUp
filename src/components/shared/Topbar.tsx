  "use client";
  import Image from "next/image";
  import Link from "next/link";
  import React, { useEffect } from "react";
  import { Button } from "../ui/button";
  import { useSignout } from "@/backend/queryAndMutation";
  import { useRouter } from "next/navigation";
  import { useAuthProvider } from "@/context/AuthProvider";

  const Topbar = () => {
    const { mutate: signOut, isSuccess } = useSignout();
    const router = useRouter();
    const { user } = useAuthProvider();
    useEffect(() => {
      if (isSuccess) {
        router.push("/sign-in");
      }
    }, [isSuccess, router]);

    // async function signOutHandeler() {
    //   try {
    //     const session = await authService.logout();
    //     console.log(session);
    //     if (session) {
    //       router.push("/sign-in");
    //     }
    //   } catch (error) {
    //     console.log(error, "in topbar session");
    //   }
    // }
    return (
      <section className="topbar">
        <div className="flex-between py-4 px-5">
          <Link href="/" className="flex gap-4 items-center">
            <Image
              src="/assets/images/logo.svg"
              alt="logo"
              width={40}
              height={40}
              priority
            />
            <p className="logo-text">LinkUp</p>
          </Link>
          <div className="flex gap-4">
            <Button
              variant="ghost"
              className="shad-button_ghost"
              onClick={() => signOut()}
            >
              <Image
                src={"/assets/icons/logout.svg"}
                alt="logout"
                width={20}
                height={30}
              />
            </Button>
            <Link href={`/profile/${user.id}`} className="flex-center gap-3">
              <Image
                src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                alt="profile"
                height={32}
                width={32}
                className="rounded-full"
              />
            </Link>
          </div>
        </div>
      </section>
    );
  };

  export default Topbar;
