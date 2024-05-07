import { AuthActions, LocalStorageElements } from "@/shared/enums";
import { IUser } from "@/shared/interfaces";
import { Reducer } from "react";
import LocalStorage from "../../utils/LocalStorage";

export interface AuthAction {
  type: AuthActions;
  payload?: IUser;
}

export const AuthReducer: Reducer<IUser | undefined, AuthAction> = (
  state,
  action
) => {
  switch (action.type) {
    case AuthActions.SetUser: {
      LocalStorage.setStoredValue(LocalStorageElements.User, action.payload);
      return action.payload;
    }
    case AuthActions.ClearUser: {
      LocalStorage.removeStoredItem(LocalStorageElements.User);
      return undefined;
    }
    case AuthActions.RefreshUser: {
      const user = LocalStorage.getStoredValue<IUser | undefined>(
        LocalStorageElements.User
      );
      if (!user) {
        return undefined;
      }
      return user;
    }
    default:
      return state;
  }
};
