import { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, Loader2, Volume2, Music2, Share2, Download, Timer, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useProjects } from '../context/ProjectContext';

interface MusicItem {
  id: string;
  title: string;
  genre: string;
  mood: string;
  duration: number;
  bpm: number;
  timestamp: number;
}

interface MusicGeneratorProps {
  t: any;
}

export default function MusicGenerator({ t }: MusicGeneratorProps) {
  const { addProject } = useProjects();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [genre, setGenre] = useState('Ambient / Lo-fi');
  const [selectedMood, setSelectedMood] = useState('Chill');
  const [duration, setDuration] = useState(165); // 2:45 in seconds
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(72); // 1:12 in seconds
  const [generatedMusic, setGeneratedMusic] = useState<MusicItem | null>({
    id: 'initial',
    title: 'Echoes of the Void',
    genre: 'Cinematic',
    mood: 'Dark',
    duration: 165,
    bpm: 72,
    timestamp: Date.now()
  });
  const [history, setHistory] = useState<MusicItem[]>([]);

  const playbackRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && generatedMusic) {
      playbackRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= generatedMusic.duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (playbackRef.current) clearInterval(playbackRef.current);
    }
    return () => {
      if (playbackRef.current) clearInterval(playbackRef.current);
    };
  }, [isPlaying, generatedMusic]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setIsPlaying(false);
    
    // Simulate generation
    setTimeout(() => {
      const titles = [
        'Nebula Drift', 'Midnight Pulse', 'Solar Flare', 'Deep Resonance', 
        'Ancient Echo', 'Cyber Horizon', 'Ethereal Flow', 'Urban Rhythm'
      ];
      const newMusic: MusicItem = {
        id: Math.random().toString(36).substr(2, 9),
        title: titles[Math.floor(Math.random() * titles.length)],
        genre,
        mood: selectedMood,
        duration: duration,
        bpm: Math.floor(Math.random() * (140 - 60 + 1)) + 60,
        timestamp: Date.now()
      };
      
      setGeneratedMusic(newMusic);
      setHistory(prev => [newMusic, ...prev].slice(0, 5));
      setCurrentTime(0);
      
      // Save to global context
      addProject({
        title: newMusic.title,
        type: 'music',
        url: 'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&q=80&w=400',
        prompt: `A ${newMusic.mood} ${newMusic.genre} track at ${newMusic.bpm} BPM`,
        settings: { genre: newMusic.genre, mood: newMusic.mood, bpm: newMusic.bpm }
      });

      setIsGenerating(false);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-5xl font-display font-black text-gradient mb-4 tracking-tight">{t.musicGen.title}</h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">{t.musicGen.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-8 rounded-[3rem] space-y-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl -mr-16 -mt-16 group-hover:bg-accent/20 transition-colors" />
            
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary ml-1">{t.musicGen.genre}</label>
              <select 
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-accent transition-all appearance-none cursor-pointer"
              >
                <option>Ambient / Lo-fi</option>
                <option>Cinematic / Epic</option>
                <option>Cyberpunk / Techno</option>
                <option>Corporate / Uplifting</option>
                <option>Acoustic / Folk</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary ml-1">{t.musicGen.mood}</label>
              <div className="grid grid-cols-2 gap-3">
                {['Happy', 'Dark', 'Epic', 'Chill', 'Aggressive', 'Dreamy'].map(mood => (
                  <button 
                    key={mood} 
                    onClick={() => setSelectedMood(mood)}
                    className={`py-3 rounded-2xl border text-xs font-black uppercase tracking-tighter transition-all ${
                      selectedMood === mood 
                        ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' 
                        : 'border-brand-border text-text-secondary hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary">{t.videoGen.duration}</label>
                <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-full">{formatTime(duration)}</span>
              </div>
              <input 
                type="range" 
                min="30" 
                max="600" 
                step="30"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full accent-accent h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer" 
              />
              <div className="flex justify-between text-[8px] font-black text-text-secondary/40 uppercase tracking-widest">
                <span>0:30</span>
                <span>5:00</span>
                <span>10:00</span>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-5 bg-accent text-white rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-accent-light transition-all shadow-2xl shadow-accent/40 disabled:opacity-50 group"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Music size={20} className="group-hover:scale-110 transition-transform" />}
              {isGenerating ? t.common.generating : t.musicGen.start}
            </button>
          </div>

          {/* Volume Control */}
          <div className="glass p-6 rounded-[2rem] border border-white/5 flex items-center gap-4">
            <Volume2 size={20} className="text-text-secondary" />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="flex-1 accent-accent h-1 bg-white/5 rounded-lg appearance-none cursor-pointer" 
            />
            <span className="text-[10px] font-mono text-text-secondary w-8">{volume}%</span>
          </div>
        </div>

        {/* Player Canvas */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass p-6 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] border border-white/5 group bg-black/40">
             {/* Waveform Visualization Background */}
             <div className="absolute inset-0 flex items-center justify-center gap-1.5 px-12 opacity-10 pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      height: isPlaying ? [20, 100, 40, 80, 20] : 10 
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      delay: i * 0.05,
                      ease: "easeInOut"
                    }}
                    className="w-2 bg-accent rounded-full"
                  />
                ))}
             </div>

             <AnimatePresence mode="wait">
               {isGenerating ? (
                 <motion.div 
                   key="loading"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   className="relative z-10 flex flex-col items-center"
                 >
                   <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center border border-accent/30 mb-6">
                      <Loader2 className="text-accent animate-spin" size={32} />
                   </div>
                   <h3 className="text-xl font-bold font-display uppercase tracking-widest text-accent animate-pulse">{t.common.generating}</h3>
                 </motion.div>
               ) : generatedMusic ? (
                 <motion.div 
                   key="player"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="relative z-10 w-full max-w-md mx-auto"
                 >
                    {/* TITLE */}
                    <h2 className="text-3xl font-display font-black text-center mb-4 tracking-tight">
                      {generatedMusic.title}
                    </h2>

                    {/* TAGS */}
                    <div className="flex justify-center flex-wrap gap-2 mb-8">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-secondary rounded-full">
                        {generatedMusic.genre}
                      </span>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-secondary rounded-full">
                        {generatedMusic.mood}
                      </span>
                      <span className="px-3 py-1 bg-accent/20 border border-accent/30 text-[10px] font-black uppercase tracking-widest text-accent rounded-full font-mono">
                        {generatedMusic.bpm} BPM
                      </span>
                    </div>

                    {/* PLAY BUTTON */}
                    <div className="flex justify-center mb-10">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-24 h-24 bg-accent rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-accent/40 hover:scale-105 active:scale-95 transition-all group"
                      >
                        {isPlaying ? (
                          <Pause size={40} fill="currentColor" />
                        ) : (
                          <Play size={40} className="ml-2" fill="currentColor" />
                        )}
                      </button>
                    </div>

                    {/* PROGRESS + TIME */}
                    <div className="w-full mb-10">
                      <div className="flex justify-between text-[11px] font-mono font-bold text-text-secondary/60 mb-2">
                        <span className="text-accent">{formatTime(currentTime)}</span>
                        <span>{formatTime(generatedMusic.duration)}</span>
                      </div>

                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative group/progress cursor-pointer">
                        <motion.div
                          className="h-full bg-accent relative z-10"
                          initial={false}
                          animate={{ width: `${(currentTime / generatedMusic.duration) * 100}%` }}
                          transition={{ duration: 0.1, ease: "linear" }}
                        />
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex justify-center gap-4">
                      <button className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl">
                        <Download size={24} />
                      </button>

                      <button className="w-16 h-16 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all">
                        <Heart size={24} />
                      </button>
                    </div>
                 </motion.div>
               ) : (
                 <div className="relative z-10 text-center space-y-4">
                    <Music2 size={64} className="mx-auto text-white/10" />
                    <p className="text-text-secondary font-bold">Your masterpieces appear here</p>
                 </div>
               )}
             </AnimatePresence>
          </div>

          <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
               <h4 className="text-xs font-black uppercase tracking-[0.3em] text-text-secondary">{t.musicGen.archives}</h4>
               <button className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">{t.common.clear}</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {history.length > 0 ? history.map((item) => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => {
                       setGeneratedMusic(item);
                       setCurrentTime(0);
                    }}
                    className="glass p-5 rounded-[2rem] flex items-center justify-between hover:bg-white/5 border border-white/5 cursor-pointer group transition-all hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                        <Music2 size={24} />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-sm font-bold truncate">{item.title}</div>
                        <div className="flex items-center gap-2 text-[8px] text-text-secondary font-black uppercase tracking-widest mt-0.5">
                          <span>{item.genre}</span>
                          <span className="w-0.5 h-0.5 bg-white/20 rounded-full" />
                          <span>{formatTime(item.duration)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-2 text-text-secondary hover:text-white transition-colors opacity-0 group-hover:opacity-100"><Download size={16} /></button>
                      <div className="w-10 h-10 rounded-full border border-accent/20 flex items-center justify-center text-accent group-hover:border-accent transition-colors">
                        <Play size={16} fill="currentColor" className="ml-0.5" />
                      </div>
                    </div>
                  </motion.div>
                )) : [1, 2].map(i => (
                  <div key={i} className="glass p-5 rounded-[2rem] border border-white/5 opacity-30 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl" />
                    <div className="space-y-2 flex-1">
                       <div className="w-1/2 h-2 bg-white/10 rounded" />
                       <div className="w-1/4 h-2 bg-white/10 rounded" />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

