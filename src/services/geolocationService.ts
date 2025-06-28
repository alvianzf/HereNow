import { GeoLocation } from '../types/user';

export const getCurrentPosition = (): Promise<GeoLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
      },
      (error) => {
        let errorMessage = 'Unknown error';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'User denied the request for Geolocation';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

export const watchPosition = (
  onSuccess: (position: GeoLocation) => void,
  onError: (error: Error) => void
): (() => void) => {
  if (!navigator.geolocation) {
    onError(new Error('Geolocation is not supported by your browser'));
    return () => {};
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      });
    },
    (error) => {
      let errorMessage = 'Unknown error';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'User denied the request for Geolocation';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'The request to get user location timed out';
          break;
      }
      onError(new Error(errorMessage));
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
};