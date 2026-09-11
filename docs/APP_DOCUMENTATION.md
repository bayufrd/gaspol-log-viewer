# 📋 Gaspol Log Viewer - Dokumentasi Lengkap

**Versi**: 0.1.0  
**Framework**: Next.js 14.0.0 + React 18.2.0  
**Database**: IndexedDB (Client-side Caching)  
**Styling**: Bootstrap 5.3.7 + Tailwind CSS 4 + Custom CSS  
**Status**: Production Ready

---

## 🎯 Ringkasan Aplikasi

**Gaspol Log Viewer** adalah aplikasi web modern untuk monitoring dan analisis logs real-time dari sistem POS Gaspoll. Aplikasi ini menyediakan:

- ✅ Visualisasi logs dari berbagai sumber (API, PM2, Windows Client)
- ✅ Search & filter logs dengan berbagai kriteria
- ✅ Complaint reporting system dengan streaming data
- ✅ Multi-outlet log management
- ✅ Session management dengan enkripsi
- ✅ Dark mode UI yang responsif
- ✅ Client-side caching menggunakan IndexedDB
- ✅ Real-time update confirmation tracking

---

## 🏗️ Arsitektur Aplikasi

### Overall Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    GASPOL LOG VIEWER                        │
└─────────────────────────────────────────────────────────────┘
         │
         ├─── Pages Layer (pages/)
         │    ├── pages/index.js (Main Dashboard)
         │    ├── pages/apiDocs.js (API Documentation)
         │    └── pages/_app.js (App Wrapper)
         │
         ├─── Components Layer (components/)
         │    ├── Layout Components
         │    │   ├── ModernTabs.js
         │    │   ├── ModernSubTabs.js
         │    │   ├── SidebarNavigation.js
         │    │   └── ThemeToggle.js
         │    │
         │    ├── Log Viewers
         │    │   ├── LogViewer.js (API Logs)
         │    │   ├── LogWindowsViewer.js (Windows Logs)
         │    │   ├── LogEntry.js (Single Log Entry)
         │    │   └── LogWindowsEntry.js (Windows Log Entry)
         │    │
         │    ├── Feature Components
         │    │   ├── ComplaintReport.js
         │    │   ├── UpdateConfirmCard.js
         │    │   ├── LogFileButton.js
         │    │   └── ApiDocLayout.js
         │    │
         │    └── Utilities
         │         └── ThemeToggle.js
         │
         ├─── API Routes (pages/api/)
         │    ├── pages/api/logs.js
         │    ├── pages/api/test.js
         │    └── pages/api/version-proxy.js
         │
         ├─── Styling (src/app/)
         │    └── globals.css (Bootstrap + Tailwind + Custom)
         │
         ├─── Client-side Storage
         │    └── IndexedDB (gaspol-cache)
         │         ├── complaints (Cached complaint data)
         │         ├── meta (Cache metadata)
         │         └── updateConfirm (Update confirmations)
         │
         └─── External APIs
              ├── NEXT_PUBLIC_API_URL (Gaspoll Backend)
              │   ├── /logsummary/all
              │   ├── /logs
              │   ├── /update-confirm
              │   └── /complaints
              │
              └── Local Proxy APIs
                  └── /api/version-proxy
