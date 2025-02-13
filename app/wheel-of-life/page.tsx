'use client';

import { useState, useMemo, useEffect } from 'react';

import { Card, CardContent } from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProtectedRoute from '@/components/auth/protected-route';
import dynamic from 'next/dynamic';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import type { Category, ProgressData } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';
import { Instructions } from '@/components/wheel-of-life/instructions';
import { ScoreForm } from '@/components/wheel-of-life/score-form';
import { GoalForm } from '@/components/wheel-of-life/goal-form';
import { ChartSection } from '@/components/wheel-of-life/chart-section';
import { ProgressSection } from '@/components/wheel-of-life/progress-section';
import { WheelControls } from '@/components/wheel-of-life/wheel-controls';
import { initialCategories } from '@/lib/initial-data';

const DynamicWheelOfLifeChart = dynamic(
  () =>
    import('@/components/wheel-of-life/wheel-of-life-chart').then(
      (mod) => mod.WheelOfLifeChart
    ),
  { loading: () => <p>Loading chart...</p>, ssr: false }
);

const DynamicHabitTracker = dynamic(
  () =>
    import('@/components/wheel-of-life/habit-tracker').then(
      (mod) => mod.HabitTracker
    ),
  {
    loading: () => <p>Loading chart...</p>,
    ssr: false,
  }
);

