
// src/app/(app)/layout.tsx
// 'use client' directive is removed
import { AppLayout } from '@/components/layout/app-layout';
import type { PropsWithChildren } from 'react';
// Auth-related imports (useAuth, useRouter, useEffect, Loader2) are removed

export default function AuthenticatedAppLayout({ children }: PropsWithChildren) {
  // Auth checking logic is removed
  return <AppLayout>{children}</AppLayout>;
}
