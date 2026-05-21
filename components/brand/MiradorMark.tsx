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
  size = "md",
}: {
  className?: string;
  subdued?: boolean;
  /** md = nav/footer lockup; lg = slightly larger lockup */
  size?: "md" | "lg";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-display font-bold leading-none tracking-[0.02em]",
        size === "lg" ? "text-[1.75rem] md:text-[2rem]" : "text-[1.375rem]",
        subdued ? "text-white/60" : "text-mirador-text",
        className
      )}
    >
      <MiradorMark
        className={cn(
          "shrink-0 text-mirador-accent",
          size === "lg" ? "h-9 w-9 md:h-10 md:w-10" : "h-7 w-7"
        )}
        accent="currentColor"
      />
      <span className="pt-0.5">Mirador</span>
    </span>
  );
}
