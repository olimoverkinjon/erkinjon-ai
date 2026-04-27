import { useState, useRef, useEffect, ChangeEvent, MouseEvent, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Loader2, Image as ImageIcon, Download, Maximize2, Wand2, Plus, X, Copy, Upload, CheckCircle2, RefreshCw, Square, Monitor, Smartphone, Tv, Layers, Edit3, Image, RectangleHorizontal, RectangleVertical, AlertCircle } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

interface GenerationResult {
  url: string;
  prompt: string;
  style?: string;
  ratio?: string;
  timestamp: number;
}

const styles = [
  { 
    id: 'cinematic', 
    label: 'Cinematic', 
    desc: 'Breathtaking lighting with deep shadows and professional color grading.',
    img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400',
    previewId: '1485846234645-a62644f84728',
    category: 'Realistic'
  },
  { 
    id: 'realistic', 
    label: 'Fotography', 
    desc: 'High-fidelity details captured with photographic precision.',
    img: 'https://images.unsplash.com/photo-1635311097240-5b2383c27056?auto=format&fit=crop&q=80&w=400',
    previewId: '1581091226825-a6a2a5aee158',
    category: 'Realistic'
  },
  { 
    id: 'anime', 
    label: 'Anime', 
    desc: 'Vibrant hand-drawn aesthetic inspired by modern Japanese animation.',
    img: 'https://images.unsplash.com/photo-1578632738981-43306725dc71?auto=format&fit=crop&q=80&w=400',
    previewId: '1613376023733-0d743d44fdad',
    category: 'Artistic'
  },
  { 
    id: '3d', 
    label: '3D Render', 
    desc: 'Clean, futuristic digital surfaces with soft octagonal lighting.',
    img: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=400',
    previewId: '1633356122544-f134324a6cee',
    category: 'Digital'
  },
  { 
    id: 'cyberpunk', 
    label: 'Cyberpunk', 
    desc: 'High-tech, low-life aesthetic with neon lights and rainy nights.',
    img: 'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&q=80&w=400',
    previewId: '1605810230434-7631ac76ec81',
    category: 'Digital'
  },
  { 
    id: 'oil-painting', 
    label: 'Oil Painting', 
    desc: 'Rich textures and visible brushstrokes for a classic fine arts feel.',
    img: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400',
    previewId: '1579783902614-a3fb3927b6a5',
    category: 'Artistic'
  },
];

const promptSuggestions = [
  { category: 'Subject', options: ['Astronaut', 'Cyberpunk City', 'Ancient Dragon', 'Robot', 'Floating Islet', 'Neon Fox'] },
  { category: 'Lighting', options: ['Golden Hour', 'Neon Glow', 'Volumetric', 'Soft Studio', 'Cinematic Mist', 'Moonlit'] },
  { category: 'Mood', options: ['Ethereal', 'Dark & Gritty', 'Whimsical', 'Nostalgic', 'Futuristic', 'Calm'] },
  { category: 'Environment', options: ['Mars colony', 'Rainy Tokyo', 'Deep space', 'Enchanted forest', 'Desert ruins'] },
];

const loadingStages = [
  { label: 'Initializing Engine', progress: 20, logs: ['Allocating VRAM', 'CUDA Core Sync', 'Loading Weights'] },
  { label: 'Diffusion Process', progress: 40, logs: ['Latent Mapping', 'Prompt Embedding', 'Text-Encoder Scan'] },
  { label: 'Latent Sampling', progress: 70, logs: ['Step 24/50', 'Guidance Tuning', 'Denoising Loop'] },
  { label: 'Deep Upscaling', progress: 90, logs: ['4x ESRGAN Pass', 'Edge Refinement', 'Color Grading'] },
  { label: 'Exporting Result', progress: 100, logs: ['Metadata Injected', 'Optimizing PNG', 'Final Sync'] },
];

const subStatuses = [
  'Allocating GPU memory...',
  'Parsing prompt intent...',
  'Denoising latent space...',
  'Interpreting style weights...',
  'Injecting lighting vectors...',
  'Refining edge contrast...',
  'Optimizing pixel density...',
  'Applying color harmony...',
  'Finalizing composition...',
];

const promptModifiers = {
  Lighting: ['Cinematic Lighting', 'Volumetric Fog', 'Golden Hour', 'Neon Glow', 'Ray Tracing', 'Studio Soft'],
  Mood: ['Ethereal', 'Moody', 'Vibrant', 'Dark & Gritty', 'Nostalgic', 'Minimalist'],
  Camera: ['Drone Shot', 'Macro Lens', 'Wide Angle', 'Fisheye', 'Portrait', 'Satellite View'],
  Medium: ['Digital Art', 'Oil Painting', '3D Render', 'Pencil Sketch', 'Watercolor', 'Pixel Art'],
};

