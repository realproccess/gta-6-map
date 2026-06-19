import React from 'react';
import { X, Lock, Bell } from 'lucide-react';

export default function ComingSoonModal({ isOpen, onClose, title, onOpenNewsletter }: { isOpen: boolean; onClose: () => void; title: string; onOpenNewsletter?: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="ui-panel relative w-full max-w-sm text-center animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="modal-close-btn text-gray-500 hover:text-white">
          <X size={20} />
        </button>
        
        <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={32} className="text-white" />
        </div>
        
        <h2 className="text-2xl font-black italic text-white mb-2">{title}</h2>
        <p className="text-gray-400 mb-6 text-sm">
          We are currently building this database for launch day. Sign up and subscribe to get notified the moment it goes live!
        </p>
        
        <button 
          onClick={() => {
            onClose();
            if (onOpenNewsletter) onOpenNewsletter();
          }}
          className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <Bell size={18} /> GET NOTIFIED
        </button>
      </div>
    </div>
  );
}
