import { basename } from 'node:path';
import kleur from 'kleur';
import { readConfig } from '../config.js';
import { fetchRegistryIndex, fetchRegistryItem } from '../registry-client.js';
import {
  fileExists,
  readTextFile,
  resolveTargetPath,
} from '../fs-utils.js';

export interface DiffOptions {
  cwd: string;
  registry?: string;
}

/**
 * Very simple line-by-line diff. We intentionally avoid pulling in a big
 * diff library for the first release; users get a "CHANGED" list and can
 * re-add with --overwrite to sync.
 */
const isDifferent = (local: string, remote: string): boolean =>
  local.trim() !== remote.trim();

export const runDiff = async (
  componentName: string | undefined,
  options: DiffOptions,
): Promise<void> => {
  const config = await readConfig(options.cwd);
  const registry = options.registry ?? config.registry;

  const index = await fetchRegistryIndex(registry);
  const targets = componentName
    ? index.items.filter((i) => i.name === componentName)
    : index.items;

  if (targets.length === 0) {
    console.log(kleur.yellow(`No component matched "${componentName}".`));
    return;
  }

  for (const entry of targets) {
    const full = await fetchRegistryItem(entry.name, registry);
    for (const file of full.files) {
      const localPath = resolveTargetPath(
        options.cwd,
        config,
        file.type,
        basename(file.path),
        file.target,
      );
      if (!fileExists(localPath)) continue;
      const local = await readTextFile(localPath);
      if (!file.content) continue;
      if (isDifferent(local, file.content)) {
        console.log(
          `${kleur.yellow('~')} ${kleur.bold(entry.name)} ${kleur.gray(localPath)}`,
        );
      }
    }
  }
};
