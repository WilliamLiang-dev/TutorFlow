import Link from 'next/link';
import NavLinks from './nav-links';

export default function TopNav() {
  return (
    <header className="bg-black">
      <div className="mx-auto flex max-w-6xl items-center gap-20 px-6 py-4">
        <Link
          href="/dashboard"
          className="-ml-40 rounded-xl border border-white/20 px-4 py-2 transition bg-white"
        >
          <span className="block text-xl font-bold text-black">TutorFlow</span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}