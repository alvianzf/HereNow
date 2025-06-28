import { useState, useEffect } from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { getAttendanceSummary, getWeeklyAttendance } from '../../services/attendanceService';
import { AttendanceSummary as SummaryType, WeeklyAttendance } from '../../types/attendance';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, CalendarDays, AlertTriangle } from 'lucide-react';

export default function AttendanceSummary() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryType | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyAttendance[]>([]);

  useEffect(() => {
    if (user) {
      fetchAttendanceSummary();
    }
  }, [user]);

  const fetchAttendanceSummary = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get current month summary
      const now = new Date();
      const firstDay = format(startOfMonth(now), 'yyyy-MM-dd');
      const lastDay = format(endOfMonth(now), 'yyyy-MM-dd');
      
      const summaryData = await getAttendanceSummary(
        user.id,
        firstDay,
        lastDay
      );
      setSummary(summaryData);
      
      // Get weekly data for the chart
      const weeklyAttendance = await getWeeklyAttendance(user.id, 4);
      setWeeklyData(weeklyAttendance);
    } catch (error) {
      console.error('Failed to fetch attendance summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
        <div className="text-center text-gray-500">No summary data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-primary/10 p-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Hours</p>
              <p className="text-2xl font-semibold">{summary.totalHours.toFixed(1)}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-secondary/10 p-3">
              <CalendarDays className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Days Present</p>
              <p className="text-2xl font-semibold">{summary.totalDays}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-warning/10 p-3">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Late Arrivals</p>
              <p className="text-2xl font-semibold">{summary.lateArrivals}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-medium">Weekly Hours</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="week" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickMargin={10}
                domain={[0, 'dataMax + 5']}
              />
              <Tooltip 
                formatter={(value) => [`${value} hours`, 'Total Hours']}
                labelStyle={{ fontWeight: 'bold' }}
                contentStyle={{ borderRadius: '8px' }}
              />
              <Bar 
                dataKey="totalHours" 
                name="Hours" 
                fill="hsl(var(--primary))" 
                barSize={40}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}