import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Server, Wrench, Network } from "lucide-react";
import { Section } from "./Section";

const categories = [
  {
    title: "Desenvolvimento Web",
    icon: Code2,
    items: ["JavaScript", "TypeScript", "React.js", "Next.js", "Vite", "Tailwind CSS"],
  },
  {
    title: "Desenvolvimento Backend",
    icon: Server,
    items: ["Java", "Python", "Node.js", "Spring Boot", "SQL"],
  },
  {
    title: "Ferramentas",
    icon: Wrench,
    items: ["Git", "GitHub", "Pacote Office", "Canva", "Google Drive", "Kanban", "Inteligência Artificial"],
  },
  {
    title: "Redes e Sistemas",
    icon: Network,
    items: ["Hardware", "Manutenção de Computadores"],
  },
];

export function TechStackSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section id="tecnologias" title="Tecnologias" icon={Code2}>
      <div ref={ref} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, catIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 + catIndex * 0.1 }}
            className="glass-card rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-bg text-primary-foreground">
                <category.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{category.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.items.map((item, index) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.4 + catIndex * 0.1 + index * 0.05 }}
                  className="tech-badge"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