```

---

## 📁 Struktur Direktori

```
gaspol-log-viewer/
│
├── pages/                          # Next.js Pages & API Routes
│   ├── index.js                    # Main Dashboard (Home Page)
│   ├── apiDocs.js                  # API Documentation Page
│   ├── _app.js                     # App Wrapper & Bootstrap Setup
│   └── api/
│       ├── logs.js                 # Log API Handler
│       ├── test.js                 # Test Endpoint
│       └── version-proxy.js        # Version Proxy
│
├── components/                     # Reusable React Components
│   ├── ModernTabs.js              # Tab Navigation Component
│   ├── ModernSubTabs.js           # Sub-Tab Navigation
│   ├── LogViewer.js               # Log Display & Search
│   ├── LogWindowsViewer.js        # Windows Logs Viewer
│   ├── LogEntry.js                # Single Log Entry Card
│   ├── LogWindowsEntry.js         # Windows Log Entry Card
│   ├── ComplaintReport.js         # Complaint Cards Display
│   ├── UpdateConfirmCard.js       # Update Confirmation Card
│   ├── LogFileButton.js           # File Selection Button
│   ├── ApiDocLayout.js            # API Docs Layout
│   ├── SidebarNavigation.js       # Sidebar Navigation
│   └── ThemeToggle.js             # Dark/Light Theme Toggle
│
├── src/
│   └── app/
│       └── globals.css            # Global Styles
│
├── public/                         # Static Assets
│   ├── favicon.ico
│   └── [SVG icons]
│
├── docs/                           # Documentation
│   ├── APP_DOCUMENTATION.md       # This file
│   ├── DESIGN_SYSTEM.md           # Design & UI Specs
│   ├── API_REFERENCE.md           # API Integration Guide
│   ├── COMPONENT_GUIDE.md         # Component Documentation
│   └── DEVELOPMENT_GUIDE.md       # Dev Setup & Guidelines
│
├── .env                            # Environment Variables
├── .env.example                    # Example Env File
├── .gitignore                      # Git Ignore Rules
├── next.config.mjs                # Next.js Configuration
├── package.json                    # Dependencies & Scripts
├── package-lock.json              # Dependency Lock File
├── jsconfig.json                  # JS Config
├── postcss.config.mjs             # PostCSS Config (Tailwind)
└── README.md                       # Project README
```

---

## 🔄 Data Flow

### 1. Authentication Flow
```
User → Enter Password → XOR + Base64 Encryption → localStorage
                          ↓
                      7-day Session TTL
                          ↓
                     On App Load: Check & Decrypt
                          ↓
                      If Valid → Show Dashboard
                      If Expired → Show Login
```

### 2. Log Fetching Flow
```
Dashboard Load
    ↓
fetchSummary() → GET /logsummary/all (Summary data per outlet)
    ↓
summaryData displayed in the outlet selector
    ↓
User selects an outlet
    ↓
GET /logs?limit=40 or GET /logs/{outlet_id}?limit=40
    ↓
API returns one cursor page (at most 40 rows)
    ↓
LogWindowsViewer groups the loaded rows
    ↓
IntersectionObserver requests the next page with pagination.next_cursor
```

Windows Logs use keyset/cursor pagination rather than offsets. Changing the outlet or refreshing cancels the previous request, clears the cursor, and loads a new first page. Additional pages are appended and deduplicated by `id`; a stale response cannot replace the currently selected outlet.

### 3. Complaint Data Flow
```
Dashboard Load
    ↓
Fetch page 1: GET /complaint?limit=40
    ↓
Render current page and pagination metadata
    ↓
Load more: GET /complaint?limit=40&cursor=<next_cursor>
    ↓
Append and de-duplicate by complaint id
    ↓
Reset cursor and fetch page 1 when search/filter changes
```

Complaint pagination uses the same cursor contract as Windows Logs: the default page size is 40 and the maximum is 100. Responses preserve `data` and add `pagination.total`, `pagination.has_more`, and an opaque `pagination.next_cursor`. Results are ordered by `sent_at DESC, id DESC`; `search`, `outlet_id`, `exclude_untitled`, and the existing `sent_at_desc` sort are applied server-side. The UI shows first-page loading, load-more loading, retry, empty, and no-more states. The previous full-array IndexedDB/streaming path remains available only in the legacy compatibility function and is not used by the paginated tab.

### 4. Update Confirmation Flow
```
Dashboard periodic check (10s interval)
    ↓
fetchUpdateConfirmData() → GET /update-confirm
    ↓
Sort by outlet_id
    ↓
Compare with remote version
    ↓
UpdateConfirmCard shows status per outlet
```

---

## 🎨 Design System

### Color Palette
- **Primary Background**: `#0a0a0a` (Deep Black)
- **Secondary Background**: `#1c1c1e` (Dark Gray)
- **Card Background**: `#18181b` (Zinc-900)
- **Text Primary**: `#ededed` (Off-white)
- **Text Secondary**: `#e0e0e0` (Light Gray)
- **Accent (Cyan)**: `#38bdf8` (Sky Blue)
- **Success**: `#28a745` (Green)
- **Warning**: `#ffcc00` (Amber)
- **Danger**: `#dc3545` (Red)
- **Info**: `#000000` (Black)

