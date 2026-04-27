import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Film, Camera, Clock, Loader2, Play, Sparkles, CheckCircle2, Zap, Monitor } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

const videoStyles = [
  { 
    id: 'cinematic', 
    label: 'Cinematic', 
    desc: 'Deep shadows, anamorphic lens flares, and epic wide-angle shots.',
    img: 'https://images.unsplash.com/photo-1485090916755-2bc2f183c346?auto=format&fit=crop&q=80&w=400',
    category: 'Film'
  },
  { 
    id: 'anime', 
    label: 'Anime', 
    desc: 'Dynamic Sakuga-style animation with vibrant hand-drawn textures.',
    img: 'https://images.unsplash.com/photo-1578632738981-43306725dc71?auto=format&fit=crop&q=80&w=400',
    category: 'Artistic'
  },
  { 
    id: 'documentary', 
    label: 'Documentary', 
    desc: 'Handheld camera movement with natural lighting and raw textures.',
    img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=400',
    category: 'Realistic'
  },
  { 
    id: 'abstract', 
    label: 'Abstract', 
    desc: 'Fluid simulations and psychedelic light patterns in 4D space.',
    img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400',
    category: 'Digital'
  },
  { 
    id: 'drone', 
    label: 'Drone FPV', 
    desc: 'High-speed sweeping aerial shots with wide field of view.',
    img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=400',
    category: 'Action'
  },
  { 
    id: 'vintage', 
    label: 'Vintage 8mm', 
    desc: 'Grainy film stock with color leaks and nostalgic flickering.',
    img: 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?auto=format&fit=crop&q=80&w=400',
    category: 'Retro'
  },
];

const FEATURED_TEMPLATES = [
  {
    label: "Cinematic Portrait",
    prompt: "A young man sitting calmly, looking slightly to the side. Natural realism, soft cinematic studio lighting. Subtle breathing, 35mm lens feel, shallow depth of field, slow push-in.",
    style: "cinematic",
    movement: "Zoom In"
  },
  {
    label: "Urban Drone",
    prompt: "Sweeping aerial shot of a futuristic neon city at dawn, heavy fog between skyscrapers, moving traffic below.",
    style: "drone",
    movement: "Crane Shot"
  },
  {
    label: "Ethereal Abstract",
    prompt: "Vibrant iridescent silk flowing in zero-gravity space, morphing textures, luminous particles.",
    style: "abstract",
    movement: "Panning Left"
  }
];

interface VideoGeneratorProps {
  t: any;
}

