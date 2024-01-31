import React, { useState, useEffect } from "react";
import FormModal from "../../components/FormModal";
import { Form } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
const ViewTaskModal = ({ show, onClose, selectedRow }) => {

  const [formInputs, setFormInputs] = useState({
    task_no: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    setFormInputs(selectedRow)
  }, []);

  return (
    <FormModal heading={'View Assign Task'} show={show} onClose={onClose} size="lg" backdrop="static">
      <Form noValidate autoComplete="off">
        <div className="row">
          <div className="col-md-12">
            <Form.Group as={Row} className="mb-3" >
              <Form.Label column sm={4}>Task No</Form.Label>
              <Col column sm={8}>
                <Form.Control
                  type="text"
                  name="task_no"
                  required
                  value={formInputs.task_no}
                  disabled
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" >
              <Form.Label column sm={4}>Locality Name</Form.Label>
              <Col column sm={8}>
                <Form.Control
                  type="text"
                  name="title"
                  required
                  value={formInputs.title}
                  disabled
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" >
              <Form.Label column sm={4}>Notes</Form.Label>
              <Col column sm={8}>
                <Form.Control as="textarea"
                  name="description"
                  required
                  value={formInputs.description}
                  disabled
                  rows={7}
                  className="address-view"
                />
                <Form.Control.Feedback type="invalid">
                  This Field is Required
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          </div>
        </div>
      </Form>
    </FormModal>
  );
};

export default ViewTaskModal;
