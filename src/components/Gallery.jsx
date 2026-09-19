
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import SectionHeading from "./SectionHeading";
import { scrollToSection } from "../lib/scroll";
import { showcaseDesigns } from "../data/showcaseDesigns";

const API_URL = "http://localhost:5000/api";

const categories = [
  "All",
  "Bridal",
  "Arabic",
  "Minimal",
  "Engagement",
  "Traditional",
  "Other",
];

export default function Gallery({ onSelectDesign }) {
  const [filter, setFilter] = useState("All");
  const [uploadedDesigns, setUploadedDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Convert static showcase designs into the
   * same format as backend designs.
   */
  const staticDesigns = showcaseDesigns.map((design) => ({
    _id: `static-${design.id}`,
    title: design.title,
    category: design.category,
    description: "Showcase design",
    imageUrl: design.image,
    isStatic: true,
  }));

  useEffect(() => {
    async function fetchDesigns() {
      try {
        const response = await fetch(`${API_URL}/designs`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch designs");
        }

        const fetchedDesigns = Array.isArray(data)
          ? data
          : data.designs || data.data || [];

        setUploadedDesigns(fetchedDesigns);
      } catch (error) {
        console.error("Fetch designs error:", error);
        setError("Unable to load uploaded designs.");
      } finally {
        setLoading(false);
      }
    }

    fetchDesigns();
  }, []);

  /*
   * Combine static images and uploaded images.
   * Static images appear first.
   */
  const allDesigns = [...staticDesigns, ...uploadedDesigns];

  const visible =
    filter === "All"
      ? allDesigns
      : allDesigns.filter((item) => item.category === filter);

  const rowOne = visible.filter((_, index) => index % 2 === 0);
  const rowTwo = visible.filter((_, index) => index % 2 !== 0);

  const scrollingRowOne = [...rowOne, ...rowOne];
  const scrollingRowTwo = [...rowTwo, ...rowTwo];

  function handleBook(item) {
    onSelectDesign?.(item.title);
    scrollToSection("contact");
  }

  return (
    <section
      id="designs"
      className="section-padding overflow-hidden bg-paper"
    >
      <div className="container-shell">
        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Explore the collection"
            title="Designs for Every Occasion"
          />

          {/* FILTERS */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                className={`rounded-full px-3 py-2 text-[11px] transition ${
                  filter === category
                    ? "bg-forest text-white"
                    : "hover:bg-white/60"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* INFORMATION */}
        <div className="mb-8 flex flex-wrap gap-4 text-xs text-[#81766a]">
          <span>
            <strong className="text-forest">Showcase:</strong>{" "}
            Reference designs
          </span>

          <span>
            <strong className="text-forest">Our Work:</strong>{" "}
            Uploaded designs
          </span>
        </div>

        {loading && (
          <p className="mb-6 text-sm text-[#81766a]">
            Loading uploaded designs...
          </p>
        )}

        {error && (
          <p className="mb-6 text-sm text-amber-700">
            {error} Showing showcase designs instead.
          </p>
        )}

        {visible.length === 0 && (
          <p className="py-10 text-center text-sm text-[#81766a]">
            No designs available for this category.
          </p>
        )}
      </div>

      {/* AUTO-SCROLLING GALLERY */}
      {visible.length > 0 && (
        <div className="relative space-y-4">
          {/* LEFT GRADIENT */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent md:w-32" />

          {/* RIGHT GRADIENT */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent md:w-32" />

          {/* ROW ONE */}
          {rowOne.length > 0 && (
            <motion.div
              className="flex w-max gap-4"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {scrollingRowOne.map((item, index) => (
                <DesignCard
                  key={`row1-${item._id}-${index}`}
                  item={item}
                  onBook={() => handleBook(item)}
                />
              ))}
            </motion.div>
          )}

          {/* ROW TWO */}
          {rowTwo.length > 0 && (
            <motion.div
              className="flex w-max gap-4"
              animate={{ x: ["-50%", "0%"] }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {scrollingRowTwo.map((item, index) => (
                <DesignCard
                  key={`row2-${item._id}-${index}`}
                  item={item}
                  onBook={() => handleBook(item)}
                />
              ))}
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
}

/* REUSABLE DESIGN CARD */
function DesignCard({ item, onBook }) {
  return (
    <article className="group relative h-[290px] w-[210px] shrink-0 overflow-hidden rounded-xl sm:h-[340px] sm:w-[245px]">
      {/* IMAGE */}
      <img
        src={item.imageUrl}
        alt={`${item.title} mehendi design`}
        loading="lazy"
        className="h-full w-full object-cover saturate-[.75] transition duration-700 group-hover:scale-110"
      />

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* DESIGN TYPE */}
      <span className="absolute left-3 top-3 rounded-full border border-white/40 bg-black/20 px-3 py-1 text-[9px] uppercase tracking-wider text-white backdrop-blur-sm">
        {item.isStatic ? "Showcase" : "Our Work"}
      </span>

      {/* CATEGORY */}
      <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-1 text-[8px] uppercase tracking-wider text-white backdrop-blur-sm">
        {item.category}
      </span>

      {/* CONTENT */}
      <div className="absolute bottom-4 left-4 right-3 flex items-end justify-between text-white">
        <div className="min-w-0">
          <h3 className="font-display text-xl">
            {item.title}
          </h3>

          <p className="text-[9px] text-white/75">
            {item.description || "Nazia Mehendi"}
          </p>
        </div>

        {/* BOOK BUTTON */}
        <button
          type="button"
          onClick={onBook}
          aria-label={`Book ${item.title} design`}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white transition hover:bg-white hover:text-black"
        >
          <ArrowUpRight size={15} />
        </button>
      </div>
    </article>
  );
}