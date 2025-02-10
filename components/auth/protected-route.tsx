'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Only redirect if we're sure there's no user and we're done loading
    if (!loading && !user) {
      const encodedPath = encodeURIComponent(pathname).replace(/%2F/g, '/');
      const loginUrl = `/login?callbackUrl=${encodedPath}`;
      router.replace(loginUrl);
    }
  }, [user, loading, router, pathname]);

  // Return null while loading or if there's no user
  if (loading || !user) {
    return null;
  }

  return <>{children}</>;
}
