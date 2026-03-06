"use client";

import { useState } from "react";
import Link from "next/link";
import { Sigil } from "./Sigil";

const NAV_LINKS = [
  { href: "/canon", label: "Canon" },
  { href: "/conduit", label: "Conduit" },
  { href: "/journey", label: "Journey" },
  { href: "/relics", label: "Relics" },
  { href: "/signal", label: "Signal" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity duration-500"
          aria-label="Japanese Jesus home"
          onClick={() => setOpen(false)}
        >
          <Sigil variant="vermilion" size={32} />
          <span className="label text-[#F5F2EB]">Japanese Jesus</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="label text-[#F5F2EB] opacity-70 hover:opacity-100 transition-opacity duration-300"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 opacity-80 hover:opacity-100 transition-opacity duration-300"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span
            className="block w-5 h-px bg-[#F5F2EB] transition-all duration-300 origin-center"
            style={open ? { transform: "translateY(6px) rotate(45deg)" } : {}}
          />
          <span
            className="block w-5 h-px bg-[#F5F2EB] transition-all duration-300"
            style={open ? { opacity: 0 } : {}}
          />
          <span
            className="block w-5 h-px bg-[#F5F2EB] transition-all duration-300 origin-center"
            style={open ? { transform: "translateY(-6px) rotate(-45deg)" } : {}}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[#0D1B2A]/95 flex flex-col justify-center items-center gap-8 md:hidden"
          onClick={() => setOpen(false)}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[#F5F2EB] opacity-80 hover:opacity-100 transition-opacity duration-300"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 900,
                fontSize: "2.5rem",
                letterSpacing: "-0.01em",
              }}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
