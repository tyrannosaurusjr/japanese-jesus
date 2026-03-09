import Link from "next/link";
import { Sigil } from "./Sigil";

export function Footer() {
  const externalDonationUrl = process.env.NEXT_PUBLIC_DONATION_URL;
  const hasDirectDonatePath = Boolean(externalDonationUrl || process.env.STRIPE_SECRET_KEY);
  const footerDonateHref = externalDonationUrl ?? (hasDirectDonatePath ? "/donate?amount=108&source=footer" : "/#fund-the-ascent");

  return (
    <footer className="border-t border-[#2D4A3E]/40 mt-24 py-12 px-6 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Sigil variant="vermilion" size={28} className="opacity-60" />
            <span className="label text-[#F5F2EB]/40">Shingo Village · Aomori Prefecture · Japan</span>
          </div>
          {externalDonationUrl ? (
            <a
              href={footerDonateHref}
              target="_blank"
              rel="noreferrer"
              className="label inline-flex w-fit border border-[#C0392B]/55 px-5 py-3 text-[#C0392B] transition-all duration-300 hover:bg-[#C0392B] hover:text-[#F5F2EB]"
            >
              Donate Now
            </a>
          ) : (
            <Link
              href={footerDonateHref}
              className="label inline-flex w-fit border border-[#C0392B]/55 px-5 py-3 text-[#C0392B] transition-all duration-300 hover:bg-[#C0392B] hover:text-[#F5F2EB]"
            >
              {hasDirectDonatePath ? "Donate Now" : "Fund The Ascent"}
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="label text-[#F5F2EB]/30">40.6542° N, 141.1389° E</p>
          <p className="label text-[#F5F2EB]/20">The conduit remains active.</p>
        </div>
      </div>
    </footer>
  );
}
