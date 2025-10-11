const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(process.cwd(), "public", "assets", "images", "gallery");

function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else yield full;
  }
}

(async () => {
  const files = Array.from(walk(ROOT)).filter((f) => /\.(jpe?g|png)$/i.test(f));

  if (files.length === 0) {
    console.log("No images found in:", ROOT);
    return;
  }

  console.log(`Optimizing ${files.length} images...`);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const basename = file.slice(0, -ext.length);

    const basePipeline = sharp(file).rotate();
    const metadata = await basePipeline.metadata();

    const needResize =
      Math.max(metadata.width || 0, metadata.height || 0) > 1200;

    let pipeline = basePipeline;
    if (needResize)
      pipeline = pipeline.resize({ width: 1200, withoutEnlargement: true });

    if (ext === ".png") {
      await pipeline.png({ quality: 80, compressionLevel: 9 }).toFile(file);
    } else {
      await pipeline.jpeg({ quality: 78, mozjpeg: true }).toFile(file);
    }

    await basePipeline
      .resize({ width: 1200, withoutEnlargement: true })
      .avif({ quality: 50 })
      .toFile(`${basename}.avif`)
      .catch(() => {});

    await basePipeline
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(`${basename}.webp`)
      .catch(() => {});
  }

  console.log("Done.");
})();
