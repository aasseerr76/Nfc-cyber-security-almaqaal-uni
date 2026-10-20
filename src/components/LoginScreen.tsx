import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  GraduationCap, 
  Briefcase, 
  Radio, 
  Lock, 
  User as UserIcon, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  LogIn,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  registerStudentAccount, 
  registerTeacherAccount, 
  authenticateUser 
} from '../services/authService';

export const LoginScreen: React.FC = () => {
  const { loginWithUser } = useApp();
  
  // Auth Mode: 'login' (تسجيل الدخول) or 'register' (إنشاء حساب جديد)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Form Fields
  const [academicId, setAcademicId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [teacherDepartment, setTeacherDepartment] = useState('هندسة الذكاء الاصطناعي');

  // Feedback states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Clear messages when mode or role changes
  useEffect(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [authMode, selectedRole]);

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanId = academicId.trim();

    if (!cleanId) {
      setErrorMessage(selectedRole === 'student' ? 'يرجى إدخال الرقم المعرفي للطالب.' : 'يرجى إدخال الرقم الوظيفي.');
      return;
    }

    if (!password) {
      setErrorMessage('يرجى إدخال كلمة المرور.');
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === 'register') {
        // --- REGISTER FLOW ---
        if (password.length < 4) {
          setErrorMessage('كلمة المرور يجب أن لا تقل عن 4 رموز.');
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setErrorMessage('كلمتا المرور غير متطابقتين.');
          setIsLoading(false);
          return;
        }

        if (selectedRole === 'student') {
          const result = registerStudentAccount({
            academicId: cleanId,
            password: password,
          });

          if (result.success) {
            setSuccessMessage(result.message);
            setAuthMode('login');
            setPassword('');
            setConfirmPassword('');
          } else {
            setErrorMessage(result.message);
          }
        } else {
          // Teacher registration
          if (!teacherName.trim()) {
            setErrorMessage('يرجى إدخال اسم التدريسي الكامل.');
            setIsLoading(false);
            return;
          }

          const result = registerTeacherAccount({
            academicId: cleanId,
            name: teacherName.trim(),
            password: password,
            department: teacherDepartment,
          });

          if (result.success) {
            setSuccessMessage(result.message);
            setAuthMode('login');
            setPassword('');
            setConfirmPassword('');
          } else {
            setErrorMessage(result.message);
          }
        }
      } else {
        // --- STRICT LOGIN FLOW ---
        const result = authenticateUser(selectedRole, cleanId, password);

        if (result.success && result.user) {
          loginWithUser(result.user);
        } else {
          setErrorMessage(result.message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative antialiased">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/30 mb-2.5">
            <Radio className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold text-indigo-400 block tracking-wider uppercase">
            جامعة المعقل الأهلية | كلية الهندسة والتكنولوجيا
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">نظام الحضور والغياب الذكي</h1>
          <p className="text-xs text-slate-400 mt-1">
            بوابة تسجيل وتوثيق الحضور الأكاديمي المعتمدة
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
          {/* Auth Mode Tabs (تسجيل الدخول / إنشاء حساب جديد) */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>إنشاء حساب جديد</span>
            </button>
          </div>

          {/* Role Selector (طالب / تدريسي) */}
          <div>
            <div className="grid grid-cols-2 p-1 bg-slate-950/70 rounded-xl border border-slate-800/80 gap-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'student'
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <span>مسار الطالب</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('teacher')}
                className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'teacher'
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4 text-purple-400" />
                <span>مسار التدريسي</span>
              </button>
            </div>
          </div>

          {/* Success Notification */}
          {successMessage && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center gap-2 text-xs text-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Notification */}
          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-2xl flex items-center gap-2 text-xs text-rose-200 animate-in shake">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Academic ID / Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {selectedRole === 'student' ? 'الرقم المعرفي للطالب أو البريد الأكاديمي' : 'الرقم الوظيفي أو البريد للتدريسي'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={academicId}
                  onChange={e => setAcademicId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-100 rounded-xl pr-9 pl-3 py-2.5 text-xs focus:outline-none font-mono transition-colors"
                  placeholder={selectedRole === 'student' ? 'أدخل الرقم المعرفي أو البريد الأكاديمي' : 'مثال: MQ-PROF-4012'}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Additional Fields for Teacher Registration */}
            {authMode === 'register' && selectedRole === 'teacher' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    اسم التدريسي الثلاثي
                  </label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={e => setTeacherName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="مثال: أ.د. حيدر كاظم التميمي"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    القسم الأكاديمي
                  </label>
                  <select
                    value={teacherDepartment}
                    onChange={e => setTeacherDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="هندسة الذكاء الاصطناعي">هندسة الذكاء الاصطناعي</option>
                    <option value="هندسة السيطرة والحاسبات">هندسة السيطرة والحاسبات</option>
                    <option value="هندسة الأمن السيبراني">هندسة الأمن السيبراني</option>
                  </select>
                </div>
              </>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {authMode === 'register' ? 'تعيين كلمة المرور' : 'كلمة المرور'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl pr-9 pl-10 py-2.5 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                  placeholder="أدخل كلمة المرور"
                  required
                  autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Register mode only) */}
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl pr-9 pl-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>
                {isLoading 
                  ? 'جاري التحقق...' 
                  : authMode === 'register' 
                  ? 'إنشاء الحساب' 
                  : 'تسجيل الدخول'}
              </span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          {/* Switch Mode Prompt */}
          <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
            {authMode === 'login' ? (
              <p>
                ليس لديك حساب بعد؟{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                >
                  إنشاء حساب جديد
                </button>
              </p>
            ) : (
              <p>
                لديك حساب مسبقاً؟{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                >
                  تسجيل الدخول مباشرة
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-500 mt-4">
          نظام جامعة المعقل الأهلية • الحضور والغياب بتقنية NFC • محمي ومشفر
        </p>
      </div>
    </div>
  );
};
