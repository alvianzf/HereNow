import { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useToast } from '../../components/ui/Toaster';
import { Clock, MapPin, Bell, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    workHours: {
      startTime: '09:00',
      endTime: '17:00',
      workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      lunchBreakDuration: 60,
    },
    geofencing: {
      enabled: true,
      enforceForClockIn: true,
      enforceForClockOut: false,
      radiusMeters: 100,
    },
    notifications: {
      lateArrivalAlerts: true,
      earlyDepartureAlerts: true,
      missingClockOutAlerts: true,
      overtimeAlerts: true,
    },
    security: {
      requireLocationAccess: true,
      enforceIPRestriction: false,
      requirePhotoVerification: false,
    }
  });

  const handleWorkHoursChange = (field: string, value: string | number | string[]) => {
    setSettings({
      ...settings,
      workHours: {
        ...settings.workHours,
        [field]: value
      }
    });
  };

  const handleGeofencingChange = (field: string, value: boolean | number) => {
    setSettings({
      ...settings,
      geofencing: {
        ...settings.geofencing,
        [field]: value
      }
    });
  };

  const handleNotificationsChange = (field: string, value: boolean) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: value
      }
    });
  };

  const handleSecurityChange = (field: string, value: boolean) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [field]: value
      }
    });
  };

  const handleWorkDayToggle = (day: string) => {
    const currentDays = [...settings.workHours.workDays];
    
    if (currentDays.includes(day)) {
      handleWorkHoursChange(
        'workDays',
        currentDays.filter(d => d !== day)
      );
    } else {
      handleWorkHoursChange('workDays', [...currentDays, day]);
    }
  };

  const handleSaveSettings = () => {
    setLoading(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      setLoading(false);
      addToast('Settings saved successfully', 'success');
    }, 1000);
  };

  return (
    <AdminLayout title="Settings">
      <div className="space-y-6">
        {/* Work Hours Settings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
          <div className="mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium text-gray-900">Work Hours</h3>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                Work Start Time
              </label>
              <input
                type="time"
                id="startTime"
                value={settings.workHours.startTime}
                onChange={(e) => handleWorkHoursChange('startTime', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                Work End Time
              </label>
              <input
                type="time"
                id="endTime"
                value={settings.workHours.endTime}
                onChange={(e) => handleWorkHoursChange('endTime', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Work Days</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleWorkDayToggle(day)}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                      settings.workHours.workDays.includes(day)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="lunchBreakDuration" className="block text-sm font-medium text-gray-700">
                Lunch Break Duration (minutes)
              </label>
              <input
                type="number"
                id="lunchBreakDuration"
                value={settings.workHours.lunchBreakDuration}
                onChange={(e) => handleWorkHoursChange('lunchBreakDuration', parseInt(e.target.value))}
                min="0"
                max="120"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Geofencing Settings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
          <div className="mb-4 flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium text-gray-900">Geofencing</h3>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-center">
              <input
                id="geofencingEnabled"
                type="checkbox"
                checked={settings.geofencing.enabled}
                onChange={(e) => handleGeofencingChange('enabled', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="geofencingEnabled" className="ml-2 block text-sm text-gray-700">
                Enable Geofencing
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="enforceForClockIn"
                type="checkbox"
                checked={settings.geofencing.enforceForClockIn}
                onChange={(e) => handleGeofencingChange('enforceForClockIn', e.target.checked)}
                disabled={!settings.geofencing.enabled}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
              />
              <label 
                htmlFor="enforceForClockIn" 
                className={`ml-2 block text-sm ${!settings.geofencing.enabled ? 'text-gray-400' : 'text-gray-700'}`}
              >
                Enforce for Clock In
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="enforceForClockOut"
                type="checkbox"
                checked={settings.geofencing.enforceForClockOut}
                onChange={(e) => handleGeofencingChange('enforceForClockOut', e.target.checked)}
                disabled={!settings.geofencing.enabled}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
              />
              <label 
                htmlFor="enforceForClockOut" 
                className={`ml-2 block text-sm ${!settings.geofencing.enabled ? 'text-gray-400' : 'text-gray-700'}`}
              >
                Enforce for Clock Out
              </label>
            </div>
            
            <div>
              <label htmlFor="radiusMeters" className="block text-sm font-medium text-gray-700">
                Geofence Radius (meters)
              </label>
              <input
                type="number"
                id="radiusMeters"
                value={settings.geofencing.radiusMeters}
                onChange={(e) => handleGeofencingChange('radiusMeters', parseInt(e.target.value))}
                min="10"
                max="1000"
                disabled={!settings.geofencing.enabled}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary disabled:opacity-50 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Notifications Settings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
          <div className="mb-4 flex items-center">
            <Bell className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center">
              <input
                id="lateArrivalAlerts"
                type="checkbox"
                checked={settings.notifications.lateArrivalAlerts}
                onChange={(e) => handleNotificationsChange('lateArrivalAlerts', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="lateArrivalAlerts" className="ml-2 block text-sm text-gray-700">
                Late Arrival Alerts
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="earlyDepartureAlerts"
                type="checkbox"
                checked={settings.notifications.earlyDepartureAlerts}
                onChange={(e) => handleNotificationsChange('earlyDepartureAlerts', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="earlyDepartureAlerts" className="ml-2 block text-sm text-gray-700">
                Early Departure Alerts
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="missingClockOutAlerts"
                type="checkbox"
                checked={settings.notifications.missingClockOutAlerts}
                onChange={(e) => handleNotificationsChange('missingClockOutAlerts', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="missingClockOutAlerts" className="ml-2 block text-sm text-gray-700">
                Missing Clock Out Alerts
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="overtimeAlerts"
                type="checkbox"
                checked={settings.notifications.overtimeAlerts}
                onChange={(e) => handleNotificationsChange('overtimeAlerts', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="overtimeAlerts" className="ml-2 block text-sm text-gray-700">
                Overtime Alerts
              </label>
            </div>
          </div>
        </div>
        
        {/* Security Settings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
          <div className="mb-4 flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium text-gray-900">Security</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center">
              <input
                id="requireLocationAccess"
                type="checkbox"
                checked={settings.security.requireLocationAccess}
                onChange={(e) => handleSecurityChange('requireLocationAccess', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="requireLocationAccess" className="ml-2 block text-sm text-gray-700">
                Require Location Access
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="enforceIPRestriction"
                type="checkbox"
                checked={settings.security.enforceIPRestriction}
                onChange={(e) => handleSecurityChange('enforceIPRestriction', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="enforceIPRestriction" className="ml-2 block text-sm text-gray-700">
                Enforce IP Restriction
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="requirePhotoVerification"
                type="checkbox"
                checked={settings.security.requirePhotoVerification}
                onChange={(e) => handleSecurityChange('requirePhotoVerification', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="requirePhotoVerification" className="ml-2 block text-sm text-gray-700">
                Require Photo Verification
              </label>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={loading}
            className="flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}