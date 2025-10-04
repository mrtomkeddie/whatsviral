
import { Telescope } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 text-xl font-bold font-headline text-sidebar-foreground">
      <Telescope className="w-6 h-6 text-primary" />
      <span>TrendTorch</span>
    </div>
  );
}
