
"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LastNumbersProps {
  numbers: number[];
}

const LastNumbers: FC<LastNumbersProps> = ({ numbers }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="p-2 xs:p-3 sm:p-4">
        <CardTitle className="text-sm xs:text-base sm:text-lg font-headline">Last 5 Numbers</CardTitle>
      </CardHeader>
      <CardContent className="p-2 xs:p-3 sm:p-4">
        {numbers.length > 0 ? (
          <div className="flex space-x-1 sm:space-x-2 justify-center flex-wrap">
            {numbers.map((num, index) => (
              <div
                key={`${num}-${index}`}
                className={`flex items-center justify-center w-7 h-7 text-xs xs:w-8 xs:h-8 xs:text-sm sm:w-10 sm:h-10 sm:text-base md:w-12 md:h-12 md:text-lg rounded-full font-semibold m-0.5 sm:m-1
                  ${index === 0 ? 'bg-accent text-accent-foreground shadow-md' : 'bg-secondary text-secondary-foreground'}`}
              >
                {num}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center text-xs xs:text-sm sm:text-base">No numbers called yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default LastNumbers;
