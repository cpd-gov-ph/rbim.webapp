/* import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import overlayFactory from "react-bootstrap-table2-overlay"; */
import { DebounceInput } from "react-debounce-input";
import Loader from "../Loader";
import "./style.scss";
import { useState } from "react";
import { Box } from "@chakra-ui/react";

const CheckedTable = ({
  data,
  columns,
  page,
  sizePerPage,
  totalSize,
  onFilter,
  loading,
  children,
  selectRow,
  clickSelect,
  isAllSelect,
  getSelectedRow
}) => {
  const [searchValue, setSearchValue] = useState("");
  // const [selectRowId, setSelectRowId] = useState([]);
  //const refBtn = useRef(null); 

  const onTableChange = (type, { page, sizePerPage }) => {
    onFilter(page, sizePerPage, "");
  };
  // const rmvDuplicate = (arr) => {
  //   let uniqueArr = arr.filter((item, index) => {
  //     return arr.indexOf(item) === index;
  //   });
  //   return uniqueArr;
  // };
 


  const searchChange = (e) => {
    setSearchValue(e.target.value);
    onFilter(1, sizePerPage, e.target.value);
  };


  return (
    <div>
      <div className="server-side-table">
        <div className="search row p-3">
          <div className="col-md-3 p-0">
            <div className="form-group server-search mb-0">
              <span>
                <i className="fa fa-search"></i>
              </span>
              <DebounceInput
                className="form-control search"
                minLength={1}
                debounceTimeout={300}
                value={searchValue}
                onChange={searchChange}
                placeholder="Search"
              />
            </div>
          </div>
          <div className="col-md-9 p-0">{children}</div>
        </div>
        <div className="server-table row">
          <div className={`col-md-12 ${data.length === 0 ?"hide_pagination" : null}`}>
            <Box
              remote
              keyField="id"
              data={data}
              columns={columns}
              bordered={false}
              noDataIndication={loading ? " " : "No surveys assigned"}
              headerWrapperClasses="thead-dark"
              bodyClasses="tableBody"
              wrapperClasses="table-responsive customScroll"
              //ref={refBtn}
              // resetSelectRow={resetSelectRow}
              // pagination={ paginationFactory(options) }
              onTableChange={onTableChange}
              loading={loading}
              selectRow={selectRow}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckedTable;
