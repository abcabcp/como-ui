'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CodeBlock } from './code-block';

interface PreviewCardProps {
  children: React.ReactNode;
  code: string;
  language?: string;
  className?: string;
}

/**
 * Tabbed card: "Preview" shows the live component, "Code" shows the source
 * snippet. Modeled after shadcn/ui's docs blocks.
 */
export const PreviewCard = ({
  children,
  code,
  language = 'tsx',
  className,
}: PreviewCardProps): React.ReactElement => {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');

  return (
    <div className={cn('mt-4', className)}>
      <div className="mb-3 flex gap-1 border-b border-border">
        <TabButton active={tab === 'preview'} onClick={() => setTab('preview')}>
          Preview
        </TabButton>
        <TabButton active={tab === 'code'} onClick={() => setTab('code')}>
          Code
        </TabButton>
      </div>
      {tab === 'preview' ? (
        <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-border bg-background p-8">
          {children}
        </div>
      ) : (
        <CodeBlock code={code} language={language} bare />
      )}
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}
const TabButton = ({ active, onClick, children }: TabButtonProps): React.ReactElement => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      '-mb-px border-b-2 px-3 py-2 text-sm transition-colors',
      active
        ? 'border-foreground text-foreground'
        : 'border-transparent text-muted-foreground hover:text-foreground',
    )}
  >
    {children}
  </button>
);
