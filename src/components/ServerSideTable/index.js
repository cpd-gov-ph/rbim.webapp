import { DebounceInput } from "react-debounce-input";
import "./style.scss";
import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import Loader from "../Loader";
import { Pagination } from "./Pagination";

  /**
   * code implementation sourced from: 
   * https://medium.com/@aylo.srd/server-side-pagination-and-sorting-with-tanstack-table-and-react-bd493170125e
   * https://www.youtube.com/watch?v=CjqG277Hmgg
  */
  const ServerSideTable = ({
  data,
  columns,
  children,
  loading,
  onPaginationChange,
  pageCount,
  pagination,
  onFilter,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const tableInstance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onPaginationChange,
    state: { pagination },
    pageCount,
  });
  const searchChange = (e) => {
    setSearchValue(e.target.value);
    onFilter(1, pagination.pageSize, e.target.value);
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
              {loading ? (
                  <tr>
                  <td colspan="100%">
                    <Loader />
                  </td>
                </tr>
              ) : (
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
              )}
            </tbody>
          </table>
        </Box>
        <Pagination tableLib={tableInstance}/>
    </div>
  );
};
export default ServerSideTable;
