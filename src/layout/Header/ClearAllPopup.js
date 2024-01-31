import React from "react";
import Button from "../../components/Form/Button";
import FormModal from "../../components/FormModal";
const ClearAllPopup = ({ show, onClose, onClearAll }) => {
  return (
    <FormModal show={show} onClose={onClose} heading="Clear Notification">
      <div className="form-group">
        <p>Are you sure do you want to clear all the  notification ?</p>
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
          type="button"
          onClick={onClearAll}
          className="btn-primary text-white"
        >
          Yes
        </Button>
      </div>
    </FormModal>
  );
};

export default ClearAllPopup;
