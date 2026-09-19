
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  PlayCircle,
  ArrowDown,
  MoveRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { scrollToSection } from "../lib/scroll";
import { useEffect, useState } from "react";




export default function Hero() {
function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;

      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      // Smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return <>{count}+</>;
}

  return (
    <section
      id="home"
      className="container-shell relative overflow-hidden py-10 sm:py-12 lg:min-h-[650px]"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.08fr]">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <p className="eyebrow">Tradition meets creativity</p>

          <h1 className="display-title text-5xl sm:text-7xl">
            Art on
            <br />
            <em>Your Hands</em>
          </h1>

          <p className="my-7 max-w-sm text-sm leading-7 text-[#62594f]">
            Custom mehendi designs for every story, every celebration.
          </p>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              onClick={() => scrollToSection("designs")}
              className="primary-button"
            >
              Explore Designs
              <ArrowUpRight size={16} />
            </button>

            <Link
              to="/designs"
              className="group flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#6a4432]/30 px-4 py-3 text-xs transition hover:bg-[#6a4432] hover:text-white"
            >
              View More of My Designs
              <MoveRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            {/* <button
              onClick={() => scrollToSection("about")}
              className="flex items-center gap-2 text-xs"
            >
              <PlayCircle size={35} strokeWidth={1.2} />
              Watch Story
            </button> */}
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-3 sm:mt-12 sm:flex sm:flex-wrap sm:gap-10">
            <div>
             <p className="font-display text-3xl">
  <AnimatedCounter target={50} duration={2000} />
</p>
              <p className="text-[10px] text-[#81766a]">Happy Clients</p>
            </div>

            <div>
              <strong className="font-display text-2xl font-normal">
                All Types
              </strong>
              <p className="text-[10px] text-[#81766a]">Mehendi Designs</p>
            </div>

            <div>
              <strong className="font-display text-2xl font-normal">
                Your Moments
              </strong>
              <p className="text-[10px] text-[#81766a]">Our Art</p>
            </div>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative flex justify-center"
        >
          <img
            className="h-[360px] w-full max-w-xl rounded-[180px_180px_0_0] object-cover saturate-[.7] sm:h-[520px] sm:rounded-[220px_220px_0_0]"
            // src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1100&q=90"
            src="/showcase/hero-image.png"
            alt="Sample intricate mehendi design on a hand"
          />

          <p className="absolute right-3 top-3 rotate-[-10deg] font-display text-2xl italic leading-none text-[#8a684d] sm:top-1 sm:text-3xl">
            More
            <br />
            than
            <br />
            Mehendi ♡
          </p>
        </motion.div>
      </div>

      {/* Auto Scrolling Design Types */}
      {/* <div className="mt-12 overflow-hidden border-y border-[#6a4432]/15 py-4">
        <motion.div
          className="flex w-max gap-10 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...designTypes, ...designTypes, ...designTypes].map(
            (type, index) => (
              <div
                key={`${type}-${index}`}
                className="flex items-center gap-10"
              >
                <span className="font-display text-xl italic text-brown/70">
                  {type}
                </span>

                <span className="text-sm text-brown/40">✦</span>
              </div>
            ),
          )}
        </motion.div>
      </div> */}

      {/* Scroll Indicator */}
      <motion.button
        onClick={() => scrollToSection("designs")}
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mx-auto mt-8 flex flex-col items-center gap-2 text-center text-[9px] tracking-[.25em] text-[#81766a]"
      >
        SCROLL TO EXPLORE
        <ArrowDown
          className="rounded-full border border-[#81766a] p-2"
          size={34}
        />
      </motion.button>
    </section>
  );
}
