import kleur from 'kleur';
import { fetchRegistryIndex } from '../registry-client.js';

export interface ListOptions {
  registry?: string;
}

export const runList = async (options: ListOptions): Promise<void> => {
  const index = await fetchRegistryIndex(options.registry);
  console.log(kleur.bold().cyan(`\n${index.name} — ${index.items.length} components\n`));
  for (const item of index.items) {
    const desc = item.description ? kleur.gray(` — ${item.description}`) : '';
    console.log(`  ${kleur.green('•')} ${kleur.bold(item.name)}${desc}`);
  }
  console.log();
};
