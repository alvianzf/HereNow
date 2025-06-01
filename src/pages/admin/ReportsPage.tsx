import { useState, useEffect } from 'react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import AdminLayout from '../../components/layout/AdminLayout';
import { getAllEmployeeAttendance } from '../../services/attendanceService';
import { getAllUsers } from '../../services/userService';
import { exportAttendanceReport } from '../../services/exportService';
import { AttendanceRecord } from '../../types/attendance';
import { User } from '../../types/user';
import { Download, Filter, BarChart2 } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  });
  const [departmentStats, setDepartmentStats] = useState<any[]>([]);
  const [attendanceByDay, setAttendanceByDay] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [records, userList] = await Promise.all([
        getAllEmployeeAttendance(),
        getAllUsers()
      ]);
      
      // Filter records by date range
      const filteredRecords = records.filter(
        (record) => record.date >= dateRange.startDate && record.date <= dateRange.endDate
      );
      
      setAttendanceRecords(filteredRecords);
      setUsers(userList);
      
      // Process data for charts
      processChartData(filteredRecords, userList);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (records: AttendanceRecord[], userList: User[]) => {
    // Process department attendance stats
    const deptMap = new Map<string, { total: number; employees: Set<string> }>();
    
    records.forEach(record => {
      const user = userList.find(u => u.id === record.userId);
      if (user) {
        const dept = user.department;
        if (!deptMap.has(dept)) {
          deptMap.set(dept, { total: 0, employees: new Set() });
        }
        
        const deptData = deptMap.get(dept)!;
        deptData.employees.add(user.id);
        if (record.totalHours) {
          deptData.total += record.totalHours;
        }
      }
    });
    
    const deptStats = Array.from(deptMap.entries()).map(([name, data]) => ({
      name,
      hours: data.total,
      employees: data.employees.size,
      averageHours: data.employees.size > 0 ? data.total / data.employees.size : 0
    }));
    
    setDepartmentStats(deptStats);
    
    // Process attendance by day
    const dayMap = new Map<string, { count: number; hours: number }>();
    
    records.forEach(record => {
      const day = format(new Date(record.date), 'EEE');
      if (!dayMap.has(day)) {
        dayMap.set(day, { count: 0, hours: 0 });
      }
      
      const dayData = dayMap.get(day)!;
      dayData.count += 1;
      if (record.totalHours) {
        dayData.hours += record.totalHours;
      }
    });
    
    // Sort by day of week
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayStats = days.map(day => {
      const data = dayMap.get(day) || { count: 0, hours: 0 };
      return {
        day,
        count: data.count,
        hours: data.hours,
        averageHours: data.count > 0 ? data.hours / data.count : 0
      };
    });
    
    setAttendanceByDay(dayStats);
  };

  const handleDateRangeChange = (period: 'current' | 'previous' | 'week' | 'custom') => {
    const now = new Date();
    
    if (period === 'current') {
      setDateRange({
        startDate: format(startOfMonth(now), 'yyyy-MM-dd'),
        endDate: format(endOfMonth(now), 'yyyy-MM-dd'),
      });
    } else if (period === 'previous') {
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      setDateRange({
        startDate: format(startOfMonth(prevMonth), 'yyyy-MM-dd'),
        endDate: format(endOfMonth(prevMonth), 'yyyy-MM-dd'),
      });
    } else if (period === 'week') {
      setDateRange({
        startDate: format(subDays(now, 7), 'yyyy-MM-dd'),
        endDate: format(now, 'yyyy-MM-dd'),
      });
    }
    // For custom, we'd typically use a date picker component
  };

  const handleExport = () => {
    exportAttendanceReport(
      attendanceRecords,
      users,
      `${format(new Date(dateRange.startDate), 'MMM_dd')}_to_${format(new Date(dateRange.endDate), 'MMM_dd')}`
    );
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const COLORS = ['#2563eb', '#0d9488', '#4f46e5', '#10b981', '#8b5cf6', '#f59e0b'];

  if (loading) {
    return (
      <AdminLayout title="Reports">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Reports">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Attendance Reports</h2>
          <p className="text-sm text-gray-500">
            {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleDateRangeChange('week')}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Last 7 Days
          </button>
          <button
            onClick={() => handleDateRangeChange('current')}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Current Month
          </button>
          <button
            onClick={() => handleDateRangeChange('previous')}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous Month
          </button>
          <button
            onClick={handleExport}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90"
          >
            <Download className="mr-1 inline-block h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Department Hours Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Hours by Department</h3>
            <BarChart2 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="h-80">
            {departmentStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentStats}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={10} />
                  <YAxis tick={{ fontSize: 12 }} tickMargin={10} />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'hours') return [`${value.toFixed(1)} hours`, 'Total Hours'];
                      if (name === 'averageHours') return [`${value.toFixed(1)} hours`, 'Avg Hours/Employee'];
                      return [value, name];
                    }}
                    labelStyle={{ fontWeight: 'bold' }}
                    contentStyle={{ borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar
                    dataKey="hours"
                    name="Total Hours"
                    fill="hsl(var(--primary))"
                    barSize={20}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="averageHours"
                    name="Avg Hours/Employee"
                    fill="hsl(var(--secondary))"
                    barSize={20}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Department Distribution Pie Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Department Distribution</h3>
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="h-80">
            {departmentStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="employees"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {departmentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [`${value} employees`, props.payload.name]}
                    labelStyle={{ fontWeight: 'bold' }}
                    contentStyle={{ borderRadius: '8px' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Attendance by Day of Week */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Attendance by Day of Week</h3>
            <BarChart2 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="h-80">
            {attendanceByDay.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={attendanceByDay}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} tickMargin={10} />
                  <YAxis tick={{ fontSize: 12 }} tickMargin={10} />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'count') return [value, 'Attendance Count'];
                      if (name === 'hours') return [`${value.toFixed(1)} hours`, 'Total Hours'];
                      if (name === 'averageHours') return [`${value.toFixed(1)} hours`, 'Avg Hours/Attendance'];
                      return [value, name];
                    }}
                    labelStyle={{ fontWeight: 'bold' }}
                    contentStyle={{ borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar
                    dataKey="count"
                    name="Attendance Count"
                    fill="hsl(var(--primary))"
                    barSize={20}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="hours"
                    name="Total Hours"
                    fill="hsl(var(--secondary))"
                    barSize={20}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}