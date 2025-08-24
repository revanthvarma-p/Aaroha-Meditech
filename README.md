# Thyroid Microwave Ablation Survey Dashboard

**Aaroha Meditech PVT LTD** - A sophisticated Next.js 15 web application for collecting and visualizing thyroid microwave ablation therapy survey responses with an advanced analytics dashboard.

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## Features

###  Survey Collection
- **Comprehensive Survey Form**: Multi-step form for collecting detailed doctor responses
- **Real-time Validation**: Form validation with immediate feedback
- **Professional UI**: Modern, responsive design with beautiful gradient backgrounds
- **Error Handling**: Robust error boundaries for seamless user experience

###  Advanced Analytics Dashboard
- **Interactive Charts**: Beautiful data visualizations powered by Recharts
- **Dual View Modes**: Switch between Analytics Dashboard and Response Table
- **Professional Styling**: Dark theme with cyan accents (#7ee9fa) and gradient backgrounds
- **Real-time Data**: Live updates from MongoDB Atlas

###  Data Management
- **Selective Export**: Checkbox selection for downloading specific doctor responses as CSV
- **Doctor Filtering**: Easy selection of individual or multiple doctors
- **Comprehensive Table View**: Detailed response data with professional styling
- **Secure Storage**: MongoDB Atlas integration with proper data validation

###  UI/UX Excellence
- **Beautiful Gradients**: Pink-to-purple-to-indigo gradient backgrounds
- **Professional Dark Theme**: Consistent dark theme with #181c2a background
- **Tab Navigation**: Enhanced tab system with visual indicators
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Company Branding**: Aaroha Meditech PVT LTD branding throughout

##  Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **pnpm** (recommended) or npm/yarn
- **MongoDB Atlas** account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/adityak-k/Thyroid-Survey.git
   cd Thyroid-Survey
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment Setup:**
   - Create `.env.local` in the root directory
   - Add your MongoDB connection string:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. **Access the application:**
   - **Survey Form**: `http://localhost:3001`
   - **Admin Dashboard**: `http://localhost:3001/admin/responses`

## Technology Stack

### Frontend
- **Next.js 15.2.4** - React framework with App Router
- **React 19** - User interface library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful component library
- **Recharts** - Data visualization library

### Backend & Database
- **MongoDB Atlas** - Cloud database solution
- **Next.js API Routes** - Serverless backend functions
- **Zod** - TypeScript schema validation

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **pnpm** - Package manager

##  Project Structure

```
thyroid-survey/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Main survey form (954 lines)
│   ├── admin/responses/          # Admin dashboard
│   │   └── page.tsx             # Enhanced admin interface
│   └── api/                     # API routes
│       ├── submit-survey/       # Survey submission endpoint
│       └── admin/responses/     # Data fetching endpoint
├── components/                   # Reusable UI components
│   ├── ui/                      # Shadcn/ui components
│   └── AuroraBackground.tsx     # Background effects
├── dashboard/                    # Dashboard components
│   ├── MainDashboard.tsx        # Main dashboard with tabs
│   ├── DashboardTable.tsx       # Data table with checkboxes
│   └── InteractiveDashboard.tsx # Analytics charts
├── lib/                         # Utility functions
├── public/                      # Static assets
└── styles/                      # Global styles
```

##  Key Components

### Dashboard Features
- **MainDashboard.tsx**: Enhanced tab navigation with professional styling
- **DashboardTable.tsx**: Data table with checkbox selection and CSV export
- **InteractiveDashboard.tsx**: Interactive charts and analytics
- **Beautiful Gradients**: Pink-purple-indigo gradient backgrounds

### Survey Features
- **Comprehensive Form**: 954-line survey form with validation
- **Professional Styling**: Dark theme with cyan accents
- **Error Handling**: Robust error boundaries and validation

## 🔧 Development

### Adding New Features
1. **Survey Fields**: Update the Zod schema in API routes and form components
2. **Dashboard Views**: Add new components to the `dashboard/` directory
3. **Styling**: Modify Tailwind classes for consistent theming
4. **API Routes**: Add new endpoints in `app/api/`

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
pnpm start
```

##  Design System

### Color Palette
- **Primary Background**: #181c2a (Dark theme)
- **Accent Color**: #7ee9fa (Cyan)
- **Gradients**: Pink → Purple → Indigo
- **Text**: White/Gray for readability

### Typography
- **Headings**: Font-bold with proper hierarchy
- **Body**: Clean, readable fonts
- **UI Elements**: Consistent sizing and spacing

## 📊 Dashboard Usage

1. **Access Admin Dashboard**: Navigate to `/admin/responses`
2. **Switch Views**: Use tabs to toggle between Analytics and Table view
3. **Select Doctors**: Use checkboxes to select specific doctors
4. **Export Data**: Click "Export Selected to CSV" for chosen responses
5. **View Analytics**: Interactive charts showing response patterns

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## About Aaroha Meditech PVT LTD

This application is developed for Aaroha Meditech PVT LTD, specializing in advanced medical technologies and thyroid microwave ablation therapy solutions.

---

- For new dashboard features, create new components in `dashboard/` and update API routes as needed

## Contributing
1. Fork the repo and create a new branch.
2. Make your changes (follow code style and add comments).
3. Test locally.
4. Submit a pull request with a clear description.

## Best Practices
- Never commit `.env.local` (contains secrets)
- Use modular components for UI
- Validate all API inputs
- Add error boundaries for new pages
- Write clear commit messages

## Contact
For questions or suggestions, open an issue or contact the maintainer

Mail- revanthvarma418@gmail.com
