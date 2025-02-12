'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import type { GoalFormProps } from '@/lib/types';

export function GoalForm({
  categories,
  error,
  onGoalChange,
  onSubmit,
  onEditScores,
}: GoalFormProps) {
  return (
    <form onSubmit={onSubmit} id="goal-form" className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {categories.map((category, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`goal-${index}`}>
                {category.name}{' '}
                <span className="text-sm text-gray-500">
                  (Score: {category.score})
                </span>
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size= "sm"
                      className="h-5 w-5 rounded-full p-0 text-sm bg-purple-600 text-white hover:bg-purple-700 border-0"
                    >
                      ?
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{category.tooltip.goal}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id={`goal-${index}`}
              value={category.goal}
              onChange={(e) => onGoalChange(index, e.target.value)}
              placeholder="Enter your goal"
              required
              className="mt-1"
            />
          </div>
        ))}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center gap-4 pt-4">
        <Button type="button" onClick={onEditScores} variant="outline">
          Edit Scores
        </Button>
        <Button type="submit">Save Goals</Button>
      </div>
    </form>
  );
}
