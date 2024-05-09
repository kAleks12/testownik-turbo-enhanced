import { IAnswear } from "@/shared/interfaces";

export interface IEditAnswearProps {
  answear: IAnswear;
  onDeleted: (id: string) => void;
}
