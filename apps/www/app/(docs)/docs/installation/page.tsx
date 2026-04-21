import { CodeBlock } from '@/components/code-block';

const InstallationPage = (): React.ReactElement => (
  <article>
    <div className="mb-2 text-sm font-medium text-muted-foreground">
      Getting Started
    </div>
    <h1 className="text-4xl font-bold tracking-tight">Installation</h1>
    <p className="mt-4 text-lg text-muted-foreground">
      como-ui works with any React framework that uses Tailwind CSS. The CLI
      wires up your config, copies the components you pick, and installs any
      required npm packages automatically.
    </p>

    <h2 className="mt-10 text-2xl font-semibold">Prerequisites</h2>
    <ul className="mt-3 list-disc space-y-1 pl-6 text-muted-foreground">
      <li>A React project (Next.js, Vite, Remix, Astro, …)</li>
      <li>Tailwind CSS v4 configured</li>
      <li>TypeScript recommended (plain JS also works)</li>
    </ul>

    <h2 className="mt-10 text-2xl font-semibold">1. Initialize</h2>
    <p className="mt-2 text-muted-foreground">
      Run <code className="rounded bg-muted px-1 font-mono">init</code> in the
      root of your project. It will create a{' '}
      <code className="rounded bg-muted px-1 font-mono">components.json</code>{' '}
      and ask a few questions about your aliases.
    </p>
    <div className="mt-4">
      <CodeBlock
        language="bash"
        code={`npx @como-ui/cli@latest init`}
      />
    </div>

    <h2 className="mt-10 text-2xl font-semibold">2. Add components</h2>
    <p className="mt-2 text-muted-foreground">
      Install any component by name. Dependencies (both npm packages and other
      registry items) are resolved automatically.
    </p>
    <div className="mt-4">
      <CodeBlock
        language="bash"
        code={`npx @como-ui/cli@latest add snap-picker
npx @como-ui/cli@latest add time-picker`}
      />
    </div>

    <h2 className="mt-10 text-2xl font-semibold">3. Keep them in sync</h2>
    <p className="mt-2 text-muted-foreground">
      Since the components live in your source tree, you&apos;re free to edit
      them. When upstream ships an improvement you want, use{' '}
      <code className="rounded bg-muted px-1 font-mono">diff</code> to inspect
      the changes:
    </p>
    <div className="mt-4">
      <CodeBlock
        language="bash"
        code={`npx @como-ui/cli@latest diff snap-picker

# then re-add with --overwrite to adopt the upstream version
npx @como-ui/cli@latest add snap-picker --overwrite`}
      />
    </div>

    <h2 className="mt-10 text-2xl font-semibold">components.json</h2>
    <p className="mt-2 text-muted-foreground">
      The generated config is shadcn-compatible. Here&apos;s the default shape:
    </p>
    <div className="mt-4">
      <CodeBlock
        language="json"
        code={`{
  "$schema": "https://como-ui.dev/schema.json",
  "style": "default",
  "tsx": true,
  "rsc": false,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "hooks": "@/hooks",
    "lib": "@/lib",
    "utils": "@/lib/utils"
  }
}`}
      />
    </div>
  </article>
);

export default InstallationPage;