### Typography
- **Font Family**: System fonts + Bootstrap defaults
- **Heading (h5)**: `clamp(16px, 3vw, 18px)` (Responsive)
- **Body Text**: `14px`
- **Button Text**: `clamp(12px, 2vw, 13px)`
- **Mono Font**: `GeistMono, Courier New, monospace`

### Responsive Design
```
Mobile First Approach:
├── Mobile (< 576px): Single column, full-width controls
├── Tablet (576px - 768px): 2-column layout, adjusted padding
├── Desktop (768px+): Multi-column, side-by-side panels
└── Large (1200px+): Full width with centered content
```

### Component Styling Patterns
```javascript
// Responsive Container
{
  width: '100%',
  height: 'clamp(400px, 90vh, 90vh)',  // Fluid height
  padding: 'clamp(8px, 2vw, 16px)',    // Fluid padding
  display: 'flex',
  flexDirection: 'column',
}

// Responsive Typography
{
  fontSize: 'clamp(12px, 2vw, 13px)',  // Scales with viewport
  fontWeight: 500,
}

// Touch-friendly Scrolling
{
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch'     // Smooth momentum scroll
}
```

---

## 🔐 Security Features

### 1. Session Management
- **Encryption**: XOR cipher + Base64 encoding
- **Storage**: localStorage with 7-day TTL
- **Validation**: Session timestamp checked on app load
- **Logout**: Auto-logout on session expiration

```javascript
const encryptSession = (str) => {
  const key = 'gaspol2026';
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
};
```

### 2. Client-side Caching
- **IndexedDB** for large payloads (complaints data)
- **Cache Metadata** to track freshness
- **6-hour TTL** for cached data
- **Force refresh** option available

### 3. Password Protection
- Single password via `.env` variable
- Compared with user input before session creation
- Protected with environment variable encryption

---

## 🚀 Key Features

### Feature 1: Multi-Outlet Log Viewer
- View logs from multiple outlets simultaneously
- Filter by specific outlet
- Search within selected outlet logs
- Auto-group identical logs (by message, exception, source)

### Feature 2: Windows Client Logs
- Dedicated tab for Windows client logs
- Real-time update confirmation tracking
- Remote version monitoring
- Status per outlet display

### Feature 3: Complaint Reporting System
- Progressive data loading (no UI freeze)
- Complaint card expansion/collapse
- JSON data viewer with copy buttons
- Filter by outlet & category
- Batch rendering with 5-card steps

### Feature 4: API Documentation
- Auto-generated from Swagger docs
- Sidebar navigation by endpoint
- Method color coding (GET, POST, PUT, DELETE)
- Interactive API explorer

### Feature 5: Responsive UI
- Mobile-first design
- Touch-friendly controls
- Responsive typography (clamp CSS)
- Horizontal scroll for compact sections

---

## 📊 State Management

### Main Page State (pages/index.js)

```javascript
// Core States
const [currentLogs, setCurrentLogs] = useState([]);           // API logs
const [windowsLogsData, setWindowsLogsData] = useState([]);  // Windows logs
const [loading, setLoading] = useState(false);                // Loading state
const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth state

// Outlet Management
const [summaryData, setSummaryData] = useState([]);           // Outlet summary
const [outletLogs, setOutletLogs] = useState("ALL");          // Selected outlet

// Tabs & Navigation
const [activeTab, setActiveTab] = useState('api');            // Main tab
const [active, setActive] = useState('client');               // Sub-tab

// Log Visibility
const [visibleFields, setVisibleFields] = useState({
  outlet_id: true,
  message: true,
  exception: false,
  source: false,
  additional_info: false,
  log_level: true,
  created_at: true,
});

// Complaint Management
const [complaintsData, setComplaintsData] = useState([]);
const [complaintLoading, setComplaintLoading] = useState(false);
const [complaintProgress, setComplaintProgress] = useState({
  loaded: 0,
  total: null,
  done: false,
  error: null,
});
const [complaintCardsLoaded, setComplaintCardsLoaded] = useState(0);
```

---

## 🔗 API Integrations

