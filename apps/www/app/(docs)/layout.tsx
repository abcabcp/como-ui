import { SiteHeader } from '@/components/site-header';
import { SiteSidebar } from '@/components/site-sidebar';

const DocsLayout = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => (
  <div className="min-h-screen">
    <SiteHeader />
    <div className="mx-auto flex max-w-7xl gap-8 px-6">
      <SiteSidebar />
      <main className="min-w-0 flex-1 py-10">{children}</main>
    </div>
  </div>
);

export default DocsLayout;
