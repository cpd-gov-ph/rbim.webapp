import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaAngleRight } from 'react-icons/fa';
import moment from "moment";
import Badge from 'react-bootstrap/Badge';

import { postData } from "../../api";
import Loader from "../../components/Loader";
import ServerSideTable from "../../components/ServerSideTable";
import { usePagination } from "../../components/ServerSideTable/usePagination";

import './style.scss'

const RejectedSurvey = () => {
  let navigate = useNavigate();
  const [initLoading, setInitLoading] = useState(false);
  const [surveyList, setSurveyList] = useState([]);
  const [totalSize, setTotalSize] = useState(0);

  const { onPaginationChange, pagination } = usePagination();

  const ViewSurveyClick = (row) => {
    console.log(row);
    if (row.survey_type === 'ocr') {
      navigate("/ocrsurvey/" + row.id);
    }
    else {
      navigate("/survey/" + row.id);
    }
  }

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
        <div className="survey-date"><span>Date Rejected  - </span>{moment(row.survey_rejected_on).format("DD/MM/YYYY")} </div>
      </div>
    )
  }

  const surveyCollectorIdFormatter = (row) => {
    return (
      <div>
              <div className="survey-date"><span>{row.data_collector?.official_number ?'Data Collector ID  - '+ row.data_collector?.official_number : '-'}</span> </div>
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
  const surveyAction = (row) => {
    return (
      <div>
        <FaAngleRight className="survey-action" onClick={() => ViewSurveyClick(row)}> </FaAngleRight>
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
    {
      accessorKey: "action",
      headerStyle: { width: "20%", textAlign: "left" },
      style: { textAlign: "center" },
      cell: (props) => surveyAction(
        props.row.original,
        ),
    }
  ];

  const getSurveyList = useCallback(async(search="") => {
    setInitLoading(true);
    let params = {
      page: pagination.pageIndex + 1,
      page_size: pagination.pageSize,
      search: search,
      status: "survey_rejected",
    };

    const res = await postData("get-survey-list/", {}, params);
    if (res && res.status === 1) {
      setTotalSize(Math.ceil(res.paginator.total_records / params.page_size));
      setSurveyList(res.data)
      setInitLoading(false);
    } else if (res.status === 422) {
      setInitLoading(false);
    } else {
      setInitLoading(false);
      toast.error(res.message, { theme: "colored" });
    }
  }, [pagination]);

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
          <ServerSideTable
            data={surveyList}
            columns={columns}
            loading={initLoading}
            onPaginationChange={onPaginationChange}
            pageCount={totalSize}
            pagination={pagination}
            onFilter={onFilter}
            noDataMessage='No surveys assigned'
          >
          </ServerSideTable>
        </div>
      )}
      {initLoading && <Loader />}
    </div>
  );
};

export default RejectedSurvey;
