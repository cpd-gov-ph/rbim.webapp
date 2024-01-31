import React, { useState, useEffect, useRef } from "react";
import { getData, postData, userRole } from "../../api";
import { Form, Row, Col, Card } from "react-bootstrap";
import Button from "../../components/Form/Button";
import Badge from 'react-bootstrap/Badge';
import switchPerson from '../../assets/images/switch_person.png'
import FormModal from "../../components/FormModal";
import { FaAngleRight } from 'react-icons/fa';
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";
import ViewNotesModal from "./ViewNotesModal";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select, { components } from "react-select";

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
  const [personIndex, setPersonIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0)
  const focusDate = useRef(null);
  const handleFocusDate = () => {
    const datepickerElement = focusDate.current;
    datepickerElement.setFocus(true);
  };
  //multiselect options configuration
  const InputOption = ({
    getStyles,
    Icon,
    isDisabled,
    isFocused,
    isSelected,
    children,
    innerProps,
    ...rest
  }) => {
    const [isActive, setIsActive] = useState(false);
    const onMouseDown = () => setIsActive(true);
    const onMouseUp = () => setIsActive(false);
    const onMouseLeave = () => setIsActive(false);

    // styles
    let bg = "transparent";
    if (isFocused) bg = "#eee";
    if (isActive) bg = "#B2D4FF";

    const style = {
      alignItems: "center",
      backgroundColor: bg,
      color: "inherit",
      display: "flex ",
    };

    // prop assignment
    const props = {
      ...innerProps,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      style
    };

    return (
      <components.Option
        {...rest}
        isDisabled={isDisabled}
        isFocused={isFocused}
        isSelected={isSelected}
        getStyles={getStyles}
        innerProps={props}
      >
        {/* <input type="checkbox" checked={isSelected} className="me-2"  /> */}
        {children}
      </components.Option>
    );
  };
  // const checkBoxChange=(e,s)=>{
  //   console.log(e,s)
  // }
  const changeDataFormat = (member_data) => {
    let formatedData = [];
    member_data.forEach((data) => {
      data.category.forEach((cate) => {
        cate.data_id = data.id;
        cate.member_id = data.member_id;
        cate.member_name = data.member_name;

      });
      formatedData.push(data);
    });

    formatedData.forEach((main_category, main_category_index) => {
      // main_category.step =main_category_index+1;
      main_category.category.forEach((element, index) => {
        // element.step = main_category_index + 1;
        element.page.forEach((page_section, page_index) => {
          //page_section.step = page_index + 1;
          page_section.section.forEach((section,section_index) => {
            section.questions.forEach((question_section,question_index) => {
              question_section.is_checked = question_section.is_approved
                ? "approved"
                : question_section.is_rejected
                  ? "rejected"
                  : null;
              question_section.answers.forEach((answer) => {
                if ((answer.dtype === 'datepicker' || answer.dtype === 'age_picker')) {
                  let date = moment(answer.answer_value);
                  if (date.isValid()) {
                    answer.answer_value = moment(answer.answer_value).toDate();
                  }
                  else {
                    answer.answer_value = null;
                  }

                }
                if (answer.dtype === 'multiselectbox') {
                  let allAnswer = [];
                  answer?.answer_value?.forEach((answeroption) => {
                    let answerObj = {
                      value: answeroption,
                      label: answeroption
                    }
                    allAnswer.push(answerObj);
                  });
                  answer.allAnswer = allAnswer;
                  let allOption = [];
                  answer.options.forEach((option) => {
                    let optionObj = {
                      value: option,
                      label: option
                    }
                    allOption.push(optionObj);
                  });
                  answer.allOption = allOption;
                }

                //console.log(question_section.title,answer.answer_value);
                if (question_section.title === '5. When was ___ born ?') {
                  let gender = formatedData[main_category_index].category[0]?.page[0]?.section[
                    0]?.questions[2]?.answers[0]?.answer_value;
                  let ageString = moment(answer.answer_value).format("YYYY/MM/DD");
                  let age = moment().diff(ageString, "years", false);
                  formatedData[main_category_index].category[0].page[0].section[0].is_enable = true;
                  formatedData[main_category_index].category[1].page[0].section[0].is_enable =
                    age >= 5 ? true : false;
                  formatedData[main_category_index].category[1].page[0].section[1].is_enable =
                    age >= 3 && age <= 24 ? true : false;
                  formatedData[main_category_index].category[1].page[1].section[0].is_enable =
                    age >= 15 ? true : false;
                  formatedData[main_category_index].category[2].page[0].section[0].is_enable =
                    age < 1 ? true : false;
                  formatedData[main_category_index].category[2].page[0].section[1].is_enable =
                    age >= 10 && age <= 54 && gender === "Female" ? true : false;
                  formatedData[main_category_index].category[3].page[0].section[0].is_enable = true;
                  formatedData[main_category_index].category[3].page[1].section[0].is_enable =
                    age >= 10 ? true : false;
                  formatedData[main_category_index].category[3].page[1].section[1].is_enable =
                    age >= 60 ? true : false;
                  formatedData[main_category_index].category[3].page[1].section[2].is_enable =
                    age >= 15 ? true : false;
                  formatedData[main_category_index].category[4].page[0].section[0].is_enable = true;
                  formatedData[main_category_index].category[5].page[1].section[0].is_enable =
                    age >= 18 ? true : false;
                  formatedData[main_category_index].category[5].page[2].section[0].is_enable =
                    age >= 15 ? true : false;
                  formatedData[main_category_index].category[5].page[2].section[0].age = age;
                }
                if (question_section.title === "36. Indicate if Non - migrant , Migrant or Transient ?") {
                  if (answer.answer_value === 'Migrant' || answer.answer_value === 'Transient') {
                    formatedData[main_category_index].category[index + 1].page[0].section[0].is_enable = true;
                    formatedData[main_category_index].category[index].page[page_index].section[1].is_enable = true;
                  }
                  else {
                    formatedData[main_category_index].category[index].page[page_index].section[1].is_enable = false;
                    formatedData[main_category_index].category[index + 1].page[0].section[0].is_enable = false;
                  }
                }
                if(question_section.title ==='39. Does ____ plan to return to previous residence ? When ?'){
                  if(answer.answer_value ==='No'){
                    formatedData[main_category_index].category[index].page[page_index].section[
                      section_index
                    ].questions[question_index].answers[1].is_disabled=true;
                    formatedData[main_category_index].category[index].page[page_index].section[
                      section_index
                    ].questions[question_index].answers[2].is_disabled=true;
                  
                  }
                }
                if(question_section.title ==='23. What family planning method does ___  and partner currently use ?'){
                  
                  if(answer.answer_value==='Not Applicable'){
                    formatedData[main_category_index].category[index].page[page_index].section[
                      section_index
                    ].questions[question_index+1].answers[0].is_disabled=true;
                    formatedData[main_category_index].category[index].page[page_index].section[
                      section_index
                    ].questions[question_index+1].answers[1].is_disabled=true;
                  }
                }

              })
            });
          });
        });
      });
    })
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
      const pageindex = res.data.pageindex === null ? 0 : +res.data.pageindex;
      setPageIndex(pageindex);
      const personindex = res.data.personindex === null ? 0 : +res.data.personindex;
      setPersonIndex(personindex);
      // const inner_step = res.data.inner_next_section === null ? 1 : +res.data.inner_next_section;
      // setInnerStep(1);
      // console.log(innerStep)
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const switchMember = (id) => {
    formatedData.every((element, index) => {
      if (element.member_id === id) {
        setPersonIndex(index);
        setPageIndex(0);
        return false;
      }
      else {
        return true
      }
    })
  }

  const handleChange = (
    main_category_index,
    category_index,
    main_index,
    section_index,
    index,
    whichStatus
  ) => {
    let copyInterviewData = [...formatedData];
    copyInterviewData[main_category_index].category[category_index].page[main_index].section[
      section_index
    ].questions[index].is_checked = whichStatus;
    setFormatedData(copyInterviewData);
  };

  const reasonHandleChange = (
    e,
    main_category_index,
    category_index,
    main_index,
    section_index,
    index
  ) => {
    const value = e.target.value;
    let copyInterviewData = [...formatedData];
    copyInterviewData[main_category_index].category[category_index].page[main_index].section[
      section_index
    ].questions[index].reject_reason = value;
    setFormatedData(copyInterviewData);
  };
  // answer value textbox and select change function
  const answerValuehandleChange = (e, main_category_index, category_index,
    main_index,
    section_index,
    index,
    fieldIndex,
    type) => {

    const value = e.target.value;
    let copyInterviewData = [...formatedData];
    copyInterviewData[main_category_index].category[category_index].page[main_index].section[
      section_index
    ].questions[index].answers[fieldIndex].answer_value = value;
    if (copyInterviewData[main_category_index].category[category_index].page[main_index].section[
      section_index
    ].questions[index].title === "36. Indicate if Non - migrant , Migrant or Transient ?") {
      if (value === 'Migrant' || value === 'Transient') {
        copyInterviewData[main_category_index].category[category_index + 1].page[0].section[0].is_enable = true;
        copyInterviewData[main_category_index].category[category_index].page[main_index].section[1].is_enable = true;
        copyInterviewData[main_category_index].category[category_index].page[0].section[1].is_enable=true;
      }
      else {
        copyInterviewData[main_category_index].category[category_index].page[main_index].section[1].is_enable = false;
        copyInterviewData[main_category_index].category[category_index + 1].page[0].section[0].is_enable = false;
        copyInterviewData[main_category_index].category[category_index].page[0].section[1].is_enable=false;
      }
      console.log(copyInterviewData[main_category_index].category[category_index].page[0].section[1])
    }
    if(copyInterviewData[main_category_index].category[category_index].page[main_index].section[
      section_index
    ].questions[index].title ==='39. Does ____ plan to return to previous residence ? When ?'){
      if(value ==='No'){
        copyInterviewData[main_category_index].category[category_index].page[main_index].section[
          section_index
        ].questions[index].answers[1].is_disabled=true;
        copyInterviewData[main_category_index].category[category_index].page[main_index].section[
          section_index
        ].questions[index].answers[2].is_disabled=true;
      }
      else{
        copyInterviewData[main_category_index].category[category_index].page[main_index].section[
          section_index
        ].questions[index].answers[1].is_disabled=false;
        copyInterviewData[main_category_index].category[category_index].page[main_index].section[
          section_index
        ].questions[index].answers[2].is_disabled=false;
      }
    }
    if(copyInterviewData[main_category_index].category[category_index].page[main_index].section[
      section_index
    ].questions[index].title ==='23. What family planning method does ___  and partner currently use ?'){
      
      if(value==='Not Applicable'){
        copyInterviewData[main_category_index].category[category_index].page[main_index].section[
          section_index
        ].questions[index+1].answers[0].is_disabled=true;
        copyInterviewData[main_category_index].category[category_index].page[main_index].section[
          section_index
        ].questions[index+1].answers[1].is_disabled=true;
      }
      else{
        copyInterviewData[main_category_index].category[category_index].page[main_index].section[
          section_index
        ].questions[index+1].answers[0].is_disabled=false;
        copyInterviewData[main_category_index].category[category_index].page[main_index].section[
          section_index
        ].questions[index+1].answers[1].is_disabled=false;
      }
    }
    setFormatedData(copyInterviewData);
  }
  // datepicker handle change
  const handleDateChange = (e, main_category_index, category_index,
    main_index,
    section_index,
    index,
    fieldIndex,
    type) => {
    let copyInterviewData = [...formatedData];

    copyInterviewData[main_category_index].category[category_index].page[main_index].section[
      section_index
    ].questions[index].answers[fieldIndex].answer_value = e;

    setFormatedData(copyInterviewData);
  };
  // Agepicker handle change
  const handleAgeChange = (e, main_category_index, category_index,
    main_index,
    section_index,
    index,
    fieldIndex,
    type) => {
    let copyInterviewData = [...formatedData];
    if (copyInterviewData[main_category_index].category[category_index].page[main_index].section[
      section_index].questions[index].title == '5. When was ___ born ?') {
        console.log('click')
      let gender = copyInterviewData[main_category_index].category[0]?.page[0]?.section[
        0]?.questions[2]?.answers[0]?.answer_value;
      let ageString = moment(e).format("YYYY/MM/DD");
      let age = moment().diff(ageString, "years", false);
      console.log(age);
      copyInterviewData[main_category_index].category[0].page[0].section[0].is_enable = true;
      copyInterviewData[main_category_index].category[1].page[0].section[0].is_enable =
        age >= 5 ? true : false;
      copyInterviewData[main_category_index].category[1].page[0].section[1].is_enable =
        age >= 3 && age <= 24 ? true : false;
      copyInterviewData[main_category_index].category[1].page[1].section[0].is_enable =
        age >= 15 ? true : false;
      copyInterviewData[main_category_index].category[2].page[0].section[0].is_enable =
        age < 1 ? true : false;
      copyInterviewData[main_category_index].category[2].page[0].section[1].is_enable =
        age >= 10 && age <= 54 && gender === "Female" ? true : false;
      copyInterviewData[main_category_index].category[3].page[0].section[0].is_enable = true;
      copyInterviewData[main_category_index].category[3].page[1].section[0].is_enable =
        age >= 10 ? true : false;
      copyInterviewData[main_category_index].category[3].page[1].section[1].is_enable =
        age >= 60 ? true : false;
      copyInterviewData[main_category_index].category[3].page[1].section[2].is_enable =
        age >= 15 ? true : false;
      copyInterviewData[main_category_index].category[4].page[0].section[0].is_enable = true;
      copyInterviewData[main_category_index].category[5].page[1].section[0].is_enable =
        age >= 18 ? true : false;
      copyInterviewData[main_category_index].category[5].page[2].section[0].is_enable =
        age >= 15 ? true : false;
      copyInterviewData[main_category_index].category[5].page[2].section[0].age = age;
    }
    copyInterviewData[main_category_index].category[category_index].page[main_index].section[
      section_index
    ].questions[index].answers[fieldIndex].answer_value = e;

    setFormatedData(copyInterviewData);
    console.log(copyInterviewData[main_category_index].category[0].page[0].section[0]);
    console.log(copyInterviewData[main_category_index].category[1].page[0].section[0])
  };
  //multiselect change function
  const answerMultiselectHandleChange = (e, main_category_index, category_index,
    main_index,
    section_index,
    index,
    fieldIndex) => {
    //console.log(e)
    let copyInterviewData = [...formatedData];
    if (checkMultiSelectOptions(e)) {
      //console
      let filterValue = e.filter(a => a.value === 'Others');
      //console.log(filterValue);
      copyInterviewData[main_category_index].category[category_index].page[main_index].section[
        section_index
      ].questions[index].answers[fieldIndex].allAnswer = filterValue;
    }
    else {
      e.forEach((selected, index) => {
        if (selected.value === 'Others') {
          e.splice(index, 1);
        }
      })
      copyInterviewData[main_category_index].category[category_index].page[main_index].section[
        section_index
      ].questions[index].answers[fieldIndex].allAnswer = e;
    }
    setFormatedData(copyInterviewData);
  }
  //check multiselect options for Others
  const checkMultiSelectOptions = (options) => {
    return options.some((selected) => selected.value === 'Others'
    )
  }
  const gotoNextInnerStep = () => {
    let copyInterviewData = [...formatedData];
    let apiData = [];
    copyInterviewData.forEach((main_category, main_person_index) => {
      console.log(main_person_index)
      if (main_person_index === personIndex) {
        main_category.category[pageIndex].page.forEach((page_section) => {
          page_section.section.forEach((inner_section) => {
            if (inner_section.is_enable) {
              inner_section.questions.forEach((question_section) => {
                question_section.is_reviewed_by_barangay = true;
                question_section.answers.forEach((answer) => {
                  answer.ranking = null;
                  if ((answer.dtype === 'age_picker' || answer.dtype === 'datepicker')) {

                    answer.answer_value = moment(answer.answer_value).toDate();
                  }
                  if (answer.dtype === 'multiselectbox') {
                    answer.allAnswer.forEach((option) => {
                      answer.answer_value = [];
                      answer.answer_value.push(option.value);
                    });
                  }
                })
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
      answers: data.answers,
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
    if (personIndex === (formatedData.length - 1) && pageIndex === 5) {
      console.log('last')
      if (allQuestionsStatus() === true) {

        console.log('final')
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
      console.log('each')
      if (finalFilterdData.length > 0) {
        eachSurveySubmit(finalFilterdData)
      }
      else {
        //setInnerStep(step + 1);
        if (pageIndex === 5) {
          setPersonIndex(personIndex + 1)
          setPageIndex(0)
        }
        else {
          setPageIndex(pageIndex + 1);
        }


      }
      setValidated(false);
    }
  };
  // check all questions status
  const allQuestionsStatus = () => {
    let status = false;
    let copyFormateData = [...formatedData];
    let copyCheckAllQuestion = [];
    copyFormateData.forEach((main_category_section, main_category_section_index) => {
      main_category_section.category.forEach((category_section, category_section_index) => {
        category_section.page.forEach((page_section) => {
          page_section.section.forEach((section) => {
            if (section.is_enable) {
              section.questions.forEach((question) => {
                let filter_obj = {
                  is_enable: section.is_enable,
                  is_approved: question.is_approved === true ? true : question.is_checked === "approved" ? true : false,
                  is_rejected: question.is_rejected === true ? true : question.is_checked === "rejected" ? true : false,
                  is_reviewed_by_barangay: question.is_reviewed_by_barangay,
                  personindex: main_category_section_index,
                  pageindex: category_section_index
                }
                copyCheckAllQuestion.push(filter_obj);
              })
            }
          })
        })
      })
    });
    copyCheckAllQuestion.every((question) => {
      if (userRole()?.role === 'data_reviewer') {
        if (question.is_approved || question.is_rejected) {
          status = true;
          return status;
        }
        else {
          status = false;
          setPageIndex(question.pageindex);
          setPersonIndex(question.personindex);
          toast.error(' You have not reviewed the full survey', { theme: "colored" });
          return status;
        }
      }
      else {
        if ((question.is_approved || question.is_rejected) && question.is_reviewed_by_barangay) {
          status = true;
          return status;
        }
        else {
          status = false;
          setPageIndex(question.pageindex)
          setPersonIndex(question.personindex);
          toast.error(' You have not reviewed the full survey', { theme: "colored" });
          return status;
        }
      }
    });
    return status;
  }
  const surveySubmit = async (finalFilterdData) => {
    console.log('final')
    setLoading(true);
    setCheckAll('');
    let obj = {
      inner_next_section: 1,
      personindex: personIndex,
      pageindex: pageIndex,
      next_section: 4,
      reviews: finalFilterdData
    }
    const res = await postData("ocr-question-verification/", {}, obj);
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

  const eachSurveySubmit = async (finalFilterdData,) => {
    console.log('each')
    setLoading(true);
    setCheckAll('');
    let obj = {
      inner_next_section: 1,
      personindex: personIndex,
      pageindex: pageIndex,
      next_section: 3,
      reviews: finalFilterdData
    }
    const res = await postData("ocr-question-verification/", {}, obj);
    if (res.status === 1) {
      toast.success(res.message, { theme: "colored" });
      //setInnerStep(step + 1);
      setPersonAndPage();
      setLoading(false);
      window.scrollTo(0, 0);
    } else if (res.status === 422) {
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(res.message, { theme: "colored" });
    }
  }

  const gotoPreviousInnerStep = () => {
    if (pageIndex === 0 && personIndex === 0) {
      nextStep(3);
    }
    else {
      if (pageIndex !== 0) {
        setPageIndex(pageIndex - 1);
      }
      else {
        setPersonIndex(personIndex - 1);
        setPageIndex(5)
      }
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
      gotoNextInnerStep();
    }
  };
  const setPersonAndPage = () => {
    if (pageIndex === 5) {

      setPersonIndex(personIndex + 1);
      setPageIndex(0);
    }
    else {
      setPageIndex(pageIndex + 1)
    }
  }

  const getSwitchMemberId = (id) => {
    setSwitchPersonId(id);
    setValidated(false);
    switchMember(id);
    setSwitchPersonShowModal(false);
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
                  <>
                    <div className="view-notes-btn">
                      <Button className="btn-primary button-width" onClick={() => setViewNotesShowModal(true)}>View Images</Button>
                    </div>
                  </>
                ) : null}

              </div>
            </Col>
          </Row>

          <div className="category_section boxshadow mt-3 p-3">
            <div className="mb-3 d-flex">
              <div className="switch-member-name me-3">{formatedData[personIndex]?.category[pageIndex]?.member_name}’s questions :</div>
              {surveyData.household_member_count > 1 ? (
                <div className="switch-person-btn">
                  <Button className="btn-secondary  button-width" onClick={() => setSwitchPersonShowModal(true)}>
                    <img src={switchPerson} alt="person" className="switch-icon me-2" />
                    Switch Person
                  </Button>
                </div>
              ) : null}
            </div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              {formatedData[personIndex]?.category[pageIndex]?.page.map((main_section, main_index) => (
                <>
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
                                            (inputField, fieldIndex) => (

                                              <>
                                                {inputField.dtype === 'textbox' || inputField.dtype === 'textarea' ? (
                                                  <>
                                                    <Form.Control
                                                      type='text'
                                                      value={inputField.answer_value}
                                                     disabled={inputField?.is_disabled || !inner_section.is_enable || (inner_section.is_enable ===true && userRole()?.role == 'data_reviewer'?false:true)}
                                                      required={inner_section.is_enable}
                                                      onChange={(e) =>
                                                        answerValuehandleChange(
                                                          e,
                                                          personIndex,
                                                          pageIndex,
                                                          main_index,
                                                          section_index,
                                                          index,
                                                          fieldIndex,
                                                          inputField.dtype
                                                        )
                                                      }
                                                      className="mb-3 main-form-input"
                                                    />
                                                  </>

                                                ) : inputField.dtype === 'selectbox' ? (
                                                  <>
                                                    <Form.Select className="mb-3 main-form-input"
                                                      aria-label="Default select example"
                                                      value={inputField.answer_value}
                                                      onChange={(e) =>
                                                        answerValuehandleChange(
                                                          e,
                                                          personIndex,
                                                          pageIndex,
                                                          main_index,
                                                          section_index,
                                                          index,
                                                          fieldIndex,
                                                          inputField.dtype
                                                        )
                                                      }
                                                     disabled={inputField?.is_disabled || !inner_section.is_enable || (inner_section.is_enable ===true && userRole()?.role == 'data_reviewer'?false:true)}
                                                      required={inner_section.is_enable}
                                                    >
                                                      {inputField.answer_value === null ? (
                                                        <>
                                                          <option value=''>{inputField.placeholder}</option>
                                                        </>
                                                      ) : null}

                                                      {inputField.options?.map((value) => (
                                                        <>
                                                          <option value={value}>{value}</option>
                                                        </>
                                                      ))}

                                                    </Form.Select>

                                                    {((inputField?.answer_value === 'Others' || inputField?.answer_value === 'Non-Filipino' || inputField?.answer_value === 'Yes') && questions?.answers[fieldIndex + 1]?.dtype === "other_textbox") ? (
                                                      <Form.Control
                                                        type="text"
                                                        value={
                                                          inner_section.is_enable ? questions?.answers[fieldIndex + 1]?.answer_value : inputField.placeholder
                                                        }
                                                        required={inner_section.is_enable}
                                                       disabled={inputField?.is_disabled || !inner_section.is_enable || (inner_section.is_enable ===true && userRole()?.role == 'data_reviewer'?false:true)}
                                                        className="mb-3 main-form-input"
                                                        onChange={(e) =>
                                                          answerValuehandleChange(
                                                            e,
                                                            personIndex,
                                                            pageIndex,
                                                            main_index,
                                                            section_index,
                                                            index,
                                                            fieldIndex + 1,
                                                            inputField.dtype
                                                          )
                                                        }
                                                      />
                                                    ) : ''}
                                                  </>
                                                ) : inputField.dtype === 'age_picker' ? (
                                                  <div className="position-relative mb-3 calendar_icon">

                                                    <DatePicker
                                                      ref={focusDate}
                                                      className="datepicker-add-barangay form-control"
                                                      selected={inputField.answer_value ? inputField.answer_value : null}
                                                      name="dob"
                                                      dateFormat="dd-MM-yyyy"
                                                      dropdownMode="select"
                                                     disabled={!inner_section.is_enable || (inner_section.is_enable ===true && userRole()?.role == 'data_reviewer'?false:true)}
                                                      showMonthDropdown
                                                      showYearDropdown
                                                      maxDate={new Date()}
                                                      // inputFormat="yyyy-MM-dd"
                                                      // dateFormat="yyyy-MM-dd"
                                                      onChange={(e) => handleAgeChange(
                                                        e,
                                                        personIndex,
                                                        pageIndex,
                                                        main_index,
                                                        section_index,
                                                        index,
                                                        fieldIndex,
                                                        inputField.dtype)}
                                                      calendarIcon={true}
                                                      closeCalendar={true}
                                                      clearIcon={true}
                                                    />
                                                  </div>
                                                ) : inputField.dtype === 'multiselectbox' ? (
                                                  <div className="mb-3">
                                                    <Select
                                                      // defaultValue={inputField.allAnswer?.length > 0? inputField.allAnswer:[]}
                                                      value={inputField?.allAnswer?.length > 0 ? inputField?.allAnswer : []}
                                                      isMulti
                                                      closeMenuOnSelect={false}
                                                      hideSelectedOptions={false}
                                                     disabled={!inner_section.is_enable || (inner_section.is_enable ===true && userRole()?.role == 'data_reviewer'?false:true)}
                                                      onChange={(e) => answerMultiselectHandleChange(e, personIndex, pageIndex,
                                                        main_index,
                                                        section_index,
                                                        index,
                                                        fieldIndex)
                                                      }
                                                      // onChange={(options) => {
                                                      //   if (Array.isArray(options)) {
                                                      //     answerMultiselectHandleChange(options.map((opt) => opt.value), pageIndex,
                                                      //         main_index,
                                                      //         section_index,
                                                      //         index,
                                                      //         fieldIndex) 
                                                      //   }
                                                      // }}
                                                      options={inputField?.allOption}
                                                      components={{
                                                        Option: InputOption
                                                      }}
                                                      placeholder={inputField.placeholder}
                                                    />
                                                    {((inputField?.allAnswer?.length > 0 && inputField?.allAnswer[0]?.value === 'Others') && questions?.answers[fieldIndex + 1]?.dtype === "other_textbox") ? (
                                                      <Form.Control
                                                        type="text"
                                                        value={
                                                          inner_section.is_enable ? questions?.answers[fieldIndex + 1]?.answer_value : inputField.placeholder
                                                        }
                                                       disabled={!inner_section.is_enable || (inner_section.is_enable ===true && userRole()?.role == 'data_reviewer'?false:true)}
                                                        required={inner_section.is_enable}
                                                        className="mb-3 main-form-input"
                                                        onChange={(e) =>
                                                          answerValuehandleChange(
                                                            e,
                                                            personIndex,
                                                            pageIndex,
                                                            main_index,
                                                            section_index,
                                                            index,
                                                            fieldIndex + 1,
                                                            inputField.dtype
                                                          )
                                                        }
                                                      />
                                                    ) : ''}
                                                  </div>
                                                ) : ''}

                                                {inputField.dtype === 'datepicker' ? (
                                                  <>
                                                    <div className="position-relative mb-3 calendar_icon">

                                                      <DatePicker
                                                        ref={focusDate}
                                                        className="datepicker-add-barangay form-control"
                                                        selected={inputField.answer_value ? inputField.answer_value : null}
                                                        name="dob"
                                                        dateFormat="dd-MM-yyyy"
                                                        dropdownMode="select"
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        disabled={inputField?.is_disabled || !inner_section.is_enable || (inner_section.is_enable ===true && userRole()?.role == 'data_reviewer'?false:true)}
                                                        maxDate={new Date()}
                                                        // inputFormat="yyyy-MM-dd"
                                                        // dateFormat="yyyy-MM-dd"
                                                        onChange={(e) => handleDateChange(
                                                          e,
                                                          personIndex,
                                                          pageIndex,
                                                          main_index,
                                                          section_index,
                                                          index,
                                                          fieldIndex,
                                                          inputField.dtype)}
                                                        calendarIcon={true}
                                                        closeCalendar={true}
                                                        clearIcon={true}
                                                      />
                                                    </div>
                                                  </>
                                                ) : null}

                                              </>

                                            )
                                          )}
                                          {
                                            inner_section.is_enable ? (
                                              <>
                                                <Form.Check
                                                  inline
                                                  label="Incorrect"
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
                                                      personIndex,
                                                      pageIndex,
                                                      main_index,
                                                      section_index,
                                                      index,
                                                      "rejected"
                                                    )
                                                  }
                                                />
                                                <Form.Check
                                                  inline
                                                  label="Correct"
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
                                                      personIndex,
                                                      pageIndex,
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
                                                        personIndex,
                                                        pageIndex,
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

                </>
              ))}
              <div className="row">
                <div className="col-md-12 text-end">
                  <Button
                    type="button"
                    className="btn-secondary button-width me-2"
                    onClick={() => gotoPreviousInnerStep()}

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

          {viewNotesShowModal && (<ViewNotesModal show={viewNotesShowModal} images={surveyData?.ocr_images} onClose={() => setViewNotesShowModal(false)} />)}

        </div>
      )}
      {loading && <Loader />}
    </>
  );
};

export default MemberQuestions;
