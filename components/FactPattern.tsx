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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2D4A3E]/20">
      <div className="bg-[#0D1B2A] border border-[#2D4A3E]/30 p-6">
        <p className="label text-[#E8D44D] mb-3">{factLabel}</p>
        <p
          className="text-[#F5F2EB]/68 text-sm leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {factBody}
        </p>
      </div>

      <div className="bg-[#0D1B2A] border border-[#2D4A3E]/30 p-6">
        <p className="label text-[#E8D44D] mb-3">Conduit Reading</p>
        <p
          className="text-[#F5F2EB]/68 text-sm leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {readingBody}
        </p>
      </div>

      <div className="bg-[#0D1B2A] border border-[#2D4A3E]/30 p-6">
        <p className="label text-[#E8D44D] mb-3">{sourceLabel}</p>
        <Link
          href={sourceHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#F5F2EB] hover:text-[#E8D44D] transition-colors duration-300"
        >
          {sourceText}
        </Link>
      </div>
    </div>
  );
}
