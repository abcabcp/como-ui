import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { execa } from 'execa';

export type PackageManager = 'pnpm' | 'yarn' | 'npm' | 'bun';

export const detectPackageManager = (cwd: string): PackageManager => {
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(cwd, 'bun.lockb'))) return 'bun';
  return 'npm';
};

const getInstallArgs = (
  pm: PackageManager,
  packages: string[],
  isDev: boolean,
): string[] => {
  switch (pm) {
    case 'pnpm':
      return ['add', ...(isDev ? ['-D'] : []), ...packages];
    case 'yarn':
      return ['add', ...(isDev ? ['-D'] : []), ...packages];
    case 'bun':
      return ['add', ...(isDev ? ['-d'] : []), ...packages];
    case 'npm':
    default:
      return ['install', ...(isDev ? ['-D'] : []), ...packages];
  }
};

export const installPackages = async (
  packages: string[],
  opts: { cwd: string; dev?: boolean; pm?: PackageManager },
): Promise<void> => {
  if (packages.length === 0) return;
  const pm = opts.pm ?? detectPackageManager(opts.cwd);
  const args = getInstallArgs(pm, packages, opts.dev ?? false);
  await execa(pm, args, { cwd: opts.cwd, stdio: 'inherit' });
};
