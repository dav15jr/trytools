import type { User } from "firebase/auth"

export type Tooltip = {
  score: string
  goal: string
}

export type Category = {
  name: string
  score: string
  tooltip: Tooltip
  goal: string
}

export interface Activity {
  id: string
  name: string
  category: string
}

export interface GroupedActivities {
  "HIGH LIFE TIME (HLV)": Activity[]
  "HIGH DOLLAR (HDV)": Activity[]
  "LOW DOLLAR (LDV)": Activity[]
  "ZERO VALUE (ZV)": Activity[]
}

export interface ActivitiesTableProps {
  activities: GroupedActivities
  setActivities: React.Dispatch<React.SetStateAction<GroupedActivities>>
  onAddActivity: (updatedActivities: GroupedActivities) => void
  onDeleteActivity: (updatedActivities: GroupedActivities) => void
  plannerTitle: string
  setPlannerTitle: (title: string) => void
}

export const categoryColors = {
  'HIGH LIFE TIME (HLV)': 'bg-green-600',
  'HIGH DOLLAR (HDV)': 'bg-blue-600',
  'LOW DOLLAR (LDV)': 'bg-sky-400',
  'ZERO VALUE (ZV)': 'bg-orange-500',
} as const;

export interface ProductivityChartProps {
  data: {
    HLV: number;
    HDV: number;
    LDV: number;
    ZV: number;
  };
}

export interface DynamicPieChartProps {
  data: ChartData[];
}

export interface PlannerSummaryProps {
  data: ProductivityChartProps['data']
  activities: {
    "HIGH LIFE TIME (HLV)": { name: string }[]
    "HIGH DOLLAR (HDV)": { name: string }[]
    "LOW DOLLAR (LDV)": { name: string }[]
    "ZERO VALUE (ZV)": { name: string }[]
  }
}

export interface ScheduleCell {
  activity: string
  category: string
}

export type ScheduleData = {
  [time: string]: {
    [day: string]: ScheduleCell | null
  }
}

export interface PlannerData {
  activities: GroupedActivities
  weeklySchedule: ScheduleData
  title: string
}

export interface ChartData {
  name: string
  value: number
  color: string
}

export interface ProgressData {
  date: string
  totalScore: number
}

export interface Habit {
  id: string
  name: string
  category: string
  completed: boolean
}

export type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export interface WeeklyScheduleProps {
  activities: Activity[]
  onSave: (schedule: ScheduleData) => void
  onLoad: (selectedSchedule?: string) => Promise<ScheduleData | undefined>
  savedSchedules: string[]
}

export interface WheelOfLifeChartProps {
  currentData: number[]
  comparisonData?: number[]
  labels: string[]
  fullWidth?: boolean
  currentTotalScore: number
  comparisonTotalScore?: number
  currentDate: string
  comparisonDate?: string
}

export interface ScoreFormProps {
  firstName: string
  date: string
  categories: Category[]
  isFormValid: boolean
  onFirstNameChange: (value: string) => void
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCategoryChange: (index: number, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => void
}


export interface DynamicLineChartProps {
  data: ProgressData[]
}

export interface CategoryInputProps {
  category: Category
  index: number
  onChange: (index: number, value: string) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>, index: number) => void
}

export interface GoalFormProps {
  categories: Category[]
  error: string | null
  onGoalChange: (index: number, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onEditScores: () => void
}

export interface ChartSectionProps {
  chartData: {
    data: number[]
    labels: string[]
  }
  comparisonChartData?: number[]
  totalScore: number
  comparisonTotalScore?: number
  currentDate: string
  compareDate?: string
  compareData?: Category[] | null
  categories: Category[]
  onRemoveComparison: () => void
}

export interface ProgressSectionProps {
  progressData: ProgressData[]
}

export interface WheelControlsProps {
  storedDates: string[]
  selectedDate: string | null
  compareDate: string | null
  onDateSelect: (value: string) => void
  onLoadWheel: () => void
  onCompareSelect: (value: string) => void
  onCompare: () => void
  onCreateNew: () => void
  showForm: boolean
}

