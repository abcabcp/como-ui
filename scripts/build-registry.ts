/**
 * Reads `registry.json`, inlines each file's contents, and writes the
 * resulting per-item JSON + an `index.json` to `apps/www/public/r/`.
 * The docs site then serves these as static assets; the CLI fetches them.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  registryIndexSchema,
  type RegistryIndex,
  type RegistryItem,
} from '@como-ui/registry';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SOURCE = join(ROOT, 'registry.json');
const OUT_DIR = join(ROOT, 'apps', 'www', 'public', 'r');

const ensureDir = async (path: string): Promise<void> => {
  await mkdir(path, { recursive: true });
};

const writeJson = async (path: string, data: unknown): Promise<void> => {
  await ensureDir(dirname(path));
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
};

const inlineFiles = async (item: RegistryItem): Promise<RegistryItem> => {
  const files = await Promise.all(
    item.files.map(async (file) => {
      const absPath = join(ROOT, file.path);
      if (!existsSync(absPath)) {
        throw new Error(`Missing registry source: ${absPath}`);
      }
      const content = await readFile(absPath, 'utf8');
      return { ...file, content };
    }),
  );
  return { ...item, files };
};

const main = async (): Promise<void> => {
  const raw = await readFile(SOURCE, 'utf8');
  const parsed: unknown = JSON.parse(raw);
  const index: RegistryIndex = registryIndexSchema.parse(parsed);

  const publicIndex: RegistryIndex = {
    ...index,
    items: index.items.map((item) => ({
      name: item.name,
      type: item.type,
      description: item.description,
      files: [],
    })),
  };
  await writeJson(join(OUT_DIR, 'index.json'), publicIndex);

  for (const item of index.items) {
    const inlined = await inlineFiles(item);
    await writeJson(join(OUT_DIR, `${item.name}.json`), inlined);
    console.log(`✔ built ${item.name} (${inlined.files.length} file(s))`);
  }
  console.log(`\n✔ wrote ${index.items.length} item(s) to ${OUT_DIR}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
