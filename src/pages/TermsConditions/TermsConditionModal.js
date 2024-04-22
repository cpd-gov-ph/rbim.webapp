import React, { useState, useEffect } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";
import { Markup } from 'interweave';
import './style.scss';
import { postData, getData } from "../../api";
import Loader from "../../components/Loader";
import FormModal from "../../components/FormModal";
import Button from "../../components/Form/Button";

const TermsConditionModal = ({ show, onClose, onLogout }) => {

  const [initLoading, setInitLoading] = useState(false);
  const [privacyContent, setPrivacyContent] = useState("");
  const [termsContent, setTermsContent] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [termsUpdatedDate, setTermsUpdatedDate] = useState("");
  const [privacyUpdatedDate, setPrivacyUpdatedDate] = useState("");

  const [formInputs, setFormInputs] = useState({
    agreeTermsPrivacy: []
  });
  const [validated, setValidated] = useState(false);
  

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
        setTermsUpdatedDate(res.data.updated_at)
        setLastUpdated(moment(res.data.updated_at).format("DD/MM/YYYY"))
      } else {
        setPrivacyContent(res.data.meta_value);
        setPrivacyUpdatedDate(res.data.updated_at)
      }
      // compareDate()
      setInitLoading(false);
    } else if (res.status === 422) {
      setInitLoading(false);
    } else {
      setInitLoading(false);
    }
  };


  const handleAgreeTermsChange = (e) => {
    let val = parseFloat(e.target.value);
    if (e.target.checked === true) {
      setFormInputs((prev) => ({
        ...prev,
        agreeTermsPrivacy: [...prev.agreeTermsPrivacy, val],
      }));
    } else {
      const dupArr = [...formInputs.agreeTermsPrivacy];
      let index = dupArr.indexOf(val);
      if (index !== -1) {
        dupArr.splice(index, 1);
        setFormInputs((prev) => ({
          ...prev,
          agreeTermsPrivacy: dupArr,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);
    if (formInputs.agreeTermsPrivacy.length === 2) {
      let data = {
        is_agree: 1
      }
      setInitLoading(true);
      const res = await postData("legal-document-agree/", {}, data);
      if (res.status === 1) {
        toast.success(res.message, { theme: "colored" });
        setInitLoading(false);
        localStorage.setItem("term_privacy_status", 1);
        onClose();
      } else if (res.status === 422) {
        setInitLoading(false);
      } else {
        setInitLoading(false);
        toast.error(res.message, { theme: "colored" });
      }
    }
  };

  return (
    <React.Fragment>
      {!initLoading && (
        <FormModal show={show} size="xl" modalClassName="legal-modal" heading="Legal & Documentation" subHeading={`Last updated on ${lastUpdated}`}>
          <div className="termModal">
            <div>
              <div className="term-title"> 1. Terms & Conditions</div>
              <div className="py-3"> <Markup content={termsContent} /></div>
            </div>
            <div>
              <div className="term-title"> 2. Privacy Policy </div>
              <div className="py-3"> <Markup content={privacyContent} /></div>
            </div>
            <div>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group controlId="01" className="mb-3">
                  <Form.Check
                    inline
                    type="checkbox"
                    name="agreeTerms"
                    className="agreeTerms"
                    label="I agree with Terms & conditions"
                    checked={formInputs.agreeTermsPrivacy.includes(1) ? true : false}
                    value="1"
                    onChange={(e) => handleAgreeTermsChange(e)}
                  />
                </Form.Group>
                <Form.Group controlId="02" className="mb-3">
                  <Form.Check
                    inline
                    type="checkbox"
                    name="agreePrivacy"
                    className="agreeTerms"
                    label="I agree with Privacy Policy"
                    checked={formInputs.agreeTermsPrivacy.includes(2) ? true : false}
                    value="2"
                    onChange={(e) => handleAgreeTermsChange(e)}
                  />
                </Form.Group>
                {validated === true && formInputs.agreeTermsPrivacy.length < 2 && (
                  <div className="err-feedback mt-2">
                    Please accept the above points.
                  </div>
                )}
              </Form>
            </div>
          </div>
          <div className="text-end">
            <Button
              type="button"
              className="btn-default text-blacksix me-3 cancel-btn"
              onClick={onLogout}
            >
              Decline
            </Button>
            <Button
              type="button"
              className={`text-white  ${formInputs.agreeTermsPrivacy.length < 2 ? "btn-default agree-btn " : 'btn-primary'}`}
              onClick={handleSubmit}
              disabled={formInputs.agreeTermsPrivacy.length < 2}
            >
              I Agree
            </Button>
          </div>
        </FormModal>
      )}
      {initLoading && <Loader />}
    </React.Fragment>
  );
};

export default TermsConditionModal;
