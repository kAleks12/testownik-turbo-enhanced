import React from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  LinkButton,
} from "@/components/ui";
import { EllipsisVertical, PencilLine, Trash } from "lucide-react";
import Client from "@/api/Client";
import { ITestCardOptionsProps } from "./ITestCardOptionsProps";

const TestCardOptions = (props: ITestCardOptionsProps) => {
  const { testId, onDeleted } = props;

  const handleDelete = () => {
    Client.Tests.deleteTest(testId).then(() => {
      onDeleted(testId);
    });
  };

  const editTest = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  const deleteTest = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleDelete();
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
            onClick={editTest}
          >
            <div className="flex flex-row gap-2 align-center justify-center">
              <PencilLine className="h-4 w-4" />
              Edytuj
            </div>
          </LinkButton>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button className="h-5" variant="ghost" onClick={deleteTest}>
            <div className="flex flex-row gap-2 align-center justify-center">
              <Trash className="h-4 w-4" />
              Usuń
            </div>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TestCardOptions;
