import React from "react";
import FormModal from "../../components/FormModal";

const ViewSelectOptionsModal = ({ show, onClose, selectedQuestion }) => {

  return (
    <FormModal heading={selectedQuestion?.title} show={show} onClose={onClose} size="md" backdrop="static" modalClassName="viewSelectOption">
      <>
        <div className="opt-title">Options :</div>
        <div className="view-select-option-list">
          {selectedQuestion?.answers?.map((inputField, index) => {
            return (
              <>
                {inputField?.options?.map((options, index) => {
                  return (
                    <div> {index + 1}. {options}  </div>
                  )
                })}
              </>
            )
          })}
        </div>
      </>
    </FormModal>
  );
};

export default ViewSelectOptionsModal;
