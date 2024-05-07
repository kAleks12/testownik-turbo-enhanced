export interface IComboboxProps<T> {
  items: T[];
  keyPath: string;
  valuePath?: string;
  getItemValue?: (item: T) => string;
  selectedItem: T | null;
  onItemSelected: (value: T | null) => void;
}
