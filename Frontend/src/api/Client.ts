import axios, { AxiosError } from "axios";
import { DEFAULT_EP } from "@/shared/utils/constants";
import { ITest } from "@/shared/interfaces/ITest";
import LocalStorage from "@/shared/utils/LocalStorage";
import { LocalStorageElements, StatusCodes } from "@/shared/enums";
import {
  IAnswearUpdate,
  ICourse,
  IIdResponse,
  IQuestionUpdate,
  ITestUpdate,
  IUser,
} from "@/shared/interfaces";

axios.interceptors.request.use((setup) => {
  const user = LocalStorage.getStoredValue<IUser>(LocalStorageElements.User);

  if (user?.token) {
    setup.headers.Authorization = `Bearer ${user.token}`;
  }

  return setup;
});

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error(error);
    if (error.message === "Network Error" && !error.response) {
      console.error("Network error - make sure API is running!");
    }

    if (!error.response) {
      return Promise.reject(error);
    }

    const { status } = error.response;

    switch (status) {
      case StatusCodes.BadRequest:
        break;

      case StatusCodes.Unauthorized:
        window.alert("Sesja wygasła, zaloguj się ponownie");
        window.location.href = "/";
        break;

      case StatusCodes.Gone:
        window.location.href = "/not-found";
        break;

      case StatusCodes.InternalServerError:
        window.location.href = "/server-error";
        break;

      default:
        break;
    }

    return Promise.reject(error);
  }
);

const Client = {
  getTests: async () =>
    axios.get<ITest[]>(`${DEFAULT_EP}/test`).then((response) => response.data),
  getActiveTests: async () =>
    axios
      .get<ITest[]>(`${DEFAULT_EP}/test/active`)
      .then((response) => response.data),
  getTest: async (testId: string) =>
    axios
      .get<ITest>(`${DEFAULT_EP}/test/${testId}`)
      .then((response) => response.data),
  postTest: async (test: ITest) =>
    axios
      .post<IIdResponse>(`${DEFAULT_EP}/test`, test)
      .then((response) => response.data),
  putTest: async (testId: string, test: ITestUpdate) =>
    axios
      .put(`${DEFAULT_EP}/test/${testId}`, test)
      .then((response) => response.data),
  deleteTest: async (testId: string) =>
    axios
      .delete(`${DEFAULT_EP}/test/${testId}`)
      .then((response) => response.data),
  postQuestion: async (question: IQuestionUpdate) =>
    axios
      .post<IIdResponse>(`${DEFAULT_EP}/question`, question)
      .then((response) => response.data),
  putQuestion: async (questionId: string, question: IQuestionUpdate) =>
    axios
      .put<IIdResponse>(`${DEFAULT_EP}/question/${questionId}`, question)
      .then((response) => response.data),
  deleteQuestion: async (questionId: string) =>
    axios
      .delete(`${DEFAULT_EP}/question/${questionId}`)
      .then((response) => response.data),
  postAnswear: async (answear: IAnswearUpdate) =>
    axios
      .post<IIdResponse>(`${DEFAULT_EP}/answer`, answear)
      .then((response) => response.data),
  putAnswear: async (answearId: string, answear: IAnswearUpdate) =>
    axios
      .put<IIdResponse>(`${DEFAULT_EP}/answer/${answearId}`, answear)
      .then((response) => response.data),
  deleteAnswear: async (answearId: string) =>
    axios
      .delete(`${DEFAULT_EP}/answer/${answearId}`)
      .then((response) => response.data),
  getCourses: async () =>
    axios
      .get<ICourse[]>(`${DEFAULT_EP}/course`)
      .then((response) => response.data),
};

export default Client;
