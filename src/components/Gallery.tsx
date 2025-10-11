import { useEffect, useState } from "react";

function ImgWithFallback({
  base,
  alt,
  className,
  ...rest
}: {
  base: string;
  alt: string;
  className?: string;
  [k: string]: any;
}) {
  const candidates = [`${base}.JPG`, `${base}.jpg`];
  const [idx, setIdx] = useState(0);

  return (
    <img
      src={candidates[idx]}
      alt={alt}
      onError={() => {
        if (idx < candidates.length - 1) setIdx(idx + 1);
      }}
      className={className}
      {...rest}
    />
  );
}

const Gallery = () => {
  const images = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    base: `/assets/images/gallery/${i + 1}`,
    alt: `우리의 순간 ${i + 1}`,
  }));

  const [isOpen, setIsOpen] = useState(false);
  const [idx, setIdx] = useState<number | null>(null);

  const openModal = (i: number) => {
    setIdx(i);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setIdx(null);
  };
  const prev = () => setIdx((p) => (p! - 1 + images.length) % images.length);
  const next = () => setIdx((p) => (p! + 1) % images.length);

  // 모달 열릴 때 스크롤 잠금 + 키보드 네비
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
  }, [isOpen]);

  return (
    <div className="mt-5 mb-10">
      <p className="text-4xl font-medium text-center my-5">갤러리</p>
      <div className="flex justify-center">
        <div className="w-full max-w-[420px]">
          <div className="grid grid-cols-2 gap-3 p-4">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => openModal(i)}
                className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-200 hover:scale-[1.02]"
                aria-label={`${img.alt} 크게 보기`}
              >
                {/* 정사각형 공간 고정 (aspect 플러그인 없이 동작) */}
                <div className="pt-[100%]" />
                <ImgWithFallback
                  base={img.base}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 모달 */}
        {isOpen && idx !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="relative w-full max-w-[420px]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute right-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-white text-sm"
              >
                ✕
              </button>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white"
              >
                ›
              </button>

              <ImgWithFallback
                base={images[idx].base}
                alt={images[idx].alt}
                fetchPriority="high"
                className="mx-auto max-h-[80vh] w-auto rounded-lg shadow-2xl"
              />

              <p className="mt-3 text-center text-sm text-white/80">
                {idx + 1} / {images.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
