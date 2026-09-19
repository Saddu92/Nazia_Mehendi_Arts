import { ArrowUpRight } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { instagramImages } from "../data/content";

export default function InstagramShowcase() {
  return (
    <section className="bg-forest py-16 text-white">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <FaInstagram size={38} />

          <h2 className="mt-4 font-display text-4xl">
            Follow the <em>Journey</em>
          </h2>

          <p className="my-5 text-sm leading-7 text-[#d9ded2]">
            Behind the scenes, new designs, happy clients and more on Instagram.
          </p>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="outline-button"
          >
            Follow on Instagram <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {instagramImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`Instagram preview ${index + 1}`}
              loading="lazy"
              className="h-44 w-full rounded-xl object-cover saturate-[.7]"
            />
          ))}

          <div className="grid h-44 place-items-center rounded-xl border border-[#82907a] text-center font-display text-xl italic text-[#d3c7ae]">
            Good
            <br />
            Designs
            <br />
            Happen
            <br />
            Here ✿
          </div>
        </div>
      </div>
    </section>
  );
}