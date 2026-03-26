# User Profile Component

## Overview
The user profile page (`/app/dashboard/profile/page.tsx`) provides a comprehensive user profile management interface that follows the Renaissance project's design themes and color scheme.

## Features

### 1. Profile Header
- **User Avatar**: Gradient background with user icon and edit button
- **User Information**: Name, username, member status, email, and join date
- **Premium Badge**: Visual indicator for premium members
- **Action Buttons**: Edit profile and share profile options

### 2. Statistics Dashboard
- **Predictions Won**: Track successful match predictions
- **Points Earned**: Display user's accumulated points
- **XLM Balance**: Show cryptocurrency balance for Web3 features
- **NFT Cards**: Count of digital collectible cards owned

### 3. Favorite Teams Section
- **Team List**: Display user's favorite football teams
- **Team Colors**: Visual color indicators for each team
- **League Information**: Show which league each team belongs to
- **Add Teams**: Button to expand the team selection

### 4. Favorite Players Section
- **Player List**: Display tracked football players
- **Player Details**: Name, team, and position information
- **Add Players**: Button to follow more players

### 5. Account Settings
- **Personal Information**: Editable fields for name and email
- **Notification Preferences**: Toggle options for different notification types
  - Match reminders for favorite teams
  - Player performance updates
  - Promotional offers and news
- **Web3 Wallet Integration**: 
  - Connected wallet status
  - Wallet address display
  - Disconnect and change wallet options

## Design System

### Colors & Theme
- **Primary Colors**: Uses the project's purple-blue color scheme (`oklch(0.208 0.042 265.755)`)
- **Dark Theme**: Follows the established dark theme patterns
- **Card Styling**: Semi-transparent backgrounds (`bg-card/50`) with subtle borders
- **Responsive Design**: Mobile-first approach with responsive grids

### Component Usage
- **shadcn/ui Components**: Card, Button, Input, Label, Badge, Separator
- **Lucide Icons**: User, Mail, Calendar, Trophy, Wallet, Settings, Star, Shield, Edit, ChevronRight
- **Layout Components**: Header, DashboardNav for consistent navigation

### Typography & Spacing
- **Font Hierarchy**: Clear heading structure with proper font weights
- **Consistent Spacing**: Uses Tailwind's spacing utilities throughout
- **Responsive Grid**: Adapts from 1 column on mobile to multiple columns on larger screens

## Integration Points

### Navigation
- Integrated with existing dashboard navigation
- Accessible via `/dashboard/profile` route
- Maintains sidebar navigation consistency

### Data Flow
- **Mock Data**: Currently uses static data for demonstration
- **API Integration**: Ready for backend integration with user data
- **State Management**: Prepared for React state management integration

### Web3 Features
- **Stellar Wallet**: Designed to work with Stellar blockchain
- **XLM Balance**: Displays cryptocurrency balance
- **NFT Integration**: Section for digital collectible cards

## File Structure
```
/app/dashboard/profile/page.tsx - Main profile page component
```

## Dependencies
- React 19.2.3
- Next.js 16.1.4
- Tailwind CSS 4
- Lucide React 0.562.0
- shadcn/ui components

## Future Enhancements
- Profile picture upload functionality
- Achievement badges and gamification
- Social features (follow other users)
- Advanced privacy settings
- Profile customization options
- Activity timeline and history
