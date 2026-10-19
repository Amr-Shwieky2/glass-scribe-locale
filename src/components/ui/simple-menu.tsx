'use client';
/**
 * Lightweight accessible dropdown menu (menu button pattern) for the header.
 * Replaces Radix DropdownMenu there, saving ~28 KB gzipped of JS on every page.
 * Keyboard: Enter/Space/ArrowDown opens, arrows/Home/End move, Esc closes and
 * returns focus to the trigger, Tab closes. Uses the same visual classes as
 * components/ui/dropdown-menu.
 */
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SimpleMenuProps {
  /** Renders the trigger; spread the given props onto a <button>. */
  trigger: (props: React.ButtonHTMLAttributes<HTMLButtonElement> & { ref: React.Ref<HTMLButtonElement> }) => React.ReactNode;
  items: { key: string; label: React.ReactNode; onSelect: () => void; className?: string }[];
  /** Tailwind width class for the menu, e.g. "w-48". */
  className?: string;
}

const SimpleMenu: React.FC<SimpleMenuProps> = ({ trigger, items, className }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  const focusItem = (index: number) => {
    const n = items.length;
    itemRefs.current[((index % n) + n) % n]?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener('pointerdown', onPointer);
    requestAnimationFrame(() => focusItem(0));
    return () => document.removeEventListener('pointerdown', onPointer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, close]);

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const current = itemRefs.current.findIndex((el) => el === document.activeElement);
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); focusItem(current + 1); break;
      case 'ArrowUp': e.preventDefault(); focusItem(current - 1); break;
      case 'Home': e.preventDefault(); focusItem(0); break;
      case 'End': e.preventDefault(); focusItem(items.length - 1); break;
      case 'Escape': e.preventDefault(); close(true); break;
      case 'Tab': close(false); break;
    }
  };

  return (
    <div ref={rootRef} className="relative">
      {trigger({
        ref: triggerRef,
        type: 'button',
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? menuId : undefined,
        onClick: () => setOpen((o) => !o),
        onKeyDown: (e) => {
          if (e.key === 'ArrowDown' && !open) { e.preventDefault(); setOpen(true); }
        },
      })}
      {open && (
        <div
          id={menuId}
          role="menu"
          onKeyDown={onMenuKeyDown}
          className={cn(
            'absolute top-full mt-1 end-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2',
            className
          )}
        >
          {items.map((item, i) => (
            <button
              key={item.key}
              ref={(el) => { itemRefs.current[i] = el; }}
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={() => { item.onSelect(); close(true); }}
              className={cn(
                'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-start',
                item.className
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleMenu;
