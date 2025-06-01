import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toaster';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { getCurrentPosition } from '../../services/geolocationService';
import { getCurrentStatus, clockIn, clockOut } from '../../services/attendanceService';
import { AttendanceRecord, AttendanceStatus } from '../../types/attendance';

interface ClockInOutButtonProps {
  onStatusChange: (status: AttendanceStatus | null) => void;
}

export default function ClockInOutButton({ onStatusChange }: ClockInOutButtonProps) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<AttendanceRecord | null>(null);
  const [clockedIn, setClockedIn] = useState(false);

  useEffect(() => {
    if (user) {
      checkCurrentStatus();
    }
  }, [user]);

  const checkCurrentStatus = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const status = await getCurrentStatus(user.id);
      setCurrentRecord(status);
      setClockedIn(!!status && status.status === 'clocked_in');
      onStatusChange(status ? status.status : null);
    } catch (error) {
      console.error('Failed to get current status:', error);
      addToast('Failed to get current status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const position = await getCurrentPosition();
      
      const clockInRequest = {
        userId: user.id,
        location: {
          latitude: position.latitude,
          longitude: position.longitude,
          accuracy: position.accuracy
        },
        timestamp: new Date().toISOString()
      };
      
      const record = await clockIn(clockInRequest);
      setCurrentRecord(record);
      setClockedIn(true);
      onStatusChange(record.status);
      
      addToast('Successfully clocked in', 'success');
    } catch (error) {
      console.error('Failed to clock in:', error);
      addToast('Failed to clock in. Please check your location permissions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!user || !currentRecord) return;
    
    setLoading(true);
    try {
      const position = await getCurrentPosition();
      
      const clockOutRequest = {
        recordId: currentRecord.id,
        userId: user.id,
        location: {
          latitude: position.latitude,
          longitude: position.longitude,
          accuracy: position.accuracy
        },
        timestamp: new Date().toISOString()
      };
      
      const record = await clockOut(clockOutRequest);
      setCurrentRecord(record);
      setClockedIn(false);
      onStatusChange(record.status);
      
      addToast('Successfully clocked out', 'success');
    } catch (error) {
      console.error('Failed to clock out:', error);
      addToast('Failed to clock out', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={clockedIn ? handleClockOut : handleClockIn}
        disabled={loading}
        className={`relative flex h-36 w-36 items-center justify-center rounded-full border-4 text-white shadow-lg transition-all duration-300 ${
          clockedIn
            ? 'border-error bg-error hover:bg-error/90'
            : 'border-success bg-success hover:bg-success/90'
        } disabled:opacity-50`}
      >
        <div className="flex flex-col items-center">
          {loading ? (
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          ) : (
            <>
              {clockedIn ? (
                <XCircle className="mb-2 h-10 w-10" />
              ) : (
                <CheckCircle className="mb-2 h-10 w-10" />
              )}
              <span className="text-lg font-semibold">
                {clockedIn ? 'Clock Out' : 'Clock In'}
              </span>
            </>
          )}
        </div>
        
        {clockedIn && (
          <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <div className="h-4 w-4 rounded-full bg-success animate-status-pulse"></div>
          </div>
        )}
      </button>
      
      <div className="text-center text-sm text-gray-600">
        {clockedIn ? (
          <div className="font-medium text-success">
            You are currently clocked in
          </div>
        ) : (
          <div className="font-medium text-gray-500">
            You are currently clocked out
          </div>
        )}
      </div>
    </div>
  );
}