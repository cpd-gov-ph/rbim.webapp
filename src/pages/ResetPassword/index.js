import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import InputGroup from 'react-bootstrap/InputGroup';
import tick from '../../assets/images/tick2.png';
import "./style.scss";
import logo from "../../assets/images/logo.png";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { postData } from "../../api";
import { toast } from "react-toastify";
import { mustLowerCaseLetters, mustNumbers, mustSpecialCharacterCheck, mustUpperCaseLetters } from "../../api/regex";
const ResetPassword = () => {
  let navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newPasswordShown, setNewPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [errorObject, setErrorObject] = useState({});
  const [resetObject, setResetObject] = useState({
    email: localStorage.getItem("forgotEmail"),
    reset_code: +localStorage.getItem("reset_code"),
    new_password: "",
    reenter_password: "",
  });
  // toggle new password function
  const toggleNewPasswordVisiblity = () => {
    setNewPasswordShown(newPasswordShown ? false : true);
  };
  // toggle confirm password function
  const toggleConfirmPasswordVisiblity = () => {
    setConfirmPasswordShown(confirmPasswordShown ? false : true);
  };
  const handleInput = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    delete errorObject[name]
    setResetObject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const checkValidate = () => {
    let errors = {};

    let requiredField = "This Field is Required";

    if (resetObject.new_password === "") {
      errors.new_password = "This field is required";
    } else {
      if (
        resetObject.new_password !== "" &&
        !mustSpecialCharacterCheck.test(resetObject.new_password)
        // resetObject.new_password?.matches(".*[!@#$%^&*()_'\"+={};:<>,.?/-].*")
      ) {
        errors.new_password = "This Password must contain special characters";
      } else if (
        resetObject.new_password !== "" &&
        !mustLowerCaseLetters.test(resetObject.new_password)
      ) {
        errors.new_password =
          "This Password Must Contain Atleast One Lower Characters";
      } else if (
        resetObject.new_password !== "" &&
        !mustNumbers.test(resetObject.new_password)
      ) {
        errors.new_password = "This Password Must Contain Atleast One Number";
      } else if (
        resetObject.new_password !== "" &&
        !mustUpperCaseLetters.test(resetObject.new_password)
      ) {
        errors.new_password =
          "This Password Must Contain Atleast One Upper Characters";
      } else if (resetObject.new_password.length < 8) {
        errors.new_password = "This Password Must be atleast 8 characters long";
      }
    }
    if (resetObject.reenter_password === "") {
      errors.reenter_password = `Password field is required`;
    } else if (resetObject.reenter_password.trim() !== resetObject.new_password.trim()) {
      errors.reenter_password = `Password must be same match`;
    }
    return errors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      let errors = checkValidate();
      setErrorObject(errors);
    }
    if (form.checkValidity() === true) {
      let errors = checkValidate();

      if (Object.keys(errors).length === 0) {
        resetUserPassword();
      } else {
        setErrorObject(errors);
      }
    }
  };
  const resetUserPassword = async () => {
    setLoading(true);
    let obj = {
      email: resetObject.email,
      reset_code: resetObject.reset_code,
      new_password: resetObject.new_password.trim(),
      reenter_password: resetObject.reenter_password.trim()
    }
    const res = await postData("reset-password/", {}, obj);
    if (res.status === 1) {
      // toast.success(res.message, { theme: "colored" });
      localStorage.clear();
      setLoading(false);
      setSuccess(true);
      //navigate("/login");
    } else {
      setLoading(false);
      toast.error(res.message, { theme: "colored" });
    }
  };
  useEffect(() => {
    console.log(errorObject, "err");
  }, [errorObject]);

  return (
    <section className="login-section">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-5">
            <div className="login-box">
              <div className="img mb-4 text-center">
                <img src={logo} alt="logo" />
              </div>
              <div className="content">
                {success ? (
                  <div className="content-success">
                    <div className="tick-div">
                      <img src={tick} alt="resetpassword" />
                    </div>
                    <h4>Password Changed!</h4>
                    <span className="pwd-msg">
                      Your password has been changed successfully.
                    </span>
                    <div className="text-center">
                      <NavLink to="/login">
                        <Button
                          type="submit"
                          className="btn-primary button-width text-white"
                        >
                          Back to sign in
                        </Button>
                      </NavLink>
                    </div>
                  </div>
                ) : (
                  <>
                    <h4>Reset Password</h4>
                    <p>Please Enter your new password</p>
                    <div className="instruction-list">
                      <h4>Follow the instruction</h4>
                      <ul>
                        <li>Password must be at least 8 characters long.</li>
                        <li>
                          Password should contain combination of numbers ,mixture
                          lower and upper case alphabet and special character
                        </li>
                      </ul>
                    </div>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                    >
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>New Password</Form.Label>
                        <InputGroup className="toggle-password">
                          <Form.Control
                            type={newPasswordShown ? "text" : "password"}
                            placeholder="Enter Password"
                            name="new_password"
                            value={resetObject.new_password}
                            onChange={handleInput}
                            isInvalid={errorObject.new_password}
                            required
                          />
                          <InputGroup.Text onClick={toggleNewPasswordVisiblity}>
                            <i className={newPasswordShown ? "fa fa-eye-slash" : "fa fa-eye"} aria-hidden="true"></i>
                          </InputGroup.Text>
                          <Form.Control.Feedback type="invalid">
                            {errorObject.new_password}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Re-Enter Password</Form.Label>
                        <InputGroup className="toggle-password">
                          <Form.Control
                            name="reenter_password"
                            type={confirmPasswordShown ? "text" : "password"}
                            placeholder="Enter Password"
                            onChange={handleInput}
                            value={resetObject.reenter_password}
                            isInvalid={errorObject.reenter_password}
                            required
                          />
                          <InputGroup.Text onClick={toggleConfirmPasswordVisiblity}>
                            <i className={confirmPasswordShown ? "fa fa-eye-slash" : "fa fa-eye"} aria-hidden="true"></i>
                          </InputGroup.Text>
                          <Form.Control.Feedback type="invalid">
                            {errorObject.reenter_password}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                      <div className="text-center">
                        <Button
                          type="submit"
                          disabled={loading}
                          loading={loading}
                          className="btn-primary button-width text-white"
                        >
                          Reset Password
                        </Button>
                      </div>
                    </Form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
