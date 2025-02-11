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
    <div className="flex flex-wrap justify-between items-center gap-4">
      <div className="flex items-center space-x-4">
        <Select onValueChange={onDateSelect} value={selectedDate || undefined}>
          <SelectTrigger className="w-[180px]">
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
        <Button onClick={onLoadWheel} disabled={!selectedDate}>
          Load Wheel
        </Button>
      </div>
      {!showForm && (
        <Button onClick={onCreateNew} variant="outline">
          Create New Wheel
        </Button>
      )}
      <div className="flex items-center space-x-4">
        <Select
          onValueChange={onCompareSelect}
          value={compareDate || undefined}
        >
          <SelectTrigger className="w-[180px]">
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
        <Button onClick={onCompare} disabled={!selectedDate || !compareDate}>
          Compare
        </Button>
      </div>
    </div>
  );
}
