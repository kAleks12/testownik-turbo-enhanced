import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui";
import { IProgressPopupProps } from "./IProgressPopupProps";

const ProgressPopup = (props: IProgressPopupProps) => {
  const { onConfirm, open } = props;
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const onConfirmClick = () => {
    onConfirm();
    onClose();
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger></DialogTrigger>
      <DialogContent>
        <DialogHeader className="font-bold">Wczytaj progres</DialogHeader>
        <p>
          Na tym urządzeniu wykryto postęp tego testo. Czy chcesz wznowić
          rozwiązywanie od ostatniego momentu?
          <br />
          <br />
          Rozpoczęcie rozwiązywania testu nadpisze obecny postęp.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Nie
          </Button>
          <Button onClick={onConfirmClick} autoFocus>
            Tak
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressPopup;
