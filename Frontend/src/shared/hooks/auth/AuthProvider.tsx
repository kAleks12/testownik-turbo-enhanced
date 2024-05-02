import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useMemo,
  useReducer,
} from "react";
import { AuthAction, AuthReducer } from "./AuthReducer";
import { IUser } from "@/shared/interfaces";
import { AuthActions, LocalStorageElements } from "@/shared/enums";
import { AUTH_LINK } from "@/shared/utils/constants";
import { getStoredValue } from "../../utils/localStorageHelper";

interface InitialState {
  login: () => void;
  logout: () => void;
  user: IUser | undefined;
  dispatchUser: Dispatch<AuthAction>;
}

export const AuthContext = createContext<InitialState>({
  dispatchUser: () => null,
  login: () => null,
  logout: () => null,
  user: undefined,
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const user = getStoredValue<IUser | undefined>(LocalStorageElements.User);

  const [state, dispatch] = useReducer(AuthReducer, user ?? undefined);

  const value = useMemo(() => {
    const login = () => {
      window.open(AUTH_LINK, "_self");
    };

    const logout = () => {
      dispatch({ type: AuthActions.ClearUser });
    };

    return {
      login,
      logout,
      user: state,
      dispatchUser: dispatch,
    };
  }, [state, dispatch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
