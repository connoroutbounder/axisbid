# AxisBid Components Documentation

## UI Components (`components/ui/`)

### Button
File: `button.tsx`
- **Variants**: primary, secondary, outline, ghost, danger
- **Sizes**: sm, md, lg
- **Features**: Loading state with spinner, disabled state
- **Usage**: All CTAs, form submissions, actions

### Input
File: `input.tsx`
- **Features**: Label, error message, helper text, icon support
- **Props**: type, placeholder, label, error, helperText, icon, etc.
- **Styling**: Focus ring, error states

### Select
File: `select.tsx`
- **Features**: Label, grouped options, helper text, error states
- **Props**: options array with value/label, standard select attributes
- **Styling**: Custom dropdown arrow icon

### Badge
File: `badge.tsx`
- **Variants**: pending, active, completed, rejected, accepted, default, success, warning, error
- **Usage**: Status indicators, certification badges, tags
- **Styling**: Color-coded by status

### Card
File: `card.tsx`
- **Props**: header, footer, padding (none/sm/md/lg), children
- **Usage**: Content containers throughout the app
- **Styling**: White bg, gray border, shadow

### Modal
File: `modal.tsx`
- **Features**: Escape key handling, backdrop click closes, scrollable body
- **Props**: isOpen, onClose, title, children, size (sm/md/lg), footer
- **Styling**: Centered dialog with 50% bg overlay

### Tabs
File: `tabs.tsx`
- **Features**: Tab navigation, content switching, programmatic selection
- **Props**: tabs array with label/value/content
- **Styling**: Underline indicator for active tab

### Stepper
File: `stepper.tsx`
- **Features**: Progress indicator, step numbers/checkmarks, connector lines
- **Props**: steps array with label/value, currentStep, onStepChange
- **Styling**: Color-coded completion status

### StarRating
File: `star-rating.tsx`
- **Features**: Display 1-5 stars, optional interactive mode, text display
- **Props**: rating, maxRating, interactive, onRatingChange, showText, size
- **Styling**: Yellow filled stars

### StatCard
File: `stat-card.tsx`
- **Features**: Large stat display with optional trend indicator
- **Props**: label, value, icon, trend (value, isPositive)
- **Usage**: Dashboard summary cards
- **Styling**: White card with blue icon placeholder

### Alert
File: `alert.tsx`
- **Variants**: info, success, warning, error
- **Features**: Icon indicator, title, body content
- **Props**: variant, title, children
- **Styling**: Color-coded background and border

### LoadingSpinner
File: `loading-spinner.tsx`
- **Sizes**: sm, md, lg
- **Styling**: Animated border ring, brand blue color
- **Usage**: Async operation indicators

## Layout Components (`components/layout/`)

### Navbar
File: `navbar.tsx`
- **Features**: 
  - Responsive mobile menu (hamburger)
  - Auth state detection
  - Role-based nav links (customer/shop/guest)
  - Logo with custom CSS crosshair icon
- **Design**: Dark navy background, sticky positioning
- **Mobile**: Hamburger menu with smooth animations

### Footer
File: `footer.tsx`
- **Sections**: Product, Company, Legal, Contact
- **Features**: Multiple column layout, email/phone links
- **Design**: Dark navy bg, responsive grid

### Sidebar
File: `sidebar.tsx`
- **Features**: 
  - Collapsible sidebar with toggle
  - Role-based menu (customer/shop/admin)
  - Settings and logout buttons
  - Sticky positioning
- **Width**: 256px expanded, 80px collapsed

### DashboardLayout
File: `dashboard-layout.tsx`
- **Wrapper**: Sidebar + main content area
- **Props**: children, userRole
- **Styling**: Flex layout with full height sidebar

## Job Components (`components/jobs/`)

### FileUpload
File: `file-upload.tsx`
- **Features**:
  - Drag-drop zone for STEP files
  - File type validation (.step, .stp)
  - File size validation (max 100MB)
  - Progress indicators
  - Size formatting
- **Props**: onFileSelect, selectedFile
- **Styling**: Dashed border, hover effects, success state

### PartSpecsForm
File: `part-specs-form.tsx`
- **Fields**:
  - Material (grouped radio options): Aluminum, Steel, Stainless, Exotic, Plastic
  - Surface Finish (dropdown)
  - Tolerance (standard/precision/ultra)
  - Quantity (number)
  - Needed By (date picker)
  - Notes (textarea)
- **Props**: onSubmit
- **Styling**: Grouped material display with category headers

### GeometryCard
File: `geometry-card.tsx`
- **Displays**: 
  - Length, width, height (mm)
  - Volume (cm³)
  - Surface area (cm²)
  - Complexity badge (low/medium/high)
- **Props**: dimensions, volume, surfaceArea, complexity
- **Styling**: Grid layout with stat highlights

