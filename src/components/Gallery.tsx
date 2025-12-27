import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
// 라이브러리 import
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
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
   Gallery Component
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

  /* Animation State */
  const [isAnimating, setIsAnimating] = useState(false);

  /* [NEW] Zoom State: 확대 중일 때는 슬라이드 스와이프를 막기 위한 상태 */
  const [isSwipeEnabled, setIsSwipeEnabled] = useState(true);

  const openModal = (i: number) => {
    setIdx(i);
    setIsOpen(true);
    setDragX(0);
    dragXRef.current = 0;
    setIsAnimating(false);
    setIsSwipeEnabled(true); // 모달 열 때 스와이프 활성화
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
    setIsSwipeEnabled(true); // 페이지 넘기면 줌 초기화되므로 스와이프 다시 허용
  }, []);

  const finishDrag = () => {
    if (!isDragging) return;

    const threshold = 80;
    const dx = dragXRef.current;

    setIsDragging(false);
    startXRef.current = null;

    if (idx === null) return;

    if (dx > threshold) {
      const nextIndex = (idx - 1 + images.length) % images.length;
      goTo(nextIndex);
    } else if (dx < -threshold) {
      const nextIndex = (idx + 1) % images.length;
      goTo(nextIndex);
    } else {
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
      // 확대 상태가 아닐 때만 키보드 이동 허용 (선택 사항)
      if (isSwipeEnabled) {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeModal, prev, next, isSwipeEnabled]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // [NEW] 확대 상태(isSwipeEnabled === false)라면 부모의 드래그 로직 실행 안 함
    if (!isSwipeEnabled) return;

    setIsAnimating(false);
    startXRef.current = e.clientX;
    setIsDragging(true);
    setDragX(0);
    dragXRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || startXRef.current == null) return;
    // 확대 중이면 드래그 무시
    if (!isSwipeEnabled) return;

    const dx = e.clientX - startXRef.current;
    setDragX(dx);
    dragXRef.current = dx;
  };

  const getDisplayImages = () => {
    if (idx === null) return [];
    const count = images.length;
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
            {displayImages.map((item) => (
              <div
                key={item.key}
                className="absolute top-0 flex h-full w-full items-center justify-center p-4 transition-transform duration-0"
                style={{
                  transform: `translateX(calc(${
                    item.offset * 100
                  }% + ${dragX}px))`,
                  transition: isAnimating ? "transform 0.2s ease-out" : "none",
                }}
              >
                {/* [NEW] TransformWrapper 적용 
                  - 현재 보고 있는 이미지(offset === 0)만 확대 가능하게 설정
                  - 확대/축소 이벤트 발생 시 isSwipeEnabled 상태 업데이트
                */}
                <div
                  className="relative max-h-[80vh] max-w-full shadow-2xl"
                  // 드래그 이벤트가 확대 컴포넌트 내부에서 버블링되는 것을 막지 않도록 주의
                  onPointerDown={(e) => {
                    // 이미지가 확대되지 않은 상태라면 부모(슬라이더)의 드래그를 위해 전파 허용
                    // 이미지가 확대된 상태라면 라이브러리가 이벤트를 잡아서 처리함
                    if (isSwipeEnabled) {
                      // 특별한 처리 없음, 부모의 handlePointerDown이 실행됨
                    } else {
                      e.stopPropagation(); // 확대 상태면 부모 스와이프 방지
                    }
                  }}
                >
                  <TransformWrapper
                    disabled={item.offset !== 0} // 현재 이미지만 확대 가능
                    initialScale={1}
                    minScale={1}
                    maxScale={5} // 최대 5배
                    doubleClick={{ disabled: item.offset !== 0 }}
                    // 확대/축소 상태 변화 감지
                    onTransformed={(ref) => {
                      const scale = ref.state.scale;
                      // scale이 1보다 크면 스와이프 비활성화 (확대된 상태)
                      // scale이 1이면 스와이프 활성화 (원래 크기)
                      // 약간의 오차를 고려하여 1.01보다 작으면 1로 간주
                      setIsSwipeEnabled(scale < 1.01);
                    }}
                  >
                    <TransformComponent
                      wrapperStyle={{ width: "100%", height: "100%" }}
                    >
                      <Picture
                        src={item.src}
                        alt={item.alt}
                        fetchPriority={item.offset === 0 ? "high" : "low"}
                        imgClassName="w-auto max-h-[80vh] max-w-full rounded-xl select-none"
                        draggable={false}
                      />
                    </TransformComponent>
                  </TransformWrapper>
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
