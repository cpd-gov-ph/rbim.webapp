
import React, { useState, useEffect } from "react";
import { getData, postData, userRole } from "../../api";
import { Form, Row, Col } from "react-bootstrap";
import Button from "../../components/Form/Button";
import Loader from "../../components/Loader";
import { useParams, useNavigate } from "react-router-dom";
import './style.scss';
import ViewNotesModal from "./ViewNotesModal";
import Badge from 'react-bootstrap/Badge';

const SignatureSection = ({ nextStep }) => {
  let navigate = useNavigate();
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [surveyData, setSurveyData] = useState({});
  const [signatureData, setSignatureData] = useState({});
  const [viewNotesShowModal, setViewNotesShowModal] = useState(false);

  useEffect(() => {
    getSurveyData();
  }, []);

  // formatdata
  const signatureFormatData = (data) => {
    let dataCopy = { ...data };
    dataCopy.is_checked = dataCopy.is_approved
      ? "approved"
      : dataCopy.is_rejected
        ? "rejected"
        : null;
    setSignatureData(dataCopy)
  }
  // get form data
  const getSurveyData = async () => {
    setLoading(true);
    const res = await getData("view-suvery-entry-question/" + id + "/", {});
    if (res.status === 1) {
      setSurveyData(res?.data);
      setLoading(false);
      signatureFormatData(res.data.signature);
    } else {
      setLoading(false);
    }
  };

  const signatureSubmit = () => {
    const finalFilterdData = {
      is_approved: signatureData.is_checked == "approved" ? true : false,
      is_rejected: signatureData.is_checked == "rejected" ? true : false,
      reject_reason: signatureData.is_checked == "rejected" ? signatureData.reject_reason : null,
      rejected_date: signatureData.is_checked == "rejected" ? new Date() : null,
      approved_date: signatureData.is_checked == "approved" ? new Date() : null,
    };
    submitSurvey(finalFilterdData)
  }

  const submitSurvey = async (finalFilterdData) => {
    setLoading(true);
    const obj = {
      id: id,
      survey_status: 'review_completed',
      signature: finalFilterdData
    }
    const res = await postData("ocr-review-submit/", {}, obj);
    if (res.status === 1) {
      if (userRole()?.role == 'data_reviewer') {
        navigate("/data-reviewer-survey");
      }
      else {
        navigate("/barangay-survey/pending-survey");
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (form.checkValidity() === true) {
      signatureSubmit();
    }
  };
  const reasonHandleChange = (e) => {
    const value = e.target.value;
    let copyInterviewData = { ...signatureData };
    copyInterviewData.reject_reason = value;
    setSignatureData(copyInterviewData);
  };
  const handleChange = (whichStatus) => {
    let copyInterviewData = { ...signatureData };
    copyInterviewData.is_checked = whichStatus;
    setSignatureData(copyInterviewData);
  };
  return (
    <>
      {!loading && (
        <div>
          <Row className="view-survey">
            <Col md={6}>
              <div className="d-flex">
                <h4 className="survey_title me-3 mb-0">Survey - {surveyData.survey_number}</h4>
                <Badge pill bg="secondary" className="survey-status">  {surveyData.survey_type?.toUpperCase()} </Badge>
              </div>
            </Col>
            <Col md={6}>
              <div className="validate-all-section d-flex justify-content-end">
                {userRole()?.role == 'data_reviewer' ? (
                  <>
                    <div className="view-notes-btn">
                      <Button className="btn-primary button-width" onClick={() => setViewNotesShowModal(true)}>View Survey Image</Button>
                    </div>
                  </>
                ) : null}


              </div>
            </Col>
          </Row>
          <div className="sign_section mt-3">
            <div>
              <h3>PAHINTULOT</h3>
            </div>
            <div className="desc">
              Lubos kong naunawaan ang layunin ng pananaliksik at Census ng baranga. Nabasa ko at pinaliwanag sa akin
              ang nilalaman ng kasulatian at kusang loob akong sumasangayon na makibahagi sa proyektong ito. Naunawaan kong
              magiging kampidensiyal ang lahat ng aking kasagutan. Gayunpaman , pinahihntulutan
              ko ang paggamit ng aking impormasyon ng barangay kalakip ng paggalang sa aking “ data privacy rights “
            </div>
            <div>
              <Row className="my-4">
                <Col md={6} className="ms-auto">
                  <div className="sig-box mt-2"> <div><img src={surveyData?.data_collector_signature} alt="sign" /></div></div>
                  <div className="sign-name mt-3">Pangalan at logda ng Nakapanayam</div>
                </Col>
              </Row>
            </div>
            <Row className="my-3 justify-content-end">
              <Col md={6} className="text-start mt-3">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group
                    className={`mb-3 ${surveyData.signature_recorrection_flag && signatureData.is_rejected ? "final_recorrection" : null}`}
                  >
                    <Form.Check
                      inline
                      label="Incorrect"
                      name={"answerQuestion"}
                      id={"id"}
                      value="rejected"
                      type="radio"
                      checked={signatureData.is_checked === "rejected"}
                      onChange={() => handleChange("rejected")}
                      required
                    />
                    <Form.Check
                      inline
                      label="Correct"
                      name={"answerQuestion"}
                      id={"id" + 1}
                      value="approved"
                      type="radio"
                      checked={signatureData.is_checked === "approved"}
                      onChange={() => handleChange("approved")}
                      required
                    />
                    {signatureData.is_checked === "rejected" ? (
                      <Col md={12} className="sign-reject my-2">
                        <Form.Control
                          value={signatureData.reject_reason}
                          placeholder="Notes for review"
                          name="reason"
                          className="mt-2"
                          required
                          onChange={(e) =>
                            reasonHandleChange(e)
                          }
                        />
                      </Col>
                    ) : null}

                    <Form.Control.Feedback type="invalid">
                      This field is required
                    </Form.Control.Feedback>
                  </Form.Group>
                  <div className="text-end">
                    <Button
                      type="submit"
                      className="btn-primary button-width text-white"
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </div>
        </div>
      )}
      {viewNotesShowModal && (<ViewNotesModal show={viewNotesShowModal} images={surveyData?.ocr_images} onClose={() => setViewNotesShowModal(false)} />)}
      {loading && <Loader />}
    </>
  );
};

export default SignatureSection;
