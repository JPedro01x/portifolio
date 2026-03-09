import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { EditableText } from './EditableText';
import { StorageService, STORAGE_KEYS, footerSchema } from '../services/storageService';

export function Footer() {
  const [footerText, setFooterText] = useState('© 2026 João Pedro de Carvalho Bernardo. Todos os direitos reservados.');

  useEffect(() => {
    const savedFooter = StorageService.get(STORAGE_KEYS.FOOTER, footerSchema);
    if (savedFooter) {
      setFooterText(savedFooter.text);
    }
  }, []);

  useEffect(() => {
    const handleAdminSave = () => {
      StorageService.set(STORAGE_KEYS.FOOTER, { text: footerText });
    };

    window.addEventListener('admin-save', handleAdminSave);
    return () => window.removeEventListener('admin-save', handleAdminSave);
  }, [footerText]);

  const handleSaveFooterText = (newText: string) => {
    setFooterText(newText);
    StorageService.set(STORAGE_KEYS.FOOTER, { text: newText });
  };

  return (
    <footer className="py-8 border-t border-border">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center gap-2 text-center"
        >
          <EditableText
            text={footerText}
            onSave={handleSaveFooterText}
            className="text-xs text-muted-foreground"
          />
        </motion.div>
      </div>
    </footer>
  );
}
