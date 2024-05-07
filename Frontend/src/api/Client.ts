import axios, { AxiosError } from "axios";
import { DEFAULT_EP } from "@/shared/utils/constants";
import { ITest } from "@/shared/interfaces/ITest";
import LocalStorage from "@/shared/utils/LocalStorage";
import { LocalStorageElements, StatusCodes } from "@/shared/enums";
import { IUser } from "@/shared/interfaces";
import { redirect } from "react-router-dom";

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
        // return refreshToken(error);
        break;

      case StatusCodes.Gone:
        redirect("/not-found");
        break;

      case StatusCodes.InternalServerError:
        redirect("/server-error");
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
  getTest: async (test_id: string) =>
    axios
      .get<ITest>(`${DEFAULT_EP}/test/${test_id}`)
      .then((response) => response.data),
  postTest: async (test: ITest) =>
    axios
      .post<string>(`${DEFAULT_EP}/test`, test)
      .then((response) => response.data),
};

export default Client;
