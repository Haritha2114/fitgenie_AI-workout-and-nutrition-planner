
'use client';

import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { Logo } from '@/components/icons/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
// useAuth, auth, signOut, useRouter, useToast imports are removed

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  // useAuth hook and related logic are removed

  const getInitials = (name: string = '') => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  }

  const handleLogout = async () => {
    // Mock logout behavior
    console.log("Logout clicked (mock)");
    alert("Logout functionality is mocked. In a real app, this would log you out.");
  };
  
  // Using placeholder/mock data similar to what was shown in profile page before auth
  const displayName = "Alex Fitness";
  const displayEmail = "alex@example.com";
  const avatarUrl = `https://placehold.co/100x100.png?text=${getInitials(displayName)}`;


  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4 items-center">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-auto" />
            <div className="group-data-[collapsible=icon]:hidden">
              <h2 className="font-semibold text-lg text-sidebar-primary">FitGenie</h2>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatarUrl} alt={displayName} data-ai-hint="person avatar" />
              <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
            </Avatar>
            <div className="group-data-[collapsible=icon]:hidden flex-grow">
              <p className="text-sm font-medium text-sidebar-foreground truncate" title={displayName}>{displayName}</p>
              <p className="text-xs text-muted-foreground truncate" title={displayEmail}>{displayEmail}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="group-data-[collapsible=icon]:hidden text-sidebar-foreground hover:text-sidebar-accent-foreground"
              onClick={handleLogout}
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
          <SidebarTrigger className="md:hidden" />
          {/* Breadcrumbs or Page Title can go here */}
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
