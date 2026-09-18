"use client";

import { Button } from "@/components/ui/Button";
import { useHireTalent } from "./HireTalentProvider";

type Props = Omit<React.ComponentProps<typeof Button>, "href" | "onClick"> & {
  children?: React.ReactNode;
};

/* The primary conversion, as a button. Same look as <Button>, but it
   opens the inquiry modal instead of navigating. */
export function HireTalentButton({ children = "Hire Talent", ...props }: Props) {
  const { open } = useHireTalent();
  return (
    <Button {...(props as React.ComponentProps<typeof Button>)} onClick={open}>
      {children}
    </Button>
  );
}
