import { Form } from "react-bootstrap";
import './style.scss'
const TextArea = ({
    label,
    type,
    name,
    value,
    onChange,
    placeholder,
    size,
    errorMessage,
    isInvalid
}) => {
    
    return (
        <Form.Group controlId={name} className={"form-group " + size}>
            <Form.Label className="fw-500 f-14 text-black">{label}</Form.Label>
            <Form.Control
                required
                placeholder={placeholder}
                type={"text"}
                as="textarea"
                name={name}
                value={value}
                isInvalid={isInvalid}
                className={"form-control"}
                onChange={onChange}
            />
            <Form.Control.Feedback type="invalid">
                {errorMessage}
            </Form.Control.Feedback>
        </Form.Group>
    );
};

export default TextArea;
