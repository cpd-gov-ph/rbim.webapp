import { userRole } from "../../api";

export const ActionButton = (cell, row, editAction, ViewAction) => {
    return (
      <>
        <div>
          {userRole().role === "superadmin" ? (
            <div className="action-buttons">
              <button className="btn btn-link me-3" onClick={() => editAction(row)}>
                <i className="fa fa-pencil"></i>
              </button>
              {/* <button className="btn btn-link me-3" onClick={() => DeleteClick(row)}>
                <i className="fa fa-solid fa-trash"></i>
              </button> */}
              <button className="btn btn-link " onClick={() => ViewAction(row)}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </button>
            </div>
          ) : ''}
          {userRole().role === "barangay" ? (
            <div className="action-buttons">
              <button className="btn btn-link " onClick={() => ViewAction(row)}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </button>
            </div>
          ) : ''}
        </div>
      </>
    );
  };