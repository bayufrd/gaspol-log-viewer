# 🎨 Design System & UI Specifications

**Gaspol Log Viewer** - Complete Design Guidelines for UI Enhancement

---

## 📐 Design Tokens

### Color Palette

#### Primary Colors
```
Background Dark:     #0a0a0a  (RGB: 10, 10, 10)  - Main app background
Background Medium:   #1c1c1e  (RGB: 28, 28, 30)  - Card backgrounds
Background Light:    #18181b  (RGB: 24, 24, 27)  - Tab backgrounds
```

#### Text Colors
```
Text Primary:        #ededed  (RGB: 237, 237, 237) - Main text
Text Secondary:      #e0e0e0  (RGB: 224, 224, 224) - Secondary text
Text Muted:          #a0a0a0  (RGB: 160, 160, 160) - Disabled/muted text
```

#### Semantic Colors
```
Success (Green):     #28a745  (RGB: 40, 167, 69)   - Success states
Warning (Amber):     #ffcc00  (RGB: 255, 204, 0)   - Warnings
Danger (Red):        #dc3545  (RGB: 220, 53, 69)   - Errors
Info (Cyan):         #38bdf8  (RGB: 56, 189, 248)  - Active/selected
```

#### Log Level Colors
```
ERROR:               #ff4444  (RGB: 255, 68, 68)   - Critical logs
WARN:                #ffaa00  (RGB: 255, 170, 0)   - Warnings
INFO:                #44aaff  (RGB: 68, 170, 255)  - Information
DEBUG:               #888888  (RGB: 136, 136, 136) - Debug info
TRACE:               #666666  (RGB: 102, 102, 102) - Trace logs
```

### Typography Scale

```
Heading XL (H1):     20px - Bold     - Page titles
Heading L (H2):      18px - Bold     - Section headers
Heading M (H3):      16px - SemiBold - Subsections
Heading S (H4):      14px - SemiBold - Labels
Body Large:          14px - Regular  - Main content
Body Regular:        13px - Regular  - Secondary content
Body Small:          12px - Regular  - Metadata/timestamps
Caption:             11px - Regular  - Hints/captions
Mono:                12px - Regular  - Code/JSON display
```

### Spacing Scale

```
xs:  4px   (0.25rem)
sm:  8px   (0.5rem)
md:  12px  (0.75rem)
lg:  16px  (1rem)
xl:  24px  (1.5rem)
2xl: 32px  (2rem)
3xl: 48px  (3rem)
```

### Border Radius

```
xs:  2px
sm:  4px
md:  6px
lg:  12px
xl:  16px
full: 9999px (circular)
```

### Shadow System

```
sm:  0 1px 2px rgba(0,0,0,0.05)
md:  0 2px 4px rgba(0,0,0,0.1)
lg:  0 4px 8px rgba(0,0,0,0.15)
xl:  0 2px 12px rgba(0,0,0,0.08) - Main component shadow
2xl: 0 10px 20px rgba(0,0,0,0.2)
```

### Animation Tokens

```
Duration:
  Fast:    150ms
  Normal:  300ms
  Slow:    500ms

Easing:
  ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
  ease-out:    cubic-bezier(0, 0, 0.2, 1)
  ease-in:     cubic-bezier(0.4, 0, 1, 1)
```

---

## 🖥️ Component Design Specifications

### 1. ModernTabs Component

**Purpose**: Main tab navigation  
**Location**: `components/ModernTabs.js`

#### Visual Specs
```
┌──────────────────────────────────────────┐
│  [API] [PM2] [Windows] [Complaints] [Docs]
├──────────────────────────────────────────┤
│                                          │
│         Tab Content Area                 │
│                                          │
└──────────────────────────────────────────┘
```

#### Design Details
- **Background**: `#18181b` (Zinc-900)
- **Border Radius**: `12px`
- **Padding**: `4px` (internal gap)
- **Shadow**: `0 2px 12px rgba(0,0,0,0.08)`
- **Margin Bottom**: `24px`

#### Tab Button States
```
Normal State:
  Background:     transparent
  Color:          #e0e0e0
  Border Bottom:  2px solid transparent
  Padding:        6px 12px
  Font Weight:    500
  Font Size:      14px
  Transition:     all 0.2s

Active State:
  Background:     #27272a (Zinc-800)
  Color:          #ffffff
  Border Bottom:  2px solid #38bdf8 (Cyan)
  Shadow:         0 2px 8px rgba(56,189,248,0.08)

Hover State:
  Background:     rgba(255,255,255,0.05)
  Color:          #ffffff

Focus State:
  Outline:        2px solid #38bdf8
  Outline Offset: 2px
```

