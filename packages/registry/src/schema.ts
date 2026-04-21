import { z } from 'zod';

/**
 * Registry item types — what kind of artifact this entry represents.
 * Kept compatible with shadcn/ui registry terminology so users feel at home.
 */
export const registryItemTypeSchema = z.enum([
  'registry:ui', // A user-facing component (e.g. snap-picker)
  'registry:hook', // A reusable React hook (e.g. useSnapScroll)
  'registry:lib', // A utility module (e.g. cn, time helpers)
  'registry:block', // A composition of multiple components (recipe)
  'registry:style', // Global / token styles
]);
export type RegistryItemType = z.infer<typeof registryItemTypeSchema>;

/**
 * A single file that ships with a registry item. Path is RELATIVE to the
 * consumer project root (shadcn-style), e.g. `components/ui/snap-picker.tsx`.
 */
export const registryItemFileSchema = z.object({
  path: z.string(), // source path in this repo, e.g. `registry/default/ui/snap-picker.tsx`
  type: registryItemTypeSchema,
  target: z.string().optional(), // override install location on consumer side
  content: z.string().optional(), // inlined at build time
});
export type RegistryItemFile = z.infer<typeof registryItemFileSchema>;

/**
 * Tailwind configuration fragments that a component wants merged into the
 * user's tailwind.config.
 */
export const registryTailwindSchema = z
  .object({
    config: z
      .object({
        content: z.array(z.string()).optional(),
        theme: z.record(z.unknown()).optional(),
        plugins: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .optional();

/**
 * CSS variables (tokens) to merge into the user's globals.css.
 * Keyed by light/dark theme.
 */
export const registryCssVarsSchema = z
  .object({
    light: z.record(z.string()).optional(),
    dark: z.record(z.string()).optional(),
  })
  .optional();

export const registryItemSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  type: registryItemTypeSchema,
  description: z.string().optional(),
  /** npm packages that must be installed in the consumer project. */
  dependencies: z.array(z.string()).optional(),
  /** Dev-only npm packages. */
  devDependencies: z.array(z.string()).optional(),
  /** Other `como-ui` registry items this depends on. */
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema),
  tailwind: registryTailwindSchema,
  cssVars: registryCssVarsSchema,
  /** Free-form metadata for docs (category, preview image, demos, etc). */
  meta: z.record(z.unknown()).optional(),
});
export type RegistryItem = z.infer<typeof registryItemSchema>;

/** Top-level `registry.json` (index) shape. */
export const registryIndexSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  homepage: z.string().optional(),
  items: z.array(registryItemSchema),
});
export type RegistryIndex = z.infer<typeof registryIndexSchema>;

/**
 * Style variants (shadcn calls these `new-york` / `default`). We start with a
 * single `default` style; leaving room for future visual variants.
 */
export const registryStyleSchema = z.enum(['default']);
export type RegistryStyle = z.infer<typeof registryStyleSchema>;
