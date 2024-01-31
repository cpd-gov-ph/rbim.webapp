import React, { useState, useEffect } from "react";
import './style.scss';
import { getData } from "../../api";
import Loader from "../../components/Loader";
import Card from 'react-bootstrap/Card';
import { Markup } from 'interweave';

const TermsConditionEditor = ({ whichPrivacy }) => {
  const [privacyContent, setPrivacyContent] = useState("");
  const [termsContent, setTermsContent] = useState("");
  const [initLoading, setInitLoading] = useState(false);

  useEffect(() => {
    getTermsSetting("terms");
    getTermsSetting("privacy");
  }, []);


  const getTermsSetting = async (url) => {
    let legalConditions = url === "terms" ? "term_and_conditions" : "privacy_and_policy"
    setInitLoading(true);
    const res = await getData(`view-options/${legalConditions}/`, {});
    if (res.status === 1) {
      if (url === "terms") {
        setTermsContent(res.data.meta_value);
      } else {
        setPrivacyContent(res.data.meta_value);
      }
      setInitLoading(false);
    } else if (res.status === 422) {
      setInitLoading(false);
    } else {
      setInitLoading(false);
    }
  };


  return (
    <React.Fragment>
      {!initLoading && (
        <React.Fragment>

          <div className="privacy">
            <h4 className="page-title mb-3"> Privacy Policy</h4>
            <Card>
              <Card.Body>
                <Card.Text>
                  <Markup content={privacyContent} />
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="terms">
            <h4 className="page-title mb-3"> Terms & Conditions</h4>
            <Card>
              <Card.Body>
                <Card.Text>
                  <Markup content={termsContent} />
                </Card.Text>
              </Card.Body>
            </Card>
          </div>

        </React.Fragment>
      )}
      {initLoading && <Loader />}
    </React.Fragment>
  );
};

export default TermsConditionEditor;
