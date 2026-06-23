'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'Files', href: '/dashboard/files' },
  { name: 'Students', href: '/dashboard/students' },
  { name: 'Invoices', href: '/dashboard/invoices' },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-15">
      {links.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== '/dashboard' && pathname.startsWith(link.href));

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`-ml-10 rounded-md px-3 py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-white text-black'
                : 'text-white hover:bg-white/20'
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}