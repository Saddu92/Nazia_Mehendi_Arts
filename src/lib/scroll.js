export function scrollToSection(id, closeMenu) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  closeMenu?.();
}
