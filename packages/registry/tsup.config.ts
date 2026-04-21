import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	dts: true,
	// `clean` is intentionally off: in watch mode it deletes dist at startup,
	// which causes dependent packages (like @como-ui/cli) to fail to resolve
	// the module during the brief race window. `pnpm build` still produces
	// a fresh dist thanks to turbo's output handling.
	clean: false,
	sourcemap: true,
	target: "node20",
});
