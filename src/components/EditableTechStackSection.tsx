import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Code2, Server, Wrench, Network, Plus, Trash2 } from "lucide-react";
import { Section } from "./Section";
import { EditableText } from "./EditableText";
import { useAuth } from "./AuthProvider";

interface TechItem {
  id: string;
  text: string;
}

interface Category {
  id: string;
  title: string;
  iconKey: string;
  items: TechItem[];
}

const techCategoryIconMap: Record<string, any> = {
  Code2,
  Server,
  Wrench,
  Network,
};

export function EditableTechStackSection() {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const handleAdminSave = () => {
      localStorage.setItem('techCategories', JSON.stringify(categories));
    };

    window.addEventListener('admin-save', handleAdminSave);
    return () => window.removeEventListener('admin-save', handleAdminSave);
  }, [categories]);

  useEffect(() => {
    const saved = localStorage.getItem('techCategories');
    if (saved) {
      const parsed = JSON.parse(saved);
      const migrated: Category[] = (Array.isArray(parsed) ? parsed : []).map((cat: any) => {
        const items = Array.isArray(cat?.items) ? cat.items : [];
        const iconKey = typeof cat?.iconKey === "string"
          ? cat.iconKey
          : (typeof cat?.icon === "string" ? cat.icon : "Code2");

        return {
          id: String(cat?.id ?? Date.now()),
          title: String(cat?.title ?? ""),
          iconKey,
          items: items.map((it: any) => ({ id: String(it?.id ?? `${Date.now()}`), text: String(it?.text ?? "") })),
        };
      });

      setCategories(migrated);
      localStorage.setItem('techCategories', JSON.stringify(migrated));
    } else {
      // Dados iniciais
      const initialCategories: Category[] = [
        {
          id: "1",
          title: "Desenvolvimento Web",
          iconKey: "Code2",
          items: [
            { id: "1-1", text: "JavaScript" },
            { id: "1-2", text: "TypeScript" },
            { id: "1-3", text: "React.js" },
            { id: "1-4", text: "Next.js" },
            { id: "1-5", text: "Vite" },
            { id: "1-6", text: "Tailwind CSS" },
          ],
        },
        {
          id: "2",
          title: "Desenvolvimento Backend",
          iconKey: "Server",
          items: [
            { id: "2-1", text: "Java" },
            { id: "2-2", text: "Python" },
            { id: "2-3", text: "Node.js" },
            { id: "2-4", text: "Spring Boot" },
            { id: "2-5", text: "SQL" },
          ],
        },
        {
          id: "3",
          title: "Ferramentas",
          iconKey: "Wrench",
          items: [
            { id: "3-1", text: "Git" },
            { id: "3-2", text: "GitHub" },
            { id: "3-3", text: "Pacote Office" },
            { id: "3-4", text: "Canva" },
            { id: "3-5", text: "Google Drive" },
            { id: "3-6", text: "Kanban" },
            { id: "3-7", text: "Inteligência Artificial" },
          ],
        },
        {
          id: "4",
          title: "Redes e Sistemas",
          iconKey: "Network",
          items: [
            { id: "4-1", text: "Hardware" },
            { id: "4-2", text: "Manutenção de Computadores" },
          ],
        },
      ];
      setCategories(initialCategories);
      localStorage.setItem('techCategories', JSON.stringify(initialCategories));
    }
  }, []);

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    localStorage.setItem('techCategories', JSON.stringify(newCategories));
  };

  const addCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      title: "Nova Categoria",
      iconKey: "Code2",
      items: []
    };
    saveCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, field: keyof Category, value: any) => {
    const newCategories = categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    );
    saveCategories(newCategories);
  };

  const removeCategory = (id: string) => {
    saveCategories(categories.filter(cat => cat.id !== id));
  };

  const addItem = (categoryId: string) => {
    const newCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        const newItem: TechItem = {
          id: `${categoryId}-${Date.now()}`,
          text: "Nova Tecnologia"
        };
        return { ...cat, items: [...cat.items, newItem] };
      }
      return cat;
    });
    saveCategories(newCategories);
  };

  const updateItem = (categoryId: string, itemId: string, newText: string) => {
    const newCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item => 
            item.id === itemId ? { ...item, text: newText } : item
          )
        };
      }
      return cat;
    });
    saveCategories(newCategories);
  };

  const removeItem = (categoryId: string, itemId: string) => {
    const newCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.filter(item => item.id !== itemId)
        };
      }
      return cat;
    });
    saveCategories(newCategories);
  };

  return (
    <Section id="tecnologias" title="Tecnologias" icon={Code2}>
      <div ref={ref} className="space-y-6">
        {/* Add button for authenticated users */}
        {isAuthenticated && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={addCategory}
            className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-primary hover:bg-primary/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            Adicionar Categoria
          </motion.button>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, catIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 + catIndex * 0.1 }}
              className="glass-card rounded-2xl p-4 sm:p-6 relative group"
            >
              {/* Delete button for authenticated users */}
              {isAuthenticated && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => removeCategory(category.id)}
                  className="absolute top-4 right-4 p-1 rounded bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-bg text-primary-foreground">
                  {(() => {
                    const Icon = techCategoryIconMap[category.iconKey] ?? Code2;
                    return <Icon className="h-5 w-5" />;
                  })()}
                </div>
                <h3 className="font-semibold">
                  <EditableText
                    text={category.title}
                    onSave={(newText) => updateCategory(category.id, 'title', newText)}
                  />
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.items.map((item, index) => (
                  <motion.span
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ delay: 0.4 + catIndex * 0.1 + index * 0.05 }}
                    className="relative group/item"
                  >
                    {isAuthenticated ? (
                      <div className="flex items-center gap-1">
                        <EditableText
                          text={item.text}
                          onSave={(newText) => updateItem(category.id, item.id, newText)}
                          className="tech-badge"
                        />
                        <button
                          onClick={() => removeItem(category.id, item.id)}
                          className="p-1 rounded bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all opacity-0 group-hover/item:opacity-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="tech-badge">{item.text}</span>
                    )}
                  </motion.span>
                ))}

                {/* Add item button for authenticated users */}
                {isAuthenticated && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => addItem(category.id)}
                    className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-all"
                  >
                    <Plus className="h-3 w-3" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
