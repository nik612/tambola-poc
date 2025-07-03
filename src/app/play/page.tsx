"use client";

import { useRouter } from "next/navigation";
import CurrentNumberDisplay from "@/components/tambola/CurrentNumberDisplay";
import GameControls from "@/components/tambola/GameControls";
import LastNumbers from "@/components/tambola/LastNumbers";
import NumberGrid from "@/components/tambola/NumberGrid";
import WinnerManagement from "@/components/tambola/WinnerManagement";
import { useTambolaGame } from "@/hooks/useTambolaGame";
import { Separator } from "@/components/ui/separator";

export default function PlayPage() {
  const router = useRouter();
  const {
    gameStarted,
    currentNumber,
    lastFiveNumbers,
    calledNumbers,
    availableNumbersCount,
    winners,
    startGame,
    resetGame,
    generateNextNumber,
    addWinner,
    removeWinner,
    totalNumbers,
  } = useTambolaGame();

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-2 xs:p-3 sm:p-4 md:p-6 font-body">
      <header className="my-3 xs:my-4 sm:my-6 md:my-8 text-center w-full max-w-5xl flex justify-center items-center">
        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-headline text-primary">
            Quick Tambola
          </h1>
        </div>
      </header>
      <p className="text-muted-foreground mb-3 xs:mb-4 sm:mb-6 text-xs sm:text-sm md:text-base text-center max-w-5xl">
        Enjoy a fun and interactive Tambola experience online with your friends.
        Start a new round instantly, track numbers on a live board, and enjoy
        seamless gameplay on this free platform.
      </p>

      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <section className="md:col-span-1 flex flex-col space-y-3 sm:space-y-4 md:space-y-6">
          <CurrentNumberDisplay number={currentNumber} />
          <LastNumbers numbers={lastFiveNumbers} />
          <GameControls
            gameStarted={gameStarted}
            canGenerateMore={availableNumbersCount > 0}
            onStart={startGame}
            onNext={generateNextNumber}
            onReset={resetGame}
            availableNumbersCount={availableNumbersCount}
            totalNumbers={totalNumbers}
          />
        </section>

        <section className="md:col-span-2 flex flex-col space-y-3 sm:space-y-4 md:space-y-6">
          <NumberGrid
            calledNumbers={calledNumbers}
            currentNumber={currentNumber}
            totalNumbers={totalNumbers}
          />
          {gameStarted && (
            <>
              <Separator className="my-3 sm:my-4 md:my-6" />
              <WinnerManagement
                winners={winners}
                onAddWinner={addWinner}
                onRemoveWinner={removeWinner}
              />
            </>
          )}
        </section>
      </main>

      <footer className="mt-6 xs:mt-8 sm:mt-12 text-center text-muted-foreground text-xs sm:text-sm">
        <p>
          &copy; {new Date().getFullYear()} Quick Tambola. Built with love for
          fun
        </p>
      </footer>
    </div>
  );
}
