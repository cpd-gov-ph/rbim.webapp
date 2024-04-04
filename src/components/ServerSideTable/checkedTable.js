import { DebounceInput } from "react-debounce-input";
import Loader from "../Loader";
import "./style.scss";
import { useState, } from "react";

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
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckedTable;
