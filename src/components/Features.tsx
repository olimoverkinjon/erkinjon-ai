import { motion } from 'motion/react';
import { Video, Wand2, Layers, Cpu } from 'lucide-react';

interface FeaturesProps {
  t: any;
}

export default function Features({ t }: FeaturesProps) {
  const icons = [Video, Wand2, Layers];
  
  const featureList = [
    { key: 'videoGen', icon: Video },
    { key: 'imageEdit', icon: Wand2 },
    { key: 'multiModal', icon: Layers },
  ];

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      {/* Texture Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-4xl mb-4"
          >
            {t.title}
          </motion.h2>
          <div className="w-16 h-1.5 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featureList.map((feature, idx) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="p-8 rounded-[2rem] bg-lumina-50 border border-lumina-100 hover:border-accent/30 transition-all hover:shadow-2xl hover:shadow-accent/5 group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-accent mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <feature.icon size={32} />
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-lumina-800">
                {t[feature.key].title}
              </h3>
              <p className="text-lumina-500 leading-relaxed text-sm">
                {t[feature.key].desc}
              </p>
              
              <div className="mt-8 pt-8 border-t border-lumina-200/50 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-lumina-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + idx * 5}`} alt="User" />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-accent-soft text-accent text-[10px] font-bold flex items-center justify-center">
                    +12k
                  </div>
                </div>
                <button className="text-xs font-bold text-accent uppercase tracking-wider hover:underline underline-offset-4">
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
