import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaAngleRight } from 'react-icons/fa';
import moment from "moment";
import Badge from 'react-bootstrap/Badge';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { postData } from "../../api";
import Loader from "../../components/Loader";
import ServerSideTable from "../../components/ServerSideTable";
import { usePagination } from "../../components/ServerSideTable/usePagination";

import RecorrectionIcon from '../../assets/images/recorrection_icon.png';
import './style.scss'

const ApprovingSurvey = () => {
  let navigate = useNavigate();
  const [initLoading, setInitLoading] = useState(false);
  const [surveyList, setSurveyList] = useState([]);
  const [totalSize, setTotalSize] = useState(0);

  const { onPaginationChange, pagination } = usePagination();

  const getSurveyList = useCallback(async(search="") => {
    setInitLoading(true);
    let params = {
      page: pagination.pageIndex + 1,
      page_size: pagination.pageSize,
      search: search,
      status: "survey_verification_started",
    };
    try {
      const res = await postData("get-survey-list/", {}, params);
      if (res && res.status === 1) {
        setSurveyList(res.data)
        setTotalSize(Math.ceil(res.paginator.total_records / params.page_size));
        setInitLoading(false);
      } else if (res.status === 422) {
        setInitLoading(false);
      } else {
        setInitLoading(false);
        toast.error(res.message, { theme: "colored" });
      }
    } catch (err) { }
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
        <div className="survey-date"><span> Date Opened - </span>{moment(row.survey_verification_started_on).format("DD/MM/YYYY")} </div>
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
           <Badge pill bg="secondary" className="survey-status">  {row.survey_type ==='ocr' ? "OCR":row.survey_type  } </Badge>
      </div>
    )
  }

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Recorrection entry
    </Tooltip>
  );

  const surveyRecorrectionAction = (row) => {
    return (
      <div>
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

  const ViewSurveyClick = (row) => {
    if (row.survey_type === 'ocr') {
      navigate("/ocrsurvey/" + row.id);
    }
    else {
      navigate("/survey/" + row.id);
    }
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
      accessorKey: "recorrection",
      headerStyle: { width: "5%", textAlign: "left" },
      style: { textAlign: "center" },
      cell: (props) => surveyRecorrectionAction(
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

export default ApprovingSurvey;
