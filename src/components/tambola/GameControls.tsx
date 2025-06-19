
"use client";

import type { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, ChevronRight, RotateCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GameControlsProps {
  gameStarted: boolean;
  canGenerateMore: boolean;
  onStart: () => void; 
  onNext: () => void;
  onReset: () => void; 
  availableNumbersCount: number;
  totalNumbers: number;
}

const GameControls: FC<GameControlsProps> = ({ 
  gameStarted, 
  canGenerateMore, 
  onStart, 
  onNext, 
  onReset,
  availableNumbersCount,
  totalNumbers
}) => {
  const isGameEffectivelyOverOrNotStarted = !gameStarted && availableNumbersCount === totalNumbers;

  return (
    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-card rounded-lg shadow-md">
      {gameStarted ? (
        <>
          <Button 
            onClick={onNext} 
            disabled={!canGenerateMore} 
            className="w-full text-sm py-4 xs:text-base xs:py-5 sm:text-lg sm:py-6 bg-accent hover:bg-accent/90 text-accent-foreground"
            size="lg"
            aria-label="Generate Next Number"
          >
            <ChevronRight className="mr-2 h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" /> Next Number
          </Button>
          {!canGenerateMore && <p className="text-center text-primary font-semibold text-sm sm:text-base">All numbers called!</p>}
        </>
      ) : (
         <Button onClick={onStart} className="w-full text-sm py-4 xs:text-base xs:py-5 sm:text-lg sm:py-6" size="lg" 
            disabled={totalNumbers - availableNumbersCount === 0 && !canGenerateMore} 
         >
          <Play className="mr-2 h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" /> Start New Round
        </Button>
      )}

      {(availableNumbersCount === 0 && gameStarted) && (
          <Button onClick={onStart} className="w-full text-sm py-4 xs:text-base xs:py-5 sm:text-lg sm:py-6" size="lg" variant="secondary">
            <RotateCw className="mr-2 h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" /> Start New Round
          </Button>
      )}
      
       <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full text-sm py-4 xs:text-base xs:py-5 sm:text-lg sm:py-6" 
            size="lg" 
            disabled={isGameEffectivelyOverOrNotStarted && availableNumbersCount === totalNumbers} 
          >
            <RotateCcw className="mr-2 h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" /> Reset Full Game
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Full Game?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset the Tambola board, clear all called numbers and winners, and you'll be taken to the configuration page. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onReset} className="bg-destructive hover:bg-destructive/90">Reset Game & Configure</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GameControls;
