import { MessageCircle, Pin } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { navItems } from "../data/content";
import { scrollToSection } from "../lib/scroll";
import { useNavigate } from "react-router-dom"; 

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#e9e1d4]">
      <div className="container-shell flex flex-wrap items-center justify-between gap-6 py-8">
        <button onClick={() => scrollToSection("home")} className="text-left">
          <span className="block font-display text-3xl">Nazia</span>
          <span className="text-[8px] tracking-[.25em]">
            MEHENDI ARTIST
          </span>
        </button>

        <div className="flex flex-wrap gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-[10px]"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram size={17} />
          </a>

          <a
            href="https://wa.me/910000000000"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
          >
            <MessageCircle size={17} />
          </a>

          <a href="#contact" aria-label="Location">
            <Pin size={17} />
          </a>
        </div>

        <p className="text-right text-[10px] leading-5">
          Art · People · Celebrations
          <br />
          <span className="text-[#877d70]">
            © 2026 Nazia. All rights reserved.
          </span>
        </p>
      </div>

      <div className="grid gap-10 bg-[#31392b] px-6 py-14 text-center text-[#e9e1d4] md:grid-cols-3 md:text-left">
        <div>
          <span className="font-display text-6xl">“</span>

          <p className="font-display text-lg leading-7">
            Let's make your special moments even more beautiful with a touch of
            mehendi.
          </p>

          <small>— Nazia</small>
        </div>

        <div className="self-center text-center text-[10px] uppercase tracking-[.3em]">
          Thank you
          <br />
          <em className="mt-3 block font-display text-base normal-case tracking-normal">
            for being a part of this journey ♡
          </em>
        </div>

        <div className="self-center text-center text-[10px] uppercase leading-8 tracking-[.3em]">
  Mehendi
  <br />
  A little art
  <br />

  <button
    type="button"
    onClick={() => navigate("/admin/login")}
    className="cursor-pointer transition hover:text-[#c9a77b]"
  >
    A lot of love ♡
  </button>
</div>
      </div>
    </footer>
  );
}