### Backend API Endpoints (NEXT_PUBLIC_API_URL)

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| GET | `/logsummary/all` | Get log count per outlet | `{ data: [{ outlet_id, outlet_name, total_logs }] }` |
| GET | `/logs?limit=40&outlet_id={id}` | First page for an outlet; `/logs/{id}` remains supported | Paginated Windows Logs response |
| GET | `/logs?limit=40&cursor={cursor}` | Next cursor page; keep the same filters as the first request | Paginated Windows Logs response |
| GET | `/update-confirm` | Get update confirmations | `{ data: [{ outlet_id, status, version, ... }] }` |
| GET | `/complaint?limit=40&cursor={cursor}` | Get cursor-paginated complaints | `{ data: [...], pagination: { limit, total, has_more, next_cursor } }` |
| GET | `/version` | Get current version | `{ version: "x.y.z" }` |

#### Windows Logs pagination contract

`GET /logs` and the compatible `GET /logs/:id` route accept these validated query parameters:

| Parameter | Rules |
|-----------|-------|
| `limit` | Optional integer from `1` to `100`; default `40` |
| `cursor` | Optional opaque cursor returned by the previous response; do not modify or reuse it with different filters |
| `outlet_id` | Optional positive integer or `ALL`; `/logs/:id` takes the outlet from the path |
| `from`, `to` | Optional ISO dates. If omitted, logs from the full available history are returned through cursor pages |
| `search` | Optional case-insensitive search across ID, outlet, level, code, message, exception, source, and metadata; maximum 100 characters |
| `level` | Optional `INFO`, `WARN`, or `ERROR` |
| `sort` | Optional `created_at_desc`; results are ordered by `created_at DESC, id DESC` |

The API selects only the fields used by the viewer: `id`, `outlet_id`, `outlet_name`, `log_code`, `log_level`, `message`, `exception`, `source`, `additional_info`, and `created_at`. It fetches `limit + 1` rows internally to produce metadata without a count query. `limit` is only the maximum rows in one HTTP response; it is not a total-history limit. Continue requesting pages with `pagination.next_cursor` until `has_more` is `false`.

Example first request:

```text
GET /logs/5?limit=40&level=ERROR&search=timeout
```

Example response:

```json
{
  "data": [{
    "id": 123,
    "outlet_id": 5,
    "outlet_name": "Outlet 5",
    "log_code": "SYNC_ERROR",
    "log_level": "ERROR",
    "message": "Timeout",
    "exception": null,
    "source": "desktop-client",
    "additional_info": null,
    "created_at": "2026-09-10T10:00:00.000Z"
  }],
  "pagination": {
    "limit": 40,
    "has_more": true,
    "next_cursor": "opaque-cursor"
  }
}
```

Use `pagination.next_cursor` unchanged for the next request, for example `GET /logs/5?limit=40&level=ERROR&search=timeout&cursor=opaque-cursor`. Empty results return HTTP `200` with `data: []` and `has_more: false`; invalid parameters return `400`. Existing callers that only read `response.data` remain compatible. The deployed API must be restarted/released after this pagination change; an older server may ignore `limit` and return no `pagination` metadata.

### Local Proxy APIs (pages/api/)

| Route | Handler | Purpose |
|-------|---------|---------|
| `/api/logs` | `pages/api/logs.js` | Log file reading from server |
| `/api/test` | `pages/api/test.js` | Health check endpoint |
| `/api/version-proxy` | `pages/api/version-proxy.js` | Proxy to backend version |

---

## 💾 Database Schema (IndexedDB)

### Database: `gaspol-cache`

```javascript
// Store: complaints
{
  key: 'data',
  value: [
    {
      id: string,
      outlet_id: number,
      name: string,
      title: string,
      description: string,
      category: string,
      created_at: timestamp,
      ...
    }
  ]
}

// Store: complaints > meta
{
  key: 'meta',
  value: {
    ts: timestamp,        // Cache creation time
    sizeKey: string,      // Size identifier
    count: number         // Data count
  }
}

// Store: updateConfirm
{
  key: 'data',
  value: [
    {
      outlet_id: number,
      status: string,
      timestamp: timestamp,
      ...
    }
  ]
}
```

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+ & npm 8+
- Port 3030 available

### Installation
```bash
# Clone repository
git clone [repo-url] gaspol-log-viewer
cd gaspol-log-viewer

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your values
```

