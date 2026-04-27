import { motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';

interface HeroProps {
  t: any;
}

export default function Hero({ t }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-accent/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-1/3 bg-lumina-300/20 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-soft text-accent text-xs font-bold rounded-full mb-6 tracking-wide uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            {t.badge}
          </div>
          
          <h1 className="font-display font-bold text-5xl lg:text-7xl leading-tight mb-6 text-gradient">
            {t.title}
          </h1>
          
          <p className="text-xl text-lumina-600 mb-10 leading-relaxed max-w-lg">
            {t.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <button className="px-8 py-4 bg-accent text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-accent-light transition-all shadow-xl shadow-accent/25 hover:scale-105">
              {t.cta} <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-white text-lumina-900 border border-lumina-200 rounded-2xl font-bold flex items-center gap-2 hover:bg-lumina-50 transition-all hover:border-accent group">
              <span className="w-10 h-10 bg-lumina-100 rounded-full flex items-center justify-center group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                <Play size={16} fill="currentColor" />
              </span>
              {t.explore}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/50">
            <img 
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000" 
              alt="AI Video Gen" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-lumina-900/40 to-transparent" />
          </div>
          
          {/* Glass Card Overlay */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute -bottom-6 -left-6 p-6 glass rounded-2xl max-w-64"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <Play size={18} fill="currentColor" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-lumina-500">Live Preview</div>
            </div>
            <p className="text-sm font-medium text-lumina-800">Prompt: "Futuristic city in light blue neon aesthetic, drone shot..."</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
