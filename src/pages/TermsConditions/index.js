import React, { useState } from "react";
import TermsConditionEditor from "./TermsConditionEditor";
import TermsCondition from "./TermsCondition";
import "./style.scss";
import { userRole } from '../../api';

const TermsConditions = () => {
  const [whichPrivacy, setWhichPrivacy] = useState("terms");

  const changePrivacy = (url) => {
    setWhichPrivacy(url);
  };

  return (
    <div>
      {
        userRole()?.role == 'superadmin' ?
          <>
            <h4 className="page-title">Legal & Documentation</h4>
            <div className="content-wrapper mt-3">
              <div className="privacy-policy-main ">
                <ul className="nav nav-tabs custom-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${whichPrivacy === "terms" ? "active" : null
                        }`}
                      onClick={() => changePrivacy("terms")}
                    >
                      Terms & Conditions
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${whichPrivacy === "privacy" ? "active" : null
                        }`}
                      onClick={() => changePrivacy("privacy")}
                    >
                      Privacy Policy
                    </button>
                  </li>
                </ul>
                <div className="tab-content bg-white mt-3">
                  <div className="tab-pane active p-3">
                    {whichPrivacy === "terms" && (
                      <TermsConditionEditor
                        whichPrivacy="terms"
                      />
                    )}
                    {whichPrivacy === "privacy" && (
                      <TermsConditionEditor
                        whichPrivacy="privacy"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
          :
          <div className="privacy-policy-main ">
            <TermsCondition />
          </div>

      }
    </div>
  );
};
export default TermsConditions;
