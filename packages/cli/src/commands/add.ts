import * as p from '@clack/prompts';
import kleur from 'kleur';
import ora from 'ora';
import { basename } from 'node:path';
import type { RegistryItem } from '@como-ui/registry';
import { readConfig } from '../config.js';
import { fetchRegistryIndex, resolveItemWithDeps } from '../registry-client.js';
import {
  fileExists,
  resolveTargetPath,
  writeFileWithDir,
} from '../fs-utils.js';
import { installPackages } from '../pkg-manager.js';

export interface AddOptions {
  yes?: boolean;
  overwrite?: boolean;
  cwd: string;
  path?: string;
  registry?: string;
}

/**
 * If the user didn't pass component names, show a multi-select prompt
 * populated from the registry index.
 */
const promptComponents = async (registry?: string): Promise<string[]> => {
  const index = await fetchRegistryIndex(registry);
  const choice = await p.multiselect({
    message: 'Which components would you like to add?',
    options: index.items.map((item) => ({
      value: item.name,
      label: item.name,
      hint: item.description,
    })),
    required: true,
  });
  if (p.isCancel(choice)) {
    p.cancel('Aborted.');
    process.exit(0);
  }
  return choice as string[];
};

const collectItemsToInstall = async (
  names: string[],
  registry: string | undefined,
): Promise<RegistryItem[]> => {
  const seen = new Set<string>();
  const all: RegistryItem[] = [];
  for (const name of names) {
    const resolved = await resolveItemWithDeps(name, registry);
    for (const item of resolved) {
      if (!seen.has(item.name)) {
        seen.add(item.name);
        all.push(item);
      }
    }
  }
  return all;
};

export const runAdd = async (
  components: string[],
  options: AddOptions,
): Promise<void> => {
  p.intro(kleur.bold().cyan('como-ui · add'));

  const config = await readConfig(options.cwd);
  const registry = options.registry ?? config.registry;

  const names =
    components.length > 0 ? components : await promptComponents(registry);

  const spinner = ora('Resolving components…').start();
  let items: RegistryItem[];
  try {
    items = await collectItemsToInstall(names, registry);
    spinner.succeed(`Resolved ${items.length} component(s)`);
  } catch (err) {
    spinner.fail('Failed to resolve components');
    throw err;
  }

  const npmDeps = new Set<string>();
  const npmDevDeps = new Set<string>();
  for (const item of items) {
    item.dependencies?.forEach((d) => npmDeps.add(d));
    item.devDependencies?.forEach((d) => npmDevDeps.add(d));
  }

  for (const item of items) {
    for (const file of item.files) {
      const targetPath = resolveTargetPath(
        options.cwd,
        config,
        file.type,
        basename(file.path),
        options.path ? `${options.path}/${basename(file.path)}` : file.target,
      );

      if (fileExists(targetPath) && !options.overwrite && !options.yes) {
        const overwrite = await p.confirm({
          message: `${targetPath} exists. Overwrite?`,
          initialValue: false,
        });
        if (p.isCancel(overwrite) || !overwrite) {
          p.log.warn(`Skipped ${targetPath}`);
          continue;
        }
      }

      if (!file.content) {
        throw new Error(
          `Registry item "${item.name}" is missing inlined content for "${file.path}".`,
        );
      }

      await writeFileWithDir(targetPath, file.content);
      p.log.success(`${kleur.green('+')} ${targetPath}`);
    }
  }

  if (npmDeps.size > 0) {
    const spin = ora(`Installing ${npmDeps.size} dependency/dependencies…`).start();
    try {
      await installPackages([...npmDeps], { cwd: options.cwd, dev: false });
      spin.succeed('Dependencies installed');
    } catch (err) {
      spin.fail('Failed to install dependencies');
      throw err;
    }
  }
  if (npmDevDeps.size > 0) {
    const spin = ora(`Installing ${npmDevDeps.size} devDependency/devDependencies…`).start();
    try {
      await installPackages([...npmDevDeps], { cwd: options.cwd, dev: true });
      spin.succeed('Dev dependencies installed');
    } catch (err) {
      spin.fail('Failed to install dev dependencies');
      throw err;
    }
  }

  p.outro(`${kleur.green('✔')} Added ${items.length} component(s).`);
};
