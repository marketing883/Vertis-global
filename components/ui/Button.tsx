import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* Orange is for conversion; purple is for everything secondary.
   White text on the brand orange is only 3.2:1, so orange buttons
   carry PURPLE text (4.6:1), which is also how the logo pairs them.
   Hover steps through the supporting orange tones, never a new hue. */
const button = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-sans font-semibold rounded-md",
    "transition-[background-color,border-color,color] duration-200",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-orange text-purple hover:bg-orange-2",
        /* On purple grounds the primary is unchanged: orange on purple
           is 4.6:1 and it is the brand's own pairing. */
        onInk: "bg-orange text-purple hover:bg-amber",
        secondary: "bg-purple text-white hover:bg-ink-2",
        outline: "border border-purple/30 text-purple hover:border-purple hover:bg-purple/5",
        outlineInk: "border border-white/30 text-white hover:border-white/60",
      },
      size: {
        md: "h-11 px-6 text-[0.9375rem] [&_svg]:size-4",
        lg: "h-14 px-8 text-base [&_svg]:size-[18px]",
      },
      full: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "lg", full: false },
  },
);

type Base = VariantProps<typeof button> & { className?: string };
type ButtonProps = Base &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AnchorProps = Base &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, "className"> & { href: string };

export function Button(props: ButtonProps | AnchorProps) {
  const { className, variant, size, full, ...rest } = props;
  const classes = cn(button({ variant, size, full }), className);

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorProps;
    return <Link href={href} className={classes} {...anchorRest} />;
  }
  const { type = "button", ...buttonRest } = rest as ButtonProps;
  return <button type={type} className={classes} {...buttonRest} />;
}
