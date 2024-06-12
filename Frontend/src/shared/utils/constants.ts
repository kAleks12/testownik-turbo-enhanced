import { EnvironmentProfiles } from "../enums";

export const TOKEN_LINK = import.meta.env.VITE_TOKEN_LINK;
export const AUTH_LINK = import.meta.env.VITE_AUTH_LINK;
export const DEFAULT_EP = import.meta.env.VITE_DEFAULT_EP;
export const isTestEnv =
  import.meta.env.VITE_APP_ENV === EnvironmentProfiles.Test;
export const DEFAULT_QUESTION_COUNT = 2;
