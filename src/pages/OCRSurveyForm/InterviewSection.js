import React, { useState, useEffect } from "react";
import { getData, postData, userRole } from "../../api";
import { Form, Row, Col } from "react-bootstrap";
import Button from "../../components/Form/Button";
import Badge from 'react-bootstrap/Badge';
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import ViewNotesModal from "./ViewNotesModal";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InterviewSection = ({ nextStep }) => {
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [interviewData, setInterviewData] = useState([]);
  const [surveyData, setSurveyData] = useState({});
  const [viewNotesShowModal, setViewNotesShowModal] = useState(false);

  useEffect(() => {
    getSurveyData();
  }, "");


  const formattedData = (interview_data) => {
    let dataCopy = [...interview_data];
    dataCopy.forEach((category, category_index) => {
      category.section.forEach((section, section_index) => {
        section.questions.forEach((question, index) => {

          question.is_checked = question.is_approved
            ? "approved"
            : question.is_rejected
              ? "rejected"
              : null;
          question.answers.forEach((answer) => {
            if (answer.dtype === 'datepicker') {
              console.log(answer.answer_value)
              let date = moment(answer.answer_value,'DD/MM/YYYY');
              if (date.isValid()) {
                console.log(answer.answer_value)
                answer.answer_value = moment(answer.answer_value,'DD/MM/YYYY').toDate();
              }
              else {
                answer.answer_value = null;
              }
            }
            if (answer.dtype === 'timepicker') {
              let date = moment(answer.answer_value);
              if(date.isValid()){
                answer.answer_value = new Date(answer.answer_value);
              }
              else {
                answer.answer_value = null;
              }
            }
          })
          if (dataCopy[category_index].section[section_index].questions[index].position === dataCopy[category_index].section[section_index].questions[index + 1]?.position) {
            dataCopy[category_index].section[section_index].questions[index].combine_position = true;
            dataCopy[category_index].section[section_index].questions[index + 1].combine_position = true;
          }
        });
      });
    });
    setInterviewData(dataCopy);
  };
  // get form data
  const getSurveyData = async () => {
    setLoading(true);
    const res = await getData("view-suvery-entry-question/" + id + "/", {});
    if (res.status === 1) {
      setSurveyData(res.data);
      formattedData(res.data.interview_section)
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const handleChange = (index, category_section_index, question_section_index, whichStatus) => {
    let copyInterviewData = [...interviewData];
    copyInterviewData[index].section[category_section_index].questions[question_section_index].is_checked =
      whichStatus;
    setInterviewData(copyInterviewData);

  };
  const reasonHandleChange = (e, index, category_section_index, question_section_index) => {
    const value = e.target.value;
    let copyInterviewData = [...interviewData];
    copyInterviewData[index].section[category_section_index].questions[question_section_index].reject_reason =
      value;
    setInterviewData(copyInterviewData);
  }
  // textbox handle change
  const textBoxHandleChange = (e, index, category_section_index, question_section_index, answer_section_index, type) => {
    console.log(type);
    let value = e.target.value;

    let copyInterviewData = [...interviewData];
    copyInterviewData[index].section[category_section_index].questions[question_section_index].answers[answer_section_index].answer_value =
      value;
    setInterviewData(copyInterviewData);
  }
  //select handle change
  const selectBoxHandleChange = (e, index, category_section_index, question_section_index, answer_section_index) => {

    const value = e.target.value;
    let copyInterviewData = [...interviewData];
    copyInterviewData[index].section[category_section_index].questions[question_section_index].answers[answer_section_index].answer_value =
      value;
    setInterviewData(copyInterviewData);
  }
  // datepicker handle change
  const handleDateChange = (date, index,
    category_section_index,
    question_section_index,
    answer_section_index) => {
    let copyInterviewData = [...interviewData];
    copyInterviewData[index].section[category_section_index].questions[question_section_index].answers[answer_section_index].answer_value =
      date;
    setInterviewData(copyInterviewData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  
    if (checkAllQuestions() === true && form.checkValidity() === true) {
      gotoNext();
    }
  };
  const checkAllQuestions =()=>{
    let status;
    const CopyData =[...interviewData];
    let copyCheckAllQuestion=[];
    CopyData.forEach((category, category_index) => {
      category.section.forEach((section, section_index) => {
        section.questions.forEach((question, index) => {
          question.answers.forEach((answer) => {
            if (answer.dtype === 'datepicker' || answer.dtype === 'timepicker') {
              copyCheckAllQuestion.push(answer)
            }

          })
        });
      });
    });
    copyCheckAllQuestion.every((answer) => {
      if(answer.answer_value ==='' || answer.answer_value ===null){
        console.log('every');
        status =false;
        toast.error('Please fill all the fields', { theme: "colored" });
        return status
      }
      else{
        status =true;
        return status;
      }
    });
    return status;
  }
  const gotoNext = () => {
    let copyInterviewData = [...interviewData];
    let apiData = [];
    copyInterviewData.forEach((category) => {
      category.section.forEach((section) => {
        section.questions.forEach((question) => {
          question.answers.forEach((answer) => {
            answer.ranking = null;
            if (answer.dtype === 'age_picker' || answer.dtype === 'datepicker') {
              answer.answer_value = moment(answer.answer_value).format('DD/MM/YYYY');
            }
          })
          apiData.push(question);
        });
      });
    });
    const finalFilterdData = apiData.map((data) => (
      {
        section_id: data.section_id,
        question_id: data.question_id,
        part: data.part,
        is_approved: data.is_checked === "approved" ? true : false,
        is_rejected: data.is_checked === "rejected" ? true : false,
        answers: data.answers,
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
    surveySubmit(finalFilterdData);
  };

  const surveySubmit = async (finalFilterdData) => {
    setLoading(true);
    let obj = {
      next_section: 2,
      reviews: finalFilterdData
    }
    const res = await postData("ocr-question-verification/", {}, obj);
    if (res.status === 1) {
      toast.success(res.message, { theme: "colored" });
      nextStep(3)
      setLoading(false);
    } else if (res.status === 422) {
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(res.message, { theme: "colored" });
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
                <Badge pill bg="secondary" className="survey-status">  {surveyData.survey_type?.toUpperCase()} </Badge>
              </div>
            </Col>
            <Col md={6}>
              <div className="validate-all-section d-flex justify-content-end">
                {userRole()?.role == 'data_reviewer' ? (
                  <div className="view-notes-btn">
                    <Button className="btn-primary button-width" onClick={() => setViewNotesShowModal(true)}>View Image</Button>
                  </div>
                ) : null}


              </div>
            </Col>
          </Row>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="category_section boxshadow mt-3  p-3">
              {interviewData?.map((category, index) => (
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
                            <div className={`mb-3 ${questions.combine_position ? "col-md-3" : 'col-md-6'}`} key={question_section_index}>
                              <Form.Group
                                className={`mb-3 ${category_section.is_recorrection && questions.is_rejected ? "recorection" : null}`}
                                controlId={
                                  "answerQuestion" + questions.question_id
                                }
                              >
                                {questions.combine_position ? (
                                  <div className="row">
                                    {questions?.answers?.map((answer_section, answer_section_index) => (

                                      <>
                                        <div className="col-md-12" key={answer_section_index}>
                                          <Form.Label>{questions.title}</Form.Label>
                                          {answer_section.dtype === 'textbox' ? (
                                            <>
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
                                                disabled={userRole()?.role == 'data_reviewer'?false:true }
                                                className="mb-3 main-form-input"
                                              />
                                            </>

                                          ) : answer_section.dtype === 'selectbox' ? (
                                            <>
                                              <Form.Select className="mb-3 main-form-input"
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
                                                required
                                                disabled={userRole()?.role == 'data_reviewer'?false:true }
                                              >
                                                {answer_section.options?.map((value) => (
                                                  <>

                                                    <option value={value}>{value}</option>
                                                  </>
                                                ))}

                                              </Form.Select>
                                             
                                            </>


                                          ) : answer_section.dtype === 'datepicker' ? (
                                            <>
                                              <div className="position-relative mb-3 calendar_icon">

                                                <DatePicker
                                                  className="datepicker-add-barangay form-control"
                                                  selected={answer_section.answer_value}
                                                  name="dob"
                                                  dateFormat="dd-MM-yyyy"
                                                  dropdownMode="select"
                                                  showMonthDropdown
                                                  showYearDropdown
                                                  id={"id" + answer_section.id}
                                                  placeholderText={answer_section.placeholder}
                                                  // minDate={moment().subtract(60, "years")._d}
                                                  // maxDate={moment().subtract(18, "years")._d}
                                                  // inputFormat="yyyy-MM-dd"
                                                  // dateFormat="yyyy-MM-dd"
                                                  onChange={(e) => handleDateChange(
                                                    e,
                                                    index,
                                                    category_section_index,
                                                    question_section_index,
                                                    answer_section_index)}
                                                  calendarIcon={true}
                                                  closeCalendar={true}
                                                  clearIcon={true}
                                                  required
                                                  disabled={userRole()?.role == 'data_reviewer'?false:true }
                                                />
                                                 
                                              </div>
                                            </>

                                          ) : answer_section.dtype === 'timepicker' ? (
                                            <>
                                              <div className="position-relative mb-3 calendar_icon">

                                                <DatePicker
                                                  className="datepicker-add-barangay form-control"
                                                  selected={answer_section.answer_value}
                                                  name="dob"
                                                  dateFormat="h:mm aa"
                                                  dropdownMode="select"
                                                  showTimeSelect
                                                  id={"id" + answer_section.id}
                                                  placeholderText={answer_section.placeholder}
                                                  // minDate={moment().subtract(60, "years")._d}
                                                  // maxDate={moment().subtract(18, "years")._d}
                                                  // inputFormat="yyyy-MM-dd"
                                                  // dateFormat="yyyy-MM-dd"
                                                  onChange={(e) => handleDateChange(
                                                    e,
                                                    index,
                                                    category_section_index,
                                                    question_section_index,
                                                    answer_section_index)}
                                                  calendarIcon={true}
                                                  closeCalendar={true}
                                                  clearIcon={true}
                                                  required
                                                  disabled={userRole()?.role == 'data_reviewer'?false:true }
                                                />
                                                {/* <span className="calendar-icon"></span> */}
                                              </div>
                                            </>
                                          ) : null}
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
                                        </div>

                                      </>
                                    ))}
                                  </div>
                                ) :
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
                                            disabled={userRole()?.role == 'data_reviewer'?false:true }
                                            required
                                            className="mb-3 main-form-input"
                                          />
                                        ) : answer_section.dtype === 'selectbox' ? (
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
                                            disabled={userRole()?.role == 'data_reviewer'?false:true }
                                            required
                                          >
                                            {answer_section.options?.map((value) => (
                                              <>

                                                <option value={value}>{value}</option>
                                              </>
                                            ))}

                                          </Form.Select>
                                        ) : answer_section.dtype === 'datepicker' ? (
                                          <>
                                            <div className="position-relative mb-3 calendar_icon">
                                              <DatePicker
                                                className="datepicker-add-barangay form-control"
                                                selected={answer_section.answer_value}
                                                name="dob"
                                                dateFormat="dd-MM-yyyy"
                                                dropdownMode="select"
                                                showMonthDropdown
                                                showYearDropdown
                                                placeholderText={answer_section.placeholder}
                                                onChange={(e) => handleDateChange(
                                                  e,
                                                  index,
                                                  category_section_index,
                                                  question_section_index,
                                                  answer_section_index)}
                                                calendarIcon={true}
                                                closeCalendar={true}
                                                clearIcon={true}
                                                required
                                                disabled={userRole()?.role == 'data_reviewer'?false:true }
                                              />
                                              {/* <span className="calendar-icon" onClick={handleFocusDate}></span> */}

                                            </div>
                                          </>

                                        ) : answer_section.dtype === 'timepicker' ? (
                                          <>
                                            <div className="position-relative mb-3 calendar_icon">
                                              <DatePicker
                                                className="datepicker-add-barangay form-control"
                                                selected={answer_section.answer_value}
                                                name="dob"
                                                timeIntervals={15}
                                                timeCaption="Time"
                                                dateFormat="h:mm aa"
                                                dropdownMode="select"
                                                showTimeSelect
                                                showTimeSelectOnly
                                                placeholderText={answer_section.placeholder}
                                                onChange={(e) => handleDateChange(
                                                  e,
                                                  index,
                                                  category_section_index,
                                                  question_section_index,
                                                  answer_section_index)}
                                                calendarIcon={true}
                                                closeCalendar={true}
                                                clearIcon={true}
                                                required
                                                disabled={userRole()?.role == 'data_reviewer'?false:true }
                                              />
                                              {/* <span className="calendar-icon" onClick={handleFocusDate}></span> */}

                                            </div>
                                          </>
                                        ) : null}
                                        {/* <Form.Control
                                      value={answer_section.answer_value}
                                      disabled
                                      className="mb-3 main-form-input"
                                    /> */}
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
                                      </>
                                    ))}
                                  </>

                                }

                              </Form.Group>
                            </div>
                          </>
                        ))}
                      </div>
                    </>
                  ))}
                </>
              ))}
              <div className="col-md-12 text-end">
                <Button
                  className="btn-secondary button-width me-2"
                  onClick={() => nextStep(1)}
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
          </Form>


          {viewNotesShowModal && (<ViewNotesModal show={viewNotesShowModal} images={surveyData?.ocr_images} onClose={() => setViewNotesShowModal(false)} />)}

        </div>
      )}
      {loading && <Loader />}
    </>
  );
};

export default InterviewSection;
