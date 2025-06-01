import { format } from 'date-fns';
import { 
  AttendanceRecord, 
  ClockInRequest, 
  ClockOutRequest,
  AttendanceSummary,
  WeeklyAttendance
} from '../types/attendance';
import { GeoLocation, GeoFence } from '../types/user';

// Mock attendance records for demo
let mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    userId: '2',
    clockInTime: '2023-04-10T09:00:00Z',
    clockOutTime: '2023-04-10T17:30:00Z',
    clockInLocation: {
      latitude: 37.7749,
      longitude: -122.4194
    },
    clockOutLocation: {
      latitude: 37.7749,
      longitude: -122.4194
    },
    totalHours: 8.5,
    status: 'clocked_out',
    date: '2023-04-10'
  },
  {
    id: '2',
    userId: '2',
    clockInTime: '2023-04-11T08:55:00Z',
    clockOutTime: '2023-04-11T17:05:00Z',
    clockInLocation: {
      latitude: 37.7749,
      longitude: -122.4194
    },
    clockOutLocation: {
      latitude: 37.7749,
      longitude: -122.4194
    },
    totalHours: 8.17,
    status: 'clocked_out',
    date: '2023-04-11'
  },
  {
    id: '3',
    userId: '3',
    clockInTime: '2023-04-11T09:15:00Z',
    clockOutTime: '2023-04-11T18:00:00Z',
    clockInLocation: {
      latitude: 37.7749,
      longitude: -122.4194
    },
    clockOutLocation: {
      latitude: 37.7749,
      longitude: -122.4194
    },
    totalHours: 8.75,
    status: 'clocked_out',
    date: '2023-04-11'
  }
];

// Simulate API call with some delay
const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 800);
  });
};

// Mock allowed office locations
const allowedLocations: GeoFence[] = [
  {
    name: 'Main Office',
    latitude: 37.7749,
    longitude: -122.4194,
    radiusMeters: 100
  },
  {
    name: 'Satellite Office',
    latitude: 37.3382,
    longitude: -121.8863,
    radiusMeters: 100
  }
];

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Check if location is within any allowed fence
export const isLocationAllowed = (location: GeoLocation): boolean => {
  for (const fence of allowedLocations) {
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      fence.latitude,
      fence.longitude
    );
    if (distance <= fence.radiusMeters) {
      return true;
    }
  }
  return false;
};

export const clockIn = async (request: ClockInRequest): Promise<AttendanceRecord> => {
  // In a real app, validate the location against allowed office locations
  const locationValid = isLocationAllowed(request.location);
  
  // For demo purposes, we'll allow the clock-in regardless
  // In production, you might want to throw an error if location is invalid
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const newRecord: AttendanceRecord = {
    id: String(mockAttendanceRecords.length + 1),
    userId: request.userId,
    clockInTime: new Date().toISOString(),
    clockOutTime: null,
    clockInLocation: {
      latitude: request.location.latitude,
      longitude: request.location.longitude
    },
    totalHours: null,
    status: 'clocked_in',
    date: today,
    notes: locationValid ? undefined : 'Location outside of allowed area'
  };

  mockAttendanceRecords.push(newRecord);
  return simulateApiCall(newRecord);
};

export const clockOut = async (request: ClockOutRequest): Promise<AttendanceRecord> => {
  const record = mockAttendanceRecords.find(
    (r) => r.id === request.recordId && r.userId === request.userId
  );

  if (!record) {
    throw new Error('No active clock-in record found');
  }

  if (record.status !== 'clocked_in') {
    throw new Error('Employee is not clocked in');
  }

  // Calculate hours worked
  const clockInDate = new Date(record.clockInTime);
  const clockOutDate = new Date();
  const hoursWorked = (clockOutDate.getTime() - clockInDate.getTime()) / (1000 * 60 * 60);

  // Update the record
  record.clockOutTime = clockOutDate.toISOString();
  record.clockOutLocation = {
    latitude: request.location.latitude,
    longitude: request.location.longitude
  };
  record.totalHours = parseFloat(hoursWorked.toFixed(2));
  record.status = 'clocked_out';

  return simulateApiCall(record);
};

export const getCurrentStatus = async (userId: string): Promise<AttendanceRecord | null> => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayRecord = mockAttendanceRecords.find(
    (r) => r.userId === userId && r.date === today && r.status === 'clocked_in'
  );
  
  return simulateApiCall(todayRecord || null);
};

export const getAttendanceHistory = async (
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<AttendanceRecord[]> => {
  let filtered = mockAttendanceRecords.filter((r) => r.userId === userId);

  if (startDate) {
    filtered = filtered.filter((r) => r.date >= startDate);
  }

  if (endDate) {
    filtered = filtered.filter((r) => r.date <= endDate);
  }

  return simulateApiCall(filtered);
};

export const getAttendanceSummary = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<AttendanceSummary> => {
  const history = await getAttendanceHistory(userId, startDate, endDate);
  
  const totalDays = history.length;
  const totalHours = history.reduce((sum, record) => sum + (record.totalHours || 0), 0);
  const averageHoursPerDay = totalDays > 0 ? totalHours / totalDays : 0;
  
  // Count late arrivals (after 9:15 AM)
  const lateArrivals = history.filter(record => {
    const clockInHour = new Date(record.clockInTime).getHours();
    const clockInMinute = new Date(record.clockInTime).getMinutes();
    return clockInHour > 9 || (clockInHour === 9 && clockInMinute >= 15);
  }).length;
  
  // Count early departures (before 5:00 PM)
  const earlyDepartures = history.filter(record => {
    if (!record.clockOutTime) return false;
    const clockOutHour = new Date(record.clockOutTime).getHours();
    return clockOutHour < 17;
  }).length;
  
  return simulateApiCall({
    totalDays,
    totalHours,
    averageHoursPerDay,
    lateArrivals,
    earlyDepartures
  });
};

export const getWeeklyAttendance = async (
  userId: string,
  weeks: number = 4
): Promise<WeeklyAttendance[]> => {
  // In a real app, this would fetch data from the API
  // For demo, we'll generate some mock data
  const result: WeeklyAttendance[] = [];
  
  for (let i = 0; i < weeks; i++) {
    result.push({
      week: `Week ${weeks - i}`,
      totalHours: 35 + Math.random() * 10,
      daysPresent: 4 + Math.floor(Math.random() * 2)
    });
  }
  
  return simulateApiCall(result);
};

export const getAllEmployeeAttendance = async (
  date?: string
): Promise<AttendanceRecord[]> => {
  let filtered = [...mockAttendanceRecords];
  
  if (date) {
    filtered = filtered.filter((r) => r.date === date);
  }
  
  return simulateApiCall(filtered);
};