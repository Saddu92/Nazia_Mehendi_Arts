import { useState } from 'react';
import { ArrowUpRight, Menu, X, Leaf } from 'lucide-react';
import { navItems } from '../data/content';
import { scrollToSection } from '../lib/scroll';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className="sticky top-0 z-50 border-b border-[#d8cdbc]/70 bg-cream/90 backdrop-blur-md">
    <div className="container-shell flex h-20 items-center justify-between">
      <button onClick={() => scrollToSection('home', close)} className="flex items-center gap-2 text-left" aria-label="Go home">
        <Leaf className="-rotate-12 text-brown" size={34} strokeWidth={1.2}/><span><span className="block font-display text-3xl leading-none">Nazia</span><span className="block text-[8px] tracking-[0.25em]">MEHENDI ARTIST</span></span>
      </button>
      <nav className={`${open ? 'absolute left-0 right-0 top-20 flex' : 'hidden'} flex-col gap-2 bg-cream p-6 shadow-lg md:static md:flex md:flex-row md:items-center md:gap-7 md:bg-transparent md:p-0 md:shadow-none`}>
        {navItems.map(item => <button key={item.id} onClick={() => scrollToSection(item.id, close)} className="py-2 text-xs hover:text-brown">{item.label}</button>)}
        <button onClick={() => scrollToSection('contact', close)} className="primary-button">Book Now <ArrowUpRight size={15}/></button>
      </nav>
      <button className="md:hidden" onClick={() => setOpen(value => !value)} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
    </div>
  </header>;
}
