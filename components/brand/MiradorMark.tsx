import { cn } from "@/lib/utils";

/** Frame + arch portal mark — from brand/identity/logo/mark.svg */
export function MiradorMark({
  className = "h-8 w-8",
  accent = "currentColor",
}: {
  className?: string;
  accent?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="5.31"
        y="9.11"
        width="16.72"
        height="21.02"
        stroke={accent}
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      <path
        d="M10.35,9.34c0-4.12,3.66-7.46,8.17-7.46s8.17,3.34,8.17,7.46v15.48H10.35v-15.64"
        stroke={accent}
        strokeWidth={2}
        strokeMiterlimit={10}
      />
    </svg>
  );
}

export function MiradorWordmark({
  className = "",
  subdued = false,
  onDark = false,
  size = "md",
}: {
  className?: string;
  subdued?: boolean;
  /** Viewer chrome / loading — white lockup on #121212 */
  onDark?: boolean;
  /** sm = HUD badge; md = nav/footer; lg = hero / loading */
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-display font-bold leading-none tracking-[0.02em]",
        size === "lg" && "gap-2.5 text-[1.75rem] md:text-[2rem]",
        size === "md" && "gap-2.5 text-[1.375rem]",
        size === "sm" && "gap-2 text-[1.125rem]",
        onDark ? "text-white/80" : subdued ? "text-white/60" : "text-mirador-text",
        className
      )}
    >
      <MiradorMark
        className={cn(
          "shrink-0",
          onDark || subdued ? "text-current" : "text-mirador-accent",
          size === "lg" && "h-9 w-9 md:h-10 md:w-10",
          size === "md" && "h-7 w-7",
          size === "sm" && "h-6 w-6"
        )}
        accent="currentColor"
      />
      <span className="pt-0.5">Mirador</span>
    </span>
  );
}
