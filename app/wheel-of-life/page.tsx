'use client';

import { useState, useMemo, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import type { Category, ProgressData } from '@/types';
import { useAuth } from '@/contexts/auth-context';

const DynamicWheelOfLifeChart = dynamic(
  () =>
    import('@/components/wheel-of-life/wheel-of-life-chart').then(
      (mod) => mod.WheelOfLifeChart
    ),
  { loading: () => <p>Loading chart...</p>, ssr: false }
);
const DynamicLineChart = dynamic(
  () =>
    import('@/components/wheel-of-life/dynamic-line-chart').then(
      (mod) => mod.DynamicLineChart
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

const initialCategories: Category[] = [
  {
    name: 'Body',
    score: '',
    tooltip: {
      score: 'Rate your physical health, energy levels, and lifestyle habits',
      goal: 'Set a goal to improve your physical well-being',
    },
    goal: '',
  },
  {
    name: 'Mind',
    score: '',
    tooltip: {
      score: 'Rate your mental wellbeing, stress levels, and emotional balance',
      goal: 'Set a goal to enhance your mental health',
    },
    goal: '',
  },
  {
    name: 'Soul',
    score: '',
    tooltip: {
      score: 'Rate your spiritual connection and sense of purpose',
      goal: 'Set a goal to deepen your spiritual practice',
    },
    goal: '',
  },
  {
    name: 'Career',
    score: '',
    tooltip: {
      score: 'Rate your job satisfaction and career progress',
      goal: 'Set a career-related goal',
    },
    goal: '',
  },
  {
    name: 'Self Improvement',
    score: '',
    tooltip: {
      score: 'Rate your growth and learning in personal areas',
      goal: 'Set a personal development goal',
    },
    goal: '',
  },
  {
    name: 'Relationships',
    score: '',
    tooltip: {
      score: 'Rate the quality of your personal relationships',
      goal: 'Set a goal to improve your relationships',
    },
    goal: '',
  },
  {
    name: 'Romance',
    score: '',
    tooltip: {
      score: 'Rate your romantic relationship or satisfaction with dating life',
      goal: 'Set a goal for your romantic life',
    },
    goal: '',
  },
  {
    name: 'Money',
    score: '',
    tooltip: {
      score: 'Rate your financial situation and money management',
      goal: 'Set a financial goal',
    },
    goal: '',
  },
  {
    name: 'Leisure',
    score: '',
    tooltip: {
      score: 'Rate your work-life balance and enjoyment of free time',
      goal: 'Set a goal to improve your leisure time',
    },
    goal: '',
  },
  {
    name: 'Environment',
    score: '',
    tooltip: {
      score: 'Rate your living space and surrounding environment',
      goal: 'Set a goal to improve your environment',
    },
    goal: '',
  },
];

export default function WheelOfLifePage() {
  const { user } = useAuth();
  // const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [date, setDate] = useState('');
  const [convDate, setConvDate] = useState('');
  const [formDate, setFormDate] = useState('');
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showScoreForm, setShowScoreForm] = useState(true);
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

  // useEffect(() => {
  //   console.log('first date', date);
  // }, []);

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
    return inputDateFormat //


  };


  const onChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    const formDate = new Date(e.target.value);
    setDate(inputDate);
    setFormDate(inputDate);

  };

  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowGoalForm(true);
    setShowScoreForm(false);
    const convertedDate = convertDate(date);
    const formatedDate = formatDate(date);
    setConvDate(convertedDate);
    setDate(convertedDate);
    // setDate(formatedDate);
    // setDate(formDate);
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
    setShowScoreForm(true);
    setShowGoalForm(false);
    setDate(formDate);
    // const convertedDate = convertDate(date);
    setDate(date)
    console.log('showScoreForm changed to:', showScoreForm);
    console.log('showGoalForm changed to:', showGoalForm);

  };

  // Add this useEffect to monitor state changes
  useEffect(() => {
    console.log('showGoalForm changed to:', showGoalForm);
    console.log('showScoreForm changed to:', showScoreForm);
  }, [showGoalForm, showScoreForm]);

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
    setShowScoreForm(true);
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
        setDate(data.date || selectedDate);
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

  const renderScoresForm = () => (
    <form onSubmit={handleScoreSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={onChangeDate}
            className="mt-1"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {categories.map((category, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`category-${index}`}>{category.name}</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-5 w-5 rounded-full p-0 text-sm bg-purple-600 text-white hover:bg-purple-700 border-0"
                    >
                      ?
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{category.tooltip.score}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id={`category-${index}`}
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={category.score}
              onChange={(e) => {
                const value = e.target.value;
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
              onKeyDown={(e) => handleKeyDown(e, index)}
              onBlur={(e) => {
                const value = Number.parseFloat(e.target.value);
                if (isNaN(value) || value < 0) {
                  const newCategories = [...categories];
                  newCategories[index].score = '0';
                  setCategories(newCategories);
                } else if (value > 10) {
                  const newCategories = [...categories];
                  newCategories[index].score = '10';
                  setCategories(newCategories);
                } else {
                  const newCategories = [...categories];
                  newCategories[index].score = value.toFixed(1);
                  setCategories(newCategories);
                }
              }}
              placeholder="0-10"
              required
              className="mt-1"
            />
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Button type="submit" size="lg" disabled={!isFormValid}>
          Set Goals
        </Button>
      </div>
    </form>
  );

  const renderGoalForm = () => (
    <form onSubmit={handleGoalSubmit} className="space-y-6">
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
              onChange={(e) => {
                const newCategories = [...categories];
                newCategories[index].goal = e.target.value;
                setCategories(newCategories);
              }}
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
        <Button type="button" onClick={handleEditScores} variant="outline">
          Edit Scores
        </Button>
        <Button type="submit">Save Goals</Button>
      </div>
    </form>
  );

  const renderGoalsList = (categories: Category[]) => (
    <div className="mt-2">
      <ul className="space-y-2">
        {categories.map((category, index) => (
          <li key={index} className="flex items-start">
            <span className="font-medium mr-2">{category.name}:</span>
            <span>{category.goal}</span>
          </li>
        ))}
      </ul>
    </div>
  );

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

  const renderProgressChart = () => (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <div className="w-full">
          <DynamicLineChart data={progressData} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen max-w-[1200px] w-[1000px] mx-auto bg-gray-50 py-6 md:py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-4 text-gray-600">
            <h1 className="text-center text-4xl font-bold text-gray-900">
              Wheel of Life Assessment Tool
            </h1>
            <p className="text-gray-600 mx-auto">
              This simple but powerful Wheel of Life assessment tool will enable
              you to improve your overall life faster so you can live a happier
              more fulfilled life.
            </p>
            <p>The Wheel of Life assessment tool will help:</p>
            <ul className="list-disc list-outside space-y-2 ml-6">
              <li>
                Give you a visual representation of your life satisfaction so
                you can clearly see how your life looks currently.
              </li>
              <li>
                Assess your life in the 10 areas so you can identify and focus
                on improving the areas that you value, enabling you to improve
                your life faster.
              </li>
              <li>
                Set SMART Goals and Actions so you know what you need to do and
                why, which means you will be motivated to stick to your goals.
              </li>
              <li>
                Develop better habits that are aligned with the person you want
                to become and live the life you desire.
              </li>
            </ul>
            <p>
              Begin by ranking your level of happiness between 0 – 10 in each
              category, use the? to help guide you.
            </p>
            <p>
              For reference{' '}
              <strong>
                (0 = Unhappy, 3 = Needs Improvement, 5 = Can improve, 7 = Happy,
                10 = Very Happy)
              </strong>
            </p>
          </div>

          <Tabs defaultValue="wheel" className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-2">
              <TabsTrigger value="wheel">Wheel of Life</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="habits">Habits</TabsTrigger>
            </TabsList>
            <TabsContent value="wheel">
              <Card>
                <CardContent className="p-6 md:p-8">
                  <div className="space-y-6">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div className="flex items-center space-x-4">
                        <Select
                          onValueChange={(value) => setSelectedDate(value)}
                          value={selectedDate || undefined}
                        >
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
                        <Button
                          onClick={handleLoadWheel}
                          disabled={!selectedDate}
                        >
                          Load Wheel
                        </Button>
                      </div>
                      {!showForm && (
                        <Button
                          onClick={handleCreateNewWheel}
                          variant="outline"
                        >
                          Create New Wheel
                        </Button>
                      )}
                      <div className="flex items-center space-x-4">
                        <Select
                          onValueChange={(value) => setCompareDate(value)}
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
                        <Button
                          onClick={handleCompare}
                          disabled={!selectedDate || !compareDate}
                        >
                          Compare
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full">
                          {showForm ? (
                            showGoalForm && !showScoreForm ? (
                              renderGoalForm()
                            ) : (
                              renderScoresForm()
                            )
                          ) : (
                            <div className="flex flex-col lg:flex-row gap-6">
                              <div className="w-full xl:w-full">
                                <DynamicWheelOfLifeChart
                                  currentData={chartData.data}
                                  comparisonData={comparisonChartData}
                                  labels={chartData.labels}
                                  currentTotalScore={totalScore}
                                  comparisonTotalScore={comparisonTotalScore}
                                  currentDate={convDate}
                                  comparisonDate={compareDate || undefined}
                                />
                                {compareData && (
                                  <div className="mt-4 text-center">
                                    <Button
                                      onClick={handleRemoveComparison}
                                      variant="outline"
                                    >
                                      Remove Comparison
                                    </Button>
                                  </div>
                                )}
                              </div>
                              <div className="w-full">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Goals</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <h3 className="text-lg font-semibold mb-2">
                                      Current Goals
                                    </h3>
                                    {renderGoalsList(categories)}
                                    {compareData && (
                                      <>
                                        <h3 className="text-lg font-semibold mt-6 mb-2">
                                          Previous Goals
                                        </h3>
                                        {renderGoalsList(compareData)}
                                      </>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
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
            <TabsContent value="progress">{renderProgressChart()}</TabsContent>
            <TabsContent value="habits">
              <DynamicHabitTracker />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
