import Sidebar from '@/app/ui/dashboard/sidebar';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar />

      <main className='h-full flex-1 overflow-hidden p-6'>
        {children}
      </main>
    </div>
  );
}