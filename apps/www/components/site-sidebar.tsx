'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
  badge?: string;
}
interface NavSection {
  title: string;
  items: NavLink[];
}

const sections: readonly NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { href: '/docs/introduction', label: 'Introduction' },
      { href: '/docs/installation', label: 'Installation' },
    ],
  },
  {
    title: 'Components',
    items: [
      { href: '/docs/components/snap-picker', label: 'Snap Picker' },
      { href: '/docs/components/number-picker', label: 'Number Picker' },
      { href: '/docs/components/time-picker', label: 'Time Picker' },
    ],
  },
];

const SidebarLink = ({
  href,
  label,
  badge,
  active,
}: NavLink & { active: boolean }): React.ReactElement => (
  <Link
    href={href}
    className={cn(
      'flex items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors',
      active
        ? 'bg-muted font-medium text-foreground'
        : 'text-muted-foreground hover:text-foreground',
    )}
  >
    <span>{label}</span>
    {badge ? (
      <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
        {badge}
      </span>
    ) : null}
  </Link>
);

export const SiteSidebar = (): React.ReactElement => {
  const pathname = usePathname();
  return (
    <aside className="sticky top-14 h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-border py-6 pr-4">
      <nav className="space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {section.title}
            </h4>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <SidebarLink {...item} active={pathname === item.href} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};
