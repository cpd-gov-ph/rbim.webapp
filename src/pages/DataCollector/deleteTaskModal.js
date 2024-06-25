import React from "react";
import Button from "../../components/Form/Button";
import FormModal from "../../components/FormModal";
import { deleteData } from '../../api';
import { toast } from "react-toastify";

const ViewTaskModal = ({ show, onClose, deleteTaskId, getListTask }) => {

  const deleteAssignedTask = async () => {
    let id = deleteTaskId;
    const res = await deleteData("delete-task/" + id + "/", {});
    if (res !== null && res.status === 1) {
      toast.success(res.message, { theme: "colored" });
      getListTask();
      onClose();
    }
    else {
      toast.error(res.message, { theme: "colored" });
    }
  }

  return (
    <FormModal show={show} onClose={onClose} heading="Alert">
      <div className="form-group">
        <p> Are you sure want to delete ?</p>
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
          onClick={deleteAssignedTask}
          className="btn-primary text-white"
        >
          Delete
        </Button>
      </div>
    </FormModal>
  );
};

export default ViewTaskModal;
