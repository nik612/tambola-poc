
"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CurrentNumberDisplayProps {
  number: number | null;
}

const CurrentNumberDisplay: FC<CurrentNumberDisplayProps> = ({ number }) => {
  return (
    <Card className="text-center shadow-xl bg-card border-primary">
      <CardHeader className="p-0">
        <CardTitle className="text-sm xs:text-base sm:text-lg md:text-xl font-headline text-primary-foreground bg-primary p-2 sm:p-3 rounded-t-md">Current Number</CardTitle>
      </CardHeader>
      <CardContent className="p-3 xs:p-4 sm:p-6">
        {number !== null ? (
          <div 
            key={number} // Trigger animation on number change
            className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl font-bold text-accent animate-pulse-lg"
            aria-live="polite"
            aria-atomic="true"
          >
            {number}
          </div>
        ) : (
          <div className="text-3xl sm:text-4xl text-muted-foreground">-</div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentNumberDisplay;
