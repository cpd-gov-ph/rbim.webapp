import { Form } from "react-bootstrap";
import "./style.scss";
const Select = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  size,
  errorMessage,
  options,
  isInvalid,
  addText,
  onBlur,
}) => {
  return (
    <Form.Group controlId={name} className={"form-group " + size}>
      <div className="d-grid">
        <Form.Label id={name} className="fw-500 f-14 text-black">
          {label}
        </Form.Label>
        {addText ? (
          <label id={addText} className="fw-400 f-14 text-black mb-1">
            {addText}
          </label>
        ) : (
          ""
        )}
      </div>
      <Form.Select
        required
        name={name}
        value={value}
        placeholder={placeholder}
        isInvalid={isInvalid}
        onChange={onChange}
        autoComplete="off"
        onBlur={onBlur}
      >
        {/* <option value={""}>Select</option> */}
        {options && options.map((item, index) => (
          <option key={index} value={item.id}>
            {item.name}
          </option>
        ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {errorMessage}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default Select;
