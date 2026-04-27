import { useState } from 'react';
import { User, Bell, Shield, CreditCard, Monitor, Zap, Globe, Smartphone, CreditCard as CardIcon, CheckCircle2, Monitor as MonitorIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Theme } from '../App';

type SettingsTab = 'profile' | 'subscription' | 'notifications' | 'security' | 'app';

interface SettingsProps {
  t: any;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  lang: string;
  setLang: (lang: any) => void;
}

export default function Settings({ t, theme, setTheme, lang, setLang }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const menuItems = [
    { icon: User, label: t.tabs.profile, id: 'profile' as SettingsTab },
    { icon: Zap, label: t.tabs.subscription, id: 'subscription' as SettingsTab },
    { icon: Bell, label: t.tabs.notifications, id: 'notifications' as SettingsTab },
    { icon: Shield, label: t.tabs.security, id: 'security' as SettingsTab },
    { icon: MonitorIcon, label: t.tabs.app, id: 'app' as SettingsTab }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 text-gradient">{t.title}</h1>
        <p className="text-text-secondary text-sm md:text-base">{t.subtitle}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 md:gap-16">
        <aside className="space-y-2">
          {menuItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all relative group ${
                activeTab === item.id 
                  ? 'bg-accent/10 text-white border border-accent/20' 
                  : 'text-text-secondary hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-accent' : 'text-text-secondary group-hover:text-white'} /> 
              {item.label}
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-tab-indicator"
                  className="absolute right-3 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(var(--accent),0.5)]" 
                />
              )}
            </button>
          ))}
        </aside>

        <div className="space-y-8 min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 1.01 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {activeTab === 'profile' && <ProfileView />}
              {activeTab === 'subscription' && <SubscriptionView />}
              {activeTab === 'notifications' && <NotificationsView />}
              {activeTab === 'security' && <SecurityView />}
              {activeTab === 'app' && <AppSettingsView t={t.app} theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ProfileView() {
  return (
    <div className="space-y-8">
      <div className="glass p-6 md:p-10 rounded-[2.5rem] space-y-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center text-accent relative group overflow-hidden shadow-2xl shadow-accent/20">
            <span className="text-3xl md:text-5xl font-bold font-display">EO</span>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-sm">
              <Monitor size={24} className="text-white" />
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <h3 className="text-2xl font-bold font-display mb-1">Erkinjon Olimov</h3>
            <p className="text-sm text-text-secondary flex items-center justify-center md:justify-start gap-2">
              Premium Creator Plan
              <span className="w-1 h-1 rounded-full bg-text-secondary opacity-30" />
              Member since 2024
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black rounded-full uppercase border border-green-500/20 tracking-widest shadow-sm">
                <CheckCircle2 size={10} /> Account Verified
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent text-[10px] font-black rounded-full uppercase border border-accent/20 tracking-widest shadow-sm">
                Pro Level
              </div>
            </div>
          </div>
          <button className="md:ml-auto px-6 py-3 bg-white/5 hover:bg-white/10 border border-brand-border rounded-2xl text-xs font-bold transition-all flex items-center gap-2">
            Edit Photo
          </button>
        </div>

        <hr className="border-brand-border" />

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Display Name</label>
              <input type="text" defaultValue="Erkinjon Olimov" className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl p-4 text-sm focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Email Address</label>
              <input type="email" defaultValue="olimove30@gmail.com" className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl p-4 text-sm focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Bio & Creative Focus</label>
            <textarea rows={4} className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl p-4 text-sm focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all resize-none" defaultValue="AI enthusiast and creator exploring the boundaries of technology. Focused on cinematic video generation and abstract art." />
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button className="px-8 py-4 bg-accent text-white rounded-2xl text-sm font-bold shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Save Changes
            </button>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-sm font-bold transition-all">
              Discard Changes
            </button>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-[2.5rem] border-red-500/20 bg-red-500/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-red-500 font-bold mb-2">Danger Zone</h4>
            <p className="text-xs text-text-secondary">Permanently delete your account and all associated creative content. This action cannot be undone.</p>
          </div>
          <button className="whitespace-nowrap px-8 py-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

function SubscriptionView() {
  return (
    <div className="space-y-8">
      <div className="glass p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px] -mr-32 -mt-32 rounded-full" />
        
        <div className="relative">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/40">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display">Premium Creator Plan</h3>
              <p className="text-xs text-text-secondary uppercase font-bold tracking-widest">Active Subscription</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: 'Credits Remaining', value: '4,850', sub: 'of 5,000' },
              { label: 'Renewal Date', value: 'May 12, 2024', sub: 'Auto-renewal ON' },
              { label: 'Monthly Price', value: '$29.99', sub: 'Taxes included' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2">{stat.label}</p>
                <p className="text-2xl font-bold font-display text-white mb-1">{stat.value}</p>
                <p className="text-[10px] text-text-secondary">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button className="flex-1 px-8 py-5 bg-white text-black rounded-3xl text-sm font-bold shadow-xl hover:scale-[1.02] transition-all">
              Upgrade to Agency
            </button>
            <button className="flex-1 px-8 py-5 bg-white/5 border border-white/10 text-white rounded-3xl text-sm font-bold hover:bg-white/10 transition-all">
              Manage Billing
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <h4 className="font-bold flex items-center gap-2">
            <CardIcon className="text-accent" size={18} /> Payment Methods
          </h4>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-[10px]">VISA</div>
            <div className="flex-1">
              <p className="text-sm font-bold">•••• 4242</p>
              <p className="text-[10px] text-text-secondary">Expires 12/26</p>
            </div>
            <div className="px-2 py-1 bg-accent/10 text-accent text-[8px] font-black rounded uppercase border border-accent/20">Default</div>
          </div>
          <button className="w-full py-4 border border-dashed border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-white hover:border-white/40 transition-all">
            + Add Payment Method
          </button>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <h4 className="font-bold flex items-center gap-2">
            <CreditCard className="text-accent" size={18} /> Billing History
          </h4>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div>
                  <p className="text-sm font-bold">Premium Subscription</p>
                  <p className="text-[10px] text-text-secondary">Invoice #AI-2024-{100-i}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">$29.99</p>
                  <p className="text-[10px] text-text-secondary">April {12-i}, 2024</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full pt-2 text-[10px] font-black uppercase tracking-widest text-accent hover:underline">
            View All Invoices
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationsView() {
  const [channels, setChannels] = useState({
    system: true,
    email: true,
    web: false,
    promos: false
  });

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="glass p-8 md:p-10 rounded-[2.5rem] space-y-10">
        <div>
          <h3 className="text-xl font-bold font-display mb-2">Notification Preferences</h3>
          <p className="text-sm text-text-secondary">Choose how you want to be notified about updates and creations.</p>
        </div>

        <div className="space-y-4">
          {(Object.entries(channels) as [keyof typeof channels, boolean][]).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                  {key === 'system' ? <Zap size={18} /> : key === 'email' ? <Globe size={18} /> : key === 'web' ? <Monitor size={18} /> : <Zap size={18} />}
                </div>
                <div>
                  <p className="text-sm font-bold capitalize">{key} Notifications</p>
                  <p className="text-[10px] text-text-secondary">Important alerts and account activity</p>
                </div>
              </div>
              <button 
                onClick={() => setChannels(p => ({ ...p, [key]: !value }))}
                className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-accent' : 'bg-brand-border'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>

        <hr className="border-brand-border" />

        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-widest">Notification Channels</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <button className="flex items-center gap-4 p-4 rounded-2xl bg-[#5865F2] text-white font-bold text-sm shadow-xl shadow-[#5865F2]/20 hover:scale-[1.02] transition-all">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  D
                </div>
                Connect Discord
             </button>
             <button className="flex items-center gap-4 p-4 rounded-2xl bg-black border border-white/10 text-white font-bold text-sm hover:scale-[1.02] transition-all">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  T
                </div>
                Connect Telegram
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityView() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div className="glass p-8 md:p-10 rounded-[2.5rem] space-y-10">
        <div>
          <h3 className="text-xl font-bold font-display mb-2">Account Security</h3>
          <p className="text-sm text-text-secondary">Manage your password, login sessions and security keys.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Current Password</label>
             <input type="password" placeholder="••••••••••••" className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl p-4 text-sm focus:outline-none focus:border-accent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">New Password</label>
               <input type="password" placeholder="Min. 12 characters" className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl p-4 text-sm focus:outline-none focus:border-accent" />
            </div>
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-1">Confirm Password</label>
               <input type="password" placeholder="Confirm selection" className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl p-4 text-sm focus:outline-none focus:border-accent" />
            </div>
          </div>
          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
            Update Password
          </button>
        </div>

        <hr className="border-brand-border" />

        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold mb-1">Two-Factor Authentication</h4>
                <p className="text-xs text-text-secondary">Add an extra layer of security to your account.</p>
              </div>
              <button className="px-5 py-2.5 bg-accent/10 text-accent rounded-xl text-xs font-bold border border-accent/20">Enable 2FA</button>
           </div>
        </div>
      </div>

      <div className="glass p-8 rounded-[2.5rem] space-y-6">
        <h3 className="text-lg font-bold">Active Sessions</h3>
        <div className="space-y-4">
           {[
             { device: 'MacBook Pro 16"', location: 'Tashkent, Uzbekistan', active: 'Current' },
             { device: 'iPhone 15 Pro', location: 'Dubai, UAE', active: '2 hours ago' }
           ].map((session, i) => (
             <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-secondary">
                    {session.device.includes('iPhone') ? <Smartphone size={18} /> : <MonitorIcon size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{session.device}</p>
                    <p className="text-[10px] text-text-secondary">{session.location}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className={`text-[10px] font-black uppercase tracking-widest ${session.active === 'Current' ? 'text-green-500' : 'text-text-secondary'}`}>{session.active}</p>
                   {session.active !== 'Current' && (
                     <button className="text-[10px] text-red-500 hover:underline mt-1">Revoke</button>
                   )}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function AppSettingsView({ t, theme, setTheme, lang, setLang }: { t: any; theme: Theme; setTheme: (theme: Theme) => void; lang: string; setLang: (lang: any) => void }) {
  const [haptics, setHaptics] = useState(true);
  const [experimental, setExperimental] = useState(false);

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="glass p-8 md:p-10 rounded-[2.5rem] space-y-10 relative overflow-hidden border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
        
        <div className="relative">
          <h3 className="text-2xl font-bold font-display mb-2">{t.title}</h3>
          <p className="text-sm text-text-secondary">{t.desc}</p>
        </div>

        <div className="space-y-10 relative">
           <section className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Language</h4>
              <div className="grid grid-cols-3 gap-4">
                 {(['uz', 'en', 'ru'] as const).map((l) => (
                   <button 
                     key={l}
                     onClick={() => setLang(l)}
                     className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${lang === l ? 'bg-accent text-white shadow-lg' : 'bg-white/5 text-text-secondary hover:bg-white/10'}`}
                   >
                     <span className="text-sm font-black uppercase">{l}</span>
                     <span className="text-[10px] font-medium">{l === 'uz' ? "O'zbekcha" : l === 'en' ? 'English' : 'Русский'}</span>
                   </button>
                 ))}
              </div>
           </section>

           <div className="h-px bg-white/5" />

           <section className="space-y-6">
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">{t.theme}</h4>
             <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => setTheme('dark')}
                  className={`p-5 rounded-[2rem] flex flex-col items-center gap-4 transition-all duration-300 ${theme === 'dark' ? 'bg-black border-2 border-accent ring-8 ring-accent/5' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                >
                  <div className="w-full aspect-[4/3] bg-neutral-900 rounded-2xl flex items-center justify-center p-4">
                    <div className="w-full h-full bg-neutral-800 rounded-xl flex flex-col gap-2 p-2">
                      <div className="w-1/2 h-2 bg-accent/40 rounded" />
                      <div className="w-full h-8 bg-neutral-700/50 rounded-lg" />
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-white' : 'text-text-secondary'}`}>{t.dark}</span>
                </button>
                <button 
                  onClick={() => setTheme('light')}
                  className={`p-5 rounded-[2rem] flex flex-col items-center gap-4 transition-all duration-300 ${theme === 'light' ? 'bg-white border-2 border-accent ring-8 ring-accent/5 shadow-2xl' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                >
                  <div className="w-full aspect-[4/3] bg-neutral-100 rounded-2xl flex items-center justify-center p-4">
                    <div className="w-full h-full bg-white rounded-xl flex flex-col gap-2 p-2 shadow-sm">
                      <div className="w-1/2 h-2 bg-accent/20 rounded" />
                      <div className="w-full h-8 bg-neutral-50 rounded-lg" />
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'light' ? 'text-black' : 'text-text-secondary'}`}>{t.light}</span>
                </button>
             </div>
           </section>

           <div className="h-px bg-white/5" />

           <section className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">{t.feedback}</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-3xl group hover:border-white/10 transition-all">
                  <div>
                    <p className="text-sm font-bold mb-1">{t.audio}</p>
                    <p className="text-[10px] text-text-secondary">{t.audioDesc}</p>
                  </div>
                  <button 
                    onClick={() => setHaptics(!haptics)}
                    className={`w-12 h-6 rounded-full transition-all relative ${haptics ? 'bg-accent shadow-lg shadow-accent/20' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${haptics ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-3xl group hover:border-white/10 transition-all">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold">{t.experimental}</p>
                      <span className="px-1.5 py-0.5 bg-accent/10 text-accent text-[8px] font-black rounded uppercase tracking-tighter">Early Access</span>
                    </div>
                    <p className="text-[10px] text-text-secondary">{t.experimentalDesc}</p>
                  </div>
                  <button 
                    onClick={() => setExperimental(!experimental)}
                    className={`w-12 h-6 rounded-full transition-all relative ${experimental ? 'bg-accent shadow-lg shadow-accent/20' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${experimental ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
           </section>
        </div>
      </div>

      <div className="flex justify-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">
        <a href="#" className="hover:text-white transition-all underline decoration-accent/30 underline-offset-4">Terms</a>
        <a href="#" className="hover:text-white transition-all underline decoration-accent/30 underline-offset-4">Privacy</a>
        <a href="#" className="hover:text-white transition-all underline decoration-accent/30 underline-offset-4">Release Notes</a>
      </div>
    </div>
  );
}

