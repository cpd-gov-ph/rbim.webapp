import React, { useState } from "react";
import { Form } from "react-bootstrap";
import "./style.scss";
import logo from "../../assets/images/logo.png";
import Button from "../../components/Form/Button";
import { useNavigate } from "react-router-dom";
import { postData } from "../../api";
import { toast } from "react-toastify";
const ForgotPassword = () => {
  let navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [forgotPasswordObject, setForgotPassword] = useState({
    email: ""
  });
  // check form error
  const checkFormErrors = () => {
    const { email, password } = forgotPasswordObject;
    const regex =/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const newErrors = {};
    // Form errors
    if (!email || email === "") newErrors.email = "Please enter your e-mail to proceed.";
      else if (email && regex.test(email) === false)
        newErrors.email = "You have entered a invalid e-mail address.";
      return newErrors;
    };
  const handleInput = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    delete errors[name];
    setForgotPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = checkFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      userForgotPassword();
    }
    // const form = event.currentTarget;
    // if (form.checkValidity() === false) {
    //   event.preventDefault();
    //   event.stopPropagation();
    // }
    // setValidated(true);
    // if (form.checkValidity() === true) {
    //   loginUser();
    // }
  };
  const userForgotPassword= async () => {
    setLoading(true);
    const res = await postData("forgot-password/", {}, forgotPasswordObject);
    if (res.status === 1) {
      setLoading(false);
      toast.success(res.message, { theme: "colored" });
      localStorage.setItem('forgotEmail',forgotPasswordObject.email);
      navigate("/code-verification");
    }  else {
      setLoading(false);
      toast.error(res.message, { theme: "colored" });
    }
  };

  const homepage =()=>{
    navigate("/login-selection");
  }

  return (
    <section className="login-section">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-5">
            <div className="login-box">
                <div className="img mb-4 text-center">
                  <img src={logo} alt="logo" className="cursor-pointer" onClick={homepage}/>
                </div>
              <div className="content">
                <p className="forgot-text">Forgot Your Password? Please enter the registered email address</p>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="fw-600">Email ID</Form.Label>
                    <Form.Control type="text" placeholder="Enter the registered email address"
                    name="email"
                    onChange={handleInput}
                    isInvalid={!!errors.email}
                    value={forgotPasswordObject.email} 
                    required />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <div className="text-center">
                    <Button   type="submit"
                    disabled={loading}
                    loading={loading}
                    className="btn-primary button-width text-white">
                      Send Code
                    </Button>
                  </div>
                </Form> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
