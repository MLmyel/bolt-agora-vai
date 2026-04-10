# Data Catalog Pro - Project Structure

## Overview
This is an Automated Data Catalog application with three main pages:

### Page 1: Data Catalog (Home `/`)
- Browse and search through cataloged SQL queries and tables
- Filter by type (Table, View, Query), tags, and database
- View detailed information about each entry
- Manager role: Can delete entries

### Page 2: New Query (`/nova-consulta`)
- SQL code input interface
- Drag-and-drop file upload (.sql, .txt)
- Metadata fields: query name, owner, tags
- Tag autocomplete system

### Page 3: AI Assistant (`/chat`)
- ChatGPT-style interface (visual mockup)
- Pre-programmed conversation history
- Mock responses to simulate AI functionality

## Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter (lightweight router)
- **Styling**: Tailwind CSS v3
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React Query, Context API

## Key Features
- **Role Toggle**: Switch between User (read-only) and Manager (with delete permissions)
- **Collapsible Sidebar**: Oracle-branded dark sidebar with navigation
- **Mock Data**: 12 pre-populated catalog entries with realistic data
- **Responsive Design**: Works on all screen sizes
- **Oracle Branding**: Oracle Red (#C74634) as primary color

## File Structure
```
src/
├── App.tsx                 # Main app with routing
├── main.tsx               # Entry point
├── index.css              # Global styles & CSS variables
├── components/
│   ├── Layout.tsx         # Sidebar + Header layout
│   ├── DeleteModal.tsx    # Confirmation modal
│   └── ui/                # Reusable UI components
├── pages/
│   ├── CatalogPage.tsx    # Main catalog listing
│   ├── NewQueryPage.tsx   # SQL input form
│   ├── ChatPage.tsx       # AI assistant chat
│   └── TableDetailPage.tsx# Individual entry details
├── lib/
│   ├── mockData.ts        # Sample catalog data
│   ├── roleContext.tsx    # User/Manager role state
│   └── utils.ts           # Utility functions
└── hooks/
    └── use-toast.ts       # Toast notifications

## Data Model
See `src/lib/mockData.ts` for the complete structure:
- **CatalogEntry**: Main data model with fields, owner info, tags
- **12 Mock Entries**: Tables, views, and queries across different domains
- **All Tags**: Pre-defined tag collection for autocomplete

## Design Notes
- Oracle color palette with warm neutrals
- Dark sidebar (near-black) with Oracle branding
- Clean, professional interface suitable for enterprise use
- Consistent 8px spacing system
- Focus on data discoverability and searchability
