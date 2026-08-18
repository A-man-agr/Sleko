'use client';

import React from 'react';
import { ArrowRightIcon, SparklesIcon, TruckIcon, ShieldCheckIcon, RotateCcwIcon } from './Icons';

interface HeroProps {
  onExploreClick: () => void;
  onSelectCategory: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onSelectCategory }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-zinc-900 text-white py-16 lg:py-24 border-b border-zinc-800">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <SparklesIcon className="w-4 h-4 text-indigo-400" />
              <span>Multipurpose E-Commerce Redefined • 2026 Collection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-sans">
              Crafted for Modern <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-200">
                Lifestyle & Innovation.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-normal mx-auto lg:mx-0">
              Discover <span className="font-semibold text-white">Slekco</span> — an orchestrated multi-brand ecosystem bringing together high-fidelity tech, minimalist fashion, architectural living, and botanical beauty.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:translate-y-[-1px]"
              >
                <span>Explore Catalog</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectCategory('electronics')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-sm transition-all"
              >
                Featured Tech & Luxe
              </button>
            </div>

            {/* Value Props Row */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/10 text-slate-400 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <TruckIcon className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>2-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcwIcon className="w-5 h-5 text-amber-400 shrink-0" />
                <span>30-Day Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Right Visual Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl bg-slate-900/80 border border-slate-800 p-4 shadow-2xl backdrop-blur-xl group hover:border-indigo-500/40 transition-colors">
              {/* Product preview hero item */}
              <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-800">
                <img
                  src="/p_assets/images.jpg"
                  alt="Slekco Pro Sound ANC Headphones"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />

                {/* Floating Badge */}
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-300 border border-indigo-500/30">
                  Slekco Tech • Best Seller
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <div className="text-xs font-semibold uppercase text-indigo-400 tracking-wider">Spotlight Item</div>
                  <h3 className="text-xl font-bold">Slekco Pro Sound ANC Headphones</h3>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-2xl font-black text-white">$249.99 <span className="text-xs font-normal line-through text-slate-400">$299.99</span></span>
                    <button
                      onClick={() => onSelectCategory('electronics')}
                      className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-lg shadow hover:bg-slate-100 transition-colors"
                    >
                      View Spec
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
