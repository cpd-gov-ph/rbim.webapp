import { useEffect, useState } from "react";
import ServerSideTable from "../../components/ServerSideTable";
import { postData, userRole } from "../../api";
import Loader from "../../components/Loader";

import { NavLink, useNavigate } from "react-router-dom";
import Add from "./Add";
const DataReviewer = () => {
  let navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizeperPage] = useState(10);
  const [totalSize, setTotalSize] = useState(0);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modelOpen, setModalOpen] = useState(false);
  const [modalState, setModalState] = useState('');
  const [selectedRow, setSelectedRow] = useState({});
  const [isEdit,setIsEdit]=useState(false);
  const addShowModalClose = () => {
    setModalOpen(false);
    getReviewerList(page, sizePerPage, "");
    setLoading(true);
  };
  //View data reviewer page
  const ViewClick = (row) => {
    
    navigate("/data-reviewer/view/" + row.id);
  };
  // edit data reviewer
  const EditClick = (row) => {
    setModalOpen(true);
    setModalState("Edit Data Reviewer Details");
    setSelectedRow(row);
    setIsEdit(true)
  };
  // delete data reviewer
  // const DeleteClick = (row) => {
  //   console.log(row)
  // };
  const AddUserClick = () => {
    setModalOpen(true);
    setModalState("Add New Data Reviewer");
    setIsEdit(false)
  }
  const actionButton = (cell, row) => {
    return (
      <>
        <div>
          {userRole().role == "superadmin" ? (
            <div className="action-buttons">
              <button className="btn btn-link me-3" onClick={() => EditClick(row)}>
                <i className="fa fa-pencil"></i>
              </button>
              {/* <button className="btn btn-link me-3" onClick={() => DeleteClick(row)}>
                <i className="fa fa-solid fa-trash"></i>
              </button> */}
              <button className="btn btn-link " onClick={() => ViewClick(row)}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </button>
            </div>
          ) : ''}
          {userRole().role == "barangay" ? (
            <div className="action-buttons">
              <button className="btn btn-link " onClick={() => ViewClick(row)}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </button>
            </div>
          ) : ''}
        </div>
      </>
    );
  };

  const columns = [
    // {
    //   dataField: "sl.no",
    //   text: "S.no",
    //   headerStyle: { width: "8%", textAlign: "left" },
    //   style:{ textAlign: "left" },
    //   formatter: (cell, row, rowIndex, formatExtraData) => {
    //     return ((page-1)*sizePerPage)+(rowIndex+1);
    //   }
    // },
    {
      accessorKey: "first_name",
      header: "Date Reviewer Name",
      headerStyle: { width: "15%", textAlign: "left" },
      style: { textAlign: "left" }
    },
    {
      accessorKey: "barangay.first_name",
      header: "Assigned Barangay Name",
      headerStyle: { width: "20%", textAlign: "center" },
      style: { textAlign: "center" }
    },
    {
      accessorKey: "profile.official_number",
      header: "DR Code",
      headerStyle: { width: "17%", textAlign: "center" },
      style: { textAlign: "center" }
    },
    {
      accessorKey: "email",
      header: "Email ID",
      headerStyle: { width: "16%", textAlign: "left" },
      style: { textAlign: "left" }
    },
    {
      accessorKey: "action",
      header: "Action",
      headerStyle: { width: "16%", textAlign: "center" },
      formatter: actionButton,
    }
  ];
  const onFilter = (page, sizePerPage, search) => {
    setPage(page);
    setSizeperPage(sizePerPage);
    getReviewerList(page, sizePerPage, search);
  };

  const getReviewerList = async (page, sizePerPage, search) => {
    //setLoading(true);
    let obj = {
      page: page,
      page_size: sizePerPage,
      search: search
    };
    try {
      const getData = await postData("list-data-reviewer/", {}, obj);
      if (getData && getData.status === 1) {
        setUserList(getData.data);
        setTotalSize(getData.paginator.total_records);
        setLoading(false);
      }
    } catch (err) { }
  };

  useEffect(() => {
    getReviewerList(page, sizePerPage, "");
  }, []);

  return (
    <>
      {!loading && (
        <>
          <div>
            <h4 className="page-title">Data Reviewer</h4>
            <ServerSideTable
              columns={columns}
              data={userList}
              page={page}
              sizePerPage={sizePerPage}
              totalSize={totalSize}
              onFilter={onFilter}
              loading={loading}
              noDataMessage ='No user found'
            >
              <div className="action-group text-end">
                {userRole().role == 'superadmin' ? (
                  <button
                    className="btn f-14 fw-600 btn-sm text-white btn-primary add-btn-width"
                    onClick={AddUserClick}
                  >
                    Add
                  </button>
                ) : ''}
              </div>
            </ServerSideTable>

            {modelOpen && <Add header={modalState} is_edit={isEdit} selectedRow={selectedRow} show={modelOpen} onClose={addShowModalClose} />}


          </div>
        </>
      )}

      {loading && <Loader className="baranLoader" />}
    </>
  );
};

export default DataReviewer;
