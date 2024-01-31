
import React, { useState, useEffect } from "react";
//lib
import { NavLink, useNavigate } from "react-router-dom";
//scss
import "./style.scss";
import { userRole } from '../../api';

import dashboard from '../../assets/images/icons/dashboard.svg'
import dashboardWhite from '../../assets/images/icons/dashboardWhite.svg'
import legal from '../../assets/images/icons/legal.svg'
import legalWhite from '../../assets/images/icons/legalWhite.svg'
import survey from '../../assets/images/icons/survey.svg'
import surveyWhite from '../../assets/images/icons/surveyWhite.svg'
import barangay from '../../assets/images/icons/barangay.svg'
import barangayWhite from '../../assets/images/icons/barangayWhite.svg'
import reviewer from '../../assets/images/icons/reviewer.svg'
import reviewerWhite from '../../assets/images/icons/reviewerWhite.svg'
import collector from '../../assets/images/icons/collector.svg'
import collectorWhite from '../../assets/images/icons/collectorWhite.svg'
import report from '../../assets/images/icons/report.svg'
import reportWhite from '../../assets/images/icons/reportWhite.svg'

import { FaSnowflake } from 'react-icons/fa'

const Sidebar = (props) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <nav className={props.handleShow ? "mobileSide" : "sidebar customScroll"}>
        <ul>
          {userRole()?.role == 'superadmin' ? (
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <div>
                  <img src={dashboardWhite} alt="dashboard" className="activeIcon" />
                  <img src={dashboard} alt="dashboard" className="inactiveIcon" />
                </div>
                <div>Dashboard</div>
              </NavLink>
            </li>
          ) : ' '}

          {userRole()?.role == 'barangay' ? (
            <li>
              <NavLink
                to="/barangay-survey"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <div>
                  <img src={surveyWhite} alt="survey" className="activeIcon" />
                  <img src={survey} alt="survey" className="inactiveIcon" />
                </div>
                <div>Survey </div>
              </NavLink>
            </li>
          ) : ' '}
          
          {userRole()?.role == 'superadmin' || userRole()?.role == 'barangay' ? (
            <li>
              <NavLink
                to="/data-collector"
                className={({ isActive }) => (isActive ? "active reviewer" : "reviewer")}
              >
                <div>
                  <img src={collectorWhite} alt="collector" className="activeIcon" />
                  <img src={collector} alt="collector" className="inactiveIcon" />
                </div>
                <div>Data Collector </div>
              </NavLink>
            </li>) : ""}

          {userRole()?.role == 'superadmin' || userRole()?.role == 'barangay' ? (
            <li>
              <NavLink
                to="/data-reviewer"
                className={({ isActive }) => (isActive ? "active reviewer" : "reviewer")}
              >
                <div>
                  <img src={reviewerWhite} alt="reviewer" className="activeIcon" />
                  <img src={reviewer} alt="reviewer" className="inactiveIcon" />
                </div>
                <div>Data Reviewer </div>
              </NavLink>
            </li>) : ""}

          {userRole()?.role == 'superadmin' ? (
            <li>
              <NavLink
                to="/barangay"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <div>
                  <img src={barangayWhite} alt="barangay" className="activeIcon" />
                  <img src={barangay} alt="barangay" className="inactiveIcon" />
                </div>
                <div>Barangay Officials</div>
              </NavLink>
            </li>
          ) : ' '}

          {userRole()?.role == 'superadmin' ? (
            <li>
              <NavLink
                to="/survey-question"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <div>
                  <img src={surveyWhite} alt="survey" className="activeIcon" />
                  <img src={survey} alt="survey" className="inactiveIcon" />
                </div>
                <div>Survey Questions </div>
              </NavLink>
            </li>
          ) : ' '}


          {userRole()?.role == 'data_reviewer' ? (
            <li>
              <NavLink
                to="/data-reviewer-survey"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <div>
                  <img src={surveyWhite} alt="survey" className="activeIcon" />
                  <img src={survey} alt="survey" className="inactiveIcon" />
                </div>
                <div>Survey </div>
              </NavLink>
            </li>
          ) : ' '}

          {userRole()?.role == 'superadmin' || userRole()?.role == 'barangay' ? (
            <li>
              <NavLink
                to="/reports"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <div>
                  <img src={reportWhite} alt="report" className="activeIcon" />
                  <img src={report} alt="report" className="inactiveIcon" />
                </div>
                <div>Reports</div>
              </NavLink>
            </li>
          ) : ""}
          <li>
            <NavLink
              to="/termsConditions"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <div>
                <img src={legalWhite} alt="legal" className="activeIcon" />
                <img src={legal} alt="legal" className="inactiveIcon" />
              </div>
              <div>Legal & Documentation</div>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default Sidebar;
