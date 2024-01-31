
import React, { useState, useEffect } from "react";
import { getData, postData } from "../../api";
import { Form } from "react-bootstrap";
import Button from "../../components/Form/Button";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";
import './style.scss'
import { toast } from "react-toastify";

const BasicInfo = ({ nextStep }) => {
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [basicData, setBasicData] = useState([]);
  const [surveyData, setSurveyData] = useState({});

  useEffect(() => {
    getSurveyData();
  }, []);

  // get form data
  const getSurveyData = async () => {
    setLoading(true);
    const res = await getData("view-suvery-entry-question/" + id + "/", {});
    if (res.status === 1) {
      setSurveyData(res?.data);
      formattedData(res?.data?.initial_section);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const formattedData = (basic_data) => {
    let dataCopy = [basic_data];
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
    setBasicData(dataCopy);
  };

  const handleChange = (index, index1, index2, whichStatus) => {
    let copyBasicData = [...basicData];
    copyBasicData[index].section[index1].questions[index2].is_checked = whichStatus;
    setBasicData(copyBasicData);
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

    let copyBasicData = [...basicData];
    let apiData = [];
    copyBasicData.forEach((category) => {
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
      next_section: 1,
      reviews: [finalFilterdData[1]]
    }
    const res = await postData("survey-question-verification/", {}, obj);
    if (res.status === 1) {
      toast.success(res.message, { theme: "colored" });
      nextStep(2);
      setLoading(false);
    } else if (res.status === 422) {
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(res.message, { theme: "colored" });
    }
  }

  const handleRejectReason = (e, index, index1, index2,) => {
    let copyBasicData = [...basicData];
    copyBasicData[index].section[index1].questions[index2].reject_reason = e.target.value;
    setBasicData(copyBasicData);
  }

  return (
    <>
      {!loading && (
        <div>
          <div className="row">
            <div className="col-md-12">
              <h4 className="survey_title">Survey</h4>
            </div>
          </div>
          <div className="category_section boxshadow mt-3">
            <div className="view-heading">
              <h3>{surveyData?.initial_section?.category_name}</h3>
            </div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <div className="row p-3 survey-form-basic">
                {basicData?.map((category, index) => (
                  <>
                    {
                      category?.section.map((category_section, index1) => (
                        <>
                          {category_section?.questions.map((questions, index2) => (
                            <>
                              <div className="col-md-6" key={index2}>
                                <Form.Group
                                  className={`mb-3 ${category_section.is_recorrection && questions.is_rejected ? "recorection" : null}`}
                                >
                                  <Form.Label className="title">{questions.title}</Form.Label>
                                  {questions?.answers?.map((inputField, index3) => (
                                    <div key={index3}>
                                      {inputField?.dtype === "box_number" ? (
                                        <div className="d-flex flex-row">
                                          {inputField.answer_value
                                            .split("")
                                            .map((value) => (
                                              <Form.Control
                                                className="m-2 form-control rounded text-center"
                                                value={value}
                                                disabled
                                              />
                                            ))}
                                        </div>
                                      ) : (
                                        <>
                                          {questions.title === 'Institutional' && inputField.dtype === 'radio' && inputField.answer_value === true ?
                                            <>
                                              <Form.Control
                                                value={inputField.placeholder}
                                                disabled
                                                className="mb-3 main-form-input"
                                              />
                                              <Form.Check
                                                inline
                                                label="Reject"
                                                name={
                                                  "answerQuestion" + questions.question_id
                                                }
                                                id={"id" + questions.question_id}
                                                value="rejected"
                                                type="radio"
                                                checked={questions.is_checked == "rejected"}
                                                onChange={() =>
                                                  handleChange(
                                                    index,
                                                    index1,
                                                    index2,
                                                    "rejected"
                                                  )
                                                }
                                                required
                                              />
                                              <Form.Check
                                                inline
                                                label="Approve"
                                                name={
                                                  "answerQuestion" + questions.question_id
                                                }
                                                id={"id" + questions.question_id + 1}
                                                value="approved"
                                                type="radio"
                                                checked={questions.is_checked == "approved"}
                                                onChange={() =>
                                                  handleChange(
                                                    index,
                                                    index1,
                                                    index2,
                                                    "approved"
                                                  )
                                                }
                                                required
                                              />
                                              {
                                                questions.is_checked == "rejected" ?
                                                  <Form.Group
                                                    controlId={`reject-reason-${index3}-${index3}-01`}
                                                    className="mb-0"
                                                  >
                                                    <Form.Control
                                                      type="text"
                                                      value={questions?.reject_reason}
                                                      onChange={(e) =>
                                                        handleRejectReason(e,
                                                          index,
                                                          index1,
                                                          index2,
                                                        )
                                                      }
                                                      placeholder="Notes for review"
                                                      className="reject-reason"
                                                      required
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                      This field is required
                                                    </Form.Control.Feedback>
                                                  </Form.Group>
                                                  : ''
                                              }
                                              <Form.Control.Feedback type="invalid">
                                                This field is required
                                              </Form.Control.Feedback>
                                            </>
                                            :
                                            ''
                                          }
                                          {
                                            questions.title === 'Notes' &&
                                            <Form.Control
                                              as="textarea"
                                              value={inputField.options}
                                              rows="6"
                                              disabled
                                            />
                                          }
                                        </>
                                      )}
                                    </div>
                                  ))}
                                </Form.Group>
                              </div>
                            </>
                          ))}
                        </>
                      ))
                    }
                  </>
                ))}
                <div className="col-md-12 text-end">
                  <Button
                    type="submit"
                    className="btn-primary button-width text-white"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div >
      )}
      {loading && <Loader />}
    </>
  );
};

export default BasicInfo;
