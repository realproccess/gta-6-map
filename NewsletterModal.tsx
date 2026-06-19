import React, { useState } from 'react';
import { Paperclip, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from './supabaseClient';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [emailMessage, setEmailMessage] = useState('');

  const [feedback, setFeedback] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  if (!isOpen) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setEmailStatus('loading');
      import('./haptics').then(m => m.Haptics.heavy());

      const { error } = await supabase
        .from('subscribers')
        .insert([{ email }]);

      if (error) throw error;

      setEmailStatus('success');
      setEmailMessage('Successfully subscribed!');
      setEmail('');
    } catch (err: any) {
      console.error('Subscription error:', err);
      setEmailStatus('error');
      setEmailMessage(err.message || 'Failed to subscribe. Please try again.');
    }
  };

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback && !file) return;

    try {
      setFeedbackStatus('loading');
      import('./haptics').then(m => m.Haptics.heavy());

      let file_url = null;

      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('File size exceeds 5MB limit.');
        }

        // Allowlist of safe MIME types — reject anything that could be executed
        // or rendered as HTML/script (svg, html, js, etc.)
        const ALLOWED_MIME_TYPES = new Set([
          'image/jpeg', 'image/png', 'image/gif', 'image/webp',
          'application/pdf',
        ]);
        if (!ALLOWED_MIME_TYPES.has(file.type)) {
          throw new Error('Unsupported file type. Please upload an image (JPEG, PNG, GIF, WEBP) or PDF.');
        }

        const fileExt = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
        // Use cryptographically random UUID instead of Math.random()
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('feedback-attachment')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('feedback-attachment')
          .getPublicUrl(fileName);
          
        file_url = publicUrlData.publicUrl;
      }

      const { error: dbError } = await supabase
        .from('feedback')
        .insert([{ message: feedback, file_url }]);

      if (dbError) throw dbError;

      setFeedbackStatus('success');
      setFeedbackMessage('Message sent successfully! Thank you.');
      setFeedback('');
      setFile(null);
    } catch (err: any) {
      console.error('Feedback error:', err);
      setFeedbackStatus('error');
      setFeedbackMessage(err.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="stay-updated-modal stay-updated-modal-container ui-panel w-full max-w-lg relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="modal-close-btn text-gray-500 hover:text-white text-lg font-black"
        >
          ✕
        </button>

        {/* SECTION 1: Stay Updated */}
        <div className="mb-8 border-b border-white/10 pb-8 mt-2">
          {/* GTA 6 Themed 3D Header */}
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white drop-shadow-[3px_3px_0px_#ec4899] mb-3 transform -skew-x-6">
            Stay Updated
          </h2>
          <p className="text-xs text-gray-300 mb-5 leading-relaxed font-bold tracking-wide">
            Get the latest GTA 6 news, map discoveries, feature releases, and community updates delivered directly to your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2 relative">
            <input 
              type="email" 
              placeholder="Email Address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={emailStatus === 'loading'}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold placeholder-gray-600 focus:outline-none focus:border-pink-500/50 transition-colors disabled:opacity-50"
              required
            />
            <button 
              type="submit"
              disabled={emailStatus === 'loading' || !email}
              className="px-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black uppercase tracking-widest text-[11px] rounded-xl transition-all shadow-lg shadow-pink-600/20 transform hover:-translate-y-0.5 haptic-btn disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
            >
              {emailStatus === 'loading' ? <Loader2 size={16} className="animate-spin" /> : 'Subscribe'}
            </button>
          </form>
          {emailStatus === 'success' && (
            <p className="text-green-400 text-xs font-bold mt-2 flex items-center gap-1"><CheckCircle2 size={12} /> {emailMessage}</p>
          )}
          {emailStatus === 'error' && (
            <p className="text-red-400 text-xs font-bold mt-2 flex items-center gap-1"><AlertCircle size={12} /> {emailMessage}</p>
          )}
        </div>

        {/* SECTION 2: Contact Us */}
        <form onSubmit={handleFeedback} className="pb-2">
          {/* GTA 6 Themed 3D Header */}
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white drop-shadow-[3px_3px_0px_#8b5cf6] mb-3 transform -skew-x-6">
            Comms & Feedback
          </h2>
          <p className="text-xs text-gray-300 mb-5 leading-relaxed font-bold tracking-wide">
            Have a question about the map? Found a bug? Want to suggest a feature? Send us a message below and we'll get back to you as soon as possible.
          </p>
          
          <textarea 
            placeholder="Your Message" 
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={feedbackStatus === 'loading'}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold placeholder-gray-600 focus:outline-none focus:border-purple-500/50 resize-none mb-3 transition-colors disabled:opacity-50"
            required={!file}
          />
          
          {/* NEW: Attach Image / File Button */}
          <div className="flex items-center gap-3 mb-5">
            <label className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 ${file ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 hover:bg-white/10 border-white/10'} border rounded-xl transition-all text-[10px] font-black text-gray-300 uppercase tracking-widest`}>
              <Paperclip size={14} className={file ? 'text-purple-300' : 'text-purple-400'} />
              {file ? 'File Attached' : 'Attach Image / File'}
              <input 
                type="file" 
                className="hidden" 
                accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                disabled={feedbackStatus === 'loading'}
              />
            </label>
            <div className="flex flex-col">
              {file && (
                <span className="text-xs font-bold text-white mb-0.5 truncate max-w-[150px] sm:max-w-[200px]">
                  {file.name}
                </span>
              )}
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                Max Size: 5MB
              </span>
            </div>
            {file && (
              <button 
                type="button" 
                onClick={() => setFile(null)}
                className="ml-auto text-xs text-gray-500 hover:text-red-400 font-bold uppercase tracking-widest"
                disabled={feedbackStatus === 'loading'}
              >
                Clear
              </button>
            )}
          </div>

          <button 
            type="submit"
            disabled={feedbackStatus === 'loading' || (!feedback && !file)}
            className="w-full py-4 bg-white hover:bg-gray-200 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all transform hover:-translate-y-0.5 shadow-xl disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {feedbackStatus === 'loading' ? <Loader2 size={16} className="animate-spin text-black" /> : 'Send Message'}
          </button>
          
          {feedbackStatus === 'success' && (
            <p className="text-green-400 text-xs font-bold mt-3 flex items-center gap-1 justify-center"><CheckCircle2 size={12} /> {feedbackMessage}</p>
          )}
          {feedbackStatus === 'error' && (
            <p className="text-red-400 text-xs font-bold mt-3 flex items-center gap-1 justify-center"><AlertCircle size={12} /> {feedbackMessage}</p>
          )}
        </form>

      </div>
    </div>
  );
}
