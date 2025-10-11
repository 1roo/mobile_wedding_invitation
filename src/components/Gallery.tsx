import { useState } from "react";

const Gallery = () => {
  // 16장 이미지
  const images = Array.from({ length: 16 }, (_, i) => ({
    src: `/assets/images/gallery/${i + 1}.jpg`,
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

  return (
    <div className="mt-5 mb-10">
      <p className="text-4xl font-medium text-center my-5">갤러리</p>
      <div className="flex justify-center">
        {/* 갤러리 컨테이너 */}
        <div className="w-full max-w-[420px]">
          <div className="grid grid-cols-2 gap-3 p-4">
            {images.map((img, i) => (
              <button
                key={img.src}
                onClick={() => openModal(i)}
                className="aspect-square overflow-hidden rounded-lg shadow-lg transition-transform duration-200 hover:scale-[1.02]"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
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
          >
            <div
              className="relative w-full max-w-[420px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 */}
              <button
                onClick={closeModal}
                className="absolute right-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-white text-sm"
              >
                ✕
              </button>

              {/* 이전 / 다음 */}
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

              {/* 큰 이미지 */}
              <img
                src={images[idx].src}
                alt={images[idx].alt}
                className="mx-auto max-h-[80vh] w-auto rounded-lg shadow-2xl transition-transform duration-300"
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
