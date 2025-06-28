export type AttendanceStatus = 'clocked_in' | 'clocked_out' | 'break' | 'pending';

export interface AttendanceRecord {
  id: string;
  userId: string;
  clockInTime: string;
  clockOutTime: string | null;
  clockInLocation: {
    latitude: number;
    longitude: number;
  };
  clockOutLocation?: {
    latitude: number;
    longitude: number;
  };
  totalHours: number | null;
  status: AttendanceStatus;
  date: string;
  notes?: string;
}

export interface ClockInRequest {
  userId: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  timestamp: string;
}

export interface ClockOutRequest {
  recordId: string;
  userId: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  timestamp: string;
}

export interface AttendanceSummary {
  totalDays: number;
  totalHours: number;
  averageHoursPerDay: number;
  lateArrivals: number;
  earlyDepartures: number;
}

export interface WeeklyAttendance {
  week: string;
  totalHours: number;
  daysPresent: number;
}