#### Responsive Behavior
```
Mobile (<600px):
  - Tabs left-aligned with scroll
  - Each tab min-width: 80px
  - Horizontal scroll enabled

Tablet (600px-1024px):
  - Tabs centered
  - Same width proportional to content

Desktop (>1024px):
  - Tabs centered
  - Equal distribution
```

---

### 2. LogWindowsViewer Component

**Purpose**: Display Windows client logs with grouping  
**Location**: `components/LogWindowsViewer.js`

#### Container Structure
```
┌─────────────────────────────────────────────────────┐
│ Log Client Windows                                  │ Title
├─────────────────────────────────────────────────────┤
│ [All Outlet] [Outlet 1] [Outlet 2] [Outlet 3]   │ Buttons
├─────────────────────────────────────────────────────┤
│ ☑ outlet_id ☑ message ☑ log_level ☑ created_at │ Filters
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌────────────────────────────────────────────────┐ │
│ │ [1] 2026-06-06 10:30:45  Outlet 1            │ │
│ │ Message: Connection timeout                   │ │
│ │ Level: ERROR  Count: 5 similar logs           │ │
│ └────────────────────────────────────────────────┘ │
│                                                     │
│ ┌────────────────────────────────────────────────┐ │
│ │ [2] 2026-06-06 10:29:30  Outlet 2            │ │
│ │ Message: Database query failed                │ │
│ │ Level: WARN   Count: 3 similar logs           │ │
│ └────────────────────────────────────────────────┘ │
│                                                     │
│                    [Load more...]                   │
└─────────────────────────────────────────────────────┘
```

#### Responsive Sizing
```javascript
Container: {
  width: '100%',
  height: 'clamp(400px, 90vh, 90vh)',    // Fluid height
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  padding: 'clamp(8px, 2vw, 16px)',      // Fluid padding
}
```

#### Field Selector Design
```
┌────────────────────────────────────────┐
│ ☑ outlet_id   ☑ message   ☑ log_level │
│ ☑ created_at  ☐ exception ☐ source    │
└────────────────────────────────────────┘

Checkbox:
  - Size: 16x16px
  - Border: 1px solid #e0e0e0
  - Margin Right: 4px
  - Cursor: pointer
  - Transition: 150ms

Label:
  - Font Size: clamp(11px, 2vw, 13px)
  - White Space: nowrap
  - Flex Shrink: 0
  - Margin Bottom: 8px
```

---

### 3. LogEntry Component

**Purpose**: Display individual log entries  
**Location**: `components/LogEntry.js`

#### Log Entry Card Design
```
┌──────────────────────────────────────────────────┐
│ [ERROR] 2026-06-06 10:30:45                     │
│ Message: Connection timeout from database       │
│                                                  │
│ Additional: database_id=5, retry_count=3        │
│ Stack: at connection.js:145 > connect()         │
└──────────────────────────────────────────────────┘
```

#### Styling
```javascript
Card: {
  background:     '#1c1c1e',
  border:         '1px solid rgba(255,255,255,0.08)',
  borderRadius:   '6px',
  padding:        '10px 12px',
  marginBottom:   '8px',
  fontSize:       'clamp(11px, 2vw, 13px)',
  lineHeight:     '1.5',
}

Level Badge: {
  ERROR:          { bg: '#ff4444', text: 'white' },
  WARN:           { bg: '#ffaa00', text: 'black' },
  INFO:           { bg: '#44aaff', text: 'white' },
  DEBUG:          { bg: '#888888', text: 'white' },
}

Timestamp: {
  color:          '#a0a0a0',
  fontSize:       '11px',
  marginTop:      '4px',
}
```

---

### 4. ComplaintReport Component

**Purpose**: Display complaint cards with details  
**Location**: `components/ComplaintReport.js`

#### Complaint Card Design
```
┌─────────────────────────────────────────────────────┐
│ [⬍] Complaint #1234                      Toggle    │
│ ┌───────────────────────────────────────────────────┤
│ │ Outlet: Outlet 1 (ID: 1)                         │
│ │ Category: System Error                           │
│ │ Status: Open                                     │
│ │ Reported By: admin_user                          │
│ │ Created: 2026-06-06 10:30:45                     │
│ │                                                   │
│ │ Description: Database connection timeout         │
│ │ when processing large batch orders               │
│ │                                                   │
│ │ ┌─────────────────────────────────────────────┐  │
│ │ │ {                                           │  │
│ │ │   "error_code": "DB_TIMEOUT",              │  │
│ │ │   "retry_count": 5,                         │  │
│ │ │   "affected_rows": 250                      │  │
│ │ │ }                                           │  │
│ │ │                              [Copy] [Edit]  │  │
│ │ └─────────────────────────────────────────────┘  │
│ └───────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────┘
```

