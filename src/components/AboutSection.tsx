import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { User, Target, Plus, Trash2 } from "lucide-react";
import { Section } from "./Section";
import { EditableText } from "./EditableText";
import { useAuth } from "./AuthProvider";
import { StorageService, STORAGE_KEYS, aboutSchema } from "../services/storageService";

interface Tag {
  id: string;
  text: string;
}

const defaultTags: Tag[] = [
  { id: "1", text: "Frontend" },
  { id: "2", text: "Desenvolvimento" },
  { id: "3", text: "Tecnologia" },
  { id: "4", text: "Inovação" },
];

export function AboutSection() {
  const { isAuthenticated } = useAuth();
  const [description, setDescription] = useState("Sou um jovem em busca da primeira oportunidade no mercado de trabalho, motivado a aprender, crescer e me desenvolver profissionalmente. Tenho formação técnica em informática e atualmente estou cursando graduação em tecnologia. Possuo facilidade com tecnologia, resolução de problemas e espírito de equipe. Busco contribuir com minha dedicação e vontade de evoluir constantemente.");
  const [objective, setObjective] = useState("Ingressar no mercado de trabalho na área de Tecnologia, onde eu possa aplicar meus conhecimentos técnicos, adquirir experiência prática e crescer profissionalmente, contribuindo para o sucesso da empresa com dedicação e responsabilidade.");
  const [tags, setTags] = useState<Tag[]>(defaultTags);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const savedAbout = StorageService.get(STORAGE_KEYS.ABOUT, aboutSchema);
    if (savedAbout) {
      setDescription(savedAbout.description);
      setObjective(savedAbout.objective);
      setTags(savedAbout.tags.map((text, index) => ({ id: String(index + 1), text })));
    }
  }, []);

  useEffect(() => {
    const handleAdminSave = () => {
      const aboutData = {
        description,
        objective,
        tags: tags.map(tag => tag.text),
      };
      StorageService.set(STORAGE_KEYS.ABOUT, aboutData);
    };

    window.addEventListener('admin-save', handleAdminSave);
    return () => window.removeEventListener('admin-save', handleAdminSave);
  }, [description, objective, tags]);

  const saveDescription = (newText: string) => {
    setDescription(newText);
    const currentAbout = StorageService.get(STORAGE_KEYS.ABOUT, aboutSchema) || {
      description,
      objective,
      tags: tags.map(tag => tag.text),
    };
    StorageService.set(STORAGE_KEYS.ABOUT, { ...currentAbout, description: newText });
  };

  const saveObjective = (newText: string) => {
    setObjective(newText);
    const currentAbout = StorageService.get(STORAGE_KEYS.ABOUT, aboutSchema) || {
      description,
      objective,
      tags: tags.map(tag => tag.text),
    };
    StorageService.set(STORAGE_KEYS.ABOUT, { ...currentAbout, objective: newText });
  };

  const saveTags = (newTags: Tag[]) => {
    setTags(newTags);
    const currentAbout = StorageService.get(STORAGE_KEYS.ABOUT, aboutSchema) || {
      description,
      objective,
      tags: tags.map(tag => tag.text),
    };
    StorageService.set(STORAGE_KEYS.ABOUT, { ...currentAbout, tags: newTags.map(tag => tag.text) });
  };

  const addTag = () => {
    const newTag: Tag = {
      id: Date.now().toString(),
      text: "Nova habilidade"
    };
    saveTags([...tags, newTag]);
  };

  const updateTag = (id: string, newText: string) => {
    const newTags = tags.map(tag => 
      tag.id === id ? { ...tag, text: newText } : tag
    );
    saveTags(newTags);
  };

  const removeTag = (id: string) => {
    saveTags(tags.filter(tag => tag.id !== id));
  };

  return (
    <Section id="sobre" title="Sobre Mim" icon={User}>
      <div ref={ref} className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl p-4 sm:p-6"
        >
          <EditableText
            text={description}
            onSave={saveDescription}
            multiline={true}
            className="text-muted-foreground leading-relaxed"
          />
          <div className="mt-6 flex flex-wrap gap-2">
            {isAuthenticated && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={addTag}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-all"
              >
                <Plus className="h-3 w-3" />
                Adicionar
              </motion.button>
            )}
            {tags.map((tag, index) => (
              <motion.span
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="relative group"
              >
                {isAuthenticated ? (
                  <div className="flex items-center gap-1">
                    <EditableText
                      text={tag.text}
                      onSave={(newText) => updateTag(tag.id, newText)}
                      className="tech-badge"
                    />
                    <button
                      onClick={() => removeTag(tag.id)}
                      className="p-1 rounded bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <span className="tech-badge">{tag.text}</span>
                )}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-card rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">Objetivo</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            <EditableText
              text={objective}
              onSave={saveObjective}
              multiline={true}
              className="text-muted-foreground leading-relaxed"
            />
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
