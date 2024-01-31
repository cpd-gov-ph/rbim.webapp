import { NavLink, Outlet } from "react-router-dom";
export default function BarangaySurvey() {
    return (
        <>
            <h4 className="page-title">Survey</h4>
            <div className="survey-data-wrapper survey-tab-main">
                <ul className="nav nav-tabs custom-tabs">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/barangay-survey/pending-survey">Pending for approval</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/barangay-survey/approving-survey">Ongoing Surveys</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/barangay-survey/completed-survey">Completed Surveys</NavLink>
                    </li>
                </ul>
                <div className="survey-data">
                    <Outlet></Outlet>
                </div>
            </div>
        </>
    );
}