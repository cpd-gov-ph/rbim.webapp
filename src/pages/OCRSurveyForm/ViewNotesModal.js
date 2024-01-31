import React from "react";
import FormModal from "../../components/FormModal";
import { Form, Row, Col } from "react-bootstrap";

const ViewNotesModal = ({ show, onClose, images }) => {

  console.log(images)
  return (
    <FormModal heading={'View OCR images'} show={show} onClose={onClose} size="lg" backdrop="static">
      <Form autoComplete="off">
        <div className="row">
          <div className="col-md-12">
            <Form.Group as={Row}  >
              <Col column sm={12}>
                {images.map((img_data)=>(
                  <>
                    <img src={img_data} className="img-fluid mb-2"alt="ocr images"/>
                  </>
                ))}
              </Col>
            </Form.Group>
          </div>
        </div>
      </Form>
    </FormModal>
  );
};

export default ViewNotesModal;
