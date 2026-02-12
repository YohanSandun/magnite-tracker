# Magnite Tracker LK

**Community-driven Nissan Magnite order tracking system for Sri Lanka**

A web application where Sri Lankan customers who ordered a Nissan Magnite through AMW can share and track their order milestones, predict delivery timelines, and view community insights.

---

## Features

- **Report Orders** — Submit your AMW order details (order number, model, color, order date)
- **Track & Update** — Look up your order and update milestones as your order progresses
- **Community Timeline** — Browse all community-reported orders with filtering
- **Predictions** — AI-style predictions for delivery dates based on community data
- **Insights & Analytics** — Charts showing shipment patterns, wait times, model/color popularity

### Order Milestones Tracked

1. **Order Placed** — Advanced payment date
2. **Vehicle Arrived in SL** — SMS notification that vehicle shipped from India
3. **Full Payment Made** — Remaining balance paid
4. **Vehicle Received** — Vehicle collected from AMW
5. **Number Plate Received** — Vehicle registration number issued

### Supported Models

| Model | Engine | Transmission | Price |
|-------|--------|-------------|-------|
| Magnite (Accenta) | 1.0 Litre | Automatic | Rs. 7,800,000 |
| Magnite (Tekna+) | 1.0 Litre | Automatic | Rs. 8,900,000 |
| Magnite (N Connecta) | 1.0 Litre Turbo | CVT | Rs. 9,500,000 |
| Magnite (Tekna+) | 1.0 Litre Turbo | CVT | TBA |

### Available Colors

Blade Silver · Storm White · Pearl White · Vivid Blue · Onyx Black · Flare Garnet Red · Sunrise Copper Orange

---

## Tech Stack

- **React 18** + **Vite** — Fast modern frontend
- **Material UI (MUI)** — Mobile-first responsive design
- **Firebase Firestore** — Real-time NoSQL database
- **Recharts** — Data visualization
- **date-fns** — Date utilities
- **GitHub Pages** — Static site hosting

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Firebase project with Firestore enabled

### 1. Clone the repository

```bash
git clone https://github.com/your-username/magnite-tracker.git
cd magnite-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Enable **Cloud Firestore** (start in test mode or use `firestore.rules`)
4. Go to Project Settings → General → Your Apps → Add Web App
5. Copy the Firebase config values

### 4. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase config:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_APP_TITLE=Magnite Tracker LK
VITE_BASE_URL=/
```

### 5. Deploy Firestore security rules

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Deployment (GitHub Pages)

### 1. Update base URL

In `.env.local`, set the base URL to your repository name:

```env
VITE_BASE_URL=/magnite-tracker/
```

### 2. Deploy

```bash
npm run deploy
```

This builds the project and deploys to the `gh-pages` branch.

### 3. Enable GitHub Pages

Go to your repository → Settings → Pages → Source: **Deploy from a branch** → Branch: `gh-pages` → Folder: `/ (root)`.

---

## Project Structure

```
src/
├── main.jsx                  # React entry point
├── App.jsx                   # Routes & theme provider
├── theme.js                  # MUI theme customization
├── config/
│   └── firebase.js           # Firebase initialization
├── constants/
│   └── vehicleData.js        # Models, colors, milestones
├── services/
│   └── orderService.js       # Firestore CRUD operations
├── utils/
│   └── predictions.js        # Prediction & analytics logic
├── components/
│   ├── Layout.jsx            # App shell (navbar, drawer, bottom nav)
│   ├── OrderTimeline.jsx     # Visual milestone timeline
│   └── StatCard.jsx          # Statistics card component
└── pages/
    ├── HomePage.jsx          # Dashboard with stats & recent activity
    ├── ReportPage.jsx        # Submit new order form
    ├── TrackPage.jsx         # Look up & update order
    ├── CommunityPage.jsx     # Browse all community orders
    └── InsightsPage.jsx      # Charts & analytics
```

---

## Security

- Edit codes are **hashed (SHA-256)** before storing in Firestore
- Order numbers are **partially masked** in community views
- Firestore security rules prevent unauthorized updates
- No user authentication required (community-driven, trust-based)

---

## License

MIT
