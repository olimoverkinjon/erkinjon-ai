import { motion } from 'motion/react';

interface GalleryProps {
  t: any;
}

export default function Gallery({ t }: GalleryProps) {
  const images = [
    { url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600', aspect: 'aspect-square' },
    { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600', aspect: 'aspect-video' },
    { url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=600', aspect: 'aspect-square' },
    { url: 'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&q=80&w=600', aspect: 'aspect-square' },
    { url: 'https://images.unsplash.com/photo-1620121692029-d088224efc74?auto=format&fit=crop&q=80&w=600', aspect: 'aspect-video' },
    { url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=600', aspect: 'aspect-square' },
  ];

  return (
    <section id="gallery" className="py-24 bg-lumina-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="font-display font-bold text-4xl mb-4">{t.title}</h2>
          <p className="text-lumina-500 max-w-md">{t.subtitle}</p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group cursor-pointer break-inside-avoid"
            >
              <div className="overflow-hidden rounded-[2rem] border border-white shadow-xl shadow-lumina-200">
                <img 
                  src={img.url} 
                  alt="Gallery AI" 
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] flex items-center justify-center backdrop-blur-sm">
                <div className="bg-white text-lumina-900 px-6 py-2 rounded-full font-bold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  View Prompt
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
