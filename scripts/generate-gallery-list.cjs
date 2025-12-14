const fs = require("fs");
const path = require("path");

// gallery 이미지가 들어있는 폴더 (네 optimize-images.cjs와 동일 기준)
const ROOT = path.resolve(
  __dirname,
  "..",
  "public",
  "assets",
  "images",
  "gallery"
);

// CRA/TS 빌드에서 안전하게: TS가 아닌 JS로 생성 (Vercel에서 파싱/타입 문제 방지)
const OUT = path.resolve(
  __dirname,
  "..",
  "src",
  "data",
  "gallery.generated.js"
);

// 재귀로 파일 목록 수집
function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

// Windows 경로 구분자(\) -> URL/웹 경로(/)
function toPosix(p) {
  return p.split(path.sep).join("/");
}

(() => {
  console.log("[INFO] Gallery root:", ROOT);

  if (!fs.existsSync(ROOT)) {
    console.error("[ERROR] 폴더 없음:", ROOT);
    process.exit(1);
  }

  // public 기준 절대경로로 만들기 위해 public 디렉토리 기준을 잡음
  const PUBLIC_DIR = path.resolve(__dirname, "..", "public");

  // 원본 이미지 확장자만 리스트업 (optimize-images.cjs가 avif/webp를 생성하더라도 원본 기준으로 picture에서 파생)
  const all = walk(ROOT);

  const files = all
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .map((abs) => {
      // public/ 로부터의 상대경로 -> "/assets/..." 형태로 변환
      const rel = path.relative(PUBLIC_DIR, abs);
      return "/" + toPosix(rel);
    })
    .sort((a, b) => a.localeCompare(b));

  // 출력 폴더 보장
  fs.mkdirSync(path.dirname(OUT), { recursive: true });

  // JS 모듈로 내보내기 (CRA + Vercel 안정)
  const content =
    `// ⚠️ AUTO-GENERATED FILE. DO NOT EDIT.\n` +
    `// Generated at: ${new Date().toISOString()}\n` +
    `export const GALLERY_IMAGES = ${JSON.stringify(files, null, 2)};\n`;

  fs.writeFileSync(OUT, content, "utf-8");

  console.log(`[DONE] gallery.generated.js 생성 완료: ${files.length}개`);
})();
