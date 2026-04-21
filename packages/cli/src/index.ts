import { cac } from 'cac';
import { runInit } from './commands/init.js';
import { runAdd } from './commands/add.js';
import { runList } from './commands/list.js';
import { runDiff } from './commands/diff.js';
import { CLI_NAME, CLI_VERSION } from './constants.js';

const cli = cac(CLI_NAME);

cli
  .command('init', 'Initialize como-ui in your project (creates components.json)')
  .option('--yes, -y', 'Skip prompts and use defaults')
  .option('--cwd <path>', 'Working directory', { default: process.cwd() })
  .option('--registry <url>', 'Override registry URL')
  .action((opts: InitOptions) => runInit(opts));

cli
  .command('add [...components]', 'Add one or more components to your project')
  .option('--yes, -y', 'Skip confirmation prompts')
  .option('--overwrite', 'Overwrite existing files without asking')
  .option('--cwd <path>', 'Working directory', { default: process.cwd() })
  .option('--path <path>', 'Install components to this path (override default)')
  .option('--registry <url>', 'Override registry URL')
  .action((components: string[], opts: AddOptions) => runAdd(components, opts));

cli
  .command('list', 'List all available components in the registry')
  .option('--registry <url>', 'Override registry URL')
  .action((opts: ListOptions) => runList(opts));

cli
  .command('diff [component]', 'Show the diff between your local copy and the registry')
  .option('--cwd <path>', 'Working directory', { default: process.cwd() })
  .option('--registry <url>', 'Override registry URL')
  .action((component: string | undefined, opts: DiffOptions) => runDiff(component, opts));

cli.help();
cli.version(CLI_VERSION);

try {
  cli.parse(process.argv, { run: false });
  await cli.runMatchedCommand();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

// ---- local types kept here to avoid a circular import with commands ----
interface InitOptions {
  yes?: boolean;
  cwd: string;
  registry?: string;
}
interface AddOptions {
  yes?: boolean;
  overwrite?: boolean;
  cwd: string;
  path?: string;
  registry?: string;
}
interface ListOptions {
  registry?: string;
}
interface DiffOptions {
  cwd: string;
  registry?: string;
}
