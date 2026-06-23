import DashboardCalendar from '@/app/ui/dashboard/calendar';

export default function DashboardPage() {
  return (
    <main>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="mt-8">
        <DashboardCalendar />
      </div>
    </main>
  );
}

