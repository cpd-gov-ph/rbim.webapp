import { userRole } from "../../api";

export const ActionButton = (row, editAction, viewAction, deleteAction, viewTaskAction) => {
    return (
        <div >
          {userRole().role === "superadmin" ? (
            <div className="action-buttons">
              <button className="btn btn-link me-3" onClick={() => editAction(row)}>
                <i className="fa fa-pencil"></i>
              </button>
              <button className="btn btn-link " onClick={() => viewAction(row)}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </button>
              { deleteAction != null ?
                <button className="btn btn-link me-3"  onClick={() => deleteAction(row)}>
                  <i className="fa fa-solid fa-trash"></i>
                </button>
                : ''
              }
            </div>
          ) : ''}
          {userRole().role === "barangay" ? (
            <div className="action-buttons">
              <button className="btn btn-link me-3" onClick={() => viewAction(row)}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </button>
              <button className="btn btn-link" onClick={() => viewTaskAction(row)}>
                <i className="fa fa-plus-square" aria-hidden="true"></i>
              </button>
            </div>
          ) : ''}
        </div>
    );
  };