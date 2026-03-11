import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Code2, ExternalLink, Github, CheckCircle, Clock, Plus, Trash2, Camera, Upload, Edit2, Image } from "lucide-react";
import { Section } from "./Section";
import { EditableText } from "./EditableText";
import { useAuth } from "./AuthProvider";
import { StorageService, STORAGE_KEYS, projectsSchema } from "../services/storageService";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  codeUrl: string;
  demoUrl: string;
  featured: boolean;
  status: "concluido" | "em_andamento";
}

export function EditableProjectsSection() {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingImageProject, setEditingImageProject] = useState<string | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const savedProjects = StorageService.get(STORAGE_KEYS.PROJECTS, projectsSchema);
    if (savedProjects) {
      setProjects(savedProjects.projects as Project[]);
    } else {
      // Começa sem projetos iniciais - admin adiciona os projetos reais
      setProjects([]);
      StorageService.set(STORAGE_KEYS.PROJECTS, { projects: [] });
    }
  }, []);

  useEffect(() => {
    const handleAdminSave = () => {
      StorageService.set(STORAGE_KEYS.PROJECTS, { projects });
    };

    window.addEventListener('admin-save', handleAdminSave);
    return () => window.removeEventListener('admin-save', handleAdminSave);
  }, [projects]);

  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    StorageService.set(STORAGE_KEYS.PROJECTS, { projects: newProjects });
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "Novo Projeto",
      description: "Descrição do novo projeto.",
      technologies: ["Tecnologia 1"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
      codeUrl: "https://github.com",
      demoUrl: "#",
      featured: false,
      status: "em_andamento",
    };
    saveProjects([...projects, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    const newProjects = projects.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    );
    saveProjects(newProjects);
  };

  const removeProject = (id: string) => {
    saveProjects(projects.filter(project => project.id !== id));
  };

  const addTechnology = (projectId: string) => {
    const newProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          technologies: [...project.technologies, "Nova Tecnologia"]
        };
      }
      return project;
    });
    saveProjects(newProjects);
  };

  const updateTechnology = (projectId: string, index: number, newText: string) => {
    const newProjects = projects.map(project => {
      if (project.id === projectId) {
        const newTechnologies = [...project.technologies];
        newTechnologies[index] = newText;
        return { ...project, technologies: newTechnologies };
      }
      return project;
    });
    saveProjects(newProjects);
  };

  const removeTechnology = (projectId: string, index: number) => {
    const newProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          technologies: project.technologies.filter((_, i) => i !== index)
        };
      }
      return project;
    });
    saveProjects(newProjects);
  };

  // Image editing functions
  const startEditingImage = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setTempImageUrl(project.image);
      setEditingImageProject(projectId);
      setUploadedImage(null);
    }
  };

  const saveProjectImage = (projectId: string) => {
    if (tempImageUrl || uploadedImage) {
      updateProject(projectId, 'image', uploadedImage || tempImageUrl);
    }
    setEditingImageProject(null);
    setTempImageUrl("");
    setUploadedImage(null);
  };

  const cancelEditingImage = () => {
    setEditingImageProject(null);
    setTempImageUrl("");
    setUploadedImage(null);
  };

  const handleFileUpload = (projectId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (projectId: string) => {
    fileInputRefs.current[projectId]?.click();
  };

  const triggerCamera = (projectId: string) => {
    const input = fileInputRefs.current[projectId];
    if (input) {
      input.setAttribute('capture', 'environment');
      input.click();
    }
  };

  return (
    <Section id="projetos" title="Projetos" icon={Code2}>
      <div ref={ref} className="space-y-8">
        {/* Add button for authenticated users */}
        {isAuthenticated && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={addProject}
            className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-primary hover:bg-primary/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            Adicionar Projeto
          </motion.button>
        )}

        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            className={`bg-white dark:bg-gray-900 rounded-2xl overflow-hidden relative group shadow-2xl border-0 outline-0 ${
              project.featured ? "md:scale-105" : ""
            }`}
          >
            {/* Delete button for authenticated users */}
            {isAuthenticated && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => removeProject(project.id)}
                className="absolute top-4 right-4 p-1 rounded bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100 z-10"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            )}

            <div className="md:flex overflow-hidden">
              <div className="md:w-1/3 relative group overflow-hidden rounded-lg border-0 outline-0">
                {isAuthenticated && (
                  <>
                    <input
                      ref={el => fileInputRefs.current[project.id] = el}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(project.id, e)}
                      className="hidden"
                    />
                    <button
                      onClick={() => startEditingImage(project.id)}
                      className="absolute top-2 right-2 p-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10 hover:scale-110"
                      title="Editar imagem"
                    >
                      <Edit2 className="h-4 w-4 text-primary" />
                    </button>
                  </>
                )}
                
                {editingImageProject === project.id ? (
                  <div className="relative aspect-[3/2] w-full bg-black/5 dark:bg-white/5">
                    <img
                      src={uploadedImage || tempImageUrl}
                      alt={project.title}
                      className="absolute inset-0 h-full w-full object-contain rounded-lg border-0 outline-0"
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => triggerFileInput(project.id)}
                          className="p-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-all"
                          title="Upload de arquivo"
                        >
                          <Upload className="h-4 w-4 text-primary" />
                        </button>
                        <button
                          onClick={() => triggerCamera(project.id)}
                          className="p-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-all"
                          title="Tirar foto"
                        >
                          <Camera className="h-4 w-4 text-primary" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={tempImageUrl}
                        onChange={(e) => setTempImageUrl(e.target.value)}
                        placeholder="URL da imagem..."
                        className="w-full px-3 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-sm placeholder:text-gray-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveProjectImage(project.id)}
                          className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-all"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={cancelEditingImage}
                          className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-[3/2] w-full bg-black/5 dark:bg-white/5">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 h-full w-full object-contain rounded-lg border-0 outline-0"
                    />
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6 md:w-2/3">
                <div className="mb-2 flex items-center gap-2">
                  {isAuthenticated && (
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={project.featured}
                        onChange={(e) => updateProject(project.id, 'featured', e.target.checked)}
                        className="rounded border-primary/20 bg-background text-primary focus:ring-2 focus:ring-primary/20"
                      />
                      Destaque
                    </label>
                  )}
                  {isAuthenticated ? (
                    <select
                      value={project.status}
                      onChange={(e) => updateProject(project.id, 'status', e.target.value)}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border-0 focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="em_andamento">Em Desenvolvimento</option>
                      <option value="concluido">Concluído</option>
                    </select>
                  ) : (
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
                      {project.status === "concluido" ? "Concluído" : "Em Desenvolvimento"}
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  <EditableText
                    text={project.title}
                    onSave={(newText) => updateProject(project.id, 'title', newText)}
                  />
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  <EditableText
                    text={project.description}
                    onSave={(newText) => updateProject(project.id, 'description', newText)}
                    multiline={true}
                    className="text-muted-foreground leading-relaxed"
                  />
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <motion.span
                      key={techIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ delay: 0.4 + index * 0.1 + techIndex * 0.05 }}
                      className="relative group/tech"
                    >
                      {isAuthenticated ? (
                        <div className="flex items-center gap-1">
                          <EditableText
                            text={tech}
                            onSave={(newText) => updateTechnology(project.id, techIndex, newText)}
                            className="tech-badge"
                          />
                          <button
                            onClick={() => removeTechnology(project.id, techIndex)}
                            className="p-1 rounded bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all opacity-0 group-hover/tech:opacity-100"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="tech-badge">{tech}</span>
                      )}
                    </motion.span>
                  ))}

                  {isAuthenticated && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => addTechnology(project.id)}
                      className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-all"
                    >
                      <Plus className="h-3 w-3" />
                    </motion.button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Github className="h-4 w-4" />
                        <EditableText
                          text={project.codeUrl}
                          onSave={(newText) => updateProject(project.id, 'codeUrl', newText)}
                          className="text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ExternalLink className="h-4 w-4" />
                        <EditableText
                          text={project.demoUrl}
                          onSave={(newText) => updateProject(project.id, 'demoUrl', newText)}
                          className="text-xs"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <a
                        href={project.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-primary transition-all hover:bg-primary/20 hover:scale-105"
                      >
                        <Github className="h-4 w-4" />
                        Código
                      </a>
                      {project.demoUrl !== "#" && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-accent/10 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-accent transition-all hover:bg-accent/20 hover:scale-105"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Demo
                        </a>
                      )}
                    </>
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
