import type { NextConfig } from 'next';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * The demo site imports registry components directly from `../../registry/default`
 * so edits trigger HMR. We extend Next's file-tracing + webpack resolution to
 * follow these out-of-tree sources.
 */
const nextConfig: NextConfig = {
  // Let Next trace files outside the app root for standalone builds.
  outputFileTracingRoot: resolve(__dirname, '../..'),
  // Transpile registry TSX using Next's SWC pipeline (no babel config needed).
  transpilePackages: [],
  experimental: {
    // Ensure external source directories are watched in dev.
    externalDir: true,
  },
};

export default nextConfig;
