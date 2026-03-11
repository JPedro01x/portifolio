import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, Edit3, Shield, Save, Check } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { LoginModal } from './LoginModal';
import { publishCurrentToRemote } from '../services/remoteContentService';

export function AdminButton() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { user, logout, isAuthenticated } = useAuth();

  const handleSave = async () => {
    console.log("DEBUG - AdminButton handleSave called");
    setSaveError(null);
    window.dispatchEvent(new Event('admin-save'));
    try {
      console.log("DEBUG - Calling publishCurrentToRemote...");
      await publishCurrentToRemote();
      console.log("DEBUG - publishCurrentToRemote success");
      setShowSaved(true);
      window.setTimeout(() => setShowSaved(false), 2000);
    } catch (error) {
      console.log("DEBUG - publishCurrentToRemote error:", error);
      setSaveError('Falha ao publicar. Faça login novamente e tente de novo.');
    }
  };

  if (isAuthenticated) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-6 left-6 z-[9999]"
        >
          {showSaved && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute -top-10 left-0 flex items-center gap-2 rounded-xl bg-green-500/20 px-3 py-2 text-xs font-medium text-green-600 backdrop-blur-sm"
            >
              <Check className="h-4 w-4" />
              Salvo!
            </motion.div>
          )}
          {saveError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute -top-10 left-0 flex items-center rounded-xl bg-red-500/20 px-3 py-2 text-xs font-medium text-red-600 backdrop-blur-sm"
            >
              {saveError}
            </motion.div>
          )}
          <div className="flex items-center gap-3 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-3 shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white shadow-lg">
                <Shield className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground">Admin</span>
                <span className="text-sm font-semibold text-foreground">{user?.username}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 ml-2 pl-2 border-l border-white/20">
              <button
                onClick={handleSave}
                className="p-2 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-all hover:scale-110"
                title="Salvar alterações"
              >
                <Save className="h-4 w-4" />
              </button>
              <button
                onClick={() => window.location.reload()}
                className="p-2 rounded-xl bg-green-500/20 text-green-600 hover:bg-green-500/30 transition-all hover:scale-110"
                title="Modo edição ativado"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-xl bg-red-500/20 text-red-600 hover:bg-red-500/30 transition-all hover:scale-110"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
        
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </>
    );
  }

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsLoginOpen(true)}
        className="absolute top-6 left-6 z-[9999] group"
      >
        <div className="flex items-center gap-3 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-lg border border-white/20 rounded-2xl px-5 py-3 shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-300">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative p-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white shadow-lg">
              <Shield className="h-4 w-4" />
            </div>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium text-muted-foreground">Acesso</span>
            <span className="text-sm font-semibold text-foreground">Admin</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </motion.button>
      
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
