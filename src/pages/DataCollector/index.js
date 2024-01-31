import { useEffect, useState } from "react";
import ServerSideTable from "../../components/ServerSideTable";
import { postData, userRole } from "../../api";
import Add from "./Add";
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
const DataCollector = () => {
  let navigate = useNavigate();
  const [addShowModal, setAddShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizeperPage] = useState(10);
  const [totalSize, setTotalSize] = useState(0);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState('');
  const [selectedRow, setSelectedRow] = useState({});
  const [isEdit,setIsEdit]=useState(false);

  const actionButton = (cell, row) => {
    return (
      <>
        <div >
          {userRole().role == "superadmin" ? (
            <div className="action-buttons">
              <button className="btn btn-link me-3" onClick={() => EditClick(row)}>
                <i className="fa fa-pencil"></i>
              </button>
              {/* <button className="btn btn-link me-3"  onClick={() => DeleteClick(row)}>
                  <i className="fa fa-solid fa-trash"></i>
                </button> */}
              <button className="btn btn-link " onClick={() => ViewClick(row)}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </button>
            </div>
          ) : ''}
          {userRole().role == "barangay" ? (
            <div className="action-buttons">
              <button className="btn btn-link me-3" onClick={() => ViewClick(row)}>
                <i className="fa fa-eye" aria-hidden="true"></i>
              </button>
              <button className="btn btn-link" onClick={() => ViewTaskClick(row)}>
                <i className="fa fa-plus-square" aria-hidden="true"></i>
              </button>
            </div>
          ) : ''}
        </div>
      </>
    );
  };

  //View data collector page
  const ViewClick = (row) => {
    navigate("/data-collector/view/" + row.id);
  };
  // edit data collector
  const EditClick = (row) => {
    setModalState("Edit Data Collector Details");
    setSelectedRow(row)
    setAddShowModal(true);
    setIsEdit(true)
  };
  // delete data collector
  // const DeleteClick=(row)=>{
  //   console.log(row)
  // };
  // view data collector task
  const ViewTaskClick = (row) => {
    navigate("/data-collector/viewtask/" + row.id);
  }
  const columns = [
    // {
    //   dataField: "sl.no",
    //   text: "S.no",
    //   headerStyle: { width: "8%", textAlign: "left" },
    //   style:{ textAlign: "left" },
    //   formatter: (cell, row, rowIndex, formatExtraData) => {
    //     return rowIndex + 1;
    //   }
    // },
    {
      dataField: "first_name",
      text: "Data Collector Name",
      headerStyle: { width: "15%", textAlign: "left" },
      style: { textAlign: "left" }
    },
    {
      dataField: "barangay.first_name",
      text: "Assigned Barangay Name",
      headerStyle: { width: "20%", textAlign: "center" },
      style: { textAlign: "center" },
    },
    {
      dataField: "profile.official_number",
      text: "DC Code",
      headerStyle: { width: "17%", textAlign: "center" },
      style: { textAlign: "center" }
    },
    {
      dataField: "email",
      text: "Email ID",
      headerStyle: { width: "16%", textAlign: "left" },
      style: { textAlign: "left" }
    },
    {
      dataField: "action",
      text: "Action",
      headerStyle: { width: "16%", textAlign: "center" },
      formatter: actionButton,
    }
  ];
  const onFilter = (page, sizePerPage, search) => {
    setPage(page);
    setSizeperPage(sizePerPage);
    getReviewerList(page, sizePerPage, search);
  };
  const addClick = () => {
    setAddShowModal(true);
    setModalState("Add New Data Collector");
    setIsEdit(false)
  };
  const addShowModalClose = () => {
    setAddShowModal(false);
    setLoading(true);
    getReviewerList(page, sizePerPage, "");
  };
  const getReviewerList = async (page, sizePerPage, search) => {
    //setLoading(true);
    let obj = {
      page: page,
      page_size: sizePerPage,
      search: search
    };
    try {
      const getData = await postData("list-data-collector/", {}, obj);
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
            <h4 className="page-title">Data Collector</h4>
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
                    onClick={addClick}
                  >
                    Add
                  </button>
                ) : ''}
              </div>
            </ServerSideTable>
            {addShowModal && <Add header={modalState} is_edit={isEdit} selectedRow={selectedRow} show={addShowModal} onClose={addShowModalClose} />}
          </div>
        </>
      )}
      {loading && <Loader className="baranLoader" />}
    </>
  );
};

export default DataCollector;
