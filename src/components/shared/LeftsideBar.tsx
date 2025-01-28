"use client";
import { INavLink } from "@/app/types";
import { sidebarLinks } from "@/constant";
import { useAuthProvider } from "@/context/AuthProvider";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useSignout } from "@/backend/queryAndMutation";
import Loader from "./Loader";

const LeftsideBar = () => {
  const { user, loading } = useAuthProvider();
  const pathName = usePathname();
  const router = useRouter();
  const { mutate: signOut, isSuccess } = useSignout();
  useEffect(() => {
    if (isSuccess) {
      router.push("/sign-in");
    }
  }, [isSuccess, router]);

  return (
    <nav className="leftsidebar h-[100svh]">
      <div className="flex flex-col gap-11">
        <Link href="/" className="flex gap-4 items-center">
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={50}
            height={50}
            priority
          />
          <p className="logo-text">LinkUp</p>
        </Link>
        {loading || !user.email ? (
          <div className="h-14">
            <Loader />
          </div>
        ) : (
          <Link
            href={`/profile/${user.id}`}
            className="flex gap-3 items-center"
          >
            <Image
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              height={56}
              width={56}
              className="rounded-full"
              priority
            />
            <div className="flex flex-col">
              <p className="body-bold">{user.name}</p>
              <p className="small-regular text-light-3">@{user.username}</p>
            </div>
          </Link>
        )}
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((item: INavLink) => {
            const isActive =
              item.route === "/"
                ? pathName === "/"
                : pathName.startsWith(item.route);
            // in simple way
            //  if (item.route === "/") {
            //    isActive = pathName === "/";
            //  } else {
            //    isActive = pathName.startsWith(item.route);
            //  }
            return (
              <li
                key={item.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
              >
                <Link href={item.route} className="flex gap-4 items-center p-4">
                  <Image
                    src={item.imgURL}
                    alt={item.label}
                    width={19}
                    height={19}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={() => signOut()}
      >
        <Image
          src="/assets/icons/logout.svg"
          alt="logout"
          width={19}
          height={19}
        />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftsideBar;
