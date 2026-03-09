import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { GraduationCap, Calendar, MapPin, CheckCircle, Clock, Plus, Trash2 } from "lucide-react";
import { Section } from "./Section";
import { EditableText } from "./EditableText";
import { useAuth } from "./AuthProvider";
import { StorageService, STORAGE_KEYS, educationSchema } from "../services/storageService";

interface Education {
  title: string;
  institution: string;
  period: string;
  status: "concluido" | "em_andamento";
  isCurrent: boolean;
}

export function EducationSection() {
  const { isAuthenticated } = useAuth();
  const [education, setEducation] = useState<Education[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const savedEducation = StorageService.get(STORAGE_KEYS.EDUCATION, educationSchema);
    if (savedEducation) {
      setEducation(savedEducation.items as Education[]);
    } else {
      // Dados iniciais
      const initialData: Education[] = [
        {
          title: "Curso Técnico em Redes de Computadores",
          institution: "ETE-Sertânia",
          period: "2020 – 2023",
          status: "concluido",
          isCurrent: false,
        },
        {
          title: "Análise e Desenvolvimento de Sistemas (ADS)",
          institution: "AESA - CESA",
          period: "2024 – Atualmente",
          status: "em_andamento",
          isCurrent: true,
        },
      ];
      setEducation(initialData);
      StorageService.set(STORAGE_KEYS.EDUCATION, { items: initialData });
    }
  }, []);

  const saveEducation = (newEducation: Education[]) => {
    setEducation(newEducation);
    StorageService.set(STORAGE_KEYS.EDUCATION, { items: newEducation });
  };

  const updateEducationItem = (index: number, field: keyof Education, value: any) => {
    const newEducation = [...education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    saveEducation(newEducation);
  };

  const addEducationItem = () => {
    const newItem: Education = {
      title: "Nova Formação",
      institution: "Instituição",
      period: "2024 – 2024",
      status: "em_andamento",
      isCurrent: false,
    };
    saveEducation([...education, newItem]);
  };

  const removeEducationItem = (index: number) => {
    const newEducation = education.filter((_, i) => i !== index);
    saveEducation(newEducation);
  };

  return (
    <Section id="formacao" title="Formação" icon={GraduationCap}>
      <div ref={ref} className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-transparent md:left-1/2 md:-translate-x-1/2" />

        {/* Add button for authenticated users */}
        {isAuthenticated && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={addEducationItem}
            className="absolute top-0 right-0 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary hover:bg-primary/20 transition-all z-20"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </motion.button>
        )}

        <div className="space-y-8">
          {education.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              className={`relative flex flex-col md:flex-row ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Delete button for authenticated users */}
              {isAuthenticated && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => removeEducationItem(index)}
                  className="absolute top-0 right-0 p-1 rounded bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all z-10"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              )}

              {/* Timeline dot */}
              <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full gradient-bg text-primary-foreground shadow-lg z-10">
                {item.isCurrent ? (
                  <Clock className="h-5 w-5" />
                ) : (
                  <CheckCircle className="h-5 w-5" />
                )}
              </div>

              {/* Content */}
              <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-16" : "md:pl-16"}`}>
                <div className="glass-card rounded-2xl p-6">
                  <div className="mb-2 flex items-center gap-2">
                    {isAuthenticated ? (
                      <select
                        value={item.status}
                        onChange={(e) => updateEducationItem(index, 'status', e.target.value)}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border-0 focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="em_andamento">Em andamento</option>
                        <option value="concluido">Concluído</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                          item.status === "concluido"
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                        }`}
                      >
                        {item.isCurrent ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                        {item.status === "concluido" ? "Concluído" : "Em andamento"}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">
                    <EditableText
                      text={item.title}
                      onSave={(newText) => updateEducationItem(index, 'title', newText)}
                    />
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" />
                    <EditableText
                      text={item.institution}
                      onSave={(newText) => updateEducationItem(index, 'institution', newText)}
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <EditableText
                      text={item.period}
                      onSave={(newText) => updateEducationItem(index, 'period', newText)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
