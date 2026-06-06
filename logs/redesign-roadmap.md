# Gaspol Log Viewer Redesign Roadmap

## Goal
Deliver a modern dark redesign for the main `gaspol-log-viewer` screens based on the provided reference HTML, while keeping all existing log, complaint, and API data behavior intact.

## Screen Mapping

### 1. API Logs
Reference:
- `gaspol-log-viewer/docs/reference-design-new/api-logs.html`
- `gaspol-log-viewer/docs/reference-design-new/api-logs-mobile.html`

Implementation targets:
- `gaspol-log-viewer/pages/index.js`
- `gaspol-log-viewer/components/LogViewer.js`
- `gaspol-log-viewer/components/LogEntry.js`
- `gaspol-log-viewer/components/ModernTabs.js`
- `gaspol-log-viewer/components/LogFileButton.js`

Delivered outcomes:
- dashboard-style header
- dark layered log panel
- chip-based log file selection buttons
- improved search field and message readability
- responsive stacked mobile behavior

### 2. Windows Logs
Reference:
- `gaspol-log-viewer/docs/reference-design-new/windows-logs.html`
- `gaspol-log-viewer/docs/reference-design-new/windows-logs-mobile.html`

Implementation targets:
- `gaspol-log-viewer/pages/index.js`
- `gaspol-log-viewer/components/ModernSubTabs.js`
- `gaspol-log-viewer/components/LogWindowsViewer.js`
- `gaspol-log-viewer/components/LogWindowsEntry.js`
- `gaspol-log-viewer/components/UpdateConfirmCard.js`

Delivered outcomes:
- toolbar with outlet filters and field visibility toggles
- cleaner grouped log cards
- visible severity and outlet metadata
- improved update confirmation grid
- stronger mobile overflow handling

### 3. Complaint Report
Reference:
- `gaspol-log-viewer/docs/reference-design-new/complains-logs.html`
- `gaspol-log-viewer/docs/reference-design-new/complains-logs-mobile.html`

Implementation targets:
- `gaspol-log-viewer/pages/index.js`
- `gaspol-log-viewer/components/ComplaintReport.js`

Delivered outcomes:
- incident-card presentation
- summary metadata chips
- cleaner expandable structured data blocks
- clearer loading and progress indicators

### 4. API Docs
Reference:
- `gaspol-log-viewer/docs/reference-design-new/api-docs.html`
- `gaspol-log-viewer/docs/reference-design-new/api-docs-mobile.html`

Implementation targets:
- `gaspol-log-viewer/pages/index.js`
- `gaspol-log-viewer/pages/apiDocs.js`

Delivered outcomes:
- shell matching the redesigned dashboard
- docs intro and summary panel around Swagger embed
- improved full-page docs route appearance
- better mobile frame behavior

## Delivery Sequence

### Step 1
Build the shared visual foundation.
Status: Done
- global dark tokens
- shared card and panel classes
- tab navigation refresh
- login screen refresh

### Step 2
Implement API logs and PM2 logs redesign.
Status: Done
- toolbar layout
- file pills
- viewer panel styling
- log card refresh

### Step 3
Implement Windows logs redesign.
Status: Done
- outlet buttons
- field toggles
- grouped log cards
- update confirmation cards

### Step 4
Implement Complaint Report redesign.
Status: Done
- header controls
- card layout
- expanded JSON panels
- progress presentation

### Step 5
Implement API docs redesign.
Status: Done
- embedded docs shell in `pages/index.js`
- standalone docs route improvements in `pages/apiDocs.js`

### Step 6
Validation and documentation sync.
Status: In Progress
- run build
- run `git status`
- capture final modified files

## Risks / Notes
- `gaspol-log-viewer/pages/index.js` remains large and central to app state, so future work should keep changes incremental.
- Swagger is still embedded from the configured remote URL, so final appearance depends partly on the external docs theme.
- Existing Bootstrap utility usage was preserved where practical.

## Progress Log
- 2026-06-06: Roadmap created.
- 2026-06-06: Shared visual foundation completed.
- 2026-06-06: API logs, PM2 logs, and Windows monitoring redesign completed.
- 2026-06-06: Complaint report and API docs redesign completed.
- 2026-06-06: Verification and git review pending.