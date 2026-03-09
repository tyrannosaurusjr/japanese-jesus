"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sigil } from "./Sigil";

const NAV_LINKS = [
  { href: "/canon", label: "Canon" },
  { href: "/conduit", label: "Conduit" },
  { href: "/journey", label: "Journey" },
  { href: "/relics", label: "Relics" },
  { href: "/signal", label: "Signal" },
];

export function Nav() {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const pathname = usePathname();
  const menuId = useId();
  const isOpen = openPath === pathname;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-[#2D4A3E]"
        style={{ background: "rgba(13,27,42,0.75)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      >
        <div className="px-4 py-4 md:px-10 md:py-5 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 opacity-85 hover:opacity-100 transition-opacity duration-300"
            aria-label="Japanese Jesus home"
            onClick={() => setOpenPath(null)}
          >
            <Sigil variant="vermilion" size={30} />
            <span className="label text-[#F5F2EB] tracking-[0.16em]">Japanese Jesus</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="label text-[#F5F2EB] hover:text-[#E8D44D] transition-colors duration-300 pb-px border-b border-transparent hover:border-[#C0392B]"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden relative flex h-9 w-9 items-center justify-center rounded border border-[#2D4A3E]/80 bg-[#0D1B2A]/70 text-[#F5F2EB] hover:border-[#C0392B]/70 transition-colors duration-300"
            onClick={() => setOpenPath((current) => (current === pathname ? null : pathname))}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls={menuId}
          >
            <span
              className="absolute block h-px w-4 bg-current transition-transform duration-300"
              style={isOpen ? { transform: "rotate(45deg)" } : { transform: "translateY(-5px)" }}
            />
            <span
              className="absolute block h-px w-4 bg-current transition-opacity duration-300"
              style={isOpen ? { opacity: 0 } : { opacity: 1 }}
            />
            <span
              className="absolute block h-px w-4 bg-current transition-transform duration-300"
              style={isOpen ? { transform: "rotate(-45deg)" } : { transform: "translateY(5px)" }}
            />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          aria-label="Close mobile menu backdrop"
          className="absolute inset-0 bg-[#0D1B2A]/70"
          onClick={() => setOpenPath(null)}
        />
        <div
          id={menuId}
          className={`absolute top-16 left-3 right-3 border border-[#2D4A3E] bg-[#0D1B2A]/95 backdrop-blur-lg transition-all duration-200 ${
            isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
          style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
        >
          <div className="p-2">
            {[{ href: "/", label: "Home" }, ...NAV_LINKS].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-4 py-3 text-[#F5F2EB] border border-transparent hover:border-[#2D4A3E]/80 hover:bg-[#09131F] transition-colors duration-150"
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: "0.96rem",
                  letterSpacing: "0.02em",
                  fontWeight: 600,
                }}
                onClick={() => setOpenPath(null)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
