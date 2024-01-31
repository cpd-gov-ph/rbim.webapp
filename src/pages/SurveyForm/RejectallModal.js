import React, { useState } from "react";
import Button from "../../components/Form/Button";
import FormModal from "../../components/FormModal";
import { Form, Row, Col } from "react-bootstrap";

const RejectallModal = ({ show, onClose, rejectAllReasons }) => {

  const [rejectAllReason, setRejectAllReason] = useState(null);
  const [validated, setValidated] = useState(false);

  const handleRejectAllReason = (e) => {
    setRejectAllReason(e.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (form.checkValidity() === true) {
      rejectAllReasons(rejectAllReason);
      onClose();
    }
  };

  return (
    <FormModal heading={'Notes for review'} show={show} onClose={onClose} size="lg" backdrop="static">
      <Form noValidate validated={validated} onSubmit={handleSubmit} autoComplete="off">
        <div className="row">
          <div className="col-md-12">
            <Form.Group as={Row} className="mb-3" >
              <Col column sm={12}>
                <Form.Control as="textarea"
                  name="description"
                  placeholder="Enter your Notes for review"
                  required
                  value={rejectAllReason}
                  rows={7}
                  onChange={(e) => handleRejectAllReason(e)}
                  className="address-view"
                />
                <Form.Control.Feedback type="invalid">
                  This Field is Required
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          </div>
        </div>
        <div className="text-end">
          <Button
            type="button"
            className="btn-default text-blacksix me-3 cancel-btn"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="btn-primary text-white"
          >
            Submit
          </Button>
        </div>
      </Form>
    </FormModal>
  );
};

export default RejectallModal;
