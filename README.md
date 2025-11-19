# Admin Portal - Document Verification System

A professional Angular 17 application for managing document verification requests. Built with a clean, minimal design using NgModules (non-standalone components).

## Features

- ✅ **Authentication**: Secure login system with route guards
- ✅ **User Management**: View list of users waiting for document verification
- ✅ **Search & Filter**: Search by name, email, or phone; filter by document type
- ✅ **Sorting**: Sort users by name, date, or document type
- ✅ **Document Viewer**: View uploaded documents (marksheets/images)
- ✅ **Verification Actions**: Approve or reject verification requests
- ✅ **Remarks**: Add remarks before approving or rejecting
- ✅ **Toast Notifications**: Success/error notifications for all actions
- ✅ **Responsive Design**: Clean, minimal, and professional UI

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Navigate to the project directory:
```bash
cd admin-portal
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Login Credentials

**Username:** `admin`  
**Password:** `admin123`

## Project Structure

```
src/app/
├── components/
│   ├── login/              # Login component
│   ├── dashboard/          # Main dashboard
│   ├── user-list/          # User list with search/filter/sort
│   ├── user-detail/        # User verification details
│   ├── document-viewer/    # Document display component
│   └── toast/              # Toast notification component
├── services/
│   ├── auth.service.ts     # Authentication service
│   ├── user.service.ts    # User data service
│   └── toast.service.ts    # Toast notification service
├── models/
│   └── user.model.ts       # User and verification models
├── guards/
│   └── auth.guard.ts       # Route guard for authentication
└── app.module.ts           # Root module
```

## Technology Stack

- **Angular 17** (NgModules, non-standalone)
- **TypeScript**
- **RxJS**
- **Angular Forms** (Reactive & Template-driven)
- **Angular Router**

## Features in Detail

### Authentication
- Login page with form validation
- Route guards to protect authenticated routes
- Session management with localStorage

### Dashboard
- Displays all pending verification requests
- Real-time search functionality
- Filter by document type (marksheet/image)
- Sort by name, submission date, or document type
- Click to view user details

### User Verification
- View complete user information
- Display uploaded documents
- Add remarks before decision
- Approve or reject requests
- Validation: Remarks required for rejection

### Notifications
- Toast notifications for all actions
- Success, error, info, and warning types
- Auto-dismiss with configurable duration

## Development

### Code Style
- Follows Angular style guide
- Uses TypeScript strict mode
- Component-based architecture

### Mock Data
The application uses mock data for demonstration. In production, replace the mock services with actual API calls.

## License

This project is for demonstration purposes.
