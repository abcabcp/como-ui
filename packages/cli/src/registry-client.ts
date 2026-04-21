import { z } from 'zod';
import {
  registryIndexSchema,
  registryItemSchema,
  type RegistryIndex,
  type RegistryItem,
} from '@como-ui/registry';
import { DEFAULT_REGISTRY_URL } from './constants.js';

const joinUrl = (base: string, path: string): string =>
  `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

const fetchJson = async <T>(url: string, schema: z.ZodType<T>): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  const raw: unknown = await res.json();
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `Invalid registry payload at ${url}:\n${parsed.error.message}`,
    );
  }
  return parsed.data;
};

export const fetchRegistryIndex = async (
  registryUrl: string = DEFAULT_REGISTRY_URL,
): Promise<RegistryIndex> =>
  fetchJson(joinUrl(registryUrl, 'index.json'), registryIndexSchema);

export const fetchRegistryItem = async (
  name: string,
  registryUrl: string = DEFAULT_REGISTRY_URL,
): Promise<RegistryItem> =>
  fetchJson(joinUrl(registryUrl, `${name}.json`), registryItemSchema);

/**
 * Recursively walks `registryDependencies` and returns a flat, deduped list
 * of items in install order (dependencies first).
 */
export const resolveItemWithDeps = async (
  name: string,
  registryUrl: string = DEFAULT_REGISTRY_URL,
  visited: Set<string> = new Set(),
): Promise<RegistryItem[]> => {
  if (visited.has(name)) return [];
  visited.add(name);

  const item = await fetchRegistryItem(name, registryUrl);
  const deps: RegistryItem[] = [];

  for (const depName of item.registryDependencies ?? []) {
    const resolved = await resolveItemWithDeps(depName, registryUrl, visited);
    deps.push(...resolved);
  }

  return [...deps, item];
};
