import { AxiosError } from "axios";
import { IError } from "../interfaces";

export const shuffle = <T>(array: T[]): T[] => {
  const arrCpy = deepCopy(array);
  return arrCpy.sort(() => Math.random() - 0.5);
};

export const deepCopy = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value));
};

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  return new Date(dateString).toLocaleDateString("pl-PL", options);
};

export const getErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError;
  const errorData = axiosError?.response?.data as IError;
  const errorMessage = errorData?.error || "Wystąpił błąd.";
  return errorMessage;
}