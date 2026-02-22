import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const assetsDir = path.resolve(process.cwd(), 'dist/assets');

const BUDGETS = {
  maxJsChunkKb: Number(process.env.BUNDLE_MAX_JS_CHUNK_KB ?? 350),
  maxTotalJsKb: Number(process.env.BUNDLE_MAX_TOTAL_JS_KB ?? 1200),
  maxCssChunkKb: Number(process.env.BUNDLE_MAX_CSS_CHUNK_KB ?? 120)
};

const toKb = (bytes) => Number((bytes / 1024).toFixed(2));

const readAssets = async () => {
  const entries = await readdir(assetsDir);
  const assets = await Promise.all(
    entries.map(async (file) => {
      const fullPath = path.join(assetsDir, file);
      const fileStat = await stat(fullPath);
      return { file, sizeBytes: fileStat.size, sizeKb: toKb(fileStat.size) };
    })
  );

  return {
    js: assets.filter((asset) => asset.file.endsWith('.js')).sort((a, b) => b.sizeBytes - a.sizeBytes),
    css: assets.filter((asset) => asset.file.endsWith('.css')).sort((a, b) => b.sizeBytes - a.sizeBytes)
  };
};

const formatAsset = (asset) => `${asset.file} (${asset.sizeKb} kB)`;

const run = async () => {
  let assets;

  try {
    assets = await readAssets();
  } catch (error) {
    console.error('Bundle size check failed: missing dist assets. Run `npm run build` first.');
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }

  const largestJs = assets.js[0];
  const largestCss = assets.css[0];
  const totalJsKb = toKb(assets.js.reduce((sum, asset) => sum + asset.sizeBytes, 0));

  const failures = [];

  if (largestJs && largestJs.sizeKb > BUDGETS.maxJsChunkKb) {
    failures.push(
      `Largest JS chunk ${formatAsset(largestJs)} exceeds ${BUDGETS.maxJsChunkKb} kB`
    );
  }

  if (totalJsKb > BUDGETS.maxTotalJsKb) {
    failures.push(`Total JS payload ${totalJsKb} kB exceeds ${BUDGETS.maxTotalJsKb} kB`);
  }

  if (largestCss && largestCss.sizeKb > BUDGETS.maxCssChunkKb) {
    failures.push(
      `Largest CSS chunk ${formatAsset(largestCss)} exceeds ${BUDGETS.maxCssChunkKb} kB`
    );
  }

  console.log('Bundle size summary');
  console.log(`- Largest JS chunk: ${largestJs ? formatAsset(largestJs) : 'n/a'}`);
  console.log(`- Total JS payload: ${totalJsKb} kB`);
  console.log(`- Largest CSS chunk: ${largestCss ? formatAsset(largestCss) : 'n/a'}`);

  if (failures.length > 0) {
    console.error('\nBundle budget check failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log('Bundle budget check passed.');
};

await run();
