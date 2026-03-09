import { ThemeToggle } from "@/components/ThemeToggle";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { EducationSection } from "@/components/EducationSection";
import { EditableSkillsSection } from "@/components/EditableSkillsSection";
import { EditableTechStackSection } from "@/components/EditableTechStackSection";
import { EditableProjectsSection } from "@/components/EditableProjectsSection";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import { AdminButton } from "@/components/AdminButton";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

const Index = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <AdminButton />
        <ThemeToggle />
        <ScrollToTopButton />
        <Hero />
        <AboutSection />
        <EducationSection />
        <EditableSkillsSection />
        <EditableTechStackSection />
        <EditableProjectsSection />
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default Index;
