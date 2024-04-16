import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { postData, userRole } from "../../api";
import Add from "./Add";
import Loader from "../../components/Loader";
import ServerSideTable from "../../components/ServerSideTable";
import { usePagination } from "../../components/ServerSideTable/usePagination"
import { ActionButton } from "../../components/ServerSideTable/actionButtons"

const DataCollector = () => {
  let navigate = useNavigate();
  const [addShowModal, setAddShowModal] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState('');
  const [selectedRow, setSelectedRow] = useState({});
  const [isEdit,setIsEdit]=useState(false);

  //View data collector page
  const viewClick = (row) => {
    navigate("/data-collector/view/" + row.id);
  };
  // edit data collector
  const editClick = (row) => {
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
  const viewTaskClick = (row) => {
    navigate("/data-collector/viewtask/" + row.id);
  }
  const columns = [
    {
      accessorKey: "first_name",
      header: "Data Collector Name",
      cell: (props) => <p>{props.getValue()}</p>,
      headerStyle: { width: "15%", textAlign: "left" },
      style: { textAlign: "left" }
    },
    {
      accessorKey: "barangay.first_name",
      header: "Assigned Barangay Name",
      cell: (props) => <p>{props.getValue()}</p>,
      headerStyle: { width: "20%", textAlign: "center" },
      style: { textAlign: "center" },
    },
    {
      accessorKey: "profile.official_number",
      header: "DC Code",
      cell: (props) => <p>{props.getValue()}</p>,
      headerStyle: { width: "17%", textAlign: "center" },
      style: { textAlign: "center" }
    },
    {
      accessorKey: "email",
      header: "Email ID",
      cell: (props) => <p>{props.getValue()}</p>,
      headerStyle: { width: "16%", textAlign: "left" },
      style: { textAlign: "left" }
    },
    {
      accessorKey: "action",
      header: "Action",
      headerStyle: { width: "16%", textAlign: "center" },
      cell: (props) => ActionButton(
        props.row.original, 
        editClick, 
        viewClick,
        null,
        viewTaskClick
        ),
    }
  ];

  const onFilter = (search) => {
    getCollectorList(search);
  };
  const addClick = () => {
    setAddShowModal(true);
    setModalState("Add New Data Collector");
    setIsEdit(false)
  };
  const addShowModalClose = () => {
    setAddShowModal(false);
    setLoading(true);
    getCollectorList("");
  };

  const { onPaginationChange, pagination } = usePagination();

  const getCollectorList = useCallback(async(search="") => {
    let params = {
      page: pagination.pageIndex + 1,
      page_size: pagination.pageSize,
      search: search
    };
    try {
      const getData = await postData("list-data-collector/", {}, params);
      if (getData && getData.status === 1) {
        setUserList(getData.data);
        setTotalSize(Math.ceil(getData.paginator.total_records / params.page_size));
        setLoading(false);
      }
    } catch (err) { }
  }, [pagination]);

  useEffect(() => {
    getCollectorList("");
  }, [getCollectorList]);
  
  return (
    <div>
      {!loading && (
          <div>
            <h4 className="page-title">Data Collector</h4>
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
                    onClick={addClick}
                  >
                    Add
                  </button>
                ) : ''}
              </div>
            </ServerSideTable>
            {addShowModal && <Add header={modalState} is_edit={isEdit} selectedRow={selectedRow} show={addShowModal} onClose={addShowModalClose} />}
          </div>
      )}
      {loading && <Loader className="baranLoader" />}
    </div>
  );
};

export default DataCollector;
