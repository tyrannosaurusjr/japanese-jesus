import { Sigil } from "./Sigil";

export function Footer() {
  return (
    <footer className="border-t border-[#2D4A3E]/40 mt-24 py-12 px-6 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <Sigil variant="vermilion" size={28} className="opacity-60" />
          <span className="label text-[#F5F2EB]/40">Shingo Village · Aomori Prefecture · Japan</span>
        </div>

        <div className="flex flex-col gap-2">
          <p className="label text-[#F5F2EB]/30">40.6542° N, 141.1389° E</p>
          <p className="label text-[#F5F2EB]/20">The gate remains open.</p>
        </div>
      </div>
    </footer>
  );
}
