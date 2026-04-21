export const CLI_NAME = "como-ui";
export const CLI_VERSION = "0.0.1";

/**
 * Default registry URL. Override via `--registry` or the `COMO_UI_REGISTRY`
 * environment variable. The `/r` path is where `scripts/build-registry.ts`
 * outputs the static JSON manifest that the CLI fetches.
 */
export const DEFAULT_REGISTRY_URL =
	process.env.COMO_UI_REGISTRY ?? "https://como-ui-www.vercel.app/r";

export const CONFIG_FILENAME = "components.json";

export const DEFAULT_ALIASES = {
	components: "@/components",
	ui: "@/components/ui",
	hooks: "@/hooks",
	lib: "@/lib",
	utils: "@/lib/utils",
} as const;
