
"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';

const TOTAL_NUMBERS = 90;
const FIXED_NUMBER_OF_PLAYERS = 4;
const FIXED_PLAYER_AMOUNT = 50; // Multiple of 10, so total pool will be multiple of 10 (and 5)
const DYNAMIC_ADJUST_AMOUNT = 5; // Prizes should be multiples of 5

export interface Winner {
  id: string;
  prize: string;
  name: string;
}

export type PriorityLevel = 'ultimate' | 'high' | 'medium' | 'low';

export interface PrizeCategory {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priorityLevel: PriorityLevel;
  percentageWeight: number;
  displayOrder: number;
}

const initialPrizeCategories: PrizeCategory[] = [
  { id: 'full-house', name: 'Full House 1', description: 'The first player to mark all numbers on their ticket.', enabled: true, priorityLevel: 'ultimate', percentageWeight: 30, displayOrder: 10 },
  { id: 'full-house-2', name: 'Full House 2', description: 'The second player to mark all numbers on their ticket.', enabled: true, priorityLevel: 'high', percentageWeight: 15, displayOrder: 11 },
  { id: 'first-line', name: 'First Line', description: 'The first player to mark all numbers in the first row.', enabled: true, priorityLevel: 'medium', percentageWeight: 7, displayOrder: 2 },
  { id: 'second-line', name: 'Second Line', description: 'The first player to mark all numbers in the second row.', enabled: true, priorityLevel: 'medium', percentageWeight: 7, displayOrder: 3 },
  { id: 'third-line', name: 'Third Line', description: 'The first player to mark all numbers in the third row.', enabled: true, priorityLevel: 'medium', percentageWeight: 7, displayOrder: 4 },
  { id: 'fourth-line', name: 'Fourth Line', description: 'The first player to mark all numbers in the fourth row.', enabled: true, priorityLevel: 'medium', percentageWeight: 7, displayOrder: 5 },
  { id: 'fifth-line', name: 'Fifth Line', description: 'The first player to mark all numbers in the fifth row.', enabled: true, priorityLevel: 'medium', percentageWeight: 7, displayOrder: 6 },
  { id: 'sixth-line', name: 'Sixth Line', description: 'The first player to mark all numbers in the sixth row.', enabled: true, priorityLevel: 'medium', percentageWeight: 7, displayOrder: 7 },
  { id: 'four-corners', name: 'Four Corners', description: 'The first player to mark the four corner numbers.', enabled: true, priorityLevel: 'medium', percentageWeight: 8, displayOrder: 8 },
  { id: 'early-seven', name: 'Early Seven', description: 'The first player to mark any seven numbers.', enabled: true, priorityLevel: 'low', percentageWeight: 3, displayOrder: 1 },
  { id: 'pairs', name: 'Three Pairs', description: 'The first player to strike three pairs.', enabled: true, priorityLevel: 'low', percentageWeight: 2, displayOrder: 9 },
];

