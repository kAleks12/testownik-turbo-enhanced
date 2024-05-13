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
  CommandGroup,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IComboboxProps } from "./IComboboxProps";

interface IComboboxItem<K> {
  key: string;
  value: string;
  groupValue?: K;
}

const Combobox = <T, K>(props: IComboboxProps<T, K>) => {
  const {
    items,
    selectedItem,
    onItemSelected,
    keyPath,
    valuePath,
    getItemValue,
    getSelectedItemHeader: getSelectedItemValue,
    groupPath,
    groups,
    required,
    dropdownWidth,
  } = props;
  const [open, setOpen] = React.useState(false);
  const [itemsSource, setItemsSource] = React.useState<IComboboxItem<K>[]>([]);
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

  const getGroupValue = React.useCallback(
    (item: T): K => {
      if (!groupPath) {
        throw undefined;
      }
      return item[groupPath as keyof T] as K;
    },
    [groupPath]
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
        groupValue: getGroupValue(item),
      };
    });
    setItemsSource(newItems ?? []);
  }, [getGroupValue, getKey, getValue, items, keyPath]);

  React.useEffect(() => {
    setSelectedValue(getValue(selectedItem, true) ?? "");
  }, [getValue, selectedItem]);

  const comboItem = (item: IComboboxItem<K>) => {
    return (
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
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
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
          {selectedValue || "Wybierz z listy..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: dropdownWidth ?? "300px" }}
      >
        <Command>
          <CommandInput placeholder="Wyszukaj..." />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandList>
            {groups
              ? groups.map((group, index) => (
                  <CommandGroup key={index} heading={group.header}>
                    {itemsSource
                      ?.filter((item) => item.groupValue === group.groupValue)
                      .map((item) => comboItem(item))}
                  </CommandGroup>
                ))
              : itemsSource.map((item) => comboItem(item))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