### PriceEstimate
File: `price-estimate.tsx`
- **Displays**:
  - Price range (low/mid/high)
  - Gradient bar visualization
  - Confidence level
  - Recommended budget (+20%)
- **Props**: lowEstimate, midEstimate, highEstimate, confidence
- **Styling**: Orange highlight for mid price

### StatusTimeline
File: `status-timeline.tsx`
- **Features**: Horizontal timeline with step circles
- **Props**: steps array with label/status (completed/current/pending)
- **Styling**: Color-coded circles, connector lines

### PartViewer
File: `part-viewer.tsx`
- **Features**:
  - Three.js 3D viewer
  - OrbitControls for rotation
  - Auto-rotating sample bracket
  - Grid floor
- **Libraries**: @react-three/fiber, @react-three/drei
- **Styling**: Dark gray bg, 400px height

## Bid Components (`components/bids/`)

### BidCard
File: `bid-card.tsx`
- **Displays**:
  - Shop name, verified badge
  - Rating with review count
  - Price (prominent orange)
  - Delivery days + lead time
  - Manufacturing approach notes
  - Machine capabilities list
  - Certification badges
- **Props**: All shop/bid data, onAccept callback, isAccepted flag
- **Styling**: Responsive flex layout, hover shadows

### BidForm
File: `bid-form.tsx`
- **Fields**:
  - Price input (number, with AI estimate comparison)
  - Estimated days (number)
  - Manufacturing approach (textarea)
- **Features**:
  - Price variance alerts (>30% high/low)
  - Price comparison to AI estimate
- **Props**: aiEstimate, onSubmit, isLoading
- **Styling**: Warning alerts for outlier prices

## Shop Components (`components/shops/`)

### ShopCard
File: `shop-card.tsx`
- **Displays**:
  - Shop name, verified badge, location
  - Rating and review count
  - Description
  - Years in business, completed jobs, rating stats
- **Props**: Shop profile data
- **Styling**: Card layout with stat grid

### MachineList
File: `machine-list.tsx`
- **Displays**:
  - Machine type with emoji icon
  - Brand and model
  - Axis count badge
  - Max travel specs
- **Props**: machines array
- **Styling**: List of bordered cards with hover effects

### CertificationBadges
File: `certification-badges.tsx`
- **Displays**: List of certification badges
- **Props**: certifications array
- **Styling**: Wrapped badge layout

## Utility Functions (`lib/utils.ts`)

```typescript
cn(...inputs: ClassValue[])              // Tailwind merge utility
formatPrice(cents: number)               // USD currency formatting
formatDate(date: Date | string)          // "MMM d, yyyy" format
formatDatetime(date: Date | string)      // "MMM d, yyyy h:mm a" format
formatRelativeDate(date: Date | string)  // "just now", "5m ago", etc.
getInitials(name: string)                // Get initials from name
```

## Component Usage Patterns

### Server vs Client Components
- **Server Components** (default): Pages, layouts, data-fetching containers
- **Client Components** (`'use client'`): Forms, modals, interactive elements, dropzone

### Form Handling
All form components use controlled inputs with React state:
```typescript
const [formData, setFormData] = useState(initialState)
const handleChange = (e) => setFormData({...formData, [field]: value})
const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData) }
```

### Props Patterns
- Required props listed first (no defaults)
- Optional props with sensible defaults
- Callback functions (onSubmit, onChange, etc.)
- className prop for Tailwind overrides (via cn utility)

### Styling Patterns
- All Tailwind classes
- Brand color variables via tw config
- Responsive classes (sm:, md:, lg:, etc.)
- Conditional classes via cn utility
- No inline styles or CSS modules

## Type Definitions

Key types used throughout:
```typescript
type JobStatus = 'pending' | 'active' | 'completed'
type UserRole = 'customer' | 'shop' | 'admin'
type ToleranceLevel = 'standard' | 'precision' | 'ultra'
type BadgeVariant = 'pending' | 'active' | 'completed' | 'accepted' | 'success' | 'warning' | 'error'
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'
```

## Accessibility Features

- Semantic HTML throughout
- Label associations in inputs
- ARIA attributes for modals
- Keyboard navigation support
- Focus management
- Error message associations
- Color contrast compliance

## Brand Implementation

### Colors
- Primary Navy: #1B3A5C
- Accent Blue: #2E86C1
- CTA Orange: #E67E22
- Success Green: #27AE60
- Light BG: #F4F6F8
- Dark Navy: #0D1B2A

### Typography
- Font: Inter from Google Fonts
- Headings: Bold weights
- Body: Regular/medium weights

### Spacing
- Uses Tailwind's spacing scale
- Consistent padding on cards (p-4, p-6, p-8)
- Section padding (py-12, py-16, py-20)
- Component gaps (gap-3, gap-4, gap-6, gap-8)
