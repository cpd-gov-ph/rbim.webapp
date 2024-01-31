import React, { useState, useEffect } from "react";
import { getData, postData } from "../../api";
import { Form, Row, Col } from "react-bootstrap";
import Button from "../../components/Form/Button";
import Badge from "react-bootstrap/Badge";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";
import RejectallModal from "./RejectallModal";
import ViewNotesModal from "./ViewNotesModal";

const HouseHoldQuestions = ({ nextStep }) => {
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [houseOldData, setHouseOldData] = useState([]);
  const [surveyData, setSurveyData] = useState({});
  const [rejectallShowModal, setRejectallShowModal] = useState(false);
  const [viewNotesShowModal, setViewNotesShowModal] = useState(false);



  const formattedData = (house_old_data) => {
    let dataCopy = [...house_old_data];
    dataCopy.forEach((category) => {
      category.section.forEach((section) => {
        section.questions.forEach((question) => {
          question.is_checked = question.is_approved
            ? "approved"
            : question.is_rejected
              ? "rejected"
              : null;
        });
      });
    });
    setHouseOldData(dataCopy);
  };

  useEffect(() => {
    getSurveyData();
  }, []);

  // get form data
  const getSurveyData = async () => {
    setLoading(true);
    const res = await getData("view-suvery-entry-question/" + id + "/", {});
    if (res.status === 1) {
      setSurveyData(res.data);
      formattedData(res.data.final_section)
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (form.checkValidity() === true) {
      gotoNext();
    }
  };

  const gotoNext = () => {

    let copyInterviewData = [...houseOldData];
    let apiData = [];
    copyInterviewData.forEach((category) => {
      category.section.forEach((section) => {
        section.questions.forEach((question) => {
          apiData.push(question);
        });
      });
    });
    const finalFilterdData = apiData.map((data) => ({
      section_id: data.section_id,
      question_id: data.question_id,
      part: data.part,
      is_approved: data.is_checked == "approved" ? true : false,
      is_rejected: data.is_checked == "rejected" ? true : false,
      reject_reason: data.reject_reason,
      rejected_date: new Date(),
      approved_date: new Date(),
    }));
    finalFilterdData.forEach((data) => {
      if (data.is_approved) {
        delete data.reject_reason;
        delete data.rejected_date;
        delete data.is_rejected;
      }
      if (data.is_rejected) {
        delete data.is_approved;
        delete data.approved_date;
      }
    });
    surveySubmit(finalFilterdData)

  };

  const surveySubmit = async (finalFilterdData) => {
    setLoading(true);
    let obj = {
      next_section: 5,
      reviews: finalFilterdData
    }
    const res = await postData("survey-question-verification/", {}, obj);
    if (res.status === 1) {
      toast.success(res.message, { theme: "colored" });
      nextStep(6)
      setLoading(false);
    } else if (res.status === 422) {
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(res.message, { theme: "colored" });
    }
  }


  const handleChange = (category_index, section_index, index, whichStatus) => {
    let copyInterviewData = [...houseOldData];
    copyInterviewData[category_index].section[section_index].questions[
      index
    ].is_checked = whichStatus;
    setHouseOldData(copyInterviewData);
  };

  const reasonHandleChange = (e, category_index, section_index, index) => {
    const value = e.target.value;
    let copyInterviewData = [...houseOldData];
    copyInterviewData[category_index].section[section_index].questions[
      index
    ].reject_reason = value;
    setHouseOldData(copyInterviewData);
  };

  const handleAllChange = (e) => {
    let value = e.target.value
    if (value == 'allrejected') {
      setRejectallShowModal(true)
    }
    if (value === 'allapproved') {
      approveAll();
    }
  }

  const rejectAllReasons = (reason) => {
    let copyInterviewData = [...houseOldData];
    let apiData = [];
    copyInterviewData.forEach((category) => {
      category.section.forEach((section) => {
        section.questions.forEach((question) => {
          apiData.push(question);
        });
      });
    });
    const finalFilterdData = apiData.map((data) => ({
      section_id: data.section_id,
      question_id: data.question_id,
      part: data.part,
      is_approved: false,
      is_rejected: true,
      reject_reason: reason,
      rejected_date: new Date(),
      approved_date: new Date(),
    }));

    surveySubmit(finalFilterdData)

  }

  const approveAll = () => {
    let copyInterviewData = [...houseOldData];
    let apiData = [];
    copyInterviewData.forEach((category) => {
      category.section.forEach((section) => {
        section.questions.forEach((question) => {
          apiData.push(question);
        });
      });
    });
    const finalFilterdData = apiData.map((data) => ({
      section_id: data.section_id,
      question_id: data.question_id,
      part: data.part,
      is_approved: true,
      approved_date: new Date(),
    }));

    surveySubmit(finalFilterdData)
  }


  return (
    <>
      {!loading && (
        <div>
          <Row className="view-survey">
            <Col md={6}>
              <div className="d-flex">
                <h4 className="survey_title me-3 mb-0">
                  Survey - {surveyData.survey_number}
                </h4>
                <Badge pill bg="secondary" className="survey-status">
                  {" "}
                  {surveyData.survey_type}{" "}
                </Badge>
              </div>
            </Col>
            <Col md={6}>
              <div className="validate-all-section d-flex justify-content-end">
                <Form.Check
                  inline
                  label="Reject all"
                  name="validate-all"
                  id="rejected"
                  value="allrejected"
                  type="radio"
                  onChange={(e) => handleAllChange(e)}
                  required
                />
                <Form.Check
                  inline
                  label="Approve all"
                  name="validate-all"
                  id="approved"
                  value="allapproved"
                  type="radio"
                  onChange={(e) => handleAllChange(e)}
                  required
                />
                <div className="view-notes-btn">
                  <Button className="btn-primary button-width" onClick={() => setViewNotesShowModal(true)}>View notes</Button>
                </div>
              </div>
            </Col>
          </Row>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="category_section boxshadow mt-3  p-3">
              {houseOldData?.map((category, category_index) => (
                <>
                  {category?.section.map((category_section, section_index) => (
                    <>
                      <div className="view-heading mb-3">
                        <h3>
                          {category_section.section_name
                            ? category_section.section_name
                            : category.category_name}
                        </h3>
                      </div>
                      <div className="row">
                        {category_section.questions.map((questions, index) => (
                          <>
                            <div className="col-md-6" key={index}>
                              <Form.Group
                                className={`mb-3 ${category_section.is_recorrection && questions.is_rejected ? "recorection" : null}`}
                              >
                                <Form.Label>{questions.title}</Form.Label>
                                {questions?.answers?.map((inputField, index) => (
                                  <>
                                    <Form.Control
                                      value={inputField.answer_value}
                                      disabled
                                      className="mb-3 main-form-input"
                                    />
                                  </>
                                ))}
                                <Form.Check
                                  inline
                                  label="Reject"
                                  name={"answerQuestion" + questions.question_id}
                                  id={"id" + questions.question_id}
                                  value="rejected"
                                  type="radio"
                                  checked={questions.is_checked == "rejected"}
                                  onChange={() =>
                                    handleChange(
                                      category_index,
                                      section_index,
                                      index,
                                      "rejected"
                                    )
                                  }
                                  required
                                />
                                <Form.Check
                                  inline
                                  label="Approve"
                                  name={"answerQuestion" + questions.question_id}
                                  id={"id" + questions.question_id + 1}
                                  value="approved"
                                  type="radio"
                                  checked={questions.is_checked == "approved"}
                                  onChange={() =>
                                    handleChange(
                                      category_index,
                                      section_index,
                                      index,
                                      "approved"
                                    )
                                  }
                                  required
                                />
                                {questions.is_checked == "rejected" ? (
                                  <Form.Control
                                    value={questions.reject_reason}
                                    placeholder="Notes for review"
                                    name="reason"
                                    className="mt-2"
                                    required
                                    onChange={(e) =>
                                      reasonHandleChange(
                                        e,
                                        category_index,
                                        section_index,
                                        index
                                      )
                                    }
                                  />
                                ) : null}

                                <Form.Control.Feedback type="invalid">
                                  This field is required
                                </Form.Control.Feedback>
                              </Form.Group>
                            </div>
                          </>
                        ))}
                      </div>
                    </>
                  ))}
                </>
              ))}
              <div className="row">
                <div className="col-md-12 text-end">
                  <Button
                    className="btn-secondary button-width me-2"
                    onClick={() => nextStep(4)}
                    type="button"
                  >
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    className="btn-primary button-width text-white"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </Form>
          {rejectallShowModal && (<RejectallModal show={rejectallShowModal} rejectAllReasons={rejectAllReasons} onClose={() => setRejectallShowModal(false)} />)}

          {viewNotesShowModal && (<ViewNotesModal show={viewNotesShowModal} notes={surveyData?.notes} onClose={() => setViewNotesShowModal(false)} />)}

        </div>
      )}
      {loading && <Loader />}
    </>
  );
};

export default HouseHoldQuestions;
