import { motion } from 'motion/react';
import { 
  Home as HomeIcon,
  Image as ImageIcon, 
  Video as VideoIcon, 
  Music as MusicIcon, 
  FolderRoot, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { View } from '../App';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  onLogout: () => void;
  t: any;
}

export default function Sidebar({ currentView, setView, onLogout, t }: SidebarProps) {
  const navItems = [
    { id: 'home', icon: HomeIcon, label: t.dashboard.home },
    { id: 'image', icon: ImageIcon, label: t.dashboard.image },
    { id: 'video', icon: VideoIcon, label: t.dashboard.video },
    { id: 'music', icon: MusicIcon, label: t.dashboard.music },
    { id: 'projects', icon: FolderRoot, label: t.dashboard.projects },
    { id: 'settings', icon: Settings, label: t.dashboard.settings },
  ];

  return (
    <aside className="w-64 h-full border-r border-brand-border glass flex flex-col">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-accent rounded-xl glow-box flex items-center justify-center shadow-lg shadow-accent/50">
            <Sparkles className="text-white" size={24} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Erkinjon AI</span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                currentView === item.id 
                  ? 'bg-accent/10 text-accent border border-accent/20 shadow-sm shadow-accent/5' 
                  : 'text-text-secondary hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} className={currentView === item.id ? 'text-accent' : 'text-text-secondary group-hover:text-white'} />
              {item.label}
              {currentView === item.id && (
                <motion.div layoutId="nav-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-brand-border">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-red-500/10 hover:text-red-500 transition-all group"
        >
          <LogOut size={20} className="group-hover:text-red-500 transition-colors" />
          {t.dashboard.logout}
        </button>
      </div>
    </aside>
  );
}
