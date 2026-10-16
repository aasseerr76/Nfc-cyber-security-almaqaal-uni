import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, CalendarDays, Award, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    {
      id: 'home' as const,
      label: 'الرئيسية',
      icon: LayoutDashboard,
    },
    {
      id: 'schedule' as const,
      label: 'الجدول الدراسي',
      icon: CalendarDays,
    },
    {
      id: 'subjects' as const,
      label: 'المواد والنتائج',
      icon: Award,
    },
    {
      id: 'profile' as const,
      label: 'الملف الشخصي',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800">
      <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive ? 'text-indigo-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[11px] mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
