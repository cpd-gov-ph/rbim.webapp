
import React, { useState, useEffect } from "react";
import { getData, postData,userRole } from "../../api";
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
            question.answers.forEach((answer)=>{
              if(answer.dtype==='radio'){
                question.showAction=true;
              }
            })
        });
      });
    });
    setBasicData(dataCopy);
  };

  const handleChange = (category_index, category_section_index, question_index, whichStatus) => {
    let copyBasicData = [...basicData];
    copyBasicData[category_index].section[category_section_index].questions[question_index].is_checked = whichStatus;
    setBasicData(copyBasicData);
  };

  const answerHandleChange = (category_index, category_section_index, question_index,field_index) => {
    let copyBasicData = [...basicData];
    copyBasicData[category_index].section[category_section_index].questions[question_index].answers.filter(value=>value.answer_value=false);
    copyBasicData[category_index].section[category_section_index].questions[question_index].answers[field_index].answer_value = true;
    setBasicData(copyBasicData);
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
      gotoNext();
    }
  };

  const gotoNext = () => {

    let copyBasicData = [...basicData];
    let apiData = [];
    copyBasicData.forEach((category) => {
      category.section.forEach((section) => {
        section.questions.forEach((question) => {
          question.answers.forEach((answer)=>{
            answer.ranking=null;
            if(answer.answer_value === true){
              answer.answer_value=answer.placeholder;
            }
          })
          apiData.push(question);
        });
      });
    });

    const finalFilterdData = apiData.map((data) => ({
      section_id: data.section_id,
      question_id: data.question_id,
      part: data.part,
      answers:data.answers,
      is_approved: data.is_checked === "approved" ? true : false,
      is_rejected: data.is_checked === "rejected" ? true : false,
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
    const res = await postData("ocr-question-verification/", {}, obj);
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
                {basicData?.map((category, category_index) => (
                  <>
                    {
                      category?.section.map((category_section, category_section_index) => (
                        <>
                          {category_section?.questions.map((questions, question_index) => (
                            <>
                              <div className="col-md-6" key={question_index}>
                                <Form.Group
                                  className={`mb-3 ${category_section.is_recorrection && questions.is_rejected ? "recorection" : null}`}
                                >
                                  <Form.Label className="title">{questions.title}</Form.Label>
                                  {questions?.answers?.map((inputField, field_index) => (
                                    <div key={field_index}>
                                      {inputField?.dtype === "box_number" ? (
                                        <div className="d-flex flex-row">
                                          {inputField.answer_value
                                            .split("")
                                            .map((value) => (
                                              <Form.Control
                                                className="m-2 form-control rounded text-center"
                                                value={value}
                                                required
                                                disabled={userRole()?.role == 'data_reviewer'?false:true }
                                              />
                                            ))}
                                        </div>
                                      ) : (
                                        <>
                                          {questions.title === 'Institutional' && inputField.dtype === 'radio' ?
                                            <>
                                              <Form.Check
                                                inline
                                                type="radio"
                                                name={
                                                  "answer-" + questions.question_id
                                                }
                                                id={"answer-" + inputField.id}
                                                label={inputField.placeholder}
                                                value={inputField.placeholder}
                                                checked={inputField.answer_value}
                                                onChange={() =>
                                                  answerHandleChange(
                                                    category_index,
                                                    category_section_index,
                                                    question_index,
                                                    field_index
                                                  )
                                                }
                                                className="mb-3 main-form-input"
                                                required
                                                disabled={userRole()?.role == 'data_reviewer'?false:true }
                                              />

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
                                  {questions.showAction ? (
                                    <>
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
                                        category_index,
                                        category_section_index,
                                        question_index,
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
                                        category_index,
                                        category_section_index,
                                        question_index,
                                        "approved"
                                      )
                                    }
                                    required
                                  />
                                  {
                                    questions.is_checked === "rejected" ?
                                      <Form.Group
                                        controlId={`reject-reason-${question_index}-${question_index}-01`}
                                        className="mb-0"
                                      >
                                        <Form.Control
                                          type="text"
                                          value={questions?.reject_reason}
                                          onChange={(e) =>
                                            handleRejectReason(e,
                                              category_index,
                                              category_section_index,
                                              question_index,
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
                                  ):""}
                                  
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
