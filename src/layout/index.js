import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

import { Outlet } from "react-router-dom";
//scss
import "./style.scss";
import PrivateRoute from "../privateRoute";
import 'react-toastify/dist/ReactToastify.css';
import Toast from "../components/Toast";
import TermsConditionModal from '../pages/TermsConditions/TermsConditionModal'
import { getData, userRole, getTermsPrivacyStatus } from '../api';
import { useNavigate } from "react-router-dom";

//pages

export default function Layout(props) {
  // const [sidebarHide, setSidebarHide] = useState(false);
  const [showNav, setShowNav] = useState(false)
  let navigate = useNavigate();
  const [termsConditionShowModal, setTermsConditionShowModal] = useState(true);


  const logOut = async () => {
    const res = await getData("logout/", {});
    if (res.status == 1) {
      setTermsConditionShowModal(false);
      localStorage.clear();
      navigate("/login-selection");
    }
  }

  return (
    <>
      {/* <PrivateRoute> */}
      <Header handleNav={() => setShowNav(!showNav)} handleShow={showNav} />
      <main className="main-layout">
        {<Sidebar handleShow={showNav} />}
        <div className="main-body fixed">
          <Toast />
          <Outlet></Outlet>
        </div>
      </main>

      {
        userRole()?.role != 'superadmin' &&
          getTermsPrivacyStatus() == 0 ?
          < TermsConditionModal
            show={termsConditionShowModal}
            onClose={() => setTermsConditionShowModal(false)}
            onLogout={logOut}
          />
          : ''
      }
      {/* </PrivateRoute> */}
    </>
  );
}
