"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

export type AccordionItem = {
  question: string;
  answer: string;
};

type AccordionProps = {
  items: AccordionItem[];
  /** Allow several panels to stay open at once. */
  multiple?: boolean;
};

/**
 * Accessible FAQ accordion: real buttons, `aria-expanded`, animated body,
 * and only one open panel by default so scanning stays easy.
 */
export function Accordion({ items, multiple = false }: AccordionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<number[]>([0]);

  const toggle = (index: number) => {
    setOpen((current) => {
      const isOpen = current.includes(index);
      if (isOpen) return current.filter((i) => i !== index);
      return multiple ? [...current, index] : [index];
    });
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = open.includes(index);
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div
            key={item.question}
            className={`glass rounded-2xl transition-all duration-300 ${
              isOpen
                ? "border-royal/40 shadow-lg shadow-royal/10"
                : "hover:border-royal/25"
            }`}
          >
            <button
              type="button"
              id={buttonId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(index)}
              className="w-full flex items-start justify-between gap-4 text-left px-5 py-4"
            >
              <span className="font-bold text-ink text-sm sm:text-base">
                {item.question}
              </span>
              <span
                className={`mt-0.5 w-6 h-6 shrink-0 rounded-lg grid place-items-center transition-all duration-300 ${
                  isOpen
                    ? "bg-royal text-white rotate-180"
                    : "bg-panel-2 text-ink-muted"
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
            >
              {isOpen && (
                <p className="accordion-body px-5 pb-5 -mt-1 text-sm text-ink-muted leading-relaxed">
                  {item.answer}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
