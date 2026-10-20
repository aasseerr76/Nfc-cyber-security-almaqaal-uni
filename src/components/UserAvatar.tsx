import React from 'react';
import { GraduationCap, Award, User as UserIcon } from 'lucide-react';
import { UserRole } from '../types';

interface UserAvatarProps {
  name: string;
  role: UserRole;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  role,
  avatar,
  size = 'lg',
  className = '',
  showBadge = true,
}) => {
  // Extract initials from Arabic name (first letters of words)
  const getInitials = (fullName: string) => {
    if (!fullName) return 'م';
    // Remove title prefixes like أ.د. or د. for initials
    const cleaned = fullName
      .replace(/^أ\.د\.\s*/, '')
      .replace(/^د\.\s*/, '')
      .replace(/^أ\.\s*/, '')
      .trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}.${parts[1].charAt(0)}`;
    }
    return parts[0]?.charAt(0) || 'م';
  };

  const initials = getInitials(name);

  // Sizing styles
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs rounded-xl',
    md: 'w-10 h-10 text-sm rounded-xl',
    lg: 'w-14 h-14 text-base rounded-2xl',
    xl: 'w-20 h-20 text-xl rounded-3xl',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-9 h-9',
  };

  const badgeSizes = {
    sm: 'w-3 h-3 -bottom-0.5 -right-0.5',
    md: 'w-4 h-4 -bottom-1 -right-1',
    lg: 'w-5 h-5 -bottom-1 -right-1',
    xl: 'w-6 h-6 -bottom-1.5 -right-1.5',
  };

  const badgeIconSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
  };

  // Only display avatar if it's a valid non-stock/non-unsplash image
  const hasCustomAvatar = avatar && !avatar.includes('unsplash.com') && avatar.trim() !== '';

  if (hasCustomAvatar) {
    return (
      <div className={`relative inline-block flex-shrink-0 ${className}`}>
        <img
          src={avatar}
          alt={name}
          className={`${sizeClasses[size]} object-cover border-2 ${
            role === 'student' ? 'border-indigo-500/40' : 'border-purple-500/40'
          } shadow-md`}
        />
        {showBadge && (
          <div
            className={`absolute ${badgeSizes[size]} rounded-full flex items-center justify-center border-2 border-slate-900 ${
              role === 'student' ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white'
            }`}
          >
            {role === 'student' ? (
              <GraduationCap className={badgeIconSizes[size]} />
            ) : (
              <Award className={badgeIconSizes[size]} />
            )}
          </div>
        )}
      </div>
    );
  }

  // Official Academic Avatar (Zero stock photos, clean professional university styling)
  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      <div
        className={`${sizeClasses[size]} flex flex-col items-center justify-center font-bold text-white shadow-lg border-2 select-none ${
          role === 'student'
            ? 'bg-gradient-to-tr from-indigo-700 via-indigo-600 to-sky-600 border-indigo-400/50 shadow-indigo-500/20'
            : 'bg-gradient-to-tr from-purple-800 via-violet-700 to-indigo-700 border-purple-400/50 shadow-purple-500/20'
        }`}
      >
        <span className="font-mono tracking-wider">{initials}</span>
      </div>

      {showBadge && (
        <div
          className={`absolute ${badgeSizes[size]} rounded-full flex items-center justify-center border-2 border-slate-900 ${
            role === 'student' ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white'
          }`}
          title={role === 'student' ? 'حساب طالب' : 'حساب تدريسي'}
        >
          {role === 'student' ? (
            <GraduationCap className={badgeIconSizes[size]} />
          ) : (
            <Award className={badgeIconSizes[size]} />
          )}
        </div>
      )}
    </div>
  );
};
