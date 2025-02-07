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
  name: string
}

export interface GroupedActivities {
  "HIGH LIFE TIME (HLV)": Activity[]
  "HIGH DOLLAR (HDV)": Activity[]
  "LOW DOLLAR (LDV)": Activity[]
  "ZERO VALUE (ZV)": Activity[]
}

export interface ScheduleCell {
  activity: string
  category: keyof GroupedActivities
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

