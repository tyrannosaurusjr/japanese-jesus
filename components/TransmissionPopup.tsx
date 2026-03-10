"use client";

import { useState, useEffect } from "react";

export function TransmissionPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    const alreadyDismissed = sessionStorage.getItem("transmission-dismissed");
    if (alreadyDismissed) return;

    // Show after 90 seconds
    const timer = setTimeout(() => {
      setVisible(true);
    }, 90000);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    setVisible(false);
    sessionStorage.setItem("transmission-dismissed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      await fetch("/api/transmissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
      setTimeout(dismiss, 3000);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 transmission-popup">
      <div className="bg-[#070B14] border-t border-[#C44A32]/40 px-6 py-6 md:px-10">
        <div className="max-w-xl flex items-start justify-between gap-6">
          <div className="flex-1">
            {submitted ? (
              <p className="label text-[#D6B56E]">Word has been received.</p>
            ) : (
              <>
                <p className="label text-[#EFE4CF]/50 mb-3">Transmissions</p>
                <p className="text-[#EFE4CF] text-sm mb-4">
                  Receive word from the other side.
                </p>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@address.com"
                    required
                    className="flex-1 bg-transparent border border-[#EFE4CF] text-[#EFE4CF] placeholder-[#EFE4CF]/30 px-3 py-2 text-sm outline-none focus:border-[#C44A32] transition-colors duration-300"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="label bg-[#C44A32] text-[#EFE4CF] px-4 py-2 hover:bg-[#A73523] transition-colors duration-300 disabled:opacity-50"
                  >
                    {loading ? "—" : "Send"}
                  </button>
                </form>
              </>
            )}
          </div>

          <button
            onClick={dismiss}
            className="text-[#EFE4CF]/30 hover:text-[#EFE4CF] transition-colors duration-300 mt-1"
            aria-label="Dismiss"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
