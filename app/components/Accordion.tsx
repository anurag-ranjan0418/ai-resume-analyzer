import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";
import { cn } from "~/lib/utils";

/**
 * Accordion Context State Definition
 * Tracks which items are currently expanded and provides methods to manipulate state.
 */
interface AccordionContextType {
  activeItems: string[];
  toggleItem: (id: string) => void;
  isItemActive: (id: string) => boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

/**
 * Internal hook to access Accordion state.
 * Validates that sub-components (Header, Content) are correctly nested within the Provider.
 */
const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
  }
  return context;
};

interface AccordionProps {
  children: ReactNode;
  defaultOpen?: string;
  allowMultiple?: boolean;
  className?: string;
}

/**
 * Root Accordion Component
 * Acts as the state orchestrator. Supports 'single-select' or 'multi-select' modes.
 */
export const Accordion: React.FC<AccordionProps> = ({
  children,
  defaultOpen,
  allowMultiple = false,
  className = "",
}) => {
  // Array of IDs allows for multiple items to be open simultaneously if enabled
  const [activeItems, setActiveItems] = useState<string[]>(
    defaultOpen ? [defaultOpen] : []
  );

  // Core logic for opening/closing items based on the allowMultiple constraint
  const toggleItem = (id: string) => {
    setActiveItems((prev) => {
      if (allowMultiple) {
        return prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id];
      } else {
        // In single mode, toggle the clicked item and close all others
        return prev.includes(id) ? [] : [id];
      }
    });
  };

  const isItemActive = (id: string) => activeItems.includes(id);

  return (
    <AccordionContext.Provider value={{ activeItems, toggleItem, isItemActive }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

/**
 * AccordionItem
 * A structural wrapper for a single row. Ensures a consistent border and overflow behavior.
 */
export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  children,
  className = "",
}) => {
  return (
    <div className={cn("overflow-hidden border-b border-gray-200", className)}>
      {children}
    </div>
  );
};

interface AccordionHeaderProps {
  itemId: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

/**
 * AccordionHeader
 * The interactive trigger. Manages accessibility via ARIA attributes and
 * visual feedback through a rotating chevron icon.
 */
export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  itemId,
  children,
  className = "",
  icon,
  iconPosition = "right",
}) => {
  const { toggleItem, isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);

  // SVG Chevron with rotation transition based on active state
  const defaultIcon = (
    <svg
      className={cn("w-5 h-5 transition-transform duration-200", {
        "rotate-180": isActive,
      })}
      fill="none"
      stroke="#98A2B3"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

  return (
    <button
      type="button"
      onClick={() => toggleItem(itemId)}
      aria-expanded={isActive}
      className={cn(
        "w-full px-4 py-3 text-left focus:outline-none transition-colors duration-200 flex items-center justify-between cursor-pointer",
        className
      )}
    >
      <div className="flex items-center space-x-3">
        {iconPosition === "left" && (icon || defaultIcon)}
        <div className="flex-1">{children}</div>
      </div>
      {iconPosition === "right" && (icon || defaultIcon)}
    </button>
  );
};

interface AccordionContentProps {
  itemId: string;
  children: ReactNode;
  className?: string;
}

/**
 * AccordionContent
 * The collapsible pane. Uses max-height and opacity transitions to create
 * a smooth slide-down effect when the corresponding header is toggled.
 */
export const AccordionContent: React.FC<AccordionContentProps> = ({
  itemId,
  children,
  className = "",
}) => {
  const { isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);

  return (
    <div
      role="region"
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        // CSS Transition hack: max-h-0 to max-h-fit (handled by Tailwind)
        isActive ? "max-h-fit opacity-100" : "max-h-0 opacity-0",
        className
      )}
    >
      <div className="px-4 py-3">{children}</div>
    </div>
  );
};