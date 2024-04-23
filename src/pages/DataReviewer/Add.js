import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InputGroup from 'react-bootstrap/InputGroup';
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../components/Form/Button";
import FormModal from "../../components/FormModal";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { getData, postData, putData, userRole } from "../../api";
import { emailRegx, onlyCharacter, requiredField } from "../../api/regex";

const Add = ({ show, onClose, header, selectedRow, is_edit }) => {
  const [loading, setLoading] = useState(false);
  const [formInputs, setFormInputs] = useState({
    email: "",
    first_name: "",
    barangay_id: "",
    profile: {
      address: "",
      dob: "",
      official_number: "",
      phone_no: "",
      gender: "",
    },
  });

  const [validated, setValidated] = useState(false);
  const [barangayList, setBarangayList] = useState([]);
  const [errorObject, setErrorObject] = useState({});
  const [barangayValue, setBarangayValue] = useState();

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

  const handleProfile = (e, val, nam) => {
    const value = e.target.value;
    const name = e.target.name;
    delete errorObject[name]
    setFormInputs((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [name]: value,
      },
    }));
    if (nam === "phone_no") {
      setFormInputs((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          nam: val,
        },
      }));
    }
  };

  useEffect(() => {
    const getBarangayList = async (id) => {
      const getBarangay = await getData(`barangay-name-List/`, {});
      if (getBarangay.status) {
        setBarangayList(getBarangay.data);
      } else {
        setBarangayList([]);
      }
    };

    getBarangayList();
    if (header === "Edit Data Reviewer Details") {
      selectedRow.profile.dob = moment(selectedRow.profile.dob).toDate();
      getSelection(selectedRow.barangay)
      setFormInputs(selectedRow);
    }
  }, [header, selectedRow]);

  const getSelection = (obj) => {
    let data = Array(obj)
    let finalArr = [];
    if (data && data?.length > 0) {
      data?.forEach((item) => {
        finalArr.push({
          value: item?.id ? item.id :'',
          label: item?.first_name ? item.first_name : '',
          name: item?.first_name ? item.first_name : '',
        });
      });
    }
    setBarangayValue(finalArr)
  }
  const checkValidate = (formInputs) => {
    let errors = {}
    let data = ["first_name", "dob", "city", "municipality", "location", "email", "address",'barangay_id']
    data.forEach(item => {
      if (formInputs[item] === "") {
          errors[item] = requiredField
        }
    })
    if (!formInputs.email.match(emailRegx)) {
      errors.email = "You have entered a invalid e-mail address";
    }
    if (!onlyCharacter.test(formInputs.first_name)) {
      errors.first_name = 'Please enter alpha char';
    }
    if (formInputs.profile.official_number === "") {
      errors.official_number = requiredField
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
    if (formInputs.profile.dob === "" || formInputs.profile.dob === null) {
      errors.dob = requiredField;
    }
    return errors
  }

  // new
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
        addNewDataReviewer();
      }
      else {
        setErrorObject(errors)
      }
    }
  };

  const addNewDataReviewer = async () => {
    setLoading(true);
    const AddObject = structuredClone(formInputs);
    AddObject.profile.dob = moment(AddObject.profile.dob).format("YYYY-MM-DD");
    if (header === "Edit Data Reviewer Details") {
      const res = await putData("data-reviewer-update/" + AddObject.id + "/", {}, AddObject);
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
      const res = await postData("create-datareviewer/", {}, AddObject);
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

  const handleOnChange = (data) => {
    setBarangayValue(data)
    setFormInputs((prev) => ({
      ...prev,
      barangay_id: data.value
    }));
    getOfficialNumber(data.value)
  }
  const getOfficialNumber=async(barangay_id)=>{
    const data={
      "municipality":'',
    "location":'',
    "role":'data_reviewer',
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
    <FormModal heading={header} show={show} onClose={onClose} size="lg">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <div className="row add-barangay">
          <div className="col-md-12">
            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm={4} className="required">
                Data reviewer name
              </Form.Label>
              <Col column="sm" sm={8}>
                <Form.Control
                  type="text"
                  name="first_name"
                  required
                  value={formInputs.first_name}
                  onChange={handleInput}
                  isInvalid={!!errorObject.first_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errorObject.first_name ? errorObject.first_name : requiredField}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm={4} className="required">
                Date of birth
              </Form.Label>
              <Col column="sm" sm={8} className="position-relative">
                <DatePicker
                  ref={focusDate}
                  className="datepicker-add-barangay"
                  selected={formInputs.profile.dob}
                  onChange={handleDateChange}
                  name="dob"
                  dateFormat="dd-MM-yyyy"
                  dropdownMode="select"
                  showMonthDropdown
                  showYearDropdown
                  minDate={moment().subtract(60, "years")._d}
                  maxDate={moment().subtract(18, "years")._d}
                  // inputFormat="yyyy-MM-dd"
                  // dateFormat="yyyy-MM-dd"
                  calendarIcon={true}
                  closeCalendar={true}
                  clearIcon={true}
                />
                <span className="calendar-icon" onClick={handleFocusDate}></span>
                <p className="invalid-msg">{errorObject?.dob}</p>
                <Form.Control.Feedback type="invalid">
                  This field is required
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm={4} className="required">
                Sex at birth
              </Form.Label>
              <Col column="sm" sm={8}>
                {/* <Form.Control type="text" name="reset_code" 
                required   onChange={handleInput}/> */}
                <Form.Select
                  onChange={handleProfile}
                  name="gender"
                  value={formInputs.profile.gender}
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {requiredField}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm={4} className="required">
                Mobile number
              </Form.Label>
              <Col column="sm" sm={8}>
                <InputGroup className="phone-group">
                  <InputGroup.Text>
                    +63
                  </InputGroup.Text>
                  <Form.Control
                    type="number"
                    value={formInputs.profile.phone_no}
                    name="phone_no"
                    required
                    onChange={(e) => {
                      if (e.target.value.length > 10) {
                        return false
                      }
                      handleProfile(e, e.target.value, "phone_no")
                    }}
                    isInvalid={!!errorObject.phone_no}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorObject.phone_no ? errorObject.phone_no : requiredField}
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm={4} className="required">
                Email ID
              </Form.Label>
              <Col column="sm" sm={8}>
                <Form.Control
                  type="text"
                  name="email"
                  value={formInputs.email}
                  required
                  onChange={handleInput}
                  isInvalid={!!errorObject.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errorObject.email ? errorObject.email : requiredField}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm={4} className="required">
                Address
              </Form.Label>
              <Col column="sm" sm={8}>
                <Form.Control
                  as="textarea"
                  name="address"
                  required
                  value={formInputs.profile.address}
                  onChange={handleProfile}
                />
                <Form.Control.Feedback type="invalid">
                  {requiredField}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm={4} className="required">
                Assigned barangay
              </Form.Label>
              <Col column="sm" sm={8}>
                <Select
                  closeMenuOnSelect={true}
                  hideSelectedOptions={false}
                  options={formatSelectOptions(barangayList)}
                  onChange={(selectedOption) => handleOnChange(selectedOption)}
                  value={barangayValue}
                  placeholder="Select "
                  isDisabled={(is_edit && (userRole().role !== 'superadmin'))}
                />
                {
                  validated && formInputs?.barangay_id === '' &&
                  <div className="err-feedback">  {errorObject?.barangay_id}</div>
                }
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm={4} className="required">
                DR code
              </Form.Label>
              <Col column="sm" sm={8}>
                <Form.Control
                  type="text"
                  name="official_number"
                  required
                  value={formInputs.profile.official_number}
                  isInvalid={!!errorObject.official_number}
                  onChange={handleProfile}
                  readOnly
                />
                <Form.Control.Feedback type="invalid">
                  {errorObject.official_number ? errorObject.official_number : requiredField}

                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-end">
            <Button
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
              {header === "Edit Data Reviewer Details" ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </Form>
    </FormModal>
  );
};

export default Add;
