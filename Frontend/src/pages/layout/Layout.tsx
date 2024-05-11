import { Toaster } from "@/components/ui";
import { LocalStorageElements, Theme } from "@/shared/enums";
import LocalStorage from "@/shared/utils/LocalStorage";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  React.useEffect(() => {
    const theme = LocalStorage.getStoredValue<Theme>(
      LocalStorageElements.Theme
    );

    if (
      theme === Theme.Dark ||
      (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add(Theme.Dark);
    } else {
      document.documentElement.classList.remove(Theme.Dark);
    }
  }, []);

  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
};

export default Layout;
