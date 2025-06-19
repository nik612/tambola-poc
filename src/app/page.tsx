
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/play');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <p className="text-lg text-muted-foreground">Redirecting to the game...</p>
    </div>
  );
}
