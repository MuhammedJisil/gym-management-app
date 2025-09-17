# Gym Management System

A modern, responsive web application for managing gym memberships with automated WhatsApp notifications and comprehensive member tracking.

## Features

### Core Functionality
- **Member Management**: Complete CRUD operations for gym members
- **Dashboard Analytics**: Real-time statistics and membership insights
- **Payment Tracking**: Automatic status updates based on membership expiry
- **WhatsApp Integration**: Automated reminders for payments and expiring memberships
- **Photo Management**: Member profile pictures with file upload support
- **Smart Filtering**: Search and filter members by status, name, or contact info

### Key Highlights
- **Auto-calculated Membership Dates**: End dates automatically computed based on membership type
- **Payment Status Automation**: Status updates based on membership validity
- **Expiring Member Alerts**: Proactive notifications for members nearing expiry
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modular Architecture**: Well-organized, maintainable codebase

## Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Beautiful, customizable icons
- **Axios**: HTTP client for API communications
- **Vite**: Fast build tool and development server

### Backend Requirements
- RESTful API server (Node.js/Express recommended)
- Database (MySQL/PostgreSQL/MongoDB)
- File upload handling for member photos

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx                 # App header component
│   │   └── Navigation.jsx             # Navigation tabs
│   ├── dashboard/
│   │   ├── Dashboard.jsx              # Main dashboard container
│   │   ├── StatsCards.jsx             # Statistics display cards
│   │   └── ExpiringMembersAlert.jsx   # Expiring members notification
│   ├── members/
│   │   ├── MembersList.jsx            # Members page container
│   │   ├── MemberForm.jsx             # Add/Edit member form
│   │   ├── MemberModal.jsx            # Member detail view modal
│   │   ├── MembersTable.jsx           # Members data table
│   │   └── SearchAndFilter.jsx        # Search and filter controls
│   └── ui/
│       ├── LoadingSpinner.jsx         # Loading indicator component
│       └── ErrorMessage.jsx           # Error display component
├── hooks/
│   ├── useMembers.js                  # Member CRUD operations hook
│   ├── useStats.js                    # Dashboard statistics hook
│   └── useWhatsApp.js                 # WhatsApp messaging hook
├── services/
│   ├── api.js                         # Axios configuration and interceptors
│   └── memberService.js               # Member API service functions
├── utils/
│   ├── dateUtils.js                   # Date formatting and calculations
│   ├── constants.js                   # App constants and configurations
│   └── helpers.js                     # General utility functions
├── App.jsx                            # Main application component
└── main.jsx                           # Application entry point
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API server running

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gym-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## API Endpoints

Your backend server should implement these endpoints:

### Members
- `GET /api/members` - Get all members (with optional search/filter params)
- `GET /api/members/:id` - Get single member
- `POST /api/members` - Create new member (multipart/form-data for photos)
- `PUT /api/members/:id` - Update member (multipart/form-data for photos)
- `DELETE /api/members/:id` - Delete member

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/expiring` - Get members expiring soon

### Expected API Response Format

**Members List:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210",
      "membershipType": "monthly",
      "startDate": "2024-01-01",
      "endDate": "2024-02-01",
      "paymentStatus": "paid",
      "photo": "http://example.com/photos/john.jpg"
    }
  ]
}
```

**Dashboard Stats:**
```json
{
  "totalMembers": 150,
  "activeMembers": 120,
  "unpaidMembers": 30,
  "expiringMembers": 15
}
```

## Configuration

### Membership Types
The system supports three membership types:
- **Monthly**: 1 month duration
- **Quarterly**: 3 months duration  
- **Yearly**: 12 months duration

### WhatsApp Integration
- Automatically formats phone numbers (assumes Indian +91 if no country code)
- Generates pre-filled WhatsApp messages
- Opens WhatsApp web/app for sending

### Payment Status Logic
- **Paid**: Membership end date is today or in the future
- **Unpaid**: Membership end date has passed

## Usage

### Adding Members
1. Click "Add Member" button
2. Fill in member details
3. Select membership type (end date auto-calculates)
4. Upload optional profile photo
5. Payment status automatically determined

### Managing Memberships
- View all members in the table
- Use search to find specific members
- Filter by payment status
- Click member row to view details

### Dashboard Features
- Click stat cards to navigate to filtered member lists
- View expiring members alerts
- Send WhatsApp reminders directly

### WhatsApp Notifications
- **Payment Reminders**: For unpaid members
- **Expiry Alerts**: For memberships expiring within 30 days
- Messages open in WhatsApp with pre-filled text

## Development

### Code Style
- ESLint configuration for code quality
- Prettier for consistent formatting
- Modular component architecture
- Custom hooks for business logic

### Key Design Patterns
- **Custom Hooks**: Separate business logic from UI components
- **Service Layer**: Centralized API communication
- **Utility Functions**: Reusable helper functions
- **Component Composition**: Small, focused components

### Adding New Features
1. Create new components in appropriate folders
2. Add custom hooks for complex state management
3. Update constants and utils as needed
4. Follow existing patterns for consistency

## Production Build

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review the API requirements

## Roadmap

### Planned Features
- Member check-in/check-out system
- Payment history tracking
- Membership plan management
- Trainer assignment system
- Equipment tracking
- Member attendance analytics

### Technical Improvements
- Unit test coverage
- E2E testing with Cypress
- Progressive Web App (PWA) features
- Offline functionality
- Advanced reporting dashboard
