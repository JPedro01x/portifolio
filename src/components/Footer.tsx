import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { EditableText } from './EditableText';

export function Footer() {
  const [footerText, setFooterText] = useState('© 2026 João Pedro de Carvalho Bernardo. Todos os direitos reservados.');

  useEffect(() => {
    const saved = localStorage.getItem('footerText');
    if (saved) {
      setFooterText(saved);
    }
  }, []);

  useEffect(() => {
    const handleAdminSave = () => {
      localStorage.setItem('footerText', footerText);
    };

    window.addEventListener('admin-save', handleAdminSave);
    return () => window.removeEventListener('admin-save', handleAdminSave);
  }, [footerText]);

  const handleSaveFooterText = (newText: string) => {
    setFooterText(newText);
    localStorage.setItem('footerText', newText);
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
