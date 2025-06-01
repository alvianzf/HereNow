import { useState } from 'react';
import EmployeeLayout from '../../components/layout/EmployeeLayout';
import ClockInOutButton from '../../components/employee/ClockInOutButton';
import AttendanceHistory from '../../components/employee/AttendanceHistory';
import AttendanceSummary from '../../components/employee/AttendanceSummary';
import { AttendanceStatus } from '../../types/attendance';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Calendar, Clock, User, ChevronDown } from 'lucide-react';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [currentStatus, setCurrentStatus] = useState<AttendanceStatus | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'summary'>('history');

  const today = format(new Date(), 'EEEE, MMMM d, yyyy');
  const currentTime = format(new Date(), 'h:mm a');

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header with date and time */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">{today}</h3>
              </div>
              <div className="mt-1 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-gray-400" />
                <p className="text-sm text-gray-500">{currentTime}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center sm:mt-0">
              <User className="mr-2 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.department}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clock In/Out Section */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Time Tracking</h2>
            <p className="text-sm text-gray-500 mb-6">
              <MapPin className="inline-block mr-1 h-4 w-4" />
              Location-based attendance tracking
            </p>
            <div className="flex justify-center">
              <ClockInOutButton onStatusChange={setCurrentStatus} />
            </div>
          </div>
        </div>

        {/* Tabs for History and Summary */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('history')}
                className={`w-1/2 border-b-2 py-4 px-1 text-center text-sm font-medium ${
                  activeTab === 'history'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Recent Activity
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`w-1/2 border-b-2 py-4 px-1 text-center text-sm font-medium ${
                  activeTab === 'summary'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Summary
              </button>
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'history' ? <AttendanceHistory /> : <AttendanceSummary />}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}