### Environment Variables
```env
PORT=3030
NEXT_PUBLIC_API_URL=https://api.gaspollmanagementcenter.com
LOGS_DIRECTORY=../gaspol-repo/gaspol-api/logs
NEXT_PUBLIC_SWAGGER_URL=https://api.gaspollmanagementcenter.com/api-docs
NEXT_PUBLIC_ACCESS_PASSWORD=DT2025
```

### Running Development Server
```bash
npm run dev
# Visit http://localhost:3030
```

### Build for Production
```bash
npm run build
npm start
# Or use PM2: pm2 start ecosystem.config.js
```

---

## 📱 Component Tree

```
App (_app.js)
│
└─ Home (pages/index.js)
   │
   ├─ ModernTabs (Main Navigation)
   │  │
   │  ├─ Tab 1: API Logs
   │  │  └─ LogFileButton (File Selection)
   │  │     └─ LogViewer
   │  │        ├─ Search Input
   │  │        └─ LogEntry (Multiple)
   │  │
   │  ├─ Tab 2: PM2 Logs
   │  │  └─ LogViewer (Similar structure)
   │  │
   │  ├─ Tab 3: Windows Logs
   │  │  └─ WindowsSubTabs
   │  │     ├─ SubTab 1: Log Client Windows
   │  │     │  ├─ Outlet Selection Buttons
   │  │     │  ├─ Field Visibility Checkboxes
   │  │     │  └─ LogWindowsViewer
   │  │     │     └─ LogWindowsEntry (Multiple)
   │  │     │
   │  │     └─ SubTab 2: Update Confirm
   │  │        └─ UpdateConfirmCard (Multiple)
   │  │
   │  ├─ Tab 4: Complaints
   │  │  └─ ComplaintReport
   │  │     └─ Complaint Card (Multiple, Batched)
   │  │
   │  ├─ Tab 5: API Docs
   │  │  └─ ApiDocLayout
   │  │     └─ SidebarNavigation
   │  │
   │  └─ ThemeToggle (Dark/Light mode)
```

---

## 🎯 User Workflows

### Workflow 1: View API Logs
```
1. Login dengan password
2. Pilih tab "API Logs"
3. Click file button atau file akan auto-load
4. Search logs menggunakan search bar
5. LogEntry ditampilkan dengan warna berdasarkan level
6. Click entry untuk melihat detail
```

### Workflow 2: Monitor Windows Clients
```
1. Navigate ke tab "Windows Logs"
2. Pilih outlet dari dropdown buttons
3. Toggle field visibility untuk customize view
4. Log otomatis di-group by message+exception
5. Monitor real-time updates
6. Check update confirmation status
```

### Workflow 3: Review Complaints
```
1. Navigate ke tab "Complaints"
2. Wait untuk progressive loading selesai
3. Search/filter by outlet
4. Click complaint card untuk expand
5. View detail JSON & attached info
6. Copy data menggunakan copy button
```

---

## ⚡ Performance Optimizations

1. **Client-side Caching**
   - IndexedDB untuk large payloads
   - 6-hour TTL mengurangi API calls

2. **Streaming JSON Parsing**
   - Complaints data parsed per-object
   - Incremental state updates prevent UI freeze

3. **Batched Rendering**
   - Complaint cards di-render 5 at a time
   - 120ms intervals untuk smooth animation

4. **Lazy Loading**
   - Components loaded on-demand
   - UpdateConfirmCard loaded saat dibutuhkan

5. **CSS Optimizations**
   - Clamp() untuk fluid sizing
   - CSS Grid/Flex untuk efficient layout
   - Touch-optimized scrolling

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Session expired | 7-day TTL passed | Re-login with password |
| Logs not loading | API endpoint down | Check NEXT_PUBLIC_API_URL |
| Slow complaint load | Large dataset | Wait for batched rendering |
| IndexedDB error | Storage quota exceeded | Clear browser cache |
| Search not working | Regex parse failure | Check log format |

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Hooks Guide](https://react.dev/reference/react)
- [Bootstrap Components](https://getbootstrap.com)
- [Tailwind CSS](https://tailwindcss.com)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

---

**Last Updated**: 2026-06-06  
**Documentation Version**: 1.0  
**Maintained By**: Dastrevas Development Team
