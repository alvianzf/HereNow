import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { getAllEmployeeAttendance } from '../../services/attendanceService';
import { getAllUsers } from '../../services/userService';
import { exportAttendanceReport } from '../../services/exportService';
import { AttendanceRecord } from '../../types/attendance';
import { User } from '../../types/user';
import { Download, Search, Clock, User as UserIcon } from 'lucide-react';

export default function EmployeeAttendanceTable() {
  const [loading, setLoading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  useEffect(() => {
    if (attendanceRecords.length > 0 && users.length > 0) {
      filterRecords();
    }
  }, [searchTerm, attendanceRecords, users]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [records, userList] = await Promise.all([
        getAllEmployeeAttendance(currentDate),
        getAllUsers()
      ]);
      setAttendanceRecords(records);
      setUsers(userList);
      setFilteredRecords(records);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    if (!searchTerm.trim()) {
      setFilteredRecords(attendanceRecords);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = attendanceRecords.filter(record => {
      const user = users.find(u => u.id === record.userId);
      if (!user) return false;

      return (
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.department.toLowerCase().includes(term) ||
        record.status.toLowerCase().includes(term)
      );
    });

    setFilteredRecords(filtered);
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
  };

  const getUserDepartment = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.department : 'Unknown';
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'h:mm a');
    } catch {
      return 'Invalid time';
    }
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

  const handleExport = () => {
    exportAttendanceReport(
      filteredRecords,
      users,
      currentDate
    );
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDate(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-4 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="date-select" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date-select"
              value={currentDate}
              onChange={handleDateChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div className="w-64">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="relative mt-1 flex items-center">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search employees..."
                className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleExport}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Employee
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Department
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
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No attendance records found
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {getUserName(record.userId)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {getUserDepartment(record.userId)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatTime(record.clockInTime)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatTime(record.clockOutTime)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {record.totalHours !== null ? record.totalHours.toFixed(1) : 'N/A'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {getStatusBadge(record.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}