import { Form } from "react-bootstrap";
import "./style.scss";
const Input = ({
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
  maxLength,
  disabled,
  addText,
  onBlur,
  autoComplete,
}) => {
  return (
    <Form.Group className={"form-group row " + size} controlId={name}>
      <div className="col-md-6">
        <Form.Label id={name} className="fw-500 f-14 text-black">
          {label}
        </Form.Label>
      </div>
      <div className="col-md-6 position">
        <Form.Control
          required
          type={type}
          name={name}
          value={value}
          isInvalid={isInvalid}
          placeholder={placeholder}
          onChange={onChange}
          min={min}
          maxLength={maxLength}
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
};

export default Input;
