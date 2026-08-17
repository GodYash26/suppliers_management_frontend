'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Building2, LogOut } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span>Supplier Portal</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
              {user.name[0]}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">{user.name}</span>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>

          <div className="pl-3 border-l">
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
