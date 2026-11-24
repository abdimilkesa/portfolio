import { Brain, Cpu, Layers, Server, Sparkles } from 'lucide-react';
import { brandIcons } from '../lib/brands';

const lucide = {
  brain: Brain,
  cpu: Cpu,
  sparkles: Sparkles,
  layers: Layers,
  api: Server,
};

export function TechIcon({ name, className = 'h-5 w-5' }) {
  const brand = brandIcons[name];
  if (brand) {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path fill="currentColor" d={brand.path} />
      </svg>
    );
  }
  const Icon = lucide[name] || Sparkles;
  return <Icon className={className} aria-hidden="true" strokeWidth={1.75} />;
}
