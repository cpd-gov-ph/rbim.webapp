import { React } from "react";
import { Modal } from "react-bootstrap";
import CloseButton from "react-bootstrap/CloseButton";

//scss
import "./style.scss";

const FormModal = ({ show, onClose, heading, children, size, className, modalClassName, subHeading }) => {
  return (
    <div>
      <Modal show={show} centered onHide={onClose} size={size} className={modalClassName}>
        <Modal.Header>
          <div className="form-modal">
            <Modal.Title>{heading}</Modal.Title>
            {subHeading && <div className="form-modal-sub-title">{subHeading}</div>}
          </div>
          <CloseButton onClick={() => onClose(false)} />
        </Modal.Header>
        <Modal.Body className={className}>
          <div>{children}</div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FormModal;
