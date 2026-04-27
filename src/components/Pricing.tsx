import { motion } from 'motion/react';
import { Check, Zap, Sparkles, Building2 } from 'lucide-react';
import { useState } from 'react';

interface PricingProps {
  t: any;
}

export default function Pricing({ t }: PricingProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    { 
      key: 'free', 
      icon: Zap, 
      color: 'text-lumina-500', 
      bg: 'bg-lumina-100',
      popular: false 
    },
    { 
      key: 'pro', 
      icon: Sparkles, 
      color: 'text-accent', 
      bg: 'bg-accent/10',
      popular: true 
    },
    { 
      key: 'enterprise', 
      icon: Building2, 
      color: 'text-lumina-800', 
      bg: 'bg-lumina-200/50',
      popular: false 
    },
  ];

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -z-10 w-full h-full bg-accent/5 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-4xl md:text-5xl mb-4 text-gradient"
          >
            {t.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lumina-500 max-w-2xl mx-auto"
          >
            {t.subtitle}
          </motion.p>

          {/* Billing Toggle */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-accent' : 'text-lumina-400'}`}>
              {t.monthly}
            </span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-8 bg-lumina-200 rounded-full relative p-1 transition-colors hover:bg-lumina-300"
            >
              <motion.div 
                animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
                className="w-6 h-6 bg-white rounded-full shadow-sm"
              />
            </button>
            <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-accent' : 'text-lumina-400'}`}>
              {t.yearly} <span className="ml-1 text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full">-20%</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, idx) => {
            const planData = t[plan.key];
            const price = billingCycle === 'monthly' ? planData.price : Math.floor(planData.price * 0.8 * 12);

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                className={`flex flex-col h-full p-8 rounded-[2.5rem] glass border-2 transition-all duration-500 hover:scale-[1.02] ${
                  plan.popular ? 'border-accent shadow-2xl shadow-accent/10 relative z-10' : 'border-white/50 hover:border-accent/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-xl">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <div className={`w-14 h-14 ${plan.bg} rounded-2xl flex items-center justify-center ${plan.color} mb-6`}>
                    <plan.icon size={28} />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-lumina-900 mb-2">{planData.name}</h3>
                  <p className="text-sm text-lumina-500 leading-relaxed mb-6">{planData.desc}</p>
                  
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-lumina-900">${price}</span>
                    <span className="text-lumina-400 text-sm font-medium">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                </div>

                <div className="flex-grow space-y-4 mb-10">
                  {planData.features.map((feature: string, fIdx: number) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className="text-sm font-medium text-lumina-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-4 rounded-2xl font-bold transition-all transform active:scale-95 ${
                  plan.popular 
                    ? 'bg-accent text-white shadow-xl shadow-accent/25 hover:bg-accent-light' 
                    : 'bg-lumina-900 text-white hover:bg-accent'
                }`}>
                  {planData.cta}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
