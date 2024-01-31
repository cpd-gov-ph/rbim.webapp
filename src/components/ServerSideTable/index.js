import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import overlayFactory from "react-bootstrap-table2-overlay";
import { DebounceInput } from "react-debounce-input";
import Loader from "../Loader";
import "./style.scss";
import { useState } from "react";

const ServerSideTable = ({
  data,
  columns,
  page,
  sizePerPage,
  totalSize,
  onFilter,
  loading,
  children,
  selectRow,
  noDataMessage
}) => {
  const [searchValue, setSearchValue] = useState("");
  const onTableChange = (type, { page, sizePerPage }) => {
    onFilter(page, sizePerPage, "");
  };

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
            <BootstrapTable
              remote
              keyField="id"
              data={data}
              columns={columns}
              bordered={false}
              noDataIndication={loading ? " " : noDataMessage}
              headerWrapperClasses="thead-dark"
              bodyClasses="tableBody"
              wrapperClasses="table-responsive customScroll"
              pagination={paginationFactory({
                page,
                sizePerPage,
                totalSize,
              })}
              // pagination={ paginationFactory(options) }
              onTableChange={onTableChange}
              loading={loading}
              overlay={overlayFactory({
                spinner: (
                  <div>
                    <Loader />
                  </div>
                ),
              })}
              selectRow={selectRow}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ServerSideTable;
