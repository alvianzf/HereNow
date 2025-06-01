import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { getAttendanceHistory } from '../../services/attendanceService';
import { AttendanceRecord } from '../../types/attendance';
import { Clock, CalendarClock } from 'lucide-react';

export default function AttendanceHistory() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    if (user) {
      fetchAttendanceHistory();
    }
  }, [user]);

  const fetchAttendanceHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get the last 7 days of attendance
      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      
      const startDate = format(sevenDaysAgo, 'yyyy-MM-dd');
      const endDate = format(now, 'yyyy-MM-dd');
      
      const records = await getAttendanceHistory(
        user.id,
        startDate,
        endDate
      );
      setHistory(records);
    } catch (error) {
      console.error('Failed to fetch attendance history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'h:mm a');
    } catch {
      return 'Invalid time';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'EEE, MMM d');
    } catch {
      return dateString;
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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center">
        <CalendarClock className="mb-2 h-10 w-10 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">No attendance records</h3>
        <p className="mt-1 text-sm text-gray-500">
          Your recent attendance history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h3 className="text-sm font-medium text-gray-700">Recent Attendance</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {history.map((record) => (
          <li key={record.id} className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(record.date)}
                </span>
              </div>
              <div>{getStatusBadge(record.status)}</div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <div>
                Clock In: <span className="font-medium">{formatTime(record.clockInTime)}</span>
              </div>
              <div>
                Clock Out: <span className="font-medium">{formatTime(record.clockOutTime)}</span>
              </div>
              <div>
                Hours: <span className="font-medium">{record.totalHours || 'N/A'}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}