import { Syringe, Droplet, Activity, FlaskConical, Wind, type LucideIcon } from 'lucide-react';

export const categoryIcons: Record<string, LucideIcon> = {
  'fluid-iv': Syringe,
  'blood-transfusion': Droplet,
  'surgical-critical': Activity,
  'specialty-oncology': FlaskConical,
  'facility-infrastructure': Wind,
};

export function getCategoryIcon(categoryId: string): LucideIcon {
  return categoryIcons[categoryId] || FlaskConical;
}
