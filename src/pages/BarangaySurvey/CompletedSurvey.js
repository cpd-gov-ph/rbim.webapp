import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import Badge from 'react-bootstrap/Badge';
import { Col, Row } from "react-bootstrap";

import { postData, postDataDownload } from "../../api";
import Loader from "../../components/Loader";
import CheckedTable from "../../components/ServerSideTable/checkedTable";
import { usePagination } from "../../components/ServerSideTable/usePagination";
import Button from "../../components/Form/Button";

import './style.scss'
import { json } from "react-router-dom";

const CompletedSurvey = () => {
  const [initLoading, setInitLoading] = useState(false);
  const [surveyList, setSurveyList] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [selectRowId, setSelectRowId] = useState([])

  const { onPaginationChange, pagination } = usePagination();

  const getSurveyList = useCallback(async(search="") => {
    let params = {
      page: pagination.pageIndex + 1,
      page_size: pagination.pageSize,
      search: search,
      status: "survey_completed",
    };
    const res = await postData("get-survey-list/", {}, params);
    setInitLoading(false);
    if (res && res.status === 1) {
      setSelectRowId([]);
      setSurveyList(res.data)
      setTotalSize(Math.ceil(res.paginator.total_records / params.page_size));
    } else {
      toast.error(res.message, { theme: "colored" });
    }
  }, [pagination]);

  const surveyIDFormatter = (row) => {
    return (
      <div>
        <div className="survey-id">Survey ID - {row.survey_number}</div>
      </div>
    )
  }

  const surveyDateFormatter = (row) => {
    return (
      <div>
        <div className="survey-date"><span> Date Submitted - </span>{moment(row.survey_completed_on).format("DD/MM/YYYY")} </div>
      </div>
    )
  }

  const surveyCollectorIdFormatter = (row) => {
    return (
      <div>
        <div className="survey-date"><span> Data Reviewer ID  - </span> {row.data_reviewer.official_number} </div>
      </div>
    )
  }

  const surveyStatusFormatter = (row) => {
    return (
      <div>
        <Badge pill bg="secondary" className="survey-status">  {row.survey_type === 'ocr' ? "OCR" : row.survey_type} </Badge>
      </div>
    )
  }

  const columns = [
    {
      accessorKey: "survey_number",
      headerStyle: { width: "15%", textAlign: "left" },
      style: { textAlign: "left" },
      cell: (props) => surveyIDFormatter(
        props.row.original,
        ),
    },
    {
      accessorKey: "assigned_date",
      headerStyle: { width: "20%", textAlign: "left" },
      style: { textAlign: "left" },
      cell: (props) => surveyDateFormatter(
        props.row.original,
        ),
    },
    {
      accessorKey: "data_collector.official_number",
      headerStyle: { width: "20%", textAlign: "left" },
      style: { textAlign: "left" },
      cell: (props) => surveyCollectorIdFormatter(
        props.row.original,
        ),
    },
    {
      accessorKey: "survey_type",
      headerStyle: { width: "20%", textAlign: "left" },
      style: { textAlign: "left" },
      cell: (props) => surveyStatusFormatter(
        props.row.original,
        ),
    },
  ];

  const downloadReport = () => {
    let itemList = [];
    Object.entries(selectRowId).forEach(([key, val]) => itemList.push(key));
    
    let data = {
      survey_entry_ids: itemList,
      is_select_all: false
    }
    
    try {
      postDataDownload("barangay-completed-survey-reports/", {}, data).then((response) => {
        if (response.status && response.status !== 200) {
          response.json()?.then((res) => {
            toast.error(res.message, { theme: "colored" });
          })
        }
        else {
          var contentDisposition = response?.headers?.get('Content-Disposition').split(';')[1];
          response.blob()?.then((res)=>{
            const url = window.URL.createObjectURL(new Blob([res],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', contentDisposition.split('=')[1]);
            document.body.appendChild(link);
            link.click();
          }
        )}
      });
    } catch(e) {

    }
  }

  const onFilter = (search) => {
    getSurveyList(search);
  };

  useEffect(() => {
    getSurveyList("");
  }, [getSurveyList]);

  return (
    <div>
      {!initLoading && (
        <div className="reviewer-survey-list">
          <div className="complete-select-all">
            <Row>
              <Col md={10}>
                <div className="complete-report-down-btn">
                  <Button className="btn-primary button-width text-white" onClick={() => downloadReport()}>Download report</Button>
                </div>
              </Col>
            </Row>
          </div>

          <CheckedTable
            data={surveyList}
            columns={columns}
            loading={initLoading}
            onPaginationChange={onPaginationChange}
            pageCount={totalSize}
            pagination={pagination}
            onFilter={onFilter}
            noDataMessage='No surveys assigned'
            setRows={setSelectRowId}
            rowSelection={selectRowId}
          >
          </CheckedTable>
        </div>
      )}
      {initLoading && <Loader />}
    </div>
  );
};

export default CompletedSurvey;