const priorityLevelSortOrderObj: Record<PriorityLevel, number> = {
  ultimate: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function useTambolaGame() {
  const [allPossibleNumbers, setAllPossibleNumbers] = useState<number[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [calledNumbers, setCalledNumbers] = useState<Set<number>>(new Set());
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [lastFiveNumbers, setLastFiveNumbers] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [winners, setWinners] = useState<Winner[]>([]);

  const numberOfPlayers = FIXED_NUMBER_OF_PLAYERS;
  const playerAmount = FIXED_PLAYER_AMOUNT;
  const prizeCategories = initialPrizeCategories;

  useEffect(() => {
    const numbers = Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1);
    setAllPossibleNumbers(numbers);
    setAvailableNumbers(numbers);
  }, []);

  const startGame = useCallback(() => {
    setAvailableNumbers(allPossibleNumbers);
    setCalledNumbers(new Set());
    setCurrentNumber(null);
    setLastFiveNumbers([]);
    setGameStarted(true);
  }, [allPossibleNumbers]);

  const resetGame = useCallback(() => {
    setAvailableNumbers(allPossibleNumbers);
    setCalledNumbers(new Set());
    setCurrentNumber(null);
    setLastFiveNumbers([]);
    setWinners([]);
    setGameStarted(false);
  }, [allPossibleNumbers]);

  const generateNextNumber = useCallback(() => {
    if (availableNumbers.length === 0 || !gameStarted) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const nextNum = availableNumbers[randomIndex];
    const newAvailableNumbers = availableNumbers.filter((num) => num !== nextNum);
    setAvailableNumbers(newAvailableNumbers);
    const newCalledNumbers = new Set(calledNumbers).add(nextNum);
    setCalledNumbers(newCalledNumbers);
    setCurrentNumber(nextNum);
    setLastFiveNumbers(prev => {
      const updated = [nextNum, ...prev];
      return updated.slice(0, 5);
    });
  }, [availableNumbers, calledNumbers, gameStarted]);

  const addWinner = useCallback((prize: string, name: string) => {
    if (!prize.trim() || !name.trim()) return;
    const newWinner: Winner = { id: Date.now().toString(), prize, name };
    setWinners(prev => [...prev, newWinner]);
  }, []);

  const removeWinner = useCallback((id: string) => {
    setWinners(prev => prev.filter(winner => winner.id !== id));
  }, []);

  const getEnabledPrizeCategories = useCallback(() => {
    return prizeCategories
      .filter(cat => cat.enabled)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [prizeCategories]);

  const prizeMoneyDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    prizeCategories.forEach(cat => { distribution[cat.id] = 0; });

    const totalPool = numberOfPlayers * playerAmount;
    if (totalPool === 0) return distribution;

    const enabledAndWeightedCategories = prizeCategories.filter(cat => cat.enabled && cat.percentageWeight > 0);
    if (enabledAndWeightedCategories.length === 0) return distribution;

    const categoryDetails = enabledAndWeightedCategories.map(cat => {
      const idealShare = totalPool * (cat.percentageWeight / 100);
      let currentPrize = Math.round(idealShare / DYNAMIC_ADJUST_AMOUNT) * DYNAMIC_ADJUST_AMOUNT;
      currentPrize = Math.max(0, currentPrize);
      return {
        ...cat,
        idealShare,
        currentPrize,
        roundingDifference: idealShare - currentPrize,
      };
    });

    let sumOfCurrentPrizes = categoryDetails.reduce((sum, cat) => sum + cat.currentPrize, 0);
    let discrepancy = totalPool - sumOfCurrentPrizes;

    const numAdjustmentCycles = discrepancy !== 0 ? Math.abs(discrepancy / DYNAMIC_ADJUST_AMOUNT) : 0;

    for (let i = 0; i < numAdjustmentCycles; i++) {
      if (discrepancy > 0) {
        categoryDetails.sort((a, b) => {
          if (a.roundingDifference !== b.roundingDifference) return b.roundingDifference - a.roundingDifference;
          const priorityCompare = priorityLevelSortOrderObj[a.priorityLevel] - priorityLevelSortOrderObj[b.priorityLevel];
          if (priorityCompare !== 0) return priorityCompare;
          return a.displayOrder - b.displayOrder;
        });
        if (categoryDetails.length > 0) {
          const candidate = categoryDetails[0];
          candidate.currentPrize += DYNAMIC_ADJUST_AMOUNT;
          candidate.roundingDifference -= DYNAMIC_ADJUST_AMOUNT;
          discrepancy -= DYNAMIC_ADJUST_AMOUNT;
        } else break;
      } else if (discrepancy < 0) {
        categoryDetails.sort((a, b) => {
          const canReduceA = a.currentPrize >= DYNAMIC_ADJUST_AMOUNT;
          const canReduceB = b.currentPrize >= DYNAMIC_ADJUST_AMOUNT;

          if (canReduceA && !canReduceB) return -1;
          if (!canReduceA && canReduceB) return 1;

          if (a.roundingDifference !== b.roundingDifference) return a.roundingDifference - b.roundingDifference;
          const priorityCompare = priorityLevelSortOrderObj[b.priorityLevel] - priorityLevelSortOrderObj[a.priorityLevel];
          if (priorityCompare !== 0) return priorityCompare;
          return b.displayOrder - a.displayOrder; // Higher display order (later in list) reduced first
        });

        const candidateToReduce = categoryDetails.find(c => c.currentPrize >= DYNAMIC_ADJUST_AMOUNT);
        if (candidateToReduce) {
            candidateToReduce.currentPrize -= DYNAMIC_ADJUST_AMOUNT;
            candidateToReduce.roundingDifference += DYNAMIC_ADJUST_AMOUNT;
            discrepancy += DYNAMIC_ADJUST_AMOUNT;
        } else break;
      }
    }

    let finalSum = categoryDetails.reduce((sum, cat) => sum + cat.currentPrize, 0);
    let finalDiscrepancy = totalPool - finalSum;
    let emergencyBreak = 0; // Prevent infinite loops in edge cases

    while(finalDiscrepancy !== 0 && emergencyBreak < enabledAndWeightedCategories.length * 2) {
        emergencyBreak++;
        if (finalDiscrepancy > 0) {
            categoryDetails.sort((a,b) => priorityLevelSortOrderObj[a.priorityLevel] - priorityLevelSortOrderObj[b.priorityLevel] || a.displayOrder - b.displayOrder);
            if(categoryDetails.length > 0) {
               categoryDetails[0].currentPrize += DYNAMIC_ADJUST_AMOUNT;
               finalDiscrepancy -= DYNAMIC_ADJUST_AMOUNT;
            } else break;
        } else if (finalDiscrepancy < 0) {
           categoryDetails.sort((a,b) => priorityLevelSortOrderObj[b.priorityLevel] - priorityLevelSortOrderObj[a.priorityLevel] || b.displayOrder - a.displayOrder);
           const cand = categoryDetails.find(c => c.currentPrize >= DYNAMIC_ADJUST_AMOUNT);
           if (cand) {
               cand.currentPrize -= DYNAMIC_ADJUST_AMOUNT;
               finalDiscrepancy += DYNAMIC_ADJUST_AMOUNT;
           } else break;
        }
    }

    categoryDetails.forEach(cat => {
      distribution[cat.id] = Math.max(0, cat.currentPrize);
    });

    initialPrizeCategories.forEach(pCat => {
        if (!distribution.hasOwnProperty(pCat.id) || !pCat.enabled || pCat.percentageWeight <= 0) {
            distribution[pCat.id] = 0;
        }
    });

    return distribution;
  }, [numberOfPlayers, playerAmount, prizeCategories]);

  return {
    gameStarted,
    currentNumber,
    lastFiveNumbers,
    calledNumbers,
    availableNumbersCount: availableNumbers.length,
    winners,
    startGame,
    resetGame,
    generateNextNumber,
    addWinner,
    removeWinner,
    totalNumbers: TOTAL_NUMBERS,
    numberOfPlayers,
    playerAmount,
    prizeCategories,
    getEnabledPrizeCategories,
    prizeMoneyDistribution,
  };
}
