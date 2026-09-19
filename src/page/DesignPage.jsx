import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { apiUrl } from "../lib/api";
import { Link } from "react-router-dom";

import DesignCard from "../components/DesignCard";

const API_URL = apiUrl();

const categories = [
  "All",
  "Bridal",
  "Arabic",
  "Minimal",
  "Engagement",
  "Traditional",
  "Other",
];

export default function DesignsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDesigns() {
      try {
        const response = await fetch(`${API_URL}/designs`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load designs");
        }

        const fetchedDesigns = Array.isArray(data)
          ? data
          : data.designs || data.data || [];

        setDesigns(fetchedDesigns);
      } catch (error) {
        console.error("Fetch designs error:", error);
        setError("Unable to load designs.");
      } finally {
        setLoading(false);
      }
    }

    fetchDesigns();
  }, []);

  const filteredDesigns = useMemo(() => {
    if (activeCategory === "All") return designs;

    return designs.filter(
      (design) => design.category === activeCategory
    );
  }, [activeCategory, designs]);

  return (
    <main className="min-h-screen bg-[#f5eddf] text-[#30251e]">
      {/* Header */}
      <section className="container-shell py-10">
        <Link
          to="/"
          className="mb-10 inline-flex items-center gap-2 text-xs text-[#6a4432] transition hover:opacity-70"
        >
          <ArrowLeft size={15} />
          Back to Home
        </Link>

        <div className="max-w-3xl">
          <p className="eyebrow">The Pattern Archive</p>

          <h1 className="display-title text-5xl sm:text-7xl">
            Designs for
            <br />
            <em>Every Occasion.</em>
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-7 text-[#62594f]">
            Explore Nazia's collection of handcrafted mehendi designs.
            From intricate bridal patterns to elegant minimal styles.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="container-shell pb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-5 py-2.5 text-xs transition ${
                activeCategory === category
                  ? "border-[#30452f] bg-[#30452f] text-white"
                  : "border-[#6a4432]/25 text-[#6a4432] hover:bg-[#e7dac9]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="container-shell pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow">Curated Collection</p>

            <h2 className="font-display text-3xl">
              {activeCategory === "All"
                ? "All Designs"
                : `${activeCategory} Collection`}
            </h2>
          </div>

          {!loading && (
            <span className="text-xs text-[#81766a]">
              {filteredDesigns.length} Designs
            </span>
          )}
        </div>

        {loading && (
          <p className="py-16 text-center text-sm text-[#81766a]">
            Loading beautiful designs...
          </p>
        )}

        {error && (
          <p className="py-16 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filteredDesigns.map((design) => (
                  <DesignCard
                    key={design._id}
                    design={design}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredDesigns.length === 0 && (
              <div className="rounded-2xl border border-[#6a4432]/15 p-10 text-center">
                <p className="font-display text-xl">
                  No designs yet.
                </p>

                <p className="mt-2 text-sm text-[#81766a]">
                  Check another category.
                </p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Booking CTA */}
      <section className="bg-[#30452f] px-6 py-20 text-center text-[#f5eddf]">
        <p className="text-[10px] uppercase tracking-[.3em] text-[#d6c6a9]">
          Your Moment Awaits
        </p>

        <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl sm:text-6xl">
          Let's create something beautiful.
        </h2>

        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-[#d6cfc2]">
          Found a design you love? Get in touch with Nazia to discuss
          your special occasion.
        </p>

        <Link
          to="/#contact"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#f5eddf] px-6 py-3 text-xs font-medium text-[#30452f] transition hover:bg-white"
        >
          Book Nazia
          <ArrowUpRight size={16} />
        </Link>
      </section>
    </main>
  );
}
