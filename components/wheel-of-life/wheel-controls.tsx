'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { WheelControlsProps } from '@/lib/types';

export function WheelControls({
  storedDates,
  selectedDate,
  compareDate,
  onDateSelect,
  onLoadWheel,
  onCompareSelect,
  onCompare,
  onCreateNew,
  showForm,
}: WheelControlsProps) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4" id='wheel-controls' >
      <div className="flex mx-auto sm:mx-0 space-x-4">
        <Select onValueChange={onDateSelect} value={selectedDate || undefined}>
          <SelectTrigger className="w-[140px] h-12">
            <SelectValue placeholder="Select date" />
          </SelectTrigger>
          <SelectContent>
            {storedDates.map((date) => (
              <SelectItem key={date} value={date}>
                {date}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={onLoadWheel} disabled={!selectedDate} >
          Load Wheel
        </Button>
      </div>
      {!showForm && (
        <div className="mx-auto">
        <Button onClick={onCreateNew} variant="secondary">
          Create New Wheel
        </Button>
        </div>
      )}
      <div className="flex mx-auto sm:mx-0 space-x-4">
        <Select
          onValueChange={onCompareSelect}
          value={compareDate || undefined}
        >
          <SelectTrigger className="w-[140px] h-12">
            <SelectValue placeholder="Compare with" />
          </SelectTrigger>
          <SelectContent>
            {storedDates
              .filter((d) => d !== selectedDate)
              .map((date) => (
                <SelectItem key={date} value={date}>
                  {date}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Button onClick={onCompare} className="px-8" disabled={!selectedDate || !compareDate} >
          Compare
        </Button>
      </div>
    </div>
  );
}