export default function WheelOfLifePage() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [date, setDate] = useState('');
  const [convDate, setConvDate] = useState('');
  const [formDate, setFormDate] = useState('');
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storedDates, setStoredDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [compareDate, setCompareDate] = useState<string | null>(null);
  const [compareData, setCompareData] = useState<Category[] | null>(null);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);

  useEffect(() => {
    if (user) {
      fetchStoredDates(user.uid);
    }
  }, [user]);

  const fetchStoredDates = async (userId: string) => {
    try {
      const wheelOfLifeRef = collection(db, 'users', userId, 'wheelOfLife');
      const querySnapshot = await getDocs(wheelOfLifeRef);
      const dates = querySnapshot.docs.map((doc) => doc.id);
      setStoredDates(dates);
    } catch (error) {
      console.error('Error fetching stored dates:', error);
    }
  };

  const totalScore = useMemo(() => {
    return categories.reduce((sum, category) => {
      const score = Number.parseFloat(category.score) || 0;
      return sum + score;
    }, 0);
  }, [categories]);

  const comparisonTotalScore = useMemo(() => {
    if (!compareData) return undefined;
    return compareData.reduce((sum, category) => {
      const score = Number.parseFloat(category.score) || 0;
      return sum + score;
    }, 0);
  }, [compareData]);

  const chartData = useMemo(() => {
    return {
      data: categories.map((category) => Number(category.score) || 0),
      labels: categories.map((category) => category.name),
    };
  }, [categories]);

  const comparisonChartData = useMemo(() => {
    if (!compareData) return undefined;
    return compareData.map((category) => Number(category.score) || 0);
  }, [compareData]);

  const isFormValid = useMemo(() => {
    return (
      firstName.trim() !== '' &&
      date !== '' &&
      categories.every((category) => category.score !== '')
    );
  }, [firstName, date, categories]);

  const convertDate = (inputDate: string) => {
    const newDate = new Date(inputDate);
    return newDate
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      })
      .replace(/ /g, '-');
  };
  const formatDate = (inputDate: string) => {
    const today = new Date(inputDate);
    const inputDateFormat = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    return inputDateFormat; //
  };

  const onChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    const convertedDate = convertDate(inputDate);
    const formatedDate = formatDate(inputDate);
    setDate(formatedDate);
    setFormDate(convertedDate);
  };

  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowGoalForm(true);
    setConvDate(formDate);
    scrollFormTop();
  };

  const scrollFormTop = () => {
    setTimeout(() => {
      const topForm = document.getElementById('wheel-controls');
      topForm?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user) {
      setError('You must be logged in to save your goals.');
      return;
    }

    const dataToSave = categories.reduce((acc, category) => {
      acc[category.name] = {
        Score: Number.parseFloat(category.score),
        Goal: category.goal,
      };
      return acc;
    }, {} as Record<string, { Score: number; Goal: string }>);

    try {
      const wheelOfLifeRef = doc(
        collection(db, 'users', user.uid, 'wheelOfLife'),
        convDate
      );
      await setDoc(wheelOfLifeRef, {
        firstName,
        date: convDate,
        ...dataToSave,
      });
      console.log('Data saved successfully');
      setShowForm(false);
      fetchStoredDates(user.uid);
    } catch (error: any) {
      console.error('Error saving data:', error);
      setError(`Error saving data: ${error.message}`);
    }
  };

  const handleEditScores = () => {
    setShowGoalForm(false);
    scrollFormTop();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const nextInput = document.getElementById(`category-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      } else {
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
          (submitButton as HTMLButtonElement).focus();
        }
      }
    }
  };

  const handleCreateNewWheel = () => {
    setCategories(initialCategories);
    setShowForm(true);
    setShowGoalForm(false);
    setSelectedDate(null);
    setCompareDate(null);
    setCompareData(null);
  };

  const handleLoadWheel = async () => {
    if (!user || !selectedDate) return;

    try {
      const wheelOfLifeRef = doc(
        collection(db, 'users', user.uid, 'wheelOfLife'),
        selectedDate
      );
      const wheelOfLifeDoc = await getDoc(wheelOfLifeRef);

      if (wheelOfLifeDoc.exists()) {
        const data = wheelOfLifeDoc.data();
        const loadedCategories = initialCategories.map((category) => ({
          ...category,
          score: data[category.name]?.Score.toString() || '',
          goal: data[category.name]?.Goal || '',
        }));
        setCategories(loadedCategories);
        setFirstName(data.firstName || '');
        setConvDate(data.convDate || selectedDate);
        setShowForm(false);
        setCompareData(null);
        setCompareDate(null);
      } else {
        setError('No data found for the selected date');
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      setError(`Error loading data: ${error.message}`);
    }
  };

  const handleCompare = async () => {
    if (!user || !compareDate) return;

    try {
      const wheelOfLifeRef = doc(
        collection(db, 'users', user.uid, 'wheelOfLife'),
        compareDate
      );
      const wheelOfLifeDoc = await getDoc(wheelOfLifeRef);

      if (wheelOfLifeDoc.exists()) {
        const data = wheelOfLifeDoc.data();
        const loadedCategories = initialCategories.map((category) => ({
          ...category,
          score: data[category.name]?.Score.toString() || '',
          goal: data[category.name]?.Goal || '',
        }));
        setCompareData(loadedCategories);
        setCompareDate(compareDate);
      } else {
        setError('No data found for the comparison date');
      }
    } catch (error: any) {
      console.error('Error loading comparison data:', error);
      setError(`Error loading comparison data: ${error.message}`);
    }
  };

  const handleRemoveComparison = () => {
    setCompareData(null);
    setCompareDate(null);
  };

  const fetchProgressData = async (userId: string) => {
    try {
      const wheelOfLifeRef = collection(db, 'users', userId, 'wheelOfLife');
      const q = query(wheelOfLifeRef, orderBy('date', 'desc'), limit(20));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => {
        const wheelData = doc.data();
        const totalScore = Object.values(wheelData).reduce(
          (sum: number, value: any) => {
            return sum + (typeof value.Score === 'number' ? value.Score : 0);
          },
          0
        );
        return { date: doc.id, totalScore };
      });

      // Sort the data chronologically
      const sortedData = data.sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('-');
        const [dayB, monthB, yearB] = b.date.split('-');

        // Convert month abbreviation to number (Jan = 0, Feb = 1, etc.)
        const monthMap: { [key: string]: number } = {
          Jan: 0,
          Feb: 1,
          Mar: 2,
          Apr: 3,
          May: 4,
          Jun: 5,
          Jul: 6,
          Aug: 7,
          Sep: 8,
          Oct: 9,
          Nov: 10,
          Dec: 11,
        };

        // Create dates using the components (add 2000 to year since it's YY format)
        const dateA = new Date(
          2000 + parseInt(yearA),
          monthMap[monthA],
          parseInt(dayA)
        );
        const dateB = new Date(
          2000 + parseInt(yearB),
          monthMap[monthB],
          parseInt(dayB)
        );

        return dateA.getTime() - dateB.getTime();
      });

      setProgressData(sortedData);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProgressData(user.uid);
    }
  }, [user, fetchProgressData]); // Added fetchProgressData to dependencies

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 py-6 md:py-12 px-4">
        <div className="min-h-screen max-w-6xl mx-auto space-y-8">
          <Instructions />

          <Tabs defaultValue="wheel" className="w-full">
            <TabsList className="grid w-full grid-cols-3 gap-2 h-full">
              <TabsTrigger className="p-4 sm:p-2" value="wheel">Wheel of Life</TabsTrigger>
              <TabsTrigger className="p-4 sm:p-2" value="progress">Progress</TabsTrigger>
              <TabsTrigger className="p-4 sm:p-2" value="habits">Habits</TabsTrigger>
            </TabsList>

            <TabsContent value="wheel">
              <Card>
                <CardContent className="p-6 md:p-8">
                  <div className="space-y-6">
                    <WheelControls
                      storedDates={storedDates}
                      selectedDate={selectedDate}
                      compareDate={compareDate}
                      onDateSelect={setSelectedDate}
                      onLoadWheel={handleLoadWheel}
                      onCompareSelect={setCompareDate}
                      onCompare={handleCompare}
                      onCreateNew={handleCreateNewWheel}
                      showForm={showForm}
                    />

                    <div className="space-y-8">
                      <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full">
                          {showForm ? (
                            showGoalForm ? (
                              <GoalForm
                                categories={categories}
                                error={error}
                                onGoalChange={(index, value) => {
                                  const newCategories = [...categories];
                                  newCategories[index].goal = value;
                                  setCategories(newCategories);
                                }}
                                onSubmit={handleGoalSubmit}
                                onEditScores={handleEditScores}
                              />
                            ) : (
                              <ScoreForm
                                firstName={firstName}
                                date={date}
                                categories={categories}
                                isFormValid={isFormValid}
                                onFirstNameChange={setFirstName}
                                onDateChange={onChangeDate}
                                onCategoryChange={(index, value) => {
                                  if (
                                    value === '' ||
                                    (Number.parseFloat(value) >= 0 &&
                                      Number.parseFloat(value) <= 10)
                                  ) {
                                    const newCategories = [...categories];
                                    newCategories[index].score = value;
                                    setCategories(newCategories);
                                  }
                                }}
                                onSubmit={handleScoreSubmit}
                                onKeyDown={handleKeyDown}
                              />
                            )
                          ) : (
                            <ChartSection
                              chartData={chartData}
                              comparisonChartData={comparisonChartData}
                              totalScore={totalScore}
                              comparisonTotalScore={comparisonTotalScore}
                              currentDate={convDate}
                              compareDate={compareDate || undefined}
                              compareData={compareData}
                              categories={categories}
                              onRemoveComparison={handleRemoveComparison}
                            />
                          )}
                        </div>
                        {showForm && (
                          <div className="w-full">
                            <DynamicWheelOfLifeChart
                              currentData={chartData.data}
                              comparisonData={comparisonChartData}
                              labels={chartData.labels}
                              currentTotalScore={totalScore}
                              comparisonTotalScore={comparisonTotalScore}
                              currentDate={convDate}
                              comparisonDate={compareDate || undefined}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="min-h-full">
              <ProgressSection progressData={progressData} />
            </TabsContent>

            <TabsContent value="habits">
              <DynamicHabitTracker />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
