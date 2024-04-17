import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { FiInfo } from "react-icons/fi";

import { LIST_ALL, getData, postData, putData, userRole } from "../../api";
import { emailRegx, onlyCharacter, requiredField } from "../../api/regex";
import Button from "../../components/Form/Button";
import FormModal from "../../components/FormModal";

const Add = ({ show, onClose, header, selectedRow, is_edit }) => {
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [barangayList, setbarangayList] = useState([]);
  const [dataReviewerList, setdataReviewerList] = useState([]);
  const [errorObject, setErrorObject] = useState({});
  const [formInputs, setFormInputs] = useState({
    email: "",
    first_name: "",
    barangay_id: "",
    data_reviewer_id: "",
    profile: {
      address: "",
      dob: "",
      official_number: "",
      phone_no: "",
      gender: "",
    },
  });
  const [barangayValue, setBarangayValue] = useState();
  const [dataReviewerValue, setDataReviewerValue] = useState();

  const focusDate = useRef(null);

  const handleFocusDate = () => {
    const datepickerElement = focusDate.current;
    datepickerElement.setFocus(true);
  };

  const handleInput = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleProfile = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    delete errorObject[name];
    setFormInputs((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [name]: value,
      },
    }));
  };

  useEffect(() => {
  // get data reviewer list function
    const getDataReviewerNamelist = async (id) => {
      setdataReviewerList([]);
      let url = "data-reviewer-name-list/" + id + '/';
      if (userRole().role === 'superadmin') {
        url = "data-reviewer-name-list/" + LIST_ALL + "/";
      }
      const res = await getData(url, {});
      if (res.status === 1) {
        setdataReviewerList(formatSelectOptions(res.data));
      }
    };

    // get barangay list function
    const getBarangayNamelist = async () => {
      setbarangayList([]);
      let res = await getData("barangay-name-List/", {});
      if (res.status === 1) {
        setbarangayList(formatSelectOptions(res.data));
      } 
    };

    const getSelectionBarangay = (obj) => {
      let data = Array(obj)
      let finalArr = [];
      if (data && data.length > 0) {
        let counter = 0;
        data.forEach((item) => {
          finalArr.push({
            value: item.id ? item.id : counter++,
            label: item.first_name ? item.first_name : '',
            name: item.first_name ? item.first_name : '',
          });
        });
      }
      setBarangayValue(finalArr);
    };

    const getSelectionReviewer = (obj) => {
      let data = Array(obj)
      let finalArr = [];
      if (data && data.length > 0) {
        let counter = 0;
        data.forEach((item) => {
          finalArr.push({
            value: item.id ? item.id : counter++,
            label: item.first_name ? item.first_name : '',
            name: item.first_name ? item.first_name : '',
          });
        });
      }
      setDataReviewerValue(finalArr)
    };

    getBarangayNamelist();
    
    if (header === "Edit Data Collector Details") {
      selectedRow.profile.dob = moment(selectedRow.profile.dob).toDate();
      getSelectionBarangay(selectedRow.barangay)
      getSelectionReviewer(selectedRow.data_reviewer)
      setFormInputs(selectedRow);
    }

    if (formInputs.barangay_id) {
      getDataReviewerNamelist(formInputs.barangay_id);
    }
  }, [
    header,
    selectedRow,
    formInputs.barangay_id,
    ]
  );

  // Form validation function
  const checkValidate = (formInputs) => {
    let errors = {}
    let data = ["first_name", "email", "barangay_id", "data_reviewer_id", "address"]
    data.foreach(item => {
      if (formInputs[item] === "") {
        errors[item] = requiredField;
      }
    });
    if (!formInputs.email.match(emailRegx)) {
      errors.email = "You have entered a invalid e-mail address";
    }
    if (!onlyCharacter.test(formInputs.first_name)) {
      errors.first_name = requiredField;
    }
    if (formInputs.profile.official_number === "") {
      errors.official_number = requiredField;
    }
    else if (formInputs.profile.official_number.match(/^\s*$/)) {
      errors.official_number = 'Official number accepts only characters and numbers'
    }
    if (formInputs.profile.phone_no === null || formInputs.profile.phone_no === "") {
      errors.phone_no = requiredField;
    }
    else if (formInputs.profile.phone_no.length < 10) {
      errors.phone_no = "Please provide a valid mobile number";
    }
    if (formInputs.profile.dob === "") {
      errors.dob = requiredField;
    }
    return errors;
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    let errors = checkValidate(formInputs);
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setErrorObject(errors)
    }
    setValidated(true);
    if (form.checkValidity() === true) {
      if (Object.keys(errors).length === 0) {
        addNewDataCollector();
      }
      else {
        setErrorObject(errors)
      }
    }
  };

  const addNewDataCollector = async () => {
    setLoading(true);
    const AddObject = structuredClone(formInputs);
    AddObject.profile.dob = moment(AddObject.profile.dob).format("YYYY-MM-DD");
    if (header === 'Edit Data Collector Details') {
      const res = await putData("data-collector-update/" + AddObject.id + "/", {}, AddObject);
      if (res && res.status === 1) {
        setLoading(false);
        onClose();
        toast.success(res.message, { theme: "colored" });
      }
      else {
        setLoading(false);
        toast.error(res.message, { theme: "colored" });
      }
    }
    else {
      const res = await postData("create-data-collector/", {}, AddObject);
      if (res && res.status === 1) {
        setLoading(false);
        onClose();
        toast.success(res.message, { theme: "colored" });
      }
      else {
        setLoading(false);
        toast.error(res.message, { theme: "colored" });
      }
    }

  };

  const handleDateChange = (date) => {
    delete errorObject["dob"]
    setFormInputs((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        dob: date,
      },
    }));
  };

  const formatSelectOptions = (data) => {
    let finalArr = [];
    if (data && data.length > 0) {
      var counter = 0;
      data.forEach((item) => {
        finalArr.push({
          value: item.id ? item.id : counter++,
          label: item.first_name ? item.first_name : '',
          name: item.first_name ? item.first_name : '',
        });
      });
    }
    return finalArr;
  };

  const handleBarangayOnChange = (data) => {
    setBarangayValue(data)
    setFormInputs((prev) => ({
      ...prev,
      barangay_id: data.value,
      data_reviewer_id: ''
    }));
    getOfficialNumber(data.value)
    // empty the data reviewer
    setDataReviewerValue('')
  }

  const handleReviewerOnChange = (data) => {
    setDataReviewerValue(data)
    setFormInputs((prev) => ({
      ...prev,
      data_reviewer_id: data.value
    }));
  }

  const getOfficialNumber=async(barangay_id)=>{
    const data={
    "municipality":'',
    "location":'',
    "role":'data_collector',
    "barangay":barangay_id
    }
    const response = await postData("get-official-id/", {}, data);
    if(response && response.status ===1){
      setFormInputs((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          official_number: response.offcial_id,
        },
      }));
      delete errorObject['official_number'];
    }
    else{
      toast.error(response.message, { theme: "colored" });
    }
  }

  return (
    <div>
      <FormModal heading={header} show={show} onClose={onClose} size="lg">
        <Form noValidate validated={validated} onSubmit={handleSubmit} autoComplete="off">
          <div className="row">
            <div className="col-md-12">
              <Form.Group as={Row} className="mb-3" >
                <Form.Label column sm={4} className="required">Data collector name</Form.Label>
                <Col column="sm" sm={8}>
                  <Form.Control
                    type="text"
                    name="first_name"
                    required
                    value={formInputs.first_name}
                    onChange={handleInput}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorObject?.first_name}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" >
                <Form.Label column sm={4} className="required">Date of birth</Form.Label>
                <Col column="sm" sm={8} className="position-relative">
                  <DatePicker
                    ref={focusDate}
                    className="datepicker-add-barangay form-control"
                    selected={formInputs.profile.dob}
                    onChange={handleDateChange}
                    name="dob"
                    dateFormat="MM-dd-yyyy"
                    dropdownMode="select"
                    showMonthDropdown
                    showYearDropdown
                    minDate={moment().subtract(60, "years")._d}
                    maxDate={moment().subtract(18, "years")._d}
                    calendarIcon={true}
                    closeCalendar={true}
                    clearIcon={true}
                  />
                  <span className="calendar-icon" onClick={handleFocusDate}></span>
                  <p className="invalid-msg mb-0">{errorObject?.dob}</p>
                  <Form.Control.Feedback type="invalid">
                    {errorObject?.dob}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" >
                <Form.Label column sm={4} className="required">Sex at birth</Form.Label>
                <Col column="sm" sm={8}>
                  <Form.Select
                    onChange={handleProfile}
                    name="gender"
                    value={formInputs.profile.gender}
                    required>
                    <option value=''>Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    This Field is Required
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" >
                <Form.Label column sm={4} className="required">Mobile number</Form.Label>
                <Col column="sm" sm={8}>
                  <InputGroup className="phone-group">
                    <InputGroup.Text>
                      +63
                    </InputGroup.Text>
                    <Form.Control type="number"
                      value={formInputs.profile.phone_no}
                      name="phone_no"
                      required
                      isInvalid={!!errorObject.phone_no}
                      onChange={(e) => {
                        handleProfile(e, e.target.value, "phone_no")
                      }} />
                    <Form.Control.Feedback type="invalid">
                      {errorObject.phone_no ? errorObject.phone_no : requiredField}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" >
                <Form.Label column sm={4} className="required">Email ID</Form.Label>
                <Col column="sm" sm={8}>
                  <Form.Control type="text"
                    name="email"
                    value={formInputs.email}
                    isInvalid={!!errorObject.email}
                    required
                    onChange={handleInput} />
                  <Form.Control.Feedback type="invalid">
                    {errorObject?.email}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" >
                <Form.Label column sm={4} className="required">Address</Form.Label>
                <Col column="sm" sm={8}>
                  <Form.Control as="textarea"
                    name="address"
                    required
                    value={formInputs.profile.address}
                    onChange={handleProfile} />
                  <Form.Control.Feedback type="invalid">
                    This Field is Required
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" >
                <Form.Label column sm={4} className="required">Assign barangay official</Form.Label>
                <Col column="sm" sm={8}>
                  <Select
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    options={barangayList}
                    onChange={(selectedOption) => handleBarangayOnChange(selectedOption)}
                    value={barangayValue}
                    placeholder="Select "
                    isDisabled={(is_edit && (userRole().role !== 'superadmin'))}
                  />
                  {
                    validated && formInputs?.barangay_id === '' &&
                    <div className="err-feedback"> {requiredField}</div>
                  }
                  <div className="barangay-info">
                    <div> <FiInfo className="me-1" />
                      You can access a data reviewer list only after selecting the barangay official
                    </div>
                  </div>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" >
                <Form.Label column sm={4} className="required"> Assign data reviewer</Form.Label>
                <Col column="sm" sm={8}>
                  <Select
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    options={dataReviewerList}
                    onChange={(selectedOption) => handleReviewerOnChange(selectedOption)}
                    value={dataReviewerValue}
                    placeholder="Select "
                    isDisabled={formInputs.barangay_id ? false : true}
                  />
                  {
                    validated && formInputs?.data_reviewer_id === '' &&
                    <div className="err-feedback"> {errorObject?.data_reviewer_id}</div>
                  }
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" >
                <Form.Label column sm={4} className="required">DC code</Form.Label>
                <Col column="sm" sm={8}>
                  <Form.Control type="text"
                    name="official_number"
                    required
                    value={formInputs.profile.official_number}
                    onChange={handleProfile} 
                    readOnly/>
                  <Form.Control.Feedback type="invalid">
                    {errorObject?.official_number}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 text-end">
              <Button
                type="button"
                onClick={onClose}
                className="btn-secondary button-width me-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                className="btn-primary button-width text-white"
              >
                {header === "Edit Data Collector Details" ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </Form>
      </FormModal>
    </div>
  );
};

export default Add;
