import Link from 'next/link';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/docs/introduction', label: 'Docs' },
  { href: '/docs/components/snap-picker', label: 'Components' },
] as const;

export const SiteHeader = (): React.ReactElement => (
  <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
    <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-6">
      <Link href="/" className="font-bold tracking-tight">
        <span className="text-foreground">como</span>
        <span className="text-muted-foreground">-ui</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn('text-muted-foreground transition-colors hover:text-foreground')}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="https://github.com" className="hover:text-foreground" aria-label="GitHub">
          GitHub
        </Link>
      </div>
    </div>
  </header>
);
