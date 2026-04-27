import { motion } from 'motion/react';
import { Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Language } from '../translations';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: any;
}

export default function Navbar({ lang, setLang, t }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'uz', label: 'O\'zbekcha' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full blur-[1px]" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Lumina AI</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-lumina-600 hover:text-accent transition-colors">{t.features}</a>
          <a href="#gallery" className="text-sm font-medium text-lumina-600 hover:text-accent transition-colors">{t.gallery}</a>
          <a href="#pricing" className="text-sm font-medium text-lumina-600 hover:text-accent transition-colors">{t.pricing}</a>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="p-2 hover:bg-lumina-200 rounded-full transition-colors flex items-center gap-2 text-lumina-600"
            >
              <Globe size={20} />
              <span className="text-sm font-bold uppercase">{lang}</span>
            </button>
            
            {isLangOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-40 glass rounded-xl overflow-hidden shadow-xl"
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-white transition-colors ${lang === l.code ? 'bg-accent/10 text-accent font-bold' : 'text-lumina-700'}`}
                  >
                    {l.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <button className="hidden md:block px-5 py-2 text-sm font-bold text-lumina-900 hover:text-accent transition-colors">
            {t.login}
          </button>
          <button className="px-5 py-2.5 bg-lumina-900 text-white rounded-xl text-sm font-bold hover:bg-accent transition-all hover:shadow-lg hover:shadow-accent/20">
            {t.start}
          </button>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-lumina-900">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:hidden mt-2 glass rounded-2xl p-6 flex flex-col gap-4 shadow-2xl"
        >
          <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-left py-2 text-lg font-medium text-lumina-800">{t.features}</a>
          <a href="#gallery" onClick={() => setIsMenuOpen(false)} className="text-left py-2 text-lg font-medium text-lumina-800">{t.gallery}</a>
          <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-left py-2 text-lg font-medium text-lumina-800">{t.pricing}</a>
          <hr className="border-lumina-200" />
          <button className="text-left py-2 text-lg font-bold text-accent">{t.login}</button>
        </motion.div>
      )}
    </nav>
  );
}
