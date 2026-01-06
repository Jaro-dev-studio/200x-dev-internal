"use client";

import { useEffect } from "react";
import Script from "next/script";

interface WistiaPlayerProps {
  videoId: string;
}

export function WistiaPlayer({ videoId }: WistiaPlayerProps) {
  useEffect(() => {
    // Initialize Wistia if already loaded
    if (typeof window !== "undefined" && (window as unknown as { _wq?: unknown[] })._wq) {
      (window as unknown as { _wq: unknown[] })._wq = (window as unknown as { _wq: unknown[] })._wq || [];
    }
  }, [videoId]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      <Script
        src="https://fast.wistia.com/assets/external/E-v1.js"
        strategy="lazyOnload"
      />
      <div
        className={`wistia_embed wistia_async_${videoId} videoFoam=true h-full w-full`}
      />
    </div>
  );
}



