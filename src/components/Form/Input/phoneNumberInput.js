import React from "react";
import { Form } from "react-bootstrap";

const PhoneNumberInput = ({ 
    label,
    type,
    name,
    value,
    onChange,
    placeholder,
    size,
    errorMessage,
    isInvalid,
    min,
    max,
    disabled,
    addText,
    onBlur}) => {
  return (
    <Form.Group className={"form-group " + size} controlId={name}>
      <div className="d-grid">
      <Form.Label id={name} className="fw-700 f-14 text-black">{label}</Form.Label>
      {addText ? <label id={addText} className="fw-400 f-14 text-black mb-1">{addText}</label> : ""}
      </div>
      <div className={"input-group"}>
          
        <div class="input-group-prepend">
          {/* <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</button> */}
          <Form.Select className="form-select">
            <option>+91</option>
          </Form.Select>
        </div>
        <Form.Control
        required
        type={type}
        name={name}
        value={value}
        isInvalid={isInvalid}
        placeholder={placeholder}
        onChange={onChange}
        min={min}
        disabled={disabled}
        autoComplete="off"
        onBlur={onBlur}
      />
      <Form.Control.Feedback type="invalid">
        {errorMessage}
      </Form.Control.Feedback>
      </div>
      </Form.Group>
  );
}

export default PhoneNumberInput;
