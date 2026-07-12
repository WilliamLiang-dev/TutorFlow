"use client";

import {
  type CSSProperties,
  type ReactNode,
  useId,
} from "react";

type LiquidGlassProps = {
  children: ReactNode;
  className?: string;

  /**
   * Pixel displacement strength.
   * Recommended: 6–12 for buttons.
   */
  strength?: number;

  /**
   * Adds hover and pressed animations.
   */
  interactive?: boolean;
};

export default function LiquidGlass({
  children,
  className = "",
  strength = 8,
  interactive = false,
}: LiquidGlassProps) {
  /*
   * Each component needs a unique SVG filter ID.
   * React useId() prevents ID collisions.
   */
  const reactId = useId();
  const filterId = `liquid-glass-${reactId.replace(/:/g, "")}`;

  /*
   * Pass the unique filter URL into CSS.
   */
  const liquidStyle = {
    "--liquid-filter": `url(#${filterId}) saturate(1.2) brightness(1.06)`,
  } as CSSProperties;

  return (
    <>
      {/* Hidden SVG containing the refraction filter */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed h-0 w-0"
      >
        <defs>
          <filter
            id={filterId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            {/* Creates a smooth water-like displacement texture */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.028"
              numOctaves="1"
              seed="8"
              result="noise"
            />

            {/* Softens the noise so it looks like water, not static */}
            <feGaussianBlur
              in="noise"
              stdDeviation="0.65"
              result="softNoise"
            />

            {/* Uses the noise to bend the background pixels */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="softNoise"
              scale={strength}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div
        style={liquidStyle}
        className={`liquid-glass ${
          interactive ? "liquid-glass-interactive" : ""
        } ${className}`}
      >
        {/* Cross-browser subtle-glass fallback */}
        <span
          aria-hidden="true"
          className="liquid-glass-fallback"
        />

        {/* Real refraction layer, mainly visible around the edges */}
        <span
          aria-hidden="true"
          className="liquid-glass-refraction"
        />

        {/* Reflected light and edge shine */}
        <span
          aria-hidden="true"
          className="liquid-glass-shine"
        />

        {/* Actual button or component content */}
        <div className="liquid-glass-content">
          {children}
        </div>
      </div>
    </>
  );
}