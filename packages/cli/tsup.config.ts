import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	dts: false,
	clean: false,
	sourcemap: false,
	target: "node20",
	banner: {
		js: "#!/usr/bin/env node",
	},
	minify: false,
});
