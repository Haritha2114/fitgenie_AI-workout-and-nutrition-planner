
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Dumbbell,
  Apple,
  UserCircle,
  Bookmark, // Added Bookmark icon
  LucideIcon,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/workout', label: 'Workout Plan', icon: Dumbbell },
  { href: '/nutrition', label: 'Nutrition Plan', icon: Apple },
  { href: '/saved-plan', label: 'Saved Plan', icon: Bookmark }, // Added Saved Plan
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu className="p-2">
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              className={cn(
                'w-full justify-start',
                pathname === item.href && 'bg-sidebar-accent text-sidebar-accent-foreground'
              )}
              isActive={pathname === item.href}
              tooltip={{ children: item.label, className: "capitalize" }}
            >
              <item.icon className="h-5 w-5 mr-2" />
              <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
