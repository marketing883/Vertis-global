import Image from "next/image";
import { PHOTOS, type PhotoId } from "@/config/photography";
import { cn } from "@/lib/utils";

type PhotoProps = {
  slot: PhotoId;
  className?: string;
  /** Fills its positioned parent instead of reserving its own box. */
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  /** Darkens the image so text can sit over it. */
  overlay?: "none" | "soft" | "strong";
};

/* One component owns every photograph on the site: the aspect box
   (so CLS stays at zero), the overlay scrim, and the placeholder
   shown until a real file is dropped in. */
export function Photo({
  slot,
  className,
  fill = false,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  overlay = "none",
}: PhotoProps) {
  const photo = PHOTOS[slot];

  /* "strong" is for copy sitting on the lower third: purple where the
     words are, clear above, so faces in the upper frame stay bright.
     "soft" is a light even veil for when a picture only needs
     quietening. Neither should be reached for to hide a photograph. */
  const scrim =
    overlay === "strong"
      ? "after:absolute after:inset-0 after:scrim-caption"
      : overlay === "soft"
        ? "after:absolute after:inset-0 after:bg-ink/15"
        : "";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-paper-2",
        scrim,
        className,
      )}
      style={fill ? undefined : { aspectRatio: String(photo.aspect) }}
    >
      {photo.src ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <PhotoPlaceholder id={photo.id} brief={photo.brief} />
      )}
    </div>
  );
}

/* A tonal block rather than a broken-image icon. It reads as an
   intentional editorial plate at a glance, and states exactly what
   belongs there on closer inspection. */
function PhotoPlaceholder({ id, brief }: { id: string; brief: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-end p-6"
      style={{
        background:
          "linear-gradient(155deg, #eae8f2 0%, #d9d5e7 42%, #c5bfda 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(43, 39, 107,.06) 0 1px, transparent 1px 9px)",
        }}
      />
      <div className="relative max-w-md">
        <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-n-600 uppercase">
          Photography · {id}
        </p>
        <p className="mt-2 text-[0.8125rem] leading-snug text-n-600">{brief}</p>
      </div>
    </div>
  );
}
