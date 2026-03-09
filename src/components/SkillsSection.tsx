import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Users, Lightbulb, Rocket, Heart } from "lucide-react";
import { Section } from "./Section";

const technicalSkills = [
  { name: "Frontend", level: 65 },
  { name: "Backend", level: 60 },
  { name: "Banco de Dados", level: 55 },
  { name: "Redes de Computadores", level: 75 },
  { name: "Pacote Office", level: 85 },
];

const softSkills = [
  { name: "Trabalho em Equipe", icon: Users },
  { name: "Resolução de Problemas", icon: Lightbulb },
  { name: "Proatividade", icon: Rocket },
  { name: "Dedicação", icon: Heart },
];

export function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section id="habilidades" title="Habilidades" icon={Zap}>
      <div ref={ref} className="grid gap-8 lg:grid-cols-2">
        {/* Technical Skills */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Habilidades Técnicas</h3>
          <div className="space-y-5">
            {technicalSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className="text-sm text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <motion.div
                    className="skill-bar-fill"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
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
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Competências</h3>
          <div className="grid grid-cols-2 gap-4">
            {softSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-3 rounded-xl bg-muted/50 p-4 text-center transition-colors hover:bg-muted"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-bg text-primary-foreground">
                  <skill.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
