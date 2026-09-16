"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

export function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const active = images[activeIndex];

  return (
    <div className="flex flex-col gap-3 sm:flex-row-reverse lg:sticky lg:top-[100px]">
      <div className="relative aspect-[4/5] flex-1 overflow-hidden bg-paper-dim">
        {active && (
          <Image
            src={active.url}
            alt={active.alt}
            fill
            priority
            sizes="(min-width: 1024px) 44vw, 100vw"
            className="object-cover"
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 sm:flex-col">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative h-20 w-16 shrink-0 overflow-hidden bg-paper-dim transition-opacity sm:h-20 sm:w-20",
                index === activeIndex
                  ? "opacity-100 ring-1 ring-ink"
                  : "opacity-60 hover:opacity-100"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
