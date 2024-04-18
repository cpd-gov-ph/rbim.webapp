import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InputGroup from 'react-bootstrap/InputGroup';
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { FiInfo } from "react-icons/fi";

import { getData, postData, putData, userRole } from "../../api";
import { emailRegx, onlyCharacter, requiredField } from "../../api/regex";
import Button from "../../components/Form/Button";
import FormModal from "../../components/FormModal";


const Add = ({ show, onClose, header, selectedRow, is_edit }) => {
  const [loading, setLoading] = useState(false);
  const [formInputs, setFormInputs] = useState({
    email: "",
    first_name: "",
    city: "",
    location: "",
    municipality: "",
    profile: {
      address: "",
      dob: "",
      official_number: "",
      phone_no: "",
      gender: "",
    },
  });
  const [validated, setValidated] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [errorObject, setErrorObject] = useState({});
  const [municipalityList, setMunicipalityList] = useState([]);

  const [cityValue, setCityValue] = useState();
  const [municipalityValue, setMunicipalityValue] = useState();
  const [locationValue, setLocationValue] = useState();

  const focusDate = useRef(null);

  const handleFocusDate = () => {
    const datepickerElement = focusDate.current;
    datepickerElement.setFocus(true);
  };

  const handleInput = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    delete errorObject[name]
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "city") {
      setFormInputs((prev) => ({
        ...prev,
        location: "",
        municipality: "",
      }));
    }
    if (name === "municipality") {
      setFormInputs((prev) => ({
        ...prev,
        location: "",
      }));
    }
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
    const getCityList = async () => {
      const getCity = await getData("city/", {});
      if (getCity) {
        setCityList(getCity);
      } else {
        setCityList([]);
      }
    };  

    getCityList();
    if (header === "Edit Barangay Official Details") {
      selectedRow.profile.dob = moment(selectedRow.profile.dob).toDate();
      getSelectionCity(selectedRow.city_info)
      getSelectionMunicipality(selectedRow.municipality_info)
      getSelectionLocation(selectedRow.location_info)
      setFormInputs(selectedRow);
    }
  }, [
    header,
    selectedRow
  ]);

  const getSelectionCity = (obj) => {
    let data = Array(obj)
    let finalArr = [];
    if (data && data.length > 0) {
      data.forEach((item) => {
        finalArr.push({
          value: item?.id,
          label: item?.name,
          name: item?.code,
        });
      });
    }
    setCityValue(finalArr)
  }

  const getSelectionMunicipality = (obj) => {
    let data = Array(obj)
    let finalArr = [];
    if (data && data.length > 0) {
      data.forEach((item) => {
        finalArr.push({
          value: item?.id,
          label: item?.name,
          name: item?.code,
        });
      });
    }
    setMunicipalityValue(finalArr)
  }

  const getSelectionLocation = (obj) => {
    let data = Array(obj)
    let finalArr = [];
    if (data && data.length > 0) {
      data.forEach((item) => {
        finalArr.push({
          value: item?.id,
          label: item?.name,
          name: item?.code,
        });
      });
    }
    setLocationValue(finalArr)
  }

  const checkValidate = (formInputs) => {
    let errors = {}
    let data = ["first_name", "dob", "city", "municipality", "location", "email", "address"]
    data.map((item, index) => {
      if (formInputs[item] === "") {
        errors[item] = requiredField
      }
    })
    if (formInputs.email === "") {
      errors.email = requiredField;
    }
    else if (!formInputs.email.match(emailRegx)) {
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

  useEffect(() => {
    const getMunicipalityList = async (id) => {
      const getMunicipality = await getData(`city-to-municipality/${id}/`, {});
      if (getMunicipality.status) {
        setMunicipalityList(getMunicipality.data);
      } else {
        setMunicipalityList([]);
      }
    };

    if (formInputs.city) {
      getMunicipalityList(formInputs.city);
    }

  }, [formInputs.city]);

  useEffect(() => {
    const getLocationList = async (id) => {
      const getLocation = await getData(`municipality-to-locations/${id}/`, {});
      if (getLocation.status) {
        setLocationList(getLocation.data);
      } else {
        setLocationList([]);
      }
    };

    if (formInputs.municipality) {
      getLocationList(formInputs.municipality);
    }
  }, [formInputs.municipality]);

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
        addNewBarangay();
      }
      else {
        setErrorObject(errors)
      }
    }
  };

  const addNewBarangay = async () => {
    setLoading(true);
    const AddObject = structuredClone(formInputs);
    AddObject.profile.dob = moment(AddObject.profile.dob).format("YYYY-MM-DD");
    if (header === "Edit Barangay Official Details") {
      const res = await putData("barangay-update/" + AddObject.id + "/", {}, AddObject);
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
      const res = await postData("create-barangay/", {}, AddObject);
      setLoading(true);
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

  const updateBarangay = async () => {
    setLoading(true);
    const AddObject = structuredClone(formInputs);
    AddObject.profile.dob = moment(AddObject.profile.dob).format("YYYY-MM-DD");
    const updateBarangay = await putData(`barangay-update/${AddObject.id}/`, {}, AddObject);
    if (updateBarangay && updateBarangay.status === 1) {
      toast.success(updateBarangay.message, { theme: "colored" });
      setLoading(false);
      onClose();
    } else {
      setLoading(false);
      toast.error(updateBarangay.message, { theme: "colored" });
    }
  }

  const addBarangay = async () => {
    setLoading(true);
    const AddObject = structuredClone(formInputs);
    AddObject.profile.dob = moment(AddObject.profile.dob).format("YYYY-MM-DD");
    const postBarangay = await postData("create-barangay/", {}, AddObject);
    if (postBarangay && postBarangay.status === 1) {
      toast.success(postBarangay.message, { theme: "colored" });
      setLoading(false);
      onClose();
    } else {
      setLoading(false);
      toast.error(postBarangay.message, { theme: "colored" });
    }
  };

  const handleDateChange = (date) => {
    // setDate(date);
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
      data.forEach((item) => {
        finalArr.push({
          value: item.id ? item.id : item.id,
          label: item.name ? item.name : item.name,
          name: item.name ? item.name : item.name,
        });
      });
    }
    return finalArr;
  };

  const handleCityOnChange = (data) => {
    setCityValue(data)
    setFormInputs((prev) => ({
      ...prev,
      city: data.value,
      municipality: '',
      location: ''
    }));

    setMunicipalityValue('')
    setLocationValue('')
  }

  const handleMunicipalityOnChange = (data) => {
    setMunicipalityValue(data)
    setFormInputs((prev) => ({
      ...prev,
      municipality: data.value,
      location: ''
    }));
    setLocationValue('')
  }

  const handleLocationOnChange = (data) => {
    setLocationValue(data)
    setFormInputs((prev) => ({
      ...prev,
      location: data.value,
    }));
    getOfficialNumber(data.name)
  }
  const getOfficialNumber=async(locationName)=>{
    const data={
      "municipality":municipalityValue.name,
    "location":locationName,
    "role":'barangay'
    }
    const response = await postData("get-official-id/", {}, data);
    if(response && response.status === 1){
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
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <div className="row add-barangay">
            <div className="col-md-12">
              <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                <Form.Label column sm={5} className="required">
                  Barangay official name
                </Form.Label>
                <Col column="sm" sm={7}>
                  <Form.Control
                    type="text"
                    name="first_name"
                    required
                    value={formInputs.first_name}
                    isInvalid={!!errorObject.first_name}
                    onChange={handleInput}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorObject?.first_name ? errorObject?.first_name : requiredField}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                <Form.Label column sm={5} className="required">
                  Date of birth
                </Form.Label>
                <Col column="sm" sm={7} className="position-relative">
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
                    minDate={moment().subtract(150, "years")._d}
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
                    {errorObject.dob}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                <Form.Label column sm={5} className="required">
                  Sex at birth
                </Form.Label>
                <Col column="sm" sm={7}>
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
                <Form.Label column sm={5} className="required">
                  Mobile number
                </Form.Label>
                <Col column="sm" sm={7}>
                  <InputGroup className="phone-group">
                    <InputGroup.Text>
                      +63
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      value={formInputs.profile.phone_no}
                      name="phone_no"
                      required
                      isInvalid={!!errorObject.phone_no}
                      onChange={(e) => {
                        if (e.target.value.length > 10) {
                          // errorObject.phoneNumber = "You are trying enter more than 10 numbers"
                          return false
                        }
                        handleProfile(e, e.target.value, "phone_no")
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errorObject.phone_no ? errorObject.phone_no : requiredField}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                <Form.Label column sm={5} className="required">
                  Email ID
                </Form.Label>
                <Col column="sm" sm={7}>
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
                <Form.Label column sm={5} className="required">
                  Assigned province
                </Form.Label>
                <Col column="sm" sm={7}>
                  <Select
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    options={formatSelectOptions(cityList)}
                    onChange={(selectedOption) => handleCityOnChange(selectedOption)}
                    value={cityValue}
                    placeholder="Select "
                    isDisabled={(is_edit && (userRole().role !== 'superadmin'))}
                  />
                  {
                    validated && formInputs?.city === '' &&
                    <div className="err-feedback"> {requiredField}</div>
                  }

                  {/* <Form.Select
                      onChange={handleInput}
                      value={formInputs.city}
                      required
                      name="city"
                    >
                      <option value="">Select</option>
                      {cityList.map((item, index) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {requiredField}
                    </Form.Control.Feedback> */}
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                <Form.Label column sm={5} className="required">
                  Assigned city/municipality
                </Form.Label>
                <Col column="sm" sm={7}>

                  <Select
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    options={formatSelectOptions(municipalityList)}
                    onChange={(selectedOption) => handleMunicipalityOnChange(selectedOption)}
                    value={municipalityValue}
                    placeholder="Select "
                    isDisabled={(formInputs.city && !is_edit) || (userRole().role === 'superadmin') ? false : true}
                  />
                  {
                    validated && formInputs?.municipality === '' &&
                    <div className="err-feedback"> {requiredField}</div>
                  }

                  {/* <Form.Select
                      onChange={handleInput}
                      value={formInputs.municipality}
                      required
                      name="municipality"
                      disabled={formInputs.city ? false : true}
                    >
                      <option value="">Select</option>
                      {municipalityList.map((item, index) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {requiredField}
                    </Form.Control.Feedback> */}
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                <Form.Label column sm={5} className="required">
                  Assigned barangay
                </Form.Label>
                <Col column="sm" sm={7}>
                  <Select
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    options={formatSelectOptions(locationList)}
                    onChange={(selectedOption) => handleLocationOnChange(selectedOption)}
                    value={locationValue}
                    placeholder="Select "
                    isDisabled={(formInputs.municipality && !is_edit) || (userRole().role === 'superadmin') ? false : true}
                  />
                  {
                    validated && formInputs?.location === '' &&
                    <div className="err-feedback"> {requiredField}</div>
                  }

                  {/* 
                    <Form.Select
                      onChange={handleInput}
                      disabled={formInputs.municipality ? false : true}
                      name="location"
                      value={formInputs.location}
                      required
                    >
                      <option value="">Select</option>
                      {locationList?.map((item, index) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {requiredField}
                    </Form.Control.Feedback> */}
                  <div className="barangay-info">
                    <div> <FiInfo className="me-1" /> You can access a barangay official list only after selecting the city</div>
                  </div>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                <Form.Label column sm={5} className="required">
                  BO code
                </Form.Label>
                <Col column="sm" sm={7}>
                  <Form.Control
                    type="text"
                    name="official_number"
                    required
                    value={formInputs.profile.official_number}
                    onChange={handleProfile}
                    isInvalid={!!errorObject.official_number}
                    readOnly={true}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorObject.official_number ? errorObject.official_number : requiredField}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                <Form.Label column sm={5} className="required">
                  Barangay hall complete address
                </Form.Label>
                <Col column="sm" sm={7}>
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
                {header === "Edit Barangay Official Details" ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </Form>
      </FormModal>
    </div>
  );
};

export default Add;
