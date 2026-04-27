import { motion } from 'motion/react';
import { 
  User, 
  Settings, 
  FolderRoot, 
  CreditCard, 
  Shield, 
  LogOut, 
  ChevronRight,
  Zap,
  Globe,
  Bell
} from 'lucide-react';
import { View } from '../App';

interface ProfileProps {
  onLogout: () => void;
  setView: (view: View) => void;
  t: any;
}

export default function Profile({ onLogout, setView, t }: ProfileProps) {
  const menuItems = [
    { id: 'projects', icon: FolderRoot, label: t.dashboard.projects, desc: t.home.recentCreationsTitle },
    { id: 'settings', icon: Settings, label: t.dashboard.settings, desc: t.imageGen.promptExpert },
    { id: 'subscription', icon: CreditCard, label: 'Subscription', desc: 'Manage your pro plan' },
    { id: 'security', icon: Shield, label: 'Security', desc: 'Privacy and data management' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-8">
      {/* User Header */}
      <section className="glass p-8 rounded-[2.5rem] flex flex-col items-center text-center space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-accent/20 to-transparent" />
        <div className="relative">
          <div className="w-24 h-24 rounded-[2rem] bg-accent/20 border-2 border-accent/40 flex items-center justify-center glow-box overflow-hidden">
            <span className="text-3xl font-black text-accent font-display">EO</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-brand-card rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-display font-black tracking-tight">Erkinjon Olimov</h2>
          <p className="text-sm text-text-secondary">olimove30@gmail.com</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-accent/20">
           <Zap size={12} fill="currentColor" /> {t.common.all === 'Все' ? 'Про Аккаунт' : t.common.all === 'Hammasi' ? 'Pro Aʼzo' : 'Pro Member'}
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
         {[
           { label: t.dashboard.image, val: '1.2k' },
           { label: t.dashboard.video, val: '43' },
           { label: 'Credits', val: '∞' }
         ].map(stat => (
           <div key={stat.label} className="glass p-4 rounded-3xl text-center space-y-1">
              <div className="text-lg font-black text-accent">{stat.val}</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-text-secondary">{stat.label}</div>
           </div>
         ))}
      </div>

      {/* Action Menu */}
      <section className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary ml-4">{t.dashboard.settings}</h3>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'projects' || item.id === 'settings') {
                  setView(item.id as View);
                }
              }}
              className="w-full flex items-center gap-4 p-4 glass rounded-3xl group transition-all hover:bg-white/5 active:scale-[0.98]"
            >
              <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-text-secondary group-hover:text-accent transition-colors">
                <item.icon size={20} />
              </div>
              <div className="text-left flex-1">
                <div className="text-sm font-bold">{item.label}</div>
                <div className="text-[10px] text-text-secondary">{item.desc}</div>
              </div>
              <ChevronRight size={18} className="text-text-secondary group-hover:text-white transition-opacity" />
            </button>
          ))}
        </div>
      </section>

       {/* Secondary Menu */}
       <section className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary ml-4">Localization</h3>
        <div className="space-y-2">
           <button 
             onClick={() => setView('settings')}
             className="w-full flex items-center justify-between p-4 glass rounded-3xl group hover:bg-white/5"
           >
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-text-secondary">
                    <Globe size={20} />
                 </div>
                 <div className="text-sm font-bold">{t.common.all === 'Все' ? 'Язык' : t.common.all === 'Hammasi' ? 'Til' : 'Language'}</div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-accent">Uzbek (UZ)</span>
           </button>
           <button className="w-full flex items-center justify-between p-4 glass rounded-3xl group hover:bg-white/5">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-text-secondary">
                    <Bell size={20} />
                 </div>
                 <div className="text-sm font-bold">{t.common.all === 'Все' ? 'Уведомления' : t.common.all === 'Hammasi' ? 'Bildirishnomalar' : 'Notifications'}</div>
              </div>
              <div className="w-10 h-6 bg-accent rounded-full flex items-center px-1">
                 <div className="w-4 h-4 bg-white rounded-full ml-auto" />
              </div>
           </button>
        </div>
      </section>

      {/* Logout */}
      <button 
        onClick={onLogout}
        className="w-full py-4 text-red-500 font-bold glass rounded-3xl border-red-500/20 hover:bg-red-500/5 transition-all flex items-center justify-center gap-2 active:scale-95"
      >
        <LogOut size={20} />
        {t.dashboard.logout}
      </button>

      <div className="text-center opacity-30 py-4">
         <p className="text-[10px] font-black uppercase tracking-[0.3em]">Erkinjon AI v2.4.0</p>
      </div>
    </div>
  );
}
