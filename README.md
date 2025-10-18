# TalentFlow# React + Vite



A comprehensive mini hiring platform built with React, TypeScript, and Vite. TalentFlow provides a complete frontend-only solution for managing recruitment workflows including jobs, candidates, and assessments.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## 🚀 FeaturesCurrently, two official plugins are available:



### 1. **Jobs Management**- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- ✅ **Paginated job listings** with search and filters- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- ✅ **Create/Edit modal** with form validation

- ✅ **Unique slug generation** from job titles## React Compiler

- ✅ **Archive/Unarchive** functionality

- ✅ **Drag-and-drop reordering** with optimistic updates and rollback on errorThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- ✅ **Job detail pages** with dedicated routes (`/jobs/:jobId`)

- ✅ **Tag management** for job categorization## Expanding the ESLint configuration



### 2. **Candidates Management**If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

- ✅ **Virtualized list** handling 1000+ candidates efficiently
- ✅ **Search by name/email** with stage filtering
- ✅ **Dual view modes**: List view & Kanban board
- ✅ **Kanban board** with drag-and-drop stage progression
- ✅ **Candidate profile pages** (`/candidates/:id`)
- ✅ **Timeline view** showing complete stage change history
- ✅ **Notes system** with `@mentions` support for referencing other candidates
- ✅ **Real-time stage updates** reflected across all views

### 3. **Assessments Builder**
- ✅ **Visual assessment builder** with sections and questions
- ✅ **Multiple question types**:
  - Single choice (radio buttons)
  - Multiple choice (checkboxes)
  - Short text
  - Long text (textarea)
  - Numeric input
  - File upload (stub)
- ✅ **Form validation**:
  - Required fields
  - Min/max length for text
  - Min/max values for numbers
  - Pattern matching
- ✅ **Conditional question logic**: Show questions based on previous answers
- ✅ **Live preview mode** to test assessments before publishing
- ✅ **Per-job assessments** linked to specific positions

## 🛠️ Technical Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router v7
- **State Management**: React Hooks (useState, useEffect)
- **API Mocking**: MSW (Mock Service Worker) v2
- **Local Storage**: IndexedDB via Dexie.js
- **Drag & Drop**: React DnD with HTML5 Backend
- **Virtualization**: @tanstack/react-virtual
- **Date Handling**: date-fns
- **Styling**: Custom CSS with modern design system

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button/
│   ├── Input/
│   ├── Modal/
│   └── Layout/
├── db/                  # Dexie database setup and seeding
├── lib/                 # Utilities (API client)
├── mocks/              # MSW handlers for API simulation
│   ├── handlers/
│   │   ├── jobs.ts
│   │   ├── candidates.ts
│   │   └── assessments.ts
│   └── browser.ts
├── pages/              # Feature pages
│   ├── Jobs/
│   ├── Candidates/
│   └── Assessments/
├── types/              # TypeScript type definitions
├── App.tsx             # Main app component with routing
└── main.tsx            # Entry point with MSW initialization
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 💾 Data Persistence

All data is stored locally using **IndexedDB** via Dexie.js:

- **Jobs**: Title, slug, description, tags, status, order
- **Candidates**: Personal info, job application, current stage
- **Stage Changes**: Complete timeline of candidate progression
- **Notes**: Comments with @mentions functionality
- **Assessments**: Builder configuration and question structure
- **Assessment Responses**: Candidate answers to assessments

The database is automatically seeded with:
- 5 sample jobs
- 1200+ candidates with realistic data
- 2 pre-built assessments
- Stage change history for candidates

## 🎨 Key Features Explained

### Drag-and-Drop Reordering (Jobs)
- Uses React DnD for smooth drag operations
- **Optimistic updates**: UI updates immediately
- **Automatic rollback**: Reverts on server error
- Persistent order saved via MSW/Dexie

### Virtualized Candidate List
- Renders only visible rows for performance
- Handles 1000+ candidates smoothly
- Uses @tanstack/react-virtual for efficient scrolling

### Conditional Assessment Questions
- Questions can depend on previous answers
- Supports `equals`, `not-equals`, and `contains` operators
- Live preview shows/hides questions dynamically

### @Mentions in Notes
- Use `@c-{id}` syntax to mention candidates
- Extracted and stored separately
- Can be used for notifications/references

## 🔧 API Simulation

MSW intercepts all `/api/*` requests and serves data from IndexedDB:

**Available Endpoints:**
```
GET    /api/jobs
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id
POST   /api/jobs/reorder
POST   /api/jobs/:id/archive
POST   /api/jobs/:id/unarchive

GET    /api/candidates
POST   /api/candidates
PUT    /api/candidates/:id
PATCH  /api/candidates/:id/stage
GET    /api/candidates/:id/timeline
GET    /api/candidates/:id/notes
POST   /api/candidates/:id/notes

GET    /api/assessments
POST   /api/assessments
PUT    /api/assessments/:id
DELETE /api/assessments/:id
GET    /api/assessments/:id/responses
POST   /api/assessments/:id/responses
```

## 🎯 Future Enhancements

- [ ] Real backend integration
- [ ] User authentication & authorization
- [ ] Email notifications for stage changes
- [ ] Advanced analytics dashboard
- [ ] Calendar integration for interviews
- [ ] Resume parsing
- [ ] Bulk candidate operations
- [ ] Export to CSV/PDF
- [ ] Mobile responsive improvements
- [ ] Dark mode support

## 📄 License

MIT

## 👨‍💻 Development

This project was built as a demonstration of modern React development practices including:
- TypeScript for type safety
- Component-based architecture
- Clean separation of concerns
- Optimistic UI updates
- Error handling and rollback
- Performance optimization
- Accessible UI components

---

**Built with ❤️ using React + TypeScript + Vite**
