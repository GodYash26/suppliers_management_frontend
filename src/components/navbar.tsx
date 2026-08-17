'use client';

import { useUser } from '@/context/user-context';
import { USERS, UserId } from '@/types/supplier';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Building2 } from 'lucide-react';

export function Navbar() {
  const { userId, user, setUserId } = useUser();

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span>Supplier Portal</span>
        </Link>

        {/* User Switcher */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Active user:</span>
          <Select value={userId} onValueChange={(val) => setUserId(val as UserId)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(USERS).map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  <div className="flex items-center gap-2">
                    <span>{u.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {u.role}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 pl-3 border-l">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
              {user.name[0]}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">{user.name}</span>
              <span className="text-xs text-gray-500">{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}