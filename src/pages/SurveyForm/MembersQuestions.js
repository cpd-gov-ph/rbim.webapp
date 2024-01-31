import React, { useState, useEffect } from "react";
import { getData, postData,userRole } from "../../api";
import { Form, Row, Col, Card } from "react-bootstrap";
import Button from "../../components/Form/Button";
import Badge from 'react-bootstrap/Badge';
import switchPerson from '../../assets/images/switch_person.png'
import FormModal from "../../components/FormModal";
import { FaAngleRight } from 'react-icons/fa';
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";
import RejectallModal from "./RejectallModal";
import ViewNotesModal from "./ViewNotesModal";

const MemberQuestions = ({ nextStep }) => {
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formatedData, setFormatedData] = useState([]);
  const [innerStep, setInnerStep] = useState(null);
  const [switchPersonId, setSwitchPersonId] = useState(null);
  const [switchPersonShowModal, setSwitchPersonShowModal] = useState(false);
  const [surveyData, setSurveyData] = useState({});
  const [rejectallShowModal, setRejectallShowModal] = useState(false);
  const [viewNotesShowModal, setViewNotesShowModal] = useState(false);
  const [checkAll, setCheckAll] = useState('');

  const changeDataFormat = (member_data) => {
    let formatedData = [];
    member_data.forEach((data) => {
      data.category.forEach((cate) => {
        cate.data_id = data.id;
        cate.member_id = data.member_id;
        cate.member_name = data.member_name;
        formatedData.push(cate);
      });
    });
    formatedData.forEach((element, index) => {
      element.step = index + 1;
      element.page.forEach((page_section) => {
        page_section.section.forEach((section) => {
          section.questions.forEach((question_section) => {
            question_section.is_checked = question_section.is_approved
              ? "approved"
              : question_section.is_rejected
                ? "rejected"
                : null;
          });
        });
      });
    });
    setFormatedData(formatedData);
    return formatedData;
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
      changeDataFormat(res.data.house_hold_member_section);
      const inner_step = res.data.inner_next_section === null ? 1 : +res.data.inner_next_section;
      setInnerStep(inner_step);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const switchMember = (id) => {
    formatedData.every((element) => {
      if (element.member_id === id) {
        setInnerStep(element.step)
        return false;
      }
      else {
        return true
      }
    })
  }

  const handleChange = (
    category_index,
    main_index,
    section_index,
    index,
    whichStatus
  ) => {
    let copyInterviewData = [...formatedData];
    copyInterviewData[category_index].page[main_index].section[
      section_index
    ].questions[index].is_checked = whichStatus;
    setFormatedData(copyInterviewData);
  };

  const reasonHandleChange = (
    e,
    category_index,
    main_index,
    section_index,
    index
  ) => {
    const value = e.target.value;
    let copyInterviewData = [...formatedData];
    copyInterviewData[category_index].page[main_index].section[
      section_index
    ].questions[index].reject_reason = value;
    setFormatedData(copyInterviewData);
  };

  const gotoNextInnerStep = (step) => {
    let copyInterviewData = [...formatedData];
    let apiData = [];
    copyInterviewData.forEach((category) => {
      if (category.step === innerStep) {
        category.page.forEach((page_section) => {
          page_section.section.forEach((inner_section) => {
            if (inner_section.is_enable) {
              inner_section.questions.forEach((question_section) => {
                question_section.is_reviewed_by_barangay=true;
                apiData.push(question_section);
              });
            }
          });
        });
      }
    });
    setFormatedData(copyInterviewData);
    const finalFilterdData = apiData.map((data) => ({
      section_id: data.section_id,
      question_id: data.question_id,
      part: data.part,
      is_approved: data.is_checked === "approved" ? true : false,
      is_rejected: data.is_checked === "rejected" ? true : false,
      reject_reason: data.reject_reason,
      rejected_date: new Date(),
      approved_date: new Date(),
    }));
    finalFilterdData.forEach((data) => {
      delete data.is_reviewed_by_barangay;
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
    if (step === formatedData.length) {
      if (allQuestionsStatus() === true) {
        if (finalFilterdData.length > 0) {

         surveySubmit(finalFilterdData);
        }
        else {
          nextStep(5);
        }
      }
      else {
        setValidated(true);
      }
    } else {
      if (finalFilterdData.length > 0) {
        eachSurveySubmit(finalFilterdData, step)
      }
      else {
        setInnerStep(step + 1);
      }
      setValidated(false);
    }
  };
  // check all qiestions status
  const allQuestionsStatus = () => {
    let status = false;
    let copyFormateData = [...formatedData];
    let copyCheckAllQuestion = [];
    copyFormateData.forEach((category_section) => {
      category_section.page.forEach((page_section) => {
        page_section.section.forEach((section) => {
          if (section.is_enable) {
            section.questions.forEach((question) => {
              let filter_obj = {
                is_enable: section.is_enable,
                is_approved: question.is_approved === true ? true: question.is_checked === "approved" ? true:false,
                is_rejected: question.is_rejected === true? true : question.is_checked === "rejected" ? true:false,
                is_reviewed_by_barangay:question.is_reviewed_by_barangay,
                step: category_section.step
              }
              copyCheckAllQuestion.push(filter_obj);
            })
          }
        })
      })
    });
    copyCheckAllQuestion.every((question) => {
      if(userRole()?.role == 'data_reviewer'){
        if (question.is_approved || question.is_rejected) {
          status = true;
          return status;
        }
        else {
          status = false;
          setInnerStep(question.step);
          toast.error(' You have not reviewed the full survey', { theme: "colored" });
          return status;
        }
      }
      else{
        if ((question.is_approved || question.is_rejected) && question.is_reviewed_by_barangay) {
          status = true;
          return status;
        }
        else {
          status = false;
          setInnerStep(question.step);
          toast.error(' You have not reviewed the full survey', { theme: "colored" });
          return status;
        }
      }
    });
    return status;
  }
  const surveySubmit = async (finalFilterdData) => {
    setLoading(true);
    setCheckAll('');
    let obj = {
      inner_next_section: innerStep,
      next_section: 4,
      reviews: finalFilterdData
    }
    const res = await postData("survey-question-verification/", {}, obj);
    if (res.status === 1) {
      toast.success(res.message, { theme: "colored" });
      nextStep(5);
      setLoading(false);
    } else if (res.status === 422) {
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(res.message, { theme: "colored" });
    }
  }

  const eachSurveySubmit = async (finalFilterdData, step) => {
    setLoading(true);
    setCheckAll('');
    let obj = {
      inner_next_section: innerStep + 1,
      next_section: 3,
      reviews: finalFilterdData
    }
    const res = await postData("survey-question-verification/", {}, obj);
    if (res.status === 1) {
      toast.success(res.message, { theme: "colored" });
      setInnerStep(step + 1);
      setLoading(false);
      window.scrollTo(0, 0);
    } else if (res.status === 422) {
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(res.message, { theme: "colored" });
    }
  }

  const gotoPreviousInnerStep = (step) => {
    if (step === 1) {
      nextStep(3);
    } else {
      setInnerStep(step - 1);
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
      gotoNextInnerStep(innerStep);
    }
  };


  const getSwitchMemberId = (id) => {
    setSwitchPersonId(id);
    setValidated(false);
    switchMember(id);
    setSwitchPersonShowModal(false);
  }

  const handleAllChange = (e) => {
    let value = e.target.value
    setCheckAll(value)
    
    if (value === 'allrejected') {
      setRejectallShowModal(true);
    }
    if (value === 'allapproved') {
      approveAll();
    }
  }
  const rejectAllReasons = (reason) => {
    let copyInterviewData = [...formatedData];
    let apiData = [];
    copyInterviewData.forEach((category) => {
      if (category.step === innerStep) {
        category.page.forEach((page_section) => {
          page_section.section.forEach((inner_section) => {
            if (inner_section.is_enable) {
              inner_section.questions.forEach((question_section) => {
                question_section.is_checked = 'rejected';
                question_section.is_approved = false;
                question_section.is_rejected = true;
                question_section.reject_reason = reason;
                question_section.is_reviewed_by_barangay=true;
                apiData.push(question_section);
              });
            }
          });
        });
      }
    });
    setFormatedData(copyInterviewData);
    console.log(apiData)
    const finalFilterdData = apiData.map((data) => (
      {
      section_id: data.section_id,
      question_id: data.question_id,
      part: data.part,
      is_rejected: true,
      reject_reason: reason,
      rejected_date: new Date()
    }));
    finalFilterdData.forEach((data) => {
      delete data.is_reviewed_by_barangay;
    });
    if (innerStep === formatedData.length) {
      if (allQuestionsStatus() === true) {
        if (finalFilterdData.length > 0) {
          surveySubmit(finalFilterdData);
        }
        else {
         nextStep(5);
        }
      }
      else {
        setCheckAll('')
        setValidated(true);
      }
    } else {
      if (finalFilterdData.length > 0) {
        eachSurveySubmit(finalFilterdData, innerStep)
      }
      else {
        setInnerStep(innerStep + 1);
      }
      setValidated(false);
    }
  }

  const approveAll = () => {
    let copyInterviewData = [...formatedData];
    let apiData = [];
    copyInterviewData.forEach((category) => {
      if (category.step === innerStep) {
        category.page.forEach((page_section) => {
          page_section.section.forEach((inner_section) => {
            inner_section.questions.forEach((question_section) => {
              question_section.is_approved = true;
              question_section.is_checked = 'approved';
              question_section.is_reviewed_by_barangay=true;
              apiData.push(question_section);
            });
          });
        });
      }
    });
    setFormatedData(copyInterviewData);
    const finalFilterdData = apiData.map((data) => (
      {
      section_id: data.section_id,
      question_id: data.question_id,
      part: data.part,
      is_approved: true,
      approved_date: new Date(),
    }));
    finalFilterdData.forEach((data) => {
      delete data.is_reviewed_by_barangay;
    });
    if (innerStep === formatedData.length) {
      if (allQuestionsStatus() === true) {
        if (finalFilterdData.length > 0) {
          surveySubmit(finalFilterdData);
        }
        else {
          nextStep(5);
        }
      }
      else {
        setCheckAll('')
        setValidated(true);
       
      }

    } else {
      if (finalFilterdData.length > 0) {
        eachSurveySubmit(finalFilterdData, innerStep)
      }
      else {
        setInnerStep(innerStep + 1);
      }
      setValidated(false);
    }
  }

  return (
    <>
      {!loading && (
        <div>
          <Row className="view-survey">
            <Col md={6}>
              <div className="d-flex">
                <h4 className="survey_title me-3 mb-0">Survey - {surveyData.survey_number}</h4>
                <Badge pill bg="secondary" className="survey-status">  {surveyData.survey_type} </Badge>
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
                  checked={checkAll === "allrejected" ? true :false}
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
                  checked={checkAll === "allapproved" ? true :false}
                  onChange={(e) => handleAllChange(e)}
                  required
                />
                <div className="view-notes-btn">
                  <Button className="btn-primary button-width" onClick={() => setViewNotesShowModal(true)}>View notes</Button>
                </div>
              </div>
            </Col>
          </Row>

          <div className="category_section boxshadow mt-3 p-3">

            {formatedData.map((category, category_index) => (
              <>

                {category.step === innerStep ? (
                  <>
                    <div className="mb-3 d-flex">
                      <div className="switch-member-name me-3">{category.member_name}’s questions : </div>
                      {surveyData.household_member_count > 1 ? (
                        <div className="switch-person-btn">
                         <Button className="btn-secondary  button-width" onClick={() => setSwitchPersonShowModal(true)}>
                           <img src={switchPerson} alt="person" className="switch-icon me-2" />
                           Switch Person
                         </Button>
                       </div>
                      ):null}
                    </div>

                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                      {category.page.map((main_section, main_index) => {
                        return (
                          <>
                            {main_section.section.map(
                              (inner_section, section_index) => {
                                return (
                                  <>
                                    <div className="view-heading mb-3">
                                      <h3>
                                        {main_section.category_name
                                          ? main_section.category_name
                                          : ""}
                                      </h3>
                                      <p className="mb-0">
                                        {inner_section.section_name
                                          ? inner_section.section_name
                                          : ""}
                                      </p>
                                    </div>
                                    <div className="row">
                                      {inner_section.questions.map(
                                        (questions, index) => {
                                          return (
                                            <>
                                              <div
                                                className="col-md-6"
                                                key={index}
                                              >
                                                <Form.Group
                                                  className={`mb-3 ${inner_section.is_recorrection && questions.is_rejected ? "recorection" : null}`}
                                                >
                                                  <Form.Label>
                                                    {questions.title}
                                                  </Form.Label>
                                                  {questions?.answers?.map(
                                                    (inputField) => {
                                                      return (
                                                        <>
                                                          <Form.Control
                                                            value={
                                                              inner_section.is_enable ? inputField.answer_value : inputField.placeholder
                                                            }
                                                            disabled
                                                            className="mb-3 main-form-input"
                                                          />
                                                        </>
                                                      );
                                                    }
                                                  )}
                                                  {
                                                    inner_section.is_enable ? (
                                                      <>
                                                        <Form.Check
                                                          inline
                                                          label="Reject"
                                                          name={
                                                            "answerQuestion" +
                                                            questions.question_id
                                                          }
                                                          id={
                                                            "id" + questions.question_id
                                                          }
                                                          value="rejected"
                                                          type="radio"
                                                          checked={
                                                            questions.is_checked ===
                                                            "rejected"
                                                          }
                                                          required
                                                          onChange={() =>
                                                            handleChange(
                                                              category_index,
                                                              main_index,
                                                              section_index,
                                                              index,
                                                              "rejected"
                                                            )
                                                          }
                                                        />
                                                        <Form.Check
                                                          inline
                                                          label="Approve"
                                                          name={
                                                            "answerQuestion" +
                                                            questions.question_id
                                                          }
                                                          id={
                                                            "id" +
                                                            questions.question_id +
                                                            1
                                                          }
                                                          value="approved"
                                                          type="radio"
                                                          checked={
                                                            questions.is_checked ===
                                                            "approved"
                                                          }
                                                          required
                                                          onChange={() =>
                                                            handleChange(
                                                              category_index,
                                                              main_index,
                                                              section_index,
                                                              index,
                                                              "approved"
                                                            )
                                                          }
                                                        />
                                                        {questions.is_checked ===
                                                          "rejected" ? (
                                                          <Form.Control
                                                            value={
                                                              questions.reject_reason
                                                            }
                                                            placeholder="Notes for review"
                                                            name="reason"
                                                            className="mt-2"
                                                            required
                                                            onChange={(e) =>
                                                              reasonHandleChange(
                                                                e,
                                                                category_index,
                                                                main_index,
                                                                section_index,
                                                                index
                                                              )
                                                            }
                                                          />
                                                        ) : null}
                                                        <Form.Control.Feedback type="invalid">
                                                          This field is required
                                                        </Form.Control.Feedback>
                                                      </>
                                                    ) : null}

                                                </Form.Group>
                                              </div>
                                            </>
                                          );
                                        }
                                      )}
                                    </div>
                                  </>
                                );
                              }
                            )}
                          </>
                        );
                      })}
                      <div className="row">
                        <div className="col-md-12 text-end">
                          <Button
                            type="button"
                            className="btn-secondary button-width me-2"
                            onClick={() => gotoPreviousInnerStep(category.step)}

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

                    </Form>
                  </>
                ) : null}
              </>
            ))}
          </div>


          {/* switch person modal */}
          {
            switchPersonShowModal &&
            <FormModal heading={'Switch Person'} show={switchPersonShowModal} onClose={() => setSwitchPersonShowModal(false)} size="lg" backdrop="static">
              {
                surveyData && surveyData?.house_hold_member_section.map((member, index) => {
                  return (
                    <>
                      <div className="switch-person-body" key={index}>
                        <Card>
                          <Card.Body>
                            <div className="d-flex justify-content-between" onClick={() => getSwitchMemberId(member.member_id)}>
                              <div className="member-name">{member.member_name}</div>
                              <div><FaAngleRight className="survey-action"> </FaAngleRight></div>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    </>
                  )
                })
              }
            </FormModal>
          }

          {rejectallShowModal && (<RejectallModal show={rejectallShowModal} rejectAllReasons={rejectAllReasons} onClose={() => setRejectallShowModal(false,setCheckAll(''))} />)}

          {viewNotesShowModal && (<ViewNotesModal show={viewNotesShowModal} notes={surveyData?.notes} onClose={() => setViewNotesShowModal(false)} />)}

        </div>
      )}
      {loading && <Loader />}
    </>
  );
};

export default MemberQuestions;
