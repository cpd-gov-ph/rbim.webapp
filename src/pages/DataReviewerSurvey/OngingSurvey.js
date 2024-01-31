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
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import RecorrectionIcon from '../../assets/images/recorrection_icon.png';
const OngingSurvey = () => {
  let navigate = useNavigate();
  const [initLoading, setInitLoading] = useState(false);
  const [surveyList, setSurveyList] = useState([]);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizeperPage] = useState(10);
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    getSurveyList(page, sizePerPage, "",true);
  }, []);


  const getSurveyList = async (page, sizePerPage, search,loading) => {
    setInitLoading(loading);
    let obj = {
      page: page,
      page_size: sizePerPage,
      search: search ? search : "",
      status: "survey_review_started",
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
  const ViewSurveyClick=(row)=>{
    console.log(row);
    if(row.survey_type ==='ocr'){
      navigate("/ocrsurvey/"+row.id);
    }
    else{
      navigate("/survey/"+row.id);
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
        <div className="survey-date"><span> Date Started  - </span>{moment(row.survey_review_started_on).format("DD/MM/YYYY")} </div>
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
           <Badge pill bg="secondary" className="survey-status">  {row.survey_type ==='ocr' ? "OCR":row.survey_type  } </Badge>
      </>
    )
  }
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Recorrection entry
    </Tooltip>
  );

  const surveyRecorrectionAction = (cell, row) => {
    return (
      <>
        {
          row?.enable_recorrection_flag &&
          <div>
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <img src={RecorrectionIcon} alt="recorrection img" />
            </OverlayTrigger>
          </div>
        }
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
      dataField: "recorrection",
      headerStyle: { width: "10%", textAlign: "left" },
      style: { textAlign: "center" },
      formatter: surveyRecorrectionAction,
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

export default OngingSurvey;
