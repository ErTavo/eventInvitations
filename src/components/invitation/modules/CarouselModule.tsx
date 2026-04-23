"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import type { Module } from "@/lib/supabase/types";
import type { ThemeConfig } from "../themes";
import Image from "next/image";

interface Props { module: Module; theme: ThemeConfig }

export default function CarouselModule({ module: mod, theme }: Props) {
  const images: string[] = (mod.config as { images?: string[] }).images ?? [];
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(id);
  }, [emblaApi]);

  if (!images.length) return null;

  return (
    <section className={`py-16 ${theme.sectionClass}`}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="overflow-hidden"
        ref={emblaRef}
      >
        <div className="flex">
          {images.map((src, i) => (
            <div key={i} className="relative flex-[0_0_100%] md:flex-[0_0_60%] px-2">
              <div className="relative h-64 md:h-96 rounded overflow-hidden">
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
