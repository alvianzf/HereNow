import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import AdminLayout from '../../components/layout/AdminLayout';
import { getUserById } from '../../services/userService';
import { getAttendanceHistory, getAttendanceSummary } from '../../services/attendanceService';
import { User } from '../../types/user';
import { AttendanceRecord, AttendanceSummary } from '../../types/attendance';
import { exportToExcel, prepareAttendanceForExport } from '../../services/exportService';
import { 
  User as UserIcon, 
  Mail, 
  Briefcase, 
  Building, 
  Clock, 
  Calendar, 
  ArrowLeft,
  Download,
  AlertTriangle 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function EmployeeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<User | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    if (id) {
      fetchEmployeeData();
    }
  }, [id, dateRange]);

  const fetchEmployeeData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [userData, attendanceData, summaryData] = await Promise.all([
        getUserById(id),
        getAttendanceHistory(id, dateRange.startDate, dateRange.endDate),
        getAttendanceSummary(id, dateRange.startDate, dateRange.endDate)
      ]);
      
      setEmployee(userData);
      setAttendanceRecords(attendanceData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to fetch employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!employee || attendanceRecords.length === 0) return;
    
    const formattedData = prepareAttendanceForExport(
      attendanceRecords,
      [employee]
    );
    
    const fileName = `Attendance_${employee.firstName}_${employee.lastName}_${format(
      new Date(dateRange.startDate),
      'MMM_dd'
    )}_to_${format(new Date(dateRange.endDate), 'MMM_dd_yyyy')}`;
    
    exportToExcel(formattedData, fileName);
  };

  const handleDateRangeChange = (period: 'current' | 'previous' | 'custom') => {
    const now = new Date();
    
    if (period === 'current') {
      setDateRange({
        startDate: format(startOfMonth(now), 'yyyy-MM-dd'),
        endDate: format(endOfMonth(now), 'yyyy-MM-dd'),
      });
    } else if (period === 'previous') {
      const prevMonth = subMonths(now, 1);
      setDateRange({
        startDate: format(startOfMonth(prevMonth), 'yyyy-MM-dd'),
        endDate: format(endOfMonth(prevMonth), 'yyyy-MM-dd'),
      });
    }
    // For custom, we'd typically use a date picker component
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'clocked_in':
        return <span className="badge badge-success">Clocked In</span>;
      case 'clocked_out':
        return <span className="badge badge-neutral">Clocked Out</span>;
      case 'break':
        return <span className="badge badge-warning">On Break</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  // Prepare data for attendance chart
  const getChartData = () => {
    // Group by date and calculate hours
    const dateMap = new Map<string, number>();
    
    attendanceRecords.forEach(record => {
      if (record.totalHours) {
        const formattedDate = format(new Date(record.date), 'MMM dd');
        dateMap.set(formattedDate, record.totalHours);
      }
    });
    
    return Array.from(dateMap).map(([date, hours]) => ({
      date,
      hours
    }));
  };

  if (loading) {
    return (
      <AdminLayout title="Employee Details">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!employee) {
    return (
      <AdminLayout title="Employee Details">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow text-center">
          <div className="text-gray-500">Employee not found</div>
          <button
            onClick={() => navigate('/admin/employees')}
            className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Employee Details">
      <div className="mb-4">
        <button
          onClick={() => navigate('/admin/employees')}
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Employees
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Employee Profile Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow lg:col-span-1">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              {employee.profileImage ? (
                <img
                  src={employee.profileImage}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                  <UserIcon className="h-12 w-12 text-gray-500" />
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{employee.position}</p>
            
            <div className="mt-6 w-full space-y-4">
              <div className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">{employee.email}</span>
              </div>
              <div className="flex items-center">
                <Building className="mr-3 h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">{employee.department}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="mr-3 h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">{employee.position}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Attendance Summary */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Attendance Summary</h3>
            
            <div className="mt-2 flex space-x-2 sm:mt-0">
              <button
                onClick={() => handleDateRangeChange('current')}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Current Month
              </button>
              <button
                onClick={() => handleDateRangeChange('previous')}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous Month
              </button>
              <button
                onClick={handleExport}
                className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-white hover:bg-primary/90"
              >
                <Download className="mr-1 inline-block h-3 w-3" />
                Export
              </button>
            </div>
          </div>
          
          <p className="mb-4 text-sm text-gray-500">
            {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
          </p>
          
          {summary ? (
            <>
              <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Days Present</p>
                  <p className="text-xl font-semibold">{summary.totalDays}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Total Hours</p>
                  <p className="text-xl font-semibold">{summary.totalHours.toFixed(1)}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Avg Hours/Day</p>
                  <p className="text-xl font-semibold">{summary.averageHoursPerDay.toFixed(1)}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Late Arrivals</p>
                  <p className="text-xl font-semibold">{summary.lateArrivals}</p>
                </div>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChartData()} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} />
                    <YAxis tick={{ fontSize: 12 }} tickMargin={10} />
                    <Tooltip
                      formatter={(value) => [`${value} hours`, 'Hours']}
                      labelStyle={{ fontWeight: 'bold' }}
                      contentStyle={{ borderRadius: '8px' }}
                    />
                    <Bar
                      dataKey="hours"
                      fill="hsl(var(--primary))"
                      barSize={20}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center text-gray-500">No summary data available</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Attendance Records Table */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white shadow">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">Attendance Records</h3>
        </div>
        
        {attendanceRecords.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center p-6 text-center">
            <Calendar className="mb-2 h-10 w-10 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">No attendance records</h3>
            <p className="mt-1 text-sm text-gray-500">
              No records found for the selected date range
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Clock In
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Clock Out
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Hours
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {attendanceRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {formatDate(record.date)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {record.clockInTime
                        ? format(new Date(record.clockInTime), 'h:mm a')
                        : 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {record.clockOutTime
                        ? format(new Date(record.clockOutTime), 'h:mm a')
                        : 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {record.totalHours !== null ? record.totalHours.toFixed(1) : 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {getStatusBadge(record.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}