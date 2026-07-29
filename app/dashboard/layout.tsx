import Sidebar from '@/app/ui/dashboard/sidebar';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="flex h-screen overflow-hidden bg-[#f2eadf] bg-[radial-gradient(#d8c7b7_1px,transparent_1px)] [background-size:10px_10px]">
      <Sidebar />
      <main className='h-full flex-1 overflow-hidden p-6'>
        {children}
      </main>
    </div>
  );
}