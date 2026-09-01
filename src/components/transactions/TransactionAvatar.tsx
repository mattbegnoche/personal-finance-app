import Image from "next/image";
import type { ReactElement } from "react";
import { cn } from "@/lib/cn";

/** Rendered at the largest size used anywhere so the downscaled variants stay sharp. */
const AVATAR_SOURCE_SIZE = 80;

interface TransactionAvatarProps {
  src: string;
  className?: string;
}

/**
 * Counterparty avatar. Decorative on purpose — the name it sits beside is the
 * accessible label, so announcing the image again would only add noise.
 */
export function TransactionAvatar({
  src,
  className,
}: TransactionAvatarProps): ReactElement {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={AVATAR_SOURCE_SIZE}
      height={AVATAR_SOURCE_SIZE}
      className={cn("shrink-0 rounded-full object-cover", className)}
    />
  );
}
