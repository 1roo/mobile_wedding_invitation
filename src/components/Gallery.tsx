import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";

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

  // 드래그(스와이프) 상태
  const startXRef = useRef<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const dragXRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // 전환(슬라이드) 애니메이션 상태
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const t1Ref = useRef<number | null>(null);
  const t2Ref = useRef<number | null>(null);

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

  // 전환 함수: 먼저 "나가기" -> idx 교체 -> "들어오기"
  const goTo = useCallback(
    (nextIndex: number, dir: 1 | -1) => {
      if (isAnimating) return;

      setDirection(dir);
      setIsAnimating(true);

      // 타이머 정리(중복 방지)
      if (t1Ref.current) window.clearTimeout(t1Ref.current);
      if (t2Ref.current) window.clearTimeout(t2Ref.current);

      t1Ref.current = window.setTimeout(() => {
        setIdx(nextIndex);

        t2Ref.current = window.setTimeout(() => {
          setIsAnimating(false);
          t1Ref.current = null;
          t2Ref.current = null;
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
      return cur; // 실제 idx 변경은 goTo가 처리
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
  }, [isOpen, closeModal, prev, next]);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (t1Ref.current) window.clearTimeout(t1Ref.current);
      if (t2Ref.current) window.clearTimeout(t2Ref.current);
    };
  }, []);

  // 스와이프 핸들러들
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startXRef.current = e.clientX;
    setIsDragging(true);
    setDragX(0);
    dragXRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || startXRef.current == null) return;
    const deltaX = e.clientX - startXRef.current;
    setDragX(deltaX);
    dragXRef.current = deltaX;
  };

  const finishDrag = () => {
    if (!isDragging) return;

    const threshold = 60; // 이 값 이상 움직이면 페이지 넘김
    const dx = dragXRef.current;

    // 드래그 끝나면 원위치
    setIsDragging(false);
    setDragX(0);
    dragXRef.current = 0;
    startXRef.current = null;

    // 넘김 판단
    if (dx > threshold) {
      prev();
    } else if (dx < -threshold) {
      next();
    }
  };

  // 애니메이션 오프셋(px)
  const animOffset = isAnimating ? (direction === 1 ? -24 : 24) : 0;
  const opacity = isAnimating ? 0 : 1;

  return (
    <div className="mt-5 mb-10">
      <p className="my-5 text-center text-4xl font-medium">갤러리</p>

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
      </div>

      {/* 모달 */}
      {isOpen && idx !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          {/* 상단 닫기 버튼 (사진 밖) */}
          <div className="flex items-center justify-end px-4 pt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="rounded-full bg-black/70 px-3 py-2 text-xs text-white shadow-lg"
            >
              ✕ 닫기
            </button>
          </div>

          {/* 중앙 이미지 + 스와이프 영역 */}
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
                <ImgWithFallback
                  base={images[idx].base}
                  alt={images[idx].alt}
                  fetchPriority="high"
                  className="w-auto max-h-[80vh] max-w-full select-none rounded-xl shadow-2xl"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* 하단 컨트롤 (사진 밖) */}
          <div
            className="flex flex-col items-center gap-3 pb-6 pt-2 text-xs text-white/80"
            onClick={(e) => e.stopPropagation()}
          >
            <p>
              {idx + 1} / {images.length}
            </p>

            {/* 인디케이터 */}
            <div className="flex gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (idx === i) return;
                    goTo(i, i > idx ? 1 : -1);
                  }}
                  className={`h-2 w-2 rounded-full transition ${
                    i === idx ? "scale-125 bg-white" : "bg-white/40"
                  }`}
                  aria-label={`${i + 1}번째 사진으로 이동`}
                />
              ))}
            </div>

            {/* 텍스트 버튼 (사진 밖) */}
            <div className="mt-1 flex gap-4">
              <button
                onClick={prev}
                className="rounded-full bg-white/10 px-4 py-1 text-xs text-white hover:bg-white/20"
              >
                이전 사진
              </button>
              <button
                onClick={next}
                className="rounded-full bg-white/10 px-4 py-1 text-xs text-white hover:bg-white/20"
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
