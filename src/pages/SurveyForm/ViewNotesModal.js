import React from "react";
import FormModal from "../../components/FormModal";
import { Form, Row, Col } from "react-bootstrap";

const ViewNotesModal = ({ show, onClose, notes }) => {


  return (
    <FormModal heading={'View Notes'} show={show} onClose={onClose} size="lg" backdrop="static">
      <Form autoComplete="off">
        <div className="row">
          <div className="col-md-12">
            <Form.Group as={Row} className="mb-3" >
              <Col column sm={12}>
                <Form.Control as="textarea"
                  name="description"
                  value={notes}
                  rows={7}
                  className="address-view"
                  disabled
                />
              </Col>
            </Form.Group>
          </div>
        </div>
      </Form>
    </FormModal>
  );
};

export default ViewNotesModal;
