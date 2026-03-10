import { z } from 'zod';

// Schemas for data validation
const contactItemSchema = z.object({
  icon: z.string(),
  text: z.string(),
  href: z.string().optional(),
});

const heroSchema = z.object({
  profilePhoto: z.string().url().optional(),
  name: z.string(),
  course: z.string().optional(),
  subtitle: z.string(),
  contactInfo: z.array(contactItemSchema),
});

const aboutSchema = z.object({
  description: z.string(),
  objective: z.string(),
  tags: z.array(z.string()),
});

const educationItemSchema = z.object({
  title: z.string(),
  institution: z.string(),
  period: z.string(),
  status: z.enum(["concluido", "em_andamento", "cursando"]),
});

const educationSchema = z.object({
  items: z.array(educationItemSchema),
});

const technicalSkillSchema = z.object({
  name: z.string(),
  level: z.number().min(0).max(100),
});

const softSkillSchema = z.object({
  name: z.string(),
  iconKey: z.string(),
});

const skillsSchema = z.object({
  technical: z.array(technicalSkillSchema),
  soft: z.array(softSkillSchema),
});

const techItemSchema = z.object({
  name: z.string(),
});

const techCategorySchema = z.object({
  name: z.string(),
  iconKey: z.string(),
  items: z.array(techItemSchema),
});

const techStackSchema = z.object({
  categories: z.array(techCategorySchema),
});

const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  image: z.string().url().optional(),
  codeUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  status: z.enum(["em_andamento", "concluido"]),
  featured: z.boolean().optional(),
});

const projectsSchema = z.object({
  projects: z.array(projectSchema),
});

const footerSchema = z.object({
  text: z.string(),
});

// Storage keys
export const STORAGE_KEYS = {
  HERO: 'portfolio_hero',
  ABOUT: 'portfolio_about',
  EDUCATION: 'portfolio_education',
  SKILLS: 'portfolio_skills',
  TECH_STACK: 'portfolio_tech_stack',
  PROJECTS: 'portfolio_projects',
  FOOTER: 'portfolio_footer',
  AUTH: 'portfolio_auth',
} as const;

// Storage service
export class StorageService {
  static get<T>(key: string, schema: z.ZodSchema<T>): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      const result = schema.safeParse(parsed);
      
      if (result.success) {
        return result.data;
      } else {
        console.warn(`Invalid data in localStorage for key "${key}":`, result.error);
        this.remove(key);
        return null;
      }
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      this.remove(key);
      return null;
    }
  }
  
  static set<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error);
    }
  }
  
  static remove(key: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage for key "${key}":`, error);
    }
  }
  
  static clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

// Export schemas for use in components
export {
  heroSchema,
  aboutSchema,
  educationSchema,
  skillsSchema,
  techStackSchema,
  projectsSchema,
  footerSchema,
};
