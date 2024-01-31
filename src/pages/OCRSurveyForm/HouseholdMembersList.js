import React, { useState, useEffect } from "react";
import { getData, postData, userRole } from "../../api";
import { Form, Row, Col } from "react-bootstrap";
import Button from "../../components/Form/Button";
import Badge from "react-bootstrap/Badge";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import RejectallModal from "./RejectallModal";
import ViewNotesModal from "./ViewNotesModal";

const HouseHoldMembersList = ({ nextStep }) => {
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [interviewData, setInterviewData] = useState([]);
  //const [memberData, setMemberData] = useState({});
  const [surveyData, setSurveyData] = useState({});
  const [rejectallShowModal, setRejectallShowModal] = useState(false);
  const [viewNotesShowModal, setViewNotesShowModal] = useState(false);

  const formattedData = (memberList) => {
    let dataCopy = [...memberList];
    dataCopy.forEach((member) => {
      member.is_checked = member.is_approved
        ? "approved"
        : member.is_rejected
          ? "rejected"
          : null;
    });
    setInterviewData(dataCopy);
  };
  // const memberFormatedData =(data)=>{
  //   let memberDataCopy =data;
  //   if(memberDataCopy != null){
  //     memberDataCopy.is_checked=memberDataCopy.is_approved
  //     ? "approved"
  //     : memberDataCopy.is_rejected
  //       ? "rejected"
  //       : null;
  //   }
  //   else{
  //     memberDataCopy={
  //       is_checked:null,
  //       is_rejected:false,
  //       is_approved:false
  //     }
  //   }
  //   setMemberData(memberDataCopy);
  // }
  const getSurveyData = async () => {
    setLoading(true);
    const res = await getData("view-suvery-entry-question/" + id + "/", {});
    if (res.status === 1) {
      setSurveyData(res.data);
      formattedData(res.data.members);
      //memberFormatedData(res.data.hhmc)
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const gotoStep = () => {
    let copyInterviewData = [...interviewData];
    let apiData = [];
    copyInterviewData.forEach((member) => {
      apiData.push(member);
    });
    const finalFilterdData = apiData.map((data) => ({
      member_id: data.member_id,
      member_name: data.member_name,
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
    // let copyMemberData ={...memberData};
    // let filterCopyMemberData={
    //   is_approved: copyMemberData.is_checked == "approved" ? true : false,
    //   is_rejected: copyMemberData.is_checked == "rejected" ? true : false,
    //   reject_reason: copyMemberData.reject_reason,
    //   rejected_date: new Date(),
    //   approved_date: new Date(),
    // }
    //  if(filterCopyMemberData.is_approved){
    //   delete filterCopyMemberData.reject_reason;
    //   delete filterCopyMemberData.rejected_date;
    //   delete filterCopyMemberData.is_rejected;
    //  }
    //  if(filterCopyMemberData.is_rejected){
    //   delete filterCopyMemberData.is_approved;
    //   delete filterCopyMemberData.approved_date;
    //  }
    surveySubmit(finalFilterdData)
  };

  useEffect(() => {
    getSurveyData();
  }, []);
  const answerValuehandleChange = (e, index) => {
    console.log(e);
    let value = e.target.value;
    console.log(interviewData);
    let copyData = [...interviewData];
    copyData[index].member_name = value;
    setInterviewData(copyData)
  }
  const handleChange = (index, whichStatus) => {
    let copyInterviewData = [...interviewData];
    copyInterviewData[index].is_checked = whichStatus;
    setInterviewData(copyInterviewData);
  };
  // const memberHandleChange = (whichStatus) => {
  //   let copyMemberData ={...memberData};
  //   copyMemberData.is_checked = whichStatus;
  //   setMemberData(copyMemberData);

  // };
  const reasonHandleChange = (e, index) => {
    const value = e.target.value;
    let copyInterviewData = [...interviewData];
    copyInterviewData[index].reject_reason = value;
    setInterviewData(copyInterviewData);
  };

  // const memberReasonHandleChange = (e) => {
  //   const value = e.target.value;
  //   let copyMemberData = {...memberData};
  //   copyMemberData.reject_reason = value;
  //   setMemberData(copyMemberData);
  // };
  const handleSubmit = (event) => {
    event.preventDefault();
    // nextStep(4);
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (form.checkValidity() === true) {
      surveySubmit();
    }
  };

  const surveySubmit = async () => {
    setLoading(true);
    let obj = {
      survey_entry_id: id,
      members: interviewData
    }
    const res = await postData("update-ocr-survey-members/", {}, obj);
    if (res.status === 1) {
      toast.success(res.message, { theme: "colored" });
      nextStep(4);
      setLoading(false);
    } else if (res.status === 422) {
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(res.message, { theme: "colored" });
    }
  }

  const handleAllChange = (e) => {
    let value = e.target.value
    if (value === 'allrejected') {
      setRejectallShowModal(true)
    }
    if (value === 'allapproved') {
      approveAll();
    }
  }

  const rejectAllReasons = (reason) => {
    let copyInterviewData = [...interviewData];
    let apiData = [];
    copyInterviewData.forEach((member) => {
      apiData.push(member);
    });
    const finalFilterdData = apiData.map((data) => ({
      member_id: data.member_id,
      member_name: data.member_name,
      is_rejected: true,
      reject_reason: reason,
      rejected_date: new Date(),
    }));
    // let filterCopyMemberData={
    //   is_rejected: true,
    //   reject_reason: reason,
    //   rejected_date: new Date(),
    // }
    surveySubmit(finalFilterdData)

  }

  const approveAll = () => {
    let copyInterviewData = [...interviewData];
    let apiData = [];
    copyInterviewData.forEach((member) => {
      apiData.push(member);
    });

    const finalFilterdData = apiData.map((data) => ({
      member_id: data.member_id,
      member_name: data.member_name,
      is_approved: true,
      approved_date: new Date(),
    }));
    // let filterCopyMemberData={
    //   is_approved: true,
    //   approved_date: new Date(),
    // }
    surveySubmit(finalFilterdData);
  }

  return (
    <>
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
          <div className="category_section boxshadow mt-3 p-3">
            <div className="view-heading mb-3">
              <h3>Enter number of members in household</h3>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group
                      className="mb-3"
                    >
                      <Form.Label>
                        Enter the no.of members in household{" "}
                      </Form.Label>
                      <Form.Control
                        value={surveyData.household_member_count}
                        disabled
                        className="mb-3 main-form-input"
                      />

                      {/* <Form.Check
                          inline
                          label="Reject"
                          name="answerQuestionmember"
                          id="membercount"
                          value="rejected"
                          type="radio"
                          checked={memberData.is_checked == "rejected"}
                          onChange={() => memberHandleChange("rejected")}
                          required
                        />
                        <Form.Check
                          inline
                          label="Approve"
                          name="answerQuestionmember"
                          id="membercount1"
                          value="approved"
                          type="radio"
                          checked={memberData.is_checked == "approved"}
                          onChange={() => memberHandleChange("approved")}
                          required
                        />
                        {memberData.is_checked == "rejected" ? (
                          
                          <Form.Control
                            value={memberData.reject_reason}
                            placeholder="Notes for review"
                            name="memberreason"
                            className="mt-2"
                            required
                            onChange={(e) =>
                              memberReasonHandleChange(e)
                            }
                          />
                        ) : null}

                        <Form.Control.Feedback type="invalid">
                          This field is required
                        </Form.Control.Feedback> */}
                    </Form.Group>
                  </div>
                </div>
              </div>
              {interviewData.map((member, index) => {
                return (
                  <>
                    <div className="col-md-6" key={index}>
                      <Form.Group
                        className={`mb-3 ${surveyData.is_recorrection_members && member.is_rejected ? "recorection" : null}`}
                      >
                        <Form.Label>Person {index + 1}</Form.Label>
                        <Form.Control
                          value={member.member_name}
                          required
                          onChange={(e) =>
                            answerValuehandleChange(
                              e, index
                            )
                          }
                          className="mb-3 main-form-input"
                          disabled={userRole()?.role == 'data_reviewer'?false:true }
                        />
                        <Form.Control.Feedback type="invalid">
                          This field is required
                        </Form.Control.Feedback>
                        {/* <Form.Check
                          inline
                          label="Reject"
                          name={"answerQuestion" + member.member_id}
                          id={"id" + member.member_id}
                          value="rejected"
                          type="radio"
                          checked={member.is_checked === "rejected"}
                          onChange={() => handleChange(index, "rejected")}
                          required
                        />
                        <Form.Check
                          inline
                          label="Approve"
                          name={"answerQuestion" + member.member_id}
                          id={"id" + member.member_id + 1}
                          value="approved"
                          type="radio"
                          checked={member.is_checked === "approved"}
                          onChange={() => handleChange(index, "approved")}
                          required
                        />
                        {member.is_checked === "rejected" ? (
                          <Form.Control
                            value={member.reject_reason}
                            placeholder="Notes for review"
                            name="reason"
                            className="mt-2"
                            required
                            onChange={(e) =>
                              reasonHandleChange(e, index)
                            }
                          />
                        ) : null}

                        <Form.Control.Feedback type="invalid">
                          This field is required
                        </Form.Control.Feedback> */}
                      </Form.Group>
                    </div>
                  </>
                );
              })}
              <div className="col-md-12 text-end">
                <Button
                  className="btn-secondary button-width me-2"
                  onClick={() => nextStep(2)}
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
    </>
  );
};

export default HouseHoldMembersList;
