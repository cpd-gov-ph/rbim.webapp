import { useEffect, useState } from "react";
import ServerSideTable from "../../components/ServerSideTable";
import { postData } from "../../api";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import './style.scss'
import moment from "moment";
import Badge from 'react-bootstrap/Badge';
import { FaAngleRight } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
const RejectedSurvey = () => {
  let navigate = useNavigate();
  const [initLoading, setInitLoading] = useState(false);
  const [surveyList, setSurveyList] = useState([]);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizeperPage] = useState(10);
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    getSurveyList(page, sizePerPage, "",true);
  }, []);

  const ViewSurveyClick = (row) => {
    console.log(row);
    if (row.survey_type === 'ocr') {
      navigate("/ocrsurvey/" + row.id);
    }
    else {
      navigate("/survey/" + row.id);
    }
  }
  const getSurveyList = async (page, sizePerPage, search,loading) => {
    setInitLoading(loading);
    let obj = {
      page: page,
      page_size: sizePerPage,
      search: search ? search : "",
      status: "survey_rejected",
    };

    const res = await postData("get-survey-list/", {}, obj);
    if (res.status === 1) {
      setTotalSize(res.paginator.total_records);
      setSurveyList(res.data)
      setInitLoading(false);
    } else if (res.status === 422) {
      setInitLoading(false);
    } else {
      setInitLoading(false);
      toast.error(res.message, { theme: "colored" });
    }
  }

  const surveyIDFormatter = (cell, row) => {
    return (
      <>
        <div className="survey-id">Survey ID - {row.survey_number}</div>
      </>
    )
  }

  const surveyDateFormatter = (cell, row) => {
    return (
      <>
        <div className="survey-date"><span>Date Rejected  - </span>{moment(row.survey_rejected_on).format("DD/MM/YYYY")} </div>
      </>
    )
  }

  const surveyCollectorIdFormatter = (cell, row) => {
    return (
      <>
              <div className="survey-date"><span>{row.data_collector?.official_number ?'Data Collector ID  - '+ row.data_collector?.official_number : '-'}</span> </div>
      </>
    )
  }

  const surveyStatusFormatter = (cell, row) => {
    return (
      <>
        <Badge pill bg="secondary" className="survey-status">  {row.survey_type === 'ocr' ? "OCR" : row.survey_type} </Badge>
      </>
    )
  }
  const surveyAction = (cell, row) => {
    return (
      <>
        <FaAngleRight className="survey-action" onClick={() => ViewSurveyClick(row)}> </FaAngleRight>
      </>
    )
  }

  const columns = [

    {
      dataField: "survey_number",
      headerStyle: { width: "15%", textAlign: "left" },
      style: { textAlign: "left" },
      formatter: surveyIDFormatter,
    },
    {
      dataField: "assigned_date",
      headerStyle: { width: "20%", textAlign: "left" },
      style: { textAlign: "left" },
      formatter: surveyDateFormatter,
    },
    {
      dataField: "data_collector.official_number",
      headerStyle: { width: "20%", textAlign: "left" },
      style: { textAlign: "left" },
      formatter: surveyCollectorIdFormatter,
    },
    {
      dataField: "survey_type",
      headerStyle: { width: "20%", textAlign: "left" },
      style: { textAlign: "left" },
      formatter: surveyStatusFormatter,
    },
    {
      dataField: "action",
      headerStyle: { width: "20%", textAlign: "left" },
      style: { textAlign: "center" },
      formatter: surveyAction,
    }
  ];

  const onFilter = (page, sizePerPage, search) => {
    setPage(page);
    setSizeperPage(sizePerPage);
    getSurveyList(page, sizePerPage, search,false);
  };

  return (
    <>
      {!initLoading && (
        <div className="reviewer-survey-list">
          <ServerSideTable
            columns={columns}
            data={surveyList}
            page={page}
            sizePerPage={sizePerPage}
            totalSize={totalSize}
            onFilter={onFilter}
            loading={initLoading}
            noDataMessage='No surveys assigned'
          >
          </ServerSideTable>
        </div>
      )}
      {initLoading && <Loader />}
    </>

  );
};

export default RejectedSurvey;
