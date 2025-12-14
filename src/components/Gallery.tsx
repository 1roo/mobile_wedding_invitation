import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import { GALLERY_IMAGES } from "../data/gallery.generated";

/* =========================
   utils
========================= */
function pickRandom<T>(arr: readonly T[], n: number) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}

function swapExt(src: string, ext: string) {
  return src.replace(/\.(jpe?g|png)$/i, `.${ext}`);
}

/* =========================
   picture component
========================= */
function Picture({
  src,
  alt,
  className,
  imgClassName,
  loading,
  decoding,
  fetchPriority,
  draggable,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
  decoding?: "sync" | "async" | "auto";
  fetchPriority?: "high" | "low" | "auto";
  draggable?: boolean;
  style?: React.CSSProperties;
}) {
  const avif = swapExt(src, "avif");
  const webp = swapExt(src, "webp");

  return (
    <picture className={className} style={style}>
      <source srcSet={avif} type="image/avif" />
      <source srcSet={webp} type="image/webp" />
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        className={imgClassName}
        draggable={draggable}
      />
    </picture>
  );
}

/* =========================
   gallery
========================= */
const ALL_IMAGES = GALLERY_IMAGES as string[];

const Gallery = () => {
  /* 랜덤 15개 (3x5) – 마운트 동안 고정 */
  const images = useMemo(() => {
    return pickRandom(ALL_IMAGES, 15).map((src, i) => ({
      id: i,
      src,
      alt: `우리의 순간 ${i + 1}`,
    }));
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [idx, setIdx] = useState<number | null>(null);

  /* swipe */
  const startXRef = useRef<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const dragXRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  /* animation */
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const t1 = useRef<number | null>(null);
  const t2 = useRef<number | null>(null);

  const openModal = (i: number) => {
    setIdx(i);
    setIsOpen(true);
    setDragX(0);
    dragXRef.current = 0;
    startXRef.current = null;
    setIsDragging(false);
  };

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setIdx(null);
    setDragX(0);
    dragXRef.current = 0;
    startXRef.current = null;
    setIsDragging(false);
  }, []);

  const goTo = useCallback(
    (nextIndex: number, dir: 1 | -1) => {
      if (isAnimating) return;

      setDirection(dir);
      setIsAnimating(true);

      if (t1.current) window.clearTimeout(t1.current);
      if (t2.current) window.clearTimeout(t2.current);

      t1.current = window.setTimeout(() => {
        setIdx(nextIndex);

        t2.current = window.setTimeout(() => {
          setIsAnimating(false);
          t1.current = null;
          t2.current = null;
        }, 220);
      }, 220);
    },
    [isAnimating]
  );

  const prev = useCallback(() => {
    setIdx((p) => {
      const cur = p ?? 0;
      const nextIndex = (cur - 1 + images.length) % images.length;
      goTo(nextIndex, -1);
      return cur;
    });
  }, [images.length, goTo]);

  const next = useCallback(() => {
    setIdx((p) => {
      const cur = p ?? 0;
      const nextIndex = (cur + 1) % images.length;
      goTo(nextIndex, 1);
      return cur;
    });
  }, [images.length, goTo]);

  /* keyboard + scroll lock */
  useEffect(() => {
    if (!isOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeModal, prev, next]);

  /* cleanup */
  useEffect(() => {
    return () => {
      if (t1.current) window.clearTimeout(t1.current);
      if (t2.current) window.clearTimeout(t2.current);
    };
  }, []);

  /* swipe handlers */
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startXRef.current = e.clientX;
    setIsDragging(true);
    setDragX(0);
    dragXRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || startXRef.current == null) return;
    const dx = e.clientX - startXRef.current;
    setDragX(dx);
    dragXRef.current = dx;
  };

  const finishDrag = () => {
    if (!isDragging) return;

    const threshold = 60;
    const dx = dragXRef.current;

    setIsDragging(false);
    setDragX(0);
    dragXRef.current = 0;
    startXRef.current = null;

    if (dx > threshold) prev();
    else if (dx < -threshold) next();
  };

  const animOffset = isAnimating ? (direction === 1 ? -24 : 24) : 0;
  const opacity = isAnimating ? 0 : 1;

  return (
    <div className="mt-5 mb-10">
      <p className="my-5 text-center text-4xl font-medium">갤러리</p>

      {/* 썸네일 (3 x 5) */}
      <div className="flex justify-center">
        <div className="w-full max-w-[420px]">
          <div className="grid grid-cols-3 gap-2 p-4">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => openModal(i)}
                className="relative overflow-hidden rounded-lg shadow-lg active:scale-[0.99]"
                aria-label={`${img.alt} 크게 보기`}
              >
                <div className="pt-[100%]" />
                <Picture
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0"
                  imgClassName="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* modal */}
      {isOpen && idx !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          {/* close */}
          <div className="flex justify-end px-4 pt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="rounded-full bg-black/70 px-3 py-2 text-xs text-white"
            >
              ✕ 닫기
            </button>
          </div>

          {/* image */}
          <div
            className="flex flex-1 items-center justify-center px-4 pb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative max-h-[80vh] max-w-full overflow-hidden touch-none"
              style={{ touchAction: "pan-y" }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={finishDrag}
              onPointerCancel={finishDrag}
              onPointerLeave={finishDrag}
            >
              <div
                className="transition-all duration-200 ease-out"
                style={{
                  transform: `translateX(${dragX + animOffset}px)`,
                  opacity,
                }}
              >
                <Picture
                  src={images[idx].src}
                  alt={images[idx].alt}
                  fetchPriority="high"
                  imgClassName="w-auto max-h-[80vh] max-w-full select-none rounded-xl shadow-2xl"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* footer */}
          <div
            className="flex flex-col items-center gap-3 pb-6 pt-2 text-xs text-white/80"
            onClick={(e) => e.stopPropagation()}
          >
            <p>
              {idx + 1} / {images.length}
            </p>

            <div className="flex gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (idx === i) return;
                    goTo(i, i > idx ? 1 : -1);
                  }}
                  className={`h-2 w-2 rounded-full ${
                    i === idx ? "scale-125 bg-white" : "bg-white/40"
                  }`}
                  aria-label={`${i + 1}번째 사진`}
                />
              ))}
            </div>

            <div className="mt-1 flex gap-4">
              <button
                onClick={prev}
                className="rounded-full bg-white/10 px-4 py-1 text-xs text-white"
              >
                이전 사진
              </button>
              <button
                onClick={next}
                className="rounded-full bg-white/10 px-4 py-1 text-xs text-white"
              >
                다음 사진
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
