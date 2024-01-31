import React, { useState } from "react";
import { Form } from "react-bootstrap";
import "./style.scss";
import logo from "../../assets/images/logo.png";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { postData } from "../../api";
import { toast } from "react-toastify";
const CodeVerification = () => {
  let navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [CodeObject, setCodeObject] = useState({
    reset_code: "",
  });

  const handleInput = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setCodeObject((prev) => ({
      ...prev,
      [name]: +value,
    }));
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
      VerifyCode();
    }
  };
  const VerifyCode = async () => {
    setLoading(true);
    CodeObject['email'] = localStorage.getItem('forgotEmail');
    const res = await postData("verify-code/", {}, CodeObject);
    if (res.status === 1) {
      setLoading(false);
      localStorage.setItem('reset_code', CodeObject.reset_code);
      navigate("/reset-password");
    } else {
      toast.error(res.message, { theme: "colored" });
      setLoading(false);
    }
  };
  // resend verification code
  const resendCode = async () => {
    const resendCodeObj = {
      email: localStorage.getItem('forgotEmail')
    }
    const res = await postData("resend-code/", {}, resendCodeObj);
    if (res.status == 1) {
      toast.success(res.message, { theme: "colored" });
    }
    else {
      toast.error(res.message, { theme: "colored" });
    }
  }
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
                <p>Enter the Verification Code sent to the registered email address</p>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Verification Code</Form.Label>
                    <Form.Control type="text" name="reset_code" value={CodeObject.reset_code} placeholder="Enter the Verification Code"
                      required onChange={handleInput} />
                    <Form.Control.Feedback type="invalid">
                      This field is required
                    </Form.Control.Feedback>
                  </Form.Group>
                  <div className="text-center">
                    <Button type="submit"
                      disabled={loading}
                      loading={loading}
                      className="btn-primary button-width text-white">
                      Verify
                    </Button>
                  </div>
                  <div className="text-center mt-4">
                    <a role="button" className="primary-color" onClick={() => resendCode()}>Resend verification code</a>
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

export default CodeVerification;
