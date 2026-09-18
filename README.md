# BI Dashboard

Upload a CSV or Excel file and instantly get charts, statistics, and plain-English insights — no configuration required.

**Live demo →** [frontend-mu-blond-59.vercel.app](https://frontend-mu-blond-59.vercel.app)

---

## Overview

BI Dashboard is a full-stack monorepo with a **Next.js** frontend and an **ASP.NET Core** backend deployed as a Docker container. Drop in any tabular data file and the app automatically detects column types, computes statistics, generates Recharts-powered visualisations, and surfaces key insights.

```
dotnetapp/
├── frontend/      # Next.js 16 + React 19 + Recharts
├── backend/       # ASP.NET Core (.NET 9) Web API
├── dev.bat        # One-click local dev launcher (Windows)
├── stop.bat       # Stops local dev servers
└── sample-data.csv
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | Next.js 16 (App Router, Turbopack) |
| UI rendering | React 19 |
| Charts | Recharts 3 |
| Language | TypeScript 5 |
| Backend framework | ASP.NET Core (.NET 9) |
| File parsing | CsvHelper · ClosedXML |
| Container | Docker (`mcr.microsoft.com/dotnet/aspnet:9.0`) |
| Hosting | Vercel (Next.js + Container runtime) |

---

## Features

- **Drag-and-drop upload** — CSV (`.csv`) and Excel (`.xlsx`) up to 50 MB
- **Auto column detection** — classifies every column as `Date`, `Number`, or `Category`
- **Key statistics** — min, max, mean, sum for numeric columns; top category + count for categorical columns
- **Auto-generated charts** — line charts for trends, bar/pie charts for categories, scatter charts for numeric pairs
- **Plain-English insights** — highlights top performers, outliers, and data quality notes
- **Data preview** — first 50 rows displayed in a sortable table
- **Sample dataset** — one-click sales demo (dates, categories, revenue, units)

---

## Local Development

### Prerequisites

| Tool | Version |
|------|---------|
| Docker Desktop | Running |
| Node.js | ≥ 18 |
| npm | ≥ 9 |

### Start everything

```bat
dev.bat
```

This script:
1. Detects if backend source changed and rebuilds the Docker image only when needed
2. Starts the backend container on **http://localhost:3001**
3. Starts the Next.js dev server on **http://localhost:3000**

Each service opens in its own terminal window with live logs.

### Stop everything

```bat
stop.bat
```

### Manual startup

**Backend only:**
```bat
cd backend
docker build -f Dockerfile.vercel -t helloworld-vercel .
docker run --name helloworld-local -p 3001:80 -e PORT=80 helloworld-vercel
```

**Frontend only:**
```bat
cd frontend
npm install
npm run dev
```

### Environment variables

**`frontend/.env.local`** (created automatically, not committed):
```env
# Points at the local Docker backend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Project Structure

### Frontend (`frontend/`)

```
frontend/
├── app/
│   ├── page.tsx          # Home (upload view + results dashboard)
│   ├── layout.tsx        # Root layout
│   └── globals.css
├── components/
│   ├── atoms/            # Button, Label, Divider
│   ├── molecules/        # FileDropzone
│   └── organisms/
│       ├── UploadSection.tsx   # Sample data + drop zone
│       ├── StatsRow.tsx        # Key statistics cards
│       ├── ChartsGrid.tsx      # Recharts grid
│       ├── InsightsPanel.tsx   # Insight bullets
│       └── DataTable.tsx       # Preview table
└── lib/
    ├── tokens.ts         # Design tokens (colors, spacing, fonts)
    ├── types.ts          # Shared TypeScript interfaces
    └── ThemeContext.tsx
```

### Backend (`backend/`)

```
backend/
├── Controllers/
│   └── UploadController.cs   # POST /api/upload, GET /api/health
├── Services/
│   ├── FileParserService.cs       # CSV + Excel → rows[]
│   ├── ColumnAnalyzerService.cs   # Type detection
│   ├── StatisticsService.cs       # Min/max/mean/sum/top-category
│   ├── ChartSpecBuilder.cs        # Chart spec generation
│   └── InsightGenerator.cs        # Plain-English insights
├── Models/
│   └── AnalysisModels.cs          # AnalysisResult, ColumnInfo, etc.
├── Program.cs
├── HelloWorld.csproj
├── Dockerfile.vercel              # Multi-stage Docker build
└── vercel.json                    # Container runtime config
```

---

## API

### `POST /api/upload`

Upload a CSV or Excel file for analysis.

**Request:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `file` | File | `.csv`, `.xlsx`, or `.xls` — max 50 MB |

**Response `200 OK`:**
```json
{
  "rowCount": 150,
  "columns": [
    { "name": "Date",     "type": "Date"     },
    { "name": "Category", "type": "Category" },
    { "name": "Revenue",  "type": "Number"   }
  ],
  "stats": [
    { "column": "Revenue", "min": 100, "max": 50000, "mean": 8400, "sum": 1260000 }
  ],
  "charts": [
    { "id": "c1", "type": "LineChart", "title": "Revenue over Date", "xKey": "Date", "yKey": "Revenue", "data": [] }
  ],
  "insights": [
    "Electronics is the top category with 42 entries.",
    "Revenue ranges from $100 to $50,000 (mean $8,400)."
  ],
  "preview": [{ "Date": "2024-01-15", "Category": "Electronics", "Revenue": "12400" }]
}
```

**Error responses:**

| Status | Reason |
|--------|--------|
| `400` | No file, unsupported format, empty file |
| `500` | Server-side parse/analysis failure |

### `GET /api/health`

Returns `{ "status": "ok" }` — used by Vercel to confirm the container is live.

---

## Deployment

Both projects are deployed to **Vercel** via the CLI from the repo root.

### Deploy backend

```bash
vercel deploy --prod --scope <team-id>
```
*Run from the repo root — the root `.vercel/project.json` points to the backend container project.*

### Deploy frontend

```powershell
$env:VERCEL_PROJECT_ID="<frontend-project-id>"
$env:VERCEL_ORG_ID="<team-id>"
vercel deploy --prod --scope <team-id>
```
*Overriding the project ID targets the frontend project while Vercel resolves the `frontend/` root directory correctly from the repo root.*

### Vercel project settings

| Project | Root Directory | Runtime |
|---------|---------------|---------|
| `frontend` | `frontend` | Next.js (auto) |
| `dotnetapp` | *(repo root)* | Container (`Dockerfile.vercel`) |

### Environment variables (Vercel dashboard)

| Project | Variable | Value |
|---------|----------|-------|
| `frontend` | `NEXT_PUBLIC_API_URL` | `https://dotnetapp.vercel.app` |

---

## File Constraints

| Constraint | Limit |
|-----------|-------|
| Formats | CSV (`.csv`), Excel (`.xlsx`, `.xls`) |
| Max file size | 50 MB |
| First row | Must be column headers |
| Min data rows | 2 |
| CSV encoding | UTF-8 recommended |

---

## Column Type Detection

| Type | Detection rule | Charts generated |
|------|---------------|-----------------|
| **Date** | Parses with common formats (`YYYY-MM-DD`, `MM/DD/YYYY`, `MMM YYYY`, …) | Line chart (trend over time) |
| **Number** | All non-empty values are numeric (commas stripped) | Bar chart, scatter |
| **Category** | 2–50 distinct string values | Bar chart, pie chart |
| **Unknown** | Falls through all rules | Excluded from charts |
