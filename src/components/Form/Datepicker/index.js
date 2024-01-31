import { Form } from "react-bootstrap";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './style.scss';
const Datepicker = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  size,
  errorMessage,
  addText,
}) => {
  return (
    <Form.Group controlId={name} className={"form-group " + size}>
      <div className="d-grid">
        <Form.Label id={name} className="fw-500 f-14 text-black">
          {label}
        </Form.Label>
      </div>
      <div className="form-calendar">
        <DatePicker
          className="form-control"
          selected={value}
          onChange={onChange}
          // minDate={new Date()}
          maxDate={new Date()}
          // showDisabledMonthNavigation
          dateFormat="dd-MM-yyyy"
          placeholder={placeholder}
          onKeyDown={(e) => {
            e.preventDefault();
          }}
        />
        <span><i className="fa fa-calendar"></i></span>
      </div>
      <Form.Control.Feedback type="invalid">
        {errorMessage}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default Datepicker;
