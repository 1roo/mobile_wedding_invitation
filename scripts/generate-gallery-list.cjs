const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(
  __dirname,
  "..",
  "public",
  "assets",
  "images",
  "gallery"
);
const OUT = path.resolve(
  __dirname,
  "..",
  "src",
  "data",
  "gallery.generated.ts"
);

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

(() => {
  if (!fs.existsSync(ROOT)) {
    console.error("[ERROR] 폴더 없음:", ROOT);
    process.exit(1);
  }

  const all = walk(ROOT);

  // 원본 확장자만 목록에 넣음 (optimize-images가 avif/webp는 따로 생성)
  const files = all
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .map((abs) => {
      const rel = path.relative(path.resolve(__dirname, "..", "public"), abs);
      return "/" + toPosix(rel);
    })
    .sort((a, b) => a.localeCompare(b));

  fs.mkdirSync(path.dirname(OUT), { recursive: true });

  const content =
    `// ⚠️ 자동 생성 파일 (수정 금지)\n` +
    `export const GALLERY_IMAGES: string[] = ${JSON.stringify(
      files,
      null,
      2
    )} as const;\n`;

  fs.writeFileSync(OUT, content, "utf-8");

  console.log(`[DONE] gallery.generated.ts 생성 완료: ${files.length}개`);
})();
