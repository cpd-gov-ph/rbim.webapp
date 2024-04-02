import { useReactTable, getPaginationRowModel, getCoreRowModel } from '@tanstack/react-table'; 
import { Box } from '@chakra-ui/react';

import "./style.scss";
import { chakra } from '@chakra-ui/react';

const ClientSideTable = ({ data, columns, sizePerPage }) => {
  const tableInstance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  console.log(tableInstance.getHeaderGroups());
  return <Box>
    <Box classname="table">

    </Box>
  </Box>
};
export default ClientSideTable;
