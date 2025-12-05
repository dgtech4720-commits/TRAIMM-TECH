import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Globe, Smartphone, Monitor, GraduationCap, Layout, Server, Sparkles, ArrowUpRight } from "lucide-react";
import React from "react";

const services = [
  {
    icon: Globe,
    title: "Développement Web",
    description: "Sites vitrines & SaaS performants.",
    keywords: ["React", "Next.js", "Node.js"],
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
    gradient: "from-amber-500/20 to-yellow-500/20"
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description: "iOS & Android natif.",
    keywords: ["React Native", "Flutter"],
    colSpan: "col-span-1",
    gradient: "from-yellow-500/20 to-orange-500/20"
  },
  {
    icon: GraduationCap,
    title: "Aide Étudiants & PFE",
    description: "Coaching technique et assistance rédactionnelle pour vos projets de fin d'études.",
    keywords: ["Soutenance", "Rapport", "Code Review"],
    colSpan: "col-span-1 md:col-span-2",
    gradient: "from-amber-600/20 to-yellow-600/20",
    featured: true
  },
  {
    icon: Monitor,
    title: "Logiciels Desktop",
    description: "Solutions métier sur mesure.",
    keywords: ["Electron", "Tauri"],
    colSpan: "col-span-1",
    gradient: "from-orange-500/20 to-amber-500/20"
  },
  {
    icon: Layout,
    title: "UI/UX Design",
    description: "Interfaces modernes.",
    keywords: ["Figma", "Prototypage"],
    colSpan: "col-span-1",
    gradient: "from-yellow-400/20 to-amber-400/20"
  },
  {
    icon: Server,
    title: "Backend & Cloud",
    description: "Architecture évolutive.",
    keywords: ["AWS", "Docker"],
    colSpan: "col-span-1",
    gradient: "from-amber-500/20 to-orange-500/20"
  }
];

function Card({ service }: { service: any }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      className={`group relative rounded-3xl border border-white/10 bg-gray-900/5 dark:bg-white/5 overflow-hidden ${service.colSpan}`}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(251, 191, 36, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative h-full p-8 flex flex-col">
        <div className="flex items-start justify-between mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <service.icon className="w-6 h-6" />
          </div>
          {service.featured && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-800">
              <Sparkles className="w-3 h-3" />
              Populaire
            </span>
          )}
        </div>

        <div className="mt-auto">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {service.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">
            {service.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {service.keywords.map((keyword: string, idx: number) => (
              <span
                key={idx}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white/50 dark:bg-black/20 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 group-hover:-translate-y-1">
          <ArrowUpRight className="w-6 h-6 text-amber-500" />
        </div>
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  return (
    <section id="services" className="relative py-24 lg:py-32 overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block py-1 px-3 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-sm font-semibold mb-4"
          >
            Nos Services
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Expertise technique <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500">
              pour projets ambitieux
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}