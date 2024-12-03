import { Outlet } from "react-router-dom";
import { Header } from "../header/indes";

export function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
