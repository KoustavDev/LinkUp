'use client'
import React from 'react'
import { usePathname } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import { bottombarLinks } from '@/constant';

const BottomBar = () => {
  const pathName = usePathname();
  return (
    <section className="bottom-bar fixed bottom-0">
      {bottombarLinks.map((link) => {
        const isActive =
          link.route === "/"
            ? pathName === "/"
            : pathName.startsWith(link.route);
        return (
          <Link
            key={`bottombar-${link.label}`}
            href={link.route}
            className={`${
              isActive && "rounded-[10px] bg-primary-500 "
            } flex-center flex-col gap-1 p-2 transition`}
          >
            <Image
              src={link.imgURL}
              alt={link.label}
              width={16}
              height={16}
              className={`${isActive && "invert-white"}`}
            />

            <p className="tiny-medium text-light-2">{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
}

export default BottomBar