export default function VideoGenerator({ t }: VideoGeneratorProps) {
  const { addProject } = useProjects();
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('cinematic');
  const [selectedMovement, setSelectedMovement] = useState('Zoom In');
  const [isGenerating, setIsGenerating] = useState(false);
  const [duration, setDuration] = useState('5s');

  const applyTemplate = (template: typeof FEATURED_TEMPLATES[0]) => {
    setPrompt(template.prompt);
    setSelectedStyle(template.style);
    setSelectedMovement(template.movement);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-display font-bold text-gradient">{t.videoGen.title}</h1>
        <p className="text-text-secondary max-w-xl mx-auto">{t.videoGen.subtitle}</p>
      </div>

      <div className="glass p-5 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl -z-10" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-2">
              <Video size={14} /> {t.videoGen.templates}
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth snap-x">
              {FEATURED_TEMPLATES.map(tmpl => (
                <button 
                  key={tmpl.label}
                  onClick={() => applyTemplate(tmpl)}
                  className="text-[10px] font-bold px-3 py-1 bg-white/5 hover:bg-accent/20 hover:text-accent rounded-full border border-white/5 transition-all whitespace-nowrap snap-start"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.videoGen.placeholder}
            className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl p-6 h-32 focus:outline-none focus:border-accent transition-all text-lg resize-none"
          />
        </div>

        {/* Video Style Library */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
               <Zap size={14} className="text-accent" /> {t.videoGen.style}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {videoStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`group relative flex flex-col items-stretch text-left rounded-3xl overflow-hidden border-2 transition-all h-full ${
                  selectedStyle === style.id 
                    ? 'border-accent bg-accent/5 ring-4 ring-accent/5' 
                    : 'border-brand-border bg-brand-card hover:border-white/20'
                }`}
              >
                <div className="relative h-24 overflow-hidden">
                  <img src={style.img} alt={style.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-2 left-2">
                    <span className="px-1.5 py-0.5 bg-black/50 backdrop-blur-md rounded-md text-[7px] font-black uppercase tracking-widest text-white/70 border border-white/5">
                      {style.category}
                    </span>
                  </div>
                  {selectedStyle === style.id && (
                    <div className="absolute top-2 right-2 bg-accent text-white p-1 rounded-lg">
                      <CheckCircle2 size={12} />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className={`font-bold text-xs mb-1 ${selectedStyle === style.id ? 'text-accent' : 'text-white'}`}>
                    {style.label}
                  </h4>
                  <p className="text-[10px] text-text-secondary leading-tight line-clamp-1">
                    {style.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
              <Clock size={14} /> {t.videoGen.duration}
            </label>
            <div className="flex gap-2">
              {['5s', '10s', '15s'].map(d => (
                <button 
                  key={d} 
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${duration === d ? 'border-accent bg-accent/10 text-accent' : 'border-brand-border hover:border-white/20'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
              <Camera size={14} /> {t.videoGen.movement}
            </label>
            <select 
              value={selectedMovement}
              onChange={(e) => setSelectedMovement(e.target.value)}
              className="w-full bg-brand-bg/50 border border-brand-border rounded-xl p-3 text-sm focus:outline-none"
            >
              <option>Panning Left</option>
              <option>Panning Right</option>
              <option>Zoom In</option>
              <option>Zoom Out</option>
              <option>Crane Shot</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
              <Film size={14} /> {t.videoGen.quality}
            </label>
            <select className="w-full bg-brand-bg/50 border border-brand-border rounded-xl p-3 text-sm focus:outline-none" defaultValue="4k">
              <option value="4k">4K Ultra HD</option>
              <option value="hd">1080p HD</option>
              <option value="square">1080x1080 (Social)</option>
            </select>
          </div>
        </div>

        <button 
          onClick={() => setIsGenerating(true)}
          className="w-full py-4 sm:py-5 bg-white text-black rounded-2xl sm:rounded-[2rem] font-bold text-base sm:text-lg flex items-center justify-center gap-3 hover:bg-accent hover:text-white transition-all shadow-xl hover:shadow-accent/40 active:scale-95"
        >
          {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {isGenerating ? t.common.generating : t.videoGen.start}
        </button>
      </div>

      {isGenerating && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass aspect-video rounded-[3rem] overflow-hidden flex flex-col items-center justify-center relative group"
        >
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 10 }}
              className="h-full bg-accent"
              onAnimationComplete={() => {
                setIsGenerating(false);
                addProject({
                  title: prompt.slice(0, 30) || 'Untitled Scene',
                  type: 'video',
                  url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
                  prompt: prompt,
                  settings: { style: selectedStyle, movement: selectedMovement, duration }
                });
                setPrompt('');
              }}
            />
          </div>
          
          <Loader2 className="animate-spin text-accent mb-4" size={48} />
          <p className="text-xl font-bold font-display">{t.common.generating}...</p>
          <div className="flex gap-2 mt-4">
             <span className="px-2 py-1 bg-white/5 rounded text-[8px] font-black uppercase tracking-widest text-accent border border-accent/20">
               {selectedStyle}
             </span>
             <span className="px-2 py-1 bg-white/5 rounded text-[8px] font-black uppercase tracking-widest text-white/40 border border-white/5">
                {selectedMovement}
             </span>
             <span className="px-2 py-1 bg-white/5 rounded text-[8px] font-black uppercase tracking-widest text-white/40 border border-white/5">
                35mm Lens
             </span>
          </div>
          <p className="text-sm text-text-secondary mt-4">Rendering frames 0/1500</p>
        </motion.div>
      )}

      {!isGenerating && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold font-display">{t.home.recentCreationsTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="glass rounded-[3rem] overflow-hidden group relative aspect-video">
                <img src={`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600&sig=${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center scale-0 group-hover:scale-100 transition-transform">
                  <Play size={48} className="text-white" fill="currentColor" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <p className="text-sm font-bold truncate pr-4">Cyberpunk Sunset #{i}</p>
                  <span className="text-[10px] font-bold bg-black/50 px-2 py-1 rounded backdrop-blur-md">10s</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
