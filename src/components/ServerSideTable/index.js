/* import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import overlayFactory from "react-bootstrap-table2-overlay"; */
import { DebounceInput } from "react-debounce-input";
import Loader from "../Loader";
import "./style.scss";
import { useState } from "react";
import { Box } from '@chakra-ui/react';
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

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
  const tableInstance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
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
      </div>
      <Box w={tableInstance.getTotalSize()}>
          <table className="table table-striped" width={tableInstance.getTotalSize()}>
            <thead>
              {tableInstance.getHeaderGroups().map(headerGroup => 
                <tr className="tr" key={headerGroup.id}>
                  {headerGroup.headers.map(header => 
                    <th className="th" scope="col" width={header.getSize()} key={header.id}>
                      {header.column.columnDef.header}
                    </th>
                  )}
                </tr>
              )}
            </thead>
            <tbody>
              {
                tableInstance.getRowModel().rows.map(row =>
                  <tr className="tr" key={row.id}>
                    {row.getVisibleCells().map(cell => 
                      <td className="td" width={cell.column.getSize()} key={cell.id}>
                        {
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                            )
                        }
                      </td>
                    )}
                  </tr>
                )
              }
            </tbody>
          </table>
        </Box>
    </div>
  );
};
export default ServerSideTable;
