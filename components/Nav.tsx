"use client";

import Link from "next/link";
import { Sigil } from "./Sigil";

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
      {/* Sigil — ARG entry point on surface */}
      <Link
        href="/the-gate"
        className="opacity-60 hover:opacity-100 transition-opacity duration-500"
        aria-label="Sigil"
      >
        <Sigil variant="vermilion" size={32} />
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-6 md:gap-8">
        {[
          { href: "/the-legend", label: "The Legend" },
          { href: "/shingo-today", label: "Shingo Today" },
          { href: "/get-there", label: "Get There" },
          { href: "/objects", label: "Objects" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="label text-[#F5F2EB] opacity-70 hover:opacity-100 transition-opacity duration-300"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
