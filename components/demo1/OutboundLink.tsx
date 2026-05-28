"use client";

import type { ComponentProps } from "react";
import { trackDemo1Outbound } from "@/lib/analytics";

type OutboundLinkProps = ComponentProps<"a"> & {
  channel: "whatsapp" | "phone";
  placement: "nav" | "agent" | "sticky";
};

export function OutboundLink({
  channel,
  placement,
  onClick,
  children,
  ...props
}: OutboundLinkProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackDemo1Outbound({ channel, placement });
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
