import { useState, useEffect } from "react";

import ServerSideTable from ".";
import IndeterminateCheckbox from "./IndeterminateCheckbox";

const CheckedTable = ({
  data,
  columns,
  children,
  loading,
  onPaginationChange,
  pageCount,
  pagination,
  onFilter,
  setRows,
}) => {
  const [newColumns, setNewColumns] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    setRows(rowSelection);
  }, [setRows, rowSelection])
  

  const selectColumns = [
    {
      id: "select",
      header: ({ table }) => (
        <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
      ),
      cell: ({ row }) => (
        <IndeterminateCheckbox
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
      ),
    },
  ];

  if (newColumns.length === 0) {
    setNewColumns(newColumns => selectColumns.concat(columns));
  } 

  return (
    <ServerSideTable 
      data={data}
      columns={newColumns}
      children={children}
      loading={loading}
      onPaginationChange={onPaginationChange}
      pageCount={pageCount}
      pagination={pagination}
      onFilter={onFilter}
      rowSelect={true}
      rowStates={rowSelection}
      onSelectRow={setRowSelection}
    >
    </ServerSideTable>
  );
};

export default CheckedTable;
