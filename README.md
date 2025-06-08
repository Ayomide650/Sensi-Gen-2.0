# Sensi-Gen - Free Fire Sensitivity Generator

A comprehensive web application that generates optimal Free Fire sensitivity settings based on your device specifications and play style preferences.

## Features

### 🎯 Core Features
- **Device Detection**: Auto-detect or manually select from 500+ supported devices
- **AI-Powered Calculations**: Advanced algorithms for optimal sensitivity generation
- **Play Style Customization**: Aggressive, Balanced, or Precise gameplay options
- **Experience Levels**: Beginner, Intermediate, and Advanced user settings
- **Export Options**: Save settings as images with watermarks

### 👥 User System
- **Free Users**: 5 generations per day
- **VIP Users**: Unlimited generations, theme toggle, priority support
- **Admin Users**: Complete system management and analytics

### 🔧 Advanced Tools
- **Device Comparison**: Compare specs and performance scores
- **Review System**: Rate and review devices
- **Changelog**: Track all updates and new features
- **Offline Detection**: Works even without internet connection

### 🎨 Design
- Modern, gaming-themed UI with smooth animations
- Responsive design for all devices
- Dark/Light theme toggle (VIP feature)
- Accessibility-first approach

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Custom username/password system
- **Deployment**: GitHub Pages
- **Build Tool**: Vite

## Database Schema

### user_credentials
```sql
- user_id (uuid, primary key)
- username (text, unique)
- password_hash (text)
- role (text) -- 'user', 'vip', 'admin'
- generations_today (integer)
- last_generation_date (date)
- created_at (timestamp)
- vip_expires_at (timestamp, nullable)
```

### device_reviews
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- device_name (text)
- rating (integer, 1-5)
- comment (text, nullable)
- created_at (timestamp)
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sensi-gen-freefire.git
cd sensi-gen-freefire
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project
   - Update the URL and API key in `src/lib/supabase.ts`
   - Run the database migrations

4. Start development server:
```bash
npm run dev
```

## Deployment

The app is configured for GitHub Pages deployment:

1. Push to the main branch
2. GitHub Actions will automatically build and deploy
3. Access your site at `https://yourusername.github.io/sensi-gen-freefire`

## Device Database

The device database is initially empty and should be populated with device specifications:

```typescript
export const deviceDatabase: DeviceDatabase = {
  "iPhone 15 Pro": {
    screenSize: 6.1,
    refreshRate: 120,
    touchSamplingRate: 240,
    processorScore: 95,
    gpuScore: 94,
    releaseYear: 2023,
    ram: 8,
    brand: "Apple"
  },
  // Add more devices...
};
```

## Sensitivity Algorithm

The sensitivity calculation considers:
- Device screen size and refresh rate
- Touch sampling rate
- Processor and GPU performance scores
- User play style and experience level
- Device age and optimization factors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- **Free Users**: Community support via GitHub issues
- **VIP Users**: Priority support via in-app chat
- **Admins**: Direct access to system management

## Roadmap

- [ ] Machine learning-based sensitivity optimization
- [ ] Tournament mode with pro player settings
- [ ] Custom crosshair generator
- [ ] Performance analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app versions

---

Built with ❤️ for the Free Fire gaming community