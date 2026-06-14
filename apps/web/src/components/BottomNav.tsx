'use client';

import { Icon, type IconName } from '@/components/icons';

export interface NavItem<T extends string> {
  id: T;
  label: string;
  icon: IconName;
}

export interface BottomNavProps<T extends string> {
  items: NavItem<T>[];
  active: T;
  onChange: (id: T) => void;
}

/** Barra de navegación inferior compartida por los dashboards de rol. */
export function BottomNav<T extends string>({ items, active, onChange }: BottomNavProps<T>) {
  return (
    <nav className="flex shrink-0 border-t border-wire bg-void">
      {items.map((item) => {
        const on = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`flex flex-1 flex-col items-center gap-0.5 px-1 pb-3 pt-2 text-[9px] transition-colors ${
              on ? 'text-cipher' : 'text-fog'
            }`}
          >
            <Icon name={item.icon} className="h-5 w-5" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
