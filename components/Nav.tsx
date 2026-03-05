"use client";

import Link from "next/link";
import { Sigil } from "./Sigil";

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
      <Link
        href="/"
        className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity duration-500"
        aria-label="Japanese Jesus home"
      >
        <Sigil variant="vermilion" size={32} />
        <span className="label text-[#F5F2EB]">Japanese Jesus</span>
      </Link>

      <div className="flex items-center gap-5 md:gap-7">
        {[
          { href: "/canon", label: "Canon" },
          { href: "/conduit", label: "Conduit" },
          { href: "/journey", label: "Journey" },
          { href: "/relics", label: "Relics" },
          { href: "/signal", label: "Signal" },
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
