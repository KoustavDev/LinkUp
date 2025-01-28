import BottomBar from "@/components/shared/BottomBar";
import LeftsideBar from "@/components/shared/LeftsideBar";
import Topbar from "@/components/shared/Topbar";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full md:flex">
      <Topbar />
      <div className="flex">
        <div className="fixed top-0 left-0 h-full">
          <LeftsideBar />
        </div>
        <section className=" h-full md:ml-[300px] ml-0 overflow-auto">
          {children}
        </section>
      </div>
      <BottomBar />
    </div>
  );
}
