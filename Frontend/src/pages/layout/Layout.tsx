import { Toaster } from "@/components/ui";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
};

export default Layout;
