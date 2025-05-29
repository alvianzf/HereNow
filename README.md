# HereNow

**Geo-locked Attendance App**  
A smart and secure attendance tracking system where users must clock in within the designated office area. Built with **Vite + React + TypeScript** for speed and maintainability.

## Features

- 🌍 **Geo-locked Clock-In** – Enforces location-based attendance.
- 🕒 **Real-Time Presence** – Live tracking of who’s in or out.
- 📊 **Admin Dashboard** – View and manage attendance records.
- 📱 **Mobile Friendly** – Optimized for phones and tablets.
- 🔒 **Secure & Reliable** – Location verification and access control.

## Tech Stack

- **Frontend**: Vite, React, TypeScript, TailwindCSS (optional)
- **APIs**: Browser Geolocation, REST/GraphQL (customizable)
- **Deployment**: Vercel / Netlify / Static Hosting

## Getting Started

```bash
git clone https://github.com/your-username/herenow.git
cd herenow
npm install
npm run dev
```

##Requirements
- Node.js ≥ 18
- Browser with Geolocation API support
- HTTPS (required for geolocation)

## Notes
- Make sure to configure your office geofence in the environment settings.
- Geo-lock uses browser location; GPS spoofing prevention is recommended for production.

## License
MIT
