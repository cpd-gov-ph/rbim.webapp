import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import "./style.scss";

const ClientSideTable = ({ data, columns,sizePerPage }) => {
  const options = {
    // pageStartIndex: 0,
    sizePerPage: sizePerPage,
    hideSizePerPage: true,
    hidePageListOnlyOnePage: true,
  };
  return (
    <div>
      <ToolkitProvider keyField="_id" data={data} columns={columns} search>
        {(props) => (
          <div>
            <div className="row">
              <div className="col-md-12">
                <BootstrapTable
                  {...props.baseProps}
                  bordered={false}
                  noDataIndication={"No Data Found"}
                  headerWrapperClasses="thead-dark"
                  bodyClasses="tableBody"
                  wrapperClasses="table-responsive customScroll"
                  pagination={paginationFactory(options)}
                />
              </div>
            </div>
          </div>
        )}
      </ToolkitProvider>
    </div>
  );
};
export default ClientSideTable;
