import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Code2, Server, Wrench, Network, Plus, Trash2 } from "lucide-react";
import { Section } from "./Section";
import { EditableText } from "./EditableText";
import { useAuth } from "./AuthProvider";
import { StorageService, STORAGE_KEYS, techStackSchema } from "../services/storageService";

interface TechItem {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
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
      StorageService.set(STORAGE_KEYS.TECH_STACK, { categories });
    };

    window.addEventListener('admin-save', handleAdminSave);
    return () => window.removeEventListener('admin-save', handleAdminSave);
  }, [categories]);

  useEffect(() => {
    const savedTechStack = StorageService.get(STORAGE_KEYS.TECH_STACK, techStackSchema);
    if (savedTechStack) {
      setCategories(savedTechStack.categories as Category[]);
    } else {
      // Dados iniciais
      const initialCategories: Category[] = [
        {
          id: "1",
          name: "Desenvolvimento Web",
          iconKey: "Code2",
          items: [
            { id: "1-1", name: "JavaScript" },
            { id: "1-2", name: "TypeScript" },
            { id: "1-3", name: "React.js" },
            { id: "1-4", name: "Next.js" },
            { id: "1-5", name: "Vite" },
            { id: "1-6", name: "Tailwind CSS" },
          ],
        },
        {
          id: "2",
          name: "Desenvolvimento Backend",
          iconKey: "Server",
          items: [
            { id: "2-1", name: "Java" },
            { id: "2-2", name: "Python" },
            { id: "2-3", name: "Node.js" },
            { id: "2-4", name: "Spring Boot" },
            { id: "2-5", name: "SQL" },
          ],
        },
        {
          id: "3",
          name: "Ferramentas",
          iconKey: "Wrench",
          items: [
            { id: "3-1", name: "Git" },
            { id: "3-2", name: "GitHub" },
            { id: "3-3", name: "Pacote Office" },
            { id: "3-4", name: "Canva" },
            { id: "3-5", name: "Google Drive" },
            { id: "3-6", name: "Kanban" },
            { id: "3-7", name: "Inteligência Artificial" },
          ],
        },
        {
          id: "4",
          name: "Redes e Sistemas",
          iconKey: "Network",
          items: [
            { id: "4-1", name: "Hardware" },
            { id: "4-2", name: "Manutenção de Computadores" },
          ],
        },
      ];
      setCategories(initialCategories);
      StorageService.set(STORAGE_KEYS.TECH_STACK, { categories: initialCategories });
    }
  }, []);

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    StorageService.set(STORAGE_KEYS.TECH_STACK, { categories: newCategories });
  };

  const addCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: "Nova Categoria",
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
          name: "Nova Tecnologia"
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
            item.id === itemId ? { ...item, name: newText } : item
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
                    text={category.name}
                    onSave={(newText) => updateCategory(category.id, 'name', newText)}
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
                          text={item.name}
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
                      <span className="tech-badge">{item.name}</span>
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
