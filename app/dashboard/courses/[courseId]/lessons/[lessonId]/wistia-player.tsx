"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface WistiaPlayerProps {
  videoId: string;
  showControls?: boolean;
}

export function WistiaPlayer({ videoId, showControls = true }: WistiaPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Wistia queue
    const win = window as unknown as { _wq: unknown[] };
    win._wq = win._wq || [];

    // Configure video to adjust container to its natural aspect ratio
    win._wq.push({
      id: videoId,
      onReady: (video: { aspect: () => number }) => {
        if (containerRef.current) {
          const aspectRatio = video.aspect();
          containerRef.current.style.paddingBottom = `${(1 / aspectRatio) * 100}%`;
        }
      },
    });
  }, [videoId]);

  // Build embed options based on showControls prop
  const controlOptions = showControls
    ? "controlsVisibleOnLoad=true playbar=true"
    : "controlsVisibleOnLoad=false playbar=false";

  return (
    <div className="w-full overflow-hidden rounded-lg bg-black">
      <Script
        src={`https://fast.wistia.com/embed/medias/${videoId}.jsonp`}
        strategy="lazyOnload"
      />
      <Script
        src="https://fast.wistia.com/assets/external/E-v1.js"
        strategy="lazyOnload"
      />
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ paddingBottom: "56.25%" }}
      >
        <div
          className={`wistia_embed wistia_async_${videoId} seo=true videoFoam=true ${controlOptions}`}
          style={{ height: "100%", left: 0, position: "absolute", top: 0, width: "100%" }}
        />
      </div>
    </div>
  );
}
