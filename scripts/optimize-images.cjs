const fs = require("fs");
const path = require("path");
let sharp;
try {
  sharp = require("sharp");
} catch {
  console.error("[ERROR] sharp 불러오기 실패. npm i -D sharp");
  process.exit(1);
}

const ROOT = path.resolve(
  __dirname,
  "..",
  "public",
  "assets",
  "images",
  "gallery"
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

function safeReplaceFile(targetPath, buf) {
  // 임시 파일에 먼저 쓰고, 원본 삭제 후 rename (Windows 잠금 우회)
  const tmp = targetPath + ".tmp";
  // 잠금/읽기전용 대비: 권한 느슨하게
  try {
    fs.chmodSync(targetPath, 0o666);
  } catch {}
  fs.writeFileSync(tmp, buf);
  try {
    fs.rmSync(targetPath, { force: true });
  } catch {}
  fs.renameSync(tmp, targetPath);
}

(async () => {
  console.log("[INFO] Image root:", ROOT);
  if (!fs.existsSync(ROOT)) {
    console.error("[ERROR] 폴더 없음:", ROOT);
    process.exit(1);
  }

  const all = walk(ROOT);
  const files = all.filter((f) => /\.(jpe?g|png)$/i.test(f));
  console.log(`[INFO] 발견: ${all.length} / 처리 대상: ${files.length}`);
  if (files.length === 0) return;

  for (const file of files) {
    try {
      const ext = path.extname(file);
      const base = file.slice(0, -ext.length);
      console.log(`[WORK] ${path.relative(ROOT, file)}`);

      // 1) 메타 + 리사이즈 필요 여부
      const meta = await sharp(file).rotate().metadata();
      const needResize = Math.max(meta.width || 0, meta.height || 0) > 1200;

      // 2) 메인 최적화 → 버퍼
      let pipeline = sharp(file).rotate();
      if (needResize)
        pipeline = pipeline.resize({ width: 1200, withoutEnlargement: true });

      if (/\.png$/i.test(ext)) {
        const buf = await pipeline
          .png({ quality: 80, compressionLevel: 9 })
          .toBuffer();
        safeReplaceFile(file, buf);
      } else {
        const buf = await pipeline
          .jpeg({ quality: 78, mozjpeg: true })
          .toBuffer();
        safeReplaceFile(file, buf);
      }

      // 3) 추가 포맷(.avif / .webp)
      try {
        const avifBuf = await sharp(file)
          .rotate()
          .resize({ width: 1200, withoutEnlargement: true })
          .avif({ quality: 50 })
          .toBuffer();
        fs.writeFileSync(`${base}.avif`, avifBuf);
      } catch (e) {
        console.warn("[WARN] AVIF 변환 실패:", e.message);
      }

      try {
        const webpBuf = await sharp(file)
          .rotate()
          .resize({ width: 1200, withoutEnlargement: true })
          .webp({ quality: 72 })
          .toBuffer();
        fs.writeFileSync(`${base}.webp`, webpBuf);
      } catch (e) {
        console.warn("[WARN] WebP 변환 실패:", e.message);
      }
    } catch (e) {
      console.error("[ERROR] 처리 실패:", file);
      console.error(e);
    }
  }

  console.log("[DONE] 이미지 최적화 완료");
})();
