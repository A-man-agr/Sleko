'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SparklesIcon, CheckCircleIcon, DatabaseIcon } from './Icons';

interface FooterProps {
  onOpenSchemaModal?: () => void;
  onOpenContactModal?: () => void;
  onSelectCategory?: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSchemaModal,
  onOpenContactModal,
  onSelectCategory,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Newsletter Grid */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Slekco Insider Club</span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight">
              Get 10% Off Your First Slekco Purchase
            </h3>
            <p className="text-xs text-slate-300 max-w-md">
              Subscribe to unlock private drop access, new brand collection reveals, and member-only promotions.
            </p>
          </div>

          <div className="lg:col-span-5">
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Subscribed! Use promo code <strong>SLEKCO10</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-md shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-xs text-slate-400">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white text-slate-900 font-bold flex items-center justify-center text-lg">
                S
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                SLEKCO<span className="text-indigo-500">.</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Slekco is a modern multipurpose e-commerce platform blending curated electronics, luxury apparel, architectural home decor, and botanical skincare.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenSchemaModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400 font-semibold hover:border-indigo-500/50"
              >
                <DatabaseIcon className="w-4 h-4" />
                <span>View DB Schema</span>
              </button>
              <button
                onClick={onOpenContactModal}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-semibold hover:text-white"
              >
                Support Concierge
              </button>
            </div>
          </div>

          {/* Slekco Brands */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Sub-Brands</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => onSelectCategory?.('electronics')} className="hover:text-white transition-colors">
                  Slekco Tech
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory?.('fashion')} className="hover:text-white transition-colors">
                  Slekco Luxe
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory?.('home')} className="hover:text-white transition-colors">
                  Slekco Living
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory?.('beauty')} className="hover:text-white transition-colors">
                  Slekco Glow
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Categories</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => onSelectCategory?.('electronics')} className="hover:text-white transition-colors">
                  Electronics & Audio
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory?.('fashion')} className="hover:text-white transition-colors">
                  Apparel & Outerwear
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory?.('home')} className="hover:text-white transition-colors">
                  Home & Lighting
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory?.('beauty')} className="hover:text-white transition-colors">
                  Serums & Oils
                </button>
              </li>
            </ul>
          </div>

          {/* Assessment Technical Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Technical Stack</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400 font-mono">
              <li>Next.js 16 (App Router)</li>
              <li>React 19 & TypeScript</li>
              <li>Tailwind CSS 4</li>
              <li>REST API Endpoints</li>
              <li>PostgreSQL / Prisma DB</li>
            </ul>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© 2026 Slekco E-Commerce Platform. Web Developer Assessment Submission.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <Link href="#" className="hover:underline">Terms of Service</Link>
            <Link href="#" className="hover:underline">API Documentation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
