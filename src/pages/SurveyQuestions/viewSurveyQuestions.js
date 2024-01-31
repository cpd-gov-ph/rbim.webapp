import { useEffect, useState } from "react";
import { getData } from "../../api";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb/index";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Loader from "../../components/Loader";
import ViewSelectOptionsModal from './viewSelectOptionsModal'

const ViewSurveyQuestion = () => {
  let { id } = useParams();
  const [questionList, setQuestionList] = useState([]);
  const [viewSelectOptionsModal, setViewSelectOptionsModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState({});
  const [initLoading, setInitLoading] = useState(false);

  const formateQuestions=(data)=>{
    let copyQuestions =[...data];
    copyQuestions.forEach((section,section_index)=>{
      section.questions.forEach((question,index)=>{
        if(copyQuestions[section_index].questions[index].position === copyQuestions[section_index].questions[index+1]?.position){
          copyQuestions[section_index].questions[index].combine_position=true;
          copyQuestions[section_index].questions[index+1].combine_position=true;
        }
      })
    });
    setQuestionList(copyQuestions);
  }

  useEffect(() => {
    document.body.classList.add('adminSurveyQusView');
    getQuestionList();
  }, []);

  const getQuestionList = async () => {
    setInitLoading(true);
    const res = await getData("get-section-details/" + id + "/", {});
    if (res.status === 1) {
      //setQuestionList(res.data);
      formateQuestions(res.data);
      setInitLoading(false);
    }
  };

  const viewSelectOptions = (row) => {
    setSelectedQuestion(row)
    setViewSelectOptionsModal(true)
  }

  return (
    <>
      {!initLoading && (
        <div>
          <Breadcrumb icon={true} breadcrumb_lists={[{ heading: 'Survey Questions', link: '/survey-question' }, { heading: 'View Questions', link: '' }]} />
          <div className="mt-4 boxshadow">
            {questionList.map((section, index) => {
              return (
                <div className="question-wrapper" key={index}>
                  <div className='survey-view-heading'>
                    <h3>{section.category_name}</h3>
                    <h4>{section.section_name}</h4>
                  </div>
                  <div className="question-list p-4">
                    <Row>
                      {section?.questions?.map((question, index) => {
                        return (
                          <>
                            {question.combine_position ? (
                              <Col className="col-md-3" key={index}>
                                <Row>
                                  <Col className="col-md-12">
                                  <Form.Group className="mb-4">
                                  <Form.Label>{question.title}</Form.Label>
                                  {question?.answers?.map((inputField, index) => {
                                    return (
                                      <>
                                         <div>
                                        {inputField?.dtype === 'textbox' || inputField.dtype === "selectbox" || inputField.dtype === "datepicker" || inputField.dtype === "timepicker" ||  inputField?.dtype === 'age_picker' ||  inputField.dtype === 'multiselectbox'  ? (
                                          <Form.Control placeholder={inputField.placeholder} disabled />
                                        ) : ''}
                                        {
                                          inputField?.dtype === 'box_number' &&
                                          <div class="box-number-inputs d-flex flex-row">
                                            <Form.Control className="m-2 form-control rounded" maxlength="1" disabled />
                                            <Form.Control className="m-2 form-control rounded" maxlength="1" disabled />
                                            <Form.Control className="m-2 form-control rounded" maxlength="1" disabled />
                                            <Form.Control className="m-2 form-control rounded" maxlength="1" disabled />
                                            <Form.Control className="m-2 form-control rounded" maxlength="1" disabled />
                                            <Form.Control className="m-2 form-control rounded" maxlength="1" disabled />
                                          </div>

                                        }
                                        {
                                          inputField?.dtype === 'radio' &&
                                          <Form.Check
                                            type="radio"
                                            label={inputField.placeholder}
                                            disabled
                                          />
                                        }
                                        {
                                          inputField?.dtype === 'textarea' &&
                                          <Form.Control as="textarea" placeholder={inputField.placeholder} rows="4" disabled />
                                        }
                                       
                                      </div>
                                      {
                                        inputField.dtype === "selectbox" || inputField.dtype === 'multiselectbox' && <div className="survey-options"> Options:  <span onClick={() => viewSelectOptions(question)}> View </span> </div>
                                      }
                                      </>
                                    )
                                  })}
                                
                                  </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                            ):
                            <Col className="col-md-6" key={index}>
                            <Form.Group className="mb-4">
                              <Form.Label>{question.title}</Form.Label>
                              <div className="sur-questions">
                                {question?.answers?.map((inputField, index) => {
                                  return (
                                    <>
                                      <div>
                                        {inputField?.dtype === 'textbox' || inputField.dtype === "selectbox" || inputField.dtype === "datepicker" || inputField.dtype === "timepicker" ||  inputField?.dtype === 'age_picker' ||  inputField.dtype === 'multiselectbox'  ? (
                                          <Form.Control placeholder={inputField.placeholder} disabled />
                                        ) : ''}
                                        {
                                          inputField?.dtype === 'box_number' &&
                                          <div class="box-number-inputs d-flex flex-row">
                                            <Form.Control className="m-2 form-control rounded" maxlength="1" disabled />
                                            <Form.Control className="m-2 form-control rounded" maxlength="1" disabled />
                                            <Form.Control className="m-2 form-control rounded" maxlength="1" disabled />
                                            <Form.Control className="m-2 form-control rounded" maxlength="1" disabled />
                                            <Form.Control className="m-2 form-control rounded" maxlength="1" disabled />
                                            <Form.Control className="m-2 form-control rounded" maxlength="1" disabled />
                                          </div>

                                        }
                                        {
                                          inputField?.dtype === 'radio' &&
                                          <Form.Check
                                            type="radio"
                                            label={inputField.placeholder}
                                            disabled
                                          />
                                        }
                                        {
                                          inputField?.dtype === 'textarea' &&
                                          <Form.Control as="textarea" placeholder={inputField.placeholder} rows="4" disabled />
                                        }
                                       
                                      </div>
                                      {
                                        inputField.dtype === "selectbox" || inputField.dtype === 'multiselectbox' && <div className="survey-options"> Options:  <span onClick={() => viewSelectOptions(question)}> View </span> </div>
                                      }

                                    </>
                                  )
                                })}
                              </div>
                            </Form.Group>
                          </Col>
                            }
                          </>
                      
                        )
                      })}
                    </Row>
                  </div>
                </div>
              )
            })}
          </div>

          {viewSelectOptionsModal && <ViewSelectOptionsModal show={viewSelectOptionsModal} selectedQuestion={selectedQuestion} onClose={() => setViewSelectOptionsModal(false)} />}

        </div>
      )}
      {initLoading && <Loader />}
    </>
  );
};

export default ViewSurveyQuestion;
