import Link from "next/link";

interface FactPatternProps {
  factLabel: string;
  factBody: string;
  readingBody: string;
  sourceLabel: string;
  sourceHref: string;
  sourceText: string;
}

export function FactPattern({
  factLabel,
  factBody,
  readingBody,
  sourceLabel,
  sourceHref,
  sourceText,
}: FactPatternProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#EFE4CF]/20">
      <div className="bg-[#070B14] border border-[#EFE4CF]/30 p-6">
        <p className="label text-[#D6B56E] mb-3">{factLabel}</p>
        <p
          className="text-[#EFE4CF]/68 text-sm leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {factBody}
        </p>
      </div>

      <div className="bg-[#070B14] border border-[#EFE4CF]/30 p-6">
        <p className="label text-[#D6B56E] mb-3">Conduit Reading</p>
        <p
          className="text-[#EFE4CF]/68 text-sm leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {readingBody}
        </p>
      </div>

      <div className="bg-[#070B14] border border-[#EFE4CF]/30 p-6">
        <p className="label text-[#D6B56E] mb-3">{sourceLabel}</p>
        <Link
          href={sourceHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#EFE4CF] hover:text-[#C44A32] transition-colors duration-300"
        >
          {sourceText}
        </Link>
      </div>
    </div>
  );
}
