"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
  hideBackButton?: boolean;
  backHref?: string;
  closeHref?: string;
  rightSlot?: React.ReactNode;
};

export function ScreenHeader({
  title,
  subtitle,
  className,
  hideBackButton = false,
  backHref,
  closeHref,
  rightSlot,
}: ScreenHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
      return;
    }
    router.back();
  };

  const handleClose = () => {
    if (closeHref) {
      router.push(closeHref);
      return;
    }
    router.push("/");
  };

  return (
    <header className={cn("hb-container flex items-center justify-between gap-4 pb-6 pt-8 md:hidden", className)}>
      <div className="flex flex-1 justify-start">
        {hideBackButton ? (
          <span className="size-9" aria-hidden />
        ) : (
          <button
            type="button"
            onClick={handleBack}
            className="flex size-9 items-center justify-center rounded-full border border-[#1f2432] bg-[#0e121b] text-white transition hover:border-[#20ff6d] hover:text-[#20ff6d]"
            aria-label="Go back"
          >
            <BackIcon />
          </button>
        )}
      </div>
      <div className="flex flex-col items-center text-center">
        <span className="text-sm font-medium uppercase tracking-[0.32em] text-white">{title}</span>
        {subtitle ? <span className="text-[0.65rem] uppercase tracking-[0.4em] text-[#818898]">{subtitle}</span> : null}
      </div>
      <div className="flex flex-1 justify-end">
        {rightSlot ? (
          rightSlot
        ) : (
          <button
            type="button"
            onClick={handleClose}
            className="flex size-9 items-center justify-center rounded-full border border-[#1f2432] bg-[#0e121b] text-white transition hover:border-[#20ff6d] hover:text-[#20ff6d]"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </header>
  );
}

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M18 6 6 18" strokeLinecap="round" />
      <path d="m6 6 12 12" strokeLinecap="round" />
    </svg>
  );
}