#### Card Styling
```javascript
Card Container: {
  background:     '#18181b',
  border:         '1px solid rgba(56,189,248,0.2)',
  borderRadius:   '8px',
  padding:        '12px',
  marginBottom:   '12px',
  transition:     'all 0.3s',
}

Card Header: {
  display:        'flex',
  justifyContent: 'space-between',
  alignItems:     'center',
  paddingBottom:  '8px',
  borderBottom:   '1px solid rgba(255,255,255,0.08)',
  marginBottom:   '8px',
}

Toggle Icon: {
  width:          '20px',
  height:         '20px',
  cursor:         'pointer',
  color:          '#38bdf8',
}

JSON Panel: {
  background:     '#0b0f13',
  border:         '1px solid rgba(255,255,255,0.04)',
  borderRadius:   '6px',
  padding:        '8px',
  maxHeight:      '140px',
  overflow:       'auto',
  fontFamily:     'GeistMono, Courier New, monospace',
  fontSize:       '12px',
  color:          '#cbd5e1',
  marginTop:      '8px',
}
```

#### Progressive Loading
```
Stage 1: Initial Load
  - Show: 0 cards
  - Loading indicator: "Loading complaints..."

Stage 2: First Batch (0-5 cards)
  - Render 5 cards
  - Add 120ms delay

Stage 3: Subsequent Batches
  - Add 5 more cards every 120ms
  - Stop when total reached

Progressive UX:
  ✓ No UI freeze on large datasets
  ✓ Smooth animation
  ✓ User sees immediate feedback
  ✓ Can interact while loading
```

---

### 5. ModernSubTabs Component

**Purpose**: Secondary level tabs within main tabs  
**Location**: `components/ModernSubTabs.js`

#### Design Pattern
```
┌─────────────────────────────────────┐
│ [Log Client] [Update Confirm]       │
├─────────────────────────────────────┤
│                                     │
│      SubTab Content                 │
│                                     │
└─────────────────────────────────────┘
```

#### Styling (Similar to ModernTabs but smaller)
```
Font Size:      12px (1px smaller)
Padding:        4px 10px (slightly smaller)
Min Width:      70px
Border Width:   1px (instead of 2px)
```

---

### 6. Search Input Component

**Purpose**: Filter logs by search term  
**Location**: Used in LogViewer, LogWindowsViewer

#### Design
```
┌──────────────────────────────────────────┐
│ 🔍 [Type to search...]                  │
└──────────────────────────────────────────┘

Structure:
  - Icon container: background=#1c1c1e, padding=8px
  - Input field: flexible width, placeholder text
  - Focus state: border color changes to cyan
  - Responsive: icon + input side-by-side on mobile

CSS:
input:focus {
  outline: 2px solid #38bdf8;
  outlineOffset: -2px;
}
```

---

## 📱 Responsive Design Breakpoints

### Breakpoint System
```
xs  (0px):        Default mobile styles
sm  (576px):      Small tablets
md  (768px):      Tablets
lg  (992px):      Small desktops
xl  (1200px):     Large desktops
2xl (1400px):     Extra large displays
```

### Layout Changes by Breakpoint

#### XS (Mobile: 0-575px)
```
Layout:
  - Single column full-width
  - Navigation: vertical stack
  - Buttons: Full-width or inline with wrap
  - Font: Small, clamp()-based scaling
  - Padding: clamp(8px, 2vw, 16px)

Example:
┌──────────────┐
│ Heading      │
├──────────────┤
│ Content 1    │
├──────────────┤
│ Content 2    │
└──────────────┘
```

#### SM (576px+)
```
Layout:
  - 2-column layout where appropriate
  - Buttons: horizontal layout with scroll
  - Improved spacing

Example:
┌────────┬────────┐
│Content1│Content2│
├────────┼────────┤
│Content3│Content4│
└────────┴────────┘
```

#### MD (768px+)
```
Layout:
  - Multi-column layout
  - Side-by-side panels
  - Tab navigation fully visible
  - Hover states active

Example:
┌─────────────┬──────────────┬──────────────┐
│   Sidebar   │   Main       │   Sidebar    │
├─────────────┼──────────────┼──────────────┤
│             │              │              │
└─────────────┴──────────────┴──────────────┘
```

#### LG (992px+)
```
Layout:
  - Full three-column layout possible
  - Larger spacing and typography
  - Advanced features visible
```

### Responsive Typography Examples

```javascript
// Heading responsive
fontSize: 'clamp(16px, 3vw, 18px)'
// At 576px:   16px
// At 768px:   18px
// At 1024px:  24px
// At 1400px:  36px (capped)

// Body responsive
fontSize: 'clamp(12px, 2vw, 13px)'
// At 576px:   12px
// At 768px:   13px
// At 1024px:  18px

// Small text responsive
fontSize: 'clamp(11px, 1.5vw, 12px)'
```

