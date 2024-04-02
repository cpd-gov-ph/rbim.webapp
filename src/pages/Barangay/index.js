import React, { useState, useEffect } from "react";
import Button from "../../components/Form/Button";
import ServerSideTable from "../../components/ServerSideTable";
import Add from "./Add";
import { postData } from "../../api";
import "./style.scss";
import Loader from "../../components/Loader";
import { NavLink, useNavigate } from "react-router-dom";
const Barangay = () => {
  let navigate = useNavigate();
  const [addShowModal, setAddShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizeperPage] = useState(10);
  const [totalSize, setTotalSize] = useState(0);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState('');
  const [isEdit,setIsEdit]=useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const addClick = () => {
    setAddShowModal(true);
    setIsEdit(false)
    setModalState("Add New Barangay Official")
  };
  //View barangay page
  const ViewClick = (row) => {
    navigate("/barangay/view/" + row.id);
  };
  // edit barangay
  const EditClick = (row) => {
    setSelectedRow(row)
    setAddShowModal(true);
    setIsEdit(true)
    setModalState("Edit Barangay Official Details")

  };
  // delete barangay
  // const DeleteClick=(row)=>{
  //   console.log(row)
  // };
  const actionButton = (cell, row) => {
    return (
      <>
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
      </>
    );
  };
  const columns = [
    // {
    //   dataField: "sl.no",
    //   text: "S.no",
    //   formatter: (cell, row, rowIndex, formatExtraData) => {
    //     return  ((page-1)*sizePerPage)+(rowIndex+1);
    //   },
    //   headerStyle: { width: "8%", textAlign: "left" },
    //   style:{ textAlign: "left" }
    // },
    {
      accessorKey: "first_name",
      header: "Barangay Official Name",
      headerStyle: { width: "15%", textAlign: "left" },
      style: { textAlign: "left" }
    },
    {
      accessorKey: "location_info.name",
      header: "Assigned Barangay",
      headerStyle: { width: "15%", textAlign: "left" },
      style: { textAlign: "center" },
      //   formatter: PhoneNumber,
    },
    {
      accessorKey: "profile.official_number",
      header: "BO Code",
      headerStyle: { width: "20%", textAlign: "center" },
      style: { textAlign: "center" }
    },
    {
      accessorKey: "email",
      header: "BO Email ID",
      headerStyle: { width: "29%", textAlign: "left" },
      style: { textAlign: "left" }
    },
    {
      accessorKey: 'profile.phone_no',
      header: "BO Mobile Number",
      headerStyle: { width: "25%", textAlign: "left" },
      style: { textAlign: "left" }
    },
    {
      accessorKey: "action",
      header: "Action",
      formatter: actionButton,
    }
  ];
  const getBarangayList = async (page, sizePerPage, search) => {
 
    let obj = {
      page: page,
      page_size: sizePerPage,
      search: search
    };
    try {
      const getData = await postData("list-barangay/", {}, obj);
      if (getData && getData.status === 1) {
        setUserList(getData.data);
        setTotalSize(getData.paginator.total_records);
        setLoading(false);
      }
    } catch (err) { }
  };
  const onFilter = (page, sizePerPage, search) => {
    setPage(page);
    setSizeperPage(sizePerPage);
    getBarangayList(page, sizePerPage, search);
  };
  const addShowModalClose = () => {
    setAddShowModal(false);
    getBarangayList(page, sizePerPage, "");
    //setLoading(true);
  };
  useEffect(() => {
    getBarangayList(page, sizePerPage, "");
  }, []);
  return (
    <React.Fragment>
      {!loading && (
        <>
          <div>
            <h4 className="page-title"> Barangay Officials </h4>
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

                {/* <Link
            to="/users/inviteStatus"
            className="btn f-14 fw-600 btn-sm text-white btn-primary me-4"
          >
            Invite Status
          </Link> */}
                <Button
                  className="btn f-14 fw-600 btn-sm text-white btn-primary add-btn-width"
                  onClick={addClick}
                >
                  Add
                </Button>
              </div>
            </ServerSideTable>
          </div>
          {addShowModal && <Add header={modalState} is_edit={isEdit} selectedRow={selectedRow} show={addShowModal} onClose={addShowModalClose} />}
        </>
      )}

      {loading && <Loader className="baranLoader"/> }
    </React.Fragment>
  );
};

export default Barangay;
