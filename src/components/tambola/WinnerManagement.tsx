
"use client";

import type { FC } from 'react';
import { useState, FormEvent, useMemo, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { PlusCircle, Trash2, Trophy, Share2, Download } from 'lucide-react';
import { useTambolaGame, type Winner } from '@/hooks/useTambolaGame';
import { ScrollArea } from '@/components/ui/scroll-area';
import html2canvas from 'html2canvas';

interface WinnerManagementProps {
  winners: Winner[];
  onAddWinner: (prize: string, name: string) => void;
  onRemoveWinner: (id: string) => void;
}

const WinnerManagement: FC<WinnerManagementProps> = ({ winners, onAddWinner, onRemoveWinner }) => {
  const { getEnabledPrizeCategories } = useTambolaGame();
  const [prize, setPrize] = useState('');
  const [name, setName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const winnersTableRef = useRef<HTMLDivElement>(null);

  const prizeSuggestions = useMemo(() => {
    return getEnabledPrizeCategories().map(cat => cat.name);
  }, [getEnabledPrizeCategories]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (prize.trim() && name.trim()) {
      onAddWinner(prize, name);
      setPrize('');
      setName('');
      setShowSuggestions(false);
    }
  };

  const handlePrizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPrize(newValue);
    setShowSuggestions(newValue.length > 0 && prizeSuggestions.some(s => s.toLowerCase().includes(newValue.toLowerCase())));
  }

  const handleSuggestionClick = (suggestion: string) => {
    setPrize(suggestion);
    setShowSuggestions(false);
  }

  const handleShareWinnersText = () => {
    if (winners.length === 0) return;

    let message = "Quick Tambola - Winners!\n\n";
    message += "Congratulations to our amazing winners:\n\n";

    winners.forEach(winner => {
      message += `*${winner.prize.trim()}:*\n`; // Single asterisk for emphasis
      message += `    ${winner.name.trim()}\n\n`;
    });
    
    message += "Thanks for playing!";

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownloadImage = async () => {
    if (!winnersTableRef.current || winners.length === 0) return;

    try {
      const canvas = await html2canvas(winnersTableRef.current, {
        scale: 2,
        backgroundColor: '#ffffff', 
        useCORS: true, 
      });
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = 'quick-tambola-winners.png';
      link.href = image;
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="p-3 xs:p-4 sm:p-6">
        <CardTitle className="text-base xs:text-lg sm:text-xl font-headline flex items-center"><Trophy className="mr-2 text-accent h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6"/> Declare Winners</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Add players who have won prizes. You can select from configured categories or enter a custom one.</CardDescription>
      </CardHeader>
      <CardContent className="p-3 xs:p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Prize Category (e.g., Full House)"
              value={prize}
              onChange={handlePrizeChange}
              onFocus={() => prize.length > 0 && prizeSuggestions.some(s => s.toLowerCase().includes(prize.toLowerCase())) && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} 
              aria-label="Prize Category"
              required
            />
            {showSuggestions && (
              <Card className="absolute z-10 w-full mt-1 max-h-28 xs:max-h-32 sm:max-h-40 shadow-lg border">
                <ScrollArea className="h-full max-h-28 xs:max-h-32 sm:max-h-40">
                  <CardContent className="p-1">
                  {prizeSuggestions
                    .filter(s => s.toLowerCase().includes(prize.toLowerCase()))
                    .map(suggestion => (
                      <div
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseDown={(e) => e.preventDefault()} 
                        className="p-2 hover:bg-accent/20 rounded-md cursor-pointer text-xs sm:text-sm"
                      >
                        {suggestion}
                      </div>
                    ))}
                  {prizeSuggestions.filter(s => s.toLowerCase().includes(prize.toLowerCase())).length === 0 && prize.trim().length > 0 && (
                     <p className="p-2 text-xs sm:text-sm text-muted-foreground">No matching suggestions. Enter custom prize.</p>
                  )}
                  </CardContent>
                </ScrollArea>
              </Card>
            )}
          </div>
          <Input
            type="text"
            placeholder="Winner's Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Winner's Name"
            required
          />
          <Button type="submit" className="w-full text-sm sm:text-base" aria-label="Add Winner" disabled={!prize.trim() || !name.trim()}>
            <PlusCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add Winner
          </Button>
        </form>
      </CardContent>
      {winners.length > 0 && (
        <CardFooter className="flex-col items-start pt-3 sm:pt-4 border-t p-3 xs:p-4 sm:p-6">
          <div className="w-full flex justify-between items-center mb-2">
            <h3 className="text-sm xs:text-base sm:text-lg font-semibold font-headline">Declared Winners:</h3>
            <div className="flex space-x-1.5 xs:space-x-2">
              <Button variant="outline" size="sm" onClick={handleShareWinnersText} className="text-xs sm:text-sm px-2 xs:px-3" disabled={winners.length === 0}>
                <Share2 className="mr-1 xs:mr-1.5 h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadImage} className="text-xs sm:text-sm px-2 xs:px-3" disabled={winners.length === 0}>
                <Download className="mr-1 xs:mr-1.5 h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
                Download
              </Button>
            </div>
          </div>
          <ScrollArea className="h-28 xs:h-32 sm:h-40 w-full pr-1.5 xs:pr-2 sm:pr-3">
            <ul className="space-y-1.5 xs:space-y-2 w-full">
              {winners.map((winner) => (
                <li key={winner.id} className="flex justify-between items-center p-1.5 xs:p-2 sm:p-3 bg-secondary/50 rounded-md shadow-sm text-xs sm:text-sm">
                  <div>
                    <span className="font-semibold text-primary">{winner.prize}:</span> {winner.name}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onRemoveWinner(winner.id)} aria-label={`Remove winner ${winner.name} for ${winner.prize}`} className="p-1 h-auto">
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardFooter>
      )}

      <div ref={winnersTableRef} aria-hidden="true" className="absolute -left-[9999px] top-auto p-6 bg-white font-body">
        <h2 className="text-2xl font-bold mb-4 text-primary text-center">Quick Tambola - Winners!</h2>
        <table className="w-full border-collapse text-sm" style={{ minWidth: '400px' }}>
          <thead>
            <tr>
              <th className="border border-slate-400 p-2 text-left bg-slate-100 text-slate-700 font-semibold">Prize Category</th>
              <th className="border border-slate-400 p-2 text-left bg-slate-100 text-slate-700 font-semibold">Winner's Name</th>
            </tr>
          </thead>
          <tbody>
            {winners.map(winner => (
              <tr key={`img-${winner.id}`}>
                <td className="border border-slate-400 p-2 text-slate-700">{winner.prize}</td>
                <td className="border border-slate-400 p-2 text-slate-700">{winner.name}</td>
              </tr>
            ))}
            {winners.length === 0 && (
              <tr>
                <td colSpan={2} className="border border-slate-400 p-2 text-center text-slate-500">No winners declared yet.</td>
              </tr>
            )}
          </tbody>
        </table>
        <p className="text-xs text-slate-500 mt-4 text-center">Generated by Quick Tambola App</p>
      </div>
    </Card>
  );
};

export default WinnerManagement;
