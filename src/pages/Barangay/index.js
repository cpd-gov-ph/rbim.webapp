import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { postData } from "../../api";
import Add from "./Add";
import Loader from "../../components/Loader";
import Button from "../../components/Form/Button";
import ServerSideTable from "../../components/ServerSideTable";
import { usePagination } from "../../components/ServerSideTable/usePagination"
import { ActionButton } from "../../components/ServerSideTable/actionButtons"

const Barangay = () => {
  let navigate = useNavigate();
  const [addShowModal, setAddShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizeperPage] = useState(10);
  const [totalSize, setTotalSize] = useState(0);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState('');
  const [isEdit,setIsEdit]=useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const addClick = () => {
    setAddShowModal(true);
    setIsEdit(false)
    setModalState("Add New Barangay Official")
  };
  //View barangay page
  const viewClick = (row) => {
    navigate("/barangay/view/" + row.id);
  };
  // edit barangay
  const editClick = (row) => {
    setSelectedRow(row)
    setAddShowModal(true);
    setIsEdit(true)
    setModalState("Edit Barangay Official Details")

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
      id: "Barangay Official Name",
      headerStyle: { width: "15%", textAlign: "left" },
      style: { textAlign: "left" },
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      accessorKey: "location_info.name",
      header: "Assigned Barangay",
      id: "Assigned Barangay",
      headerStyle: { width: "15%", textAlign: "left" },
      style: { textAlign: "center" },
      cell: (props) => <p>{props.getValue()}</p>,
      //   formatter: PhoneNumber,
    },
    {
      accessorKey: "profile.official_number",
      header: "BO Code",
      id: "BO Code",
      headerStyle: { width: "20%", textAlign: "center" },
      style: { textAlign: "center" },
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      accessorKey: "email",
      header: "BO Email ID",
      id: "BO Email ID",
      headerStyle: { width: "29%", textAlign: "left" },
      style: { textAlign: "left" },
      cell: (props) => <p>{props.getValue()}</p>
    },
    {
      accessorKey: 'profile.phone_no',
      header: "BO Mobile Number",
      id : "BO Mobile Number",
      headerStyle: { width: "25%", textAlign: "left" },
      style: { textAlign: "left" },
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      accessorKey: "action",
      header: "Action",
      id: "Action",
      cell: (props) => ActionButton(
        props.row.original, 
        editClick, 
        viewClick,
        null,
        null
        ),
    }
  ];

  const { onPaginationChange, pagination } = usePagination();

  const getBarangayList = useCallback(async(search="") => {
    let params = {
      page: pagination.pageIndex + 1,
      page_size: pagination.pageSize,
      search: search
    };
    try {
      const getData = await postData("list-barangay/", {}, params);
      if (getData && getData.status === 1) {
        setUserList(getData.data);
        setTotalSize(Math.ceil(getData.paginator.total_records / params.page_size));
        setLoading(false);
      }
    } catch (err) { }
  }, [pagination]);

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
    getBarangayList("");
  }, [getBarangayList]);

  return (
    <React.Fragment>
      {!loading && (
        <div>
          <div>
            <h4 className="page-title"> Barangay Officials </h4>
            <ServerSideTable
              data={userList}
              columns={columns}
              loading={loading}
              onPaginationChange={onPaginationChange}
              pageCount={totalSize}
              pagination={pagination}
              onFilter={onFilter}
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
        </div>
      )}

      {loading && <Loader className="baranLoader"/> }
    </React.Fragment>
  );
};

export default Barangay;
