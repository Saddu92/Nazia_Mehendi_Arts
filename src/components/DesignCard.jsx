
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function DesignCard({ design }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl bg-[#e9dfd0]"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={design.imageUrl}
          alt={`${design.title} mehendi design`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Category */}
        <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/15 px-3 py-1 text-[10px] uppercase tracking-wider text-white backdrop-blur-md">
          {design.category}
        </span>

        {/* Open Button */}
        <button
          aria-label={`View ${design.title}`}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#34261e] opacity-0 transition duration-300 group-hover:opacity-100"
        >
          <ArrowUpRight size={16} />
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <p className="mb-1 text-[10px] uppercase tracking-widest text-white/70">
            Nazia Mehendi
          </p>

          <h3 className="font-display text-2xl">{design.title}</h3>

          <p className="mt-1 text-xs leading-5 text-white/75">
            {design.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}