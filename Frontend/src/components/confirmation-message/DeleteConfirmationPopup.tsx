import React from "react";
import { Trash } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui";
import { IDeleteConfirmationPopupProps } from "./IDeleteConfirmationPopup";

const DeleteConfirmationPopup = (props: IDeleteConfirmationPopupProps) => {
  const { showButtonLabel, deletePopupHeader, narrow, onConfirm } = props;
  const [isOpen, setIsOpen] = React.useState(false);

  const onDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClose();
    onConfirm();
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const onOpen = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className={narrow ? "h-5" : ""}
          variant="ghost"
          onClick={onOpen}
        >
          <div className="flex flex-row gap-2 align-center justify-center">
            <Trash className="h-4 w-4" />
            {showButtonLabel && "Usuń"}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="font-bold">{deletePopupHeader}</DialogHeader>
        <p>
          Tej akcji nie można cofnąć i spowoduje usunięcie u wszystkich
          użytkowników
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Anuluj
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
            onClick={onDeleteClick}
          >
            Tak, usuń
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationPopup;
