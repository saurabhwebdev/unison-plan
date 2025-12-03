# Project Tracking Tool - Complete Feature Roadmap

## Table of Contents
1. [Overview](#overview)
2. [Current State](#current-state)
3. [Project Vision](#project-vision)
4. [Database Schema](#database-schema)
5. [Feature Specifications](#feature-specifications)
6. [Implementation Phases](#implementation-phases)
7. [Technical Architecture](#technical-architecture)
8. [User Roles & Permissions](#user-roles--permissions)

---

## Overview

This is a **comprehensive project lifecycle tracking tool** designed to support complete project management from initial business development through final delivery. The system tracks projects across multiple stages: Pre-Bid → Bid Submission → Project Won → Implementation → Completion.

**Target Users:**
- Business Development Teams (pre-sales, opportunity tracking)
- Sales Teams (bid management, pipeline tracking)
- Project Managers (implementation, delivery)
- Team Members (task execution, time tracking)
- Managers/Admins (oversight, reporting)
- Clients (optional portal for project visibility)

---

## 📊 Project Status Summary

### ✅ Completed Phases (December 4, 2025)
1. **Phase 1: Core Project Management** - ✅ COMPLETE
2. **Phase 2: Task Management** - ✅ COMPLETE
3. **Client Management (CRM)** - ✅ COMPLETE
4. **Team Management** - ✅ COMPLETE
5. **Authentication System** - ✅ COMPLETE

### 🚀 Next Phase
**Phase 3: Time Tracking** - Ready to implement

### 📈 Progress Overview
- **Completed:** 5 major modules
- **In Progress:** 0
- **Remaining:** 7 phases (Time Tracking, BD/Pre-Bid, Project Conversion, Reporting, Notifications, Documents, Advanced Features)

---

## Current State

### Technology Stack
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Node.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT tokens (HTTP-only cookies), bcryptjs
- **Email:** Nodemailer with Gmail SMTP
- **UI Components:** shadcn/ui (Radix UI), Lucide React icons
- **Forms:** React Hook Form with Zod validation
- **Notifications:** Sonner toast library
- **Theming:** next-themes (dark mode support)

### Implemented Features ✓

#### Phase 1: Core Project Management (✅ COMPLETED - December 4, 2025)
- ✅ Complete Project CRUD operations (Create, Read, Update, Delete)
- ✅ Project list page with grid/list toggle views
- ✅ Advanced filtering (stage, priority, status, search)
- ✅ Project detail page with tabs (Overview, Team, Activity)
- ✅ Create/Edit project forms with validation
- ✅ Edit project dialog with inline editing
- ✅ Delete projects with confirmation dialog
- ✅ Bulk delete functionality with checkboxes and select all
- ✅ Archive/Unarchive projects
- ✅ Role-based project access control
- ✅ Project code auto-generation (PRJ-YYYY-XXXX format)
- ✅ Financial tracking (estimated value, budget, actual spend)
- ✅ Progress tracking (0-100% with visual progress bars)
- ✅ Team assignment (PM, BD Lead, team members)
- ✅ Client information integrated with project forms
- ✅ Client dropdown selector with auto-population
- ✅ Mobile-responsive design
- ✅ Toast notifications for all CRUD operations
- ✅ Empty states for no projects found
- ✅ Stats cards showing project metrics

#### Client Management / CRM (✅ COMPLETED - December 4, 2025)
- ✅ Complete Client CRUD operations (Create, Read, Update, Delete)
- ✅ Client list page with card/list toggle views
- ✅ Advanced search and filters (status, type, industry)
- ✅ Edit client dialog with inline editing
- ✅ Delete clients with confirmation dialog
- ✅ Bulk delete functionality with checkboxes and select all
- ✅ Client detail pages (removed click navigation for CRUD)
- ✅ Create/Edit client forms with validation
- ✅ Primary contact management (name, email, phone, position)
- ✅ Additional contacts support
- ✅ Client status tracking (Active, Prospect, Inactive, Archived)
- ✅ Client types (Individual, Small Business, Enterprise, Government, Startup, Mid-Market)
- ✅ Account manager assignment
- ✅ Industry and revenue tracking
- ✅ Address and social media fields
- ✅ Notes and tags for organization
- ✅ Integration with Projects (client selector in project form)
- ✅ Mobile-responsive design
- ✅ Toast notifications for all CRUD operations
- ✅ Stats cards showing client metrics
- ✅ MongoDB integration with proper data structure

#### Authentication System
- User registration with email OTP verification
- Login/Logout with JWT authentication
- Password reset flow (forgot password, reset via email token)
- First login password change requirement
- Role-based access control (Admin, Manager, User, Project Manager, Business Development)

#### Team Management (✅ COMPLETED - December 4, 2025)
- ✅ View all team members
- ✅ Invite new team members (generates temporary password)
- ✅ Edit team member details (username, email, role)
- ✅ Delete team members (with safeguards)
- ✅ Bulk delete functionality with role-based permissions
- ✅ Role-based permissions for team management
- ✅ Track who invited each team member
- ✅ Support for specialized roles (PM, BD)

#### User Interface
- Responsive authenticated layout with collapsible sidebar
- Dashboard page (UI ready, stats are placeholders)
- Projects page (fully functional)
- Clients page (fully functional)
- Team management page
- Settings page (Profile, Security, Notifications tabs)
- Mobile-responsive design with sheet menu
- Dark mode support

#### Email Notifications
- Welcome email on signup with OTP
- Login notification emails
- Team invitation emails with credentials
- Password reset emails

### Database Models (Implemented)

**User Model (✅ Implemented):**
```javascript
{
  username: String (unique, 3-30 chars)
  email: String (unique, validated)
  password: String (hashed with bcrypt)
  role: Enum ["admin", "user", "manager", "project_manager", "business_development"]
  isVerified: Boolean
  isFirstLogin: Boolean
  invitedBy: String
  otp: String
  otpExpires: Date
  resetPasswordToken: String
  resetPasswordExpires: Date
  createdAt: Date
  updatedAt: Date
}
```

**Project Model (✅ Implemented):**
```javascript
{
  name: String
  description: String
  projectCode: String (unique, auto-generated)
  clientName: String
  clientContact: Object {name, email, phone, company}
  stage: Enum [lead, pre_bid, bid_submitted, negotiation, won, in_progress, on_hold, completed, lost, cancelled]
  status: Enum [active, archived]
  estimatedValue: Number
  actualValue: Number
  currency: String
  budget: Number
  actualSpend: Number
  leadDate, bidDeadline, startDate, endDate, etc.: Date fields
  businessDevelopmentLead: ObjectId (User)
  projectManager: ObjectId (User)
  teamMembers: Array[{user, role, assignedDate}]
  bidProbability: Number (0-100)
  progressPercentage: Number (0-100)
  priority: Enum [low, medium, high, critical]
  tags: Array[String]
  category: String
  createdBy: ObjectId (User)
  createdAt, updatedAt: Date
}
```

**Client Model (✅ Implemented):**
```javascript
{
  name: String
  companyName: String
  industry: String
  website: String
  primaryContact: Object {name, email, phone, position}
  additionalContacts: Array[{name, email, phone, position, isPrimary}]
  address: Object {street, city, state, country, zipCode}
  status: Enum [active, inactive, prospect, archived]
  clientType: Enum [individual, small_business, enterprise, government]
  accountManager: ObjectId (User)
  estimatedAnnualRevenue: Number
  currency: String
  relationshipStartDate: Date
  lastContactDate: Date
  notes: String
  socialMedia: Object {linkedin, twitter, facebook}
  tags: Array[String]
  createdBy: ObjectId (User)
  createdAt, updatedAt: Date
}
```

**Task Model (✅ Implemented):**
```javascript
{
  project: ObjectId (ref: Project)
  title: String (required, 3-200 chars)
  description: String (max 2000 chars)
  taskNumber: String (auto-generated, format: PROJECT_CODE-XXX)
  status: Enum ["todo", "in_progress", "in_review", "blocked", "completed", "cancelled"]
  priority: Enum ["low", "medium", "high", "critical"]
  assignedTo: ObjectId (ref: User)
  createdBy: ObjectId (ref: User, required)
  dueDate: Date
  startedAt: Date (auto-set when status -> in_progress)
  completedAt: Date (auto-set when status -> completed)
  estimatedHours: Number
  actualHours: Number
  parentTask: ObjectId (ref: Task, for subtasks)
  dependencies: Array[ObjectId] (refs: Task)
  milestone: ObjectId (ref: Milestone)
  progressPercentage: Number (0-100, default: 0)
  tags: Array[String]
  createdAt, updatedAt: Date
}
```

#### Phase 2: Task Management (✅ COMPLETED - December 4, 2025)
- ✅ Task Model implemented (models/Task.ts)
- ✅ Task API routes (GET, POST) created (api/tasks/route.ts)
- ✅ Task CRUD operations (Create, Read, Update, Delete)
- ✅ Complete tasks page with list and Kanban board views
- ✅ View toggle between List and Kanban layouts
- ✅ Task status tracking (todo, in_progress, in_review, blocked, completed, cancelled)
- ✅ Task priority levels (low, medium, high, critical)
- ✅ Task assignment to team members
- ✅ Project relationship and task numbering (PROJECT_CODE-XXX)
- ✅ Due date tracking with visual indicators
- ✅ Progress percentage tracking (0-100%)
- ✅ Estimated and actual hours tracking
- ✅ Task search functionality
- ✅ Advanced filtering (status, priority, project, assignee)
- ✅ Bulk delete functionality with checkboxes and select all
- ✅ Create task dialog with full form validation
- ✅ Edit task dialog with inline editing
- ✅ Delete tasks with confirmation
- ✅ Task tags support
- ✅ Task statistics cards (total, in progress, completed)
- ✅ Empty states for no tasks found
- ✅ Mobile-responsive design
- ✅ Toast notifications for all operations
- ✅ Color-coded status badges
- ✅ Auto-generation of task numbers
- ✅ Pre-save middleware (auto-set startedAt, completedAt)

### What's Next

#### Phase 3: Time Tracking (🚀 NEXT TO IMPLEMENT)
**Priority:** High - Essential for project tracking and billing
- ⏳ TimeLog Model (to build)
- ⏳ TimeLog API routes (to build)
- ⏳ Daily timesheet view
- ⏳ Weekly timesheet grid
- ⏳ Time entry form with project/task selection
- ⏳ Billable vs non-billable hours tracking
- ⏳ Time approval workflow (optional)
- ⏳ Time reports per project
- ⏳ Time reports per team member
- ⏳ Integration with tasks (show time logs in task detail)

### What's Still Missing (Future Phases)
- Milestone tracking (Phase 4+)
- Reporting and analytics dashboard (Phase 6)
- Document management and file uploads (Phase 8)
- Activity/audit logs (Phase 9)
- Real-time notifications (Phase 7)
- Client portal (Phase 9, optional)

---

## Project Vision

### Complete Project Lifecycle Flow

```
┌─────────────────┐
│  STAGE 1:       │
│  Lead/          │──┐
│  Opportunity    │  │
└─────────────────┘  │
                     │
┌─────────────────┐  │
│  STAGE 2:       │  │
│  Pre-Bid/       │◄─┘
│  Proposal       │──┐
└─────────────────┘  │
                     │
┌─────────────────┐  │
│  STAGE 3:       │  │
│  Bid Submitted/ │◄─┘
│  Awaiting       │──┐
└─────────────────┘  │
                     │
┌─────────────────┐  │   Won?
│  STAGE 4:       │  │   ├─Yes──┐
│  Decision       │◄─┘   │      │
│  (Won/Lost)     │──────┘      │
└─────────────────┘             │
                                │
┌─────────────────┐             │
│  STAGE 5:       │             │
│  Project        │◄────────────┘
│  Handoff        │──┐
└─────────────────┘  │
                     │
┌─────────────────┐  │
│  STAGE 6:       │  │
│  Implementation/│◄─┘
│  Execution      │──┐
└─────────────────┘  │
                     │
┌─────────────────┐  │
│  STAGE 7:       │  │
│  Delivery/      │◄─┘
│  Completion     │
└─────────────────┘
```

---

## Database Schema

### 1. Project Model (To Build)

**Purpose:** Core entity representing projects at any stage of lifecycle

```typescript
interface Project {
  // Basic Information
  _id: ObjectId
  name: string                          // Project name
  description: string                   // Detailed description
  projectCode: string                   // Unique identifier (e.g., "PRJ-2025-001")

  // Client Information
  clientName: string
  clientContact: {
    name: string
    email: string
    phone?: string
    company?: string
  }

  // Project Stage & Status
  stage: enum [
    "lead",                             // Initial opportunity
    "pre_bid",                          // Preparing proposal
    "bid_submitted",                    // Proposal submitted
    "negotiation",                      // In negotiation
    "won",                              // Project won
    "in_progress",                      // Active implementation
    "on_hold",                          // Temporarily paused
    "completed",                        // Successfully delivered
    "lost",                             // Bid lost
    "cancelled"                         // Project cancelled
  ]
  status: enum [
    "active",
    "archived"
  ]

  // Financial Information
  estimatedValue: number                // Estimated project value
  actualValue?: number                  // Actual contract value (after won)
  currency: string                      // USD, EUR, etc.
  budget?: number                       // Allocated budget
  actualSpend?: number                  // Actual money spent

  // Timeline
  leadDate?: Date                       // When lead was created
  bidDeadline?: Date                    // Bid submission deadline
  bidSubmittedDate?: Date               // When bid was submitted
  expectedDecisionDate?: Date           // Expected client decision date
  startDate?: Date                      // Project start date (after won)
  endDate?: Date                        // Project end date
  estimatedDuration?: number            // In days
  actualCompletionDate?: Date           // When actually completed

  // Team & Ownership
  businessDevelopmentLead?: ObjectId    // User who brought the lead
  projectManager?: ObjectId             // PM for implementation
  teamMembers: [{
    user: ObjectId                      // User reference
    role: string                        // Developer, Designer, QA, etc.
    assignedDate: Date
  }]

  // Bid Information (Pre-Sales Stage)
  bidProbability?: number               // 0-100% chance of winning
  competitors?: [string]                // Competing companies
  winLossReason?: string                // Why we won/lost

  // Progress Tracking
  progressPercentage: number            // 0-100
  priority: enum ["low", "medium", "high", "critical"]

  // Metadata
  createdBy: ObjectId                   // User who created
  createdAt: Date
  updatedAt: Date
  archivedAt?: Date
  archivedBy?: ObjectId

  // Categorization
  tags: [string]                        // Custom tags for filtering
  category?: string                     // Industry, department, etc.
}
```

### 2. Task Model (To Build)

**Purpose:** Break projects into actionable tasks

```typescript
interface Task {
  _id: ObjectId
  project: ObjectId                     // Reference to Project

  // Task Details
  title: string
  description?: string
  taskNumber: string                    // e.g., "TASK-001"

  // Status & Priority
  status: enum [
    "todo",
    "in_progress",
    "in_review",
    "blocked",
    "completed",
    "cancelled"
  ]
  priority: enum ["low", "medium", "high", "critical"]

  // Assignment
  assignedTo?: ObjectId                 // User assigned
  createdBy: ObjectId

  // Timeline
  dueDate?: Date
  startedAt?: Date
  completedAt?: Date
  estimatedHours?: number
  actualHours?: number                  // Auto-calculated from time logs

  // Relationships
  parentTask?: ObjectId                 // For subtasks
  dependencies: [ObjectId]              // Tasks that must complete first
  milestone?: ObjectId                  // Associated milestone

  // Progress
  progressPercentage: number            // 0-100

  // Metadata
  createdAt: Date
  updatedAt: Date

  // Additional
  tags: [string]
  attachments: [{
    filename: string
    url: string
    uploadedBy: ObjectId
    uploadedAt: Date
  }]
}
```

### 3. TimeLog Model (To Build)

**Purpose:** Track time spent on projects and tasks

```typescript
interface TimeLog {
  _id: ObjectId

  // References
  user: ObjectId                        // Who logged the time
  project: ObjectId                     // Project reference
  task?: ObjectId                       // Optional task reference

  // Time Details
  date: Date                            // Date of work
  hours: number                         // Hours worked (decimal)
  description: string                   // What was done

  // Billing
  isBillable: boolean                   // Billable to client?
  hourlyRate?: number                   // Rate for this work

  // Approval (Optional)
  isApproved: boolean
  approvedBy?: ObjectId
  approvedAt?: Date

  // Metadata
  createdAt: Date
  updatedAt: Date
}
```

### 4. Milestone Model (To Build)

**Purpose:** Track key project milestones and deliverables

```typescript
interface Milestone {
  _id: ObjectId
  project: ObjectId                     // Reference to Project

  // Milestone Details
  title: string
  description?: string

  // Status
  status: enum ["pending", "in_progress", "completed", "missed"]

  // Timeline
  dueDate: Date
  completedAt?: Date

  // Progress
  progressPercentage: number            // 0-100

  // Payment Milestone?
  isPaymentMilestone: boolean           // Triggers payment?
  paymentAmount?: number
  paymentReceived: boolean

  // Order
  order: number                         // Display order

  // Metadata
  createdBy: ObjectId
  createdAt: Date
  updatedAt: Date
}
```

### 5. Comment Model (To Build)

**Purpose:** Comments and discussions on projects and tasks

```typescript
interface Comment {
  _id: ObjectId

  // Reference (polymorphic)
  referenceType: enum ["project", "task"]
  referenceId: ObjectId                 // Project or Task ID

  // Content
  content: string                       // Comment text (supports mentions)
  mentions: [ObjectId]                  // Users mentioned with @

  // Thread
  parentComment?: ObjectId              // For replies

  // Author
  author: ObjectId                      // User who commented

  // Attachments
  attachments: [{
    filename: string
    url: string
    fileType: string
    size: number
  }]

  // Metadata
  createdAt: Date
  updatedAt: Date
  editedAt?: Date
  isEdited: boolean
}
```

### 6. Document Model (To Build)

**Purpose:** Store project-related documents and files

```typescript
interface Document {
  _id: ObjectId
  project: ObjectId                     // Reference to Project

  // File Details
  filename: string
  originalFilename: string
  fileType: string                      // MIME type
  fileSize: number                      // Bytes
  fileUrl: string                       // Storage URL/path

  // Categorization
  category: enum [
    "contract",
    "proposal",
    "requirement",
    "design",
    "deliverable",
    "other"
  ]
  description?: string
  tags: [string]

  // Version Control
  version: number                       // 1, 2, 3...
  previousVersion?: ObjectId            // Reference to previous version

  // Permissions
  uploadedBy: ObjectId
  isPublic: boolean                     // Visible to client?

  // Metadata
  createdAt: Date
  updatedAt: Date
}
```

### 7. Activity Model (To Build)

**Purpose:** Audit log for all important actions

```typescript
interface Activity {
  _id: ObjectId

  // What happened
  action: string                        // e.g., "project.created", "task.completed"
  description: string                   // Human-readable description

  // Who did it
  user: ObjectId                        // User who performed action

  // What was affected
  entityType: enum ["project", "task", "user", "document", "timeLog"]
  entityId: ObjectId                    // Reference to affected entity
  project?: ObjectId                    // Always link to project if applicable

  // Changes (for updates)
  changes?: {
    field: string
    oldValue: any
    newValue: any
  }[]

  // Metadata
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}
```

### 8. Notification Model (To Build)

**Purpose:** User notifications for important events

```typescript
interface Notification {
  _id: ObjectId

  // Recipient
  user: ObjectId                        // Who receives this notification

  // Content
  type: enum [
    "task_assigned",
    "project_status_changed",
    "comment_mention",
    "deadline_approaching",
    "milestone_completed",
    "document_uploaded",
    "team_member_added"
  ]
  title: string
  message: string

  // Link
  linkType?: enum ["project", "task", "document"]
  linkId?: ObjectId                     // Where clicking should go

  // Status
  isRead: boolean
  readAt?: Date

  // Delivery
  sentViaEmail: boolean
  emailSentAt?: Date

  // Actor (who caused this notification)
  actor?: ObjectId                      // User who triggered it

  // Metadata
  createdAt: Date
}
```

---

## Feature Specifications

### Phase 1: Core Project Management

#### 1.1 Project CRUD Operations

**Features:**
- Create new project with all details
- Edit project information
- Archive/unarchive projects
- Delete projects (with confirmation)
- Duplicate project (template feature)

**Pages:**
- `/projects` - Project list view
- `/projects/new` - Create project form
- `/projects/[id]` - Project detail page
- `/projects/[id]/edit` - Edit project form

**API Routes:**
- `POST /api/projects` - Create project
- `GET /api/projects` - List projects (with filters)
- `GET /api/projects/[id]` - Get single project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `POST /api/projects/[id]/archive` - Archive project
- `POST /api/projects/[id]/duplicate` - Duplicate project

**Permissions:**
- Admin/Manager: Full access
- BD Team: Can create/edit pre-bid projects
- PM: Can edit assigned projects
- User: Read-only access to assigned projects

#### 1.2 Project List & Grid Views

**Views:**
- **Grid View:** Card-based layout with project thumbnails
- **List View:** Table with sortable columns
- **Kanban View:** Drag-and-drop by stage (Stage 1)

**Features:**
- Search by project name, client, code
- Filter by:
  - Stage (lead, pre-bid, in progress, etc.)
  - Status (active, archived)
  - Team member assigned
  - Date range (created, start date, end date)
  - Priority
  - Tags
- Sort by: name, created date, value, priority, deadline
- Bulk actions: Archive, delete, export
- Pagination (20, 50, 100 per page)
- Quick stats at top (total projects, total value, active projects)

#### 1.3 Project Detail Page

**Sections:**
1. **Header:**
   - Project name, code, stage badge
   - Quick actions: Edit, Archive, Delete
   - Status indicators (on track, at risk, delayed)

2. **Overview Tab:**
   - Client information
   - Financial summary (estimated/actual value, budget)
   - Timeline (start/end dates, duration)
   - Progress bar (0-100%)
   - Priority indicator
   - Tags

3. **Team Tab:**
   - List of team members with roles
   - Add/remove team members
   - Contact information
   - Workload indicators

4. **Tasks Tab:**
   - Task list/kanban view
   - Create new tasks
   - Quick task filters

5. **Timeline Tab:**
   - Milestones list
   - Gantt chart (optional)
   - Key dates and deadlines

6. **Files Tab:**
   - Document list
   - Upload new files
   - File categories (contracts, designs, etc.)
   - Version history

7. **Activity Tab:**
   - Activity feed showing all changes
   - Comments and discussions
   - @mention team members

8. **Reports Tab:**
   - Time tracking summary
   - Budget vs actual
   - Task completion metrics
   - Export project report

---

### Phase 2: Task Management

#### 2.1 Task CRUD Operations

**Features:**
- Create tasks within projects
- Edit task details
- Delete tasks
- Assign tasks to team members
- Set due dates and priorities
- Mark tasks complete
- Add task dependencies
- Create subtasks

**API Routes:**
- `POST /api/projects/[id]/tasks` - Create task
- `GET /api/projects/[id]/tasks` - List project tasks
- `GET /api/tasks/[id]` - Get single task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task
- `POST /api/tasks/[id]/complete` - Mark complete
- `GET /api/tasks/my-tasks` - Get current user's tasks

#### 2.2 Task Views

**Kanban Board:**
- Columns: To Do | In Progress | In Review | Blocked | Done
- Drag and drop tasks between columns
- Filter by assignee, priority, due date
- Color coding by priority
- Quick edit on cards

**List View:**
- Sortable table with columns:
  - Task name
  - Assignee
  - Status
  - Priority
  - Due date
  - Estimated/Actual hours
  - Progress %
- Bulk actions: assign, change status, delete

**My Tasks View:**
- Personal task list for logged-in user
- Filter by: today, this week, overdue, all
- Group by: project, priority, due date

#### 2.3 Task Detail Modal/Page

**Content:**
- Task title and description (editable inline)
- Status dropdown
- Priority selector
- Assign to user dropdown
- Due date picker
- Estimated hours input
- Progress slider (0-100%)
- Parent task selector (for subtasks)
- Dependencies list
- Comments section
- Time logs for this task
- Activity history

---

### Phase 3: Time Tracking

#### 3.1 Time Logging

**Features:**
- Log time spent on projects/tasks
- Daily timesheet view
- Weekly timesheet view
- Quick time entry (today's work)
- Bulk time entry
- Edit/delete time logs
- Mark as billable/non-billable
- Add descriptions for time entries

**Pages:**
- `/timesheet` - Timesheet interface
- `/timesheet/daily` - Daily view
- `/timesheet/weekly` - Weekly grid
- `/projects/[id]/time-logs` - Project time logs

**API Routes:**
- `POST /api/time-logs` - Create time log
- `GET /api/time-logs` - List time logs (filtered)
- `PUT /api/time-logs/[id]` - Update time log
- `DELETE /api/time-logs/[id]` - Delete time log
- `GET /api/time-logs/summary` - Time summary statistics

#### 3.2 Timesheet Views

**Daily View:**
- Single day selector
- List of time entries for that day
- Add new entry button
- Total hours for day
- Copy yesterday's entries option

**Weekly View:**
- 7-column grid (Mon-Sun)
- Projects/tasks as rows
- Hours in cells (editable inline)
- Row totals
- Column totals
- Submit for approval option

**Project Time Report:**
- Total hours logged per project
- Breakdown by team member
- Breakdown by task
- Billable vs non-billable hours
- Export to Excel/PDF

#### 3.3 Time Approval (Optional)

**Features:**
- PM/Manager can review time logs
- Approve/reject time entries
- Add approval comments
- Notifications for approval status

---

### Phase 4: Business Development & Pre-Bid

#### 4.1 Opportunity/Lead Tracking

**Features:**
- Create new lead/opportunity
- Track lead source
- Estimate project value and probability
- Set expected decision date
- Assign BD lead
- Track competitor information
- Lead scoring
- Convert lead to pre-bid stage

**Pages:**
- `/opportunities` - Opportunities list
- `/opportunities/new` - Create opportunity
- `/opportunities/[id]` - Opportunity detail

#### 4.2 Bid Management

**Features:**
- Create bid from opportunity
- Track bid status (Draft, Under Review, Submitted, Awaiting Decision)
- Set bid deadline
- Upload bid documents (RFP, proposal, attachments)
- Assign bid team members
- Track bid costs and effort
- Set win probability
- Bid review workflow
- Convert bid to project (when won)
- Mark as lost (with reason)

**Bid Detail Page:**
- Bid information and timeline
- Document repository
- Bid team
- Financial estimates
- Win/loss analysis
- Competitor analysis
- Decision criteria checklist

#### 4.3 Sales Pipeline

**Pipeline Kanban View:**
- Columns: Lead | Qualified | Proposal | Negotiation | Won | Lost
- Drag-drop cards between stages
- Card shows: client name, estimated value, probability, deadline
- Pipeline value calculations per stage
- Weighted pipeline value (value × probability)
- Filter by: BD lead, date range, value range
- Win/loss rate statistics

**Pipeline Reports:**
- Conversion rates per stage
- Average time in each stage
- Win rate by BD lead
- Revenue forecast
- Lost opportunity analysis
- Competitor win/loss analysis

---

### Phase 5: Project Conversion & Handoff

#### 5.1 Bid to Project Conversion

**Features:**
- Convert won bid to active project
- Transfer all information:
  - Client details
  - Team members
  - Documents
  - Financial estimates → actual values
  - Timeline estimates → actual dates
- Assign Project Manager
- Create initial project structure (milestones, tasks)
- Send handoff notification to implementation team
- Archive bid records

**Conversion Workflow:**
1. Mark bid as "Won"
2. Click "Convert to Project"
3. Review/update project details
4. Assign PM and team
5. Set project start date
6. Create initial milestones
7. Confirm conversion
8. Send notifications

#### 5.2 Handoff Process

**Handoff Checklist:**
- [ ] Project charter reviewed
- [ ] Team members assigned
- [ ] Kickoff meeting scheduled
- [ ] Requirements documented
- [ ] Budget approved
- [ ] Risks identified
- [ ] Stakeholders informed
- [ ] Tools/access provisioned

**Handoff Page:**
- BD lead notes for implementation team
- Client expectations and requirements
- Contract terms and deliverables
- Special considerations/risks
- Stakeholder contacts
- Handoff meeting notes

---

### Phase 6: Reporting & Analytics

#### 6.1 Dashboard Analytics

**Dashboard Widgets:**
1. **Project Overview:**
   - Total active projects
   - Projects by stage (donut chart)
   - Projects by status (bar chart)
   - At-risk projects count

2. **Financial Summary:**
   - Total pipeline value
   - Weighted pipeline value
   - Actual project revenue (won projects)
   - Budget utilization
   - Revenue trend (line chart)

3. **Team Performance:**
   - Team utilization %
   - Top performers by hours logged
   - Task completion rate
   - Overdue tasks count

4. **Time Tracking:**
   - Hours logged this week/month
   - Billable vs non-billable hours
   - Time by project (pie chart)
   - Daily time entry compliance

5. **Bid Performance:**
   - Win rate %
   - Bid conversion funnel
   - Average time to close
   - Top performing BD leads

#### 6.2 Project Reports

**Available Reports:**
1. **Project Status Report:**
   - All projects with current status
   - Progress percentages
   - Key milestones
   - At-risk indicators
   - Export to PDF

2. **Financial Report:**
   - Project value vs budget
   - Actual spend tracking
   - Profitability analysis
   - Cost breakdown by category
   - Revenue recognition

3. **Time Report:**
   - Hours logged per project
   - Hours by team member
   - Billable hours summary
   - Time variance (estimated vs actual)
   - Timesheet compliance

4. **Team Performance Report:**
   - Task completion metrics
   - Individual productivity
   - Workload distribution
   - Utilization rates
   - Training hours

5. **Pipeline Report:**
   - Sales pipeline value by stage
   - Conversion rates
   - Win/loss analysis
   - Forecast revenue
   - Quarter-over-quarter trends

**Report Features:**
- Date range selector
- Filter by: project, team member, department
- Export formats: PDF, Excel, CSV
- Schedule automated reports (daily/weekly/monthly emails)
- Save report templates

#### 6.3 Custom Dashboards

**Features:**
- Create custom dashboard layouts
- Choose from widget library
- Drag-and-drop widgets
- Save dashboard views
- Share dashboards with team
- Set as default dashboard

---

### Phase 7: Notifications & Alerts

#### 7.1 Real-Time Notifications

**Notification Types:**
1. **Task Notifications:**
   - Task assigned to you
   - Task due tomorrow/overdue
   - Task status changed
   - Task comment/mention
   - Task completed

2. **Project Notifications:**
   - Added to project team
   - Project status changed
   - Milestone approaching
   - Milestone completed
   - Project at risk
   - Budget threshold reached

3. **Time Tracking:**
   - Timesheet pending approval
   - Timesheet approved/rejected
   - Missing timesheet reminder

4. **Team Notifications:**
   - New team member joined
   - Team member role changed
   - @mentions in comments

5. **Bid Notifications:**
   - Bid deadline approaching
   - Bid status changed
   - Bid won/lost

**Notification Center:**
- Bell icon in header with badge count
- Dropdown panel with recent notifications
- Mark as read/unread
- Mark all as read
- Group by: today, yesterday, older
- Click notification to go to relevant page

#### 7.2 Email Notifications

**Email Types:**
- Instant emails for critical events
- Daily digest (summary of notifications)
- Weekly summary report
- Custom alert emails (budget threshold, deadline missed)

**Email Preferences:**
- Enable/disable per notification type
- Choose instant vs digest
- Set digest delivery time
- Unsubscribe from specific types

---

### Phase 8: Document Management

#### 8.1 File Upload & Storage

**Features:**
- Upload files to projects
- Drag-and-drop upload
- Multiple file upload
- File size limits (configurable)
- Allowed file types (configurable)
- File preview (images, PDFs)
- Download files
- Delete files (with permissions)

**Storage Options:**
- Local filesystem storage
- AWS S3 (future)
- Azure Blob Storage (future)

#### 8.2 Document Organization

**Features:**
- Categorize documents:
  - Contracts
  - Proposals
  - Requirements
  - Designs
  - Deliverables
  - Invoices
  - Other
- Add tags to documents
- Create folders/subfolders
- Move documents between folders
- Search documents by name, tags, category
- Filter by: category, uploaded by, date range

#### 8.3 Version Control

**Features:**
- Upload new version of existing file
- View version history
- Download specific version
- Compare versions (text files)
- Restore previous version
- Version comments

#### 8.4 Document Permissions

**Features:**
- Set document visibility:
  - Team only (default)
  - Client visible (for client portal)
  - Specific users only
- Track who downloaded each file
- Download audit log

---

### Phase 9: Advanced Features

#### 9.1 Client Portal (Optional)

**Features:**
- Separate login for clients
- Read-only view of assigned projects
- View project progress and milestones
- View deliverables and documents (marked as client-visible)
- Submit feedback/requests
- View invoices and payment status
- Communication with PM

**Client Portal Pages:**
- `/client-portal/login` - Client login
- `/client-portal/dashboard` - Client dashboard
- `/client-portal/projects` - Client's projects
- `/client-portal/projects/[id]` - Project detail

#### 9.2 Resource Management

**Features:**
- View team member workload
- Calendar view of assignments
- Resource availability
- Capacity planning
- Prevent over-allocation
- Skill matrix for team members
- Resource utilization reports

#### 9.3 Risk & Issue Management

**Features:**
- Log project risks
- Risk severity levels (low, medium, high, critical)
- Risk probability
- Mitigation plans
- Assign risk owners
- Track risk status
- Issue tracker integrated with tasks
- Escalation workflows

#### 9.4 Gantt Chart

**Features:**
- Visual timeline of project tasks
- Task dependencies (finish-to-start, etc.)
- Critical path highlighting
- Baseline vs actual timeline
- Zoom in/out timeline
- Export Gantt chart as image/PDF

#### 9.5 Budget Tracking

**Features:**
- Define budget categories (labor, materials, overhead)
- Track actual expenses
- Compare budget vs actual
- Budget alerts (80%, 90%, 100% thresholds)
- Forecast budget completion
- Purchase order tracking

---

## Implementation Phases

### Phase 1: Core Project Management (Priority 1)
**Estimated Effort:** 2-3 weeks

**Tasks:**
1. Create Project model with Mongoose schema
2. Build Project CRUD API routes
3. Create Project list page (grid + list views)
4. Build Create Project form with validation
5. Build Project detail page
6. Implement Edit Project functionality
7. Add Archive/Delete project features
8. Implement basic search and filters
9. Add project to sidebar navigation

**Deliverables:**
- Fully functional project creation and management
- Project list with search/filter
- Project detail page with basic info
- API routes tested and working

---

### Phase 2: Task Management (Priority 2)
**Estimated Effort:** 2 weeks

**Tasks:**
1. Create Task model with relationships
2. Build Task CRUD API routes
3. Create Task list within project page
4. Build Create Task form/modal
5. Implement Task assignment to users
6. Build Kanban board view for tasks
7. Create My Tasks page for users
8. Implement task status updates
9. Add task filters and search

**Deliverables:**
- Task creation within projects
- Task assignment and status management
- Kanban board view
- Personal task list page

---

### Phase 3: Time Tracking (Priority 3)
**Estimated Effort:** 1-2 weeks

**Tasks:**
1. Create TimeLog model
2. Build TimeLog CRUD API routes
3. Create Timesheet page (daily view)
4. Build time entry form
5. Implement weekly timesheet grid
6. Add time log summary calculations
7. Build project time reports
8. Add time logs to Task detail view
9. Implement billable/non-billable tracking

**Deliverables:**
- Time logging interface
- Daily/weekly timesheet views
- Time reports per project
- Billable hours tracking

---

### Phase 4: Business Development & Pre-Bid (Priority 4)
**Estimated Effort:** 2 weeks

**Tasks:**
1. Extend Project model for pre-bid fields
2. Create Opportunity/Lead tracking
3. Build Sales Pipeline kanban view
4. Implement bid management features
5. Add bid document upload
6. Create BD dashboard
7. Implement win probability tracking
8. Build competitor tracking
9. Add pipeline value calculations

**Deliverables:**
- Opportunity tracking system
- Sales pipeline kanban
- Bid management features
- BD-specific dashboard

---

### Phase 5: Project Conversion & Handoff (Priority 5)
**Estimated Effort:** 1 week

**Tasks:**
1. Build bid-to-project conversion workflow
2. Create handoff checklist
3. Implement data transfer logic
4. Add PM assignment on conversion
5. Build handoff page/modal
6. Create handoff notifications
7. Add conversion audit logs

**Deliverables:**
- Bid to project conversion feature
- Handoff workflow and checklist
- Automated team notifications

---

### Phase 6: Reporting & Analytics (Priority 6)
**Estimated Effort:** 2-3 weeks

**Tasks:**
1. Update dashboard with real data and charts
2. Build project status report
3. Create financial report
4. Implement time report
5. Build team performance report
6. Add pipeline report
7. Implement report export (PDF, Excel)
8. Create custom dashboard builder
9. Add chart library integration (Chart.js or Recharts)
10. Build report scheduling feature

**Deliverables:**
- Interactive dashboard with real metrics
- Multiple report types with exports
- Scheduled report emails

---

### Phase 7: Notifications & Alerts (Priority 7)
**Estimated Effort:** 1-2 weeks

**Tasks:**
1. Create Notification model
2. Build notification API routes
3. Create notification center UI
4. Implement real-time notifications (polling or WebSocket)
5. Build email notification system
6. Add notification preferences page
7. Implement @mention functionality
8. Create daily/weekly digest emails

**Deliverables:**
- Notification center with badge
- Email notifications for key events
- User notification preferences
- @mention support in comments

---

### Phase 8: Document Management (Priority 8)
**Estimated Effort:** 1-2 weeks

**Tasks:**
1. Create Document model
2. Set up file storage system
3. Build file upload API
4. Create document list UI in project page
5. Implement file download
6. Add document categories and tags
7. Build version control system
8. Implement document search
9. Add file preview for common types

**Deliverables:**
- File upload and storage
- Document organization with categories
- Version control for files
- Document search and filtering

---

### Phase 9: Advanced Features (Priority 9)
**Estimated Effort:** 4-6 weeks

**Tasks:**
1. Build Milestone model and UI
2. Create Activity/Audit log system
3. Implement Comment model and UI
4. Build resource management features
5. Create Gantt chart view
6. Implement risk & issue tracking
7. Build client portal (if required)
8. Add budget tracking features
9. Implement advanced permissions
10. Add two-factor authentication (optional)

**Deliverables:**
- Milestones and deliverables
- Complete audit trail
- Comment system with @mentions
- Gantt chart view
- Client portal (optional)

---

## Technical Architecture

### Backend Architecture

**API Routes Structure:**
```
/api
├── /auth
│   ├── login, logout, signup
│   ├── verify-otp
│   ├── change-password
│   ├── forgot-password
│   ├── reset-password
│   └── me
├── /team
│   ├── list
│   ├── invite
│   ├── update
│   └── delete
├── /projects
│   ├── GET / POST /               (list/create)
│   ├── GET / PUT / DELETE /[id]   (read/update/delete)
│   ├── POST /[id]/archive
│   ├── POST /[id]/duplicate
│   ├── GET /[id]/tasks
│   ├── GET /[id]/time-logs
│   ├── GET /[id]/documents
│   ├── GET /[id]/activity
│   └── GET /[id]/comments
├── /tasks
│   ├── GET / POST /               (list/create)
│   ├── GET / PUT / DELETE /[id]
│   ├── POST /[id]/complete
│   ├── GET /my-tasks
│   └── POST /[id]/comments
├── /time-logs
│   ├── GET / POST /               (list/create)
│   ├── GET / PUT / DELETE /[id]
│   └── GET /summary
├── /milestones
│   ├── GET / POST /               (list/create)
│   └── GET / PUT / DELETE /[id]
├── /documents
│   ├── POST /upload
│   ├── GET /[id]
│   ├── GET /[id]/download
│   ├── DELETE /[id]
│   └── POST /[id]/version
├── /comments
│   ├── GET / POST /               (list/create)
│   ├── PUT / DELETE /[id]
├── /notifications
│   ├── GET /                      (list for current user)
│   ├── PUT /[id]/read
│   └── POST /mark-all-read
├── /reports
│   ├── GET /dashboard
│   ├── GET /projects
│   ├── GET /time
│   ├── GET /financial
│   └── POST /export
└── /activity
    └── GET /                      (list with filters)
```

### Frontend Architecture

**Page Structure:**
```
/app
├── (auth)
│   ├── login
│   ├── signup
│   ├── forgot-password
│   └── reset-password
├── (dashboard)
│   ├── dashboard/                 (main dashboard)
│   ├── projects/
│   │   ├── page.tsx              (project list)
│   │   ├── new/                   (create project)
│   │   ├── [id]/
│   │   │   ├── page.tsx          (project detail)
│   │   │   ├── edit/             (edit project)
│   │   │   ├── tasks/            (task management)
│   │   │   ├── timeline/         (milestones/gantt)
│   │   │   ├── files/            (documents)
│   │   │   └── activity/         (activity feed)
│   ├── opportunities/
│   │   ├── page.tsx              (opportunity list)
│   │   └── [id]/                 (opportunity detail)
│   ├── pipeline/                  (sales pipeline kanban)
│   ├── tasks/
│   │   ├── page.tsx              (all tasks)
│   │   └── my-tasks/             (personal tasks)
│   ├── timesheet/
│   │   ├── page.tsx              (timesheet)
│   │   ├── daily/
│   │   └── weekly/
│   ├── reports/
│   │   ├── page.tsx              (report list)
│   │   ├── projects/
│   │   ├── financial/
│   │   ├── time/
│   │   └── team/
│   ├── team/                      (existing team management)
│   └── settings/                  (existing settings)
└── api/                           (API routes as above)
```

### Component Library

**Reusable Components:**
- `<ProjectCard>` - Project display card
- `<TaskCard>` - Task display card
- `<KanbanBoard>` - Drag-and-drop kanban
- `<TimeEntryForm>` - Time logging form
- `<FileUpload>` - File upload component
- `<CommentThread>` - Comments with replies
- `<ActivityFeed>` - Activity timeline
- `<UserAvatar>` - User avatar with initials
- `<StatusBadge>` - Status display badge
- `<PriorityIndicator>` - Priority display
- `<ProgressBar>` - Progress visualization
- `<DateRangePicker>` - Date range selection
- `<ChartWidget>` - Reusable chart component
- `<DataTable>` - Sortable/filterable table
- `<ConfirmDialog>` - Confirmation modal
- `<FilterPanel>` - Advanced filters

---

## User Roles & Permissions

### Extended Role Definitions

| Role | Permissions |
|------|-------------|
| **Admin** | • Full system access<br>• Manage all users and teams<br>• Create/edit/delete all projects at any stage<br>• View all reports<br>• Configure system settings<br>• Assign any role |
| **Business Development** | • Create and manage opportunities/leads<br>• Create pre-bid projects<br>• Manage bids and pipeline<br>• View BD reports<br>• Convert bids to projects<br>• Assign project managers |
| **Project Manager** | • Manage assigned projects (implementation stage)<br>• Create and assign tasks<br>• Manage project team<br>• Approve time logs<br>• Upload/manage project documents<br>• View project reports<br>• Update project status |
| **Manager** | • View all projects<br>• Manage team members (non-admin)<br>• View all reports<br>• Approve time logs<br>• Can be assigned as PM |
| **Team Member / User** | • View assigned projects<br>• View and complete assigned tasks<br>• Log time on assigned projects/tasks<br>• Comment on projects/tasks<br>• Upload documents to assigned projects<br>• View own reports |
| **Client** (Optional) | • Read-only access to assigned projects<br>• View milestones and progress<br>• View client-visible documents<br>• Submit feedback<br>• View invoices |

### Permission Matrix

| Action | Admin | BD | PM | Manager | User | Client |
|--------|-------|----|----|---------|------|--------|
| Create Opportunity | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| Manage Bids | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| Convert Bid to Project | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| Create Project (Implementation) | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ |
| Edit Any Project | ✓ | ✗ | Assigned Only | ✓ | ✗ | ✗ |
| Archive/Delete Project | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| Create Tasks | ✓ | ✗ | ✓ | ✓ | Assigned Project | ✗ |
| Assign Tasks | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ |
| Complete Tasks | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ |
| Log Time | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ |
| Approve Time Logs | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ |
| Upload Documents | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| View All Projects | ✓ | BD Stage Only | Assigned Only | ✓ | Assigned Only | Assigned Only |
| View All Reports | ✓ | BD Reports | Project Reports | ✓ | Own Reports | ✗ |
| Manage Team | ✓ | ✗ | Project Team | ✓ | ✗ | ✗ |
| System Settings | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |

---

## Quick Reference: Project Lifecycle States

| Stage | Description | Who Manages | Key Actions |
|-------|-------------|-------------|-------------|
| **Lead** | Initial opportunity identified | BD Team | Qualify lead, gather info |
| **Pre-Bid** | Preparing proposal | BD Team | Create proposal, estimate value |
| **Bid Submitted** | Proposal sent to client | BD Team | Track response, follow up |
| **Negotiation** | Discussing terms | BD Team | Negotiate contract |
| **Won** | Client accepted proposal | BD Team → PM | Convert to project, handoff |
| **In Progress** | Active implementation | PM + Team | Execute tasks, track progress |
| **On Hold** | Temporarily paused | PM | Document reason, maintain |
| **Completed** | Successfully delivered | PM | Close project, gather feedback |
| **Lost** | Bid not accepted | BD Team | Document reason, lessons learned |
| **Cancelled** | Project terminated | PM/Admin | Document reason, final report |

---

## Development Guidelines

### Code Standards
- Use TypeScript for all files
- Follow existing naming conventions
- Use shadcn/ui components where possible
- Implement proper error handling
- Add loading states for async operations
- Use React Hook Form + Zod for forms
- Follow existing authentication patterns

### Database Conventions
- Use Mongoose schemas with TypeScript interfaces
- Add indexes for frequently queried fields
- Use references (ObjectId) for relationships
- Add timestamps (createdAt, updatedAt) to all models
- Implement soft deletes where appropriate (isDeleted flag)

### API Conventions
- Use RESTful naming
- Return consistent error formats
- Include proper HTTP status codes
- Implement middleware for auth/permissions
- Validate all inputs with Zod
- Return meaningful error messages

### UI/UX Standards
- Mobile-first responsive design
- Use Tailwind CSS for styling
- Implement loading skeletons
- Show toast notifications for actions
- Use confirmation dialogs for destructive actions
- Implement optimistic UI updates where appropriate
- Add empty states for lists
- Include helpful error messages

---

## Notes & Considerations

### File Storage
- Current: Store files in `/public/uploads` or similar
- Future: Migrate to AWS S3 or Azure Blob Storage for scalability
- Implement file size limits per project
- Consider compression for images

### Performance
- Implement pagination for all list views
- Add database indexes for search fields
- Consider caching for reports
- Optimize image loading (lazy loading)
- Use React.memo for expensive components

### Security
- Validate all user inputs
- Implement CSRF protection
- Rate limit API endpoints
- Sanitize file uploads
- Implement proper CORS policies
- Regular security audits

### Future Enhancements
- Mobile app (React Native)
- Integrations (Slack, Jira, GitHub)
- API webhooks
- Custom fields for projects
- Project templates
- Recurring tasks
- Calendar integration
- Advanced analytics with AI insights
- Multi-language support
- Multi-currency support
- White-label capabilities

---

## Conclusion

This roadmap provides a comprehensive guide for building a complete project lifecycle tracking tool. The phased approach ensures steady progress while maintaining code quality and user experience.

**Next Steps:**
1. Review and approve this roadmap
2. Set up development environment
3. Begin Phase 1: Core Project Management
4. Iterate based on user feedback

**Document Version:** 1.0
**Last Updated:** 2025-12-03
**Maintained By:** Development Team
