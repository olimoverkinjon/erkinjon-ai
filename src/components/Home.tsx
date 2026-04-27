import { motion } from 'motion/react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Music as MusicIcon,
  Zap,
  Star,
  Clock,
  ArrowRight
} from 'lucide-react';

import { useProjects } from '../context/ProjectContext';

interface HomeProps {
  onNavigate: (view: any) => void;
  t: any;
}

export default function Home({ onNavigate, t }: HomeProps) {
  const { projects } = useProjects();
  const recentProjects = projects.slice(0, 4);

  const quickActions = [
    { 
      id: 'image', 
      icon: ImageIcon, 
      label: t.dashboard.image, 
      desc: t.imageGen.placeholder.slice(0, 30) + '...',
      color: 'bg-blue-500',
      gradient: 'from-blue-500/20 to-transparent'
    },
    { 
      id: 'video', 
      icon: VideoIcon, 
      label: t.dashboard.video, 
      desc: t.videoGen.placeholder.slice(0, 30) + '...',
      color: 'bg-purple-500',
      gradient: 'from-purple-500/20 to-transparent'
    },
    { 
      id: 'music', 
      icon: MusicIcon, 
      label: t.dashboard.music, 
      desc: t.musicGen.placeholder.slice(0, 30) + '...',
      color: 'bg-pink-500',
      gradient: 'from-pink-500/20 to-transparent'
    }
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Welcome */}
      <section className="relative overflow-hidden glass p-8 rounded-[2.5rem] border-accent/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px] -z-10" />
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-accent">
              <Zap size={12} /> Pro Access Active
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight leading-none">
              {t.common.all === 'Все' ? 'С возвращением,' : t.common.all === 'Hammasi' ? 'Xush kelibsiz,' : 'Welcome back,'} <span className="text-accent">Erkinjon</span>
            </h1>
            <p className="text-text-secondary text-sm md:text-base max-w-lg leading-relaxed">
              {t.auth.subtitle}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
               <button 
                 onClick={() => onNavigate('image')}
                 className="px-6 py-3 bg-accent text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-accent-light transition-all shadow-xl shadow-accent/20"
               >
                 {t.hero.cta} <ArrowRight size={18} />
               </button>
            </div>
          </div>
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-48 h-48 bg-brand-card rounded-full border border-brand-border p-4 flex items-center justify-center relative shadow-2xl"
          >
             <div className="absolute inset-0 bg-accent/5 rounded-full blur-2xl animate-pulse" />
             <Sparkles size={64} className="text-accent" />
          </motion.div>
        </div>
      </section>

      {/* Quick Launch Grid */}
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary ml-2">{t.common.search.replace('...', '')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onNavigate(action.id)}
              className="group relative overflow-hidden glass p-6 rounded-3xl text-left transition-all hover:border-accent/40 hover:translate-y-[-4px]"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${action.gradient} -z-10`} />
              <div className={`w-12 h-12 ${action.color}/20 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon size={24} className={action.color.replace('bg-', 'text-')} />
              </div>
              <h4 className="text-lg font-bold mb-1">{action.label}</h4>
              <p className="text-xs text-text-secondary leading-relaxed">{action.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Activity / Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary ml-2 flex items-center gap-2">
            <Clock size={14} /> {t.common.recent}
          </h3>
          <div className="glass p-6 rounded-[2rem] space-y-2">
            {recentProjects.length > 0 ? (
              recentProjects.map(project => (
                <div 
                  key={project.id} 
                  onClick={() => onNavigate('projects')}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                   <div className="w-12 h-12 bg-white/10 rounded-xl overflow-hidden border border-white/5">
                      <img src={project.url} className="w-full h-full object-cover" alt={project.title} />
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate">{project.title}</div>
                      <div className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">
                        {project.type} • {project.date === 'Just now' ? t.common.justNow : project.date}
                      </div>
                   </div>
                   <ArrowRight size={16} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-text-secondary font-bold uppercase tracking-widest opacity-30">
                {t.common.noProjects}
              </div>
            )}
            
            {projects.length > 4 && (
              <button 
                onClick={() => onNavigate('projects')}
                className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-accent transition-colors"
              >
                {t.common.viewAll}
              </button>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary ml-2 flex items-center gap-2">
            <Star size={14} /> Platform News
          </h3>
          <div className="glass p-6 rounded-[2rem] space-y-4 bg-accent/5 border-accent/10">
             <div className="space-y-2">
                <div className="text-xs font-black text-accent uppercase tracking-widest">Update 2.4</div>
                <h4 className="text-base font-bold italic">"Video Generator now supports 4K upscale & Frame Interpolation"</h4>
                <p className="text-xs text-text-secondary leading-relaxed font-medium">
                  We've integrated a new sampling method that improves motion consistency by 40%.
                </p>
             </div>
             <button className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">Read Release Notes</button>
          </div>
        </section>
      </div>
    </div>
  );
}
