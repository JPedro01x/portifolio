import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface SectionProps {
  id: string;
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}

export function Section({ id, title, icon: Icon, children, className = "" }: SectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id={id} ref={ref} className={`py-12 md:py-20 ${className}`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl gradient-bg text-primary-foreground">
              <Icon className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-0">
              <span className="gradient-text">{title}</span>
            </h2>
          </div>
          {children}
        </motion.div>
      </div>
    </section>
  );
}
