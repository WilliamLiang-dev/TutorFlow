import TopNav from '@/app/ui/dashboard/topnav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />

      <main className="mx-auto w-full max-w-[1400px] px-10 py-10">{children}</main>
    </div>
  );
}