import { BrowserRouter, Routes, Route } from "react-router-dom";
//pages
import Login from "./pages/Login";
import LoginSelection from "./pages/LoginSelection";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DashBoard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import SurveyQuestion from "./pages/SurveyQuestions";
import ViewSurveyQuestion from "./pages/SurveyQuestions/viewSurveyQuestions";
import HelpAndSupport from "./pages/HelpAndSupport";
import Layout from "./layout";
import "./App.scss";
import Barangay from "./pages/Barangay";
import BarangaySurvey from "./pages/BarangaySurvey";
import PendingSurvey from "./pages/BarangaySurvey/PendingSurvey";
import ApprovingSurvey from "./pages/BarangaySurvey/ApprovingSurvey";
import CompletedSurvey from "./pages/BarangaySurvey/CompletedSurvey";
import DataCollector from "./pages/DataCollector";
import TermsCondition from "./pages/TermsConditions";
import DataReviewer from "./pages/DataReviewer";
import CodeVerification from "./pages/CodeVerification";
import ViewDataCollector from "./pages/DataCollector/viewDataCollector";
import ViewAssignedTask from "./pages/DataCollector/assignTask";
import DataReviewerSurvey from "./pages/DataReviewerSurvey";
import ViewBarangay from "./pages/Barangay/viewBarangay";
import UserProfile from "./pages/Profile";
import ViewReviewer from "./pages/DataReviewer/ViewDataReviewer";
import SurveyForm from "./pages/SurveyForm";
import OcrSurveyForm from "./pages/OCRSurveyForm";
import Notifications from './pages/Notifications';
import PrivateRoute from "./privateRoute";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/login-selection"
            exact={true}
            element={<LoginSelection />}
          />
          <Route path="/login" exact={true} element={<Login />} />
          <Route
            path="/forgot-password"
            exact={true}
            element={<ForgotPassword />}
          ></Route>
          <Route
            path="/code-verification"
            exact={true}
            element={<CodeVerification />}
          ></Route>
          <Route
            path="/reset-password"
            exact={true}
            element={<ResetPassword />}
          ></Route>
          <Route path="/" element={<Layout />}>
            <Route path="/" exact={true} element={
              <PrivateRoute roles={["superadmin"]}>
              <DashBoard />
            </PrivateRoute>
            } 
            />
            <Route path="/dashboard" exact={true} 
            element={<DashBoard />} 
            />
            <Route
              path="/reports"
              exact={true}
              element={
                  <Reports />
                
              }
            />
            <Route
              path="/barangay"
              exact={true}
              element={<Barangay />}
            />
            <Route
              path="/barangay/view/:id"
              exact={true}
              element={<ViewBarangay />}
            />
           
            <Route
              path="/termsConditions"
              exact={true}
              element={<TermsCondition />}
            />

            <Route
              path="/help-support"
              exact={true}
              element={<HelpAndSupport />}
            />
            <Route path="/barangay-survey" element={<BarangaySurvey />}>
              <Route
                path="/barangay-survey"
                exact={true}
                element={<PendingSurvey />}
              />
              <Route
                path="/barangay-survey/pending-survey"
                exact={true}
                element={<PendingSurvey />}
              />
              <Route
                path="/barangay-survey/approving-survey"
                exact={true}
                element={<ApprovingSurvey />}
              />
              <Route
                path="/barangay-survey/completed-survey"
                exact={true}
                element={<CompletedSurvey />}
              />
            </Route>
            <Route path="/survey-question" exact={true} element={<SurveyQuestion />}/>
            <Route path="/survey-question/view/:id" exact={true} element={<ViewSurveyQuestion />}/>
            <Route path="data-collector" element={<DataCollector />} />
            <Route
              path="/data-collector/view/:id"
              element={<ViewDataCollector />}
            />
            <Route
              path="/data-collector/viewtask/:id"
              element={<ViewAssignedTask />}
            />
            <Route
              path="/data-reviewer"
              exact={true}
              element={<DataReviewer />}
            />
            <Route
              path="/data-reviewer/view/:id"
              exact={true}
              element={<ViewReviewer />}
            />
            <Route
              path="/data-reviewer-survey"
              exact={true}
              element={<DataReviewerSurvey />}
            />
            <Route
              path="/survey/:id"
              exact={true}
              element={<SurveyForm />}
            />
            <Route
              path="/ocrsurvey/:id"
              exact={true}
              element={<OcrSurveyForm />}
            />
            <Route path="/profile" exact={true} element={<UserProfile />} />
            <Route path="/notification" exact={true} element={<Notifications/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
