export default function SectionHeading({ eyebrow, title, className = '' }) {
  return <div className={className}><p className="eyebrow">{eyebrow}</p><h2 className="display-title text-4xl md:text-5xl">{title}</h2></div>;
}
