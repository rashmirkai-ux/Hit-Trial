/**
 * SAJAG - AI-Assisted Smart Navigation & Safety Platform
 * Root Application Entry Component
 * Composed purely of React components and context providers (zero raw HTML tags).
 */

import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { NavigationDashboard } from './pages/NavigationDashboard';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NavigationDashboard />
      </LanguageProvider>
    </ThemeProvider>
  );
}
