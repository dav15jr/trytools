'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { CategoryInput } from './category-input';
import type { ScoreFormProps } from '@/lib/types';

export function ScoreForm({
  firstName,
  date,
  categories,
  isFormValid,
  onFirstNameChange,
  onDateChange,
  onCategoryChange,
  onSubmit,
  onKeyDown,
}: ScoreFormProps) {
  return (
    <form onSubmit={onSubmit} id="score-form" className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="date-field">Date</Label>
          <Input
            id="date-field"
            type="date"
            value={date}
            onChange={onDateChange}
            className="mt-1"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {categories.map((category, index) => (
          <CategoryInput
            key={index}
            category={category}
            index={index}
            onChange={onCategoryChange}
            onKeyDown={onKeyDown}
          />
        ))}
      </div>

      <div className="text-center pt-4">
        <Button type="submit" size="lg" disabled={!isFormValid}>
          Set Goals
        </Button>
      </div>
    </form>
  );
}
