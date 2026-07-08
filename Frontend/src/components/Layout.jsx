// This file contains the Layout component for the expense tracker application.

import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import TopBar from "./TopBar";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}