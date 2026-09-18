import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* Container and Section carry the whole spacing system. Nothing
   else sets section padding. Space is the main premium signal, so
   the scale is generous: 96 / 140 / 200px. */

export function Container({
  className,
  size = "default",
  children,
}: {
  className?: string;
  size?: "default" | "narrow" | "wide" | "bleed";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        size !== "bleed" && "px-6 md:px-10",
        size === "default" && "max-w-[1320px]",
        size === "narrow" && "max-w-[880px]",
        size === "wide" && "max-w-[1560px]",
        size === "bleed" && "max-w-none",
        className,
      )}
    >
      {children}
    </div>
  );
}

const section = cva("relative w-full", {
  variants: {
    background: {
      paper: "bg-paper",
      paper2: "bg-paper-2",
      white: "bg-white",
      ink: "bg-ink text-on-ink on-ink",
    },
    spacing: {
      default: "py-24 md:py-32 lg:py-44",
      large: "py-28 md:py-40 lg:py-52",
      compact: "py-16 md:py-20 lg:py-24",
      none: "",
    },
  },
  defaultVariants: { background: "paper", spacing: "default" },
});

type SectionProps = VariantProps<typeof section> & {
  className?: string;
  children: React.ReactNode;
  id?: string;
  as?: "section" | "div" | "footer";
};

export function Section({
  className,
  background,
  spacing,
  children,
  id,
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag id={id} className={cn(section({ background, spacing }), className)}>
      {children}
    </Tag>
  );
}

/** Small uppercase label. The only uppercase style on the site. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}
