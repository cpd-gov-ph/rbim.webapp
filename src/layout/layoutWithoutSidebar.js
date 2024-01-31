import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

import { Outlet } from "react-router-dom";
//scss
import "./style.scss";
import PrivateRoute from "../privateRoute";
//pages

export default function LayoutNoSidebar(props) {
  // let pathname = window.location.pathname;
  // let noSidebar = pathname === "/brandPage";
  const [showNav, setShowNav] = useState(false);

  // useEffect(()=>{
  //   let noSidebar = pathname === '/brandPage'
  //   setSidebarHide(noSidebar)
  // },[])

  return (
    <>
      <PrivateRoute>
        <Header handleNav={() => setShowNav(!showNav)} handleShow={showNav} />
        <main className="main-layout">
          {showNav && <Sidebar handleShow={showNav} />}
          <div className="main-body full">
            <Outlet></Outlet>
          </div>
        </main>
      </PrivateRoute>
    </>
  );
}
