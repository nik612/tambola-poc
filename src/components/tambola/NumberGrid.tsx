
"use client";

import type { FC } from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface NumberGridProps {
  calledNumbers: Set<number>;
  currentNumber: number | null;
  totalNumbers: number;
}

const NumberGrid: FC<NumberGridProps> = ({ calledNumbers, currentNumber, totalNumbers }) => {
  const numbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);
  const columns = 10;

  return (
    <Card className="shadow-xl">
      <CardContent className="p-1.5 xs:p-2 sm:p-3 md:p-4 mt-1.5 xs:mt-2 sm:mt-3 md:mt-4 overflow-x-auto max-w-full">
        <div
          className={`grid gap-1 sm:gap-1.5 md:gap-2 min-w-[280px] xs:min-w-[320px]`} // Ensure minimum width for 10 columns
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          role="grid"
          aria-label="Tambola number board"
        >
          {numbers.map((num) => {
            const isCalled = calledNumbers.has(num);
            const isCurrent = num === currentNumber;
            return (
              <div
                key={num}
                role="gridcell"
                aria-selected={isCalled}
                className={cn(
                  "flex items-center justify-center aspect-square rounded-sm sm:rounded-md text-[0.55rem] xs:text-[0.65rem] sm:text-xs md:text-sm lg:text-base font-semibold border transition-all duration-300 ease-in-out",
                  isCurrent 
                    ? "bg-accent text-accent-foreground ring-1 sm:ring-2 ring-offset-1 sm:ring-offset-2 ring-accent scale-105 sm:scale-110 shadow-lg animate-pulse" 
                    : isCalled 
                    ? "bg-primary text-primary-foreground opacity-80 line-through" 
                    : "bg-card hover:bg-secondary",
                  "shadow-sm"
                )}
                style={{ animationIterationCount: isCurrent ? 'infinite' : '1' }}
              >
                {num}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default NumberGrid;
