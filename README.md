# CyberSecure - Incident Management System

A modern cybersecurity incident management system built with React, TypeScript, and Tailwind CSS.

## Prerequisites

Before running this project locally, make sure you have the following installed:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

## Getting Started

1. **Extract the project files** to your desired directory

2. **Navigate to the project directory** in your terminal:
   ```bash
   cd path/to/your/project
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```
   or if you prefer yarn:
   ```bash
   yarn install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   or with yarn:
   ```bash
   yarn dev
   ```

5. **Open your browser** and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Demo Credentials

The application includes demo authentication with the following credentials:

### Administrator Account
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Full system access including user management

### Security Analyst Account
- **Username**: `analyst`
- **Password**: `analyst123`
- **Access**: Standard analyst features (no user management)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Features

- **Dashboard**: Real-time security operations overview
- **Incident Management**: Track and manage security incidents
- **Asset Management**: Monitor organizational assets
- **User Management**: Manage system users (admin only)
- **Profile Management**: User profile and settings
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Professional dark UI theme

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **Vite** - Build tool

## Troubleshooting

### Common Issues

1. **Port already in use**: If port 5173 is busy, Vite will automatically use the next available port
2. **Dependencies not installing**: Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
3. **Build errors**: Make sure you're using Node.js version 16 or higher

### Getting Help

If you encounter any issues:
1. Check the terminal for error messages
2. Ensure all dependencies are properly installed
3. Verify Node.js version with `node --version`

## Development Notes

This is a frontend-only application with simulated authentication and data. In a production environment, you would need to:

- Implement a real backend API
- Set up proper authentication and authorization
- Connect to actual databases
- Add proper security measures
- Implement real-time data updates

## License

This project is for demonstration purposes.