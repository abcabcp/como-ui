import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { z } from 'zod';
import { CONFIG_FILENAME, DEFAULT_ALIASES } from './constants.js';

/**
 * `components.json` — the single source of truth for a consumer project.
 * Schema is intentionally shadcn-compatible so users can migrate in/out.
 */
export const componentsConfigSchema = z.object({
  $schema: z.string().optional(),
  style: z.string().default('default'),
  tsx: z.boolean().default(true),
  rsc: z.boolean().default(false),
  tailwind: z
    .object({
      config: z.string().default('tailwind.config.ts'),
      css: z.string().default('app/globals.css'),
      baseColor: z.string().default('neutral'),
      cssVariables: z.boolean().default(true),
    })
    .default({}),
  aliases: z
    .object({
      components: z.string().default(DEFAULT_ALIASES.components),
      ui: z.string().default(DEFAULT_ALIASES.ui),
      hooks: z.string().default(DEFAULT_ALIASES.hooks),
      lib: z.string().default(DEFAULT_ALIASES.lib),
      utils: z.string().default(DEFAULT_ALIASES.utils),
    })
    .default({}),
  registry: z.string().optional(),
});
export type ComponentsConfig = z.infer<typeof componentsConfigSchema>;

export const getConfigPath = (cwd: string): string =>
  resolve(cwd, CONFIG_FILENAME);

export const configExists = (cwd: string): boolean =>
  existsSync(getConfigPath(cwd));

export const readConfig = async (cwd: string): Promise<ComponentsConfig> => {
  const path = getConfigPath(cwd);
  if (!existsSync(path)) {
    throw new Error(
      `${CONFIG_FILENAME} not found at ${path}. Run \`como-ui init\` first.`,
    );
  }
  const raw = await readFile(path, 'utf8');
  const json: unknown = JSON.parse(raw);
  return componentsConfigSchema.parse(json);
};

export const writeConfig = async (
  cwd: string,
  config: ComponentsConfig,
): Promise<void> => {
  const path = getConfigPath(cwd);
  const withSchema: ComponentsConfig = {
    ...config,
    $schema: config.$schema ?? 'https://como-ui.dev/schema.json',
  };
  await writeFile(path, `${JSON.stringify(withSchema, null, 2)}\n`, 'utf8');
};

/**
 * Resolve one of the alias categories (ui/hooks/lib/...) to an absolute
 * filesystem path within the user's project. Handles only the leading `@/`
 * alias for now; a full tsconfig.paths resolver can replace this later.
 */
export const resolveAliasToPath = (
  cwd: string,
  alias: string,
  srcDir: string | undefined = undefined,
): string => {
  if (alias.startsWith('@/')) {
    const base = srcDir ? join(cwd, srcDir) : cwd;
    return join(base, alias.slice(2));
  }
  return resolve(cwd, alias);
};
