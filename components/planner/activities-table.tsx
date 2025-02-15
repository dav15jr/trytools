"use client"

import { useState, useEffect} from "react"
import { categoryColors } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ActivitiesTableProps, GroupedActivities } from "@/lib/types"

export function ActivitiesTable({
  activities,
  setActivities,
  onAddActivity,
  onDeleteActivity,
  plannerTitle,
  setPlannerTitle,
}: ActivitiesTableProps) {
  const [newActivity, setNewActivity] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<keyof GroupedActivities>("HIGH LIFE TIME (HLV)")
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    category: keyof GroupedActivities
    index: number
  } | null>(null)

  useEffect(() => {
    setActivities(activities)
  }, [activities, setActivities])

  const addActivity = () => {
    if (!newActivity.trim()) return

    const updatedActivities = {
      ...activities,
      [selectedCategory]: [...activities[selectedCategory], { name: newActivity.trim() }],
    }
    setActivities(updatedActivities)
    onAddActivity(updatedActivities)
    setNewActivity("")
  }

  const deleteActivity = (category: keyof GroupedActivities, index: number) => {
    const updatedActivities = {
      ...activities,
      [category]: activities[category].filter((_, i) => i !== index),
    }
    setActivities(updatedActivities)
    onDeleteActivity(updatedActivities)
    setDeleteConfirmation(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-6 md:flex-row md:gap-4 mb-4">
        <Input
          placeholder="Planner name"
          value={plannerTitle}
          onChange={(e) => setPlannerTitle(e.target.value)}
          className="w-full sm:w-[250px] sm:max-w-sm"
        />
        <Input
          placeholder="New activity"
          value={newActivity}
          onChange={(e) => setNewActivity(e.target.value)}
          className="w-full sm:w-[250px] max-w-xs"
        />
        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as keyof GroupedActivities)}
        >
          <SelectTrigger className="w-full sm:w-[200px] p-6 sm:p-2">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HIGH LIFE TIME (HLV)">High Life Time Value</SelectItem>
            <SelectItem value="HIGH DOLLAR (HDV)">High Dollar Value</SelectItem>
            <SelectItem value="LOW DOLLAR (LDV)">Low Dollar Value</SelectItem>
            <SelectItem value="ZERO VALUE (ZV)">Zero Value</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={addActivity}>Add Activity</Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {Object.keys(activities).map((category) => (
                <TableHead
                  key={category}
                  className={`${categoryColors[category as keyof GroupedActivities]} text-white min-w-[120px] text-xs sm:text-base`}
                >
                  {category}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: Math.max(...Object.values(activities).map((cat) => cat.length)) }).map((_, index) => (
              <TableRow key={index}>
                {(Object.keys(activities) as Array<keyof GroupedActivities>).map((category) => (
                  <TableCell key={category}>
                    {activities[category][index] && (
                      <div className="flex items-center justify-between gap-4 sm:gap-2 text-xs sm:text-base">
                        <span>{activities[category][index].name}</span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className="font-bold text-xl p-0 m-0"
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirmation({ category, index })}
                            >
                              ×
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete the activity "{activities[category][index].name}"?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={() => deleteActivity(category, index)}>
                                Delete
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

