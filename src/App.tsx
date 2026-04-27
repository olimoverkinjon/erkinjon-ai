/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { translations, Language } from './translations';
import Sidebar from './components/Sidebar';
import ImageGenerator from './components/ImageGenerator';
import VideoGenerator from './components/VideoGenerator';
import MusicGenerator from './components/MusicGenerator';
import Projects from './components/Projects';
import Settings from './components/Settings';
import Auth from './components/Auth';
import { PanelLeft as SidebarIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProjectProvider } from './context/ProjectContext';

export type View = 'home' | 'image' | 'video' | 'music' | 'profile' | 'projects' | 'settings';
export type Theme = 'dark' | 'light';

import { 
  Home as HomeIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Music as MusicIcon,
  User as UserIcon,
  Search,
  Bell,
  Sparkles
} from 'lucide-react';

import Home from './components/Home';
import Profile from './components/Profile';
import { useProjects } from './context/ProjectContext';

function AppContent() {
  const { notify, toast } = useProjects();
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('erkinjon_logged_in') === 'true');
  const [view, setView] = useState<View>('home');
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('erkinjon_lang') as Language) || 'uz');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('erkinjon_theme') as Theme) || 'dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('erkinjon_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('erkinjon_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('erkinjon_logged_in', 'true');
    notify(lang === 'uz' ? 'Erkinjon AI xizmatiga xush kelibsiz!' : lang === 'ru' ? 'Добро пожаловать в Erkinjon AI!' : 'Welcome to Erkinjon AI!');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('erkinjon_logged_in');
    notify(lang === 'uz' ? 'Tizimdan chiqildi' : lang === 'ru' ? 'Выход из системы выполнен' : 'Signed out successfully');
  };

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} t={t.auth} lang={lang} setLang={setLang} />;
  }

  return (
    <div className="flex h-screen bg-brand-bg text-text-primary font-sans overflow-hidden relative select-none">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 40, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-0 left-1/2 z-[100] px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-xl border ${
              toast.type === 'success' ? 'bg-green-500/20 border-green-500/40 text-green-100' : 'bg-red-500/20 border-red-500/40 text-red-100'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-bold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:block border-r border-brand-border h-full`}>
        <Sidebar 
          currentView={view} 
          setView={(v) => setView(v)} 
          onLogout={handleLogout} 
          t={t.dashboard}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-[70] transform lg:hidden transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          currentView={view} 
          setView={(v) => { setView(v); setIsSidebarOpen(false); }} 
          onLogout={handleLogout} 
          t={t.dashboard}
        />
      </div>
      
      <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        {/* Header - Minimal and optimized for mobile */}
        <header className="h-16 shrink-0 glass flex items-center justify-between px-4 sm:px-6 md:px-8 border-b border-brand-border z-40">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-text-secondary hover:text-white transition-colors"
            >
              <SidebarIcon size={20} />
            </button>
            <div className="w-8 h-8 rounded-lg bg-accent items-center justify-center lg:hidden hidden sm:flex">
              <Sparkles size={18} className="text-white" />
            </div>
            <h2 className="hidden lg:block font-display font-bold text-xl capitalize">
               {view === 'home' ? t.dashboard.home : 
                view === 'image' ? t.dashboard.image : 
                view === 'video' ? t.dashboard.video : 
                view === 'music' ? t.dashboard.music : 
                view === 'profile' ? t.dashboard.profile :
                view === 'projects' ? t.dashboard.projects : 
                t.dashboard.settings}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
             {/* Instant Language Switcher in Header */}
             <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 items-center gap-1">
                {(['uz', 'en', 'ru'] as Language[]).map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${lang === l ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                  >
                    {l}
                  </button>
                ))}
             </div>

             <button 
               onClick={() => notify(lang === 'uz' ? 'Qidiruv tizimi tez kunda ishga tushadi!' : 'Search feature coming soon!')}
               className="p-2 text-text-secondary hover:text-white transition-colors hidden sm:block"
             >
                <Search size={20} />
             </button>
             <button 
               onClick={() => notify(lang === 'uz' ? 'Yangi bildirishnomalar yo\'q' : 'No new notifications')}
               className="p-2 text-text-secondary hover:text-white transition-colors relative"
             >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full" />
             </button>
             <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-[10px] font-bold text-accent cursor-pointer" onClick={() => setView('profile')}>
                EO
             </div>
          </div>
        </header>

        {/* Content Area - optimized scroll */}
        <div className="flex-1 overflow-y-auto w-full pb-20 lg:pb-0">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="w-full"
              >
                {view === 'home' && <Home onNavigate={setView} t={t} />}
                {view === 'image' && <ImageGenerator t={t} />}
                {view === 'video' && <VideoGenerator t={t} />}
                {view === 'music' && <MusicGenerator t={t} />}
                {view === 'profile' && <Profile onLogout={handleLogout} setView={setView} t={t} />}
                {view === 'projects' && <Projects t={t} />}
                {view === 'settings' && <Settings t={t} theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Nav - ONLY MOBILE */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 glass-navbar border-t border-brand-border lg:hidden flex items-center justify-around px-2 z-50">
            <button 
              onClick={() => setView('home')}
              className={`flex flex-col items-center gap-1 transition-all ${view === 'home' ? 'text-accent' : 'text-text-secondary'}`}
            >
               <HomeIcon size={20} />
               <span className="text-[10px] font-bold uppercase tracking-widest">{t.dashboard.home}</span>
            </button>
            <button 
              onClick={() => setView('image')}
              className={`flex flex-col items-center gap-1 transition-all ${view === 'image' ? 'text-accent' : 'text-text-secondary'}`}
            >
               <ImageIcon size={20} />
               <span className="text-[10px] font-bold uppercase tracking-widest">{t.dashboard.image}</span>
            </button>
            <button 
              onClick={() => setView('video')}
              className={`flex flex-col items-center gap-1 transition-all ${view === 'video' ? 'text-accent' : 'text-text-secondary'}`}
            >
               <VideoIcon size={20} />
               <span className="text-[10px] font-bold uppercase tracking-widest">{t.dashboard.video}</span>
            </button>
            <button 
              onClick={() => setView('music')}
              className={`flex flex-col items-center gap-1 transition-all ${view === 'music' ? 'text-accent' : 'text-text-secondary'}`}
            >
               <MusicIcon size={20} />
               <span className="text-[10px] font-bold uppercase tracking-widest">{t.dashboard.music}</span>
            </button>
            <button 
              onClick={() => setView('profile')}
              className={`flex flex-col items-center gap-1 transition-all ${view === 'profile' ? 'text-accent' : 'text-text-secondary'}`}
            >
               <UserIcon size={20} />
               <span className="text-[10px] font-bold uppercase tracking-widest">{t.dashboard.profile}</span>
            </button>
        </nav>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
}
