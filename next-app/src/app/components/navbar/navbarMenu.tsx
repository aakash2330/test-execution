"use client";

import Link from "next/link";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavbarMenu({ session }: { session: Session | null }) {
  const path = usePathname();
  return (
    <div
      className={cn(
        `flex h-[4rem] w-full items-center justify-between px-12 ${path == "/login" ? "hidden" : "flex"}`,
      )}
    >
      <div className="flex gap-5">
        <NavbarMenuItem href={"/"} title="100x Challenges"></NavbarMenuItem>
      </div>
      {session?.user ? (
        <Button
          onClick={async () => {
            await signOut();
          }}
          className="bg-neutral-700"
        >
          Logout
        </Button>
      ) : (
        <Button className="bg-neutral-700">
          <Link href={"/api/auth/signin"}>Login</Link>
        </Button>
      )}
    </div>
  );
}

function NavbarMenuItem({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      className="font-light text-neutral-700 hover:cursor-pointer hover:underline"
    >
      {title}
    </Link>
  );
}