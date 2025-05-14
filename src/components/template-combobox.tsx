/**
 * TemplateCombobox - A dropdown component for selecting note templates
 * 
 * This component provides a user-friendly way to select from predefined templates
 * for the note editor. It uses the Popover and Command components from shadcn/ui.
 * 
 * @module components
 */
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EDITOR_TEMPLATES } from "@/lib/editor";

/**
 * Props for the TemplateCombobox component
 */
export interface TemplateComboboxProps {
  /**
   * Callback function triggered when a template is selected
   * @param content The HTML content of the selected template
   */
  onSelect: (content: string) => void;
}

/**
 * A dropdown component for selecting from predefined note templates
 */
export function TemplateCombobox({ onSelect }: TemplateComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>("");

  /**
   * Handles the selection of a template
   * @param currentValue The value of the selected template
   */
  const handleSelect = React.useCallback((currentValue: string) => {
    // Find the selected template by its value
    const template = EDITOR_TEMPLATES.find(t => t.value === currentValue);
    
    if (template) {
      // Set the selected template value
      setSelectedTemplate(currentValue);
      
      // Call the onSelect callback with the template content
      onSelect(template.content);
      
      // Close the dropdown
      setOpen(false);
    }
  }, [onSelect]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[190px] justify-between"
        >
          {selectedTemplate
            ? EDITOR_TEMPLATES.find((template) => template.value === selectedTemplate)?.label
            : "Use a Template"}
          <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="center">
        <Command>
          <CommandList>
            <CommandGroup>
              {EDITOR_TEMPLATES.map((template) => (
                <CommandItem
                  key={template.value}
                  value={template.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedTemplate === template.value 
                        ? "opacity-100" 
                        : "opacity-0"
                    )}
                  />
                  {template.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 