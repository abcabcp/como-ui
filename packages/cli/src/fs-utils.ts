import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { RegistryItemType } from '@como-ui/registry';
import type { ComponentsConfig } from './config.js';
import { resolveAliasToPath } from './config.js';

/**
 * Maps a registry item's type to the alias where it should be installed.
 */
const getAliasForType = (
  type: RegistryItemType,
  config: ComponentsConfig,
): string => {
  if (type === 'registry:ui') return config.aliases.ui;
  if (type === 'registry:hook') return config.aliases.hooks;
  if (type === 'registry:lib') return config.aliases.lib;
  return config.aliases.components;
};

export const resolveTargetPath = (
  cwd: string,
  config: ComponentsConfig,
  type: RegistryItemType,
  fileName: string,
  overrideTarget?: string,
): string => {
  if (overrideTarget) {
    return join(cwd, overrideTarget);
  }
  const alias = getAliasForType(type, config);
  const baseDir = resolveAliasToPath(cwd, alias);
  return join(baseDir, fileName);
};

export const ensureDir = async (path: string): Promise<void> => {
  await mkdir(path, { recursive: true });
};

export const writeFileWithDir = async (
  path: string,
  content: string,
): Promise<void> => {
  await ensureDir(dirname(path));
  await writeFile(path, content, 'utf8');
};

export const fileExists = (path: string): boolean => existsSync(path);

export const readTextFile = async (path: string): Promise<string> =>
  readFile(path, 'utf8');
