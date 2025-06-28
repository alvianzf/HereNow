import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import AdminLayout from '../../components/layout/AdminLayout';
import EmployeeAttendanceTable from '../../components/admin/EmployeeAttendanceTable';
import { getAllEmployeeAttendance } from '../../services/attendanceService';
import { getEmployees } from '../../services/userService';
import { User as UserIcon, Clock, CalendarClock, UserCheck, UserX } from 'lucide-react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    averageHours: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const [employees, attendanceRecords] = await Promise.all([
        getEmployees(),
        getAllEmployeeAttendance(today),
      ]);

      const totalEmployees = employees.length;
      const presentToday = new Set(attendanceRecords.map(record => record.userId)).size;
      const absentToday = totalEmployees - presentToday;
      
      // Calculate average hours for those who clocked out
      const completedRecords = attendanceRecords.filter(record => record.totalHours !== null);
      const totalHours = completedRecords.reduce((sum, record) => sum + (record.totalHours || 0), 0);
      const averageHours = completedRecords.length > 0 ? totalHours / completedRecords.length : 0;

      setStats({
        totalEmployees,
        presentToday,
        absentToday,
        averageHours,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">Total Employees</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {loading ? '-' : stats.totalEmployees}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserCheck className="h-6 w-6 text-success" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">Present Today</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {loading ? '-' : stats.presentToday}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserX className="h-6 w-6 text-error" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">Absent Today</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {loading ? '-' : stats.absentToday}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">Avg Hours Today</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {loading ? '-' : stats.averageHours.toFixed(1)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Attendance */}
        <div>
          <h2 className="mb-4 text-lg font-medium text-gray-900">Today's Attendance</h2>
          <EmployeeAttendanceTable />
        </div>
      </div>
    </AdminLayout>
  );
}