import React, { useState } from "react";
import { Form } from "react-bootstrap";
import InputGroup from 'react-bootstrap/InputGroup';
import "./style.scss";
import logo from "../../assets/images/logo.png";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { postData } from "../../api";
import { toast } from "react-toastify";
const Login = () => {
  let navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [loginObject, setLoginObject] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const handleInput = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setLoginObject((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (!!errors[name])
      setErrors({
        ...errors,
        [name]: null,
      });
  };
  const findFormErrors = () => {
    const { email, password } = loginObject;
    const regex =/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const newErrors = {};
    // Form errors
    if (!email || email === "") newErrors.email = "Please enter your e-mail to proceed.";
      else if (email && regex.test(email) === false)
        newErrors.email = "You have entered a invalid e-mail address.";
      if (!password || password === "") newErrors.password = "Please enter your password to proceed.";
      return newErrors;
    };
  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      loginUser();
    }
  };
  const loginUser = async () => {
    setLoading(true);
    const res = await postData("login/", {}, loginObject);
    if (res.status === 1) {
      setLoading(false);
      localStorage.setItem("rbim_user", JSON.stringify(res.data));
      localStorage.setItem("rbim_token", res.data.token);
      localStorage.setItem("rbim_role", res.data.role);
      localStorage.setItem("term_privacy_status", res.data.is_agree);
      if (res.data.role == "superadmin") {
        navigate("/dashboard");
      } else if (res.data.role == "barangay") {
        navigate("/barangay-survey");
      } else if (res.data.role == "data_reviewer") {
        navigate("/data-reviewer-survey");
      }
    }  else {
      toast.error(res.message, { theme: "colored" });
      setLoading(false);
    }
  };

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
                <Form noValidate validated={validated} onSubmit={handleSubmit} autoComplete="off">
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email ID</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={loginObject.email}
                      onChange={handleInput}
                      isInvalid={!!errors.email}
                      name="email"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <InputGroup className="toggle-password">
                      <Form.Control
                        type={passwordShown ? "text" : "password"}
                        placeholder="Password"
                        value={loginObject.password}
                        onChange={handleInput}
                        isInvalid={!!errors.password}
                        name="password"
                        required
                      />
                      <InputGroup.Text  onClick={togglePasswordVisiblity}>
                        <i className={passwordShown ? "fa fa-eye-slash" : "fa fa-eye"} aria-hidden="true"></i>
                      </InputGroup.Text>
                      <Form.Control.Feedback type="invalid">
                      {errors.password}
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
                      Login
                    </Button>
                  </div>
                  <div className="text-center">
                    <p className="mt-4">
                      Forgot Your Password?{" "}
                      <NavLink to="/forgot-password"> Click Here </NavLink>
                    </p>
                    <NavLink to="/login-selection">
                      Back to Login Selection
                    </NavLink>
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

export default Login;
