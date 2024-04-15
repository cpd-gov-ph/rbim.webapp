import { userRole } from "../../api";

export const ActionButton = (row, editAction, ViewAction, ViewTaskAction) => {
    return (
        <div >
          {userRole().role === "superadmin" ? (
            <div className="action-buttons">
              <button className="btn btn-link me-3" onClick={() => editAction(row)}>
                <i className="fa fa-pencil"></i>
              </button>
              {/* <button className="btn btn-link me-3"  onClick={() => DeleteClick(row)}>
                  <i className="fa fa-solid fa-trash"></i>
                </button> */}
              <button className="btn btn-link " onClick={() => ViewAction(row)}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </button>
            </div>
          ) : ''}
          {userRole().role === "barangay" ? (
            <div className="action-buttons">
              <button className="btn btn-link me-3" onClick={() => ViewAction(row)}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </button>
              <button className="btn btn-link" onClick={() => ViewTaskAction(row)}>
                <i className="fa fa-plus-square" aria-hidden="true"></i>
              </button>
            </div>
          ) : ''}
        </div>

    );
  };