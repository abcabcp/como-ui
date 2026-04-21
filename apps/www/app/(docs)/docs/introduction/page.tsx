import Link from 'next/link';
import { CodeBlock } from '@/components/code-block';

const IntroductionPage = (): React.ReactElement => (
  <article className="prose-docs">
    <div className="mb-2 text-sm font-medium text-muted-foreground">
      Getting Started
    </div>
    <h1 className="text-4xl font-bold tracking-tight">Introduction</h1>
    <p className="mt-4 text-lg text-muted-foreground">
      como-ui is a collection of beautifully designed, accessible snap-scroll
      pickers and related components — built on Tailwind CSS and delivered
      shadcn-style: copy, paste, ship.
    </p>

    <h2 className="mt-12 text-2xl font-semibold">Philosophy</h2>
    <ul className="mt-4 space-y-3 text-muted-foreground">
      <li>
        <span className="font-medium text-foreground">You own the code.</span>{' '}
        Components are copied into your project, not installed as a dependency.
      </li>
      <li>
        <span className="font-medium text-foreground">Fully customizable.</span>{' '}
        Tweak, extend, or rip apart the source — it&apos;s yours.
      </li>
      <li>
        <span className="font-medium text-foreground">
          Typed &amp; accessible.
        </span>{' '}
        Generic React + TypeScript, with keyboard &amp; ARIA support baked in.
      </li>
    </ul>

    <h2 className="mt-12 text-2xl font-semibold">Try it in 10 seconds</h2>
    <div className="mt-4 space-y-3">
      <CodeBlock
        language="bash"
        code={`# Initialize once
npx @como-ui/cli@latest init

# Add any component
npx @como-ui/cli@latest add snap-picker`}
      />
    </div>

    <div className="mt-10 flex gap-3">
      <Link
        href="/docs/installation"
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
      >
        Installation →
      </Link>
      <Link
        href="/docs/components/snap-picker"
        className="rounded-md border border-border px-4 py-2 text-sm font-medium"
      >
        Browse components
      </Link>
    </div>
  </article>
);

export default IntroductionPage;
