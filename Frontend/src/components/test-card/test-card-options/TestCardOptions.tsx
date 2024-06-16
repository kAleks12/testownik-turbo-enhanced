import React from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  LinkButton,
} from "@/components/ui";
import { EllipsisVertical, PencilLine } from "lucide-react";
import Client from "@/api/Client";
import { ITestCardOptionsProps } from "./ITestCardOptionsProps";
import DeleteConfirmationPopup from "@/components/confirmation-message/DeleteConfirmationPopup";

const TestCardOptions = (props: ITestCardOptionsProps) => {
  const { testId, onDeleted } = props;

  const handleDelete = () => {
    Client.Tests.deleteTest(testId).then(() => {
      onDeleted(testId);
    });
  };

  const stopPropagate = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <EllipsisVertical className="h-4 w-4" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <LinkButton
            href={`/edit/${testId}`}
            variant="ghost"
            className="h-5"
            onClick={stopPropagate}
          >
            <div className="flex flex-row gap-2 align-center justify-center">
              <PencilLine className="h-4 w-4" />
              Edytuj
            </div>
          </LinkButton>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={stopPropagate}>
          <DeleteConfirmationPopup
            onConfirm={handleDelete}
            showButtonLabel
            narrow
            deletePopupHeader="Czy na pewno chcesz usunąć wybrany testownik?"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TestCardOptions;
