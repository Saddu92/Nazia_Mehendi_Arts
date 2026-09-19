import { useState } from 'react';
import { ArrowUpRight, Menu, X, Leaf } from 'lucide-react';
import { navItems } from '../data/content';
import { scrollToSection } from '../lib/scroll';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className="sticky top-0 z-50 border-b border-[#d8cdbc]/70 bg-cream/90 backdrop-blur-md">
    <div className="container-shell flex h-[72px] items-center justify-between sm:h-20">
      <button onClick={() => scrollToSection('home', close)} className="flex items-center gap-2 text-left" aria-label="Go home">
        <Leaf className="-rotate-12 text-brown" size={30} strokeWidth={1.2}/><span><span className="block font-display text-[28px] leading-none sm:text-3xl">Nazia</span><span className="block text-[7px] tracking-[0.22em] sm:text-[8px]">MEHENDI ARTIST</span></span>
      </button>
      <nav className={`${open ? 'absolute inset-x-0 top-[72px] flex' : 'hidden'} flex-col gap-1 border-b border-[#d8cdbc] bg-cream p-4 shadow-lg sm:top-20 md:static md:flex md:flex-row md:items-center md:gap-7 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
        {navItems.map(item => <button key={item.id} onClick={() => scrollToSection(item.id, close)} className="rounded-lg px-3 py-3 text-left text-sm hover:bg-paper hover:text-brown md:p-2 md:text-xs md:hover:bg-transparent">{item.label}</button>)}
        <button onClick={() => scrollToSection('contact', close)} className="primary-button mt-1 md:mt-0">Book Now <ArrowUpRight size={15}/></button>
      </nav>
      <button className="grid h-11 w-11 place-items-center rounded-full md:hidden" onClick={() => setOpen(value => !value)} aria-label="Toggle navigation" aria-expanded={open}>{open ? <X/> : <Menu/>}</button>
    </div>
  </header>;
}
