import * as XLSX from 'xlsx';
import { AttendanceRecord } from '../types/attendance';
import { User } from '../types/user';

export const exportToExcel = (
  data: any[],
  fileName: string = 'export',
  sheetName: string = 'Sheet1'
): void => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const prepareAttendanceForExport = (
  records: AttendanceRecord[],
  users: User[]
): any[] => {
  return records.map(record => {
    const user = users.find(u => u.id === record.userId);
    const clockInTime = record.clockInTime ? new Date(record.clockInTime) : null;
    const clockOutTime = record.clockOutTime ? new Date(record.clockOutTime) : null;
    
    return {
      'Date': record.date,
      'Employee Name': user ? `${user.firstName} ${user.lastName}` : 'Unknown',
      'Department': user?.department || 'Unknown',
      'Clock In': clockInTime ? clockInTime.toLocaleTimeString() : 'N/A',
      'Clock Out': clockOutTime ? clockOutTime.toLocaleTimeString() : 'N/A',
      'Hours Worked': record.totalHours || 'N/A',
      'Status': record.status.replace('_', ' ').toUpperCase(),
      'Notes': record.notes || ''
    };
  });
};

export const exportAttendanceReport = (
  records: AttendanceRecord[],
  users: User[],
  dateRange: string
): void => {
  const formattedData = prepareAttendanceForExport(records, users);
  exportToExcel(formattedData, `Attendance_Report_${dateRange}`, 'Attendance');
};