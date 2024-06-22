export interface IDeleteConfirmationPopupProps {
  onConfirm: () => void;
  deletePopupHeader: string;
  showButtonLabel?: boolean;
  narrow?: boolean;
}