---

## 🎭 Theme Variations

### Dark Mode (Default)
```
Primary Background:    #0a0a0a
Secondary Background:  #1c1c1e
Card Background:       #18181b
Text:                  #ededed
Accent:                #38bdf8
Border:                rgba(255,255,255,0.08)
```

### Light Mode (Optional Future)
```
Primary Background:    #ffffff
Secondary Background:  #f5f5f5
Card Background:       #fafafa
Text:                  #1a1a1a
Accent:                #0066cc
Border:                rgba(0,0,0,0.08)
```

---

## ✨ Animation & Transitions

### Standard Transitions
```javascript
// Fade in
transition: 'opacity 0.3s ease-in-out'

// Slide down
transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'

// Color change
transition: 'background-color 0.2s, color 0.2s'

// Smooth scroll
WebkitOverflowScrolling: 'touch'
```

### Micro-interactions
```
Button Click:    150ms scale + color change
Tab Switch:      300ms fade
Card Expand:     300ms height + shadow change
Hover Effects:   200ms background color shift
```

---

## 🎯 UI Patterns

### Pattern 1: Outlet Selection
```
┌──────────────────────────────────────────┐
│ [All Outlet] [Outlet 1] [Outlet 2] ...  │
└──────────────────────────────────────────┘

Active State:
  - Button has cyan bottom border
  - Button background changes to secondary color
  - Text becomes white

Inactive State:
  - Transparent background
  - Light gray text
  - No border
```

### Pattern 2: Field Visibility Toggle
```
┌─────────────────────────────────────────┐
│ ☑ Field 1   ☑ Field 2   ☐ Field 3     │
└─────────────────────────────────────────┘

When checked:
  - Column visible in table/list
  - Checkbox filled with cyan

When unchecked:
  - Column hidden
  - Checkbox empty
```

### Pattern 3: Status Badge
```
Status Badge:
  Success:   Green (#28a745)
  Warning:   Amber (#ffcc00)
  Error:     Red (#dc3545)
  Info:      Cyan (#38bdf8)

Style:
  border-radius: 4px
  padding: 4px 8px
  font-size: 11px
  font-weight: 600
```

---

## 🚀 Performance Considerations

### CSS Performance
- ✓ Use `clamp()` instead of media queries for sizing
- ✓ Flex layout over Grid for simpler layouts
- ✓ `will-change` only on animated elements
- ✓ Debounce scroll events
- ✓ Use transform for animations (GPU acceleration)

### Component Performance
- ✓ Memo components with stable props
- ✓ useCallback for event handlers
- ✓ Lazy load heavy components
- ✓ Progressive rendering with batching

### Loading States
```
Quick Load (<500ms):     Show data immediately
Medium Load (500-2000ms): Show skeleton or spinner
Slow Load (>2000ms):     Show detailed progress
```

---

## 📋 Implementation Checklist

For UI Enhancement with Google Sketch:

- [ ] Create color swatches matching design tokens
- [ ] Design tab component with all states
- [ ] Create log entry card designs
- [ ] Design complaint card with expanded view
- [ ] Create outlet button group design
- [ ] Design field selector checkboxes
- [ ] Create responsive grid layouts
- [ ] Design mobile navigation pattern
- [ ] Create micro-interaction animations
- [ ] Design dark/light mode variations
- [ ] Create typography scale guide
- [ ] Design spacing grid system
- [ ] Create form input designs
- [ ] Design loading & empty states
- [ ] Create error state designs
- [ ] Document all component variants

---

## 🔗 Design System References

**Figma Components** (To be created):
- [ ] ModernTabs variations
- [ ] Log entry card
- [ ] Complaint card
- [ ] Outlet buttons
- [ ] Search input
- [ ] Status badges
- [ ] Progress indicators

**CSS Variables** (Can be added to globals.css):
```css
:root {
  --color-bg-primary: #0a0a0a;
  --color-bg-secondary: #1c1c1e;
  --color-bg-tertiary: #18181b;
  
  --color-text-primary: #ededed;
  --color-text-secondary: #e0e0e0;
  --color-text-muted: #a0a0a0;
  
  --color-accent: #38bdf8;
  --color-success: #28a745;
  --color-warning: #ffcc00;
  --color-danger: #dc3545;
  
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 12px;
  
  --shadow-md: 0 2px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 4px 20px rgba(0,0,0,0.12);
  
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 300ms ease-in-out;
}
```

---

**Last Updated**: 2026-06-06  
**Design System Version**: 1.0  
**Framework**: Bootstrap 5 + Tailwind CSS 4 + Custom CSS
