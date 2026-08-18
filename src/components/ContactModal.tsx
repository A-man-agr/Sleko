'use client';

import React, { useState } from 'react';
import { ContactFormData } from '@/types/product';
import { XIcon, CheckCircleIcon, SparklesIcon } from './Icons';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState<{ success?: boolean; message?: string; ticketId?: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResponseMessage(data);
    } catch {
      setResponseMessage({ success: false, message: 'Failed to send message.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 my-8 z-10 animate-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Slekco Support Concierge</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {responseMessage ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircleIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Inquiry Received</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
              {responseMessage.message}
            </p>
            {responseMessage.ticketId && (
              <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 inline-block">
                Ticket Reference: {responseMessage.ticketId}
              </div>
            )}
            <div>
              <button
                onClick={() => {
                  setResponseMessage(null);
                  onClose();
                }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white font-bold text-xs"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Alex Morgan"
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@domain.com"
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Product Support">Product Support / Specs</option>
                <option value="Order Tracking">Order Tracking</option>
                <option value="Wholesale & Partnership">Wholesale & Partnership</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Message *
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How can our brand specialists assist you today?"
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              {isSubmitting ? 'Sending inquiry...' : 'Submit Inquiry to Concierge'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
