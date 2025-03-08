import { ILogin, IRegister, IUser } from "@/shared/interfaces";
import { DEFAULT_EP } from "@/shared/utils/constants";
import axios from "axios";

const User = {
  login: async (login: ILogin) =>
    axios.post<IUser>(`${DEFAULT_EP}/user/login`, login).then((response) => response.data),
  register: async (register: IRegister) =>
    axios.post<IUser>(`${DEFAULT_EP}/user/register`, register).then((response) => response.data),
};

export default User;