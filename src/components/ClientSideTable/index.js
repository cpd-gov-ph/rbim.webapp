import { useReactTable, getPaginationRowModel, getCoreRowModel, flexRender } from '@tanstack/react-table'; 
import { Box } from '@chakra-ui/react';

import "./style.scss";

const ClientSideTable = ({ data, columns, sizePerPage }) => {
  const tableInstance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return <Box className="table">
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
  </Box>
};
export default ClientSideTable;
