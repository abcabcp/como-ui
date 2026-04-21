export const CLI_NAME = "como-ui";
export const CLI_VERSION = "0.0.1";

/**
 * Default registry URL. Override via `--registry` or `COMO_UI_REGISTRY` env.
 * Will be swapped to the real docs site once `apps/www` is deployed.
 */
/**
 * TODO: replace with the final production URL after deploying the docs site.
 * Keep the /r path — that's where `scripts/build-registry.ts` outputs JSON.
 */
export const DEFAULT_REGISTRY_URL =
	process.env.COMO_UI_REGISTRY ?? "https://como-ui.vercel.app/r";

export const CONFIG_FILENAME = "components.json";

export const DEFAULT_ALIASES = {
	components: "@/components",
	ui: "@/components/ui",
	hooks: "@/hooks",
	lib: "@/lib",
	utils: "@/lib/utils",
} as const;
