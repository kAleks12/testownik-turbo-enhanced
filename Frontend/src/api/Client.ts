import axios, { AxiosError } from "axios";
import LocalStorage from "@/shared/utils/LocalStorage";
import { LocalStorageElements, StatusCodes } from "@/shared/enums";
import { IUser } from "@/shared/interfaces";
import Tests from "./Tests";
import Questions from "./Questions";
import Answers from "./Answers";
import Courses from "./Courses";
import User from "./User";
import Routes from "@/shared/utils/routes";

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
      // case StatusCodes.BadRequest:
      //   break;

      case StatusCodes.Unauthorized:
        if (window.location.pathname === Routes.Login || window.location.pathname === Routes.Register) {
          return Promise.reject(error);
        }

        window.alert("Sesja wygasła, zaloguj się ponownie");
        window.location.href = "/";
        break;

      // case StatusCodes.Gone:
      //   window.location.href = "/not-found";
      //   break;

      // case StatusCodes.InternalServerError:
      //   window.location.href = "/server-error";
      //   break;

      default:
        break;
    }

    return Promise.reject(error);
  }
);

const Client = {
  Tests,
  Questions,
  Answers,
  Courses,
  User
};

export default Client;
