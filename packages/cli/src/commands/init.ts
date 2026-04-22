import * as p from "@clack/prompts";
import kleur from "kleur";
import { configExists, writeConfig, type ComponentsConfig } from "../config.js";
import { DEFAULT_ALIASES } from "../constants.js";
import { ensureTsconfigPaths } from "../ts-config.js";

export interface InitOptions {
	yes?: boolean;
	cwd: string;
	registry?: string;
}

const defaultConfig = (registry: string | undefined): ComponentsConfig => ({
	style: "default",
	tsx: true,
	rsc: false,
	tailwind: {
		config: "tailwind.config.ts",
		css: "app/globals.css",
		baseColor: "neutral",
		cssVariables: true,
	},
	aliases: { ...DEFAULT_ALIASES },
	...(registry ? { registry } : {}),
});

export const runInit = async (options: InitOptions): Promise<void> => {
	p.intro(kleur.bold().cyan("como-ui · init"));

	if (configExists(options.cwd)) {
		const proceed = options.yes
			? true
			: await p.confirm({
					message: "components.json already exists. Overwrite?",
					initialValue: false,
				});
		if (p.isCancel(proceed) || !proceed) {
			p.cancel("Aborted.");
			return;
		}
	}

	const config = defaultConfig(options.registry);

	if (!options.yes) {
		const answers = await p.group(
			{
				rsc: () =>
					p.confirm({
						message: "Are you using React Server Components?",
						initialValue: false,
					}),
				tailwindCss: () =>
					p.text({
						message: "Where is your global CSS file?",
						placeholder: config.tailwind.css,
						defaultValue: config.tailwind.css,
					}),
				componentsAlias: () =>
					p.text({
						message: "Components alias?",
						placeholder: config.aliases.components,
						defaultValue: config.aliases.components,
					}),
				utilsAlias: () =>
					p.text({
						message: "Utils alias?",
						placeholder: config.aliases.utils,
						defaultValue: config.aliases.utils,
					}),
			},
			{
				onCancel: () => {
					p.cancel("Aborted.");
					process.exit(0);
				},
			},
		);

		config.rsc = answers.rsc;
		config.tailwind.css = answers.tailwindCss;
		config.aliases.components = answers.componentsAlias;
		config.aliases.utils = answers.utilsAlias;
	}

	await writeConfig(options.cwd, config);

	const tsResult = await ensureTsconfigPaths(options.cwd);
	if (tsResult.patched) {
		p.log.success(`Updated ${tsResult.path} with "@/*" path alias`);
	} else if (tsResult.reason) {
		p.log.warn(
			`Skipped tsconfig patch (${tsResult.reason}). You may need to add ` +
				`"paths": { "@/*": ["./*"] } manually.`,
		);
	}

	p.outro(
		`${kleur.green("✔")} components.json created. Next: ${kleur.cyan(
			"npx como-ui add snap-picker",
		)}`,
	);
};
