import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

interface TsconfigShape {
  compilerOptions?: {
    baseUrl?: string;
    paths?: Record<string, string[]>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface EnsureResult {
  patched: boolean;
  path: string;
  reason?: string;
}

const TSCONFIG_FILES = ['tsconfig.json', 'jsconfig.json'] as const;

const findConfig = (cwd: string): string | null => {
  for (const name of TSCONFIG_FILES) {
    const path = join(cwd, name);
    if (existsSync(path)) return path;
  }
  return null;
};

/**
 * Very tolerant JSON parser: strips `//` and `/* *\/` comments and trailing
 * commas before `JSON.parse`, so we can read common JSONC-style tsconfigs.
 */
const parseJsonc = (raw: string): TsconfigShape => {
  const stripped = raw
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:"])\/\/.*$/gm, '$1')
    .replace(/,(\s*[}\]])/g, '$1');
  return JSON.parse(stripped) as TsconfigShape;
};

/**
 * Ensure `compilerOptions.paths["@/*"]` points at the project root (or
 * `./src/*` when a `src/` directory is present). Idempotent; leaves existing
 * aliases untouched.
 */
export const ensureTsconfigPaths = async (
  cwd: string,
): Promise<EnsureResult> => {
  const path = findConfig(cwd);
  if (!path) {
    return {
      patched: false,
      path: join(cwd, 'tsconfig.json'),
      reason: 'no tsconfig.json / jsconfig.json found',
    };
  }

  const raw = await readFile(path, 'utf8');
  let config: TsconfigShape;
  try {
    config = parseJsonc(raw);
  } catch (err) {
    return {
      patched: false,
      path,
      reason: `failed to parse (${(err as Error).message})`,
    };
  }

  const hasSrcDir = existsSync(join(cwd, 'src'));
  const target = hasSrcDir ? './src/*' : './*';

  config.compilerOptions ??= {};
  config.compilerOptions.baseUrl ??= '.';
  config.compilerOptions.paths ??= {};

  const existing = config.compilerOptions.paths['@/*'];
  if (Array.isArray(existing) && existing.length > 0) {
    return { patched: false, path, reason: 'paths["@/*"] already set' };
  }
  config.compilerOptions.paths['@/*'] = [target];

  await writeFile(path, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  return { patched: true, path };
};
