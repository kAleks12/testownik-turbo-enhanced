"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandList,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IComboboxProps } from "./IComboboxProps";

interface IComboboxItem {
  key: string;
  value: string;
}

const Combobox = <T,>(props: IComboboxProps<T>) => {
  const {
    items,
    selectedItem,
    onItemSelected,
    keyPath,
    valuePath,
    getItemValue,
    getSelectedItemHeader: getSelectedItemValue,
    required,
  } = props;
  const [open, setOpen] = React.useState(false);
  const [itemsSource, setItemsSource] = React.useState<IComboboxItem[]>([]);
  const [selectedValue, setSelectedValue] = React.useState<string>("");

  const getKey = React.useCallback(
    (item: T): string => {
      return item[keyPath as keyof T]?.toString() ?? "";
    },
    [keyPath]
  );

  const getValue = React.useCallback(
    (item: T | undefined, selected = false): string => {
      if (!item) {
        return "";
      }
      if (selected && getSelectedItemValue) {
        return getSelectedItemValue(item) ?? "";
      }
      if (getItemValue) {
        return getItemValue(item) ?? "";
      }

      if (valuePath) {
        return item[valuePath as keyof T]?.toString() ?? "";
      }
      throw new Error("getItemValue or valuePath must be provided.");
    },
    [getItemValue, getSelectedItemValue, valuePath]
  );

  const onSelect = (selectedKey: string) => {
    const selectedValue = items.find((item) => getKey(item) === selectedKey);
    onItemSelected(selectedValue ?? undefined);
    setOpen(false);
  };

  React.useEffect(() => {
    const newItems = items.map((item) => {
      if (!keyPath || !getKey(item)) {
        throw new Error("keyPath must be provided.");
      }
      return {
        key: getKey(item) ?? "",
        value: getValue(item) ?? "",
      };
    });
    setItemsSource(newItems ?? []);
  }, [getKey, getValue, items, keyPath]);

  React.useEffect(() => {
    setSelectedValue(getValue(selectedItem, true) ?? "");
  }, [getValue, selectedItem]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            required && !selectedItem && "border-red-500 border-2"
          )}
        >
          {selectedValue || "Select value..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[800px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandList>
            {itemsSource?.map((item) => (
              <CommandItem
                key={item.key}
                value={item.value}
                onSelect={() => onSelect(item.key)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedItem && getKey(selectedItem) === item.key
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {item.value}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
