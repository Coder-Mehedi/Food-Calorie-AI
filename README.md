# Food Calorie Calculator AI

AI-powered mobile app that detects food from images and calculates calories and nutrition info instantly.

## Architecture

```
food-calorie-ai/
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── modules/
│   │       ├── auth/         # JWT auth (login, register)
│   │       ├── food-analysis/ # AI food detection + nutrition DB
│   │       ├── meals/        # Meal CRUD
│   │       ├── users/        # User profile
│   │       └── nutrition/    # Goals & daily logs
│   └── Dockerfile
├── mobile/                   # Expo React Native app
│   ├── App.tsx
│   ├── src/
│   │   ├── screens/          # 8 screens
│   │   ├── components/       # Reusable UI components
│   │   ├── services/         # API client, image picker
│   │   ├── stores/           # Zustand state management
│   │   ├── navigation/       # React Navigation setup
│   │   ├── theme/            # Light/dark theme
│   │   └── types/            # TypeScript types
│   └── app.json
├── docker-compose.yml
└── README.md
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native (Expo), TypeScript |
| State | Zustand |
| Navigation | React Navigation v6 |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL + TypeORM |
| AI | Anthropic Claude Vision API |
| Storage | Expo SecureStore, AsyncStorage |

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Expo CLI (`npm i -g expo-cli`)
- iOS Simulator or Android Emulator

### 1. Start Backend + Database

```bash
# Clone and enter project
cd food-calorie-ai

# Copy env file and add your Anthropic API key
cp backend/.env.example backend/.env
# Edit backend/.env and set AI_API_KEY

# Start everything
docker compose up -d

# Or run locally without Docker:
cd backend
npm install
cp .env.example .env
# Edit .env
npm run start:dev
```

### 2. Start Mobile App

```bash
cd mobile
npm install

# Start Expo dev server
npx expo start

# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Press 'w' for web preview
```

### 3. Run Without Docker

```bash
# Start PostgreSQL locally
createdb food_calorie_ai

# Backend
cd backend
npm install
npm run start:dev

# Mobile
cd mobile
npm install
npx expo start
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/analyze-food` | Yes | Analyze food image (multipart) |
| POST | `/api/meals` | Yes | Save a meal |
| GET | `/api/meals` | Yes | Get meal history |
| GET | `/api/profile` | Yes | Get user profile |
| PUT | `/api/profile` | Yes | Update profile |
| GET | `/api/nutrition/daily` | Yes | Daily nutrition summary |
| GET | `/api/nutrition/goals` | Yes | Get goals |
| POST | `/api/nutrition/goals` | Yes | Create goal |
| DELETE | `/api/nutrition/goals/:id` | Yes | Deactivate goal |

### Example: Analyze Food

```bash
curl -X POST http://localhost:3000/api/analyze-food \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@burger.jpg"
```

Response:
```json
{
  "foods": [
    {
      "name": "Cheeseburger",
      "quantity": "1 piece",
      "servingSize": 200,
      "servingUnit": "g",
      "calories": 410,
      "protein": 24,
      "carbs": 32,
      "fat": 21,
      "fiber": 1.5,
      "sugar": 6.3,
      "confidence": 0.92
    }
  ],
  "totalCalories": 410,
  "totalProtein": 24,
  "totalCarbs": 32,
  "totalFat": 21,
  "imageUrl": "/uploads/1234567890.jpg"
}
```

## Database Schema

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  height FLOAT, weight FLOAT, age INT,
  gender VARCHAR, fitness_goal VARCHAR,
  daily_calorie_target FLOAT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Meals
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url VARCHAR, meal_type VARCHAR,
  total_calories FLOAT DEFAULT 0,
  total_protein FLOAT DEFAULT 0,
  total_carbs FLOAT DEFAULT 0,
  total_fat FLOAT DEFAULT 0,
  notes TEXT,
  consumed_at TIMESTAMP DEFAULT NOW()
);

-- Meal Items
CREATE TABLE meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
  food_name VARCHAR, quantity VARCHAR,
  serving_size FLOAT, serving_unit VARCHAR,
  calories FLOAT, protein FLOAT, carbs FLOAT,
  fat FLOAT, fiber FLOAT DEFAULT 0, sugar FLOAT DEFAULT 0,
  confidence FLOAT
);

-- Nutrition Logs
CREATE TABLE nutrition_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, date DATE,
  total_calories FLOAT DEFAULT 0,
  total_protein FLOAT DEFAULT 0,
  total_carbs FLOAT DEFAULT 0,
  total_fat FLOAT DEFAULT 0,
  meal_count INT DEFAULT 0
);

-- Goals
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, type VARCHAR,
  target_calories FLOAT,
  target_protein FLOAT, target_carbs FLOAT, target_fat FLOAT,
  target_weight FLOAT,
  start_date DATE, end_date DATE,
  is_active BOOLEAN DEFAULT true
);
```

## AI Integration

The app uses **Anthropic Claude Vision API** for food detection:

1. User captures/uploads food image
2. Image is compressed (max 1024px, 80% JPEG quality)
3. Base64 image sent to Claude with a structured prompt
4. Claude returns detected food items with portion estimates
5. Nutrition data calculated from built-in database (80+ foods)
6. Results returned to mobile app

### Nutrition Database

Built-in database covers 80+ common foods across categories:
- Proteins (chicken, beef, fish, tofu, eggs...)
- Fast food (burger, pizza, fries, taco...)
- Rice & noodles (biryani, ramen, pasta...)
- Fruits & vegetables
- Desserts & drinks
- Breakfast items & snacks

All values are per 100g and scaled by detected serving size. Fuzzy matching handles name variations.

## Screens

1. **Splash** - Animated logo with auto-redirect
2. **Auth** - Login / Register with form validation
3. **Dashboard** - Calorie ring, macros, weekly chart, recent meals
4. **Camera** - Camera capture or gallery upload with preview
5. **Analysis** - AI results with per-item nutrition, meal type selection, save
6. **History** - Paginated meal list with delete
7. **Profile** - Personal info, fitness goals, theme toggle, logout

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_USERNAME` | DB user | postgres |
| `DB_PASSWORD` | DB password | postgres |
| `DB_NAME` | Database name | food_calorie_ai |
| `JWT_SECRET` | JWT signing key | (required) |
| `AI_API_KEY` | Anthropic API key | (required) |
| `AI_API_URL` | AI endpoint | anthropic.com |
| `PORT` | API server port | 3000 |
| `UPLOAD_DIR` | Image upload path | ./uploads |

## License

MIT
