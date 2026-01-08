"use client";

import { useState } from "react";
import { Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImpersonationBannerClientProps {
  userName: string;
}

export function ImpersonationBannerClient({ userName }: ImpersonationBannerClientProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div
      className={cn(
        "fixed top-6 right-6 z-[100] bg-accent text-accent-foreground rounded-2xl shadow-2xl border border-border/50 flex flex-col items-center justify-center text-center transition-all duration-300 ease-in-out",
        isMinimized ? "w-12 h-12" : "w-28 h-28",
        "animate-in fade-in slide-in-from-top-4 duration-500"
      )}
    >
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className={cn(
          "absolute p-1 rounded-lg hover:bg-black/5 transition-colors text-accent-foreground/50 hover:text-accent-foreground",
          isMinimized ? "inset-0 flex items-center justify-center" : "top-2 right-2"
        )}
        aria-label={isMinimized ? "Expand banner" : "Minimize banner"}
      >
        {isMinimized ? (
          <Maximize2 className="h-5 w-5" />
        ) : (
          <Minimize2 className="h-3 w-3" />
        )}
      </button>

      {!isMinimized && (
        <div className="flex flex-col items-center justify-center gap-1 p-4 w-full h-full">
          <div className="text-[10px] font-bold uppercase tracking-tighter opacity-50">
            Signed in as
          </div>
          <div className="text-xs font-bold leading-tight break-words w-full">
            {userName}
          </div>
        </div>
      )}
    </div>
  );
}
