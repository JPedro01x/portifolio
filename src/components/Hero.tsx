import React from "react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Phone, Mail, MapPin, Github, Calendar, Camera, Edit2, Upload, Image } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { EditableText } from "./EditableText";
import { StorageService, STORAGE_KEYS, heroSchema } from "../services/storageService";

const defaultContactInfo = [
  { icon: "Phone", text: "(87) 99137-3783", href: "tel:+5587991373783" },
  { icon: "Mail", text: "joaopedrob882@gmail.com", href: "mailto:joaopedrob882@gmail.com" },
  { icon: "Calendar", text: "09/06/2006" },
  { icon: "MapPin", text: "Sertânia, PE - Brasil" },
  { icon: "Github", text: "GitHub", href: "https://github.com/dashboard" },
];

const iconMap: { [key: string]: any } = {
  Phone,
  Mail,
  Calendar,
  MapPin,
  Github,
};

export function Hero() {
  const { isAuthenticated } = useAuth();
  const [profilePhoto, setProfilePhoto] = useState("/profile.jpg");
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Editable states
  const [name, setName] = useState("João Pedro de Carvalho Bernardo");
  const [course, setCourse] = useState("Análise e Desenvolvimento de Sistemas");
  const [subtitle, setSubtitle] = useState("Jovem Aprendiz | Junior | Estágio");
  const [contactInfo, setContactInfo] = useState(defaultContactInfo as typeof defaultContactInfo);

  useEffect(() => {
    const savedHero = StorageService.get(STORAGE_KEYS.HERO, heroSchema);
    if (savedHero) {
      setProfilePhoto(savedHero.profilePhoto || "/profile.jpg");
      setName(savedHero.name);
      setCourse(savedHero.course || "Análise e Desenvolvimento de Sistemas");
      setSubtitle(savedHero.subtitle);
      setContactInfo(savedHero.contactInfo as typeof defaultContactInfo);
    }
  }, []);

  useEffect(() => {
    const handleAdminSave = () => {
      const heroData = {
        profilePhoto,
        name,
        course,
        subtitle,
        contactInfo,
      };
      StorageService.set(STORAGE_KEYS.HERO, heroData);
    };

    window.addEventListener('admin-save', handleAdminSave);
    return () => window.removeEventListener('admin-save', handleAdminSave);
  }, [profilePhoto, name, course, subtitle, contactInfo]);

  const saveName = (newName: string) => {
    setName(newName);
    const currentHero = StorageService.get(STORAGE_KEYS.HERO, heroSchema) || {
      profilePhoto,
      name,
      subtitle,
      contactInfo,
    };
    StorageService.set(STORAGE_KEYS.HERO, { ...currentHero, name: newName });
  };

  const saveSubtitle = (newSubtitle: string) => {
    setSubtitle(newSubtitle);
    const currentHero = StorageService.get(STORAGE_KEYS.HERO, heroSchema) || {
      profilePhoto,
      name,
      subtitle,
      contactInfo,
    };
    StorageService.set(STORAGE_KEYS.HERO, { ...currentHero, subtitle: newSubtitle });
  };

  const saveContactInfo = (newContactInfo: typeof defaultContactInfo) => {
    setContactInfo(newContactInfo);
    const currentHero = StorageService.get(STORAGE_KEYS.HERO, heroSchema) || {
      profilePhoto,
      name,
      subtitle,
      contactInfo,
    };
    StorageService.set(STORAGE_KEYS.HERO, { ...currentHero, contactInfo: newContactInfo });
  };

  const updateContactItem = (index: number, newText: string) => {
    const newContactInfo = [...contactInfo];
    newContactInfo[index] = { ...newContactInfo[index], text: newText };
    saveContactInfo(newContactInfo);
  };

  const handlePhotoSave = () => {
    const finalImage = uploadedImage || tempPhotoUrl.trim();
    if (finalImage) {
      setProfilePhoto(finalImage);
      const currentHero = StorageService.get(STORAGE_KEYS.HERO, heroSchema) || {
        profilePhoto,
        name,
        subtitle,
        contactInfo,
      };
      StorageService.set(STORAGE_KEYS.HERO, { ...currentHero, profilePhoto: finalImage });
      setIsEditingPhoto(false);
      setTempPhotoUrl("");
      setUploadedImage(null);
    }
  };

  const handlePhotoCancel = () => {
    setTempPhotoUrl("");
    setUploadedImage(null);
    setIsEditingPhoto(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem válido.');
        return;
      }

      // Verificar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setTempPhotoUrl(""); // Limpar URL se houver upload
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerCamera = () => {
    // Tentar abrir a câmera do dispositivo
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Câmera traseira preferencialmente
    input.onchange = (e) => handleFileUpload(e as any);
    input.click();
  };

  return (
    <section className="relative min-h-screen hero-gradient overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative z-10 flex min-h-screen flex-col items-center justify-center py-20">
        {/* Profile Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative mb-8 group"
        >
          {isAuthenticated && (
            <>
              <button
                onClick={() => setIsEditingPhoto(true)}
                className="absolute top-2 right-2 p-2 rounded-full bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/20 z-10"
                title="Alterar foto"
              >
                <Camera className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsEditingPhoto(true)}
                className="absolute bottom-2 right-2 p-2 rounded-full bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/20 z-10"
                title="Alterar foto"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </>
          )}
          
          <motion.div
            className="relative h-40 w-40 sm:h-48 sm:w-48"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={profilePhoto}
              alt="João Pedro de Carvalho Bernardo"
              className="h-full w-full rounded-full border-4 border-white/20 object-cover shadow-2xl"
            />
            <motion.div
              className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-4 border-card"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.div>
        </motion.div>

        {/* Photo Edit Modal */}
        {isEditingPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="glass-card rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">Alterar Foto de Perfil</h3>
              
              {/* Upload Options */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={triggerCamera}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Camera className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">Tirar Foto</span>
                </button>
                <button
                  onClick={triggerFileInput}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Upload className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">Galeria</span>
                </button>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* URL Option */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Ou cole a URL de uma imagem:</p>
                <input
                  type="url"
                  value={tempPhotoUrl}
                  onChange={(e) => {
                    setTempPhotoUrl(e.target.value);
                    setUploadedImage(null); // Limpar upload se usar URL
                  }}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              {/* Preview */}
              {(uploadedImage || tempPhotoUrl) && (
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img
                      src={uploadedImage || tempPhotoUrl}
                      alt="Preview"
                      className="h-32 w-32 rounded-full object-cover border-4 border-border shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 border-2 border-background">
                      <Image className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={handlePhotoSave}
                  disabled={!uploadedImage && !tempPhotoUrl.trim()}
                  className="flex-1 rounded-lg gradient-bg text-primary-foreground py-2 font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Salvar
                </button>
                <button
                  onClick={handlePhotoCancel}
                  className="flex-1 rounded-lg bg-muted py-2 font-medium transition-all hover:bg-muted/80"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05, textShadow: "0 0 30px rgba(255,255,255,0.5)" }}
          className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white cursor-default px-4"
        >
          <EditableText
            text={name}
            onSave={saveName}
          />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-2 text-center text-sm sm:text-base md:text-lg text-white/90 px-4 font-medium"
        >
          {course}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 text-center text-sm sm:text-base md:text-lg text-white/80 md:text-xl px-4"
        >
          <EditableText
            text={subtitle}
            onSave={saveSubtitle}
          />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-4 px-4"
        >
          {contactInfo.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
            >
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-1 sm:gap-2 rounded-full bg-white/10 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white/90 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
                >
                  {React.createElement(iconMap[item.icon], { className: "h-4 w-4" })}
                  <EditableText
                    text={item.text}
                    onSave={(newText) => updateContactItem(index, newText)}
                    className="text-xs sm:text-sm"
                  />
                </a>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2 rounded-full bg-white/10 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white/90 backdrop-blur-sm">
                  {React.createElement(iconMap[item.icon], { className: "h-4 w-4" })}
                  <EditableText
                    text={item.text}
                    onSave={(newText) => updateContactItem(index, newText)}
                    className="text-xs sm:text-sm"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex flex-col items-center text-white/50"
          >
            <span className="text-sm mb-2">Role para baixo</span>
            <div className="h-8 w-5 rounded-full border-2 border-white/30 p-1">
              <motion.div
                className="h-2 w-1 mx-auto rounded-full bg-white/50"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
