/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { TimetableSection } from './components/TimetableSection';
import { SubjectsAndGradesSection } from './components/SubjectsAndGradesSection';
import { ProfileSection } from './components/ProfileSection';
import { NotificationToast } from './components/NotificationToast';

const MainAppContent: React.FC = () => {
  const { currentUser, activeTab } = useApp();

  if (!currentUser) {
    return <LoginScreen />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboard />;
      case 'schedule':
        return <TimetableSection />;
      case 'subjects':
        return <SubjectsAndGradesSection />;
      case 'profile':
        return <ProfileSection />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Instant Notification Toast */}
      <NotificationToast />

      {/* Top App Bar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-5">
        {renderTabContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
