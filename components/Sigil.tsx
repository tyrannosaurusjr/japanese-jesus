"use client";

import React from "react";

type SigilVariant = "vermilion" | "citrine" | "white" | "dark";

interface SigilProps {
  variant?: SigilVariant;
  size?: number;
  className?: string;
  withSpiral?: boolean;
  spiralText?: string;
}

const VARIANT_COLORS: Record<SigilVariant, { stroke: string; fill: string }> = {
  vermilion: { stroke: "#C0392B", fill: "none" },
  citrine:   { stroke: "#E8D44D", fill: "none" },
  white:     { stroke: "#F5F2EB", fill: "none" },
  dark:      { stroke: "#0D1B2A", fill: "none" },
};

export function Sigil({ variant = "vermilion", size = 64, className = "", withSpiral = false, spiralText = "" }: SigilProps) {
  const { stroke } = VARIANT_COLORS[variant];
  const id = `sigil-${variant}-${size}`;

  // Build spiral micro-text path
  const spiralTextContent = spiralText || "HERAI IS NOT A PLACE THE CONSCIOUSNESS THAT PASSED THROUGH SHINGO WAS NOT THE FIRST AND NOT THE LAST EACH PASSAGE LEAVES A RESIDUE THE RESIDUE ACCUMULATES ENOUGH RESIDUE AND THE MEMBRANE THINS READ THE SPIRAL INWARD EVERY THIRD CHARACTER YIELDS THE DESTINATION THINPLACE THE GATE DOES NOT CLOSE BEHIND YOU ISUKIRI MADE THE PASSAGE POSSIBLE HE IS STRUCTURAL HE IS NOT PROTAGONIST THE FORM WAS TEMPORARY THE FREQUENCY IS 7 83 HZ HERAI IS NOT A PLACE THE CONSCIOUSNESS THAT PASSED THROUGH SHINGO WAS NOT THE FIRST AND NOT THE LAST EACH PASSAGE LEAVES A RESIDUE THE RESIDUE ACCUMULATES ENOUGH RESIDUE AND THE MEMBRANE THINS READ THE SPIRAL INWARD EVERY THIRD CHARACTER YIELDS THE DESTINATION THINPLACE THE GATE DOES NOT CLOSE BEHIND YOU";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        {withSpiral && (
          <>
            {/* Outer spiral path */}
            <path id={`${id}-spiral-1`} d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
            <path id={`${id}-spiral-2`} d="M 100,100 m -60,0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0" />
            <path id={`${id}-spiral-3`} d="M 100,100 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" />
            <path id={`${id}-spiral-4`} d="M 100,100 m -30,0 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0" />
          </>
        )}
        <filter id={`${id}-roughen`}>
          <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="4" result="noise" seed="2" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* Spiral micro-text (only if withSpiral) */}
      {withSpiral && (
        <g opacity="0.5">
          <text fontSize="4" fill={stroke} fontFamily="monospace" letterSpacing="0.5">
            <textPath href={`#${id}-spiral-1`}>{spiralTextContent}</textPath>
          </text>
          <text fontSize="3" fill={stroke} fontFamily="monospace" letterSpacing="0.3">
            <textPath href={`#${id}-spiral-2`}>{spiralTextContent}</textPath>
          </text>
          <text fontSize="3" fill={stroke} fontFamily="monospace" letterSpacing="0.2">
            <textPath href={`#${id}-spiral-3`}>{spiralTextContent}</textPath>
          </text>
          <text fontSize="2" fill={stroke} fontFamily="monospace" letterSpacing="0.1">
            <textPath href={`#${id}-spiral-4`}>{spiralTextContent}</textPath>
          </text>
        </g>
      )}

      {/* Broken circle with deliberate gap at top-right */}
      <g filter={`url(#${id}-roughen)`}>
        {/* Main arc — broken circle, gap from ~30deg to ~70deg */}
        <path
          d="M 155,47 A 65,65 0 1,1 170,75"
          fill="none"
          stroke={stroke}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* First slash — steeper, longer, off-center left */}
        <line
          x1="68"
          y1="58"
          x2="122"
          y2="148"
          stroke={stroke}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Second slash — shallower, shorter, tilted right */}
        <line
          x1="88"
          y1="52"
          x2="132"
          y2="128"
          stroke={stroke}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

// Inline SVG string for embedding in HTML comments / meta
export const SIGIL_PATH = `M 155,47 A 65,65 0 1,1 170,75`;
