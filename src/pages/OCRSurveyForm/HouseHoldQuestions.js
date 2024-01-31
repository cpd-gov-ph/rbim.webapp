import React, { useState, useEffect } from "react";
import { getData, postData, userRole } from "../../api";
import { Form, Row, Col } from "react-bootstrap";
import Button from "../../components/Form/Button";
import Badge from "react-bootstrap/Badge";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";
import ViewNotesModal from "./ViewNotesModal";

const HouseHoldQuestions = ({ nextStep }) => {
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [houseOldData, setHouseOldData] = useState([]);
  const [surveyData, setSurveyData] = useState({});
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

    let copyHouseOldData = [...houseOldData];
    let apiData = [];
    copyHouseOldData.forEach((category) => {
      category.section.forEach((section) => {
        section.questions.forEach((question) => {
          question.answers.forEach((answer) => {
            answer.ranking = null;
          })
          apiData.push(question);
        });
      });
    });
    const finalFilterdData = apiData.map((data) => ({
      section_id: data.section_id,
      question_id: data.question_id,
      part: data.part,
      answers: data.answers,
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
    const res = await postData("ocr-question-verification/", {}, obj);
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

  const handleChange = (index, category_section_index, question_section_index, whichStatus) => {
    let copyHouseOldData = [...houseOldData];
    copyHouseOldData[index].section[category_section_index].questions[question_section_index].is_checked =
      whichStatus;
    setHouseOldData(copyHouseOldData);
  };

  const reasonHandleChange = (e, index, category_section_index, question_section_index) => {
    const value = e.target.value;
    let copyHouseOldData = [...houseOldData];
    copyHouseOldData[index].section[category_section_index].questions[question_section_index].reject_reason =
      value;
    setHouseOldData(copyHouseOldData);
  }

  // textbox handle change
  const textBoxHandleChange = (e, index, category_section_index, question_section_index, answer_section_index, type) => {
    console.log(type);
    let value = e.target.value;

    let copyHouseOldData = [...houseOldData];
    copyHouseOldData[index].section[category_section_index].questions[question_section_index].answers[answer_section_index].answer_value =
      value;
    setHouseOldData(copyHouseOldData);
  }

  //select handle change
  const selectBoxHandleChange = (e, index, category_section_index, question_section_index, answer_section_index) => {

    const value = e.target.value;
    let copyHouseOldData = [...houseOldData];
    copyHouseOldData[index].section[category_section_index].questions[question_section_index].answers[answer_section_index].answer_value =
      value;
    console.log(copyHouseOldData[index].section[category_section_index].questions[question_section_index])
    setHouseOldData(copyHouseOldData);
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
                  {surveyData.survey_type?.toUpperCase()}
                </Badge>
              </div>
            </Col>
            <Col md={6}>
              <div className="validate-all-section d-flex justify-content-end">
                {userRole()?.role == 'data_reviewer' ? (
                  <>
                    <div className="view-notes-btn">
                      <Button className="btn-primary button-width" onClick={() => setViewNotesShowModal(true)}>View Images</Button>
                    </div>
                  </>
                ) : null}
              </div>
            </Col>
          </Row>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="category_section boxshadow mt-3  p-3">
              {houseOldData?.map((category, index) => (
                <>
                  {category?.section.map((category_section, category_section_index) => (
                    <>
                      <div className="view-heading mb-3">
                        <h3>
                          {category_section.section_name
                            ? category_section.section_name
                            : category.category_name}
                        </h3>
                      </div>
                      <div className="row" key={category_section_index}>
                        {category_section.questions.map((questions, question_section_index) => (
                          <>
                            <div className="mb-3 col-md-6" key={question_section_index}>
                              <Form.Group
                                className={`mb-3 ${category_section.is_recorrection && questions.is_rejected ? "recorection" : null}`}
                                controlId={
                                  "answerQuestion" + questions.question_id
                                }
                              >
                                <>
                                  <Form.Label>{questions.title}</Form.Label>
                                  {questions?.answers?.map((answer_section, answer_section_index) => (
                                    <>
                                      {answer_section.dtype === 'textbox' ? (
                                        <Form.Control
                                          type={answer_section.keyboard_type === 'number' ? 'number' : 'text'}
                                          value={answer_section.answer_value}
                                          onChange={(e) =>
                                            textBoxHandleChange(
                                              e,
                                              index,
                                              category_section_index,
                                              question_section_index,
                                              answer_section_index,
                                              answer_section.keyboard_type
                                            )
                                          }
                                          required
                                          disabled={userRole()?.role == 'data_reviewer'?false:true}
                                          className="mb-3 main-form-input"
                                        />
                                      ) :
                                        answer_section.dtype === 'other_textbox' && (questions?.answers[0]?.answer_value === "Others" || questions?.answers[0]?.answer_value === "Yes") ? (
                                          <Form.Control
                                            type="text"
                                            value={answer_section.answer_value}
                                            placeholder={answer_section.placeholder}
                                            onChange={(e) =>
                                              textBoxHandleChange(
                                                e,
                                                index,
                                                category_section_index,
                                                question_section_index,
                                                answer_section_index,
                                                answer_section.keyboard_type
                                              )
                                            }
                                            disabled={userRole()?.role == 'data_reviewer'?false:true}
                                            required
                                            className="mb-3 main-form-input"
                                          />
                                        )

                                          : answer_section.dtype === 'selectbox' || (answer_section.dtype === "other_selectbox" && questions?.answers[0]?.answer_value === "Yes") ? (
                                            <Form.Select
                                              className="mb-3 main-form-input"
                                              aria-label="Default select example"
                                              value={answer_section.answer_value}
                                              onChange={(e) =>
                                                selectBoxHandleChange(
                                                  e,
                                                  index,
                                                  category_section_index,
                                                  question_section_index,
                                                  answer_section_index
                                                )
                                              }
                                              disabled={userRole()?.role == 'data_reviewer'?false:true}
                                              required
                                            >
                                              {answer_section.answer_value === null ? (
                                                <>
                                                  <option value=''>{answer_section.placeholder}</option>
                                                </>
                                              ) : null}
                                              {answer_section.options?.map((value) => (
                                                <>

                                                  <option value={value}>{value}</option>
                                                </>
                                              ))}

                                            </Form.Select>
                                          ) : null}

                                    </>
                                  ))}
                                </>

                                <Form.Check
                                  inline
                                  label="Incorrect"
                                  name={
                                    "answerQuestion" + questions.question_id
                                  }
                                  id={"id" + questions.question_id}
                                  value="rejected"
                                  type="radio"
                                  checked={questions.is_checked === "rejected"}
                                  onChange={() =>
                                    handleChange(
                                      index,
                                      category_section_index,
                                      question_section_index,
                                      "rejected"
                                    )
                                  }
                                  required
                                />
                                <Form.Check
                                  inline
                                  label="Correct"
                                  name={
                                    "answerQuestion" + questions.question_id
                                  }
                                  id={"id" + questions.question_id + 1}
                                  value="approved"
                                  type="radio"
                                  checked={questions.is_checked === "approved"}
                                  onChange={() =>
                                    handleChange(
                                      index,
                                      category_section_index,
                                      question_section_index,
                                      "approved"
                                    )
                                  }
                                  required
                                />
                                {
                                  questions.is_checked === 'rejected' ?
                                    <Form.Control
                                      value={questions.reject_reason}
                                      placeholder="Notes for review"
                                      name="reason"
                                      className="mt-2"
                                      required
                                      onChange={(e) =>
                                        reasonHandleChange(
                                          e,
                                          index,
                                          category_section_index,
                                          question_section_index
                                        )
                                      }
                                    /> : null
                                }

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

          {viewNotesShowModal && (<ViewNotesModal show={viewNotesShowModal} images={surveyData?.ocr_images} onClose={() => setViewNotesShowModal(false)} />)}

        </div>
      )}
      {loading && <Loader />}
    </>
  );
};

export default HouseHoldQuestions;
