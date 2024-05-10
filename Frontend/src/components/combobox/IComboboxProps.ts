import { IComboboxGroup } from "./IComboboxGroup";

export interface IComboboxProps<T, K> {
  items: T[];
  keyPath: string;
  valuePath?: string;
  getItemValue?: (item: T) => string;
  getSelectedItemHeader?: (item: T) => string;
  selectedItem: T | undefined;
  onItemSelected: (value: T | undefined) => void;
  groupPath?: string;
  groups?: IComboboxGroup<K>[];
  dropdownWidth?: string;
  required?: boolean;
}
