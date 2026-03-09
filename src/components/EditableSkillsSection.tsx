import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Zap, Users, Lightbulb, Rocket, Heart, Plus, Trash2 } from "lucide-react";
import { Section } from "./Section";
import { EditableText } from "./EditableText";
import { useAuth } from "./AuthProvider";

interface TechnicalSkill {
  id: string;
  name: string;
  level: number;
}

interface SoftSkill {
  id: string;
  name: string;
  iconKey: string;
}

const softSkillIconMap: Record<string, any> = {
  Users,
  Lightbulb,
  Rocket,
  Heart,
};

export function EditableSkillsSection() {
  const { isAuthenticated } = useAuth();
  const [technicalSkills, setTechnicalSkills] = useState<TechnicalSkill[]>([]);
  const [softSkills, setSoftSkills] = useState<SoftSkill[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const handleAdminSave = () => {
      localStorage.setItem('technicalSkills', JSON.stringify(technicalSkills));
      localStorage.setItem('softSkills', JSON.stringify(softSkills));
    };

    window.addEventListener('admin-save', handleAdminSave);
    return () => window.removeEventListener('admin-save', handleAdminSave);
  }, [technicalSkills, softSkills]);

  useEffect(() => {
    const savedTechnical = localStorage.getItem('technicalSkills');
    const savedSoft = localStorage.getItem('softSkills');
    
    if (savedTechnical) {
      setTechnicalSkills(JSON.parse(savedTechnical));
    } else {
      // Dados iniciais
      const initialTechnicalSkills: TechnicalSkill[] = [
        { id: "1", name: "Frontend", level: 65 },
        { id: "2", name: "Backend", level: 60 },
        { id: "3", name: "Banco de Dados", level: 55 },
        { id: "4", name: "Redes de Computadores", level: 75 },
        { id: "5", name: "Pacote Office", level: 85 },
      ];
      setTechnicalSkills(initialTechnicalSkills);
      localStorage.setItem('technicalSkills', JSON.stringify(initialTechnicalSkills));
    }

    if (savedSoft) {
      const parsed = JSON.parse(savedSoft);
      const migrated: SoftSkill[] = (Array.isArray(parsed) ? parsed : []).map((skill: any) => {
        if (typeof skill?.iconKey === "string") {
          return { id: String(skill.id), name: String(skill.name ?? ""), iconKey: skill.iconKey };
        }

        if (typeof skill?.icon === "string") {
          return { id: String(skill.id), name: String(skill.name ?? ""), iconKey: skill.icon };
        }

        return { id: String(skill?.id ?? Date.now()), name: String(skill?.name ?? ""), iconKey: "Heart" };
      });
      setSoftSkills(migrated);
      localStorage.setItem('softSkills', JSON.stringify(migrated));
    } else {
      // Dados iniciais
      const initialSoftSkills: SoftSkill[] = [
        { id: "1", name: "Trabalho em Equipe", iconKey: "Users" },
        { id: "2", name: "Resolução de Problemas", iconKey: "Lightbulb" },
        { id: "3", name: "Proatividade", iconKey: "Rocket" },
        { id: "4", name: "Dedicação", iconKey: "Heart" },
      ];
      setSoftSkills(initialSoftSkills);
      localStorage.setItem('softSkills', JSON.stringify(initialSoftSkills));
    }
  }, []);

  const saveTechnicalSkills = (newSkills: TechnicalSkill[]) => {
    setTechnicalSkills(newSkills);
    localStorage.setItem('technicalSkills', JSON.stringify(newSkills));
  };

  const saveSoftSkills = (newSkills: SoftSkill[]) => {
    setSoftSkills(newSkills);
    localStorage.setItem('softSkills', JSON.stringify(newSkills));
  };

  const addTechnicalSkill = () => {
    const newSkill: TechnicalSkill = {
      id: Date.now().toString(),
      name: "Nova Habilidade Técnica",
      level: 50
    };
    saveTechnicalSkills([...technicalSkills, newSkill]);
  };

  const addSoftSkill = () => {
    const newSkill: SoftSkill = {
      id: Date.now().toString(),
      name: "Nova Competência",
      iconKey: "Heart"
    };
    saveSoftSkills([...softSkills, newSkill]);
  };

  const updateTechnicalSkill = (id: string, field: keyof TechnicalSkill, value: any) => {
    const newSkills = technicalSkills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    );
    saveTechnicalSkills(newSkills);
  };

  const updateSoftSkill = (id: string, field: keyof SoftSkill, value: any) => {
    const newSkills = softSkills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    );
    saveSoftSkills(newSkills);
  };

  const removeTechnicalSkill = (id: string) => {
    saveTechnicalSkills(technicalSkills.filter(skill => skill.id !== id));
  };

  const removeSoftSkill = (id: string) => {
    saveSoftSkills(softSkills.filter(skill => skill.id !== id));
  };

  return (
    <Section id="habilidades" title="Habilidades" icon={Zap}>
      <div ref={ref} className="grid gap-8 lg:grid-cols-2">
        {/* Technical Skills */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl p-6 relative"
        >
          {/* Add button for authenticated users */}
          {isAuthenticated && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={addTechnicalSkill}
              className="absolute top-4 right-4 flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-2 text-primary hover:bg-primary/20 transition-all"
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </motion.button>
          )}

          <h3 className="text-lg font-semibold mb-6">Habilidades Técnicas</h3>
          <div className="space-y-5">
            {technicalSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="relative group"
              >
                {/* Delete button for authenticated users */}
                {isAuthenticated && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => removeTechnicalSkill(skill.id)}
                    className="absolute top-0 right-0 p-1 rounded bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </motion.button>
                )}

                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    <EditableText
                      text={skill.name}
                      onSave={(newText) => updateTechnicalSkill(skill.id, 'name', newText)}
                      className="text-sm font-medium"
                    />
                  </span>
                  {isAuthenticated ? (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={skill.level}
                      onChange={(e) => updateTechnicalSkill(skill.id, 'level', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 rounded border border-primary/20 bg-background text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  )}
                </div>
                <div className="skill-bar">
                  <motion.div
                    className="skill-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: isInView ? `${skill.level}%` : 0 }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Soft Skills */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-card rounded-2xl p-6 relative"
        >
          {/* Add button for authenticated users */}
          {isAuthenticated && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={addSoftSkill}
              className="absolute top-4 right-4 flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-2 text-primary hover:bg-primary/20 transition-all"
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </motion.button>
          )}

          <h3 className="text-lg font-semibold mb-6">Competências</h3>
          <div className="grid grid-cols-2 gap-4">
            {softSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-3 rounded-xl bg-muted/50 p-4 text-center transition-colors hover:bg-muted relative group"
              >
                {/* Delete button for authenticated users */}
                {isAuthenticated && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => removeSoftSkill(skill.id)}
                    className="absolute top-2 right-2 p-1 rounded bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </motion.button>
                )}

                <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-bg text-primary-foreground">
                  {(() => {
                    const Icon = softSkillIconMap[skill.iconKey] ?? Heart;
                    return <Icon className="h-5 w-5" />;
                  })()}
                </div>
                <span className="text-sm font-medium">
                  <EditableText
                    text={skill.name}
                    onSave={(newText) => updateSoftSkill(skill.id, 'name', newText)}
                    className="text-sm font-medium"
                  />
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
