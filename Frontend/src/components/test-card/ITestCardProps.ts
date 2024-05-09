import { ITest } from "@/shared/interfaces";

export interface ITestCardProps {
  test: ITest;
  onDeleted: (id: string) => void;
}