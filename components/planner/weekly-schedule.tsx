'use client';

import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect, useMemo, Fragment } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { PrinterIcon as Print } from 'lucide-react';
import type { ScheduleData, Activity, WeeklyScheduleProps } from '@/lib/types';
import { categoryColors } from '@/lib/types';

export function WeeklySchedule({
  activities,
  onSave,
  onLoad,
  savedSchedules,
}: WeeklyScheduleProps) {
  const [schedule, setSchedule] = useState<ScheduleData>({});
  const [selectedCell, setSelectedCell] = useState<{
    time: string;
    day: string;
  } | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [includeWeekends, setIncludeWeekends] = useState(false);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('22:00');
  const [blockSize, setBlockSize] = useState('60');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const days = useMemo(() => {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return includeWeekends ? [...weekdays, 'Saturday', 'Sunday'] : weekdays;
  }, [includeWeekends]);

  const timeSlots = useMemo(() => {
    const slots = [];
    const start = Number.parseInt(startTime.split(':')[0]);
    const end = Number.parseInt(endTime.split(':')[0]);
    const interval = Number.parseInt(blockSize);

    for (let hour = start; hour < end; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        slots.push(
          `${hour.toString().padStart(2, '0')}:${minute
            .toString()
            .padStart(2, '0')}`
        );
      }
    }
    return slots;
  }, [startTime, endTime, blockSize]);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    const loadedSchedule = await onLoad(selectedSchedule || undefined);
    if (loadedSchedule) {
      setSchedule(loadedSchedule);
    }
  };

  const handleCellClick = (time: string, day: string) => {
    setSelectedCell({ time, day });
    setSelectedActivity(null);
    setSelectedDuration(null);
  };

  const handleActivitySelect = (value: string) => {
    const [category, name] = value.split(':');
    const activity = activities.find(
      (a) => a.name === name && a.category === category
    );
    if (activity) {
      setSelectedActivity(activity);
    }
  };

  const handleDurationSelect = (duration: string) => {
    if (!selectedCell || !selectedActivity) return;

    const durationMinutes = Number.parseInt(duration);
    const startIndex = timeSlots.indexOf(selectedCell.time);
    const endIndex = Math.min(
      startIndex + durationMinutes / Number.parseInt(blockSize),
      timeSlots.length
    );

    setSchedule((prevSchedule) => {
      const newSchedule = { ...prevSchedule };
      for (let i = startIndex; i < endIndex; i++) {
        const time = timeSlots[i];
        if (!newSchedule[time]) {
          newSchedule[time] = {};
        }
        newSchedule[time][selectedCell.day] = {
          activity: selectedActivity.name,
          category: selectedActivity.category,
        };
      }
      return newSchedule;
    });

    setSelectedCell(null);
    setSelectedActivity(null);
  };

  const handleCancel = () => {
    setSelectedCell(null);
    setSelectedActivity(null);
  };

  const groupedActivities = activities.reduce((acc, activity) => {
    if (!acc[activity.category]) {
      acc[activity.category] = [];
    }
    acc[activity.category].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 print-component">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 no-print">
        <div className="flex flex-row items-center justify-between space-y-0 space-x-4">
          <Select
            onValueChange={setSelectedSchedule}
            value={selectedSchedule || undefined}
          >
            <SelectTrigger className="w-[170px] p-6 sm:p-2">
              <SelectValue placeholder="Select schedule" />
            </SelectTrigger>
            <SelectContent>
              {savedSchedules.map((scheduleName) => (
                <SelectItem key={scheduleName} value={scheduleName}>
                  {scheduleName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={loadSchedule} disabled={!selectedSchedule}>
            Load Schedule
          </Button>
        </div>
        <div className="flex flex-row items-start md:items-center space-x-4">
          <Button onClick={() => onSave(schedule)}>Save Schedule</Button>
          <Button onClick={handlePrint} variant="outline">
            <Print className="mr-1 h-4 w-4" /> Print Schedule
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap justify-between items-center gap-3 pb-8 no-print">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0 my-6 sm:my-0">
          <Checkbox
            id="include-weekends"
            checked={includeWeekends}
            onCheckedChange={(checked) =>
              setIncludeWeekends(checked as boolean)
            }
          />
          <Label
            htmlFor="include-weekends"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Include Weekends
          </Label>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex flex-col">
            <Label htmlFor="startTime" className="mb-1">
              Day Start
            </Label>
            <Select onValueChange={setStartTime} value={startTime}>
              <SelectTrigger className="w-[90px]" id="startTime">
                <SelectValue placeholder="Start Time" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <SelectItem
                    key={hour}
                    value={`${hour.toString().padStart(2, '0')}:00`}
                  >
                    {`${hour.toString().padStart(2, '0')}:00`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="endTime" className="mb-1">
              Day End
            </Label>
            <Select onValueChange={setEndTime} value={endTime}>
              <SelectTrigger className="w-[90px]" id="endTime">
                <SelectValue placeholder="End Time" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <SelectItem
                    key={hour}
                    value={`${hour.toString().padStart(2, '0')}:00`}
                  >
                    {`${hour.toString().padStart(2, '0')}:00`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex flex-col">
            <Label htmlFor="blockSize" className="mb-1">
              Time Block Size
            </Label>
            <Select onValueChange={setBlockSize} value={blockSize}>
              <SelectTrigger className="w-[125px]" id="blockSize">
                <SelectValue placeholder="Block Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-between sm:justify-end space-x-4 no-print">
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className="flex items-center mt-1">
            <div className={`w-4 h-4 ${color} mr-2`}></div>
            <span className="text-xs sm:text-sm">{category}</span>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 text-center">Time</TableHead>
                  {days.map((day) => (
                    <TableHead className="text-center" key={day}>
                      {day}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeSlots.map((time) => (
                  <TableRow key={time}>
                    <TableCell className="font-medium">{time}</TableCell>
                    {days.map((day) => (
                      <TableCell
                        key={`${day}-${time}`}
                        className="p-0 cursor-pointer hover:bg-gray-200 relative"
                        onClick={() => handleCellClick(time, day)}
                      >
                        {selectedCell?.time === time &&
                        selectedCell?.day === day ? (
                          <div
                            className="absolute inset-0 z-10 min-w-40"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex flex-col gap-2 bg-white p-2 border shadow-lg">
                              <Select onValueChange={handleActivitySelect}>
                                <SelectTrigger
                                  className="w-full text-sm sm:text-base"
                                >
                                  <SelectValue
                                    
                                    placeholder="Select activity"
                                  />
                                </SelectTrigger>
                                <SelectContent
                                  onPointerDownOutside={(e) =>
                                    e.preventDefault()
                                  }
                                >
                                  {Object.entries(groupedActivities).map(
                                    ([category, acts]) => (
                                      <SelectGroup key={category}>
                                        <SelectLabel>{category}</SelectLabel>
                                        {acts.map((activity) => (
                                          <SelectItem
                                            key={activity.id}
                                            value={`${activity.category}:${activity.name}`}
                                          >
                                            {activity.name}
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                              {selectedActivity && (
                                <Select onValueChange={handleDurationSelect}>
                                  <SelectTrigger
                                    className="w-full text-sm sm:text-base"
                                   
                                  >
                                    <SelectValue placeholder="Select duration" />
                                  </SelectTrigger>
                                  <SelectContent
                                    onPointerDownOutside={(e) =>
                                      e.preventDefault()
                                    }
                                  >
                                    {[15, 30, 60, 90, 120, 180, 240].map(
                                      (duration) => (
                                        <SelectItem
                                          key={duration}
                                          value={duration.toString()}
                                        >
                                          {duration} minutes
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              )}
                              <Button
                                variant="ghost"
                                className="mt-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancel();
                                }}
                          
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`${
                              schedule[time]?.[day]
                                ? categoryColors[
                                    schedule[time][day]
                                      .category as keyof typeof categoryColors
                                  ]
                                : ''
                            } text-white p-2 text-sm min-h-[40px] transition-colors`}
                          >
                            {schedule[time]?.[day] &&
                              `${schedule[time][day].activity}`}
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
      </div>
    </div>
  );
}
