# Gaspol Log Viewer Redesign Phase Plan

## Objective
Align the UI in `gaspol-log-viewer` with the dark modern reference designs in `gaspol-log-viewer/docs/reference-design-new` while preserving the current data flows, authentication flow, and existing page structure.

## Source References
- `gaspol-log-viewer/docs/APP_DOCUMENTATION.md`
- `gaspol-log-viewer/docs/DESIGN_SYSTEM.md`
- `gaspol-log-viewer/docs/reference-design-new/api-logs.html`
- `gaspol-log-viewer/docs/reference-design-new/windows-logs.html`
- `gaspol-log-viewer/docs/reference-design-new/complains-logs.html`
- `gaspol-log-viewer/docs/reference-design-new/api-docs.html`
- mobile variants in the same folder for responsive behavior

## Existing UI Findings
- `gaspol-log-viewer/pages/index.js` contains the full dashboard, authentication form, tabs, log fetching, complaint streaming, and embedded API docs.
- `gaspol-log-viewer/pages/apiDocs.js` originally redirected directly to Swagger and required replacement with a styled docs shell.
- `gaspol-log-viewer/src/app/globals.css` originally contained only basic dark styling and bootstrap overrides.
- `gaspol-log-viewer/components/ModernTabs.js` and `gaspol-log-viewer/components/ModernSubTabs.js` were minimal tab shells and were restyled instead of replaced.
- `gaspol-log-viewer/components/LogViewer.js`, `gaspol-log-viewer/components/LogEntry.js`, `gaspol-log-viewer/components/LogWindowsViewer.js`, `gaspol-log-viewer/components/LogWindowsEntry.js`, `gaspol-log-viewer/components/ComplaintReport.js`, and `gaspol-log-viewer/components/UpdateConfirmCard.js` were the main redesign targets.

## Phase Breakdown

### Phase 1 — Foundation Shell
Status: Implemented

Implemented scope:
- Established a stronger dark visual system in global styles.
- Added app shell, glass panel, metric cards, chip buttons, toolbars, search shell, and viewer panel styling.
- Redesigned login screen to match the reference dark dashboard direction.
- Restyled primary tabs and subtabs to match the reference navigation treatment.

Primary files:
- `gaspol-log-viewer/src/app/globals.css`
- `gaspol-log-viewer/pages/index.js`
- `gaspol-log-viewer/components/ModernTabs.js`
- `gaspol-log-viewer/components/ModernSubTabs.js`

### Phase 2 — Log Experience
Status: Implemented

Implemented scope:
- Redesigned API logs and PM2 logs sections with header metrics, chip-based file selectors, and elevated viewer panels.
- Redesigned Windows logs list, outlet filters, field visibility toggles, grouped log cards, and update confirmation cards.
- Improved scanability using severity chips, mono typography, and stronger metadata hierarchy.

Primary files:
- `gaspol-log-viewer/components/LogViewer.js`
- `gaspol-log-viewer/components/LogEntry.js`
- `gaspol-log-viewer/components/LogWindowsViewer.js`
- `gaspol-log-viewer/components/LogWindowsEntry.js`
- `gaspol-log-viewer/components/UpdateConfirmCard.js`
- `gaspol-log-viewer/components/LogFileButton.js`
- `gaspol-log-viewer/pages/index.js`

### Phase 3 — Complaint and API Docs Screens
Status: Implemented

Implemented scope:
- Redesigned complaint cards into structured incident cards with metadata chips and refined expanded JSON panels.
- Replaced the plain standalone docs redirect with a styled API documentation route.
- Reworked the embedded docs tab to match the redesigned dashboard shell.

Primary files:
- `gaspol-log-viewer/components/ComplaintReport.js`
- `gaspol-log-viewer/pages/index.js`
- `gaspol-log-viewer/pages/apiDocs.js`

### Phase 4 — Verification and Documentation Sync
Status: In Progress

Remaining scope:
- Run build or other relevant checks.
- Review resulting file diffs.
- Update roadmap with verification status and any deviations from reference designs.

Primary files:
- `gaspol-log-viewer/logs/redesign-phase-plan.md`
- `gaspol-log-viewer/logs/redesign-roadmap.md`

## Implementation Rules
- Preserve existing fetch logic, session logic, IndexedDB cache flow, and polling behavior.
- Prefer targeted component/style changes over architecture rewrites.
- Keep compatibility with Bootstrap utilities already used by the app.
- Use responsive behavior guided by the mobile reference HTML.

## Progress Log
- 2026-06-06: Phase plan created after source inspection.
- 2026-06-06: Phase 1 implemented through the new global shell, login redesign, and tab navigation refresh.
- 2026-06-06: Phase 2 implemented through API log, PM2 log, Windows log, and update confirmation UI refresh.
- 2026-06-06: Phase 3 implemented through complaint card redesign and standalone/API docs shell redesign.
- 2026-06-06: Phase 4 pending verification commands and git review.