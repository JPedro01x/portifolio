import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, ExternalLink, Github, CheckCircle, Clock } from "lucide-react";
import { Section } from "./Section";

const projects = [
  {
    title: "Currículo Interativo",
    description: "Portfólio pessoal desenvolvido com React, TypeScript e Tailwind CSS, apresentando informações profissionais de forma moderna e interativa.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
    githubUrl: "https://github.com",
    liveUrl: "https://github.com",
    featured: true,
    status: "concluido",
  },
  {
    title: "Sistema de Gestão",
    description: "Aplicação web para gerenciamento de dados com interface responsiva e funcionalidades completas de CRUD.",
    technologies: ["React", "Node.js", "SQL", "Spring Boot"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    githubUrl: "https://github.com",
    liveUrl: "#",
    featured: false,
    status: "em_andamento",
  },
  {
    title: "API RESTful",
    description: "API desenvolvida para integração de sistemas com autenticação e documentação completa.",
    technologies: ["Java", "Spring Boot", "MySQL", "JWT"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
    githubUrl: "https://github.com",
    liveUrl: "#",
    featured: false,
    status: "concluido",
  },
];

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section id="projetos" title="Projetos" icon={Code2}>
      <div ref={ref} className="space-y-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            className={`glass-card rounded-2xl overflow-hidden ${
              project.featured ? "md:scale-105" : ""
            }`}
          >
            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-32 sm:h-40 md:h-48 w-full object-cover"
                />
              </div>
              <div className="p-4 sm:p-6 md:w-2/3">
                <div className="mb-2 flex items-center gap-2">
                  {project.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                      Destaque
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                      project.status === "concluido"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {project.status === "concluido" ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    {project.status === "concluido" ? "Concluído" : "Em andamento"}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ delay: 0.4 + index * 0.1 + techIndex * 0.05 }}
                      className="tech-badge"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-primary transition-all hover:bg-primary/20 hover:scale-105"
                  >
                    <Github className="h-4 w-4" />
                    Código
                  </a>
                  {project.liveUrl !== "#" && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-accent/10 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-accent transition-all hover:bg-accent/20 hover:scale-105"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
