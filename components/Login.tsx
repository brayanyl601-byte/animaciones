import React, { useState } from 'react';
import { Lock, ShieldCheck, X } from 'lucide-react';

interface LoginModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onSuccess, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'experto04') {
      onSuccess();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-purple-500 shadow-inner border border-slate-700">
            {error ? <Lock size={24} className="text-red-500" /> : <ShieldCheck size={24} />}
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-white text-center mb-2">Modo Administrador</h2>
        <p className="text-slate-400 text-center text-xs mb-6 px-4">
          Ingresa la clave maestra para subir o eliminar animaciones.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
             <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Clave de acceso"
              className={`w-full bg-slate-950 border ${error ? 'border-red-500 text-red-500' : 'border-slate-700 text-white'} rounded-xl px-4 py-3 placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-center tracking-widest`}
              autoFocus
            />
          </div>
          
          {error && (
            <p className="text-red-400 text-[10px] text-center font-bold animate-pulse">
              CLAVE INCORRECTA
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 active:scale-95 text-sm"
          >
            Desbloquear Panel
          </button>
        </form>
      </div>
    </div>
  );
};