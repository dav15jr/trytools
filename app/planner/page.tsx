'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProtectedRoute from '@/components/auth/protected-route';
import dynamic from 'next/dynamic';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import type { GroupedActivities, ScheduleData, PlannerData } from '@/lib/types';

const DynamicWeeklySchedule = dynamic(
  () =>
    import('@/components/planner/weekly-schedule').then(
      (mod) => mod.WeeklySchedule
    ),
  {
    loading: () => <p>Loading chart...</p>,
    ssr: false,
  }
);
const DynamicProductivityChart = dynamic(
  () =>
    import('@/components/planner/productivity-chart').then(
      (mod) => mod.ProductivityChart
    ),
  {
    loading: () => <p>Loading chart...</p>,
    ssr: false,
  }
);
const DynamicActivitiesTable = dynamic(
  () =>
    import('@/components/planner/activities-table').then(
      (mod) => mod.ActivitiesTable
    ),
  {
    loading: () => <p>Loading chart...</p>,
    ssr: false,
  }
);
const DynamicPlannerSummary = dynamic(
  () =>
    import('@/components/planner/planner-summary').then(
      (mod) => mod.PlannerSummary
    ),
  {
    loading: () => <p>Loading chart...</p>,
    ssr: false,
  }
);

export default function PlannerPage() {
  const [activities, setActivities] = useState<GroupedActivities>({
    'HIGH LIFE TIME (HLV)': [],
    'HIGH DOLLAR (HDV)': [],
    'LOW DOLLAR (LDV)': [],
    'ZERO VALUE (ZV)': [],
  });
  const [plannerTitle, setPlannerTitle] = useState('');
  const [storedPlanners, setStoredPlanners] = useState<string[]>([]);
  const [weeklySchedule, setWeeklySchedule] = useState<ScheduleData>({});
  const [productivityData, setProductivityData] = useState({
    HLV: 0,
    HDV: 0,
    LDV: 0,
    ZV: 0,
  });

  useEffect(() => {
    loadStoredPlanners();
  }, []);

  useEffect(() => {
    updateProductivityChart();
  }, [activities, weeklySchedule]); //Fixed dependency array

  const loadStoredPlanners = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const plannersRef = collection(db, 'users', user.uid, 'planners');
      const snapshot = await getDocs(plannersRef);
      const plannerTitles = snapshot.docs.map((doc) => doc.id);
      setStoredPlanners(plannerTitles);
    } catch (error) {
      console.error('Error loading stored planners:', error);
    }
  };

  const savePlanner = async (schedule: ScheduleData) => {
    const user = auth.currentUser;
    if (!user || !plannerTitle) return;

    try {
      const plannerRef = doc(db, 'users', user.uid, 'planners', plannerTitle);
      const plannerData: PlannerData = {
        activities,
        weeklySchedule: schedule,
        title: plannerTitle,
      };
      await setDoc(plannerRef, plannerData);
      console.log('Planner saved successfully');
      loadStoredPlanners();
      setWeeklySchedule(schedule);
    } catch (error) {
      console.error('Error saving planner:', error);
    }
  };

  const loadPlanner = async (
    selectedPlanner: string | null
  ): Promise<ScheduleData | undefined> => {
    const user = auth.currentUser;
    if (!user || !selectedPlanner) return;

    try {
      const plannerRef = doc(
        db,
        'users',
        user.uid,
        'planners',
        selectedPlanner
      );
      const plannerDoc = await getDoc(plannerRef);

      if (plannerDoc.exists()) {
        const plannerData = plannerDoc.data() as PlannerData;
        setActivities(plannerData.activities);
        setPlannerTitle(plannerData.title);
        setWeeklySchedule(plannerData.weeklySchedule);
        return plannerData.weeklySchedule;
      }
    } catch (error) {
      console.error('Error loading planner:', error);
    }
  };

  const updateProductivityChart = () => {
    const newProductivityData = {
      HLV: 0,
      HDV: 0,
      LDV: 0,
      ZV: 0,
    };

    Object.values(weeklySchedule).forEach((daySchedule) => {
      Object.values(daySchedule).forEach((cell) => {
        if (cell) {
          switch (cell.category) {
            case 'HIGH LIFE TIME (HLV)':
              newProductivityData.HLV++;
              break;
            case 'HIGH DOLLAR (HDV)':
              newProductivityData.HDV++;
              break;
            case 'LOW DOLLAR (LDV)':
              newProductivityData.LDV++;
              break;
            case 'ZERO VALUE (ZV)':
              newProductivityData.ZV++;
              break;
          }
        }
      });
    });

    setProductivityData(newProductivityData);
  };

  const handleAddActivity = (updatedActivities: GroupedActivities) => {
    setActivities(updatedActivities);
  };

  const handleDeleteActivity = (updatedActivities: GroupedActivities) => {
    setActivities(updatedActivities);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6 md:py-8 min-w-[300px] max-w-[1400px]">
        <Card className="mb-8 no-print">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Productivity Planner
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm sm:text-base">
            <p className="text-gray-600 mb-1">
              Transform your life by planning and tracking your daily activities to improve your productivity. Create your weekly planner using the categories below.</p>
              <p className="text-gray-600 mb-2">Every ones life is different, so you should categorize your activities based on what is important to you.</p>
              <p  className="text-gray-600 mb-1"><span className="font-bold text-blue-500">High Lifetime Value</span> - activities that improve your life like exercise, learning a new skill, self-development, meditation.</p>
              <p  className="text-gray-600 mb-1" ><span className="font-bold text-green-500">High Dollar Value</span> - activities that bring in income such as Working or a side hustle, these directly bring money in.</p>
              <p  className="text-gray-600 mb-1"  ><span className="font-bold text-yellow-500">Low Dollar Value</span> - activities have that save you money, like gardening, learning a new profesional skill.</p>
            <p  className="text-gray-600 mb-2"><span className="font-bold text-red-500">Zero Value</span> - activities that don't add any value or negatively impact your life, like watching TV, smoking, mindlessly scrolling on social media.</p>
          <p className="text-gray-600"> For reference you should aim your chart to have HLV 40%, HDV 30%, LDV 20%, ZV 10% for your activities.</p>
          </CardContent>
        </Card>

        <div className=" gap-4 md:gap-6 mb-6 no-print">
          <div className="">
            <Card>
              <CardContent className="p-4">
                <DynamicActivitiesTable
                  activities={activities}
                  setActivities={setActivities}
                  onAddActivity={handleAddActivity}
                  onDeleteActivity={handleDeleteActivity}
                  plannerTitle={plannerTitle}
                  setPlannerTitle={setPlannerTitle}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="print-container">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full md:w-4/5">
            <div className="mb-4 text-center">
              <h2 className="text-2xl md:text-4xl font-bold">{plannerTitle}</h2>
            </div>
            <DynamicWeeklySchedule
              activities={Object.entries(activities).flatMap(
                ([category, acts]) =>
                  acts.map((act: { name: string }) => ({
                    ...act,
                    id: act.name,
                    category: category as keyof GroupedActivities,
                  }))
              )}
              onSave={savePlanner}
              onLoad={(selectedSchedule?: string) =>
                loadPlanner(selectedSchedule || null)
              }
              savedSchedules={storedPlanners}
            />
          </div>
          <div className="space-y-6 w-full md:w-1/5 ">
            <DynamicProductivityChart data={productivityData} />
            <DynamicPlannerSummary
              data={productivityData}
              activities={activities}
            />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
