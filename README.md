# 🌍 Global PTO Travel Optimizer

Optimize your PTO by getting smart travel suggestions based on holidays and available days.

## ✨ Features

- **🗺️ PTO Plans** - Create and manage PTO plans for different countries
- **✈️ Smart Suggestions** - Get optimal travel date recommendations
- **💾 Trip Tracking** - Save and monitor your trips
- **🌍 Multi-Country** - USA, Mexico, Turkey holiday support
- **🔐 Secure Auth** - Supabase authentication

## 🚀 Tech Stack

React 18 + TypeScript | Vite | Tailwind CSS | Supabase | React Router DOM

## 📋 Prerequisites

- Node.js v16+
- Supabase account (free tier)

## 🛠️ Quick Start

### 1. Install & Setup
```bash
git clone https://github.com/KamirW/global-pto-travel-optimizer.git
cd global-pto-travel-optimizer
npm install
```

### 2. Environment Variables
Create `.env` in project root:
```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_KEY=your_key
```

### 3. Database Setup
Run in Supabase SQL Editor:
```sql
-- PTO Plans Table
CREATE TABLE ptoplans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  pto_days_available INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date > start_date),
  CONSTRAINT valid_pto_days CHECK (pto_days_available > 0)
);

-- Trips Table
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination VARCHAR(255) NOT NULL,
  estimated_cost DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE ptoplans ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- PTO Plans Policies
CREATE POLICY "Users view own plans" ON ptoplans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create plans" ON ptoplans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own plans" ON ptoplans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own plans" ON ptoplans FOR DELETE USING (auth.uid() = user_id);

-- Trips Policies
CREATE POLICY "Users view own trips" ON trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create trips" ON trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own trips" ON trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own trips" ON trips FOR DELETE USING (auth.uid() = user_id);
```

### 4. Run
```bash
npm run dev
```
Open `http://localhost:5173`

## 📖 How to Use

1. **Sign up** with email and password
2. **Create a PTO Plan** - Select country, dates, and available PTO days
3. **Generate Suggestions** - Click to see optimal travel windows
4. **Save Trips** - Store destination and cost estimates
5. **View Analytics** - Track spending and trip statistics on Trips page

## 🏗️ Project Structure

```
src/
├── pages/
│   ├── Auth/              # Login/signup
│   ├── PTOPlans/         # Plans list & create
│   ├── PTOPlanDetail/    # Plan details & suggestions
│   └── Trips/            # Saved trips
├── components/
│   ├── Layout.tsx        # Main layout
│   └── ProtectedRoute.tsx# Auth guard
├── hooks/
│   └── useAuth.tsx       # Auth context
└── lib/
    ├── supabaseClient.ts # Supabase config
    ├── holidays.ts       # Holiday data
    └── suggestions.ts    # Suggestion algorithm
```

## 🎯 Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🌍 Supported Countries

- 🇺🇸 USA, 🇲🇽 Mexico, 🇹🇷 Turkey

Add more in `src/lib/holidays.ts`:
```typescript
export const holidays: Record<string, Holiday[]> = {
  'US': [{ date: '2026-01-01', name: 'New Year\'s Day' }, ...],
  // Add your country here
};
```

##  Deploy

### Vercel (Recommended)
1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add env variables
4. Deploy

### Netlify
1. Push to GitHub
2. Connect on [netlify.com](https://netlify.com)
3. Add env variables
4. Deploy

## 🔒 Security

- Passwords secured by Supabase
- Row-level security (RLS) for data isolation
- API keys in `.env` (never committed)
- HTTPS encryption in production

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "DOM element not found" | Check `<div id="root">` in `index.html` |
| Login 400 error | Verify Supabase credentials in `.env` |
| No suggestions | Ensure date range is valid & PTO days sufficient |
| DB connection error | Check RLS policies and table creation |

## 📚 Resources

- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Supabase](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vitejs.dev/guide/)

## 📄 License

MIT License - Feel free to use this project!

## 👨‍💻 Author

**Kamir W** - [@KamirW](https://github.com/KamirW)

## 🎉 Roadmap

- [ ] Weather integration
- [ ] Cost estimation API
- [ ] Google Flights integration
- [ ] Hotel recommendations
- [ ] Travel buddy collaboration
- [ ] Email reminders
- [ ] Calendar export

---

**Happy traveling! 🛫✨**
