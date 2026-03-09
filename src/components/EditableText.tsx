import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Check, X } from 'lucide-react';
import { useAuth } from './AuthProvider';

interface EditableTextProps {
  text: string;
  onSave: (newText: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export function EditableText({ text, onSave, className = '', multiline = false, placeholder = 'Digite o texto...' }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const { isAuthenticated } = useAuth();

  const handleSave = () => {
    if (editText.trim() !== text) {
      onSave(editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isAuthenticated) {
    return <span className={className}>{text}</span>;
  }

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2"
      >
        {multiline ? (
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 rounded border border-primary/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            placeholder={placeholder}
            rows={3}
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 rounded border border-primary/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder={placeholder}
            autoFocus
          />
        )}
        <button
          onClick={handleSave}
          className="p-1 rounded bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 rounded bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="group relative inline-block">
      <span className={className}>{text}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="absolute -top-2 -right-2 p-1 rounded bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/20"
      >
        <Edit2 className="h-3 w-3" />
      </button>
    </div>
  );
}
