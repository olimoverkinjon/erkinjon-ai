import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mail, Lock, Chrome, ArrowRight, Github, Phone, Hash, Globe, AlertCircle } from 'lucide-react';
import { Language } from '../translations';

interface AuthProps {
  onLogin: () => void;
  t: any;
  lang: Language;
  setLang: (lang: Language) => void;
}

export default function Auth({ onLogin, t, lang, setLang }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (authMethod === 'email') {
      if (!email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    } else {
      if (phone.length < 9) {
        setError('Please enter a valid phone number');
        return;
      }
      if (code.length < 4) {
        setError('Please enter the 6-digit verification code');
        return;
      }
    }

    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-brand-bg px-6">
      {/* Language Switcher on Auth Screen */}
      <div className="absolute top-6 right-6 z-50">
        <div className="flex items-center gap-2 glass px-3 py-2 rounded-xl border border-white/10">
          <Globe size={14} className="text-text-secondary" />
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as Language)}
            className="bg-transparent text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer text-white"
          >
            <option value="en" className="bg-brand-bg">EN</option>
            <option value="ru" className="bg-brand-bg">RU</option>
            <option value="uz" className="bg-brand-bg">UZ</option>
          </select>
        </div>
      </div>

      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[150px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[150px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-6 glow-box shadow-xl shadow-accent/30 transform -rotate-3 hover:rotate-0 transition-transform">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="font-display font-bold text-3xl mb-2 text-gradient">{t.title}</h1>
          <p className="text-text-secondary text-sm">{t.subtitle}</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => onLogin()}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 hover:border-white/20 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent/20 transition-colors shrink-0">
              <Chrome size={18} className="group-hover:text-accent transition-colors" />
            </div>
            <span className="font-bold text-sm">{t.google}</span>
          </button>
        </div>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
          <span className="relative px-4 bg-brand-bg text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary block text-center">{t.methods}</span>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl mb-8 border border-white/5">
          <button
            onClick={() => setAuthMethod('email')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${authMethod === 'email' ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
          >
            <Mail size={14} /> {t.email}
          </button>
          <button
            onClick={() => setAuthMethod('phone')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${authMethod === 'phone' ? 'bg-accent text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
          >
            <Phone size={14} /> {t.phone}
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-100/80 text-xs font-bold"
            >
              <AlertCircle size={16} className="text-red-500" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {authMethod === 'email' ? (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">{t.emailLabel}</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" size={18} />
                    <input 
                      type="email" 
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">{t.passLabel}</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" size={18} />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all text-sm"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">{t.phoneLabel}</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" size={18} />
                    <input 
                      type="tel" 
                      placeholder="+998 -- --- -- --"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-1">{t.codeLabel}</label>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="6-digit code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all text-sm text-center tracking-[0.5em] font-bold"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            className="w-full py-4 bg-accent text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent-light transition-all shadow-xl shadow-accent/20 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative">
              {isLogin ? t.signIn : t.signUp}
            </span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform relative" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary hover:text-accent transition-colors"
          >
            {isLogin ? t.toSignUp : t.toSignIn}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
