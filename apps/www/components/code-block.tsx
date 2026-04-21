import { cn } from '@/lib/utils';
import { CopyButton } from './copy-button';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  /** Hide the language badge in the header. */
  bare?: boolean;
}

/**
 * Styled code block with a copy button. We intentionally skip syntax
 * highlighting for now (keeps the bundle light); shiki can be added later
 * via a MDX plugin.
 */
export const CodeBlock = ({
  code,
  language,
  className,
  bare,
}: CodeBlockProps): React.ReactElement => (
  <div
    className={cn(
      'group relative overflow-hidden rounded-lg border border-border bg-[#0a0a0a] text-zinc-100',
      className,
    )}
  >
    {!bare && language ? (
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs uppercase tracking-wide text-zinc-500">
        <span>{language}</span>
      </div>
    ) : null}
    <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
      <code>{code}</code>
    </pre>
    <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
      <CopyButton value={code} className="border-white/20 bg-white/5 text-zinc-300 hover:text-white" />
    </div>
  </div>
);