const aspectRatios = [
  { id: '1:1', label: '1:1', icon: 'Square', class: 'aspect-square' },
  { id: '16:9', label: '16:9', icon: 'Monitor', class: 'aspect-video' },
  { id: '9:16', label: '9:16', icon: 'Smartphone', class: 'aspect-[9/16]' },
  { id: '4:5', label: '4:5', icon: 'Image', class: 'aspect-[4/5]' },
  { id: '3:2', label: '3:2', icon: 'RectangleHorizontal', class: 'aspect-[3/2]' },
  { id: '2:3', label: '2:3', icon: 'RectangleVertical', class: 'aspect-[2/3]' },
];

interface ImageGeneratorProps {
  t: any;
}

export default function ImageGenerator({ t }: ImageGeneratorProps) {
  const { addProject, notify } = useProjects();
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('cinematic');
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentSubStatus, setCurrentSubStatus] = useState(subStatuses[0]);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [history, setHistory] = useState<GenerationResult[]>(() => {
    const saved = localStorage.getItem('erkinjon_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [editingResult, setEditingResult] = useState<GenerationResult | null>(null);
  const [editMode, setEditMode] = useState<'inpaint' | 'outpaint' | null>(null);
  const [referenceImg, setReferenceImg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('erkinjon_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      setGenerationProgress(0);
      setCurrentStageIndex(0);
      
      // Update sub-status every 800ms to feel more active
      const statusInterval = setInterval(() => {
        const stage = loadingStages[currentStageIndex];
        const logs = stage?.logs || subStatuses;
        setCurrentSubStatus(logs[Math.floor(Math.random() * logs.length)]);
      }, 800);

      interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) return 100;
          const step = Math.random() * 8;
          const next = prev + step;
          
          // Update stage index based on progress
          const stageIndex = loadingStages.findIndex(s => s.progress > next);
          setCurrentStageIndex(stageIndex === -1 ? loadingStages.length - 1 : stageIndex);
          
          return next;
        });
      }, 300);

      return () => {
        clearInterval(interval);
        clearInterval(statusInterval);
      };
    } else {
      setGenerationProgress(0);
      setCurrentStageIndex(0);
    }
  }, [isGenerating]);

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPrompt(value);
    
    // Simple suggestion logic based on last word
    const words = value.split(' ');
    const lastWord = words[words.length - 1].toLowerCase();
    
    if (lastWord.length > 1) {
      const allOptions = [
        ...promptSuggestions.flatMap(c => c.options),
        ...Object.values(promptModifiers).flat()
      ];
      const filtered = allOptions.filter(opt => 
        opt.toLowerCase().includes(lastWord) && !value.toLowerCase().includes(opt.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const addSuggestion = (suggestion: string) => {
    const words = prompt.split(' ');
    words.pop(); // Remove the partial word
    const newPrompt = [...words, suggestion].join(' ').trim();
    setPrompt(newPrompt + ', ');
    setSuggestions([]);
  };

  const SURPRISE_PROMPTS = [
    "A cyberpunk city in the rain with neon reflections and flying vehicles, cinematic lighting, 8k resolution.",
    "Ethereal underwater kingdom with bioluminescent jellyfish and ancient coral palaces, dreamy atmosphere.",
    "A futuristic library in a nebula with books of light floating in zero gravity, vibrant cosmic colors.",
    "Portrait of a steampunk inventor with brass goggles and mechanical wings, highly detailed oil painting style.",
    "Hyper-realistic forest where the trees are made of pure emerald and silver bark, morning mist.",
    "An astronaut standing in a field of glass flowers on a purple planet with three moons, dramatic lighting.",
    "Surreal architecture where buildings are woven from silk and clouds, whimsical atmosphere.",
    "A cybernetic samurai in a digital cherry blossom garden, sharp focus, 3D render style.",
    "Ancient ruins of a Martian civilization with red sand and strange geometric monuments, cinematic scale.",
    "Abstract visualization of a dream, swirling colors and fragmented memories, artistic and emotional."
  ];

  const handleSurpriseMe = () => {
    const random = SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)];
    setPrompt(random);
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    // Simulate generation
    setTimeout(() => {
      const styleName = styles.find(s => s.id === selectedStyle)?.label || '';
      const currentPromptText = `${prompt}`;
      const timestamp = Date.now();
      const refId = referenceImg ? `&ref=${Math.random()}` : '';
      const newImages: GenerationResult[] = [
        { url: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800&sig=${Math.random()}${refId}&style=${selectedStyle}`, prompt: currentPromptText, style: selectedStyle, ratio: aspectRatio, timestamp },
        { url: `https://images.unsplash.com/photo-1620121692029-d088224efc74?auto=format&fit=crop&q=80&w=800&sig=${Math.random()}${refId}&style=${selectedStyle}`, prompt: currentPromptText, style: selectedStyle, ratio: aspectRatio, timestamp },
      ];
      
      setResults(newImages);
      setHistory(prev => [...newImages, ...prev]);
      
      // Save primary result to global history
      addProject({
        title: currentPromptText.slice(0, 30) + (currentPromptText.length > 30 ? '...' : ''),
        type: 'image',
        url: newImages[0].url,
        prompt: currentPromptText,
        settings: { style: selectedStyle, ratio: aspectRatio }
      });

      setIsGenerating(false);
      setActiveTab('current');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 5000);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const refinePrompt = (originalPrompt: string) => {
    setPrompt(originalPrompt);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVariations = (url: string, originalPrompt: string) => {
    setIsGenerating(true);
    // Simulate finding variations of the selected image
    setTimeout(() => {
      const baseUrl = url.split('&sig=')[0];
      const timestamp = Date.now();
      const newImages: GenerationResult[] = [
        { url: `${baseUrl}&sig=${Math.random()}`, prompt: originalPrompt, style: selectedStyle, ratio: aspectRatio, timestamp },
        { url: `${baseUrl}&sig=${Math.random()}`, prompt: originalPrompt, style: selectedStyle, ratio: aspectRatio, timestamp },
        { url: `${baseUrl}&sig=${Math.random()}`, prompt: originalPrompt, style: selectedStyle, ratio: aspectRatio, timestamp },
        { url: `${baseUrl}&sig=${Math.random()}`, prompt: originalPrompt, style: selectedStyle, ratio: aspectRatio, timestamp },
      ];
      setResults(newImages);
      setHistory(prev => [...newImages, ...prev]);
      setIsGenerating(false);
      setActiveTab('current');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 5000);
  };

  const addTag = (tag: string) => {
    if (prompt.includes(tag)) return;
    setPrompt(prev => prev ? `${prev}, ${tag}` : tag);
  };

  const handleDownload = async (url: string) => {
    try {
      notify('Starting download...');
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `erkinjon-ai-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      notify('File saved successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      notify('Download failed', 'error');
      window.open(url, '_blank');
    }
  };

  const filteredHistory = history.filter(item => 
    item.prompt.toLowerCase().includes(historySearchTerm.toLowerCase())
  );

  const reuseSettings = (item: GenerationResult) => {
    setPrompt(item.prompt);
    if (item.style) setSelectedStyle(item.style);
    if (item.ratio) setAspectRatio(item.ratio);
    setActiveTab('current');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
      {/* Search Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-2">
            <Sparkles size={14} /> {t.videoGen.templates}
          </label>
          <div className="flex items-center gap-4">
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-[9px] font-bold text-white/30 uppercase mr-1">{t.common.filter}:</span>
                  {suggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => addSuggestion(s)}
                      className="px-2 py-1 bg-accent/10 border border-accent/20 rounded-md text-[9px] font-bold text-accent hover:bg-accent hover:text-white transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-2 text-[10px] font-bold transition-all px-3 py-1.5 rounded-full border uppercase tracking-tighter ${referenceImg ? 'bg-accent/20 text-accent border-accent/30' : 'text-text-secondary hover:text-white bg-white/5 border-white/5'}`}
              >
                <Upload size={12} />
                {referenceImg ? (t.common.all === 'Все' ? 'Ссылка загружена' : t.common.all === 'Hammasi' ? 'Havola yuklandi' : 'Reference Loaded') : (t.common.all === 'Все' ? 'Загрузить фото' : t.common.all === 'Hammasi' ? 'Rasm yuklash' : 'Upload Image')}
              </button>
              <button 
                onClick={handleSurpriseMe}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:text-white transition-all bg-accent/5 hover:bg-accent px-4 py-2 rounded-full border border-accent/20 group/surprise"
              >
                <Wand2 size={12} className="group-hover/surprise:rotate-12 transition-transform" />
                {t.imageGen.promptExpert.split(' ')[0]}
              </button>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative glass p-2 rounded-2xl md:rounded-[2rem] flex flex-col items-stretch lg:flex-row lg:items-center gap-2 md:gap-4 shadow-2xl border-white/10 group-focus-within:border-accent/30 transition-all">
            <div className="flex-1 flex items-center gap-4 min-h-[64px]">
              <div className="flex items-center gap-1 pl-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                />
                {!referenceImg ? (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload reference image"
                    className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-all border border-dashed border-white/10"
                  >
                    <Upload size={20} />
                  </button>
                ) : (
                  <div className="relative group/ref">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-accent shadow-lg bg-black">
                      <img src={referenceImg} alt="Ref" className="w-full h-full object-cover" />
                    </div>
                    <button 
                      onClick={() => setReferenceImg(null)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
                    >
                      <X size={10} strokeWidth={3} />
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover/ref:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 relative flex items-center">
                <textarea
                  value={prompt}
                  onChange={handlePromptChange}
                  placeholder={t.imageGen.placeholder}
                  className="w-full bg-transparent px-2 py-3 md:py-4 text-base md:text-lg focus:outline-none placeholder:text-text-secondary/50 h-[100px] md:h-[64px] resize-none"
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-2 md:px-0">
              <button
                onClick={() => setShowBuilder(!showBuilder)}
                className={`p-3 rounded-xl transition-all ${showBuilder ? 'bg-accent text-white' : 'bg-white/5 text-text-secondary hover:text-white hover:bg-white/10'}`}
                title={t.imageGen.promptExpert}
              >
                <Plus size={20} className={showBuilder ? 'rotate-45 transition-transform' : 'transition-transform'} />
              </button>

              {prompt && (
                <button 
                  onClick={() => setPrompt('')}
                  className="p-3 text-text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full lg:w-auto px-6 md:px-8 py-4 bg-accent text-white rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent-light transition-all shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative min-w-[160px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>{t.common.generating}</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>{t.common.generate}</span>
                </>
              )}
              {isGenerating && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              )}
            </button>
          </div>
        </div>



        {/* Prompt Builder */}
        <AnimatePresence>
          {showBuilder && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative z-10"
            >
              <div className="glass rounded-3xl p-6 border-accent/20 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent">Smart Prompt Builder</h4>
                  <div className="flex gap-2">
                     <span className="text-[10px] text-text-secondary font-medium italic">Click tags to construct your scene</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(promptModifiers).map(([category, options]) => (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-3 bg-accent/40 rounded-full" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">{category}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => addTag(opt)}
                            className="px-3 py-1.5 bg-white/5 hover:bg-accent/10 border border-white/5 hover:border-accent/30 rounded-xl text-[10px] font-medium text-text-secondary hover:text-accent transition-all text-left group"
                          >
                            <Plus size={8} className="inline mr-1 opacity-40 group-hover:opacity-100" />
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Loading Animation */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass rounded-[2rem] p-8 space-y-6 border-accent/20 shadow-2xl relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[80px] -mr-32 -mt-32" />
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent ring-1 ring-accent/20">
                      <Loader2 className="animate-spin" size={24} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-accent uppercase tracking-[0.2em] block mb-1">Processing Stage {currentStageIndex + 1}</span>
                      <h4 className="text-xl font-bold text-white">
                        {loadingStages[currentStageIndex].label}...
                      </h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-white/20 font-mono tracking-tighter">
                      {Math.round(generationProgress)}%
                    </span>
                  </div>
                </div>
                
                {/* Segmented Progress Bar */}
                <div className="grid grid-cols-5 gap-2 relative h-3">
                  {loadingStages.map((stage, idx) => {
                    const isCompleted = idx < currentStageIndex;
                    const isProcessing = idx === currentStageIndex;
                    
                    return (
                      <div key={idx} className="relative h-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        {isCompleted && (
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            className="absolute inset-0 bg-accent shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                          />
                        )}
                        {isProcessing && (
                          <motion.div 
                            className="absolute inset-y-0 left-0 bg-accent shadow-[0_0_20px_rgba(59,130,246,0.8)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${((generationProgress - (idx > 0 ? loadingStages[idx-1].progress : 0)) / (stage.progress - (idx > 0 ? loadingStages[idx-1].progress : 0))) * 100}%` }}
                            transition={{ ease: "linear" }}
                          />
                        )}
                        {isProcessing && (
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute inset-0 bg-white/10"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                  {loadingStages.map((stage, idx) => (
                    <div 
                      key={stage.label} 
                      className={`flex items-center gap-1.5 transition-all duration-700 ${idx <= currentStageIndex ? 'text-accent opacity-100' : 'opacity-20'}`}
                    >
                      {idx < currentStageIndex ? <CheckCircle2 size={10} className="text-accent" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                      <span className="hidden sm:inline">Stage</span> {idx + 1}
                    </div>
                  ))}
                </div>

                {/* New Sub-Status Ticker */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, 12, 4] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1 bg-accent/40 rounded-full"
                      />
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentSubStatus}
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="text-[10px] font-medium text-white/40 italic"
                    >
                      {currentSubStatus}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Settings */}
        <div className="lg:col-span-3 space-y-8">
          {/* Aspect Ratio selection moved here for sidebar focus */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary ml-1 flex items-center gap-2">
              <Layers size={14} className="text-accent" /> {t.imageGen.aspectRatio}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {aspectRatios.map((ratio) => {
                const IconComponent = 
                  ratio.id === '1:1' ? Square : 
                  ratio.id === '16:9' ? Monitor : 
                  ratio.id === '9:16' ? Smartphone : 
                  ratio.id === '4:5' ? Image : 
                  ratio.id === '3:2' ? RectangleHorizontal : 
                  RectangleVertical;
                
                return (
                  <button
                    key={ratio.id}
                    onClick={() => setAspectRatio(ratio.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-xs font-bold ${
                      aspectRatio === ratio.id 
                        ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' 
                        : 'bg-white/5 text-text-secondary border-white/5 hover:border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <IconComponent size={16} />
                    {ratio.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Image to Image Reference */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary ml-1 flex items-center gap-2">
              <ImageIcon size={14} className="text-accent" /> {t.common.save.replace('Save', 'Source')}
            </h3>
            <div className={`p-4 rounded-3xl border-2 border-dashed transition-all ${referenceImg ? 'border-accent bg-accent/5' : 'border-brand-border bg-brand-card'}`}>
              {!referenceImg ? (
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-text-secondary">
                    <Upload size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-white">{t.common.all === 'Все' ? 'Загрузить' : t.common.all === 'Hammasi' ? 'Yuklash' : 'Upload File'}</p>
                    <p className="text-[10px] text-text-secondary mt-1">{t.common.all === 'Все' ? 'Фото-референс' : t.common.all === 'Hammasi' ? 'Rasm-namuna' : 'Image Reference'}</p>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 w-full py-2 bg-accent text-white rounded-xl text-xs font-bold shadow-lg shadow-accent/20 hover:bg-accent-light transition-all"
                  >
                    {t.common.all === 'Все' ? 'Выбрать файл' : t.common.all === 'Hammasi' ? 'Fayl tanlash' : 'Choose File'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-2xl overflow-hidden border border-accent/30 bg-black">
                    <img src={referenceImg} alt="Reference" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setReferenceImg(null)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <X size={12} strokeWidth={3} />
                    </button>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/5 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={14} /> {t.common.cancel === 'Отмена' ? 'Изменить' : t.common.cancel === 'Bekor qilish' ? 'O\'zgartirish' : 'Change Image'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Style Presets */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between px-1">
             <div className="flex items-center gap-3">
               <div className="w-1 h-6 bg-accent rounded-full" />
               <h3 className="text-xl font-bold font-display">{t.imageGen.style}</h3>
             </div>
             <div className="flex gap-2">
                {[t.common.all, 'Realistic', 'Artistic', 'Digital'].map(cat => (
                  <button key={cat} className="px-3 py-1 bg-white/5 text-[10px] font-bold uppercase tracking-widest rounded-full text-text-secondary hover:text-white transition-all">
                    {cat}
                  </button>
                ))}
             </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {styles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                onMouseEnter={() => setHoveredStyle(style.id)}
                onMouseLeave={() => setHoveredStyle(null)}
                className={`relative flex flex-col items-stretch text-left rounded-[2.5rem] overflow-hidden border-2 transition-all group h-full ${
                  selectedStyle === style.id 
                    ? 'border-accent bg-accent/5 ring-8 ring-accent/5 scale-[1.01] z-10' 
                    : 'border-brand-border bg-brand-card hover:border-white/20'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={style.img} alt={style.label} className={`w-full h-full object-cover transition-all duration-700 ${hoveredStyle === style.id ? 'scale-110 blur-[4px] opacity-40' : 'group-hover:scale-110'}`} />
                  
                  <AnimatePresence>
                    {hoveredStyle === style.id && prompt && (
                      <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        className="absolute inset-0 z-20 flex items-center justify-center p-4"
                      >
                        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/30 shadow-2xl bg-black/20">
                          <motion.img 
                            key={`${style.id}-${prompt.length}`}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={`https://images.unsplash.com/photo-${style.previewId}?auto=format&fit=crop&q=80&w=400&sig=${prompt.length}`} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                             <div className="flex items-center gap-2 mb-1.5">
                               <Sparkles size={10} className="text-accent animate-pulse" />
                               <span className="text-[8px] font-black text-white uppercase tracking-[0.3em]">AI Synthesis Draft</span>
                             </div>
                             <p className="text-[11px] font-bold text-white/90 line-clamp-2 leading-relaxed">
                               "{prompt.substring(0, 50)}..."
                             </p>
                          </div>
                          
                          {/* Laser Scan Effect */}
                          <motion.div 
                            className="absolute inset-x-0 h-[2px] bg-accent/50 shadow-[0_0_10px_rgba(59,130,246,0.8)] z-30"
                            animate={{ top: ['0%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-brand-card/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[8px] font-black uppercase tracking-widest text-white/70 border border-white/5">
                      {style.category}
                    </span>
                  </div>

                  {selectedStyle === style.id && (
                    <motion.div 
                      layoutId="style-badge"
                      className="absolute top-4 right-4 bg-accent text-white p-2 rounded-xl shadow-lg ring-4 ring-accent/20"
                    >
                      <CheckCircle2 size={16} />
                    </motion.div>
                  )}
                </div>
                
                <div className="p-6 pt-0">
                  <h4 className={`font-bold text-xl mb-2 transition-colors ${selectedStyle === style.id ? 'text-accent' : 'text-white'}`}>
                    {style.label}
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 font-medium">
                    {style.desc}
                  </p>
                </div>

                {selectedStyle === style.id && (
                  <div className="absolute inset-x-0 bottom-0 h-1.5 bg-accent shadow-[0_0_20px_rgba(59,130,246,1)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Gallery / Generation Grid */}
      <AnimatePresence mode="popLayout">
        {(results.length > 0 || history.length > 0 || isGenerating) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold font-display">
                  {isGenerating ? t.common.generating : activeTab === 'current' ? t.dashboard.image : t.imageGen.history}
                </h3>
                {activeTab === 'history' && history.length > 0 && (
                  <div className="relative group">
                    <input 
                      type="text"
                      placeholder={t.common.search}
                      value={historySearchTerm}
                      onChange={(e) => setHistorySearchTerm(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-1.5 text-xs focus:outline-none focus:border-accent/50 w-48 transition-all"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                <button
                  onClick={() => setActiveTab('current')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'current' ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                >
                  <Sparkles size={14} /> {t.common.all === 'Все' ? 'Текущие' : t.common.all === 'Hammasi' ? 'Joriy' : 'Current'}
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                >
                  <RefreshCw size={14} /> {t.common.all === 'Все' ? 'История' : t.common.all === 'Hammasi' ? 'Tarix' : 'History'}
                  {history.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-white/10 rounded-md text-[10px]">{history.length}</span>
                  )}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-6">
              {isGenerating ? (
                // Diffusion Ghost Grid
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={`ghost-${i}`}
                    className={`relative glass rounded-2xl md:rounded-[2.5rem] overflow-hidden ${aspectRatios.find(r => r.id === aspectRatio)?.class || 'aspect-square'} border-accent/10 shadow-inner group`}
                  >
                    {/* Animated Noise / Diffusion Pattern */}
                    <motion.div 
                      className="absolute inset-0 pointer-events-none"
                      animate={{ 
                        opacity: [0.1, 0.2, 0.1],
                        backgroundPosition: ['0% 0%', '100% 100%'],
                        filter: generationProgress > 80 ? 'blur(8px)' : 'none'
                      }}
                      transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                      }}
                    />

                    {/* Latent Bloom Effect */}
                    <motion.div 
                      className="absolute inset-0 bg-radial-gradient from-accent/20 to-transparent opacity-0"
                      animate={{ 
                        opacity: (generationProgress / 100) * 0.4,
                        scale: [0.95, 1.05, 0.95]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    
                    {/* Scanning Laser Line */}
                    <motion.div 
                      className="absolute inset-x-0 h-[2px] bg-accent/60 shadow-[0_0_30px_rgba(59,130,246,1)] z-10"
                      animate={{ top: ['-10%', '110%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
                    />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-8 text-center bg-black/40 backdrop-blur-[2px]">
                      <div className="relative">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                           <Loader2 className="text-accent/30" size={48} strokeWidth={1.5} />
                        </motion.div>
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Sparkles size={20} className="text-accent" />
                        </motion.div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Node {i + 1}</p>
                        <div className="flex flex-col items-center">
                          <p className="text-[12px] font-bold text-accent/60 flex items-center gap-2">
                             <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                             Processing Latents
                          </p>
                          <p className="text-[8px] font-mono text-white/20 mt-1">Guidance: 7.5 | Iteration: {Math.floor((generationProgress/100) * 50)}/50</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Fill (Subtle) */}
                    <div className="absolute inset-0 bg-accent/5 transition-all duration-300 pointer-events-none" style={{ height: `${generationProgress}%`, top: 'auto', bottom: 0 }} />
                  </div>
                ))
              ) : (
                (activeTab === 'current' ? results : filteredHistory).length === 0 ? (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center text-center space-y-4 opacity-50 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <ImageIcon size={24} className="text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">No items found</p>
                      <p className="text-[10px] text-text-secondary">{activeTab === 'current' ? 'Start generating to see results' : 'Try a different search term or generate more images'}</p>
                    </div>
                  </div>
                ) : (
                  (activeTab === 'current' ? results : filteredHistory).map((res, i) => (
                    <motion.div
                      key={`${res.timestamp}-${i}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={`group relative glass rounded-2xl md:rounded-[2.5rem] overflow-hidden ${aspectRatios.find(r => r.id === (res.ratio || aspectRatio))?.class || 'aspect-square'}`}
                    >
                      <img src={res.url} alt="Result" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                      
                      {/* Floating Prompt Tag for History */}
                      {activeTab === 'history' && (
                        <div className="absolute top-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                           <div className="glass px-3 py-2 rounded-xl border border-white/10 shadow-xl">
                              <p className="text-[10px] text-white line-clamp-2 leading-relaxed italic">
                                "{res.prompt}"
                              </p>
                           </div>
                        </div>
                      )}

                      {/* Overlay Controls */}
                      <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 bg-gradient-to-t from-black/90 to-transparent md:translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                          <button 
                            onClick={() => handleDownload(res.url)}
                            title="Download"
                            className="p-2.5 md:p-2 bg-accent text-white rounded-xl backdrop-blur-md transition-all hover:bg-accent-light"
                          >
                            <Download size={16} />
                          </button>
                          <button 
                            onClick={() => handleVariations(res.url, res.prompt)}
                            title="Generate Variations"
                            className="p-2.5 md:p-2 bg-white/10 text-white hover:bg-accent rounded-xl backdrop-blur-md transition-all group/btn"
                          >
                            <Layers size={16} className="group-hover/btn:rotate-12 transition-transform" />
                          </button>
                          <button 
                            onClick={() => reuseSettings(res)}
                            title="Reuse Settings (Style, Ratio, Prompt)"
                            className="p-2.5 md:p-2 bg-accent/20 text-accent border border-accent/30 hover:bg-accent hover:text-white rounded-xl backdrop-blur-md transition-all group/btn"
                          >
                            <RefreshCw size={16} className="group-hover/btn:rotate-90 transition-transform" />
                          </button>
                          <button 
                            onClick={() => setEditingResult(res)}
                            className="flex items-center gap-2 px-3 py-1 bg-white/10 text-white hover:bg-accent rounded-xl backdrop-blur-md transition-all group/btn border border-white/5"
                          >
                            <Edit3 size={16} className="group-hover/btn:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Edit</span>
                          </button>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] font-mono text-white/50">{new Date(res.timestamp).toLocaleDateString()}</p>
                          <div className="flex items-center gap-1 justify-end mt-1">
                             <div className="px-1 py-0.5 bg-white/10 rounded text-[7px] font-black uppercase text-white/40">{res.ratio || '1:1'}</div>
                             <div className="px-1 py-0.5 bg-white/10 rounded text-[7px] font-black uppercase text-white/40">{res.style || 'None'}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )
              )}
            </div>
            
            {activeTab === 'history' && history.length > 0 && (
              <div className="flex justify-center pt-8">
                <button 
                  onClick={() => {
                    if (confirm('Are you sure you want to clear your entire history?')) {
                      setHistory([]);
                      localStorage.removeItem('erkinjon_history');
                    }
                  }}
                  className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl text-xs font-bold border border-red-500/20 transition-all flex items-center gap-2"
                >
                  <X size={14} /> Clear History
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {results.length === 0 && !isGenerating && (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 opacity-30">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
            <ImageIcon size={40} className="text-text-secondary" />
          </div>
          <p className="text-lg font-medium">Start describing your imagination above</p>
        </div>
      )}

      {/* Image Editor Modal */}
      <AnimatePresence>
        {editingResult && (
          <ImageEditor 
            result={editingResult} 
            onClose={() => setEditingResult(null)}
            onGenerate={(newPrompt) => {
              setPrompt(newPrompt);
              setReferenceImg(editingResult.url);
              setEditingResult(null);
              setTimeout(() => handleGenerate(), 100);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ImageEditor({ result, onClose, onGenerate }: { result: GenerationResult, onClose: () => void, onGenerate: (prompt: string) => void }) {
  const [mode, setMode] = useState<'inpaint' | 'outpaint'>('inpaint');
  const [brushSize, setBrushSize] = useState(30);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const [hasMask, setHasMask] = useState(false);

  useEffect(() => {
    if (mode === 'inpaint' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.lineWidth = brushSize;
      }
    }
  }, [mode, brushSize]);

  const startDrawing = (e: MouseEvent | TouchEvent) => {
    isDrawingRef.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath(); // Reset path
    }
  };

  const draw = (e: MouseEvent | TouchEvent) => {
    if (!isDrawingRef.current || !canvasRef.current || mode !== 'inpaint') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasMask(true);
  };

  const clearMask = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasMask(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
    >
      <div className="relative w-full max-w-5xl glass rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row border-white/10 shadow-2xl">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all z-20"
        >
          <X size={20} />
        </button>

        {/* Left: Interactive Canvas */}
        <div className="flex-1 p-6 md:p-12 flex items-center justify-center bg-black/20">
          <div className="relative w-full aspect-square max-w-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-inner group">
            <img src={result.url} alt="To Edit" className="w-full h-full object-cover" />
            
            {mode === 'inpaint' && (
              <canvas
                ref={canvasRef}
                width={1024}
                height={1024}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
                className="absolute inset-0 w-full h-full cursor-crosshair z-10"
              />
            )}

            {mode === 'outpaint' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[80%] h-[80%] border-2 border-dashed border-accent/50 rounded-xl" />
                <div className="absolute inset-x-0 top-0 h-[10%] bg-accent/10 flex items-center justify-center text-[10px] font-black text-accent uppercase tracking-widest">Expansion Zone</div>
                <div className="absolute inset-x-0 bottom-0 h-[10%] bg-accent/10" />
                <div className="absolute inset-y-0 left-0 w-[10%] bg-accent/10" />
                <div className="absolute inset-y-0 right-0 w-[10%] bg-accent/10" />
              </div>
            )}
            
            {/* Tool Indicators */}
            <div className="absolute bottom-4 left-4 z-20 flex gap-2">
               <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/10 uppercase tracking-widest">
                 {mode === 'inpaint' ? 'In-painting Active' : 'Out-painting Active'}
               </div>
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="w-full md:w-80 p-8 border-l border-white/10 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-display">Targeted Editing</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Regenerate specific areas or expand the frame of your masterpiece.
            </p>
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
            <button
              onClick={() => setMode('inpaint')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${mode === 'inpaint' ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
            >
              <Edit3 size={16} /> In-paint
            </button>
            <button
              onClick={() => setMode('outpaint')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${mode === 'outpaint' ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
            >
              <Maximize2 size={16} /> Out-paint
            </button>
          </div>

          {mode === 'inpaint' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Brush Size</label>
                <span className="text-xs font-mono font-bold text-accent">{brushSize}px</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={brushSize} 
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-full accent-accent bg-white/5 rounded-full h-2 appearance-none cursor-pointer"
              />
              <button 
                onClick={clearMask}
                disabled={!hasMask}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/5 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} /> Reset Mask
              </button>
            </div>
          )}

          {mode === 'outpaint' && (
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Expansion Target</label>
               <div className="grid grid-cols-2 gap-2">
                 {['Extend Top', 'Extend Bottom', 'Extend Left', 'Extend Right'].map(dir => (
                   <button 
                    key={dir}
                    className="py-3 bg-white/5 hover:bg-accent/10 hover:border-accent/30 text-[10px] font-bold text-text-secondary hover:text-accent rounded-xl border border-white/5 transition-all"
                   >
                     {dir}
                   </button>
                 ))}
               </div>
            </div>
          )}

          <div className="pt-8 space-y-4">
            <button
              onClick={() => onGenerate(result.prompt)}
              className="w-full py-4 bg-accent text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-accent-light transition-all shadow-xl shadow-accent/20 group"
            >
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
              Apply Edits
            </button>
            <p className="text-[9px] text-center text-text-secondary uppercase tracking-[0.2em]">
              Changes will be applied to the next run
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
