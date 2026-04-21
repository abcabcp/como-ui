import { cn } from '@/lib/utils';

export interface PropRow {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
  required?: boolean;
}

interface PropsTableProps {
  rows: readonly PropRow[];
  className?: string;
}

export const PropsTable = ({
  rows,
  className,
}: PropsTableProps): React.ReactElement => (
  <div
    className={cn(
      'mt-4 overflow-hidden rounded-lg border border-border',
      className,
    )}
  >
    <table className="w-full text-sm">
      <thead className="bg-muted text-left">
        <tr>
          <th className="px-4 py-2 font-medium">Prop</th>
          <th className="px-4 py-2 font-medium">Type</th>
          <th className="px-4 py-2 font-medium">Default</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rows.map((row) => (
          <tr key={row.name} className="align-top">
            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">
              <span className="font-medium text-foreground">{row.name}</span>
              {row.required ? (
                <span className="ml-1 text-[10px] font-semibold text-red-500">
                  *
                </span>
              ) : null}
              <p className="mt-1 font-sans text-xs font-normal text-muted-foreground">
                {row.description}
              </p>
            </td>
            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
              {row.type}
            </td>
            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
              {row.defaultValue ?? '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
