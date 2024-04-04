import { useEffect, useState } from "react";
import ServerSideTable from "../../components/ServerSideTable";
import { postData, userRole } from "../../api";
import Loader from "../../components/Loader";

import { useNavigate } from "react-router-dom";
import Add from "./Add";

import { ActionButton } from "./actionButtons";
import { usePagination } from "../../components/ServerSideTable/usePagination"

const DataReviewer = () => {
  let navigate = useNavigate();
  const [totalSize, setTotalSize] = useState(0);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modelOpen, setModalOpen] = useState(false);
  const [modalState, setModalState] = useState('');
  const [selectedRow, setSelectedRow] = useState({});
  const [isEdit,setIsEdit]=useState(false);
  const addShowModalClose = () => {
    setModalOpen(false);
    getReviewerList(pagination.page, pagination.sizePerPage, "");
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

  const columns = [
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
      formatter: (props) => ActionButton(
        props.getValue().id,
        props.getValue().row, 
        EditClick, 
        ViewClick, 
        ),
    }
  ];
  const onFilter = (page, sizePerPage, search) => {
    getReviewerList(page, sizePerPage, search);
  };

  const { onPaginationChange, pagination } = usePagination();

  const getReviewerList = async (search) => {
    let params = {
      page: pagination.pageIndex + 1,
      page_size: pagination.pageSize,
      search: search
    };
    try {
      const getData = await postData("list-data-reviewer/", {}, params);
      if (getData && getData.status === 1) {
        setUserList(getData.data);
        setTotalSize(Math.ceil(getData.paginator.total_records / params.page_size));
        setLoading(false);
      }
    } catch (err) { }
  };

  useEffect(() => {
    getReviewerList("");
  });

  return (
    <>
      {!loading && (
        <>
          <div>
            <h4 className="page-title">Data Reviewer</h4>
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
                {userRole().role === 'superadmin' ? (
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
