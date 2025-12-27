import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import { GALLERY_IMAGES } from "../data/gallery.generated";

/* =========================
   utils & Picture Component
   (기존과 동일)
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
   Gallery (Carousel 방식 적용)
========================= */
const ALL_IMAGES = GALLERY_IMAGES as string[];

const Gallery = () => {
  const images = useMemo(() => {
    return pickRandom(ALL_IMAGES, 15).map((src, i) => ({
      id: i,
      src,
      alt: `우리의 순간 ${i + 1}`,
    }));
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [idx, setIdx] = useState<number | null>(null);

  /* Swipe State */
  const startXRef = useRef<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const dragXRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  /* Animation State for smoother transition after drag release */
  const [isAnimating, setIsAnimating] = useState(false);

  const openModal = (i: number) => {
    setIdx(i);
    setIsOpen(true);
    setDragX(0);
    dragXRef.current = 0;
    setIsAnimating(false);
  };

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setIdx(null);
    setDragX(0);
    dragXRef.current = 0;
    setIsAnimating(false);
  }, []);

  const goTo = useCallback((nextIndex: number) => {
    setIdx(nextIndex);
    setDragX(0);
    dragXRef.current = 0;
    setIsAnimating(false);
  }, []);

  /* [핵심 변경] 
    단순히 인덱스만 바꾸는 게 아니라, 
    드래그가 끝났을 때 "부드럽게 제자리로 돌아오거나 다음 장으로 넘어가는" 
    애니메이션 처리를 위해 로직을 보강했습니다.
  */
  const finishDrag = () => {
    if (!isDragging) return;

    const threshold = 80; // 이동 감지 임계값
    const dx = dragXRef.current;
    const width = window.innerWidth;

    setIsDragging(false);
    startXRef.current = null;

    if (idx === null) return;

    if (dx > threshold) {
      // 이전 사진으로 (Prev)
      const nextIndex = (idx - 1 + images.length) % images.length;
      goTo(nextIndex);
    } else if (dx < -threshold) {
      // 다음 사진으로 (Next)
      const nextIndex = (idx + 1) % images.length;
      goTo(nextIndex);
    } else {
      // 제자리로 복귀 (Reset)
      // 이때는 애니메이션을 켜서 부드럽게 0으로 돌아오게 함
      setIsAnimating(true);
      setDragX(0);
      dragXRef.current = 0;
      setTimeout(() => setIsAnimating(false), 200);
    }
  };

  const prev = useCallback(() => {
    if (idx === null) return;
    const nextIndex = (idx - 1 + images.length) % images.length;
    goTo(nextIndex);
  }, [idx, images.length, goTo]);

  const next = useCallback(() => {
    if (idx === null) return;
    const nextIndex = (idx + 1) % images.length;
    goTo(nextIndex);
  }, [idx, images.length, goTo]);

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

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsAnimating(false); // 드래그 시작 시 애니메이션 즉시 중단
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

  /* [렌더링 로직 변경]
    현재 인덱스(idx)를 기준으로 좌(-1), 중(0), 우(+1) 3장의 이미지를 계산합니다.
  */
  const getDisplayImages = () => {
    if (idx === null) return [];
    const count = images.length;

    // 인덱스 계산 (음수 방지를 위한 모듈러 연산)
    const prevIdx = (idx - 1 + count) % count;
    const nextIdx = (idx + 1) % count;

    return [
      { ...images[prevIdx], offset: -1, key: `prev-${images[prevIdx].id}` },
      { ...images[idx], offset: 0, key: `curr-${images[idx].id}` },
      { ...images[nextIdx], offset: 1, key: `next-${images[nextIdx].id}` },
    ];
  };

  const displayImages = getDisplayImages();

  return (
    <div className="mt-5 mb-10">
      <p className="my-5 text-center text-4xl font-medium">갤러리</p>

      {/* 썸네일 리스트 */}
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

      {/* Modal */}
      {isOpen && idx !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          {/* Close Button */}
          <div className="flex justify-end px-4 pt-4 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="rounded-full bg-black/50 px-3 py-2 text-xs text-white border border-white/10"
            >
              ✕ 닫기
            </button>
          </div>

          {/* Slider Container */}
          <div
            className="relative flex-1 w-full h-full overflow-hidden touch-none"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            onPointerLeave={finishDrag}
          >
            {/* 3장의 이미지를 렌더링하지만, 
               유저는 중앙(offset 0)을 보고 있고, 
               드래그(dragX)에 따라 전체가 좌우로 움직입니다.
            */}
            {displayImages.map((item) => (
              <div
                key={item.key}
                className="absolute top-0 flex h-full w-full items-center justify-center p-4 transition-transform duration-0"
                style={{
                  // 기본 위치(offset * 100%) + 드래그 이동값(dragX)
                  // isAnimating이 true일 때만 transition을 적용하여 부드럽게 복귀
                  transform: `translateX(calc(${
                    item.offset * 100
                  }% + ${dragX}px))`,
                  transition: isAnimating ? "transform 0.2s ease-out" : "none",
                }}
              >
                <div className="relative max-h-[80vh] max-w-full shadow-2xl">
                  <Picture
                    src={item.src}
                    alt={item.alt}
                    fetchPriority={item.offset === 0 ? "high" : "low"}
                    imgClassName="w-auto max-h-[80vh] max-w-full rounded-xl select-none"
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            className="flex flex-col items-center gap-3 pb-8 pt-2 text-xs text-white/80 z-10"
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
                    goTo(i);
                  }}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    i === idx ? "scale-125 bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
