import { 
  useReactTable, 
  getPaginationRowModel, 
  getCoreRowModel, 
  flexRender 
} from '@tanstack/react-table'; 
import { Box, Button, ButtonGroup, Icon, Text } from '@chakra-ui/react';
import "./style.scss";

const ClientSideTable = ({ data, columns, sizePerPage }) => {
  const tableInstance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <Box className="table">
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
      <br />
      <Text mb={2}>
        Page {tableInstance.getState().pagination.pageIndex + 1} of{" "}
        {tableInstance.getPageCount()}
      </Text>
      <ButtonGroup size="sm" isAttached variant="outline">
        <Button
          onClick={() => tableInstance.previousPage()}
          isDisabled={!tableInstance.getCanPreviousPage()}
        >
          {"<"}
        </Button>
        <Button
          onClick={() => tableInstance.nextPage()}
          isDisabled={!tableInstance.getCanNextPage()}
        >
          {">"}
        </Button>
      </ButtonGroup>
    </Box>
  );
};
export default ClientSideTable;
